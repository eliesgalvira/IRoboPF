# Revisión independiente del cierre técnico E

Este dictamen conserva el defecto encontrado en la primera recepción. Su
[corrección](CORRECCION-PRECISION.md) tiene un [contraste posterior favorable](CONTRASTE-PRECISION.md).

4 de noviembre de 2026. Base `e03ce06729b85f55ec76ddfe24234f7afc4fccab` más recepción local de 20 archivos. Revisión sin subdelegar, sin modificar producto, API, pruebas del autor ni manuscritos del integrador. Se añaden únicamente este informe y `tests/composicion-anual-revision.test.ts`. Sin operaciones mutantes de VCS ni copias del repositorio.

**Dictamen: requiere corregir E-REV-01 antes de publicar el cierre técnico con el contrato de precisión declarado.** La composición fiscal común sí existe; no es una fachada que seleccione las liquidaciones antiguas. No se demuestra una regresión de céntimos en los perfiles públicos ejecutados. La discrepancia reproducida afecta a la promesa interna de 80 cifras y no justifica atribuir una pérdida monetaria pública que no se ha observado.

## E-REV-01 — P2 — La precisión elegida no gobierna los gravámenes

Ubicación: `lib/dominio/irpf/liquidacion/composicion-anual.ts`, creación de `A` y llamadas a `calcularCuotaPorEscala`; `lib/dominio/irpf/cuotas/escalas-gravamen.ts:71` y `:93–104`. Afecta al contrato de composición documentado en API-MOTOR.md y a la afirmación de conservación de precisión de IMPLEMENTACION.md.

Caso mínimo: composición Madrid 2025, individual de 40 años, política `decimal-hasta-salida`, `precision: 80`, base general EUR `6000.123456789012345678901234567890123456789`, ahorro cero, sin deducciones ni servicios laborales. La base se construye con un Decimal clonado de 80 cifras; no se pierde precisión preparando la entrada. Todo queda dentro del primer tramo de ambas escalas, por lo que el oráculo independiente es una multiplicación decimal finita exacta, sin tolerancias ni redondeo intermedio:

| Gravamen | Esperado | Observado |
| --- | --- | --- |
| Estatal, base × 0,095 | `570.011728394956172839495617283949561728394955` | `570.01172839495617284` |
| Madrid, base × 0,085 | `510.010493827066049382706604938270660493827065` | `510.01049382706604938` |

El helper usa `Decimal.max/min` globales y operaciones cuyo receptor es una constante de tabla del constructor global (`fila.cuota.plus(...)`). Esas operaciones trabajan a 20 cifras aunque la composición haya creado `A` a 80. Convertir el resultado ya redondeado a `A` no recuperaría las cifras. Hay que conservar el constructor seleccionado a lo largo de las operaciones y revisar también ahorro, remanentes y constantes; evitar cambiar globalmente `Decimal.set`, que haría depender otros cálculos del orden de ejecución. Mantener 20 en el productor técnico y las cuantizaciones Open explícitas.

La reproducción llama al núcleo interno con una fracción que la entrada pública efectiva, limitada a céntimos aportados, no recibe directamente. El helper problemático ya existía en la base: se trata de un límite heredado que el nuevo contrato anuncia como resuelto, no de una prueba de que este refactor haya introducido una diferencia de céntimos. No se propone ampliar la admisión pública ni ajustar expectativas financieras para ocultarlo.

Prueba pública: `E-REV-01: precisión 80 conserva fracción en ambos gravámenes`. Contiene dos aserciones exactas independientes; ambas fallan dentro de una sola prueba. Queda roja intencionadamente para el contraste acotado posterior.

## Recorrido y consumidores examinados

| Consumidor | Recorrido comprobado |
| --- | --- |
| Servicio `LiquidacionIrpfAnual.layer` y función directa | Comparten `construirLiquidarIrpfAnual` y la llamada única al núcleo en `liquidarTrabajoIndividualSimple`; comparación independiente de salida |
| `liquidarIrpfAnualConDerechos` | Valida hechos y llama al servicio; el núcleo vuelve a conciliar ámbito, contribuyente y rentas antes de calcular derechos estatales/autonómicos |
| Análisis salarial, progresividad y auditoría | Consumen cuota anual; no contienen otra composición de mínimos o cuota salarial |
| Efectivo empleo | Productor de gastos/cotizaciones aportados y artículo 20; núcleo común con política Open y servicios acreditados; consume DA61 y cuota posterior devueltas |
| Efectivo pensión | Mismo núcleo, sin servicios ni DA61; conserva decimales hasta presentación en los casos ordinarios comprobados |
| Efectivo actividad EDS | Aporte neto del adaptador, RETA y artículo 32 ya consumidos; mismo núcleo sin artículo 20/DA61, pagos efectivos del aporte |

Los productores mantienen operaciones distintas sobre hechos distintos. La cotización del contrato normalizado es procedencia, no una segunda deducción. Ningún adaptador conserva otra fórmula de mínimos, escalas, ahorro o DA61. La resta de pagos está en `liquidarPagosAnuales`; el técnico la usa sobre cuota liquidada en céntimos y el efectivo sobre euros decimales. No se identifica bruto con base ni retención estimada con un pago efectivo. La retención AEAT sigue siendo un procedimiento distinto, con lógica de derechos compartida; no constituye otra declaración anual.

Las pruebas propias discriminan mínimos por debajo, en y por encima de 5.550, base negativa, fronteras estatales 12.450 y 20.200, remanentes distintos de 5.550/5.956,65, límite autonómico sin consumir cuota estatal, signos de diferencial y cotización ya consumida. También añaden hechos efectivos distintos a los ejemplos: bruto 30.000, cotización 2.000 y retención real 5.000. Para base 26.000, pensión da cuota `4584.12211`, empleo `4584.12`; ambos presentan diferencial `-415.88`. La diferencia responde a políticas explícitas, no a dos algoritmos fiscales.

Se comprueban mediante `Effect.result` rechazos públicos por territorio, edad, discapacidad y rentas incompatibles con derechos. Si fueran `Die`, la ejecución no devolvería un `Result` recuperable y las pruebas fallarían. Las suites ordinarias complementan los límites de elegibilidad, reparto, entradas parciales y ámbitos anteriores. Las listas antiguas no permiten eludir la admisión pública ni usar el contrato interno como formulario. No se exige extender familias fuera de Madrid 2025 para publicar este hito técnico.

## Rastro, contratos y API

`rastroTrasReforma` transforma las referencias enlazadas anteriores en pendientes y conserva su URL, snapshot, hashes y sujeto en el motivo histórico. La prueba propia examina ambas entradas y no encuentra referencias actuales enlazadas. Esto no acredita nuevas normas ni atestaciones.

El contrato AST es un censo fijado por bytes y llamadas, no una demostración semántica. R52 declara `componerLiquidacionAnual` y `rastroTrasReforma` como fronteras externas `requires-external-contract`, sin admisión. Su test adicional y los ensayos existentes pasan; las puertas permanecen falsas. No se acepta la evidencia simbólica anterior como financiera del núcleo nuevo.

API-MOTOR.md describe las exportaciones, unidades, signos, discriminantes y rechazos observados, y advierte que el núcleo presupone admisión. Los tres ejemplos completos se ejecutan en las pruebas ordinarias. La excepción encontrada es la garantía de precisión señalada en E-REV-01. La interfaz puede consumir resultados sin recalcular impuestos dentro del alcance documentado; esa utilidad no equivale al cierre general de E ni a acreditación normativa.

El workflow remoto incluye `composicion-anual-unica` y `anual-salarial-completo`, igual que el script local, y conserva las suites anteriores enumeradas. La revisión coteja su configuración; no ha lanzado CI remoto. La suite propia aún no está en esas listas explícitas: al incorporar la corrección conviene incorporar también su regresión a CI. No se modifica el workflow desde esta revisión.

## Validación de esta revisión

Se consultaron AGENTS.md, REFORMA-MOTOR.md, API-MOTOR.md, IMPLEMENTACION.md, RECUPERACION.md y DECLARACION-SALARIAL-2025.md; también el CLI JS de effect-solutions (`list`, `show testing basics data-modeling`) y ejemplos de `Effect.runSync/exit` de la fuente local. Los oráculos financieros propios se derivan aritméticamente de las tablas del código revisado; no son un nuevo contraste jurídico con documentos oficiales.

Con el entorno de pruebas disponible, comandos desde la raíz, todos con timeout y Vitest con un trabajador:

```sh
timeout -k 30s 5m bun run test tests/composicion-anual-revision.test.ts --maxWorkers=1
timeout -k 30s 15m bun run test tests/composicion-anual-unica.test.ts tests/anual-salarial-completo.test.ts tests/conexion-anual.test.ts tests/retirada-rutas.test.ts tests/motor-unico-revision.test.ts tests/minimos-derechos.test.ts tests/retenciones-derechos.test.ts tests/liquidacion-irpf-anual.test.ts tests/correcciones-x-solidaridad.test.ts tests/puertos-composicion-r47.test.ts tests/puertos-r52.test.ts --maxWorkers=1
timeout -k 30s 5m bun run typecheck
```

- Propias: **26 pruebas, 25 pasan y 1 falla**, con dos aserciones fallidas del mismo defecto.
- Ordinarias: **198 pruebas, 11 archivos, todas pasan**. Incluyen las siete referencias Open sin alterar sus importes, control 2014, conservación pensión/actividad y fronteras Canarias de las suites seleccionadas.
- Tipos: **pasan ambos proyectos del comando `typecheck`**, incluidas las altas de revisión. La primera ejecución detectó el diagnóstico de capas en el test propio; se corrigió la anotación de punto de entrada conforme al patrón de los tests existentes, sin tocar producto.
- No se ejecutaron Python, CI completo, corpus CAS completo, build ni contraste oficial nuevo. Los **553 Vitest + 167 Python** del autor son evidencia recibida, no ejecuciones de esta revisión.

Los logs y el manifiesto compacto quedan en el respaldo de revisión, fuera de la publicación. No hubo suites pesadas simultáneas de este revisor.

## Integridad y entrega

Los **20/20 SHA256** de la recepción se comprobaron antes y después y permanecen idénticos. Respecto al manifiesto inicial de 19 rutas, se conserva la diferencia anunciada en IMPLEMENTACION.md y la ruta adicional del workflow; no son hallazgos accidentales. El manifiesto de revisión registra cada hash final de las 20 fuentes, además de hashes y tamaños de las dos altas y del parche que solo añade esas dos rutas. No incluye código ajeno, cachés, originales ni documentos del integrador.

El cierre técnico motor/API queda pendiente del contraste acotado de E-REV-01. Una vez corregido, esta revisión no identifica otro bloqueo en el alcance comprobado. Permanecen separados la extensión familiar normativa de E, A/F, TGSS mensual y el nuevo rastro y acreditación simbólica/documental: no se cierran por la unificación ni por estas pruebas.

Identificadores SHA256 del cotejo final:

- Recepción de 20 rutas: `98c61c206be70712c9d6911a9b08a768af62011273ba85c820492443b27cbb67`.
- Manifiesto inicial de 19 rutas: `d6a8fc0ea1adea6807d6f563d8a2770b62d87fecae7ea14aefa41147331e31d1`.
- Test propio final: `2ab08b404412a9ffd459522cf0e6d875ff05f6787e2247a4dfe56bc668f98d1a`.
