
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminCalendar from "./pages/AdminCalendar";
import AdminClients from "./pages/AdminClients";
import AdminPayments from "./pages/AdminPayments";
import AdminDocuments from "./pages/AdminDocuments";
import AdminCMS from "./pages/AdminCMS";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminAvailability from "./pages/AdminAvailability";
import AdminPricing from "./pages/AdminPricing";
import AdminWaitingList from "./pages/AdminWaitingList";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import { AdminMiddleware } from "./components/admin/AdminMiddleware";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminMiddleware>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="bookings" element={<AdminBookings />} />
                      <Route path="calendar" element={<AdminCalendar />} />
                      <Route path="clients" element={<AdminClients />} />
                      <Route path="payments" element={<AdminPayments />} />
                      <Route path="documents" element={<AdminDocuments />} />
                      <Route path="cms" element={<AdminCMS />} />
                      <Route path="notifications" element={<AdminNotifications />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="audit-logs" element={<AdminAuditLogs />} />
                      <Route path="availability" element={<AdminAvailability />} />
                      <Route path="pricing" element={<AdminPricing />} />
                      <Route path="waiting-list" element={<AdminWaitingList />} />
                    </Routes>
                  </AdminLayout>
                </AdminMiddleware>
              </AdminProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
