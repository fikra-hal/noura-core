import { z } from 'zod';

const DEFAULT_TIMEZONE = 'Asia/Dubai';

export const ContactProfileSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  timezone: z.string().default(DEFAULT_TIMEZONE),
  preferences: z.object({
    morningOnly: z.boolean().optional(),
    avoidDays: z.array(z.string()).optional()
  }).default({}),
  notes: z.string().optional()
});

export type ContactProfile = z.infer<typeof ContactProfileSchema>;
