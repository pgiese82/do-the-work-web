
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRealtimeData } from './useAdminRealtimeData';

interface AdminDashboardStats {
  todayBookings: number;
  todayRevenue: number;
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  averageSessionValue: number;
  completedSessionsToday: number;
  pendingBookings: number;
}

export const useAdminDashboardStats = () => {
  const updateTrigger = useAdminRealtimeData();

  return useQuery({
    queryKey: ['admin-dashboard-stats', updateTrigger],
    queryFn: async (): Promise<AdminDashboardStats> => {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      console.log('🔍 Fetching admin dashboard stats...');

      const [
        todayBookingsResult,
        todayRevenueResult,
        totalClientsResult,
        activeClientsResult,
        monthlyRevenueResult,
        completedTodayResult,
        pendingBookingsResult
      ] = await Promise.all([
        // Today's bookings count
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .gte('date_time', today)
          .lt('date_time', `${today}T23:59:59.999Z`),

        // Today's revenue from completed sessions
        supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .gte('created_at', today)
          .lt('created_at', `${today}T23:59:59.999Z`),

        // Total clients
        supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('role', 'client'),

        // Active clients (with bookings in last 30 days)
        supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('role', 'client')
          .gte('last_session_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

        // Monthly revenue
        supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid')
          .gte('created_at', startOfMonth),

        // Completed sessions today
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('status', 'completed')
          .gte('date_time', today)
          .lt('date_time', `${today}T23:59:59.999Z`),

        // Pending bookings
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('status', 'pending')
      ]);

      const todayRevenue = todayRevenueResult.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const monthlyRevenue = monthlyRevenueResult.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const averageSessionValue = monthlyRevenueResult.data?.length ? monthlyRevenue / monthlyRevenueResult.data.length : 0;

      const stats = {
        todayBookings: todayBookingsResult.count || 0,
        todayRevenue,
        totalClients: totalClientsResult.count || 0,
        activeClients: activeClientsResult.count || 0,
        monthlyRevenue,
        averageSessionValue,
        completedSessionsToday: completedTodayResult.count || 0,
        pendingBookings: pendingBookingsResult.count || 0,
      };

      console.log('📈 Admin dashboard stats:', stats);
      return stats;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const useRealtimeUpdates = () => {
  return useAdminRealtimeData();
};
