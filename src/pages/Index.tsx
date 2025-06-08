
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Dumbbell, Users, Calendar, Apple, Heart, Phone, Mail, MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-orange-600 hover:bg-orange-700 text-white text-lg px-6 py-2">
              #DoTheWork
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              ELKE LEEFTIJD.
              <span className="block text-orange-500">ELKE SITUATIE.</span>
              ÉCHTE RESULTATEN.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Of je nu 25 of 65 bent - met de juiste begeleiding bereik je je fitnessdoelen zonder je leven overhoop te gooien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-4 h-auto transition-all duration-300 hover:scale-105">
                Start Vandaag
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4 h-auto transition-all duration-300">
                Gratis Intake
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-black text-slate-900 mb-2">500+</div>
              <div className="text-slate-600 font-medium">Tevreden Klanten</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-black text-slate-900 mb-2">5+</div>
              <div className="text-slate-600 font-medium">Jaar Ervaring</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-black text-slate-900 mb-2">95%</div>
              <div className="text-slate-600 font-medium">Behaalt Doelen</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-black text-slate-900 mb-2">24/7</div>
              <div className="text-slate-600 font-medium">Ondersteuning</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
                Over Mij
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
                Dominique (27)
                <span className="block text-orange-600">Gecertificeerde Personal Trainer</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Ik ben er heilig van overtuigd dat iedereen fit, sterk en zelfverzekerd kan worden. Mijn aanpak is simpel: geen gedoe, gewoon effectieve trainingen en praktisch voedingsadvies dat écht werkt in het dagelijks leven.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Of je nu net begint of al jaren bezig bent - ik help je door alle rommel heen te kijken en te focussen op wat daadwerkelijk resultaat oplevert. Geen smoesjes, geen uitstel - alleen een bewezen aanpak die werkt.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  ))}
                </div>
                <span className="text-slate-600 font-medium">500+ Succesverhalen</span>
              </div>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Lees Mijn Verhaal
              </Button>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1571019613914-85e3cbcc1d9f?ixlib=rb-4.0.3" 
                  alt="Dominique - Personal Trainer" 
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
              Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">
              Kies Je
              <span className="block text-orange-600">Transformatie</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Verschillende wegen naar hetzelfde doel: een fittere, sterkere, zelfverzekerder jij.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Users className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">1-op-1 Coaching</h3>
                <p className="text-slate-600 mb-6">
                  Persoonlijke begeleiding die past bij jouw schema en doelen. Maximale resultaten, minimale tijdsinvestering.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Volledig op maat gemaakt</li>
                  <li>• Wekelijkse check-ins</li>
                  <li>• 24/7 WhatsApp support</li>
                  <li>• Voeding en training plan</li>
                </ul>
                <div className="text-2xl font-black text-orange-600 mb-4">€197/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Start Nu
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Calendar className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Online Plannen</h3>
                <p className="text-slate-600 mb-6">
                  Bewezen trainingsschema's die je thuis of in de gym kunt doen. Perfect voor self-starters.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• 12-week programma's</li>
                  <li>• Video instructies</li>
                  <li>• Progressie tracking</li>
                  <li>• App toegang</li>
                </ul>
                <div className="text-2xl font-black text-orange-600 mb-4">€67/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Bekijk Plannen
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Apple className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Voeding Coaching</h3>
                <p className="text-slate-600 mb-6">
                  Geen dieet, maar een levensstijl. Leer hoe je gezond eet zonder je leven op z'n kop te zetten.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Persoonlijk voedingsplan</li>
                  <li>• Recepten en meal prep</li>
                  <li>• Macro coaching</li>
                  <li>• Maandelijkse evaluatie</li>
                </ul>
                <div className="text-2xl font-black text-orange-600 mb-4">€97/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Start Gezond
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Heart className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Boxing for Parkinson's</h3>
                <p className="text-slate-600 mb-6">
                  Gespecialiseerde boxtraining voor mensen met Parkinson. Verbeter balans, coördinatie en zelfvertrouwen.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Aangepaste technieken</li>
                  <li>• Groeps- en privélessen</li>
                  <li>• Medisch verantwoord</li>
                  <li>• Familiebegeleiding</li>
                </ul>
                <div className="text-2xl font-black text-orange-600 mb-4">€127/maand</div>
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Meer Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
              Succesverhalen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">
              Echte Mensen,
              <span className="block text-orange-600">Echte Resultaten</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">
                  "In 6 maanden van maat 42 naar 38. Maar belangrijker: ik voel me sterker dan ooit. De aanpak is direct en effectief."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Marieke, 34</div>
                    <div className="text-sm text-slate-500">Marketing Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">
                  "Na 20 jaar geen sport eindelijk weer fit. Het programma paste perfect bij mijn drukke schema als vader van drie."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Robert, 45</div>
                    <div className="text-sm text-slate-500">Ondernemer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">
                  "Boxing for Parkinson's heeft mijn leven veranderd. Betere balans, meer energie, en vooral: meer zelfvertrouwen."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-4">
                    H
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Henk, 62</div>
                    <div className="text-sm text-slate-500">Gepensioneerd</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Stop Met Wachten.
            <span className="block text-orange-400">Start Vandaag.</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Je hebt twee keuzes: blijven zoals je bent, of de stap zetten naar de persoon die je wilt worden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-4 h-auto transition-all duration-300 hover:scale-105">
              Ja, Ik Wil Starten
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4 h-auto transition-all duration-300">
              Gratis Kennismaking
            </Button>
          </div>
          
          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <Phone className="w-6 h-6 mr-3 text-orange-400" />
              <span className="text-lg">+31 6 12345678</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-6 h-6 mr-3 text-orange-400" />
              <span className="text-lg">info@dothework.nl</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="w-6 h-6 mr-3 text-orange-400" />
              <span className="text-lg">Amsterdam, Nederland</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-orange-500 mr-3" />
            <span className="text-2xl font-black">DO THE WORK</span>
          </div>
          <p className="text-slate-400">
            © 2024 Do The Work. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
