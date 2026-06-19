import { Contact } from "@/components/landing/Contact";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

/**
 * Persistent bottom sections used on every full page (results, dashboard).
 * Order: Contact (Have Questions) → Testimonials → Footer.
 * Landing page already renders these inline — do not double-mount there.
 */
export function PageFooterSections() {
  return (
    <>
      <Contact />
      <Testimonials />
      <Footer />
    </>
  );
}
