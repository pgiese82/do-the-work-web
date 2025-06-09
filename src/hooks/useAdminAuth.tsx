
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
      console.log('🔍 Getting initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('📋 Initial session result:', { session: session?.user?.email, error });
        if (error) {
          console.error('❌ Error getting session:', error);
        }
        await updateAuthState(session);
      } catch (error) {
        console.error('💥 Error in getSession:', error);
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
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        // Use setTimeout to defer the async operation
        setTimeout(() => {
          updateAuthState(session);
        }, 0);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateAuthState = async (session: Session | null) => {
    console.log('⚡ Updating auth state for session:', session?.user?.email);
    
    if (session?.user) {
      try {
        console.log('👤 Checking user role for:', session.user.id);
        
        // Check if user exists in users table first
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log('📊 User data from database:', userData, 'Error:', error);

        if (error) {
          console.error('❌ Database error:', error.message);
          if (error.code === 'PGRST116') {
            console.log('🚫 User not found in users table');
          }
        }

        const isAdmin = !error && userData?.role === 'admin';
        console.log('🔐 Is admin:', isAdmin, 'Role:', userData?.role);

        setAuthState({
          user: session.user,
          session,
          isAdmin,
          loading: false,
        });
      } catch (error) {
        console.error('💥 Error checking admin status:', error);
        setAuthState({
          user: session.user,
          session,
          isAdmin: false,
          loading: false,
        });
      }
    } else {
      console.log('🚫 No session, setting user to null');
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        loading: false,
      });
    }
  };

  const signInAsAdmin = async (email: string, password: string) => {
    console.log('🚀 Attempting admin sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📝 Sign in response:', { 
        user: data.user?.email, 
        session: !!data.session, 
        error: error?.message 
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      console.log('✅ Sign in successful, auth state will update via listener');
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 Unexpected error during sign in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('👋 Signing out admin user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
    } catch (error) {
      console.error('💥 Error during sign out:', error);
    }
  };

  console.log('🎯 Current auth state:', {
    userEmail: authState.user?.email,
    isAdmin: authState.isAdmin,
    loading: authState.loading
  });

  return {
    ...authState,
    signInAsAdmin,
    signOut,
  };
};
