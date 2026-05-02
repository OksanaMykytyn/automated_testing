const puppeteer = require("puppeteer");

jest.setTimeout(90000);

const BASE_URL = "https://vivat.com.ua/";
const BOOKS_URL = "https://vivat.com.ua/category/knyhy/";

describe("Vivat UI tests with Puppeteer", () => {
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

  test("should open Vivat home page", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const currentUrl = page.url();

    expect(currentUrl).toContain("vivat.com.ua");
  });

  test("should display title with Vivat text", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const title = await page.title();

    expect(title.toLowerCase()).toContain("vivat");
  });

  test("should open books category and display book-related content", async () => {
    await page.goto(BOOKS_URL, {
      waitUntil: "networkidle2",
    });

    const bodyText = await page.$eval("body", (body) => body.innerText);

    expect(page.url()).toContain("/category/knyhy");
    expect(bodyText.toLowerCase()).toContain("книг");
  });
});
