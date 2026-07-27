const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname);
const amFile = path.join(root, "src", "translation", "am.js");
let amText = fs.readFileSync(amFile, "utf8");
const start = amText.indexOf("const am =");
const end = amText.lastIndexOf("export default am;");
if (start === -1 || end === -1) {
  throw new Error("am.js format not recognized");
}
amText = amText.slice(start + "const am =".length, end).trim();
if (amText.endsWith(";")) amText = amText.slice(0, -1);
const am = eval(`(${amText})`);
const flatten = (obj, prefix = "") =>
  Object.entries(obj).reduce((res, [k, v]) => {
    const name = prefix ? `${prefix}.${k}` : k;
    res[name] = v;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(res, flatten(v, name));
    }
    return res;
  }, {});
const amKeys = new Set(Object.keys(flatten(am)));
const filePaths = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (/\.(js|jsx)$/.test(name)) {
      filePaths.push(full);
    }
  }
}
walk(path.join(root, "src"));
const fileKeys = new Set();
const regex = /t(?:\?\.)?\.(?:[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)/g;
for (const file of filePaths) {
  const txt = fs.readFileSync(file, "utf8");
  let match;
  while ((match = regex.exec(txt))) {
    const key = match[0].replace(/\?\./g, ".").replace(/^t\./, "");
    fileKeys.add(key);
  }
}
const missing = [...fileKeys].filter((k) => !amKeys.has(k)).sort();
console.log("usedKeys", fileKeys.size);
console.log("amKeys", amKeys.size);
console.log("missing", missing.length);
missing.forEach((k) => console.log(k));
