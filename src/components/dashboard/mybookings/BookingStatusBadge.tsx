
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BookingStatusBadgeProps {
  status: string;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          variant: 'default' as const,
          className: 'bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20',
          label: 'Bevestigd'
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          className: 'bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/20',
          label: 'Wachtend op Goedkeuring'
        };
      case 'completed':
        return {
          variant: 'outline' as const,
          className: 'bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20',
          label: 'Voltooid'
        };
      case 'cancelled':
        return {
          variant: 'outline' as const,
          className: 'bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20',
          label: 'Geannuleerd'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-muted text-muted-foreground',
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={`text-xs font-medium ${config.className}`}>
      Boeking: {config.label}
    </Badge>
  );
}
