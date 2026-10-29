import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import antiSlop from "../../../../tools/oxlint/anti-slop/index.ts"
import effect from "../../../../tools/oxlint/anti-slop/effect/index.ts"

const config = JSON.parse(readFileSync(".oxlintrc.json", "utf8"))
for (const [prefix, plugin] of [["anti-slop", antiSlop], ["anti-slop-effect", effect]]) {
  for (const name of Object.keys(plugin.rules)) {
    assert.equal(config.rules[`${prefix}/${name}`], "error", `${prefix}/${name}`)
  }
}
assert.equal(Object.keys(config.rules).length, 16)
const directory = mkdtempSync(join(tmpdir(), "irobopf-lint-"))
try {
  const fixture = join(directory, "sample.ts")
  // Texto deliberadamente inválido para comprobar ambos plugins, sin ejecutar Effect.
  writeFileSync(fixture, 'import { makeExample } from "./example.ts";\nexport function accept(value: unknown) { return value; }\n')
  const fixtureConfig = join(directory, "oxlint.json")
  writeFileSync(fixtureConfig, JSON.stringify({ ...config, ignorePatterns: [], jsPlugins: config.jsPlugins.map((file) => resolve(file)) }))
  const result = spawnSync(resolve("node_modules/.bin/oxlint"), ["--threads=1", "--disable-nested-config", "--no-ignore", "--config", fixtureConfig, "--format", "json", fixture], { encoding: "utf8" })
  assert.equal(result.status, 1, result.stderr)
  console.log(result.stdout)
  console.error(result.stderr)
  const codes = JSON.parse(result.stdout).diagnostics.map((item) => item.code)
  assert.ok(codes.includes("anti-slop(no-unknown-parameters)"))
  assert.ok(codes.includes("anti-slop-effect(no-service-constructor-imports)"))
  console.log("16 reglas a error; ambos plugins cargan y rechazan el fixture.")
} finally {
  rmSync(directory, { recursive: true, force: true })
}
