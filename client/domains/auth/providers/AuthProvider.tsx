import { AuthContext } from '../hooks/useAuthContext';
import { supabase } from '@/supabase';
import type { Session } from '@supabase/supabase-js';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | undefined | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    profile,
    fetchProfile,
    isLoading: isProfileLoading,
    updateProfile,
    clearProfile,
  } = useProfile();

  useEffect(() => {
    const fetchSession = async () => {
      console.log('🚀 ~ fetchSession ~ fetchSession:');
      setIsLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      }

      setSession(session);
      setIsLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🚀 ~ onAuthStateChange ~ onAuthStateChange:');

      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchProfile(session.user.id);
  }, [session, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading: isLoading || isProfileLoading,
        profile,
        isLoggedIn: session?.user !== undefined,
        updateProfile,
        fetchProfile,
        clearProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
