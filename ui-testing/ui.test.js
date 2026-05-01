const puppeteer = require("puppeteer");

jest.setTimeout(60000);

const BASE_URL = "https://vivat.com.ua/";
const BOOKS_URL = "https://vivat.com.ua/category/knyhy/";

describe("Vivat UI tests", () => {
  let browser;
  let page;

  beforeEach(async () => {
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

  afterEach(async () => {
    await browser.close();
  });

  test("should open the Vivat home page", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const currentUrl = page.url();

    expect(currentUrl).toContain("vivat.com.ua");
  });

  test("should display page title with Vivat information", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const title = await page.title();

    expect(title.toLowerCase()).toContain("vivat");
  });

  test("should contain navigation links on the home page", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const linksCount = await page.$$eval("a", (links) => links.length);

    expect(linksCount).toBeGreaterThan(0);
  });

  test("should open books category page", async () => {
    await page.goto(BOOKS_URL, {
      waitUntil: "networkidle2",
    });

    const currentUrl = page.url();

    expect(currentUrl).toContain("/category/knyhy");
  });

  test("should display book-related content on books category page", async () => {
    await page.goto(BOOKS_URL, {
      waitUntil: "networkidle2",
    });

    const bodyText = await page.$eval("body", (body) => body.innerText);

    expect(bodyText.toLowerCase()).toContain("книг");
  });

  test("should have multiple links on books category page", async () => {
    await page.goto(BOOKS_URL, {
      waitUntil: "networkidle2",
    });

    const linksCount = await page.$$eval("a", (links) => links.length);

    expect(linksCount).toBeGreaterThan(5);
  });

  test("should have visible page content", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const bodyTextLength = await page.$eval(
      "body",
      (body) => body.innerText.trim().length,
    );

    expect(bodyTextLength).toBeGreaterThan(100);
  });
});
