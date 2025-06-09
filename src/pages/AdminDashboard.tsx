
import React from 'react';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  ArrowUpRight
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance and key metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New booking confirmed</p>
                <p className="text-xs text-muted-foreground">John Doe - Personal Training</p>
              </div>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
            
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New client registered</p>
                <p className="text-xs text-muted-foreground">Sarah Smith joined</p>
              </div>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>
            
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Payment pending review</p>
                <p className="text-xs text-muted-foreground">Mike Johnson - $150</p>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </CardContent>
        </Card>

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
                <span className="font-medium">$35K/$50K</span>
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
