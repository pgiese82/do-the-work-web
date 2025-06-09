
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

interface AccountSectionProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export const AccountSection = ({ user, onLogout }: AccountSectionProps) => {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
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
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              Client Portal
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onLogout}
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
  );
};
