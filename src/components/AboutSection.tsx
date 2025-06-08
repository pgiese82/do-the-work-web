
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutSection = () => {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ delay: 200 });

  return (
    <section className="py-10 md:py-20 bg-white" id="over-mij">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div ref={contentRef} className={`order-2 lg:order-1 scroll-fade-in ${contentVisible ? 'visible' : ''}`}>
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit">
              Over mij
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-900 leading-tight">
              Dominique (27)
              <span className="block text-orange-600">Gecertificeerde personal trainer</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 mb-4 md:mb-6 leading-relaxed">
              Ik ben er heilig van overtuigd dat iedereen fit, sterk en zelfverzekerd kan worden. Mijn aanpak is simpel: geen gedoe, gewoon effectieve trainingen en praktisch voedingsadvies dat écht werkt in het dagelijks leven.
            </p>
            <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed">
              Of je nu net begint of al jaren bezig bent - ik help je door alle rommel heen te kijken en te focussen op wat daadwerkelijk resultaat oplevert. Geen smoesjes, geen uitstel - alleen een bewezen aanpak die werkt.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-6">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                ))}
              </div>
              <span className="text-slate-600 font-medium text-sm md:text-base">500+ succesverhalen</span>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white min-h-[44px] px-6 py-3 w-full sm:w-auto">
              Lees mijn verhaal
            </Button>
          </div>
          <div ref={imageRef} className={`relative order-1 lg:order-2 scroll-fade-in scroll-stagger-2 ${imageVisible ? 'visible' : ''}`}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3" 
                alt="Diverse group training in modern gym" 
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
