
import { lazy } from 'react';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const MijnVerhaal = lazy(() => import('@/pages/MijnVerhaal'));
const Auth = lazy(() => import('@/pages/Auth'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const SharedDocument = lazy(() => import('@/pages/SharedDocument'));

// Admin pages
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminBookings = lazy(() => import('@/pages/AdminBookings'));
const AdminClients = lazy(() => import('@/pages/AdminClients'));
const AdminCalendar = lazy(() => import('@/pages/AdminCalendar'));
const AdminAvailability = lazy(() => import('@/pages/AdminAvailability'));
const AdminDocuments = lazy(() => import('@/pages/AdminDocuments'));
const AdminNotifications = lazy(() => import('@/pages/AdminNotifications'));
const AdminSettings = lazy(() => import('@/pages/AdminSettings'));
const AdminAuditLogs = lazy(() => import('@/pages/AdminAuditLogs'));
const AdminCMS = lazy(() => import('@/pages/AdminCMS'));
const AdminPricing = lazy(() => import('@/pages/AdminPricing'));
const AdminWaitingList = lazy(() => import('@/pages/AdminWaitingList'));
const AdminPayments = lazy(() => import('@/pages/AdminPayments'));

// Dashboard components
const DashboardOverview = lazy(() => import('@/components/dashboard/DashboardOverview'));
const BookSession = lazy(() => import('@/components/dashboard/BookSession'));
const BookingsOverview = lazy(() => import('@/components/dashboard/BookingsOverview'));
const Documents = lazy(() => import('@/components/dashboard/Documents'));
const ProfileSettings = lazy(() => import('@/components/dashboard/ProfileSettings'));

export {
  Index,
  MijnVerhaal,
  Auth,
  NotFound,
  SharedDocument,
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
};
