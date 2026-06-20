// Server-issued OTP flow. The plaintext code is never stored in the client
// bundle or browser; both endpoints run as Supabase Edge Functions with
// SECURITY DEFINER style access via the service role key.

import { supabase } from "@/integrations/supabase/client";

export async function sendOtp(phone: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("send-otp", {
    body: { phone },
  });
  if (error) throw new Error(error.message || "Could not send code");
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(String((data as { error: string }).error));
  }
}

/**
 * Verifies the OTP server-side. On success, exchanges the returned magic-link
 * token for a real Supabase session — so the user is now genuinely
 * authenticated, not just flagged via client state.
 */
export async function verifyOtpAndSignIn(
  phone: string,
  code: string,
): Promise<void> {
  const { data, error } = await supabase.functions.invoke("verify-otp", {
    body: { phone, code },
  });
  if (error) throw new Error(error.message || "Verification failed");
  if (!data || (data as { success?: boolean }).success !== true) {
    const msg =
      (data as { error?: string } | null)?.error || "Verification failed";
    throw new Error(msg);
  }
  const { email, token_hash } = data as {
    email: string;
    token_hash: string;
  };
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    type: "email",
    email,
    token_hash,
  });
  if (verifyErr) throw verifyErr;
}
