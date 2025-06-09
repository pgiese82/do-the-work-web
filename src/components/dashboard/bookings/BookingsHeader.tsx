
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingsHeaderProps {
  totalBookings: number;
}

export function BookingsHeader({ totalBookings }: BookingsHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Bookings Overview</h1>
            <p className="text-muted-foreground text-base">
              Manage all your training sessions ({totalBookings} total)
            </p>
          </div>
        </div>
      </div>
      
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        New Booking
      </Button>
    </div>
  );
}
