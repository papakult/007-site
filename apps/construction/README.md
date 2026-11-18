# ОПОРА — construction website concept

Next.js 16 + React 19 static export. GSAP ScrollTrigger, Lenis, React Three Fiber.
Production path: https://007-a.ru/directions/sites/construction/

`npm ci`; `npm run lint`; `npm run typecheck`; `npm run build`; `npm run verify`; `node scripts/stage-export.mjs`.

The generated export is checked into the existing GitHub Pages site. Preserve the full repository tree during publication, including CNAME, root index.html, assets and the ritual project. No Yandex Metrika scripts are added.

Runway generated the four architectural concept images and the five-second hero video. Provenance is recorded in public/PROVENANCE.json. These are concept designs, not completed company projects. No contractor credentials, years in business or guarantees have been fabricated.

A read-only checklist helps readers prepare for an architecture consultation and links back to the portfolio. WebPage structured data describes this studio concept.

Hero motion can be paused. Reduced-motion and save-data preferences are respected. Desktop 3D loads near its section; mobile uses a static visual. Native dialogs support Escape and focus management. Assets are WebP/H.264, pre-rendered HTML and hashed static JS/CSS are delivered through GitHub Pages CDN.
