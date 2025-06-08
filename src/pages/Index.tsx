import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Dumbbell, Users, Calendar, Apple, Heart, Phone, Mail, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import DownloadModal from '@/components/DownloadModal';
import BookingSection from '@/components/BookingSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import StatsSection from '@/components/StatsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DownloadModal />
      <WhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 text-white pt-20 min-h-screen flex items-center">
        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden">
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
          <div className="max-w-5xl mx-auto text-center">
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

      {/* Stats Section */}
      <StatsSection />

      {/* About Section */}
      <section className="py-10 md:py-20 bg-white" id="over-mij">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit">
                Over mij
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-900 leading-tight">
                Dominique (27)
                <span className="block text-orange-600">Gecertificeerde personal trainer</span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-4 md:mb-6 leading-relaxed">
                Ik ben er heilig van overtuigd dat iedereen fit, sterk en zelfverzekerd kan worden. Mijn aanpak is simpel: geen gedoe, gewoon effectieve trainingen en praktisch voedingsadvies dat écht werkt in het dagelijks leven.
              </p>
              <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed">
                Of je nu net begint of al jaren bezig bent - ik help je door alle rommel heen te kijken en te focussen op wat daadwerkelijk resultaat oplevert. Geen smoesjes, geen uitstel - alleen een bewezen aanpak die werkt.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  ))}
                </div>
                <span className="text-slate-600 font-medium text-sm md:text-base">500+ succesverhalen</span>
              </div>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white min-h-[44px] px-6 py-3 w-full sm:w-auto">
                Lees mijn verhaal
              </Button>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3" 
                  alt="Diverse group training in modern gym" 
                  className="w-full h-[400px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 md:py-20 bg-slate-50" id="services">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto">
              Services
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-900 px-4">
              Kies je
              <span className="block text-orange-600">transformatie</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              Verschillende wegen naar hetzelfde doel: een fittere, sterkere, zelfverzekerder jij.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Users className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">1-op-1 coaching</h3>
                <p className="text-slate-600 mb-6 text-sm md:text-base">
                  Samen maken we een plan dat bij jou past. Persoonlijke begeleiding die werkt met jouw agenda.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Plan op maat voor jou</li>
                  <li>• Elke week even bijpraten</li>
                  <li>• WhatsApp me wanneer je wilt</li>
                  <li>• Training én voeding geregeld</li>
                </ul>
                <div className="text-xl md:text-2xl font-black text-orange-600 mb-4">€197/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 min-h-[44px]">
                  Start nu
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Calendar className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Online trainingsschema's</h3>
                <p className="text-slate-600 mb-6 text-sm md:text-base">
                  Klaar-voor-gebruik schema's die je thuis of in de sportschool kunt doen. Perfect als je zelf aan de slag wilt.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• 12 weken complete programma's</li>
                  <li>• Video's die alles uitleggen</li>
                  <li>• Bijhouden hoe je vooruitgaat</li>
                  <li>• Alles in een handige app</li>
                </ul>
                <div className="text-xl md:text-2xl font-black text-orange-600 mb-4">€67/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 min-h-[44px]">
                  Bekijk schema's
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Apple className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Persoonlijke voedingsschema's</h3>
                <p className="text-slate-600 mb-6 text-sm md:text-base">
                  Geen dieet, maar een manier van eten die bij jouw leven past. Lekker eten én afvallen kan gewoon.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Voedingsplan speciaal voor jou</li>
                  <li>• Recepten en boodschappenlijst</li>
                  <li>• Uitleg over wat je lichaam nodig heeft</li>
                  <li>• Elke maand even checken hoe het gaat</li>
                </ul>
                <div className="text-xl md:text-2xl font-black text-orange-600 mb-4">€97/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 min-h-[44px]">
                  Start gezond
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Heart className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Boksen voor Parkinson</h3>
                <p className="text-slate-600 mb-6 text-sm md:text-base">
                  Speciale bokstraining voor mensen met Parkinson. Helpt bij balans, coördinatie en geeft je zelfvertrouwen terug.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Technieken aangepast voor jou</li>
                  <li>• In groepjes of alleen</li>
                  <li>• Veilig en medisch verantwoord</li>
                  <li>• Familie mag meedoen</li>
                </ul>
                <div className="text-xl md:text-2xl font-black text-orange-600 mb-4">€127/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 min-h-[44px]">
                  Meer info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <BookingSection />

      {/* Testimonials Section */}
      <section className="py-10 md:py-20 bg-white" id="succesverhalen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto">
              Succesverhalen
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-900 px-4">
              Echte mensen,
              <span className="block text-orange-600">echte resultaten</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic text-sm md:text-base">
                  "In 6 maanden van maat 42 naar 38. Maar belangrijker: ik voel me sterker dan ooit. De aanpak is direct en effectief."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm md:text-base">Marieke, 34</div>
                    <div className="text-xs md:text-sm text-slate-500">Marketing Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic text-sm md:text-base">
                  "Na 20 jaar geen sport eindelijk weer fit. Het programma paste perfect bij mijn drukke schema als vader van drie."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm md:text-base">Robert, 45</div>
                    <div className="text-xs md:text-sm text-slate-500">Ondernemer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic text-sm md:text-base">
                  "Boxing for Parkinson's heeft mijn leven veranderd. Betere balans, meer energie, en vooral: meer zelfvertrouwen."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4">
                    H
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm md:text-base">Henk, 62</div>
                    <div className="text-xs md:text-sm text-slate-500">Gepensioneerd</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white py-10 md:py-20" id="contact">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight px-4">
            Stop met wachten.
            <span className="block text-orange-400">Start vandaag.</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-300 max-w-3xl mx-auto px-4">
            Je hebt twee keuzes: blijven zoals je bent, of de stap zetten naar de persoon die je wilt worden.
          </p>
          <div className="flex flex-col gap-4 justify-center mb-8 md:mb-12 px-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-6 md:px-8 py-3 md:py-4 h-auto transition-all duration-300 hover:scale-105 min-h-[44px] w-full sm:w-auto">
              Ja, ik wil starten
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-6 md:px-8 py-3 md:py-4 h-auto transition-all duration-300 min-h-[44px] w-full sm:w-auto">
              Gratis kennismaking
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[44px]">
              <Phone className="w-6 h-6 mr-3 text-orange-400 flex-shrink-0" />
              <span className="text-base md:text-lg">+31 6 12345678</span>
            </div>
            <div className="flex items-center justify-center min-h-[44px]">
              <Mail className="w-6 h-6 mr-3 text-orange-400 flex-shrink-0" />
              <span className="text-base md:text-lg">info@dothework.nl</span>
            </div>
            <div className="flex items-center justify-center min-h-[44px]">
              <MapPin className="w-6 h-6 mr-3 text-orange-400 flex-shrink-0" />
              <span className="text-base md:text-lg">Amsterdam, Nederland</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-orange-500 mr-3" />
            <span className="text-xl md:text-2xl font-black">DO THE WORK</span>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            © 2024 Do The Work. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
