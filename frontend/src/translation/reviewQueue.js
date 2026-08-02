import en from "./en.js";

const REVIEW_STORAGE_KEY = "iShareTranslationReviewQueue";
const APPROVED_TRANSLATIONS_KEY = "iShareApprovedTranslations";

const commonWordMap = {
  Home: "ቤት",
  Rentals: "ኪራይ",
  Categories: "ምድቦች",
  Dashboard: "ዳሽቦርድ",
  Login: "ግባ",
  Register: "ተመዝገብ",
  Settings: "ቅንብሮች",
  Profile: "መገለጫ",
  Messages: "መልዶች",
  Wishlist: "የልመና ዝርዝር",
  Search: "ፈልግ",
  Save: "አስቀምጥ",
  Cancel: "ይቋረጡ",
  Close: "ዝጋ",
  "Book Now": "አሁን ይዘዙ",
  "Rent Now": "ኪራይ ያድርጉ",
  "View Details": "ዝርዝሮች ይመልከቱ",
  "Add to Cart": "ወደ ጋሪ ያክሉ",
  Language: "ቋንቋ",
  English: "እንግሊዝኛ",
  Amharic: "አማርኛ",
  Manage: "ያቀናጃል",
  Review: "ግምገማ",
  Notifications: "ማሳወቂያዎች",
  "Pricing Agreement": "የዋጋ ስምምነት",
  "Current Billing Cycle Active": "የአሁኑ የክፍያ ዑደት ንቁ",
  "Upgrade to Enterprise": "ወደ ኢንተርፕራይዝ ያሻሽሉ",
  "Switch to Basic": "ወደ መሰረታዊ ይቀይሩ",
  Retrieve: "ያስመልሱ",
  Billing: "ክፍያ",
  Monthly: "ወርሃዊ",
  Compare: "አወዳድር",
  Packages: "ፓኬጆች",
};

const flattenLeafStrings = (obj, prefix = "") => {
  const result = [];

  Object.entries(obj).forEach(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      result.push(...flattenLeafStrings(value, nextKey));
    } else if (typeof value === "string") {
      result.push({ key: nextKey, value });
    }
  });

  return result;
};

const toAutoTranslation = (englishValue = "") => {
  if (!englishValue) return "";

  const normalizedWords = englishValue
    .split(/\s+/)
    .map((word) => commonWordMap[word] || word)
    .join(" ");

  return normalizedWords;
};

const buildSeedQueue = () => {
  const entries = flattenLeafStrings(en).map((item) => ({
    id: `${item.key}-${item.value.slice(0, 18)}`,
    key: item.key,
    sourceLanguage: "en",
    targetLanguage: "am",
    sourceValue: item.value,
    suggestedValue: toAutoTranslation(item.value),
    approvedValue: "",
    status: "pending",
  }));

  return entries.slice(0, 120);
};

const readStoredQueue = () => {
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!raw) {
      const seed = buildSeedQueue();
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return buildSeedQueue();
  }
};

export const getReviewQueue = () => readStoredQueue();

export const saveReviewQueue = (queue) => {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(queue));
  window.dispatchEvent(new CustomEvent("translations:updated"));
};

export const getApprovedTranslations = () => {
  try {
    const raw = localStorage.getItem(APPROVED_TRANSLATIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
};

export const setApprovedTranslation = (key, lang, translatedValue) => {
  const approvedMap = getApprovedTranslations();
  approvedMap[lang] = approvedMap[lang] || {};
  approvedMap[lang][key] = translatedValue;
  localStorage.setItem(APPROVED_TRANSLATIONS_KEY, JSON.stringify(approvedMap));
  window.dispatchEvent(new CustomEvent("translations:updated"));
};

export const getApprovedTranslation = (key, lang = "am") => {
  const approvedMap = getApprovedTranslations();
  return approvedMap?.[lang]?.[key] || null;
};

export const getTranslationSuggestion = (key, lang = "am") => {
  if (lang !== "am") {
    return null;
  }

  const queue = getReviewQueue();
  const match = queue.find((item) => item.key === key);

  if (!match) {
    return null;
  }

  return match.approvedValue || match.suggestedValue || null;
};

export const approveQueueEntry = (id, correctedValue) => {
  const queue = getReviewQueue();
  let updatedQueue = queue.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    const approvedText = correctedValue?.trim() || entry.suggestedValue || "";
    setApprovedTranslation(entry.key, entry.targetLanguage, approvedText);

    return {
      ...entry,
      approvedValue: approvedText,
      status: "approved",
    };
  });

  saveReviewQueue(updatedQueue);
  return updatedQueue;
};

export const updateQueueDraft = (id, correctedValue) => {
  const queue = getReviewQueue();
  const updatedQueue = queue.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          approvedValue: correctedValue,
          status: correctedValue?.trim() ? "needs_review" : "pending",
        }
      : entry,
  );

  saveReviewQueue(updatedQueue);
  return updatedQueue;
};

export const autoTranslateValue = (englishValue = "") => {
  return toAutoTranslation(englishValue);
};
