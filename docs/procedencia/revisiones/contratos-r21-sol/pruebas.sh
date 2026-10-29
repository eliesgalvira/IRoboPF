#!/usr/bin/env bash
set -u
out=docs/procedencia/revisiones/contratos-r21-sol
run() {
  local name="$1"
  shift
  "$@" > "$out/$name.log" 2>&1
  local code=$?
  printf '%s %s\n' "$name" "$code" | tee -a "$out/codigos.log"
}
run historico-01-02 node --test --test-concurrency=1 .cache/contratos-r21-sol/adversos-old.test.mjs
run historico-03 bun .cache/contratos-r21-sol/software-old.mjs
run actuales-01-02 node --test --test-concurrency=1 docs/procedencia/revisiones/contratos-publicacion-r19-sol/adversos-node.test.mjs tests/ambito-publicado.test.mjs
run actuales-03 bun "$out/software.mjs"
run software-tests bun test tests/software-recibo.test.mjs
run rutas bun "$out/rutas.mjs"
