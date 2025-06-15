import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
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

export const useBookingTrends = (days: number = 7) => {
  return useQuery({
    queryKey: ['booking-trends', days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          date_time,
          services:service_id (price)
        `)
        .gte('date_time', startDate.toISOString())
        .order('date_time');

      if (error) throw error;

      // Group by date and calculate stats
      const trends = data?.reduce((acc, booking) => {
        const date = booking.date_time.split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, count: 0, revenue: 0 };
        }
        acc[date].count++;
        acc[date].revenue += Number(booking.services?.price || 0);
        return acc;
      }, {} as Record<string, { date: string; count: number; revenue: number }>);

      return Object.values(trends || {});
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useServicePopularity = () => {
  return useQuery({
    queryKey: ['service-popularity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          service_id,
          services:service_id (name, price)
        `)
        .not('service_id', 'is', null);

      if (error) throw error;

      // Group by service and calculate stats
      const popularity = data?.reduce((acc, booking) => {
        const serviceId = booking.service_id;
        if (!acc[serviceId]) {
          acc[serviceId] = {
            service_name: booking.services?.name || 'Unknown',
            booking_count: 0,
            total_revenue: 0
          };
        }
        acc[serviceId].booking_count++;
        acc[serviceId].total_revenue += Number(booking.services?.price || 0);
        return acc;
      }, {} as Record<string, { service_name: string; booking_count: number; total_revenue: number }>);

      return Object.values(popularity || {}).sort((a, b) => b.booking_count - a.booking_count);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const activities = [];

      // Get recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          date_time,
          users:user_id (name),
          services:service_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      bookings?.forEach(booking => {
        activities.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          message: `Nieuwe boeking van ${booking.users?.name} voor ${booking.services?.name}`,
          timestamp: booking.created_at,
        });
      });

      // Get recent payments
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          id,
          created_at,
          amount,
          bookings:booking_id (
            users:user_id (name)
          )
        `)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(10);

      payments?.forEach(payment => {
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          message: `Betaling ontvangen van ${payment.bookings?.users?.name}`,
          timestamp: payment.created_at,
          amount: Number(payment.amount),
        });
      });

      // Sort all activities by timestamp
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
};
