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
      assert.equal(
        await page
          .locator("h1, h2, h3")
          .evaluateAll((nodes) => nodes.some((n) => !n.textContent.trim())),
        false,
        `${route} has no empty headings`,
      );
      if (width === 1440) {
        const headline = page.locator(
          ".hero-heading h1, .editorial-hero .detail-heading h1",
        );
        if (await headline.count()) {
          const lines = await headline.evaluate((el) => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const tops = [];
            let node;
            while ((node = walker.nextNode())) {
              if (!node.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              tops.push(...Array.from(range.getClientRects(), (r) => r.top));
            }
            return Math.max(...tops) - Math.min(...tops);
          });
          assert.ok(lines < 2, `${route} desktop hero title fits one line`);
        }
        const pairs = page.locator('[data-feature-count="4"]');
        if (await pairs.count())
          assert.equal(
            await pairs.evaluate(
              (el) =>
                getComputedStyle(el).gridTemplateColumns.split(" ").length,
            ),
            2,
            `${route} arranges four features in two columns`,
          );
      }
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
  assert.equal(
    await page
      .locator("details")
      .filter({ hasText: "Do you need a drilling rig to replace my pump?" })
      .evaluate((el) => el.open),
    true,
    "Well FAQ opens",
  );
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
  await page.goto(`${base}/septic`, { waitUntil: "networkidle" });
  const memberLogo = page.locator(".association-logo img");
  await memberLogo.scrollIntoViewIfNeeded();
  await memberLogo.evaluate((im) => im.decode());
  assert.equal(await memberLogo.getAttribute("src"), "/images/oowa-logo.png");
  assert.match(
    await page.locator(".association-copy").textContent(),
    /Ryan Williams is a member/,
  );
  assert.equal(
    await page.locator(".association-logo a").getAttribute("href"),
    "https://www.oowa.org/",
  );
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
    `PASS: ${routes.length} routes at desktop and mobile; single-line desktop heroes, paired feature grids, FAQ interactions, OOWA logo, navigation, seasons, contact links, legacy routing, noindex, images, overflow, and renderer.`,
  );
} finally {
  await browser.close();
}
