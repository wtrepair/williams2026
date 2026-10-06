# Williams Solutions.Pro

Production: https://williamssolutions.pro/

Vercel project alias: https://williams-solutions-preview.vercel.app/

Independent React + Vite website. The owner authorized launch on October 6, 2026. The original WordPress/Divi export remains in the separate `WilliamsWP` repository and `williams-wp` Vercel project for rollback. Do not overwrite that project or run its legacy static-promotion script. See `docs/production-launch.md` for domain and rollback details.

Repository: https://github.com/wtrepair/williams2026

Registered in the KissTech workspace under `vercell/williams2026`. Vercel is connected to this repository; pushes to `main` deploy production, while other branches produce previews. The original `vercell/WilliamsWP` repository remains separately registered.

## Run locally

```sh
npm ci
npm run dev -- --port 5178
npm run build
```

Uses React, React Router, Three.js, Lucide, and locally hosted DM Sans / Barlow Condensed fonts. The 3D scene is created from geometry; it does not download models or textures. Animation pauses out of view and honours reduced-motion preferences. Devices without WebGL receive an SVG fallback.

## Browser verification

With the dev server on port 5178 and Chrome installed:

```sh
npm run test:browser
```

Set `BASE_URL` to verify a deployment instead. Screenshots and temporary results belong in ignored `.cache/`.

## Deployment

Vercel team: `paul-peanuts-projects`. Project: `williams-solutions-preview` (the existing project name is retained). Production domains: `williamssolutions.pro` and `www.williamssolutions.pro`, with www redirecting to the apex.

```sh
npx vercel link --yes --scope paul-peanuts-projects --project williams-solutions-preview
npx vercel deploy --yes --target preview --scope paul-peanuts-projects
# Release an approved build to the real domain:
npx vercel deploy --yes --prod --scope paul-peanuts-projects
```

Production builds (`VERCEL_ENV=production`) publish route-specific HTML metadata, canonical URLs, robots.txt and sitemap.xml. Preview builds retain noindex metadata and disallow crawling; the project alias follows the current production deployment. For a local production build, use `SITE_ENV=production npm run build`. Vercel serves generated route files with clean URLs; unknown paths return HTTP 404. Dated article and archive URLs redirect permanently. Contact offers three direct links: the owner's updated number, 705-544-0200; the existing email address; and `/new-request/`. Every service/request CTA opens `/new-request/`, which embeds the same Jobber form as the existing site. The original standalone Jobber link remains available if embedding is blocked. No new mail backend or test submissions were added.

## Content

- Seven services: plumbing, septic, water treatment, wells, excavation/aggregate, logging, and snow removal.
- Five water-treatment detail pages and three homeowner guides.
- Existing public service, water treatment and dated article URLs resolve in the new app.
- Well-service capability statements are based on the owner's supplied brief. “Rug wells” was interpreted as “dug wells.” Snow prices and the annual April water maintenance program are owner-supplied; no response times or contract terms were added.
- Source content: `src/content.js`. Layout/routes: `src/main.jsx`. Styles: `src/styles.css`.
- Seasonal promotion calendar: `src/seasonal.js` (Northern Ontario time). Snow leads September–February, April maintenance leads March–April, septic leads June–July, and wells lead May/August. The well feature remains lower on the homepage during other promotions.
- The landscape starts in the calendar season, then cycles every eight seconds, with four manual season buttons and a pause/play control. Reduced-motion visitors start with a still scene. The visual cycle does not alter the service promotion.
- Original photos and logos were copied from the existing local Divi export; the source repository was read-only. See `docs/content-provenance.md`.

The service layouts pair four capabilities in two columns, with specific original project imagery and illustrated FAQ panels. OOWA membership recognition appears on the septic page, using the official association logo and a public association link. Layout direction and image mappings are in `src/presentation.js` and `src/editorial.css`.

## Request form

`src/components/RequestPage.jsx` embeds Williams’ verified Jobber form `2248311` in hub `c6ab68fa-74c2-4d46-9066-ff2210b88264`. This is the iframe observed on the live `/new-request/` page on October 6, 2026. Form fields, uploads, consent and submission stay inside Jobber. Frame height messages are accepted only from that iframe and Jobber origin; the message listener is removed on unmount. `contact.requestPath`, `requestEmbedUrl`, and `requestUrl` centralize the website route, inline form, and direct fallback.

Run `node scripts/verify-requests.mjs` for CTA routing, frame sizing, fallback and lifecycle checks. It mocks the external iframe and never submits a request; verify the real form separately in a normal browser because Jobber may challenge automated/headless sessions.

## Production verification

```sh
BASE_URL=https://williamssolutions.pro node scripts/verify-production.mjs
```

This read-only audit covers core pages on desktop/mobile, HTTP status, canonical metadata, indexing, redirects, the preserved PDF, contact links and the form embed targets. Check the original Jobber form visually in a normal browser without submitting a test request.
