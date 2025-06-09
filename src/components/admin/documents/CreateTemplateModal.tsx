
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTemplateModal({ open, onOpenChange, onSuccess }: CreateTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    autoDeliverOn: 'manual'
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const createTemplateMutation = useMutation({
    mutationFn: async (data: typeof formData & { filePath: string }) => {
      const { error } = await (supabase as any)
        .from('document_templates')
        .insert({
          name: data.name,
          description: data.description,
          category: data.category,
          file_path: data.filePath,
          auto_deliver_on: data.autoDeliverOn === 'manual' ? null : data.autoDeliverOn
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "Document template has been created successfully.",
      });
      onSuccess();
      resetForm();
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `templates/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (error) throw error;
    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload.",
      });
      return;
    }

    try {
      const filePath = await uploadFile(file);
      await createTemplateMutation.mutateAsync({ ...formData, filePath });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create template.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      autoDeliverOn: 'manual'
    });
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Create Document Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-gray-700 border-gray-600"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
                <SelectItem value="program">Program</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="autoDelivery">Auto Delivery</Label>
            <Select 
              value={formData.autoDeliverOn} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, autoDeliverOn: value }))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="manual">Manual Only</SelectItem>
                <SelectItem value="booking_confirmation">On Booking Confirmation</SelectItem>
                <SelectItem value="booking_completion">On Booking Completion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file">Template File</Label>
            <div className="mt-1">
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-gray-700 border-gray-600"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createTemplateMutation.isPending}>
              <Upload className="w-4 h-4 mr-2" />
              {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
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
