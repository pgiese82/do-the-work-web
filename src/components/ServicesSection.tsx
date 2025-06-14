import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Apple, Heart } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import BookingForm from '@/components/booking/BookingForm';

const ServicesSection = () => {
  const {
    ref: titleRef,
    isVisible: titleVisible
  } = useScrollAnimation<HTMLDivElement>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const {
    user
  } = useAuth();

  const services = [{
    id: '1-op-1-coaching',
    icon: Users,
    title: '1-op-1 coaching',
    description: 'Samen maken we een plan dat bij jou past. Persoonlijke begeleiding die werkt met jouw agenda.',
    features: ['• Plan op maat voor jou', '• Elke week even bijpraten', '• WhatsApp me wanneer je wilt', '• Training én voeding geregeld'],
    price: '€197',
    period: '/maand'
  }, {
    id: 'online-trainings-schemas',
    icon: Calendar,
    title: 'Online trainings-schema\'s',
    description: 'Klaar-voor-gebruik schema\'s die je thuis of in de sportschool kunt doen. Perfect als je zelf aan de slag wilt.',
    features: ['• 12 weken complete programma\'s', '• Video\'s die alles uitleggen', '• Bijhouden hoe je vooruitgaat', '• Alles in een handige app'],
    price: '€67',
    period: '/maand'
  }, {
    id: 'persoonlijke-voedings-schemas',
    icon: Apple,
    title: 'Persoonlijke voedings-schema\'s',
    description: 'Geen dieet, maar een manier van eten die bij jouw leven past. Lekker eten én afvallen kan gewoon.',
    features: ['• Voedingsplan speciaal voor jou', '• Recepten en boodschappenlijst', '• Uitleg over wat je lichaam nodig heeft', '• Elke maand even checken hoe het gaat'],
    price: '€97',
    period: '/maand'
  }, {
    id: 'boksen-voor-parkinson',
    icon: Heart,
    title: 'Boksen voor Parkinson',
    description: 'Speciale bokstraining voor mensen met Parkinson. Helpt bij balans, coördinatie en zelfvertrouwen.',
    features: ['• Technieken aangepast voor jou', '• In groepjes of alleen', '• Veilig en medisch verantwoord', '• Familie mag meedoen'],
    price: '€127',
    period: '/maand'
  }];

  const handleBookService = (serviceId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedServiceId(serviceId);
    setBookingFormOpen(true);
  };

  return <section className="py-16 md:py-20 lg:py-24 xl:py-32 bg-slate-50" id="services">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 scroll-fade-in ${titleVisible ? 'visible' : ''}`}>
          <Badge className="mb-4 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto text-sm md:text-base">Diensten</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 lg:mb-8 text-slate-900 px-4">
            Kies je
            <span className="block text-orange-600">transformatie</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto px-4">
            Verschillende wegen naar hetzelfde doel: een fittere, sterkere, zelfverzekerder jij. Boek direct online.
          </p>
          
          {!user && <Button onClick={() => setAuthModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white min-h-[44px] md:min-h-[52px] lg:min-h-[60px] px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 text-base md:text-lg mt-6">
              Inloggen om te boeken
            </Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
          {services.map((service, index) => {
          const IconComponent = service.icon;
          const {
            ref,
            isVisible
          } = useScrollAnimation<HTMLDivElement>({
            delay: index * 200
          });
          return <Card key={index} ref={ref} className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white scroll-fade-in scroll-stagger-${index + 1} ${isVisible ? 'visible' : ''}`} style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-6 md:p-8 lg:p-10 flex flex-col flex-grow">
                    {/* Icon */}
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 md:mb-8 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-orange-600 group-hover:text-white" />
                    </div>
                    
                    {/* Title - Increased height for better wrapping */}
                    <div className="h-20 md:h-24 lg:h-28 mb-4 md:mb-6">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">{service.title}</h3>
                    </div>
                    
                    {/* Description - Increased height to prevent overlap */}
                    <div className="h-24 md:h-28 lg:h-32 mb-6 md:mb-8">
                      <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Features - Fixed height */}
                    <div className="h-24 md:h-28 lg:h-32 mb-8 md:mb-10">
                      <ul className="text-sm md:text-base text-slate-500 space-y-2 md:space-y-3">
                        {service.features.map((feature, featureIndex) => <li key={featureIndex}>{feature}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Price and button - Fixed at bottom */}
                  <div className="bg-slate-50 p-6 md:p-8 lg:p-10 border-t mt-auto">
                    <div className="text-center mb-6 md:mb-8">
                      <div className="text-3xl md:text-4xl lg:text-5xl font-black text-orange-600 mb-1 md:mb-2">{service.price}</div>
                      <div className="text-slate-500 text-sm md:text-base">{service.period}</div>
                    </div>
                    <Button onClick={() => handleBookService(service.id)} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold min-h-[44px] md:min-h-[52px] lg:min-h-[60px] text-base md:text-lg transition-all duration-300 hover:scale-105">
                      Boek Nu
                    </Button>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      
      <BookingForm open={bookingFormOpen} onOpenChange={setBookingFormOpen} serviceId={selectedServiceId} />
    </section>;
};

export default ServicesSection;
