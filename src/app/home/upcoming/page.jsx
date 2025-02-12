// app/page.js (Server Component)
export const dynamic = 'force-dynamic';
import connectToDB from "@/lib/mongodb";
import Workshop from "../../../../models/Workshop";
import ClientCoursesPage from "../ClientCoursesPage";
import Session from "../../../../models/Session";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";  
import { TriangleAlert } from "lucide-react";
import UpcomingCoursesPage from "./UpcomingCoursesPage";


export default async function HomePage() {
  // Connect to the database
  await connectToDB();
  let userWorkshops = []; // Initialize userWorkshops here

  try {
    // Get session data from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return <div>Please log in to view your workshops.</div>;
    }

    const userId = new ObjectId(session.user.id); // Convert userId to ObjectId

    // Fetch all workshops
    const workshops = await Workshop.find({}).lean();

    // Fetch sessions for each workshop and filter by userId
    for (const workshop of workshops) {
      // Fetch sessions for the current workshop
      const sessions = await Session.find({ workshopId: workshop._id }).lean();

      // Filter sessions where the user has signed up
      const userSessions = sessions
        .filter((session) =>
          session.participants?.some((participant) =>
            participant.equals(userId) // Compare ObjectId correctly
          )
        )
        .map((session) => ({
          ...session,
          _id: session._id.toString(),
          workshopId: session.workshopId.toString(),
          date: session.date?.toISOString?.() || null,
          participants: session.participants?.map((participant) => participant.toString()) || [],
        }));

      // Add each session as a distinct entry in the userWorkshops array
      userSessions.forEach((session) => {
        userWorkshops.push({
          workshopId: workshop._id.toString(),
          workshopTitle: workshop.title,
          workshopOrganiser: workshop.organiser,
          workshopShortDescription: workshop.shortDescription,
          workshopFullDescription: workshop.fullDescription,
          workshopPrice: workshop.price,
          workshopImage: workshop.image,
          workshopDuration: workshop.duration,
          workshopCategory: workshop.category,
          session,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching workshops or sessions:", error);
    return <div>Failed to load workshops. Please try again later.</div>;
  }

  // Pass the processed data to the Client Component
  return <UpcomingCoursesPage courses={userWorkshops} />;
}
