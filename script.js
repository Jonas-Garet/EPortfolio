"use strict";

const languageSelect = document.querySelector("#language-select");
const languageError = document.querySelector("#language-error");
const supportedLanguages = new Set(["english", "french"]);

async function loadLanguage(language) {
  if (!supportedLanguages.has(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const response = await fetch(`language/${language}.json`);
  if (!response.ok) {
    throw new Error(`Unable to load ${language} translations (${response.status}).`);
  }

  const translations = await response.json();
  document.documentElement.lang = language === "french" ? "fr" : "en";

  for (const element of document.querySelectorAll("[data-i18n]")) {
    const value = translations[element.dataset.i18n];
    if (typeof value !== "string") {
      throw new Error(`Missing translation "${element.dataset.i18n}" in ${language}.json.`);
    }
    element.textContent = value;
  }

  for (const element of document.querySelectorAll("[data-i18n-alt]")) {
    const value = translations[element.dataset.i18nAlt];
    if (typeof value !== "string") {
      throw new Error(`Missing image description "${element.dataset.i18nAlt}" in ${language}.json.`);
    }
    element.alt = value;
  }

  for (const element of document.querySelectorAll("[data-i18n-aria]")) {
    const value = translations[element.dataset.i18nAria];
    if (typeof value !== "string") {
      throw new Error(`Missing accessibility label "${element.dataset.i18nAria}" in ${language}.json.`);
    }
    element.setAttribute("aria-label", value);
  }

  for (const element of document.querySelectorAll("[data-i18n-content]")) {
    const value = translations[element.dataset.i18nContent];
    if (typeof value !== "string") {
      throw new Error(`Missing metadata translation "${element.dataset.i18nContent}" in ${language}.json.`);
    }
    element.setAttribute("content", value);
  }

  document.title = translations.pageTitle;
  languageError.hidden = true;
}

languageSelect.addEventListener("change", async (event) => {
  const language = event.currentTarget.value;
  try {
    await loadLanguage(language);
  } catch (error) {
    languageError.textContent = error.message;
    languageError.hidden = false;
  }
});

languageSelect.value = "english";

loadLanguage("english").catch((error) => {
  languageError.textContent = error.message;
  languageError.hidden = false;
});
