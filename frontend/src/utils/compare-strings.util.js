export function searchMatchPartial(termSearch, textComplete) {
  // Normalizes strings: removes accents, converts to lowercase and removes special characters
  const normalizeFn = (str) => {
    return str
      .normalize("NFD") // Separate letters and accents (e.g.: “é” -> “e'”)
      .replace(/[\u0300-\u036f]/g, "") // Removes accents and diacritics
      .toLowerCase() // Converts to lowercase
      .replace(/[^a-z0-9\s]/g, ""); // Optional: remove everything that is not alphanumeric or blank space
  };

  const termNormalized = normalizeFn(termSearch);
  const textNormalized = normalizeFn(textComplete);

  // Checks if the search term is included in the text (partial match)
  return textNormalized.includes(termNormalized);
}
