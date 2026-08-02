import React, { createContext } from "react";
import en from "./en";
import am from "./am";
import { autoTranslateValue, getApprovedTranslations } from "./reviewQueue.js";

export const TranslationContext = createContext(null);

export const languages = {
  en: {
    code: "en",
    name: "English",
    nameAm: "English",
    flag: "EN",
    dir: "ltr",
  },
  am: {
    code: "am",
    name: "Amharic",
    nameAm: "አማርኛ",
    flag: "አማ",
    dir: "ltr",
  },
};

const translations = { en, am };

const resolveValueByKey = (obj, key) => {
  if (!key) return undefined;

  return key.split(".").reduce((current, pathSegment) => {
    if (current && Object.prototype.hasOwnProperty.call(current, pathSegment)) {
      return current[pathSegment];
    }
    return undefined;
  }, obj);
};

const flattenApprovedMapToNested = (approvedMap = {}) => {
  const nested = {};

  Object.entries(approvedMap).forEach(([key, value]) => {
    if (!key || typeof value !== "string") return;

    const segments = key.split(".");
    let cursor = nested;

    segments.forEach((segment, index) => {
      if (index === segments.length - 1) {
        cursor[segment] = value;
      } else {
        cursor[segment] = cursor[segment] || {};
        cursor = cursor[segment];
      }
    });
  });

  return nested;
};

const hydrateGeneratedLanguage = (
  englishObject,
  currentLanguageObject = {},
  approvedOverrides = {},
) => {
  return Object.entries(englishObject).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.map((item) => {
        if (typeof item === "string") {
          const approvedValue = approvedOverrides?.[key]?.[item];
          return typeof approvedValue === "string"
            ? approvedValue
            : autoTranslateValue(item);
        }

        if (item && typeof item === "object") {
          return hydrateGeneratedLanguage(
            item,
            currentLanguageObject?.[key] || [],
            approvedOverrides?.[key] || [],
          );
        }

        return item;
      });
      return acc;
    }

    if (value && typeof value === "object") {
      acc[key] = hydrateGeneratedLanguage(
        value,
        currentLanguageObject?.[key] || {},
        approvedOverrides?.[key] || {},
      );
    } else {
      const approvedValue = approvedOverrides?.[key];
      acc[key] =
        typeof approvedValue === "string"
          ? approvedValue
          : typeof currentLanguageObject?.[key] === "string"
            ? currentLanguageObject[key]
            : autoTranslateValue(value);
    }

    return acc;
  }, {});
};

export const getTranslation = (key, lang = "en") => {
  if (!key) return "";

  const approved = getApprovedTranslations()?.[lang]?.[key];
  if (typeof approved === "string" && approved.trim()) {
    return approved;
  }

  const baseTranslation = translations[lang] || translations.en;
  const value = resolveValueByKey(baseTranslation, key);

  if (typeof value === "string") {
    return value;
  }

  if (lang === "am") {
    const englishValue = resolveValueByKey(translations.en, key);
    if (typeof englishValue === "string") {
      return autoTranslateValue(englishValue);
    }
  }

  return key;
};

export const getTranslationsForLanguage = (lang = "en") => {
  if (lang === "en") {
    return translations.en;
  }

  const approvedOverrides = flattenApprovedMapToNested(
    getApprovedTranslations()?.[lang] || {},
  );

  if (lang === "am") {
    return hydrateGeneratedLanguage(
      translations.en,
      translations.am,
      approvedOverrides,
    );
  }

  return translations[lang] || translations.en;
};

export default translations;
