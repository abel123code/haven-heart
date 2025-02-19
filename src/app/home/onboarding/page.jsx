import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserPreferenceForm from "./UserPreferanceForm";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  console.log('session data from onboarding:::::',session)
  // if (!session) {
  //   // Redirect to login if not authenticated
  //   console.log("No session, redirecting to /login");
  //   redirect("/login");
  // }

  const userEmail = session.user.email;
  

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <UserPreferenceForm userEmail={userEmail} />
    </main>
  );
}
