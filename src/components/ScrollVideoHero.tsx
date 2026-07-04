import { useEffect, useRef, useState } from "react";
import videoAsset from "../assets/enter-restaurant.mp4.asset.json";

export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const durationRef = useRef(10);
  const primedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

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
      targetTimeRef.current = p * (durationRef.current - 0.05);
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onMeta = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    const onReady = () => {
      setReady(true);
      onScroll();
    };

    // Mobile browsers (esp. iOS Safari) won't buffer/decode or render seeked
    // frames until the video has been "primed" with a playback attempt.
    const prime = () => {
      if (primedRef.current) return;
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

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);

    // Kick off loading + priming.
    video.load();
    prime();

    const onFirstInteract = () => prime();
    window.addEventListener("touchstart", onFirstInteract, { passive: true });
    window.addEventListener("pointerdown", onFirstInteract, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    onScroll();

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      window.removeEventListener("touchstart", onFirstInteract);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const titleOpacity = Math.min(Math.max((progress - 0.55) / 0.35, 0), 1);
  const cueOpacity = Math.max(1 - progress * 4, 0);

  return (
    <div ref={sectionRef} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary">
        <video
          ref={videoRef}
          src={videoAsset.url}
          muted
          autoPlay
          loop={false}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/60" />

        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
          </div>
        )}

        {/* Scroll cue */}
        <div
          className="absolute left-1/2 top-10 flex -translate-x-1/2 flex-col items-center gap-2 text-primary-foreground"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-sm uppercase tracking-[0.3em]">scrollen</span>
          <span className="animate-bounce text-2xl">↓</span>
        </div>

        {/* Title reveal */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-primary-foreground"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleOpacity) * 30}px)`,
          }}
        >
          <p className="mb-4 text-sm uppercase tracking-[0.35em]">Willkommen im</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
            Teigtaschen Bowls Café
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/90">
            Hausgemachte Teigtaschen · Bowls · vegane Optionen
          </p>
        </div>
      </div>
    </div>
  );
}
