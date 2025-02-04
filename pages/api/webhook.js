// pages/api/stripe/webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';  // We need the raw request body
import connectToDB from '@/lib/mongodb'; 
import Purchase from '../../models/Purchase';
import Workshop from '../../models/Workshop';
import Session from '../../models/Session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Disable body parsing so Stripe can verify the signature properly
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhookHandler(req, res) {
  // Accept only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  // Stripe signature from the request headers
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Get the raw request body as a Buffer
    const rawBody = await buffer(req);

    // Verify the Stripe signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Error verifying Stripe webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Process the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const stripeSession = event.data.object; // The Checkout Session object
      await handleCheckoutSessionCompleted(stripeSession);
      break;
    }
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}

/* -------------------------------------------------------------
   Helpers
--------------------------------------------------------------*/

/**
 * Handle checkout.session.completed
 * 1) Create a new Purchase (if not already exists)
 * 2) Add user to Session's participants
 */
async function handleCheckoutSessionCompleted(stripeSession) {
  await connectToDB();

  const { workshopId, sessionId, userId } = stripeSession.metadata;
  const paymentIntentId = stripeSession.payment_intent;
  const amount = stripeSession.amount_total / 100; // Convert from cents
  const currency = stripeSession.currency;

  try {
    // Check if a purchase with this paymentIntentId already exists
    const existingPurchase = await Purchase.findOne({ paymentIntentId });
    if (!existingPurchase) {
      // Create a new purchase document
      await Purchase.create({
        user: userId,
        workshop: workshopId, // references the 'Workshop' model
        paymentIntentId,
        amount,
        currency,
        status: 'succeeded',
      });
      console.log(`User ${userId} purchased workshop ${workshopId}`);

      // Add user to Session's participants
      const sessionDoc = await Session.findById(sessionId);
      if (!sessionDoc) {
        console.error(`Session ${sessionId} not found`);
        return;
      }

      // Only push if user is not already a participant
      if (!sessionDoc.participants.includes(userId)) {
        sessionDoc.participants.push(userId);
        await sessionDoc.save();
        console.log(`User ${userId} added to participants of session ${sessionId}`);
      }
    } else {
      console.log(`Purchase with paymentIntentId ${paymentIntentId} already exists.`);
    }
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
  }
}
