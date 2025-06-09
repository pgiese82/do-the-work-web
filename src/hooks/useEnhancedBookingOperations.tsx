import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from './useAuditLog';

interface BulkUpdateData {
  status?: string;
  payment_status?: string;
  internal_notes?: string;
}

export const useEnhancedBookingOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logAdminAction } = useAuditLog();

  const performBulkUpdate = async (bookingIds: string[], updateData: BulkUpdateData) => {
    setLoading(true);
    try {
      // Convert to proper format for database function
      const dbUpdateData = {
        status: updateData.status,
        payment_status: updateData.payment_status,
        internal_notes: updateData.internal_notes
      };

      // Use the database function for atomic bulk operations
      const { data, error } = await supabase.rpc('bulk_update_bookings', {
        booking_ids: bookingIds,
        update_data: dbUpdateData as any
      });

      if (error) throw error;

      // Send email notifications for status changes
      if (updateData.status) {
        await Promise.all(
          bookingIds.map(async (bookingId) => {
            try {
              await supabase.functions.invoke('send-booking-modification-email', {
                body: {
                  bookingId,
                  modificationType: 'status_change',
                  newStatus: updateData.status,
                  reason: `Bulk status update to ${updateData.status}`
                }
              });
            } catch (emailError) {
              console.error(`Failed to send email for booking ${bookingId}:`, emailError);
            }
          })
        );
      }

      // Log bulk action
      await logAdminAction(
        'bulk_booking_update',
        'booking',
        undefined,
        {
          booking_count: bookingIds.length,
          update_data: updateData,
          booking_ids: bookingIds
        }
      );

      toast({
        title: "Bulk Update Successful",
        description: `Successfully updated ${bookingIds.length} bookings.`,
      });

      return true;
    } catch (error: any) {
      console.error('Bulk update error:', error);
      toast({
        variant: "destructive",
        title: "Bulk Update Failed",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      // First get booking details for audit log
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, user:users(name, email), service:services(name)')
        .eq('id', bookingId)
        .single();

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      // Log deletion
      await logAdminAction(
        'booking_deleted',
        'booking',
        bookingId,
        {
          client_name: booking?.user?.name,
          service_name: booking?.service?.name,
          original_date: booking?.date_time
        }
      );

      toast({
        title: "Booking Deleted",
        description: "The booking has been permanently deleted.",
      });

      return true;
    } catch (error: any) {
      console.error('Delete booking error:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

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

  return {
    performBulkUpdate,
    deleteBooking,
    duplicateBooking,
    loading
  };
};
