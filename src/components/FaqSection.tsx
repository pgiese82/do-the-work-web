
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const faqData = [
  {
    question: 'Voor wie is "Do The Work" coaching?',
    answer: 'Onze coaching is voor iedereen die serieus aan de slag wil met zijn of haar fysieke en mentale gezondheid. Of je nu een beginner bent of al jaren ervaring hebt, wij maken een plan dat bij jou past.',
  },
  {
    question: 'Wat voor soort trainingen bieden jullie aan?',
    answer: 'Wij bieden een breed scala aan diensten, waaronder 1-op-1 personal training, small group training, voedingsadvies en online coaching. Elke aanpak wordt volledig op jouw doelen en behoeften afgestemd.',
  },
  {
    question: 'Heb ik ervaring nodig om te beginnen?',
    answer: 'Nee, absoluut niet! We begeleiden mensen van alle niveaus. We zorgen voor een veilige en effectieve start, waarbij we je stap voor stap de juiste technieken aanleren.',
  },
  {
    question: 'Hoe kan ik me aanmelden?',
    answer: 'Je kunt je aanmelden door contact met ons op te nemen via de knoppen op de website. We plannen dan een gratis en vrijblijvend intakegesprek om je doelen te bespreken.',
  },
  {
    question: 'Wat zijn de kosten van personal training?',
    answer: 'De kosten zijn afhankelijk van het gekozen traject en de frequentie van de trainingen. Tijdens het intakegesprek bespreken we je wensen en stellen we een passend pakket samen. We bieden verschillende opties om aan diverse budgetten te voldoen.',
  },
];

const FaqSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="faq" ref={ref} className={`py-20 md:py-32 bg-gradient-to-b from-[#16213e] to-[#0f172a] text-white transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Veelgestelde Vragen
          </h2>
          <p className="text-lg text-gray-300">
            Antwoorden op de meest voorkomende vragen. Staat je vraag er niet bij? Neem gerust contact op.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white/5 border border-white/10 rounded-lg px-6 transition-all duration-300 hover:bg-white/10">
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline text-orange-400">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-sm md:text-base leading-relaxed pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
