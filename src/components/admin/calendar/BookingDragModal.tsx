
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Booking Details</DialogTitle>
        </DialogHeader>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4 space-y-4">
            {/* Client Info */}
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-white font-medium">{booking.users.name}</div>
                <div className="text-sm text-gray-300">{booking.users.email}</div>
              </div>
            </div>

            {/* Service Info */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
              <div>
                <div className="text-white font-medium">{booking.services.name}</div>
                <div className="text-sm text-gray-300">{booking.services.duration} minutes</div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-white font-medium">
                  {format(bookingDate, 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="text-sm text-gray-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(bookingDate, 'HH:mm')}
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(booking.status)} text-white`}>
                {booking.status}
              </Badge>
              <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white flex items-center gap-1`}>
                <CreditCard className="w-3 h-3" />
                {booking.payment_status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <div className="text-gray-300 text-sm mb-2">
            This booking is currently being dragged
          </div>
          <div className="text-gray-400 text-xs">
            Drop it on a time slot to reschedule, or click cancel to abort
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
