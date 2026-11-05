# Primera revisión independiente: conexión anual Aragón2

Dictamen: favorable dentro del alcance declarado. No se ha reproducido un importe o una publicación incorrectos que bloqueen el candidato. No se proponen cambios productivos. Esta revisión corresponde exclusivamente a la conexión anual nueva; no constituye cierre fiscal de los dos códigos.

Candidato: base pública b9122c2bf61310922e856117ed4490136a628d03; parche SHA256 d5e43d36d394a95e450d4201b9cd9eae9be1ccce65fe87103aac5eea8fee4730. Se inspeccionaron sus14 rutas:6 modificaciones y8 altas. Lectura de LEEME, ALCANCE, INFORME-VALIDACION y matriz-conexion. Sin worktree, instalaciones, subdelegación o mutaciones VCS/productivas. PESADO2 explícito; cada ejecución con timeout -k30s, suites secuenciales y un worker.

## Resultado ejecutado por esta revisión

- 65 pruebas adversas propias pasan; oráculos monetarios mediante BigInt, baseCentimos/500 y saturación en4000, definidos antes de consultar salidas. Se reutilizan los hechos sintéticos y los constructores de contexto del candidato, sin cambiar sus fuentes ni esperados. Los oráculos nuevos no proceden del cálculo observado.
- 50 focales del candidato pasan de nuevo, como reproducción diferenciada de las pruebas propias.
- 393 regresiones pasan,2 TODO preexistentes,17 archivos. Incluyen A40/censos H1-H2, B37, seis catalanas, ambas API territoriales, composición/precisión y variantes C2025. Se excluyeron expresamente las dos suites aragonesas aisladas: no se presentan sus75 ni otras cifras anteriores como revisión nueva.
- Tipos estrictos/Effect pasan sobre los9 módulos y ambas pruebas. Canario floatingEffect falla con TS3 como se esperaba, confirmando el diagnóstico activo.
- Oxlint/antislop y ESLint --max-warnings=0 pasan sobre candidato y prueba propia. Las primeras invocaciones fallaron por una ruta con «..» y por el directorio base de ESLint; se conservaron y se corrigió únicamente la invocación. No se alteraron reglas o severidades.
- No se ejecutaron inventario ni CI global.

Los registros conservados distinguen la primera suite propia53 de su ampliación final65. La suma de65 propias,50 focales y393 regresiones no debe confundirse con pruebas legales independientes de todos los códigos.

## Contraste primario y contrato anual

Consulta oficial2025: [AEAT, inversión Aragón](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-aragon/inversion-acciones-participaciones-entidades-nuevas-creacion.html). El umbral regional se refiere a la base máxima estatal; no a una deducción estatal efectivamente aplicada. Así, la elección estatal expresamente0 con censo110000 y base regional10000 permite generar2000 regionales si concurren los restantes requisitos. Se comprobó la diferencia de2000 en ambas API, sin añadir50000 estatales ni reducir el censo a10000. El [ejemplo AEAT2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c16-deducciones-generales-cuota/deduccion-inversion-empresas-nueva-reciente-creacion/ejemplo-aplicacion-deduccion-inversion.html) sirve de contraste numérico; su elección estatal positiva no es la rama anual habilitada aquí.

Se contrastaron además los artículos110-9 y110-13 del [texto refundido oficial publicado por BOE](https://www.boe.es/buscar/act.php?id=BOA-d-2005-90006): el primero conserva el20%, máximo4000, umbral, remisión68.1, reinversión y requisitos regionales; el segundo exige cuota autonómica asociada a la BLG de los netos reducidos de esas viviendas. Las incompatibilidades son para las mismas inversiones. El manual2025 confirma el alcance y la relación con economía social. No se rediseñan aquí las fórmulas aisladas revisadas anteriormente.

Para social, la [AEAT2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-aragon/arrendamiento-vivienda-social.html) no proporciona en esa página un algoritmo de atribución de cuota. El contrato pendiente3/10 es compatible con esa fuente; no permite escoger por analogía un promedio, marginal o diferencia de cuotas. Los hechos de neto aportados no sustituyen productores anuales trazables.

## Seis deltas centrales y rastro

1. ampliacion-a-anual.ts:184: excluye Aragón2 de la lista genérica de elecciones por entidad; el adaptador específico concilia pago/justificante y entidad+escritura contra todas las solicitudes A40, cualquiera que sea su orden. Otra escritura de una misma entidad no se convierte automáticamente en la misma inversión.
2. anual-territorial-esquemas.ts:1: incorpora la unión A-aragon-dos cerrada; no expone bases, cuota, contexto ni elecciones fiscales externas. Las pruebas rechazan campos adicionales tanto arriba como dentro de hechos y la ausencia de asignación estatal explícita.
3. anual-territorial-tipos.ts:1: extiende el tipo transversal, preservando las demás variantes y la discriminación consumida por B37.
4. anual-territorial.ts:374 y591: sustituye solamente la conciliación genérica de familia para este lote por la validación específica; no interpreta parentesco mercantil como discapacidad. Mantiene conciliación monetaria transversal, normalización desde importeExactoEuros y consumo en el libro común.
5. composicion-anual.ts:640: conserva RechazoAragonAnual y su dependencia en el error público que alcanzan ambas API.
6. liquidar-irpf-anual.ts:68: añade dependenciaAragon opcional y tipada a ResultadoNoSoportado; mantiene su discriminante.

Los tres módulos nuevos separan esquema de hechos, validación del contexto anual y dependencia tipada. El rastro conserva asignaciones, exceso, caso/contribuyente, reservas, citas y obligaciones futuras del evaluador publicado. No consume importePresentadoCentimos como exacto. El censo es una referencia de exhaustividad aportada, no evidencia de que el motor haya descubierto todas las inversiones.

## Adversas y límites comprobados

Ambas API rechazan aportante ajeno, entidad igual al contribuyente, pago fuera2025, censo vacío y partición incorrecta. Se prueban fracciones ordinarias válidas2/5 y1/3, rechazos ordinarios al50/100% y aceptación de fundador emergente al50/100% con sus hechos expresos: no se infiere la calificación. Se conservan topes y se detectan pagos/justificantes repetidos en dos lotes en ambos órdenes, además de misma escritura/entidad con pagos diferentes.

La suite propia prueba generación de0.002/0.004/0.006 y fronteras del tope; cuota disponible con80 decimales en ambos órdenes con A40. Las focales reproducidas añaden el exacto pendiente y la asignación100.0003/900.0027 con cuota1000.003. La composición técnica conserva300 de pagos y la explícita100 en los casos de control: cuota líquida menos pagos igual a diferencial, una sola deducción2000.

Estatal positiva conserva ARAGON_68_1_ESTATAL_SIN_PRODUCTOR y su base elegida;38.2 conserva ARAGON_38_2_SIN_PRODUCTOR en la rama admitida aisladamente con regional0. Las ramas mixed/positivas no admitidas conservan su rechazo previo, sin simular productor ausente. Social conserva petición y fórmula3/10 referidas a anual:2025:aragon:t y contribuyente t, rechazando sin importe incluso con neto0. No se proporciona un cero fiscal sustitutivo.

## Hallazgos

Ningún hallazgo de importe/publicación incorrecta reproducido. Por ello no hay fichas de gravedad/ruta/línea/repro/impacto que emitir como defectos. Los límites ya declarados son pendientes de producto, no hallazgos nuevos: productor estatal68.1; transmisión/ganancia/exención38.2; neto23.2/3, BLG y método contrastado para cuota social. No se certifican autenticidad documental, derechos externos ni obligaciones futuras. No se autentica tampoco la exhaustividad real del censo aportado.

El favorable sólo corresponde al parche identificado. Queda fuera la conciliación del integrador con deltas concurrentes E38/D51/C36/F y su publicación: esta revisión no acredita ese futuro estado combinado.

## Integridad y reproducción

Cotejo antes/después:72 archivos originales de la entrega candidata y25408 archivos de raíz alcanzada, sin diferencias. Los6 originales/preimágenes coinciden con raíz;14 postimágenes y sus SHA concuerdan con el manifiesto. El unified del autor se reconstruyó en memoria exactamente contra las6 preimágenes, sin escribirlas. Se conservan HASHES-ANTES, HASHES-DESPUES y COTEJO fuera del parche portable.

La prueba nueva sólo importa rutas relativas del repositorio, la fixture pública propuesta y dependencias ya existentes. Aplicada junto al candidato, desde la raíz:

```sh
timeout -k 30s 5m node node_modules/vitest/vitest.mjs run tests/revision-aragon-conexion-anual.test.ts --maxWorkers=1
```

Los overlays de validación privados sólo resuelven archivos contra las postimágenes y raíz; no forman parte del contrato ni de la prueba portable. No se copiaron cuerpos CAS. effect-solutions list/show se intentaron con timeout y el ejecutable no está disponible; se consultaron las firmas locales de Effect.result/runSync y patrones locales. No se creó código productivo Effect.

PESADO2 liberado al terminar; todas las ejecuciones propias han terminado. Sin instalaciones, procesos de validación pendientes ni escrituras productivas.
