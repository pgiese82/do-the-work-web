
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInHours } from 'date-fns';
import { nl } from 'date-fns/locale';
import CustomCalendar from './CustomCalendar';

interface BookingModificationModalProps {
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
  type: 'reschedule' | 'cancel';
  onSuccess: () => void;
}

export function BookingModificationModal({
  open,
  onOpenChange,
  booking,
  type,
  onSuccess
}: BookingModificationModalProps) {
  const [reason, setReason] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!booking) return null;

  const hoursUntilBooking = differenceInHours(new Date(booking.date_time), new Date());
  const canCancel = hoursUntilBooking >= 24;
  const refundAmount = calculateRefund(hoursUntilBooking, booking.services.price);

  function calculateRefund(hours: number, originalAmount: number): number {
    if (hours >= 48) return originalAmount;
    if (hours >= 24) return originalAmount * 0.5;
    return 0;
  }

  const handleSubmit = async () => {
    console.log('Starting modification submission:', { type, bookingId: booking.id, reason, selectedDate, selectedTime });
    
    if (!reason.trim()) {
      toast({
        title: 'Fout',
        description: 'Geef een reden op voor de wijziging.',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'reschedule') {
      if (!selectedDate || !selectedTime) {
        toast({
          title: 'Fout',
          description: 'Selecteer een nieuwe datum en tijd.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (type === 'cancel' && !canCancel) {
      toast({
        title: 'Fout',
        description: 'Annuleringen moeten minimaal 24 uur van tevoren worden gemaakt.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Step 1: Updating booking status to pending');
      
      // Update booking status to pending when modification is requested
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'pending' })
        .eq('id', booking.id);

      if (bookingError) {
        console.error('Error updating booking status:', bookingError);
        throw bookingError;
      }

      console.log('Step 2: Creating booking modification record');

      // Create the full date-time for reschedule
      let requestedDateTime = null;
      if (type === 'reschedule' && selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        requestedDateTime = new Date(selectedDate);
        requestedDateTime.setHours(hours, minutes, 0, 0);
      }

      const modificationData = {
        booking_id: booking.id,
        modification_type: type,
        reason,
        refund_amount: type === 'cancel' ? refundAmount : 0,
        ...(type === 'reschedule' && requestedDateTime && { requested_date_time: requestedDateTime.toISOString() })
      };

      console.log('Modification data:', modificationData);

      const { error: modificationError } = await supabase
        .from('booking_modifications')
        .insert(modificationData);

      if (modificationError) {
        console.error('Error creating modification record:', modificationError);
        throw modificationError;
      }

      console.log('Step 3: Sending notification email');

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-booking-modification-email', {
        body: {
          bookingId: booking.id,
          modificationType: type,
          reason,
          newDateTime: requestedDateTime?.toISOString() || null,
          refundAmount: type === 'cancel' ? refundAmount : 0
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw here, email is not critical for the modification request
      }

      console.log('Modification request completed successfully');

      toast({
        title: 'Verzoek Verzonden',
        description: `Je ${type === 'reschedule' ? 'verzet' : 'annulerings'}verzoek is verzonden. De boeking status is gewijzigd naar 'wachtend op goedkeuring'.`,
      });

      onSuccess();
      onOpenChange(false);
      setReason('');
      setSelectedDate(undefined);
      setSelectedTime('');
    } catch (error: any) {
      console.error('Error submitting modification:', error);
      toast({
        title: 'Fout',
        description: `Kon verzoek niet verzenden: ${error.message || 'Onbekende fout'}. Probeer het opnieuw.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'reschedule' ? <Calendar className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {type === 'reschedule' ? 'Boeking Verzetten' : 'Boeking Annuleren'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">{booking.services.name}</h3>
            <p className="text-sm text-gray-600">
              Huidige datum: {format(new Date(booking.date_time), 'EEEE d MMMM yyyy HH:mm', { locale: nl })}
            </p>
            <p className="text-sm text-gray-600">
              Duur: {booking.services.duration} minuten • Prijs: €{booking.services.price}
            </p>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Let op:</strong> Na het indienen van dit verzoek wordt de boeking status gewijzigd naar "Wachtend op Goedkeuring" totdat een admin het verzoek behandelt.
            </AlertDescription>
          </Alert>

          {type === 'cancel' && (
            <Alert className={canCancel ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {canCancel ? (
                  <>
                    <strong>Restitutie Bedrag: €{refundAmount}</strong>
                    <br />
                    {hoursUntilBooking >= 48 && 'Volledige restitutie (48+ uur van tevoren)'}
                    {hoursUntilBooking >= 24 && hoursUntilBooking < 48 && '50% restitutie (24-48 uur van tevoren)'}
                  </>
                ) : (
                  <>
                    <strong>Geen restitutie beschikbaar</strong>
                    <br />
                    Annuleringen moeten minimaal 24 uur van tevoren worden gemaakt.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {type === 'reschedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selecteer nieuwe datum en tijd</h3>
              <CustomCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                serviceDuration={booking.services.duration}
                onConfirm={() => {}} // We handle confirmation in handleSubmit
                serviceId={booking.service_id}
              />
            </div>
          )}

          <div>
            <Label htmlFor="reason">Reden voor {type === 'reschedule' ? 'verzetten' : 'annuleren'}</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Leg uit waarom je deze boeking wilt ${type === 'reschedule' ? 'verzetten' : 'annuleren'}...`}
              className="resize-none mt-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuleren
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || (type === 'cancel' && !canCancel) || (type === 'reschedule' && (!selectedDate || !selectedTime))}
              className="flex-1"
            >
              {loading ? 'Verzenden...' : `${type === 'reschedule' ? 'Verzet' : 'Annulerings'}verzoek Verzenden`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
