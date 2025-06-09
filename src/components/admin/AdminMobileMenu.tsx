
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from './AdminSidebar';

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminMobileMenu({ isOpen, onClose }: AdminMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Slide-out Menu */}
      <div className="fixed left-0 top-0 h-full w-64 bg-background z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Sidebar Content */}
        <div className="h-full">
          <AdminSidebar />
        </div>
      </div>
    </>
  );
}
