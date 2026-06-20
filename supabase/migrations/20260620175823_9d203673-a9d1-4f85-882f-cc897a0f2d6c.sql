
-- 1) phone_otps table for server-side OTP verification
CREATE TABLE public.phone_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX phone_otps_phone_idx ON public.phone_otps (phone, created_at DESC);
GRANT ALL ON public.phone_otps TO service_role;
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: only service_role (which bypasses RLS) can access.

-- 2) student_profiles: prevent users from modifying payment/plan fields
REVOKE UPDATE ON public.student_profiles FROM authenticated;
GRANT UPDATE (full_name, neet_score, air_rank, state, category, pwd, whatsapp_number, email, roll_number)
  ON public.student_profiles TO authenticated;
-- Admin policy still permits full updates via service_role; admin column updates via has_role
-- The existing "Users can update their own profile" UPDATE policy stays; column-level GRANT now
-- restricts which columns a regular authenticated user can change.

-- Also restrict columns at INSERT so users cannot self-mark as paid on initial insert
REVOKE INSERT ON public.student_profiles FROM authenticated;
GRANT INSERT (user_id, full_name, neet_score, air_rank, state, category, pwd, whatsapp_number, email, roll_number)
  ON public.student_profiles TO authenticated;

-- 3) user_roles: explicitly deny INSERT/UPDATE/DELETE for non-service roles
CREATE POLICY "No self role assignment" ON public.user_roles
  FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "No role modification" ON public.user_roles
  FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);
CREATE POLICY "No role deletion" ON public.user_roles
  FOR DELETE TO authenticated, anon USING (false);

-- 4) leads: replace permissive WITH CHECK (true) with validation
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert valid leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (
    whatsapp_number ~ '^\+?\d{10,15}$'
    AND (air_rank IS NULL OR (air_rank >= 1 AND air_rank <= 2000000))
    AND (state IS NULL OR length(state) BETWEEN 1 AND 80)
    AND (category IS NULL OR length(category) BETWEEN 1 AND 40)
    AND source IS NOT NULL AND length(source) BETWEEN 1 AND 64
  );
