const puppeteer = require("puppeteer");

jest.setTimeout(90000);

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
    await page.setViewport({ width: 1366, height: 768 });
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should open Vivat home page", async () => {
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    expect(page.url()).toContain("vivat.com.ua");
  });

  test("home page should have title with Vivat", async () => {
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    const title = await page.title();

    expect(title.toLowerCase()).toContain("vivat");
  });

  test("home page should contain links", async () => {
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    const linksCount = await page.$$eval("a", (links) => links.length);

    expect(linksCount).toBeGreaterThan(0);
  });

  test("books category page should open", async () => {
    await page.goto(BOOKS_URL, { waitUntil: "networkidle2" });

    expect(page.url()).toContain("/category/knyhy");
  });

  test("books category page should contain book-related text", async () => {
    await page.goto(BOOKS_URL, { waitUntil: "networkidle2" });

    const bodyText = await page.$eval("body", (body) => body.innerText);

    expect(bodyText.toLowerCase()).toContain("книг");
  });
});
