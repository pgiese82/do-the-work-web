
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarCheck,
  Users, 
  CreditCard, 
  FileText, 
  Settings,
  Menu,
  Bell,
  Activity,
  Globe,
  Shield,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { adminRoutes, getAdminRouteByPath } from '@/config/adminRoutes';

const iconMap = {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Users,
  CreditCard,
  FileText,
  Settings,
  Bell,
  Activity,
  Globe,
  Shield
};

export function AdminMobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAdminAuth();
  const { toast } = useToast();

  const currentRoute = getAdminRouteByPath(location.pathname);

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
    console.log('Mobile admin navigation to:', path);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-background">
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center border-b px-6 bg-gradient-to-r from-slate-900 to-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                        <Shield className="h-5 w-5 text-slate-800" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">DO THE WORK</h2>
                        <p className="text-xs text-gray-300">Beheerportaal</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-4">
                    {adminRoutes.filter(route => route.showInNav).map((route) => {
                      const isActive = location.pathname === route.path;
                      const IconComponent = iconMap[route.icon as keyof typeof iconMap] || LayoutDashboard;
                      
                      return (
                        <Button
                          key={route.path}
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start h-12"
                          onClick={() => handleNavigation(route.path)}
                        >
                          <IconComponent className="h-4 w-4 mr-3" />
                          {route.title}
                        </Button>
                      );
                    })}

                    <div className="border-t pt-4 mt-6">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Uitloggen
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-slate-800" />
              </div>
              <div>
                <h1 className="font-bold text-lg">DO THE WORK</h1>
                <p className="text-xs text-gray-300 -mt-1">Beheerportaal</p>
              </div>
            </div>
          </div>

          {currentRoute && (
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <span className="text-sm">{currentRoute.title}</span>
            </Badge>
          )}
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 h-16">
          {[
            { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
            { title: "Boekingen", path: "/admin/bookings", icon: CalendarCheck },
            { title: "Klanten", path: "/admin/clients", icon: Users },
            { title: "Meer", path: "#", icon: Menu, isMenu: true }
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => {
                  if (item.isMenu) {
                    setIsOpen(true);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                className={`flex flex-col items-center justify-center h-full rounded-none border-0 ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
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
    </>
  );
}
