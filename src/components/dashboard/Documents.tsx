
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Upload, Share2, Eye, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';
import { useToast } from '@/hooks/use-toast';

type DocumentCategory = 'contract' | 'invoice' | 'receipt' | 'program' | 'medical' | 'other' | 'all';

export function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory>('all');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { downloadDocument, shareDocument, downloading } = useDocumentDownload();
  const { toast } = useToast();

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['user-documents', user?.id, categoryFilter],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Onbekend';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Bestand is te groot. Maximum grootte is 10MB.');
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Bestandstype niet toegestaan.');
      }

      // Create storage path
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExt}`;
      const storagePath = `${user.id}/${year}/${month}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          category: 'other',
          user_id: user.id,
          storage_path: storagePath,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([storagePath]);
        throw dbError;
      }

      toast({
        title: "Document geüpload",
        description: "Het document is succesvol geüpload.",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload mislukt",
        description: error.message || "Er is een fout opgetreden bij het uploaden.",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDownload = (document: any) => {
    downloadDocument(document.id, document.title);
  };

  const handleShare = (document: any) => {
    shareDocument(document.id, 24);
  };

  if (!user) {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Login vereist</h2>
          <p className="text-muted-foreground">Log in om je documenten te bekijken.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Documenten</h1>
          <p className="text-muted-foreground">Bekijk en download je documenten</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Mijn Documenten</CardTitle>
              <CardDescription>
                Hier vind je al je training gerelateerde documenten
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
              />
              <Button 
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploaden...' : 'Upload Document'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Zoek documenten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={categoryFilter} onValueChange={(value: DocumentCategory) => setCategoryFilter(value)}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Factuur</SelectItem>
                <SelectItem value="receipt">Bon</SelectItem>
                <SelectItem value="program">Programma</SelectItem>
                <SelectItem value="medical">Medisch</SelectItem>
                <SelectItem value="other">Overig</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Documenten laden...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Geen documenten gevonden met de huidige filters.'
                  : 'Nog geen documenten. Upload je eerste document om te beginnen.'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Grootte</TableHead>
                  <TableHead>Upload Datum</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {document.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {document.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatFileSize(document.file_size)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(document.created_at).toLocaleDateString('nl-NL')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(document)}
                          disabled={downloading === document.id}
                          title="Downloaden"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShare(document)}
                          title="Delen"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
