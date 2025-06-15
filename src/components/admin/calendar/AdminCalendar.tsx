
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Calendar } from 'lucide-react';
import { AvailabilityManager } from './AvailabilityManager';
import { HolidayManager } from './HolidayManager';
import { BookingDragModal } from './BookingDragModal';
import { useAdminCalendar } from '@/hooks/useAdminCalendar';
import { addDays, addWeeks, addMonths } from 'date-fns';
import { Booking } from '@/types/calendar';
import { CalendarHeader } from './CalendarHeader';
import { CalendarView } from './CalendarView';
import { ServiceLegend } from './ServiceLegend';

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const { bookings, loading, handleBookingDrop, loadBookings } = useAdminCalendar();
  
  const [draggedBooking, setDraggedBooking] = useState<Booking | null>(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  
  useEffect(() => {
    loadBookings();
  }, [currentDate, view, loadBookings]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        setCurrentDate(direction === 'next' ? addDays(newDate, 1) : addDays(newDate, -1));
        break;
      case 'week':
        setCurrentDate(direction === 'next' ? addWeeks(newDate, 1) : addWeeks(newDate, -1));
        break;
      case 'month':
        setCurrentDate(direction === 'next' ? addMonths(newDate, 1) : addMonths(newDate, -1));
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Kalender</h1>
          <p className="text-muted-foreground mt-1">
            Beheer boekingen, beschikbaarheid en roosters voor alle diensten.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAvailability(true)}
            variant="outline"
            size="sm"
            className="text-foreground border-border hover:bg-muted"
          >
            <Settings className="w-4 h-4 mr-2" />
            Beschikbaarheid
          </Button>
          <Button
            onClick={() => setShowHolidays(true)}
            variant="outline"
            size="sm"
            className="text-foreground border-border hover:bg-muted"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Feestdagen
          </Button>
        </div>
      </div>

      {/* Calendar Controls & View */}
      <Card className="border-border">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          navigateDate={navigateDate}
          setCurrentDate={setCurrentDate}
          setView={setView}
        />
        <CalendarView
          view={view}
          currentDate={currentDate}
          bookings={bookings}
          onBookingDrop={handleBookingDrop}
          onBookingDrag={setDraggedBooking}
        />
      </Card>

      {/* Service Legend */}
      <ServiceLegend bookings={bookings} />

      {/* Modals */}
      <AvailabilityManager
        isOpen={showAvailability}
        onClose={() => setShowAvailability(false)}
      />
      
      <HolidayManager
        isOpen={showHolidays}
        onClose={() => setShowHolidays(false)}
      />
      
      {draggedBooking && (
        <BookingDragModal
          booking={draggedBooking}
          onClose={() => setDraggedBooking(null)}
          onConfirm={handleBookingDrop}
        />
      )}
    </div>
  );
}
