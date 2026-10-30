# Uso de lint y deuda del bootstrap

Guía de ejecución de lint. La instantánea inicial de deuda corresponde al 29 de octubre de 2026, base `c45060d5`; no representa los diagnósticos del árbol actual. Lint no valida cifras fiscales.

## Reproducción

Desde la raíz, entrar en `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#ripgrep`. Se usaron Bun 1.3.13, oxlint y @oxlint/plugins 1.78.0. No hay instalaciones globales.

```sh
bun install --frozen-lockfile
bun run test:lint
bun run lint
bun run typecheck
bun run test:ci
bun scripts/lint-report.mjs
```

Ejecutar de uno en uno y comprobar `free -m` antes de trabajos pesados. El último comando regenera `lint/diagnosticos.json` y `lint/por-regla-archivo.tsv`; devuelve 1 si hay errores, no oculta el fallo. El informe es una instantánea, no una lista de exclusiones.

Para un lote: `bun run lint:oxlint ruta/al/archivo.ts` y `bunx eslint ruta/al/archivo.ts`. El script lint:eslint ya incluye el directorio completo; usar el segundo comando para análisis focalizado. Antes de escribir Effect ejecutar `bunx effect-solutions list`, `bunx effect-solutions show <temas>` y consultar la fuente local v4.

## Salidas observadas

La instantánea de bootstrap conservó 96 errores anti-slop en 25 archivos, con ESLint, typecheck y pruebas de lint correctos. Es un antecedente histórico de `LINT-CORRECCION.md`, no una deuda vigente. Regenerar el informe para conocer el estado del árbol examinado. El ensayo del plugin exige las 16 reglas a error y que ambos plugins rechacen el fixture negativo.

## Reparto de trabajo

Asignar archivos completos, no una regla por editor: varios diagnósticos afectan a la misma expresión. El TSV agrupa por regla y archivo; el JSON contiene mensaje y posición. Separar lotes de UI, importación/exportación y scripts, observabilidad, y dominio fiscal. Evitar cambios simultáneos de un archivo.

La mayor parte exige justificar invariantes de aserciones o definir contratos de entrada; un reemplazo masivo no sería una corrección mecánica segura. Las correcciones del motor deben preservar comportamiento y llevar pruebas pertinentes. No añadir SAFETY vacío ni convertir checks en casts. No relajar reglas. Nueva implementación debe pasar lint focalizado; el responsable de integración regenera el mapa y exige que no crezca la deuda.
