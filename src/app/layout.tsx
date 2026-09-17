import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { ConsultationModalProvider } from "@/context/ConsultationModalContext";
import ConsultationModal from "@/components/ui/ConsultationModal";
import PwaRegister from "@/components/pwa/PwaRegister";

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

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
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
  title: "PM Properties | Premium Real Estate Services",
  description:
    "Find your dream home with PM Properties. Expert real estate agents offering luxury listings, property tours, and personalized buying & selling guidance nationwide.",
  keywords: ["real estate", "property", "homes for sale", "PM Properties", "real estate agent"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PM Properties",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "PM Properties | Premium Real Estate Services",
    description:
      "Find your dream home with PM Properties. Expert real estate agents offering luxury listings nationwide.",
    type: "website",
    locale: "en_US",
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
        <PwaRegister />
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
