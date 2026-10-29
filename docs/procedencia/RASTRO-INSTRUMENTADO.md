# Rastro anual y fichas versionadas

Cada punto propio de la liquidación anual llama a `crearLineaCalculo` con un `siteId` literal y una instancia explícita. Se conserva el decimal antes de formatearlo, separado de la cadena que ve el lector. Los bucles de tramos aportan su índice; una instancia repetida es un error. La liquidación guarda año, territorio y perfil de cálculo en el rastro, sin incorporarlos a una URL junto a los importes.

`rastro-extraer.mjs` lee esos puntos por AST. No interpreta etiquetas ni busca fórmulas por parecido. Exige contrato literal, unidad conocida e identificador único; coteja el hash de cada fuente con el inventario. El generador crea una ficha Step propia por punto, conserva la fuente y el catálogo en el CAS e incorpora sus hashes al snapshot. La ficha representa la expresión técnica y mantiene pendientes la derivación completa, las condiciones jurídicas y las citas que aún no están enlazadas.

`rastro-generado.json` es un índice pequeño, apto para el cálculo local. No contiene casos, importes personales ni originales PDF. La capa de procedencia lo aplica al producir el resultado y añade snapshot, versión de algoritmo/datos/explicación, referencia exacta y ruta de la ficha. Rechaza intentar versionar de nuevo un rastro que ya contiene enlaces. El texto existente de cada línea abre esa ruta; no hay rediseño ni envío de entradas fiscales a un servidor.

La función de enlace es una frontera interna de confianza del programa: no autentica resultados aportados por terceros ni demuestra por sí misma que una cifra externa se haya calculado. El catálogo compilado debe pasar la comprobación de fuentes e inventario antes de publicar una versión. No se afirma atomicidad frente a edición concurrente del checkout, identidad criptográfica de un ejecutor ni aceptación fiscal.

## Comprobaciones

`bun scripts/procedencia/rastro-verificar.mjs` coteja el índice compilado, su objeto conservado, el snapshot, el inventario actual, cada punto de código y cada ficha resuelta. La CI lo ejecuta. Los tests prueban cambios de etiqueta sin cambiar identidad, rechazo de instancias/unidades incompatibles, decimal anterior al formato, conservación de versión, puntos dinámicos/duplicados y resolución de todas las líneas de un cálculo anual real.

El orden de reconstrucción es inventario, contenido y verificación de rastro. Después se verifica el contenido completo y las pruebas. No se regenera un inventario al leer una página. Cada snapshot histórico conserva sus propios bytes; los cambios no sustituyen enlaces guardados.

La primera comprobación del catálogo detectó una diferencia de orden de propiedades entre generador y decoder. Se corrigió la serialización; no se relajó el hash. Se conservaron los snapshots de ensayo como versiones técnicas sin aceptación jurídica. Los logs de la comprobación satisfactoria quedan en la carpeta de esta implementación.

## Límites abiertos

Hay 49 puntos propios instrumentados, incluidos cuatro resúmenes de retención. Las líneas internas del servicio de retenciones que todavía no llaman al helper quedan pendientes, sin enlaces inferidos. Los casos no soportados conservan sus motivos sin fabricar un importe ni una regla aceptada. Las fichas de cada punto no equivalen a las decenas de miles de ocurrencias del inventario: son identidades distintas y se cuentan por separado.

Se corrigieron textos heredados que omitían las ganancias de la base general, confundían el ahorro con todas las ganancias o describían 2018 con un solo tope anual. Los importes de esas etapas no cambian por la instrumentación. El alquiler continúa simplificado; el cierre de compensaciones, vigencia y reglas completas sigue abierto. Se requiere contrarrevisión nueva de la instrumentación integrada.
