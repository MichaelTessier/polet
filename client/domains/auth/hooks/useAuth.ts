import { useState } from "react";
import { supabase } from "@/services/supabase";
import * as Linking from "expo-linking";

export function useAuth() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState('');

  async function signIn() {  
    if(email === '') {
      setIsEmailInvalid(true);
      return;
    }

    if(password === '') {
      setIsPasswordInvalid(true);
      return;
    }

    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);  
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setHasError(error.message);
    }

    setLoading(false)
  }

  async function signUp() {  
    if(email === '') {
      setIsEmailInvalid(true);
      return;
    }

    if(password === '') {
      setIsPasswordInvalid(true);
      return;
    }

    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);  
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setHasError(error.message);
    }

    setLoading(false)
  }

  async function forgotPassword() {  
    if(email === '') {
      setIsEmailInvalid(true);
      return;
    }

    setIsEmailInvalid(false);  
    setLoading(true)

    
    console.log("🚀 ~ forgotPassword ~ window.location.origin:", window.location.origin)
    const linkUrl = Linking.createURL('/auth/reset-password');
    console.log("🚀 ~ forgotPassword ~ linkUrl:", linkUrl)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: linkUrl,
    })

    if (error) {
      setHasError(error.message);
    }

    setLoading(false)
  }

  async function resetPassword() {  
    if(password === '') {
      setIsPasswordInvalid(true);
      return;
    }

    setIsPasswordInvalid(false);  
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setHasError(error.message);
    }

    setLoading(false)
  } 

  return {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    isEmailInvalid,
    setIsEmailInvalid,
    isPasswordInvalid,
    setIsPasswordInvalid,
    loading,
    hasError,
    signIn,
    signUp,
    forgotPassword,
    resetPassword,
  };
}