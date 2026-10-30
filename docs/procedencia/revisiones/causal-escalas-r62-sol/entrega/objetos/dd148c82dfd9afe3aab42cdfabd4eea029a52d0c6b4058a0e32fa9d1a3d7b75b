import fs from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
/** Archivador documental síncrono de ensayos; no calcula salidas financieras. */
export function saveCase(caso, contexto, evidence) {
  const bytes = gzipSync(JSON.stringify({ caso, contexto, evidence }));
  const hash = createHash("sha256").update(bytes).digest("hex");
  const folder = ".cache/causal-escalas-r60-sol/testigos";
  fs.mkdirSync(folder, { recursive: true });
  const file = folder + "/" + hash + ".json.gz";
  if (fs.existsSync(file)) {
    if (!fs.readFileSync(file).equals(bytes)) throw Error("Objeto de testigo distinto");
  } else fs.writeFileSync(file, bytes);
  return file;
}
export function saveFrontierIndex(records) {
  fs.writeFileSync(".cache/causal-escalas-r60-sol/fronteras-actuales.json", JSON.stringify({ records }, null, 2) + "\n");
}
