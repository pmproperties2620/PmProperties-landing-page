import ContactContent from "@/components/contact/ContactContent";
import { getPageBanner } from "@/lib/contentQueries";

export const metadata = {
  title: "Contact Us | PM Properties",
  description:
    "Book your private consultation or connect directly with senior property advisors across Mumbai, Thane & Navi Mumbai.",
};

export default async function ContactPage() {
  const bannerUrl = await getPageBanner("contact");

  return <ContactContent bannerUrl={bannerUrl} />;
}
