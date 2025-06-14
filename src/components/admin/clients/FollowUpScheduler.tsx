
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
      pending: { variant: 'secondary' as const, label: 'In afwachting' },
      completed: { variant: 'default' as const, label: 'Voltooid' },
      cancelled: { variant: 'outline' as const, label: 'Geannuleerd' },
      overdue: { variant: 'destructive' as const, label: 'Te laat' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    
    const priorityConfig = {
      low: { variant: 'outline' as const, label: 'Laag' },
      medium: { variant: 'secondary' as const, label: 'Gemiddeld' },
      high: { variant: 'default' as const, label: 'Hoog' },
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
  
  const getTypeText = (type: string) => {
      const labels: { [key: string]: string } = {
        check_in: 'Check-in',
        booking_reminder: 'Boekingsherinnering',
        payment_reminder: 'Betalingsherinnering',
      };
      return labels[type] || type.replace('_', ' ');
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Follow-up Planner
          </span>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Follow-up Inplannen
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Zoek follow-ups op klant of titel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Statussen</SelectItem>
              <SelectItem value="pending">In afwachting</SelectItem>
              <SelectItem value="completed">Voltooid</SelectItem>
              <SelectItem value="cancelled">Geannuleerd</SelectItem>
              <SelectItem value="overdue">Te laat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klant</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Geplande Datum</TableHead>
                <TableHead>Prioriteit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Follow-ups laden...
                  </TableCell>
                </TableRow>
              ) : followUps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Geen follow-ups gevonden
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
                        <span className="text-muted-foreground">{getTypeText(followUp.follow_up_type)}</span>
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
                          Bewerken
                        </Button>
                        {followUp.status === 'pending' && (
                          <Button
                            size="sm"
                          >
                            Voltooien
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
