
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';

export const useRoleCheck = (requiredRole: 'admin' | 'client' = 'admin', redirectTo: string = '/login') => {
  const { user, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('🚫 No user found, redirecting to login');
        navigate(redirectTo, { replace: true });
        return;
      }

      if (requiredRole === 'admin' && !isAdmin) {
        console.log('🚫 User is not admin, redirecting');
        navigate('/auth', { replace: true });
        return;
      }

      console.log('✅ Role check passed');
    }
  }, [user, isAdmin, loading, navigate, requiredRole, redirectTo]);

  return { user, isAdmin, loading };
};
