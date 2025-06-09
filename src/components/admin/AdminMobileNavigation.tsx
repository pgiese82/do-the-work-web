
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
  LogOut,
  Plus
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "bg-blue-500"
  },
  {
    title: "Boekingen",
    url: "/admin/bookings",
    icon: CalendarCheck,
    color: "bg-green-500"
  },
  {
    title: "Kalender",
    url: "/admin/calendar",
    icon: Calendar,
    color: "bg-purple-500"
  },
  {
    title: "Klanten",
    url: "/admin/clients",
    icon: Users,
    color: "bg-orange-500"
  },
  {
    title: "Betalingen",
    url: "/admin/payments",
    icon: CreditCard,
    color: "bg-emerald-500"
  },
  {
    title: "Documenten",
    url: "/admin/documents",
    icon: FileText,
    color: "bg-red-500"
  },
  {
    title: "Meldingen",
    url: "/admin/notifications",
    icon: Bell,
    color: "bg-yellow-500"
  },
  {
    title: "Website Beheer",
    url: "/admin/cms",
    icon: Globe,
    color: "bg-indigo-500"
  },
  {
    title: "Activiteitenlog",
    url: "/admin/audit",
    icon: Activity,
    color: "bg-gray-500"
  },
  {
    title: "Instellingen",
    url: "/admin/settings",
    icon: Settings,
    color: "bg-slate-500"
  },
];

export function AdminMobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAdminAuth();
  const { toast } = useToast();

  const currentItem = navigationItems.find(item => item.url === location.pathname);

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
    <>
      {/* Mobile Header with App-like Design */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu openen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-background">
                <div className="flex h-full flex-col">
                  {/* App Header in Sheet */}
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

                  {/* Navigation Grid */}
                  <div className="flex-1 p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {navigationItems.slice(0, 8).map((item) => {
                        const isActive = location.pathname === item.url;
                        return (
                          <Button
                            key={item.title}
                            variant="ghost"
                            className={`h-20 flex-col gap-2 rounded-xl border-2 transition-all ${
                              isActive 
                                ? 'border-primary bg-primary/10 text-primary' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              navigate(item.url);
                              setIsOpen(false);
                            }}
                          >
                            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                              <item.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xs font-medium text-center leading-tight">{item.title}</span>
                          </Button>
                        );
                      })}
                    </div>

                    {/* Additional Menu Items */}
                    <div className="space-y-2 border-t pt-4">
                      {navigationItems.slice(8).map((item) => {
                        const isActive = location.pathname === item.url;
                        return (
                          <Button
                            key={item.title}
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start h-12"
                            onClick={() => {
                              navigate(item.url);
                              setIsOpen(false);
                            }}
                          >
                            <div className={`w-6 h-6 rounded-md ${item.color} flex items-center justify-center mr-3`}>
                              <item.icon className="h-3 w-3 text-white" />
                            </div>
                            {item.title}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Logout Button */}
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

          {/* Current Page Badge */}
          {currentItem && (
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <currentItem.icon className="h-3 w-3 mr-1" />
              {currentItem.title}
            </Badge>
          )}
        </div>
      </header>

      {/* Quick Actions Floating Bar */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3">
          <div className="flex gap-2 justify-around">
            <Button
              size="sm"
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={() => navigate('/admin/bookings')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Boeking
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => navigate('/admin/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Kalender
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
        <div className="grid grid-cols-4 h-16">
          {[
            { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
            { title: "Boekingen", url: "/admin/bookings", icon: CalendarCheck },
            { title: "Klanten", url: "/admin/clients", icon: Users },
            { title: "Meer", url: "#", icon: Menu, isMenu: true }
          ].map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => {
                  if (item.isMenu) {
                    setIsOpen(true);
                  } else {
                    navigate(item.url);
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
