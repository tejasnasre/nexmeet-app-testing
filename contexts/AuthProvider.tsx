import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { AuthProviderProps } from '~/types/types';
import { ActivityIndicator } from 'react-native';
import { AuthContextType } from 'types/types';

const AuthContext = createContext({});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user, isAuthenticated: !!session?.user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
