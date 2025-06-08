
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service ? `Boek: ${service.name}` : 'Nieuwe boeking'}
          </DialogTitle>
        </DialogHeader>

        {service && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-600">
              Duur: {service.duration} minuten • Prijs: €{service.price}
            </p>
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <Label>Datum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: nl })
                  ) : (
                    <span>Selecteer een datum</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time">Tijd</Label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecteer een tijd</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bijzondere wensen of opmerkingen..."
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Bezig...' : 'Boeking bevestigen'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
