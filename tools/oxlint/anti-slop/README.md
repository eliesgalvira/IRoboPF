# Runtime anti-slop incorporado

Fuente: [dmmulroy/anti-slop v0.1.2](https://github.com/dmmulroy/anti-slop/tree/e8c4880471b23ab7f216fba7b27d173a6ef07d4c), de Dillon Mulroy, licencia MIT conservada en LICENSE. Consultado el 29 de octubre de 2026 por API HTTP y descarga del archivo de esa revisión, sin clonar.

Se verificaron el objeto del tag anotado `bbf64a096fd02585ce3e547406602e6be23f621e`, su destino `e8c4880471b23ab7f216fba7b27d173a6ef07d4c` y el campo `version: 0.1.2` de package.json. No se afirma que sea la última versión disponible. Oxlint y @oxlint/plugins usan exactamente 1.78.0, la pareja declarada por esa revisión.

Solo se copia `src/**/*.ts` excluyendo `*.test.ts`: 23 archivos de runtime. No se incorporan tests, instrucciones de agentes ni skill upstream. PROVENANCE.json registra SHA-256 de cada archivo original y local.

Se examinó [Celda](https://github.com/eliesgalvira/celda/tree/b8018bb120841627bd8f0f8dd79bd1c4fb16127a), su README del plugin, shared/dictionary-types.ts y vite.config.ts. Se adopta su adaptación de `unsafeMembers[0]` a `unsafeMembers[0] ?? null`, compatible con `noUncheckedIndexedAccess`. Es la única modificación del runtime. No se adoptan sus omisiones de no-shape-in-symbol-names ni del helper isPopulatedObjectExpression: aquí se conserva el runtime completo. Tampoco se incorpora la extensión de no-module-mocking a @effect/vitest: conserva el comportamiento upstream; esta limitación debe tenerse presente al revisar tests.

El código de terceros se excluye del lint de la aplicación, como en Celda, y se comprueba con `tools/oxlint/tsconfig.json`, con strict y noUncheckedIndexedAccess. Ese proyecto permite imports con extensión .ts y no aplica las políticas arquitectónicas Effect de la aplicación al analizador ESTree. `bun run typecheck` ejecuta ambos proyectos. No se excluyen fuentes propias del análisis.
