# Scroll-Video Hero & Animation Playbook

A reusable recipe for everything animated on this site: the scroll-scrubbed
video hero, the seamless hand-off into the page, the text-over-video reveal,
scroll-triggered section reveals, the adaptive navbar, and the decorative
touches. Copy the code blocks into any React + Tailwind project and swap the
branded parts (video, colors, fonts, copy).

Everything here is dependency-free beyond React itself — no GSAP, no
framer-motion, no scroll libraries. That keeps it portable and fast.

---

## 1. The core idea: scroll-scrubbed video

**Effect:** the page pins a full-screen video while the user scrolls, and the
scroll position drives the video's playhead — scrolling "walks" the camera
into the restaurant. Scrolling back rewinds it.

**Mechanism:** two nested elements.

```html
<!-- Outer: very tall, creates the scroll distance (350vh = 2.5 screens of scrubbing) -->
<div class="relative h-[350vh]">
  <!-- Inner: sticks to the viewport while the outer scrolls past -->
  <div class="sticky top-0 h-screen w-full overflow-hidden">
    <video ... />
    <!-- overlays: gradient, loading spinner, hand-off veil, scroll cue, title -->
  </div>
</div>
```

While the outer div scrolls through the viewport, the inner stage stays
pinned. Normalized progress (0 at the start of the pin, 1 when it releases):

```ts
const computeProgress = () => {
  const rect = section.getBoundingClientRect();       // outer div
  const scrollable = section.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
  return scrollable > 0 ? scrolled / scrollable : 0;  // 0..1
};
```

`progress` is the single source of truth. The video playhead, the title
opacity, the scroll cue, and the hand-off dissolve are all pure functions of
it — which is why scrolling backwards reverses every effect for free.

**Tuning knob:** the `h-[350vh]` height. Bigger = slower, more cinematic
scrub; smaller = snappier. 300–400vh feels right for a ~10s clip.

### Smooth scrubbing (the lerp)

Setting `video.currentTime = progress * duration` directly on every scroll
event looks jittery — scroll events arrive in bursts and video seeking is
async. Instead, store a *target* time and chase it with an ease-out lerp in
`requestAnimationFrame`:

```ts
const animate = () => {
  const current = video.currentTime;
  const target = targetTimeRef.current;
  const diff = target - current;
  if (Math.abs(diff) > 0.01) {
    video.currentTime = current + diff * 0.15;  // move 15% closer per frame
    rafRef.current = requestAnimationFrame(animate);
  } else {
    video.currentTime = target;                 // snap when close enough
    rafRef.current = null;                      // stop the loop when idle
  }
};

const onScroll = () => {
  const p = computeProgress();
  setProgress(p);
  targetTimeRef.current = p * Math.max(durationRef.current - 0.05, 0);
  if (video.readyState >= 1 && rafRef.current === null) {
    rafRef.current = requestAnimationFrame(animate);
  }
};
```

Notes:
- `0.15` is the smoothing factor: lower = floatier, higher = tighter.
- `duration - 0.05` avoids seeking to the exact end (some browsers fire
  `ended`/blank frames there).
- The rAF loop self-terminates when the target is reached — no idle work.
- Guard with `video.readyState >= 1` so seeking never happens before
  metadata exists.

---

## 2. Bulletproof video loading

Scrubbing needs every frame available instantly; progressive streaming causes
stalls when the user scrolls faster than the buffer. The fix: **download the
whole clip up front and play it from a blob URL** — after that, seeking is
instant in both directions.

Reliability rules learned the hard way:

1. **Bundle the file with the site** (import it through the bundler so the
   URL is hashed and correct under any base path). Never hard-code an
   absolute path, and never depend only on a third-party host.
2. **Keep a fallback source** (a CDN copy) and rotate through sources.
3. **Never give up on network errors** — retry forever with capped backoff.
   A connection blip should delay the video, not kill it.
4. **Recover from decode errors** — if the element errors after attach,
   re-fetch from the primary source with fresh backoff. Only stop (and hide
   the spinner) after several *playback* failures, which means the browser
   genuinely can't play the codec.
5. **Prime for iOS**: mobile Safari won't render seeked frames until the
   video has had a real `play()` attempt. Try on mount; if autoplay is
   blocked, retry on the first touch/pointer event.
6. **Reject non-video responses** (`blob.type.startsWith("video/")`) — an
   SPA 404 page served with HTTP 200 must not be attached as a video source.
7. Use H.264 (`avc1`) MP4 — the only codec safe on every device.
8. Keep the clip small (~2–3 MB for ~10s at 720–1080p). It's downloaded
   fully before the experience starts.

```ts
const VIDEO_SOURCES = [localVideo, cdnFallbackUrl];  // localVideo = bundler import
const MAX_PLAYBACK_FAILURES = 3;

// inside useEffect:
let fetchAttempt = 0, playbackFailures = 0;

const load = async () => {
  while (!cancelled) {
    const url = VIDEO_SOURCES[fetchAttempt % VIDEO_SOURCES.length];
    fetchAttempt++;
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (!blob.type.startsWith("video/")) throw new Error(blob.type);
      objectUrl = URL.createObjectURL(blob);
      attach(objectUrl);                       // video.src = ...; load(); prime();
      return;
    } catch {
      if (cancelled || controller.signal.aborted) return;
      await sleep(Math.min(500 * 2 ** Math.min(fetchAttempt, 4), 8000));
    }
  }
};

const onError = () => {                        // decode/playback error
  if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
  setReady(false);
  if (++playbackFailures >= MAX_PLAYBACK_FAILURES) { setGaveUp(true); return; }
  fetchAttempt = 0;                            // restart from primary source
  retryTimer = setTimeout(() => void load(), 1200);
};
```

The iOS priming helper:

```ts
const prime = () => {
  if (primedRef.current || !video.src) return;
  primedRef.current = true;
  video.play()
    .then(() => { video.pause(); video.currentTime = targetTimeRef.current; setReady(true); })
    .catch(() => { primedRef.current = false; });  // blocked → retry on first gesture
};
window.addEventListener("touchstart", prime, { passive: true });
window.addEventListener("pointerdown", prime, { passive: true });
```

The `<video>` element attributes that matter:

```html
<video muted autoplay playsinline preload="auto" ... />
```

`muted + playsinline` are what allow autoplay/priming on mobile at all.

**Design principle:** the scroll experience must never depend on the video.
Progress, title reveal, and hand-off are driven by scroll alone; the video
fades in (`opacity` transition on `ready`) whenever it's available. Failure
mode = branded color stage + working text animation, not a broken page.

---

## 3. Text over the video (staged reveal)

All overlay text lives inside the sticky stage and animates as a function of
`progress`. Each element gets its own window on the 0→1 timeline:

```ts
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

// Scroll cue: visible at rest, gone by progress 0.25
const cueOpacity = Math.max(1 - progress * 4, 0);

// Title: fades in + rises between progress 0.55 and 0.90
const titleOpacity = clamp01((progress - 0.55) / 0.35);
// paired with: transform: translateY((1 - titleOpacity) * 30px)

// Hand-off veil: dissolves the stage between progress 0.84 and 1.0
const handoff = clamp01((progress - 0.84) / 0.16);
```

The generic pattern for "animate X between progress a and b":
`clamp01((progress - a) / (b - a))`. Chain as many staged elements as you
like by picking non-overlapping (or deliberately overlapping) windows.

Legibility over video: a static gradient scrim behind the text —

```html
<div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
```

Layer order inside the stage (bottom → top): video → gradient scrim →
loading spinner → hand-off veil → scroll cue → title. The title sits *above*
the veil on purpose — see next section.

---

## 4. The seamless transition (hero → page)

The trick that makes the pin release invisible has two parts, both driven by
the `handoff` value (0.84→1.0):

**Part 1 — dissolve the stage into the page background.** A full-stage veil
in exactly the page background color fades in on top of the video:

```html
<div class="pointer-events-none absolute inset-0 bg-background"
     style="opacity: {handoff}"></div>
```

By `progress = 1` the stage *is* the page background. When the sticky pin
releases and the stage scrolls away, the eye can't see the seam — background
scrolling over background.

**Part 2 — morph the title color.** The title stays above the veil, so it
would end as light text on a light background. Instead its color blends from
the on-video color to the normal page text color in lockstep:

```ts
style={{
  color: `color-mix(in oklab,
            var(--primary-foreground) ${Math.round((1 - handoff) * 100)}%,
            var(--foreground)        ${Math.round(handoff * 100)}%)`,
}}
```

Result: as the video dissolves away, the headline "becomes" ordinary page
text, then scrolls off naturally with the stage, and the first real section
(same background, matching typography) slides up behind it. No hard edge,
no color jump, no visible unpin.

To retune: start the hand-off later (e.g. 0.88) for more video time, earlier
for a longer dissolve. Keep the title reveal finishing (0.90) around where
the hand-off starts so the two overlap slightly.

---

## 5. Scroll-triggered section reveals

Every content block below the hero fades up on first view. One tiny
component, IntersectionObserver, no scroll listeners:

```tsx
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: {
  children: ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.15 },   // fire when 15% of the block is on screen
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}
```

Usage patterns:
- Wrap any section/block: `<Reveal>…</Reveal>`
- Stagger card grids with the delay prop: `<Reveal delay={i * 80}>` —
  80ms per item reads as a cascade without feeling slow.
- It disconnects after firing, so blocks animate only once.

---

## 6. Adaptive navbar (transparent → glass)

Fixed header that is transparent with light content while over the hero
video, and becomes a frosted-glass light bar once the page is scrolled:

```tsx
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);

<header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
  scrolled
    ? "border-b border-border/60 bg-background/85 text-foreground shadow-sm backdrop-blur-md"
    : "bg-transparent text-primary-foreground"
}`}>
```

Details that matter:
- Swap any logo image variants off the same boolean (dark logo when solid,
  light logo when transparent).
- If a mobile menu can be open, treat that as solid too:
  `const solid = scrolled || open;`
- Smooth in-page anchor navigation + keeping section headings clear of the
  fixed bar, in plain CSS:

```css
html { scroll-behavior: smooth; }
section[id] { scroll-margin-top: 4.5rem; }  /* ≈ header height */
```

---

## 7. Decorative details

### Section divider (theme: mountains — swap the shape for any brand)

Two stacked `currentColor` paths at different opacities fake depth. Color it
with a text-color utility matching the *next* section's background and butt
it against that section with `-mb-px` (avoids a 1px seam on fractional DPI):

```tsx
export function AlpineDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden leading-none ${className}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-14 w-full sm:h-20">
        <path d="M0 120 L180 62 L300 92 L470 38 L620 96 L790 52 L960 100 L1120 60 L1280 92 L1440 48 L1440 120 Z"
              fill="currentColor" opacity="0.35" />
        <path d="M0 120 L240 70 L380 98 L540 48 L700 104 L880 60 L1060 106 L1230 72 L1440 100 L1440 120 Z"
              fill="currentColor" />
      </svg>
    </div>
  );
}

// usage: <AlpineDivider className="-mb-px text-secondary/40" />
//        <section className="bg-secondary/40 ...">
```

For a different concept, redraw the front/back paths as waves, city
skylines, rooftops — the layering technique stays the same.

### Marker-highlight text (the "Über uns" letter)

Native `<mark>` restyled to look like a highlighter swipe, with
`box-decoration-break: clone` so multi-line highlights keep their padding on
every line:

```css
mark {
  background: color-mix(in oklab, oklch(0.85 0.14 90) 45%, transparent);
  color: inherit;
  border-radius: 0.25rem;
  padding-inline: 0.15em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
```

Pair with a script font for the body (`Dancing Script`), a display/blackletter
font for the heading (`Grenze Gotisch` here — pick something on-brand), and a
"polaroid" photo for the letterhead feel:

```html
<div class="mx-auto w-56 rotate-2 rounded-md bg-white p-2 pb-6 shadow-xl">
  <img class="aspect-square w-full rounded-sm object-cover" src="..." />
</div>
```

### Card image hover zoom

```html
<article class="group overflow-hidden rounded-3xl ...">
  <div class="h-56 overflow-hidden">
    <img class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" ... />
  </div>
</article>
```

### Adaptive one-artwork logo

Ship the logo as tinted transparent PNGs (or a `currentColor` SVG) in two
variants — dark ink for light surfaces, light/cream for dark surfaces — and
pick the variant from context (navbar `solid` state, footer, etc.). One
artwork, correct contrast everywhere.

---

## 8. Adaptation checklist (new brand in ~1 hour)

1. **Video**: ~10s clip that reads as one continuous camera move (walk-in,
   fly-over, product turntable). H.264 MP4, 2–3 MB. Bundle it; keep a CDN
   fallback URL if you have one.
2. **Colors**: define `--background`, `--foreground`, `--primary`,
   `--primary-foreground` (etc.) as CSS variables. Every animation above
   references the variables, so the hand-off dissolve and title morph adapt
   automatically.
3. **Fonts**: a display font for headlines, a body font, optionally a
   script/character font for the story section. Self-host (e.g. Fontsource).
4. **Copy the components**: ScrollVideoHero, Reveal, header scroll state,
   divider (redraw the silhouette), CSS snippets (smooth scroll,
   scroll-margin, mark).
5. **Tune the timeline**: pin length (`h-[350vh]`), title window
   (0.55–0.90), hand-off window (0.84–1.0), lerp factor (0.15).
6. **Check the failure mode**: block the video URL in devtools and confirm
   the hero still looks intentional (brand color + text animation).
7. **Test on a real phone**: the iOS priming path only shows up on device.

## Full reference implementation

The complete, production version of everything above lives in this repo:

- `src/components/ScrollVideoHero.tsx` — hero: scrub, loading, reveal, hand-off
- `src/components/Reveal.tsx` — scroll-in reveals
- `src/components/SiteHeader.tsx` — adaptive navbar + mobile menu
- `src/components/AlpineDivider.tsx` — layered SVG divider
- `src/components/Logo.tsx` — two-tint logo
- `src/styles.css` — design tokens, fonts, mark styling, smooth scroll
