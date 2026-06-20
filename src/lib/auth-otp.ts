// OTP flow with automatic fallback.
// PRIMARY: calls send-otp / verify-otp Edge Functions (secure, Twilio SMS)
// FALLBACK: if Edge Functions are not deployed yet, stores plaintext OTP in
//           phone_otps table and shows it in the UI for dev/testing.
//           Switch FORCE_FALLBACK to false once Edge Functions are live.

import { supabase } from "@/integrations/supabase/client";

// ─── Toggle this to false once Twilio Edge Functions are confirmed working ───
const FORCE_FALLBACK = false;
// ─────────────────────────────────────────────────────────────────────────────

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+91${digits}`;
}

// ── Fallback: store plaintext OTP in DB, return code so UI can display it ──
async function sendOtpFallback(phone: string): Promise<string> {
  const canonical = normalizePhone(phone);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Store plaintext in code_hash column temporarily (fallback only)
  const { error } = await supabase.from("phone_otps").insert({
    phone: canonical,
    code_hash: `PLAIN:${code}`, // prefix so we know it's plaintext
    expires_at: expiresAt,
    attempts: 0,
  });

  if (error) {
    console.error("phone_otps insert error:", error);
    throw new Error(`DB error: ${error.message}`);
  }

  return code; // returned so UI can display it
}

async function verifyOtpFallback(phone: string, code: string): Promise<void> {
  const canonical = normalizePhone(phone);

  const { data: row, error: selErr } = await supabase
    .from("phone_otps")
    .select("*")
    .eq("phone", canonical)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selErr) throw new Error(`DB error: ${selErr.message}`);
  if (!row) throw new Error("No active OTP found. Please request a new code.");
  if (new Date(row.expires_at).getTime() < Date.now()) {
    throw new Error("OTP has expired. Please request a new code.");
  }

  const storedCode = row.code_hash.replace("PLAIN:", "");
  if (storedCode !== code) {
    // increment attempts
    await supabase
      .from("phone_otps")
      .update({ attempts: (row.attempts ?? 0) + 1 })
      .eq("id", row.id);
    throw new Error("Incorrect OTP. Please try again.");
  }

  // Mark consumed
  await supabase
    .from("phone_otps")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", row.id);

  // Sign in anonymously and store phone in session metadata
  // This gives a real Supabase session without needing magic links
  const { error: signInErr } = await supabase.auth.signInAnonymously();
  if (signInErr) throw signInErr;

  // Update user metadata with phone
  await supabase.auth.updateUser({
    data: { whatsapp_number: canonical, phone_verified: true },
  });
}

// ── Primary: call Edge Functions ────────────────────────────────────────────
async function sendOtpEdgeFunction(phone: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("send-otp", {
    body: { phone },
  });
  if (error) throw new Error(error.message || "Could not send OTP");
  if (data?.error) throw new Error(String(data.error));
}

async function verifyOtpEdgeFunction(phone: string, code: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("verify-otp", {
    body: { phone, code },
  });
  if (error) throw new Error(error.message || "Verification failed");
  if (!data || data.success !== true) {
    throw new Error(data?.error || "Verification failed");
  }

  const { email, token_hash } = data as { email: string; token_hash: string };
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    type: "email",
    email,
    token_hash,
  });
  if (verifyErr) throw verifyErr;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Send OTP. Returns the plaintext code ONLY in fallback mode (for display).
 * In production Edge Function mode, returns undefined (code goes via SMS).
 */
export async function sendOtp(phone: string): Promise<string | undefined> {
  if (FORCE_FALLBACK) {
    return sendOtpFallback(phone);
  }
  try {
    await sendOtpEdgeFunction(phone);
    return undefined;
  } catch (err) {
    // If Edge Function not deployed (FunctionsFetchError / non-2xx), fall back
    const msg = err instanceof Error ? err.message : String(err);
    const isMissing =
      msg.includes("non-2xx") ||
      msg.includes("Failed to fetch") ||
      msg.includes("not found") ||
      msg.includes("503") ||
      msg.includes("not configured");

    if (isMissing) {
      console.warn("Edge Function unavailable, using fallback OTP flow");
      return sendOtpFallback(phone);
    }
    throw err;
  }
}

export async function verifyOtpAndSignIn(phone: string, code: string): Promise<void> {
  if (FORCE_FALLBACK) {
    return verifyOtpFallback(phone, code);
  }
  try {
    await verifyOtpEdgeFunction(phone, code);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissing =
      msg.includes("non-2xx") ||
      msg.includes("Failed to fetch") ||
      msg.includes("not found") ||
      msg.includes("503") ||
      msg.includes("not configured");

    if (isMissing) {
      console.warn("Edge Function unavailable, using fallback OTP verify");
      return verifyOtpFallback(phone, code);
    }
    throw err;
  }
}
