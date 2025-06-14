
-- Create policy for admins to delete prospects
CREATE POLICY "Admins can delete prospects" 
  ON public.prospects 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
