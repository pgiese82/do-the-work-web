
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FinalCTASection = () => {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation({ delay: 300 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white py-10 md:py-20" id="contact">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <div ref={contentRef} className={`scroll-fade-in ${contentVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight px-4">
            Stop met wachten.
            <span className="block text-orange-400">Start vandaag.</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-300 max-w-3xl mx-auto px-4">
            Je hebt twee keuzes: blijven zoals je bent, of de stap zetten naar de persoon die je wilt worden.
          </p>
          <div className="flex flex-col gap-4 justify-center mb-8 md:mb-12 px-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-6 md:px-8 py-3 md:py-4 h-auto transition-all duration-300 hover:scale-105 min-h-[44px] w-full sm:w-auto">
              Ja, ik wil starten
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-6 md:px-8 py-3 md:py-4 h-auto transition-all duration-300 min-h-[44px] w-full sm:w-auto">
              Gratis kennismaking
            </Button>
          </div>
        </div>
        
        <div ref={contactRef} className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto scroll-fade-in scroll-stagger-2 ${contactVisible ? 'visible' : ''}`}>
          <div className="flex items-center justify-center min-h-[44px]">
            <Phone className="w-6 h-6 mr-3 text-orange-400 flex-shrink-0" />
            <span className="text-base md:text-lg">+31 6 12345678</span>
          </div>
          <div className="flex items-center justify-center min-h-[44px]">
            <Mail className="w-6 h-6 mr-3 text-orange-400 flex-shrink-0" />
            <span className="text-base md:text-lg">info@dothework.nl</span>
          </div>
          <div className="flex items-center justify-center min-h-[44px]">
            <MapPin className="w-6 h-6 mr-3 text-orange-400 flex-shrink-0" />
            <span className="text-base md:text-lg">Amsterdam, Nederland</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
