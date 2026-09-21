export const DEFAULT_CURRENCY = "USD";
export const VENDOR_CURRENCY = "ETB";

export const getPlatformCurrency = () => {
  const stored = localStorage.getItem("platformCurrency");
  const currency = (stored || DEFAULT_CURRENCY).toUpperCase();
  return ["USD", "ETB", "EUR"].includes(currency) ? currency : DEFAULT_CURRENCY;
};

export const formatMoney = (value, currencyCode = getPlatformCurrency()) => {
  const safeCurrency = ["USD", "ETB", "EUR"].includes(
    String(currencyCode || DEFAULT_CURRENCY).toUpperCase(),
  )
    ? String(currencyCode || DEFAULT_CURRENCY).toUpperCase()
    : DEFAULT_CURRENCY;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};

export const formatCurrencyValue = (
  value,
  currencyCode = getPlatformCurrency(),
) =>
  `${currencyCode} ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export const formatVendorMoney = (value) =>
  formatCurrencyValue(value, VENDOR_CURRENCY);
