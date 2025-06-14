
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
import { useNavigate } from 'react-router-dom';
import { User as AuthUser } from '@supabase/supabase-js';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AccountSectionProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const AccountSection = ({ user, onLogout }: AccountSectionProps) => {
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

  return (
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
              onClick={handlePortalClick}
              className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              {isAdmin ? 'Beheerportaal' : 'Klantenportaal'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogoutClick}
              className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              Uitloggen
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
  );
};
