import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import AboutSection from "@/components/home/AboutSection";
import HowWeWorkSection from "@/components/home/HowWeWorkSection";
import CredentialsSection from "@/components/home/CredentialsSection";
import {
  getTestimonials,
  getTrustedPartners,
  getAboutShowcase,
  getPageBanner,
  getHeroShowcase,
} from "@/lib/contentQueries";

export default async function Home() {
  const [
    testimonials,
    trustedPartners,
    aboutShowcase,
    heroBannerUrl,
    heroShowcaseUrl,
  ] = await Promise.all([
    getTestimonials(),
    getTrustedPartners(),
    getAboutShowcase(),
    getPageBanner("home_hero"),
    getHeroShowcase(),
  ]);

  return (
    <>
      <Hero heroBannerUrl={heroBannerUrl} heroShowcaseUrl={heroShowcaseUrl} />
      <LogoMarquee initialLogos={trustedPartners} />
      <AboutSection initialImages={aboutShowcase} />
      <CredentialsSection />
      <Services />
      <HowWeWorkSection />
      <Testimonials initialTestimonials={testimonials} />
      <FAQSection />
      <CTASection />
    </>
  );
}
