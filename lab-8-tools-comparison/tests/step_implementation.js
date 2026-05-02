const assert = require("assert");
const puppeteer = require("puppeteer");

const BASE_URL = "https://vivat.com.ua/";
const BOOKS_URL = "https://vivat.com.ua/category/knyhy/";

let browser;
let page;

beforeScenario(async function () {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  page = await browser.newPage();

  await page.setViewport({
    width: 1366,
    height: 768,
  });
});

afterScenario(async function () {
  if (browser) {
    await browser.close();
  }
});

step("Open Vivat home page", async function () {
  await page.goto(BASE_URL, {
    waitUntil: "networkidle2",
  });
});

step("Open Vivat books category page", async function () {
  await page.goto(BOOKS_URL, {
    waitUntil: "networkidle2",
  });
});

step("Page URL should contain <arg0>", async function (arg0) {
  const currentUrl = page.url();

  assert.ok(
    currentUrl.includes(arg0),
    `Expected URL to contain ${arg0}, but got ${currentUrl}`,
  );
});

step("Page title should contain <arg0>", async function (arg0) {
  const title = await page.title();

  assert.ok(
    title.toLowerCase().includes(arg0.toLowerCase()),
    `Expected title to contain ${arg0}, but got ${title}`,
  );
});

step("Page body should contain <arg0>", async function (arg0) {
  const bodyText = await page.$eval("body", (body) => body.innerText);

  assert.ok(
    bodyText.toLowerCase().includes(arg0.toLowerCase()),
    `Expected page body to contain ${arg0}`,
  );
});
