import { z } from 'zod';

export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = authSchema.pick({
  email: true,
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const signUpSchema = authSchema
  .pick({
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'confirm_password_not_match',
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const resetPasswordSchema = authSchema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'confirm_password_not_match',
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
