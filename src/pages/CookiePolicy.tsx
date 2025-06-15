
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-orange-500 mb-8">
            Cookiebeleid
          </h1>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Deze website, beheerd door Do The Work, maakt gebruik van cookies om de functionaliteit van de site te garanderen en uw gebruikerservaring te verbeteren.
            </p>
            <h2 className="text-2xl font-bold text-foreground pt-4">
              Wat zijn cookies?
            </h2>
            <p>
              Cookies zijn kleine tekstbestanden die door een website op uw computer of mobiele apparaat worden geplaatst wanneer u de site bezoekt.
            </p>
            <h2 className="text-2xl font-bold text-foreground pt-4">
              Welke cookies gebruiken wij?
            </h2>
            <p>
              Wij gebruiken uitsluitend <strong>functionele (of essentiële) cookies</strong>. Deze cookies zijn noodzakelijk om de website correct te laten functioneren. Ze worden bijvoorbeeld gebruikt voor:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Het beheren van uw sessie nadat u bent ingelogd op uw account.</li>
              <li>Het onthouden van bepaalde voorkeuren (indien van toepassing).</li>
            </ul>
            <p>
              Omdat deze cookies strikt noodzakelijk zijn voor de werking van de site, is uw toestemming volgens de wet niet vereist.
            </p>
            <h2 className="text-2xl font-bold text-foreground pt-4">
              Geen tracking cookies
            </h2>
            <p>
              Wij maken <strong>geen</strong> gebruik van analytische, marketing- of trackingcookies van derde partijen zoals Google Analytics, Facebook, etc. Uw surfgedrag wordt niet gevolgd voor commerciële doeleinden.
            </p>
            <p className="pt-4">
              Dit cookiebeleid is voor het laatst bijgewerkt op 15 juni 2025.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
