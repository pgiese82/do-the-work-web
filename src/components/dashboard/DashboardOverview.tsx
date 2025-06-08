
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
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
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-md w-48 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">
          Welcome back, {user?.user_metadata?.name || 'Athlete'}!
        </h1>
        <p className="text-gray-300">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Next Booking Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-400" />
              Next Session
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your upcoming training session
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextBooking ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{nextBooking.services.name}</h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>{formatDateTime(nextBooking.date_time).date}</p>
                    <p>{formatDateTime(nextBooking.date_time).time}</p>
                    <p>{nextBooking.services.duration} minutes</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/dashboard/bookings')}
                  className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#d67b1e] text-white"
                >
                  View All Bookings
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-300 mb-4">No upcoming sessions scheduled</p>
                <Button 
                  onClick={() => navigate('/dashboard/book')}
                  className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#d67b1e] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Your First Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription className="text-gray-300">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard/book')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book New Session
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/bookings')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View My Bookings
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/documents')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <FileText className="w-4 h-4 mr-2" />
                Access Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
