
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInHours } from 'date-fns';
import { nl } from 'date-fns/locale';

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
  const [newDateTime, setNewDateTime] = useState('');
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
    if (!reason.trim()) {
      toast({
        title: 'Fout',
        description: 'Geef een reden op voor de wijziging.',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'reschedule' && !newDateTime) {
      toast({
        title: 'Fout',
        description: 'Selecteer een nieuwe datum en tijd.',
        variant: 'destructive',
      });
      return;
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
      const modificationData = {
        booking_id: booking.id,
        modification_type: type,
        reason,
        refund_amount: type === 'cancel' ? refundAmount : 0,
        ...(type === 'reschedule' && { requested_date_time: newDateTime })
      };

      const { error } = await supabase
        .from('booking_modifications')
        .insert(modificationData);

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke('send-booking-modification-email', {
        body: {
          bookingId: booking.id,
          modificationType: type,
          reason,
          newDateTime: type === 'reschedule' ? newDateTime : null,
          refundAmount: type === 'cancel' ? refundAmount : 0
        }
      });

      toast({
        title: 'Verzoek Verzonden',
        description: `Je ${type === 'reschedule' ? 'verzet' : 'annulerings'}verzoek is verzonden en wacht op goedkeuring.`,
      });

      onSuccess();
      onOpenChange(false);
      setReason('');
      setNewDateTime('');
    } catch (error: any) {
      console.error('Error submitting modification:', error);
      toast({
        title: 'Fout',
        description: 'Kon verzoek niet verzenden. Probeer het opnieuw.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
            <div>
              <Label htmlFor="newDateTime">Nieuwe Datum & Tijd</Label>
              <Input
                id="newDateTime"
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                className="mt-2"
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
              disabled={loading || (type === 'cancel' && !canCancel)}
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
