# Reproducción

Directorio de ejecución: `/home/elies/.t3/worktrees/IRoboPF/t3-962091d9`, base c61a306107f280c399eb57e57a7c45452bd68864. Los instrumentos importan producto desde process.cwd(); las dependencias se resuelven desde su carpeta en la raíz del padre. Para repetir contra otra raíz, cambiar solamente el directorio de ejecución, sin copiar producto ni tocar originales.

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/coherencia-ipc-v1/sondeos.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/coherencia-ipc-v1/contrapruebas.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun run test tests/retenciones-coherencia-procedencia.test.ts tests/retenciones-versionadas.test.ts tests/retenciones-entradas-procedencia.test.ts tests/retencion-trabajo-aeat.test.ts tests/deducciones-ambito.test.ts tests/deducciones-contratos.test.ts tests/ipc-escenarios-procedencia.test.ts tests/auditoria-progresividad-frio.test.ts tests/auditoria-excel.test.ts --maxWorkers=1
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun run lint
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/tsc --noEmit --incremental false
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/tsc --noEmit -p tools/oxlint/tsconfig.json --incremental false
nix shell nixpkgs#bun nixpkgs#nodejs -c node_modules/.bin/oxlint -c .oxlintrc.json /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/coherencia-ipc-v1/sondeos.mjs /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/coherencia-ipc-v1/contrapruebas.mjs
```

Resultados reales: 134 tests correctos; 348 sondeos correctos; contrapruebas 73 correctas y tres discrepancias legacy conservadas. Los instrumentos imprimen resultados y resumen, no fallan el proceso por cada discrepancia. Lint/tipos sin diagnósticos; no Next build.

Integridad: lecturas Git únicamente (`rev-parse HEAD`, `ls-tree -r BASE`, `cat-file --batch`); cada blob base cotejado por bytes y SHA-256 contra disco. Verificación con Python estándar desde Nix, sin dependencias añadidas. Se parsearon todos los JSON de las seis carpetas y se registró hash/tamaño de sus 87 archivos. CSV INE leído con csv.DictReader, delimitador `;`, UTF-8-SIG; filtro Índice general / Variación anual / M12. Decimal Python, precisión 40, producto 2013–2025. Los 42 localPath del manifiesto previo se reabrieron, hashearon y cotejaron en tamaño. Salidas: base-verificada.json, lecturas-inventario.json e ipc-original.json.
