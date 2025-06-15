
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Index,
  MijnVerhaal,
  Auth,
  NotFound,
  SharedDocument,
  PrivacyPolicy,
  TermsAndConditions,
  AdminLogin,
  AdminDashboard,
  AdminBookings,
  AdminClients,
  AdminCalendar,
  AdminAvailability,
  AdminDocuments,
  AdminNotifications,
  AdminSettings,
  AdminAuditLogs,
  AdminCMS,
  AdminPricing,
  AdminWaitingList,
  AdminPayments,
  DashboardOverview,
  BookSession,
  BookingsOverview,
  Documents,
  ProfileSettings,
} from '@/config/routes';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/mijn-verhaal" element={<MijnVerhaal />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/privacybeleid" element={<PrivacyPolicy />} />
        <Route path="/algemene-voorwaarden" element={<TermsAndConditions />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardOverview />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/book" element={
          <ProtectedRoute>
            <DashboardLayout>
              <BookSession />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/bookings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <BookingsOverview />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/documents" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Documents />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfileSettings />
            </DashboardLayout>
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
    </Suspense>
  );
};
