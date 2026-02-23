import { useForm } from 'react-hook-form';
import { zodResolver } from '@/zod/resolver';
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
  LoginSchema,
  loginSchema,
  ResetPasswordSchema,
  resetPasswordSchema,
  SignUpSchema,
  signUpSchema,
} from '../schemas/auth.schema';
import { useAuth } from './useAuth';

export function useAuthForm() {
  const {
    isLoading,
    errorMessage,
    signIn,
    signUp,
    forgotPassword,
    resetPassword,
  } = useAuth();

  // LOGIN
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  async function onSignIn(data: LoginSchema) {
    await signIn(data);
  }

  // SIGN UP
  const signUpForm = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  async function onSignUp(data: SignUpSchema) {
    await signUp(data);
  }

  // FORGOT PASSWORD
  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  async function onForgotPassword(data: ForgotPasswordSchema) {
    await forgotPassword(data);
  }

  // RESET PASSWORD
  const resetPasswordForm = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  async function onResetPassword(data: ResetPasswordSchema) {
    await resetPassword(data);
  }

  return {
    forgotPasswordForm,
    loginForm,
    resetPasswordForm,
    signUpForm,
    signIn: loginForm.handleSubmit(onSignIn),
    forgotPassword: forgotPasswordForm.handleSubmit(onForgotPassword),
    resetPassword: resetPasswordForm.handleSubmit(onResetPassword),
    signUp: signUpForm.handleSubmit(onSignUp),
    isLoading,
    errorMessage,
  };
}
