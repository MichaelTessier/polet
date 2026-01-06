import { supabase } from "@/supabase";
import { Profile } from "@/supabase/types";
import { useState } from "react";

export function useProfile() {

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function fetchProfile (id: Profile['id']) {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      setIsLoading(false)
      return
    }

    setProfile(data)

    setIsLoading(false)
  }

  async function updateProfile (id: Profile['id'], updatedProfile: Partial<Profile>) {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      setIsLoading(false)
      return
    }
    
    setProfile(data)
    setIsLoading(false)
  }

  return { profile, isLoading, fetchProfile, updateProfile };
}