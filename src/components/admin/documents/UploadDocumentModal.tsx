
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadDocumentModal({ open, onOpenChange, onSuccess }: UploadDocumentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    userId: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: clients } = useQuery({
    queryKey: ['clients-for-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'client')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: typeof formData & { filePath: string; fileSize: number; mimeType: string }) => {
      const { error } = await supabase
        .from('documents')
        .insert({
          title: data.title,
          category: data.category as any,
          user_id: data.userId,
          file_path: data.filePath,
          file_size: data.fileSize,
          mime_type: data.mimeType
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Document uploaded",
        description: "Document has been uploaded successfully.",
      });
      onSuccess();
      resetForm();
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `clients/${formData.userId}/${Date.now()}.${fileExt}`;
    
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
      await uploadDocumentMutation.mutateAsync({
        ...formData,
        filePath,
        fileSize: file.size,
        mimeType: file.type
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload document.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      userId: ''
    });
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Client Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client">Client</Label>
            <Select 
              value={formData.userId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
              required
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-gray-700 border-gray-600"
              required
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
            <Label htmlFor="file">File</Label>
            <div className="mt-1">
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={uploadDocumentMutation.isPending}>
              <Upload className="w-4 h-4 mr-2" />
              {uploadDocumentMutation.isPending ? 'Uploading...' : 'Upload Document'}
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
