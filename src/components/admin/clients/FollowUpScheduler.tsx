
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
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20',
      completed: 'bg-green-500/20 text-green-300 border-green-500/20',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/20',
      overdue: 'bg-red-500/20 text-red-300 border-red-500/20'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    
    const variants = {
      low: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20',
      high: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
      urgent: 'bg-red-500/20 text-red-300 border-red-500/20'
    };

    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {priority}
      </Badge>
    );
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
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Follow-up Scheduler
          </span>
          <Button 
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search follow-ups by client or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/50 border-orange-900/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-gray-700/50 border-orange-900/20 text-white">
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
        <div className="rounded-lg border border-orange-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Follow-up</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Scheduled Date</TableHead>
                <TableHead className="text-gray-300">Priority</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Loading follow-ups...
                  </TableCell>
                </TableRow>
              ) : followUps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No follow-ups found
                  </TableCell>
                </TableRow>
              ) : (
                followUps.map((followUp) => (
                  <TableRow key={followUp.id} className="border-orange-900/20 hover:bg-gray-700/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-white font-medium">{followUp.user?.name}</div>
                          <div className="text-gray-400 text-xs">{followUp.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white font-medium">{followUp.title}</div>
                        {followUp.description && (
                          <div className="text-gray-400 text-xs">{followUp.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(followUp.follow_up_type)}
                        <span className="text-gray-300">{followUp.follow_up_type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
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
                          className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
                        >
                          Edit
                        </Button>
                        {followUp.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
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
