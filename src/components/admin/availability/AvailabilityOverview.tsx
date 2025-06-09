
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Calendar, Users, Ban } from 'lucide-react';

export function AvailabilityOverview() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-with-availability'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          availability_rules(*)
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-orange-900/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const activeRules = service.availability_rules?.filter(r => r.is_active) || [];
        const scheduleRules = activeRules.filter(r => r.rule_type === 'schedule');
        const noticeRules = activeRules.filter(r => r.rule_type === 'booking_notice');
        const maxBookingRules = activeRules.filter(r => r.rule_type === 'max_bookings');
        const blackoutRules = activeRules.filter(r => r.rule_type === 'blackout');

        return (
          <Card key={service.id} className="bg-gray-800/50 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="truncate">{service.name}</span>
                <Clock className="w-5 h-5 text-orange-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">Active Rules: {activeRules.length}</div>
                <div className="flex flex-wrap gap-1">
                  {scheduleRules.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule ({scheduleRules.length})
                    </Badge>
                  )}
                  {noticeRules.length > 0 && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                      <Clock className="w-3 h-3 mr-1" />
                      Notice ({noticeRules.length})
                    </Badge>
                  )}
                  {maxBookingRules.length > 0 && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/20">
                      <Users className="w-3 h-3 mr-1" />
                      Capacity ({maxBookingRules.length})
                    </Badge>
                  )}
                  {blackoutRules.length > 0 && (
                    <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/20">
                      <Ban className="w-3 h-3 mr-1" />
                      Blackout ({blackoutRules.length})
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {noticeRules.map((rule, index) => (
                  <div key={index} className="text-gray-300">
                    Notice: {rule.rule_value.min_hours}h minimum
                  </div>
                ))}
                {maxBookingRules.map((rule, index) => (
                  <div key={index} className="text-gray-300">
                    Max: {rule.rule_value.max_per_day} bookings/day
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-400">
                Duration: {service.duration} minutes
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
