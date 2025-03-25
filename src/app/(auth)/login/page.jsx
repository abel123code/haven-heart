import { LoginForm } from "@/app/(auth)/login/login-form"

export const metadata = {
  title: 'Login | Haven HeartSG',
  description: 'Log in to your Haven HeartSG account to continue your mental health journey with personalized tools and community support.',
}

export default function LoginPage() {
  return (
    (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
    )
  );
}
