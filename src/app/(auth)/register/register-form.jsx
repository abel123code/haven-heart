"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { registerSchema } from '@/lib/schemas/registerSchema'
import { useForm } from 'react-hook-form'
import { registerUserAction } from '@/app/actions/authActions'

const RegisterForm = () => {
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    // 3) Form submit callback
    async function onSubmit(formData) {
        setServerError("");
        setServerSuccess("");

        try {
        // Call the server action
        const res = await registerUserAction(formData);
        if (res?.success) {
            setServerSuccess("Registration successful. Please verify your email before login!");
        }
        } catch (error) {
            console.log('error:::', error)
            setServerError(error.message || "Something went wrong");
        }
    }


    return (
        <Card className="mx-auto max-w-xl">
            <CardHeader>
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
    
            <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                )}
                </div>
    
                {/* Email */}
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="me@example.com" {...register("email")} />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                </div>
    
                {/* Password */}
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
                </div>
    
                {/* Confirm Password */}
                <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
                </div>
    
                {/* Server Errors */}
                {serverError && <p className="text-red-500 text-sm text-left">{serverError}</p>}
    
                {/* Server Success */}
                {serverSuccess && <p className="text-green-600 text-sm text-left">{serverSuccess}</p>}
    
                <Button type="submit" className="w-full">Register</Button>
            </form>
            {/* Link to Register */}
            <div className="text-center text-sm mt-5">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
            </div>
            </CardContent>
        </Card>
    )
}

export default RegisterForm