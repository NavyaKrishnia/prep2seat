// Server-side OTP issuance. Generates a 6-digit code, stores its hash with
// a short expiry in public.phone_otps, and dispatches it via Interakt WhatsApp.
// The plaintext code is NEVER returned to the client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(input: string) {
  const digits = String(input ?? "").replace(/\D/g, "");
  // Accept "9876543210" or "919876543210"; store canonical "+91XXXXXXXXXX"
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

async function sendInteraktOtp(phoneDigits: string, code: string) {
  const apiKey = Deno.env.get("INTERAKT_API_KEY");
  if (!apiKey) return { ok: false, reason: "missing_api_key" };
  const payload = {
    countryCode: "+91",
    phoneNumber: phoneDigits,
    type: "Template",
    callbackData: "prep2seat_otp",
    template: {
      name: "otp_code",
      languageCode: "en",
      bodyValues: [code],
    },
  };
  try {
    const res = await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("interakt error", err);
    return { ok: false, reason: "network_error" };
  }
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
    const { phone } = await req.json();
    const canonical = normalizePhone(phone);
    if (!canonical) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Throttle: reject if a non-consumed OTP issued less than 15s ago exists
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("phone_otps")
      .select("id, created_at")
      .eq("phone", canonical)
      .gte("created_at", fifteenSecondsAgo)
      .limit(1)
      .maybeSingle();

    if (recent) {
      return new Response(
        JSON.stringify({ error: "Please wait before requesting another code." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Generate a 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await sha256(`${canonical}:${code}`);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabaseAdmin.from("phone_otps").insert({
      phone: canonical,
      code_hash: codeHash,
      expires_at: expiresAt,
    });
    if (insertErr) throw insertErr;

    // Dispatch via Interakt (best-effort). Never reveal code on failure.
    const phoneDigits = canonical.replace(/^\+91/, "");
    const sendResult = await sendInteraktOtp(phoneDigits, code);
    if (!sendResult.ok) {
      console.warn("OTP dispatch failed", sendResult);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-otp failed", err);
    return new Response(
      JSON.stringify({ success: false, error: "Could not send OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
