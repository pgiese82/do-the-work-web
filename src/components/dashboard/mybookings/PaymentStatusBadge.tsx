
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusBadgeProps {
  status: string;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getPaymentConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          variant: 'default' as const,
          className: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
          label: 'Betaald'
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          className: 'bg-amber-500/10 text-amber-700 border-amber-200',
          label: 'Wachtend op Betaling'
        };
      case 'failed':
        return {
          variant: 'outline' as const,
          className: 'bg-red-500/10 text-red-700 border-red-200',
          label: 'Betaling Mislukt'
        };
      case 'refunded':
        return {
          variant: 'outline' as const,
          className: 'bg-blue-500/10 text-blue-700 border-blue-200',
          label: 'Terugbetaald'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-muted text-muted-foreground',
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    }
  };

  const config = getPaymentConfig(status);

  return (
    <Badge variant={config.variant} className={`text-xs font-medium ${config.className}`}>
      Betaling: {config.label}
    </Badge>
  );
}
