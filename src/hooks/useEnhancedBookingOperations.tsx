
import { useBulkBookingUpdate } from './booking-operations/useBulkBookingUpdate';
import { useBookingDuplication } from './booking-operations/useBookingDuplication';

export const useEnhancedBookingOperations = () => {
  const { performBulkUpdate, loading: bulkUpdateLoading } = useBulkBookingUpdate();
  const { duplicateBooking, loading: duplicationLoading } = useBookingDuplication();

  const loading = bulkUpdateLoading || duplicationLoading;

  return {
    performBulkUpdate,
    duplicateBooking,
    loading
  };
};
