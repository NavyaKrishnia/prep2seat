// Server-side OTP verification. Validates the user-submitted code against the
// stored hash, marks it consumed, then issues a Supabase magic-link token the
// client exchanges for a real session via supabase.auth.verifyOtp().

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  // Stable, non-routable internal email derived from canonical phone.
  // Auth is via OTP only; no password ever issued to the client.
  return `phone${canonical.replace(/\D/g, "")}@prep2seat.app`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!Deno.env.get("INTERAKT_API_KEY")) {
      return new Response(
        JSON.stringify({
          error: "WhatsApp OTP service not configured. Please contact support.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { phone, code } = await req.json();
    const canonical = normalizePhone(phone);
    if (!canonical || !/^\d{6}$/.test(String(code ?? ""))) {
      return new Response(
        JSON.stringify({ error: "Invalid phone or code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

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
        JSON.stringify({ error: "No active code. Request a new OTP." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      return new Response(
        JSON.stringify({ error: "Code expired. Request a new OTP." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (row.attempts >= MAX_ATTEMPTS) {
      return new Response(
        JSON.stringify({ error: "Too many attempts. Request a new OTP." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const submittedHash = await sha256(`${canonical}:${code}`);
    if (submittedHash !== row.code_hash) {
      await supabaseAdmin
        .from("phone_otps")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      return new Response(
        JSON.stringify({ error: "Incorrect code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Mark consumed
    await supabaseAdmin
      .from("phone_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    // Ensure an auth user exists for this phone (internal email mapping).
    const email = phoneEmail(canonical);

    // Try to find existing user via listUsers filter
    let userId: string | null = null;
    {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === email);
      userId = existing?.id ?? null;
    }

    if (!userId) {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { whatsapp_number: canonical },
        });
      if (createErr) throw createErr;
      userId = created.user?.id ?? null;
    }
    if (!userId) throw new Error("Could not provision auth user");

    // Issue a magic-link token the client can exchange for a session.
    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
    if (linkErr) throw linkErr;

    const tokenHash =
      // @ts-ignore - properties exists at runtime
      linkData?.properties?.hashed_token ?? linkData?.properties?.token_hash;

    if (!tokenHash) throw new Error("Could not generate auth token");

    return new Response(
      JSON.stringify({
        success: true,
        email,
        token_hash: tokenHash,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("verify-otp failed", err);
    return new Response(
      JSON.stringify({ success: false, error: "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
