import connectToDB from "@/lib/mongodb";
import Workshop from "../../../../models/Workshop";
import DetailedCourseCard from "@/components/DetailedCourseCard";
import Session from "../../../../models/Session";

export default async function CourseDetailPage({ params }) {
  // 'params' is automatically provided by Next.js
  const { courseId } = await params;

  // Connect and fetch the specific course
  await connectToDB();


  let course;
  try {
    // Fetch the course by ID
    course = await Workshop.findById(courseId).lean();
    if (!course) {
      return <div className="p-4">Course not found.</div>;
    }

    // Convert _id and date fields to strings
    course._id = course._id.toString();
    course.createdAt = course.createdAt?.toISOString?.() || null;
    course.updatedAt = course.updatedAt?.toISOString?.() || null;

    // Fetch corresponding sessions for the course
    const sessions = await Session.find({ workshopId: courseId }).lean();

    // Format the sessions data
    course.sessions = sessions.map((session) => ({
      ...session,
      _id: session._id.toString(),
      workshopId: session.workshopId.toString(),
      date: session.date?.toISOString?.() || null,
      participants: session.participants?.map((participant) => participant.toString()) || []

    }));
  } catch (error) {
    console.error("Error fetching course details:", error);
    return <div className="p-4">Failed to load course details.</div>;
  }

  //console.log('course:::', course)

  // Render a client component with the course data
  return <DetailedCourseCard workshop={course} />;
}
