
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '../useAuditLog';

export const useBookingDuplication = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logAdminAction } = useAuditLog();

  const duplicateBooking = async (originalBookingId: string, newDateTime: string) => {
    setLoading(true);
    try {
      // Get original booking details
      const { data: originalBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', originalBookingId)
        .single();

      if (fetchError) throw fetchError;

      // Create new booking
      const { data: newBooking, error: createError } = await supabase
        .from('bookings')
        .insert({
          user_id: originalBooking.user_id,
          service_id: originalBooking.service_id,
          date_time: newDateTime,
          status: 'pending',
          payment_status: 'pending',
          notes: originalBooking.notes,
          internal_notes: `Duplicated from booking ${originalBookingId}`
        })
        .select()
        .single();

      if (createError) throw createError;

      // Log duplication
      await logAdminAction(
        'booking_duplicated',
        'booking',
        newBooking.id,
        {
          original_booking_id: originalBookingId,
          new_date_time: newDateTime
        }
      );

      toast({
        title: "Booking Duplicated",
        description: "A new booking has been created based on the original.",
      });

      return newBooking;
    } catch (error: any) {
      console.error('Duplicate booking error:', error);
      toast({
        variant: "destructive",
        title: "Duplication Failed",
        description: error.message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { duplicateBooking, loading };
};
