import { useForm } from 'react-hook-form';
import { useProfile } from './useProfile';
import { profileSchema, ProfileSchema } from '../schemas/profile.schema';
import { useAuthContext } from './useAuthContext';
import { zodResolver } from '@/zod/resolver';

export function useProfileForm () {
  const { profile } = useAuthContext()
  const { updateProfile, isLoading } = useProfile();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
    },
    mode: 'onChange',
    }
  );

  async function onSubmit (data: ProfileSchema) {
    if(!profile?.id) return

    await updateProfile(profile?.id, data);
  }


  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
  }
}