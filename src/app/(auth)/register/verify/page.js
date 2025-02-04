import { verifyEmail } from "@/app/actions/authActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function VerifyPage({ searchParams }) {
  const token = await searchParams.token

  let content
  if (!token) {
    content = {
      title: "Verification Failed",
      message: "Verification token is missing.",
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      textColor: "text-red-700",
    }
  } else {
    try {
      const result = await verifyEmail(token)
      content = {
        title: "Verification Successful",
        message: result.message,
        icon: <CheckCircle className="w-12 h-12 text-green-500" />,
        textColor: "text-green-700",
      }
    } catch (error) {
      content = {
        title: "Verification Failed",
        message: error.message,
        icon: <XCircle className="w-12 h-12 text-red-500" />,
        textColor: "text-red-700",
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <div className="rounded-full bg-white p-2 shadow-sm">{content.icon}</div>
          <CardTitle className="text-2xl font-bold text-gray-800">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className={`text-lg ${content.textColor}`}>{content.message}</p>
        </CardContent>
      </Card>
    </div>
  )
}


