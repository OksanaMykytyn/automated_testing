const {
  normalizeText,
  hasText,
  removeExtraSpaces,
  isNotEmptyText,
  countWords,
} = require("../../src/helpers/textHelpers");

describe("Text helper unit tests", () => {
  test("normalizeText should convert text to lowercase and trim spaces", () => {
    expect(normalizeText("  VIVAT Books  ")).toBe("vivat books");
  });

  test("hasText should return true when source contains expected text", () => {
    expect(hasText("Видавництво Віват", "віват")).toBe(true);
  });

  test("removeExtraSpaces should remove duplicated spaces", () => {
    expect(removeExtraSpaces("Книга    українською   мовою")).toBe(
      "Книга українською мовою",
    );
  });

  test("isNotEmptyText should return true for non-empty string", () => {
    expect(isNotEmptyText("Книжковий каталог")).toBe(true);
  });

  test("countWords should count words in text", () => {
    expect(countWords("Видавництво Віват книги")).toBe(3);
  });
});
