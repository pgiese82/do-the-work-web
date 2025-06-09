
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

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Boekingen",
    url: "/admin/bookings", 
    icon: CalendarCheck,
  },
  {
    title: "Kalender",
    url: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Klanten",
    url: "/admin/clients",
    icon: Users,
  },
  {
    title: "Betalingen",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Documenten", 
    url: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Meldingen",
    url: "/admin/notifications",
    icon: Bell,
  },
];

const bottomMenuItems = [
  {
    title: "Website Beheer",
    url: "/admin/cms",
    icon: Globe,
  },
  {
    title: "Activiteitenlog",
    url: "/admin/audit",
    icon: Activity,
  },
  {
    title: "Instellingen",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAdminAuth();
  const { toast } = useToast();

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
          <SidebarGroupLabel>Beheer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
