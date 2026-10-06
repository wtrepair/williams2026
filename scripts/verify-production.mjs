import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { articles, contact, services, waterSystems } from "../src/content.js";

// Read-only launch audit. Never fills fields or submits the external request form.
const base = process.env.BASE_URL?.replace(/\/$/, "");
assert.ok(base, "Set BASE_URL to the production candidate to audit");
const canonicalOrigin = process.env.CANONICAL_ORIGIN || "https://williamssolutions.pro";
const routes = ["/", "/about", "/contact", "/new-request", "/insights", ...services.map(({ slug }) => `/${slug}`), ...waterSystems.map(({ slug }) => `/water-treatment/${slug}`), ...articles.map(({ slug }) => `/insights/${slug}`)];
const report = { base, canonicalOrigin, at: new Date().toISOString(), passed: [], failed: [], observations: [] };
const rawPages = new Map();
const normalizePath = (path) => path.replace(/\/$/, "") || "/";
const sameCanonical = (actual, route) => {
  const parsed = new URL(actual);
  assert.equal(parsed.origin, canonicalOrigin);
  assert.equal(normalizePath(parsed.pathname), normalizePath(route));
  assert.equal(parsed.search, "");
};
async function check(name, callback) {
  try { await callback(); report.passed.push(name); }
  catch (error) { report.failed.push({ name, error: error.message }); }
}
async function get(path, options = {}) {
  return fetch(new URL(path, `${base}/`), { signal: AbortSignal.timeout(20000), ...options });
}
await mkdir(".cache", { recursive: true });

await Promise.all(routes.map((route) => check(`HTTP document ${route}`, async () => {
  const response = await get(route);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /text\/html/i);
  assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /noindex|nofollow/i);
  const html = await response.text();
  assert.match(html, /<div[^>]+id=["']root["']/);
  assert.doesNotMatch(html, /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*(?:noindex|nofollow)/i);
  rawPages.set(route, html);
})));

await check("Crawlable robots.txt", async () => {
  const response = await get("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /text\/plain/i);
  const text = await response.text();
  assert.match(text, /User-agent:\s*\*/i);
  assert.doesNotMatch(text, /^Disallow:\s*\/\s*$/im);
  assert.ok(text.includes(`${canonicalOrigin}/sitemap.xml`));
});
await check("Sitemap lists canonical core pages", async () => {
  const response = await get("/sitemap.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /xml/i);
  const xml = await response.text();
  assert.match(xml, /<urlset\b/);
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  assert.ok(locations.length > 0);
  assert.ok(locations.every(({ origin }) => origin === canonicalOrigin));
  for (const route of routes) assert.ok(locations.some(({ pathname }) => normalizePath(pathname) === normalizePath(route)), `${route} is in sitemap`);
});
await check("Unknown route returns a real 404", async () => {
  const response = await get("/page-that-does-not-exist-production-audit");
  assert.equal(response.status, 404);
});

const config = JSON.parse(await readFile("vercel.json", "utf8"));
for (const redirect of config.redirects || []) {
  if (redirect.has || /[:*()]/.test(redirect.source)) {
    report.observations.push(`Pattern or host redirect needs separate check: ${redirect.source}`);
    continue;
  }
  await check(`Permanent legacy redirect ${redirect.source}`, async () => {
    const response = await get(redirect.source, { redirect: "manual" });
    assert.ok([301, 308].includes(response.status), `Expected permanent redirect, received ${response.status}`);
    const actual = new URL(response.headers.get("location"), base);
    const expected = new URL(redirect.destination, base);
    assert.equal(actual.href, expected.href);
  });
}

async function findPdfs(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) output.push(...await findPdfs(path));
    else if (entry.name.toLowerCase().endsWith(".pdf")) output.push(path);
  }
  return output;
}
for (const file of await findPdfs("public")) await check(`PDF ${file}`, async () => {
  const response = await get(file.slice("public".length));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /application\/pdf/i);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  assert.equal(bytes.length, (await readFile(file)).length);
});

const browser = await chromium.launch({ channel: "chrome", headless: true });
const pageErrors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  page.on("pageerror", (error) => pageErrors.push({ route: page.url(), message: error.message, stack: error.stack }));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) await check(`Browser ${width}px ${route}`, async () => {
      const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      assert.equal(response.status(), 200);
      await page.locator("main h1").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.doesNotMatch(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex|nofollow/i);
      sameCanonical(await page.locator('link[rel="canonical"]').getAttribute("href"), route);
      const structured = await page.locator('script[type="application/ld+json"]').allTextContents();
      structured.forEach((text) => JSON.parse(text));
      const broken = await page.locator("img").evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src));
      assert.deepEqual(broken, []);
      assert.equal(await page.locator(".nav-cta").getAttribute("href"), contact.requestPath);
      const direct = await page.locator('a[href^="tel:"],a[href^="mailto:"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      assert.ok(direct.every((href) => [contact.tel, `mailto:${contact.email}`].includes(href)));
      if (route === "/new-request") {
        assert.equal(await page.locator("main iframe").getAttribute("src"), contact.requestEmbedUrl);
        const fallbacks = await page.locator('.request-page a[href*="getjobber.com"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
        assert.ok(fallbacks.length >= 2 && fallbacks.every((href) => href === contact.requestUrl));
      }
      if (["/", "/contact", "/new-request", "/wells"].includes(route)) await page.screenshot({ path: `.cache/production-${route.replaceAll("/", "") || "home"}-${width}.png` });
    });
  }
  await check("No page JavaScript exceptions", async () => assert.deepEqual(pageErrors, []));
  for (const [route, html] of rawPages) await check(`Served HTML metadata ${route}`, async () => {
    const metadata = await page.evaluate((markup) => {
      const doc = new DOMParser().parseFromString(markup, "text/html");
      return { title: doc.title, canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"), description: doc.querySelector('meta[name="description"]')?.getAttribute("content") };
    }, html);
    assert.ok(metadata.title && metadata.description, "Page has a title and description before JavaScript");
    sameCanonical(metadata.canonical, route);
  });
} finally { await browser.close(); }

await writeFile(".cache/production-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ passed: report.passed.length, failed: report.failed, observations: report.observations }, null, 2));
if (report.failed.length) process.exitCode = 1;
