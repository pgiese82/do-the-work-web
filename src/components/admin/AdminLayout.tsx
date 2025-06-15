
import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminMobileMenu } from './AdminMobileMenu';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminRealtimeSetup } from '@/hooks/useAdminRealtimeSetup';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useAdminRealtimeSetup(); // Setup realtime subscriptions once for all admin pages.

  console.log('AdminLayout rendering');

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile Menu */}
      <AdminMobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Beheerportaal</h1>
          <div></div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-6 border-b bg-background">
          <h1 className="text-2xl font-semibold text-foreground">Beheerportaal</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
