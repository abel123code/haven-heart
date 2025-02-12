import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Session from "../../../../../models/Session";
import Workshop from "../../../../../models/Workshop";

export async function PUT(request, { params }) {
  const workshopId = params.workshopId; // e.g. /api/workshops/123
  console.log('PUT request to edit workshop has been activated!!!!')
  try {
    await connectToDB();

    const body = await request.json();
    const { sessions = [], ...workshopData } = body;

    // 1) Update workshop fields (excluding sessions)
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        ...workshopData,
      },
      { new: true }
    );
    if (!updatedWorkshop) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
    }

    // 2) Create or update sessions
    const sessionIds = [];
    for (const sessionData of sessions) {
      if (sessionData._id) {
        // Existing session => update
        const updatedSession = await Session.findByIdAndUpdate(
          sessionData._id,
          {
            ...sessionData,
            workshopId,
          },
          { new: true }
        );
        if (updatedSession) {
          sessionIds.push(updatedSession._id);
        }
      } else {
        // New session => create
        const newSession = await Session.create({
          ...sessionData,
          workshopId,
        });
        sessionIds.push(newSession._id);
      }
    }

    // 3) Remove any sessions that are no longer in the form data
    //    (i.e., their IDs are missing from sessionIds)
    // const existingSessions = updatedWorkshop.sessions || [];
    // for (const sessId of existingSessions) {
    //   if (!sessionIds.includes(sessId.toString())) {
    //     // Session was removed in the form => delete it
    //     await Session.findByIdAndDelete(sessId);
    //   }
    // }

    // 4) Update the workshop's sessions array
    updatedWorkshop.sessions = sessionIds;
    await updatedWorkshop.save();

    return NextResponse.json({ workshop: updatedWorkshop }, { status: 200 });
  } catch (err) {
    console.error("Error updating workshop:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
