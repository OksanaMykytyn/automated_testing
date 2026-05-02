const puppeteer = require("puppeteer");

jest.setTimeout(120000);

const BASE_URL = "https://vivat.com.ua/";
const BOOKS_URL = "https://vivat.com.ua/category/knyhy/";

async function getBodyText(page) {
  return page.$eval("body", (body) => body.innerText);
}

async function getLinksCount(page) {
  return page.$$eval("a", (links) => links.length);
}

async function typeIntoSearch(page, searchText) {
  const selectors = [
    "input[type='search']",
    "input[name='q']",
    "input[name='search']",
    "input[placeholder*='Пошук']",
    "input[placeholder*='пошук']",
  ];

  for (const selector of selectors) {
    const input = await page.$(selector);

    if (input) {
      await input.click({ clickCount: 3 });
      await input.type(searchText);
      await page.keyboard.press("Enter");
      return true;
    }
  }

  return false;
}

async function clickFirstVisibleLinkWithText(page, textVariants) {
  return page.evaluate((variants) => {
    const normalizedVariants = variants.map((item) => item.toLowerCase());
    const links = Array.from(document.querySelectorAll("a"));

    const target = links.find((link) => {
      const text = link.innerText.toLowerCase().trim();

      return (
        link.href &&
        text.length > 0 &&
        normalizedVariants.some((variant) => text.includes(variant))
      );
    });

    if (target) {
      target.click();
      return true;
    }

    return false;
  }, textVariants);
}

describe("Vivat E2E tests", () => {
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

  test("user can open home page and see content", async () => {
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    const bodyText = await getBodyText(page);

    expect(bodyText.length).toBeGreaterThan(100);
  });

  test("user can open books category from direct link", async () => {
    await page.goto(BOOKS_URL, { waitUntil: "networkidle2" });

    const bodyText = await getBodyText(page);

    expect(bodyText.toLowerCase()).toContain("книг");
  });

  test("user can search for a book", async () => {
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    const searchFound = await typeIntoSearch(page, "книга");

    expect(searchFound).toBe(true);

    await page
      .waitForNavigation({ waitUntil: "networkidle2" })
      .catch(() => null);

    const bodyText = await getBodyText(page);

    expect(bodyText.toLowerCase()).toContain("книг");
  });

  test("user can navigate from category to book-related page", async () => {
    await page.goto(BOOKS_URL, { waitUntil: "networkidle2" });

    const clicked = await clickFirstVisibleLinkWithText(page, [
      "книга",
      "роман",
      "видання",
      "комікс",
      "манґа",
    ]);

    expect(clicked).toBe(true);

    await page
      .waitForNavigation({ waitUntil: "networkidle2" })
      .catch(() => null);

    expect(page.url()).toContain("vivat.com.ua");
  });

  test("user can see many navigation links after opening category", async () => {
    await page.goto(BOOKS_URL, { waitUntil: "networkidle2" });

    const linksCount = await getLinksCount(page);

    expect(linksCount).toBeGreaterThan(5);
  });
});
