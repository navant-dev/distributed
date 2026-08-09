import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const outputDirectory = join(process.cwd(), "dist");
const configuredBase = (process.env.LINK_BASE || "/").replace(/\/$/, "") || "";
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".html")) htmlFiles.push(path);
  }
}

function pageUrl(file) {
  const path = relative(outputDirectory, file).replaceAll("\\", "/").replace(/index\.html$/, "");
  return new URL(`${configuredBase}/${path}`.replace(/\/+/g, "/"), "https://distillsys.test").href;
}

function targetFile(pathname) {
  let localPath = pathname;
  if (configuredBase && localPath.startsWith(`${configuredBase}/`)) localPath = localPath.slice(configuredBase.length);
  if (configuredBase && localPath === configuredBase) localPath = "/";
  const clean = decodeURIComponent(localPath).replace(/^\//, "");
  if (!clean || clean.endsWith("/")) return join(outputDirectory, clean, "index.html");
  if (extname(clean)) return join(outputDirectory, clean);
  const directoryIndex = join(outputDirectory, clean, "index.html");
  return existsSync(directoryIndex) ? directoryIndex : join(outputDirectory, `${clean}.html`);
}

walk(outputDirectory);
const failures = [];

for (const sourceFile of htmlFiles) {
  const html = readFileSync(sourceFile, "utf8");
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!href || /^(?:https?:|mailto:|tel:|javascript:)/.test(href)) continue;
    const target = new URL(href, pageUrl(sourceFile));
    const file = targetFile(target.pathname);
    if (!existsSync(file)) {
      failures.push(`${relative(outputDirectory, sourceFile)} → ${href} (missing route)`);
      continue;
    }
    if (target.hash) {
      const fragment = decodeURIComponent(target.hash.slice(1));
      const targetHtml = readFileSync(file, "utf8");
      const anchors = new Set([...targetHtml.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)].map((match) => match[1]));
      if (!anchors.has(fragment)) failures.push(`${relative(outputDirectory, sourceFile)} → ${href} (missing anchor)`);
    }
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} broken internal link${failures.length === 1 ? "" : "s"}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} pages: all internal routes and anchors resolve.`);
