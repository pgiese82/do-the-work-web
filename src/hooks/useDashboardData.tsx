
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('🔍 Fetching dashboard stats for user:', user.id);

      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      const [bookingsResult, documentsResult, paymentsResult] = await Promise.all([
        // Get user's bookings
        supabase
          .from('bookings')
          .select(`
            *,
            services:service_id (
              name,
              price,
              duration
            )
          `)
          .eq('user_id', user.id)
          .order('date_time', { ascending: false }),

        // Get user's documents count
        supabase
          .from('documents')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),

        // Get user's payments
        supabase
          .from('payments')
          .select('*')
          .in('booking_id', (
            await supabase
              .from('bookings')
              .select('id')
              .eq('user_id', user.id)
          ).data?.map(b => b.id) || [])
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (documentsResult.error) throw documentsResult.error;
      if (paymentsResult.error) throw paymentsResult.error;

      const bookings = bookingsResult.data || [];
      const payments = paymentsResult.data || [];

      // Calculate statistics
      const totalBookings = bookings.length;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const upcomingBookings = bookings.filter(b => 
        new Date(b.date_time) > new Date() && b.status !== 'cancelled'
      ).length;
      
      const nextBooking = bookings
        .filter(b => new Date(b.date_time) > new Date() && b.status !== 'cancelled')
        .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0];

      const recentBookings = bookings
        .slice(0, 5);

      const totalSpent = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const documentsCount = documentsResult.count || 0;

      const stats = {
        totalBookings,
        completedBookings,
        upcomingBookings,
        totalSpent,
        documentsCount,
        nextBooking,
        recentBookings,
      };

      console.log('📊 Dashboard stats calculated:', stats);
      return stats;
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const useRecentBookings = (limit: number = 10) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-bookings', user?.id, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (
            name,
            price,
            duration
          )
        `)
        .eq('user_id', user.id)
        .order('date_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });
};

export const useNextBooking = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['next-booking', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (
            name,
            price,
            duration
          )
        `)
        .eq('user_id', user.id)
        .gt('date_time', new Date().toISOString())
        .eq('status', 'confirmed')
        .order('date_time', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
