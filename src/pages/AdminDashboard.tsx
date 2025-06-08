
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Dashboard Overview</h2>
          <p className="text-gray-300">
            Welcome to the admin dashboard. Monitor your business performance and manage operations.
          </p>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards />

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">New booking confirmed</p>
                  <p className="text-gray-400 text-xs">John Doe - Personal Training</p>
                </div>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <Users className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">New client registered</p>
                  <p className="text-gray-400 text-xs">Sarah Smith joined</p>
                </div>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">Payment pending review</p>
                  <p className="text-gray-400 text-xs">Mike Johnson - $150</p>
                </div>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800/50 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Today's Sessions</span>
                  <span className="text-white font-semibold">12/15</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Goal</span>
                  <span className="text-white font-semibold">$35K/$50K</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Client Retention</span>
                  <span className="text-white font-semibold">94%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <div className="text-orange-400 text-sm font-medium">9:00 AM</div>
                <div className="text-white font-semibold">Personal Training</div>
                <div className="text-gray-400 text-sm">with John Doe</div>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <div className="text-orange-400 text-sm font-medium">11:00 AM</div>
                <div className="text-white font-semibold">Nutrition Consultation</div>
                <div className="text-gray-400 text-sm">with Sarah Smith</div>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <div className="text-orange-400 text-sm font-medium">2:00 PM</div>
                <div className="text-white font-semibold">Group Session</div>
                <div className="text-gray-400 text-sm">HIIT Class</div>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <div className="text-orange-400 text-sm font-medium">4:00 PM</div>
                <div className="text-white font-semibold">Personal Training</div>
                <div className="text-gray-400 text-sm">with Mike Johnson</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
