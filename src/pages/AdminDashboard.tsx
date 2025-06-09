
import React from 'react';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Monitor your business performance and manage operations.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards />

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-foreground text-sm">New booking confirmed</p>
                <p className="text-muted-foreground text-xs">John Doe - Personal Training</p>
              </div>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-foreground text-sm">New client registered</p>
                <p className="text-muted-foreground text-xs">Sarah Smith joined</p>
              </div>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-foreground text-sm">Payment pending review</p>
                <p className="text-muted-foreground text-xs">Mike Johnson - $150</p>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Today's Sessions</span>
                <span className="text-foreground font-semibold">12/15</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Goal</span>
                <span className="text-foreground font-semibold">$35K/$50K</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Client Retention</span>
                <span className="text-foreground font-semibold">94%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-primary text-sm font-medium">9:00 AM</div>
              <div className="text-foreground font-semibold">Personal Training</div>
              <div className="text-muted-foreground text-sm">with John Doe</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-primary text-sm font-medium">11:00 AM</div>
              <div className="text-foreground font-semibold">Nutrition Consultation</div>
              <div className="text-muted-foreground text-sm">with Sarah Smith</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-primary text-sm font-medium">2:00 PM</div>
              <div className="text-foreground font-semibold">Group Session</div>
              <div className="text-muted-foreground text-sm">HIIT Class</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-primary text-sm font-medium">4:00 PM</div>
              <div className="text-foreground font-semibold">Personal Training</div>
              <div className="text-muted-foreground text-sm">with Mike Johnson</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
