import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { getPageMetadata, siteOrigin, sitePages } from "./src/site.js";

const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

// Each public URL receives its own initial HTML metadata. React still handles
// navigation; Vercel serves these files directly so unknown URLs return 404.
export function buildSeo(indexable) {
  let outputDirectory;
  return {
    name: "williams-page-metadata",
    apply: "build",
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const template = await readFile(resolve(outputDirectory, "index.html"), "utf8");
      for (const path of [...Object.keys(sitePages), "/404"]) {
        const metadata = getPageMetadata(path);
        const robots = indexable && metadata.found ? "index, follow" : "noindex, nofollow";
        let html = template
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(metadata.title)}</title>`)
          .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(metadata.description)}" />`)
          .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`);
        if (metadata.canonical) {
          const business = { '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: 'Williams Solutions.Pro', url: siteOrigin, telephone: '+1-705-544-0200', areaServed: { '@type': 'Place', name: 'Kirkland Lake to Temiskaming Shores, Ontario' }, image: `${siteOrigin}/images/logo.png` };
          const social = `<link rel="canonical" href="${escape(metadata.canonical)}" />\n    <meta property="og:type" content="website" />\n    <meta property="og:title" content="${escape(metadata.title)}" />\n    <meta property="og:description" content="${escape(metadata.description)}" />\n    <meta property="og:url" content="${escape(metadata.canonical)}" />\n    <meta property="og:image" content="${siteOrigin}/images/logo.png" />\n    <meta name="twitter:card" content="summary" />\n    <script type="application/ld+json">${JSON.stringify(business).replaceAll('<', '\\u003c')}</script>`;
          html = html.replace("</head>", `    ${social}\n  </head>`);
        }
        const filename = resolve(outputDirectory, path === "/" ? "index.html" : `${path.slice(1)}.html`);
        await mkdir(dirname(filename), { recursive: true });
        await writeFile(filename, html);
      }
      await writeFile(resolve(outputDirectory, "robots.txt"), indexable
        ? `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`
        : "User-agent: *\nDisallow: /\n");
      const urls = indexable ? Object.keys(sitePages).map((path) => `  <url><loc>${siteOrigin}${path}</loc></url>`).join("\n") : "";
      await writeFile(resolve(outputDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    },
  };
}
