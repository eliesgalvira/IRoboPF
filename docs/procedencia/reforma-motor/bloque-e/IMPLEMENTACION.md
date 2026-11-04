# Composición anual única — implementación de E

4 de noviembre de 2026. Base publicada: `e03ce06729b85f55ec76ddfe24234f7afc4fccab`. Trabajo en el checkout compartido, sin commits, pushes, referencias, PR ni despliegues. La revisión independiente y publicación corresponden al padre. No se reaplicó ninguna entrega recuperada ni se editaron BALANCE-A-F.md, RECUPERACION.md, CLAUDE.md o las evidencias privadas preexistentes.

## Cambio implementado

`lib/dominio/irpf/liquidacion/composicion-anual.ts` contiene la composición común de selección territorial, derechos y mínimos estatales/autonómicos, gravámenes generales y del mínimo, ahorro y remanentes, límite autonómico de deducciones, cuota líquida y DA61 condicionada a servicios acreditados. Ambas entradas llaman a esa misma función. No es un selector entre dos liquidaciones: las fórmulas de cuotas y mínimos desaparecen de los adaptadores. El escenario estatal simulado conserva su duplicación explícita de la escala estatal, sin otra tabla fiscal. Canarias y las escalas publicadas mantienen el selector y los datos anteriores.

El contrato normalizado declara ámbito, bases integradas en EUR Decimal, rentas antes de reducciones para conciliar derechos, naturaleza e importe de cotizaciones ya consumidas por el productor, política monetaria y precisión. Los gastos efectivos, las cotizaciones estimadas y los aportes de actividad mantienen sus productores y restricciones propios; no se sustituyen por hechos inventados. La composición no resta otra vez la cotización. La naturaleza no selecciona otra fórmula fiscal. Las diferencias de redondeo son una política explícita: artículo 20, cada gravamen y DA61 en empleo Open; precisión decimal hasta salida en los demás perfiles. La precisión de composición es 20 cifras para el técnico y 80 para el efectivo, conservando el comportamiento anterior de cada productor.

`cuotas/cuota-diferencial.ts` contiene la única resta de cuota, retenciones y pagos, en la unidad recibida. El helper público de céntimos delega en esa operación decimal. El técnico resta después de liquidar cuota a céntimos; el efectivo conserva euros decimales hasta presentación. El rastro técnico reutiliza el diferencial calculado, sin invocar otro cálculo para explicarlo.

La validación de derechos también vive en la composición: esquema, ámbito, edad/discapacidad, alimentos excluidos y conciliación de rentas. La admisión pública conserva sus rechazos tempranos. Se rechazan familias fuera de Madrid 2025, sin extrapolar condiciones a partir de parámetros numéricos. El núcleo no se expone como API de admisión de formularios; sus bases y calificaciones proceden de productores ya admitidos.

## Matriz de consumidores

| Consumidor | Adaptación / recorrido vigente |
| --- | --- |
| `liquidarIrpfAnual` directo | Servicio anual → productor técnico de rendimientos y bases → composición común → céntimos y rastro |
| `LiquidacionIrpfAnual.layer` | Misma función de servicio; no implementa otra cuota |
| `liquidarIrpfAnualConDerechos` | Admisión de hechos completos → mismo servicio y composición; conserva reparto |
| `liquidarIrpfAnualExplicito`, empleo | Esquema y conciliación → gastos efectivos y artículo 20 → composición común con política Open y DA61 → presentación |
| Entrada explícita, pensión | Productor de gastos efectivos → misma composición decimal, sin DA61 |
| Entrada explícita, actividad EDS | Aporte validado de actividad con RETA/artículo 32 ya incluidos → misma composición decimal, sin artículo 20 ni DA61 |
| Análisis salarial / progresividad / auditoría | Mantienen consumo del servicio anual; ninguna nueva reconstrucción de cuota |
| Retención AEAT | Procedimiento de retención independiente; comparte lógica de derechos y piezas monetarias de mínimos. No se transforma en declaración anual |
| UI y Excel | Consumidores existentes de resultados; no necesitaron cambios de diseño ni ensamblaje |

## Retiradas y conservación

Se retira de `liquidar-irpf-anual.ts` el bloque de composición de mínimos, escalas, ahorro, deducciones y cuota; pasa al núcleo común. Se retira de `trabajo-anual/conexion.ts` su segunda selección de mínimos y escalas, composición de gravámenes/cuotas y aplicación propia de DA61. La preparación de rendimientos y bases permanece en sus adaptadores porque representa hechos y etapas distintas. No se elimina cobertura de pensión, actividad, ahorro, derechos ni territorios por conveniencia. No hay archivos históricos borrados ni API legacy reintroducida.

`lib/procedencia/rastro-reforma.ts` comparte la presentación de referencias históricas como pendientes. La entrada efectiva ya no atribuye al núcleo nuevo los enlaces enlazados del algoritmo anterior. Se conservan URL, snapshot, hashes y sujeto dentro del motivo pendiente. Las pruebas de rastro cambian únicamente esa expectativa de metadatos; los importes y casillas de las siete referencias Open no se modifican.

El inventario se regenera con `bun run inventario:generar`; los pines de las fuentes modificadas y nuevas se calculan desde sus bytes SHA256 actuales. El censo AST incorpora la composición común. No se regeneran certificados históricos, rastro-generado.json ni puertas fiscales. El observador R52 conserva sus tres comprobaciones y añade una cuarta: declara el núcleo nuevo y el enriquecimiento del rastro como fronteras externas pendientes. Su intérprete finito histórico no interpreta Effect de la composición nueva; no se pretende acreditarlo mediante esa frontera. La composición se contrasta con pruebas de producto. `completeRuleAcceptance` y `wiringAllowed` permanecen falsos.

## Verificación

Se consultaron `effect-solutions list`, `show basics data-modeling services-and-layers testing` y la fuente instalada de Effect antes de escribir código Effect. El CLI JS funciona con el entorno Nix facilitado; `rg` no estaba disponible y se usaron herramientas de lectura alternativas.

- Primera selección financiera: **178 pruebas pasan** en cinco archivos (conexión, anual salarial, liquidación, mínimos y revisión del motor).
- Selección tras nuevos contratos y rastros: **94 pruebas pasan** en tres archivos, incluidas las **cuatro regresiones nuevas** y las siete referencias Open. Las regresiones distinguen cotización efectiva/estimada, equivalencia de bases normalizadas, conservación de precisión, política monetaria, reparto y rechazo territorial. Una inyección de resultados del núcleo comprueba una llamada por entrada y ausencia de reaplicación de cuota/DA61 en el adaptador.
- `bun run typecheck`: pasa. `bun run lint`: pasa con 18 advertencias preexistentes fuera de los archivos modificados.
- Primera ejecución de CI: falló en la traducción documental R52 al seguir la nueva dependencia Effect. Se corrigió declarando su frontera pendiente; la comprobación acotada de R52 pasa con **4 pruebas**. Se conservan el fallo y los logs, sin contarlo como validación financiera fallida.
- CI final: **pasa con código 0**, incluido `ci-datos`: 553 pruebas Vitest y 167 pruebas Python; lint y tipos pasan. Los 351 manifiestos se reciben sin pendientes, conservando estado candidato, integridad de bytes no comprobada y vigencia jurídica pendiente de revisión independiente. El CAS sintético pasa; el ensayo histórico del corpus CAS completo se omite explícitamente, como declara el propio script. `ci-datos` pasa sus cinco suites (40, 7, 15, 6 y 7 pruebas) y el contraste final de 196 pares IPC, identidad, escenario explícito, ausencia de observación 2026 y cinco bases de 2018.

Todos los comandos de scripts y pruebas se ejecutaron con `timeout`, un trabajador en Vitest y sin suites pesadas simultáneas. No se ejecutó build: no hubo cambios de ensamblaje UI. Los logs se conservan en el respaldo privado de esta entrega; no forman parte de la publicación.

En recepción, el integrador cotejó los 19 archivos y el parche por SHA256 e
incorporó también las dos suites nuevas al workflow de GitHub: la entrega las
había añadido al script local, pero aún faltaban en el workflow.

## API y límites residuales

[API-MOTOR.md](../../API-MOTOR.md) documenta entradas, discriminantes, unidades, resultados, errores Effect recuperables, políticas y ámbitos. [ejemplos.ts](ejemplos.ts) contiene ejemplos sintéticos completos, ejecutados por las pruebas: efectivo, analítico y derechos de un descendiente entre dos titulares.

Esta implementación resuelve la duplicación anual descrita en RECUPERACION.md. No acredita por sí sola la ampliación normativa de derechos a todos los años y comunidades de E. Siguen pendientes esos ámbitos con condiciones contrastadas; se rechazan expresamente fuera de Madrid 2025. Tampoco cierra A, TGSS mensual de D, las 19 familias y la composición general de F, las puertas fiscales ni la revisión simbólica/documental del núcleo nuevo. Los perfiles salariales oficiales conservan su muestra y reservas; pensión/actividad tienen pruebas de conservación, sin nueva comparación oficial. La revisión independiente posterior detectó E-REV-01; la corrección y su contraste favorable se registran en [el cierre técnico](CIERRE.md). Este informe conserva los resultados originales del implementador.

## Archivos de entrega

Código: `composicion-anual.ts`, los dos adaptadores anuales, `cuota-diferencial.ts` y `rastro-reforma.ts`. Contrato y CI: `contrato-motor-unico.ts`, `flujo-rentas-r36.mjs`, `fuentes-actuales.json`, `scripts/ci-comprobaciones.sh`, `inventario.json` e `inventario-datos.json.gz`. Pruebas: `composicion-anual-unica.test.ts`, `puertos-composicion-r47.test.ts`, `puertos-r52.test.ts`, metadatos de `conexion-anual.test.ts` y `anual-salarial-completo.test.ts`. Documentación: API, este informe y ejemplos. Entrega privada: `implementacion.patch` y `manifiesto.json` en la carpeta de logs indicada. Son 19 rutas; el parche contiene las 18 textuales y el manifiesto prescribe regenerar el único binario derivado (`inventario-datos.json.gz`) con el generador existente y comprobar su SHA256. El checkout compartido ya contiene ese artefacto regenerado. El manifiesto privado fija exclusivamente estas rutas; excluye cachés, originales y documentos del padre.
