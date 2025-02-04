"use server";

import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";
import User from "../../../models/User";
import { registerSchema } from "@/lib/schemas/registerSchema";
import crypto from 'crypto'
import sgMail from "@sendgrid/mail";
import { preferencesSchema } from "@/lib/schemas/preferancesSchema";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function registerUserAction(formData) {

  const data = registerSchema.parse({
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  // Check password match
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Connect to MongoDB
  await connectToDB();

  // Check if user already exists by email
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Generate a verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = Date.now() + 3600000; // Token 

  // Create the user in the DB 
  const user = await User.create({
    username: data.fullName.toLowerCase().replace(/\s+/g, ""),
    email: data.email,
    password: hashedPassword, // Hash the password
    verificationToken,
    verificationTokenExpiry,
    isVerified: false, 
    role: "user",
    firstTimeLogin: true,
    preferences: {},
  });

  // Send verification email
  const verificationUrl = `${process.env.BASE_URL}/register/verify?token=${verificationToken}`;
  const emailContent = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Verify Your Email Address",
    html: `
      <h1>Thank you for joining Haven Hearts! We welcome you to our family</h1>
      <p>Welcome, ${user.username}!</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await sgMail.send(emailContent);

  return { success: true, message: "Verification email sent!" };
}

export async function verifyEmail(token) {
  if (!token) {
    throw new Error("Token is required");
  }
  //console.log('token:::', token)

  await connectToDB();

  // Find user by token
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  // Check token expiry
  if (user.verificationTokenExpiry < Date.now()) {
    throw new Error("Token has expired");
  }

  // Mark as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return { success: true, message: "Email successfully verified!" };
}

export async function resendVerificationEmailAction(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email address");
  }

  await connectToDB();

  const user = await User.findOne({ email });

  if (!user) {
    // Return generic success message for security reasons
    throw new Error(
      "If the email exists, a verification email will be sent."
    );
  }

  if (user.isVerified) {
    throw new Error("Email is already verified. Please log in.");
  }

  // Rate limiting: Allow at most 3 requests per hour and one request every 15 minutes
  const now = Date.now();

  if (user.lastVerificationRequest && now - user.lastVerificationRequest.getTime() < 15 * 60 * 1000) {
    throw new Error("You can only request a verification email every 15 minutes.");
  }

  if (user.verificationRequests >= 3) {
    const oneHourAgo = now - 60 * 60 * 1000;
    if (user.lastVerificationRequest && user.lastVerificationRequest.getTime() > oneHourAgo) {
      throw new Error("You have reached the maximum number of requests (3) for this hour. Please try again later.");
    } else {
      // Reset the count after 1 hour
      user.verificationRequests = 0;
    }
  }

  // Generate a new verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = now + 3600000; // 1 hour

  // Update user details
  user.verificationToken = verificationToken;
  user.verificationTokenExpiry = verificationTokenExpiry;
  user.lastVerificationRequest = new Date();
  user.verificationRequests += 1;

  await user.save();

  // Send verification email
  const verificationUrl = `${process.env.BASE_URL}/register/verify?token=${verificationToken}`;
  const emailContent = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Resend Verification Email",
    html: `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await sgMail.send(emailContent);

  return { success: true, message: "Verification email resent!" };
}

export async function sendResetPasswordEmailAction(email) {
  if (!email) throw new Error('Email is required.');

  await connectToDB();
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("If the email exists, a reset link will be sent.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  const resetUrl = `${process.env.BASE_URL}/login/reset-password?token=${resetToken}`;
  const emailContent = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await sgMail.send(emailContent);

  return { success: true, message: 'Password reset email sent successfully.' };
}

export async function resetPasswordAction(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required.');
  }

  await connectToDB();
  const user = await User.findOne({ resetToken: token });

  if (!user || user.resetTokenExpiry < Date.now()) {
    throw new Error('Invalid or expired token.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return { success: true, message: 'Password reset successfully.' };
}

export async function updatePreferencesAction(preferences, email) {
  // 2) Validate preferences data with Zod
  const parsedData = preferencesSchema.parse(preferences);

  // 3) Connect to DB and find the user
  await connectToDB();
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // 4) Update user document
  user.preferences = parsedData;
  user.firstTimeLogin = false;
  await user.save();

  return { success: true };
}

