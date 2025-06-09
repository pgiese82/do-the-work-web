
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
            <CardContent className="p-4 md:p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 md:h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Boekingen Vandaag",
      value: stats?.todayBookings?.toString() || "0",
      change: stats?.pendingBookings ? `${stats.pendingBookings} wachtend` : "Alle bevestigd",
      changeType: (stats?.pendingBookings || 0) > 0 ? "neutral" as const : "positive" as const,
      icon: CalendarCheck,
      description: "boekingen vandaag"
    },
    {
      title: "Omzet Vandaag",
      value: `€${stats?.todayRevenue?.toFixed(2) || "0.00"}`,
      change: stats?.completedSessionsToday ? `${stats.completedSessionsToday} sessies` : "Geen sessies",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "verdiend vandaag"
    },
    {
      title: "Totaal Klanten",
      value: stats?.totalClients?.toString() || "0",
      change: `${stats?.activeClients || 0} actief`,
      changeType: "positive" as const,
      icon: Users,
      description: "geregistreerde klanten"
    },
    {
      title: "Maandelijks Omzet",
      value: `€${stats?.monthlyRevenue?.toFixed(2) || "0.00"}`,
      change: stats?.averageSessionValue ? `€${stats.averageSessionValue.toFixed(2)} gem.` : "Geen data",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "deze maand"
    },
    {
      title: "Sessies Vandaag",
      value: stats?.completedSessionsToday?.toString() || "0",
      change: stats?.todayBookings ? `${stats.todayBookings - (stats.completedSessionsToday || 0)} resterend` : "Geen gepland",
      changeType: "neutral" as const,
      icon: CheckCircle,
      description: "voltooid"
    },
    {
      title: "Wachtende Boekingen",
      value: stats?.pendingBookings?.toString() || "0",
      change: stats?.pendingBookings ? "Aandacht vereist" : "Alle bevestigd",
      changeType: (stats?.pendingBookings || 0) > 0 ? "negative" as const : "positive" as const,
      icon: Clock,
      description: "wachten op bevestiging"
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
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
