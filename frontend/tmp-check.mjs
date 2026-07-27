import('./src/translation/am.js').then(amModule => {
  const am = amModule.default;
  const flatten = (obj, prefix = '') =>
    Object.entries(obj).reduce((res, [key, value]) => {
      const name = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.assign(res, flatten(value, name));
      }
      res[name] = value;
      return res;
    }, {});
  const keys = Object.keys(flatten(am));
  const check = [
    'products.price',
    'products.available',
    'products.unavailable',
    'products.allAvailability',
    'productDetail.platformFee',
    'home.wishlist.subtitle',
    'home.rentals',
    'home.products',
    'home.search.categories',
    'home.recentlyViewed.categories'
  ];
  check.forEach((k) => console.log(k, keys.includes(k)));
});
