
-- Enable Realtime for the prospects table to see new entries automatically
ALTER TABLE public.prospects REPLICA IDENTITY FULL;

-- This adds the table to Supabase's realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.prospects;
