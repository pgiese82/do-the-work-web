
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Euro, Users, MessageCircle, Dumbbell, Target, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookingForm from '@/components/booking/BookingForm';
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';
import { ErrorMessage } from '@/components/dashboard/ErrorMessage';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string | null;
  is_active: boolean;
}

const serviceIcons: Record<string, React.ComponentType<any>> = {
  'intake': MessageCircle,
  'training': Dumbbell,
  'boksen': Target,
  'default': Dumbbell
};

const serviceColors: Record<string, string> = {
  'intake': 'from-blue-500 to-blue-600',
  'training': 'from-orange-500 to-orange-600',
  'boksen': 'from-red-500 to-red-600',
  'default': 'from-gray-500 to-gray-600'
};

export function ServiceSelectionPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const { toast } = useToast();

  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    setBookingModalOpen(true);
  };

  const toggleComparison = (serviceId: string) => {
    setSelectedForComparison(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const clearComparison = () => {
    setSelectedForComparison([]);
    setComparisonMode(false);
  };

  const getServiceIcon = (serviceName: string) => {
    const normalizedName = serviceName.toLowerCase();
    if (normalizedName.includes('intake')) return serviceIcons.intake;
    if (normalizedName.includes('training') || normalizedName.includes('1-op-1')) return serviceIcons.training;
    if (normalizedName.includes('boksen')) return serviceIcons.boksen;
    return serviceIcons.default;
  };

  const getServiceColor = (serviceName: string) => {
    const normalizedName = serviceName.toLowerCase();
    if (normalizedName.includes('intake')) return serviceColors.intake;
    if (normalizedName.includes('training') || normalizedName.includes('1-op-1')) return serviceColors.training;
    if (normalizedName.includes('boksen')) return serviceColors.boksen;
    return serviceColors.default;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-black text-white mb-2">
            Kies jouw service
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Er is een probleem opgetreden bij het laden van de services.
          </p>
        </div>
        <ErrorMessage 
          title="Kon services niet laden"
          message="Er is een probleem opgetreden bij het laden van de beschikbare services."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-black text-white mb-2">
            Kies jouw service
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Services worden geladen...
          </p>
        </div>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black text-white mb-2">
          Kies jouw service
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Selecteer de service die het beste bij jouw doelen en behoeften past. 
          Elke optie is ontworpen om je maximale resultaten te geven.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg">
            Er zijn momenteel geen services beschikbaar.
          </p>
        </div>
      ) : (
        <>
          {/* Comparison Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setComparisonMode(!comparisonMode)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {comparisonMode ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Stop vergelijken
                </>
              ) : (
                'Services vergelijken'
              )}
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const IconComponent = getServiceIcon(service.name);
              const colorClass = getServiceColor(service.name);
              const isSelected = selectedForComparison.includes(service.id);
              const isPopular = service.name.toLowerCase().includes('training') || service.name.toLowerCase().includes('1-op-1');
              
              return (
                <Card 
                  key={service.id}
                  className={`relative bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 ${
                    isPopular ? 'ring-2 ring-orange-500/50' : ''
                  } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      Populair
                    </Badge>
                  )}
                  
                  {comparisonMode && (
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => toggleComparison(service.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : '+'}
                      </Button>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{service.name}</CardTitle>
                    <div className="flex items-center justify-center gap-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        <span className="text-2xl font-bold text-white">{service.price}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <CardDescription className="text-gray-300 text-center leading-relaxed">
                      {service.description || 'Geen beschrijving beschikbaar'}
                    </CardDescription>

                    <Button
                      onClick={() => handleBookService(service.id)}
                      className={`w-full bg-gradient-to-r ${colorClass} hover:opacity-90 text-white font-semibold py-3`}
                      disabled={comparisonMode}
                    >
                      {comparisonMode ? 'Selecteer om te vergelijken' : 'Boek deze service'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Panel */}
          {comparisonMode && selectedForComparison.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Service vergelijking
                  <Button variant="outline" size="sm" onClick={clearComparison}>
                    Wissen
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {selectedForComparison.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return null;

                    return (
                      <div key={serviceId} className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-2">{service.name}</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>Prijs: €{service.price}</div>
                          <div>Duur: {service.duration} minuten</div>
                          <div>Prijs per minuut: €{(service.price / service.duration).toFixed(2)}</div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBookService(service.id)}
                          className="mt-3 w-full"
                        >
                          Boeken
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Booking Modal */}
      <BookingForm
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        serviceId={selectedService}
      />
    </div>
  );
}
