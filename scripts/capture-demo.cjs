const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const OUT = "/cursor/stores/bc-cb52aff7-0974-4b63-a7cb-7290aa9de447/media";
const BASE = "http://127.0.0.1:43127";

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file);
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

  // Clear storage for clean age gate
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));
  await shot(page, "nightlink-lobby.png");

  // Demo director
  await page.goto(BASE + "/?demo=1", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1000));
  await shot(page, "nightlink-demo-director.png");

  // Enter club → age gate
  await page.goto(BASE + "/club/neon-athens?demo=1", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 1200));
  await shot(page, "nightlink-age-gate.png");

  // Click demo verification
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const t = await page.evaluate((el) => el.textContent || "", b);
    if (t.includes("Demo verification")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 3200));
  await shot(page, "nightlink-club.png");

  // Open MayaWave
  const crowdBtns = await page.$$("button");
  for (const b of crowdBtns) {
    const t = await page.evaluate((el) => el.textContent || "", b);
    if (t.includes("MayaWave")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  await shot(page, "nightlink-social.png");

  // Poke if available
  for (const b of await page.$$("button")) {
    const t = await page.evaluate((el) => el.textContent || "", b);
    if (t.trim() === "Poke" || t.includes("Poke")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 2500));
  await shot(page, "nightlink-matched.png");

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
