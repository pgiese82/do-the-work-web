
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import CustomCalendar from './CustomCalendar';

interface RescheduleBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    date_time: string;
    services: {
      name: string;
      price: number;
      duration: number;
    };
    service_id: string;
  } | null;
  onSuccess: () => void;
}

export function RescheduleBookingModal({
  open,
  onOpenChange,
  booking,
  onSuccess
}: RescheduleBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    booking ? new Date(booking.date_time) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!booking) return null;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Selecteer een datum en tijd',
        description: 'Je moet een nieuwe datum en tijd selecteren om de afspraak te verzetten.',
        variant: 'destructive',
      });
      return;
    }

    // Combine date and time into a DateTime
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours, minutes, 0, 0);

    // Check if selected time is in the future
    if (newDateTime <= new Date()) {
      toast({
        title: 'Ongeldige tijd',
        description: 'De gekozen datum en tijd moet in de toekomst liggen.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Update the booking with the new date_time
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ date_time: newDateTime.toISOString() })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // Create a record of this modification
      const { error: modificationError } = await supabase
        .from('booking_modifications')
        .insert({
          booking_id: booking.id,
          modification_type: 'reschedule',
          reason: 'Klant heeft afspraak verzet',
          requested_date_time: newDateTime.toISOString(),
          status: 'approved', // Auto-approve as it's already checked for availability
        });

      if (modificationError) throw modificationError;

      toast({
        title: 'Afspraak verzet',
        description: 'Je afspraak is succesvol verzet naar de nieuwe datum en tijd.',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error rescheduling booking:', error);
      toast({
        title: 'Fout',
        description: `Kon afspraak niet verzetten: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Afspraak verzetten
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Booking Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">{booking.services.name}</h3>
            <p className="text-sm text-gray-600">
              Huidige datum: {format(new Date(booking.date_time), 'EEEE d MMMM yyyy HH:mm', { locale: nl })}
            </p>
            <p className="text-sm text-gray-600">
              Duur: {booking.services.duration} minuten
            </p>
          </div>

          {/* Calendar for new date and time selection */}
          <div className="py-2">
            <CustomCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              serviceDuration={booking.services.duration}
              onConfirm={handleConfirm}
              loading={loading}
              serviceId={booking.service_id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
