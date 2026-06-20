// Server-side OTP issuance. Generates a 6-digit code, stores its SHA-256 hash
// with expiry + attempt limits in phone_otps table, then sends via Twilio SMS.
// The plaintext code is NEVER returned to the client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

async function sendTwilioSms(to: string, body: string): Promise<{ ok: boolean; reason?: string }> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!accountSid || !authToken || !fromNumber) {
    return { ok: false, reason: "missing_twilio_config" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      },
      body: new URLSearchParams({ To: to, From: fromNumber, Body: body }).toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Twilio SMS error", res.status, err);
      return { ok: false, reason: `twilio_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("Twilio network error", err);
    return { ok: false, reason: "network_error" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check Twilio config upfront
    if (
      !Deno.env.get("TWILIO_ACCOUNT_SID") ||
      !Deno.env.get("TWILIO_AUTH_TOKEN") ||
      !Deno.env.get("TWILIO_PHONE_NUMBER")
    ) {
      return new Response(
        JSON.stringify({ error: "SMS service not configured. Please contact support." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { phone } = await req.json();
    const canonical = normalizePhone(phone);
    if (!canonical) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number. Please enter a 10-digit Indian mobile number." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Throttle: reject if a non-consumed OTP was issued less than 15 seconds ago
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("phone_otps")
      .select("id, created_at")
      .eq("phone", canonical)
      .is("consumed_at", null)
      .gte("created_at", fifteenSecondsAgo)
      .limit(1)
      .maybeSingle();

    if (recent) {
      return new Response(
        JSON.stringify({ error: "Please wait before requesting another code." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit code and store hash
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await sha256(`${canonical}:${code}`);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

    const { error: insertErr } = await supabaseAdmin.from("phone_otps").insert({
      phone: canonical,
      code_hash: codeHash,
      expires_at: expiresAt,
    });
    if (insertErr) throw insertErr;

    // Send OTP via Twilio SMS
    const smsBody = `Your Prep2Seat OTP is: ${code}. Valid for 10 minutes. Do not share this with anyone.`;
    const sendResult = await sendTwilioSms(canonical, smsBody);

    if (!sendResult.ok) {
      // Clean up the OTP row if SMS failed so user can try again
      await supabaseAdmin.from("phone_otps").delete().eq("code_hash", codeHash);
      console.error("SMS dispatch failed", sendResult);
      return new Response(
        JSON.stringify({ error: "Failed to send OTP. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-otp failed", err);
    return new Response(
      JSON.stringify({ success: false, error: "Could not send OTP. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
