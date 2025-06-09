
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useRealtimeContext } from './RealtimeProvider';

export const RealtimeStatus: React.FC = () => {
  const { isConnected, reconnectAttempts } = useRealtimeContext();

  if (reconnectAttempts > 0 && !isConnected) {
    return (
      <Badge variant="secondary" className="gap-1">
        <WifiOff className="w-3 h-3" />
        Reconnecting... ({reconnectAttempts}/3)
      </Badge>
    );
  }

  return (
    <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          Live
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          Offline
        </>
      )}
    </Badge>
  );
};
