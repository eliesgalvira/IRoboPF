# Necesidades expertas: auditoría de capacidad y requisitos reproducibles

Fecha: 29-10-2026. Dominio: `necesidades-expertas`. Primera ronda, con contrarrevisión incorporada al final de este informe. No se ha modificado código, hecho commits, movido bookmarks ni ejecutado builds o suites legacy. Referencia de lectura JJ: `3e5e0717150c5eaf030f6116b75f3f4182d45b96`; checkout compartido en movimiento, por lo que se adjuntan hashes de archivos examinados.

El producto tiene una base útil para explicar salarios y comparar años, pero no permite todavía reproducir todos los análisis de un experto. Las carencias principales son actividades económicas, varios pagadores con identidad y periodos, unidades familiares, series económicas versionadas y escenarios de deflactación ejecutables. La existencia de un tipo, un perfil o un enlace de fuente no acredita que el cálculo esté implementado ni que sea correcto.

Esta entrega contiene 16 requisitos y 16 hallazgos de capacidad. **No constituye validación exhaustiva de parámetros fiscales 2012–2026.** Se examina cada año como alcance requerido; las vigencias, cuantías y algoritmos deben enlazarse con los auditores tributarios. Ninguna cifra de un post, imagen, Excel o Markdown se acepta como evidencia normativa. No hay cifras fiscales aceptadas. La contrarrevisión admite catorce hallazgos de capacidad con alcance acotado; NE-01 y NE-13 siguen pendientes de evidencia.

## Evidencia y método

Se leyeron completos BRIEF, contrato, coordinación, lint, README, AGENTS, PRODUCT, ambos glosarios, ADR y alcance legacy, además de las dos notas de contexto. Se inspeccionaron diez imágenes pertinentes con `view_image`: detalle de 18.000 €, tabla de cálculo, comparativas por salario y año, cálculo inverso, coste laboral, trayectoria tras graduación y diagnóstico de pensiones. No se copian las notas, conversaciones ni imágenes a la documentación pública.

`grok` funcionó y produjo URLs candidatas. No se considera fuente de hechos. Se comprobaron diez posts mediante el script indicado, sin modificarlo: compara texto normalizado de X embed y FxTwitter, autor y fecha. Para publicaciones largas solo acredita coincidencia del comienzo, no de todo el texto. Se recuperó además la explicación mediante API de Substack, que permite comprobar directamente su contenido completo. Los originales públicos quedan en caché; el informe publica solo paráfrasis, URLs y metadatos, no la colección de posts.

- [Explicación pública recuperada mediante API](https://lapromesageneracional.substack.com/p/notas-rapidas-sobre-la-no-deflactacion): hipótesis simplificadas y cadena del ejemplo salarial. Es fuente de requisitos, no autoridad fiscal.
- [Ejemplo de 18.000 €](https://x.com/Jongonzlz/status/2046158624825720956), [comparación inversa](https://x.com/Jongonzlz/status/2048297122391285967), [contrato de salidas Excel](https://x.com/Jongonzlz/status/2047639961919234501), [comparaciones reales](https://x.com/Jongonzlz/status/2046127802378772543) y [separación competencial](https://x.com/Jongonzlz/status/2051544589387858033): recuperados por el script.
- Segunda tanda: tabla de 18.000 €, mediana ilustrativa, escala del gráfico, competencias autonómicas y selección de series. Sus URLs y resultados están en `verificacion-publica.json`.
- Los demás materiales guardados se usan solo para detectar temas; **testimonio guardado sin verificación pública**, sin atribuir certeza a sus cifras ni reproducir texto literal. Las diez imágenes vistas no se han cotejado byte a byte con los archivos públicos.

Se descargaron seis documentos con `tools/procedencia/descargar.py`, que serializa peticiones con lock y espera entre ellas. `fuentes.json` conserva originales locales, URL canónica/final, recuperación UTC, estado, SHA-256/SHA-512, tamaño, MIME y ETag/Last-Modified cuando existen. Se omiten cookies del manifiesto publicable. Los hashes prueban integridad, no autenticidad del emisor; firmas y CSV siguen sin validar.

Dos son PDF oficiales: la disposición original de LIRPF de 2006 y la nota ETCL 2T2018. Las citas candidatas contienen página 1-based, cajas en puntos con origen superior izquierdo y texto extraído con PyMuPDF. La ley original solo acredita categorías conceptuales; **no prueba la vigencia de cifras en 2012–2026**. Se recuperó también una vista HTML BOE solicitando una fecha: no se usa como prueba histórica, pues hay que comprobar qué versión efectiva devuelve antes de confiar en el parámetro URL. La AEAT de actividades es HTML oficial; no se presenta como facsímil PDF. Las tablas INE recuperadas son páginas de selección, no series ya extraídas.

## Matriz requisito → caso → datos → módulo → laguna

La matriz completa y procesable es `matriz-requisitos.json`. P0 significa condición previa a una promesa de cálculo experto; P1, reproducción analítica; P2, ampliación que necesita otro corpus y modelo.

| ID | Prioridad y requisito | Caso reproducible | Variables / fuentes | Módulo actual y laguna |
|---|---|---|---|---|
| NE-01 | P0: cálculo paso a paso | 18.000 €, 2019↔2026 | IPC, SS, gastos, reducción, cuota, obligación; INE/TGSS/AEAT/BOE | `calculo-salario-legacy`: cadena presente, versión del ejemplo ambigua |
| NE-02 | P0: deflactor explícito | diciembre contra media anual | índices, frecuencia, publicación y proyección; INE | `ipc-2012-2026`: tasas sin estado observado/proyectado |
| NE-03 | P0: bruto/coste | bruto real constante contra coste real constante | bruto, cotización empresarial y otros costes; INE/TGSS | estrategia declarada; inversión coste→bruto no localizada |
| NE-04 | P0: varios pagadores | Catalunya, 20.000 frente a 12.000+8.000 | pagadores, periodos, retenciones, cotizaciones; AEAT/TGSS | `RendimientoTrabajo` solo importe |
| NE-05 | P0: actividad económica | actividad y alquiler en Extremadura | régimen, ingresos, gastos, amortización, RETA, pagos; AEAT/BOE/TGSS | no hay rendimiento de actividad |
| NE-06 | P0: alquiler | 500 €/mes con gastos y amortización | titularidad, destino, fechas, gastos; AEAT/BOE | neto inmobiliario igualado al íntegro |
| NE-07 | P0: hogar/unidad familiar | individuales frente a conjunta | miembros, rentas, custodia, mínimos; AEAT/BOE/INE | solo situación individual |
| NE-08 | P0: contrafactual | tarifa sola frente a actualización integral | parámetros monetarios, tasas y orden de cambios | contrato de escenarios, sin evaluador general localizado |
| NE-09 | P0: retención/declaración | obligado, no obligado y devolución | cuota, pagos efectivos y obligación; AEAT/BOE | mínimo legacy no generalizable |
| NE-10 | P1: serie observada | 1T2018/4T2025 y 4T2018/4T2025 | ETCL 11221 e IPC 76125 | sin ingestión versionada ni trayectoria ejecutada localizada |
| NE-11 | P1: barridos y marginales | rango más ±0,01 en fronteras | todos los umbrales anuales | barrido presente; no prueba universal por sí solo |
| NE-12 | P1: territorio real | mismo perfil en 17 territorios | residencia, escalas, mínimos y deducciones | forales ausentes; catálogo no equivale a ejecución |
| NE-13 | P1: exportación auditable | controles y filas frontera | versiones, entradas, céntimos y evidencia | equivalencia legacy distinta de validez fiscal |
| NE-14 | P1: perfil longitudinal | edades, discapacidad y residencia variables | fechas y condiciones de devengo | perfiles cerrados no son cohortes |
| NE-15 | P2: distribución | deciles y pesos representativos | microdatos, universo y prestaciones | barrido uniforme no representa población |
| NE-16 | P2: contexto macro | cotización frente a derechos futuros | carreras, mortalidad y descuento | pensiones, financiación y carga fiscal total fuera de PRODUCT |

## Diferencias concretas y protocolo numérico

El ejemplo público exige separar comparación nominal, comparación histórica a poder adquisitivo constante y contrafactual fiscal. El motor no debería presentar cualquiera de ellas como equivalente a las otras.

La ilustración del caso de 18.000 € usa una equivalencia de 14.290,25 € y una razón cercana a 3,97; contiene además un encabezado 2018 en una explicación de 2019. El texto recuperado de Substack conserva esa ambigüedad. Su tabla también muestra importes a euros enteros junto a una cifra final a céntimos. No es un fixture canónico listo para copiar.

Una reproducción aritmética independiente, con `decimal.Decimal`, las tasas **leídas del Python** y sin redondeos intermedios, da:

- factor 2019→2026: `1.25820687889187531100`;
- bruto histórico equivalente: `14306.07343035106688561338907` €;
- cuota histórica bajo las hipótesis simplificadas: `134.2529395737927157290459585` €;
- límite histórico simplificado: `131.6115750509587608137573001` €;
- mínimo anterior reexpresado: `165.5945890709106277799999977` €;
- cuota técnica 2026: `623.8150` €;
- cociente: `3.767121881819888586071956374`.

Es una **diferencia entre dos parametrizaciones ilustrativas**, no un dictamen sobre la cuota legal correcta ni una ejecución del motor TS. Redondear el bruto histórico a céntimos, las cuotas o la deducción en fronteras distintas puede alterar el resultado. El script y salida están en scratch. La prueba futura debe fallar primero contra un resultado oficial revisado, no contra el número del gráfico.

El IPC anual de 2026 no puede ser observado a 29 de octubre. El 3% guardado debe etiquetarse como supuesto/proyección; falta acreditar documento, fecha, indicador pronosticado y horizonte. Una previsión de promedio anual o IAPC no se puede introducir silenciosamente como IPC diciembre/diciembre. Encadenar tasas publicadas redondeadas tampoco garantiza igualdad con el cociente de índices precisos.

La comparación estadística necesita además distinguir **neto de un salario medio** de **salario neto medio**. Aplicar una función fiscal no lineal a una media no recupera la media de resultados individuales. ETCL permite seleccionar coste salarial por trabajador y mes; anualizarlo por doce da un ritmo anualizado, no el ingreso anual realmente observado de cada trabajador. Una media trimestral ajustada y un IPC de fin de trimestre constituyen una elección metodológica, no una identidad estadística. Repetir usando medias del trimestre permite medir sensibilidad.

## Contratos de cálculo y bordes que deben fijarse

1. **Identidades monetarias**: neto = bruto − SS trabajador − IRPF; coste modelado = bruto + SS empresa; cuña = (coste − neto)/coste. El coste modelado no contiene necesariamente indemnizaciones, subvenciones ni todos los otros costes de la ETCL. Bruto y coste no son bases intercambiables. En cero, porcentajes deben ser no definidos o convención explícita, nunca dato económico inferido de cero técnico.
2. **Conversión real**: factor = índice destino/índice origen; salario equivalente = salario origen × factor. El neto nominal se calcula con normativa de su año y luego se reexpresa. Verificar identidad, reciprocidad y composición. El `factorIpc` privado inspeccionado solo multiplica de año anterior a posterior; su comportamiento en orden inverso debe probarse o rechazarse explícitamente, sin presumir un fallo de interfaz.
3. **Cuotas y marginales**: una reducción de base, un mínimo aplicado por tarifa y una deducción de cuota tienen efectos distintos. Marginal fiscal, marginal respecto al bruto, efectivo IRPF y cuña requieren denominador y paso distintos. Probar cada frontera a ambos lados, no limitarse a incrementos de 1.000 €.
4. **Retención y resultado anual**: pagos a cuenta cambian saldo a ingresar/devolver, no necesariamente cuota. La elección de no declarar depende de obligación y circunstancias; el mínimo legacy entre cuota y límite no es una regla general de Renta. Dos rendimientos no implican dos pagadores. Pluriempleo simultáneo, sucesión de contratos y pluriactividad son problemas distintos.
5. **Contrafactual**: mantener caso, año económico y población. Declarar parámetros actualizados: tarifa estatal/autonómica, mínimos, gastos, reducción y límites/deducciones escogidos. No inflar tipos porcentuales. Preservar cálculo progresivo y continuidad de cuotas acumuladas. El orden de reformas afecta atribuciones; secuencias cierran con total, impactos aislados no necesariamente. Acumular impactos exige moneda de referencia común.
6. **Territorios y familia**: 15 CCAA de régimen común más Ceuta/Melilla y perfil simulado; no Navarra ni territorios históricos vascos. Las especialidades de Ceuta/Melilla no quedan acreditadas por una etiqueta territorial. La pareja con hijos no equivale a tributación conjunta ni al hogar estadístico. Preservar reparto de mínimos, rentas familiares, custodia y fechas.
7. **Periodo**: 2012–2026 son quince ejercicios, no quince versiones de cada regla. Deben distinguirse cambios intranuales, devengo por fallecimiento y algoritmos de retención por fecha. Los casos 2015, 2018, 2023, 2025 y 2026 necesitan control específico sin asumir valores de otro año.

## Actividades económicas: alcance acreditable y siguiente vertical

La ausencia es estructural: `RendimientosCasoFiscal` no contiene actividades y `calcularBaseImponibleGeneral` no recibe ese resultado. La LIRPF original separa estas rentas y sus métodos. El manual AEAT 2025 recuperado distingue ingresos, gastos, retenciones y pagos fraccionados, y documenta incompatibilidades propias de estimación simplificada. No se debe resolver introduciendo facturación como salario ni usando art.20 del trabajo.

**Alcance acreditable de esta ronda**: ausencia del contrato y de la integración; separación conceptual documentada; matriz de variables y pruebas. **No acreditado**: liquidación autónoma correcta en ningún año, parámetros históricos de RETA, directa normal/simplificada u objetiva, módulos, régimen de atribución, reducciones o pagos trimestrales.

La primera vertical revisable propuesta es una actividad individual en estimación directa simplificada de 2025, con ingresos y gastos documentados, sin atribución de rentas, sin módulos, sin transmisión de activos y sin arrendamiento tratado como actividad. El ejemplo mixto añadiría alquiler por la rama inmobiliaria únicamente cuando esta esté validada. El usuario debe declarar si 500 € es ingreso por arrendar a otro o gasto por alquilar para la actividad: no son el mismo caso.

Entradas necesarias: ejercicio y régimen; actividad empresarial/profesional; ingresos y criterio temporal; gastos por categoría y justificación; cuota RETA deducible; bienes afectos y amortización; rendimiento antes de provisiones; incompatibilidades y reducciones; retenciones y pagos fraccionados separados. RETA no tiene cotización empresarial del empleador. Desde la reforma por rendimientos hay que auditar además definición de rendimientos para cotización, meses de alta, elección provisional y regularización: no reutilizar sin más la base IRPF.

Pruebas propuestas: ingresos cero con gastos; beneficio y pérdida; tope de gasto difícil justificación a ambos lados; incompatibilidad con reducción de cliente único; amortización parcial; cambio de régimen; retención que supera cuota; pagos fraccionados sin retención; alta parcial; pluriactividad; alquiler vivienda/local; rendimientos del trabajo junto a actividad. La versión ampliada exige directa normal, objetiva, reducciones, ganancias de activos afectos y cronología completa 2012–2026.

Objeción del mejor experto: una vertical 2025 deja sin cubrir muchos autónomos y toda su historia. Motivo: cada régimen necesita evidencia y contratos propios; una conversión salarial sería fiscalmente falsa. Coste aceptado: no se promete soporte general en esta ronda; se entrega un alcance verificable y pruebas previas al futuro fix.

## Prioridad, decisiones y límites

P0 se prioriza por valor experto y riesgo de conclusión equivocada: semántica del caso, deflactor y escenarios, separación de cuotas y datos suficientes. P1 necesita cobertura anual documentada y control de bordes. P2 necesita microdatos y métodos adicionales; no se debe transformar una gráfica salarial en recaudación nacional o valoración de pensiones.

Objeción experta a esta prioridad: los gráficos de distribución y pensiones también son valiosos. Motivo: PRODUCT delimita auditoría fiscal y salarial; sin población ponderada ni modelo actuarial esos gráficos aparentarían precisión inexistente. Coste aceptado: quedan requisitos explícitos de ampliación, no simulaciones parciales presentadas como completas. Las imágenes de graduación, sector público/privado y pensiones orientan demandas de series y universos, no justifican añadir cifras sin verificar.

Objeción experta a usar la disposición original de 2006: no prueba normas actuales. Motivo: se usa exclusivamente para reconocer categorías separadas; las condiciones 2025 se consultaron en AEAT, sin extrapolar años. Coste aceptado: la cadena histórica completa queda pendiente de auditores tributarios y segunda revisión. No se obtiene aceptación por una semejanza con tests o transcripciones.

Faltan: extracción exacta de series INE y sus revisiones; contraste con índices precisos; vigencia de todos los parámetros del ejemplo; comparación de imágenes públicas; cotejo de celdas Excel; firma/CSV; facsímiles y contrarrevisión. No se afirma haber completado esas comprobaciones. No hubo intentos de cargar el Excel de 150 MB ni renderizado masivo.

## Artefactos y reproducción

- `hallazgos.json`: 16 candidatos con contrato exigido; `itemIds` vacíos a enlazar por inventario, rutas y símbolos estables incluidos.
- `matriz-requisitos.json`: requisitos, casos, fuentes necesarias, módulos, lagunas y pruebas.
- `cobertura.json`: quince ejercicios, territorios examinados como contratos, exclusiones, pendientes y decisiones.
- `fuentes.json`, `citas-candidatas.json` y `verificacion-publica.json`: originales y evidencia.
- Scratch `.cache/procedencia/necesidades-expertas/`: scripts de adquisición, extracción, aritmética y metadatos públicos. No contiene copia de las notas privadas.

Comandos utilizados (desde la raíz):

```sh
nix shell nixpkgs#ripgrep -c rg -n 'patrón' lib app components
nix shell nixpkgs#python3 -c python tools/procedencia/descargar.py 'URL'
nix shell nixpkgs#nushell -c nu /home/elies/Repos/Reactivity/scripts/fetch-x-posts.nu 'URL_POST'
grok -p 'búsqueda de URLs públicas' --output-format plain
nix shell nixpkgs#python3 -c python .cache/procedencia/necesidades-expertas/independiente.py
nix shell nixpkgs#python3 nixpkgs#gcc -c bash -c 'export LD_LIBRARY_PATH="$(dirname "$(g++ -print-file-name=libstdc++.so.6)")"; uv run --no-project --python "$(command -v python3)" --with pymupdf python .cache/procedencia/necesidades-expertas/extraer.py'
```

El primer intento de `uv` falló por Python descargado no ejecutable en NixOS; se corrigió seleccionando Python Nix. El siguiente requirió `libstdc++`; se resolvió con GCC del entorno Nix. No hubo instalación global. No se escribió TypeScript ni Effect y no corresponde ejecutar anti-slop para estos documentos/JSON.

Comprobación final: 11 candidatos `missing` y 5 `ambiguous`; 8 citas candidatas (7 PDF y 1 HTML). Se verificaron los hashes dobles y tamaños de los seis originales, el contrato de los 16 hallazgos y la sintaxis JSON. Las siete cajas PDF reproducen sus citas al normalizar espacios con PyMuPDF 2.0. `verificacion-local.json` registra los resultados; esta comprobación mecánica no es la revisión independiente pendiente.

## Resolución de la contrarrevisión

Véase `../../revisiones/necesidades-expertas/`. Se incorporaron sus precisiones al JSON de hallazgos y a la matriz. Las aceptaciones se refieren a capacidades del software, no a parámetros ni reglas fiscales. NE-01 es un fixture público ambiguo y NE-13 requiere concretar y demostrar un defecto de trazabilidad; no justifican una corrección fiscal. El motor ya añade puntos normativos, la interfaz calcula marginales e inversos de IPC, y el evaluador de deducciones de la UI sí ejecuta importes que se transmiten agregados. La falta de trayectoria automática no impide representar manualmente distintos casos anuales.

De los diez posts, tres se contrastaron completos y siete solo por prefijo normalizado. Cuatro citas (CIT-04/06/07/08) necesitan ampliar contexto antes de servir como fundamento de una regla; permanecen candidatas sin aceptación fiscal. No se amplían aquí porque esta entrega acredita necesidades y categorías, no condiciones tributarias completas.
