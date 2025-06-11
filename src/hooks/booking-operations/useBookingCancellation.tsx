
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '../useAuditLog';

export const useBookingCancellation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logAdminAction } = useAuditLog();

  const cancelBooking = async (bookingId: string, reason?: string) => {
    setLoading(true);
    try {
      console.log('🚫 Starting cancellation process for booking:', bookingId);
      
      // First get booking details for audit log
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*, user:users(name, email), service:services(name)')
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching booking for cancellation:', fetchError);
        throw fetchError;
      }

      console.log('📋 Booking details retrieved:', booking);

      // Update booking status to cancelled instead of deleting
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          internal_notes: booking.internal_notes 
            ? `${booking.internal_notes}\n\nCancelled by admin: ${reason || 'No reason provided'}`
            : `Cancelled by admin: ${reason || 'No reason provided'}`
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('❌ Error cancelling booking:', updateError);
        throw updateError;
      }

      console.log('✅ Booking successfully cancelled');

      // Log cancellation
      await logAdminAction(
        'booking_cancelled',
        'booking',
        bookingId,
        {
          client_name: booking?.user?.name,
          service_name: booking?.service?.name,
          original_date: booking?.date_time,
          cancellation_reason: reason || 'No reason provided'
        }
      );

      console.log('📝 Audit log created for cancellation');

      toast({
        title: "Boeking geannuleerd",
        description: "De boeking is succesvol geannuleerd.",
      });

      return true;
    } catch (error: any) {
      console.error('💥 Cancel booking error:', error);
      toast({
        variant: "destructive",
        title: "Annulering mislukt",
        description: error.message || 'Failed to cancel booking',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cancelBooking, loading };
};
