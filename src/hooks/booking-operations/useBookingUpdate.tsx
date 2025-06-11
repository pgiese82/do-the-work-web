
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '../useAuditLog';

interface BookingUpdateData {
  status?: string;
  payment_status?: string;
  internal_notes?: string;
  session_notes?: string;
  attendance_status?: string | null;
  date_time?: string;
}

export const useBookingUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logAdminAction } = useAuditLog();

  const updateBooking = async (bookingId: string, updateData: BookingUpdateData) => {
    setLoading(true);
    try {
      console.log('🔄 Updating single booking:', bookingId, 'with data:', updateData);
      
      // Prepare the update object with only defined values
      const dbUpdateData: any = {};
      
      if (updateData.status !== undefined) {
        dbUpdateData.status = updateData.status;
      }
      if (updateData.payment_status !== undefined) {
        dbUpdateData.payment_status = updateData.payment_status;
      }
      if (updateData.internal_notes !== undefined) {
        dbUpdateData.internal_notes = updateData.internal_notes;
      }
      if (updateData.session_notes !== undefined) {
        dbUpdateData.session_notes = updateData.session_notes;
      }
      if (updateData.attendance_status !== undefined) {
        dbUpdateData.attendance_status = updateData.attendance_status;
      }
      if (updateData.date_time !== undefined) {
        dbUpdateData.date_time = updateData.date_time;
      }

      // Add updated_at timestamp
      dbUpdateData.updated_at = new Date().toISOString();

      console.log('📤 Sending direct update to database:', dbUpdateData);

      // Update the booking directly
      const { data, error } = await supabase
        .from('bookings')
        .update(dbUpdateData)
        .eq('id', bookingId)
        .select();

      if (error) {
        console.error('❌ Error updating booking:', error);
        throw error;
      }

      console.log('✅ Booking updated successfully:', data);

      // Log the update action
      await logAdminAction(
        'booking_updated',
        'booking',
        bookingId,
        {
          updated_fields: Object.keys(updateData),
          update_data: updateData
        }
      );

      toast({
        title: 'Succes',
        description: 'Boeking succesvol bijgewerkt',
      });

      return true;
    } catch (error: any) {
      console.error('💥 Error updating booking:', error);
      toast({
        variant: "destructive",
        title: 'Fout',
        description: error.message || 'Kan boeking niet bijwerken',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateBooking, loading };
};
