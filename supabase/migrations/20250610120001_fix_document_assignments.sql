
-- Fix document_assignments table - add missing columns that the UI expects
ALTER TABLE public.document_assignments 
ADD COLUMN IF NOT EXISTS assigned_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP WITH TIME ZONE;

-- Update the existing assigned_at to assigned_date for consistency
UPDATE public.document_assignments SET assigned_date = assigned_at WHERE assigned_date IS NULL;
