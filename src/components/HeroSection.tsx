
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useParallax, useScrollAnimation } from '@/hooks/useScrollAnimation';

const HeroSection = () => {
  const parallaxRef = useParallax(-0.3);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ delay: 300 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 text-white pt-20 min-h-screen flex items-center">
      {/* Parallax animated floating elements */}
      <div ref={parallaxRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-500/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-orange-400/40 rounded-full animate-float-fast"></div>
        <div className="absolute top-60 left-1/3 w-5 h-5 bg-indigo-500/25 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-60 right-1/3 w-4 h-4 bg-purple-400/30 rounded-full animate-float-medium"></div>
        <div className="absolute top-32 right-40 w-7 h-7 bg-orange-300/20 rounded-full animate-float-fast"></div>
      </div>
      
      {/* Particle animation background */}
      <div className="absolute inset-0">
        <div className="particles">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="relative container mx-auto px-4 md:px-6 py-10 md:py-20">
        <div ref={contentRef} className={`max-w-5xl mx-auto text-center scroll-fade-in ${contentVisible ? 'visible' : ''}`}>
          <Badge className="mb-6 md:mb-8 bg-orange-600/20 border border-orange-500/30 hover:bg-orange-600/30 text-orange-200 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 backdrop-blur-sm min-h-[44px] flex items-center justify-center">
            #DoTheWork
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black mb-6 md:mb-8 leading-[0.9] tracking-tight">
            Elke leeftijd.
            <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Elke situatie.
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl mt-2 md:mt-4">
              Échte resultaten.
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed font-light px-4">
            Of je nu 25 of 65 bent - met de juiste begeleiding bereik je je fitnessdoelen zonder je leven overhoop te gooien.
          </p>
          <div className="flex flex-col gap-4 md:gap-6 justify-center px-4">
            <button className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg md:text-xl font-bold px-8 md:px-10 py-4 md:py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-orange-500/25 min-h-[44px] w-full sm:w-auto">
              <span className="relative z-10">Start vandaag</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="group relative overflow-hidden border-2 border-white/30 hover:border-orange-400 text-white hover:text-orange-300 text-lg md:text-xl font-bold px-8 md:px-10 py-4 md:py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm bg-white/5 hover:bg-white/10 min-h-[44px] w-full sm:w-auto">
              <span className="relative z-10">Gratis intake</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
