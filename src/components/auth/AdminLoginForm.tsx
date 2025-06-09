
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, Info } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInAsAdmin, isAdmin, user } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  // Handle navigation after successful admin login
  useEffect(() => {
    if (!loading && user && isAdmin) {
      console.log('🎯 Admin authenticated, redirecting to dashboard');
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard!",
      });
      navigate('/admin/dashboard');
    } else if (!loading && user && !isAdmin) {
      console.log('⚠️ User authenticated but not admin');
      setError('Access denied. This account does not have admin privileges. Please contact the administrator to upgrade your account.');
    }
  }, [user, isAdmin, loading, navigate, toast]);

  const onSubmit = async (data: AdminLoginFormData) => {
    console.log('🔐 Form submitted for:', data.email);
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInAsAdmin(data.email, data.password);

      if (error) {
        console.error('❌ Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('permissions')) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      console.log('✅ Login successful, waiting for auth state update...');
      // Don't set loading to false here - let the useEffect handle navigation
      
    } catch (error: any) {
      console.error('💥 Unexpected error:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
        <p className="text-gray-300">Enter your admin credentials to continue</p>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-300">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>First time?</strong> Register with any email and password, then contact the administrator to upgrade your account to admin privileges.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Admin Email
        </Label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          placeholder="admin@example.com"
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-red-500"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <div className="relative">
          <Input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your admin password"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-red-500 pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold"
      >
        {loading ? 'Signing in...' : 'Sign In as Admin'}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="text-red-400 hover:text-red-300 text-sm underline"
          disabled={loading}
        >
          Back to Client Login
        </button>
        <p className="text-gray-400 text-xs">
          Need admin access? Contact the administrator to upgrade your account.
        </p>
      </div>
    </form>
  );
};

export default AdminLoginForm;
