# Revisión independiente de cadena autonómica C

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Fecha de corte: 29 de octubre de 2026. **92 decisiones individuales: 11 accepted de alcance limitado y 81 needs-evidence; ninguna escala fiscal completa certificada.** Los 90 pares y 517 referencias de fila están cubiertos. `revisiones.json` conserva estado anterior, reclasificación, alcance, originales, objeciones y casos por ID. `matriz-legal.json` separa las variantes anuales.

## Resultados accionables

**P1 — Murcia 2022: el integrador pierde una cuota fija expresa y una discontinuidad.** El artículo único del DL4/2022 sustituye DA5.4; original BORM de29/9/2022 pp3–4, SHA256 `962a88eff2128d036bf8745c31faadb050c45abc0e93e712c3b3d50c72906bf4`. La descarga directa de BORM, independiente de la copia BOE, produce exactamente ese hash. Para base **estrictamente superior** a60.000, publica8.716,67 más22,70% del exceso. Ley14/2018 ya contenía esa cuota en su tabla2022; no es una cuota reconstruida por el auditor. La convalidación de19/10/2022 se publicó16/11/2022, BORM5831. No modifica la cláusula.

Reproducción ejecutada: base60.000,01, cuota literal8.716,67227, motor8.625,84374; redondeadas8.716,67 y8.625,84. Para60.000 exactos sigue la cuarta fila:4.142,62+(60.000−35.394)×18,22%=8.625,8332, no8.716,67. Para59.999,99:8.625,831378. Las diferencias de céntimos dentro de la tabla se separan del salto90,83. Localizaciones actuales: `lib/dominio/normativa/datos/irpf-autonomico-2022.ts:207` y `lib/dominio/irpf/cuotas/escalas-gravamen.ts:61` (multiplicación de anchura por tipo en línea101). Probar ambos vecinos y el punto exacto antes de cualquier arreglo. No convertir `>` en `>=`, ni recomputar una cuota continua para hacer desaparecer el salto.

Búsqueda adversarial de rectificación: consultas sobre BORM por número4846, título DL4/2022 y «corrección de errores»; consulta sobre CARM; lectura de referencias posteriores de la publicación original BOE; descarga regional directa del anuncio4846. No se localizó una rectificación. La portada dinámica del BORM solo aporta HTML de aplicación: **no acredita búsqueda exhaustiva del boletín**. Aceptado el defecto frente al literal publicado; no se autoriza desde esta revisión una regla universal para fallecimientos anteriores a29/9/2022. Antes de extenderla a esos devengos, cerrar interpretación temporal.

**P2 — Cuotas publicadas frente a integración: Madrid2022 y Valencia2014–2016.** Se reproducen diferencias al céntimo con originales legales, no con tablas AEAT: Madrid a55.596,90 da7.421,04 por cuota fija frente a7.421,0505 integrado; Valencia a120.000,20 da22.304,90 frente a22.304,8932. Aceptados como discrepancia de cuota bruta, no como cuantía de deuda ni autorización para cambiar globalmente el redondeo. El motor resta después la cuota del mínimo; esa liquidación completa no se ha probado aquí.

Los casos propios revelan también diferencias al céntimo en algunos antiguos `match`: se conserva `previousStatus:match` y se propone `reclassification:ambiguous` sobre cuotas. No se afirma que sus límites o tipos sean erróneos. Los104 casos discrepantes incluyen vecinos y años que comparten tabla: no son104 errores independientes.

**P2 — Soporte2026.** `lib/dominio/irpf/comunidades/comunidad-autonoma.ts:451–482` rechaza los seis territorios reales y admite solo `simulada-estatal`. Se aceptan los seis `missing` exclusivamente como carencia de soporte. No se describe una ejecución territorial ficticia con tabla2025.

## Eslabones cerrados y alcance temporal

- **DOGV17/1/2012 cerrado:** recuperado2012/455, SHA256 `082d021d4eb1cce03466aa3822efe69d4a48dcb262c5af2a82595e6051ca7dbc`, una página física, página impresa1503. La corrección añade personal de centros Servef al artículo3.4 de jornada de trabajo. No toca el art16 ni la DA12 de IRPF. Lectura del texto y facsímil completo, sin tachados fiscales. Metadatos y cajas nuevas en `dogv-2012-455.json`. El intento inicial de sumario devolvió403; el PDF individual se descargó correctamente en ambos hosts.
- **Valencia2014:** Ley7/2014 art45 y DF4.b, BOE-A-2015-1236 pp58 y127, establecen entrada del art45 desde1/1/2014. Este cambia el art2 y limita DA12 a2012–2013. Queda descartado conservar Ley5/2013 como tarifa definitiva2014 por haber sido publicada primero. Ello no elimina las discrepancias de cuotas fijas2014–2016.
- **Valencia2026:** Ley5/2026 art18, BOE pp42–43, regula devengos desde1/1/2026, inclusive. DOGV10425 de10/8/2026 y BOE17/9/2026: fechas leídas en los documentos, no deducidas de la URL. La corrección10425bis de10/8/2026 reproduce el preámbulo omitido en castellano. La tabla DT3 para devengos desde1/1/2027 es distinta y queda fuera de2026. Ejemplos literales2026:12.000→1.056;200.000→47.114. Son contrapruebas documentales, no resultados de un motor territorial2026 inexistente. No se afirma cierre del ejercicio2026.
- **Madrid:** Ley6/2018 DF única.Uno comprende todos los períodos finalizados durante2018; no se excluyen fallecidos anteriores a31/12. Ley8/2022 comprende períodos iniciados desde1/1/2022, y Ley13/2023 desde1/1/2023. La ley intermedia2/2021 se conserva en la cadena2022. Los índices de modificación ayudan a investigar persistencia, pero no sustituyen todas las publicaciones posteriores y correcciones regionales. Madrid2020 tenía53.407,29 en la foto inicial; el módulo actual contiene53.407,20. No se propone modificar nuevamente ese límite; las diferencias de integración de cuotas son un asunto distinto. Tampoco se reabre la etiqueta del año ya corregida.
- **La Rioja2026:** Ley9/2025 publicada BOR30/12/2025 y BOE17/1/2026, art1.Uno añade31ter, con entrada1/1/2026. Umbral: IPC interanual **regional** de diciembre anterior **superior al3%**, seguido del procedimiento legislativo allí descrito. La nota INE de15/1/2026 para diciembre2025 da2,6 para Rioja. El2,9 nacional no es el indicador legal; tampoco la inflación subyacente2,6 de portada, aunque coincida. El disparador no se cumple. No se acepta automáticamente una escala futura por este solo dato.
- **Ceuta/Melilla:** DA32 añadida por Ley2/2011 y reformada por RDL9/2015 remite al art65. En2015 interviene DA31.1.b Ley26/2014, BOE p54; se descarta la tabla estatal idéntica p53. Desde2016, art65 permanente, corte35.200. El cambio de DA32 tiene efectos1/1/2015, no genera una tarifa de mitad de año. No se revisa aquí la deducción por rentas en las ciudades.
- **Fallecimientos2022:** Murcia utiliza «en el período impositivo2022» y DF de entrada29/9; Valencia tiene selector explícito anterior28/10, además de las disposiciones temporales del DL14/2022. Las dos ambigüedades conservan `needs-evidence`: hace falta cerrar la relación entre esas cláusulas, devengo por fallecimiento y normativa temporal general. No se transforma una fecha de publicación en retroactividad universal ni se ordena borrar el selector valenciano.

## Pruebas y cobertura

Se importaron personalmente los14 módulos actuales2012–2025 y se obtuvo la tabla efectiva de los seis territorios:84 pares. Se reextrajeron las tablas de publicaciones originales HTML para los90 pares, incluyendo tablas no ejecutables2026. Se verificaron hashes de originales referenciados; las duplicidades de manifiesto no se cuentan como documentos nuevos. Los scripts propios están únicamente en `.cache/procedencia/revision-cadena-autonomica-c/`.

`cases.py` construye casos desde las celdas HTML originales (con cláusula separada murciana); `cases.mjs` llama al integrador real de la aplicación. **Ejecutados1.514 casos,104 diferencias al céntimo**. `casos-independientes.json` contiene entradas y expectativas; `resultados-ejecutados.json` añade resultados reales. El criterio de céntimos usa Decimal `toFixed(2)` como discriminante, no declara una política fiscal general de redondeo. No se ejecutó liquidación completa, Next build ni suite legacy. Un worker de cálculo; sin instalaciones globales o alteraciones de node_modules.

Reproducción desde raíz:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/revision-cadena-autonomica-c/cases.py
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-cadena-autonomica-c/cases.mjs
```

Los scripts de extracción usan `uv run --with pymupdf` o `--with beautifulsoup4`, Python de Nix y librería C++ de Nix para PyMuPDF. La descarga usa el helper autorizado con lock común, User-Agent y pausa. Los HTML no reciben página ni bbox ficticios. Las páginas PDF son físicas, base1, coordenadas en puntos con origen superior izquierdo.

## Límites que bloquean aceptación completa

La matriz contiene eslabones principales y contrapruebas de cuotas, pero **no cierra exhaustivamente todas las reformas/correcciones y publicaciones regionales de las34 variantes**. Por ello81 decisiones siguen pendientes; un índice o una suma de tramos no suple esa investigación. Las517 filas tienen reextracción de cajas vinculadas, pero muchas cajas abarcan toda la tabla: no son517 selecciones geométricas de fila/celda certificadas. No se validaron confianza de certificados, revocación, CSV ni sellos de tiempo. No se certifica mínimos familiares, prorrateos, deducciones, residencia territorial ni la liquidación neta.

Las cifras que no superan estos límites permanecen candidatas. El coste de esta decisión se hace explícito: se entrega cobertura técnica completa e investigación jurídica focalizada con92 decisiones, no una certificación jurídica exhaustiva de90 escalas. Los casos discriminantes y los eslabones cerrados no convierten en aceptadas las restantes reglas.

## Verificación final y fallos de trabajo separados

Se reextrajeron **2.757 citas, cero diferencias**, mediante PyMuPDF `get_textbox`; resultado en `verificacion-citas-independiente.json`. Un ensayo inicial con `get_text(clip=...)` dio1.194 diferencias por la distinta inclusión de caracteres en el borde: no se atribuyen a corrupción del original. La primera ejecución de `get_textbox` sin cachear páginas se interrumpió por coste; se repitió con páginas/TextPage retenidas y terminó correctamente. No se ocultan esos intentos como comprobaciones exitosas.

La geometría INE se releyó y se miró el render completo: etiqueta y valor ocupan respectivamente y545,1995–556,3686 e y546,9821–555,0258. La caja conjunta devuelve literalmente `La Rioja\n2,6`. `geometria-ine.json` conserva cajas, hash y fecha15/1/2026. Se examinó también visualmente BORM p4: la cláusula de cuota está fuera de la tabla y no presenta tachado. Hay430 citas nuevas por bloques de páginas críticas en `citas-refinadas.json`; su abundancia tampoco certifica semántica.

Prueba fallida **realmente ejecutada**, Bun1.3.13, salida1: `nix shell nixpkgs#bun -c bun .cache/procedencia/revision-cadena-autonomica-c/murcia-fallo.mjs`. Aserción de cuota bruta8.716,67; resultado real8.625,84. La prueba conserva el contrato de cuota bruta que discrimina el defecto; no constituye una liquidación completa.

Metadatos de las adquisiciones nuevas, intento403 y límites de búsqueda regional en `busqueda-y-adquisicion.json`. `codigo-actual.json` fija hashes actuales separados de la foto del autor. Las carpetas ajenas, ESTADO y DECISIONES permanecen sin cambios de esta revisión.
