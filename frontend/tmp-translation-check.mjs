import fs from "fs";
import path from "path";
const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^[A-Za-z]:/, (m) => m),
);
const root = path.resolve(process.cwd(), "src");
const fileKeys = new Set();
const regex = /t\.(?:[a-zA-Z0-9_]+(?:\?\.)?)*[a-zA-Z0-9_]+/g;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(entryPath);
    else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))
    ) {
      const txt = fs.readFileSync(entryPath, "utf8");
      let match;
      while ((match = regex.exec(txt))) {
        fileKeys.add(match[0].replace(/\?\./g, ".").replace(/^t\./, ""));
      }
    }
  }
};
walk(root);
const amModule = await import("./src/translation/am.js");
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
const amKeys = new Set(Object.keys(flatten(am)));
const missing = [...fileKeys].filter((key) => !amKeys.has(key));
console.log("usedKeys", fileKeys.size);
console.log("missing", missing.length);
missing.sort().forEach((key) => console.log(key));
