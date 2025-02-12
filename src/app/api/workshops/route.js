import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary
import connectToDB from "@/lib/mongodb";
import Workshop from "../../../../models/Workshop";
import Session from "../../../../models/Session";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    // ✅ 1. Connect to MongoDB
    await connectToDB();

    // ✅ 2. Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // ✅ 3. Check if user is an admin
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser || dbUser.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // ✅ 4. Parse the request body
    const body = await req.json();
    const { sessions, ...workshopData } = body;

    // ✅ 5. Create the workshop (initially without sessions)
    const workshop = await Workshop.create({
      ...workshopData,
      sessions: [],
    });

    // ✅ 6. Create sessions and link them to the workshop
    const sessionDocs = [];
    for (let session of sessions) {
      const newSession = await Session.create({
        ...session,
        workshopId: workshop._id,
      });
      sessionDocs.push(newSession);
    }

    // ✅ 7. Update the workshop document with session IDs
    workshop.sessions = sessionDocs.map((session) => session._id);
    await workshop.save();

    return NextResponse.json(
      { workshop, sessions: sessionDocs },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workshop:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
