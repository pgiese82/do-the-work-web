
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
    if (!bytes) return 'Onbekend';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div className="space-y-3">
          <div className="h-8 bg-gray-100 rounded-lg w-64 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded w-96 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Documenten</h1>
        <p className="text-gray-600 text-lg">
          Toegang tot je trainingsdocumenten, contracten en bonnen
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Zoek documenten..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-8">
        {/* Personal Documents */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Mijn Documenten
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Documenten die speciaal voor jou zijn geüpload
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700 font-medium">Titel</TableHead>
                      <TableHead className="text-gray-700 font-medium">Categorie</TableHead>
                      <TableHead className="text-gray-700 font-medium">Grootte</TableHead>
                      <TableHead className="text-gray-700 font-medium">Upload Datum</TableHead>
                      <TableHead className="text-gray-700 font-medium">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id} className="hover:bg-gray-50">
                        <TableCell className="text-gray-900 font-medium">
                          {document.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
                            {document.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatFileSize(document.file_size)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(document.upload_date).toLocaleDateString('nl-NL')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Nog geen persoonlijke documenten</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Je trainer zal hier documenten uploaden die speciaal voor jou zijn
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Documents */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Beschikbare Sjablonen
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Trainingsprogramma's en formulieren die aan jou zijn toegewezen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAssignments.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700 font-medium">Document</TableHead>
                      <TableHead className="text-gray-700 font-medium">Categorie</TableHead>
                      <TableHead className="text-gray-700 font-medium">Beschrijving</TableHead>
                      <TableHead className="text-gray-700 font-medium">Leveringsdatum</TableHead>
                      <TableHead className="text-gray-700 font-medium">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment: any) => (
                      <TableRow key={assignment.id} className="hover:bg-gray-50">
                        <TableCell className="text-gray-900 font-medium">
                          {assignment.document_templates?.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize bg-green-50 text-green-700 border-green-200">
                            {assignment.document_templates?.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {assignment.document_templates?.description || 'Geen beschrijving'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {assignment.delivery_date ? new Date(assignment.delivery_date).toLocaleDateString('nl-NL') : 'N.v.t.'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Nog geen sjablonen toegewezen</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Je trainer zal trainingsprogramma's en formulieren toewijzen wanneer nodig
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
