import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prep2Seat — NEET College Counselling | Expert Preference List | From Rank to Seat" },
      { name: "description", content: "India's #1 NEET college counselling platform. Get a personalised MBBS college preference list built by expert counsellors within 24 hours. AIQ & state quota guidance for NEET 2025." },
      { name: "keywords", content: "NEET college counselling, NEET 2025 counselling, MBBS college preference list, AIQ counselling, NEET seat allotment, MCC counselling, NEET choice filling, NEET UG counselling India, NEET rank college predictor, government medical college NEET, Prep2Seat" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prep2seat.com" },
      { property: "og:title", content: "Prep2Seat — Expert NEET College Counselling | From Rank to Seat" },
      { property: "og:description", content: "Personalised MBBS college preference list by expert counsellors, delivered in 24 hours. AIQ & state quota. NEET 2025." },
      { property: "og:image", content: "https://prep2seat.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Prep2Seat — Expert NEET College Counselling" },
      { name: "twitter:description", content: "Personalised MBBS preference list by expert counsellors. 24-hour delivery. NEET 2025 AIQ & state quota." },
      { name: "theme-color", content: "#1B2B5E" },
    ],
  }),
  component: LandingPage,
});
