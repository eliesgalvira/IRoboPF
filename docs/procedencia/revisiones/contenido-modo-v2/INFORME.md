# Revisión de contenido y modo v2

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen: **CI-01/02/03, RV3-01 y EMI-01 aprobables en el alcance técnico comprobado. EMI-02 corrige la falsa independencia, con un residuo documental P3, CMV2-01, en la explicación de 2012–2014.** No se acepta una regla fiscal completa ni se emite atestación de Madrid.

Base declarada: `ed6a43fd750de05609abc3710dabdc2f8261020c`. Se examinaron integración-ronda7 y los tres informes previos asignados. Esta revisión no comprobó la base mediante VCS: la recepción debe cotejarla con los hashes de fuentes del manifiesto.

## CMV2-01 — El panel no distingue la reconstrucción hasta 2014 (P3)

Ubicación: `components/liquidacion-irpf.tsx:2870–2873` y `:2927`. El panel siempre dice que el ajuste se calcula desde la cuota del modo indicado, y describe el resultado final como el menor entre cuota tras SMI y límite. Sin embargo, `conciliacion-simulador-legacy.ts:142–148` usa una reconstrucción distinta hasta 2014. El objeto ya declara correctamente `naturaleza`, pero el panel no la consulta.

Reproducción conservada en `casos/conciliacion.mjs.txt` y `logs/conciliacion.log`: con bruto sintético de 60.000 €, año 2014 y cuotas suministradas de 1.000/2.000 €, el resultado permanece en 16.421,65042 €. La fórmula anunciada por el panel daría respectivamente 1.000/2.000 €. En 2018 ambos resultados sí siguen las cuotas suministradas. Es un ensayo de contrato, no una declaración fiscal ni una expectativa legal nueva. El panel se examinó en fuente, sin browser ni servidor.

Objeción experta: la advertencia «no es un oracle independiente» corrige EMI-02, pero no vuelve verdadera una derivación que no se ejecuta para esos ejercicios. Motivo: una explicación auditable debe describir el procedimiento que produjo el número. Coste de corregir: seleccionar texto y ayuda según `naturaleza`, con una regresión de presentación para cada rama; no cambiar el motor ni el Excel. No se encontró consumidor ejecutable que aún proclame la independencia de esta conciliación en los usos rastreados de app/components/lib/scripts/tests (`logs/consumidores.log`). Los nombres históricos de campos permanecen; no constituyen por sí solos una afirmación de independencia.

## Contenido y cierre

CI-01: cadena Document ← Citation ← Facsimile admisible por `evidencia`; el control positivo pasa. Retirar original, imagen o receta del conjunto de auxiliares falla por separado; eliminar la cita o dirigir la arista al documento también falla. El ensayo adicional retira físicamente un auxiliar de la copia CAS mediante su enlace de scratch y exige fallo de la puerta completa. No se modifica ningún objeto original. Alcance: cierre e integridad, no reproducción de una imagen ni autenticidad de un documento sintético.

CI-02: se toma una ocurrencia real con valor no nulo. Se modifica por separado archivo, localizador, título, tipo, clase e identidad ocurrencia→concepto. Se conserva la cifra, se rehacen revisión de entidad, gzip, índice, tamaños y hash del snapshot y se admite el nuevo snapshot en el registro de scratch. Las seis mutaciones fallan en `verificar`, no solo en el helper unitario. Las primeras cinco dan «Ficha distinta del inventario fijado»; la sexta tampoco evade la cobertura del inventario. Control intacto: 50.699 fichas. No se regeneró el inventario.

CI-03: retirado el total global fijo de la entrada pública. El texto distingue inventario de reglas aceptadas. El generador separa 50.646 ocurrencias, cuatro conceptos editoriales y 49 puntos del rastro; estos últimos son conceptos técnicos, no 49 reglas fiscales adicionales. La ficha diferencia ocurrencia de concepto y mantiene interpretación/autenticidad/contrarrevisión pendientes.

Objeción experta: hashes rehechos pueden preservar una falsedad coherente consigo misma. Motivo del dictamen favorable: las mutaciones se cotejan contra el inventario fijado, no contra su propio resumen alterado. Coste: se necesita una nueva proyección y versión cuando cambian fuentes o identidad; la revisión editorial y normativa sigue siendo separada.

## Explicación actual e historia

RV3-01: se recalcula `hash(JSON.stringify({generador, fuentesSoftware}))` sobre el generador y los once archivos de `FUENTES_EXPLICACION`, en orden explícito. Se exige también inclusión de esos hashes como auxiliares. El ensayo propio altera individualmente los doce archivos: adaptador anual, modelos, grafo, almacén, IO, revisión, rastro, extractor, receta y ambos verificadores, además del generador. Las doce mutaciones fallan en la puerta actual. Se restaura cada input de scratch antes del siguiente caso; no se ejecuta el código adulterado como verificador de sí mismo. Control actual: 49 puntos, snapshot `babfc930e2c4096600e68895d13bbfae23c996bacd3ba7fbd376ae32f8713c68`.

Los diez snapshots se verifican individualmente en procesos consecutivos con sus propios manifiestos, artefactos y auxiliares conservados; `logs/historicos.log` identifica cada hash de datos. Ninguna sustitución por el inventario actual. El artefacto vigente es `29fb5e311f33982395227b15f2e08705e2943bf5ea21409702f48dd8ba4e613c`. La puerta histórica no exige que una versión antigua coincida con las fuentes actuales. Tampoco ejecuta versiones antiguas de sus verificadores: la comprobación usa el lector actual sobre bytes históricos.

Objeción experta: incluir verificadores en una lista no autentica al ejecutor ni impide que alguien sustituya simultáneamente el programa que verifica y su raíz de confianza. Motivo: esta puerta detecta desajustes contra un snapshot admitido dentro de un checkout confiable. Coste: confianza editorial externa y control del integrador siguen siendo necesarios. La receta no fija un entorno de render ni incluye `ficha.tsx` o las rutas Next; no debe anunciarse como reproducción byte a byte del HTML histórico. No se reconstruyó el oracle ni se probó empaquetado de producción.

## Modos y exactitud acotada

`casos/modos.mjs.txt` ejecuta 18 combinaciones: 2018/2025/2026 × 45.000/60.000/400.000 € × canónico/compatible. Compara perfil con adaptador y anual, comprueba modo de origen y naturaleza de conciliación, compara la SS del desglose con el anual y verifica la segunda resta de SS precisa en el neto. Nueve llamadas adicionales sin modo coinciden con compatible-legacy. Estas comparaciones entre capas son pruebas de propagación, no un oracle aritmético independiente.

Ancla externa exigida por el encargo para 2018/60.000: canónico SS 287.508 céntimos, IRPF preciso 15.043,2192345 €, neto 4.208.170 céntimos; compatible SS 285.841 céntimos. Los valores se afirman explícitamente en el instrumento. La resta precisa canónica usa 2.875,08315 €, antes del redondeo final. No se alteró la expectativa para conseguir coincidencia. En salarios altos el límite puede igualar el IRPF final de ambos modos mientras SS y neto difieren: por eso se comprueban ambos campos, no solo IRPF.

Objeción experta: que las capas coincidan no prueba vigencia ni elegibilidad TGSS. Motivo: EMI-01 era pérdida del modo y mezcla de cotizaciones, y esas dos rutas están verificadas. Coste: conservar los dos perfiles, la hipótesis de doce mensualidades uniformes y la revisión fiscal pendiente. No se extiende a nómina mensual, todos los perfiles familiares ni al cierre legal de 2026.

## Rutas, privacidad y validación

Lectura de almacén, schema, ficha, rastro y GET: IDs/hashes validados, lista local de snapshots, sin descarga remota por entrada del cliente; el enlace transporta snapshot/identidad/revisión, sin salario. La ruta devuelve 404 para referencia desconocida, 503 para contenido prometido ausente, HTML escapado por React, CSP restrictiva y Referrer-Policy no-referrer en éxito. La suite de contenido prueba la ruta directamente. Son propiedades locales, no una auditoría de Analytics/CDN/logs del host. Las inyecciones sintéticas de Cookie, Authorization, Set-Cookie y ruta local en el payload se rechazan antes del hash. No se publican cabeceras reales, notas privadas ni casos personales. El filtro textual no garantiza detectar todo secreto imaginable.

Nix para Bun/Node; node_modules enlazado solo para lectura. Se consultaron effect-solutions list/show basics/testing y fuente local Effect v4. Todos los trabajos amplios se serializaron con `/tmp/irobopf-validacion-pesada.lock`, un worker, comprobando memoria. Sin Next build, browser, suites legacy pesadas, descargas ni reconstrucción de inventario. No se editó código mantenido y no se presenta lint/typecheck global del padre como ejecución propia. Los instrumentos .mjs.txt son reproducciones conservadas con hashes, no una vía para introducir producto sin lint. Las 16 reglas siguen configuradas a error.

## Dimensiones de confianza

- Integridad: favorable para las correcciones técnicas y casos descritos; no autenticación del emisor.
- Autenticidad: no se revalidan PAdES, CSV ni confianza histórica. Hashes identifican bytes.
- Interpretación: conceptos y reglas siguen candidatos; residuo CMV2-01 de interpretación del procedimiento visible.
- Exactitud: propagación y ancla 2018 verificadas, sin certificación de una liquidación completa ni oracle reconstruido.
- Aceptación: recomendación al padre para cerrar los defectos técnicos acotados y corregir CMV2-01. Payload Madrid `3c7ac6d902081f1d7d2cb28cc556ffbef9bcac5ae8303f9c6cbbef291983c88e` sigue pendiente; ninguna atestación nueva ni migración de aceptación.

Reproducción: copiar los instrumentos de `casos` a `.cache/revision-contenido-modo-v2/` quitando `.txt`, desde raíz ejecutar Bun con Nix y el lock común; `historicos.sh.txt` lanza un proceso por snapshot. Ejecutar sondeos antes de cierre, que utiliza su CAS scratch. Los logs conservan los resultados reales. El manifiesto cubre entregables salvo sí mismo y fuentes examinadas; no se entrega parche porque no hay fixes.

Resultados finales de suites propias: 20/20 pruebas en contenido-integridad, rastro-anual y cotizaciones-perfil-uniforme; 15/15 en contenido con su configuración específica; diez snapshots verificados. La ausencia física del auxiliar también se rechaza. Los sondeos propios, las 18 combinaciones de modo y los recuentos de suites no se suman como reglas fiscales cubiertas.
