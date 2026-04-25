#!/usr/bin/env bun
/**
 * Generates raster PWA + Apple icons and the legacy favicon.ico from
 * `app/icon.svg`. Re-run whenever the icon source changes.
 *
 *   bun run scripts/generate-icons.mjs
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const SOURCE = resolve(ROOT, "app/icon.svg");
const TMP = "/tmp/iropf-icons";
mkdirSync(TMP, { recursive: true });

const sourceMarkup = readFileSync(SOURCE, "utf8")
  .replace(/<style>[\s\S]*?<\/style>\s*/u, "")
  .replace(/class="ink"/g, 'fill="#000"');
const innerMatch = sourceMarkup.match(/<svg[^>]*>([\s\S]*)<\/svg>/u);
if (!innerMatch) throw new Error("Cannot extract <svg> body");
const ROBOT_BODY = innerMatch[1].trim();

function composite({ size, background, scalePercent }) {
  const scale = (size * (scalePercent / 100)) / 295.996;
  const offset = size / 2;
  const bgRect = background
    ? `<rect width="${size}" height="${size}" fill="${background}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
${bgRect}
<g transform="translate(${offset} ${offset}) scale(${scale}) translate(-147.998 -147.998)">
${ROBOT_BODY}
</g>
</svg>`;
}

function rasterize(svgMarkup, outPath, size) {
  const tmpSvg = `${TMP}/source-${size}.svg`;
  writeFileSync(tmpSvg, svgMarkup);
  mkdirSync(dirname(outPath), { recursive: true });
  execSync(`rsvg-convert -w ${size} -h ${size} -o "${outPath}" "${tmpSvg}"`, {
    stdio: "inherit",
  });
  unlinkSync(tmpSvg);
}

const targets = [
  {
    label: "apple-icon",
    out: "app/apple-icon.png",
    size: 180,
    background: "#F4ECD3",
    scalePercent: 70,
  },
  {
    label: "icon-192",
    out: "public/icon-192.png",
    size: 192,
    background: "#FFFFFF",
    scalePercent: 78,
  },
  {
    label: "icon-512",
    out: "public/icon-512.png",
    size: 512,
    background: "#FFFFFF",
    scalePercent: 78,
  },
  {
    label: "icon-maskable-512",
    out: "public/icon-maskable-512.png",
    size: 512,
    background: "#FFCE00",
    scalePercent: 56,
  },
];

for (const t of targets) {
  const svg = composite({
    size: t.size,
    background: t.background,
    scalePercent: t.scalePercent,
  });
  const outPath = resolve(ROOT, t.out);
  rasterize(svg, outPath, t.size);
  console.log(`✓ ${t.label} → ${t.out}`);
}

const icoSourceSizes = [16, 32, 48];
const icoTmpFiles = [];
for (const s of icoSourceSizes) {
  const svg = composite({
    size: s,
    background: "#FFFFFF",
    scalePercent: 78,
  });
  const path = `${TMP}/favicon-${s}.png`;
  writeFileSync(`${TMP}/favicon-${s}.svg`, svg);
  execSync(
    `rsvg-convert -w ${s} -h ${s} -o "${path}" "${TMP}/favicon-${s}.svg"`,
    { stdio: "inherit" },
  );
  icoTmpFiles.push(path);
}
const icoOut = resolve(ROOT, "app/favicon.ico");
execSync(`magick ${icoTmpFiles.join(" ")} "${icoOut}"`, { stdio: "inherit" });
for (const f of icoTmpFiles) unlinkSync(f);
console.log(`✓ favicon.ico (16/32/48) → app/favicon.ico`);
