#!/usr/bin/env bash
set -eu
out=docs/procedencia/implementaciones/publicacion-evidencia
bun x prettier --write lib/procedencia/modelo.ts lib/procedencia/almacen.ts lib/procedencia/ficha.tsx lib/procedencia/http.ts lib/procedencia/io.mjs scripts/procedencia/contenido-publicar.mjs scripts/procedencia/contenido-verificar.mjs scripts/procedencia/evidencia-contenido.mjs scripts/procedencia/explicacion-version.mjs 'app/procedencia/[snapshot]/[id]/[revision]/route.ts' 'app/procedencia/[snapshot]/objetos/[hash]/route.ts' tests/publicacion-evidencia.test.ts > "$out/formato.log" 2>&1
bun -e 'import { Schema } from "effect"; import { Snapshot } from "./lib/procedencia/modelo.ts"; import { writeFileSync } from "node:fs"; const d=Schema.toJsonSchemaDocument(Snapshot); writeFileSync("schemas/procedencia/contenido/snapshot.schema.json", JSON.stringify({$schema:"https://json-schema.org/draft/2020-12/schema", ...d.schema, $defs:d.definitions})+"\n")'
bun run typecheck > "$out/typecheck-final.log" 2>&1
bun run lint > "$out/lint-final.log" 2>&1
bun run test:lint > "$out/anti-slop.log" 2>&1
bun x vitest run tests/publicacion-evidencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts --maxWorkers=1 > "$out/pruebas-final.log" 2>&1
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1 > "$out/contenido-historico.log" 2>&1
