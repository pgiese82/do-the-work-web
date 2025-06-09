
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';

// Lazy load components to catch import errors
const DashboardOverview = React.lazy(() => import('./DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const BookSession = React.lazy(() => import('./BookSession').then(module => ({ default: module.BookSession })));
const BookingsOverview = React.lazy(() => import('./BookingsOverview').then(module => ({ default: module.BookingsOverview })));
const Documents = React.lazy(() => import('./Documents').then(module => ({ default: module.Documents })));
const ProfileSettings = React.lazy(() => import('./ProfileSettings').then(module => ({ default: module.ProfileSettings })));

export function DashboardContent() {
  const location = useLocation();

  console.log('DashboardContent rendering, current path:', location.pathname);

  const renderContent = () => {
    const currentPath = location.pathname;
    console.log('Rendering content for path:', currentPath);
    
    try {
      switch (currentPath) {
        case '/dashboard':
          console.log('Loading DashboardOverview');
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <DashboardOverview />
            </React.Suspense>
          );
        case '/dashboard/book':
          console.log('Loading BookSession');
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <BookSession />
            </React.Suspense>
          );
        case '/dashboard/bookings':
          console.log('Loading BookingsOverview');
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <BookingsOverview />
            </React.Suspense>
          );
        case '/dashboard/documents':
          console.log('Loading Documents');
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <Documents />
            </React.Suspense>
          );
        case '/dashboard/profile':
          console.log('Loading ProfileSettings');
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <ProfileSettings />
            </React.Suspense>
          );
        default:
          console.log('Unknown route, showing dashboard overview');
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <DashboardOverview />
            </React.Suspense>
          );
      }
    } catch (error) {
      console.error('Error rendering dashboard content:', error);
      return (
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Error Loading Dashboard</h1>
          <p className="text-muted-foreground">
            There was an error loading the dashboard content. Please try refreshing the page.
          </p>
          <pre className="mt-4 p-4 bg-red-50 text-red-800 text-sm rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
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
