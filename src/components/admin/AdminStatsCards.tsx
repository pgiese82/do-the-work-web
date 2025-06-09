
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAdminDashboardStats, useRealtimeUpdates } from '@/hooks/useAdminDashboardData';

export function AdminStatsCards() {
  const updateTrigger = useRealtimeUpdates();
  const { data: stats, isLoading } = useAdminDashboardStats();

  // Force refetch when realtime updates occur
  React.useEffect(() => {
    if (updateTrigger > 0) {
      console.log('📊 Realtime update triggered, refetching stats');
    }
  }, [updateTrigger]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Today's Bookings",
      value: stats?.todayBookings?.toString() || "0",
      change: stats?.pendingBookings ? `${stats.pendingBookings} pending` : "All confirmed",
      changeType: (stats?.pendingBookings || 0) > 0 ? "neutral" as const : "positive" as const,
      icon: CalendarCheck,
      description: "bookings today"
    },
    {
      title: "Today's Revenue",
      value: `€${stats?.todayRevenue?.toFixed(2) || "0.00"}`,
      change: stats?.completedSessionsToday ? `${stats.completedSessionsToday} sessions` : "No sessions",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "earned today"
    },
    {
      title: "Total Clients",
      value: stats?.totalClients?.toString() || "0",
      change: `${stats?.activeClients || 0} active`,
      changeType: "positive" as const,
      icon: Users,
      description: "registered clients"
    },
    {
      title: "Monthly Revenue",
      value: `€${stats?.monthlyRevenue?.toFixed(2) || "0.00"}`,
      change: stats?.averageSessionValue ? `€${stats.averageSessionValue.toFixed(2)} avg` : "No data",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "this month"
    },
    {
      title: "Sessions Today",
      value: stats?.completedSessionsToday?.toString() || "0",
      change: stats?.todayBookings ? `${stats.todayBookings - (stats.completedSessionsToday || 0)} remaining` : "None scheduled",
      changeType: "neutral" as const,
      icon: CheckCircle,
      description: "completed"
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings?.toString() || "0",
      change: stats?.pendingBookings ? "Need attention" : "All confirmed",
      changeType: (stats?.pendingBookings || 0) > 0 ? "negative" as const : "positive" as const,
      icon: Clock,
      description: "awaiting confirmation"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 
                'text-blue-600'
              }>
                {stat.change}
              </span>{' '}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
