import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, "Name should be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    // If your user schema requires a role, you could optionally pass "role" from the form
    // role: z.enum(["admin", "user"]).optional(),
  });