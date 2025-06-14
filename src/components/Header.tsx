
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DesktopNavigation } from './header/DesktopNavigation';
import { AccountSection } from './header/AccountSection';
import { MobileMenu } from './header/MobileMenu';
import { MobileMenuButton } from './header/MobileMenuButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Now clickable */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="text-xl font-bold text-white tracking-wide hover:text-orange-400 transition-colors cursor-pointer"
            >
              DO THE WORK
            </button>
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation scrollToSection={scrollToSection} />

          {/* Desktop Account Section */}
          <AccountSection user={user} onLogout={handleLogout} />

          {/* Mobile menu button */}
          <MobileMenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {/* Mobile Navigation */}
        <MobileMenu 
          isOpen={isMenuOpen} 
          user={user} 
          scrollToSection={scrollToSection} 
          onLogout={handleLogout} 
        />
      </div>
    </header>
  );
};

export default Header;
