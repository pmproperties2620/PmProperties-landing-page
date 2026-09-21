import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import AboutSection from "@/components/home/AboutSection";
import HowWeWorkSection from "@/components/home/HowWeWorkSection";
import CredentialsSection from "@/components/home/CredentialsSection";
import { RealEstateAgentJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";
import {
  getTestimonials,
  getTrustedPartners,
  getAboutShowcase,
  getPageBanner,
  getHeroShowcase,
} from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PM Properties | Real Estate Consultant in Dombivli & Kalyan",
  description:
    "RERA-certified real estate consultancy in Dombivli & Kalyan by Pritesh Mhamunkar. Luxury homes, commercial spaces & 0% brokerage on new builder projects.",
  alternates: {
    canonical: "https://www.thepmproperties.in",
  },
  openGraph: {
    title: "PM Properties | Real Estate Consultant in Dombivli & Kalyan",
    description:
      "RERA-certified real estate consultancy in Dombivli & Kalyan by Pritesh Mhamunkar. Luxury homes, commercial spaces & 0% brokerage on new builder projects.",
    url: "https://www.thepmproperties.in",
    siteName: "The PM Properties",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Properties | Real Estate Consultant in Dombivli & Kalyan",
    description:
      "RERA-certified real estate consultancy in Dombivli & Kalyan by Pritesh Mhamunkar. Luxury homes, commercial spaces & 0% brokerage on new builder projects.",
  },
};

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
      <RealEstateAgentJsonLd />
      <FAQPageJsonLd />
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
