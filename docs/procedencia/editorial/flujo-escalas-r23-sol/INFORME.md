# Escalas, mínimos y composición: edición técnica R23

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Base examinada: `07c07e6376a72f229be735a904ecf36517a1b571`. Propuesta editorial y pruebas de alcance acotado.

Esta edición resuelve relaciones técnicas del lote y conserva las identidades históricas R21. No es auditoría jurídica, aprobación propia ni cierre del encargo global. No modifica el motor, expectativas recibidas, snapshots, registros de confianza ni documentos ajenos. Las nuevas aristas necesitan revisión independiente y composición con los otros lotes. `wiringAllowed=false` continúa vigente.

## Hallazgos materiales

**F01. El mínimo catalán no tiene rama por renta en estas fuentes.** Catalunya2020 se obtiene de un alias estatal; Catalunya2021 hereda por spread el campo del mapa2025. El resolver de mínimos recibe comunidad, sin BG. Las bases17707,20/17707,21 seleccionan escalas gallegas2014–2015, no un mínimo catalán. Se preserva esta ausencia técnica y no se rellena con una regla normativa supuesta. La condición de renta del titular próximo en derechos explícitos sí existe y no es renta del descendiente.

**F02. El modo no elige directamente entre escala conjunta y dos componentes.** Lo decide `escalaAutonomicaIgualEstatal`; simulada2012–2015 tiene false y desde2016 true. El modo selecciona cotizaciones canónicas o legacy, cuyo efecto llega a bases por salidas precisas de frontera. La conciliación del simulador se calcula en paralelo y no vuelve a restarse de la líquida legal.

**F03. El catálogo no suma deducciones por código.** La entrada no vacía `caso.deducciones` rechaza la liquidación. El sumando real es el agregado opcional en céntimos. En comunidad real se limita a cuota autonómica general postmínimo más ahorro autonómico postmínimo; la simulada conserva la rama sin ese límite. El catálogo decide diagnóstico de rechazo, no importe. Este hecho corrige la omisión de R21 que pedía descomponer consignaciones por código: no hay tal evaluador en este camino.

**F04. Cuota, base inferior y tipo tienen funciones distintas.** La publicada selecciona última fila aplicable y calcula Q+(B−L)t. El límite superior mostrado es metadato, sin multiplicar cuota de esa fila. La integrada usa límite superior/anterior y anchos. Murcia2022 mantiene estrictamente B>60000; ni siquiera cambiarlo a≥ es un arreglo permitido. Madrid2020 se resuelve hasta la hoja tramos[3][0], sin trasladarla a la tabla publicada2025.

**F05. Las fechas seleccionan propiedades distintas.** Valencia2022 selecciona mínimos y tarifa por fecha civil UTC; IllesBalears2023 selecciona mínimos por instante y Extremadura2023 tarifa por otro corte. No usar un único selector de «fallecimiento» para todas las propiedades. Las fechas familiares de constitución e inicio del incremento tampoco son intercambiables.

**F06. Ahorro tiene dos contratos de tablas.** Bruta/desglose usan conjunta integrada. Postmínimo usa escalas publicadas por componente y remanentes independientes. Hasta2014 se reduce base antes de tarifa; desde2015 se resta tarifa del remanente. En2015 estatal/autonómica son asimétricas. Ninguna de las264 celdas generales se convierte en celda del ahorro; sí hay tránsito de bases y mínimos por argumentos explícitos.

**F07. La ruta explícita conserva signo y etapa.** BIG y BLG son neto con signo; solo tarifas usan base positiva. Trabajo resta art20 una vez; EDS recibe aporte ya reducido. Cuota líquida legal suma componentes; DA61 solo modifica posterior cuando brutoServicios>0. Pensión y EDS no se convierten en empleo. DA61 se descompone en legal, límite atribuible, aplicable y posterior; histórico80bis queda separado por discriminante contractual.

## Qué contiene la entrega

`grafo.json.gz` es la superposición por propiedades de retorno y variables de composición. Conserva siteId, sujeto/revisión, snapshot y selector históricos, sin fingir que pertenecen al snapshot actual. Cada relación tiene salida fuente/símbolo/propiedad, entradas consumidas, fórmula, rama y evidencia por SHA256/rangoUTF16. Distingue value, selection y domain. La mera cohabitación queda fuera del grafo semántico.

`fuentes.json.gz` conserva declaraciones, importaciones, propiedades, llamadas, retornos, asignaciones y tokens separados. Son hechos sintácticos para comprobar las relaciones, no un cierre fiscal ni un conjunto automático de dependencias. `rutas-datos.json.gz` continúa asignaciones/importaciones/spreads por territorio y año hasta tokens: esa continuación evita volver a tratar los selectores internos como fronteras. `AMPLIACION.md` especifica qué ramas sustituyen las tablas ordinarias antes del cálculo.

`celdas.json.gz` conserva las264 decisiones nominales y102 occurrenceId efectivos, payload por ruta/hash, selector, alcance histórico y consumidores. Añade elección de tabla, selección de fila y operación de cuota. No amplía las condiciones nominales del payload ni las convierte en aceptación del consumidor. `madrid.json` continúa el concepto hasta la representación integrada real2020; no usa la identidad de la tabla2025.

`fronteras.json` declara las llamadas a los otros lotes por archivo/hash/símbolo, argumentos y propiedades de salida. El límite es el motor de trabajo/rentas/actividad/cotizaciones/retenciones, no los helpers internos de escalas/mínimos/deducciones. Las fórmulas locales usan solo esas salidas exactas; no duplican su implementación. `omisiones.json` relaciona por sitio el estado recibido con la evidencia nueva; `AMPLIACION.md` explica los casos no aplicables y las fronteras.

## Decisiones, objeciones y costes

**D1. Resolver rutas de propiedades, no unir constantes del módulo.** Objeción del mejor experto: un AST por sí solo no acredita influencia. Respuesta: extracción sintáctica separada de relaciones elegidas por operación; propiedades/tablas se resuelven por identidad de fuente y asignación, jamás por número igual. Coste: mantener un intérprete limitado de construcciones de datos y revisión semántica posterior de sus resúmenes.

**D2. Preservar ausencia de condición catalana y rechazo por códigos.** Objeción: podría ocultar una regla fiscal requerida. Respuesta: se registra la ausencia como hecho técnico y se mantiene interpretación pendiente; no se inventa implementación. Coste: no poder presentar la explicación como liquidación jurídica exhaustiva ni como catálogo ejecutado.

**D3. Compartir contratos de frontera exactos.** Objeción: fronteras genéricas harían parecer completo un flujo incompleto. Respuesta: salidas y argumentos concretos en cada llamada, incluida llamadaart20 explícita distinta de anual. Coste: aún componer y contrarrevisar con otros lotes; no llamar aprobado al grafo propio.

**D4. Mantener históricos y nominalidades de celdas.** Objeción:264 decisiones pueden aparentar264 valores distintos. Respuesta: conservar ambas identidades y102 ocurrencias distintas; el alcance temporal no se propaga por alias. Coste: redundancia nominal deliberada y condiciones por consumidor, sin cierre por conteo.

**D5. Probar discriminantes sobre TS real sin arreglar el motor.** Objeción: un caso aislado no demuestra todas las aristas. Respuesta: casos de corte y mutantes distinguen relaciones concretas; fuente/expresión y revisión siguen siendo necesarias. Coste: no usar las pruebas como aceptación jurídica ni modificar resultados recibidos.

**D6. Reproducción con memoria acotada.** Objeción: los recorridos masivos y compilaciones simultáneas consumen memoria. Respuesta: procesar los archivos uno a uno y serializar AST, pruebas y controles de calidad. Coste: mayor tiempo de ejecución.

## Límites y preservación

No hay fuentes nuevas, adquisición, inspección facsimilar nueva, PAdES/CSV ni atestación. Integridad de bytes, autenticidad, número, interpretación y revisión siguen siendo ejes diferentes. Los originales anteriores y sus informes permanecen intactos. La evidencia de este análisis no acredita custodia independiente ni restauración externa.

Los resultados efectivos se leen en `codigos.log` y los logs de cada fase. No declarar verde por disponer de scripts; no sustituir una ejecución fallida por tolerancias ni desactivar reglas. Los errores iniciales propios se conservan y las correcciones solo afectan instrumentos de esta carpeta. La validación final registra únicamente lo observado.

**D7. Fijar las dependencias reales de las pruebas sin cambiar el proyecto.** Objeción del mejor experto: una dependencia del anfitrión puede hacer pasar operaciones compatibles y fallar después con otraAPI. Respuesta: aliases del tsconfig de scratch hacia los paquetes reales del repositorio, hashes conservados y `--no-install`; no se reemplaza ninguna función del motor. Coste: la reproducción depende de disponer de esos paquetes exactos.

El primer discriminante temporal de mínimos comprobaba por error el mínimo propio de ambos territorios. El rojo propio mostró que IllesBalears2023 conserva5550 a ambos lados del corte: cambia segundo descendiente2970/2700 y ascendientes, no todas las propiedades del objeto. Se conserva ese rojo y se corrige únicamente la propiedad observada por el instrumento, añadiendo la invariancia del mínimo propio. No se altera ninguna expectativa recibida ni implementación. Este resultado refuerza la separación de dependencias por propiedad en vez de atribuir todo el objeto a todo consumidor.

El cierre local propuesto por sitio queda en `candidate-local-closure-with-declared-boundaries`: comprende las asignaciones y mutaciones propias, los argumentos por instancia, los selectores y rutas de datos hasta tokens, las primitivas monetarias y las llamadas externas por salida. No reutiliza una función interna como frontera de otro lote. Componer ese cierre con los submotores y contrarrevisar las nuevas relaciones siguen pendientes; la denominación candidata no es una aprobación ni una aceptación de regla completa. `ocurrencias.json.gz` enlaza los tokens por fuente/hash/rango exactos y conserva explícitamente los que no tienen ocurrencia técnica exacta en el inventario, sin inventarIDs.

La última ejecución de `validar.sh` termina con códigos0 en extracción, resolución de datos, correspondencia de ocurrencias, generación, preparación, casos heredados, casos nuevos, anti-slop, Ruff, mypy, verificación y TypeScript checkJs. Se conservan todos los códigos anteriores y sus logs. Las expectativasR21 se mantienen:12 discriminantes y264 mutaciones individuales. Las pruebas nuevas contrastan26 grupos de selectores/composición,264 selecciones por identidad de objeto y el cambio de prioridad familiar800000/800001. Estos recuentos describen ensayos, sin sumarse como reglas aceptadas.

Las rutas de datos se resuelven sin errores internos. El cotejo de tokens encuentra una ausencia de occurrenceId exacto: el booleano `true` de `inferiorExclusivo` en Murcia, rangoUTF16[3394,3398). Se conserva su fuente y rol de selección y no se inventa unID ni se pierde la condición estricta. Los demás enlaces de ocurrencia proceden de coincidencia exacta de fuente/hash/rango, no de buscar cifras dentro de una declaración.

Bun emite en stderr un aviso interno `directory mismatch` para el tsconfig de scratch y termina los ensayos con código0. El aviso permanece en ambos logs; no se ha suprimido ni tratado como una aprobación ambiental. Los casos sí ejecutan las dependencias reales fijadas, incluida la validaciónSchema de derechos. No se desactiva ningún control a causa del aviso.

Después de la ampliación final de metadatos por instancia y atribuciones, `cierre.sh` regenera únicamente los artefactos afectados y repite verificación de fuentes/schema y calidadPython. No se amplía ni se repite la suite del motor sin motivo. El resumen final de esos controles está en sus logs `*-final.log`.

El cierre efectivo registra232 relaciones candidatas y coteja sus evidencias, sin convertirlas en232 reglas. Los logs finales de generación, verificación, Ruff y mypy terminan correctamente. El recorrido físico final vuelve a comprobar las14.957 entradas de base por lstat/readlink/bytes/modo, un blob cada vez: cero diferencias y diff contra base vacío. El HEAD permanece intacto. Los únicos archivos entregables nuevos pertenecen a esta carpeta; el scratch y las dependencias quedan fuera del patch/manifiesto. No se ha tocado ningún archivo de base.

El transporte es `manifiesto.json`, `entrega.patch.gz` y `binarios.json`. El manifiesto excluye su propio hash circular, incluye todos los demás archivos finales y declara baseSha256=null para las adiciones. El patch contiene las adiciones textuales contra ausencia en base; los gzip de datos/controles se reciben por ruta y hash. `cotejar_entrega.py` verifica el conjunto físico del transporte después de empaquetarlo. Esta entrega es revisión técnica candidata del lote, con composición y contraste independiente pendientes; el encargo global continúa abierto.
