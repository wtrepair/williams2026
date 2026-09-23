import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { services, waterSystems, articles, contact } from "../src/content.js";

const base = process.env.BASE_URL || "http://127.0.0.1:5178";
await mkdir(".cache", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const routes = [
  "/",
  "/about",
  "/contact",
  "/new-request",
  "/insights",
  ...services.map((s) => `/${s.slug}`),
  ...waterSystems.map((s) => `/water-treatment/${s.slug}`),
  ...articles.map((a) => `/insights/${a.slug}`),
];
try {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(`${base}${route}`, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, `${route} responds successfully`);
      assert.equal(
        await page.locator("h1").count(),
        1,
        `${route} has one main heading`,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} fits ${width}px`,
      );
      assert.match(
        await page.locator('meta[name="robots"]').getAttribute("content"),
        /noindex/,
        "Preview remains excluded from search",
      );
      assert.equal(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.some((img) => img.complete && img.naturalWidth === 0),
          ),
        false,
        `${route} has no broken images`,
      );
    }
  }
  await page.goto(base, { waitUntil: "networkidle" });
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "Our services",
    "Mobile keyboard enters expanded menu",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await toggle.evaluate((el) => el === document.activeElement),
    true,
    "Escape restores toggle focus",
  );
  await page.getByRole("button", { name: "Snow season" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Snow season" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.screenshot({
    path: ".cache/verified-mobile-winter.png",
    fullPage: false,
  });
  await page.goto(`${base}/wells`, { waitUntil: "networkidle" });
  await page
    .getByText("Do you need a drilling rig to replace my pump?", {
      exact: true,
    })
    .click();
  assert.equal(await page.locator("details[open]").count(), 1);
  await page.goto(`${base}/contact?service=wells`, {
    waitUntil: "networkidle",
  });
  assert.equal(await page.locator("#service-select").inputValue(), "wells");
  assert.equal(
    await page
      .getByRole("link", { name: "Use our online request form" })
      .getAttribute("href"),
    contact.requestUrl,
  );
  assert.match(
    await page
      .getByRole("link", { name: /Email our team/ })
      .getAttribute("href"),
    /^mailto:info@williamssolutions\.pro\?subject=/,
  );
  await page.selectOption("#service-select", "snow-removal");
  assert.match(
    decodeURIComponent(
      await page
        .getByRole("link", { name: /Email our team/ })
        .getAttribute("href"),
    ),
    /snow removal/i,
  );
  await page.goto(
    `${base}/2025/04/07/understanding-septic-systems-a-beginners-guide/`,
    { waitUntil: "networkidle" },
  );
  assert.match(page.url(), /\/insights\/understanding-septic/);
  await page.goto(`${base}/not-a-real-page`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").textContent(), /BACK ON TRACK/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page
    .locator('[data-renderer="webgl"], [data-renderer="fallback"]')
    .waitFor();
  await page.screenshot({ path: ".cache/verified-desktop.png" });
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log(
    `PASS: ${routes.length} routes at desktop and mobile; navigation, seasons, FAQs, contact links, legacy routing, noindex, images, overflow, and renderer.`,
  );
} finally {
  await browser.close();
}
