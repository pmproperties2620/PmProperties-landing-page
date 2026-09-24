import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { ConsultationModalProvider } from "@/context/ConsultationModalContext";
import ConsultationModal from "@/components/ui/ConsultationModal";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SmoothScroll from "@/components/ui/SmoothScroll";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/Inter-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#491612",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.thepmproperties.in"
  ),
  title: "The PM Properties | Premium Real Estate Advisory & Services",
  description:
    "RERA-certified real estate consultancy in Dombivli & Kalyan by Pritesh Mhamunkar. Luxury residential & commercial properties, 0% brokerage on new projects, and expert property guidance.",
  keywords: [
    "real estate",
    "property",
    "homes for sale",
    "PM Properties",
    "The PM Properties",
    "real estate agent",
    "Dombivli",
    "Kalyan",
    "RERA registered",
    "0% brokerage",
  ],
  openGraph: {
    title: "The PM Properties | Premium Real Estate Advisory & Services",
    description:
      "RERA-certified real estate consultancy in Dombivli & Kalyan. Luxury residential & commercial properties, 0% brokerage on new projects, and personalized buying guidance.",
    url: "https://www.thepmproperties.in",
    siteName: "The PM Properties",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image-square.jpg",
        width: 600,
        height: 600,
        alt: "The PM Properties - Your Search Ends Here",
        type: "image/jpeg",
      },
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The PM Properties - Premium Real Estate Advisory",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The PM Properties | Premium Real Estate Advisory & Services",
    description:
      "RERA-certified real estate consultancy in Dombivli & Kalyan. Luxury residential & commercial properties, 0% brokerage on new projects.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <GoogleAnalytics />
        <ConsultationModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppWidget />
          <ConsultationModal />
        </ConsultationModalProvider>
      </body>
    </html>
  );
}

