import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { articles, contact, services, waterSystems } from "../src/content.js";

const base = process.env.BASE_URL || "http://127.0.0.1:5178";
const requestPath = "/new-request/";
const expectedEmbed = "https://clienthub.getjobber.com/hubs/c6ab68fa-74c2-4d46-9066-ff2210b88264/public/requests/2248311/embedded_new?source=embedded_inline";
assert.equal(contact.requestPath, requestPath);
assert.equal(contact.requestEmbedUrl, expectedEmbed, "Embed belongs to the original Williams Jobber form");
await mkdir(".cache", { recursive: true });

// This fixture verifies our page's integration independently of Jobber's
// Cloudflare challenge. It does not claim to verify the live external form.
const fixture = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Request integration fixture</title><style>body{margin:24px;font:16px system-ui;line-height:1.6;color:#223746}p{max-width:440px}label{display:block;margin-top:24px}input{box-sizing:border-box;width:100%;max-width:440px;padding:12px;border:1px solid #8b9aa4}</style></head><body><h2>Embedded request integration fixture</h2><p>This local verification fixture contains no live customer data and cannot submit a request.</p><label>Verification field<input name="verification" autocomplete="off"></label></body></html>`;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.route(expectedEmbed, (route) => route.fulfill({ status: 200, contentType: "text/html", body: fixture }));

async function visit(route = "/") {
  const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, `${route} loads directly`);
  await expect(page.locator("main h1")).toBeVisible();
}
async function requestLinks(selector, description) {
  const links = page.locator(selector);
  assert.ok(await links.count(), `${description} is present`);
  for (const link of await links.all()) {
    await expect(link, description).toHaveAttribute("href", requestPath);
    assert.equal(await link.getAttribute("target"), null, `${description} stays in the current tab`);
  }
}
async function widget() {
  const iframe = page.locator("main iframe");
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute("src", expectedEmbed);
  await expect(iframe).toHaveAttribute("title", "Williams Solutions service request form");
  await expect(iframe).toBeVisible();
  await expect(page.frameLocator("main iframe").getByRole("heading", { name: "Embedded request integration fixture" })).toBeVisible();
  await expect(page.locator(".request-loading")).toHaveCount(0);
  assert.equal(page.frames().filter((frame) => frame.url() === expectedEmbed).length, 1, "Only one request widget is mounted");
  return page.frames().find((frame) => frame.url() === expectedEmbed);
}

try {
  const routes = ["/", "/about", "/contact", "/insights", ...services.map((service) => `/${service.slug}`), ...waterSystems.map((system) => `/water-treatment/${system.slug}`), ...articles.map((article) => `/insights/${article.slug}`)];
  for (const route of routes) {
    await visit(route);
    await requestLinks(".nav-cta", `${route}: header request CTA`);
    await requestLinks(`footer a[href="${requestPath}"]`, `${route}: footer request CTA`);
    await expect(page.locator('footer a[href="/contact"]')).toContainText("Phone & email");
    if (await page.locator(".contact-band").count()) await requestLinks(".contact-band .button", `${route}: contact-band request CTA`);
    if (route === "/") {
      await requestLinks(".hero-actions .button", "Homepage hero CTA");
      await requestLinks(".service-card-help", "Homepage service-help tile");
    }
    if (services.some((service) => route === `/${service.slug}`)) await requestLinks(".detail-copy .button", `${route}: service hero CTA`);
    if (waterSystems.some((system) => route === `/water-treatment/${system.slug}`)) {
      await requestLinks(".water-detail .button", `${route}: water-system hero CTA`);
      await requestLinks("section.narrow .button", `${route}: water-system details CTA`);
    }
    if (route === "/snow-removal") await requestLinks(".snow-pricing .button", "Snow pricing CTA");
    if (route === "/water-treatment") await requestLinks(".maintenance-action .button", "April maintenance CTA");
    if (route.startsWith("/insights/")) await requestLinks(".article-end .button", `${route}: article request CTA`);
    // Phone/email links keep their exact destinations throughout the site.
    const directLinks = await page.locator('a[href^="tel:"], a[href^="mailto:"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    assert.ok(directLinks.every((href) => ["tel:+17055440200", "mailto:info@williamssolutions.pro"].includes(href)), `${route} preserves phone and email destinations`);
    assert.equal(await page.locator('a[href*="getjobber.com"]').count(), 0, `${route} request CTAs use the internal form page`);
    if (route === "/contact") assert.deepEqual(await page.locator(".contact-options > a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))), ["tel:+17055440200", "mailto:info@williamssolutions.pro", requestPath]);
  }

  for (const path of ["/new-request", "/new-request/"]) {
    await visit(path);
    await widget();
    await expect(page.locator(".request-phone")).toHaveAttribute("href", "tel:+17055440200");
    assert.deepEqual(await page.locator('.request-page a[href*="getjobber.com"]').evaluateAll((links) => links.map((link) => link.getAttribute("href"))), [contact.requestUrl, contact.requestUrl], "Both fallback links retain the original public request URL");
  }

  const frame = await widget();
  await frame.evaluate(() => parent.postMessage("1780px", "*"));
  await expect(page.locator("main iframe")).toHaveCSS("height", "1780px");
  for (const invalid of ["199px", "20001px", "NaN", "900px; color: red", { height: 900 }]) {
    await frame.evaluate((data) => parent.postMessage(data, "*"), invalid);
    await page.waitForTimeout(50);
    await expect(page.locator("main iframe")).toHaveCSS("height", "1780px");
  }
  await page.evaluate((origin) => {
    const source = document.querySelector("main iframe").contentWindow;
    window.dispatchEvent(new MessageEvent("message", { data: "999px", origin: "https://untrusted.example", source }));
    window.dispatchEvent(new MessageEvent("message", { data: "888px", origin, source: window }));
  }, new URL(expectedEmbed).origin);
  await page.waitForTimeout(50);
  await expect(page.locator("main iframe")).toHaveCSS("height", "1780px");
  await frame.evaluate(() => parent.postMessage("1810.4px", "*"));
  await expect(page.locator("main iframe")).toHaveCSS("height", "1811px");

  await visit("/");
  for (let index = 0; index < 3; index += 1) {
    await page.locator(".hero-actions .button").click();
    await expect(page).toHaveURL(`${base}${requestPath}`);
    await widget();
    await page.goBack();
    await expect(page.locator(".hero-heading")).toBeVisible();
    await expect(page.locator("main iframe")).toHaveCount(0);
    assert.equal(page.frames().filter((embedded) => embedded.url() === expectedEmbed).length, 0, "Leaving request page removes the widget frame");
    await page.goForward();
    const remounted = await widget();
    await remounted.evaluate(() => parent.postMessage("1700px", "*"));
    await expect(page.locator("main iframe")).toHaveCSS("height", "1700px");
    await page.locator(".brand-original").click();
    await expect(page.locator(".hero-heading")).toBeVisible();
    await expect(page.locator("main iframe")).toHaveCount(0);
  }

  for (const width of [1440, 1024, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await visit(requestPath);
    const embedded = await widget();
    await embedded.evaluate(() => parent.postMessage("650px", "*"));
    await expect(page.locator("main iframe")).toHaveCSS("height", "650px");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Request page fits ${width}px`);
    const bounds = await page.locator("main iframe").boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width, `Embedded form fits ${width}px`);
    await page.screenshot({ path: `.cache/verified-request-fixture-${width}.png`, fullPage: true });
  }

  // A delayed external response offers a useful fallback, then recovers when
  // the same iframe eventually loads. No real request is submitted here.
  const slowPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  slowPage.on("pageerror", (error) => errors.push(error.message));
  let pendingRequest;
  await slowPage.route(expectedEmbed, (route) => { pendingRequest = route; });
  const clockTime = new Date("2026-10-06T16:00:00Z");
  await slowPage.clock.install({ time: clockTime });
  await slowPage.clock.pauseAt(new Date(clockTime.getTime() + 1000));
  await slowPage.goto(`${base}${requestPath}`, { waitUntil: "domcontentloaded" });
  await expect(slowPage.getByRole("status")).toContainText("Loading your request form");
  await expect(slowPage.locator("main iframe")).toHaveCSS("height", "600px");
  await slowPage.clock.fastForward(15000);
  await expect(slowPage.getByRole("status")).toContainText("taking longer to load");
  await expect(slowPage.getByRole("link", { name: "Open the request form", exact: true })).toHaveAttribute("href", contact.requestUrl);
  await expect(slowPage.locator("main iframe")).toHaveCSS("height", "0px");
  assert.ok(pendingRequest, "The delayed iframe request was intercepted");
  await pendingRequest.fulfill({ status: 200, contentType: "text/html", body: fixture });
  await expect(slowPage.locator("main iframe")).toHaveCSS("height", "2200px");
  await expect(slowPage.locator(".request-loading")).toHaveCount(0);
  await expect(slowPage.locator("main iframe")).toHaveCount(1);
  await slowPage.close();
  assert.deepEqual(errors, [], "No request-page runtime errors");
  console.log(`PASS: request CTAs across ${routes.length} routes, unchanged phone/email, both request paths, fallback URLs, trusted iframe resize, repeated back/forward navigation without duplicate widgets, slow-load fallback/recovery, and 1440/1024/390/320px layouts. Jobber iframe responses were mocked; live external form availability must be verified separately in a regular browser. No form data entered or submitted.`);
} finally {
  await browser.close();
}
