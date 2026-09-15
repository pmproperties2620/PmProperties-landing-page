import Hero from "@/components/home/Hero";
import TrustMarquee from "@/components/home/TrustMarquee";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import AboutSection from "@/components/home/AboutSection";
import HowWeWorkSection from "@/components/home/HowWeWorkSection";
import CredentialsSection from "@/components/home/CredentialsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <AboutSection />
      <CredentialsSection />
      <Services />
      <HowWeWorkSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
