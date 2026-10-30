# Revisión nueva de rectificaciones de retenciones 2012–2014, R23

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen candidato: C01 queda corroborado en su alcance visual y C02 queda atendido como subcontrato documental condicionado. No he identificado dos resultados posibles dentro del dominio expresamente admitido por la adenda. No acepto una regla completa ni una nómina, no habilito versiones y no resuelvo RRO-09, enero residual o el algoritmo íntegro. Las conclusiones nuevas de esta revisión requieren contraste posterior.

Esta revisión no emite atestación candidata ni activa confianza.

Base y HEAD: `07c07e6376a72f229be735a904ecf36517a1b571`. El control de recepción compara físicamente las 14.957 entradas mediante lstat, readlink para enlaces y bytes frente a un blob de base cada vez; también compara modos ejecutables y diff. Cero diferencias de base y diff vacío. Los archivos propios aparecen como altas sin commit. El control final se entrega por separado.

Se examinaron los informes de técnica R23 y recepción R21–R23, entrega y contraste 2012–2014 y revisión R22 como antecedente metodológico. Los originales CAS consultados son los de la entrega recibida.

## Objeto compuesto y alcance de los dictámenes

`superposicion.json` conserva las 80 celdas y 44 ramas efectivas, así como el antes/después completo de los doce reemplazos por ID. `dictamen-12.json` decide las cuatro celdas de mínimos, cuatro de regularización y cuatro ramas CAUSA4. `dictamen-80.json` y `dictamen-44.json` preservan cada fila efectiva y precisan qué se rectifica y qué solo se conserva como antecedente. No se renueva la aceptación de las otras filas por pasar una composición estructural.

`contrato-compuesto.txt` es un derivado de lectura: adenda prevalente y contrato anterior subordinado, conservado literalmente. No pretende ser una edición legal nueva del contrato de autoría. Los hashes de las fuentes declaradas se cotejan contra bytes actuales; no se ejecuta `rectificar.py`, que escribiría sobre el objeto examinado.

Objeción del mejor experto: superponer doce filas no garantiza que todas las referencias al contrato anterior sean compatibles. Respuesta: se examinan también ramas no sustituidas, concurrencias, mínimos, comunicación, efectos y enlaces a pruebas históricas. Coste: cada reutilización debe transportar la adenda; la matriz aislada no constituye un contrato operativo autónomo.

## C01 y SOL-03 parcial

He abierto personalmente los ocho recortes de p10 y p16 de enero2012, febrero2012, 2013 y 2014. En todos los p10 se ve ≥25; en todos los p16 se ve ≤64. En enero el trazo inferior de ≥ es visible. Se retira la afirmación de cambio de operador enero/febrero y la exclusión visible de exactamente64. La extracción sigue perdiendo trazos; su texto no se corrige ni se usa como prueba contra lo visible.

El programa propio reabre los cuatro PDF por SHA256, SHA512 y tamaño, reextrae las cajas fijadas y reproduce los ocho PNG desde el original; la igualdad de bytes es un control reproducible, distinto de mi lectura personal. Las cajas, textos defectuosos y hashes están en `evidencia-propia.json`. También se conservan en su ubicación histórica todos los documentos y resultados anteriores.

No se vuelve a leer visualmente las 187 páginas no afectadas. Siguen pendientes los índices i/j, convivencia(i), bucles por prefijos, tablas auxiliares, requisitos personales y cualquier conciliación norma/pseudocódigo que no resuelven estos signos. SOL-03 es parcial: la rectificación de dos inferencias no valida el procedimiento familiar.

Objeción del mejor experto: una reproducción exacta de una imagen no demuestra que se haya leído correctamente. Respuesta: inspección directa de cada imagen y registro separado de la extracción, además de reproducción desde el PDF. Coste: no se infiere exactitud del resto de páginas ni funcionamiento del servicio AEAT.

## C02: fuente histórica y condiciones materiales

He abierto y leído personalmente ambas páginas físicas4–5 del original RD1788/2010, artículo1.siete. El primer párrafo contiene dos alternativas: disminución exclusivamente determinada de la diferencia positiva base−mínimo, o nueva obligación judicial de anualidades a hijos con85.2 aplicable. El segundo párrafo limita el aumento del importe ante aumento exclusivo de esa diferencia; no reemplaza la alternativa judicial. El tercero contiene los máximos de esa edición. El texto y ambos PNG se reproducen desde el original por ambos hashes y tamaño; no se deduce una regla de2012 desde2015.

Se relee el contexto original de85–88 en RD439/2007 y las modificaciones de86/87.3 del RD2004/2009. El original85.2 exige anualidad judicial inferior a base, separación de escalas, mínimo incrementado1600 y comunicación; no contiene la condición moderna de no tener derecho al mínimo por el mismo hijo. La adenda NO presenta esa condición como requisito normativo retrospectivo: conserva una exclusión del candidato hasta calificación histórica. Mínimo por otro hijo no equivale al cruce excluido por el mismo beneficiario.

El mínimo contractual de86.2 y la salvedad de87.3 no desaparecen al regularizar. El original no debe confundirse con la redacción eficaz de todos sus apartados en2012: las modificaciones de2009/2010, la cadena temporal anterior y los límites por versión permanecen necesarios. Las extracciones de contexto quedan como derivados, no como nueva certificación de vigencia, PAdES o CSV. La retirada del testimonio literal adjunto desde2014 no elimina resolución ni comunicación.

Objeción del mejor experto: restringir el cruce mínimo/especialidad podría ocultar una importación de2015. Respuesta: el contrato dice expresamente que no lo atribuye a aquella norma histórica y excluye el cruce, sin decidir su solución jurídica. Coste: menos casos soportados y necesidad de calificación histórica futura; no llamo legalmente prohibido al supuesto excluido.

## Techo, mínimo y ausencia de ambigüedad dentro del dominio

El resultado del subpaso es `min(tipoCandidato,tipoAnterior)`, no una asignación incondicional al anterior. Para anterior12, candidatos0/6/11.999/12/12.001/18 dan0/6/11.999/12/12/12. Estos son tipos hipotéticos de entrada; no se demuestra que el procedimiento anterior produzca cada combinación.

La compatibilidad basta para el orden del subpaso: si mínimo m≤candidato t y m≤anterior a, entonces m≤min(t,a). Reaplicar el mismo mínimo no cambia el resultado. La adenda exige mínimo satisfecho, misma calificación y sin cambio; excluye mínimo desconocido, incumplido, cambiado aunque conserve cifra, o superior al anterior. Con m15/a12, los órdenes darían12 y15: ambos quedan fuera del contrato; no hay dos soluciones admitidas. Con m2/t6/a12 permanece6, sin elevarlo a12.

La segunda alternativa es independiente del signo de la diferencia, pero la hipótesis delta10000→11000 no acredita una nómina real de evento único. No construyo una falsa nómina desde magnitudes independientes ni interpreto el rojo como fallo fiscal del motor. Un delta negativo mixto tampoco demuestra exclusividad de la primera alternativa y delta cero no la activa por sí solo.

Objeción del mejor experto: demostrar una desigualdad no demuestra admisibilidad de nómina ni cálculo previo correcto. Respuesta: candidato debe proceder del procedimiento histórico con80bis, vivienda, truncado, topes y mínimo correctos; la operación solo lo limita. Coste: calificación externa y algoritmo íntegro aún pendientes, sin habilitación.

## Residuo contractual y concurrencias

Las filas CAUSA5/6/8/9/10 conservan frases «excluye87.5» y la autoría conserva un filtro del instrumento viejo. No se leen como excepciones legales actuales: la adenda prevalece expresamente sobre el filtro y las referencias genéricas. Las CAUSA4 nuevas no aceptan una selección por enteroPDF sin resolución, beneficiarios, comunicación eficaz y resto de hechos. El ordinalPDF4 no es el ordinal jurídico4; la numeración del original histórico tampoco se sustituye por la de2015.

El caso antiguo1+3+4 de concurrencias y los enlaces `casoDocumental`/`aserciones` de CAUSA4 no desaparecen del archivo. Son historia documental, no prueba de una nómina del contrato nuevo. Todas las concurrencias alimentarias están excluidas, incluidas4+1/2/3/5/6/7/8/9/10 y otras no enumeradas; declararlas conciliadas no las readmite.4+11 es además incompatible en el PDF. Vivienda/salario sigue requiriendo sus fases en su propio dominio y no permite colar alimentos excluidos.

Tampoco se admiten aquí cambio de cuantía de obligación anterior, voluntarios, compensatoria al cónyuge ni tipo voluntariamente superior. Se exige estado anterior, percibido, retenido y pendiente conciliados. Los contratos antiguos que hablan de reaplicar mínimos o recalcular importe son compatibles solo subordinados al mínimo inalterado ya satisfecho; no autorizan otro orden ni entregan una cuota completa en este subcontrato.

Objeción del mejor experto: el residuo induce a error si alguien consume una fila suelta. Respuesta: `residuos.json` localiza las filas completas y el contrato compuesto hace expresa su subordinación. Coste: no autorizar consumidores de filas aisladas; futura edición operativa deberá resolver admisión y composición, sin atribuir esas garantías a estos scripts.

## Casos propios, rojos y controlador documental

`casos-juridicos.json` expresa decisiones humanas de antes/en/después de cinco días de comunicación, A=0/A<BASE/A=BASE/A>BASE, mínimo cambiado/igual en cifra/desconocido/superior/incumplido, beneficiario propio u otro, cónyuge, voluntarios, falta de resolución/eficacia, política trimestral, cuantía anterior, tipo solicitado, estado no conciliado y concurrencias. Son dictámenes explícitos con objeción, respuesta y coste; no son pruebas ejecutadas de un validador de admisión inexistente. La opciónabril/julio/octubre no añade enero por analogía; no basta fecha bancaria para vigencia.

`casos-numericos.json` conserva fronteras propias del techo en las cuatro ramas, incluidos anterior0 y mínimos1/8/15 como premisas aritméticas. No certifican calificación territorial o laboral. El programa original `contraste.py` se repite sin modificar esperado; el rojo deR23 se repite y debe fallar con18 frente12. No se ejecutan main históricos que reescriban sus JSON. Los rojos previos, incluidos los errores propios históricos de esperados, permanecen físicamente intactos.

No he demostrado un defecto nuevo dentro del dominio de la adenda; no añado rojo artificial para funciones que la adenda excluye. El intérpreteR22 solo distingue dos expresiones documentales; no ejecuta admisión, comunicaciones, mínimos, calendarios, AEAT ni TypeScript. Su revisión anterior detectaba límites frente a sobres autoconsistentes: aquí el ancla son las fuentes fijadas y leídas, no una garantía general de ese lector. No se usa como controlador de producción ni se aprueba mi instrumento.

Objeción del mejor experto: una suite verde limitada puede presentarse como cierre fiscal. Respuesta: cada salida distingue comprobación de bytes, suboperación numérica y decisión jurídica manual. Coste: no se obtienen nóminas utilizables ni aceptación de regla completa, cualquiera que sea el número de controles.

## Conservación y entrega

No hay fixes de producto, mutaciones VCS, PR, servidor, preview, UI, LFS, gasto, transferencia externa ni limpieza. Escrituras limitadas a esta carpeta y entorno/caché propios bajo `.cache/revision-r23-*`. No hay originales nuevos ni descarga adicional; no se copian PDF, aplicación, entornos o node_modules a docs. No se toca ESTADO, DECISIONES ni informes previos. Crossa permanece v1 desfasado, misma casa y dueño; copia local fuera de Victus, sin independencia o custodia remota acreditada.

El contexto fijado permanece sin promoción: inventario30dfbc31…, artefacto59bae155…, 52.461 ocurrencias y65 sitios;36 snapshots, V1a0c7d768… yV257377f07…, cierre719 objetos. Madrid e16bd156… y264 payloads exactos continúan pendientes. El cotejo físico conserva sus bytes, sin pretender validarlos semánticamente ni reconstruir toda la preservación.

Comandos en `COMANDOS.md`; integridad, autenticidad, número, interpretación y revisión son ejes separados. El manifiesto usa rutas relativas, SHA256, tamaño y baseSha256; todas las entradas propias son altas. Parche textualgzip contra base y binarios por ruta/hash, con exclusión de autorreferencia declarada. El receptor debe fijar el hash externo de entrega.json y cotejar los bytes antes de integrar. RRO-09, enero residual, autenticidad histórica de capturas secundarias, auxiliares familiares y regularización íntegra permanecen abiertos. El encargo global no se declara terminado.

## Resultado de controles propios

La reproducción propia termina correctamente: fuentes y reemplazos fijados, ocho recortes y ambas páginas BOE idénticos; rojo histórico reproducido con exit1 y contraste R23 con exit0. Las fronteras del techo pasan; las decisiones de admisión siguen siendo dictámenes humanos. Ruff pasa sin diagnósticos y Mypy termina sin incidencias en los cinco scripts propios, con `--check-untyped-defs`, intérprete real y `--follow-untyped-imports`. Se conservan los diagnósticos anteriores: estilo inicial, import sin entorno, ausencia de marcador py.typed y reutilización de variable string/int. No se suprimen errores ni se alteran esperados: formato, ruta del intérprete y nombre de variable propios.

Los cotejos inicial y final conservan las14.957 entradas físicas, enlaces y modos frente a un blob por vez, cero diferencias/borrados y diff vacío; HEAD exacto. El pase de cierre vuelve a registrar el estado de entrega tras generar los derivados. Ninguna de estas comprobaciones es aceptación fiscal ni cierre del encargo global.
