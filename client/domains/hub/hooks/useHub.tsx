import { supabase } from '@/supabase';
import { FamilyInsert, HubInsert } from '@/supabase/types';
import { useState } from 'react';

export function useHub() {
  // const [hub, setHub] = useState<Hub | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function checkUserHasHub() {
    setIsLoading(true);

    const { data, error } = await supabase.rpc('user_has_hub');

    console.log('user_has_hub rpc data:', data);
  }

  async function createHub(hubName: HubInsert['name']) {
    const { data, error } = await supabase.rpc('create_user_hub', {
      hub_name: hubName,
    });
    console.log('🚀 ~ createHub ~ data:', data);

    if (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
      return null;
    }

    return data;
  }
  // TODO: remove PARTIAL -> add created_by
  async function createFamily(family: Partial<FamilyInsert>) {
    if (!family.name || !family.number_of_children) {
      console.error('Family name and number of children are required');
      return null;
    }

    const { data, error } = await supabase.rpc('create_family', {
      family_name: family.name,
      family_number_of_children: family.number_of_children,
    });

    console.log('🚀 ~ createFamily ~ data:', data);

    if (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
      return null;
    }

    return data;
  }

  async function inviteToFamily(targetFamilyId: string, inviteeEmail: string) {
    const { data, error } = await supabase.rpc('invite_to_family', {
      target_family_id: targetFamilyId,
      invitee_email: inviteeEmail,
    });

    console.log('🚀 ~ inviteToFamily ~ data:', data);

    if (error) {
      console.error('Error inviting to family:', error);
      setIsLoading(false);
      return null;
    }

    return data;
  }

  return {
    // hub,
    isLoading,
    checkUserHasHub,
    createHub,
    createFamily,
    inviteToFamily,
  };
}
