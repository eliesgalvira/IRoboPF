# Cobertura pendiente al cierre de la base 65cff4fd

No se acredita el cierre del encargo. El avance técnico es real, pero no existe una explicación jurídica completa por elemento ni una liquidación fiscal exhaustiva. Esta entrega no modifica estados, registros, atestaciones, motor ni informes anteriores. Trabajo personal, sin delegación, operaciones VCS mutantes, descargas, servidor o build.

## Base y método

HEAD: `65cff4fd8eb8c6269c2ce97b88e770aa711bff7f`. Se comprobaron las **9.391 entradas** contra el blob de base, mediante `lstat` y `readlink` para enlaces; cero ausencias y cero diferencias iniciales. `base.json.gz` contiene cada ruta, modo, tamaño, SHA256 e identidad del blob. No se confía en el índice. El único enlace auxiliar creado es node_modules de lectura a la raíz autorizada.

Se leyeron BRIEF completo, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO, DECISIONES e integración R13, incluida su sección R14, y el informe independiente publicacion-cuota-v2. Los informes históricos sirven para localizar decisiones, no para aceptar automáticamente su vigencia en esta base. No se reproduce contexto privado.

`extraer.py` recorre los documentos versionados de esta base, lee **584 JSON** seleccionados por rutas/nombres de matrices, cobertura, hallazgos, decisiones, revisión y aceptación. `fuentes-matrices.json` fija sus bytes. `registros.json.gz` conserva 93.358 registros con identificador, incluidos registros técnicos e históricos: **no son 93.358 hallazgos**. `relaciones-literales.json.gz` localiza menciones por ID, archivo y línea. Compartir ID no prueba identidad semántica, corrección ni aceptación. No se unen registros por igualdad de nombres o cifras.

`complementar.py` produce 724 filas dominio/año/territorio/contrato y un índice de 1.101 entradas de hallazgos originales con referencias a sus matrices. El primer índice preserva agrupaciones territoriales y límites contractuales; el segundo conserva ambigüedades de mapeo. Es un censo mecánico exhaustivo del conjunto seleccionado y una revisión sustantiva dirigida, **no una nueva lectura jurídica exhaustiva de cada cita de las 584 matrices**. Los campos desconocidos no se rellenan con aceptaciones supuestas. Sigue faltando una relación editorial revisada por cada ID entre decisión, fix, prueba, vigencia y página; el índice hace localizable esa deuda, no la elimina.

Denominadores: 52.377 ocurrencias técnicas; 351 fichas de deducción de 2025; 52.450 entidades publicadas; 65 sitios instrumentados; 78 + 186 decisiones canónicas limitadas a celda/ejercicio. Son universos diferentes, con solapamientos. No se calcula porcentaje fiscal agregado. Las filas con `inventariado` indican presencia del dominio en el inventario o registro de ausencia, no implementación de una regla foral.

## Hallazgos propios y decisiones

### CC-01 — La página experta sigue pendiente (P1 documental)

El extractor relee el snapshot v2 `98c315e18130d88b18a4c85aa62ec2b1dd1d18a62d9f5cf61fd57711399e7e1a`, comprueba hashes de paquetes y cuenta entidades reales: 52.377 ocurrencias y 73 conceptos. Estos últimos incluyen 65 pasos, cuatro conceptos editoriales y cuatro entidades documentales. Todas las 52.450 entidades conservan derivación pendiente. Hay 65 fórmulas candidatas, nueve normas candidatas y cinco secciones candidatas de evidencia/bordes; **cero entidades tienen las cinco secciones no pendientes**. Document/Citation/Facsimile también tienen estas secciones por el modelo común; no se cuentan como reglas jurídicas.

Fuentes: `paginas.json`, `scripts/procedencia/contenido-generar.mjs:22`, conceptos.json del implementador y los paquetes fijados. La ficha de una expresión, un enlace a informe o una captura no proporciona por sí solo derivación, condiciones, casos y conexión al cálculo. Cero completitud estructural no significa cero contenido útil: significa que no se satisface todavía la exigencia experta por elemento. La calidad jurídica requerirá revisión adicional aun cuando desaparezcan los pendientes.

Objeción experta: medir textos no demuestra corrección legal, y exigir secciones jurídicas a nodos documentales distorsionaría un porcentaje. Respuesta: contar estados explícitos por tipo, sin porcentaje ni aceptación. Coste: elaborar páginas semánticas revisadas y un mapa entre ocurrencias técnicas y conceptos fiscales; no redactar 52.377 plantillas repetidas.

### CC-02 — Las 264 decisiones no cierran los bindings (P1)

Las matrices canónicas `revisiones/evidencias-estatales-v2/decisiones-canonicas.json` y `revisiones/evidencias-autonomicas-v2/decisiones-canonicas.json` separan condiciones, interpretación acotada, fuente/cita y binding pendiente. Los 319 registros históricos estatales y propuestas previas no se suman a las 78 decisiones nuevas como cobertura distinta. El snapshot actual contiene un estado documental para Madrid: integridad y exactitud verificadas; interpretación candidata; revisión de binding pending; autenticidad trust-indeterminate; aceptación completa false. Payload `bd905a560b037ae7ab8ddfe6bcfb6790e3c5d85c3ddc0d1e1ec31f1e1471d7fc`.

Por ejemplo, ESTV2-2012-ordinaria-3-cuota tiene fuente actual, cita por hash y evidencia de cadena; sus condiciones excluyen ahorro, retención, régimen foral, mínimos y declaración completa. Esas exclusiones son parte esencial de la decisión. No se ha validado aquí de nuevo su cuantía legal. Los originales primarios y la vigencia están en las referencias de esa decisión, no en este resumen.

Objeción: un selector técnico por año/territorio no ejecuta todas las condiciones editoriales. Respuesta: mantener pendiente y exigir contrato de ámbito, payload exacto y nueva revisión antes de registrar binding. Coste: desarrollo y contrarrevisión, aun cuando ya existen citas aprovechables. Ninguna atestación histórica se migra.

### CC-03 — Deducciones: corregida la transferencia automática; automatización incompleta (P1 de cobertura)

El catálogo tiene 351 fichas. La revisión A separó 168 en 111 manuales, 32 genéricas y 25 específicas parciales; la B examinó otras 183 y aceptó sobre todo la constatación de carencias. Esos recuentos históricos no describen 351 fórmulas legales completas. `deducciones-351.json` conserva estado declarado, territorio, ejecución y metadatos actuales del inventario sin reinterpretar «implementada».

La muestra propia ejecuta dos hijos andaluces sin más hechos: helper antiguo 400, consignación anual 0. Un importe expresamente consignado de 123 llega como 123. No son expectativas legales: discriminan dos contratos de software. `components/liquidacion-irpf.tsx:602` llama a `calcularDeduccionesConsignadas`; la explicación de línea 1381 declara que las estimaciones no reducen cuota. La búsqueda de consumidores no localiza llamadas del helper parcial antiguo en components/lib fuera de su definición; sí hay tests que lo siguen consumiendo. No se reproduce DED-I-02 como defecto actual de aplicación automática.

Persisten campos específicos antiguos y fórmulas parciales mantenidas. Los contratos nuevos no se pueden considerar conectados a esos controles por igualdad del nombre. DED-I-01..05 tienen correcciones en integración R7; la aceptación acotada de hechos previamente calificados no verifica emisor de ayudas, convivencia, rentas, titularidad o historia. Canarias/Madrid/Murcia/Rioja y las exclusiones catalanas requieren conservar sus límites individuales. No se convierte consignación profesional en bug por carecer de cálculo automático.

Objeción: «aceptado» puede significar aceptación de la ausencia, no del derecho ni del fix. Respuesta: separar catálogo, fórmulas parciales, consignación y contratos nuevos por código/consumidor. Coste: contratos por beneficiario y titular, revisión primaria de los pendientes y páginas propias. Fuentes jurídicas: las referencias originales por ID de las matrices A/B, no el Excel ni los posts.

### CC-04 — Retenciones iniciales, soportadas y regularización son contratos distintos (P1 de alcance)

Catálogo actual: 16 versiones, 2017–2026; 2012–2016 carecen de versión canónica. En 2026 solo 10 septiembre–29 octubre; cierre anual no disponible. La muestra prueba los dos extremos de cada versión y ausencia de cierre en 2012–2016/2026. No valida la legalidad de cada frontera; verifica selección implementada.

RTI-01/02/03 constan corregidos en coherencia R9; no tratarlos como abiertos por leer solamente la revisión anterior. RET20-005/006 y RET1219-10 describen regularización ausente: el rechazo expreso actual es límite del producto, no un resultado numérico erróneo de una regularización soportada. Recuperar siete algoritmos antiguos, 19 PDF o 191 citas no habilita 2012–2016. Julio de 2015 requiere resolver la discrepancia visual/jurídica con la versión corregida antes de ampliar código.

La UI mantiene entrada de «Retenciones soportadas nominales» y opción separada de inicial al cierre de 2025. Un pago efectivamente declarado no debe reemplazarse por la estimación ni por la suma indiferenciada de salarios. Ver `components/liquidacion-irpf.tsx:1073`, `trabajo-anual/conexion-contrato.ts` y revisión conexion-anual-v2. Faltan contratos para regularizaciones, supuestos especiales y hechos que el modelo inicial presupone. Las referencias oficiales AEAT están individualizadas por hash/URL en catálogo.ts; esta auditoría no certifica sus procedimientos completos.

Objeción: confundir fecha de documento con vigencia o inicial con soportada genera falsa cobertura anual. Respuesta: conservar períodos, rechazos y pagos separados. Coste: nuevas primarias/contratos para ampliar, sin alterar oracles antiguos.

### CC-05 — Cobertura material y territorial incompleta (P1)

`matriz-contratos.json` hace explícitos los contratos. Forales: Navarra, Álava, Bizkaia y Gipuzkoa no están modelados en las tablas inventariadas. «País Vasco» se conserva en forales.json como ausencia técnica agregada, no como un régimen único. Las tablas reales autonómicas del selector llegan a 2025; 2026 real no se obtiene por heredar simulada-estatal. Rechazo o ausencia son límites, no prueba de inexistencia de norma.

Mínimos: MIN-001/007 y régimen histórico del ahorro tienen correcciones, pero no resuelven devengo, toda elegibilidad familiar o mínimos autonómicos. El nuevo contrato de derechos es Madrid 2025 individual/ordinario y candidato pendiente de revisión nueva. CX-06-A no queda cerrado en todos los consumidores por sus 98 pruebas.

Trabajo/gastos: TDE-09/10/18 tienen fixes acotados; TDE-27/28/35 siguen con lagunas documentales. El nuevo trabajo anual/EDS no extiende automáticamente el perfil histórico a rentas mixtas, gastos y deducciones estatales completas. Capital/ganancias: CG-01/02/03 corregidos no cierran CG-04/06 (acumulados/tiempo), alquileres completos, compensaciones cruzadas ni bolsas CG-20/21. Estas últimas requieren entradas y contratos, no cambiar constantes. No se declaran errores nuevos sin rojo.

SS: doce mensualidades uniformes y reparto por pagador son contrato analítico, no nómina TGSS universal; grupos, horas, altas parciales y RETA calculado siguen fuera. R05/R06/R10 de TGSS mensual quedan parcialmente pendientes. IPC observado y escenario 2026 están separados; producto de tasas y cociente de índices no se intercambian. La exactitud tabular legacy acredita su contrato binario, no el conjunto jurídico.

Objeción: agrupar por dominio oculta excepciones. Respuesta: filas por año/territorio/contrato, referencias a decisiones individuales y campos no inferidos. Coste: la matriz no permite anunciar un porcentaje de IRPF «cubierto»; se necesita completar contratos y asignaciones semánticas.

### CC-06 — Preservación y autenticidad histórica siguen abiertas (P1 operativo)

Los hashes acreditan bytes presentes. No acreditan por sí solos emisor, confianza histórica, revocación, CSV, vigencia o interpretación. Los 21 originales estatales nuevos y 24.604.569 bytes están registrados en cas-preservado.json fuera del checkout; esta entrega no los modifica ni afirma restauración propia de ese CAS. El paquete de preservación v1/v2 no debe confundirse con snapshots de publicación v1/v2.

Crossa es v1 comunicado por el coordinador, misma casa/dueño; no comprobación propia ni custodia independiente. La ampliación/restauración con nuevos originales sigue pendiente en esta base. Transferencia preparada por decisión de Elies, sin LFS, gasto ni transferencia nueva. No tocar los preservados al limpiar worktrees.

Objeción: un respaldo de código no garantiza recuperar todos los originales. Respuesta: manifiesto de inclusiones/exclusiones y restauración independiente antes de afirmar recuperabilidad. Coste: almacenamiento local y exposición residual a pérdida común, ya elegida; no solicitar permisos de nuevo.

### CC-07 — CI y paquete local no acreditan producción (P2)

CI `.github/workflows/checks.yml` contiene lint/tipos, reconstrucción de inventario, contenido/rastro y job separado de corpus/puente/publicación. El contrato no verifica todas las citas históricas como bindings operativos: solo los casos incorporados al verificador. Presencia del workflow no prueba una ejecución remota verde en este HEAD. No se consultó CI remota.

El recibo independiente R14 prueba PE-01/02/03 y CX-07-B técnicamente sobre 6e210920; R13 añade pruebas de contenido/rastro en la base integrada. R14 necesitó retraza por node_modules enlazado: 4.811 archivos, 267.676.833 bytes, distinto del recibo del padre. No ejecutó GET compilados de búsqueda/ámbito. No hay deploy ni aceptación de hosting. Se conserva su límite: no trasladar el build histórico como prueba literal del paquete actual.

Software declarado en package/lock de esta base: Next 16.1.7, Effect beta.57 como rango, React 19.2.4 como rango, oxlint 1.78.0. El lock fija resolución; estos números no son una auditoría de vulnerabilidades ni recomendación de versión vigente. Las dieciséis reglas anti-slop siguen a error. No se modificó CI ni dependencias.

Objeción: un GET desde repositorio puede leer datos que faltan en despliegue. Respuesta: reutilizar el recibo aislado con su alcance y exigir un ensayo del artefacto exacto y hosting antes de producción. Coste: validación operativa posterior; no repetir build ahora.

### CC-08 — ESTADO necesita síntesis actual, sin reescribir historia (P2)

El bloque 16:55 concuerda con los límites principales observados. Posibles contradicciones de lectura que el padre debe resolver en un resumen nuevo:

- «Bootstrap… lint falla 96» es histórico, mientras los bloques posteriores reportan verde. No borrar la evidencia inicial.
- «Pendiente contrarrevisión» para CX-07-B a las 16:41 queda superado por R14 técnico, pero no por aceptación fiscal.
- «51.953 fichas» pertenece al snapshot anterior; el v2 fijado tiene 52.450 entidades, sin equivalencia a reglas.
- «Trabajo y actividad necesitan integración» histórico queda superado solo para el contrato explícito Madrid 2025.
- «Deducciones aplicadas sin hechos» de la revisión anterior no describe la consignación actual; subsisten fórmulas parciales en API/test y contratos/UI incompletos.
- Cierre técnico de publicación no equivale a build actual, hosting validado ni atestación nueva de Madrid.
- Copia Crossa no debe anunciarse como v2 ni custodia independiente. Los números de preservación y de publicación describen paquetes distintos.

Objeción: corregir retrospectivamente informes destruye su base. Respuesta: añadir al padre una tabla de superación por base/contrato, conservando originales. Coste: más referencias y lectura explícita de cronología.

## Backlog accionable

1. **P1, evidencia existente:** completar relación editorial exacta de los 264 candidatos: sujeto actual, decisión independiente y condiciones ejecutables; payload nuevo y revisión del binding. Puerta: ninguno hereda aceptación, cada condición relevante se prueba por exclusión y por caso permitido.
2. **P1, contratos/documentación:** páginas españolas por concepto con derivación, norma/vigencia, facsímil, casos y conexión. Empezar por Madrid y fixes CG/TDE ya documentados. Puerta: cinco secciones sustantivas revisadas, no textos genéricos; mapear las ocurrencias sin dominio o unidad antes de prometer exhaustividad.
3. **P1, evidencia existente + revisión nueva:** revisar derechos familiares y consumidores actuales del contrato Madrid 2025; separar perfiles antiguos. Puerta: casos CX-06-A y hechos insuficientes revisados contra primarias, sin dividir mínimos por dos universalmente.
4. **P1, contratos faltantes:** completar deducciones por titulares/beneficiarios y conectar solo las expresamente soportadas. Reabrir pendientes A/B con sus originales; donde falta vigencia/primaria obtenerla antes de fix. Puerta: rojo por caso numérico soportado, casos externos rechazados y consignaciones preservadas. No modificar oracle para hacer pasar.
5. **P1, primaria nueva o aclaración oficial:** completar períodos AEAT 2012–2016, julio 2015 y tachados; TGSS mensual por concepto/etapa. Puerta: cadena y pasaje exacto revisados, no el ejemplo aislado ni un post.
6. **P1, ampliación de producto:** alquiler/bolsas/arrastres, gastos/deducciones estatales pendientes, regularizaciones y módulos forales. Puerta: contratos de hechos y alcance antes de implementación; no clasificarlos como bugs de rutas que los rechazan expresamente.
7. **P1, evidencia existente:** ampliar preservación local con los nuevos originales y restaurar cotejando SHA256/512. Puerta: manifiesto de cierre físico; mantener Crossa y v1 históricos sin sustitución.
8. **P2, operación:** demostrar paquete actual desde dependencias locales y GET búsqueda/ámbito, límites del hosting y restauración; sin despliegue implícito. CI remota y seguridad de versiones requieren comprobación específica fuera de esta muestra.
9. **P2, coordinación:** publicar síntesis nueva de estados con bases, sin sumar tests solapados ni reescribir registros previos.

## Validación y reproducción

Desde la raíz del checkout, serializar cada comando con `flock /tmp/irobopf-validacion-pesada.lock`:

```sh
nix shell nixpkgs#python3 -c python3 docs/procedencia/auditorias/cierre-cobertura/extraer.py
nix shell nixpkgs#python3 -c python3 docs/procedencia/auditorias/cierre-cobertura/complementar.py
nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/auditorias/cierre-cobertura/muestra.mjs
```

La muestra tiene 41 aserciones técnicas: seis cierres ausentes, 32 extremos de versión y tres controles de deducción. No escribe Effect ni cambia importes del motor. Se contrastan recibos independientes del Excel/build sin repetir 32 millones de celdas ni build. No se verificó visualmente ningún facsímil nuevo ni se emite atestación.

La primera extracción falló por usar `revision` donde el paquete declara `hash`; se corrigió el arnés y se completó el recorrido. El primer Ruff de uv falló por ejecutable no compatible con NixOS; se usa Ruff de Nix. Los logs conservan también errores iniciales de tipos y sus repeticiones; no son fallos fiscales. La entrega incluye logs reales, matriz, extractor y manifiesto. Las citas jurídicas son referencias a primarias ya registradas y no nuevas afirmaciones normativas verificadas en esta ejecución.

Límites: el índice mecánico completo no sustituye lectura jurídica de todas las decisiones; no se ha demostrado fix por cada ID del corpus. Precisamente quedan campos no inferidos para esos enlaces. Privacidad revisada sobre contenido publicable: no se copian notas privadas, contexto, credenciales ni datos de usuarios; no se solicitan expedientes. No hay certificación global, promoción de registros o conclusión de aceptación.

Validación final: Ruff y mypy de ambos extractores, TypeScript estricto con checkJs de la muestra y dependencias, ESLint y oxlint focalizados, ensayo anti-slop y muestra ejecutable terminan con código 0 (`validacion-final.log`). No se rebajó severidad ni se añadió ignore. `trazabilidad-dirigida.json` conecta explícitamente seis familias de hallazgos con decisiones, correcciones, código, tests y límites; los demás enlaces del índice permanecen sin resolver sustantivamente.

El manifiesto enumera todos los archivos entregables excepto él mismo para evitar autorreferencia; su SHA256 se entrega aparte. `entrega.patch.gz` contiene solo archivos textuales nuevos y se verifica como binario por hash. Los JSON comprimidos se integran por ruta/hash desde este checkout. `baseSha256: null` significa archivo nuevo ausente de la base. Scratch, node_modules y archivos de base no forman parte de la entrega. No hay borrados.
