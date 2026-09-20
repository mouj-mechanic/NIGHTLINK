/**
 * Capture cinematic + social journey screenshots for the investor demo.
 */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const OUT = "/cursor/stores/bc-cb52aff7-0974-4b63-a7cb-7290aa9de447/media";
const BASE = process.env.NIGHTLINK_BASE || "http://127.0.0.1:43129";

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file, fs.statSync(file).size);
}

async function wait(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function clickTestId(page, testId) {
  await page.waitForSelector(`[data-testid="${testId}"]`, {
    visible: true,
    timeout: 20000,
  });
  await page.click(`[data-testid="${testId}"]`);
  return true;
}

async function clickText(page, text) {
  return page.evaluate((needle) => {
    const els = [...document.querySelectorAll("button, a, [role='button']")];
    const el = els.find((b) =>
      (b.textContent || "").replace(/\s+/g, " ").includes(needle)
    );
    if (!el) return false;
    el.click();
    return true;
  }, text);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1400,900"],
    defaultViewport: { width: 1400, height: 900 },
  });
  const page = await browser.newPage();

  // Fresh visit — clear storage then wait for cinematic after hydrate
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 90000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle2", timeout: 90000 });
  await page.waitForSelector('[data-testid="cinematic-enter"]', {
    visible: true,
    timeout: 25000,
  });
  await wait(600);
  await shot(page, "nightlink-exterior.png");

  await clickTestId(page, "cinematic-enter");
  await page.waitForSelector('[data-testid="cinematic-id-check"]', {
    visible: true,
    timeout: 15000,
  });
  await wait(400);
  await shot(page, "nightlink-id-check.png");

  await clickTestId(page, "cinematic-demo-verify");
  // verifying 1.4s + verified 1.6s → doors ~3.0s; capture mid doors ~3.6s
  await wait(3600);
  await shot(page, "nightlink-doors-open.png");

  await page.waitForSelector('[data-testid="cinematic-corridor"]', {
    visible: true,
    timeout: 10000,
  }).catch(() => null);
  await wait(800);
  await shot(page, "nightlink-corridor.png");

  // Wait for intro to finish → party hall
  await page.waitForFunction(
    () => !document.querySelector('[data-testid="cinematic-corridor"]') &&
      !document.querySelector('[data-testid="cinematic-enter"]'),
    { timeout: 15000 }
  ).catch(() => null);
  await wait(800);
  await shot(page, "nightlink-party-hall.png");

  // --- Social journey ---
  await page.goto(BASE + "/?demo=1", { waitUntil: "networkidle2", timeout: 90000 });
  await wait(1000);
  // Skip cinematic if present
  await clickText(page, "Skip Intro");
  await wait(400);
  await clickText(page, "Skip Intro / Go straight inside");
  await wait(500);

  // VIP preset from director
  console.log("vip", await clickText(page, "4 VIP"));
  await wait(1500);
  await page.goto(BASE + "/club/neon-athens?demo=1", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await wait(2000);
  await clickText(page, "Demo verification");
  await wait(2000);
  await shot(page, "nightlink-club-updated.png");

  console.log("maya", await clickText(page, "MayaWave"));
  await wait(1000);
  await shot(page, "nightlink-maya-realistic.png");

  // Re-apply VIP and shoot table/gift
  console.log("vip2", await clickText(page, "4 VIP"));
  await wait(1200);
  await page.goto(BASE + "/club/neon-athens?demo=1", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await wait(2200);
  await shot(page, "nightlink-table-3-4.png");
  await shot(page, "nightlink-vip-table.png");

  await clickText(page, "Send Champagne");
  await wait(1400);
  await shot(page, "nightlink-virtual-gift.png");

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
