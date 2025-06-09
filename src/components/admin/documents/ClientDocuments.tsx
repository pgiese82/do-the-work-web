
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

export function ClientDocuments({ onUpdate }: ClientDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const { downloadDocument, shareDocument, downloading } = useDocumentDownload();

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

  const handleShare = (document: any) => {
    shareDocument(document.id, 24);
  };

  if (isLoading) {
    return <div className="text-white">Documenten laden...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Klant Documenten</CardTitle>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
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
              className="bg-gray-700 border-gray-600 text-white flex-1"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
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
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Titel</TableHead>
                <TableHead className="text-gray-300">Klant</TableHead>
                <TableHead className="text-gray-300">Categorie</TableHead>
                <TableHead className="text-gray-300">Grootte</TableHead>
                <TableHead className="text-gray-300">Upload Datum</TableHead>
                <TableHead className="text-gray-300">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">
                    {document.title}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {document.users?.name || 'Onbekend'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {document.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatFileSize(document.file_size)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(document.created_at).toLocaleDateString('nl-NL')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                        title="Bekijken"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(document)}
                        disabled={downloading === document.id}
                        className="text-gray-300 hover:text-white"
                        title="Downloaden"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShare(document)}
                        className="text-gray-300 hover:text-white"
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
            <div className="text-center py-8 text-gray-400">
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
