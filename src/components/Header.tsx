
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Dumbbell, Shield } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">DO THE WORK</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Over mij
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Contact
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => window.location.href = '/auth'}
              variant="outline"
              className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => scrollToSection('booking')}
              className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#e8851a] text-white"
            >
              Book Nu
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/login'}
              variant="outline"
              size="sm"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            >
              <Shield className="w-4 h-4 mr-1" />
              Admin
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#ff6b35] transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-md border-t border-white/10">
              <button
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Over mij
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Contact
              </button>
              <div className="px-3 py-2 space-y-2">
                <Button
                  onClick={() => window.location.href = '/auth'}
                  variant="outline"
                  className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
                >
                  Login
                </Button>
                <Button
                  onClick={() => scrollToSection('booking')}
                  className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#e8851a] text-white"
                >
                  Book Nu
                </Button>
                <Button
                  onClick={() => window.location.href = '/admin/login'}
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
