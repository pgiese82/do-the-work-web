
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isWithinInterval } from 'date-fns';
import { BookingFilters } from './booking/BookingFilters';
import { BookingViewToggle } from './booking/BookingViewToggle';
import { BookingListView } from './booking/BookingListView';
import { BookingCalendarView } from './booking/BookingCalendarView';
import { BookingsHeader } from './bookings/BookingsHeader';
import { BookingsLoadingState } from './bookings/BookingsLoadingState';
import { BookingsEmptyState } from './bookings/BookingsEmptyState';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  notes?: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

export function BookingsOverview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, paymentFilter, dateRange, searchTerm]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          date_time,
          status,
          payment_status,
          notes,
          services (
            name,
            duration,
            price
          )
        `)
        .eq('user_id', user?.id)
        .order('date_time', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.payment_status === paymentFilter);
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date_time);
        return isWithinInterval(bookingDate, { start: dateRange.from!, end: dateRange.to! });
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.services.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  const upcomingBookings = filteredBookings.filter(booking => isUpcoming(booking.date_time));
  const pastBookings = filteredBookings.filter(booking => !isUpcoming(booking.date_time));

  if (loading) {
    return <BookingsLoadingState />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <BookingsHeader totalBookings={bookings.length} />

      {bookings.length === 0 ? (
        <BookingsEmptyState />
      ) : (
        <>
          <div className="space-y-6">
            <BookingFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            <div className="flex justify-end">
              <BookingViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {viewMode === 'list' ? (
            <BookingListView
              upcomingBookings={upcomingBookings}
              pastBookings={pastBookings}
              onUpdate={fetchBookings}
            />
          ) : (
            <BookingCalendarView
              filteredBookings={filteredBookings}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
        </>
      )}
    </div>
  );
}
