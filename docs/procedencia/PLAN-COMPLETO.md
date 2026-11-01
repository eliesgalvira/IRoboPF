# Alcance completo: datos, cálculo y contraste oficial

Este plan amplía el encargo de las 351 deducciones de 2025. Se mantienen sus correcciones y revisiones en curso. Después del cierre técnico anterior de 65 sitios, también quedan encargadas las 19 familias de actividad y la declaración como un todo. El trabajo termina cuando estén resueltos todos los bloques; los informes parciales sirven para comunicar resultados, no como nuevas peticiones de autorización.

El orden de inicio es A, B, C, D, E y F, aprovechando el trabajo paralelo que permitan las dependencias. El [estado](ESTADO.md) registra la ejecución y los resultados. Las conclusiones anteriores conservan su alcance y sus versiones de código.

## A. Procedencia automática de todos los datos de 2012–2026

Se censan los valores de `lib/dominio/normativa/datos/` por símbolo, propiedad, ejercicio, territorio, unidad y periodo de vigencia. Se reutiliza el inventario existente, distinguiendo valores fiscales de índices, páginas y otras constantes técnicas. Los aliases y valores derivados conservan su origen; no se inflan los recuentos contando varias veces la misma comprobación.

Se recuperan los manuales prácticos AEAT de cada ejercicio y las fuentes oficiales correspondientes de retenciones, TGSS e INE. El corpus previo se reutiliza por hash. La extracción programática conserva tabla, fila, columna, página y posición; normaliza separadores, unidades, límites abiertos y porcentajes sin perder el texto de origen. El programa compara cada valor con el motor y genera los enlaces documentales.

Las coincidencias se comprueban automáticamente. La revisión manual se concentra en las diferencias, contra la norma original del BOE o del boletín autonómico. Una extracción ausente o ambigua se identifica como tal; no se completa por semejanza con otro año. La revisión independiente comprueba el extractor, los enlaces y los casos discriminantes, sin repetir a mano todas las tablas coincidentes.

Cada resultado identifica el documento y la evidencia por hash, la ubicación, el valor extraído, el valor del motor y el dictamen. Los valores derivados indican sus entradas y operación. El cierre requiere conciliación con el censo completo, sin omisiones silenciosas, y un balance por ejercicio, territorio y dominio. Las deducciones de 2025 aprovechan su auditoría en curso.

## B. Comunidades reales en 2026

Se incorporan escalas, mínimos y deducciones autonómicas publicados y aplicables a 2026, con evidencia de sus efectos temporales. Una norma anterior puede seguir vigente si se acredita; copiar los valores de 2025 sin esa comprobación no sirve.

El resolver debe distinguir los datos respaldados de los pendientes por publicar o verificar. Un conjunto incompleto no se presenta como una liquidación completa ni se sustituye por el escenario estatal simulado. Las pruebas cubren selección real por comunidad, fechas y rechazo de lo que falte. El catálogo de fichas mantiene su forma pública.

## C. Miles de comparaciones con herramientas oficiales

Se generan miles de casos sintéticos distintos, con semilla reproducible, dentro del perfil que admite el motor. Además del muestreo aleatorio se ejercen fronteras y redondeos. Se comparan las casillas disponibles de Renta WEB Open 2025 con las del motor, identificando la versión de ambos y separando valores ausentes de ceros. No se tolera un céntimo de diferencia para ocultar un desacuerdo.

Se aprovechan las ejecuciones oficiales ya conservadas para validar el mecanismo de comparación. Si el cálculo oficial puede ejecutarse localmente con sus propios componentes públicos, se comprueba que reproduce la herramienta antes de usarlo como referencia masiva. Si requiere acceso remoto, la ejecución será acotada, reanudable y sin solicitudes simultáneas descontroladas. Se usan exclusivamente datos ficticios y simulación, sin presentar declaraciones ni utilizar cuentas tributarias.

Se investiga la disponibilidad real de Renta WEB o PADRE de ejercicios anteriores. Para las versiones recuperables y perfiles soportados se repite la comparación. Las versiones que no puedan ejecutarse quedan identificadas con las actuaciones realizadas; una reconstrucción propia no se hace pasar por el simulador oficial. Solo las discrepancias requieren investigación individual.

## D. Redondeo observado en cotizaciones

Se buscan casos discriminantes en las especificaciones del Sistema de Liquidación Directa, Boletines RED, simuladores de Seguridad Social y calculadora de retenciones AEAT. Se distinguen base, concepto, total mensual y suma anual; también los empates y ajustes. La herramienta AEAT no se trata por sí sola como una liquidación TGSS.

La política elegida se documenta como **«comportamiento observado en herramienta oficial»**, con versión, entradas, salidas, límites y pruebas. No se presenta como una obligación normativa que no se haya acreditado. Con esa evidencia se corrige el cálculo cuando proceda y se actualizan CX-01 y CX-03. Si dos herramientas difieren, se conserva la diferencia y se delimita cuál corresponde al cálculo soportado.

## E. Una sola ruta de mínimos familiares

Se localizan todos los consumidores de `FamiliarFiscal` y se conectan con `DerechosMinimos`, o se rechazan expresamente los casos cuyo reparto no pueda representarse. No permanece accesible una función que entregue a cada progenitor el mínimo entero cuando el derecho debe repartirse.

La lógica se extiende a los ejercicios y comunidades soportados utilizando los datos y condiciones territoriales contrastados. Las pruebas distinguen titulares, convivencia, rentas, edades, discapacidad y especialidades que alteren el derecho. Los ejemplos históricos erróneos se conservan por commit y evidencia externa, sin exigir mantener el error en el código ejecutable. Los cambios de comportamiento y compatibilidad se documentan para el rediseño.

## F. Actividad y declaración completa

Primero se completan las 19 familias de actividad y el productor que bloquea `anual.explicito.actividad.etapa`. Se reutilizan las verticales, pruebas y contratos existentes, corrigiendo sus límites cuando se amplíe el perfil admitido.

Después se completa la composición entre programas, la admisión de entradas y las puertas correspondientes. Los cierres locales anteriores no bastan por sí solos: se comprueba el recorrido completo y la propagación de errores, rechazos, importes y procedencia. Las puertas solo se habilitan cuando sus condiciones estén demostradas. La parte visual continúa en el trabajo separado de rediseño; este encargo prepara el motor y sus contratos, sin desplegarlo.

## Dependencias y revisión

| Trabajo | Puede avanzar en paralelo | Integración que debe esperar |
| --- | --- | --- |
| Deducciones 2025 | Lotes territoriales, fuentes y revisiones independientes | Cambios compartidos del auxiliar y contrato, coordinados por el integrador |
| A | Adquisición y extracción por dominio y ejercicio | Contrato común de evidencia, censo y conciliación global |
| B | Búsqueda de publicaciones 2026 mientras A procesa otros ejercicios | Incorporación al resolver con evidencias y pruebas de cada territorio |
| C | Localización de programas y preparación del comparador | Fijar versiones del motor; repetir los casos afectados tras correcciones |
| D | Investigación y experimentos oficiales | Integrar una política sin competir con otros cambios en cotizaciones |
| E | Censo de consumidores y pruebas de reparto | Usar datos de mínimos contrastados y coordinar la API compartida |
| F | Familias independientes una vez iniciados los bloques anteriores | Composición, admisión y puertas después de sus productores y contratos |

Cada implementación tiene revisión independiente con `gpt-6.1-sol` y esfuerzo `high`. Una revisión favorable no se repite sin cambios materiales o un defecto nuevo reproducido. Los defectos se conservan como pruebas, se corrigen y se recontrastan con alcance preciso. Los recuentos técnicos no sustituyen comprobaciones pendientes.

## Conservación, compatibilidad y entrega

Solo se añaden commits a `procedencia-documental`; no se reescribe historia ni se modifica `main`. Los previews permanecen desactivados. No hay PR, despliegue, LFS, gasto ni envíos a terceros. No se publican datos personales ni identificadores del sistema. Nunca se utiliza `rm` con rutas relativas y no se autoriza limpieza de respaldos.

Los originales y los artefactos voluminosos de extracción, simulación y evidencia se conservan en el almacén externo por hash. Git contiene código, pruebas, informes, índices y manifiestos que permiten verificarlos; no vuelve a alojar el almacén documental. Se conservan las referencias y herramientas de restauración. Los archivos privados de transporte y los logs no se incorporan al repositorio público.

Se mantienen compatibles las fichas y la interfaz pública del motor. Cualquier cambio necesario de firma, entrada, resultado o rechazo se describe en un fichero de cambios para el rediseño, con ejemplos de migración. No se altera el diseño de la interfaz.

Al terminar las deducciones y cada bloque se entrega un informe breve con cobertura, valores que coinciden, difieren o no se pudieron verificar, errores corregidos y decisiones que realmente requieran intervención. Se distinguen datos pendientes de publicación, limitaciones demostradas y trabajo interno pendiente. La falta de evidencia no se resuelve inventando valores, resultados oficiales ni aceptaciones.
