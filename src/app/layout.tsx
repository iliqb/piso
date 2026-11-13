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
  return <html lang="en" className={montserrat.variable}>
    <head>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        (() => {
          // Keep initialization and the initial PageView unique per document.
          if (window.__metaPixel2239349237462806) return;
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          window.__metaPixel2239349237462806 = true;
          window.fbq('init', '2239349237462806');
          window.fbq('track', 'PageView');
        })();
      `}</Script>
    </head>
    <body>
    <noscript>
      <img height="1" width="1" style={{ display: "none" }} alt=""
        src="https://www.facebook.com/tr?id=2239349237462806&ev=PageView&noscript=1" />
    </noscript>
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
