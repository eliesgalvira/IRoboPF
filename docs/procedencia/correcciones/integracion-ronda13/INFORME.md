# Contrato familiar y publicación documental

## Contrato familiar candidato

Se integran `derechos-contrato.ts`, `derechos.ts`, su conexión canónica anual, pruebas e informe. El contrato exige hechos explícitos sobre titulares y descendientes; distribuye el mínimo según derechos y prioridad de grado. No se divide sistemáticamente por dos. Se limita a Madrid 2025, declaración individual y devengo ordinario, con rechazos para hechos insuficientes o supuestos excluidos. El perfil heredado conserva su contrato anterior.

El autor conservó rojos de reparto y conexión; la validación de integración ejecutó **98 pruebas correctas** de derechos, mínimos y liquidación. Lint global y tipos principal/vendor correctos. Las pruebas de implementación no acreditan por sí solas el contraste independiente de elegibilidad, coherencia de hechos y conexión. Una estructura válida no prueba que los hechos fiscales aportados sean verdaderos. No se acepta una declaración completa.

## Revisiones recibidas

- Inflación: 69 diferencias antiguas reproducidas y corregidas en la base revisada; 16.770 celdas, 543 controles, 330 fronteras y 120 casos adicionales contrastados. CX-07-B seguía abierto en aquella base; la corrección posterior de integración necesita contraste propio. No se transforma la coincidencia Excel en aceptación fiscal.
- Conexión anual v2: CAV1-01/02/03 comprobados, 200 casos propios conformes. CAV2-01 reproduce la misma ruta omitida en la integración que PE-01; la integración literal y verificación de blobs de `6e210920` la corrigen. La conformidad de la conexión anual no acredita el empaquetado de la publicación compilada.
- Evidencias estatales: 78 decisiones nuevas limitadas a celda y año, separadas de 319 correspondencias históricas. Cabeceras, contexto, 83 citas y 13 recortes comprobados; cadena de leyes y cinco erratas examinadas. No se promueve ningún payload.
- Evidencias autonómicas: 186 decisiones nuevas limitadas, con 94 citas/selecciones y nueve recortes. Las condiciones de devengo y fallecimiento no están ejecutadas por el selector jurídico actual. Murcia mantiene quinta fila estrictamente por encima de 60.000, sin forzar continuidad.
- Retenciones antiguas: 19 PDF y 191 citas/facsímiles verifican. La revisión jurídica y visual fue selectiva, no exhaustiva; 133 escenarios Decimal no equivalen a 133 aserciones. Julio de 2015 conserva una discrepancia entre la corrección anunciada y la condición visible. Se requieren revisiones separadas por períodos antes de habilitar versiones.
- TGSS mensual: 19 originales, 42 citas/facsímiles y 21 escenarios comprobados. El ejemplo oficial 183,35 + 5,20 + 18,20 = 206,75 discrimina frente a redondear el tipo combinado, que da 206,76. Su alcance es ese ejemplo; R05/R06/R10 siguen parcialmente pendientes. No se impone al motor analítico una regla universal no acreditada.

## Originales y preservación

Los 21 objetos nuevos del CAS de la revisión estatal, **24.604.569 bytes**, se conservan por SHA-256/SHA-512 en `.cache/procedencia/recepcion-r13/estatales/sha256`, fuera de los worktrees. `cas-preservado.json` fija rutas, tamaños y hashes. El directorio CAS de esa entrega queda ignorado en Git; no se borran sus bytes. Las citas, manifiestos, decisiones y recetas sí se respaldan. Un original de 14,4 MB no se incorpora accidentalmente como blob ordinario.

## Regeneración

La regeneración conserva la distinción entre ocurrencias técnicas y unidades pendientes de resolver.

La generación de las versiones técnica y documental conserva Madrid con el mismo origen y cifra, y atestación nula. El binding continúa sin aceptación completa.

`actualizar-enlace.mjs` y `publicar.mjs` reproducen la actualización con sus comprobaciones de identidad. El primer comando de pruebas de publicación nombró dos archivos inexistentes y usó la configuración general para un TSX: no ejecutó tests. Se conserva en `publicacion-validacion.log`; el pase corregido usa los nombres reales y `contenido-vitest.mjs`, con resultado en `pruebas-publicacion.log`.

La revisión nueva `revisiones/publicacion-cuota-v2/INFORME.md` considera aprobables técnicamente PE-01/02/03 y CX-07-B sobre `6e210920`. Verifica GET compilados, escape, 404/503, bytes PDF/PNG, aislamiento del almacén, omisiones y duplicados de estados/recibos, 84 desgloses comparables y consumidores. No encuentra un bloqueo nuevo de producto. No emite atestación de Madrid porque no volvió a inspeccionar visualmente original y recorte.

La retraza suplementaria de los dos GET identificó sus dependencias pese al `node_modules` enlazado. La copia resultante conserva el alcance técnico y los límites descritos en la revisión de publicación.

En el árbol integrado pasan **13 pruebas** de rastro/publicación y **20 de contenido**, con el snapshot nuevo. La ejecución anterior sin archivos de test no cuenta como validación. Las 98 pruebas familiares, lint y tipos están en su log propio. Los recuentos de autor, revisor e integración se solapan: no sumarlos como cobertura fiscal.
