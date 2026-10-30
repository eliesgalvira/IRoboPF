# Rastro anual y fichas versionadas

Cada punto propio de la liquidación anual llama a `crearLineaCalculo` con un `siteId` literal y una instancia explícita. Se conserva el decimal antes de formatearlo, separado de la cadena que ve el lector. Los bucles de tramos aportan su índice; una instancia repetida es un error. La liquidación guarda año, territorio y perfil de cálculo en el rastro, sin incorporarlos a una URL junto a los importes.

`rastro-extraer.mjs` lee esos puntos por AST. No interpreta etiquetas ni busca fórmulas por parecido. Exige contrato literal, unidad conocida e identificador único; coteja el hash de cada fuente con el inventario. El generador crea una ficha Step propia por punto, conserva la fuente y el catálogo en el CAS e incorpora sus hashes al snapshot. La ficha representa la expresión técnica y mantiene pendientes la derivación completa, las condiciones jurídicas y las citas que aún no están enlazadas.

`rastro-generado.json` es un índice pequeño, apto para el cálculo local. No contiene casos, importes personales ni originales PDF. La capa de procedencia lo aplica al producir el resultado y añade snapshot, versión de algoritmo/datos/explicación, referencia exacta y ruta de la ficha. Rechaza intentar versionar de nuevo un rastro que ya contiene enlaces. El texto existente de cada línea abre esa ruta; no hay rediseño ni envío de entradas fiscales a un servidor.

La función de enlace es una frontera interna de confianza del programa: no autentica resultados aportados por terceros ni demuestra por sí misma que una cifra externa se haya calculado. El catálogo compilado debe pasar la comprobación de fuentes e inventario antes de publicar una versión. No se afirma atomicidad frente a edición concurrente del checkout, identidad criptográfica de un ejecutor ni aceptación fiscal.

## Comprobaciones

`bun scripts/procedencia/rastro-verificar.mjs` coteja el índice compilado, su objeto conservado, el snapshot, el inventario actual, cada punto de código y cada ficha resuelta. La CI lo ejecuta. Los tests prueban cambios de etiqueta sin cambiar identidad, rechazo de instancias/unidades incompatibles, decimal anterior al formato, conservación de versión, puntos dinámicos/duplicados y resolución de todas las líneas de un cálculo anual real.

El orden de reconstrucción es inventario, contenido y verificación de rastro. Después se verifica el contenido completo y las pruebas. No se regenera un inventario al leer una página. Cada snapshot histórico conserva sus propios bytes; los cambios no sustituyen enlaces guardados.

## Límites abiertos

El corte inicial de esta instrumentación tenía 49 puntos propios, incluidos cuatro resúmenes de retención; el catálogo de la versión examinada determina su cobertura. En ese corte, las líneas internas del servicio de retenciones sin llamada al helper carecían de enlaces; no se infieren enlaces por semejanza. Los casos no soportados conservan sus motivos sin fabricar un importe ni una regla aceptada. Las fichas de cada punto no equivalen a las decenas de miles de ocurrencias del inventario: son identidades distintas y se cuentan por separado.

Se corrigieron textos heredados que omitían las ganancias de la base general, confundían el ahorro con todas las ganancias o describían 2018 con un solo tope anual. Los importes de esas etapas no cambian por la instrumentación. El corte inicial declaró límites en alquiler, compensaciones, vigencia y reglas completas; la instrumentación no acredita su resolución. La instrumentación requiere contrarrevisión independiente del contenido exacto que se publique.
