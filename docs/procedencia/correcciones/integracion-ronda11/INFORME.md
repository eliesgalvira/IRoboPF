# Integración de las rondas 11 y 12

Trabajo del orquestador sobre bde32d9596d0 y las entregas fijadas en `integracion.json`. Las cinco entregas de ronda 11 se cotejaron contra eaed990c620b5fc4d3ff2e74dc68e0c8481c43db, por archivo, hash, tamaño y base. Cada checkout conservaba las 6.005 entradas de base; ningún diff de rama contenía borrados. No se copiaron índices, `.jj` ni entornos Python.

## Correcciones después de revisión independiente

- **CAV1-01:** selector de Madrid ordinario 2025 con cuotas fijas publicadas. Fuente: Ley 13/2023, BOE-A-2024-5610, PDF p. 3, SHA-256 `502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de`; contraste AEAT 2025 p. 1128, SHA-256 `02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4`. El padre reabrió el original. Bruto 25.000,02 con los hechos de la prueba da 3.750,13 frente a 3.750,12 anteriores; 60.000 da 15.337,60 frente a 15.337,61. No se amplía la tabla a fallecimiento ni a otros años. La comprobación se refiere a esos hechos y operaciones, no a toda declaración.
- **CAV1-02:** la entrada anual explícita enlaza el rastro al snapshot exacto con contexto 2025/Madrid/perfil. No se retaguea un resultado histórico ni se deduce identidad de etiquetas.
- **CAV1-03:** `brutoServicios` agregado admite catorce dígitos enteros; cada salario mantiene doce. Cubre la suma de hasta cien entradas sin rechazar un caso laboral que el equivalente de pensión admitía. No se elevan indiscriminadamente las cotas individuales.
- **RT11-01:** acceso explícito a SHA-512, tamaño y estado en `preservacion.py`, sin indexación dinámica de TypedDict ni silenciamiento de mypy. No cambia la política de preservación.

`rojo-conexion.log` conserva cuatro fallos del padre antes de estos fixes, además de los rojos independientes. `verde-conexion-inflacion.log` pasa 44 pruebas de conexión, inflación y dinero y después las dos pruebas de hashes completos del libro. Las suites solapadas no se suman como cobertura nueva.

## Inflación y oracle

Integrados `comparativa-tabular.ts`, su conexión de exportación, siete pruebas y evidencia Python/Excel. Se corrigen las 69 discrepancias de exportación mediante el orden binary64 original, con redondeo al final; las APIs de céntimos y el fixture antiguo permanecen intactos. Se conserva la corrección del padre RLV1-03 y sus regresiones positivas/negativas. Los hashes de las 18 hojas coinciden con la extracción XML independiente. Los 16.770 datos, 330 fronteras y 543 controles documentados por el autor son alcance de reproducción, no aceptación fiscal de las fórmulas heredadas.

## Inventario y propuestas jurídicas

Inventario reconstruido: 51.870 ocurrencias, 23.792 sintácticas, 16.351 efectivas y 11.727 seleccionadas; 117 fuentes TypeScript y una Python. Permanecen 29.004 unidades pendientes y 351 fichas de deducción, sin declarar automatización integral. La exposición canónica tiene 243 hojas: las 228 anteriores más quince de Madrid 2025.

Territorios de tablas canónicas declarados mediante pares archivo/símbolo exactos. Los dos símbolos estatales usan `estatal-comun`; Andalucía, Valencia, Catalunya, Madrid y Murcia usan su territorio. No se extiende ese dato a ahorro ni a un archivo ajeno. Un conflicto con la ruta se rechaza. Las dimensiones son técnicas y no prueban vigencia jurídica.

Integrados los refinamientos de las 26 unidades estatales, contexto compuesto de discapacidad y 28 localizadores autonómicos antes ambiguos, con recetas históricas fijadas. Los lotes originales quedan intactos. `evidencias/propuestas-r12/` produce 264 candidatos actuales, por identidad estructural exacta y valor/unidad invariables. Conserva bloqueos jurídicos y no altera decisiones antiguas, registro ni atestaciones. Su siguiente revisión deberá cubrir el helper actual y el ámbito anual individualmente.

## Publicación documental local

Snapshot técnico v1 `8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3`; snapshot documental v2 `efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6`. El segundo contiene 51.943 fichas: 51.870 ocurrencias, 65 puntos del rastro, cuatro conceptos y cuatro entidades documentales adicionales; la ocurrencia de Madrid se sustituye por su revisión documental, sin duplicar el ID.

Hay 711 dependencias físicas fijadas. Los únicos blobs HTTP públicos de esta publicación son el PDF y el PNG declarados de Madrid; auxiliares privados y objetos desconocidos se rechazan. El índice de búsqueda se coteja contra todas las entidades. Se conservan los dieciséis snapshots, todos verificados. Es publicación en el almacén local del repositorio, no despliegue.

Madrid actual fija payload `7e2a9cf3f953a6f3bf61c1d8af2be6e7d77e6775bbbfa0a85d4079d89cf9ecd1`. El coordinador reconstruye el inventario desde código y verifica número, cita y siete dependencias documentales. La integridad y exactitud numérica constan verificadas; revisión del binding pendiente, interpretación candidata, autenticidad histórica indeterminada y aceptación fiscal completa false. No se reutilizan atestaciones antiguas.

`publicar.mjs` registra entrada exacta y actualiza el alias después del cierre. La prueba de publicación busca explícitamente el v1 técnico de las versiones actuales, aun cuando el alias ya señale v2. El primer pase de integración obtuvo 25 pruebas correctas y un fallo de preparación: el arnés del rastro no copiaba las rutas HTTP recién incluidas en las fuentes de explicación. Se amplió esa copia y el adverso muta también la ruta pública. No se relajó la comprobación ni se modificó el software para ocultar el fallo. El log inicial se conserva.

## Fuentes históricas, X y TGSS

Recuperados siete algoritmos antiguos AEAT mediante capturas secundarias de URLs oficiales: dos de 2012, uno de 2013, uno de 2014, dos de 2015 y uno de 2016. Diecinueve PDF y su evidencia se copiaron a la raíz fuera del worktree. Fechas discrepantes, revisiones y texto tachado requieren contrarrevisión; no se habilita automáticamente el cálculo de esos años.

La revisión independiente nueva de X coteja 67 posts y cinco imágenes y emite 18 decisiones para diez IDs. Dos rojos de contrato quedan abiertos: reparto familiar entre titulares (CX-06-A) y coherencia de cuota/neto (CX-07-B). El segundo no acredita fiscalmente el número esperado y no autoriza romper el perfil Excel. Se conservan 47 archivos más los sobres con hashes y 6.438 entradas de base presentes. No hay interacción en X ni datos de perfiles adicionales.

La investigación TGSS aporta 19 originales, 42 citas/facsímiles, doce reglas candidatas y siete hallazgos. No cierra las etapas de redondeo, empates ni ajustes entre conceptos. Sus 21 escenarios Decimal son discriminantes aritméticos, no reglas fiscales aceptadas. `recepcion-tgss.json` registra 71 archivos y 19 originales de 15.601.984 bytes copiados a la raíz por ambos hashes, sin borrados. Requiere revisión nueva.

## Preservación y selección de entrega

Los manifiestos originales de revisores se conservan sin reinterpretarlos. El de conexión anual incluye copias de ejecución y un log de 20.799.065 bytes. `seleccion-revisiones.json` documenta qué se integra: informes, pruebas y evidencia, excluyendo copias de código, cachés y parche que las contenía. El log completo está comprimido con sus hashes en esta carpeta; el original sigue en disco. No se elimina ni silencia ningún diagnóstico. Los scripts entregados siguen bajo lint; las dieciséis reglas continúan a error.

v1 y v2 preservados previamente permanecen intactos fuera de T3. La copia local comunicada en Crossa es v1 y está desfasada respecto de v2; no es custodia independiente. Los nuevos originales recuperados y TGSS están preservados localmente en la raíz, pero aún no incluidos en una nueva versión del paquete. Hace falta ampliar y verificar el manifiesto antes del cierre final. Sin LFS, gasto, transferencia externa, PR, despliegue ni limpieza final.

## Comprobaciones y siguiente paso

Inventario: dieciocho pruebas correctas. Preservación: diecinueve pruebas, Ruff y mypy correctos. El bloque de publicación verifica el cierre real y los dieciséis históricos. Lint, tipos principal/vendor y ensayo anti-slop se ejecutan en `validacion-amplia.log`; el resultado final de esa suite y las pruebas de contenido se añade al estado al terminar. No se ejecutó Next build ni las dos suites legacy pesadas en este bloque.

El primer pase amplio obtuvo 553 pruebas correctas y una expectativa antigua de la liquidación canónica madrileña incorrecta tras CAV1-01. Con BLG 26.056, la cuota estatal es 2.991,15 y la autonómica publicada es 1.739,53 + (26.056 − 19.004,63) × 0,128 = 2.642,10536. Total 5.633,25536, que se presenta como 5.633,26; el test esperaba 5.633,25 de la integración marginal anterior. Se actualiza esa expectativa canónica con la derivación documental, sin tocar fixtures legacy. Mínimo y cuota líquida de ese caso permanecen iguales. El rojo del pase amplio se conserva y se repite únicamente la suite afectada y las comprobaciones de contenido pendientes.

La repetición focalizada termina correctamente: 57 pruebas de liquidación, 17 de contenido, lint global y tipos principal/vendor. El adverso del rastro con las rutas copiadas pasó en el pase amplio. Las seis pruebas nuevas de publicación y las trece del adaptador pasaron en el primer pase, sin necesidad de repetirlas por cambios exclusivos de preparación del arnés. Los directorios propios de scratch y CAS nuevos se excluyeron antes del commit; se retiraron únicamente del seguimiento de la instantánea no comprometida, conservando todos los bytes en disco y comprobando ausencia en la base. Preflight del padre: 6.439 entradas de base presentes, cero borrados.

Faltan nuevas revisiones independientes de publicación, inflación, conexión anual, evidencias estatales/autonómicas y fuentes históricas; además, revisión TGSS y ampliación del contrato familiar. El padre resolverá la coherencia de cuota/neto y medirá el empaquetado operativo. Nada de lo anterior declara cerrado el encargo exhaustivo.
