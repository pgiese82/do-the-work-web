
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Plus, ArrowRight, TrendingUp, Euro } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardStats, useNextBooking, useUserProfile } from '@/hooks/useDashboardData';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError, 
    refetch: refetchStats 
  } = useDashboardStats();
  
  const { 
    data: nextBooking, 
    isLoading: nextBookingLoading, 
    error: nextBookingError, 
    refetch: refetchNextBooking 
  } = useNextBooking();
  
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useUserProfile();

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('nl-NL', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
  };

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'trial': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'inactive': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (statsError || nextBookingError || profileError) {
    return (
      <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-8'} max-w-7xl mx-auto`}>
        <ErrorMessage 
          title="Kon dashboard niet laden"
          message="Er is een probleem opgetreden bij het laden van je dashboard gegevens."
          onRetry={() => {
            refetchStats();
            refetchNextBooking();
          }}
        />
      </div>
    );
  }

  if (statsLoading || nextBookingLoading || profileLoading) {
    return (
      <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-8'} max-w-7xl mx-auto`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-4'}`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-8'} max-w-7xl mx-auto`}>
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-foreground`}>
            {getGreeting()}, {userProfile?.name || 'daar'}
          </h1>
          {userProfile?.subscription_status && (
            <Badge variant="secondary" className={getSubscriptionBadgeColor(userProfile.subscription_status)}>
              {userProfile.subscription_status === 'active' ? 'Actief' : 
               userProfile.subscription_status === 'trial' ? 'Proefperiode' : 
               userProfile.subscription_status === 'inactive' ? 'Inactief' : userProfile.subscription_status}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-base">
          Hier is wat er gebeurt met je training
        </p>
      </div>

      {/* Stats Overview */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Totaal Sessies</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>
                  {statsLoading ? <LoadingSpinner size="sm" /> : stats?.totalBookings || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Voltooid</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>
                  {statsLoading ? <LoadingSpinner size="sm" /> : stats?.completedBookings || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Aankomend</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>
                  {statsLoading ? <LoadingSpinner size="sm" /> : stats?.upcomingBookings || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Totaal Uitgegeven</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>
                  {profileLoading ? <LoadingSpinner size="sm" /> : `€${userProfile?.total_spent || 0}`}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Euro className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Session - Full Width */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Volgende Sessie</CardTitle>
              <CardDescription className="text-sm">
                Je aankomende trainingsessie
              </CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {nextBookingLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : nextBooking ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>{nextBooking.services.name}</h3>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                      Bevestigd
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isMobile ? 'flex-col items-start gap-2' : 'flex-row gap-6'}`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(nextBooking.date_time).date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDateTime(nextBooking.date_time).time}</span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {nextBooking.services.duration} min
                    </span>
                  </div>
                </div>
              </div>
              <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
                <Button 
                  onClick={() => navigate('/dashboard/bookings')}
                  className="flex-1"
                  variant="outline"
                  size={isMobile ? "lg" : "default"}
                >
                  Alle Boekingen Bekijken
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/book')}
                  className="flex-1"
                  size={isMobile ? "lg" : "default"}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Sessie Boeken
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Geen aankomende sessies</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Klaar om je fitnessreis te beginnen?
              </p>
              <Button 
                onClick={() => navigate('/dashboard/book')}
                className={`${isMobile ? 'w-full' : 'w-full max-w-xs mx-auto'}`}
                size={isMobile ? "lg" : "default"}
              >
                <Plus className="w-4 h-4 mr-2" />
                Boek Je Eerste Sessie
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
