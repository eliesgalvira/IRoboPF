# Recepción e integración candidata R30

Se reciben CAS local R27, revisión v5 R28, composición parcial R28 y contrato nominal R29. Los recibos fijan todos los archivos y sus hashes. El padre compara físicamente las bases completas de 15.730, 15.914, 15.914 y 16.106 entradas mediante lstat, readlink, bytes y ejecutabilidad, un blob por vez. Solo aparecen nueve modificaciones declaradas en CAS y cuatro en el contrato nominal; ningún borrado. Los otros dos autores no modifican entradas de base. La recepción copia 303 archivos y 28.277.076 bytes, incluidos sobres de transporte.

El primer intento de recepción detectó `preempaque.txt` fuera del manifiesto de composición y no copió nada. Es un instrumento de empaquetado, inspeccionado y registrado por hash en `recepcion.json`; permanece en el checkout del autor y se excluye de la integración. Los manifiestos originales no se retocan. La entrega nominal enumera 82 archivos de contenido y cuatro sobres adicionales: el recibo cuenta 86, sin confundir ambos conjuntos.

## CAS local externo

El candidato añade snapshot v3 con descriptores de originales PDF externos fijados por SHA256, SHA512, tamaño y MIME. El límite del almacén versionado permanece en diez millones de bytes. El CAS externo exige ruta absoluta explícita y limita cada original a cien millones; no hay búsqueda de red ni ubicación por defecto. El lector Linux fija descriptores de archivo y comprueba ancestros, symlinks, tamaño, hashes y cambios durante la lectura. Un objeto ausente, corrupto o no configurado no se sirve; no se usa una copia de caché válida en una petición anterior para ocultar la alteración.

El padre ha leído los nueve diffs y ejecutado el ensayo sintético. El autor documenta el recorrido real de 264 pares, 102 sujetos, GET de veinte objetos y los 36 enlaces del BOE grande. Es evidencia del autor, pendiente de una revisión independiente nueva del conjunto integrado. No se incorpora su registro de ensayo ni se promueve confianza activa. El BOE de 42.900.459 bytes ya está preservado fuera de T3 en v5 r2; el padre verifica ambos hashes y tamaño en `original-grande.json`. No se reexporta el paquete.

Decisión: admitir el mecanismo como candidato técnico local. Objeción experta: la lectura completa y síncrona consume memoria y bloquea el proceso; el límite por objeto no acredita capacidad de producción. Respuesta: mantener esa limitación explícita, medir el recorrido en la revisión y no desplegar. Coste: contrato Linux y almacenamiento externo que debe configurarse y restaurarse, además de revisión de rutas y durabilidad. Un error del fsync final puede dejar publicación visible de durabilidad indeterminada; no se promete rollback de un archivo ya publicado.

## Composición de dependencias

La entrega ejecutable cierra el valor de `anual.pagos.retenciones`; quedan 64 cierres de valor y toda la admisión pendientes. No cumple aún la composición de los 65 sitios ni habilita wiring público. El grafo recompuesto puede probar coherencia con su receta; no basta para probar que la receta explica todas las condiciones del motor.

La integración global descubre errores no cubiertos por la configuración local del autor: tipos implícitos y usos de plataforma/fecha en el test, y la función local `use` interpretada por ESLint como hook React. Se conservan los diagnósticos. El padre tipa y estrecha los nodos, usa la frontera IO existente y DateTime tras consultar Effect, y renombra ese callback a `connect`. No cambia los dieciséis esperados ni suprime reglas. La primera tanda termina con 58 pruebas correctas y una agotada por tiempo: cuatro reconstrucciones tardan 14,4 segundos frente al límite global de cinco. Se fija un límite local de treinta segundos solo para ese caso, conservando sus aserciones; el autor usaba 120 segundos en su configuración local. La nueva continuación se acota a diecisiete sitios de retenciones y cotizaciones, con entradas, retornos, unidades y condiciones explícitos; los demás seguirán pendientes hasta ser resueltos y revisados.

Objeción experta: resolver un compilador universal sería un alcance distinto, mientras etiquetar una llamada como terminal ocultaría sus dependencias. Respuesta: contratos concretos por función y propiedad con localizadores reales, fronteras y comparaciones discriminantes, separados de la aceptación jurídica. Coste: trabajo sustantivo por grupos y revisión posterior, sin una falsa cobertura global.

## Contrato nominal Madrid 2020

Se incorpora como candidato `reviewed-nominal-v1`, payload v3 y ámbito v2, con una decisión del padre fijada fuera del sobre. Conserva la ruta real de cuatro segmentos, año 2020, 53.407,20 de la ley y discordancia de 53.407,29 en el manual. La selección nominal rechaza cualquier contexto civil. El contrato antiguo y sus condiciones temporales no se relajan.

El padre lee los cambios de schema, lector Python y entrada Node. Repite siete pruebas Python, seis Node y el coordinador real sobre una vista scratch preparada con fuentes actuales: integridad y binding numérico verificados, revisión pendiente, autenticidad indeterminada y aceptación completa falsa. El informe y los logs del autor permanecen intactos; la preparación adaptada del padre escribe su propio recibo. No se activa el candidato ni se heredan atestaciones históricas.

La integración descubre que faltan seis dependencias del contrato nominal en la lista versionada de software de explicación: módulos Python/Node y cuatro schemas, incluido el payload. Se añaden pruebas que mutan cada archivo después de preparar un snapshot coherente. Con Bun test, las seis fallan por ausencia del rechazo esperado antes del arreglo. Se añaden las seis rutas a la lista literal y se conservan los snapshots anteriores; no se cambia la gramática del lector histórico. Los intentos previos con Node y con Bun sin test fallaron por resolución TS y lanzador, respectivamente: no cuentan como rojos del consumidor. La nueva regeneración conserva los dos snapshots intermedios y solo repite la verificación de esos dos; los 38 históricos ya estaban comprobados. Esta lista es un contrato de software explícito, no un analizador universal de dependencias transitivas.

Decisión: revisar el payload exacto y sus consumidores antes de permitir un estado nuevo. Objeción: un pin de contenido no demuestra vigencia ni independencia por sí mismo. Respuesta: conservar autoría, alcance nominal, cierre documental tipado y una revisión independiente nueva de originales, identidad y bytes. Coste: otro contrato mantenido; no habilita declaraciones ni otros años.

## Verificación y reservas

Los logs del padre distinguen intentos fallidos y repeticiones justificadas. La regeneración comprueba los históricos antes de añadir snapshots; mantiene el inventario y el motor, la entrada activa Madrid v1 pendiente, atestación nula y revisores vacíos. `regeneracion.json` identifica los IDs resultantes, sin promover el lote técnico completo ni el candidato nominal. Los resultados finales se registran en `validacion.json`.

CL01 y la revisión de preservación se disponen por separado en `correcciones/preservacion-r30/INFORME.md`. Los cortes v4/v5 permanecen congelados. Crossa sigue en v1 desfasado, copia local fuera de Victus, sin custodia independiente. No hay build, suites legacy masivas, main, PR, despliegue, LFS, gasto, transferencia externa ni limpieza. El encargo global permanece abierto.

El control previo al commit detecta los scratch R30 todavía visibles para Git. Se añaden cuatro exclusiones exactas a .gitignore para CAS sintético, fixture nominal, mutaciones de software y ensayos v5; los bytes permanecen en disco. No se excluyen fuentes ni entregas documentales, ni se borra ningún archivo. Los seis restos históricos siguen separados.
