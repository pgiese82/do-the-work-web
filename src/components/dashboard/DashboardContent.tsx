
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardOverview } from './DashboardOverview';
import { BookSession } from './BookSession';
import { BookingsOverview } from './BookingsOverview';
import { Documents } from './Documents';
import { ProfileSettings } from './ProfileSettings';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const renderContent = () => {
    const currentPath = location.pathname;
    console.log('Current route:', currentPath);
    
    // Exact path matching with fallback
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
        console.log('Unknown route, showing dashboard overview');
        return <DashboardOverview />;
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
