
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Eye, Search } from 'lucide-react';

export function Documents() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: documents, isLoading } = useQuery({
    queryKey: ['user-documents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: assignments } = useQuery({
    queryKey: ['user-document-assignments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('document_assignments')
        .select(`
          *,
          document_templates (name, description, category)
        `)
        .eq('user_id', user.id)
        .eq('status', 'delivered')
        .order('delivery_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredAssignments = assignments?.filter((assignment: any) =>
    assignment.document_templates?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.document_templates?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Documents</h1>
          <p className="text-gray-300">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Documents</h1>
        <p className="text-gray-300">
          Access your training documents, contracts, and receipts
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border-white/20 text-white pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {/* Personal Documents */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Documents
            </CardTitle>
            <CardDescription className="text-gray-300">
              Documents uploaded specifically for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Size</TableHead>
                    <TableHead className="text-gray-300">Upload Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id} className="border-white/10">
                      <TableCell className="text-white font-medium">
                        {document.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-white/20 text-gray-300">
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
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No personal documents yet</h3>
                <p className="text-gray-300">
                  Your trainer will upload documents specifically for you here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Documents */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Available Templates
            </CardTitle>
            <CardDescription className="text-gray-300">
              Training programs and forms assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAssignments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300">Document</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Delivery Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment: any) => (
                    <TableRow key={assignment.id} className="border-white/10">
                      <TableCell className="text-white font-medium">
                        {assignment.document_templates?.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-white/20 text-gray-300">
                          {assignment.document_templates?.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {assignment.document_templates?.description || 'No description'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {assignment.delivery_date ? new Date(assignment.delivery_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No templates assigned yet</h3>
                <p className="text-gray-300">
                  Your trainer will assign training programs and forms as needed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
