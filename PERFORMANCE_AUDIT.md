# Mobile performance audit

Audit date: 2026-08-23. Target: `https://007-a.ru/`, Lighthouse mobile defaults.

## Result

| Metric | Production baseline | Optimized local build |
| --- | ---: | ---: |
| Performance score | 55 | 92 |
| First Contentful Paint | 16.6 s | 2.2 s |
| Largest Contentful Paint | 17.6 s | 3.0 s |
| Total Blocking Time | 0 ms | 10 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 16.6 s | 3.0 s |
| Initial transferred weight | 3,231 KiB | 238 KiB |

INP requires real-user field data and cannot be derived reliably from a single synthetic load. The interaction code was reviewed for long-running animation and input-handler risks.

## Root causes

- The 4.6 MB uncompressed HTML embedded an MP3 and 175 JPEGs as base64. The compressed document still transferred about 2.9 MB and delayed parsing and first paint.
- Three.js, GSAP, ScrollTrigger and Lenis were embedded in the HTML, adding about 732 KB of parser-blocking source that could not be cached separately.
- The mobile hero created a continuous WebGL render loop with many textured planes and multiple animation loops.
- Four 5-second background videos were 4K HEVC files; three were 6-14 MB each. Loading began one viewport before each section.
- All media was coupled to the document, preventing effective independent browser caching.
- Mandatory scroll snap, smooth page jumps and animation did not fully adapt to reduced-motion preferences.

## Changes

- Extracted the MP3 and all JPEGs into cacheable `assets/` files; HTML is now about 22 KB.
- Extracted vendor and application JavaScript. Three.js now loads on demand on desktop only.
- Replaced mobile WebGL with a visually consistent 12-tile CSS fallback and removed touch parallax work.
- Added generated video posters, deferred poster/video assignment, viewport playback, background-tab pause and conservative mobile loading.
- Added 720p H.264 mobile video variants while retaining the original desktop assets.
- Changed audio to `preload="none"`; playback remains user-initiated.
- Strengthened reduced-motion behavior and changed mandatory snapping to proximity for those users.

## Remaining opportunities

- Produce WebM/AV1 versions and remove audio tracks from decorative videos at the encoding stage.
- Serve immutable assets with long-lived cache headers via a CDN if the hosting setup expands beyond GitHub Pages.
- Collect field Core Web Vitals (especially INP) through analytics or Chrome UX Report after deployment.
