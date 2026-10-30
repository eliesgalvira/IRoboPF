import fs from "node:fs"
import cp from "node:child_process"
import { createHash } from "node:crypto"
import { gzipSync } from "node:zlib"
import { pathToFileURL } from "node:url"
const base = "50f9e949544e20d3e4e0bffc79b926d396267319"
const sha = (b) => createHash("sha256").update(b).digest("hex")
export function ownPath(p) {
  return (
    p.startsWith(".cache/flujo-escalas-r36/") ||
    p.startsWith("docs/procedencia/implementaciones/flujo-escalas-r36-sol/") ||
    /^scripts\/procedencia\/flujo-escalas-r36[^/]*\.mjs$/.test(p) ||
    /^schemas\/procedencia\/flujo\/escalas-r36[^/]*\.schema\.json$/.test(p) ||
    /^tests\/flujo-escalas-r36[^/]*\.test\.ts$/.test(p)
  )
}
/** Cat-file se solicita solo después de consumir el blob anterior. */
export async function physical() {
  const head = cp.execFileSync("git", ["rev-parse", "HEAD"]).toString().trim()
  if (head !== base) throw Error("HEAD distinto")
  const rows = cp
    .execFileSync("git", ["ls-tree", "-rz", base], { maxBuffer: 20e6 })
    .toString()
    .split("\0")
    .filter(Boolean)
  const child = cp.spawn("git", ["cat-file", "--batch"])
  let buffer = Buffer.alloc(0),
    next
  child.stdout.on("data", (b) => {
    buffer = Buffer.concat([buffer, b])
    const i = buffer.indexOf(10)
    if (i < 0) return
    const size = Number(buffer.subarray(0, i).toString().split(" ")[2])
    if (buffer.length < i + size + 2) return
    const blob = buffer.subarray(i + 1, i + size + 1)
    buffer = buffer.subarray(i + size + 2)
    next(blob)
  })
  const entries = [],
    changes = [],
    paths = new Set()
  for (const row of rows) {
    const [meta, p] = row.split("\t"),
      [mode, , oid] = meta.split(" ")
    paths.add(p)
    const expected = await new Promise((resolve) => {
      next = resolve
      child.stdin.write(oid + "\n")
    })
    let s, data
    try {
      s = fs.lstatSync(p)
      data = s.isSymbolicLink()
        ? Buffer.from(fs.readlinkSync(p))
        : fs.readFileSync(p)
    } catch (e) {
      changes.push({ path: p, error: String(e) })
      continue
    }
    const same =
      expected.equals(data) &&
      (mode === "120000") === s.isSymbolicLink() &&
      (s.isSymbolicLink() || (mode === "100755") === !!(s.mode & 0o111))
    const record = {
      path: p,
      oid,
      mode,
      size: data.length,
      sha256: sha(data),
      baseSha256: sha(expected),
      same
    }
    entries.push(record)
    if (!same) changes.push(record)
  }
  child.stdin.end()
  const additions = [],
    unexpected = []
  function walk(dir) {
    for (const n of fs.readdirSync(dir)) {
      const p = dir === "." ? n : dir + "/" + n
      if (p === ".git") continue
      const s = fs.lstatSync(p)
      if (s.isDirectory()) walk(p)
      else if (!paths.has(p)) {
        additions.push(p)
        if (!ownPath(p)) unexpected.push(p)
      }
    }
  }
  walk(".")
  const diff = cp
    .execFileSync("git", ["diff", base, "--"], { maxBuffer: 20e6 })
    .toString()
  const result = {
    head,
    base,
    entries: entries.length,
    records: entries,
    changes,
    additions,
    unexpected,
    diff,
    deleted: changes.filter((c) => "error" in c),
    method:
      "lstat/readlink/bytes/executable; cat-file --batch serial one blob at a time; full physical walk"
  }
  if (rows.length !== 20227 || changes.length || unexpected.length || diff)
    throw Error(JSON.stringify({ ...result, records: undefined }))
  return result
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const result = await physical()
  fs.writeFileSync(
    "docs/procedencia/implementaciones/flujo-escalas-r36-sol/fisico-final.json.gz",
    gzipSync(JSON.stringify(result))
  )
  console.log(
    JSON.stringify({
      ...result,
      records: undefined,
      additions: result.additions.length
    })
  )
}
