# Video-only walkthrough

Run `pnpm install`, then `pnpm dev`. Open http://127.0.0.1:3000. For production: `pnpm build`, then `pnpm start`.

The original video is unchanged at ../tu-video.mp4.mp4: H.264, 161.53 seconds, 1702x1080, 60 fps, 685 MB. The optimized MP4 in public/media is a 62 MB fallback. The poster comes from the original.

The scroll animation now uses the same canvas image-sequence technique as https://piso-zen.netlify.app/, with 323 JPEG frames extracted at 2 fps across the entire video. It avoids MP4 decoder seeking stalls. A 400vh sticky track maps scroll to frame index; .18 smoothing at 60 Hz is adjusted for display refresh rate. There are no overlays or content sections.

src/hooks/useFrameScroll.ts handles drawing, responsive cover scaling, forward/reverse scrolling and a bounded 36-image decoded cache. Images load near the current and destination frame instead of decoding the full sequence. Native scrolling is preserved; animation stops when settled and all listeners are cleaned up.

Reduced motion shows the native player without a long scroll track. Video also provides an error fallback. Physical mobile-device testing remains necessary for hardware performance.

Source: src/components/VideoHero.tsx. Styles: src/app/globals.css. Assets: public/media/frames, public/media/residence.mp4, public/media/poster.jpg.

Regenerate frames with FFmpeg: `ffmpeg -i public/media/residence.mp4 -vf "fps=2,scale=1280:-2" -q:v 3 public/media/frames/frame-%04d.jpg`. Update COUNT in the hook if the frame count changes. FFmpeg is development tooling, not a runtime requirement.
