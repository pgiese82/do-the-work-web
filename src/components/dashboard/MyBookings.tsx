
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export function MyBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  const upcomingBookings = bookings.filter(booking => isUpcoming(booking.date_time));
  const pastBookings = bookings.filter(booking => !isUpcoming(booking.date_time));

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="space-y-3">
          <div className="h-8 bg-gray-100 rounded-lg w-64 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded w-96 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 text-lg">
          Manage your training sessions and appointments
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past Sessions ({pastBookings.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {bookings.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No bookings yet</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                You haven't booked any sessions yet. Start your fitness journey today!
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                Book Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : currentBookings.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {activeTab} sessions
              </h3>
              <p className="text-gray-600">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming sessions scheduled."
                  : "You haven't completed any sessions yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {currentBookings.map((booking) => {
              const dateTime = formatDateTime(booking.date_time);
              return (
                <Card key={booking.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {booking.services.name}
                        </CardTitle>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-base">{dateTime.date} at {dateTime.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={`${getStatusColor(booking.status)} text-xs font-medium`} variant="outline">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-xs font-medium`} variant="outline">
                          {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.services.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">€{booking.services.price}</span>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Session Notes</p>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'upcoming' && (
                      <div className="flex gap-3 pt-2">
                        {booking.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === 'confirmed' && new Date(booking.date_time) > new Date() && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            Reschedule
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
