
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  FileText, 
  Settings,
  Menu,
  Clock,
  UserCheck,
  Megaphone,
  Euro,
  Clipboard
} from 'lucide-react';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Boekingen",
    url: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Kalender",
    url: "/admin/calendar",
    icon: Clock,
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
    title: "Beschikbaarheid",
    url: "/admin/availability",
    icon: UserCheck,
  },
  {
    title: "Prijzen",
    url: "/admin/pricing",
    icon: Euro,
  },
  {
    title: "Wachtlijst",
    url: "/admin/waitinglist",
    icon: Clipboard,
  },
  {
    title: "CMS",
    url: "/admin/cms",
    icon: Megaphone,
  },
  {
    title: "Instellingen",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminMobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const currentItem = navigationItems.find(item => item.url === location.pathname);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu openen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center border-b px-6">
                    <h2 className="text-lg font-semibold">Admin Portaal</h2>
                  </div>
                  <nav className="flex-1 space-y-2 p-4">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <Button
                          key={item.title}
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => {
                            navigate(item.url);
                            setIsOpen(false);
                          }}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Button>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AP</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentItem && (
              <div className="flex items-center gap-2">
                <currentItem.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentItem.title}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/bookings')}
            className="whitespace-nowrap"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Nieuwe Boeking
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/clients')}
            className="whitespace-nowrap"
          >
            <Users className="h-3 w-3 mr-1" />
            Klanten
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/calendar')}
            className="whitespace-nowrap"
          >
            <Clock className="h-3 w-3 mr-1" />
            Kalender
          </Button>
        </div>
      </div>
    </>
  );
}
