# Production launch — October 6, 2026

The owner authorized switching the actual domain to the redesigned site. The deployment keeps the legacy repository and Vercel project intact.

## New site

- Local independent repository: `vercell/williams2026`, registered in the root `.mrconfig.vercell` inventory.
- GitHub: `git@github.com:wtrepair/williams2026.git`. Both `main` and the working branch were pushed; Vercel is connected to this repository with production branch `main`.
- Workspace registration commit: `893c048` in `PineappleCare/kisstech`.
- Launch source commit: `84b44b5`.
- Vercel scope: `paul-peanuts-projects` (`team_4UNYfE811n3ogGCsTFHvMhZa`).
- Project: `williams-solutions-preview` (`prj_eC2yjFVpZWveZxQucll9kCE9ebE6`).
- Launch deployment: `dpl_EwGbzwhVaePTyrUXrXfJhWbTVh71`.
- Deployment URL: https://williams-solutions-preview-65bq4f6gi-paul-peanuts-projects.vercel.app
- Live apex: https://williamssolutions.pro
- `www.williamssolutions.pro` redirects to `williamssolutions.pro` with status 308, preserving paths and queries.
- Production indexing is enabled by Vercel's production build environment. Previews remain excluded using robots metadata and robots.txt.

## Preserved rollback target

- Independent source repository: `vercell/WilliamsWP`, `git@github.com:wtrepair/WilliamsWP.git`.
- Source commit: `5281a39985df2d2f99c3e9156cd16e6ca6217358`.
- Vercel project: `williams-wp` (`prj_umCeQYovLgqRLjdEmVVUxVAWAhOx`).
- Previous production deployment: `dpl_CDGs1mQ2o4j4dwhNTK15wuD7nphG`.
- Previous deployment URL: https://williams-nq55wouo8-paul-peanuts-projects.vercel.app
- Retained alias: https://williams-wp.vercel.app

To roll back a failed release, use Vercel's **move project domain** API to return `williamssolutions.pro` and its www redirect to project `prj_umCeQYovLgqRLjdEmVVUxVAWAhOx`. This is a project move, not the CLI command that transfers domain ownership between teams. Check current assignments first; move each domain only if still assigned to the new project. Preserve the www redirect (308 to apex), then verify the old production deployment is serving both addresses. No source restore or WordPress write is required.

The API endpoint is `POST /v1/projects/{currentProjectId}/domains/{domain}/move` with destination `projectId` in the JSON body; set www's `redirect` to `williamssolutions.pro` and `redirectStatusCode` to 308. Use the authenticated Vercel CLI `api` command and scope above. Review the complete response and verify public HTTPS afterward.

## DNS before launch

- Cloudflare nameservers: `cullen.ns.cloudflare.com`, `harlee.ns.cloudflare.com`.
- Apex A records: `64.29.17.67`, `216.198.79.67` (TTL 300).
- www CNAME: `701b06e2438f6dd2.vercel-dns-017.com` (TTL 600).
- Both already point to Vercel; project reassignment should require no DNS edits.
- `pricing.williamssolutions.pro` belongs to the separate `pricing-williams` project. Leave it and all mail records unchanged.

## Customer request flow

All service/request CTAs link to `/new-request/`. That route embeds the original Jobber form 2248311 with a direct fallback link. Contact phone is 705-544-0200 and email is info@williamssolutions.pro. Verification must not submit a customer request or opt into consent checkboxes.

## URL migration

Permanent redirects preserve the three old dated article addresses, author/category archives, and `/blog`. Home-page hash links for about, services, blog and projects route to the appropriate new sections. The original septic PDF remains byte-for-byte available at its `/wp-content/uploads/2025/04/` path. Unknown routes return a real 404 and carry noindex metadata.

## Completed cutover

At 18:14 UTC on October 6, the apex domain was moved through the Vercel project-domain API. Vercel moved its www redirect alongside it; both now belong to the new project and are verified. No DNS records were changed. HTTP redirects to HTTPS; www redirects to the apex while preserving path and query. The old project and its alias still serve the original site.

The production alias passed all 89 checks before cutover. The real domain was checked afterward, including rendering the original Jobber iframe in a normal browser without filling or submitting it. The iframe displayed the original service fields and reported its expected height.
