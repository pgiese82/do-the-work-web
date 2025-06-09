
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ChevronLeft, ChevronRight, Settings, Plus } from 'lucide-react';
import { CalendarDayView } from './CalendarDayView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarMonthView } from './CalendarMonthView';
import { AvailabilityManager } from './AvailabilityManager';
import { HolidayManager } from './HolidayManager';
import { BookingDragModal } from './BookingDragModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, addWeeks, addMonths, startOfDay, endOfDay } from 'date-fns';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  users: {
    name: string;
    email: string;
  };
  services: {
    name: string;
    duration: number;
    id: string;
  };
}

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedBooking, setDraggedBooking] = useState<Booking | null>(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, [currentDate, view]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log('Loading bookings...');
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users:user_id (
            name,
            email
          ),
          services:service_id (
            name,
            duration,
            id
          )
        `)
        .order('date_time', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error);
        throw error;
      }

      console.log('Loaded bookings:', data);
      setBookings(data || []);
    } catch (error: any) {
      console.error('Failed to load bookings:', error);
      toast({
        variant: "destructive",
        title: "Error loading bookings",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleBookingDrop = async (bookingId: string, newDateTime: Date) => {
    try {
      console.log('Updating booking:', bookingId, 'to:', newDateTime);
      
      const { error } = await supabase
        .from('bookings')
        .update({ date_time: newDateTime.toISOString() })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }
      
      toast({
        title: "Booking rescheduled",
        description: "The booking has been successfully moved to the new time slot.",
      });
      
      await loadBookings();
    } catch (error: any) {
      console.error('Failed to reschedule booking:', error);
      toast({
        variant: "destructive",
        title: "Error rescheduling booking",
        description: error.message,
      });
    }
  };

  const getServiceColor = (serviceId: string) => {
    // Generate consistent colors based on service ID
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500'
    ];
    const index = serviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const formatDateRange = () => {
    switch (view) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        const weekStart = startOfDay(currentDate);
        const weekEnd = endOfDay(addDays(weekStart, 6));
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Calendar Management</h2>
          <p className="text-gray-300">
            Manage bookings, availability, and schedules across all services.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAvailability(true)}
            variant="outline"
            className="border-orange-500/20 text-orange-300 hover:bg-orange-500/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            Availability
          </Button>
          <Button
            onClick={() => setShowHolidays(true)}
            variant="outline"
            className="border-orange-500/20 text-orange-300 hover:bg-orange-500/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Holidays
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigateDate('prev')}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h3 className="text-xl font-semibold text-white min-w-[300px] text-center">
                {formatDateRange()}
              </h3>
              
              <Button
                onClick={() => navigateDate('next')}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
                className="border-orange-500/20 text-orange-300 hover:bg-orange-500/20"
              >
                Today
              </Button>
              
              <Tabs value={view} onValueChange={(value) => setView(value as any)}>
                <TabsList className="bg-white/10">
                  <TabsTrigger value="day" className="text-white data-[state=active]:bg-orange-500">
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-white data-[state=active]:bg-orange-500">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-white data-[state=active]:bg-orange-500">
                    Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {view === 'day' && (
            <CalendarDayView
              date={currentDate}
              bookings={bookings}
              onBookingDrop={handleBookingDrop}
              getServiceColor={getServiceColor}
              onBookingDrag={setDraggedBooking}
            />
          )}
          
          {view === 'week' && (
            <CalendarWeekView
              startDate={currentDate}
              bookings={bookings}
              onBookingDrop={handleBookingDrop}
              getServiceColor={getServiceColor}
              onBookingDrag={setDraggedBooking}
            />
          )}
          
          {view === 'month' && (
            <CalendarMonthView
              month={currentDate}
              bookings={bookings}
              onBookingDrop={handleBookingDrop}
              getServiceColor={getServiceColor}
              onBookingDrag={setDraggedBooking}
            />
          )}
        </CardContent>
      </Card>

      {/* Service Legend */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Service Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(bookings.map(b => b.services?.id).filter(Boolean))).map(serviceId => {
              const service = bookings.find(b => b.services?.id === serviceId)?.services;
              return service ? (
                <Badge
                  key={serviceId}
                  className={`${getServiceColor(serviceId)} text-white`}
                >
                  {service.name}
                </Badge>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>

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
