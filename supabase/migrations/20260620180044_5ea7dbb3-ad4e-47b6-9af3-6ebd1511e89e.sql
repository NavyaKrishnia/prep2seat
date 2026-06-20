
-- Add `plan` to the INSERT column grant so a user can create their initial
-- profile with a chosen plan, while still being unable to flip payment_status.
GRANT INSERT (plan) ON public.student_profiles TO authenticated;
