import type { Metadata } from "next";
import { Orbitron, DM_Sans } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xpedition - Exotic Super Bikes",
  description: "Where Dreams Ride Again - The Best Exotic Super Bikes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${dmSans.variable}`}>
      <body className={`${dmSans.className} antialiased`}>
        <Preloader />
        {children}
      </body>
    </html>
  );
}

