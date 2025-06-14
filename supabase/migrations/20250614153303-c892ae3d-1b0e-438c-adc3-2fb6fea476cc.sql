
-- Policy for admins to insert new users
CREATE POLICY "Admins can insert new users"
ON public.users
FOR INSERT
WITH CHECK (public.get_current_user_role() = 'admin');
