
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleAccountClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white tracking-wide">DO THE WORK</span>
          </div>

          {/* Desktop Navigation */}
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
              onClick={() => scrollToSection('testimonials')}
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

          {/* Desktop Account Section */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#ff6b35] hover:bg-white/10 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-900/95 border-white/10 text-white">
                  <DropdownMenuLabel className="text-gray-300">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    Client Portal
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleAccountClick}
                variant="ghost"
                className="text-white hover:text-[#ff6b35] hover:bg-white/10 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Account
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#ff6b35] transition-colors duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 backdrop-blur-md">
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                Over mij
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                Succesverhalen
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                Contact
              </button>
              <div className="px-3 py-2 space-y-2 border-t border-white/10 mt-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-gray-300 text-sm px-3 py-2">
                      {user.email}
                    </div>
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Client Portal
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAccountClick}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
