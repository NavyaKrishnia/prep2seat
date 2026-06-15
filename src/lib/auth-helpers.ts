import { supabase } from "@/integrations/supabase/client";

// MOCK OTP: any 4-digit number works, but "1234" is the default suggested.
// In production, replace with Supabase phone OTP (signInWithOtp + verifyOtp).

const PENDING_OTP_KEY = "p2s_pending_otp";

export function sendMockOtp(phone: string) {
  // Simulate sending — store pending phone in sessionStorage
  if (typeof window !== "undefined") {
    sessionStorage.setItem(PENDING_OTP_KEY, phone);
  }
  return { ok: true };
}

export function verifyMockOtp(phone: string, otp: string): boolean {
  if (!/^\d{4}$/.test(otp)) return false;
  if (typeof window !== "undefined") {
    const pending = sessionStorage.getItem(PENDING_OTP_KEY);
    if (pending !== phone) return false;
  }
  // Accept any 4-digit code in mock mode
  return true;
}

function phoneToEmail(phone: string) {
  return `phone${phone}@prep2seat.app`;
}
function phoneToPassword(phone: string) {
  return `Prep2Seat-${phone}-secure!`;
}

/** Sign up if new, otherwise sign in. Returns the session user id. */
export async function signUpOrSignInWithPhone(phone: string): Promise<string> {
  const email = phoneToEmail(phone);
  const password = phoneToPassword(phone);

  // Try sign in first
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.data.user) return signIn.data.user.id;

  // Try sign up
  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: { data: { whatsapp_number: phone } },
  });
  if (signUp.error) throw signUp.error;
  if (!signUp.data.user) throw new Error("Sign up failed");

  // Ensure session is established (auto_confirm_email is on)
  if (!signUp.data.session) {
    const retry = await supabase.auth.signInWithPassword({ email, password });
    if (retry.error || !retry.data.user) throw retry.error ?? new Error("Sign in failed");
    return retry.data.user.id;
  }
  return signUp.data.user.id;
}
