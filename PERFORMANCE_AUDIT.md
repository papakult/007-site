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

## Mobile viewport regression matrix

The full-screen layout was also verified after the performance changes. Each of the six snap sections must equal one dynamic viewport, start at the exact next viewport boundary, and contain no vertical overflow.

- iPhone 11/12 Pro Max: 414 × 896
- iPhone 12/13/14: 390 × 844
- iPhone 13 mini: 375 × 812
- iPhone 14 Pro Max: 430 × 932
- Samsung Galaxy S8: 360 × 740
- Samsung Galaxy S20/S22: 360 × 800
- Samsung Galaxy A51/A54: 412 × 915
- Samsung Galaxy Z Fold cover: 280 × 653

All tested profiles passed. Mobile navigation now uses native CSS scroll snap only; the competing scripted touch pager was removed. Sections use the dynamic viewport unit, stop at every snap boundary, clip internal overflow, and include safe-area spacing.

An additional iOS first-swipe regression was covered: Safari may collapse its address bar during the first forward swipe and finish against the previous dynamic viewport height. Snap is now enabled immediately on entry, and after native scrolling or a visual-viewport resize settles, the page gently aligns to the nearest freshly calculated section boundary. A deliberately offset first forward stop was verified on every profile above.
