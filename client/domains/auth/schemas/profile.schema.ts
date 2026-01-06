import { z } from 'zod';

export const profileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional()
    .or(z.literal('')),
  full_name: z
    .string()
    .min(2)
    .max(50)
    .optional()
    .or(z.literal('')),
})


export type ProfileSchema = z.infer<typeof profileSchema>;