import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ContactForm from '@/components/ContactForm';
const FinalCTASection = () => {
  const {
    ref: contentRef,
    isVisible: contentVisible
  } = useScrollAnimation<HTMLDivElement>();
  const {
    ref: contactRef,
    isVisible: contactVisible
  } = useScrollAnimation<HTMLDivElement>({
    delay: 300
  });
  const {
    ref: formRef,
    isVisible: formVisible
  } = useScrollAnimation<HTMLDivElement>({
    delay: 600
  });
  return <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white py-16 md:py-20 lg:py-24 xl:py-32" id="contact">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div ref={contentRef} className={`text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 scroll-fade-in ${contentVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 lg:mb-8 leading-tight px-4">
            Stop met wachten.
            <span className="block text-orange-400">Start vandaag.</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 md:mb-8 lg:mb-10 text-gray-300 max-w-4xl mx-auto px-4">
            Je hebt twee keuzes: blijven zoals je bent, of de stap zetten naar de persoon die je wilt worden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 justify-center mb-8 md:mb-12 lg:mb-16 px-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg md:text-xl lg:text-2xl px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 h-auto transition-all duration-300 hover:scale-105 min-h-[44px] md:min-h-[52px] lg:min-h-[60px] w-full sm:w-auto">
              Ja, ik wil starten
            </Button>
            <Button variant="outline" size="lg" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-slate-900 text-lg md:text-xl lg:text-2xl px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 h-auto transition-all duration-300 min-h-[44px] md:min-h-[52px] lg:min-h-[60px] w-full sm:w-auto">
              Gratis kennismaking
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <div ref={formRef} className={`mb-12 md:mb-16 lg:mb-20 xl:mb-24 scroll-fade-in ${formVisible ? 'visible' : ''}`}>
          <ContactForm />
        </div>
        
        
      </div>
    </section>;
};
export default FinalCTASection;