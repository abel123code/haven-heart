// /lib/schemas/preferencesSchema.js
import { z } from "zod";

export const preferencesSchema = z.object({
  focusAreas: z
    .array(z.string())
    .min(1, "Please select at least one focus area"),
  challenges: z
    .array(z.string())
    .min(1, "Please select at least one challenge"),
  otherChallenge: z.string().optional(),
  supportPreference: z
    .string()
    .min(1, "Please choose your support preference"),
  eventInterests: z
    .array(z.string())
    .min(1, "Please select at least one event interest"),
});
