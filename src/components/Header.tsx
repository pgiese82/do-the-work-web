
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-[#1a1a2e]/90 to-[#16213e]/90 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-black text-white">
            DO THE WORK
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#over-mij" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
            >
              Over mij
            </a>
            <a 
              href="#services" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
            >
              Services
            </a>
            <a 
              href="#succesverhalen" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
            >
              Succesverhalen
            </a>
            <a 
              href="#contact" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
            >
              Contact
            </a>
            <Button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white transition-all duration-300 hover:scale-105">
              Start nu
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-4 pt-4">
              <a 
                href="#over-mij" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Over mij
              </a>
              <a 
                href="#services" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#succesverhalen" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Succesverhalen
              </a>
              <a 
                href="#contact" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white transition-all duration-300 w-fit">
                Start nu
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
