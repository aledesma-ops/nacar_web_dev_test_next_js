#!/usr/bin/env node
/**
 * Descarga los assets del diseño de Figma a /public.
 *
 *   npm run fetch:assets
 *
 * Las URLs de la MCP de Figma caducan ~7 días. Si alguna falla con 403/404,
 * exporta ese asset a mano desde Figma con la ruta indicada en figma-assets.json.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const manifest = JSON.parse(
  await readFile(join(here, "figma-assets.json"), "utf8"),
);

let ok = 0;
let failed = 0;

for (const asset of manifest.assets) {
  const dest = join(root, asset.dest);
  try {
    const response = await fetch(asset.url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buffer);
    console.log(`✓ ${asset.dest}  (${(buffer.length / 1024).toFixed(0)} KB)`);
    ok += 1;
  } catch (error) {
    console.error(`✗ ${asset.dest}  — ${error.message}  [${asset.node}]`);
    failed += 1;
  }
}

console.log(`\n${ok} descargados, ${failed} fallidos.`);
if (failed > 0) {
  console.log(
    "Las URLs de Figma caducan a los ~7 días. Exporta a mano los que fallen,\n" +
      "respetando las rutas de scripts/figma-assets.json.",
  );
}
