// Server-side OTP verification. Validates submitted code against stored hash,
// marks it consumed, then issues a Supabase magic-link token the client
// exchanges for a real session. No external API needed here.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_ATTEMPTS = 5;

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(input: string) {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

function phoneEmail(canonical: string) {
  // Stable internal email for auth — never exposed to user, never used for login
  return `phone${canonical.replace(/\D/g, "")}@prep2seat.app`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // NOTE: No Interakt/Twilio check here — verify never sends messages
    const { phone, code } = await req.json();

    const canonical = normalizePhone(phone);
    if (!canonical || !/^\d{6}$/.test(String(code ?? ""))) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number or code format." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the most recent unconsumed OTP for this phone
    const { data: row, error: selErr } = await supabaseAdmin
      .from("phone_otps")
      .select("*")
      .eq("phone", canonical)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selErr) throw selErr;

    if (!row) {
      return new Response(
        JSON.stringify({ error: "No active code found. Please request a new OTP." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      return new Response(
        JSON.stringify({ error: "Code has expired. Please request a new OTP." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (row.attempts >= MAX_ATTEMPTS) {
      return new Response(
        JSON.stringify({ error: "Too many incorrect attempts. Please request a new OTP." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify hash
    const submittedHash = await sha256(`${canonical}:${code}`);
    if (submittedHash !== row.code_hash) {
      await supabaseAdmin
        .from("phone_otps")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);

      const remaining = MAX_ATTEMPTS - (row.attempts + 1);
      return new Response(
        JSON.stringify({
          error: remaining > 0
            ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
            : "Too many incorrect attempts. Please request a new OTP.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark OTP as consumed
    await supabaseAdmin
      .from("phone_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    // Provision or find auth user for this phone
    const email = phoneEmail(canonical);
    let userId: string | null = null;

    // Check if user already exists
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users?.find((u) => u.email === email);
    userId = existing?.id ?? null;

    if (!userId) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { whatsapp_number: canonical },
      });
      if (createErr) throw createErr;
      userId = created.user?.id ?? null;
    }

    if (!userId) throw new Error("Could not provision auth user");

    // Issue magic-link token for client to exchange into a session
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr) throw linkErr;

    // @ts-ignore - hashed_token exists at runtime
    const tokenHash = linkData?.properties?.hashed_token ?? linkData?.properties?.token_hash;
    if (!tokenHash) throw new Error("Could not generate auth token");

    return new Response(
      JSON.stringify({ success: true, email, token_hash: tokenHash }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("verify-otp failed", err);
    return new Response(
      JSON.stringify({ success: false, error: "Verification failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
