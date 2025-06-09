
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Upload, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateTemplateModal } from './CreateTemplateModal';

interface DocumentTemplatesProps {
  key: number;
  onUpdate: () => void;
}

export function DocumentTemplates({ onUpdate }: DocumentTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['document-templates'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await (supabase as any)
        .from('document_templates')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast({
        title: "Template updated",
        description: "Template status has been updated successfully.",
      });
      onUpdate();
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('document_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast({
        title: "Template deleted",
        description: "Template has been deleted successfully.",
      });
      onUpdate();
    },
  });

  const filteredTemplates = templates?.filter((template: any) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getAutoDeliveryBadge = (autoDeliverOn: string | null) => {
    if (!autoDeliverOn || autoDeliverOn === 'manual') {
      return <Badge variant="secondary">Manual</Badge>;
    }
    return autoDeliverOn === 'booking_confirmation' 
      ? <Badge className="bg-blue-600">On Booking</Badge>
      : <Badge className="bg-green-600">On Completion</Badge>;
  };

  if (isLoading) {
    return <div className="text-white">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Document Templates</CardTitle>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Auto Delivery</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template: any) => (
                <TableRow key={template.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">
                    {template.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {template.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getAutoDeliveryBadge(template.auto_deliver_on)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(template.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActiveMutation.mutate({ 
                          id: template.id, 
                          isActive: template.is_active 
                        })}
                        className="text-gray-300 hover:text-white"
                      >
                        {template.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => deleteTemplateMutation.mutate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No templates found. Create your first template to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTemplateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          onUpdate();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
