
-- Create document_templates table for reusable document templates
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_path TEXT NOT NULL,
  auto_deliver_on TEXT DEFAULT NULL, -- 'manual', 'booking_confirmation', 'booking_completion'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_assignments table for tracking which documents are assigned to which users
CREATE TABLE public.document_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.document_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'delivered', 'completed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_delivery_log table for tracking document deliveries
CREATE TABLE public.document_delivery_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.document_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  delivery_method TEXT NOT NULL, -- 'manual', 'automatic', 'email', 'download'
  delivered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_by UUID REFERENCES public.users(id),
  status TEXT NOT NULL DEFAULT 'delivered', -- 'delivered', 'failed', 'pending'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_document_templates_category ON public.document_templates(category);
CREATE INDEX idx_document_templates_active ON public.document_templates(is_active);
CREATE INDEX idx_document_assignments_user ON public.document_assignments(user_id);
CREATE INDEX idx_document_assignments_template ON public.document_assignments(template_id);
CREATE INDEX idx_document_assignments_status ON public.document_assignments(status);
CREATE INDEX idx_document_delivery_log_user ON public.document_delivery_log(user_id);
CREATE INDEX idx_document_delivery_log_document ON public.document_delivery_log(document_id);
CREATE INDEX idx_document_delivery_log_delivered_at ON public.document_delivery_log(delivered_at);

-- Enable RLS on new tables
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_templates (admins only)
CREATE POLICY "Admins can manage document templates" 
  ON public.document_templates 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- RLS policies for document_assignments
CREATE POLICY "Users can view their own assignments" 
  ON public.document_assignments 
  FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage all assignments" 
  ON public.document_assignments 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- RLS policies for document_delivery_log
CREATE POLICY "Users can view their own delivery log" 
  ON public.document_delivery_log 
  FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage delivery log" 
  ON public.document_delivery_log 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Add updated_at trigger for document_templates
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for document_assignments  
CREATE TRIGGER update_document_assignments_updated_at
  BEFORE UPDATE ON public.document_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
