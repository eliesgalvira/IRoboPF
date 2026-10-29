# Reproducción de la revisión R21 Sol

Desde la raíz del checkout, HEAD `960773f909d4ecff290edfa3d7a7b2699a8445d3`.

`bash docs/procedencia/revisiones/preservacion-r21-sol/ejecutar.sh` reproduce los diez métodos (ocho históricos y dos nuevos), la matriz estructural, cada llamada fsync de una transferencia real pequeña y la carga/verificación de las dos copias reales. `adicionales.sh` conserva los nuevos rojos y comprueba prefijos/URLs/clasificación. `calidad.sh` ejecuta Ruff, mypy de las cinco fuentes documentadas por el padre, oxlint y las 19 regresiones de preservación. Los códigos se conservan separados; no se transforman los fallos protectores en expectativas permisivas.

Todos usan `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador, `UV_PROJECT_ENVIRONMENT` absoluto en `.cache/preservacion-r21-sol/uv`, `UV_CACHE_DIR` propio y `PYTHONDONTWRITEBYTECODE=1`. run.sh proporciona Python mediante Nix. Las importaciones históricas se configuran dentro de Python y se redirige únicamente la variable SCRATCH del instrumento importado a la carpeta propia antes de importar sus pruebas. No se modifica ningún archivo histórico ni se ejecuta su auditoría CLI.

Cotejo físico inicial/final:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python3 docs/procedencia/revisiones/preservacion-r21-sol/arbol.py docs/procedencia/revisiones/preservacion-r21-sol/arbol-cierre.json.gz
```

`arbol.py` consulta ls-tree y un blob cada vez con cat-file, coteja lstat y readlink/bytes de todas las entradas, y conserva SHA256 base/actual. VCS es exclusivamente lectura: rev-parse, ls-tree, cat-file y diff; no se inicializa Jujutsu ni se modifica índice, commits o bookmarks.

Las acciones reales llaman `load()` y `verify()` de la API importada, nunca collect/export/confirm ni el CLI que guarda recibos junto a los históricos. Las transferencias y confirmaciones adversariales escriben únicamente fixtures en destinos nuevos dentro del scratch propio. No se repite la restauración de 1 GB: ya existe una restauración independiente completa en R19, y esta corrección requiere comprobar rechazo de entrada y recuperación de durabilidad, ejercitados contra la API real con objetos pequeños. Los ficheros reales se releen secuencialmente y se comprueban además con hashlib propio por ambos hashes y tamaño.

No se crean TypeScript/Effect ni nuevas dependencias del producto. No se afirma un chequeo nuevo del tipado de la aplicación. Nix/uv pueden preparar herramientas en cachés; no hay adquisición documental ni transferencia del corpus. Los 35 endpoints se cotejan sin acceder a la red.

Calidad adicional: `finales.sh` conserva el primer mypy de los instrumentos propios. `repetir-calidad.sh` comprueba las anotaciones corregidas de esta revisión, repite los diez controles tras reorganizar únicamente la importación histórica y reproduce el complemento de privacidad. Este último debe terminar rojo mientras el consumidor exponga el puerto inválido recibido. Los cuatro subcasos de required añadidos por el complemento deben pasar.

La invocación inicial de oxlint desde la raíz falla porque este checkout no tiene node_modules y Node no resuelve @oxlint/plugins desde el runtime local. No se crea un enlace en la raíz, fuera de la propiedad asignada. `lint_runtime.py` prepara un destino nuevo `.cache/preservacion-r21-sol/lint-runtime1`, copia solo configuración y runtime de lint, coteja byte a byte la copia y enlaza node_modules del padre en solo lectura. Oxlint se ejecuta allí con `--threads=1 --disable-nested-config smoke.ts`. Es un control de carga de plugins/configuración; no se anuncia como lint global de la aplicación. Ruff y mypy son los controles de los scripts Python del alcance. Para repetir la preparación se debe usar otro nombre de destino, sin eliminar el anterior.

Las recetas iniciales se conservan aunque fallen por el entorno o por los candidatos; consultar los códigos de cada log, no solo el exit final del shell que imprime códigos. No hay excepciones nuevas de lint ni supresión de diagnósticos de producto.
