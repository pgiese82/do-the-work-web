
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AdminHeader() {
  const { user, signOut } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      });
    }
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-orange-900/20 bg-gray-900/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-orange-300 font-medium">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-orange-500/20">
                  <AvatarFallback className="bg-orange-500 text-white text-sm">
                    {user?.email ? getUserInitials(user.email) : 'AD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-orange-900/20" align="end">
              <DropdownMenuLabel className="text-orange-300">Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-orange-900/20" />
              <DropdownMenuItem className="text-gray-300 hover:bg-orange-500/10 hover:text-orange-300">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-orange-900/20" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-gray-300 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
