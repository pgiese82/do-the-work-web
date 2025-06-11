import { useBulkBookingUpdate } from './booking-operations/useBulkBookingUpdate';
import { useBookingCancellation } from './booking-operations/useBookingCancellation';
import { useBookingDuplication } from './booking-operations/useBookingDuplication';

export const useEnhancedBookingOperations = () => {
  const { performBulkUpdate, loading: bulkUpdateLoading } = useBulkBookingUpdate();
  const { cancelBooking, loading: cancellationLoading } = useBookingCancellation();
  const { duplicateBooking, loading: duplicationLoading } = useBookingDuplication();

  // Keep the old deleteBooking function for backwards compatibility, but now it cancels
  const deleteBooking = async (bookingId: string) => {
    return await cancelBooking(bookingId, 'Booking deleted via admin interface');
  };

  const loading = bulkUpdateLoading || cancellationLoading || duplicationLoading;

  return {
    performBulkUpdate,
    cancelBooking,
    deleteBooking, // This now cancels instead of deletes
    duplicateBooking,
    loading
  };
};
