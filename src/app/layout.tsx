import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: "../../public/fonts/montserrat/Montserrat-Variable.ttf",
  variable: "--font-montserrat",
  weight: "300 600",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Residence walkthrough",
  description: "A cinematic architectural walkthrough controlled by scrolling.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={montserrat.variable}><body>{children}</body></html>;
}
