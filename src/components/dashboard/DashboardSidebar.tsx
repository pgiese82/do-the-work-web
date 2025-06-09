
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarCheck, 
  FileText, 
  Settings, 
  LogOut,
  Dumbbell,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats"
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: ShoppingBag,
    description: "Browse services"
  },
  {
    title: "Book Session",
    url: "/dashboard/book",
    icon: Calendar,
    description: "Schedule training"
  },
  {
    title: "My Bookings",
    url: "/dashboard/bookings",
    icon: CalendarCheck,
    description: "View sessions"
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: FileText,
    description: "Access files"
  },
  {
    title: "Profile Settings",
    url: "/dashboard/profile",
    icon: Settings,
    description: "Update profile"
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message,
      });
    }
  };

  return (
    <Sidebar className="border-r border-white/10 bg-gradient-to-b from-[#1a1a2e]/98 to-[#16213e]/98 backdrop-blur-md w-64">
      <SidebarHeader className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-xl flex items-center justify-center shadow-lg">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">DO THE WORK</h2>
            <p className="text-xs text-orange-300 font-medium">Client Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-4 font-semibold px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`w-full justify-start text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white shadow-lg shadow-orange-500/25'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center w-full">
                        <item.icon className={`w-5 h-5 mr-4 transition-transform duration-300 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                        }`} />
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-200'}`}>
                            {item.title}
                          </div>
                          <div className={`text-xs ${isActive ? 'text-orange-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-white transition-all duration-300 py-3 rounded-xl font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
