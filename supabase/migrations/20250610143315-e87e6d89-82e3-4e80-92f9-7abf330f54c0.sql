
-- Fix the get_document_download_url function to use correct Supabase storage functions
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
  
  -- Return the storage path so we can generate signed URL on client side
  RETURN doc_record.storage_path;
END;
$$;
