
import { useState, useEffect } from 'react';
import { useRealtimeSubscriptions } from './useRealtimeSubscriptions';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminRealtimeData = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { createSubscription } = useRealtimeSubscriptions();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Setting up admin realtime subscriptions...');

    const triggerUpdate = () => {
      setUpdateTrigger(prev => prev + 1);
      // Invalidate all admin queries
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['advanced-bookings-search'] });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    };

    // Subscribe to all booking changes for admin dashboard
    const bookingInserts = createSubscription('bookings', 'INSERT', triggerUpdate);
    const bookingUpdates = createSubscription('bookings', 'UPDATE', triggerUpdate);
    const bookingDeletes = createSubscription('bookings', 'DELETE', triggerUpdate);

    // Subscribe to payment changes
    const paymentUpdates = createSubscription('payments', 'UPDATE', triggerUpdate);
    const paymentInserts = createSubscription('payments', 'INSERT', triggerUpdate);

    // Subscribe to user changes (new signups, status changes)
    const userUpdates = createSubscription('users', 'UPDATE', triggerUpdate);
    const userInserts = createSubscription('users', 'INSERT', triggerUpdate);

    return () => {
      bookingInserts.cleanup();
      bookingUpdates.cleanup();
      bookingDeletes.cleanup();
      paymentUpdates.cleanup();
      paymentInserts.cleanup();
      userUpdates.cleanup();
      userInserts.cleanup();
    };
  }, [createSubscription, queryClient]);

  return updateTrigger;
};
