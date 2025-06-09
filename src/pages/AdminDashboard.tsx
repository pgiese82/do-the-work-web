
import React from 'react';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { RealtimeActivityFeed } from '@/components/admin/RealtimeActivityFeed';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminDashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Real-time overzicht van je bedrijfsprestaties en belangrijke statistieken.
        </p>
      </div>

      {/* Stats Cards with Real-time Updates */}
      <AdminStatsCards />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Real-time Activity Feed */}
        <div className="lg:col-span-4">
          <RealtimeActivityFeed />
        </div>

        {/* Performance Summary */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
              Prestaties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Sessies Vandaag</span>
                <span className="font-medium">12/15</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-4/5 rounded-full bg-primary"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Maandelijks Doel</span>
                <span className="font-medium">€35K/€50K</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Klantenbehoud</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-[94%] rounded-full bg-blue-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Calendar className="h-4 w-4 md:h-5 md:w-5" />
            Planning Vandaag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">9:00</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2 text-sm">Personal Training</h4>
              <p className="text-xs text-muted-foreground">met Jan de Vries</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">11:00</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2 text-sm">Voedingsadvies</h4>
              <p className="text-xs text-muted-foreground">met Sarah Smit</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">14:00</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2 text-sm">Groepssessie</h4>
              <p className="text-xs text-muted-foreground">HIIT Training</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">16:00</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2 text-sm">Personal Training</h4>
              <p className="text-xs text-muted-foreground">met Mike Jansen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
