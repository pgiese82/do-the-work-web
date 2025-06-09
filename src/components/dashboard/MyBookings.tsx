
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookingTabs } from './mybookings/BookingTabs';
import { LoadingState } from './mybookings/LoadingState';
import { Calendar, Plus } from 'lucide-react';

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

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  const upcomingBookings = bookings.filter(booking => isUpcoming(booking.date_time));
  const pastBookings = bookings.filter(booking => !isUpcoming(booking.date_time));

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground text-base">
                Track and manage your training sessions
              </p>
            </div>
          </div>
        </div>
        
        {bookings.length > 0 && (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Book Session
          </Button>
        )}
      </div>

      {/* Main Content */}
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Ready to start your fitness journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            You haven't booked any sessions yet. Book your first training session and begin reaching your fitness goals.
          </p>
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Book Your First Session
          </Button>
        </div>
      ) : (
        <BookingTabs upcomingBookings={upcomingBookings} pastBookings={pastBookings} />
      )}
    </div>
  );
}
