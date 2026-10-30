# Vertical ejecutada SS R54

Se implementa evidencia causal ejecutada para las once salidas SS, con protocolo versionado, consumidor, integración opcional en el consumidor SS y transporte hasta origen.decimal. Es candidato técnico condicionado para recepción y revisión independiente nueva. No se da por completado el encargo global 65/19, la admisión ni la fiscalidad.

Trabajo personal mediante T3 Code/Codex, gpt-6.1-sol, esfuerzo high; priority solicitado expresamente, sin recibo independiente del tier servido. Sin subdelegación. Base exigida y observada: 34b77cb654064e6cc7ea6108680c2fabd301e068, 22.112 entradas. Leídos BRIEF, AGENTS, contrato, coordinación, cabecera vigente de ESTADO y D118–D125. Se conservan las restricciones posteriores que prevalecen sobre las órdenes históricas de delegar, versionar, publicar o limpiar.

## Cambio y evidencia

`evidencia-ejecucion-r54.ts` define ocurrencias, frames, aristas y recorrido de slices. `causal-ss-r54.ts` interpreta la IR SS existente con valores acompañados por productores, proyecciones de objetos, captura/argumentos/retornos, selección y colecciones. No contiene las fórmulas SS ni tablas alternativas. La API no importa/transpila el motor TS para calcular resultados. Decimal concreto opera sobre los mismos operandos; los adaptadores finitos de colección y Match ejercen la semántica necesaria del programa fijado. Se consultaron effect-solutions list/show basics/testing y las implementaciones locales v4. Los TS reales solo intervienen en pruebas como oracle financiero condicionado.

La única modificación base es `flujo-ss-r36-consumidor.mjs`: import del intérprete causal, rama opcional cuando capture es 'causal' y anotación JSDoc de esa opción. Los booleanos false/true conservan su camino anterior, sin ejecutar ambos intérpretes. `preimagen-consumidor.mjs.txt` conserva bytes originales, y el patch contiene el cambio exacto. No se modifica el productor R36, su programa, dinero, normativa, lib/, inventario, snapshots, confianza, ESTADO o DECISIONES.

La evaluación causal mantiene un contexto anual único: entrada céntimos → conversiones individuales/semilla → rendimientoIntegroTrabajo → selección de modo y cotizacionesSociales → outputBinding → crearLineaCalculo → origen.decimal. Los objetos se proyectan por propiedad al atravesar cada fase; el slice de base no alcanza las celdas MEI. Se mantienen las llamadas sucesivas con valores iguales como ejecuciones/frames diferentes. El display a dos decimales permanece distinto del decimal exacto.

El consumidor verifica fuentes reales, programa, software/protocolo, frames y referencias, utiliza aristas para comprobar alias/operandos/ramas y obligaciones de cada salida y deriva los slices. El replay de la IR fijada comprueba operaciones, selección, unidades y orden restantes. No se presenta comparar JSON del mismo productor como suficiencia independiente: se combina con obligaciones causales explícitas y controles externos de expectativas racionales, fuentes y TS real. PROTOCOLO.md precisa los roles, terminales, exclusiones y límites.

## Matriz individual

`matriz-individual11.json` contiene decisión, evidencia de casos ejecutados, objeción experta, respuesta, coste y alcance para cada sitio. `casos.json` identifica ejecuciones y resultados por sitio; `testigos.json.gz` conserva diez ejecuciones completas verificadas, con slices individuales, vacíos, repetidos, ambos modos 2018, MEI y cero por tag legacy. No son un catálogo estático ni testigos de otras entradas.

| anual.ss | Obligación discriminante propia |
| --- | --- |
| base | Céntimos/conversión individual, máxima anual y 7/5 meses 2018; exclusión MEI |
| exceso | Salario menos base seleccionada y saturación inferior cero EUR |
| empresarial-ordinaria | Base y cinco tipos empresa; semilla, receptor y captura lado |
| trabajador-ordinaria | Cinco tipos trabajador, incluidos ambos ceros; lado distinto |
| mei-empresarial | Hoja ratio empresa y selección 2022/23/25/26, sin confundir objeto MEI con importe |
| mei-trabajador | Hoja ratio trabajador; importe cero igual no identifica procedencia |
| solidaridad-empresarial | Año/tag/modo, celdas e índices propios; reparto legacy separado |
| solidaridad-trabajador | Tres tipos propios o reparto legacy /6; selección incluso con cero |
| empresarial-total | Herencia de ordinaria, MEI y solidaridad empresa por sus sumandos |
| trabajador-total | Herencia de los tres sumandos trabajador, sin cambiar lado |
| coste-laboral | Salario más total empresa; transporte exacto y display separado |

## Pruebas y calidad

El rojo se conserva en scratch como rojo.mjs/rojo.log: importa y ejecuta el consumidor anterior y alcanza AssertionError con el mensaje EVIDENCIA_INSUFICIENTE sobre productores anuales enlazados. No es un import roto. verde.mjs conserva la misma aserción activando explícitamente el modo nuevo; verde.log registra su pase.

Las pruebas nuevas contrastan por propiedad las once salidas contra APIs TS reales, con vacío, cero, dos salarios, repetidos, ordinario/alto, 2018 canónico/legacy, MEI 2022/2023/2025/2026 y ambos lados de límites de solidaridad. Un control propio usa fracciones BigInt y constantes leídas en las fuentes para los once importes 2025; otro fija las dos saturaciones 2018. Se conserva la corroboración histórica condicionada 438/684, sin reimplementar ni repetir toda esa matriz. Igualdad financiera no sustituye identidad causal.

Adversos ejecutados: arista binding/salida, lado, modo/año, céntimos/EUR, ratio/importe, índice/celda, frames fusionados, semilla/captura/orden, argumento sin arista, transporte, fuente, slice fingido, recibo de otra entrada/ejecución y mutación de copia pública. Cada sitio tiene un rechazo individual del transporte mutilado. Otro control intercambia MEI empresarial/trabajador de importe cero igual. La API de construcción verificada rechaza programa opaco y función externa. No se atribuye defecto fiscal a estos fallos de evidencia.

La comprobación de colecciones cuenta callback e índices dentro del frame concreto, preservando multiplicidad y semilla con vacío. Su primer ensayo contó por nodo estático y obtuvo veinte en vez de cinco: mezclaba cuatro invocaciones del mismo reduce. Se conserva ese fallo del instrumento; la corrección exige el padre de frame efectivo. Es precisamente la distinción que este protocolo debe mantener.

Tipado TS nuevo estricto con configuración que extiende tsconfig.json real, exactOptionalPropertyTypes y sin emisión; dependencias del padre solo lectura, paths y caches propios. CheckJs=false sigue siendo la deuda heredada normal del proyecto MJS; se ejecuta además una sonda checkJs antes/después, cuyos diagnósticos se conservan sin declararla verde. No se desactiva ninguna de las dieciséis reglas anti-slop, todas a error. Vitest usa cargador native, maxWorkers:1, cache:false y cacheDir absoluto propio. Cada validación toma y libera flock de validación por comando. No se ejecutan Next build ni suites legacy masivas.

Los logs finales y la comparación checkJs se detallan en VALIDACION.md. Los intentos anteriores quedan en el payload: herramientas ausentes rg/python inicial resueltas con Nix, resolución inicial de plugins, fallo de formato por plugin tailwind, sintaxis TS no soportada por strip-only, errores de tipos corregidos y pases previos. Un pase coincidió con edición del hash de software mientras seguía ejecutándose y rechazó el cambio de bytes; se preserva sin interpretarlo como diferencia financiera. Las ejecuciones finales se hacen con código fijado.

## Decisiones, objeción y coste

D1. Proyectar valores por propiedad en cada frontera de binding/llamada. Evidencia: base excluye MEI y los agregados conservan sumandos. Objeción: transportar el objeto completo sería más compacto. Respuesta: introduciría dependencia espuria entre propiedades; la proyección conserva productor y selección por hoja. Coste: testigos mayores y replay adicional; alcance exclusivamente SS finito.

D2. Usar un intérprete de valores acompañados sobre la IR ya fijada, integrado como modo opcional. Objeción: mantener otro evaluador puede introducir diferencias en primitivas. Respuesta: no se copian fórmulas ni tablas, se limita la gramática y se contrastan contra APIs reales y racionales por salida; los modos históricos conservan su implementación. Coste: mantener adaptadores finitos y contrarrevisión nueva antes de extensión 65/19. No se afirma equivalencia operacional de instrumentación fallida ni de callbacks arbitrarios.

D3. Combinar verificación relacional, replay y controles independientes. Objeción: compartir el replay puede reproducir un defecto. Respuesta: no usarlo como único argumento de suficiencia; conservar obligaciones y pruebas discriminantes independientes y pedir al padre revisión nueva de esta vertical. Coste: suficiencia condicionada candidata, sin prueba universal ni cierre por hashes, recuentos o pruebas.

D4. No inventar salario para solidaridad legacy desactivada. Evidencia: el tag retorna cero sin consultar base. Objeción: una obligación común por las once salidas exigiría el recorrido salarial. Respuesta: el contexto anual conserva la fase ejecutada, pero el slice financiero de ese cero solo incluye las selecciones y el terminal necesarios. Coste: obligaciones específicas por salida/rama en lugar de un cierre uniforme.

D5. Separar payload, sobre y recibo terminal. Objeción: un manifiesto autorreferente no fija sus propios bytes. Respuesta: manifiesto de rutas, patch gzip y objetos por hash, reconstrucción independiente y recibo exterior. Coste: transportar también instrumentos/caches propios declarados y revisar el sobre aparte.

## Integridad y recepción

Antes de escribir se cotejaron físicamente las 22.112 entradas base con lstat/readlink/bytes/ejecutable, blob a blob bajo el lock de recepción: cero diferencias. El único extra inicial fue .git, metadato T3; se declara y excluye del censo de payload. fisico-inicial.json conserva el resultado observado; no se inventan mediciones iniciales de fechas.

El payload incluye código, schema, tests, documentación, fuentes por SHA256/SHA512, testigos, logs y scratch instrumental propio. La symlink scratch/node_modules apunta a dependencias padre en lectura y es prerrequisito local, no payload de paquetes. No se copian ni modifican dependencias del padre. La reconstrucción parte de blobs base solo para preimágenes modificadas, aplica patch -p0 y objetos por hash, sin copiar fuentes de payload para simular inclusión; compara todas las rutas, bytes, tamaños, modos y extras. Vacíos y datos comprimidos usan objetos; diff preserva también ausencia de newline. Ningún archivo entregado alcanza 10 MiB.

El cotejo terminal vuelve a recorrer todas las entradas físicas, admite exclusivamente la modificación exacta del consumidor registrada en manifiesto y exige cero borrados. Censa extras de todo el scratch propio y distingue sobre/reconstrucción. recibo-terminal.json fija el sobre sin autorreferencia. Fuentes técnicas de terceros siguen en su ubicación de solo lectura, identificadas por hashes; no son nuevos documentos fiscales ni autenticación.

No commits, bookmarks, init/reset, push, PR, main, deploy, servidor, preview, LFS, gasto, transferencia externa, mensajes externos ni limpieza. El padre hará recepción y revisión independiente nuevas. Las cuatro puertas públicas permanecen falsas. El objetivo global sigue abierto.
