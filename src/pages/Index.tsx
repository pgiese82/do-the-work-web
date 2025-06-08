
import React from 'react';
import Header from '@/components/Header';
import DownloadModal from '@/components/DownloadModal';
import BookingSection from '@/components/BookingSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import StatsSection from '@/components/StatsSection';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DownloadModal />
      <WhatsAppButton />
      
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <BookingSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
