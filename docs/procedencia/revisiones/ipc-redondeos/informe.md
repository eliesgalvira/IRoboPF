# Contrarrevisión independiente: IPC y redondeos

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Corte: 29 de octubre de 2026. `snapshot-codigo.json` identifica los archivos examinados, posteriores a lint. Las correcciones de Madrid y del rótulo autonómico no alteran los contraejemplos de este ámbito.

**30/30 IDs examinados: 27 accepted con alcance limitado, 3 needs-evidence, ninguno omitted.** Accepted significa que se acepta la proposición delimitada en `acceptanceScope`, incluida la existencia de un defecto o una ambigüedad; no significa que se apruebe la regla del motor. No se certifica ninguna liquidación fiscal. `revisiones.json` conserva estado candidato, decisión nueva, objeciones, alcance y evidencias por ID. La cobertura por identificador está en `cobertura-ids.json`.

## Cambios que debe resolver el orquestador

1. **P1, RED-LEGACY-EXCEL:** la promesa de equivalencia tabular de GLOSSARY.md:184 y :212 tiene contraejemplos. `progresividad-frio.ts:1100` construye la fila y `:1248` expone la tabla. D32 del original es 1,90; salida actual 1,91. E12/W12 son 9,36 frente a 9,37. Si se conserva esa promesa, preparar primero pruebas fallidas sobre estas celdas; si se abandona, versionar el contrato. No trasladar el algoritmo binario legacy a dinero canónico.
2. **P1, IPC-2026-ESCENARIO:** `ipc-2012-2026.ts:21` contiene 0.030 junto a observaciones. Separar origen observado/escenario y exigir horizonte, fecha de corte y autor/método. El 3 % no se acepta como observación. No reemplazarlo por la tasa de septiembre ni por un avance.
3. **P2, RED-MENSUAL-SIGNO y RED-ETAPAS-IPC:** `progresividad-frio.ts:624` y `auditoria-progresividad-frio.ts:260` usan Math.round sobre céntimos anuales. Ejecutado: +18→+2 y −18→−1 céntimos mensuales. Decidir si se exige antisimetría y si se divide el importe preciso o el anual liquidado. En la ruta canónica, `:210` liquida salario nominal y `:137` escala céntimos; no equivale a reexpresar el desglose preciso legacy.
4. **P2, IPC-AUSENCIA-CERO e IPC-INVERSO:** `progresividad-frio.ts:279–299` y `auditoria-progresividad-frio.ts:125–135`: undefined pasa a cero y un intervalo invertido produce producto vacío, uno. Rechazar observaciones ausentes. Para años invertidos, elegir error explícito o recíproco. La ruta legacy pasada `:680–682` ya obtiene recíproco; no hay fundamento para cambiarla indiscriminadamente. Se ha probado la semántica por lectura, no una entrada pública que atraviese todas las validaciones.
5. **P2, RED-PORCENTAJES:** el glosario fiscal :65–67 atribuye half-even a porcentajes, mientras `porcentaje.ts:8` llama half-up. Corregir contrato/documentación después de elegir; las dos hojas CONTROL completas coinciden con el Excel, por lo que no se demuestra un error en todos sus porcentajes.
6. **P2 adicional, evidencia literal:** 625 cajas reextraídas con PyMuPDF actual: ninguna es idéntica byte a byte; 537 coinciden normalizando espacios y 88 no. Esto no prueba corrupción: puede intervenir versión, selección de glifos y cajas ajustadas. Por ejemplo, la caja BOE art.2 excluye una línea que el candidato sí cita; metodología p.45 corta una fórmula. No aceptar el resultado del verificador del autor como garantía portable. Se entregan citas reextraídas y 30 bloques ampliados; la fórmula debe conservar facsímil, no una transcripción de glifos defectuosos.

## IPC: comprobaciones por ejercicio y alcance

Se verificaron SHA-256 de los 42 originales de la entrega antes de leerlos. El CSV 50902 se parseó independientemente. Las tasas nacionales diciembre/diciembre de 2013–2025 son, en orden: 0,3; −1,0; 0,0; 1,6; 1,1; 1,2; 0,8; −0,5; 6,5; 5,7; 3,1; 2,8; 2,9 %. Cada valor se cotejó con la primera página de su boletín contemporáneo y con la tabla actual. `boletines-diciembre.json` conserva contexto y fecha visible, no una fecha deducida de URL. No se convierten estas observaciones estadísticas en reglas jurídicas de deflactación.

2012 tiene tasa publicada 2,9 %, pero mide diciembre 2011→2012. Al elegir diciembre 2012 como origen, el producto comienza en 2013. La ausencia de la entrada 2012 es coherente con esa convención; no significa inflación cero. El resultado para igual año es la identidad.

El boletín diciembre 2025 se publicó el **15/01/2026**. El CSV de medias anuales 50934 da 2,7 % en 2025; el de diciembre da 2,9 %. Ambos son datos distintos. Una comparación de remuneración anual debe declarar qué poder adquisitivo representa; ninguna coincidencia prueba que cierre sea el deflactor de producto adecuado.

Recalculado con Decimal Python, producto 2013–2025 = `1.270974585050486216872514683`. Cociente base2021 = `119.942/94.394 = 1.270652795728542068351802021`; base2025 = `101.289/79.714 = 1.270655091953734601199287453`. El primer método difiere unos 9,65 € sobre 30.000 €. La diferencia entre cocientes de las dos bases es compatible con índices publicados redondeados, no demuestra por sí sola la causa exclusiva de la discrepancia.

La metodología INE base2025 pp.44–45 indica reclasificación, continuidad del general y reescala por media2025. P.47 distingue índices IPC publicados con tres decimales y tasas con uno, calculadas sobre precisión interna. Se inspeccionaron imágenes de pp.45 y del algoritmo AEAT pp.23/33; no se observó tachado en esos pasajes. La comparación se limita al general nacional: no acepta correspondencia universal entre categorías. Las dos series contienen los catorce diciembres. No se reconstruyeron todos los coeficientes intermedios de bases 2011/2016.

Se descargó además la nota INE enero2026: fecha visible 13/02/2026 y primera publicación definitiva base2025. La nota septiembre2026, publicada 14/10/2026, no observa diciembre ni permite cerrar 2026. Estas adquisiciones constan en `adquisiciones-nuevas.json`. Los metadatos de descarga no sustituyen las fechas de publicación visibles.

## Excel, Python, NumPy y Decimal

Se leyó ZIP/XML por streaming, resolviendo workbook.xml y sus relaciones, sin cargar el libro completo. Hash Excel: `106c8cd765c60d587938939fff5b0dec8ff1ea76b690eee142fc59e16739c1a7`. Las celdas D32/E12/W12 contienen valores escritos y no fórmulas. La diferencia no es una invocación de REDONDEAR de Excel.

`Calculo_Salario_IRPF.py:191` genera salarios np.arange; :202–203 multiplica base por tipos y :234–251 redondea salidas. Operaciones aisladas ejecutadas con NumPy 2.5.4:

- 30×0,0635: Python puro round→1,91; NumPy→1,90; Decimal half-up→1,91. Excel D32=1.9.
- 10−10×0,0635: Python puro round→9,37; NumPy→9,36. Excel E12/W12 almacena 9.359999999999999. TS→9,37.
- Control Q2: original y constructor actual dan 1.274,87. No hay hallazgo en esa celda.
- CONTROL_GENERAL: 195 celdas; CONTROL_TRAMOS_IRPF: 348 celdas; cero diferencias con tolerancia numérica técnica 1e−9 y comparación exacta de cadenas. Esa tolerancia separa representación, no autoriza tolerancia tributaria.

Se ejecutaron 31 filas actuales de DAT_2012. **No se volvió a ejecutar** el recuento del autor de 184 diferencias/33.027 celdas ni sus 15 factores exportados: se conserva como resultado ajeno, no prueba propia. Los tres contraejemplos bastan para refutar equivalencia universal. No identifican versión original de NumPy ni certifican quién calculó legalmente bien.

Decimal.js devuelve precision=20 y rounding=4. Empates ±0,005 y ±1,005 ejecutados muestran alejamiento de cero en half-up y truncamiento hacia cero. No se encontró un error de céntimo derivado de esas 20 cifras dentro del rango válido. «Decimal exacto» necesita esa limitación, no un aumento arbitrario de precisión.

URL: `auditoria-normativa-historica.ts:685` redondea a euros enteros, y :744 normaliza pasando por codificación/decodificación. Ejecutado [1500001,1500099] céntimos→[1500000,1500100]. Es una normalización observable del contrato URL, no una regla de dinero ni necesariamente un defecto si la entrada está limitada explícitamente a euros enteros. Decidir si preservar céntimos o rechazar/normalizar de forma declarada.

## AEAT y Seguridad Social: lo aceptado y lo pendiente

El PDF AEAT `a15b7fee…` está fechado **09-09-2026** y rotulado 1 enero–9 septiembre. Eso acredita la versión examinada; no se infiere que se publicara en enero. P.10 exige conservar decimales salvo operaciones expresas; p.23 define REDONDEAR1 positivo; p.33 TRUNCAR y el importe anual. No prueba half-up universal para negativos ni para todo impuesto/cotización.

Las fronteras iniciales RED20, MINDESG/MINDES3, 65AS/75AS, DISDES/DISAS, ASISDES/ASISAS, MINOPAGO, TIPO e IMPORTE se cotejaron con llamadas actuales indicadas en revisiones.json. Se acepta esa correspondencia técnica. No las condiciones y cuantías que alimentan las fórmulas, ni regularizaciones, ni todas las versiones intraanuales. Los originales históricos disponibles se reextrajeron; no se cierra 2012–2016. Se intentó recuperar ALGORITMO2016 desde el enlace primario antiguo y su posible ubicación actual: 404. Una nota secundaria sirvió solo para descubrir el enlace, nunca para aceptar fiscalidad.

Se amplió la investigación del euro: original Ley46/1998, BOE 18/12/1998, y reforma Ley9/2001, BOE 05/06/2001, recuperados mediante el helper. Esta última reproduce art.11 y añade apartados 3/4 sobre conversión de tramos y tarifas unitarias; no altera la cuestión por una genérica regla decimal de toda nómina. La Orden23/05/2001 art.2 regula pagos y remite a art.11. La cadena de estas disposiciones ayuda a delimitar el antecedente, **pero no cierra** etapas por concepto/tramo/mes del SLD ni vigencia exhaustiva 2012–2026. El manual técnico SLD descargado no aportó una regla explícita de redondeo que resolviera esa laguna. Los tres IDs RED-SS-LIQUIDACION, RED-SS-EURO-2001 y RED-AEAT-HISTORIA quedan needs-evidence.

## Contratos y pruebas discriminantes

`casos-orquestador.json` distingue executed, derived y source-inspection. Son casos para convertir en pruebas mantenidas, no una suite fiscal aprobada. Las dos primeras diferencias legacy requieren prueba fallida si se mantiene la promesa vigente. Las demás expectativas alternativas dependen de decisiones explícitas:

- IPC: observación/escenario, diciembre/media, serie y base, fecha real, dirección y ausencia de datos. Metamórficas: mismo año=1, composición con tolerancia declarada y recíproco o rechazo. No exigir igualdad exacta entre producto de tasas y cociente de índices publicados.
- Monetario: modo por operación, signo, escala y etapa. Distinguir −0,005, empate±epsilon textual, límite±0,01, sumar antes/después de liquidar, y delta0,059 dividido antes/después. No usar epsilon binario universal.
- Reexpresión: 1,005×1,5 liquida a1,51; liquidar previamente da1,52. Es discriminante algebraico propuesto, no caso fiscal ejecutado.
- Retención: pruebas por operación y versión, no solo verificar primitive round/truncate. Mantener pruebas de límites y condiciones fuera de una certificación basada en conteo de llamadas.
- URL: round-trip exacto si se admiten céntimos, o validación explícita de euros enteros. Rango vacío, paso≤0 y paso no divisor son contratos técnicos distintos de redondeo fiscal.

## Reproducibilidad y límites

Scripts propios en `.cache/procedencia/revision-ipc-redondeos/`: verificar.py, refinar.py, probar.ts, controles.py, adquirir.py, ampliar.py y contextos.py. Ejecutados secuencialmente con Nix y uv, sin build, suite pesada, instalación global, cambio de node_modules ni nueva implementación Effect. Los primeros ensayos se corrigieron en scratch: falta de libstdc++, firma incorrecta del constructor y selección CSV sensible a mayúscula; sus salidas incompletas no se cuentan como prueba. La salida final usa argumentos correctos y materializa solo 31 filas.

El helper de descarga usa lock, UA y pausa de dos segundos; las nuevas adquisiciones están en scratch propio. Los originales existentes se reutilizaron tras comprobar hashes; no se descargaron redundantes. No se publican cookies ni cabeceras de sesión. No se validaron firmas PAdES/CSV/TSA. Las reextracciones prueban integridad y contenido, no autenticidad completa ni vigencia. No se examinaron visualmente las 625 cajas; las inspecciones visuales indicadas son acotadas y el resto es extracción de texto. No se acepta una fórmula mal extraída por su conteo de cajas.

Las objeciones generales del autor se conservan por ID. Quedan descartadas como explicaciones suficientes: equiparar Python puro con NumPy, atribuir valores escritos a REDONDEAR de Excel, tratar año base como inflación cero, concluir que todo inverso está roto, usar controles coincidentes para aprobar dinero, o invocar AEAT para toda SS. Persisten las objeciones de vigencia histórica y política de producto. El resultado permite correcciones y decisiones concretas; no cierra una auditoría fiscal exhaustiva.

Ampliación final de citas de la cadena: Ley46/1998 pp.5–6 y Ley9/2001 pp.3–4 físicas, con contexto continuo del artículo11. Se inspeccionaron visualmente p.5 y p.3 respectivamente; no se observó tachado. Las páginas siguientes se conservan y extraen para no cortar el precepto en el salto de página. `resultados-contraejemplos.json` registra las tres comparaciones que fallan y Q2 que pasa, ejecutadas sobre los valores del original y del constructor actual.
