
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Search, Calendar, Clock, Plus, AlertTriangle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FollowUp {
  id: string;
  user_id: string;
  follow_up_type: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  status: string;
  priority: string | null;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  admin: {
    name: string;
  } | null;
}

interface FollowUpSchedulerProps {
  key: number;
  onUpdate: () => void;
}

export function FollowUpScheduler({ onUpdate }: FollowUpSchedulerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: followUps = [], isLoading } = useQuery({
    queryKey: ['follow-ups', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('follow_ups')
        .select(`
          *,
          user:users!follow_ups_user_id_fkey(name, email),
          admin:users!follow_ups_admin_id_fkey(name)
        `)
        .order('scheduled_date', { ascending: true });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by search term
      if (searchTerm) {
        return data.filter(followUp => 
          followUp.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          followUp.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data as FollowUp[];
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      completed: { variant: 'default' as const, label: 'Completed' },
      cancelled: { variant: 'outline' as const, label: 'Cancelled' },
      overdue: { variant: 'destructive' as const, label: 'Overdue' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    
    const priorityConfig = {
      low: { variant: 'outline' as const, label: 'Low' },
      medium: { variant: 'secondary' as const, label: 'Medium' },
      high: { variant: 'default' as const, label: 'High' },
      urgent: { variant: 'destructive' as const, label: 'Urgent' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || { variant: 'outline' as const, label: priority };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'check_in': return <Calendar className="w-4 h-4" />;
      case 'booking_reminder': return <Clock className="w-4 h-4" />;
      case 'payment_reminder': return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Follow-up Scheduler
          </span>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search follow-ups by client or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading follow-ups...
                  </TableCell>
                </TableRow>
              ) : followUps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No follow-ups found
                  </TableCell>
                </TableRow>
              ) : (
                followUps.map((followUp) => (
                  <TableRow key={followUp.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{followUp.user?.name}</div>
                          <div className="text-muted-foreground text-xs">{followUp.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{followUp.title}</div>
                        {followUp.description && (
                          <div className="text-muted-foreground text-xs">{followUp.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(followUp.follow_up_type)}
                        <span className="text-muted-foreground">{followUp.follow_up_type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(followUp.scheduled_date), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(followUp.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(followUp.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        {followUp.status === 'pending' && (
                          <Button
                            size="sm"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
