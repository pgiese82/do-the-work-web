
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Download, Eye, Upload } from 'lucide-react';
import { UploadDocumentModal } from './UploadDocumentModal';

interface ClientDocumentsProps {
  key: number;
  onUpdate: () => void;
}

export function ClientDocuments({ onUpdate }: ClientDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['client-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          users (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="text-white">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Client Documents</CardTitle>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Size</TableHead>
                <TableHead className="text-gray-300">Upload Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">
                    {document.title}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {document.users?.name || 'Unknown'}
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
                    {new Date(document.upload_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No documents found. Upload the first document to get started.
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
