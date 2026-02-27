import { z } from 'zod';

export const hubSchema = z.object({
  name: z.string().min(3).max(50),
  familyNumber: z.string(),
});

export type HubSchema = z.infer<typeof hubSchema>;

export const familySchema = z.object({
  name: z.string().min(3).max(50),
  members: z.array(
    z.object({
      name: z.string().min(3).max(50),
      email: z.string().email(),
    })
  ),
});

export type FamilySchema = z.infer<typeof familySchema>;

export const nurseSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

export type NurseSchema = z.infer<typeof nurseSchema>;
