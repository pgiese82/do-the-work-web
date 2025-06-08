
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isWithinInterval } from 'date-fns';
import { BookingFilters } from './booking/BookingFilters';
import { BookingViewToggle } from './booking/BookingViewToggle';
import { BookingListView } from './booking/BookingListView';
import { BookingCalendarView } from './booking/BookingCalendarView';

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
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded-md w-48 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/10 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Bookings Overview</h1>
          <p className="text-gray-300">
            Manage all your training sessions and bookings
          </p>
        </div>
        <BookingViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

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
    </div>
  );
}
