
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Clock, Calendar, CheckCircle } from 'lucide-react';

export function WaitingListStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['waiting-list-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waiting_list')
        .select(`
          id,
          status,
          created_at,
          service:services(name)
        `);
      
      if (error) throw error;

      const totalEntries = data.length;
      const activeEntries = data.filter(item => item.status === 'active').length;
      const contactedEntries = data.filter(item => item.status === 'contacted').length;
      const bookedEntries = data.filter(item => item.status === 'booked').length;

      // Group by service
      const serviceStats = data.reduce((acc, item) => {
        const serviceName = item.service?.name || 'Unknown';
        if (!acc[serviceName]) {
          acc[serviceName] = 0;
        }
        acc[serviceName]++;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEntries,
        activeEntries,
        contactedEntries,
        bookedEntries,
        serviceStats,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Entries</CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalEntries || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.activeEntries || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Contacted</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.contactedEntries || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Converted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.bookedEntries || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white">Waiting List by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats?.serviceStats || {}).map(([service, count]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-gray-300">{service}</span>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
