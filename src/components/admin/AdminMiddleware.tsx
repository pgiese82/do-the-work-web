
import React from 'react';
import { useRoleCheck } from '@/hooks/useRoleCheck';

interface AdminMiddlewareProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
  fallback?: React.ReactNode;
}

export const AdminMiddleware = ({ 
  children, 
  requiredRole = 'admin',
  fallback = null 
}: AdminMiddlewareProps) => {
  const { user, isAdmin, loading } = useRoleCheck(requiredRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user || (requiredRole === 'admin' && !isAdmin)) {
    return fallback;
  }

  return <>{children}</>;
};
