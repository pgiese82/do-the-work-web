
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Globe,
  ArrowLeft
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

const mainMenuItems = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Boekingen',
    path: '/admin/bookings',
    icon: CalendarCheck,
  },
  {
    title: 'Kalender',
    path: '/admin/calendar',
    icon: Calendar,
  },
  {
    title: 'Klanten',
    path: '/admin/clients',
    icon: Users,
  },
  {
    title: 'Betalingen',
    path: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Documenten',
    path: '/admin/documents',
    icon: FileText,
  },
];

const secondaryMenuItems = [
  {
    title: 'Meldingen',
    path: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'Website Beheer',
    path: '/admin/cms',
    icon: Globe,
  },
  {
    title: 'Activiteitenlog',
    path: '/admin/audit',
    icon: Activity,
  },
  {
    title: 'Instellingen',
    path: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAdminAuth();
  const { toast } = useToast();

  console.log('AdminSidebar rendering, current path:', location.pathname);

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
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">DO THE WORK</h2>
            <p className="text-xs text-muted-foreground">Beheerportaal</p>
          </div>
        </div>
      </div>
      
      {/* Main Menu */}
      <div className="flex-1 p-4">
        <div className="space-y-6">
          {/* Hoofdmenu */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Hoofdmenu
            </h3>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Beheer */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Beheer
            </h3>
            <nav className="space-y-1">
              {secondaryMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border space-y-1">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar Website
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Uitloggen
        </button>
      </div>
    </div>
  );
}
