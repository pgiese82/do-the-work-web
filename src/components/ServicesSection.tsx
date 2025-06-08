
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Apple, Heart } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ServicesSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLDivElement>();

  const services = [
    {
      icon: Users,
      title: '1-op-1 coaching',
      description: 'Samen maken we een plan dat bij jou past. Persoonlijke begeleiding die werkt met jouw agenda.',
      features: [
        '• Plan op maat voor jou',
        '• Elke week even bijpraten',
        '• WhatsApp me wanneer je wilt',
        '• Training én voeding geregeld'
      ],
      price: '€197',
      period: '/maand'
    },
    {
      icon: Calendar,
      title: 'Online trainingsschema\'s',
      description: 'Klaar-voor-gebruik schema\'s die je thuis of in de sportschool kunt doen. Perfect als je zelf aan de slag wilt.',
      features: [
        '• 12 weken complete programma\'s',
        '• Video\'s die alles uitleggen',
        '• Bijhouden hoe je vooruitgaat',
        '• Alles in een handige app'
      ],
      price: '€67',
      period: '/maand'
    },
    {
      icon: Apple,
      title: 'Persoonlijke voedingsschema\'s',
      description: 'Geen dieet, maar een manier van eten die bij jouw leven past. Lekker eten én afvallen kan gewoon.',
      features: [
        '• Voedingsplan speciaal voor jou',
        '• Recepten en boodschappenlijst',
        '• Uitleg over wat je lichaam nodig heeft',
        '• Elke maand even checken hoe het gaat'
      ],
      price: '€97',
      period: '/maand'
    },
    {
      icon: Heart,
      title: 'Boksen voor Parkinson',
      description: 'Speciale bokstraining voor mensen met Parkinson. Helpt bij balans, coördinatie en geeft je zelfvertrouwen terug.',
      features: [
        '• Technieken aangepast voor jou',
        '• In groepjes of alleen',
        '• Veilig en medisch verantwoord',
        '• Familie mag meedoen'
      ],
      price: '€127',
      period: '/maand'
    }
  ];

  return (
    <section className="py-10 md:py-20 bg-slate-50" id="services">
      <div className="container mx-auto px-4 md:px-6">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 scroll-fade-in ${titleVisible ? 'visible' : ''}`}>
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto">
            Services
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-900 px-4">
            Kies je
            <span className="block text-orange-600">transformatie</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4">
            Verschillende wegen naar hetzelfde doel: een fittere, sterkere, zelfverzekerder jij.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ delay: index * 200 });
            return (
              <Card 
                key={index} 
                ref={ref}
                className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white scroll-fade-in scroll-stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-orange-600 group-hover:text-white" />
                    </div>
                    
                    {/* Title - Fixed height */}
                    <div className="h-16 mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{service.title}</h3>
                    </div>
                    
                    {/* Description - Fixed height */}
                    <div className="h-20 mb-6">
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Features - Fixed height */}
                    <div className="h-24 mb-8">
                      <ul className="text-sm text-slate-500 space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Price and buttons - Fixed at bottom */}
                  <div className="bg-slate-50 p-6 md:p-8 border-t mt-auto">
                    <div className="text-center mb-6">
                      <div className="text-3xl md:text-4xl font-black text-orange-600 mb-1">{service.price}</div>
                      <div className="text-slate-500 text-sm">{service.period}</div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold min-h-[44px] transition-all duration-300 hover:scale-105">
                        Boek Nu
                      </Button>
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 min-h-[44px]">
                        Meer Info
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
