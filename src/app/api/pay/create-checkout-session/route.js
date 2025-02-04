import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDB from '@/lib/mongodb';
import Workshop from '../../../../../models/Workshop';
import User from '../../../../../models/User';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  //console.log(session)

  if (!session) {
    return NextResponse.redirect('/login');
  }

  // This will give you at least email from the logged-in user:
  const { email } = session.user || {};
  if (!email) {
    return NextResponse.json({ error: 'User email not found.' }, { status: 400 });
  }

  const { sessionId, priceId } = await request.json();

  if (!sessionId || !priceId) {
    return NextResponse.json({ error: 'Invalid request data.' }, { status: 400 });
  }

  await connectToDB();

  try {
    // Make sure user exists in DB and get userId
    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found in DB.' }, { status: 404 });
    }

    const userId = user._id.toString();
    // Find the workshop and course ID
    const workshop = await Workshop.findOne({ sessions: sessionId });
    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found.' }, { status: 404 });
    }

    const workshopId = workshop._id.toString();

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paynow'],
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/home/upcoming?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/home`,
      customer_email: session.user.email,
      metadata: {
        workshopId,
        sessionId,
        userId
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Error creating checkout session:', err.message, err.stack);
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    );
  }
}
