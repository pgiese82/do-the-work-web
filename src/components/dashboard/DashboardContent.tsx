
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardOverview } from './DashboardOverview';
import { BookSession } from './BookSession';
import { MyBookings } from './MyBookings';
import { BookingsOverview } from './BookingsOverview';
import { Documents } from './Documents';
import { ProfileSettings } from './ProfileSettings';
import { ServiceSelectionPage } from '@/components/services/ServiceSelectionPage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarCheck, 
  FileText, 
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const mobileMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Boeken",
    url: "/dashboard/book",
    icon: Calendar,
  },
  {
    title: "Boekingen",
    url: "/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Documenten",
    url: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Profiel",
    url: "/dashboard/profile",
    icon: Settings,
  },
];

export function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Succesvol uitgelogd",
        description: "Je bent uitgelogd van je account.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij uitloggen",
        description: error.message,
      });
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/dashboard':
        return <DashboardOverview />;
      case '/dashboard/services':
        return <ServiceSelectionPage />;
      case '/dashboard/book':
        return <BookSession />;
      case '/dashboard/bookings':
        return <BookingsOverview />;
      case '/dashboard/my-bookings':
        return <MyBookings />;
      case '/dashboard/documents':
        return <Documents />;
      case '/dashboard/profile':
        return <ProfileSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DW</span>
              </div>
              <h1 className="font-semibold text-foreground">Klantenportaal</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Website
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 pb-20">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
          <div className="grid grid-cols-5 h-16">
            {mobileMenuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  onClick={() => navigate(item.url)}
                  className={`flex flex-col items-center justify-center h-full rounded-none border-0 ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                    {item.title}
                  </span>
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <SidebarInset className="flex-1">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="hover:bg-accent" />
        <div className="ml-auto">
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('nl-NL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {renderContent()}
      </main>
    </SidebarInset>
  );
}
