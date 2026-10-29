# IPC y redondeos: primera revisión documental

Fecha de corte: 29 de octubre de 2026. Todos los hallazgos son candidatos; ninguno está aceptado. No se ha modificado código del motor, ni ejecutado builds o la suite legacy exhaustiva. Los identificadores locales se enlazarán al inventario global por archivo y símbolo; `itemIds` permanece vacío mientras ese enlace no esté contrastado.

## Resultado sustantivo

Los 13 valores almacenados para 2013–2025 coinciden con las tasas oficiales del índice general nacional, diciembre respecto a diciembre del año anterior. Se han descargado el JSON de la serie de índices `IPC251852`, el CSV mensual de la tabla 50902 y el CSV de medias anuales 50934. El CSV mensual permite comprobar literalmente cada tasa, sin deducirla de índices publicados redondeados. Las fuentes Markdown del repositorio solo se usaron como índice.

2012 es el origen temporal, no una observación de inflación cero. INE publica 2,9 % para diciembre de 2012, pero ese dato mide diciembre de 2011 a diciembre de 2012 y no debe incluirse al proyectar desde diciembre de 2012. La fórmula `producto(1+tasa[y]), y=base+1…destino` es correcta en esa dirección y con esa convención. Igual año produce uno. La ausencia de una tasa requerida se convierte silenciosamente en cero en ambas implementaciones, lo que necesita un contrato distinto de la identidad de origen.

2025 tiene dato observado de diciembre: 2,9 %, distinto del 2,7 % de variación de la media anual. El 3 % de diciembre de 2026 es un supuesto del Python heredado y no puede ser una observación a la fecha de corte. La tabla TypeScript no separa ambos orígenes. Debe quedar como escenario versionado, con autor/origen, fecha, horizonte y método. No se propone rellenarlo con el último dato mensual disponible.

El producto de tasas publicadas 2013–2025 da `1.270974585050486216872514683`; el cociente de índices publicados `119.942/94.394` da `1.270652795728542068351802021`. La diferencia equivale a 9,6536796583 € sobre 30.000 € de origen. Son dos aproximaciones distintas: el INE calcula tasas con todos sus decimales internos, publica los índices con tres y las tasas con uno (metodología base 2025, página PDF 47). No llamar «exacto INE» al producto ni presentar el cociente de índices publicados como recuperación de los índices internos.

La metodología base 2025, páginas PDF 44–45, explica el enlace de series y la referencia media 2025=100. La base estadística no es el año inicial de una comparación salarial. No se deben dividir niveles expresados en bases diferentes. La serie base 2021 descargada permite comparar 2012–2025 en una misma base; se ha cerrado además el contraste de los catorce diciembres con la serie enlazada base 2025 (`contraste-bases.json`). El cambio de clasificación exige comprobar la correspondencia, no empalmar indiscriminadamente todas las categorías. Aquí solo se audita el general nacional.

## Contraste con el original Excel y Python

Se han leído por streaming las primeras 101 filas de datos de cada hoja `DAT_2012`…`DAT_2026`, salarios de 0 a 100 €. La comparación ejecuta el constructor TypeScript existente, sin generar libros completos. Son 33.027 celdas y 184 diferencias por encima de `1e-7` euros, tolerancia técnica utilizada únicamente para separar residuos de representación de diferencias de céntimo. No se usa como tolerancia fiscal.

Casos reproducibles:

- `DAT_2012!D32`, salario 30 €: Excel 1,90; TypeScript 1,91. El producto decimal de 30 por 0,0635 es 1,905.
- `DAT_2012!E12` y `W12`, salario 10 €: Excel almacena `9.359999999999999`; TypeScript produce 9,37. La diferencia relevante es 9,36 frente a 9,37, no el residuo XML.
- `DAT_2012!Q2` es un control que coincide: 5.151 × 0,2475 = 1.274,8725 → 1.274,87. Se descartó expresamente una sospecha inicial sobre esa celda.

`contraste-excel.json` contiene hash del libro, celdas, encabezados y conteos por año. Los 74 desacuerdos de 2026 no deben atribuirse todos a redondeo: los parámetros también difieren. El Python usa `np.arange` y operaciones sobre escalares NumPy en hojas anuales; por ello no basta sustituirlo por `round(float)` de Python puro y afirmar equivalencia. Python, NumPy, Decimal y Excel son capas distintas. El libro contiene valores escritos, no una aplicación general de la función Excel REDONDEAR.

El contrato «compatible» promete equivalencia tabular, mientras `dineroCompatible` aplica half-up decimal. Se necesita decidir si esa exportación conserva el comportamiento del oracle o cambia de nombre/versión. La corrección normativa del dinero canónico no se deduce de quién coincide con el libro.

## Inventario de políticas y etapas

`inventario-redondeos.json` enumera las ocurrencias concretas de los archivos de ámbito. Las siguientes familias explican su semántica; los aliases de liquidación y los importes derivados deben leerse junto con sus consumidores.

| Familia / símbolo | Política y precisión | Etapa / clasificación |
|---|---|---|
| `redondearHalfUp` | Decimal `ROUND_HALF_UP`, precisión solicitada; empate negativo aleja de cero | Primitiva técnica |
| `truncarDecimal` | Decimal `ROUND_DOWN`, hacia cero, no `floor` | Primitiva técnica |
| `redondearImporteLiquidado`, `eurosACentimos` | Half-up a 2 decimales; multiplicación por 100 y conversión a Number | Frontera monetaria de producto |
| `centimosAEuros` | División por 100; no redondeo explícito | Conversión, exige entero seguro como entrada |
| `porcentajeCompatibleLegacy` | Multiplicar por 100 y half-up a `decimales` | 2 decimales SS/tramos; 3 MEI; 1 rótulos |
| `dineroCompatible` / `liquidar` | Half-up por cada importe de salida | No impone que sumas de celdas redondeadas coincidan con el total |
| `factorIpc.toFixed(12)` | 12 decimales, configuración Decimal observada half-up | Serialización; la exportación vuelve a Number y a 4 decimales |
| `formatearNumeroPorcentajeLegacy` | Number `toFixed(2)`, posterior presentación de enteros con `.0` | Texto porcentual IPC, representación binaria |
| `export/auditoria-excel.ts#porcentaje` | Number ×100 y `toFixed(2)` | Exportación educativa |
| `diferenciaMensualCentimos` y equivalente canónico | `Math.round(anualCentimos/12)` | Métrica de bolsillo, empate hacia +∞ |
| `centimosAEurosUrl` | `Math.round(centimos/100)` | Contrato URL, pierde fracción de euro |
| `Math.floor` en rangos | Número de elementos inclusivo, sin añadir extremo no alcanzado | Constante técnica, no regla fiscal |
| `Math.ceil` para lotes | Número de lotes | Rendimiento, no dinero |
| `Math.floor` en fecha ZIP / columnas Excel | Segundos DOS/2 y base 26 | Serialización, no dinero |
| Python `round` / f-string | Floats o escalares NumPy, 2 decimales dinero; 4 factor; 1 rótulos; 2/3 porcentajes | Salida legacy; no mandato AEAT |
| AEAT `redondear1`, `truncar` | Half-up 2 / truncamiento 2 | Solo operaciones explícitas del algoritmo, no regla universal |

Decimal.js observado tiene precisión de **20 cifras significativas** y rounding=4. No se encontró configuración explícita del motor. Evita el error de representación inicial de un literal decimal textual, pero no es aritmética de precisión infinita: divide y opera a precisión finita. Las conversiones `toNumber` recuperan IEEE754. Este hecho no acredita por sí mismo un error monetario dentro del rango soportado.

El glosario dice que los porcentajes/rótulos legacy usan half-even; el código usa half-up. Debe resolverse esa contradicción documental con pruebas sobre celdas y valores reales, no con una afirmación genérica sobre Python.

## Bordes y composición

1. Empates de signo: `Math.round(-18/12)=-1`, `Math.round(18/12)=2` céntimos. Half-up daría -2/+2. La métrica mensual no satisface antisimetría en esos empates.
2. Doble redondeo: delta anual exacto 0,059 € → 0,06 € → 0,005 €/mes → 0,01 €. Dividir primero da 0,004916… → 0,00 €. Python divide el delta sin liquidar; la ruta TS mensual divide el anual ya liquidado.
3. Reexpresión: 1,005 € ×1,5 → 1,5075 →1,51; liquidar antes da 1,01×1,5→1,52. La ruta canónica redondea salario nominal y salidas antes de reexpresar; la tabular legacy conserva más decimales.
4. Agregación: redondear cada componente no conmuta con redondear su suma. No forzar identidad contable de celdas si se ha elegido redondeo final independiente; declarar residuo o política de reparto si la identidad es requisito.
5. Cotización anual frente a mensual: 12×round(1,005)=12,12 y round(12×1,005)=12,06. Es un ejemplo matemático, **no** una prueba de cuota legal concreta.
6. Umbrales: probar salario/base ±0,01 respecto a cada límite, tipo positivo y negativo, cero y empate ±epsilon decimal textual. Evitar corregir floats sumando un epsilon universal.
7. IPC: año igual, consecutivo, deflación 2014/2020, tasa cero 2015, año desconocido, y pares invertidos. La función legacy específica de comparación pasada sí invierte el factor; no atribuir su comportamiento a todas las APIs.
8. Rango: paso≤0, mínimo>máximo, paso no divisor, endpoint y lote vacío. Los `floor/ceil` son técnicos, no liquidaciones fiscales.

## Reglas oficiales de redondeo

El original AEAT 2026 descargado contiene tres pasajes relevantes: máximo número de decimales salvo REDONDEAR/TRUNCAR (PDF 10), REDONDEAR1 con ejemplo 0,005→0,01 (PDF 23), y TRUNCAR del porcentaje 17,85964523→17,85 (PDF 33). Se ha descargado también la versión desde 10 de septiembre. El fichero servido en la URL `ALGORITMO_2026.pdf` está fechado 09-09-2026 y rotulado 1 enero–9 septiembre; su hash difiere del hash de la transcripción local de diciembre de 2025. Esto demuestra por qué URL y texto Markdown no bastan como identificación de versión.

Los originales históricos disponibles en la caché compartida se registran por hash y se releen directamente, sin utilizar conclusiones de otros auditores. Las citas recuperadas cubren originales de 2017–2026, con varias versiones intraanuales, y reproducen las mismas primitivas; las páginas varían. `cobertura.json` enumera cada versión. No se obtuvieron originales oficiales de 2012–2016 mediante las búsquedas realizadas; no se sustituyen por copias secundarias. La presencia de la misma primitiva no acredita la corrección de todas las llamadas a esa primitiva. Falta completar vigencia histórica, todas las versiones intraanuales y correspondencia operación por operación.

No se ha acreditado una norma universal que obligue a half-up en toda Seguridad Social y toda liquidación anual IRPF. La búsqueda recuperó el original BOE-A-2001-9850, artículo 2 (PDF 1), sobre redondeo de importes abonados en euros y conversión, pero no el pasaje histórico suficiente sobre cada concepto/tramo del SLD. Se mantiene `missing`; no se extrapolan REDONDEAR1 ni reglas de otros impuestos. Debe integrar el especialista SS la regla mensual y por concepto antes de corregir el agregado anual.

## Decisiones y coste aceptado

- **Producto de tasas frente a cociente de índices.** Objeción del experto: ambos parten de datos publicados con redondeo y responden a un contrato preciso. Motivo: conservar separados el oracle y la medida estadística. Coste: documentar dos métodos y no corregir silenciosamente el histórico.
- **Diciembre frente a media anual.** Objeción: salario anual no equivale a salario de diciembre. Motivo: el motor declara cierre; no se inventa una exigencia legal de deflactor. Coste: la comparación no debe anunciarse como poder adquisitivo medio anual sin esa limitación.
- **2026 escenario.** Objeción: cambiarlo por inflación reciente sigue sin observar diciembre. Motivo: mantener horizonte y origen distintos. Coste: resultados condicionados a hipótesis, no una cifra histórica validada.
- **Compatibilidad y redondeo canónico.** Objeción: half-up no reproduce el oracle. Motivo: conservar evidencia de ambos antes de elegir. Coste: no aceptar la promesa de equivalencia actual ni arreglar resultados en esta ronda.
- **Muestra Excel acotada.** Objeción: 0–100 € no cubre brackets fiscales ni solidaridad. Motivo: instrucciones excluyen suite legacy exhaustiva y el libro es grande. Coste: demuestra contraejemplos, no tasa global de fallo ni cobertura normativa; los tramos reales quedan pendientes.
- **Fuentes y autenticidad.** Objeción: hash no prueba emisor ni vigencia. Motivo: originales HTTPS con cabeceras y hashes, citas exactas y revisión nueva. Coste: firma/CSV/TSA no validados; no llamar autenticado a un blob solo por SHA.
- **Reglas históricas incompletas.** Objeción: 2026 no demuestra 2012. Motivo: etiquetar lagunas por ejercicio/operación. Coste: el ámbito no se considera cerrado ni exhaustivamente validado mientras existan esas lagunas.

## Entregables y reproducción

`hallazgos.json` separa IPC y redondeos; `citas-candidatas.json` conserva hash, página 1-based, cajas en puntos desde esquina superior izquierda y texto extraído con PyMuPDF. CSV/HTML se identifican como tales, sin páginas ni cajas inventadas. `fuentes.json` conserva URL canónica/final, fecha de captura, estado, hashes SHA-256/SHA-512, MIME, tamaño y cabeceras; cookies no se copian al informe. Las cabeceras originales completas quedan en la caché de adquisición. Una cabecera Last-Modified no se interpreta como fecha de vigencia.

Los comandos y scripts de reproducción propios están en `.cache/procedencia/ipc-redondeos/`: `adquirir.py` llama secuencialmente a `tools/procedencia/descargar.py`; `comparar.py` compara índices; `contraste-excel.py` lee ZIP/XML; `extraer.py` extrae PDF; `informe.py` compone JSON. Python estándar se ejecuta con `nix shell nixpkgs#python3 -c python ...`. PyMuPDF se ejecutó mediante `uv run --python` apuntando al Python Nix, `--with pymupdf`, y `LD_LIBRARY_PATH` del `gcc.cc.lib` de Nix; el Python descargado automáticamente por uv fallaba en NixOS y se evitó. No hubo instalación global.

Para las tablas TS se ejecutó `nix shell nixpkgs#bun -c bun -e` importando únicamente `construirTablaDetalleAnualCompatible` y limitando salarios a 0–100 por año; no se escribió código Effect nuevo. `cobertura.json` enumera ejercicios, archivos, alcance y pendientes. No se presentan las pruebas propuestas como pruebas ya implementadas ni los originales pendientes como evidencia obtenida.

## Contraste de etapas AEAT 2026

Lectura directa del PDF, no solo de la definición de las primitivas:

| Variable del algoritmo inicial | Página PDF | Correspondencia del motor |
|---|---:|---|
| RED20 | 23 | `reduccionRendimientosTrabajo`: half-up tras la fórmula de reducción |
| MINDESG y MINDES3 | 24–25 | Dos redondeos separados antes de sumar mínimo de descendientes |
| 65AS y 75AS | 25–26 | Dos redondeos separados antes de sumar mínimo de ascendientes |
| DISDES y DISAS | 27 | Redondeo separado de discapacidad de descendientes/ascendientes |
| ASISDES y ASISAS | 28 | Redondeo separado de asistencia |
| MINOPAGO | 32 | `calcularMinoracionVivienda`: truncamiento a dos decimales |
| TIPO | 33 | `calcularTipoInicial`: truncamiento del porcentaje a dos decimales |
| IMPORTE | 33 | `redondear1(retribucion.mul(tipoRetencion).div(CIEN))` |

La ubicación de estos redondeos del cálculo inicial concuerda con las llamadas leídas. No se han validado aquí los parámetros ni condiciones fiscales que alimentan cada operación. El PDF incluye además redondeos/truncamientos en regularizaciones (páginas 35–37); no se certifica su cobertura ejecutable. Esta distinción evita convertir una comprobación de primitivas en una validación del procedimiento completo.

Se ejecutó además un contraste independiente de los 15 factores exportados con destino 2026, mediante un único salario de 15.000 € por año: todos coinciden a cuatro decimales con el producto de las tasas del motor. `contraste-factores.json` registra cada caso. Es una comprobación aritmética de implementación, no una aceptación del supuesto de 2026 ni del método estadístico.

## Cierre de esta entrega

30 hallazgos candidatos: 17 match, 3 mismatch, 2 missing y 8 ambiguous; cero aceptados. 42 originales conservados por hash, 667 selectores candidatos (625 cajas PDF verificadas localmente, 14 filas CSV y 28 selectores JSON) y 33 recortes a 120 DPI. La verificación local reextrae el texto de las cajas: no sustituye la revisión independiente ni autentica el emisor. Los 14 boletines oficiales de diciembre de 2012–2025 están disponibles; los errores HTTP 502 de 2024/2025 se resolvieron con reintento serial. La URL inicialmente supuesta ipc_dic12.pdf devolvió404 y se sustituyó por el original daco421/ipc1212.pdf.

La serie nueva IPC290751 permite comparar los mismos diciembres en base 2025. Diciembre de 2012 = 79,714 y diciembre de 2025 = 101,289: cociente 1,270655091953734601199287453. Frente al cociente base 2021, la diferencia es aproximadamente 0,0000022962 (unos 0,069 € sobre 30.000 €); esto es compatible con redondear los niveles publicados. No es prueba de revisión de una tasa histórica. La serie descargada termina en septiembre de 2026. Queda pendiente comprobar separadamente enlaces intermedios 2011/2016, vigencia histórica del redondeo y los bordes fiscales reales enumerados.

No se declara cerrado el encargo exhaustivo: esta entrega documenta los resultados sustantivos y deja las lagunas concretas para continuación y contrarrevisión. Los JSON son válidos, los originales coinciden con sus hashes y las cajas se reextraen sin discrepancia. No hubo commits, init, cambios de bookmarks, PR ni modificaciones ajenas al ámbito autorizado.

Las cabeceras de sesión y autorización se han eliminado recursivamente de los JSON publicables; los originales y sus hashes no se alteraron.
