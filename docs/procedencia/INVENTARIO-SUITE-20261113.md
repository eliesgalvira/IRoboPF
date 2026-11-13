# Inventario de la suite completa del 13 de noviembre de 2026

Ejecución única sobre `a772527ccdf19ee65a8ae9d17016d8876dc8548f`, antes del ajuste de `TryStatement`. Resultado: código 1. No se modifica ninguna prueba, esperado, fórmula ni configuración en este inventario.

```text
bun run test --reporter=default --reporter=json --outputFile.json=resultado-suite.json --maxWorkers=1
```

El comando usa `vitest.config.ts`: incluye `tests/**/*.test.{ts,mjs}` y excluye `tests/corpus-local/**`. No incluye todos los scripts independientes ni el corpus CAS completo. El JSON y el log originales se conservan como artefactos privados; este documento contiene el inventario sin logs ni datos del entorno.

## Resultado y unidades de recuento

| Unidad | Correctas | Fallidas | Omitidas | Pendientes `todo` | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Archivos | 300 | 42 | 1 | 0 | 343 |
| Pruebas registradas | 12.268 | 46 | 189 | 2 | 12.505 |

De los 42 archivos fallidos, 25 abortan sin registrar pruebas de Vitest y 17 contienen las 46 pruebas fallidas. No se cuentan las pruebas que no llegaron a registrarse como pruebas ejecutadas. El reporter JSON cuenta también bloques anidados como suites: sus 595 suites y 47 fallidas no son 595 archivos ni 47 archivos fallidos.

## Archivos fallidos y causa observada

Cada archivo fallido aparece una sola vez en los grupos siguientes. Los recuentos de pruebas indican fallos registrados, no pruebas que se dejaron de recoger.

### A. Admisión R36: `TryStatement`

3 archivos, sin pruebas registradas:

- `tests/admision-r46.test.ts`
- `tests/admision-r48.test.ts`
- `tests/flujo-admision-r36.test.ts`

Los tres llaman a `buildCompleteAdmission()` al importarse, respectivamente en las líneas 9, 50 y 12. El [compilador R36](../../scripts/procedencia/flujo-admision-r36-compilador.mjs) aborta con `Sentencia fuera del traductor: TryStatement` al recorrer los módulos actuales. Se confirma la sospecha inicial. Este es el único grupo cuya causa entra en la siguiente tarea de reparación.

### B. Compositor de Seguridad Social: declaración retirada

13 archivos, 7 pruebas fallidas y 8 archivos sin pruebas registradas:

- `tests/causal-comun-r57.test.ts`
- `tests/causal-ss-r54.test.ts`
- `tests/causal-ss-r56.test.ts`
- `tests/composicion-r43.test.ts`
- `tests/composicion-r45-resultados.test.ts`
- `tests/flujo-ss-r36.test.ts`
- `tests/flujo-unidades-colecciones-r41.test.ts`
- `tests/grafo-transitivo-r53.test.ts`
- `tests/causal-rentas-r59-adversos.test.ts`
- `tests/causal-rentas-r59-colecciones.test.ts`
- `tests/causal-rentas-r59-condiciones.test.ts`
- `tests/causal-rentas-r59-publico.test.ts`
- `tests/causal-rentas-r59.test.ts`

[flujo-ss-r36.mjs:272](../../scripts/procedencia/flujo-ss-r36.mjs#L272) sigue requiriendo `calcularDesgloseCotizacionesSocialesLegacy`; no encuentra esa declaración en las fuentes actuales y arroja `Global sin frontera`. El fallo se propaga a los compositores de rentas y sus consumidores. No se confunde con el traductor de admisión del grupo A.

### C. Compositor de escalas: estructura AST anterior

7 archivos, 12 pruebas fallidas y 2 archivos sin pruebas registradas:

- `tests/flujo-escalas-r36.test.ts`
- `tests/fronteras-escalas-r42.test.ts`
- `tests/causal-escalas-r60-bloqueo.test.ts`
- `tests/causal-escalas-r60-derechos.test.ts`
- `tests/causal-escalas-r60-fronteras.test.ts`
- `tests/causal-escalas-r60-oracle.test.ts`
- `tests/causal-escalas-r60.test.ts`

[flujo-escalas-r36.mjs:200](../../scripts/procedencia/flujo-escalas-r36.mjs#L200) busca una `FunctionExpression` recorriendo `decl.initializer`, pero una raíz actual no proporciona ese inicializador. TypeScript recibe `undefined` y falla al consultar `kind`. En una prueba se esperaba un bloqueo tipado y se recibe ese error de estructura.

### D. Compositor de retenciones: declaración histórica ausente

3 archivos, 2 pruebas fallidas y 2 archivos sin pruebas registradas:

- `tests/causal-retenciones-r57.test.ts`
- `tests/flujo-retenciones-r34.test.ts`
- `tests/flujo-retenciones-r32.test.ts`

[flujo-retenciones-r32.mjs:272](../../scripts/procedencia/flujo-retenciones-r32.mjs#L272) busca `calcularMinimoDescendientes` en `retencion-trabajo-aeat.ts`, donde ya no está esa declaración. El buscador usa el mensaje `Declaración ambigua` también cuando no encuentra ninguna. Las dos pruebas R32 esperaban el mensaje de cambio de contrato de fuente y reciben este error anterior. Se mantiene el rechazo, pero falla la expectativa sobre su causa.

### E. Ruta anterior de Aragón

2 archivos, sin pruebas registradas:

- `tests/causal-explicitos-push-r65.test.ts`
- `tests/causal-explicitos-r62.test.ts`

Su composición intenta abrir `lib/dominio/irpf/deducciones/aragon-dos-codigos-2025.ts`, que ya no existe como archivo. El módulo actual es el directorio `aragon-dos-codigos-2025/`. Se observa `ENOENT`; no se cambia la lista de fuentes.

### F. Fragmentos históricos que rechazan las fuentes actuales

3 archivos, sin pruebas registradas:

- `tests/flujo-admision-r32.test.ts`
- `tests/flujo-admision-r35.test.ts`
- `tests/flujo-ss-r32.test.ts`

Los dos primeros rechazan por `Fuente alterada` en `lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts`; el tercero exige revisar el contrato de `lib/dominio/laboral/cotizaciones-sociales.ts`. Son comprobaciones de identidad de fragmentos históricos contra fuentes posteriores. Inventariarlas no autoriza regenerar ni aceptar sus contratos.

### G. Pruebas `node:test` descubiertas por Vitest

5 archivos, sin pruebas registradas en Vitest:

- `tests/almacen-externo.test.mjs`
- `tests/ambito-publicado.test.mjs`
- `tests/nominal-software-explicacion.test.mjs`
- `tests/privacidad-verificar.test.mjs`
- `tests/software-recibo.test.mjs`

Importan `test` de `node:test`. El patrón general los recoge, pero Vitest no registra sus casos y devuelve `No test suite found`. Este resultado no demuestra que sus aserciones fallen bajo su ejecutor propio.

### H. Configuración específica del inventario

`tests/procedencia-inventario.test.mjs`: 19 pruebas fallidas. Su `afterEach`, línea 29, llama a `globalThis.gc()`. La configuración general no habilita esa función y las 19 quedan fallidas por `globalThis.gc is not a function`. La [configuración específica](../../scripts/procedencia/inventario-vitest.mjs) usada por `test:inventario` sí añade `--expose-gc`; ese paso pasa dentro del CI local de 31 comandos. El fallo de la invocación general no acredita un defecto de los cálculos inventariados.

### I. Expectativa anterior sobre 2026

`tests/flujo-admision-r32-runtime.test.ts`: 1 fallo entre 139 pruebas. La línea 154 exige rechazo anual para un territorio real en 2026 y recibe éxito. Las pruebas actuales de [territorios 2026](../../tests/territorios-2026.test.ts) verifican el soporte territorial posterior. Se conserva esta expectativa desactualizada sin editarla.

### J. Páginas del catálogo de deducciones

`tests/deducciones-autonomicas-2025.test.ts`: 1 fallo entre 7 pruebas. La línea 129 espera páginas `[325, 326]` para `cataluna_alquiler_victimas_violencia_machista`; el catálogo devuelve `[326, 327]`. Se registra la discrepancia documental observada, sin decidir aquí qué localizador debe prevalecer ni cambiarlo.

### K. Recuento de controles de deducciones

`tests/deducciones-autonomicas-aplicadas.test.ts`: 1 fallo entre 3 pruebas. La línea 53 espera 351 controles a partir de `DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor`; obtiene 311. El chequeo previo de que todos los controles de esa lista existen sí pasa. No se transforma esa lista en el censo completo ni se declara correcto el 311 por el mero hecho de obtenerlo.

### L. Ensayos de rentas y contratos posteriores

`tests/flujo-rentas-r36.test.ts`: 1 prueba fallida que agrupa cuatro discriminantes internos de `flujo-rentas-r36-ensayos.mjs`:

- `general-centimos-SS-otras-rentas`: recibe `canonical` donde esperaba `legacy`.
- `conexion-anual-rechaza-activos-y-mezclas`: recibe `defect` donde esperaba `fail`.
- `conexion-anual-etapas-por-instancia`: falta el contrato de frontera `CensoBasesFamiliares2025`.
- `conexion-trabajo-cinco-propiedades-y-pagos-reales`: falta el mismo contrato de frontera.

Los cuatro son subcasos del instrumento, no cuatro pruebas Vitest adicionales. No se sustituyen resultados ni se declara resuelto el contrato familiar.

### M. Ancla Git de incorporación R32

`tests/incorporacion-lote-r32.test.ts`: 2 pruebas fallidas. [incorporacion-lote-r32.mjs:16](../../scripts/procedencia/incorporacion-lote-r32.mjs#L16) exige que `846f25e183ba07414065d4e6bdf9e98311b98a17` sea antecesor de `HEAD`; la comprobación termina con código 1 en el corte ensayado. El fallo precede a la preparación de sus fixtures. No se relaja esa identidad histórica.

## Rojo deliberado y límites

El reproductor `tests/datos-escalas-minimos-canarias.mjs` conserva la discrepancia deliberada de Canarias 2015–2016: esperado publicado 1.813,61 frente a integración 1.813,62. Su ejecución directa previa a este inventario dio código 1. Su nombre queda fuera de `tests/**/*.test.{ts,mjs}`, por lo que no pertenece a los 42 archivos fallidos ni a las 46 pruebas de esta ejecución. La [consulta CANARIAS-CUOTA](CONSULTAS-EXPERTOS.md#12-canarias-cuota--canarias--cuota-publicada-frente-a-integración) conserva la pregunta fiscal.

El verde de las listas del workflow y este rojo de la configuración general son resultados distintos. No se ha repetido la suite completa, excluido nuevos archivos, actualizado instantáneas ni reparado estas causas en la tarea de inventario. Una reparación posterior de A no permite inferir el cierre de B–M ni que toda la suite pase.
