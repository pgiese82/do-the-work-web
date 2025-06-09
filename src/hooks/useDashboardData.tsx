
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalBookings: number;
  completedSessions: number;
  upcomingBookings: number;
  totalDocuments: number;
  lastSessionDate: string | null;
  totalSpent: number;
}

interface NextBooking {
  id: string;
  date_time: string;
  status: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  subscription_status: string;
  client_status: string;
  total_spent: number;
  last_session_date: string | null;
}

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      const [bookingsCount, completedCount, upcomingCount, documentsCount] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'completed'),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user.id).gte('date_time', new Date().toISOString()),
        supabase.from('documents').select('id', { count: 'exact' }).eq('user_id', user.id),
      ]);

      // Get user profile for last session and total spent
      const { data: userProfile } = await supabase
        .from('users')
        .select('last_session_date, total_spent')
        .eq('id', user.id)
        .single();

      return {
        totalBookings: bookingsCount.count || 0,
        completedSessions: completedCount.count || 0,
        upcomingBookings: upcomingCount.count || 0,
        totalDocuments: documentsCount.count || 0,
        lastSessionDate: userProfile?.last_session_date || null,
        totalSpent: userProfile?.total_spent || 0,
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
};

export const useNextBooking = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['next-booking', user?.id],
    queryFn: async (): Promise<NextBooking | null> => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          date_time,
          status,
          services (
            name,
            duration,
            price
          )
        `)
        .eq('user_id', user.id)
        .gte('date_time', new Date().toISOString())
        .eq('status', 'confirmed')
        .order('date_time', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile> => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('users')
        .select('name, email, phone, subscription_status, client_status, total_spent, last_session_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecentBookings = (limit: number = 5) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-bookings', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          date_time,
          status,
          payment_status,
          notes,
          services (
            name,
            duration,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('date_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePaymentHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payment-history', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          payment_method,
          created_at,
          bookings (
            date_time,
            services (
              name
            )
          )
        `)
        .eq('bookings.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
