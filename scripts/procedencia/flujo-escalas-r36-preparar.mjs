import fs from "node:fs"
import path from "node:path"
const root = process.cwd(),
  cache = root + "/.cache/flujo-escalas-r36"
fs.cpSync("tools/oxlint", cache + "/oxlint", { recursive: true })
try {
  fs.symlinkSync(
    root + "/node_modules",
    cache + "/node_modules",
    "dir"
  )
} catch (e) {
  if (e.code !== "EEXIST") throw e
}
const conf = JSON.parse(fs.readFileSync(".oxlintrc.json", "utf8"))
conf.jsPlugins = conf.jsPlugins.map((p) =>
  path.join(cache, "oxlint", p.split("/").slice(3).join("/"))
)
conf.ignorePatterns = []
fs.writeFileSync(cache + "/oxlint.json", JSON.stringify(conf))
const files = fs
  .readdirSync("scripts/procedencia")
  .filter((n) => n.startsWith("flujo-escalas-r36") && n.endsWith(".mjs"))
  .map((n) => root + "/scripts/procedencia/" + n)
fs.writeFileSync(
  cache + "/tsconfig.json",
  JSON.stringify(
    {
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        noEmit: true,
        noImplicitAny: false,
        strict: false,
        target: "ES2023",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        skipLibCheck: true,
        baseUrl: root,
        paths: {
          "decimal.js": [
            root + "/node_modules/decimal.js/decimal.d.ts"
          ],
          effect: [
            root + "/node_modules/effect/dist/index.d.ts"
          ],
          typescript: [
            root + "/node_modules/typescript/lib/typescript.d.ts"
          ]
        },
        typeRoots: [root + "/node_modules/@types"]
      },
      files
    },
    null,
    2
  )
)
const types = JSON.parse(fs.readFileSync(cache + "/tsconfig.json", "utf8"))
types.compilerOptions = {
  ...types.compilerOptions,
  module: "ESNext",
  moduleResolution: "Bundler",
  strict: true,
  noImplicitAny: false,
  checkJs: false
}
types.files = [root + "/tests/flujo-escalas-r36.test.ts"]
fs.writeFileSync(cache + "/tsconfig-tests.json", JSON.stringify(types, null, 2))
fs.writeFileSync(
  cache + "/vitest.mjs",
  `import {defineConfig} from '${root}/node_modules/vitest/dist/config.js';export default defineConfig({cacheDir:'${cache}/vite',test:{cache:false,include:['tests/flujo-escalas-r36*.test.ts'],maxWorkers:1},resolve:{alias:{'decimal.js':'${root}/node_modules/decimal.js/decimal.mjs',effect:'${root}/node_modules/effect/dist/index.js'}}})`
)
