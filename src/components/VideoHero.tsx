"use client";
import { useRef } from "react";
import { useFrameScroll } from "@/hooks/useFrameScroll";

export function VideoHero() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useFrameScroll(track, stage, canvas);
  return <section ref={track} className="film-track" aria-label="Scroll to explore the residence walkthrough">
    <div ref={stage} className="film-stage" data-video="loading">
      <canvas ref={canvas} className="film" role="img" aria-label="Residence walkthrough. Scroll down to advance and up to reverse." />
      <video className="fallback-film" controls muted playsInline preload="none" poster="/media/poster.jpg" aria-label="Residence walkthrough">
        <source src="/media/residence.mp4" type="video/mp4" />
        Your browser does not support video.
      </video>
      <div className="loading-indicator" role="status" aria-label="Loading walkthrough" />
      <p className="error-message" role="status">The video could not be loaded. <a href="/media/residence.mp4">Open video</a></p>
    </div>
  </section>;
}
