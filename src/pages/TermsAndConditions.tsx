
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-orange-500 mb-8">
            Algemene Voorwaarden
          </h1>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              Welkom bij Do The Work. Deze algemene voorwaarden zijn van toepassing op alle diensten die wij aanbieden. Door gebruik te maken van onze diensten, ga je akkoord met deze voorwaarden.
            </p>
            <h2 className="text-2xl font-bold text-white pt-4">
              1. Toepasselijkheid
            </h2>
            <p>
              Deze voorwaarden zijn van toepassing op elke overeenkomst tussen Do The Work en een klant. Afwijkingen zijn alleen geldig indien schriftelijk overeengekomen.
            </p>
            <h2 className="text-2xl font-bold text-white pt-4">
              2. Aanbod en Prijzen
            </h2>
            <p>
              Alle aanbiedingen zijn vrijblijvend. Prijzen zijn inclusief BTW, tenzij anders vermeld. We behouden ons het recht voor om prijzen te wijzigen.
            </p>
            <h2 className="text-2xl font-bold text-white pt-4">
              3. Betaling
            </h2>
            <p>
              Betaling dient te geschieden volgens de afgesproken termijnen. Bij niet-tijdige betaling is de klant in verzuim en kunnen er extra kosten in rekening worden gebracht.
            </p>
             <h2 className="text-2xl font-bold text-white pt-4">
              4. Annulering
            </h2>
            <p>
             Afspraken dienen minimaal 24 uur van tevoren te worden geannuleerd. Bij latere annulering of het niet verschijnen op een afspraak wordt de sessie volledig in rekening gebracht.
            </p>
            <p className="pt-4">
              Deze algemene voorwaarden zijn voor het laatst bijgewerkt op 15 juni 2025.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
