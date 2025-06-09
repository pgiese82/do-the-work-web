
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInHours } from 'date-fns';
import { nl } from 'date-fns/locale';
import { RescheduleBookingModal } from './RescheduleBookingModal';

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
  const [loading, setLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const { toast } = useToast();

  if (!booking) return null;

  const hoursUntilBooking = differenceInHours(new Date(booking.date_time), new Date());
  const canModify = hoursUntilBooking >= 24;
  
  function calculateRefund(hours: number, originalAmount: number): number {
    if (hours >= 48) return originalAmount;
    if (hours >= 24) return originalAmount * 0.5;
    return 0;
  }

  const refundAmount = calculateRefund(hoursUntilBooking, booking.services.price);

  const handleSubmitCancellation = async () => {
    if (!canModify) {
      toast({
        title: 'Fout',
        description: 'Wijzigingen moeten minimaal 24 uur van tevoren worden gemaakt.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Update booking status to cancelled directly
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // Create modification record
      const { error: modificationError } = await supabase
        .from('booking_modifications')
        .insert({
          booking_id: booking.id,
          modification_type: 'cancel',
          reason: 'Klant heeft afspraak geannuleerd',
          refund_amount: refundAmount,
          status: 'approved', // Auto-approve the cancellation
        });

      if (modificationError) throw modificationError;

      toast({
        title: 'Afspraak geannuleerd',
        description: 'Je afspraak is succesvol geannuleerd.',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Fout',
        description: `Kon verzoek niet verzenden: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleClick = () => {
    if (type === 'reschedule') {
      setShowReschedule(true);
      onOpenChange(false);
    }
  };

  if (type === 'reschedule' && open) {
    handleRescheduleClick();
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Boeking Annuleren
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Booking Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">{booking.services.name}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.date_time), 'EEEE d MMMM yyyy HH:mm', { locale: nl })}
              </p>
              <p className="text-sm text-gray-600">
                {booking.services.duration} minuten • €{booking.services.price}
              </p>
            </div>

            {/* Refund Info for Cancellation */}
            <Alert className={canModify ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {canModify ? (
                  <>
                    <strong>Restitutie: €{refundAmount}</strong>
                    <br />
                    {hoursUntilBooking >= 48 && 'Volledige restitutie (48+ uur van tevoren)'}
                    {hoursUntilBooking >= 24 && hoursUntilBooking < 48 && '50% restitutie (24-48 uur van tevoren)'}
                  </>
                ) : (
                  <>
                    <strong>Geen restitutie mogelijk</strong>
                    <br />
                    Annuleringen moeten minimaal 24 uur van tevoren worden gemaakt.
                  </>
                )}
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={loading}
              >
                Terug
              </Button>
              <Button
                onClick={handleSubmitCancellation}
                disabled={loading || !canModify}
                className="flex-1"
                variant="destructive"
              >
                {loading ? 'Bezig...' : 'Bevestig Annulering'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RescheduleBookingModal
        open={showReschedule}
        onOpenChange={setShowReschedule}
        booking={booking}
        onSuccess={onSuccess}
      />
    </>
  );
}
