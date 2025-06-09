
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
  Users, 
  CreditCard, 
  FileText, 
  Settings,
  Shield,
  LogOut,
  Activity,
  Bell,
  Globe
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { getMainAdminRoutes, getSecondaryAdminRoutes } from '@/config/adminRoutes';

const iconMap = {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Users,
  CreditCard,
  FileText,
  Settings,
  Activity,
  Bell,
  Globe,
  Shield
};

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAdminAuth();
  const { toast } = useToast();

  const mainRoutes = getMainAdminRoutes();
  const secondaryRoutes = getSecondaryAdminRoutes();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Succesvol uitgelogd",
        description: "Je bent uitgelogd van het beheerportaal.",
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij uitloggen",
        description: error.message,
      });
    }
  };

  const handleNavigation = (path: string) => {
    console.log('Admin sidebar navigating to:', path);
    navigate(path);
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">DO THE WORK</span>
            <span className="truncate text-xs text-muted-foreground">Beheerportaal</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hoofdmenu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainRoutes.map((route) => {
                const isActive = location.pathname === route.path;
                const IconComponent = iconMap[route.icon as keyof typeof iconMap] || LayoutDashboard;
                
                return (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={route.title}
                      onClick={() => handleNavigation(route.path)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{route.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Beheer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryRoutes.map((route) => {
                const isActive = location.pathname === route.path;
                const IconComponent = iconMap[route.icon as keyof typeof iconMap] || Settings;
                
                return (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={route.title}
                      onClick={() => handleNavigation(route.path)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{route.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Uitloggen"
            >
              <LogOut className="h-4 w-4" />
              <span>Uitloggen</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
