
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  services: {
    name: string;
  };
}

interface BookingCalendarViewProps {
  filteredBookings: Booking[];
  selectedDate?: Date;
  setSelectedDate: (date?: Date) => void;
}

export function BookingCalendarView({ 
  filteredBookings, 
  selectedDate, 
  setSelectedDate 
}: BookingCalendarViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.date_time);
      return format(bookingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      time: format(date, 'HH:mm'),
    };
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Calendar View</CardTitle>
        <CardDescription className="text-gray-300">
          Click on a date to see bookings for that day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-white/20 bg-white/5"
              modifiers={{
                hasBooking: (date) => getBookingsForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasBooking: {
                  backgroundColor: 'rgba(34, 197, 94, 0.3)',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>
          <div>
            {selectedDate ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Bookings for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                <div className="space-y-3">
                  {getBookingsForDate(selectedDate).map((booking) => {
                    const dateTime = formatDateTime(booking.date_time);
                    return (
                      <div
                        key={booking.id}
                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-medium">{booking.services.name}</span>
                          <span className="text-gray-300 text-sm">{dateTime.time}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getStatusColor(booking.status)} text-white text-xs`}>
                            {booking.status}
                          </Badge>
                          <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white text-xs`}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  {getBookingsForDate(selectedDate).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No bookings for this date</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select a date to view bookings</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
