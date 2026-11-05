import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
  return <html lang="en" className={montserrat.variable}><body>
    <Script id="reset-scroll-on-reload" strategy="beforeInteractive">{`
      (() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (!navigation || navigation.type !== 'reload') return;

        const previousRestoration = history.scrollRestoration;
        history.scrollRestoration = 'manual';
        // A reloaded fragment must not jump back to a lower section.
        if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
        const reset = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        reset();

        // Retry after document load, but never override deliberate user scrolling.
        let interacted = false;
        const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
        const markInteraction = () => { interacted = true; };
        const cleanup = () => events.forEach(type => window.removeEventListener(type, markInteraction));
        events.forEach(type => window.addEventListener(type, markInteraction, { passive: true }));
        window.addEventListener('pageshow', event => {
          if (!event.persisted && !interacted) reset();
          cleanup();
        }, { once: true });
        // Leave normal back/forward restoration intact when this document is left.
        window.addEventListener('pagehide', () => {
          cleanup();
          history.scrollRestoration = previousRestoration;
        }, { once: true });
      })();
    `}</Script>
    {children}
  </body></html>;
}
