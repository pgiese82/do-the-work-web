
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Euro, FileText } from 'lucide-react';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  notes?: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

interface BookingCardProps {
  booking: Booking;
  isUpcoming: boolean;
}

export function BookingCard({ booking, isUpcoming }: BookingCardProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const dateTime = formatDateTime(booking.date_time);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {booking.services.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{dateTime.date} at {dateTime.time}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.payment_status} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{booking.services.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4" />
              <span className="font-medium text-foreground">{booking.services.price}</span>
            </div>
          </div>
        </div>
        
        {booking.notes && (
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">Session Notes</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{booking.notes}</p>
              </div>
            </div>
          </div>
        )}
        
        {isUpcoming && (
          <div className="flex gap-2 pt-2">
            {booking.status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30"
              >
                Cancel Booking
              </Button>
            )}
            {booking.status === 'confirmed' && new Date(booking.date_time) > new Date() && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/30"
              >
                Reschedule
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
