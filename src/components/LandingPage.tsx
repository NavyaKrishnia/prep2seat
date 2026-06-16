import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Purpose } from "@/components/landing/Purpose";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Plans } from "@/components/landing/Plans";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
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
