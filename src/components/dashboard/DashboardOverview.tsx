
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

export function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedSessions: 0,
    upcomingBookings: 0,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch next upcoming booking
      const { data: upcomingBooking } = await supabase
        .from('bookings')
        .select(`
          id,
          date_time,
          status,
          services (
            name,
            duration,
            price
          )
        `)
        .eq('user_id', user?.id)
        .gte('date_time', new Date().toISOString())
        .eq('status', 'confirmed')
        .order('date_time', { ascending: true })
        .limit(1)
        .single();

      setNextBooking(upcomingBooking);

      // Fetch stats
      const [bookingsCount, completedCount, upcomingCount, documentsCount] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user?.id).eq('status', 'completed'),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user?.id).gte('date_time', new Date().toISOString()),
        supabase.from('documents').select('id', { count: 'exact' }).eq('user_id', user?.id),
      ]);

      setStats({
        totalBookings: bookingsCount.count || 0,
        completedSessions: completedCount.count || 0,
        upcomingBookings: upcomingCount.count || 0,
        totalDocuments: documentsCount.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Fout',
        description: 'Kon dashboard gegevens niet laden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-8'} max-w-7xl mx-auto`}>
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-foreground`}>
          {getGreeting()}, {user?.user_metadata?.name || 'daar'}
        </h1>
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
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>{stats.totalBookings}</p>
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
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>{stats.completedSessions}</p>
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
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>{stats.upcomingBookings}</p>
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
                <p className="text-xs font-medium text-muted-foreground">Documenten</p>
                <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>{stats.totalDocuments}</p>
              </div>
              <div className="h-8 w-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
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
          {nextBooking ? (
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
