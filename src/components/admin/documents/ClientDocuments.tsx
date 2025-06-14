
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Download, Eye, Share2, Filter } from 'lucide-react';
import { UploadDocumentModal } from './UploadDocumentModal';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';

interface ClientDocumentsProps {
  key: number;
  onUpdate: () => void;
}

type DocumentCategory = 'contract' | 'invoice' | 'receipt' | 'program' | 'medical' | 'other' | 'all';

export function ClientDocuments({ onUpdate }: ClientDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const { downloadDocument, viewDocument, shareDocument, downloading, viewing } = useDocumentDownload();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['client-documents', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select(`
          *,
          users (name, email)
        `)
        .order('created_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Onbekend';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (document: any) => {
    downloadDocument(document.id, document.title);
  };

  const handleView = (document: any) => {
    viewDocument(document.id, document.title);
  };

  const handleShare = (document: any) => {
    shareDocument(document.id, 24);
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Documenten laden...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Klant Documenten</CardTitle>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Document Uploaden
            </Button>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Klant</TableHead>
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
                    {document.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {document.users?.name || 'Onbekend'}
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
                        onClick={() => handleView(document)}
                        disabled={viewing === document.id}
                        title="Bekijken"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Geen documenten gevonden met de huidige filters.'
                : 'Nog geen documenten. Upload het eerste document om te beginnen.'
              }
            </div>
          )}
        </CardContent>
      </Card>

      <UploadDocumentModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onSuccess={() => {
          onUpdate();
          setShowUploadModal(false);
        }}
      />
    </div>
  );
}
