
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Send, Check } from 'lucide-react';
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
      const { data, error } = await (supabase as any)
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

      const { error } = await (supabase as any)
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

  const filteredAssignments = assignments?.filter((assignment: any) =>
    assignment.document_templates?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      viewed: { variant: 'outline' as const, label: 'Viewed' },
      completed: { variant: 'default' as const, label: 'Completed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <CardTitle>Document Assignments</CardTitle>
            <Button onClick={() => setShowBulkModal(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Bulk Assign
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div className="flex gap-4">
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment: any) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {assignment.document_templates?.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
                    <TableCell className="text-muted-foreground">
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
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
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
