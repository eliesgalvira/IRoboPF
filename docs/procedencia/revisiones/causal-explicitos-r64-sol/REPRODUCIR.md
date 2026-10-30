# Reproducción acotada

Ejecutar desde la base revisada; no aplicar nada al motor. Herramientas por Nix, dependencias existentes de `/home/elies/Repos/IRoboPF/node_modules` en lectura. Configuración propia: `.cache/causal-explicitos-r64-sol/vitest.mjs`, aliases explícitos, `cache:false`, `cacheDir` absoluto propio y un trabajador. No hay venv, instalación, servidor, build ni red externa.

Cada comando pesado se ejecutó con este prefijo (el lock cubre exclusivamente el comando):

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run
```

Añadir un archivo y las opciones `--configLoader native --config .cache/causal-explicitos-r64-sol/vitest.mjs --reporter=json --outputFile=<destino-propio-nuevo>`:

| Archivo | Resultado esperado | Alcance |
| --- | --- | --- |
| .cache/causal-explicitos-r64-sol/recibidos.test.ts | 0 | 25 casos/225 salidas recibidos y bloqueo por API real |
| .cache/causal-explicitos-r64-sol/propios.test.ts | 0 | Controles propios; reutiliza testigos propios ya pasados si existen, sin sumarlos dos veces |
| .cache/causal-explicitos-r64-sol/push-rojo.test.ts | **1** | Defecto R64-PUSH-01, longitudes `[1,1]` frente `[1,2]`, retorno sin pasos |
| .cache/causal-explicitos-r64-sol/schemas.test.ts | 0 | 25 testigos originales, 2 replays y colisión Ajv esperada entre R60/R62 |
| tests/causal-comun-r57.test.ts | 0 con filtro indicado | Dos regresiones, once omitidas |

Filtro de regresiones: `-t 'núcleo compartido.*2025/canonico|núcleo directo de retenciones'`. Para schemas añadir `NODE_PATH=/home/elies/Repos/IRoboPF/node_modules` al entorno. Ajv real 8.20.0, `strict:true`, sin coerción/defaults/eliminación de propiedades, `inlineRefs:false`; el mismo Ajv documental del encargo.

`ensayos-recibidos.mjs` conserva la receta recibida: solo cambia imports hacia los módulos reales y destino de artefactos hacia caché propia. Su carpeta se crea antes de invocarlo, como el test vigente corregido por el padre. No escribe la caché del autor. El archivo original revisado está preservado por hash en ORIGINALES.json.

Los dos rojos propios de arnés permanecen: primero se comparó indebidamente `procedencia` editorial; después se encontró una suma estatal manual errónea en la expectativa positiva. El cálculo independiente correcto a base 48.000 es `12450*.095 + 7750*.12 + 15000*.15 + 12800*.185 = 6730.75`. El diferencial racional positivo es `6730.75−527.25 + 3841.42+(48000−35425.68)*.174−5956.65*.085 = 11726.53643`. No se cambia el motor ni se toma el replay como expectativa. El cierre repite solo el caso aún fallido y los controles posteriores no alcanzados; coteja desde sus testigos los dieciséis ya pasados. Preimágenes por hash e incidencias en caché.

Los linters iniciales no resolvían módulos en este worktree sin node_modules. Se generan configuraciones propias conservando reglas y severidades, con plugins reales del padre cotejados byte a byte y rutas de imports explícitas. Un segundo intento carecía de Node en el shell Python; se conserva el exit 127 y se usa Nix con ambas herramientas. El fixture negativo propio exige rechazos de ambos plugins y las 16 reglas a error. No confundir el rojo esperado del fixture con una infracción aceptada en pruebas propias.

Para reconstruir la entrega se usa `.cache/causal-explicitos-r64-sol/entregar.py package` una sola vez, con Python de Nix. Es una reconstrucción de archivos nuevos desde preimágenes ausentes, patch LF `git diff --no-index --binary` (solo lectura VCS) y objetos. No crea checkout. El cotejo terminal es `flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 .cache/causal-explicitos-r64-sol/entregar.py physical`. No borrar salidas para repetirlo: no hay limpieza autorizada.
