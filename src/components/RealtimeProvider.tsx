
import React, { createContext, useContext, useEffect } from 'react';
import { useBookingRealtimeUpdates } from '@/hooks/useBookingRealtimeUpdates';
import { useDocumentRealtimeUpdates } from '@/hooks/useDocumentRealtimeUpdates';
import { useAvailabilityRealtimeUpdates } from '@/hooks/useAvailabilityRealtimeUpdates';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const { isConnected, reconnectAttempts } = useRealtimeSubscriptions();
  const { toast } = useToast();

  // Initialize all realtime subscriptions
  useBookingRealtimeUpdates();
  useDocumentRealtimeUpdates();
  useAvailabilityRealtimeUpdates();

  useEffect(() => {
    if (user && isConnected) {
      console.log('🟢 Realtime subscriptions active');
    } else if (user && !isConnected && reconnectAttempts > 0) {
      console.log('🔴 Realtime subscriptions disconnected');
      toast({
        title: "Connection Issues",
        description: "Trying to reconnect to live updates...",
        variant: "destructive"
      });
    }
  }, [user, isConnected, reconnectAttempts, toast]);

  return (
    <RealtimeContext.Provider value={{ isConnected, reconnectAttempts }}>
      {children}
    </RealtimeContext.Provider>
  );
};
