
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminAPI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const callAdminAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await supabase.functions.invoke('admin-api', {
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Admin API error:', error);
      toast({
        variant: "destructive",
        title: "API Error",
        description: error.message || 'Failed to call admin API',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUsers = () => callAdminAPI('/users');
  const getBookings = () => callAdminAPI('/bookings');
  const getStats = () => callAdminAPI('/stats');
  
  const updateBooking = (bookingId: string, updates: any) => 
    callAdminAPI('/bookings', 'PATCH', { bookingId, ...updates });

  return {
    loading,
    getUsers,
    getBookings,
    getStats,
    updateBooking,
    callAdminAPI,
  };
};
