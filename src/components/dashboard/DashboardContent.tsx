
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardOverview from './DashboardOverview';
import BookSession from './BookSession';
import BookingsOverview from './BookingsOverview';
import Documents from './Documents';
import ProfileSettings from './ProfileSettings';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { dashboardRoutes } from '@/config/dashboardRoutes';

export function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();
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
    const currentPath = location.pathname;
    console.log('Current route:', currentPath);
    
    // Exact path matching
    switch (currentPath) {
      case '/dashboard':
        return <DashboardOverview />;
      case '/dashboard/book':
        return <BookSession />;
      case '/dashboard/bookings':
        return <BookingsOverview />;
      case '/dashboard/documents':
        return <Documents />;
      case '/dashboard/profile':
        return <ProfileSettings />;
      default:
        console.log('Unknown route, showing 404');
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Pagina niet gevonden</h2>
            <p className="text-muted-foreground mb-4">Deze pagina bestaat niet of is verplaatst.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Terug naar Dashboard
            </Button>
          </div>
        );
    }
  };

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
