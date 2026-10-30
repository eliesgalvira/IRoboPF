import fs from "node:fs"
import path from "node:path"
import cp from "node:child_process"
import { createHash } from "node:crypto"
import { gzipSync } from "node:zlib"
const out = "docs/procedencia/implementaciones/flujo-escalas-r36-sol",
  sha = (b) => createHash("sha256").update(b).digest("hex")
const excluded = new Set([
  out + "/MANIFIESTO.json",
  out + "/entrega.patch.gz",
  out + "/BINARIOS.json",
  out + "/transporte.json"
])
const files = []
function scan(dir) {
  for (const n of fs.readdirSync(dir)) {
    const p = dir + "/" + n
    if (fs.lstatSync(p).isDirectory()) scan(p)
    else if (!excluded.has(p)) files.push(p)
  }
}
scan(out)
for (const dir of ["scripts/procedencia", "schemas/procedencia/flujo", "tests"])
  for (const n of fs.readdirSync(dir))
    if (
      /^(flujo-escalas-r36.*\.(mjs|test\.ts)|escalas-r36.*\.schema\.json)$/.test(
        n
      )
    )
      files.push(dir + "/" + n)
files.sort()
const manifest = [],
  binary = [],
  patch = []
for (const file of files) {
  const b = fs.readFileSync(file)
  manifest.push({
    path: file,
    sha256: sha(b),
    size: b.length,
    baseSha256: null
  })
  if (file.endsWith(".gz") || b.length === 0) {
    binary.push(manifest.at(-1))
    continue
  }
  const diff = cp.spawnSync(
    "git",
    ["diff", "--no-index", "--", "/dev/null", file],
    { maxBuffer: 20e6 }
  )
  if (diff.status !== 1) throw Error("Diff no textual " + file)
  patch.push(diff.stdout)
}
const patchBytes = Buffer.concat(patch),
  scratch = path.resolve(".cache/flujo-escalas-r36/transporte-" + Date.now())
fs.mkdirSync(scratch, { recursive: true })
for (const r of manifest)
  fs.mkdirSync(path.dirname(path.join(scratch, r.path)), { recursive: true })
const trial = cp.spawnSync("patch", ["-p1", "--batch", "-d", scratch], {
  input: patchBytes,
  maxBuffer: 20e6
})
if (trial.status !== 0) throw Error(trial.stdout + "\n" + trial.stderr)
for (const b of binary) fs.copyFileSync(b.path, path.join(scratch, b.path))
for (const r of manifest) {
  const b = fs.readFileSync(path.join(scratch, r.path))
  if (b.length !== r.size || sha(b) !== r.sha256)
    throw Error("Transporte distinto " + r.path)
}
fs.writeFileSync(out + "/entrega.patch.gz", gzipSync(patchBytes))
fs.writeFileSync(out + "/BINARIOS.json", JSON.stringify(binary, null, 2) + "\n")
fs.writeFileSync(
  out + "/transporte.json",
  JSON.stringify(
    {
      status: "pass",
      files: manifest.length,
      scratch,
      method:
        "GNU patch -p1 and binary copy by path/hash; compare every reconstructed file",
      fiscalAcceptance: false
    },
    null,
    2
  ) + "\n"
)
for (const file of ["entrega.patch.gz", "BINARIOS.json", "transporte.json"]) {
  const p = out + "/" + file,
    b = fs.readFileSync(p)
  manifest.push({ path: p, sha256: sha(b), size: b.length, baseSha256: null })
}
fs.writeFileSync(
  out + "/MANIFIESTO.json",
  JSON.stringify(
    {
      head: cp.execFileSync("git", ["rev-parse", "HEAD"]).toString().trim(),
      base: "50f9e949544e20d3e4e0bffc79b926d396267319",
      files: manifest,
      excluded: [
        "MANIFIESTO.json self-reference",
        ".cache/flujo-escalas-r36/**"
      ],
      changesToBase: [],
      deleted: []
    },
    null,
    2
  ) + "\n"
)
console.log(
  JSON.stringify({ files: manifest.length, transport: "pass", scratch })
)
