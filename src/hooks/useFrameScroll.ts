"use client";
import { useEffect, type RefObject } from "react";

const COUNT = 323;
export function useFrameScroll(track: RefObject<HTMLElement | null>, stage: RefObject<HTMLDivElement | null>, canvas: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const root = track.current, scene = stage.current, surface = canvas.current;
    if (!root || !scene || !surface) return;
    const ctx = surface.getContext("2d", { alpha:false });
    if (!ctx) { scene.dataset.video = "error"; return; }
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const frames: (HTMLImageElement | undefined)[] = new Array(COUNT);
    const pending = new Set<number>();
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
      if (disposed || document.hidden) return;
      const dt = last ? Math.min(64, now - last) : 16.67; last = now;
      current += (target - current) * (1 - Math.pow(.82, dt / 16.67));
      if (Math.abs(target - current) < .01) current = target;
      const frame = Math.round(current);
      load(frame);
      draw(frame);
      if (current !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && !disposed && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };
    function load(index: number) {
      if (disposed || frames[index] || pending.has(index)) return;
      pending.add(index); active++;
      const image = new Image(); image.decoding = "async";
      image.onload = () => {
        active--; pending.delete(index);
        if (disposed) return;
        frames[index] = image;
        cacheOrder.push(index);
        if (cacheOrder.length > 36) { const old = cacheOrder.shift(); if (old !== undefined) frames[old] = undefined; }
        if (index === 0) { scene!.dataset.video = "ready"; draw(0); }
        if (Math.round(current) === index) draw(index);
        pump();
      };
      image.onerror = () => { active--; pending.delete(index); if (!disposed) { if (index === 0) scene!.dataset.video = "error"; } };
      image.src = `/media/frames/frame-${String(index + 1).padStart(4,"0")}.jpg`;
    }
    function pump() {
      if (motion.matches) return;
      for (let distance = 0; distance <= 8 && active < 4; distance++) {
        for (const center of [Math.round(current), Math.round(target)]) {
          for (const index of [center + distance, center - distance]) {
            if (!disposed && active < 4 && index >= 0 && index < COUNT) load(index);
          }
        }
      }
    }
    const update = () => {
      target = motion.matches ? 0 : Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - innerHeight))) * (COUNT - 1);
      wake();
    };
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      surface.width = Math.round(scene.clientWidth * ratio); surface.height = Math.round(scene.clientHeight * ratio);
      drawn = -1; draw(Math.round(current)); update();
    };
    const changed = () => { current = 0; target = 0; drawn = -1; resize(); pump(); };
    window.addEventListener("scroll", update, { passive:true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", changed);
    document.addEventListener("visibilitychange", update);
    resize(); load(0); pump();
    return () => {
      disposed = true; cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update); window.removeEventListener("resize", resize);
      motion.removeEventListener("change", changed); document.removeEventListener("visibilitychange", update);
      frames.length = 0;
    };
  }, [track, stage, canvas]);
}
