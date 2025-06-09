
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateFile, generateFileHash } from '@/utils/documentValidation';

interface UploadDocumentParams {
  file: File;
  title: string;
  category: string;
  userId: string;
}

type DocumentCategory = 'contract' | 'invoice' | 'receipt' | 'program' | 'medical' | 'other';

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async ({ file, title, category, userId }: UploadDocumentParams) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Bestand niet geldig",
        description: validation.error,
      });
      return null;
    }

    setUploading(true);
    
    try {
      // Generate file hash for deduplication
      const fileHash = await generateFileHash(file);

      // Check if file already exists
      const { data: existingDoc } = await supabase
        .from('documents')
        .select('id')
        .eq('file_hash', fileHash)
        .eq('user_id', userId)
        .single();

      if (existingDoc) {
        toast({
          variant: "destructive",
          title: "Bestand bestaat al",
          description: "Dit bestand is al eerder geüpload.",
        });
        return null;
      }

      // Create storage path: user_id/year/month/filename
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExt}`;
      const storagePath = `${userId}/${year}/${month}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Create database record
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          title,
          category: category as DocumentCategory,
          user_id: userId,
          storage_path: storagePath,
          file_size: file.size,
          mime_type: file.type,
          file_hash: fileHash
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([storagePath]);
        throw dbError;
      }

      toast({
        title: "Document geüpload",
        description: "Het document is succesvol geüpload.",
      });

      return document;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload mislukt",
        description: error.message || "Er is een fout opgetreden bij het uploaden.",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadDocument, uploading };
}
