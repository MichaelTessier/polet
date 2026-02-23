import { DsButton } from '@/components/ds/DsButton/DsButton';
import { supabase } from '@/supabase';
import React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function LogOutButton() {
  const { clearProfile } = useAuthContext();

  async function onSignOutButtonPress() {
    // TODO: add in useAuth
    clearProfile();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <DsButton
      label="Sign out"
      onPress={onSignOutButtonPress}
    />
  );
}
