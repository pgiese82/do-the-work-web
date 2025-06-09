
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, FileText, Plus, ChevronRight } from 'lucide-react';
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
      <div className="space-y-8 p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-white/10 rounded-lg w-64 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Welcome back, {user?.user_metadata?.name || 'Athlete'}!
        </h1>
        <p className="text-xl text-gray-300 font-medium">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm border-orange-500/30 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-orange-100">Total Bookings</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{stats.totalBookings}</div>
            <p className="text-xs text-orange-200 mt-1">All time sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border-green-500/30 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-100">Completed Sessions</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{stats.completedSessions}</div>
            <p className="text-xs text-green-200 mt-1">Sessions finished</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border-blue-500/30 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-100">Upcoming Sessions</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{stats.upcomingBookings}</div>
            <p className="text-xs text-blue-200 mt-1">Sessions scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border-purple-500/30 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-100">Documents</CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{stats.totalDocuments}</div>
            <p className="text-xs text-purple-200 mt-1">Files available</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Next Booking Card - Takes 2 columns */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-white/20 text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Next Session</CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  Your upcoming training session
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {nextBooking ? (
              <div className="space-y-6">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h3 className="font-bold text-2xl text-white mb-4">{nextBooking.services.name}</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      <span className="font-medium">{formatDateTime(nextBooking.date_time).date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">{formatDateTime(nextBooking.date_time).time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                        {nextBooking.services.duration} minutes
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/dashboard/bookings')}
                  className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#d67b1e] text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  View All Bookings
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No upcoming sessions</h3>
                <p className="text-gray-300 mb-6">Ready to start your fitness journey?</p>
                <Button 
                  onClick={() => navigate('/dashboard/book')}
                  className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#d67b1e] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Book Your First Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <div className="p-1 bg-blue-500/20 rounded-lg">
                <Plus className="w-5 h-5 text-blue-400" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard/book')}
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 rounded-xl font-medium"
              >
                <div className="flex items-center">
                  <Plus className="w-4 h-4 mr-3" />
                  Book New Session
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/bookings')}
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 rounded-xl font-medium"
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  View My Bookings
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/documents')}
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 py-3 rounded-xl font-medium"
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-3" />
                  Access Documents
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
