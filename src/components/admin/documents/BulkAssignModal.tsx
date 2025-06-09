
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';

interface BulkAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BulkAssignModal({ open, onOpenChange, onSuccess }: BulkAssignModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: templates } = useQuery({
    queryKey: ['templates-for-assignment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id, name, category')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: clients } = useQuery({
    queryKey: ['clients-for-assignment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, client_status')
        .eq('role', 'client')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const bulkAssignMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const assignments = selectedClients.map(clientId => ({
        template_id: selectedTemplate,
        user_id: clientId,
        assigned_by: user?.id
      }));

      const { error } = await supabase
        .from('document_assignments')
        .insert(assignments);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Bulk assignment completed",
        description: `Assigned template to ${selectedClients.length} clients.`,
      });
      onSuccess();
      resetForm();
    },
  });

  const handleClientToggle = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients?.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients?.map(c => c.id) || []);
    }
  };

  const resetForm = () => {
    setSelectedTemplate('');
    setSelectedClients([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || selectedClients.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a template and at least one client.",
      });
      return;
    }

    bulkAssignMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Assign Documents</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="template">Document Template</Label>
            <Select 
              value={selectedTemplate} 
              onValueChange={setSelectedTemplate}
              required
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>Select Clients ({selectedClients.length} selected)</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedClients.length === clients?.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-600 rounded p-3">
              {clients?.map((client) => (
                <div key={client.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={client.id}
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={(checked) => handleClientToggle(client.id, !!checked)}
                  />
                  <label htmlFor={client.id} className="flex-1 text-sm cursor-pointer">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-gray-400 text-xs">{client.email}</div>
                  </label>
                  <div className="text-xs text-gray-400 capitalize">
                    {client.client_status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={bulkAssignMutation.isPending}>
              <Users className="w-4 h-4 mr-2" />
              {bulkAssignMutation.isPending ? 'Assigning...' : `Assign to ${selectedClients.length} clients`}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
