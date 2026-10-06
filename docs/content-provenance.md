# Source provenance and isolation

Existing site: https://williamssolutions.pro/
Read-only local export: `../WilliamsWP/`, reference revision `5281a39985df2d2f99c3e9156cd16e6ca6217358`.

| Preview asset | Original file in WilliamsWP/wp-content/uploads |
| --- | --- |
| logo.png | 2025/05/logo-WIlliams-Pro.png |
| mark.png | 2025/04/logo-blue.png |
| mark-white.png | 2025/04/logo-white-300x300-1.png |
| plumbing.webp | 2025/04/Plumbing-hero.png |
| septic.webp | 2025/09/IMG_1751-scaled.jpg |
| water.webp | 2025/04/water-hero-.jpg |
| excavation.webp | 2025/09/IMG_0146-scaled.jpeg |
| logging.webp | 2025/04/Logging-Footer-Image.jpg |

WebP copies are resized for the website. Originals were not edited. No stock image is presented as a new Williams completed project. The well section uses an explicitly illustrative cutaway, not a septic photo labelled as a well.

The seven service descriptions are adapted from existing service pages and the owner's new well and snow-removal brief. Existing contact details and the Jobber destination were checked against the public website. No certification number, review score, customer count, price, availability promise, or response-time guarantee has been invented.

The existing website, deployment project, DNS and WordPress installation were not changed. The new app owns its own Vercel project and ignored `.vercel` link.

Workspace issue-sync note: `bd dolt pull` failed with `could not map primary key column issue_id` before implementation. No issue database/schema edits were made in this task.

The final colour direction follows the original logo blue, sampled as `#3c8bca`. Navigation uses the original full logo lockup. Darker blue buttons preserve text contrast; the 3D excavator retains its natural equipment colour.

OOWA membership recognition (2026-09-24): `public/images/oowa-logo.png` is an intact copy of the current header logo on the [Ontario Onsite Wastewater Association website](https://www.oowa.org/), downloaded from [the official PNG asset](https://www.oowa.org/wp-content/uploads/2024/03/Untitled-design-11.png). Dimensions: 900 × 526 pixels; 190,883 bytes; SHA-256: `9a9fb0350f85da589be1bbc8d20f63aa24d984998f6433648a1cda4e570d1a9a`. The Ontario green/blue logo was visually inspected. The intact PNG retains the official source’s static Canva/XMP creator-attribution metadata; it contains no executable tracking, EXIF location, membership identifier or private email content. No private email, tracking, renewal or payment URL was used. Membership recognition follows the owner's supplied evidence and authorization; it does not claim OOWA certification or endorsement. Public usage guidance: OOWA's [2019 newsletter](https://www.oowa.org/wp-content/uploads/2020/05/R_Vol20_Iss2.pdf) encourages members to display the logo to promote membership and offers high-quality artwork on request; its currently linked [Member Code of Conduct, section 3.1](https://www.oowa.org/wp-content/uploads/2020/05/Member-Code-of-Conduct_V.2017-06-19.pdf) requires proper authorization for logo/name use. No public technical brand guide was found in the reviewed pages.

## September 24 layout revision: additional original assets

- `plumbing-detail.webp`: `WilliamsWP/wp-content/uploads/2025/04/Gallery-Plumbing-5.png`. Resized WebP copy; original unchanged.
- `treatment-installation.webp`: `WilliamsWP/wp-content/uploads/2025/04/Plumbing-Setup.jpg`. Resized WebP copy; original unchanged.
- `septic-detail.webp`: `WilliamsWP/wp-content/uploads/2025/09/IMG_1728.jpg`. Resized WebP copy; original unchanged.
- `excavator-detail.webp`: `WilliamsWP/wp-content/uploads/2025/09/IMG_0114.jpeg`. Resized WebP copy; original unchanged.
- `logging-detail.webp`: `WilliamsWP/wp-content/uploads/2025/04/Logging-spacer-large.jpg`. Resized WebP copy; original unchanged.
- `water-softener.webp`: `WilliamsWP/wp-content/uploads/2025/08/Softers_Softners-Hero-1.png`. Resized WebP copy; original unchanged.
- `hybrid-filter.webp`: `WilliamsWP/wp-content/uploads/2025/09/Hybrid-Filter_Softners-Hero-copy.png`. Resized WebP copy; original unchanged.
- `reverse-osmosis.webp`: `WilliamsWP/wp-content/uploads/2025/09/Osmosis_Osmosis-Hero.png`. Resized WebP copy; original unchanged.
- `whole-home-uv.webp`: `WilliamsWP/wp-content/uploads/2025/09/UV_UV-Hero.png`. Resized WebP copy; original unchanged.
- `tannin-filter.webp`: `WilliamsWP/wp-content/uploads/2025/09/Tannins_Tannins-Hero.png`. Resized WebP copy; original unchanged.

October 1, 2026 owner-supplied updates: the public contact number is now `705-544-0200` (`tel:+17055440200`). Snow-removal rates, including the owner’s follow-up correction, are $219 per grader hour, $40 per small-driveway clearing, $60 per double-driveway clearing, $60 per sanding request as a separate charge, about $1,000 per month for a small-driveway plan, and $80 per triaxle load to haul snow away. The monthly price replaces the earlier seasonal price; sanding is not included in the monthly plan. No tax treatment, payment terms or further service guarantees were supplied or added. The annual water treatment maintenance program runs each April and includes a water test; inspection of treatment equipment and the pressure tank plus well pump performance testing; filter, UV lamp and sleeve changes; and delivery of required system product and salt for the year. These updates come directly from the owner's instructions and supersede the original website's phone number and earlier general service descriptions.

Homepage scheduling: the featured service uses the current date in `America/Toronto`. September–February promotes snow removal, March–April promotes the April water maintenance program, June–July promotes septic care, and May/August feature wells. Wells remain on the homepage below the local-work section whenever another service is featured. These adjacent-month windows are editorial defaults around the owner's seasonal priorities and can be changed centrally in `src/seasonal.js`.

The landscape opens in the calendar season (March–May spring, June–August summer, September–November fall, December–February winter), then cycles through all four seasons every eight seconds. Choosing a season pauses the cycle; the play/pause control resumes or stops it. Cycling pauses while the hero is offscreen or the document is hidden, and starts paused for reduced-motion preferences. Scene changes do not change the calendar-based service promotion.


October 6, 2026 request-form integration: the owner identified `https://williamssolutions.pro/new-request/` as the form to preserve for all request CTAs. The live browser iframe resolved to `https://clienthub.getjobber.com/hubs/c6ab68fa-74c2-4d46-9066-ff2210b88264/public/requests/2248311/embedded_new` with `source=embedded_inline`. The existing standalone link also resolved in the browser to the same hub and form `2248311` (`/new?source=social_media`). Contact information, service choices, availability, image upload, consent controls and Submit were visually verified without entering or submitting data. The React `/new-request/` route now hosts that original Jobber form, with source/origin-checked resizing and an always-available direct link. Explicit phone/email links remain phone/email actions.
