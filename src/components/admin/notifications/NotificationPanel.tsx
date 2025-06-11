
import React, { useState } from 'react';
import { Bell, Search, Filter, Trash2, Check, CheckCheck, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow, format } from 'date-fns';
import { nl } from 'date-fns/locale';

export function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium': return <Info className="h-4 w-4 text-muted-foreground" />;
      case 'low': return <Info className="h-4 w-4 text-muted-foreground" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking': return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'payment_confirmation': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'payment_failed': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'booking_cancelled': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'same_day_cancellation': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'no_show': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeDisplayName = (type: string) => {
    const typeNames = {
      'new_booking': 'Nieuwe Boeking',
      'payment_confirmation': 'Betaling Bevestigd',
      'payment_failed': 'Betaling Mislukt',
      'booking_cancelled': 'Boeking Geannuleerd',
      'same_day_cancellation': 'Zelfde Dag Annulering',
      'no_show': 'Niet Verschenen'
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  const getPriorityDisplayName = (priority: string) => {
    const priorityNames = {
      'critical': 'Kritiek',
      'high': 'Hoog',
      'medium': 'Gemiddeld',
      'low': 'Laag'
    };
    return priorityNames[priority as keyof typeof priorityNames] || priority;
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'read' && notification.is_read) ||
      (filterStatus === 'unread' && !notification.is_read);
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const notificationTypes = [
    'new_booking',
    'payment_confirmation', 
    'payment_failed',
    'booking_cancelled',
    'same_day_cancellation',
    'no_show'
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Totaal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ongelezen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{unreadCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Kritiek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {notifications.filter(n => n.priority === 'critical').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Vandaag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {notifications.filter(n => 
                new Date(n.created_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Notificatie Geschiedenis</CardTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Alles Markeren als Gelezen
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek notificaties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Types</SelectItem>
                {notificationTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {getTypeDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="unread">Ongelezen</SelectItem>
                <SelectItem value="read">Gelezen</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Prioriteit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Prioriteiten</SelectItem>
                <SelectItem value="critical">Kritiek</SelectItem>
                <SelectItem value="high">Hoog</SelectItem>
                <SelectItem value="medium">Gemiddeld</SelectItem>
                <SelectItem value="low">Laag</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
                setFilterPriority('all');
              }}
            >
              Filters Wissen
            </Button>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Geen notificaties voldoen aan uw filters'
                    : 'Nog geen notificaties'
                  }
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors border-l-4 ${
                      !notification.is_read 
                        ? 'bg-muted/50 border-l-primary hover:bg-muted' 
                        : 'border-l-border hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate">
                                {notification.title}
                              </h4>
                              {getPriorityIcon(notification.priority)}
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                {getPriorityDisplayName(notification.priority)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getTypeDisplayName(notification.type)}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), 'dd MMM, yyyy HH:mm', { locale: nl })}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: nl })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
