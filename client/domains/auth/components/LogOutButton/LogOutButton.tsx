import { DsButton } from '@/components/ds/ds-button/DsButton'
import { supabase } from '@/supabase'
import React from 'react'

async function onSignOutButtonPress() {
  // TODO: add in useAuth 
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
  }
}
export default function LogOutButton() {
  return <DsButton label="Sign out" onPress={onSignOutButtonPress} />
}