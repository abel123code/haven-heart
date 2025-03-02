import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { HeroUIProvider } from "@heroui/react";
import { Navbar } from "@/components/navbar/TopNav";
import { Poppins } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Choose weights you want
  variable: '--font-poppins',   // CSS variable for reuse
});

export const metadata = {
  title: 'Havenheart SG | The spot for hearts to grow',
  description:
    'Havenheart SG is a non-profit dedicated to streamlining the mental health journey for youths in Singapore—fostering a resilient generation that thrives emotionally.',
  keywords: [
    'havenheart',
    'havenheartsg',
    'mental health',
    'youth mental health',                                           
    'non-profit',
    'singapore',
  ],
  openGraph: {
    title: 'Havenheart SG',
    description:
      'A non-profit bridging the gap between youths and mental health in Singapore. Join us in fostering a resilient generation.',
    url: 'https://www.havenheartsg.org/',
    images: ['https://media.licdn.com/dms/image/v2/D560BAQH4DmACGRGWwQ/company-logo_200_200/company-logo_200_200/0/1731252639104?e=1749081600&v=beta&t=z_NzCeIS43fmZyMAJ7kYtYbo_jEeQgrgEzChCXmq3to'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
