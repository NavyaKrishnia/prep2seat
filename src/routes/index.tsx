import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prep2Seat — From Rank to Seat | NEET College Counselling" },
      {
        name: "description",
        content:
          "India's smartest NEET counselling platform. Get a personalised college preference list built by experts. From Rank to Seat.",
      },
      { property: "og:title", content: "Prep2Seat — From Rank to Seat" },
      {
        property: "og:description",
        content:
          "Expert-built NEET college preference lists. Data-backed, personalised, and delivered in 24 hours.",
      },
    ],
  }),
  component: LandingPage,
});
