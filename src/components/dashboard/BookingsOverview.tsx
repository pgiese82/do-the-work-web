import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Calendar as CalendarIcon, Clock, Filter, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { BookingActions } from '@/components/booking/BookingActions';

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

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: format(date, 'EEEE, MMMM d, yyyy'),
      time: format(date, 'HH:mm'),
    };
  };

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.date_time);
      return format(bookingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
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

  const renderBookingCard = (booking: Booking) => {
    const dateTime = formatDateTime(booking.date_time);
    return (
      <Card key={booking.id} className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white">{booking.services.name}</CardTitle>
              <CardDescription className="text-gray-300">
                {dateTime.date} at {dateTime.time}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(booking.status)} text-white`}>
                {booking.status}
              </Badge>
              <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white`}>
                {booking.payment_status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking.services.duration} minutes
            </div>
            <div className="flex items-center gap-1">
              <span>€{booking.services.price}</span>
            </div>
          </div>
          
          {booking.notes && (
            <div className="text-sm text-gray-300 mb-4">
              <strong>Notes:</strong> {booking.notes}
            </div>
          )}
          
          <BookingActions booking={booking} onUpdate={fetchBookings} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Bookings Overview</h1>
          <p className="text-gray-300">
            Manage all your training sessions and bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="border-white/20 text-white"
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="border-white/20 text-white"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Search</label>
              <Input
                placeholder="Search services or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Payment</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Input
                  type="date"
                  value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'list' ? (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white/20">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-white/20">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingBookings.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No upcoming bookings</h3>
                  <p className="text-gray-300">You don't have any upcoming sessions scheduled.</p>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map(renderBookingCard)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {pastBookings.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No past bookings</h3>
                  <p className="text-gray-300">You don't have any completed sessions yet.</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      ) : (
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
      )}
    </div>
  );
}
