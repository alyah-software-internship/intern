import React, { useState, useEffect, useCallback, useMemo } from "react";
import translations, {
  TranslationContext,
  getTranslation,
  getTranslationsForLanguage,
  languages,
} from "../translation";

export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or browser
  const getInitialLang = () => {
    const saved = localStorage.getItem("iShareLanguage");
    if (saved && languages[saved]) return saved;

    // Check browser language
    const browserLang = navigator.language.split("-")[0];
    if (languages[browserLang]) return browserLang;

    return "am"; // Default to Amharic
  };

  const [lang, setLang] = useState(getInitialLang);
  const [translationVersion, setTranslationVersion] = useState(0);

  useEffect(() => {
    const syncTranslations = () => setTranslationVersion((prev) => prev + 1);
    window.addEventListener("translations:updated", syncTranslations);

    return () => {
      window.removeEventListener("translations:updated", syncTranslations);
    };
  }, []);

  // Update document direction for RTL languages
  useEffect(() => {
    document.documentElement.dir = languages[lang]?.dir || "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("iShareLanguage", lang);

    // Update HTML lang attribute for accessibility
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  // Translation function
  const t = useCallback(
    (key, fallback = null) => {
      const translation = getTranslation(key, lang);
      return translation === key ? fallback || key : translation;
    },
    [lang],
  );

  // Change language
  const setLanguage = useCallback((newLang) => {
    if (languages[newLang]) {
      setLang(newLang);
    }
  }, []);

  // Toggle between English and Amharic
  const toggleLanguage = useCallback(() => {
    setLang(lang === "en" ? "am" : "en");
  }, [lang]);

  const translation = useMemo(() => {
    return getTranslationsForLanguage(lang);
  }, [lang, translationVersion]);

  const value = {
    lang,
    t,
    translation,
    setLanguage,
    toggleLanguage,
    languages,
    currentLanguage: languages[lang],
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook for using translation
export const useTranslation = () => {
  const context = React.useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageProvider;
