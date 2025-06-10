
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDocumentDownload() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadDocument = async (documentId: string, fileName: string) => {
    setDownloading(documentId);
    
    try {
      // Get document storage path from database
      const { data: storagePath, error } = await supabase.rpc('get_document_download_url', {
        document_id: documentId
      });

      if (error) throw error;

      // Generate signed URL using client-side storage API
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (urlError) throw urlError;

      // Download file
      const response = await fetch(signedUrlData.signedUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
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
        description: error.message || "Er is een fout opgetreden bij het downloaden.",
      });
    } finally {
      setDownloading(null);
    }
  };

  const shareDocument = async (documentId: string, expiresInHours: number = 24) => {
    try {
      const { data, error } = await supabase.rpc('create_document_share_token', {
        document_id: documentId,
        expires_in_hours: expiresInHours
      });

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/${data}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Deel-link gemaakt",
        description: "De deel-link is gekopieerd naar het klembord.",
      });

      return shareUrl;
    } catch (error: any) {
      console.error('Share error:', error);
      toast({
        variant: "destructive",
        title: "Delen mislukt",
        description: error.message || "Er is een fout opgetreden bij het maken van de deel-link.",
      });
      return null;
    }
  };

  return { downloadDocument, shareDocument, downloading };
}
