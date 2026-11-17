# ОПОРА — construction website concept

Next.js 16 + React 19 static export. GSAP ScrollTrigger, Lenis, React Three Fiber.
Production path: https://007-a.ru/directions/sites/construction/

`npm ci`; `npm run lint`; `npm run typecheck`; `npm run build`; `npm run verify`; `node scripts/stage-export.mjs`.

The generated export is checked into the existing GitHub Pages site. Preserve the full repository tree during publication, including CNAME, root index.html, assets and the ritual project. No Yandex Metrika scripts are added.

Runway generated the four architectural concept images and the five-second hero video. Provenance is recorded in public/PROVENANCE.json. These are concept designs, not completed company projects. No contractor credentials, years in business or guarantees have been fabricated.

The form validates name, phone and object type and produces a downloadable/copyable brief locally. It does not send personal data or claim that a request was submitted. A real lead destination and business details are required before turning this portfolio concept into a live construction company's lead form. WebPage structured data is used because no real construction business details have been supplied.

Hero motion can be paused. Reduced-motion and save-data preferences are respected. Desktop 3D loads near its section; mobile uses a static visual. Native dialogs support Escape and focus management. Assets are WebP/H.264, pre-rendered HTML and hashed static JS/CSS are delivered through GitHub Pages CDN.
