import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Use the exact type from the database schema
type DatabaseService = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function BookSession() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['active-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Services fetch error:', error);
        throw error;
      }
      
      return (data as DatabaseService[]) || [];
    }
  });

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowBookingForm(true);
  };

  const handleCloseBooking = () => {
    setShowBookingForm(false);
    setSelectedServiceId(null);
  };

  if (error) {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Kon services niet laden</h2>
          <p className="text-muted-foreground">Er is een probleem opgetreden bij het laden van de beschikbare services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Sessie Boeken</h1>
          <p className="text-muted-foreground">Boek je volgende training sessie</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Er zijn momenteel geen services beschikbaar voor boeking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between min-h-[3rem]">
                  <span className="flex-1 leading-tight">{service.name}</span>
                  <span className="text-lg font-bold text-primary ml-4">€{service.price}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {service.duration} minuten
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="flex-1 space-y-4">
                  {service.description && (
                    <div className="min-h-[4rem] flex items-start">
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Direct beschikbaar
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <Button 
                    onClick={() => handleBookService(service.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Boek Nu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BookingForm
        open={showBookingForm}
        onOpenChange={handleCloseBooking}
        serviceId={selectedServiceId}
      />
    </div>
  );
}

export default BookSession;
