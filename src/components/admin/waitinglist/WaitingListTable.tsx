
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Search, Mail, Phone, Users } from 'lucide-react';

interface WaitingListTableProps {
  onUpdate: () => void;
}

export function WaitingListTable({ onUpdate }: WaitingListTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: waitingList = [], isLoading } = useQuery({
    queryKey: ['waiting-list', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('waiting_list')
        .select(`
          *,
          user:users(name, email, phone),
          service:services(name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by search term
      if (searchTerm) {
        return data.filter(item => 
          item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.service?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('waiting_list')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-list'] });
      onUpdate();
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      booked: 'bg-green-500/20 text-green-400 border-green-500/20',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/20',
    };

    return (
      <Badge variant="secondary" className={variants[status] || variants.active}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Waiting List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">Loading waiting list...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Waiting List
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by client name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/50 border-orange-900/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-gray-700/50 border-orange-900/20 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-orange-900/20">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="active" className="text-white">Active</SelectItem>
              <SelectItem value="contacted" className="text-white">Contacted</SelectItem>
              <SelectItem value="booked" className="text-white">Booked</SelectItem>
              <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-orange-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Service</TableHead>
                <TableHead className="text-gray-300">Preferred Date</TableHead>
                <TableHead className="text-gray-300">Time Preference</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitingList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No waiting list entries found
                  </TableCell>
                </TableRow>
              ) : (
                waitingList.map((item) => (
                  <TableRow key={item.id} className="border-orange-900/20 hover:bg-gray-700/20">
                    <TableCell>
                      <div>
                        <div className="text-white font-medium">{item.user?.name}</div>
                        <div className="text-gray-400 text-sm">{item.user?.email}</div>
                        {item.user?.phone && (
                          <div className="text-gray-400 text-sm">{item.user.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{item.service?.name}</TableCell>
                    <TableCell className="text-gray-300">
                      {format(new Date(item.preferred_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {item.preferred_time_start && item.preferred_time_end
                        ? `${item.preferred_time_start} - ${item.preferred_time_end}`
                        : 'Flexible'
                      }
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {format(new Date(item.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={item.status}
                          onValueChange={(value) => updateStatusMutation.mutate({ id: item.id, status: value })}
                        >
                          <SelectTrigger className="w-[120px] bg-gray-700/50 border-orange-900/20 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-orange-900/20">
                            <SelectItem value="active" className="text-white">Active</SelectItem>
                            <SelectItem value="contacted" className="text-white">Contacted</SelectItem>
                            <SelectItem value="booked" className="text-white">Booked</SelectItem>
                            <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
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
