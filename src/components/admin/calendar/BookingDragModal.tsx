
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  users: {
    name: string;
    email: string;
  };
  services: {
    name: string;
    duration: number;
    id: string;
  };
}

interface BookingDragModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm: (bookingId: string, newDateTime: Date) => void;
}

export function BookingDragModal({ booking, onClose, onConfirm }: BookingDragModalProps) {
  const bookingDate = parseISO(booking.date_time);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'completed': return 'bg-blue-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bevestigd';
      case 'pending': return 'wachtend';
      case 'completed': return 'voltooid';
      case 'cancelled': return 'geannuleerd';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'betaald';
      case 'pending': return 'wachtend';
      case 'failed': return 'mislukt';
      default: return status;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Boeking Details</DialogTitle>
        </DialogHeader>

        <Card className="bg-muted/20 backdrop-blur-md border-border">
          <CardContent className="p-4 space-y-4">
            {/* Client Info */}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <div className="text-foreground font-medium">{booking.users.name}</div>
                <div className="text-sm text-muted-foreground">{booking.users.email}</div>
              </div>
            </div>

            {/* Service Info */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-primary rounded-full"></div>
              <div>
                <div className="text-foreground font-medium">{booking.services.name}</div>
                <div className="text-sm text-muted-foreground">{booking.services.duration} minuten</div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-foreground font-medium">
                  {format(bookingDate, 'EEEE, d MMMM yyyy', { locale: nl })}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(bookingDate, 'HH:mm')}
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(booking.status)} text-white`}>
                {getStatusText(booking.status)}
              </Badge>
              <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white flex items-center gap-1`}>
                <CreditCard className="w-3 h-3" />
                {getPaymentStatusText(booking.payment_status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <div className="text-muted-foreground text-sm mb-2">
            Deze boeking wordt momenteel verplaatst
          </div>
          <div className="text-muted-foreground text-xs">
            Sleep naar een tijdslot om te verplaatsen, of klik annuleren om te stoppen
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Annuleren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
