
import React, { useState, useEffect } from 'react';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Euro, Users, Target } from 'lucide-react';
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
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          <div className="h-5 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('personal') || name.includes('one-on-one')) return Target;
    if (name.includes('group') || name.includes('small')) return Users;
    if (name.includes('nutrition') || name.includes('meal')) return Target;
    return Calendar;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground">Book a Session</h1>
        <p className="text-muted-foreground text-lg">
          Schedule your next training session with DO THE WORK
        </p>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Services Available</h3>
            <p className="text-muted-foreground">
              No training sessions are currently available for booking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const ServiceIcon = getServiceIcon(service.name);
            return (
              <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ServiceIcon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                      €{service.price}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-2">
                    {service.description || "Professional training session tailored to your needs"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span className="font-medium">€{service.price}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleBookService(service.id)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BookingForm
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        serviceId={selectedServiceId}
      />
    </div>
  );
}
