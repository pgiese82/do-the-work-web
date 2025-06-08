
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
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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
      <div>
        <h1 className="text-3xl font-black text-white mb-2">My Bookings</h1>
        <p className="text-gray-300">
          Manage your scheduled training sessions
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
              <p className="text-gray-300 mb-4">
                You haven't booked any sessions yet. Start your fitness journey today!
              </p>
              <Button className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#d67b1e] text-white">
                Book Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => {
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
                      <Badge variant="outline" className="border-white/20 text-white">
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
                  
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {booking.status === 'confirmed' && new Date(booking.date_time) > new Date() && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
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
  );
}
