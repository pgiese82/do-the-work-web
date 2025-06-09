
import { useEffect, useCallback } from 'react';
import { useRealtimeSubscriptions } from './useRealtimeSubscriptions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useBookingRealtimeUpdates = () => {
  const { createSubscription } = useRealtimeSubscriptions();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleBookingUpdate = useCallback((payload: any) => {
    console.log('📅 Booking updated:', payload);
    
    const { new: newBooking, old: oldBooking, eventType } = payload;
    
    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['recent-bookings'] });
    queryClient.invalidateQueries({ queryKey: ['next-booking'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });

    if (eventType === 'INSERT') {
      toast({
        title: "New Booking Created",
        description: `A new booking has been created for ${new Date(newBooking.date_time).toLocaleDateString()}`,
      });
    } else if (eventType === 'UPDATE' && oldBooking?.status !== newBooking?.status) {
      const statusMessages = {
        confirmed: 'Your booking has been confirmed!',
        cancelled: 'A booking has been cancelled',
        completed: 'A booking has been marked as completed',
        no_show: 'A client did not show up for their booking'
      };
      
      toast({
        title: "Booking Status Updated",
        description: statusMessages[newBooking.status as keyof typeof statusMessages] || 'Booking status changed',
        variant: newBooking.status === 'cancelled' ? 'destructive' : 'default'
      });
    }
  }, [toast, queryClient]);

  const handlePaymentUpdate = useCallback((payload: any) => {
    console.log('💰 Payment updated:', payload);
    
    const { new: newPayment, eventType } = payload;
    
    // Invalidate payment-related queries
    queryClient.invalidateQueries({ queryKey: ['payment-history'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });

    if (eventType === 'UPDATE' && newPayment?.status === 'paid') {
      toast({
        title: "Payment Confirmed",
        description: `Payment of €${newPayment.amount} has been confirmed`,
      });
    } else if (eventType === 'UPDATE' && newPayment?.status === 'failed') {
      toast({
        title: "Payment Failed",
        description: "A payment has failed. Please check your payment method.",
        variant: "destructive"
      });
    }
  }, [toast, queryClient]);

  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up booking realtime subscriptions...');

    // Subscribe to booking changes
    const bookingInserts = createSubscription('bookings', 'INSERT', handleBookingUpdate);
    const bookingUpdates = createSubscription('bookings', 'UPDATE', handleBookingUpdate);
    const bookingDeletes = createSubscription('bookings', 'DELETE', handleBookingUpdate);

    // Subscribe to payment changes
    const paymentUpdates = createSubscription('payments', 'UPDATE', handlePaymentUpdate);
    const paymentInserts = createSubscription('payments', 'INSERT', handlePaymentUpdate);

    return () => {
      bookingInserts.cleanup();
      bookingUpdates.cleanup();
      bookingDeletes.cleanup();
      paymentUpdates.cleanup();
      paymentInserts.cleanup();
    };
  }, [user, createSubscription, handleBookingUpdate, handlePaymentUpdate]);

  return null;
};
