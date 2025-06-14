
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quote, Heart, Target, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const MijnVerhaal = () => {
  const navigate = useNavigate();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation({ delay: 200 });
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation({ delay: 400 });
  const { ref: journeyRef, isVisible: journeyVisible } = useScrollAnimation({ delay: 200 });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div ref={heroRef} className={`text-center max-w-4xl mx-auto scroll-fade-in ${heroVisible ? 'visible' : ''}`}>
            <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 text-base px-6 py-2">
              Mijn Verhaal
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">
              Van struggle naar
              <span className="block text-orange-400">kracht en passie</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>

      {/* Story Introduction */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            <div ref={storyRef} className={`scroll-fade-in ${storyVisible ? 'visible' : ''}`}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-900">
                Waar het allemaal begon
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" 
                  alt="Dominique in actie tijdens training" 
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <Quote className="w-16 h-16 text-white/20 mx-auto mb-8" />
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed mb-8">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            </blockquote>
            <cite className="text-xl text-white/90">- Dominique</cite>
          </div>
        </div>
      </section>

      {/* Values & Mission */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div ref={valuesRef} className={`text-center mb-16 scroll-fade-in ${valuesVisible ? 'visible' : ''}`}>
            <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 text-base px-6 py-2">
              Mijn Waardes
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-900">
              Wat mij drijft
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Passie</h3>
              <p className="text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Doelgericht</h3>
              <p className="text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Resultaat</h3>
              <p className="text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div ref={journeyRef} className={`text-center mb-16 scroll-fade-in ${journeyVisible ? 'visible' : ''}`}>
            <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 text-base px-6 py-2">
              Mijn Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-900">
              De weg naar succes
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">2018 - Het Begin</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">2020 - Certificering</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">2024 - Do The Work</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Dominique coaching een cliënt" 
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white">
            Klaar om jouw verhaal te schrijven?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/#contact')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
            >
              Start je transformatie
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
            >
              Terug naar home
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MijnVerhaal;
