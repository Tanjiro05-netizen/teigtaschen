# Teigtaschen Bowls Café — Website

A warm, cozy, German-language one-page site for the Munich restaurant **Teigtaschen Bowls Café – Hausgemacht + vegane Optionen**, opening with a scroll-driven video where the visitor "walks into" the restaurant.

## Restaurant facts (researched)
- Name: Teigtaschen Bowls Café – Hausgemacht + vegane Optionen
- Address: Winterstraße 15, 81543 München (Untergiesing-Giesing)
- Concept: handmade dumplings (Teigtaschen) served in build-your-own bowls, with vegan/vegetarian/gluten-free options, homemade drinks, mochi ice cream & desserts
- Delivery/ordering via Wolt

## The scroll intro (hero)
The uploaded 10s video (1280×720) becomes a **scroll-scrubbed hero**: as the user scrolls down, the video plays forward frame-by-frame, giving the feeling of entering the restaurant. Implementation:
- A tall (~250vh) `position: sticky` section pins a full-screen `<video>`.
- Scroll progress within that section maps to `video.currentTime` (scrubbing), driven by a `requestAnimationFrame` loop reading scroll position — no autoplay, motion follows the wheel.
- Video is muted, `playsInline`, `preload="auto"`; on mobile it falls back gracefully (the same scrub works on touch scroll).
- Overlaid: restaurant name + tagline "Hausgemachte Teigtaschen · Bowls · vegane Optionen", fading in as the scrub completes, plus a subtle "scrollen" cue at the top.
- The video is uploaded to the Lovable CDN (not committed as a binary) and referenced via an asset pointer.

## Page sections (German)
1. **Scroll intro** — the "enter the restaurant" video experience.
2. **Willkommen / About** — short warm intro to the handmade + vegan concept.
3. **Menü** — cards for the main categories with sample dishes & prices:
   - Bowls (Teigtaschen mit Rindfleisch 15,99 €; Kartoffel-Pilz; Kraut-Paprika; Spinat-Käse) with size/ingredient choice note
   - Beilagen, Toppings
   - Mochi-Eis, Nachtische
   - Hausgemachte Getränke
   - Vegan / vegetarisch / glutenfrei tags on dishes
4. **Standort & Öffnungszeiten** — Winterstraße 15 address, embedded Google Map link, opening hours block.
5. **Bestellen** — prominent "Online bestellen (Wolt)" button linking to the Wolt page.
6. **Footer** — address, quick links, ordering link.

## Visual design (Warm & cozy café)
- Palette (oklch tokens in `src/styles.css`): deep roasted brown `#3d2b1f`, warm terracotta/copper `#c8794a`, cream `#e8d9c0`, sage green accent `#7a8b5a`.
- Typography via `@fontsource`: a warm display serif for headings (e.g. Fraunces) + a friendly humanist sans for body (e.g. Figtree). Installed with `bun add`, imported in the app entry.
- Rounded corners, soft shadows, generous spacing, food photography feel. Section reveal-on-scroll fade/slide animations (restrained).
- Menu dish imagery: generated warm, appetizing photos of dumplings/bowls saved to `src/assets/`.

## Technical approach
- Copy the uploaded MP4 to the CDN with `lovable-assets` and reference the `.asset.json` URL.
- Build everything in `src/routes/index.tsx` plus small components under `src/components/` (ScrollVideoHero, MenuSection, LocationSection, etc.).
- Scroll scrubbing implemented client-side with a `useRef` video + scroll listener / rAF; guarded for SSR (only runs in the browser).
- Update `src/routes/__root.tsx` head: real German title & description, og tags (no og:image on root).
- Set warm design tokens in `src/styles.css`; no hardcoded color utilities.
- No backend needed — static content, external Wolt link.

## Out of scope (unless you ask)
- No online-ordering/checkout logic (links out to Wolt).
- No reservation system, no CMS, no auth/database.
