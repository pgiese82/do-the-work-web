
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocumentDeliveryLogProps {
  key: number;
}

export function DocumentDeliveryLog({}: DocumentDeliveryLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: deliveryLogs, isLoading } = useQuery({
    queryKey: ['document-delivery-log'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('document_delivery_log')
        .select(`
          *,
          users (name, email),
          document_templates (name, category),
          bookings (date_time, status)
        `)
        .order('delivered_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredLogs = deliveryLogs?.filter((log: any) => {
    const matchesSearch = 
      log.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.document_templates?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const colors = {
      sent: 'bg-blue-600',
      delivered: 'bg-green-600',
      viewed: 'bg-purple-600',
      failed: 'bg-red-600'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-600'}>{status}</Badge>;
  };

  const getDeliveryMethodBadge = (method: string) => {
    const colors = {
      email: 'bg-indigo-600',
      download: 'bg-emerald-600',
      auto: 'bg-orange-600'
    };
    return <Badge variant="outline" className={colors[method as keyof typeof colors] || ''}>{method}</Badge>;
  };

  if (isLoading) {
    return <div className="text-white">Loading delivery logs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white">Document Delivery Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Document</TableHead>
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Method</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Delivered At</TableHead>
                <TableHead className="text-gray-300">Booking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log: any) => (
                <TableRow key={log.id} className="border-gray-700">
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">{log.document_templates?.name || 'Document'}</div>
                      <div className="text-sm text-gray-400 capitalize">
                        {log.document_templates?.category}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {log.users?.name}
                  </TableCell>
                  <TableCell>
                    {getDeliveryMethodBadge(log.delivery_method)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(log.delivered_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {log.bookings ? (
                      <div className="text-sm">
                        <div>{new Date(log.bookings.date_time).toLocaleDateString()}</div>
                        <div className="text-gray-400 capitalize">{log.bookings.status}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Manual</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No delivery logs found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
