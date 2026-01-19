import { useState } from "react";
import { supabase } from "@/supabase";
import * as Linking from "expo-linking";
import { ForgotPasswordSchema, LoginSchema, ResetPasswordSchema, SignUpSchema } from "../schemas/auth.schema";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function signIn(data: LoginSchema) {  
    if(!data.email || !data.password) return;
    
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false)
  }

  async function signUp(data: SignUpSchema) {  
    if(data.email === '' || data.password === '') {
      return;
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false)
  }

  async function forgotPassword(data: ForgotPasswordSchema) {  
    if(data.email === '') return;

    setIsLoading(true)

    
    const linkUrl = Linking.createURL('/auth/reset-password');

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: linkUrl,
    })

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false)
  }

  async function resetPassword(data: ResetPasswordSchema) {  
    if(data.password === '' || data.confirmPassword === '') {
      return;
    }

    setIsLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false)
  } 

  return {
    errorMessage,
    isLoading,
    forgotPassword,
    resetPassword,
    signIn,
    signUp,
  };
}