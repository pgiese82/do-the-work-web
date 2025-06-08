
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard Overview',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Book Session',
    icon: Calendar,
    path: '/dashboard/book',
  },
  {
    title: 'My Bookings',
    icon: BookOpen,
    path: '/dashboard/bookings',
  },
  {
    title: 'Documents',
    icon: FileText,
    path: '/dashboard/documents',
  },
  {
    title: 'Profile Settings',
    icon: Settings,
    path: '/dashboard/profile',
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-white/10">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">DO THE WORK</h2>
            <p className="text-sm text-gray-300">Client Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10" />

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                isActive={location.pathname === item.path}
                className="w-full justify-start text-white hover:bg-white/10 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#ff6b35] data-[active=true]:to-[#f7931e] data-[active=true]:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="bg-white/10" />

      <SidebarFooter className="p-4">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-300">Welcome back,</p>
            <p className="font-semibold text-white truncate">
              {user?.user_metadata?.name || user?.email || 'Guest'}
            </p>
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full bg-transparent border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
