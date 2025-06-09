
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Filter, Search, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationPanel() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadNotifications = filteredNotifications.filter(n => !n.is_read);
  const readNotifications = filteredNotifications.filter(n => n.is_read);

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-600',
      medium: 'bg-blue-600',
      low: 'bg-gray-600'
    };
    return <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-600'}>{priority}</Badge>;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking': return '📅';
      case 'payment_confirmation': return '💰';
      case 'payment_failed': return '❌';
      case 'booking_cancelled': return '🚫';
      case 'same_day_cancellation': return '⚠️';
      case 'no_show': return '👻';
      default: return '🔔';
    }
  };

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card 
      className={`mb-4 transition-all duration-200 ${
        !notification.is_read 
          ? 'bg-gray-700/50 border-orange-500/30 shadow-lg' 
          : 'bg-gray-800/30 border-gray-700'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white">{notification.title}</h4>
                {getPriorityBadge(notification.priority)}
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>
              <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
                <div className="flex items-center gap-2">
                  {!notification.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new_booking">New Bookings</SelectItem>
                <SelectItem value="payment_confirmation">Payment Confirmations</SelectItem>
                <SelectItem value="payment_failed">Payment Failures</SelectItem>
                <SelectItem value="booking_cancelled">Cancellations</SelectItem>
                <SelectItem value="same_day_cancellation">Same-Day Cancellations</SelectItem>
                <SelectItem value="no_show">No Shows</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="bg-gray-700 border-gray-600 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            {unreadNotifications.length > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark All Read
              </Button>
            )}
          </div>

          {/* Notification Tabs */}
          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="unread" className="data-[state=active]:bg-orange-500">
                Unread ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-orange-500">
                All ({filteredNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="read" className="data-[state=active]:bg-orange-500">
                Read ({readNotifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="mt-4">
              {unreadNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No unread notifications!</p>
                </div>
              ) : (
                unreadNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4" />
                  <p>No notifications found.</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-4">
              {readNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <p>No read notifications.</p>
                </div>
              ) : (
                readNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
