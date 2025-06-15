
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { CalendarDayView } from './CalendarDayView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarMonthView } from './CalendarMonthView';
import { Booking } from '@/types/calendar';

interface CalendarViewProps {
    view: 'day' | 'week' | 'month';
    currentDate: Date;
    bookings: Booking[];
    onBookingDrop: (bookingId: string, newDateTime: Date) => void;
    onBookingDrag: (booking: Booking | null) => void;
}

export function CalendarView({
    view,
    currentDate,
    bookings,
    onBookingDrop,
    onBookingDrag
}: CalendarViewProps) {
    return (
        <CardContent className="p-0">
          {view === 'day' && (
            <CalendarDayView
              date={currentDate}
              bookings={bookings}
              onBookingDrop={onBookingDrop}
              onBookingDrag={onBookingDrag}
            />
          )}
          
          {view === 'week' && (
            <CalendarWeekView
              startDate={currentDate}
              bookings={bookings}
              onBookingDrop={onBookingDrop}
              onBookingDrag={onBookingDrag}
            />
          )}
          
          {view === 'month' && (
            <CalendarMonthView
              month={currentDate}
              bookings={bookings}
              onBookingDrop={onBookingDrop}
              onBookingDrag={onBookingDrag}
            />
          )}
        </CardContent>
    );
}
