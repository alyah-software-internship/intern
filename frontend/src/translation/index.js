import React, { createContext } from "react";
import en from "./en";
import am from "./am";

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

export const getTranslation = (key, lang = "en") => {
  if (!key) return "";
  const value = key.split(".").reduce((obj, pathSegment) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, pathSegment)) {
      return obj[pathSegment];
    }
    return undefined;
  }, translations[lang] || translations.en);
  return value ?? key;
};

export default translations;
