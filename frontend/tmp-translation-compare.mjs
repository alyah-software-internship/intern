import en from './src/translation/en.js';
import am from './src/translation/am.js';
function flatten(obj, prefix='') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, path));
    } else {
      acc[path] = value;
    }
    return acc;
  }, {});
}
const flatEn = flatten(en);
const flatAm = flatten(am);
const missingInAm = Object.keys(flatEn).filter((key) => !(key in flatAm));
const extraInAm = Object.keys(flatAm).filter((key) => !(key in flatEn));
console.log('MISSING IN AM:', missingInAm.length);
missingInAm.sort().forEach((key) => console.log(key));
console.log('---');
console.log('EXTRA IN AM:', extraInAm.length);
extraInAm.sort().forEach((key) => console.log(key));
