
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardOverview } from './DashboardOverview';
import { BookSession } from './BookSession';
import { BookingsOverview } from './BookingsOverview';
import { Documents } from './Documents';
import { ProfileSettings } from './ProfileSettings';
import { useLocation, useNavigate } from 'react-router-dom';

export function DashboardContent() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('DashboardContent rendering, current path:', location.pathname);

  const renderContent = () => {
    const currentPath = location.pathname;
    console.log('Rendering content for path:', currentPath);
    
    try {
      switch (currentPath) {
        case '/dashboard':
          console.log('Loading DashboardOverview');
          return <DashboardOverview />;
        case '/dashboard/book':
          console.log('Loading BookSession');
          return <BookSession />;
        case '/dashboard/bookings':
          console.log('Loading BookingsOverview');
          return <BookingsOverview />;
        case '/dashboard/documents':
          console.log('Loading Documents');
          return <Documents />;
        case '/dashboard/profile':
          console.log('Loading ProfileSettings');
          return <ProfileSettings />;
        default:
          console.log('Unknown route, showing dashboard overview');
          return <DashboardOverview />;
      }
    } catch (error) {
      console.error('Error rendering dashboard content:', error);
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Error Loading Dashboard</h1>
          <p className="text-muted-foreground">
            There was an error loading the dashboard content. Please try refreshing the page.
          </p>
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
