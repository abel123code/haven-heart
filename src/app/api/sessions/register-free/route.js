import Session from "../../../../../models/Session";
import Purchase from "../../../../../models/Purchase";
import connectToDB from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
      // 1) Connect to DB
      await connectToDB();
  
      // 2) Get the NextAuth session for the current user
      //    This ensures the user is logged in
      const userSession = await getServerSession(authOptions);
      if (!userSession) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
      }
  
      // 3) Parse the JSON from the request body
      const { workshopId, sessionId } = await request.json();
      const userId = userSession.user.id;
  
      // 4) Find the session document in MongoDB
      const sessionDoc = await Session.findById(sessionId);
      if (!sessionDoc) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
  
      // 5) Check capacity
      const availability = sessionDoc.capacity - (sessionDoc.participants?.length || 0);
      if (availability <= 0) {
        return NextResponse.json({ error: "Session is fully booked" }, { status: 400 });
      }
  
      // 6) Prevent duplicate registration
      if (sessionDoc.participants.includes(userId)) {
        return NextResponse.json({ error: "User already registered" }, { status: 400 });
      }
  
      // 7) Create a "free purchase" record
      const randomString = Math.random().toString(36).slice(2, 8);
      const freePaymentIntentId = `FREE_${sessionId}_${randomString}`;

      const existingPurchase = await Purchase.findOne({
        user: userId,
        workshop: workshopId,
        paymentIntentId: freePaymentIntentId,
      });
  
      if (!existingPurchase) {
        await Purchase.create({
          user: userId,
          workshop: workshopId,
          paymentIntentId: freePaymentIntentId,
          amount: 0,
          currency: "SGD",
          status: "free",
        });
        console.log(`User ${userId} created a free purchase for workshop ${workshopId}`);
      } else {
        console.log(`Free purchase record already exists for user ${userId}.`);
      }
  
      // 8) Add the user to this session's participants array
      sessionDoc.participants.push(userId);
      await sessionDoc.save();
  
      console.log(`User ${userId} successfully registered for session ${sessionId}`);
  
      return NextResponse.json({ message: "Registration successful" }, { status: 200 });
    } catch (error) {
      console.error("Error registering for free session:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
