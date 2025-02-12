import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDB from "@/lib/mongodb";
import Workshop from "../../../../../../models/Workshop";
import Session from "../../../../../../models/Session";
import EditWorkshopForm from "./editWorkshopForm";

export default async function EditWorkshopPage({ params }) {
  // 1) Admin Check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/"); 
  }
  //console.log('params id:::', params.workshopId)

  // 2) Fetch Workshop + sessions from DB
  await connectToDB();
  const workshop = await Workshop.findById(params.workshopId).populate("sessions");

  if (!workshop) {
    return <p>Workshop not found</p>;
  }

  // 3) Convert Mongoose doc to plain JS object
  const workshopData = JSON.parse(JSON.stringify(workshop));

  // 4) Render the Edit form
  return (
    <EditWorkshopForm workshop={workshopData} />
  );
}
