
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CreditCard, 
  XCircle, 
  RotateCcw
} from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'paid' | 'failed' | 'refunded';
}

const paymentStatusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20',
  },
  paid: {
    icon: CreditCard,
    label: 'Paid',
    className: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
  },
  refunded: {
    icon: RotateCcw,
    label: 'Refunded',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20',
  },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
