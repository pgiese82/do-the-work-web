
import { useEffect, useCallback } from 'react';
import { useRealtimeSubscriptions } from './useRealtimeSubscriptions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useAvailabilityRealtimeUpdates = () => {
  const { createSubscription } = useRealtimeSubscriptions();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleAvailabilityUpdate = useCallback((payload: any) => {
    console.log('📅 Availability updated:', payload);
    
    // Invalidate availability and booking queries
    queryClient.invalidateQueries({ queryKey: ['availability'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
    queryClient.invalidateQueries({ queryKey: ['booking-slots'] });

    toast({
      title: "Schedule Updated",
      description: "Available booking times have been updated",
    });
  }, [toast, queryClient]);

  const handleServiceUpdate = useCallback((payload: any) => {
    console.log('🛠️ Service updated:', payload);
    
    // Invalidate service queries
    queryClient.invalidateQueries({ queryKey: ['services'] });
    queryClient.invalidateQueries({ queryKey: ['booking-slots'] });

    toast({
      title: "Services Updated",
      description: "Service offerings have been updated",
    });
  }, [toast, queryClient]);

  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up availability realtime subscriptions...');

    // Subscribe to availability rule changes
    const availabilityInserts = createSubscription('availability_rules', 'INSERT', handleAvailabilityUpdate);
    const availabilityUpdates = createSubscription('availability_rules', 'UPDATE', handleAvailabilityUpdate);
    const availabilityDeletes = createSubscription('availability_rules', 'DELETE', handleAvailabilityUpdate);

    // Subscribe to service changes
    const serviceUpdates = createSubscription('services', 'UPDATE', handleServiceUpdate);
    const serviceInserts = createSubscription('services', 'INSERT', handleServiceUpdate);

    return () => {
      availabilityInserts.cleanup();
      availabilityUpdates.cleanup();
      availabilityDeletes.cleanup();
      serviceUpdates.cleanup();
      serviceInserts.cleanup();
    };
  }, [user, createSubscription, handleAvailabilityUpdate, handleServiceUpdate]);

  return null;
};
