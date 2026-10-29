# Reproducción

Ejecutar desde la raíz de este checkout. No ejecutar empaquetadores históricos: escriben en entregas ajenas. Todos los scripts aquí son propios; los recibidos solo se cargan con OUT/SCRATCH redirigidos en memoria.

1. Recepción y cierre: `flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 docs/procedencia/revisiones/preservacion-r23-sol/arbol.py docs/procedencia/revisiones/preservacion-r23-sol/arbol-inicio.json.gz` (al cierre cambiar el nombre de salida). Requiere el HEAD exacto y las 14.957 entradas; compara un blob cada vez. Se registran también `git diff --stat HEAD` y `git diff --name-only --diff-filter=D HEAD`. Son lecturas, sin cambios de índice.
2. `bash docs/procedencia/revisiones/preservacion-r23-sol/ejecutar.sh`: anterior y actual, schema correspondiente, expectativas históricas sin cambios, matriz independiente, diez heredados, 24 inyecciones fsync, rutas/TGSS, los dos instrumentos R23 y bytes/verify reales de las dos copias v3. `codigos.log` registra el estado del reproductor; consultar los fallos protectores antiguos en anterior.log.
3. `PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r23-sol/uv" UV_CACHE_DIR="$PWD/.cache/preservacion-r23-sol/uv-cache" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-r23-sol/fronteras.py`: los 14 patrones contra ambas versiones, escape JSON equivalente y eventos distintos en ambos órdenes.
4. `bash docs/procedencia/revisiones/preservacion-r23-sol/calidad.sh`: Ruff, mypy, regresiones Python, runtime oxlint con 16 reglas a error y verificación de 36 snapshots. La lista exacta del alcance y flags están en el script. El runtime de lint copia configuración/vendor propios a scratch y enlaza node_modules del padre en lectura. El programa auxiliar coteja cada archivo copiado. No representa lint ni typecheck global de la app.
5. Tras terminar toda escritura, ejecutar entregar.py mediante run.sh con el entorno propio y lock pesado. Produce manifiesto, patch gzip de altas y binarios por ruta/hash. Los tres derivados se excluyen de su propio manifiesto por autorreferencia. No se genera commit ni se modifica ningún original. Los logs de cierre indican por separado la calidad efectivamente obtenida.

Si un primer pase de herramientas señala errores propios, sus logs se conservan y el pase corregido lleva nombre diferente. Nunca se cambian expectativas funcionales ni código del producto para hacer verde. Ningún comando collect/export/restore/confirm se dirige al histórico: confirm/transfer se ejercitan exclusivamente en fixtures propios y verify lee los paquetes reales entregados.

`calidad-final.sh` da formato exclusivamente a los instrumentos nuevos y ejecuta Ruff, mypy de todos los Python propios y fronteras otra vez. No toca código revisado ni esperados. Los entornos uv y cachés quedan fuera del paquete de entrega. El paso de formato es una mutación local rutinaria de instrumentos propios; no es un fix de los hallazgos revisados.

`repetir.sh` conserva los flags de mypy sobre cinco fuentes revisadas y todos los Python propios, comprueba Ruff del mismo alcance y fronteras tras las anotaciones. Verifica los 36 snapshots con `NODE_PATH=/home/elies/Repos/IRoboPF/node_modules` y `bun --no-install`. Los primeros diagnósticos y el fallo de resolución quedan en logs anteriores. Esta corrección de entorno no rebaja el contrato de verificación.

La resolución NODE_PATH no basta en este runtime. El pase final de snapshots usa:

```bash
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun --no-install --tsconfig-override "$PWD/docs/procedencia/revisiones/preservacion-r23-sol/tsconfig-runtime.json" docs/procedencia/revisiones/preservacion-r23-sol/historicos.mjs
```

El mapa solo apunta a Effect, TypeScript y Decimal del node_modules del padre, en lectura. Se conserva el intento fallido del hook de resolución y el del tsconfig sin Decimal. `ultimo.sh` comprueba Ruff, mypy de diez fuentes y oxlint; `cerrar.sh` refresca pins/runtime, comprueba el JavaScript final y repite fronteras. Ningún verificador de producto se modifica. Los distintos scripts/logs son intentos documentados de entorno y anotación; no son pruebas independientes que deban sumarse.

El pase exitoso de snapshots termina 0 y deja historicos.json después de completar el bucle. Bun imprime un aviso interno de directory mismatch que se conserva en historicos-final.log. No se filtró ni se silenció. Los diez ficheros Python del último mypy y los flags se pueden consultar en ultimo.sh/mypy-ultimo.log. El fichero de configuración propio resuelve dependencias; no es la configuración de tipos de la aplicación.
