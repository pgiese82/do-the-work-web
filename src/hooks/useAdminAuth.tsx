
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    session: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await updateAuthState(session);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await updateAuthState(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateAuthState = async (session: Session | null) => {
    if (session?.user) {
      // Check if user is admin
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const isAdmin = !error && userData?.role === 'admin';

      setAuthState({
        user: session.user,
        session,
        isAdmin,
        loading: false,
      });
    } else {
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        loading: false,
      });
    }
  };

  const signInAsAdmin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      // Verify admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError || userData?.role !== 'admin') {
        await supabase.auth.signOut();
        return { error: new Error('Insufficient permissions. Admin access required.') };
      }
    }

    return { data, error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signInAsAdmin,
    signOut,
  };
};
