import { articles, services, waterSystems } from "./content.js";

export const siteOrigin = "https://williamssolutions.pro";
const brand = "Williams Solutions.Pro";
const page = (title, description) => ({ title: `${title} | ${brand}`, description });

export const sitePages = {
  "/": {
    title: `${brand} — Built for life up north.`,
    description: "Local plumbing, wells, septic, water treatment, excavation, logging and snow removal. Born and raised in Northern Ontario, from Kirkland Lake to Temiskaming Shores.",
  },
  "/about": page("About Williams", "Born and raised in Northern Ontario. Meet the local Williams team serving homes, cottages and businesses from Kirkland Lake to Temiskaming Shores."),
  "/contact": page("Get in touch", "Call Williams Solutions.Pro at 705-544-0200, email our local team or request service for your Northern Ontario property."),
  "/new-request": page("Request service", "Tell Williams Solutions.Pro what your property needs. Request plumbing, well, septic, water treatment, excavation, logging or snow removal service."),
  "/insights": page("Good to know", "Practical guides from Williams Solutions.Pro on caring for your home's plumbing, septic system and water treatment equipment."),
  ...Object.fromEntries(services.map((item) => [`/${item.slug}`, page(item.shortTitle, item.summary)])),
  ...Object.fromEntries(waterSystems.map((item) => [`/water-treatment/${item.slug}`, page(item.title, item.summary)])),
  ...Object.fromEntries(articles.map((item) => [`/insights/${item.slug}`, page(item.title, item.intro)])),
};

export function getPageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const metadata = sitePages[path];
  return metadata
    ? { ...metadata, canonical: `${siteOrigin}${path}`, found: true }
    : { ...page("Page not found", "That page isn't here. Explore Williams Solutions.Pro services or contact our local Northern Ontario team."), found: false };
}
