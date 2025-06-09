
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

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of your business performance and key metrics.
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Today's Sessions</span>
                <span className="font-medium">12/15</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-4/5 rounded-full bg-primary"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Goal</span>
                <span className="font-medium">€35K/€50K</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client Retention</span>
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
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">9:00 AM</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2">Personal Training</h4>
              <p className="text-sm text-muted-foreground">with John Doe</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">11:00 AM</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2">Nutrition Consultation</h4>
              <p className="text-sm text-muted-foreground">with Sarah Smith</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">2:00 PM</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2">Group Session</h4>
              <p className="text-sm text-muted-foreground">HIIT Class</p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">4:00 PM</Badge>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <h4 className="font-medium mt-2">Personal Training</h4>
              <p className="text-sm text-muted-foreground">with Mike Johnson</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
