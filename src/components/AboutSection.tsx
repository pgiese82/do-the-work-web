import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
  const navigate = useNavigate();
  const {
    ref: contentRef,
    isVisible: contentVisible
  } = useScrollAnimation();

  const {
    ref: imageRef,
    isVisible: imageVisible
  } = useScrollAnimation({
    delay: 200
  });

  return (
    <section className="py-16 md:py-20 lg:py-24 xl:py-32 bg-white" id="about">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center max-w-7xl mx-auto">
          <div ref={contentRef} className={`order-2 lg:order-1 scroll-fade-in ${contentVisible ? 'visible' : ''}`}>
            <Badge className="mb-4 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit text-sm md:text-base">
              Over mij
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 lg:mb-8 text-slate-900 leading-tight">
              Dominique
              <span className="block text-orange-600">Gecertificeerde personal trainer</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 mb-4 md:mb-6 lg:mb-8 leading-relaxed">
              Ik ben er heilig van overtuigd dat iedereen fit, sterk en zelfverzekerd kan worden. Mijn aanpak is simpel: geen gedoe, gewoon effectieve trainingen en praktisch voedingsadvies dat écht werkt in het dagelijks leven.
            </p>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 mb-6 md:mb-8 lg:mb-10 leading-relaxed">Of je nu net begint of al jaren bezig bent, ik help je door alle onzinverhalen heen te kijken en te focussen op wat daadwerkelijk resultaat oplevert. Geen smoesjes, geen uitstel. Alleen een bewezen aanpak die werkt.</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 lg:mb-10">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-orange-500 border-2 md:border-4 border-white flex items-center justify-center">
                    <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white fill-current" />
                  </div>)}
              </div>
              <span className="text-slate-600 font-medium text-sm md:text-base lg:text-lg">500+ succesverhalen</span>
            </div>
            <Button 
              onClick={() => navigate('/mijn-verhaal')}
              className="bg-slate-900 hover:bg-slate-800 text-white min-h-[44px] md:min-h-[52px] lg:min-h-[60px] px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 w-full sm:w-auto text-base md:text-lg"
            >
              Lees mijn verhaal
            </Button>
          </div>
          <div ref={imageRef} className={`relative order-1 lg:order-2 scroll-fade-in scroll-stagger-2 ${imageVisible ? 'visible' : ''}`}>
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" alt="Dominique - Personal trainer in fitness outfit" className="w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
