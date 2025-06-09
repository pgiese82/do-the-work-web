
import React from 'react';

interface DesktopNavigationProps {
  scrollToSection: (id: string) => void;
}

export const DesktopNavigation = ({ scrollToSection }: DesktopNavigationProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-12">
      <button
        onClick={() => scrollToSection('about')}
        className="text-gray-200 hover:text-[#ff6b35] transition-colors duration-200 relative group"
      >
        Over mij
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b35] transition-all duration-300 group-hover:w-full"></span>
      </button>
      <button
        onClick={() => scrollToSection('services')}
        className="text-gray-200 hover:text-[#ff6b35] transition-colors duration-200 relative group"
      >
        Services
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b35] transition-all duration-300 group-hover:w-full"></span>
      </button>
      <button
        onClick={() => scrollToSection('boeken')}
        className="text-gray-200 hover:text-[#ff6b35] transition-colors duration-200 relative group"
      >
        Boeken
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b35] transition-all duration-300 group-hover:w-full"></span>
      </button>
      <button
        onClick={() => scrollToSection('succesverhalen')}
        className="text-gray-200 hover:text-[#ff6b35] transition-colors duration-200 relative group"
      >
        Succesverhalen
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b35] transition-all duration-300 group-hover:w-full"></span>
      </button>
      <button
        onClick={() => scrollToSection('contact')}
        className="text-gray-200 hover:text-[#ff6b35] transition-colors duration-200 relative group"
      >
        Contact
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b35] transition-all duration-300 group-hover:w-full"></span>
      </button>
    </nav>
  );
};
