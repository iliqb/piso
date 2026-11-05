"use client";
import { useRef } from "react";
import { useFrameScroll } from "@/hooks/useFrameScroll";
import styles from "./landing/VideoHeroOverlay.module.css";

export function VideoHero() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useFrameScroll(track, stage, canvas);
  return <section ref={track} className={`film-track ${styles.track}`} aria-label="Scroll to explore the residence walkthrough">
    <div ref={stage} className="film-stage" data-video="loading">
      <canvas ref={canvas} className="film" role="img" aria-label="Residence walkthrough. Scroll down to advance and up to reverse." />
      <video className="fallback-film" controls muted playsInline preload="none" poster="/media/residence-v2-poster.jpg" aria-label="Residence walkthrough">
        <source src="/media/residence-v2.mp4" type="video/mp4" />
        Your browser does not support video.
      </video>
      <div className={styles.overlay} lang="es-MX">
        <div className={styles.logo}>
          <img src="/brand/piso-logo.png" width={2847} height={1907} alt="Piso" />
        </div>
        <div className={styles.copy}>
          <h1>Preventa exclusiva<br />en Texcoco</h1>
          <p className={styles.price}><span className={styles.from}>DESDE</span> <span className={styles.amount}>$3,411,738</span> <span className={styles.currency}>MXN</span></p>
        </div>
      </div>
      <div className="loading-indicator" role="status" aria-label="Loading walkthrough" />
      <p className="error-message" role="status">The video could not be loaded. <a href="/media/residence-v2.mp4">Open video</a></p>
    </div>
  </section>;
}
