# Contrarrevisión independiente: retenciones 2012–2019

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Fecha: 29 de octubre de 2026. **Requiere cambios. No apto para presentar el servicio actual como procedimiento histórico completo.**

Se han examinado los 34 IDs y las 160 celdas paso-año del candidato. Hay 29 decisiones `accepted` limitadas a la proposición expresamente identificada y cinco `needs-evidence`; ninguna aceptación certifica un ejercicio completo. No se rechaza íntegramente ningún ID, pero se restringen varias afirmaciones y se introduce una objeción adicional al supuesto match de gastos. `revisiones.json` conserva estado candidato, decisión nueva, severidad, localización actual, evidencia, objeciones y alcance individual. `cobertura.json` conserva cada celda original y señala las limitaciones históricas. Ninguna de las 160 celdas se declara fiscalmente validada en su totalidad.

## Defectos prioritarios y reproducción

**P1 — RET1219-01, 04, 05, 06, 09:** el servicio acepta el ejercicio histórico, pero `calcularReduccionTrabajo`, `calcularCuotaEscala` y `calcularLimite43` no seleccionan parámetros por ejercicio. El año llega a la tabla de exclusión; no resuelve la reducción ni la escala. Localizaciones actuales: `lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts:234`, `:455`, `:548`, contrato en `:19`.

Se ejecutó el export público `calcularRetencionTrabajoAeat`, con su capa real, secuencialmente. La referencia se escribió por separado con Decimal a partir de los originales; no se ejecutó ni copió el calculador del autor. `casos.json` contiene entradas completas, resultado realmente ejecutado y expectativa independiente. No son respuestas del servicio remoto AEAT.

- A 18.000 €, cotizaciones dadas de 1.143 €, activo de 40 años, situación 3 y sin familiares, el servicio devuelve 1.047,60 € tanto para 2017 como para 2019. La referencia acotada da 1.888,20 € para 2017 y 1.719,00 € para 2019. La reducción fija posterior baja indebidamente la base.
- A 23.000 €, cotizaciones cero como entrada sintética, situación 2 y dos hijos de 10 y 11 años computados por mitad, el servicio devuelve 2.518,50 € para 2017 y 2.306,90 € para 2019. La referencia da 2.925,60 € en ambos. El límite del 43% se activa indebidamente por encima de 22.000 €. La variante sin hijos da 3.410,90 € en ambos cálculos: es un control que no activa el defecto, no una validación de la condición.
- A 400.000 €, cotizaciones cero y sin familia, el servicio devuelve 170.880,00 € en 2017 y 2019, frente a 168.920,00 € de referencia. Aísla el tramo adicional del 47% desde 300.000 €, ausente de la escala de retención aplicable examinada.

El RD 1003/2014, artículo único ocho, página física 8, publica tanto la escala permanente que termina en el 45% como el límite de 22.000 €. Su régimen transitorio de 2015 y el RDL 9/2015 deben leerse separadamente. La contraprueba del algoritmo AEAT 2017 y las páginas 31–33 del de 2019 descarta que se esté comparando una escala autonómica de liquidación con retenciones. Para la reducción se contrastaron Ley 26/2014 p.12, remisión específica del art.83.3 RIRPF en RD1003 p.7, Ley6/2018 pp.77–79 y los algoritmos, evitando utilizar directamente el rendimiento neto de liquidación anual.

**P1 — RET1219-12 y 28:** dos defectos adicionales de selección.

- Ceuta/Melilla, 2017, bruto 10.000 €, ambos indicadores territoriales verdaderos: contrato especial devuelve 6%, frente al mínimo expreso 8%; inferior al año devuelve 0,8%, frente a 1%. Casos ejecutados. No se obtiene el 8% dividiendo 15 por dos. El RD1461/2018 pp.10–11 cambia a 6%/0,8%; su disposición final segunda, p.13, retrasa estos apartados al 1 de enero de 2019. No adelantar ese cambio a julio de 2018 por una multiplicación mecánica. Localización `retencion-trabajo-aeat.ts:615`.
- El helper devuelve 12.643 € para activo y pensionista en situación3 sin hijos desde 5 de julio de 2018. La Ley6/2018 p.78 publica tabla general y tabla específica de pensiones/desempleo; esta última parte de 13.000 € en dicha casilla. El algoritmo de julio añade los incrementos correspondientes. Se ejecutaron las 89 comparaciones candidatas con vectores transcritos personalmente: 81 coincidencias numéricas generales y ocho discrepancias de la tabla especial. `tablas-revisadas.json` conserva todas. Eso no acepta vigencia completa de las 89 filas. Localización `lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026.ts:231`: `situacionLaboral` aparece en el tipo pero no se utiliza.

**P1 — RET1219-10:** no existen acumulados de percibido/retenido ni estados o causas de regularización en el contrato. La fórmula del algoritmo 2017 p.35 utiliza remuneración restante; sus límites no pueden sustituirse por repetir el cálculo inicial con el total anual. No se intentó simular esa capacidad inexistente añadiendo propiedades ignoradas. Hace falta definir primero el contrato y luego casos de exceso ya retenido, remuneración pendiente cero, cambio de residencia, vivienda y límites de subida/bajada.

## Cadena histórica ampliada y lagunas

Se comprobaron SHA-256 y SHA-512 de los 22 originales candidatos. Se reextrajeron desde los originales las 2.292 citas PDF candidatas: todas reprodujeron su texto. Este control solo acredita integridad/extracción. Los HTML se leyeron mediante los artículos 81,83,85,85bis,86,87,88 y89 de las redacciones efectivamente seleccionadas de 2011 y2013; `lecturas-html.json` no inventa geometría ni presenta normalización HTML como cita literal PDF.

La investigación añadió los originales BOE de RD1788/2010, RD960/2013, Ley35/2006 y la corrección de errores de RD2004/2009, además de su ficha BOE. Están en `documentos-ampliados.json`, adquiridos por `tools/procedencia/descargar.py`, con lock, User-Agent, pausa y TLS. Originales nuevos alojados solo en scratch/CAS propio. El consolidado actual se descargó como índice de modificaciones, nunca como acreditación de vigencia pasada.

- **2012–2013:** RD1788/2010 p.4 fija escala ordinaria y tipo previo entero; RDL20/2011 p.54 fija complemento y excepción enero2012. Deben distinguirse pago y correspondencia al mes de enero; una fecha de pago aislada no basta. El tipo final histórico sí se expresa con dos decimales. La corrección BOE-A-2009-21164, p.1, solo rectifica título y referencia gramatical al art.80bis: no elimina el procedimiento previo ni modifica cuantías examinadas.
- **2014:** Ley22/2013, BOE-A-2013-13616 p.76, extiende expresamente el complemento a 2014. No se ha confundido esta prórroga con repetir a ciegas la escala2013. No se certifica aún el algoritmo2014 íntegro.
- **2015:** RD1003/2014 pp.13–14 y RDL9/2015 p.11 publican escalas diferentes y opción del pagador de regularizar desde agosto. El corte es 34.000 € en ambas escalas2015, distinto del corte35.200 del régimen permanente. La DT14 de RD1003/2014 mantiene además un régimen de movilidad geográfica: la aceptación indiscriminada de gasto moderno desde2015 sería excesiva.
- **2016:** la escala permanente de RD1003/2014 aporta norma primaria; no se ha recuperado el algoritmo anual AEAT ni cerrado cada variante por semejanza con2017.
- **2017:** original AEAT de portada25/11/2016, con página física distinta de la impresa. Se utilizaron siempre páginas físicas. Se contrastó con las reformas citadas, no con una conversión Markdown.
- **2018:** Ley6/2018 pp.77–79 separa devengo de liquidación y pagos sujetos a retención. Para retención establece régimen previo hasta la entrada en vigor, media de reducción desde entonces, tablas distintas y opción de regularización desde el mes siguiente. No aplicar la media a todos los pagos del año. La reducción anual de cuota por Ceuta/Melilla no fija por sí sola la fecha de cada cambio reglamentario de retención.
- **2019:** RD1461/2018 p.13 distingue entrada general y apartados efectivos desde1enero2019. Las marcas de revisión del PDF AEAT no son dos algoritmos simultáneamente vigentes.

Los algoritmos oficiales2012–2016 y todas sus revisiones siguen sin recuperarse. Se ensayaron personalmente cinco rutas de contenido AEAT migrado, distintas de las rutas Sede candidatas: las cinco devolvieron404. El enlace histórico2016 localizado mediante una publicación secundaria tampoco proporcionó el original; la publicación no se usó como norma. `adquisicion.json` conserva resultados. Un intento ELI con fecha de corrección inexistente devolvió HTTP200 **HTML**, no PDF: se descarta. La corrección auténtica se obtuvo después con identificador y fecha31/12/2009. No se desactivó TLS ni se tomó el200 como éxito documental.

## Inspección visual y objeciones que cambian la aceptación

Se observaron personalmente los facsímiles2019 de páginas22 y29–35. La p.22 tacha las fórmulas de media2018; permanecen las nuevas fórmulas5565/13115/16825. Las pp.29–30 tachan la distinción de tablas anterior y conservan una tabla común nueva con incrementos. Las pp.32–33 tachan ramas anteriores pero conservan el límite22.000. Las pp.34–35 muestran truncamiento, mínimos contractuales e importe final. `facsimiles.json` registra hash, página,72dpi y versión de PyMuPDF; se incluyen las imágenes completas para preservar contexto y tachados.

**RET1219-21 pasa de match candidato a needs-evidence.** El pseudocódigo2017 limita otros gastos a retribución menos cotizaciones, como el código. Pero RD1003/2014 p.7, art83.3.c, remite también a las reducciones de la letra a. No se acepta la fórmula general por coincidencia con el algoritmo informático. Puede no cambiar el resultado final cuando la base se satura en cero; aquí se señala la discrepancia de subpaso y la necesidad de resolverla, no un importe de retención adicional demostrado. La transición de movilidad2015 es otra restricción.

**RET1219-34 permanece needs-evidence.** La expresión reglamentaria «pensionista o más de dos descendientes» también aparece en RD1003/2014, mientras AEAT2017 y2019 acumulan ambos conceptos explícitamente. La literalidad de esa disyunción no prueba por sí sola que el motor duplique indebidamente600 en2012/2013. Se requiere algoritmo o criterio primario histórico específico. RET1219-22 se acepta únicamente como coincidencia con el pseudocódigo moderno examinado.

**RET1219-03,25,29 permanecen needs-evidence.** Falta cadena íntegra de mínimos anteriores, contrato de elegibilidad y prueba de vigencia completa de todas las tablas. Las coincidencias de constantes modernas se conservan sin promover la fórmula completa. El original2006 tampoco acredita automáticamente cuantías2012.

Las ausencias de comunicación, remuneración normalizada, varios pagadores, jornal diario y excepciones de contrato se aceptan como límites de capacidad, no como errores inevitables de toda entrada válida. Un adaptador puede proporcionar una remuneración anual ya normalizada y familias ya filtradas. El contrato actual debe declarar y trazar esa responsabilidad. No debe multiplicarse por100 un total ya anualizado, exigir NIF al motor puro, eliminar mínimos de todos los discapacitados ni prohibir anualidades por un hijo junto a mínimos por otro.

## Contrato necesario antes de corregir

Separar cálculo inicial y regularización. Incorporar ejercicio, fecha de pago, período al que corresponde el rendimiento y opción transitoria del pagador. Identificar régimen territorial y conexión aplicable, sin presentar común como foral. Especificar si remuneración incluye especie, variables previsibles, atrasos y reducciones ya calculadas; tratar jornal diario como entrada distinta del total anual.

Para familia: fecha de referencia de edad, derecho al mínimo, prorrateo, rentas/requisitos comunicados, discapacidad y condición de relación laboral especial exceptuada. Para anualidades: resolución judicial, importe y beneficiarios distintos de quienes dan mínimo. Para regularización: acumulados, valores previos, causas, fecha de eficacia y remuneración restante. Para vivienda: derecho transitorio y comunicación, no mero booleano sin precondiciones. Definir qué validaciones pertenecen al adaptador y cuáles rechaza el servicio.

Las correcciones requieren expectativas independientes y deben conservar la distinción entre retención y liquidación anual.

## Evidencia ejecutada, cobertura y límites

`ejecuciones.json` registra comandos y hashes de scripts. Todo ejecutable propio está en `.cache/procedencia/revision-retenciones-2012-2019/`. El comando de aserciones termina con código1: diez casos, ocho fallos esperados y dos controles correctos. Los resultados esperados están en `casos.json`. También se ejecutaron los helpers para las89 filas. No se ejecutó el Excel, el Python legacy, Next build ni suite pesada. Las cotizaciones cero son entradas sintéticas, no afirmaciones sobre cotizaciones legales.

La matriz candidata tenía celdas sin vínculo a hallazgos (por ejemplo, reducciones personales, exclusión, mínimos contractuales y vivienda2012). Se conservan los vínculos originales y se añaden los de revisión pertinentes. La cobertura es examen de proposiciones y código; faltan pruebas de todas las fronteras, ramas judiciales, movilidad/discapacidad y regularización. No se ha pretendido que los diez casos cubran160 procedimientos.

`estado-auditado.json` fija hashes del código actual y de la entrega candidata. Las localizaciones corresponden a la versión posterior a lint; las correcciones del padre en Madrid2020 y la explicación autonómica son ajenas a estos defectos. La constante documental de retenciones sigue siendo2026. No se infiere ninguna vigencia fiscal2026 de ella.

Pendiente: adquisición AEAT2012–2016 y revisiones, cierre de reformas/criterios donde se expresa needs-evidence, pruebas de frontera y variantes, validación PAdES/CSV y contraste concreto del Excel. Los hashes prueban integridad, no firma ni interpretación. Las citas refinadas incluyen página física, caja y texto literal; algunas preservan página completa para no perder contexto. No equivalen todavía a una selección editorial definitiva por cada parámetro.

No se modificaron hallazgos del autor, código de entrega, ESTADO, DECISIONES ni VCS. Solo se escribieron la carpeta de revisión y su scratch. No se subdelegó.
