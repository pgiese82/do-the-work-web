
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
            
            {/* Admin routes - with sidebar */}
            <Route
              path="/admin/dashboard"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminBookings />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminClients />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminDocuments />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminNotifications />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminCalendar />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminAuditLogs />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/waiting-list"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminWaitingList />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/pricing"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminPricing />
                  </AdminProtectedRoute>
                </SidebarProvider>
              }
            />
            <Route
              path="/admin/availability"
              element={
                <SidebarProvider>
                  <AdminProtectedRoute>
                    <AdminAvailability />
                  </AdminProtectedRoute>
                </SidebarProvider>
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
