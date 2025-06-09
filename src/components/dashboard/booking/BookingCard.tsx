import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { BookingActions } from '@/components/booking/BookingActions';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  service_id: string;
  notes?: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

interface BookingCardProps {
  booking: Booking;
  onUpdate: () => void;
}

export function BookingCard({ booking, onUpdate }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: format(date, 'EEEE, MMMM d, yyyy'),
      time: format(date, 'HH:mm'),
    };
  };

  const dateTime = formatDateTime(booking.date_time);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{booking.services.name}</CardTitle>
            <CardDescription className="text-gray-300">
              {dateTime.date} at {dateTime.time}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={`${getStatusColor(booking.status)} text-white`}>
              {booking.status}
            </Badge>
            <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white`}>
              {booking.payment_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {booking.services.duration} minutes
          </div>
          <div className="flex items-center gap-1">
            <span>€{booking.services.price}</span>
          </div>
        </div>
        
        {booking.notes && (
          <div className="text-sm text-gray-300 mb-4">
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}
        
        <BookingActions booking={booking} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );
}
