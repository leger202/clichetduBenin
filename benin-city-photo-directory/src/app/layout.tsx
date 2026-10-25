import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Clichés du Bénin — Les plus belles photos du 229, ville par ville",
    template: "%s · Clichés du Bénin",
  },
  description:
    "La galerie participative des plus beaux clichés du Bénin : partagez vos photos et explorez le pays département par département — Cotonou, Porto-Novo, Parakou, Abomey, la Pendjari, Ganvié et plus.",
  keywords: [
    "Bénin",
    "photos",
    "clichés",
    "Cotonou",
    "Porto-Novo",
    "Parakou",
    "Abomey",
    "Pendjari",
    "Ganvié",
    "Ouidah",
    "photographie",
    "départements",
  ],
};

export const viewport: Viewport = {
  themeColor: "#14231a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="grain bg-cream font-sans text-ink antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
