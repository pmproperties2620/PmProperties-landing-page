import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
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
      <LogoMarquee />
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
