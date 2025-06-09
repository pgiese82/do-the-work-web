
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, TrendingUp, Calendar, DollarSign, UserCheck, UserX } from 'lucide-react';

export function ClientsOverview({ key: refreshKey }: { key: number }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['client-stats', refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('client_status, total_spent, last_session_date, created_at')
        .eq('role', 'client');

      if (error) throw error;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const totalClients = data.length;
      const activeClients = data.filter(u => u.client_status === 'active').length;
      const prospects = data.filter(u => u.client_status === 'prospect').length;
      const inactiveClients = data.filter(u => u.client_status === 'inactive').length;
      const totalRevenue = data.reduce((sum, u) => sum + (u.total_spent || 0), 0);
      const newClientsThisMonth = data.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length;
      const recentSessions = data.filter(u => u.last_session_date && new Date(u.last_session_date) >= thirtyDaysAgo).length;

      return {
        totalClients,
        activeClients,
        prospects,
        inactiveClients,
        totalRevenue,
        newClientsThisMonth,
        recentSessions,
        averageValue: totalClients > 0 ? totalRevenue / totalClients : 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-orange-900/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300 text-sm">Total Clients</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{stats?.totalClients || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 text-sm">Active Clients</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{stats?.activeClients || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-sm">Prospects</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{stats?.prospects || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-red-400" />
            <span className="text-gray-300 text-sm">Inactive Clients</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{stats?.inactiveClients || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 text-sm">Total Revenue</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">€{stats?.totalRevenue?.toFixed(2) || '0.00'}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300 text-sm">Avg. Client Value</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">€{stats?.averageValue?.toFixed(2) || '0.00'}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-300 text-sm">New This Month</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{stats?.newClientsThisMonth || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span className="text-gray-300 text-sm">Recent Sessions</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{stats?.recentSessions || 0}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
