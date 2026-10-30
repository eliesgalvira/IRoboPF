# Revisión independiente CAS local R30

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen técnico acotado: corroborado el recorrido local completo y los controles discriminantes ensayados. No se demuestra un defecto nuevo de producto; permanecen las reservas de durabilidad, concurrencia, custodia y plataforma. Las conclusiones quedan pendientes del contraste del padre y no aceptan fiscalidad.

Base examinada: `376fb100512ca6a2f975c3c9500a20ee375dd431`, 16.486 entradas. Las conclusiones son candidatas para contraste y no implican activación de confianza ni aceptación fiscal.

## Contratos y fuentes examinadas

Los nueve archivos de implementación conservan exactamente su SHA256 de entrega R27: `nueve.json` identifica cada ruta, hash anterior a implementación y hash actual. Se inspeccionan lector, descriptor Effect/schema, publicador, verificador, adaptador y ruta HTML; se contrasta su recepción mediante INFORME, validacion y regeneracion-final de R30. El límite interno sigue en 10.000.000; el externo admite exclusivamente originales PDF de más de ese tamaño hasta 100.000.000, con dos hashes, tamaño, MIME, clase y pertenencia documental. La entrada nominal sigue pendiente; sus módulos solo se copian sin modificar para ejecutar los consumidores actuales.

La autoridad editorial reside en snapshots.json y el pin solicitado, con bytes cotejados bajo ese pin. Un sobre coherente recalculado fuera de la lista no se convierte en autoridad. Escribir una lista nueva en scratch es una simulación explícita del integrador; no demuestra independencia jurídica. El lector no es un motor de autorización si un atacante puede editar la configuración editorial de confianza.

## Instrumentos independientes

`preparar`, `recorrido` e `historicos` se adaptan en scratch; sus diferencias se adjuntan. El preparador usa la fixture entregada del padre, verifica sus pins no software contra entrada R27, verifica cada original por ambos hashes/tamaño y sustituye los consumidores por las fuentes actuales del checkout. Las dependencias Python incorporadas por R30 se copian sin edición. El BOE grande se lee del objeto exacto preservado en v5 r2, cuyo manifiesto externo conserva el pin 2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88. No se reexporta el corte.

El cierre histórico comprimido se coteja con los dos pins de su descriptor. El cierre nuevo se contrasta por objetos comunes y por el original externo; su snapshot puede cambiar al incorporar el software actual. No se fuerza el hash del ensayo anterior. Las copias de originales y restauración viven solo en el scratch autorizado; las referencias saneadas permiten preservación futura, sin copiar PDF a Git.

Las contrapruebas IO son propias y ejecutan el módulo real mediante inyección en la frontera Node fs; no son una copia modificada del producto. Mutan bytes durante el primer bloque, sustituyen un ancestro, fuerzan escritura parcial y fsync de archivo/directorio, y contrastan publicación exclusiva/repetida y el techo previo a la reserva. Los ensayos HTTP llaman directamente a los consumidores: sin servidor ni preview. Una función fetch que cuenta y falla hace observable un fallback durante esos casos.

## Decisiones, objeciones y costes

1. Rehacer el lote completo una vez con consumidores actuales. Objeción experta: repetir el informe del autor solo confirma sus supuestos. Respuesta: reconstrucción local fijada, contrapruebas propias y distinción entre receta heredada y expectativas nuevas. Coste: espacio para copias ordinarias y varios minutos de CPU/IO; no es una prueba de carga ni una revisión del contenido fiscal de los 264 enlaces.
2. Separar visibilidad y durabilidad. Objeción: una excepción tras publicar no revierte un enlace ya visible. Respuesta: el fallo fsync de archivo no publica; el fallo de directorio después de link deja bytes visibles y error, con durabilidad indeterminada. El rename del registro tiene la misma reserva por inspección. Coste: recuperación operativa explícita y posibles huérfanos; no se promete rollback ni se simula un apagón real.
3. Corroborar integridad sin promover confianza. Objeción: dos hashes y un estado accepted-limited pueden aparentar aceptación de una regla. Respuesta: registros de ensayo aislados, integridad/valor/autenticidad/revisión separados y aceptación completa siempre falsa. Coste: el padre aún debe contrastar resultados, configuración, custodia y cualquier decisión fiscal.
4. Acotar a Linux y un trabajador. Objeción: 100 MB por objeto no limita peticiones simultáneas ni buffers acumulados. Respuesta: descriptores /proc/self/fd, lecturas síncronas y memoria medida del recorrido, sin extrapolación a producción. Coste: bloqueo del hilo, disponibilidad local y necesidad de presupuesto de concurrencia antes de operar un servicio.

## Límites de la revisión

Las firmas iniciales PDF/PNG solo comprueban coherencia MIME básica; no validan autenticidad oficial, estructura completa PDF, vigencia ni interpretación. Las carreras ensayadas son concretas, no una demostración universal frente a un administrador hostil. No se mide RSS agregado de hijos ni capacidad concurrente. La prueba fsync inyecta errores en la frontera real; no verifica persistencia física tras pérdida de corriente. El fsync final del registro se examina en código, sin repetir una segunda publicación pesada solo para ese punto.

Los errores de preparación se conservan como incidencias de entorno/instrumentación, no como defectos fiscales: dos límites ENOBUFS de spawnSync se corrigen acotando la selección de rutas y ampliando el buffer de listado. Los esperados históricos y los rojos anteriores permanecen intactos. No se modifica producto para conseguir verde ni se acepta una hipótesis fallida como bug sin contraste.

Los resultados y el dictamen final se completan con los recibos de ejecución adjuntos. 

## Resultado y dictamen

El recorrido íntegro termina correctamente con snapshot candidato `5fec4d171cad77251894dbe101ca5164c1d9f2a424b1b5f9abaa85bbe6e72092`: 264 pares, 102 sujetos, 20 objetos públicos y un externo exacto de 42.900.459 bytes para 36 enlaces. Se conservan los estados por sujeto/revisión/payload, se cotejan los GET de las 102 fichas y veinte objetos por bytes, hash y MIME y se comprueban sus recibos versión 2. El fallo de escritura previo deja intacto el registro. Tiempo: 196706.878447 ms; RSS máximo Bun: 3352900 KiB; sin RSS agregado de hijos, carga concurrente ni simulación de producción.

Verifican los 42 snapshots históricos v1/v2 y la restauración ordinaria del candidato v3 con el externo en otra raíz y sin hardlink. Pasan 9 grupos IO y 8 grupos HTTP/verificador propios; los grupos no son unidades de cobertura fiscal ni se suman con las pruebas heredadas. No se observan llamadas fetch en esas contrapruebas; la inspección de los consumidores tampoco encuentra fallback de red.

Calidad registrada: `lint 1; types 0; lint-repeticion 0`. Los logs determinan el alcance real y conservan cualquier fallo, sin equiparar errores de entorno a pruebas correctas.

Dictamen: corroborado el contrato técnico local de CAS v3 de los nueve archivos en el alcance ensayado, condicionado a raíz editorial/CAS protegida, plataforma Linux y operación serial. No se ha demostrado un defecto nuevo de producto en estas contrapruebas; la hipótesis de autoridad por sobre recalculado fuera del pin queda refutada en la ruta ensayada. Publicación visible tras fallo de fsync es una reserva real de durabilidad, ya declarada, no un rollback garantizado ni un bug nuevo inventado. Persisten las lagunas de concurrencia, persistencia tras apagón, autenticidad y validez fiscal. No se promueve el candidato nominal ni se acepta una regla completa.

El cotejo físico final confirma nuevamente las 16.486 entradas idénticas, cero cambios de base y cero borrados; HEAD permanece en la base. Los nuevos archivos de esta entrega se limitan al informe autorizado y al scratch explícito. Los hashes anteriores de las nueve modificaciones históricas se documentan, pero esta revisión no vuelve a modificarlas. La medición de 196,7 segundos empieza después de los imports del instrumento y excluye preparación, históricos y restauración.

Oxlint pasa en la repetición con las dieciséis reglas a error, un hilo y disable-nested-config; la configuración y plugin se copian sin alteraciones al scratch para resolver ESM. El primer fallo de carga se conserva como fallo de entorno, no como prueba superada. Los tipos del ensayo pasan. El patch textual gzip solo añade la entrega a esta base; los gzip y archivos vacíos se transportan por ruta/hash. El manifiesto y sobre excluyen la autorreferencia y el ensayo de aplicación coteja todos sus archivos. Los originales siguen fuera del paquete textual y de Git, con rutas propias y ambos hashes para preservación futura.
