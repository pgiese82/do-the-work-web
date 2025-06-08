import React, { useState, useEffect } from 'react';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Service = Database['public']['Tables']['services']['Row'];

export function BookSession() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')
        .returns<Service[]>();

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading services",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Book a Session</h1>
          <p className="text-gray-300">
            Schedule your next training session with DO THE WORK
          </p>
        </div>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading services...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Book a Session</h1>
        <p className="text-gray-300">
          Schedule your next training session with DO THE WORK
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Available Services</CardTitle>
          <CardDescription className="text-gray-300">
            Choose from our available training sessions and book your preferred time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center text-gray-300 py-8">
              No services available at the moment.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-300">
                        Duration: {service.duration} minutes
                      </p>
                      <p className="text-lg font-semibold text-white">
                        €{service.price}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleBookService(service.id)}
                      className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#ff6b35]/90 hover:to-[#f7931e]/90 text-white"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <BookingForm
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        serviceId={selectedServiceId}
      />
    </div>
  );
}
