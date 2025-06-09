
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

const AdminLogin = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated admin users to admin dashboard
    if (!loading && user && isAdmin) {
      console.log('🎯 Already authenticated admin, redirecting to dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If user is authenticated but not admin, redirect to client auth
  if (!loading && user && !isAdmin) {
    console.log('⚠️ User authenticated but not admin, redirecting to client auth');
    navigate('/auth', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-white mb-2">
                DO THE WORK
              </h1>
              <p className="text-gray-300">Admin Portal</p>
            </div>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
