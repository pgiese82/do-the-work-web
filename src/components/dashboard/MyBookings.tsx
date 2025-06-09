
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin } from 'lucide-react';
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
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="space-y-6 max-w-7xl mx-auto p-8">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          <div className="h-5 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-8">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground text-lg">
          Manage all your training sessions and bookings
        </p>
      </div>

      {/* Tabs Section */}
      <div className="space-y-6">
        <div className="flex gap-8 border-b border-border">
          <div className="pb-4 border-b-2 border-primary">
            <span className="text-sm font-medium text-foreground">
              Upcoming ({upcomingBookings.length})
            </span>
          </div>
          <div className="pb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Past ({pastBookings.length})
            </span>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="space-y-4">
          {upcomingBookings.length === 0 && pastBookings.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any sessions yet. Start your fitness journey today!
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Book Your First Session
                </Button>
              </CardContent>
            </Card>
          ) : upcomingBookings.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-12">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground">You don't have any upcoming sessions scheduled.</p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => {
              const dateTime = formatDateTime(booking.date_time);
              return (
                <Card key={booking.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {booking.services.name}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                          {dateTime.date} at {dateTime.time}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(booking.status)} variant="outline">
                          {booking.status}
                        </Badge>
                        <Badge className={getStatusColor(booking.payment_status)} variant="outline">
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.services.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">€{booking.services.price}</span>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                        <strong className="text-foreground">Notes:</strong> {booking.notes}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      {booking.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Booking
                        </Button>
                      )}
                      {booking.status === 'confirmed' && new Date(booking.date_time) > new Date() && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Reschedule
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
