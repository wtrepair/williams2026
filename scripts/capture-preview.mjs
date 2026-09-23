import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1040 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5178", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: ".cache/desktop.png" });
await page.screenshot({ path: ".cache/full.png", fullPage: true });
console.log(
  JSON.stringify({
    errors,
    renderer: await page
      .locator("[data-renderer]")
      .getAttribute("data-renderer"),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5178", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: ".cache/mobile.png" });
console.log(
  JSON.stringify({
    mobileOverflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await browser.close();
