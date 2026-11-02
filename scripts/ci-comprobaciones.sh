#!/usr/bin/env bash
# Mismos comandos en CI y en exportación limpia; una tarea pesada a la vez.
set -euo pipefail
bun run test:lint
bun run lint
bun run typecheck
bun run test:ci
bun run test tests/puertos-composicion-r47.test.ts tests/puertos-r52.test.ts --maxWorkers=1
bun run test tests/cotizaciones-perfil-uniforme.test.ts tests/*-procedencia.test.ts --exclude tests/evidencia-contenido-procedencia.test.ts --maxWorkers=1
bun run test tests/retenciones-versionadas.test.ts tests/trabajo-anual-contratos.test.ts tests/actividades-economicas-2025.test.ts tests/deducciones-contratos.test.ts tests/deducciones-ambito.test.ts tests/deducciones-conjunta-identidad.test.ts tests/calculo-salario-neto-irpf.test.ts --maxWorkers=1
bun run test tests/conexion-anual.test.ts tests/retirada-rutas.test.ts tests/motor-unico-revision.test.ts tests/minimos-derechos.test.ts tests/retenciones-derechos.test.ts tests/liquidacion-irpf-anual.test.ts tests/correcciones-x-solidaridad.test.ts --maxWorkers=1
bun run inventario:verificar
bun run test:inventario
bun run test --config scripts/procedencia/contenido-vitest.mjs
bun scripts/procedencia/contenido-verificar.mjs --fixture
bun scripts/procedencia/rastro-verificar.mjs --fixture
bash tools/procedencia/run.sh tests/procedencia-corpus_test.py
bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py
bash scripts/procedencia/deducciones-2025/verificar.sh --lotes docs/procedencia/deducciones-2025/lotes --modo completo
bun scripts/procedencia/verificar-enlaces.mjs --fixture
bun run test tests/evidencia-contenido-procedencia.test.ts --maxWorkers=1
bun run test tests/publicacion-evidencia.test.ts --maxWorkers=1
bun tests/cas-local-r27.mjs
printf '%s\n' 'OMITIDO: ensayo histórico del corpus completo CAS. Ejecutar suite local explícita; esto no acredita ese corpus.'
