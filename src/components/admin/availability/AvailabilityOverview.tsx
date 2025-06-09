
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, AlertTriangle, Calendar, Settings } from 'lucide-react';

interface AvailabilityRule {
  id: string;
  service_id: string;
  rule_type: string;
  rule_value: any;
  is_active: boolean;
  service: {
    name: string;
  };
}

export function AvailabilityOverview({ key: refreshKey }: { key: number }) {
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['availability-rules', refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('availability_rules')
        .select(`
          *,
          service:services(name)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data as AvailabilityRule[];
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services-basic'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  const getRulesByType = (type: string) => {
    return rules.filter(rule => rule.rule_type === type);
  };

  const formatRuleValue = (rule: AvailabilityRule) => {
    const value = rule.rule_value;
    
    switch (rule.rule_type) {
      case 'booking_notice':
        const minHours = typeof value === 'object' && value !== null && 'min_hours' in value 
          ? value.min_hours : 'Unknown';
        return `${minHours} hours notice required`;
      
      case 'max_bookings':
        const maxPerDay = typeof value === 'object' && value !== null && 'max_per_day' in value 
          ? value.max_per_day : 'Unknown';
        return `Maximum ${maxPerDay} bookings per day`;
      
      case 'schedule':
        if (typeof value === 'object' && value !== null) {
          const days = 'days_of_week' in value ? value.days_of_week : [];
          const startTime = 'start_time' in value ? value.start_time : '';
          const endTime = 'end_time' in value ? value.end_time : '';
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const activeDays = Array.isArray(days) ? days.map(d => dayNames[d]).join(', ') : 'No days';
          return `${activeDays}: ${startTime} - ${endTime}`;
        }
        return 'Schedule not configured';
      
      case 'blackout':
        if (typeof value === 'object' && value !== null) {
          const startDate = 'start_date' in value ? value.start_date : '';
          const endDate = 'end_date' in value ? value.end_date : '';
          return `Blocked: ${startDate} to ${endDate}`;
        }
        return 'Blackout period not configured';
      
      default:
        return 'Unknown rule';
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300 text-sm">Total Rules</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{rules.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Notice Rules</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{getRulesByType('booking_notice').length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Schedules</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{getRulesByType('schedule').length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-gray-300 text-sm">Blackouts</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{getRulesByType('blackout').length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Rules Summary */}
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white">Active Availability Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No availability rules configured</p>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {rule.rule_type === 'booking_notice' && <Clock className="w-4 h-4 text-blue-400" />}
                      {rule.rule_type === 'max_bookings' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                      {rule.rule_type === 'schedule' && <Calendar className="w-4 h-4 text-green-400" />}
                      {rule.rule_type === 'blackout' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      <span className="text-white font-medium">{rule.service.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-orange-500/20 text-orange-300">
                      {rule.rule_type.replace('_', ' ')}
                    </Badge>
                    <span className="text-gray-400 text-sm">{formatRuleValue(rule)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
