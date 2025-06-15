
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as AuthUser } from '@supabase/supabase-js';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface MobileMenuProps {
  isOpen: boolean;
  user: AuthUser | null;
  scrollToSection: (id: string) => void;
  onLogout: () => void;
}

export const MobileMenu = ({ isOpen, user, scrollToSection, onLogout }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  const handleAccountClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  const handlePortalClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    // Navigation to homepage happens in the parent Header component
  };

  if (!isOpen) return null;

  return (
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
          Diensten
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
                onClick={handlePortalClick}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                {isAdmin ? 'Beheerportaal' : 'Klantenportaal'}
              </Button>
              <Button
                onClick={handleLogoutClick}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                Uitloggen
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
  );
};
