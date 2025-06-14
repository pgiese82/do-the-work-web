
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface RealtimeContextType {
  isConnected: boolean;
  reconnectAttempts: number;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  reconnectAttempts: 0
});

export const useRealtimeContext = () => useContext(RealtimeContext);

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { isConnected, reconnectAttempts, createSubscription } = useRealtimeSubscriptions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hasShownConnectionError, setHasShownConnectionError] = useState(false);

  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up realtime subscriptions for user:', user.id);

    const handleRealtimeUpdate = (table: string) => (payload: any) => {
      console.log(`📡 Realtime update for ${table}:`, payload);
      
      // Invalidate relevant queries based on table
      switch (table) {
        case 'bookings':
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['recent-bookings'] });
          queryClient.invalidateQueries({ queryKey: ['next-booking'] });
          break;
        case 'payments':
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          break;
        case 'documents':
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          break;
        case 'users':
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
          queryClient.invalidateQueries({ queryKey: ['client-check'] });
          break;
        case 'prospects':
          queryClient.invalidateQueries({ queryKey: ['prospects'] });
          if (payload.eventType === 'INSERT') {
            console.log('New prospect received via Realtime!', payload);
            toast({
              title: "Nieuwe Prospect",
              description: "Een nieuwe prospect is binnengekomen via het contactformulier.",
            });
          }
          break;
      }
    };

    // Set up subscriptions for different tables
    const tables = ['bookings', 'payments', 'documents', 'users', 'services', 'prospects'];
    const events = ['INSERT', 'UPDATE', 'DELETE'];
    
    tables.forEach(table => {
      events.forEach(event => {
        createSubscription(table, event, handleRealtimeUpdate(table));
      });
    });

  }, [user, createSubscription, queryClient, toast]);

  useEffect(() => {
    if (user && !isConnected && reconnectAttempts > 0 && !hasShownConnectionError) {
      console.log('🔴 Realtime subscriptions disconnected');
      toast({
        title: "Connection Issues",
        description: "Trying to reconnect to live updates...",
        variant: "destructive"
      });
      setHasShownConnectionError(true);
    } else if (isConnected && hasShownConnectionError) {
      console.log('🟢 Realtime subscriptions reconnected');
      toast({
        title: "Connected",
        description: "Live updates are working again!",
      });
      setHasShownConnectionError(false);
    }
  }, [user, isConnected, reconnectAttempts, toast, hasShownConnectionError]);

  return (
    <RealtimeContext.Provider value={{ isConnected, reconnectAttempts }}>
      {children}
    </RealtimeContext.Provider>
  );
};
