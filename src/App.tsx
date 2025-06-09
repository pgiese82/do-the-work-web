
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminClients from "./pages/AdminClients";
import AdminDocuments from "./pages/AdminDocuments";
import AdminNotifications from "./pages/AdminNotifications";
import AdminCalendar from "./pages/AdminCalendar";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminWaitingList from "./pages/AdminWaitingList";
import AdminPricing from "./pages/AdminPricing";
import AdminAvailability from "./pages/AdminAvailability";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - no sidebar */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Client dashboard - with sidebar */}
            <Route
              path="/dashboard/*"
              element={
                <SidebarProvider>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </SidebarProvider>
              }
            />
            
            {/* Admin routes - all wrapped with AdminLayout */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminBookings />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminClients />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminDocuments />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminNotifications />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminCalendar />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminAuditLogs />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/waiting-list"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminWaitingList />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/pricing"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminPricing />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/availability"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AdminAvailability />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
