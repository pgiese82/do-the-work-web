
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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        await updateAuthState(session);
      } catch (error) {
        console.error('Error in getSession:', error);
        setAuthState({
          user: null,
          session: null,
          isAdmin: false,
          loading: false,
        });
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        await updateAuthState(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateAuthState = async (session: Session | null) => {
    console.log('Updating auth state for session:', session?.user?.email);
    
    if (session?.user) {
      try {
        // Check if user is admin
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log('User data from database:', userData, 'Error:', error);

        const isAdmin = !error && userData?.role === 'admin';
        console.log('Is admin:', isAdmin);

        setAuthState({
          user: session.user,
          session,
          isAdmin,
          loading: false,
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAuthState({
          user: session.user,
          session,
          isAdmin: false,
          loading: false,
        });
      }
    } else {
      console.log('No session, setting user to null');
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        loading: false,
      });
    }
  };

  const signInAsAdmin = async (email: string, password: string) => {
    console.log('Attempting admin sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful, checking admin role...');

      if (data.user) {
        // Verify admin role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        console.log('User role check:', userData, 'Error:', userError);

        if (userError || userData?.role !== 'admin') {
          console.log('User is not admin, signing out...');
          await supabase.auth.signOut();
          return { error: new Error('Insufficient permissions. Admin access required.') };
        }

        console.log('Admin verification successful');
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Signing out admin user');
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signInAsAdmin,
    signOut,
  };
};
