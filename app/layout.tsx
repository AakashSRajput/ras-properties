import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A1E3F",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://rasproperties.in"),
  title: {
    default: "RAS Properties | Your Trusted Partner in Real Estate | Buy, Rent & Commercial Properties in Noida & Delhi NCR",
    template: "%s | RAS Properties",
  },
  description:
    "Explore 100% verified luxury apartments, society flats, independent villas, builder floors, and commercial offices across Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR with RAS Properties.",
  keywords: [
    "real estate noida",
    "flats in noida expressway",
    "apartments sector 150 noida",
    "properties in greater noida west",
    "luxury homes gurgaon",
    "builder floor indirapuram ghaziabad",
    "commercial office noida sector 62",
    "RAS Properties",
    "UP RERA approved properties",
  ],
  authors: [{ name: "RAS Properties" }],
  creator: "RAS Properties",
  publisher: "RAS Properties",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rasproperties.in",
    siteName: "RAS Properties",
    title: "RAS Properties - Your Trusted Partner in Real Estate",
    description: "Discover verified homes, apartments, villas, and commercial spaces across India.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "RAS Properties Luxury Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAS Properties | Real Estate Excellence in India",
    description: "Find verified residential and commercial properties in Noida, Gurgaon, Delhi NCR.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileContactBar />
        </ToastProvider>
      </body>
    </html>
  );
}
