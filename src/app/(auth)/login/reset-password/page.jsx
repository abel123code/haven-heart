'use client';

import { useState , useEffect } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordAction } from "@/app/actions/authActions";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword({ token }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [resetToken, setToken] = useState(null);

    const searchParams = useSearchParams();
    const router = useRouter()

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setStatusMessage("Invalid or missing token.");
        }
        }, [searchParams]
    );
    

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setStatusMessage(null);

        if (password !== confirmPassword) {
        setStatusMessage('Passwords do not match.');
        return;
        }

        // console.log('password":::', password)
        // console.log('token:::', resetToken)

        try {
            const response = await resetPasswordAction(resetToken, password);
            setStatusMessage(response.message); // Display success message
            router.push('/login')
        } catch (error) {
        setStatusMessage(error.message || 'An error occurred while resetting the password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
            <CardHeader>
            <div className="flex items-center space-x-2">
                <Lock className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-2xl font-semibold">Reset Your Password</CardTitle>
            </div>
            <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    New Password
                    </label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                    </label>
                    <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                Reset Password
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}
