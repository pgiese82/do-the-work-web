
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeProvider } from '@/components/RealtimeProvider';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBookings from '@/pages/AdminBookings';
import AdminClients from '@/pages/AdminClients';
import AdminCalendar from '@/pages/AdminCalendar';
import AdminAvailability from '@/pages/AdminAvailability';
import AdminDocuments from '@/pages/AdminDocuments';
import AdminNotifications from '@/pages/AdminNotifications';
import AdminSettings from '@/pages/AdminSettings';
import AdminAuditLogs from '@/pages/AdminAuditLogs';
import AdminCMS from '@/pages/AdminCMS';
import AdminPricing from '@/pages/AdminPricing';
import AdminWaitingList from '@/pages/AdminWaitingList';
import AdminPayments from '@/pages/AdminPayments';
import SharedDocument from '@/pages/SharedDocument';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// AuthProvider component
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RealtimeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Client Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <AdminProtectedRoute>
                  <AdminBookings />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/clients" element={
                <AdminProtectedRoute>
                  <AdminClients />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/calendar" element={
                <AdminProtectedRoute>
                  <AdminCalendar />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/availability" element={
                <AdminProtectedRoute>
                  <AdminAvailability />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/documents" element={
                <AdminProtectedRoute>
                  <AdminDocuments />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <AdminProtectedRoute>
                  <AdminNotifications />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminProtectedRoute>
                  <AdminSettings />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/audit" element={
                <AdminProtectedRoute>
                  <AdminAuditLogs />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/cms" element={
                <AdminProtectedRoute>
                  <AdminCMS />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/pricing" element={
                <AdminProtectedRoute>
                  <AdminPricing />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/waiting-list" element={
                <AdminProtectedRoute>
                  <AdminWaitingList />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <AdminProtectedRoute>
                  <AdminPayments />
                </AdminProtectedRoute>
              } />
              
              {/* Shared Document Route */}
              <Route path="/shared/:token" element={<SharedDocument />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </RealtimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
