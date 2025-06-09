
-- Enable realtime for bookings table
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Enable realtime for payments table  
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- Enable realtime for documents table
ALTER TABLE public.documents REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;

-- Enable realtime for availability_rules table
ALTER TABLE public.availability_rules REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability_rules;

-- Enable realtime for services table
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;

-- Enable realtime for users table
ALTER TABLE public.users REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
