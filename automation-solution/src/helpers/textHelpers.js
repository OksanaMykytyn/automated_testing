function normalizeText(text) {
  return text.toLowerCase().trim();
}

function hasText(source, expectedText) {
  return normalizeText(source).includes(normalizeText(expectedText));
}

function removeExtraSpaces(text) {
  return text.replace(/\s+/g, " ").trim();
}

function isNotEmptyText(text) {
  return typeof text === "string" && text.trim().length > 0;
}

function countWords(text) {
  return removeExtraSpaces(text).split(" ").filter(Boolean).length;
}

module.exports = {
  normalizeText,
  hasText,
  removeExtraSpaces,
  isNotEmptyText,
  countWords,
};
