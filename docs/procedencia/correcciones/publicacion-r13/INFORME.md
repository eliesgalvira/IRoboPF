# Correcciones de publicación y coherencia comparable

Trabajo del orquestador sobre `5679fdda5f56`, después de la revisión independiente `publicacion-evidencia-v1` y de CX-07-B en `correcciones-x-v1`. No se modifican los informes originales ni se promueve ninguna atestación.

## PE-01 y PE-02: error de integración del padre

Las dos rutas correctas estaban en disco y en la entrega de publicación. JJ interpretó sus corchetes como patrones de prefijo al seleccionar archivos y no las incluyó en `5799bb038267`. La ruta de objetos faltaba y el GET genérico conservaba la versión anterior. `rojo-arbol.json` conserva la comprobación de los bytes del commit. No era un error de la entrega del autor.

La integración usa ahora `root-file:` con rutas literales. El control posterior extrae cada blob del commit con `git cat-file`, comprueba SHA-256 y tamaño y rechaza borrados. Las pruebas importan los GET reales: PDF y PNG correctos, auxiliar privado 404, Madrid con estados y enlaces, otro sujeto sin evidencia de Madrid. No se presenta un test del helper como prueba de la ruta.

## PE-03: cobertura de estados

`rojo-cobertura.log` conserva el fallo de omitir todos los estados antes del fix. El verificador requiere un único estado para cada ocurrencia con enlace normativo, comprueba la cobertura completa de los recibos y rechaza documentos, citas y facsímiles sin recibo. Las ocurrencias puramente técnicas siguen sin evidencia. Se reutilizan recibos ya parseados dentro de una ejecución; no se añade caché entre verificaciones.

Las veinte pruebas de contenido pasan con los GET reales y los adversos de omisión/duplicación. Se actualiza la expectativa del test de sujeto ajeno: ahora falla antes, por cobertura, manteniendo el adverso original. El primer control de tipos detectó dos callbacks async en tests; se adaptaron a Effect después de consultar la guía. No se desactiva ninguna regla.

## CX-07-B: comparación con cuota coherente

El nuevo selector conserva la selección auxiliar que ya usaba el gráfico, pero calcula su neto con esa misma cuota. El caso de referencia de 22.700,16 euros, 2025/2026 y escenario 1,03 conserva en la API histórica cuota final 2.729,59 y neto 18.499,60. La vista comparable selecciona cuota 2.873,30 y neto 18.355,89: ajuste de −143,71 euros respecto del neto original. Esto es una conciliación del contrato gráfico, no la validación fiscal de esa cuota ni del escenario de 2026.

Primero se extrajo la selección anterior y se ejecutaron tres rojos reales en `rojo-cuota-neto-real.log`; el primer intento del arnés no ejecutaba los valores Effect y se conserva separado. Después se corrigió el selector, conectándolo a magnitudes, denominador de cuña y cuota del gráfico. Cinco pruebas focalizadas pasan, incluidas ambas direcciones del IPC y fronteras de 22.000 euros. El coste laboral se suma a partir de bruto y cotización empresarial mostrados. Los ajustes por redondeo de presentación quedan explícitos. Los valores originales no se mutan y no se modifica la exportación ni los fixtures Excel.

La explicación advierte que se trata de una selección del perfil histórico, sin determinar obligación legal de declarar. No se cambian disposición ni diseño. Se incrementan las versiones de caché del cálculo gráfico.

## Regeneración y límites

Inventario nuevo: 51.880 ocurrencias, 23.802 sintácticas, 16.351 efectivas y 11.727 seleccionadas; 118 fuentes TypeScript y una Python. Permanecen 29.014 unidades pendientes y 351 fichas de deducción. Se regenera contenido por cambios de fuentes y verificador. `actualizar-enlace.mjs` exige identidad, ruta, valor, unidad candidata y hash de fuente idénticos para Madrid; preserva el payload anterior por hash y deja la atestación a null. La atestación candidata del revisor corresponde al inventario anterior y no se traslada al nuevo.

`recepcion.json` acredita los 24 archivos de revisión por manifiesto, base sin cambios y 8.457 archivos de base del padre conservados. No se integran entregas activas ajenas. La nueva publicación, comprobaciones posteriores y hashes definitivos se registran en los logs y recibos de esta carpeta. Lint y tipos principal/vendor pasan en `verde-cuota-neto.log`; las dieciséis reglas anti-slop permanecen a error.

Continúan pendientes revisión nueva de estas correcciones, build/empaquetado operativo, contrato familiar en curso y ampliación del paquete de preservación con los originales recientes. Crossa conserva v1 histórico y está desfasada respecto de v2. Sin LFS, gasto, transferencia externa, PR, despliegue, cambios a main ni limpieza final. El encargo exhaustivo sigue abierto.

## Build: incompatibilidad encontrada por el padre

`rastro-build.log` contiene diez pruebas correctas y el primer build fallido: Next no admite `react-dom/server` en la ruta. Se usa `renderToReadableStream` del export público de React `server.edge`, compatible con el adaptador instalado de Next. Documento completo sin scripts de hidratación y `allReady` antes de entregar la respuesta, preservando 404/503 y cabeceras. La repetición está en `build-stream.log`; el resultado y el GET compilado deben comprobarse antes de considerar operativa la ruta. Build con webpack, `CIRCLE_NODE_TOTAL=2` (Next 16.1.7 deriva un trabajador), heap máximo 3 GiB, lock compartido y tiempo máximo 15 minutos. No se ha afirmado una medición de Turbopack ni de un host desplegado.

Fuentes técnicas consultadas: [documentación de React](https://react.dev/reference/react-dom/server/renderToReadableStream), exports de React 19.2.5 instalado y adaptador de Next 16.1.7. La API Node de streams sería preferente en un servidor Node genérico; se mantiene Web Streams para el contrato Response del manejador. No hay API privada importada ni excepción de lint.


## Resultado operativo del bloque

Build webpack completo correcto, con un trabajador. El GET compilado devuelve 200 para ficha, PDF y PNG y los hashes coinciden. El primer examen NFT reveló cero originales incluidos: rojo conservado en `comprobacion-build.log` y `anterior-build-compilado.json`. La inclusión explícita de datos en next.config.mjs corrige el paquete y queda fijada en la versión de explicación.

Snapshot técnico definitivo `54194f5a7ec34412ac9aa4aa27d8bcea053b1e3ca2bbda2e70ce211e4ee2d613`; documental `983a06755162fedd569a8bb6989714463e00903506a614659b94eed1d43dd1eb`, 51.953 fichas y 713 objetos de publicación. Se conservan los dos snapshots intermedios de este bloque. El payload de Madrid no cambia por la configuración de empaquetado; su revisión sigue pendiente.

`comprobar-paquete.mjs` copia exclusivamente la unión de archivos de las trazas de las cinco rutas de procedencia: **4.811 archivos, 266.814.325 bytes** (aproximadamente 254,5 MiB). Los GET compilados ejecutados con cwd en esa copia sirven el HTML, PDF y PNG; no dependen del almacén del repositorio original. No se inicia servidor. Cada traza contiene las dependencias documentales del snapshot actual. El volumen incluye historia y se declara como coste; no se afirma adecuación a un límite de serverless ni se configura un alojamiento.

Siete pruebas del rastro pasan después de incorporar la configuración a la puerta de software. El build ejecuta TypeScript sin errores. `build-aislado.json`, `paquete.json` y `build-compilado.json` fijan los resultados. El pase final de las veinte pruebas de contenido y lint se conserva en `final-rutas-lint.log`. La revisión nueva deberá probar los adversos, estados HTTP, escape de HTML, selección gráfica y aislamiento; el padre no se concede aprobación independiente.


El último pase completo de contenido obtuvo 19 correctas y una expectativa textual antigua de doctype en minúsculas. React emite `<!DOCTYPE html>`: se exige ahora el doctype al principio con comparación insensible a mayúsculas, conforme a HTML, manteniendo el rechazo de scripts y el caso 404. Se repite únicamente esa prueba junto a lint y tipos en `final-doctype-lint.log`. No se repiten las otras diecinueve sin un cambio que lo requiera.
