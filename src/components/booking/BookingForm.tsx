
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CustomCalendar from './CustomCalendar';

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

const BookingForm = ({ open, onOpenChange, serviceId }: BookingFormProps) => {
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
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
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Niet ingelogd",
        description: "Je moet ingelogd zijn om een boeking te maken.",
      });
      return;
    }

    if (!selectedDate || !selectedTime || !serviceId) {
      toast({
        variant: "destructive",
        title: "Vul alle velden in",
        description: "Selecteer een datum en tijd voor je boeking.",
      });
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          date_time: dateTime.toISOString(),
          notes: notes || null,
        });

      if (error) throw error;

      toast({
        title: "Boeking succesvol",
        description: "Je boeking is aangemaakt en wacht op bevestiging.",
      });

      onOpenChange(false);
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setNotes('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Boeking mislukt",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <div className="space-y-6">
          <CustomCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            serviceDuration={service?.duration || 60}
            onConfirm={handleBooking}
            loading={loading}
          />

          <div>
            <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bijzondere wensen of opmerkingen..."
              className="resize-none mt-2"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
