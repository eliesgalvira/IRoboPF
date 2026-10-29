# Uso de lint y deuda del bootstrap

Fecha: 29 de octubre de 2026. Base: c45060d5. Esta instalación no valida ninguna cifra fiscal.

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

Para un lote: `bun run lint:oxlint ruta/al/archivo.ts` y `bunx eslint ruta/al/archivo.ts`. El script lint:eslint ya incluye el directorio completo; usar el segundo comando para análisis focalizado. Antes de escribir Effect ejecutar `bunx effect-solutions list`, `bunx effect-solutions show <temas>` y consultar la fuente local v4. En este bootstrap no se ha escrito ni modificado código Effect de aplicación.

## Salidas observadas

- `bun run test:lint`: código 0; las 16 reglas están a error; los dos plugins rechazan un fixture temporal. No incorpora tests upstream.
- `bun run typecheck`: código 0, tanto aplicación con diagnósticos Effect como runtime del plugin con strict y noUncheckedIndexedAccess.
- `bun run test:ci`: código 0; 2 archivos, 5 pruebas, 554 ms en la ejecución registrada.
- ESLint: código 0, sin diagnósticos.
- `bun run lint`: código 1 por anti-slop; 96 errores en 25 archivos, todos anteriores al bootstrap. Ningún archivo nuevo propio aparece en el informe.
- No se ejecutaron build, suite completa ni suites legacy pesadas. CI configurada, todavía no ejecutada remotamente.

La primera comprobación de tipos no pudo arrancar porque no había node_modules (tsc ausente). Se restauraron dependencias mediante Bun. La incorporación inicial del vendor produjo errores nuevos por extensiones .ts y políticas Effect aplicadas a ESTree; quedaron resueltos con el proyecto separado, sin tocar la política del motor. No se observaron errores de tipos propios pendientes en la comprobación final. No se presenta la primera ejecución fallida como baseline verde.

## Reparto de trabajo

Asignar archivos completos, no una regla por editor: varios diagnósticos afectan a la misma expresión. El TSV agrupa por regla y archivo; el JSON contiene mensaje y posición. Separar lotes de UI, importación/exportación y scripts, observabilidad, y dominio fiscal. Evitar cambios simultáneos de un archivo.

La mayor parte exige justificar invariantes de aserciones o definir contratos de entrada; un reemplazo masivo no sería una corrección mecánica segura. Las correcciones del motor deben preservar comportamiento y llevar pruebas pertinentes. No añadir SAFETY vacío ni convertir checks en casts. No relajar reglas. Nueva implementación debe pasar lint focalizado; el responsable de integración regenera el mapa y exige que no crezca la deuda.

El orquestador puede iniciar auditorías documentales ahora, integrar y respaldar este cambio, y abrir un lote específico de deuda. El bloqueo de instalación se ha levantado; la deuda global sigue abierta. No hubo push, PR, despliegue ni movimiento de bookmarks por este editor.
