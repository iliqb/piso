import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Residence walkthrough",
  description: "A cinematic architectural walkthrough controlled by scrolling.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
