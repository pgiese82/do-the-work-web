
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import ServicesList from '@/components/services/ServicesList';
import BookingForm from '@/components/booking/BookingForm';

const BookingSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    ref: contentRef,
    isVisible: contentVisible
  } = useScrollAnimation();

  const {
    ref: servicesRef,
    isVisible: servicesVisible
  } = useScrollAnimation({
    delay: 200
  });

  const handleBookService = (serviceId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    setSelectedServiceId(serviceId);
    setBookingFormOpen(true);
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 xl:py-32 bg-slate-50" id="boeken">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div ref={contentRef} className={`text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 scroll-fade-in ${contentVisible ? 'visible' : ''}`}>
          <Badge className="mb-4 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto text-sm md:text-base">
            Services & Boeken
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 md:mb-8 text-slate-900">
            Kies je
            <span className="block text-orange-600">trainingsmethode</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 md:mb-12">
            Van persoonlijke training tot groepslessen. Kies wat bij jou past en boek direct online.
          </p>
          
          {!user && (
            <Button 
              onClick={() => setAuthModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white min-h-[44px] md:min-h-[52px] lg:min-h-[60px] px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 text-base md:text-lg mb-8"
            >
              Inloggen om te boeken
            </Button>
          )}
        </div>

        <div ref={servicesRef} className={`scroll-fade-in scroll-stagger-2 ${servicesVisible ? 'visible' : ''}`}>
          <ServicesList onBookService={handleBookService} />
        </div>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
      />
      
      <BookingForm
        open={bookingFormOpen}
        onOpenChange={setBookingFormOpen}
        serviceId={selectedServiceId}
      />
    </section>
  );
};

export default BookingSection;
