
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types/calendar';

export const useAdminCalendar = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Boekingen laden...');
      
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

      if (error) {
        console.error('Fout bij laden boekingen:', error);
        throw error;
      }

      console.log('Boekingen geladen:', data);
      setBookings(data || []);
    } catch (error: any) {
      console.error('Laden boekingen mislukt:', error);
      toast({
        variant: "destructive",
        title: "Fout bij laden boekingen",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleBookingDrop = useCallback(async (bookingId: string, newDateTime: Date) => {
    try {
      console.log('Boeking bijwerken:', bookingId, 'naar:', newDateTime);
      
      const { error } = await supabase
        .from('bookings')
        .update({ date_time: newDateTime.toISOString() })
        .eq('id', bookingId);

      if (error) {
        console.error('Fout bij bijwerken boeking:', error);
        throw error;
      }
      
      toast({
        title: "Boeking verplaatst",
        description: "De boeking is succesvol verplaatst naar het nieuwe tijdslot.",
      });
      
      await loadBookings();
    } catch (error: any) {
      console.error('Verplaatsen boeking mislukt:', error);
      toast({
        variant: "destructive",
        title: "Fout bij verplaatsen boeking",
        description: error.message,
      });
    }
  }, [toast, loadBookings]);

  return { bookings, loading, handleBookingDrop, loadBookings };
};
