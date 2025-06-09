
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminAPI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users:user_id (
            name,
            email
          ),
          services:service_id (
            name,
            duration,
            id
          )
        `)
        .order('date_time', { ascending: false });
      
      if (error) throw error;
      return { data };
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Error fetching bookings",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      setLoading(true);
      // Get basic stats directly from database
      const [usersResult, bookingsResult] = await Promise.all([
        supabase.from('users').select('client_status, total_spent, last_session_date, created_at').eq('role', 'client'),
        supabase.from('bookings').select('status, payment_status, date_time')
      ]);

      if (usersResult.error) throw usersResult.error;
      if (bookingsResult.error) throw bookingsResult.error;

      const data = {
        users: usersResult.data || [],
        bookings: bookingsResult.data || []
      };

      return { data };
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        variant: "destructive",
        title: "Error fetching stats",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updateBooking = async (bookingId: string, updates: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select();
      
      if (error) throw error;
      return { data };
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        variant: "destructive",
        title: "Error updating booking",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getUsers,
    getBookings,
    getStats,
    updateBooking,
  };
};
