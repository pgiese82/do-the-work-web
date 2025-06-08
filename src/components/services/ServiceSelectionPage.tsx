
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Euro, Users, MessageCircle, Dumbbell, Target, Check, X } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  benefits: string[];
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    id: 'intake-gesprek',
    name: 'Intake Gesprek',
    price: 50,
    duration: 60,
    description: 'Een uitgebreid gesprek om jouw doelen, huidige situatie en persoonlijke behoeften te bespreken. We maken samen een plan dat perfect bij jou past.',
    benefits: [
      'Persoonlijke doelen analyse',
      'Fitheid assessment',
      'Voedingsadvies op maat',
      'Trainingsplan opstellen',
      'Motivatie strategie',
      'Vervolgtraject bepalen'
    ],
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '1-on-1-training',
    name: '1-op-1 Training',
    price: 75,
    duration: 60,
    description: 'Persoonlijke begeleiding tijdens een complete trainingssessie. Volledige aandacht voor jouw techniek, vorm en voortgang.',
    benefits: [
      'Persoonlijke trainer',
      'Aangepaste oefeningen',
      'Techniek verbetering',
      'Voortgang monitoring',
      'Motivatie en coaching',
      'Flexibele planning'
    ],
    icon: Dumbbell,
    color: 'from-orange-500 to-orange-600',
    popular: true
  },
  {
    id: 'boksen',
    name: 'Boksen',
    price: 65,
    duration: 45,
    description: 'Dynamische bokstraining die kracht, conditie en coördinatie verbetert. Perfect voor stress relief en een volledige workout.',
    benefits: [
      'Cardio en kracht',
      'Stress vermindering',
      'Coördinatie training',
      'Zelfvertrouwen boost',
      'Techniek ontwikkeling',
      'Groepsenergie'
    ],
    icon: Target,
    color: 'from-red-500 to-red-600'
  }
];

export function ServiceSelectionPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

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
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => {
          const IconComponent = service.icon;
          const isSelected = selectedForComparison.includes(service.id);
          
          return (
            <Card 
              key={service.id}
              className={`relative bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 ${
                service.popular ? 'ring-2 ring-orange-500/50' : ''
              } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            >
              {service.popular && (
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
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}>
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
                  {service.description}
                </CardDescription>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Wat je krijgt:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleBookService(service.id)}
                  className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white font-semibold py-3`}
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

      {/* Booking Modal */}
      <BookingForm
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        serviceId={selectedService}
      />
    </div>
  );
}
