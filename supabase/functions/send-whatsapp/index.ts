// Send a WhatsApp message via Interakt's public API.
// Frontend posts { whatsapp_number, rank, category }. We compose the message
// body server-side using the dummy sample list and call Interakt.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE_URL = "https://prep2seat.com";

function buildMessage(rank: number | string, category: string) {
  return [
    "Hi! Here's your sample NEET preference list from Prep2Seat 🎓",
    "",
    `Rank: ${rank} | Category: ${category}`,
    "",
    "Top 5 AIQ College Preferences:",
    "1. Maulana Azad Medical College, Delhi — Estd. 1958 — Bond ₹10L",
    "2. Lady Hardinge Medical College, Delhi — Estd. 1916 — Bond ₹10L",
    "3. Grant Medical College, Maharashtra — Estd. 1845 — Bond ₹20L",
    "4. Bangalore Medical College, Karnataka — Estd. 1955 — Bond ₹25L",
    "5. Madras Medical College, Tamil Nadu — Estd. 1835 — Bond ₹10L",
    "",
    "This is just a sample. Your complete personalised list has 50+ colleges built specifically for your rank and category by our expert counsellors.",
    "",
    `👉 Get your complete list: ${SITE_URL}`,
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require an authenticated Supabase caller. The platform also enforces
    // verify_jwt = true in supabase/config.toml; this is defence in depth.
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.0");
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userRes, error: userErr } = await authClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { whatsapp_number, rank, category } = await req.json();

    if (!whatsapp_number) {
      return new Response(
        JSON.stringify({ error: "whatsapp_number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("INTERAKT_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Messaging not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Normalize to country code 91 + 10-digit number (no plus).
    const digits = String(whatsapp_number).replace(/\D/g, "");
    const phoneNumber = digits.startsWith("91") ? digits.slice(2) : digits;

    const bodyText = buildMessage(rank ?? "—", category ?? "—");

    const payload = {
      countryCode: "+91",
      phoneNumber,
      type: "Template",
      callbackData: "prep2seat_sample_list",
      template: {
        name: "sample_preference_list",
        languageCode: "en",
        bodyValues: [String(rank ?? "—"), String(category ?? "—"), bodyText],
      },
    };

    const res = await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Interakt error", res.status, data);
      return new Response(
        JSON.stringify({ success: false, status: res.status, data }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-whatsapp failed", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
