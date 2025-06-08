
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-[#1a1a2e]/90 to-[#16213e]/90 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl md:text-2xl font-black text-white">
            DO THE WORK
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a 
              href="#over-mij" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative text-sm lg:text-base min-h-[44px] flex items-center"
            >
              Over mij
            </a>
            <a 
              href="#services" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative text-sm lg:text-base min-h-[44px] flex items-center"
            >
              Services
            </a>
            <a 
              href="#succesverhalen" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative text-sm lg:text-base min-h-[44px] flex items-center"
            >
              Succesverhalen
            </a>
            <a 
              href="#contact" 
              className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative text-sm lg:text-base min-h-[44px] flex items-center"
            >
              Contact
            </a>
            
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-[#ff6b35] hover:bg-white/10 min-h-[44px]"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-white/10 backdrop-blur-md border-white/20">
                  <div className="space-y-2">
                    <div className="px-2 py-1.5 text-sm text-white border-b border-white/20">
                      {user.user_metadata?.name || user.email}
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Uitloggen
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button 
                onClick={handleAuthClick}
                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white transition-all duration-300 hover:scale-105 min-h-[44px] text-sm lg:text-base px-4 lg:px-6"
              >
                Inloggen
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 pt-4">
              <a 
                href="#over-mij" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative min-h-[44px] flex items-center px-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Over mij
              </a>
              <a 
                href="#services" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative min-h-[44px] flex items-center px-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#succesverhalen" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative min-h-[44px] flex items-center px-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Succesverhalen
              </a>
              <a 
                href="#contact" 
                className="nav-link text-white hover:text-[#ff6b35] transition-colors duration-300 relative min-h-[44px] flex items-center px-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              
              {user ? (
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="px-2 py-2 text-white text-sm">
                    {user.user_metadata?.name || user.email}
                  </div>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-red-400 hover:bg-red-500/10 min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Uitloggen
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    handleAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white transition-all duration-300 w-full mt-4 min-h-[44px] text-base"
                >
                  Inloggen
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
