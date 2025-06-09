
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Send, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BulkAssignModal } from './BulkAssignModal';

interface DocumentAssignmentsProps {
  key: number;
  onUpdate: () => void;
}

export function DocumentAssignments({ onUpdate }: DocumentAssignmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['document-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_assignments')
        .select(`
          *,
          document_templates (name, category),
          users (name, email)
        `)
        .order('assigned_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === 'delivered') {
        updates.delivery_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('document_assignments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-assignments'] });
      toast({
        title: "Assignment updated",
        description: "Assignment status has been updated successfully.",
      });
      onUpdate();
    },
  });

  const filteredAssignments = assignments?.filter(assignment =>
    assignment.document_templates?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-600',
      delivered: 'bg-blue-600',
      viewed: 'bg-green-600',
      completed: 'bg-emerald-600'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-600'}>{status}</Badge>;
  };

  if (isLoading) {
    return <div className="text-white">Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Document Assignments</CardTitle>
            <Button 
              onClick={() => setShowBulkModal(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Bulk Assign
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Template</TableHead>
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Assigned Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">
                    {assignment.document_templates?.name}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {assignment.users?.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {assignment.document_templates?.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(assignment.status)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(assignment.assigned_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {assignment.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: assignment.id, 
                            status: 'delivered' 
                          })}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      {assignment.status === 'delivered' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: assignment.id, 
                            status: 'completed' 
                          })}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No assignments found. Create bulk assignments to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <BulkAssignModal
        open={showBulkModal}
        onOpenChange={setShowBulkModal}
        onSuccess={() => {
          onUpdate();
          setShowBulkModal(false);
        }}
      />
    </div>
  );
}
