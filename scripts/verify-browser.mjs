import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { services, waterSystems, articles, contact } from "../src/content.js";
import { getCalendarSeason, getSeasonalPromotion } from "../src/seasonal.js";

const base = process.env.BASE_URL || "http://127.0.0.1:5178";
const october = new Date("2026-10-01T16:00:00Z");
const widths = [1440, 1024, 390, 320];
const expectedMonths = ["snow", "snow", "maintenance", "maintenance", "wells", "septic", "septic", "wells", "snow", "snow", "snow", "snow"];
for (const [index, promotion] of expectedMonths.entries()) {
  const date = new Date(Date.UTC(2026, index, 15, 16));
  assert.equal(getSeasonalPromotion(date), promotion, `Promotion for month ${index + 1}`);
}
const boundaryCases = [
  ["2026-03-01T04:59:59Z", "snow", "winter"],
  ["2026-03-01T05:00:00Z", "maintenance", "spring"],
  ["2026-09-01T03:59:59Z", "wells", "summer"],
  ["2026-09-01T04:00:00Z", "snow", "fall"],
];
for (const [date, promotion, season] of boundaryCases) {
  assert.equal(getSeasonalPromotion(new Date(date)), promotion, `${date} uses Toronto's promotion date`);
  assert.equal(getCalendarSeason(new Date(date)), season, `${date} uses Toronto's landscape date`);
}

await mkdir(".cache", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
function observeErrors(page) {
  page.on("pageerror", (error) => errors.push(error.message));
}
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
observeErrors(page);
await page.clock.setFixedTime(october);
const routes = [
  "/", "/about", "/contact", "/new-request", "/insights",
  ...services.map((service) => `/${service.slug}`),
  ...waterSystems.map((system) => `/water-treatment/${system.slug}`),
  ...articles.map((article) => `/insights/${article.slug}`),
];
async function visit(target, route = "/") {
  const response = await target.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, `${route} responds successfully`);
  await target.evaluate(() => document.fonts.ready);
}
async function selectedSeason(target, name) {
  await expect(target.getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(target.locator('.season-switch button[aria-pressed="true"]')).toHaveCount(1);
  await expect(target.locator(".hero-scene")).toHaveAttribute("aria-label", new RegExp(`in ${name.toLowerCase()}:`));
}
async function screenshotSection(target, selector, name) {
  const section = target.locator(selector);
  await section.scrollIntoViewIfNeeded();
  // A section must enter the viewport before its lazy images and reveal finish.
  await section.locator("img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  await expect(section).toBeVisible();
  await target.waitForTimeout(700);
  await section.screenshot({ path: `.cache/${name}.png`, animations: "disabled" });
}
try {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await visit(page, route);
      assert.equal(await page.locator("h1").count(), 1, `${route} has one main heading`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} fits ${width}px`);
      assert.equal(await page.locator("h1, h2, h3").evaluateAll((nodes) => nodes.some((node) => !node.textContent.trim())), false, `${route} has no empty headings`);
      assert.equal(await page.locator(".eyebrow, .feature-number").evaluateAll((nodes) => nodes.some((node) => /^0[1-9](\s*\/|$)/.test(node.textContent.trim()))), false, `${route} has no numbered section labels`);
      if (width >= 1024) {
        const headline = page.locator(".hero-heading h1, .editorial-hero .detail-heading h1");
        if (await headline.count()) {
          const lines = await headline.evaluate((element) => {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            const tops = [];
            let node;
            while ((node = walker.nextNode())) {
              if (!node.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              tops.push(...Array.from(range.getClientRects(), (rect) => rect.top));
            }
            return Math.max(...tops) - Math.min(...tops);
          });
          assert.ok(lines < 2, `${route} hero title fits one line at ${width}px`);
        }
        const pairs = page.locator('[data-feature-count="4"]');
        if (await pairs.count()) assert.equal(await pairs.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 2, `${route} arranges four features in two columns`);
      }
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/, "Preview remains excluded from search");
      assert.equal(await page.locator("img").evaluateAll((images) => images.some((image) => image.complete && image.naturalWidth === 0)), false, `${route} has no broken images`);
      if (route === "/") {
        await expect(page.locator(".field-section")).toContainText("Born and raised here. This is home, and these are our neighbours.");
        await expect(page.locator("[data-promotion]")).toHaveAttribute("data-promotion", "snow");
        assert.equal(await page.locator('[data-promotion="snow"]').evaluate((element) => !!(element.compareDocumentPosition(document.querySelector(".well-feature")) & Node.DOCUMENT_POSITION_FOLLOWING)), true, "October snow promotion appears before wells");
        await page.getByRole("button", { name: "Winter", exact: true }).click();
        await selectedSeason(page, "Winter");
        await expect(page.getByRole("button", { name: "Play automatic seasons" })).toBeVisible();
        await page.screenshot({ path: `.cache/verified-home-${width}.png` });
      }
      if (route === "/snow-removal") await screenshotSection(page, ".snow-pricing", `verified-snow-pricing-${width}`);
      if (route === "/water-treatment") await screenshotSection(page, ".annual-maintenance", `verified-maintenance-${width}`);
      if (route === "/contact") await screenshotSection(page, ".contact-simple", `verified-contact-${width}`);
    }
  }

  await visit(page);
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Our services", "Mobile keyboard enters expanded menu");
  await page.keyboard.press("Escape");
  assert.equal(await toggle.evaluate((element) => element === document.activeElement), true, "Escape restores toggle focus");

  await visit(page, "/wells");
  const wellQuestion = page.locator("details").filter({ hasText: "Do you need a drilling rig to replace my pump?" });
  await wellQuestion.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(wellQuestion).toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(wellQuestion).not.toHaveAttribute("open", "");

  await visit(page, "/contact?service=wells");
  await expect(page.locator(".contact-options > a")).toHaveCount(3);
  assert.deepEqual(await page.locator(".contact-options > a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))), ["tel:+17055440200", "mailto:info@williamssolutions.pro", contact.requestUrl], "Contact gives the new phone, direct email and existing Jobber request options");
  await expect(page.locator('.contact-options a[href="tel:+17055440200"]')).toContainText("705-544-0200");
  await expect(page.locator(".contact-options input, .contact-options select, #service-select")).toHaveCount(0);

  await visit(page, "/snow-removal");
  const rates = await page.locator(".rate-list > div").evaluateAll((rows) => rows.map((row) => [row.querySelector("dt").textContent, row.querySelector("strong").textContent, row.querySelector("dd span").textContent]));
  assert.deepEqual(rates, [
    ["Grader", "$219", "per hour"],
    ["Small driveway", "$40", "per clearing"],
    ["Double driveway", "$60", "per clearing"],
    ["Sand & salt mixture", "$60", "extra on request"],
    ["Seasonal small-driveway plan", "About $1,000", "per season"],
  ], "Snow page shows all five agreed rates and their units");
  await visit(page, "/water-treatment#annual-maintenance");
  await expect(page.locator(".maintenance-heading")).toContainText("Every April");
  assert.deepEqual(await page.locator(".maintenance-checks h3").allTextContents(), ["Test your water", "Inspect your system", "Refresh filters & UV", "Stock up for the year"], "April program has all four maintenance steps");
  for (const requirement of [/water test/i, /pressure tank/i, /well pump/i, /UV lamps and sleeves/i, /product and salt/i]) {
    assert.match(await page.locator(".maintenance-checks").innerText(), requirement, "Maintenance program preserves its required scope");
  }

  // Visitor timezone intentionally differs; calendar promotions follow Toronto.
  const calendarPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, timezoneId: "Pacific/Honolulu", reducedMotion: "reduce" });
  observeErrors(calendarPage);
  const calendarCases = [
    ["2026-04-15T16:00:00Z", "maintenance", "spring"],
    ["2026-05-15T16:00:00Z", "wells", "spring"],
    ["2026-07-15T16:00:00Z", "septic", "summer"],
    ["2026-08-15T16:00:00Z", "wells", "summer"],
    ["2026-10-15T16:00:00Z", "snow", "fall"],
    ...boundaryCases,
  ];
  for (const [date, promotion, season] of calendarCases) {
    await calendarPage.clock.setFixedTime(new Date(date));
    await visit(calendarPage);
    await expect(calendarPage.locator("[data-promotion]")).toHaveAttribute("data-promotion", promotion);
    await expect(calendarPage.locator(".well-feature")).toHaveCount(1);
    await selectedSeason(calendarPage, season[0].toUpperCase() + season.slice(1));
    if (promotion !== "wells") assert.equal(await calendarPage.locator("[data-promotion]").evaluate((element) => !!(element.compareDocumentPosition(document.querySelector(".well-feature")) & Node.DOCUMENT_POSITION_FOLLOWING)), true, `${promotion} promotion precedes wells`);
    if (promotion === "maintenance") await expect(calendarPage.locator('[data-promotion="maintenance"] a')).toHaveAttribute("href", "/water-treatment#annual-maintenance");
  }
  await calendarPage.close();

  const animationPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  observeErrors(animationPage);
  await animationPage.clock.install({ time: october });
  await animationPage.clock.pauseAt(new Date(october.getTime() + 1000));
  await visit(animationPage);
  await selectedSeason(animationPage, "Fall");
  await expect(animationPage.getByRole("button", { name: "Pause automatic seasons" })).toBeVisible();
  for (const season of ["Winter", "Spring", "Summer", "Fall"]) {
    await animationPage.clock.fastForward(8000);
    await selectedSeason(animationPage, season);
  }
  for (const season of ["Spring", "Summer", "Fall", "Winter"]) {
    await animationPage.getByRole("button", { name: season, exact: true }).click();
    await selectedSeason(animationPage, season);
    await expect(animationPage.getByRole("button", { name: "Play automatic seasons" })).toBeVisible();
  }
  await animationPage.clock.fastForward(32000);
  await selectedSeason(animationPage, "Winter");
  await expect(animationPage.locator("[data-promotion]")).toHaveAttribute("data-promotion", "snow");
  await animationPage.getByRole("button", { name: "Play automatic seasons" }).click();
  await animationPage.clock.fastForward(8000);
  await selectedSeason(animationPage, "Spring");
  await animationPage.getByRole("button", { name: "Pause automatic seasons" }).click();
  await animationPage.clock.fastForward(16000);
  await selectedSeason(animationPage, "Spring");
  await animationPage.close();

  const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  observeErrors(reducedPage);
  await reducedPage.clock.install({ time: october });
  await reducedPage.clock.pauseAt(new Date(october.getTime() + 1000));
  await visit(reducedPage);
  await selectedSeason(reducedPage, "Fall");
  await expect(reducedPage.getByRole("button", { name: "Play automatic seasons" })).toBeVisible();
  await reducedPage.clock.fastForward(64000);
  await selectedSeason(reducedPage, "Fall");
  await reducedPage.close();

  // An open page also updates its promotion when Toronto crosses a month boundary.
  const rolloverPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, timezoneId: "Pacific/Honolulu", reducedMotion: "reduce" });
  observeErrors(rolloverPage);
  await rolloverPage.clock.install({ time: new Date("2026-09-01T03:59:28Z") });
  await rolloverPage.clock.pauseAt(new Date("2026-09-01T03:59:29Z"));
  await visit(rolloverPage);
  await expect(rolloverPage.locator("[data-promotion]")).toHaveAttribute("data-promotion", "wells");
  await rolloverPage.clock.fastForward(60000);
  await expect(rolloverPage.locator("[data-promotion]")).toHaveAttribute("data-promotion", "snow");
  await rolloverPage.close();

  await visit(page, "/2025/04/07/understanding-septic-systems-a-beginners-guide/");
  assert.match(page.url(), /\/insights\/understanding-septic/);
  await visit(page, "/septic");
  const memberLogo = page.locator(".association-logo img");
  await memberLogo.scrollIntoViewIfNeeded();
  await memberLogo.evaluate((image) => image.decode());
  assert.equal(await memberLogo.getAttribute("src"), "/images/oowa-logo.png");
  assert.match(await page.locator(".association-copy").textContent(), /Ryan Williams is a member/);
  assert.deepEqual(await page.locator(".association-section a").evaluateAll((links) => links.map((link) => link.href)), ["https://www.oowa.org/", "https://www.oowa.org/"]);
  await visit(page, "/not-a-real-page");
  assert.match(await page.locator("h1").textContent(), /BACK ON TRACK/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await visit(page);
  await page.locator('[data-renderer="webgl"], [data-renderer="fallback"]').waitFor();
  await page.screenshot({ path: ".cache/verified-desktop.png" });
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log(`PASS: ${routes.length} routes at ${widths.join("/")}px; desktop heroes, paired grids, FAQs, OOWA, navigation, five snow rates, April maintenance, simplified contact links, calendar promotions and Toronto boundaries, four-season autoplay/manual/reduced motion, legacy routes, noindex, images, overflow, and renderer.`);
} finally {
  await browser.close();
}
