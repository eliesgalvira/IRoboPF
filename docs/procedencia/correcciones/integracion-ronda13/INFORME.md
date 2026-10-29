# Integración de la ronda 13

El orquestador integra siete entregas contra la base `5799bb03826719a4dd3500a962e2d6bb5124fdca`, sobre el respaldo propio `6de089ff8f2d287432c8acf2184008a19b85cf63`. `recepcion.json` registra los manifiestos, sus hashes y la comprobación de 8.456 archivos de base por checkout, sin ausencias ni diff de rama. No se utilizan sus índices para integrar. Los archivos se cotejan individualmente. No se cambia ningún informe histórico del autor o revisor.

## Contrato familiar candidato

Se integran `derechos-contrato.ts`, `derechos.ts`, su conexión canónica anual, pruebas e informe. El contrato exige hechos explícitos sobre titulares y descendientes; distribuye el mínimo según derechos y prioridad de grado. No se divide sistemáticamente por dos. Se limita a Madrid 2025, declaración individual y devengo ordinario, con rechazos para hechos insuficientes o supuestos excluidos. El perfil heredado conserva su contrato anterior.

El autor conservó rojos de reparto y conexión; el padre ejecutó **98 pruebas correctas** de derechos, mínimos y liquidación. Lint global y tipos principal/vendor correctos. Queda pendiente una revisión independiente nueva de elegibilidad, coherencia de hechos y conexión. Una estructura válida no prueba que los hechos fiscales aportados sean verdaderos. No se acepta una declaración completa.

## Revisiones recibidas

- Inflación: 69 diferencias antiguas reproducidas y corregidas en la base revisada; 16.770 celdas, 543 controles, 330 fronteras y 120 casos adicionales contrastados. CX-07-B seguía abierto en aquella base; el fix posterior del padre está bajo revisión nueva en ronda 14. No se transforma la coincidencia Excel en aceptación fiscal.
- Conexión anual v2: CAV1-01/02/03 comprobados, 200 casos propios conformes. CAV2-01 reproduce la misma ruta omitida por el padre que PE-01; la integración literal y verificación de blobs de `6e210920` la corrigen. La revisión de publicación compilada sigue en curso.
- Evidencias estatales: 78 decisiones nuevas limitadas a celda y año, separadas de 319 correspondencias históricas. Cabeceras, contexto, 83 citas y 13 recortes comprobados; cadena de leyes y cinco erratas examinadas. No se promueve ningún payload.
- Evidencias autonómicas: 186 decisiones nuevas limitadas, con 94 citas/selecciones y nueve recortes. Las condiciones de devengo y fallecimiento no están ejecutadas por el selector jurídico actual. Murcia mantiene quinta fila estrictamente por encima de 60.000, sin forzar continuidad.
- Retenciones antiguas: 19 PDF y 191 citas/facsímiles verifican. La revisión jurídica y visual fue selectiva, no exhaustiva; 133 escenarios Decimal no equivalen a 133 aserciones. Julio de 2015 conserva una discrepancia entre la corrección anunciada y la condición visible. Se requieren revisiones separadas por períodos antes de habilitar versiones.
- TGSS mensual: 19 originales, 42 citas/facsímiles y 21 escenarios comprobados. El ejemplo oficial 183,35 + 5,20 + 18,20 = 206,75 discrimina frente a redondear el tipo combinado, que da 206,76. Su alcance es ese ejemplo; R05/R06/R10 siguen parcialmente pendientes. No se impone al motor analítico una regla universal no acreditada.

## Originales y preservación

Los 21 objetos nuevos del CAS de la revisión estatal, **24.604.569 bytes**, se conservan por SHA-256/SHA-512 en `.cache/procedencia/recepcion-r13/estatales/sha256`, fuera de los worktrees. `cas-preservado.json` fija rutas, tamaños y hashes. El directorio CAS de esa entrega queda ignorado en Git; no se borran sus bytes. Las citas, manifiestos, decisiones y recetas sí se respaldan. Un original de 14,4 MB no se incorpora accidentalmente como blob ordinario.

La siguiente ampliación de preservación debe incorporar originales nuevos de AEAT, TGSS y esta ronda, verificar restauración y registrar inclusiones/exclusiones. Se conservan íntegros v1 y v2. Crossa contiene v1 histórico, desfasado respecto de v2 y de la próxima ampliación; misma casa y propietario, no custodia independiente. No hay LFS, gasto ni transferencia externa.

## Regeneración

El inventario pasa a **52.377 ocurrencias**: 24.299 sintácticas, 16.351 efectivas y 11.727 seleccionadas; 120 fuentes TypeScript y una Python. Hay 29.511 unidades pendientes y 351 fichas de deducción. Estos recuentos no representan reglas fiscales aceptadas.

Se genera v1 `2d4c3dcdcc45fc4811d9ac65146cf991fd077908b5467a9118795c566acb8f93` y v2 `98c315e18130d88b18a4c85aa62ec2b1dd1d18a62d9f5cf61fd57711399e7e1a`, con 715 objetos de publicación y 65 puntos de rastro. Se preservan los 22 snapshots históricos y actuales. El nuevo payload Madrid `bd905a560b037ae7ab8ddfe6bcfb6790e3c5d85c3ddc0d1e1ec31f1e1471d7fc` conserva el valor y la fuente exactos; el inventario global cambia y no se migra ninguna atestación. Integridad y exactitud numérica verificadas; interpretación candidata, binding pendiente, autenticidad histórica indeterminada y aceptación fiscal completa false.

`actualizar-enlace.mjs` y `publicar.mjs` reproducen la actualización con sus comprobaciones de identidad. El primer comando de pruebas de publicación nombró dos archivos inexistentes y usó la configuración general para un TSX: no ejecutó tests. Se conserva en `publicacion-validacion.log`; el pase corregido usa los nombres reales y `contenido-vitest.mjs`, con resultado en `pruebas-publicacion.log`.

No se repite el build por esta integración de contrato y datos: la revisión independiente de empaquetado sigue en curso sobre el commit anterior. La configuración de empaquetado no cambia. No hay servidor, despliegue, PR, cambios a main, limpieza final ni cierre del encargo.

## Cierre recibido de ronda 14 y comprobaciones finales

La revisión nueva `revisiones/publicacion-cuota-v2/INFORME.md` considera aprobables técnicamente PE-01/02/03 y CX-07-B sobre `6e210920`. Verifica GET compilados, escape, 404/503, bytes PDF/PNG, aislamiento del almacén, omisiones y duplicados de estados/recibos, 84 desgloses comparables y consumidores. No encuentra un bloqueo nuevo de producto. No emite atestación de Madrid porque no volvió a inspeccionar visualmente original y recorte.

Su node_modules enlazado obligó a una retraza suplementaria de dependencias de los dos GET. La copia resultante contiene 4.811 archivos y 267.676.833 bytes, 862.508 más que la medición del padre. No se afirma reproducción literal del tamaño ni se convierte esa adaptación en receta de despliegue. Las rutas de búsqueda/ámbito no se ejecutaron como GET compilados en esa revisión. Se conserva esta limitación operativa.

En el árbol integrado del padre pasan **13 pruebas** de rastro/publicación y **20 de contenido**, con el snapshot nuevo. La ejecución anterior sin archivos de test no cuenta como validación. Las 98 pruebas familiares, lint y tipos están en su log propio. Los recuentos de autor, revisor y padre se solapan: no sumarlos como cobertura fiscal.
