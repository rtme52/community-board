
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL('https://guemes.services'), // Required for OG images to work properly
  title: "Guemes Services",
  description: "A space for islanders to find help or offer their services.",
  openGraph: {
    title: "Guemes Services",
    description: "Connect with your neighbors. Find help, offer services, and support the local community.",
    url: 'https://guemes.services',
    siteName: 'Guemes Services',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guemes Services',
    description: 'Connect with your neighbors. Find help, offer services, and support the local community.',
    creator: '@guemesservices', // Optional, if you have a handle
  },
};

import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen font-sans flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer user={user} />
      </body>
    </html>
  );
}
