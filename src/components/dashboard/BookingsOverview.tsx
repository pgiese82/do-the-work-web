import React from 'react';
import { Button } from '@/components/ui/button';
import { BookingTabs } from './mybookings/BookingTabs';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecentBookings } from '@/hooks/useDashboardData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useIsMobile } from '@/hooks/use-mobile';

function BookingsOverview() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    data: bookings = [], 
    isLoading, 
    error, 
    refetch 
  } = useRecentBookings(50);

  const isUpcoming = (dateTime: string) => {
    return new Date(dateTime) > new Date();
  };

  const upcomingBookings = bookings.filter(booking => isUpcoming(booking.date_time));
  const pastBookings = bookings.filter(booking => !isUpcoming(booking.date_time));

  if (error) {
    return (
      <div className={`space-y-8 max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        <ErrorMessage 
          title="Kon boekingen niet laden"
          message="Er is een probleem opgetreden bij het laden van je boekingen."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-8 max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 max-w-4xl mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-foreground`}>Mijn Boekingen</h1>
              <p className="text-muted-foreground text-base">
                Volg en beheer je training sessies
              </p>
            </div>
          </div>
        </div>
        
        {bookings.length > 0 && (
          <Button 
            className="gap-2"
            onClick={() => navigate('/dashboard/book')}
            size={isMobile ? "lg" : "default"}
          >
            <Plus className="w-4 h-4" />
            Boek Sessie
          </Button>
        )}
      </div>

      {/* Main Content */}
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-foreground mb-3`}>
            Klaar om je fitness reis te beginnen?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Je hebt nog geen sessies geboekt. Boek je eerste training sessie en begin met het bereiken van je fitness doelen.
          </p>
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => navigate('/dashboard/book')}
          >
            <Plus className="w-5 h-5" />
            Boek Je Eerste Sessie
          </Button>
        </div>
      ) : (
        <BookingTabs upcomingBookings={upcomingBookings} pastBookings={pastBookings} />
      )}
    </div>
  );
}

export default BookingsOverview;
