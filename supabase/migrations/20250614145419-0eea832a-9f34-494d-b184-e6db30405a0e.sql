
-- Allow the 'id' column in the users table to generate a default UUID
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
