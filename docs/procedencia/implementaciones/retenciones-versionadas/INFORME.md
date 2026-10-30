# Retenciones iniciales versionadas: entrega para contrarrevisión

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `0ca324b08267`.

## Comportamiento y contrato

El servicio Effect real selecciona una sola versión del cálculo inicial. `fechaPago` es una fecha civil ISO YYYY-MM-DD del ejercicio; fechas imposibles, ajenas al año, sin original en el catálogo o junto con `perfilTemporal` producen ResultadoNoSoportado. No se normaliza 30 de febrero a marzo. Sin fecha solo se admite un año con una única versión que cubra todo el año, o `perfilTemporal: "cierre"` explícito que seleccione una versión con final 31 de diciembre. No se usa un fallback de cierre ante una fecha errónea.

2017, 2019, 2020 y 2022 tienen versión única. 2018, 2021, 2023, 2024 y 2025 exigen selección. Los cortes son 5 julio 2018, 21 octubre 2021, 1 febrero 2023, 8 febrero y 28 junio 2024, 27 noviembre 2025. La diferencia de octubre 2021 pertenece principalmente a regularización; se conserva la identidad documental aunque el cálculo inicial coincida.

2012–2016 se rechazan: tablas parciales no acreditan algoritmos anuales completos. 2026 solo admite 10 septiembre–29 octubre, fecha de corte de la evidencia. Se rechazan enero–9 septiembre por la ausencia del original anterior conocido y fechas futuras por no acreditar continuidad. No se inventa cierre 2026. El PDF republicado de enero se conserva en el manifiesto, pero no habilita su ejecución.

`procedimiento: "regularizacion"` se rechaza también en legacy. El contrato no acepta acumulados ni opción de aplazamiento del pagador: esas opciones pertenecen a regularización y no están implementadas. Las opciones de agosto 2018, marzo/julio 2024 no se convierten en una elección arbitraria del algoritmo inicial. No se confunden publicación, entrada normativa y pago. Falta sentencia primaria STS1219; no se utiliza una editorial para suplirla.

El modo `compatible-legacy` conserva expresamente el algoritmo de la base con el guard numérico integrado. Es una referencia de comportamiento del servicio, no una afirmación de igualdad integral con Excel/Python ni una regla legal. Su rastro lo declara. Los campos temporales pertenecen al canónico; legacy los rechaza, sin ignorarlos. `rojo-legacy-fecha.log` conserva el fallo real anterior a este rechazo.

## Cambios numéricos

- Reducciones: 2017/enero2018 (3700, 11250, 1,15625); julio2018 media de fórmulas antigua y nueva, redondeada solo al final; 2019–enero2023 (5565, 13115, 1,5); febrero2023–7febrero2024 (6498, 14047,50, 1,14); desde8febrero2024 fórmula de dos pendientes ya existente.
- Escala hasta2020 termina en45%, incluidos importes superiores a300000. Desde2021 conserva47% en el último tramo.
- El límite43% cesa al superar22000 hastaenero2023; desdefebrero2023 conserva35200. El salto revisado de22000 a22000,01 no se suaviza.
- Julio2018 usa tabla propia de pensionistas/desempleados antes de sumar600/1200. Ceuta/Melilla inicial usa factor0,5 en2017/enero2018 y0,4 desdejulio2018; mínimos contractuales8%/1% hasta2018 y6%/0,8% desde2019.
- Se filtran descendientes sin discapacidad de25 o más antes de contar, ordenar, calcular mínimos y umbrales. Situación1 sin descendientes elegibles se rechaza. IRREGULAR1 rechaza más de90000 euros y más del30% de retribución; no acredita elegibilidad de la reducción admitida.
- Cada etapa del rastro lleva el original de la versión y su SHA256; la salida incluye `version`. Ya no atribuye2026 a todos los años.

## Evidencia y estados independientes

`originales.json` contiene las17 copias oficiales verificadas personalmente por SHA256 y reextraídas con pdftotext, sin nuevas descargas. Las rutas y decisiones de origen permanecen en auditorias/revisiones retenciones2012–2019 y2020–2026. Se leyó el original2018 julio para RED20, tabla específica, irregularidad y transición territorial. Se vio el facsímil enero2024p32: «y La Palma» está tachado. RET20-018 no se implementa como habilitación. La Palma no está modelada como territorio y no debe codificarse mediante los booleanos de Ceuta/Melilla.

**Integridad:** hashes de copias comprobados. **Autenticidad:** procedencia HTTPS oficial registrada por auditores; PAdES/CSV/confianza histórica no verificados aquí. **Interpretación:** se conservan los alcances y objeciones independientes; la identificación de versión no acepta todo el algoritmo. **Exactitud:** pruebas de casos y fronteras acotadas, no todas las combinaciones. **Aceptación:** esta implementación es candidata y necesita revisión independiente nueva; ningún resultado fiscal se autoacepta ni se modifica el registro editorial.

## Pruebas y comandos

Entorno Nix bun/nodejs, un worker y `flock /tmp/irobopf-validacion-pesada.lock` para suites y tipos. node_modules enlazado a raíz, solo lectura. Sin Next build ni suites legacy pesadas.

1. Antes de los fixes principales se ejecutó `bun run test tests/retenciones-versionadas.test.ts --maxWorkers=1`:23 pruebas,18 fallos reales,5 controles; `rojo.log` conserva diferencias y ejecución del export Effect público. El archivo luego se amplió: el log rojo corresponde a sus23 casos iniciales, no a todas las pruebas finales.
2. `bun run test tests/retenciones-versionadas.test.ts tests/retenciones-entradas-procedencia.test.ts --maxWorkers=1`:70 correctas. Incluye controles, fechas contiguas, extremos de reducción, corte22000, descendiente25, límites de irregularidad y guard RET20-008. Las pruebas2018 y mínimos territoriales se añadieron después de implementar esas ramas: no se afirma rojo previo individual de esas extensiones; es una limitación de la secuencia exigida que el integrador debe valorar.
3. `bun run lint` y `bun run typecheck`: logs adjuntos. Tipos aplicación y vendor;16 reglas anti-slop sin desactivar.
4. Suites existentes `retencion-trabajo-aeat.test.ts` y `irpf-retenciones-trabajo-datos.test.ts`:5 pasan y7 fallan por falta de selección temporal en consumidores antiguos (`consumidores.log`). No se oculta ese cambio de contrato ni se reescriben expectativas ajenas para lograr verde.

<a id="adaptación-que-corresponde-al-padre"></a>

## Adaptación para integrar

`lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts` consume `caso.retencionTrabajoAeat` y fuerza modo canónico. Al integrar se debe transmitir una fecha de pago acreditada o un cierre expresamente elegido por el consumidor; no rellenar silenciosamente31diciembre. El tipo `CasoRetencionTrabajo` incorpora los campos opcionales para mantener compilación de consumidores, pero la selección se exige en ejecución donde corresponde. Ante falta de fecha se debe conservar ResultadoNoSoportado, no convertirlo en cero.

`tests/retencion-trabajo-aeat.test.ts` necesita fecha/cierre en sus casos2025/2026; para2026 usar fecha en el período recuperado, no cierre. Los tests de liquidación que introduzcan ese subcaso necesitan igual adaptación. No se han editado por estar fuera de `tests/retenciones*.test.ts`. El control numérico de entradas de nuestra carpeta sí recibe fecha2026 explícita, para que no pase por un rechazo temporal anterior al guard.

## Objeciones, motivo y coste

Un experto rechazaría presentar este servicio como nómina completa: recibe remuneración anual normalizada y cotizaciones dadas, no calcula cuotas legales de SS, especie, varios pagadores, jornales o comunicaciones. Familias y cónyuge deben llegar con derecho y reparto comunicados; edades se entienden al31diciembre. Se rechaza contrato manuales en canónico. No se han inventado los requisitos ausentes.

Vivienda, anualidades por beneficiario, elegibilidad de irregularidades, límite de otros gastos (RET1219-21/RET20-011), clasificación de relaciones especiales/artistas y secuencia SMI/85bis siguen sin aceptación integral. Las ramas existentes no se promocionan por añadir una versión. Coste: resultado inicial parcial sujeto a esas precondiciones, sin certificación de una obligación de retener completa. El adaptador no debe anunciar soporte de los ámbitos no modelados.

El redondeo conserva Decimal, half-up en magnitudes finales y truncamiento del tipo; las cuotas internas pueden conservar más decimales que su salida en céntimos. Hay fronteras de reducción probadas, pero no verificación exhaustiva de cada intermedio y prorrateo. Cotización0 y1143 son datos sintéticos de los casos independientes, nunca una afirmación de cotización legal de todos los ejercicios.

Cerrar fechas ausentes rompe consumidores que antes obtenían una cifra. Motivo: impedir legalidad histórica aparente; coste: adaptación explícita y tests antiguos rojos hasta integración. Conservar compatible-legacy permite reproducir sin esconder esta diferencia. No se ha implementado aplazamiento ni regularización bajo otro nombre.
