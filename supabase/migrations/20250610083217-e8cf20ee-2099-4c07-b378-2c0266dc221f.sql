
-- Fix infinite recursion by creating a security definer function
-- First, create a function that can safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Drop all existing policies again to ensure clean state
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

-- Create simple, non-recursive policies using the security definer function
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

-- Policy for admins to view all users (using security definer function)
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Policy for admins to update all users (using security definer function)
CREATE POLICY "Admins can update all users"
ON public.users
FOR UPDATE
USING (public.get_current_user_role() = 'admin');
