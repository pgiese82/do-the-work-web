
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TestimonialsSection = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  const testimonials = [
    {
      text: "In 6 maanden van maat 42 naar 38. Maar belangrijker: ik voel me sterker dan ooit. De aanpak is direct en effectief.",
      name: "Marieke, 34",
      title: "Marketing Manager",
      initial: "M"
    },
    {
      text: "Na 20 jaar geen sport eindelijk weer fit. Het programma paste perfect bij mijn drukke schema als vader van drie.",
      name: "Robert, 45",
      title: "Ondernemer",
      initial: "R"
    },
    {
      text: "Boxing for Parkinson's heeft mijn leven veranderd. Betere balans, meer energie, en vooral: meer zelfvertrouwen.",
      name: "Henk, 62",
      title: "Gepensioneerd",
      initial: "H"
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 xl:py-32 bg-white" id="succesverhalen">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 scroll-fade-in ${titleVisible ? 'visible' : ''}`}>
          <Badge className="mb-4 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto text-sm md:text-base">
            Succesverhalen
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 lg:mb-8 text-slate-900 px-4">
            Echte mensen,
            <span className="block text-orange-600">echte resultaten</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const { ref, isVisible } = useScrollAnimation({ delay: index * 200 });
            return (
              <Card 
                key={index} 
                ref={ref}
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 scroll-fade-in scroll-stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
              >
                <CardContent className="p-6 md:p-8 lg:p-10">
                  <div className="flex items-center mb-4 md:mb-6">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-orange-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 md:mb-8 italic text-sm md:text-base lg:text-lg leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4 md:mr-6 text-lg md:text-xl">
                      {testimonial.initial}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm md:text-base lg:text-lg">{testimonial.name}</div>
                      <div className="text-xs md:text-sm lg:text-base text-slate-500">{testimonial.title}</div>
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

export default TestimonialsSection;
