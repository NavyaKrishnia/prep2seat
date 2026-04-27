import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Purpose } from "@/components/landing/Purpose";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Plans } from "@/components/landing/Plans";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Purpose />
        <HowItWorks />
        <Plans />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
