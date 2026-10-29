# Integración y correcciones de la ronda 9

Trabajo del padre sobre a66a5668, sin PR ni despliegue. No hay nueva aceptación fiscal ni atestación. El criterio de evidencia distingue integridad, autenticidad, interpretación, exactitud y aceptación. Los informes de revisión anteriores se conservan íntegros.

## Correcciones con pruebas previas

- **RTI-01, P1:** se rechaza antes de calcular una liquidación cuyo subcaso de retención pertenece a otro ejercicio. La comprobación se aplica a ambos modos; las retenciones realmente soportadas siguen siendo una entrada distinta. El rojo reproducía éxito y descuento de una retención de 2020 en el anual de 2025.
- **RTI-02:** el adaptador permite seleccionar fecha de pago o cierre; transmite esa elección y las cotizaciones del mismo modo al servicio. Los rechazos fiscales esperados se propagan por el canal tipado de Effect, sin convertirlos en defectos con orDie. Una selección expresa solicita el subcaso incluso con el perfil familiar por defecto. No se inventa una fecha para hacer pasar el caso.
- **RTI-03:** perceptor, ascendientes y descendientes requieren edades enteras, no negativas y finitas antes de aplicar mínimos. Se comprueba también la edad cero. No se impone un máximo arbitrario ni se certifica elegibilidad familiar completa.
- **AUD-MODO:** al seguir la propagación se encontró otro consumidor que etiquetaba canónico pero ejecutaba legacy. El rango, sus dos ramas y la serie anual transmiten el modo. Cada año puede llevar su propia selección temporal; no se aplica la fecha de un ejercicio a otro. Rojo propio: cotización 285.841 frente a 287.508 céntimos para 60.000 euros en 2018.
- **CV2-01:** se rechazan claves con segmentos extra o campos no canónicos antes de sumar consignaciones. Una deducción no puede duplicarse bajo `codigo:extra:importe`. Se comprobaron los cuatro campos usados por los controles existentes: cumple, importe, base y unidades.
- **CV2-02:** ambas fechas del certificado riojano deben ser fechas civiles reales, no instantes normalizados por Date.parse. Febrero de 2025 no tiene día 29 ni 30 y abril no tiene día 31. Se conserva la distinción entre fecha de emisión y diagnóstico; esto no acepta el derecho fiscal.
- **CMV2-01:** el texto y las ayudas de conciliación distinguen la reconstrucción hasta 2014 del ajuste desde cuota suministrada. No se cambia el motor ni se presenta la conciliación como oracle independiente.

`rojo-retenciones.log` contiene cuatro casos fallidos; `rojo-contratos.log`, los dos casos adicionales. Los 49 tests focalizados pasan. IPC tiene informe y rojo separados en ../ipc-escenarios. Las correcciones y el nuevo AUD-MODO requieren contrarrevisión nueva.

## Preservación v2

PRE-01/02/03/04 se reprodujeron antes de editar. El parser rechaza claves repetidas y constantes ajenas a JSON. Un schema cerrado valida campos, tipos enteros exactos, afirmaciones de autenticidad, adquisiciones y relaciones con dependencias. Las fechas se comprueban explícitamente con zona y calendario: la dependencia opcional del format checker no estaba instalada y una prueba adicional detectó esa carencia. No se sanea silenciosamente un paquete recibido.

Las URLs se clasifican por host, espacio documental, ruta e identificador. Se rechazan búsquedas libres, parámetros duplicados, puertos inválidos y rutas no clasificadas. Las familias BOE incluyen originales, consolidaciones, ELI, traducciones y reproducciones autonómicas con formatos definidos. Los endpoints adicionales se contrastaron con las adquisiciones conservadas; el conjunto final mantiene los 708 objetos originales. El primer plan provisional excluía 106 por falta de clasificación de rutas; no se usó para exportar y queda en scratch propio como diagnóstico. No se modificaron bytes de originales.

Se rechazan ancestros symlink al entrar en raíz, caché, documentos y destino. El protocolo sincroniza archivos tras permisos, directorio CAS, destino y padres antes del marcador final. Un fallo de sincronización no publica marcador. Son garantías locales bajo un operador cooperativo y un filesystem que respete fsync, no una transacción ante escritor hostil ni una simulación real de corte eléctrico.

Pasan 16 pruebas, Ruff y mypy con stubs de jsonschema. Se realizó exportación, restauración en otro directorio y verificación completa: **708 objetos, 974.801.535 bytes**. Manifiesto v2: `1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db`. El paquete y la restauración están bajo `.cache/orquestador-preservacion/` en la raíz principal. Se conserva el manifiesto v1 histórico. Elies eligió dejar la transferencia preparada: no hubo subida de objetos LFS ni gasto. Las copias locales no acreditan una custodia remota.

## Integración de evidencias

`preflight-entregas.json` documenta las tres entregas contra ed6a43fd: todos los 3.929 archivos base presentes en cada worktree, cero borrados y rutas nuevas dentro de su propiedad. Copia por archivo con SHA-256 y tamaño: 20 archivos de adaptador, 257 autonómicos y 433 estatales, más sobres de entrega. Los informes originales describen su alcance y bloqueos.

Se integra el adaptador de cinco entidades sin conectar todavía el generador ni las rutas de blobs. Sus pruebas ahora usan scratch y pines de ejecución actuales, sin reescribir el informe del autor ni objetos documentales versionados. Preparar pines en un test no constituye aprobación editorial para publicar. La prueba positiva ejecuta el coordinador real; no se confía en un recibo fabricado.

Las 319 propuestas estatales y 136 autonómicas se conservan como candidatas. No se registran por igualdad numérica ni se amplía el alcance de decisiones previas. Falta exposición efectiva de helpers, integración CAS, adaptación explícita de contratos de decisión y revisión independiente de cada enlace. Estos bloqueos pasan a la siguiente ronda.

## Validación integrada

Pasan **517 pruebas en 41 archivos**; aparte, 15 pruebas de contenido y 16 de preservación. No sumar los recuentos focalizados solapados. Lint y typecheck principal/vendor correctos. Los once snapshots históricos verifican. CI ejecuta el test de evidencia en el job que dispone de Nix y la prueba Python de preservación en el entorno fijado del corpus.

Inventario: 50.684 ocurrencias (22.849 sintácticas, 16.108 efectivas, 11.727 seleccionadas), 112 fuentes TS y una Python. Permanecen 28.061 unidades pendientes. Contenido: 50.737 fichas, incluyendo cuatro conceptos y 49 puntos de rastro. Snapshot `7dd9c9c6147b6b1931b51944c885abd528550c27b5a3c31392b37e01be9f712d`. Ninguno de esos contadores mide reglas fiscales certificadas.

El payload madrileño actual `c63794f9cea15c1ed8d736ed4719253e058d4616e83ed22d3ac02506e1035dd2` fija el nuevo inventario, manteniendo el original y la ocurrencia. El anterior queda en historial. No se migra atestación: revisión del binding pendiente, autenticidad histórica indeterminada.

Incidencias de herramientas resueltas: primera generación sin python3 en el shell Nix; Ruff de wheel no ejecutable en NixOS; tipos Python sin stubs. Se repitieron con los entornos correctos. La validación de listas de objetos del schema se implementa en tiempo lineal para evitar comparación cuadrática del manifiesto. Las dos suites legacy pesadas, la conciliación completa del Excel, conexión anual de trabajo/actividades y aceptación jurídica exhaustiva siguen pendientes. No se inició la limpieza final.
