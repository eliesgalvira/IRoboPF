# Reproducción

Base: eaed990c620b5fc4d3ff2e74dc68e0c8481c43db. Solo lecturas Git. Salida absoluta: /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/redondeos-legacy-v1.

Contraste completo (una ejecución; Python lee ZIP/XML en streaming, Bun compara un generador por hoja):

```sh
NODE_PATH=/home/elies/Repos/IRoboPF/node_modules nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bash -c 'ulimit -v 5000000; export NODE_OPTIONS=--max-old-space-size=1536; bun /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/redondeos-legacy-v1/contrast.mjs'
```

Salida: contraste.log, resultados.json (se persiste cada hoja), hashes-excel-independientes.json (solo al terminar). El parser resuelve relaciones reales del workbook, exige celdas contiguas y rechaza fórmulas/tipos desconocidos. No utiliza ExcelJS ni el motor para producir los valores esperados. El motor solo produce el lado observado. Cada fila DAT exige salario 0–100000 consecutivo; las cabeceras se comparan exactamente y se conserva la dimensión XML. La serialización canónica se implementa separadamente con la misma definición del helper: r:longitud, salto de línea, n:Math.round(Number(valor.toFixed(2))*100) o s:longitudUTF16:texto, separador U+001F por celda y salto de línea final; SHA-256 separado de cabecera y datos. No se introduce epsilon ni tolerancia de céntimo. Los desacuerdos binary64 crudos se cuentan aparte: no son necesariamente errores monetarios.

Validación acotada, secuencial y bajo el mismo lock:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 nixpkgs#uv nixpkgs#gcc nixpkgs#zlib -c flock /tmp/irobopf-validacion-pesada.lock bash /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/redondeos-legacy-v1/validar.sh
```

validacion/ conserva copia de lib, cuatro tests y dependencias de pruebas, configuración de base con include limitado y sin incremental, enlaces de lectura a node_modules y documentación del checkout base. No es un worktree ni una entrega de código para integrar. No ejecutar tests desde la raíz del padre mutable. No se usa el programa Python general, que escribiría otro Excel. boundaries.py compila solo las tres funciones originales y sustituye contenedor e iterable; fija NumPy 2.5.4 con uv sin instalar globalmente.

Las pruebas rojas nuevas son `bun rojos.mjs`, una vez terminado el contraste. Contrastan hashes extraídos contra el fixture antiguo y el motor observado; no vuelven a recorrer el libro ni regeneran oracles.

El primer validar.sh se conserva como comando histórico y reproduce los errores de entorno/ruta de lint descritos en INFORME.md. El pase final correcto de lint, bajo lock y en `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 nixpkgs#ruff`, se ejecutó desde la carpeta de entrega:

```sh
validacion/node_modules/.bin/oxlint -c validacion/.oxlintrc.json contrast.mjs check-boundaries.mjs rojos.mjs validacion/lib/dominio/compatibilidad-legacy validacion/tests/*.ts
validacion/node_modules/.bin/eslint --config validacion/eslint.config.mjs contrast.mjs check-boundaries.mjs rojos.mjs validacion/lib/dominio/compatibilidad-legacy validacion/tests/*.ts
ruff check --no-cache stream.py boundaries.py metadata.py
```

La aserción adicional `NODE_PATH=/home/elies/Repos/IRoboPF/node_modules bun rojo-fuera-rango.mjs` debe salir con código 1: demuestra RLV1-03, no una regresión de DAT. Los controles de ese script y empaquetar.py quedan en extras-*.log. `empaquetar.py` genera el parche y manifiesto bajo el mismo lock; no incluye validacion/ ni sigue sus enlaces.
