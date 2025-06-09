
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CustomCalendar from './CustomCalendar';
import BookingConfirmation from './BookingConfirmation';

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string | null;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
}

interface BookingData {
  service: Service;
  date: Date;
  time: string;
}

const BookingForm = ({ open, onOpenChange, serviceId }: BookingFormProps) => {
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (serviceId && open) {
      fetchService();
    }
  }, [serviceId, open]);

  const fetchService = async () => {
    if (!serviceId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij laden service",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToConfirmation = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Niet ingelogd",
        description: "Je moet ingelogd zijn om een boeking te maken.",
      });
      return;
    }

    if (!selectedDate || !selectedTime || !service) {
      toast({
        variant: "destructive",
        title: "Vul alle velden in",
        description: "Selecteer een datum en tijd voor je boeking.",
      });
      return;
    }

    // Prepare booking data for confirmation
    const data: BookingData = {
      service,
      date: selectedDate,
      time: selectedTime
    };

    setBookingData(data);
    setShowConfirmation(true);
  };

  const handleModifyBooking = () => {
    setShowConfirmation(false);
  };

  const handleConfirmBooking = () => {
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime('');
    setBookingData(null);
    setShowConfirmation(false);
    onOpenChange(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Dialog open={open && !showConfirmation} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {service ? `Boek: ${service.name}` : 'Nieuwe boeking'}
            </DialogTitle>
          </DialogHeader>

          {service && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-600">
                Duur: {service.duration} minuten • Prijs: €{service.price}
              </p>
              {service.description && (
                <p className="text-sm text-gray-600 mt-2">{service.description}</p>
              )}
            </div>
          )}

          <CustomCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            serviceDuration={service?.duration || 60}
            onConfirm={handleProceedToConfirmation}
            loading={loading}
            serviceId={serviceId || undefined}
          />
        </DialogContent>
      </Dialog>

      <BookingConfirmation
        open={showConfirmation}
        onOpenChange={handleCloseConfirmation}
        bookingData={bookingData}
        onModify={handleModifyBooking}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
};

export default BookingForm;
