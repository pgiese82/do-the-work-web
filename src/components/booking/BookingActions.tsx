
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, X, Download } from 'lucide-react';
import { BookingModificationModal } from './BookingModificationModal';
import { RescheduleBookingModal } from './RescheduleBookingModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { differenceInHours } from 'date-fns';

interface BookingActionsProps {
  booking: {
    id: string;
    date_time: string;
    status: string;
    payment_status: string;
    service_id: string;
    services: {
      name: string;
      price: number;
      duration: number;
    };
  };
  onUpdate: () => void;
}

export function BookingActions({ booking, onUpdate }: BookingActionsProps) {
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [canReschedule, setCanReschedule] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isUpcoming = new Date(booking.date_time) > new Date();
  const hoursUntilBooking = differenceInHours(new Date(booking.date_time), new Date());
  const canCancel = hoursUntilBooking >= 24;

  useEffect(() => {
    checkRescheduleLimit();
  }, [booking.id]);

  const checkRescheduleLimit = async () => {
    try {
      const { data, error } = await supabase.rpc('can_reschedule_booking', {
        booking_id: booking.id
      });

      if (error) throw error;
      setCanReschedule(data);
    } catch (error) {
      console.error('Error checking reschedule limit:', error);
      setCanReschedule(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-receipt', {
        body: { bookingId: booking.id }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${booking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Receipt Downloaded',
        description: 'Your receipt has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: 'Download Failed',
        description: 'Unable to download receipt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>;
  }

  return (
    <>
      <div className="flex gap-2">
        {booking.status !== 'cancelled' && isUpcoming && (
          <>
            {canReschedule && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRescheduleModalOpen(true)}
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
              >
                <Edit className="w-4 h-4 mr-1" />
                Verzetten
              </Button>
            )}
            
            {canCancel && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCancelModalOpen(true)}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-1" />
                Annuleren
              </Button>
            )}
          </>
        )}
        
        {booking.payment_status === 'paid' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadReceipt}
            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
          >
            <Download className="w-4 h-4 mr-1" />
            Receipt
          </Button>
        )}
      </div>

      <RescheduleBookingModal
        open={rescheduleModalOpen}
        onOpenChange={setRescheduleModalOpen}
        booking={booking}
        onSuccess={onUpdate}
      />

      <BookingModificationModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        booking={booking}
        type="cancel"
        onSuccess={onUpdate}
      />
    </>
  );
}
