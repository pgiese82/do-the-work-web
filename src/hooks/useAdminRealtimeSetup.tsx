
import { useEffect } from 'react';
import { useRealtimeSubscriptions } from './useRealtimeSubscriptions';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminRealtimeSetup = () => {
  const { createSubscription } = useRealtimeSubscriptions();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Setting up admin realtime subscriptions centrally...');

    const invalidateAdminQueries = (context: string) => () => {
        console.log(`📡 Realtime update on ${context}, invalidating admin queries.`);
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['advanced-bookings-search'] });
        queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
        queryClient.invalidateQueries({ queryKey: ['recent-activity'] });
    };

    // Subscribe to all booking changes for admin dashboard
    const bookingInserts = createSubscription('bookings', 'INSERT', invalidateAdminQueries('bookings'));
    const bookingUpdates = createSubscription('bookings', 'UPDATE', invalidateAdminQueries('bookings'));
    const bookingDeletes = createSubscription('bookings', 'DELETE', invalidateAdminQueries('bookings'));

    // Subscribe to payment changes
    const paymentUpdates = createSubscription('payments', 'UPDATE', invalidateAdminQueries('payments'));
    const paymentInserts = createSubscription('payments', 'INSERT', invalidateAdminQueries('payments'));

    // Subscribe to user changes (new signups, status changes)
    const userUpdates = createSubscription('users', 'UPDATE', invalidateAdminQueries('users'));
    const userInserts = createSubscription('users', 'INSERT', invalidateAdminQueries('users'));
    
    return () => {
      console.log('🧹 Cleaning up admin realtime subscriptions...');
      bookingInserts?.cleanup();
      bookingUpdates?.cleanup();
      bookingDeletes?.cleanup();
      paymentUpdates?.cleanup();
      paymentInserts?.cleanup();
      userUpdates?.cleanup();
      userInserts?.cleanup();
    };

  }, [createSubscription, queryClient]);
};
