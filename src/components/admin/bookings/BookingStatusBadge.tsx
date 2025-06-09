
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar
} from 'lucide-react';

interface BookingStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20',
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmed',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    className: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
  },
  no_show: {
    icon: AlertCircle,
    label: 'No Show',
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
  },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
