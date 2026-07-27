import amModule from "./src/translation/am.js";
const am = amModule.default || amModule;
const flatten = (obj, prefix = "") =>
  Object.entries(obj).reduce((res, [key, value]) => {
    const name = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.assign(res, flatten(value, name));
    }
    res[name] = value;
    return res;
  }, {});
const keys = Object.keys(flatten(am));
console.log(
  "contains product keys",
  keys.filter((k) => k.startsWith("products.")),
);
console.log(
  "contains home keys",
  keys.filter((k) => k.startsWith("home.")),
);
console.log(
  "contains productDetail.platformFee",
  keys.includes("productDetail.platformFee"),
);
console.log(
  "contains home.wishlist.subtitle",
  keys.includes("home.wishlist.subtitle"),
);
console.log("contains home.rentals", keys.includes("home.rentals"));
console.log(
  "contains home.search.categories",
  keys.includes("home.search.categories"),
);
console.log(
  "contains home.recentlyViewed.categories",
  keys.includes("home.recentlyViewed.categories"),
);
console.log("contains home.products", keys.includes("home.products"));
console.log("contains products.price", keys.includes("products.price"));
console.log("contains products.available", keys.includes("products.available"));
console.log(
  "contains products.unavailable",
  keys.includes("products.unavailable"),
);
console.log(
  "contains products.allAvailability",
  keys.includes("products.allAvailability"),
);
