import { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export type AuthData = {
  session?: Session | null;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  updateProfile: (id: string, updatedProfile: Partial<any>) => Promise<boolean>;
  clearProfile: () => void;
  fetchProfile: (id: string) => Promise<void>;
};

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  updateProfile: async () => false,
  clearProfile: async () => {},
  fetchProfile: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);
