
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface RealtimeSubscription {
  channel: any;
  table: string;
  event: string;
  cleanup: () => void;
}

export const useRealtimeSubscriptions = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const subscriptionsRef = useRef<RealtimeSubscription[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const cleanup = () => {
    subscriptionsRef.current.forEach(sub => {
      try {
        sub.cleanup();
      } catch (error) {
        console.error('Error cleaning up subscription:', error);
      }
    });
    subscriptionsRef.current = [];
  };

  const createSubscription = (
    table: string,
    event: string,
    callback: (payload: any) => void,
    filter?: { column: string; value: string }
  ) => {
    // Prevent duplicate subscriptions
    const existingIndex = subscriptionsRef.current.findIndex(
      sub => sub.table === table && sub.event === event
    );
    
    if (existingIndex !== -1) {
      console.log(`🔄 Subscription for ${table}:${event} already exists, skipping`);
      return subscriptionsRef.current[existingIndex];
    }

    const channelName = `realtime-${table}-${event}-${Date.now()}-${Math.random()}`;
    const channel = supabase.channel(channelName);

    let changeConfig: any = {
      event,
      schema: 'public',
      table,
    };

    if (filter) {
      changeConfig.filter = `${filter.column}=eq.${filter.value}`;
    }

    channel.on('postgres_changes', changeConfig, (payload) => {
      console.log(`📡 Realtime update for ${table}:${event}`, payload);
      callback(payload);
    });

    const subscriptionObj: RealtimeSubscription = {
      channel,
      table,
      event,
      cleanup: () => {
        try {
          channel.unsubscribe();
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };

    // Subscribe and handle status
    channel.subscribe((status) => {
      console.log(`🔄 Realtime ${table}:${event} subscription status:`, status);
      
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        setReconnectAttempts(0);
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        
        // Remove failed subscription
        const index = subscriptionsRef.current.findIndex(sub => sub === subscriptionObj);
        if (index !== -1) {
          subscriptionsRef.current.splice(index, 1);
        }
        
        if (reconnectAttempts < 3) {
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            console.log(`🔄 Attempting to reconnect... (${reconnectAttempts + 1}/3)`);
          }, 1000 * Math.pow(2, reconnectAttempts));
        }
      }
    });

    subscriptionsRef.current.push(subscriptionObj);
    return subscriptionObj;
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    isConnected,
    reconnectAttempts,
    createSubscription,
    cleanup
  };
};
