# Revisión independiente de incorporación local R36

Dictamen candidato sujeto al contraste del padre. Se revisa la fidelidad de la operación local a las decisiones entregadas, la corrección pequeña del preparador y los tres localizadores SS, las tres guardas de tipos y el resultado publicado. No se repite la auditoría jurídica del lote ni se acepta una regla completa. Los resultados ejecutados y su estado terminal se detallan en RESULTADOS.md y casos.json.

Trabajo personal en T3 Code, harness Codex, gpt-6.1-sol con esfuerzo high. Priority solicitada, sin medición independiente del scheduler. Sin subdelegación ni atestación candidata; no se inventan identificadores de tarea. Solo se escribe en este directorio y .cache/revision-incorporacion-local-r36. No hay fix de producto, cambios de esperados, confianza, registros activos, rastro, snapshots, motor, inventario, VCS mutante, rediseño, servidor, preview, transferencia o publicación remota.

Se han leído íntegros BRIEF, AGENTS, contrato y coordinación, además de la situación R36 y decisiones vigentes, la revisión R34, recepción R36, aprobación, autoridad, planes, recibos, recuperación, OPERACION, preparador y transicion.py. Las instrucciones específicas actuales sustituyen el modelo, delegación, escritura de ESTADO/DECISIONES y limpieza del BRIEF. No se leen entregas de hijos activos. El padre solo se consulta como fuente de dependencias instaladas de lectura y originales ya entregados de V5; no se escribe en su CAS ni en el paquete.

## Derivación y autoridad

El preparador usa los dos previos históricos con hashes explícitos. Deriva las entradas desde las aprobaciones individuales y el registro T3 original preservado, conserva las grafías exactas de las dos identidades y comprueba la correspondencia de payload, atestación, ámbito, inventario e informe. La modificación pequeña permite derivar desde ambos extremos operativos exactos; los pares mixtos deben recuperarse aparte. No introduce un estado agregado que admita cualquier combinación conocida.

El contraste por enlace coteja las 78 decisiones estatales y 186 autonómicas con itemId, source, citation, document, executableScope, inventory y scope literales. Mantiene autor distinto del revisor. La aprobación local del padre fija plan y autoridad por hash y nombra las identidades exactas. Los campos operationalApproval=false de la derivación de identidad y trustMutation=false del plan candidato son metadatos históricos de propuesta: la autorización operativa posterior vive en aprobacion-local.json. No deben interpretarse como que los registros activos nunca cambiaron.

Se contrasta el registro operativo con los bytes after aprobados y se exige que su primera entrada sea exactamente la entrada histórica anterior: Madrid2020 con atestación null y payload e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258. La decisión nominal posterior no sustituye ese binding ni transmite selección temporal. Los 264 pares conservan sus condiciones; no se deduplica por sujeto para aceptar un año por otro.

## Recuperación serial

transicion.py hace preflight de ambos archivos y del plan antes del diario. Escribe el diario con extremos completos y sus hashes antes del primer reemplazo. Cada reemplazo sincroniza temporal y directorio. Vuelve a comprobar el estado y la ruta antes de escribir, y verifica hashes finales antes de marcar complete. El llamante debe cotejar el plan aprobado y adquirir flock: la función no hace esas dos tareas por sí misma.

Los ensayos propios importan la función real. Inyectan EIO tras cada uno de los ocho fsync alcanzados, tanto al completar como al revertir, y tras las dos escrituras. Conservan cada estado observado y ensayan recuperación a ambos extremos e idempotencia. Los fallos del fsync de temporal pueden dejar un temporal sobrante; se conserva en scratch. Los fallos posteriores al replace pueden dejar bytes nuevos aunque la llamada haya fallado. Un diario complete no sustituye la lectura de los archivos cuando el último fsync devuelve error.

Para publicación, el plan conserva snapshots.json y rastro-generado.json por ambos extremos. La receta aplica índice antes del rastro y revierte rastro antes del índice; se ensaya por separado sobre copias con los cuatro fsync de los dos reemplazos y preflight de hashes conocidos. Este ensayo implementa la receta escrita utilizando durable_replace importado; no es una API de recuperación de publicación que ya existiera. No elimina objetos o snapshots históricos. La autorización acotada de transicion.py para registro/revisores no se amplía para admitir esos otros archivos.

Estos controles caracterizan Linux local y fallos de IO inyectados. No prueban apagón físico, persistencia universal del árbol de directorios, atomicidad entre dos archivos ni exclusión frente a escritores que ignoren flock. El lector concurrente puede observar estados intermedios. La receta exige detener escritores y no constituye distribución en caliente ni activación de servicio. No hay una incoherencia demostrada por el mero hecho de que el estado intermedio sea visible: ese límite ya está declarado.

## Publicación y restauración

La proyección scratch es una copia ordinaria, sin crear un checkout. Se restaura desde originales-locales.json y objetos-publicos-excluidos.json: pin del manifiesto V5 r2, SHA256, SHA512 y tamaño de los 22 originales/facsímiles; copia propia sin hardlinks, sin escribir en V5. Los originales y el CAS propio quedan fuera de docs. originales.json conserva ambas huellas y referencias saneadas de preservación. El corte V5 permanece R26 y no se reexporta.

El instrumento GET recibido se adapta únicamente en imports, raíz CAS y rutas de entrada/salida. Se conservan el texto de origen por referencia, la copia ejecutada y su diff. Importa las rutas reales de fichas y objetos y verifica HTML, presencia de cada payload, aceptación completa false, MIME, bytes y hashes. La proyección permite el directorio implícito del GET sin escribir rutas fuera del ámbito. La lectura completa por objeto sigue siendo un coste real; la medición de maxRSS es del proceso Bun, no de concurrencia o del servicio.

El snapshot esperado es d758a1f8ac67587d2eae689da158ac8baa28b03df16c462069f4014d4af588a1. El cotejo exige sus bytes bajo ese hash, los 264 payloads limitados más Madrid pending, 103 sujetos, 22 objetos públicos y los 36 enlaces al original BOE grande de 42.900.459 bytes. Los 44 IDs históricos quedan incluidos exactamente; el verificador real examina los 45 con sus propios datos. Los extremos del plan de publicación coinciden con índice y rastro presentes, cuyo catálogo conserva 65 sitios. Esos recuentos delimitan lo examinado, sin acreditar suficiencia causal o fiscal.

El primer intento falló por colisión editorial sobre v2. Su log y entrada permanecen intactos. El origen v1 del reintento conserva las mismas versiones de inventario/software; elegirlo evita superponer otra vez las entidades documentales. No se relaja el rechazo ni se promueve nominal. No se repite la generación pesada: resultado, verificadores reales y adversos nuevos bastan para el alcance operativo pedido.

Los adversos de GET se limitan a scratch: CAS explícito inexistente, configuración CAS ausente, snapshot desconocido y corrupción de un objeto público, seguida de restauración exacta. No son pruebas de hosting. El CAS padre sigue solo lectura; la copia operativa no se presenta como copia remota o custodia independiente. Crossa conserva v1 desfasado, mismo dueño/casa; no se escribe allí.

## Cambios pequeños del padre

Los tres localizadores SS sustituyen coincidencia global por búsqueda literal dentro de la declaración concreta. La semilla se atribuye a sumarRendimientosTrabajo y las bandas legacy a calcularTotalSolidaridad, con los literales 0, "0.10" y "0.50" respectivamente. Se cotejan los ancestros AST y rangos reales; los rojos previos del padre permanecen conservados. No cambian constantes o fórmulas fiscales. Este arreglo de origen no demuestra suficiencia de once cierres, unidades, condiciones o transportes: los ocho rojos semánticos recibidos y el noveno de semilla del revisor no se vuelven verdes por esta revisión.

Las tres guardas del test R34 pasan de truthiness a comparación explícita con undefined en resultados de find. No cambian entradas ni esperados; documentan el estrechamiento que exige el chequeo de tipos. El resto de retenciones y admisión sigue fuera de esta revisión operativa y conserva sus revisiones pendientes. No se atribuye a checkJs=false un tipado de cuerpos MJS.

## Conservación y decisiones

El cotejo físico inicial termina antes de editar: HEAD 50f9e949544e20d3e4e0bffc79b926d396267319, 20.227 entradas idénticas por lstat, readlink, bytes y ejecutabilidad; un blob a la vez, diff vacío y ninguna alta. El control final repite todo, enumera extras propios y rechaza cambios fuera de ámbito y borrados. No se modifica ningún archivo de base: sus hashes anteriores están en los controles completos. Cada alta propia tiene baseSha256=null. No se confía solo en el índice.

Las decisiones, objeciones expertas, respuestas y costes están en decisiones.json. El manifiesto cubre archivos de contenido; patch y binarios son sobres de transporte separados para evitar autorreferencia. El ensayo reconstruye los archivos en un directorio ordinario scratch y coteja sus bytes. Los controles/logs mayores de 1 MB se comprimen. No se incluyen PDFs, entornos, node_modules o copias de aplicación en docs.

Las conclusiones nuevas requieren contraste del padre. Esta revisión no cierra el encargo global, la composición de los 65 sitios, la vigencia jurídica completa, autenticidad histórica o hechos del contribuyente. No se emite aceptación fiscal por pruebas, hashes, fórmulas repetidas ni recuentos.
