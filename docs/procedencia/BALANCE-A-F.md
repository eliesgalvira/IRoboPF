# Balance A–F a 20 de noviembre de 2026

## Lectura de un minuto: cuánto queda

**No hay un máximo defendible de horas para cerrar PLAN-COMPLETO y abrir sus cuatro puertas generales.** Falta conciliar el censo de datos, contar ramas y relacionar las 19 familias con sus productores y condiciones de aceptación. Dar como «total para cerrar» la primera tanda ocultaría trabajo todavía sin medir.

| Alcance | Trabajo presupuestable ahora | Total para terminar ese alcance |
| --- | --- | --- |
| 1. Prioridad de la noche del 4/11: E primero, unos 300 Open 2025, B2026, deducciones autonómicas 2025, A reciente/series usadas y D con techo de cuatro horas | **114–323 horas-agente** para un primer corte revisable: 112–318 de E/B/deducciones/A/integración y 2–5 para conciliar C300. D no exige repetir su nota: 0 h | **Desconocido**: la suma cubre los paquetes finitos de abajo; no todas las ramas ni todas las ampliaciones familiares o territoriales |
| 2. Aplazado: F completo y el resto de A | **14–40 horas-agente sólo para preparar el siguiente presupuesto**: inventario de F 6–16 y conciliación inicial de A 8–24 | **Desconocido**, también después de sumar esas tareas. El piloto F opcional de 8–24 h y todo el desarrollo posterior quedan fuera de esa suma |

Son estimaciones de planificación, no tiempos observados ni promesas de resolver toda casuística universal. Se suman horas continuas de autor y revisión, sin CPU, esperas ni duración de calendario. Los extremos se suman exactamente, sin redondearlos a favor. **114–323 y 14–40 no se pueden sumar para obtener el total de PLAN-COMPLETO.** C histórico completo y D general se explican como alcance adicional, fuera del orden priorizado; no se incorporan de oficio a ninguno de los dos presupuestos.

La frase honesta es: hay producto familiar y cientos de contrastes útiles ya hechos; queda trabajo acotable para la próxima entrega, pero aún no está medido todo lo que exige el cierre general. **El priorizado por sí solo no puede abrir las cuatro puertas generales mientras F siga aplazado.**

El [plan amplio](PLAN-COMPLETO.md), el [estado operativo](ESTADO.md) y [A útil](A-ALCANCE-UTIL.md) delimitan esos alcances. Este balance sustituye la lectura vigente de la tabla antigua; no borra sus resultados ni sus versiones. Base documental: [`e7ec48cd87b2990f0043d53ce67449433e810637`](https://github.com/eliesgalvira/IRoboPF/commit/e7ec48cd87b2990f0043d53ce67449433e810637). Los resultados de pruebas, capturas y CI citados son históricos de sus fuentes: aquí sólo se ha leído y comprobado documentación, no se ha vuelto a ejecutar el motor ni confirmado CI remoto.

## Del 4/11 al estado actual

La tabla del 4/11 usaba **horas de reloj de trabajo continuado**: A 40–100 para aquellos lotes, B 24–48, C 24–60 para 2025, D 12–32 condicionadas a herramienta, E 32–80 adicionales y F 80–200 provisional. No se rebautizan como horas-agente actuales ni se restan avances por número de commits. La orden nocturna cambió la prioridad y aplazó F/resto de A. Después se incorporaron familias, deducciones, series y casos útiles que tampoco estaban contenidos en una meta de 80 perfiles: ese trabajo no desaparece del balance.

| Bloque | Situación en el balance del 4/11 | Avance conservado y saldo actual | Presupuesto restante de la próxima tanda |
| --- | --- | --- | --- |
| A | 11.204 ocurrencias conciliadas; 269 coincidencias técnicas, 470 simulaciones no aplicables y 10.465 sin verificar en ese censo | Censo nuevo de 17.764 registros efectivos y cotejos focales recientes; falta su unión con las evidencias actuales | 12–32 h en el priorizado; resto: 8–24 h sólo para conciliar y diseñar un lote, cierre sin máximo |
| B | Adquisición de normas y conjuntos territoriales pendiente en la tabla; actualización E+B del mismo día ya la supera parcialmente | 17 escalas y 17 conjuntos de mínimos 2026; cero catálogos completos con deducciones | 50–140 h para delta, catálogo y admisión de un corte acotado, no todas las ramas futuras |
| C | Nueve entradas, 224 igualdades y 14 ausencias; 2.020 entradas preparadas; históricos sin disponibilidad garantizada | C300 cumplido; familias y viviendas posteriores; pendientes concretos del 18/11 y campaña histórica separada | 2–5 h de conciliación C300 dentro del priorizado; diagnósticos y correcciones adicionales separados abajo |
| D | Perfil uniforme analítico; sin política TGSS acreditada | Nota acotada entregada, sin elección nueva de política TGSS | 0 h para repetir lo entregado; no se conceden otras cuatro horas automáticamente; D general separado |
| E | Motor/API técnicos cerrados, E-REV-01 corregido; extensión fuera de Madrid pendiente | Núcleo anual extendido; ascendientes y conjunta ya implementados con contratos distintos | 12–36 h para matriz actual, un lote residual y adversas; ampliación general sin máximo |
| F | Verticales y contratos parciales; 19 familias, composición y puertas pendientes | Cálculo financiero y composición anual existen; demostración causal y admisión general pendientes | 6–16 h de inventario; piloto seleccionado 8–24 h condicional, fuera del inventario; cierre sin máximo |

No hay PR nuevo en esta entrega. Se citan commits de la cadena ancestral actual, comprobada localmente; los informes antiguos conservan sus referencias históricas. No se presenta una reescritura como una republicación pública nueva ni como identidad de árboles completos.

## A: qué se ha contado y qué falta verificar

El [inventario de datos](inventario-datos.json.gz) contiene 121.272 registros; 33.679 apuntan a `lib/dominio/normativa/datos/`: 11.105 parámetros sintácticos, **17.764 efectivos**, 4.518 fórmulas, 210 pasos y 82 condiciones. Son registros técnicos: no se ha comprobado que todos sean valores fiscales distintos. No sumar parámetros sintácticos y efectivos como cobertura fiscal.

El período **2012–2026 comprende 15 ejercicios**, y el régimen común del selector comprende **17 territorios: 15 comunidades y dos ciudades**. Los efectivos proyectados por ejercicio son:

| Año | Registros | Año | Registros | Año | Registros |
| --- | ---: | --- | ---: | --- | ---: |
| 2012 | 640 | 2017 | 890 | 2022 | 880 |
| 2013 | 646 | 2018 | 921 | 2023 | 791 |
| 2014 | 694 | 2019 | 909 | 2024 | 708 |
| 2015 | 878 | 2020 | 936 | 2025 | 6.152 |
| 2016 | 882 | 2021 | 902 | 2026 | 1.004 |

Estas proyecciones **no son aditivas**: un registro multiaño puede aparecer en varias. Todos los efectivos siguen formalmente `pending` en el inventario; eso no invalida los cotejos focales, pero tampoco permite publicar un saldo fiscal actual de «verificados/sin verificar». Los 501 registros `simulada-estatal` no equivalen a las 470 simulaciones del censo anterior. Hay 4.185 efectivos sin territorio declarado; el desglose técnico no acredita vigencia jurídica.

No se ha contado un número único de aliases: `itemIds` mezcla alias, derivación y referencia. Falta resolver el grafo por símbolo/propiedad, separar unidades y constantes técnicas, y unir cada evidencia vigente sin duplicar una comprobación. Tampoco se restan 10.465 de 17.764. Los [lotes 2012–2018](datos-2012-2026/lotes/escalas-minimos-2012-2018/manifiesto.json) y [2019–2026](datos-2012-2026/lotes/escalas-minimos-2019-2026/manifiesto.json) son cortes previos solapados; sus objetos externos no se han reabierto aquí. Las 357 entradas de generación concuerdan por SHA con sus archivos actuales: integridad, no auditoría legal.

Avances que sí se pueden conservar, sin mezclarlos con los registros:

- [Escalas y mínimos 2025](datos-2012-2026/producto-escalas2025/INTEGRACION.md): 17 territorios, 1.477 cotejos originales, 1.405 coincidencias y 72 diferencias, 12 de céntimo; corrección de 27 filas en cuatro territorios y resolución de las 72 en el sondeo.
- [Series Madrid 2018–2024](datos-2012-2026/producto-series-historicas/INTEGRACION.md): 238 cuotas y 469 sondeos según ESTADO, 40 diferencias de céntimo corregidas, con 2022 separado. Empleo ordinario usado, sin extenderlo a fallecimientos u otros territorios. Ancestro actual de estas integraciones: [`c9d761ed7d61`](https://github.com/eliesgalvira/IRoboPF/commit/c9d761ed7d615c0579373c1865491cbc903959dc).
- [SS 2025–2026](datos-2012-2026/lotes/ipc-ss/ORDENES-ANUALES.md): 88 celdas físicas, 38 enlaces, 32 coincidencias condicionadas y seis pendientes. AT/EP empresarial requiere tarifa/actividad; AT/EP y FOGASA trabajador requieren derivación, tres pendientes por año. Las 56 posiciones físicas no consumidas no son coincidencias nuevas. Ancestro actual: [`394ec23086d7`](https://github.com/eliesgalvira/IRoboPF/commit/394ec23086d7c44cdf375aa1f2fe9c2fd6e3c2c7). IPC 2026 sigue siendo escenario, no observación INE.

Priorizar cuatro grupos —escalas/mínimos, SS, IPC y series usadas— cuesta provisionalmente 12–32 h (3–8 por grupo para conciliación y diferencias acotadas). No se repite una revisión favorable sin cambio material. Para el resto de A se reserva sólo una tarea inicial de 8–24 h: correspondencia de IDs, clasificación de aliases/unidades y selección de un lote representativo. Es una asignación de planificación, sin tasa observada por registro; no compra la conciliación de los 17.764 ni el cierre histórico. Ese máximo requiere medir el lote y su tasa de ambigüedad.

## B: 2026 no está completo por tener escalas

La extensión [E+B](reforma-motor/bloque-e/B2026.md), integrada en el ancestro actual [`77c76394e30f`](https://github.com/eliesgalvira/IRoboPF/commit/77c76394e30f53ab202bfc477f03d92eeb111fc3), aporta escalas y mínimos para Andalucía, Aragón, Asturias, Baleares, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Catalunya, Extremadura, Galicia, Madrid, Murcia, La Rioja, Comunitat Valenciana, Ceuta y Melilla: **17/17** de cada uno. Navarra y territorios vascos quedan fuera y se rechazan.

El catálogo autonómico de deducciones 2026 del selector está vacío. En la unidad «escala + mínimos + deducciones acreditadas», son **0/17 conjuntos completos y 17 pendientes**; tampoco está acreditada aquí la deducción territorial de Ceuta/Melilla. No significa que falten 17 escalas. El corte de fuentes es **4/11/2026**, sin nueva comprobación normativa al 20/11; no llamar a ese corte «normativa vigente hoy». La API efectiva conserva 2025.

50–140 h es presupuesto de un primer corte delimitado: fuentes/delta 16–44, catálogo 20–56 y fronteras/revisión territorial 14–40. Son asignaciones de esfuerzo para organizar los 17 territorios, no una tasa medida por norma ni garantía de liquidación completa. Primero hay que contar normas, vigencias y ramas por territorio y comprobar novedades posteriores al corte; si exceden el lote, se reestima. La disponibilidad de publicaciones y criterio jurídico es dependencia externa, no horas de trabajo puro del agente.

## E: matriz actual, sin borrar ascendientes ni conjunta

La [ruta anual familiar](reforma-motor/bloque-e/FAMILIA-ANUAL.md) y su [cierre 2026](reforma-motor/bloque-e/CIERRE-FAMILIA-2026.md) conservan **15 ejercicios × 17 territorios = 255 combinaciones** para descendientes/discapacidad del contrato común. No son 255 declaraciones completas ni alcance de ascendientes/conjunta. La composición anual común está en el ancestro actual [`1d70320763ac`](https://github.com/eliesgalvira/IRoboPF/commit/1d70320763acbadd1812672768e025dc9696a4f0); la [retirada](reforma-motor/retirada-rutas/INFORME.md), en [`e65f3d5ae4d7`](https://github.com/eliesgalvira/IRoboPF/commit/e65f3d5ae4d7845eaba7df3e4469d23f2d6dc93d) y [`d551a248c178`](https://github.com/eliesgalvira/IRoboPF/commit/d551a248c1784973daa42fcfa334062d55ed3097). Son 18 archivos ausentes y nueve filas de consumidores en la [implementación](reforma-motor/bloque-e/IMPLEMENTACION.md), no 18 migraciones o nueve contratos fiscales íntegros. El recuento AST revisado de 350 TS/TSX encuentra cero de los cinco identificadores legacy censados; no prueba ausencia de toda duplicación semántica.

| Productor/consumidor | Cobertura actual | Residuo y frontera |
| --- | --- | --- |
| Núcleo anual individual | Descendientes y discapacidad, 2012–2026, 17 territorios; cuantías propias según contrato | Hechos completos y elegibilidad, sin fallecimientos; no autentica hechos externos |
| Familiar efectivo | 2025; derechos integrados según productor | No extender a 2026 ni confundir discapacidad propia con alcance de todo consumidor |
| Retención familiar | Madrid 2025, activo situación 3, guardas propias | No hereda los 255 ámbitos anuales ni la nueva conjunta |
| Ascendientes ordinarios | 2025 Madrid/CLM/Valencia: renta desde trabajo o ausencia exhaustiva, convivencia, titulares, prioridad de grado y discapacidad | Rechaza fallecimiento, conjunta del ascendiente, censos simultáneos de ascendientes/descendientes y economías/grafos fuera de contrato |
| Ascendientes, permiso laboral reducido | Sólo anual efectivo laboral 2025 en Aragón/Canarias/Castilla y León: uno sin renta/discapacidad, no declarante y un titular de primer grado | No son otros tres territorios con todo el contrato anterior; API canónica general no adquiere ese permiso |
| Conjunta explícita ordinaria | 2025 en Aragón, Baleares, Castilla y León, Galicia, Murcia, CLM, Valencia y Madrid | Matrimonial/monoparental, un perceptor y un hijo menor de tres sin renta, adultos 18–64, residentes/vivos/convivientes todo el año, censos/opción completos; sin ahorro, actividad, inmuebles ni discapacidad; empleo ordinario y bruto técnico ≥30.000; aceptación fiscal pendiente |
| Alimentos propios y hechos complejos | Rechazos documentados donde falta procedimiento; antes de 2015 también con mínimo | No se sustituyen por mínimos cero ni se infiere un procedimiento de las cuantías |

Fuentes primarias: [ascendientes](../../lib/dominio/irpf/minimos/ascendientes-2025.ts), [derechos](../../lib/dominio/irpf/minimos/derechos.ts), [contrato conjunto](../../lib/dominio/irpf/conjunta-2025/contrato.ts), [preparación](../../lib/dominio/irpf/conjunta-2025/preparar.ts), [anual conjunta](../../lib/dominio/irpf/conjunta-2025/anual.ts) y [despacho público](../../lib/dominio/irpf/trabajo-anual/conexion.ts). La conjunta compone reducción de 3.400/2.150, mínimos de unidad y pagos; DA61 es cero en ese corte. La API individual y retenciones no adquieren automáticamente esa ruta.

Los avances familiares posteriores están en [`9e3f4c5fcdc6`](https://github.com/eliesgalvira/IRoboPF/commit/9e3f4c5fcdc6e0350c3bdac31ca44acedb8cf7e1), [`c71d34436710`](https://github.com/eliesgalvira/IRoboPF/commit/c71d34436710a94d9e8400cb25ed42d1d910d9b9) y [`65dee3032aa1`](https://github.com/eliesgalvira/IRoboPF/commit/65dee3032aa166fe72725d4947ca6a457242d316). [Resultados actuales](simuladores/medicion-2025/RESULTADOS.md) y [conjuntas](simuladores/medicion-2025/CONJUNTAS.md) registran cuatro ascendientes y diez conjuntas (ocho matrimoniales y dos monoparentales) dentro de 76/80. El céntimo canario del informe anterior ya fue corregido por componentes; las diez vinculaciones conjuntas ya no están pendientes. Las pruebas de [tres territorios](../../tests/ascendientes-tres-territorios-2025.test.ts), [Open](../../tests/ascendientes-open2025.test.ts) y [conjunta](../../tests/conjunta-ordinaria-2025.test.ts) se han leído, no ejecutado aquí.

E residual: **12–36 h**, desglosadas en 4–10 para conciliar esta matriz y consumidores, 4–14 para un lote residual seleccionado y 4–12 para adversas/documentación. No se vuelve a presupuestar escribir los dos productores existentes. A/B aportan cuantías y aplicabilidad; las ampliaciones generales, fallecimientos, conjunta fuera del contrato y autenticación de hechos no tienen aún denominador ni máximo. Las deducciones familiares se presupuestan en el paquete siguiente, una sola vez.

## Deducciones autonómicas 2025: paquete separado

El [inventario](deducciones-2025/inventario-20261112/INVENTARIO.md) y su [JSON](deducciones-2025/inventario-20261112/inventario.json) reconcilian 351 identidades en 15 CCAA. La unión de cortes es 51 → 183 → 221 → 272 → 308; las 49 filas de E añadían 38 identidades. Faltaban Aragón 2, Madrid 21 y Murcia 20. Ahora **351/351 tienen ruta específica, cero ausencias de ruta**; de aquellas 43, 42 tienen alguna rama monetaria y una fórmula sin importe. No se deduce que 350 códigos sean monetarios completos ni que las 351 estén aceptadas.

La clasificación de esas 43 es: una numérica anual mixta, 34 aisladas, cuatro anuales, dos aisladas/anuales, una consumo DT18 y una fórmula F-N02. Siguen reservas de vivienda joven Murcia, DT18 `Uno_vigente`, libros gallegos y vivienda murciana 1998–2000. [Alcance de conciliación](reconciliacion-20261115/ALCANCE.txt). Avances de rentas familiares/Madrid en [`e406e99c1b57`](https://github.com/eliesgalvira/IRoboPF/commit/e406e99c1b57a48906aecaf7bd51a258e1ba3015), Galicia/DA61 en [`3321760a8d5d`](https://github.com/eliesgalvira/IRoboPF/commit/3321760a8d5d07139f845dba186925d69630815b), inventario en [`92dc32fcd3cd`](https://github.com/eliesgalvira/IRoboPF/commit/92dc32fcd3cd2cff7adcfe419433bf8dfa229553). No se hereda aceptación de versiones anteriores.

Falta contar por identidad ramas, productores, hechos, rechazos, dependencias y reservas: el universo actual de reglas pendientes **no está medido**. 30–90 h supone 15 lotes territoriales de 2–6 h para censar y resolver un primer conjunto conocido aprovechando conexiones existentes; no todas sus variantes. Es supuesto de planificación, sin tasa empírica. Las partes familiares e inmobiliarias compartidas se asignarán aquí o a su productor al fijar el lote, nunca a A/E/F simultáneamente.

## C: lo cumplido y lo que cambió después

El objetivo de **unos 300 Open 2025 ya se cumplió; no quedan 300 nuevos**. [Cierre C300](simuladores/c300/CIERRE.md), commit [`7c200dc75cf1`](https://github.com/eliesgalvira/IRoboPF/commit/7c200dc75cf18da366c71b70eb5ef59365f6080c): 300 entradas Madrid, empleo individual sin familia, 21 con dos pagadores agregados, 3.550 casillas iguales y 650 ausentes, cero discrepantes entre 4.200 posiciones. Andalucía añade una entrada: 12 iguales y dos ausentes. [Nueve variantes posteriores](simuladores/c300/VALIDACION-VARIANTES-20261105.md): 108 iguales y 18 ausentes; dos preparadas sin captura. No convertir ausencias en ceros ni sumar entradas derivadas como cobertura universal.

La [medición nacional](simuladores/medicion-2025/RESULTADOS.md), [`ecb9fb81d930`](https://github.com/eliesgalvira/IRoboPF/commit/ecb9fb81d930e1929a33452ce33fac3a2630b44e), conserva **76/80** objetivos exactos, cero discrepantes entre los 76 comparables y cuatro sin resultado acreditado. Las tres proyecciones CLM/Catalunya/Rioja tienen alcance acotado, no vivienda íntegra introducida en Open. Los pesos son proxy territorial AEAT 2024, no incidencia poblacional de estos perfiles.

Después se añadieron casos por utilidad, sin una meta cerrada en 80: [cuatro arrendadores prospectivos](simuladores/alquiler-prospectivo-2025/README.md), [`60db11dc6f06`](https://github.com/eliesgalvira/IRoboPF/commit/60db11dc6f0670d0fd8df035dd140c1daac6746c), con suelo desconocido, 4/4 finales exactos y 3/4 intermedios exactos; reserva madrileña de 0,00004 EUR en coste. [Dos pensiones](simuladores/pensiones-prospectivas-2025/README.md): Madrid exacta y Andalucía discrepante en **0,01 EUR**, conservado en el diagnóstico de [`b7090a1f48b8`](https://github.com/eliesgalvira/IRoboPF/commit/b7090a1f48b82c493017839185b327af3f449bd4). Así, 76 + 4 + 2 = **82 comparables, 81 exactos y uno discrepante**. No es 81/82 de los 80 originales; incluyendo sus cuatro pendientes son 86 objetivos.

### Pendientes concretos del 18/11 y costes condicionales

La [evidencia Madrid por fila](../analisis-madrid/evidencia-filas/LECTURA.md), incorporada en la base del balance, registra 24 actuaciones 2018–2025: **2/24 coinciden al céntimo presentado, cero igualdades internas exactas certificadas y 22 entradas exactas no conservadas**. Son una de 2018 y tres por año de 2019 a 2025: 1 + 7 × 3 = 22. La ruta ensayada pierde precisión de SS; no demuestra imposibilidad universal de transportar la entrada. No redondear hechos de entrada para declarar éxito. Los ocho originales/95 casillas del análisis son otro contador, no 24 casos adicionales; H decimal/contractual no se duplica y X/I no tienen resultado Open directo.

| Pendiente | Diagnóstico y decisión, h-agente | Trabajo adicional sólo si existe una vía defendible |
| --- | ---: | --- |
| Las 22 entradas Madrid, bloque C | 4–10 | 12–30 h para transporte exacto, persistencia y vínculos de esas entradas |
| Pensión Andalucía 2025, céntimo, bloque C | 3–8 | 4–10 h de cambio y revisión; no escoger política por territorio/resto sólo para ocultarlo |
| Arrendadores originales Asturias-02, Andalucía-04, Madrid-07 y Madrid-13-v2, C/F | 4–10 | 8–20 h para cuatro vínculos si se transmiten los mismos hechos de suelo conocido; nuevo productor obliga a recotizar |
| Conciliar C300 conservado | 2–5 | Repetir sólo casos afectados; la validación común está en integración, no se suma por cada fila |

La suma exacta de decisiones es **13–33 h**. C300 2–5 ya está en 114–323: el diagnóstico adicional de los otros tres asuntos es **11–28 h**, fuera de aquel presupuesto. Sus extensiones condicionales suman **24–60 h**; si las tres vías son viables, decisiones y extensiones dan **37–93 h**, antes de cualquier validación adicional no cubierta por la integración común. La referencia anterior aproximada de 40–100 no es un techo de cierre. Los 3–8 h de validación compartida de esa propuesta no se vuelven a añadir: aquí se imputan a integración 8–20 para el lote acordado; si no cabe en él, se reestima explícitamente. Los cuatro prospectivos no sustituyen a los cuatro originales. No se ejecuta ninguna actuación.

### C histórico completo, fuera del priorizado

El [corte de capturas](reconciliacion-20261115/CAPTURAS-1181.json) conserva 1.181/14.140 capturas de campaña, 12.959 pendientes, no comparaciones revisadas. Por 2018–2024: **721, 74, 82, 121, 61, 61, 61**, objetivo 2.020 por año. [Estado por año](ESTADO-POR-ANIO.md) separa campañas, discriminantes y controles PRE/POST. No sumar esas revisiones como casos nuevos. Antes de 2018 no hay vía ejecutable admitida; PADRE/2017 no se reanudan aquí.

El máximo de C histórico es desconocido: falta deduplicar por identidad las comparaciones y medir coste por captura válida, fallos y revisión. No multiplicar las antiguas 24–60 h de C2025 por años ni inventar una tasa de captura. Herramienta disponible y cola de ejecución afectan al calendario por separado.

## D: techo acotado y cierre general distintos

La [nota D de producto](D-REDONDEO-PRODUCTO.md), incorporada con E+B, ya distingue cotización efectiva, estimación uniforme y cuota mensual TGSS no admitida. El estado conserva siete artefactos cotejados y replay racional; los 2 min 44 s de investigador allí registrados no son contabilidad total. No permiten afirmar que quedan exactamente 3 h 57 min 16 s del techo.

**0 h para repetir esa entrega**. Si se decide consumir presupuesto residual, el tope bruto sería 0–4 h, condicionado a conocer el gasto previo; no es un saldo nuevo disponible ni se añade a la suma priorizada. D general sigue pendiente y fuera de ese orden: un futuro lote finito podría presupuestarse provisionalmente en **8–20 h** (experimento/contrato 4–10 e implementación/revisión 4–10), sólo con herramienta discriminante adecuada. No es cota de D completo.

Los ejemplos SLD históricos separan alternativas de reparto/acumulación; no establecen política universal 2025, empates, signos o ajustes. Hace falta salida oficial por base, concepto, aportación, mes y año, versión y hechos suficientes. La calculadora AEAT observa retenciones; Open recibe un gasto de cotización: ninguno certifica por ello una liquidación TGSS. Sin herramienta no hay máximo identificable, y su disponibilidad no es trabajo puro del agente. D no impide IRPF con cotizaciones efectivas admitidas, pero sí presentar una cuota TGSS como acreditada. No se abre un bloque nuevo.

## F aplazado y cuatro puertas

F incluye expresamente las **19 familias del plan y la declaración como un todo**, no sólo la conexión financiera ya existente. Hay [cálculo de actividad](../../lib/dominio/irpf/actividades-economicas/calcular.ts), [adaptador](../../lib/dominio/irpf/actividades-economicas/adaptador.ts) y composición anual común. R62 conserva la dependencia causal excluida `adaptarActividadGeneral → calcularActividad2025 → etapas/aporte`. No decir «19 productores ausentes».

El [censo AE25](auditorias/actividades-economicas-2025/cobertura.json) tiene **16 reglas**, antecedente anterior a implementaciones, y las [instancias R23](editorial/flujo-rentas-actividad-r23-sol/instancias.json) contienen **19 llamadas de etapa**: ninguno mide las 19 familias. Falta su matriz actual con productor, instancia/propiedad, selección, colección, transporte, admisión, revisión y rechazo. Número de familias fiscalmente completas: no medido. Los 65 sitios históricos (64 corroboraciones condicionadas y un bloqueo) tampoco se suman a familias, a 351 identidades ni a datos A.

Primer inventario F: **6–16 h** para construir esa correspondencia y seleccionar un lote; **8–24 h adicionales condicionales** para un piloto posterior, sin promesa de las 19 familias. Son asignaciones de planificación, no extrapolación por llamada. La referencia de [INFORME-FINAL](INFORME-FINAL.md) —familias 32–64, composición 16–40, admisión 24–64, puertas 8–24, suma 80–192— es histórica, no un presupuesto actual certificado que se pueda sumar a estas fases. No hay máximo general de F/resto de A. Deducciones y derechos compartidos se pagan una vez en sus paquetes, no otra vez en F.

| Puerta y ámbito | Qué exige y qué la bloquea | Bloques necesarios |
| --- | --- | --- |
| `admissionClosed`, por sitio | R32 deriva éxito anual y, en retención, presencia/éxito del subservicio; puede dar true sin valor/selección completos. R35 exige todas las obligaciones resueltas: **9 resolved, 5 pending** (deducciones, wrapper-adaptador, puertos-renta, selector-territorial, subservicio-final) | A/B selección y aplicabilidad; E/deducciones/F productores y admisión |
| `siteClosed`, por sitio | Éxito anual no prueba valor y selección. R36 declara **17/17 false**; falta cierre del recorrido y revisión del alcance actual | E/F composición, A/B y deducciones; C/D sólo contrastan ámbitos concretos |
| `wiringAllowed`, artefacto/conexión | R35/R36 y contrato actual lo mantienen false; el verificador de flujo rechaza true. Conectar una API financiera no demuestra su contrato público | F con productores E/deducciones y evidencias actuales A/B |
| `completeRuleAcceptance`, regla/ítem o artefacto | Ámbito publicado exige false aun para `accepted-limited`; faltan aplicabilidad, reservas jurídicas, hechos y aceptación por regla/año/territorio/perfil | A–F según cada regla; no se deriva de un match técnico |

Fuentes de estas condiciones: [R32](../../scripts/procedencia/flujo-admision-r32.mjs), [R35](../../scripts/procedencia/flujo-admision-r35.mjs), [R36](../../scripts/procedencia/flujo-admision-r36.mjs), [schema](../../schemas/procedencia/flujo/admision-r36.schema.json), [contrato actual](../../scripts/procedencia/contrato-motor-unico.ts), [flujo](../../scripts/procedencia/flujo-contrato.mjs), [ámbito](../../scripts/procedencia/ambito-publicado.mjs) y [contrato nominal](../../scripts/procedencia/nominal-contrato.mjs). Fórmula, selección, hecho, derecho y aceptación conservan estados separados. Ni un hash autentica residencia/rentas/titularidad ni cambiar un literal de puerta demuestra su condición.

La [frontera R36](ADMISION-R36-TRY.md), [`2610bc92d696`](https://github.com/eliesgalvira/IRoboPF/commit/2610bc92d69684e0c68a499ff272bda17b78deed), y el recuento AST revisado conservan **26 TryStatement en 26 módulos de deducciones**. Al alcanzarlos: `pending`, sin valor ni sitio admitido; no interpreta `catch/finally` ni ejecuta sus cuerpos. Las [pruebas aisladas](../../tests/admision-r36-try.test.mjs) no acreditan construcción global.

Por **lectura estática**, el [compilador](../../scripts/procedencia/flujo-admision-r36-compilador.mjs) no incluye `RangeError` entre intrínsecos y requiere declaración/importación; [composición anual](../../lib/dominio/irpf/liquidacion/composicion-anual.ts) lo usa en `ambitoIndividual` fuera de try sin declaración local. Sigue siendo una dependencia no traducible alcanzable. **No se ha ejecutado `buildCompleteAdmission()` ni demostrado cuál sería su primer fallo global actual.** Resolverlo no elimina la frontera try ni las obligaciones de selección, hechos y composición. Las fuentes cambiaron: no se heredan pines ni aceptación histórica del núcleo anterior.

## Presupuesto, coste real y corrección de las estimaciones

| Paquete finito priorizado | min–max h-agente | Supuesto y límite |
| --- | ---: | --- |
| E residual | 12–36 | Matriz actual + un lote seleccionado + adversas; no reimplementar ascendientes/conjunta |
| B2026 | 50–140 | Fuentes/delta + catálogo + fronteras de un corte acordado; reestimar al censar ramas |
| Deducciones 2025 | 30–90 | Censo y primer conjunto por 15 lotes, no aceptación de toda variante |
| A reciente/series usadas | 12–32 | Cuatro grupos focales, sin repetir cotejos favorables sin cambios |
| Integración, documentación y revisión común | 8–20 | Una integración material con pines, regresiones/CI necesarios y validación C compartida |
| Subtotal de esos cinco paquetes | **112–318** | Primer corte, jamás total de cierre |
| Conciliación C300 | 2–5 | Meta cumplida; preservar versiones y determinar afectados |
| D nota entregada | 0–0 | No se repite ni se recarga el techo |
| Suma exacta presupuestable priorizada | **114–323** | No incluye extensiones todavía sin censo, diagnósticos adicionales C, F/resto A, C histórico ni D general |

No existe contabilidad completa de **horas activas** desde el 4/11. Un registro parcial conserva aproximadamente **175,2 h de duración sumada de turnos y 87,8 h de unión temporal**, incluyendo herramientas, esperas y pruebas. No son horas-agente activas, ni siquiera una cota inferior de ellas. Se cuentan registros deduplicados, no toda la actividad: faltan turnos abiertos, sesiones ausentes y otros proveedores. No se publican recibos de sesión ni sus identificadores.

Por tanto, **no hay factor fiable de error ni ahorro/sobrecoste demostrado** frente a las antiguas horas de reloj. Desde el 4 al 20 hay 16 días, no 384 horas-agente consumidas. La previsión anterior tampoco cubría de forma estable todas las conexiones familiares, vivienda, cuantización, recapturas y casos posteriores útiles. Si se leyó como presupuesto completo, falló por alcance y por omitir censos, transporte frágil, revisión y reproducción; no se arregla multiplicando por un factor inventado.

Para corregir estimaciones nuevas: presupuestar censo y criterios antes de extensión; separar producción, vínculo de evidencia, adversas, revisión/corrección y CI de los cambios reales; registrar trabajo activo y pausas; medir un lote homogéneo y reestimar al encontrar un productor nuevo o una vía de captura no fiable. La banda actual incluye revisión acotada y una integración común; defectos sin límite o reescrituras no descubiertas requieren nueva estimación, no tolerancia monetaria ni duplicar validación compartida.

## Cuota y capacidad semanal

Último evento local encontrado al consultar el 20/11: **20/11/2026 07:12:43 Europe/Madrid (06:12:43 UTC)**, 89 % usado, 11 % disponible; **ocho puntos hasta parar al 97 %**. Reinicio declarado: **22/11/2026 17:36:53 Europe/Madrid**. Es registro de cuenta, incluye otros trabajos; no es una lectura directa actual al proveedor ni cuota atribuible sólo a este proyecto. No equivale a un porcentaje de PLAN-COMPLETO restante.

**Horas-agente por semana de cuota: desconocidas.** Falta una muestra que asigne a los mismos trabajos horas activas y delta de cuota atribuible, con ventana, concurrencia y cobertura de cuenta. No convertir ocho puntos en horas mediante escenarios arbitrarios. Registrar esas magnitudes permitiría calibrar después; CPU, espera de herramientas y disponibilidad de normas quedan en columnas separadas.

## Orden recomendado y decisiones pendientes

Esta es una recomendación para decidir, no una ejecución ni el inicio de D/F.

1. Mantener E primero: conciliar consumidores y límites actuales, conservar los positivos ya logrados y elegir un residuo concreto. No partir otra vez de cinco grupos supuestamente vacíos.
2. Preservar C300 cumplido. Elegir expresamente si los tres diagnósticos C adicionales (11–28 h) entran en la próxima tanda; las 22 filas, el céntimo y los cuatro originales siguen visibles aunque se difieran.
3. Fijar el corte de B2026 y contar normas/ramas; separar lo pendiente de publicación de lo pendiente de trabajo. En paralelo pueden investigarse territorios independientes de deducciones 2025 y conciliar A por dominio, compartiendo evidencia sin tocar a la vez el productor común.
4. Integrar una vez los cambios materiales y revisar independientemente cálculo/datos; repetir sólo los casos afectados, preservar rechazos y comprobar CI al publicar. Fuentes territoriales independientes pueden trabajarse en paralelo; composición, auxiliares compartidos y aceptación deben esperar sus productores. Paralelismo reduce calendario, no suma de horas-agente.
5. Decidir cuándo levantar el aplazamiento de F/resto A y seleccionar sus censos iniciales. Elegir aparte C histórico y D general. El techo D anterior no implica saldo exacto ni permiso para otro bloque.

Antes de prometer fecha o cuatro puertas, hacen falta: lote y criterio de aceptación E/B/deducciones, matriz de ramas y familias, saldo A conciliado y una medición activa representativa. Debe quedar explícito si la entrega deseada es producto priorizado o cierre general. La ausencia de un máximo no vuelve ilimitado el siguiente lote: se acota, se entrega su saldo y se reestima sin ocultar lo que quedó fuera.
