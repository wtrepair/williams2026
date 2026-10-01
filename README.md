# Williams Solutions.Pro — Vercel preview

Preview: https://williams-solutions-preview.vercel.app/

Independent React + Vite redesign, built alongside the existing Williams WordPress/Divi site. **Never deploy this project over `williams-wp`, modify its custom domains, or run the legacy static-promotion script.**

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

## Preview deployment

Vercel team: `paul-peanuts-projects`. **New project:** `williams-solutions-preview`. Production site `williams-wp` remains separate.

```sh
npx vercel link --yes --scope paul-peanuts-projects --project williams-solutions-preview
npx vercel deploy --yes --target preview --scope paul-peanuts-projects
```

This preview sends `X-Robots-Tag: noindex, nofollow` and blocks crawlers in `robots.txt`. No custom domain is assigned. Contact offers three direct links: the owner's updated number, 705-544-0200; the existing email address; and the existing Jobber request form. No new mail backend or live submissions were added.

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
