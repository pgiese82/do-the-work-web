
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Upload, AlertCircle } from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { validateFile } from '@/utils/documentValidation';

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
  const [fileError, setFileError] = useState<string | null>(null);
  
  const { uploadDocument, uploading } = useDocumentUpload();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileError(null);

    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.isValid) {
        setFileError(validation.error || 'Ongeldig bestand');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('Selecteer een bestand om te uploaden.');
      return;
    }

    const result = await uploadDocument({
      file,
      title: formData.title,
      category: formData.category,
      userId: formData.userId
    });

    if (result) {
      onSuccess();
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      userId: ''
    });
    setFile(null);
    setFileError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Document Uploaden</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client">Klant</Label>
            <Select 
              value={formData.userId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
              required
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Selecteer klant" />
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
            <Label htmlFor="title">Document Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categorie</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Selecteer categorie" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Factuur</SelectItem>
                <SelectItem value="receipt">Bon</SelectItem>
                <SelectItem value="program">Programma</SelectItem>
                <SelectItem value="medical">Medisch</SelectItem>
                <SelectItem value="other">Overig</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file">Bestand</Label>
            <div className="mt-1">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="bg-gray-700 border-gray-600"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                required
              />
              {fileError && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {fileError}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Toegestane bestandstypen: PDF, Word, afbeeldingen, tekst. Max 10MB.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={uploading || !!fileError}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploaden...' : 'Document Uploaden'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
