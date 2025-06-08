
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Euro, User, Edit, Trash2, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BookingConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingData: {
    service: {
      id: string;
      name: string;
      duration: number;
      price: number;
      description: string | null;
    };
    date: Date;
    time: string;
    notes?: string;
  } | null;
  onModify: () => void;
  onConfirm: () => void;
}

const BookingConfirmation = ({ 
  open, 
  onOpenChange, 
  bookingData, 
  onModify, 
  onConfirm 
}: BookingConfirmationProps) => {
  const [specialRequests, setSpecialRequests] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && open) {
      fetchUserDetails();
    }
    if (bookingData?.notes) {
      setSpecialRequests(bookingData.notes);
    }
  }, [user, open, bookingData]);

  const fetchUserDetails = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserDetails(data);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleProceedToPayment = async () => {
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Algemene voorwaarden",
        description: "Je moet de algemene voorwaarden accepteren om door te gaan.",
      });
      return;
    }

    if (!bookingData || !user) return;

    setLoading(true);

    try {
      // Combine date and time
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      const dateTime = new Date(bookingData.date);
      dateTime.setHours(hours, minutes, 0, 0);

      // Create booking with special requests
      const finalNotes = [
        bookingData.notes,
        specialRequests,
        emergencyContact ? `Noodcontact: ${emergencyContact}` : ''
      ].filter(Boolean).join('\n\n');

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: bookingData.service.id,
          date_time: dateTime.toISOString(),
          notes: finalNotes || null,
          status: 'confirmed',
          payment_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Boeking bevestigd",
        description: "Je boeking is aangemaakt en wacht op betaling.",
      });

      onConfirm();
      onOpenChange(false);
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

  const handleCancel = () => {
    setSpecialRequests('');
    setEmergencyContact('');
    setTermsAccepted(false);
    onOpenChange(false);
  };

  if (!bookingData) return null;

  const endTime = new Date(bookingData.date);
  const [hours, minutes] = bookingData.time.split(':').map(Number);
  endTime.setHours(hours, minutes + bookingData.service.duration, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Bevestig je boeking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gekozen service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl">{bookingData.service.name}</h3>
                  {bookingData.service.description && (
                    <p className="text-gray-600 mt-1">{bookingData.service.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  €{bookingData.service.price}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Datum</p>
                    <p className="font-medium">
                      {format(bookingData.date, "EEEE d MMMM yyyy", { locale: nl })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Tijd</p>
                    <p className="font-medium">
                      {bookingData.time} - {format(endTime, 'HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duur</p>
                    <p className="font-medium">{bookingData.service.duration} minuten</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Details */}
          {userDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Je gegevens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Naam</Label>
                    <p className="font-medium">{userDetails.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Email</Label>
                    <p className="font-medium">{userDetails.email}</p>
                  </div>
                  {userDetails.phone && (
                    <div>
                      <Label className="text-sm text-gray-500">Telefoon</Label>
                      <p className="font-medium">{userDetails.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aanvullende informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="special-requests">Bijzondere wensen of medische informatie</Label>
                <Textarea
                  id="special-requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Bijvoorbeeld: blessures, allergieën, doelen voor de training..."
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="emergency-contact">Noodcontact (optioneel)</Label>
                <Input
                  id="emergency-contact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Naam en telefoonnummer"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ik ga akkoord met de algemene voorwaarden
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Door deze boeking te bevestigen ga je akkoord met onze{' '}
                    <a href="#" className="text-orange-600 hover:underline">
                      algemene voorwaarden
                    </a>{' '}
                    en{' '}
                    <a href="#" className="text-orange-600 hover:underline">
                      annuleringsbeleid
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Price Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Servicekosten</span>
                  <span>€{bookingData.service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>BTW (21%)</span>
                  <span>€{(bookingData.service.price * 0.21).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Totaal</span>
                  <span>€{(bookingData.service.price * 1.21).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onModify}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Wijzigen
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Annuleren
            </Button>
            
            <Button
              onClick={handleProceedToPayment}
              disabled={!termsAccepted || loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? 'Bezig...' : 'Doorgaan naar betaling'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;
