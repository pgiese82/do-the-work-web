import React, { useState } from 'react';
import { Dumbbell, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
const Footer = () => {
  const [email, setEmail] = useState('');
  const {
    toast
  } = useToast();
  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Bedankt voor je aanmelding!",
        description: "Je ontvangt binnenkort onze nieuwsbrief."
      });
      setEmail('');
    }
  };
  const companyLinks = [{
    name: 'Over ons',
    href: '#over-mij'
  }, {
    name: 'Ons verhaal',
    href: '#'
  }, {
    name: 'Team',
    href: '#'
  }, {
    name: 'Carrière',
    href: '#'
  }];
  const serviceLinks = [{
    name: 'Personal Training',
    href: '#services'
  }, {
    name: 'Groepslessen',
    href: '#services'
  }, {
    name: 'Voedingsadvies',
    href: '#services'
  }, {
    name: 'Online Coaching',
    href: '#services'
  }];
  const quickLinks = [{
    name: 'FAQ',
    href: '#faq'
  }, {
    name: 'Mijn verhaal',
    href: '#mijn-verhaal'
  }];
  const socialLinks = [{
    name: 'Facebook',
    icon: Facebook,
    href: '#'
  }, {
    name: 'Instagram',
    icon: Instagram,
    href: '#'
  }, {
    name: 'LinkedIn',
    icon: Linkedin,
    href: '#'
  }, {
    name: 'Twitter',
    icon: Twitter,
    href: '#'
  }];
  return <footer className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Dumbbell className="w-8 h-8 text-orange-500 mr-3" />
              <span className="text-xl md:text-2xl font-black">DO THE WORK</span>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">Transformeer je leven met gepersonaliseerde fitness coaching. Bereik je doelen met mijn bewezen methodes en persoonlijke begeleiding.</p>
            <div className="space-y-3">
              <div className="flex items-center text-sm md:text-base">
                <Phone className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span>+31 6 12345678</span>
              </div>
              <div className="flex items-center text-sm md:text-base">
                <Mail className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span>info@dothework.nl</span>
              </div>
              <div className="flex items-center text-sm md:text-base">
                <MapPin className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                <span>Amsterdam, Nederland</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-white">Diensten</h3>
            <ul className="space-y-3">
              {serviceLinks.map(link => <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm md:text-base block py-1">
                    {link.name}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm md:text-base block py-1">
                    {link.name}
                  </a>
                </li>)}
            </ul>
            
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-white">Blijf op de hoogte</h3>
            <p className="text-gray-300 text-sm md:text-base">
              Ontvang wekelijks tips, workouts en motivatie direct in je inbox.
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="space-y-4">
              <div className="relative">
                <Input type="email" placeholder="Je e-mailadres" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 h-12" required />
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-sm md:text-base transition-all duration-300 hover:scale-105">
                Aanmelden
              </Button>
            </form>

            <div className="pt-4">
              <h4 className="text-sm font-semibold text-white mb-4">Volg ons</h4>
              <div className="flex space-x-4">
                {socialLinks.map(social => {
                const Icon = social.icon;
                return <a key={social.name} href={social.href} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 hover:scale-110" aria-label={social.name}>
                      <Icon className="w-5 h-5" />
                    </a>;
              })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 Do The Work. Alle rechten voorbehouden.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                Privacybeleid
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                Algemene Voorwaarden
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;