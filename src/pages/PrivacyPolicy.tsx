
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-orange-500 mb-8">
            Privacybeleid
          </h1>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Dit is het privacybeleid van Do The Work. In dit document leggen we uit welke persoonsgegevens we verzamelen en gebruiken en met welk doel. We raden je aan dit beleid zorgvuldig te lezen.
            </p>
            <h2 className="text-2xl font-bold text-foreground pt-4">
              Welke gegevens verzamelen we?
            </h2>
            <p>
              Wanneer je gebruikmaakt van onze diensten, je aanmeldt voor de nieuwsbrief, of contact met ons opneemt, kunnen we de volgende gegevens verzamelen:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Naam</li>
              <li>E-mailadres</li>
              <li>Telefoonnummer</li>
              <li>Gegevens met betrekking tot je gezondheid en fitnessdoelen (alleen na expliciete toestemming)</li>
              <li>Betalingsgegevens</li>
            </ul>
            <h2 className="text-2xl font-bold text-foreground pt-4">
              Hoe gebruiken we je gegevens?
            </h2>
            <p>
              We gebruiken je gegevens voor het uitvoeren van onze diensten, het verwerken van betalingen, het versturen van nieuwsbrieven en om contact met je op te nemen.
            </p>
            <h2 className="text-2xl font-bold text-foreground pt-4">
              Jouw rechten
            </h2>
            <p>
              Je hebt het recht om je persoonsgegevens in te zien, te corrigeren of te verwijderen. Neem hiervoor contact met ons op via de contactgegevens op onze website.
            </p>
            <p className="pt-4">
              Dit privacybeleid is voor het laatst bijgewerkt op 15 juni 2025.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
