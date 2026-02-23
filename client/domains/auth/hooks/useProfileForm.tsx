import { useForm } from 'react-hook-form';
import { profileSchema, ProfileSchema } from '../schemas/profile.schema';
import { useAuthContext } from './useAuthContext';
import { zodResolver } from '@/zod/resolver';
import { useEffect } from 'react';

export function useProfileForm() {
  const { profile } = useAuthContext();
  const { updateProfile, isLoading } = useAuthContext();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
      });
    }
  }, [profile, form]);

  async function onSubmit(data: ProfileSchema) {
    if (!profile?.id && !data) return;

    await updateProfile(profile?.id, data);
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
  };
}
