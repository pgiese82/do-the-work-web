
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Users,
  Clock
} from 'lucide-react';
import { useRecentActivity } from '@/hooks/useAdminDashboardData';

export function RealtimeActivityFeed() {
  const { data: activities, isLoading } = useRecentActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'payment':
        return DollarSign;
      case 'client':
        return Users;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600 bg-blue-100';
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'client':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'booking':
        return 'secondary';
      case 'payment':
        return 'default';
      case 'client':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking':
        return 'Boeking';
      case 'payment':
        return 'Betaling';
      case 'client':
        return 'Klant';
      default:
        return 'Activiteit';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Clock className="h-4 w-4 md:h-5 md:w-5" />
            Recente Activiteit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-6 w-6 md:h-8 md:w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <Clock className="h-4 w-4 md:h-5 md:w-5" />
          Recente Activiteit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {activities?.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-muted-foreground text-sm">
            Geen recente activiteit om weer te geven
          </div>
        ) : (
          activities?.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className={`flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">{activity.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                      {getTypeLabel(activity.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                {activity.amount && (
                  <div className="text-xs md:text-sm font-medium text-green-600 flex-shrink-0">
                    €{activity.amount.toFixed(2)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
