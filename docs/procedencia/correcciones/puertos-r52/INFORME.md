# Correcciones de serialización y contratos de puertos

El contraste de integración corrobora los tres hallazgos con su alcance limitado y corrige la serialización y las propiedades documentales. Los cinco rojos independientes se reprodujeron antes del cambio y pasan después. Las correcciones son candidatas para una revisión nueva; no aceptan fiscalidad ni completan el grafo transitivo o la admisión.

Los originales de revisión permanecen intactos. Las copias para ejecutar los rojos solo adaptan imports a la integración y fijan los serializadores anteriores para el control histórico. No se modifica su aserción para hacerla pasar. El arnés legacy del revisor era privado; esa condición se conserva, sin convertirlo en oracle fiscal.

## Hallazgos y cambios

**R51-N01.** La guardia admitía registros sin prototipo y el serializador de escalas los pasaba a `String`, que lanzaba TypeError. El control legacy reproduce la limitación anterior; no se atribuye al router una regresión fiscal no demostrada. Se conservan ahora sus propiedades propias enumerables como en un registro ordinario.

**R51-N02.** Una lectura global de un registro sin prototipo funcionaba sin observador y fallaba con un hook inocuo. Es una regresión de observabilidad reproducida en un arnés privado; el proveedor actual de mínimos no entrega necesariamente ese objeto. Se corrige igualmente el serializador de rentas. Las cadenas se reconocen con `Schema.is(Schema.String)`, sin coerción de objetos ni desactivar anti-slop. Arrays y Decimal auténticos conservan sus representaciones anteriores.

**R51-N03.** El código consumidor lee propiedades que no figuraban en el contrato. Se añaden en los catálogos de origen y en sus variantes:

- Trabajo disponible: `gastos.gastosAE` y `gastos.generalesAplicados`, ambas `EUR-string`.
- Actividad disponible: `etapas[].importe` como `EUR-string`, y `reglaId`, `id`, `formula` como texto. Los testigos conservan el orden de la colección.
- Parámetros autonómicos: `_tag` discreto y `motivo` textual. La variante soportada conserva escalas y mínimo; la no soportada solo declara discriminante y motivo. No se atribuyen propiedades de éxito a un rechazo.

Se modifican cinco archivos de procedencia y se incorpora `tests/puertos-r52.test.ts`; `cambios.json` y el diff fijan el alcance. El código fiscal de `lib/` permanece intacto. Los artefactos actuales se escriben en esta carpeta, sin sustituir contratos o candidatos históricos. El verificador de puertos comprueba correspondencia con el productor; esa reconstrucción no sustituye revisión semántica.

## Pruebas y límites

`rojos-antes.json` conserva cinco fallos y `rojos-despues.json` cinco pases de las mismas aserciones. El control legacy de N01 importa los dos serializadores anteriores congelados: su TypeError sigue esperado y no se oculta al ejecutar el consumidor corregido.

El primer pase amplio obtiene 124 pruebas correctas: las 118 anteriores más seis grupos nuevos. Tipos principal/vendor pasan. Oxlint rechaza dos `typeof` añadidos inicialmente; se conserva el diagnóstico del intento. Se corrigen con el guard de schema y se ejecuta un pase final de los grupos afectados, los cinco rojos, tipos y lint. El pase final obtiene 50 pruebas correctas, incluidos los cinco rojos y los seis grupos nuevos; tipos principal/vendor, Oxlint global y ESLint global terminan con salida 0. Los recuentos solapados no se suman como cobertura nueva.

Los seis grupos nuevos comprueban registros anidados y Decimal, valores de ambos gastos en el testigo, los cuatro campos de cada etapa frente al adaptador real, discriminante soportado sin motivo, sustracción de cada campo/condición y rechazo autonómico. Este último altera privadamente el literal de año a 2030 para alcanzar la rama no soportada: demuestra selección del testigo, no una entrada pública admitida ni cálculo fiscal de 2030. El constructor público sigue rechazando IR alterada.

Comandos y configuraciones: `validar-primer-pase.py.txt`, `validar-final.py.txt`, `validacion.json`, `validacion-final.json`, logs y JSON de resultados. Preparador R47 en scratch de integración; caché de Vitest propia, carga nativa, un trabajador y lock por validación. No build ni suites legacy pesadas. `artefactos.ts.txt` regenera y compara las operaciones con el candidato anterior; solo permite cambios de `outputs` documentales en fronteras de escalas. `schema.py.txt` comprueba los schemas de fragmentos con Draft 2020-12; el contrato draft 7 usa su verificador propio. Resultados en `artefactos.json` y `schemas.json`: 22 puertos, 24 asociaciones y 393 comprobaciones estructurales; ambos schemas 2020-12 correctos con jsonschema 4.26.0. Solo cambian los outputs de dos nodos de frontera de escalas en los programas; operaciones, fuentes fiscales y argumentos permanecen idénticos. SHA-256 de serialización compacta: composición `a45efc9cda12a3e574f9bc7c87237d28524e33c855a0e5edd72653d690c43e0a`, contrato `027189a7570510bf7819870e0bfb0e8e21eb6df1b59af914d8bacd16dd1a3f96`. La validación de schemas se ejecutó separadamente con `uv run --no-project --with jsonschema`, caché propia; `artefactos.log` conserva el estado emitido antes de esa comprobación externa.

## Decisiones y costes

1. Conservar el dominio anunciado de registros sin prototipo. Objeción: sería más sencillo rechazarlos. Respuesta: la guardia los admitía y el defecto está en el registro de valores; no hay razón demostrada para retirarlos del dominio. Coste: serialización recursiva explícita de propiedades enumerables. Se mantienen las exclusiones de ciclos, proxies y objetos hostiles; no se generaliza la garantía.
2. Completar contratos de origen, variantes y testigos. Objeción: conservar el objeto entero parecía suficiente porque los importes coincidían. Respuesta: el encargo exige propiedades, unidades y condiciones comprobables, incluidas las usadas en las líneas explicativas. Coste: mantener los catálogos y sus pruebas de sustracción; la metadata no se presenta como un proveedor financiero ni como prueba transitiva completa.
3. Usar una revisión independiente nueva de los cambios. Objeción: repetir todo el dictamen favorable de conexiones desperdiciaría trabajo. Respuesta: limitar la revisión a N01/N02/N03 y los tres puertos afectados, comprobando si bastan para el hito acotado. Coste: revisión antes de avanzar al grafo de 65 sitios y 19 instancias. Los resultados del codec y R45 no se reabren sin regresión demostrada.

`decisiones.json` registra el dictamen por ID. Las cuatro puertas de admisión, cierre de sitio, publicación y aceptación fiscal permanecen falsas.
