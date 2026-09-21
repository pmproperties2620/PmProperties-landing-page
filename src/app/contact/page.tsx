import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPageBanner } from "@/lib/contentQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact PM Properties | Real Estate Office Dombivli",
  description:
    "Connect with PM Properties in Dombivli West. Book a free consultation for residential & commercial property investments across Dombivli, Kalyan & Thane.",
  alternates: {
    canonical: "https://www.thepmproperties.in/contact",
  },
  openGraph: {
    title: "Contact PM Properties | Real Estate Office Dombivli",
    description:
      "Schedule a consultation or reach our senior property advisors directly at our Dombivli West office.",
    url: "https://www.thepmproperties.in/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PM Properties | Real Estate Office Dombivli",
    description:
      "Schedule a consultation or reach our senior property advisors directly at our Dombivli West office.",
  },
};

export default async function ContactPage() {
  const bannerUrl = await getPageBanner("contact");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "Contact Us", url: "https://www.thepmproperties.in/contact" },
        ]}
      />
      <ContactContent bannerUrl={bannerUrl} />
    </>
  );
}
