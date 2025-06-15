
-- Verwijder eerst alle bestaande beleidsregels op de 'bookings' tabel om conflicten te voorkomen.
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;

-- Schakel Row Level Security in (veilig om opnieuw uit te voeren).
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Beleid voor beheerders: volledige toegang tot alle boekingen.
-- Dit maakt gebruik van een veilige functie om de rol van de gebruiker te controleren.
CREATE POLICY "Admins can manage all bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'admin'
)
WITH CHECK (
  public.get_current_user_role() = 'admin'
);

-- Beleid voor klanten: kunnen hun eigen boekingen bekijken.
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Beleid voor klanten: kunnen hun eigen boekingen aanmaken.
CREATE POLICY "Users can create their own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- Beleid voor klanten: kunnen hun eigen boekingen bijwerken.
CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- Beleid voor klanten: kunnen hun eigen boekingen verwijderen.
CREATE POLICY "Users can delete their own bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
);
