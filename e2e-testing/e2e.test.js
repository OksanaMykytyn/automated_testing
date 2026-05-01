const puppeteer = require("puppeteer");

jest.setTimeout(90000);

const BASE_URL = "https://vivat.com.ua/";
const BOOKS_URL = "https://vivat.com.ua/category/knyhy/";

async function getBodyText(page) {
  return page.$eval("body", (body) => body.innerText);
}

async function getLinksCount(page) {
  return page.$$eval("a", (links) => links.length);
}

async function clickFirstVisibleLinkWithText(page, textVariants) {
  const clicked = await page.evaluate((variants) => {
    const normalizedVariants = variants.map((item) => item.toLowerCase());

    const links = Array.from(document.querySelectorAll("a"));

    const target = links.find((link) => {
      const text = link.innerText.toLowerCase().trim();
      const href = link.href;

      return (
        href &&
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

  return clicked;
}

async function clickFirstVisibleButtonWithText(page, textVariants) {
  const clicked = await page.evaluate((variants) => {
    const normalizedVariants = variants.map((item) => item.toLowerCase());

    const elements = Array.from(
      document.querySelectorAll("button, a, input[type='submit']"),
    );

    const target = elements.find((element) => {
      const text = (
        element.innerText ||
        element.value ||
        element.getAttribute("aria-label") ||
        ""
      )
        .toLowerCase()
        .trim();

      return normalizedVariants.some((variant) => text.includes(variant));
    });

    if (target) {
      target.click();
      return true;
    }

    return false;
  }, textVariants);

  return clicked;
}

async function typeIntoSearch(page, searchText) {
  const searchSelectors = [
    "input[type='search']",
    "input[name='q']",
    "input[name='search']",
    "input[placeholder*='Пошук']",
    "input[placeholder*='пошук']",
    "input[placeholder*='Search']",
  ];

  for (const selector of searchSelectors) {
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

describe("Vivat E2E user scenarios", () => {
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

  test("Scenario 1: user can search for books on the website", async () => {
    await page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    const searchWasFound = await typeIntoSearch(page, "книга");

    expect(searchWasFound).toBe(true);

    await page
      .waitForNavigation({
        waitUntil: "networkidle2",
      })
      .catch(() => null);

    const bodyText = await getBodyText(page);
    const linksCount = await getLinksCount(page);

    expect(bodyText.toLowerCase()).toContain("книг");
    expect(linksCount).toBeGreaterThan(5);
  });

  test("Scenario 2: user can open books category and navigate to a product page", async () => {
    await page.goto(BOOKS_URL, {
      waitUntil: "networkidle2",
    });

    const categoryText = await getBodyText(page);

    expect(categoryText.toLowerCase()).toContain("книг");

    const clickedProductLink = await clickFirstVisibleLinkWithText(page, [
      "книга",
      "роман",
      "видання",
      "комікс",
      "манґа",
    ]);

    expect(clickedProductLink).toBe(true);

    await page
      .waitForNavigation({
        waitUntil: "networkidle2",
      })
      .catch(() => null);

    const productPageText = await getBodyText(page);

    expect(productPageText.length).toBeGreaterThan(300);
    expect(page.url()).toContain("vivat.com.ua");
  });

  test("Scenario 3: user can open product page and try to add a book to cart", async () => {
    await page.goto(BOOKS_URL, {
      waitUntil: "networkidle2",
    });

    const clickedProductLink = await clickFirstVisibleLinkWithText(page, [
      "книга",
      "роман",
      "видання",
      "комікс",
      "манґа",
    ]);

    expect(clickedProductLink).toBe(true);

    await page
      .waitForNavigation({
        waitUntil: "networkidle2",
      })
      .catch(() => null);

    const productPageText = await getBodyText(page);

    expect(productPageText.length).toBeGreaterThan(300);

    const clickedBuyButton = await clickFirstVisibleButtonWithText(page, [
      "купити",
      "до кошика",
      "в кошик",
      "замовити",
    ]);

    expect(clickedBuyButton).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const updatedPageText = await getBodyText(page);

    expect(updatedPageText.toLowerCase()).toMatch(
      /кошик|купити|замовлення|товар/,
    );
  });
});
