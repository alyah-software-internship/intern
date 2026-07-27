const fs = require("fs");
const glob = require("glob");
const am = require("./src/translation/am.js");
const flatten = (obj, prefix = "") =>
  Object.entries(obj).reduce((res, [k, v]) => {
    const name = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.assign(res, flatten(v, name));
    }
    res[name] = v;
    return res;
  }, {});
const amKeys = new Set(Object.keys(flatten(am)));
const fileKeys = new Set();
const files = glob.sync("src/**/*.{js,jsx}");
const regex = /t\.(?:[a-zA-Z0-9_]+(?:\?\.)?)*[a-zA-Z0-9_]+/g;
files.forEach((file) => {
  const txt = fs.readFileSync(file, "utf8");
  let match;
  while ((match = regex.exec(txt))) {
    const key = match[0].replace(/\?\./g, ".").replace(/^t\./, "");
    fileKeys.add(key);
  }
});
const missing = [...fileKeys].filter((k) => !amKeys.has(k));
console.log("usedKeys", fileKeys.size);
console.log("missing", missing.length);
missing.sort().forEach((k) => console.log(k));
