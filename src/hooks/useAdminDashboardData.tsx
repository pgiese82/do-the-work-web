
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  pendingBookings: number;
  completedSessionsToday: number;
  averageSessionValue: number;
}

interface BookingTrend {
  date: string;
  count: number;
  revenue: number;
}

interface ServicePopularity {
  service_name: string;
  booking_count: number;
  total_revenue: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'payment' | 'client';
  message: string;
  timestamp: string;
  user_name?: string;
  amount?: number;
}

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const today = new Date().toISOString().split('T')[0];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      // Get today's bookings
      const { data: todayBookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status')
        .gte('date_time', today)
        .lt('date_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      if (bookingsError) throw bookingsError;

      // Get today's revenue
      const { data: todayPaymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('status', 'paid')
        .gte('created_at', today)
        .lt('created_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      if (paymentsError) throw paymentsError;

      // Get monthly revenue
      const { data: monthlyPaymentsData, error: monthlyPaymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', monthStart);

      if (monthlyPaymentsError) throw monthlyPaymentsError;

      // Get client stats
      const { data: clientsData, error: clientsError } = await supabase
        .from('users')
        .select('client_status, created_at')
        .eq('role', 'client');

      if (clientsError) throw clientsError;

      const todayBookings = todayBookingsData?.length || 0;
      const pendingBookings = todayBookingsData?.filter(b => b.status === 'pending').length || 0;
      const completedSessionsToday = todayBookingsData?.filter(b => b.status === 'completed').length || 0;
      const todayRevenue = todayPaymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const monthlyRevenue = monthlyPaymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const totalClients = clientsData?.length || 0;
      const activeClients = clientsData?.filter(c => c.client_status === 'active').length || 0;
      const averageSessionValue = todayRevenue > 0 && completedSessionsToday > 0 ? todayRevenue / completedSessionsToday : 0;

      return {
        todayBookings,
        todayRevenue,
        totalClients,
        activeClients,
        monthlyRevenue,
        pendingBookings,
        completedSessionsToday,
        averageSessionValue,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookingTrends = (days: number = 7) => {
  return useQuery({
    queryKey: ['booking-trends', days],
    queryFn: async (): Promise<BookingTrend[]> => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          date_time,
          payments (amount, status)
        `)
        .gte('date_time', startDate.toISOString())
        .lte('date_time', endDate.toISOString())
        .order('date_time', { ascending: true });

      if (error) throw error;

      // Group by date
      const groupedData: { [key: string]: { count: number; revenue: number } } = {};
      
      data?.forEach(booking => {
        const date = booking.date_time.split('T')[0];
        if (!groupedData[date]) {
          groupedData[date] = { count: 0, revenue: 0 };
        }
        groupedData[date].count++;
        
        // Add revenue from paid payments
        if (booking.payments && Array.isArray(booking.payments)) {
          booking.payments.forEach((payment: any) => {
            if (payment.status === 'paid') {
              groupedData[date].revenue += payment.amount || 0;
            }
          });
        }
      });

      return Object.entries(groupedData).map(([date, data]) => ({
        date,
        count: data.count,
        revenue: data.revenue,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useServicePopularity = () => {
  return useQuery({
    queryKey: ['service-popularity'],
    queryFn: async (): Promise<ServicePopularity[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          services (name),
          payments (amount, status)
        `)
        .not('services', 'is', null);

      if (error) throw error;

      // Group by service
      const serviceStats: { [key: string]: { count: number; revenue: number } } = {};
      
      data?.forEach(booking => {
        const serviceName = (booking.services as any)?.name;
        if (!serviceName) return;
        
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        
        // Add revenue from paid payments
        if (booking.payments && Array.isArray(booking.payments)) {
          booking.payments.forEach((payment: any) => {
            if (payment.status === 'paid') {
              serviceStats[serviceName].revenue += payment.amount || 0;
            }
          });
        }
      });

      return Object.entries(serviceStats)
        .map(([service_name, stats]) => ({
          service_name,
          booking_count: stats.count,
          total_revenue: stats.revenue,
        }))
        .sort((a, b) => b.booking_count - a.booking_count);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async (): Promise<RecentActivity[]> => {
      const activities: RecentActivity[] = [];

      // Get recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          status,
          users (name),
          services (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      bookings?.forEach(booking => {
        activities.push({
          id: booking.id,
          type: 'booking',
          message: `New booking: ${(booking.users as any)?.name || 'Unknown'} - ${(booking.services as any)?.name || 'Unknown service'}`,
          timestamp: booking.created_at,
          user_name: (booking.users as any)?.name,
        });
      });

      // Get recent payments
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          id,
          created_at,
          amount,
          status,
          bookings (
            users (name),
            services (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      payments?.forEach(payment => {
        const booking = payment.bookings as any;
        activities.push({
          id: payment.id,
          type: 'payment',
          message: `Payment ${payment.status}: €${payment.amount} - ${booking?.users?.name || 'Unknown'}`,
          timestamp: payment.created_at,
          user_name: booking?.users?.name,
          amount: payment.amount,
        });
      });

      // Get recent clients
      const { data: clients } = await supabase
        .from('users')
        .select('id, name, created_at')
        .eq('role', 'client')
        .order('created_at', { ascending: false })
        .limit(3);

      clients?.forEach(client => {
        activities.push({
          id: client.id,
          type: 'client',
          message: `New client registered: ${client.name}`,
          timestamp: client.created_at,
          user_name: client.name,
        });
      });

      // Sort all activities by timestamp
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRealtimeUpdates = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    console.log('🔄 Setting up realtime subscriptions for admin dashboard');
    
    // Subscribe to booking changes
    const bookingsChannel = supabase
      .channel('admin-bookings-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('📅 Booking update received:', payload);
          setUpdateTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to payment changes
    const paymentsChannel = supabase
      .channel('admin-payments-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          console.log('💰 Payment update received:', payload);
          setUpdateTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to user changes
    const usersChannel = supabase
      .channel('admin-users-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users',
          filter: 'role=eq.client'
        },
        (payload) => {
          console.log('👤 New client registered:', payload);
          setUpdateTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up realtime subscriptions');
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(usersChannel);
    };
  }, []);

  return updateTrigger;
};
