
-- Create a table for storing contact form submissions (prospects/leads)
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  goal TEXT NOT NULL,
  experience TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'contact_form',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_to_client_id UUID REFERENCES public.users(id),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security (RLS)
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all prospects
CREATE POLICY "Admins can view all prospects" 
  ON public.prospects 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for admins to insert prospects
CREATE POLICY "Admins can insert prospects" 
  ON public.prospects 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for admins to update prospects
CREATE POLICY "Admins can update prospects" 
  ON public.prospects 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for public insert (for contact form submissions)
CREATE POLICY "Public can insert prospects via contact form" 
  ON public.prospects 
  FOR INSERT 
  WITH CHECK (source = 'contact_form');

-- Add index for email lookups
CREATE INDEX idx_prospects_email ON public.prospects(email);

-- Add index for status filtering
CREATE INDEX idx_prospects_status ON public.prospects(status);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
