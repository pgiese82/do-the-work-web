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
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const iconMap = {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  FileText,
  Settings,
  ArrowLeft
};

// Simple absolute paths - no relative routing
const dashboardRoutes = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    showInNav: true
  },
  {
    path: '/dashboard/book',
    title: 'Sessie Boeken',
    icon: 'Calendar',
    showInNav: true
  },
  {
    path: '/dashboard/bookings',
    title: 'Mijn Boekingen',
    icon: 'CalendarCheck',
    showInNav: true
  },
  {
    path: '/dashboard/documents',
    title: 'Documenten',
    icon: 'FileText',
    showInNav: true
  },
  {
    path: '/dashboard/profile',
    title: 'Profiel',
    icon: 'Settings',
    showInNav: true
  }
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
        title: "Succesvol uitgelogd",
        description: "Je bent uitgelogd van je account.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij uitloggen",
        description: error.message,
      });
    }
  };

  const handleNavigation = (path: string) => {
    console.log('🧭 Navigating to:', path);
    console.log('📍 Current location:', location.pathname);
    navigate(path);
  };

  return (
    <Sidebar className="border-r bg-background flex">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-lg">DO THE WORK</h2>
            <p className="text-xs text-muted-foreground">Klantenportaal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground mb-2 px-2">
            Navigatie
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {dashboardRoutes.filter(route => route.showInNav).map((route) => {
                const isActive = location.pathname === route.path;
                const IconComponent = iconMap[route.icon as keyof typeof iconMap] || LayoutDashboard;
                
                console.log(`Route ${route.path}: active=${isActive}, current=${location.pathname}`);
                
                return (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(route.path)}
                      className={`w-full justify-start px-3 py-3 h-12 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="text-sm font-medium">{route.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/')}
                  className="w-full justify-start px-3 py-3 h-12 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Terug naar Website</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start h-12 text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Uitloggen</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
