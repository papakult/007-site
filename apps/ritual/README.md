# Тихий свет — 007-A

Standalone Next.js static export mounted inside the existing site at
`/directions/sites/ritual/`. The repository's existing custom domain is
`007-a.ru` (see root CNAME); this change does not change DNS or the CNAME.

## Build and publish

```sh
cd apps/ritual
npm ci
npm run lint
npm run build
npm run typecheck
npm run verify
node scripts/stage-export.mjs
```

Commit source and the generated `directions/sites/ritual/` directory together.
GitHub Pages publishes the main branch. Root `.nojekyll` keeps Next.js `_next`
assets available. The existing directory page links to the new experience.

## Experience

- Next.js / React, React Three Fiber / Three.js.
- Parametric calla-lily geometry, curved stems and leaves, candle, moving light.
- GSAP ScrollTrigger coordinates camera and typography with the hero scroll.
- Lenis runs on the same GSAP ticker; native touch scrolling is preserved.
- Reduced motion disables smooth scroll, reveals and idle scene animation.
- Rendering stops when the hero leaves the viewport or the document is hidden.
- A tiny WebGL probe, kept out of the Three.js bundle, loads the scene only when it passes. Software renderers such as SwiftShader never mount it.
- The still-life poster stays visible until the first frames are smooth. Slow frames or a lost WebGL context stop the scene and leave the poster in place.
- Local fonts; compressed WebP poster before WebGL and on context loss.
- Visible content and navigation remain available without JavaScript.

## Form and content

This is a clearly labeled portfolio concept, not an operating funeral service.
There is no invented telephone, address, licence, price or testimonial.
No tracking or third-party form service was added.
The form validates name, telephone, topic, contact time and acknowledgement.
It prepares a local text request with copy/download controls. No data is
transmitted, stored in localStorage or falsely reported as sent.
Connecting real submission needs the business's approved receiving endpoint,
contact details and actual privacy notice. API routes cannot run on Pages.

## Visual asset

`public/still-life.webp`: project-specific AI-generated still-life fallback,
created with the built-in image generator. Prompt: three white calla lilies,
ivory candle, dark bronze vase, charcoal-stone plinth, dark olive background,
arrangement on right with negative space left; natural editorial lighting,
no text or people. 1600 × 900 WebP, 39 KB. The interactive composition is
rendered separately by R3F and uses no external 3D model downloads.

The display and body fonts are reused from the existing repository's coffee
concept. Generated font bundles are self-hosted.
