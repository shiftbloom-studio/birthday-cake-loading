import fs from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const TARGET_FILES = [
  "index.js",
  "index.cjs",
  "upgrade.js",
  "upgrade.cjs",
  "devtools.js",
  "devtools.cjs"
];

const DIRECTIVE_LINE_DOUBLE = "\"use client\";\n";
const DIRECTIVE_LINE_SINGLE = "'use client';\n";

const prependIfMissing = async (filePath) => {
  let content;
  try {
    content = await fs.readFile(filePath, "utf8");
  } catch {
    return;
  }
 
  if (
    content.startsWith(DIRECTIVE_LINE_DOUBLE) ||
    content.startsWith(DIRECTIVE_LINE_SINGLE) ||
    content.startsWith("\"use client\";") ||
    content.startsWith("'use client';")
  ) {
    return;
  }

  await fs.writeFile(filePath, DIRECTIVE_LINE_DOUBLE + content, "utf8");
};

const shiftSourcemapIfPresent = async (mapPath) => {
  let raw;
  try {
    raw = await fs.readFile(mapPath, "utf8");
  } catch {
    return;
  }

  try {
    const map = JSON.parse(raw);
    if (typeof map?.mappings === "string") {
      // Prepending one line shifts mappings down by exactly one generated line.
      map.mappings = ";" + map.mappings;
    }
    await fs.writeFile(mapPath, JSON.stringify(map), "utf8");
  } catch {
    // ignore invalid maps
  }
};

await Promise.all(
  TARGET_FILES.map(async (file) => {
    const filePath = path.join(DIST_DIR, file);
    await prependIfMissing(filePath);
    await shiftSourcemapIfPresent(filePath + ".map");
  })
);

