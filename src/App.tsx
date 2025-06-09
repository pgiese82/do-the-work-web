
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
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
      <SidebarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminProtectedRoute>
                    <AdminBookings />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/clients"
                element={
                  <AdminProtectedRoute>
                    <AdminClients />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/documents"
                element={
                  <AdminProtectedRoute>
                    <AdminDocuments />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <AdminProtectedRoute>
                    <AdminNotifications />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/calendar"
                element={
                  <AdminProtectedRoute>
                    <AdminCalendar />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <AdminProtectedRoute>
                    <AdminAuditLogs />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/waiting-list"
                element={
                  <AdminProtectedRoute>
                    <AdminWaitingList />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/pricing"
                element={
                  <AdminProtectedRoute>
                    <AdminPricing />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/availability"
                element={
                  <AdminProtectedRoute>
                    <AdminAvailability />
                  </AdminProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
