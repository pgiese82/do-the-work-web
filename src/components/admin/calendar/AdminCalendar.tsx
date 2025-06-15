
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
import { format, addDays, addWeeks, addMonths, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';

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
      console.log('Boekingen laden...');
      
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
        console.error('Fout bij laden boekingen:', error);
        throw error;
      }

      console.log('Boekingen geladen:', data);
      setBookings(data || []);
    } catch (error: any) {
      console.error('Laden boekingen mislukt:', error);
      toast({
        variant: "destructive",
        title: "Fout bij laden boekingen",
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
      console.log('Boeking bijwerken:', bookingId, 'naar:', newDateTime);
      
      const { error } = await supabase
        .from('bookings')
        .update({ date_time: newDateTime.toISOString() })
        .eq('id', bookingId);

      if (error) {
        console.error('Fout bij bijwerken boeking:', error);
        throw error;
      }
      
      toast({
        title: "Boeking verplaatst",
        description: "De boeking is succesvol verplaatst naar het nieuwe tijdslot.",
      });
      
      await loadBookings();
    } catch (error: any) {
      console.error('Verplaatsen boeking mislukt:', error);
      toast({
        variant: "destructive",
        title: "Fout bij verplaatsen boeking",
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
        return format(currentDate, 'EEEE, d MMMM yyyy', { locale: nl });
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'd MMM', { locale: nl })} - ${format(weekEnd, 'd MMM yyyy', { locale: nl })}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: nl });
      default:
        return '';
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

      {/* Calendar Controls */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigateDate('prev')}
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold text-foreground min-w-[300px] text-center">
                {formatDateRange()}
              </h2>
              
              <Button
                onClick={() => navigateDate('next')}
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-muted"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-muted"
              >
                Vandaag
              </Button>
              
              <Tabs value={view} onValueChange={(value) => setView(value as any)}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="day" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Dag
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Maand
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
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
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Dienst Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(bookings.map(b => b.services?.id).filter(Boolean))).map(serviceId => {
              const service = bookings.find(b => b.services?.id === serviceId)?.services;
              return service ? (
                <Badge
                  key={serviceId}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-medium"
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
