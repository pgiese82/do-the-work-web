import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Book from '@/pages/Book';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBookings from '@/pages/AdminBookings';
import AdminAvailability from '@/pages/AdminAvailability';
import AdminDocuments from '@/pages/AdminDocuments';
import AdminUsers from '@/pages/AdminUsers';
import AdminCalendarPage from '@/pages/AdminCalendar';
import Settings from '@/pages/Settings';
import Documents from '@/pages/Documents';
import MyBookings from '@/components/dashboard/MyBookings';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { RealtimeProvider } from '@/components/RealtimeProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RealtimeProvider>
          <Router>
            <AppContent />
          </Router>
        </RealtimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (loading) {
      console.log('App is initializing, checking authentication state...');
    } else {
      console.log('Authentication state:', { isLoggedIn, user });
    }
  }, [isLoggedIn, user, loading]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      {!isAdminRoute && <SiteHeader />}
      
      <div className="flex flex-col min-h-screen">
        {isAdminRoute && isLoggedIn && user?.role === 'admin' && (
          <AdminHeader />
        )}

        <div className="flex-1 container pt-16 pb-12 md:pb-20">
          <div className={cn(
            "flex",
            isAdminRoute && "md:pl-64"
          )}>
            {isAdminRoute && isLoggedIn && user?.role === 'admin' && (
              <div className="fixed inset-y-0 z-50 flex h-full w-64 flex-col border-r bg-secondary md:hidden">
                <AdminSidebar />
              </div>
            )}
            
            <main className={cn(
              "flex-1",
              isAdminRoute && "w-full"
            )}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
                <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
                <Route path="/reset-password/:token" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />

                {/* Client Routes */}
                <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/dashboard/book" element={isLoggedIn ? <Book /> : <Navigate to="/login" />} />
                <Route path="/dashboard/bookings" element={isLoggedIn ? <MyBookings /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/documents" element={isLoggedIn ? <Documents /> : <Navigate to="/login" />} />

                {/* Admin Routes */}
                <Route path="/admin" element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/admin/dashboard" element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/admin/bookings" element={isLoggedIn && user?.role === 'admin' ? <AdminBookings /> : <Navigate to="/login" />} />
                <Route path="/admin/availability" element={isLoggedIn && user?.role === 'admin' ? <AdminAvailability /> : <Navigate to="/login" />} />
                <Route path="/admin/documents" element={isLoggedIn && user?.role === 'admin' ? <AdminDocuments /> : <Navigate to="/login" />} />
                <Route path="/admin/users" element={isLoggedIn && user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/login" />} />
                <Route path="/admin/calendar" element={isLoggedIn && user?.role === 'admin' ? <AdminCalendarPage /> : <Navigate to="/login" />} />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
              </Routes>
            </main>
          </div>
        </div>
        
        {!isAdminRoute && <SiteFooter />}
      </div>

      <Toaster />
    </>
  );
}

export default App;
