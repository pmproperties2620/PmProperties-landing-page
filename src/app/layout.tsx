import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PM Properties | Premium Real Estate Services",
  description:
    "Find your dream home with PM Properties. Expert real estate agents offering luxury listings, property tours, and personalized buying & selling guidance nationwide.",
  keywords: ["real estate", "property", "homes for sale", "PM Properties", "real estate agent"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
