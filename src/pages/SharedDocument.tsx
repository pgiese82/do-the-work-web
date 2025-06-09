
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SharedDocument {
  id: string;
  title: string;
  category: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}

export default function SharedDocument() {
  const { token } = useParams<{ token: string }>();
  const [document, setDocument] = useState<SharedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      fetchSharedDocument();
    }
  }, [token]);

  const fetchSharedDocument = async () => {
    try {
      const { data, error } = await supabase.rpc('get_shared_document', {
        share_token: token
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        setError('Document niet gevonden of link is verlopen.');
        return;
      }

      setDocument(data[0]);
    } catch (error: any) {
      console.error('Error fetching shared document:', error);
      setError('Er is een fout opgetreden bij het laden van het document.');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async () => {
    if (!document) return;

    setDownloading(true);
    
    try {
      // Get signed URL for download
      const { data: signedUrl, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.storage_path, 3600);

      if (error) throw error;

      // Download file
      const response = await fetch(signedUrl.signedUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download gestart",
        description: "Het document wordt gedownload.",
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download mislukt",
        description: "Er is een fout opgetreden bij het downloaden.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Document laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Document niet beschikbaar</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Gedeeld Document
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Dit document is met je gedeeld en kan worden gedownload
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {document.title}
              </h3>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {document.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Grootte: {formatFileSize(document.file_size)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Geüpload: {new Date(document.created_at).toLocaleDateString('nl-NL')}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={downloadDocument}
                disabled={downloading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Downloaden...' : 'Document Downloaden'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Deze link is tijdelijk beschikbaar en zal verlopen.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
