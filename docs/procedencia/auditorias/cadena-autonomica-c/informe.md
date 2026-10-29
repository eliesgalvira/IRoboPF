# Cadena normativa C: Madrid, Murcia, La Rioja, Comunitat Valenciana, Ceuta y Melilla

Entrega candidata al 29 de octubre de 2026. Ningún hallazgo está aceptado. No se ha modificado el motor, hecho commits, movido bookmarks, inicializado repositorios ni ejecutado builds o suites legacy. Las escrituras propias se limitan a esta carpeta y su scratch. El corpus original se adquirió mediante el helper común autorizado.

## Resultado y alcance

Se reconstruye una matriz de **90 pares año–territorio**, 2012–2026, con **517 filas de tablas originales** asignadas a sus variantes anuales. Las filas se repiten cuando una variante persiste: no representan 517 leyes ni 90 cadenas aceptadas. Se examinan los 28 módulos de escalas y mínimos 2012–2025, el resolutor territorial y la integración de tramos. Los originales y modificadoras se descargan, no se sustituyen por los índices de `docs/fuentes` ni por comparaciones AEAT de los otros lotes.

`cadena-normativa.json` conserva la matriz anual, artículos, identificadores de originales, hashes, tablas candidatas y condiciones. `historial-articulos.json` documenta las modificaciones que el índice BOE atribuye a cada artículo; el índice se usa para localizar originales y estudiar persistencia, no para convertir la redacción actual en prueba de todos los años. `tablas-originales.json` conserva las celdas HTML de las publicaciones originales y su contexto. Contiene también tablas próximas no seleccionadas; la selección fiscal está en `contraste-originales.json`.

Hay **92 hallazgos candidatos: 79 match numéricos de alcance limitado, cinco mismatch, seis missing de soporte 2026 y dos ambiguous temporales**. Los cinco mismatch corresponden a Madrid 2022, Murcia 2022 y Valencia 2014, 2015 y 2016; refuerzan candidatos previos, no se presentan como cinco defectos nuevos. El contraste de límites y tipos no autoriza a validar cuotas fijas, devengos, mínimos o redondeos de toda la liquidación.

Esta entrega **no certifica cierre archivístico y jurídico exhaustivo**: quedan correcciones de errores y duplicados regionales concretos, validación de firmas/CSV y contrarrevisión. La columna `complete:false` conserva esa diferencia. La falta de aceptación no significa que solo se hayan recogido enlaces: los bytes, tablas, pasajes, cajas y cadenas están adjuntos por referencia verificable.

## Cadenas reconstruidas

### Madrid

- 2012–2013: Decreto Legislativo 1/2010, art.1. Tabla de cuatro tramos, 11,60/13,70/18,30/21,40 %. El art.2 establece mínimos por descendientes, incluidos 4.039,20 y 4.600,20 euros para tercero y siguientes.
- 2014: Ley 6/2013, art.1.Uno, BOE-A-2014-3254; DF entrada 1/1/2014.
- 2015–2017: Ley 4/2014, art.1.Uno y Dos, BOE-A-2015-1956. La DF fija entrada 1/1/2015; la excepción retroactiva de los apartados Tres y Cuatro no se extiende a la escala ni al mínimo del apartado Dos. Se conserva el literal `13.30` de una celda HTML: se interpreta como 13,30 %, no 1.330 %; el facsímil y revisor deben ratificarlo.
- 2018–2021: Ley 6/2018, artículo único.Dos, BOE-A-2019-4451 y original BOCM-20181228-1. La DF única.Uno aplica los apartados IRPF a **todos los períodos que finalicen durante 2018**, aunque entren en vigor el 31 de diciembre. No excluir fallecidos anteriores por la mera fecha de publicación.
- 2022: primero Ley 2/2021, BOE-A-2022-1192; después Ley 8/2022, BOE-A-2023-7340, que deflacta escala y mínimos. La DF aplica a períodos **iniciados desde 1/1/2022**. Conservar la primera como eslabón sustituido, no como segunda tabla final anual.
- 2023–2026: Ley 13/2023, BOE-A-2024-5610 y BOCM-20231221-2. Efectos para períodos iniciados desde 1/1/2023. El historial del art.1 y de los mínimos no registra otra modificación posterior en el texto consultado, cuya actualización global llega a julio de 2026. No se infiere persistencia simplemente de que el motor reutilice 2025.

### Murcia

Texto base: Decreto Legislativo 1/2010, BOE-A-2011-10542. El texto original de 2010 no sirve como tarifa final de 2012: hay modificación del art.2 por Ley 7/2011, BOE-A-2012-2270. Para 2013–2014, Ley 6/2013, BOE-A-2013-8990, art.1.Uno, declara efectos desde 1/1/2013. Para 2015, Ley 13/2014, BOE-A-2015-946, art.55. Para 2016–2018, Ley 1/2016, BOE-A-2016-3540, art.56.Tres, con efectos desde 1/1/2016 pese a publicación en febrero.

La Ley 14/2018, BOE-A-2019-2039, art.56.Dos fija la tabla general del art.2 y art.56.Nueve introduce la **DA quinta con tablas expresas 2019, 2020, 2021 y 2022**. Por eso la tabla general de cinco tipos 9,5/11,2/13,3/17,9/22,5 % corresponde al tramo posterior al régimen temporal, no a todo 2019–2022. La persistencia 2023–2026 se apoya en el art.2 y en el agotamiento expreso de esos ejercicios de DA5.

El Decreto-ley 4/2022, BORM-s-2022-90296, sustituye DA5.4. Se ha recuperado también la convalidación BORM-s-2022-90350. El original, página PDF 4, conserva fuera de la tabla la cuota **8.716,67 + 22,70 % del exceso sobre 60.000**, para base estrictamente superior a 60.000. Esa cuota ya aparecía en la tabla 2022 de la Ley 14/2018; la deflactación de 2022 no la recomputa. A 60.000,01: integración del motor 8.625,84374 frente a literal 8.716,67227; redondeadas, diferencia 90,83 euros. El punto 60.000 exacto y sus dos vecinos requieren prueba separada. No se presupone que la discontinuidad sea una errata ni que la ausencia de una corrección en un índice descarte toda rectificación regional.

### La Rioja

Se recuperan las leyes anuales: Ley 7/2011 (BOE-A-2012-1142), Ley 7/2012 (BOE-A-2013-452), Ley 13/2013 (BOE-A-2014-404), Ley 7/2014 (BOE-A-2015-352) y Ley 6/2015 (BOE-A-2016-392). Se conserva la tabla de cada original; no se extiende retrospectivamente el art.31 vigente.

La Ley 10/2017, BOE-A-2017-13750, consolida la escala en art.31; su DT tercera establece efectos desde 1/1/2017 para los artículos correspondientes. La Ley 2/2018, BOE-A-2018-1917, art.1.Uno y Dos modifica escala y añade art.31 bis: aumenta solo la discapacidad de descendientes a 3.300/9.900 y **no modifica gastos de asistencia**. DF: los apartados indicados rigen desde 1/1/2018, no desde febrero. Ley 1/2019, BOE-A-2019-3643, art.4.Uno y DF: desde 1/1/2019. Ley 2/2020, BOE-A-2020-1939, art.1.Uno y DF: desde 1/1/2020. Ley 13/2023, BOE-A-2024-1778: nueva escala desde 2024.

La Ley 9/2025, BOE-A-2026-991, introduce art.31 ter desde 1/1/2026. Exige IPC regional interanual de diciembre **superior al 3 %**, prevé actualización y presentación de proyecto de ley. No autoriza copiar el IPC nacional ni aplicar automáticamente la proyección legacy. El INE, nota IPC diciembre 2025, página 3, sitúa La Rioja en **2,6 %**: no se cumple ese disparador para diciembre 2025. Se cotejó la geometría: la etiqueta Rioja ocupa y545,20–556,37 y su 2,6 ocupa y546,98–555,03 puntos; corresponden a la misma fila. El orden de texto extraído del gráfico difiere del orden visual, por eso no se emparejaron por índice. Queda contrarrevisión independiente.

### Comunitat Valenciana

La Ley 13/1997 es el texto base. Para 2012–2013 es decisiva la **DA duodécima**, introducida por Decreto-ley 1/2012, art.16, y modificada por Ley 10/2012, art.65, BOE-A-2013-663. El identificador histórico DOCV-r-2012-90000 devolvió 404 en ambos endpoints BOE; se recuperó el original DOGV 2012/210, página 9, y la convalidación oficial de Les Corts. Esta última menciona una corrección de 17/1/2012 que queda pendiente de adquisición y lectura.

Ley 5/2013, art.66, BOE-A-2014-970 extendió DA12 a 2014. Pero Ley 7/2014, BOE-A-2015-1236, art.45 volvió a modificar el art.2 y DA12; **DF cuarta.b da entrada al art.45 desde 1/1/2014**. Esta pieza cierra el eslabón retroactivo que faltaba al lote 2012–2016: no debe conservarse para la liquidación final 2014 la tarifa intermedia de Ley 5/2013 por haber sido la publicada al inicio del año.

2017–2020: Ley 13/2016, BOE-A-2017-1291, art.11. 2021 y antecedente de 2022: Ley 3/2020, BOE-A-2021-1859, art.35. Decreto-ley 14/2022, DOGV-r-2022-90328, art.2 y 3, nueva tabla y mínimos; DF de entrada 28/10/2022. Para fallecimientos anteriores se conserva la variante previa como cuestión temporal específica; no se decide una retroactividad universal por leer aisladamente «hasta el 31 de diciembre de 2022». 2023–2025: Ley 9/2022, BOE-A-2023-5483, DF primera.Uno, períodos terminados desde 1/1/2023.

**2026 sí tiene reforma propia:** Ley 5/2026, BOE-A-2026-19331, art.18 (PDF BOE p42 y continuación), efectos para hechos imponibles devengados desde 1/1/2026. Tipos: **8,8/11,7/14,6/17/19,4/21,9/24,4/26,1/27,35/28,35/29,35 %**. La DT tercera fija otra tabla para **2027**, que no entra en este intervalo. Se descargan además DOGV original y corrección de errores del preámbulo, ambos de 10/8/2026. Ejemplos de cuota bruta: base12.000 →1.056 en2026 frente a1.080 según tabla2025; base200.000 →47.114 frente a47.700. El motor no ejecuta una copia2025: rechaza el territorio real2026. Hallazgo `missing`, no `mismatch` ficticio de una ejecución inexistente.

### Ceuta y Melilla

No tienen legislador autonómico de estas escalas. Cadena estatal: Ley 35/2006, art.65, modificado por Ley 22/2009; DA32 añadida por Ley 2/2011, disposición final49.Dos; Ley26/2014 y Real Decreto-ley9/2015 modifican las reglas posteriores. Se descargan las originales.

En **2015**, la escala temporal del art.65 se busca en DA31, no en la tabla permanente del mismo artículo: tipos10/12,5/15,5/19,5/23,5 %, corte34.000. En2016–2026 corresponde tabla9,5/12/15/18,5/22,5 %, corte35.200. La modificación de DA32 por RDL9/2015 tiene efectos desde1/1/2015; no se confunde con un cambio de tabla de mitad de año. La deducción por rentas obtenidas en las ciudades es otro ámbito y no se valida aquí. Forales excluidos.

## Pruebas, límites y decisiones

`contraste-originales.json` contiene cuotas publicadas, integral independiente Decimal, límites y tipos; `bordes` enumera cada límite y ±0,01. Son cálculos independientes sobre tablas leídas, no pruebas ejecutadas de toda la liquidación. `tablas-motor-inicial.json` y `tablas-motor.json` documentan la modificación concurrente de Madrid2020 (53.407,29 a53.407,20); no fue realizada por este auditor. Los cinco candidatos de cuotas fijas requieren una prueba fallida del motor antes de un eventual arreglo. No se cambia una política de redondeo porque una suma difiera de una cuota fija.

Los mínimos propios quedan en `minimos-originales.json`: seis variantes documentadas; para mínimos estatales heredados se enlazan las leyes39/2010 y26/2014. Falta el contraste completo de requisitos personales, prorrateos y casos familiares, que corresponde al auditor de mínimos. El Python legacy se leyó sin ejecutarlo: no tiene tarifas autonómicas. No se carga el Excel de150MB ni se repiten sus lecturas de otros lotes.

Objeción experta a usar solo BOE: la publicación regional fija entrada en vigor y puede contener correcciones no trasladadas aún. Decisión: conservar originales BOE y regionales recuperados, más fecha regional publicada en la ficha; coste aceptado: faltan duplicados regionales de parte de las leyes, sin certificar exhaustividad archivística.

Objeción experta a una suma de tramos: puede perder cuota fija y discontinuidad legal. Decisión: conservar las cuatro columnas y párrafos separados, no derivar la cuota legal desde tipos; coste: candidatos de redondeo necesitan criterio independiente y prueba de cuota neta.

Objeción experta a deduplicar quince años: ocultaría modificaciones intermedias. Decisión: matriz anual con enlaces a variantes y al historial de artículo, más originales modificadores; coste: se repiten relaciones anuales, pero no se inventan quince documentos iguales.

Objeción experta a los hashes: prueban integridad, no autenticidad del firmante. Decisión: conservar SHA256/SHA512 y HTTP por HTTPS, sin afirmar validación PAdES/CSV; coste: firma, revocación, sello temporal externo y facsímiles recortados quedan pendientes. Las cajas son puntos PDF con origen superior izquierdo, páginas1-based; `verificacion-citas.json` es comprobación del mismo auditor, no aceptación independiente.

Pendientes concretos: corrección DOGV17/1/2012; cotejo de todas las referencias posteriores/correcciones de cada ley, no solo historial del artículo base; duplicados regionales restantes; fechas de devengo anteriores enMurcia/Valencia2022; contrarrevisión del cotejo geométrico de IPC riojano; identificación individual de todas las celdas y exclusión de bloques próximos que la extracción conserva como candidatos; revisión independiente y pruebas fallidas. Los hallazgos `match` son solo del contraste limitado descrito, nunca sustituyen estos pendientes.

## Reproducción

Scratch `.cache/procedencia/cadena-autonomica-c/`: `adquirir.py`, `originales.py` importan `tools/procedencia/descargar.py`, con lock común, User-AgentIRoboPF y pausa; no hubo peticiones paralelas propias. `historial.py`, `motor.py`, `engine.mjs`, `tablas.py`, `cadena.py`, `comparar.py`, `bordes.py`, `minimos.py`, `hallazgos.py`, `extraer.py`, `verificar.py` producen los archivos de esta carpeta.

Python estándar: `nix shell nixpkgs#python3 -c python <script>`. Instantánea de módulos: `nix shell nixpkgs#bun -c bun .cache/procedencia/cadena-autonomica-c/engine.mjs`. PyMuPDF mediante `uv run --python <python3 de Nix> --with pymupdf`, dentro de Nix con `stdenv.cc.cc.lib` en `LD_LIBRARY_PATH`. Sin instalación global ni TypeScript/Effect nuevo; no procede anti-slop sobre estos informes.

Se corrigieron dos fallos auxiliares: sintaxis de comprensión en un comando de bordes y nombres scratch derivados de URL con barras en la extracción incremental. Los originales permanecieron intactos. La entrega incluye verificación final separada; no se consideran exitosos esos intentos fallidos. Los manifiestos excluyen Set-Cookie, Cookie, Authorization y Proxy-Authorization.

## Ampliación: correcciones y cajas de fila

Se recuperaron diez publicaciones de corrección adicionales: Madrid2018 corrige la fecha del cierre; Murcia2019 referencias de personal/subvenciones, Murcia2016 partidas presupuestarias, Murcia2015 tablas de ingresos/gastos; Valencia2014/2015/2021 preceptos de función pública, medio ambiente y urbanismo. No alteran las escalas ni mínimos examinados. `correcciones-examinadas.json` y `citas-correcciones.json` conservan el resultado candidato y sus originales. No se extrapola esta conclusión a la corrección DOGV17/1/2012 aún pendiente.

Las **517 filas tienen al menos una caja candidata enlazada**, con hash y texto reextraíble. Se completaron expresamente Valencia2021 (BOE p50) y Ceuta/Melilla2015 (BOE-A-2014-12327 p54). Se excluyó la tabla estatal idéntica de p53: igualdad de cifras no basta para que el artículo citado sea correcto. La variante valenciana previa al28/10/2022 y redacciones intermedias sustituidas figuran en `variantes-intranuales.json`; el recuento517 corresponde a la matriz anual principal.

`firmas-observadas.json` recoge `pdfsig -nocert` por PDF único: la validez criptográfica que reporte la herramienta **no incluye** confianza del certificado, revocación ni validación jurídica. Hay PDFs sin firma y firmas que la herramienta no llega a verificar; no se ocultan como autenticados. La comprobación final de integridad no sustituye estas limitaciones.

Corpus al cierre: **134 adquisiciones correctas, 133 blobs únicos y 71 adquisiciones PDF (70 PDF únicos)**; cero diferencias SHA256/SHA512/tamaño. Los originales solo están en caché, no se incorporan PDF grandes al árbol documental. Se localizaron 517 filas anuales con cajas candidatas; su coincidencia no equivale a aceptación jurídica.

Verificación final: **2.752 citas de70 originales PDF reextraídas, cero diferencias de hash o texto por caja**. Comprobación del mismo auditor, no contrarrevisión. Las comprobaciones JSON exigieron todos los campos del contrato, identificadores únicos y enlaces candidatos para las517 filas. También se corrigió el uso de referencias débiles de página al cachear TextPage en el verificador; la ejecución final terminó con estado pass.
