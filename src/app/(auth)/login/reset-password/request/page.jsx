'use client';

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendResetPasswordEmailAction } from "@/app/actions/authActions";

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    try {
      const response = await sendResetPasswordEmailAction(email);
      setStatusMessage(response.message); // Display success message
    } catch (error) {
      setStatusMessage(error.message || 'An error occurred while sending the reset link.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
          </div>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetRequest}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {statusMessage && (
              <p className={`text-sm mt-2 ${statusMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                {statusMessage}
              </p>
            )}
            <Button type="submit" className="w-full mt-3">
            Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
