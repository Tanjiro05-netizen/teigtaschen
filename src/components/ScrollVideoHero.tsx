import { useEffect, useRef, useState } from "react";
import localVideo from "../assets/enter-restaurant.mp4";
import videoAsset from "../assets/enter-restaurant.mp4.asset.json";

// The clip ships with the site through Vite's asset pipeline, so its URL is
// always correct no matter where or under which base path the site is
// deployed. The Lovable-hosted copy remains as a network fallback.
const VIDEO_SOURCES = [localVideo, videoAsset.url];

// How often a successfully-loaded video may fail (decode/playback error) and
// be re-fetched before we stop showing the loading spinner. The title reveal
// and scroll hand-off never depend on the video.
const MAX_PLAYBACK_FAILURES = 3;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const durationRef = useRef(10);
  const primedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  // Scroll-driven progress + video scrubbing. Runs independently of the video
  // load state so the title reveal and the hand-off into the page always
  // work, even while the video is still loading.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const animate = () => {
      const current = video.currentTime;
      const target = targetTimeRef.current;
      const diff = target - current;
      if (Math.abs(diff) > 0.01) {
        video.currentTime = current + diff * 0.15;
        rafRef.current = requestAnimationFrame(animate);
      } else {
        video.currentTime = target;
        rafRef.current = null;
      }
    };

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      return scrollable > 0 ? scrolled / scrollable : 0;
    };

    const onScroll = () => {
      const p = computeProgress();
      setProgress(p);
      targetTimeRef.current = p * Math.max(durationRef.current - 0.05, 0);
      if (video.readyState >= 1 && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Video loading. The whole clip is downloaded (rotating through sources,
  // retrying with capped backoff for as long as it takes) and played from a
  // blob URL: once attached, every frame is buffered locally, so scrubbing
  // never stalls on partial buffering. Playback errors re-enter the loop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let objectUrl: string | null = null;
    let fetchAttempt = 0;
    let playbackFailures = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();

    const onMeta = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    const onReady = () => {
      setReady(true);
      video.currentTime = targetTimeRef.current;
    };

    // Mobile browsers (esp. iOS Safari) won't buffer/decode or render seeked
    // frames until the video has been "primed" with a playback attempt.
    const prime = () => {
      if (primedRef.current || !video.src) return;
      primedRef.current = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            video.pause();
            video.currentTime = targetTimeRef.current;
            setReady(true);
          })
          .catch(() => {
            // Autoplay blocked until a gesture; will retry on interaction.
            primedRef.current = false;
          });
      }
    };

    const attach = (src: string) => {
      primedRef.current = false;
      video.src = src;
      video.load();
      prime();
    };

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        retryTimer = setTimeout(resolve, ms);
      });

    const load = async () => {
      while (!cancelled) {
        const url = VIDEO_SOURCES[fetchAttempt % VIDEO_SOURCES.length];
        fetchAttempt++;
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          if (!blob.type.startsWith("video/")) throw new Error(blob.type);
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          attach(objectUrl);
          return;
        } catch {
          if (cancelled || controller.signal.aborted) return;
          await sleep(Math.min(500 * 2 ** Math.min(fetchAttempt, 4), 8000));
        }
      }
    };

    // Decode/playback error on an attached source: drop it and re-fetch.
    const onError = () => {
      if (cancelled) return;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
      setReady(false);
      playbackFailures++;
      if (playbackFailures >= MAX_PLAYBACK_FAILURES) {
        // Browser genuinely cannot play the clip; stop the spinner and let
        // the scroll animation carry the hero on its own.
        setGaveUp(true);
        return;
      }
      // Restart from the primary (local) source with fresh backoff.
      fetchAttempt = 0;
      retryTimer = setTimeout(() => void load(), 1200);
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", onError);

    void load();

    const onFirstInteract = () => prime();
    window.addEventListener("touchstart", onFirstInteract, { passive: true });
    window.addEventListener("pointerdown", onFirstInteract, { passive: true });

    return () => {
      cancelled = true;
      controller.abort();
      if (retryTimer !== undefined) clearTimeout(retryTimer);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
      window.removeEventListener("touchstart", onFirstInteract);
      window.removeEventListener("pointerdown", onFirstInteract);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const titleOpacity = clamp01((progress - 0.55) / 0.35);
  const cueOpacity = Math.max(1 - progress * 4, 0);
  // Over the last stretch of the pin the whole stage dissolves into the page
  // background and the title text morphs to the page foreground color, so the
  // unpin moment is invisible.
  const handoff = clamp01((progress - 0.84) / 0.16);

  return (
    <div ref={sectionRef} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary">
        <video
          ref={videoRef}
          muted
          autoPlay
          loop={false}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/60" />

        {/* Loading state */}
        {!ready && !gaveUp && (
          <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
          </div>
        )}

        {/* Seamless hand-off into the page background */}
        <div
          className="pointer-events-none absolute inset-0 bg-background"
          style={{ opacity: handoff }}
        />

        {/* Scroll cue */}
        <div
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-primary-foreground"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-sm uppercase tracking-[0.3em]">scrollen</span>
          <span className="animate-bounce text-2xl">↓</span>
        </div>

        {/* Title reveal */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleOpacity) * 30}px)`,
            color: `color-mix(in oklab, var(--primary-foreground) ${Math.round((1 - handoff) * 100)}%, var(--foreground) ${Math.round(handoff * 100)}%)`,
          }}
        >
          <p className="mb-4 font-script text-3xl sm:text-4xl">Willkommen im</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
            Teigtaschen Bowls Café
          </h1>
          <p className="mt-6 max-w-xl text-lg opacity-90">
            Hausgemachte Teigtaschen · Bowls · vegane Optionen
          </p>
        </div>
      </div>
    </div>
  );
}
