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
    const CACHE_LIMIT = 36;
    const LOAD_LIMIT = 4;
    type Frame = { image: HTMLImageElement; state: "loading" | "decoding" | "ready"; used: number };
    // Includes in-flight images: downloading/decoding cannot exceed the memory budget.
    const frames = new Map<number, Frame>();
    const failed = new Set<number>();
    let disposed = false, raf = 0, current = 0, target = 0, last = 0, drawn = -1, active = 0;
    let visible = true, needsFit = true, resizeRaf = 0, clock = 0;
    let velocity = 0, direction = 1, scrollTime = 0;
    const canWork = () => !disposed && visible && !document.hidden && !motion.matches && scene.dataset.video !== "error";
    const draw = (index: number) => {
      const frame = frames.get(index);
      if (!canWork() || frame?.state !== "ready" || drawn === index) return;
      const image = frame.image;
      const w = surface.width, h = surface.height;
      const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      ctx.drawImage(image, (w - image.naturalWidth * scale) / 2, (h - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale);
      drawn = index;
      frame.used = ++clock;
      scene.dataset.video = "ready";
    };
    const tick = (now: number) => {
      raf = 0;
      if (!canWork()) return;
      const dt = last ? Math.min(64, now - last) : 16.67; last = now;
      current += (target - current) * (1 - Math.pow(.82, dt / 16.67));
      if (Math.abs(target - current) < .01) current = target;
      const frame = sample(current);
      draw(frame);
      pump();
      if (current !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && canWork()) { last = 0; raf = requestAnimationFrame(tick); } };
    function priorities() {
      const plan: number[] = [];
      const add = (value: number) => {
        if (value < 0 || value >= COUNT || plan.length >= CACHE_LIMIT - LOAD_LIMIT) return;
        const index = sample(value);
        if (!failed.has(index) && !plan.includes(index)) plan.push(index);
      };
      add(current);
      // Predict the next smoothing steps, rather than just contiguous frame indices.
      // This changes request order only; tick retains the original interpolation.
      let upcoming = current;
      for (let n = 0; n < 3; n++) { upcoming += (target - upcoming) * .18; add(upcoming); }
      add(target);
      const step = mobile.matches ? 2 : 1;
      const ahead = Math.min(20, Math.max(6, Math.ceil(Math.abs(velocity) * 180 / step)));
      for (let n = 1; n <= ahead; n++) {
        add(current + direction * n * step);
        add(target + direction * n * step);
        if (n <= 4) { add(current - direction * n * step); add(target - direction * n * step); }
      }
      return plan;
    }
    function makeRoom(index: number, plan: number[]) {
      if (frames.size < CACHE_LIMIT) return true;
      const rank = (key: number) => { const position = plan.indexOf(key); return position < 0 ? Infinity : position; };
      let victim: number | undefined;
      for (const [key, frame] of frames) {
        if (frame.state !== "ready" || key === drawn || key === sample(current)) continue;
        if (victim === undefined || rank(key) > rank(victim) ||
          (rank(key) === rank(victim) && frame.used < frames.get(victim)!.used)) victim = key;
      }
      // Never evict a more important frame to admit speculative work.
      if (victim === undefined || rank(victim) < rank(index)) return false;
      frames.delete(victim);
      return true;
    }
    function load(index: number) {
      if (!canWork() || active >= LOAD_LIMIT || frames.has(index) || failed.has(index)) return;
      active++;
      const image = new Image(); image.decoding = "async";
      const entry: Frame = { image, state: "loading", used: ++clock };
      frames.set(index, entry);
      let finished = false;
      const finish = (error = false) => {
        if (finished) return;
        finished = true;
        active--;
        image.onload = image.onerror = null;
        if (disposed) return;
        if (error) {
          frames.delete(index);
          failed.add(index);
          if (index === 0) { scene!.dataset.video = "error"; update(); }
        } else {
          entry.state = "ready";
          if (index === 0) scene!.dataset.video = "ready";
          // Rendering stays in rAF; late prefetch completions never overwrite the canvas.
          if (index === sample(current)) wake();
        }
        pump();
      };
      image.onload = () => {
        if (disposed) return;
        if (!canWork()) {
          finished = true; active--; frames.delete(index);
          image.onload = image.onerror = null;
          return;
        }
        entry.state = "decoding";
        image.decode().then(() => finish(), () => finish(true));
      };
      image.onerror = () => finish(true);
      image.src = `/media/residence-v2-frames/frame-${String(index + 1).padStart(4,"0")}.jpg`;
    }
    function pump() {
      if (!canWork()) return;
      const plan = priorities();
      for (const index of plan) {
        if (active >= LOAD_LIMIT) break;
        if (!frames.has(index) && makeRoom(index, plan)) load(index);
      }
    }
    const update = () => {
      const viewport = scene.clientHeight;
      const bounds = root.getBoundingClientRect();
      const distance = -bounds.top;
      const range = Math.max(1, root.offsetHeight - 2 * viewport);
      const fallback = motion.matches || scene.dataset.video === "error";
      const progress = fallback ? 0 : clamp(distance / range);
      const exit = fallback ? 0 : clamp((distance - range) / viewport);
      const nextTarget = frameProgress(progress) * (COUNT - 1);
      const now = performance.now();
      const delta = nextTarget - target;
      velocity = scrollTime && now > scrollTime && now - scrollTime < 250 ? delta / (now - scrollTime) : 0;
      if (delta) direction = Math.sign(delta);
      scrollTime = now;
      target = nextTarget;
      // Once the rising sheet covers the stage, its canvas no longer needs work.
      visible = bounds.top < innerHeight && distance < range + viewport;
      scene.style.transform = exit ? `scale(${1 - .1 * exit})` : "";
      scene.style.filter = exit ? `brightness(${1 - .5 * exit})` : "";
      const showCta = fallback || (progress > .86 && exit < 1);
      if (opening) {
        const showOpening = fallback || progress < .2;
        opening.dataset.visible = String(showOpening);
        opening.inert = !showOpening;
        opening.setAttribute("aria-hidden", String(!showOpening));
      }
      if (cta) {
        cta.dataset.visible = String(showCta);
        cta.inert = !showCta;
        cta.setAttribute("aria-hidden", String(!showCta));
      }
      if (mark) mark.dataset.visible = String(!fallback && progress > .86);
      if (!canWork()) {
        cancelAnimationFrame(raf); raf = 0; last = 0;
        // Synchronize unseen positions without replaying missed motion on re-entry.
        current = target;
        return;
      }
      if (needsFit) fit();
      pump();
      wake();
    };
    const fit = () => {
      needsFit = false;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.round(scene.clientWidth * ratio), height = Math.round(scene.clientHeight * ratio);
      if (surface.width === width && surface.height === height) return;
      const previous = drawn;
      surface.width = width; surface.height = height;
      drawn = -1;
      draw(frames.get(sample(current))?.state === "ready" ? sample(current) : previous);
    };
    const resize = () => {
      needsFit = true;
      if (!resizeRaf) resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; update(); });
    };
    const changed = () => { needsFit = true; update(); };
    window.addEventListener("scroll", update, { passive:true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", changed);
    mobile.addEventListener("change", changed);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      disposed = true; cancelAnimationFrame(raf); cancelAnimationFrame(resizeRaf);
      window.removeEventListener("scroll", update); window.removeEventListener("resize", resize);
      motion.removeEventListener("change", changed); document.removeEventListener("visibilitychange", update);
      mobile.removeEventListener("change", changed);
      for (const frame of frames.values()) frame.image.onload = frame.image.onerror = null;
      frames.clear();
    };
  }, [track, stage, canvas]);
}
