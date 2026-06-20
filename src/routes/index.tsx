import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prep2Seat — NEET College Counselling | Expert Preference List | From Rank to Seat" },
      { name: "description", content: "India's #1 NEET college counselling platform. Get a personalised MBBS college preference list built by expert counsellors within 24 hours. AIQ & state quota guidance for NEET." },
      { name: "keywords", content: "NEET college counselling, NEET 2025 counselling, MBBS college preference list, AIQ counselling, NEET seat allotment, MCC counselling, NEET choice filling, NEET UG counselling India, NEET rank college predictor, government medical college NEET, Prep2Seat, NEET UG counseling, NEET counseling, NEET rank to seat, NEET UG mentorship, medical college counseling, NEET college admission, NEET guidance, NEET 2024 counseling, NEET seat allotment, Prep2Seat, neet counselling preference list helper, neet counselling preference list helper choice filling, NEET NTA counselling, NTA NEET 2024 seat allotment, NEET choice filling guide, NEET college preference list, NEET UG round 1 counselling, NEET round 2 counselling, NEET mop up round, NEET stray vacancy round, NEET counselling 2024, NEET counselling registration, NEET counselling document verification, NEET counselling fees, NEET all India quota counselling, NEET state quota counselling, NEET 15 percent quota, NEET 85 percent quota, best NEET counselling mentor, NEET mentorship program India, NEET college predictor, NEET cutoff 2024, NEET MBBS admission, NEET BDS admission, NEET AYUSH counselling, MCC NEET counselling, state medical counselling, NEET rank predictor, how to fill NEET preference list, NEET seat matrix,NEET counseling, NEET UG counseling, NEET rank to seat, NEET mentorship, medical college admission, NEET 2024, NEET seat allotment, NEET counselling preference list helper, NEET counselling preference list helper choice filling, NEET NTA counselling, NTA NEET 2024 seat allotment, NEET choice filling guide, NEET college preference list, NEET UG round 1 counselling, NEET mentorship program India, MCC NEET counselling, NEET AIQ counselling, state quota counselling, NEET stray vacancy round, NEET mop up round, NEET cutoff 2024, NEET college predictor, NEET rank predictor, NEET MBBS admission, NEET BDS admission, NEET deemed university counselling, NEET PG counselling, NEET 2025, NTA NEET registration, NEET exam date 2025, NEET result 2025, NEET eligibility criteria, NEET preparation tips, NEET mock test, best NEET coaching, NEET online coaching, NEET dropper guidance, NEET document verification, NEET allotment letter, neet, nta, college, medical college, total medical seats, college preference list, last 2 year medical college closing rank, last gear obc cutoff, last year sc cutoff, best college in rajasthan, best medical college in rajasthan, best medical college at my rank, best medical college in haryana, best medical college in maharasthra, best medical college in uttarpradesh, best medical college in madhya pradesh, rajasthan medical college preference list, uttar pradesh medical college preference list" },
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
