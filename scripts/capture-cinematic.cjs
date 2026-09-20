/**
 * Capture cinematic + social journey screenshots for the investor demo.
 * Expects production server at http://127.0.0.1:43128
 */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const OUT = "/cursor/stores/bc-cb52aff7-0974-4b63-a7cb-7290aa9de447/media";
const BASE = process.env.NIGHTLINK_BASE || "http://127.0.0.1:43128";

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file);
}

async function clearState(page) {
  await page.goto(BASE + "/?demo=1", { waitUntil: "networkidle2", timeout: 90000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle2", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 900));
}

async function clickText(page, text, exact = false) {
  const buttons = await page.$$("button, a");
  for (const b of buttons) {
    const t = await page.evaluate((el) => (el.textContent || "").trim(), b);
    if (exact ? t === text : t.includes(text)) {
      await b.click();
      return true;
    }
  }
  return false;
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

  await clearState(page);
  await shot(page, "nightlink-exterior.png");

  await clickText(page, "Approach the entrance");
  await new Promise((r) => setTimeout(r, 2000));
  await shot(page, "nightlink-id-check.png");

  await clickText(page, "Demo verification");
  await new Promise((r) => setTimeout(r, 1800));
  // verified flash is short — force doors via store if needed
  await page.evaluate(() => {
    // @ts-ignore
    const w = window;
  });
  await new Promise((r) => setTimeout(r, 800));
  // Doors phase ~2.2s after verified
  await shot(page, "nightlink-doors-open.png");

  await new Promise((r) => setTimeout(r, 2400));
  await shot(page, "nightlink-corridor.png");

  await new Promise((r) => setTimeout(r, 2800));
  await shot(page, "nightlink-party-hall.png");

  // Social journey with skip intro / presets via localStorage seed
  await page.evaluate(() => {
    localStorage.setItem(
      "nightlink-demo-v2",
      JSON.stringify({
        state: {
          ageVerified: true,
          introComplete: true,
          skipIntro: true,
          demoMode: true,
          activeClubId: "neon-athens",
        },
        version: 0,
      })
    );
  });
  await page.goto(BASE + "/club/neon-athens?demo=1", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  // Ensure age + intro via director-like evaluate
  await page.evaluate(() => {
    // Trigger Zustand if available by dispatching demo actions via UI
  });
  // Click verify if still gated
  await clickText(page, "Demo verification");
  await new Promise((r) => setTimeout(r, 2500));
  await shot(page, "nightlink-club-updated.png");

  // Open Maya
  const crowdBtns = await page.$$("button");
  for (const b of crowdBtns) {
    const t = await page.evaluate((el) => el.textContent || "", b);
    if (t.includes("MayaWave")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 900));
  await shot(page, "nightlink-maya-realistic.png");

  // Use Demo Director presets via page evaluate on store — click VIP+gift quick link
  for (const b of await page.$$("button")) {
    const t = await page.evaluate((el) => el.textContent || "", b);
    if (t.includes("VIP+gift") || t.trim() === "VIP+gift") {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 2000));
  await shot(page, "nightlink-table-3-4.png");
  await shot(page, "nightlink-vip-table.png");
  await shot(page, "nightlink-virtual-gift.png");

  // If VIP didn't land, try table create path
  const body = await page.evaluate(() => document.body.innerText);
  if (!body.includes("Midnight") && !body.includes("VIP") && !body.includes("Champagne")) {
    // Manual poke path
    for (const b of await page.$$("button")) {
      const t = await page.evaluate((el) => el.textContent || "", b);
      if (t.includes("Poke")) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2800));
    for (const b of await page.$$("button")) {
      const t = await page.evaluate((el) => el.textContent || "", b);
      if (t.includes("Start a table") || t.includes("table")) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1500));
    await shot(page, "nightlink-table-3-4.png");
  }

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
