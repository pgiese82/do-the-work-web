
-- Fix infinite recursion in users table RLS policies by dropping ALL existing policies first
DO $$ 
DECLARE
    pol_name text;
BEGIN
    -- Drop all existing policies on the users table
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol_name);
    END LOOP;
END $$;

-- Create simple, non-recursive policies
-- Policy for users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Policy for users to update their own profile  
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Policy for inserting user profiles (for registration)
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy for admins to view all users (non-recursive)
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (
  auth.uid() IN (
    SELECT u.id FROM public.users u WHERE u.role = 'admin'
  )
);

-- Policy for admins to update all users (non-recursive)
CREATE POLICY "Admins can update all users"
ON public.users
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT u.id FROM public.users u WHERE u.role = 'admin'
  )
);
