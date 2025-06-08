
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardOverview } from './DashboardOverview';
import { BookSession } from './BookSession';
import { MyBookings } from './MyBookings';
import { BookingsOverview } from './BookingsOverview';
import { Documents } from './Documents';
import { ProfileSettings } from './ProfileSettings';
import { ServiceSelectionPage } from '@/components/services/ServiceSelectionPage';
import { useLocation } from 'react-router-dom';

export function DashboardContent() {
  const location = useLocation();

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

  return (
    <SidebarInset className="flex-1">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4">
        <SidebarTrigger className="text-white hover:bg-white/10" />
        <div className="ml-auto">
          <div className="text-sm text-gray-300">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </SidebarInset>
  );
}
