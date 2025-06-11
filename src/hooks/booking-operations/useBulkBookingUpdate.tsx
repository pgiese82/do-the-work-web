
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '../useAuditLog';

interface BulkUpdateData {
  status?: string;
  payment_status?: string;
  internal_notes?: string;
}

export const useBulkBookingUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logAdminAction } = useAuditLog();

  const performBulkUpdate = async (bookingIds: string[], updateData: BulkUpdateData) => {
    setLoading(true);
    try {
      // Convert to proper JSON format for database function
      const dbUpdateData: Record<string, any> = {};
      
      if (updateData.status !== undefined) {
        dbUpdateData.status = updateData.status;
      }
      if (updateData.payment_status !== undefined) {
        dbUpdateData.payment_status = updateData.payment_status;
      }
      if (updateData.internal_notes !== undefined) {
        dbUpdateData.internal_notes = updateData.internal_notes;
      }

      // Use the database function for atomic bulk operations
      const { data, error } = await supabase.rpc('bulk_update_bookings', {
        booking_ids: bookingIds,
        update_data: dbUpdateData
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

  return { performBulkUpdate, loading };
};
