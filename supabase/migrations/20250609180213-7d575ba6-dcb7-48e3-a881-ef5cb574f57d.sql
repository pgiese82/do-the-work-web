
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Create storage policies for documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can upload documents for any user"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Add storage_path column to documents table to link with storage
ALTER TABLE public.documents 
ADD COLUMN storage_path text,
ADD COLUMN file_hash text,
ADD COLUMN is_shared boolean DEFAULT false,
ADD COLUMN shared_until timestamp with time zone,
ADD COLUMN shared_token text;

-- Update existing documents table with better structure
ALTER TABLE public.documents 
ALTER COLUMN file_path DROP NOT NULL;

-- Create index for better performance
CREATE INDEX idx_documents_user_category ON public.documents(user_id, category);
CREATE INDEX idx_documents_shared_token ON public.documents(shared_token) WHERE shared_token IS NOT NULL;

-- Create function to generate secure download URLs
CREATE OR REPLACE FUNCTION public.get_document_download_url(document_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  doc_record RECORD;
  signed_url text;
BEGIN
  -- Get document details
  SELECT storage_path, user_id 
  INTO doc_record
  FROM public.documents 
  WHERE id = document_id;
  
  -- Check if user has access (owner or admin)
  IF NOT (
    doc_record.user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Generate signed URL (valid for 1 hour)
  SELECT storage.generate_signed_url('documents', doc_record.storage_path, 3600)
  INTO signed_url;
  
  RETURN signed_url;
END;
$$;

-- Create function to generate sharing tokens
CREATE OR REPLACE FUNCTION public.create_document_share_token(
  document_id uuid,
  expires_in_hours integer DEFAULT 24
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  doc_record RECORD;
  share_token text;
BEGIN
  -- Check if user owns the document or is admin
  SELECT user_id INTO doc_record
  FROM public.documents 
  WHERE id = document_id;
  
  IF NOT (
    doc_record.user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Generate random token
  share_token := encode(gen_random_bytes(32), 'base64url');
  
  -- Update document with sharing info
  UPDATE public.documents 
  SET 
    is_shared = true,
    shared_until = now() + (expires_in_hours || ' hours')::interval,
    shared_token = share_token
  WHERE id = document_id;
  
  RETURN share_token;
END;
$$;

-- Create function to access shared documents
CREATE OR REPLACE FUNCTION public.get_shared_document(share_token text)
RETURNS table(
  id uuid,
  title text,
  category text,
  file_size bigint,
  mime_type text,
  storage_path text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.category::text,
    d.file_size,
    d.mime_type,
    d.storage_path,
    d.created_at
  FROM public.documents d
  WHERE d.shared_token = share_token
    AND d.is_shared = true
    AND d.shared_until > now();
END;
$$;
