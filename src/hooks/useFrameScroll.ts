"use client";
import { useEffect, type RefObject } from "react";

const COUNT = 323;
// Keep the original first/last-frame holds, plus brief rests between movements.
const EDGE_HOLD = 0.08;
const MOVEMENT_HOLD = 0.015;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const MOVING_RANGE = 1 - 2 * EDGE_HOLD - 2 * MOVEMENT_HOLD;
const FIRST_REST = EDGE_HOLD + .3 * MOVING_RANGE;
const SECOND_REST = EDGE_HOLD + .66 * MOVING_RANGE + MOVEMENT_HOLD;
const FRAME_TIMELINE = [
  [0, 0], [EDGE_HOLD, 0],
  [FIRST_REST, .3], [FIRST_REST + MOVEMENT_HOLD, .3],
  [SECOND_REST, .66], [SECOND_REST + MOVEMENT_HOLD, .66],
  [1 - EDGE_HOLD, 1], [1, 1],
] as const;

function frameProgress(progress: number) {
  const p = clamp(progress);
  for (let i = 1; i < FRAME_TIMELINE.length; i++) {
    const [end, to] = FRAME_TIMELINE[i];
    if (p > end) continue;
    const [start, from] = FRAME_TIMELINE[i - 1];
    const t = (p - start) / (end - start);
    // Smoothstep arrives at and leaves each hold with zero target velocity.
    return from + (to - from) * t * t * (3 - 2 * t);
  }
  return 1;
}
export function useFrameScroll(track: RefObject<HTMLElement | null>, stage: RefObject<HTMLDivElement | null>, canvas: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const root = track.current, scene = stage.current, surface = canvas.current;
    if (!root || !scene || !surface) return;
    const cta = scene.querySelector<HTMLElement>("[data-hero-cta]");
    const opening = scene.querySelector<HTMLElement>('[data-hero-copy="opening"]');
    const ctx = surface.getContext("2d", { alpha:false });
    if (!ctx) {
      scene.dataset.video = "error";
      if (cta) { cta.inert = false; cta.setAttribute("aria-hidden", "false"); }
      return;
    }
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 760px)");
    const mark = scene.querySelector<HTMLElement>("[data-hero-mark]");
    const sample = (value: number) => mobile.matches ? Math.min(COUNT - 1, Math.round(value / 2) * 2) : Math.round(value);
    const frames: (HTMLImageElement | undefined)[] = new Array(COUNT);
    const pending = new Set<number>();
    const failed = new Set<number>();
    const cacheOrder: number[] = [];
    let disposed = false, raf = 0, current = 0, target = 0, last = 0, drawn = -1, active = 0;
    const draw = (index: number) => {
      const image = frames[index];
      if (!image || drawn === index) return;
      const w = surface.width, h = surface.height;
      const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      ctx.drawImage(image, (w - image.naturalWidth * scale) / 2, (h - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale);
      drawn = index;
    };
    const tick = (now: number) => {
      raf = 0;
      if (disposed || document.hidden || motion.matches || scene.dataset.video === "error") return;
      const dt = last ? Math.min(64, now - last) : 16.67; last = now;
      current += (target - current) * (1 - Math.pow(.82, dt / 16.67));
      if (Math.abs(target - current) < .01) current = target;
      const frame = sample(current);
      load(frame);
      draw(frame);
      pump();
      if (current !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && !disposed && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };
    function load(index: number) {
      if (disposed || active >= 4 || index < 0 || index >= COUNT || frames[index] || pending.has(index) || failed.has(index) || motion.matches || scene!.dataset.video === "error") return;
      pending.add(index); active++;
      const image = new Image(); image.decoding = "async";
      image.onload = () => {
        active--; pending.delete(index);
        if (disposed) return;
        frames[index] = image;
        cacheOrder.push(index);
        if (cacheOrder.length > 36) { const old = cacheOrder.shift(); if (old !== undefined) frames[old] = undefined; }
        if (index === 0) scene!.dataset.video = "ready";
        if (sample(current) === index || drawn === -1) draw(index);
        pump();
      };
      image.onerror = () => {
        active--; pending.delete(index); failed.add(index);
        if (disposed) return;
        if (index === 0) { scene!.dataset.video = "error"; update(); }
        else pump();
      };
      image.src = `/media/residence-v2-frames/frame-${String(index + 1).padStart(4,"0")}.jpg`;
    }
    function pump() {
      if (motion.matches || document.hidden || scene!.dataset.video === "error") return;
      load(sample(current));
      load(sample(target));
      for (let distance = 0; distance <= 8 && active < 4; distance++) {
        for (const center of [Math.round(current), Math.round(target)]) {
          for (const index of [center + distance, center - distance]) {
            if (!disposed && active < 4 && index >= 0 && index < COUNT) load(sample(index));
          }
        }
      }
    }
    const update = () => {
      const viewport = scene.clientHeight;
      const distance = -root.getBoundingClientRect().top;
      const range = Math.max(1, root.offsetHeight - 2 * viewport);
      const fallback = motion.matches || scene.dataset.video === "error";
      const progress = fallback ? 0 : clamp(distance / range);
      const exit = fallback ? 0 : clamp((distance - range) / viewport);
      target = frameProgress(progress) * (COUNT - 1);
      scene.style.transform = exit ? `scale(${1 - .1 * exit})` : "";
      scene.style.filter = exit ? `brightness(${1 - .5 * exit})` : "";
      const visible = fallback || (progress > .86 && exit < 1);
      if (opening) {
        const showOpening = fallback || progress < .2;
        opening.dataset.visible = String(showOpening);
        opening.inert = !showOpening;
        opening.setAttribute("aria-hidden", String(!showOpening));
      }
      if (cta) {
        cta.dataset.visible = String(visible);
        cta.inert = !visible;
        cta.setAttribute("aria-hidden", String(!visible));
      }
      if (mark) mark.dataset.visible = String(!fallback && progress > .86);
      if (fallback) return;
      pump();
      wake();
    };
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      surface.width = Math.round(scene.clientWidth * ratio); surface.height = Math.round(scene.clientHeight * ratio);
      drawn = -1; draw(sample(current)); update();
    };
    const changed = () => { current = 0; target = 0; drawn = -1; resize(); pump(); };
    window.addEventListener("scroll", update, { passive:true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", changed);
    mobile.addEventListener("change", changed);
    document.addEventListener("visibilitychange", update);
    load(0); resize(); pump();
    return () => {
      disposed = true; cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update); window.removeEventListener("resize", resize);
      motion.removeEventListener("change", changed); document.removeEventListener("visibilitychange", update);
      mobile.removeEventListener("change", changed);
      frames.length = 0;
    };
  }, [track, stage, canvas]);
}
