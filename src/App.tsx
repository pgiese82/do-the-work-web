import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { RealtimeProvider } from '@/components/RealtimeProvider';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import SharedDocument from '@/pages/SharedDocument';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBookings from '@/pages/AdminBookings';
import AdminCalendar from '@/pages/AdminCalendar';
import AdminClients from '@/pages/AdminClients';
import AdminPayments from '@/pages/AdminPayments';
import AdminDocuments from '@/pages/AdminDocuments';
import AdminNotifications from '@/pages/AdminNotifications';
import AdminCMS from '@/pages/AdminCMS';
import AdminAuditLogs from '@/pages/AdminAuditLogs';
import AdminSettings from '@/pages/AdminSettings';
import AdminPricing from '@/pages/AdminPricing';
import AdminWaitingList from '@/pages/AdminWaitingList';
import AdminAvailability from '@/pages/AdminAvailability';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';

function App() {
  return (
    <RealtimeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Dashboard routes with nested structure */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/book" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/bookings" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/documents" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={<AdminLogin />} />
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
          <Route path="/admin/calendar" element={
            <AdminProtectedRoute>
              <AdminCalendar />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <AdminProtectedRoute>
              <AdminClients />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <AdminProtectedRoute>
              <AdminPayments />
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
          <Route path="/admin/cms" element={
            <AdminProtectedRoute>
              <AdminCMS />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <AdminProtectedRoute>
              <AdminAuditLogs />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminProtectedRoute>
              <AdminSettings />
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
          <Route path="/admin/availability" element={
            <AdminProtectedRoute>
              <AdminAvailability />
            </AdminProtectedRoute>
          } />
          
          <Route path="/shared-document/:id" element={<SharedDocument />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </RealtimeProvider>
  );
}

export default App;
