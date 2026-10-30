# Coherencia de contratos, preservación y evidencias

El criterio de evidencia distingue integridad, autenticidad, interpretación, exactitud y aceptación. Las correcciones descritas no aportan por sí solas nueva aceptación fiscal ni atestación.

## Correcciones con pruebas previas

- **RTI-01, P1:** se rechaza antes de calcular una liquidación cuyo subcaso de retención pertenece a otro ejercicio. La comprobación se aplica a ambos modos; las retenciones realmente soportadas siguen siendo una entrada distinta. El rojo reproducía éxito y descuento de una retención de 2020 en el anual de 2025.
- **RTI-02:** el adaptador permite seleccionar fecha de pago o cierre; transmite esa elección y las cotizaciones del mismo modo al servicio. Los rechazos fiscales esperados se propagan por el canal tipado de Effect, sin convertirlos en defectos con orDie. Una selección expresa solicita el subcaso incluso con el perfil familiar por defecto. No se inventa una fecha para hacer pasar el caso.
- **RTI-03:** perceptor, ascendientes y descendientes requieren edades enteras, no negativas y finitas antes de aplicar mínimos. Se comprueba también la edad cero. No se impone un máximo arbitrario ni se certifica elegibilidad familiar completa.
- **AUD-MODO:** al seguir la propagación se encontró otro consumidor que etiquetaba canónico pero ejecutaba legacy. El rango, sus dos ramas y la serie anual transmiten el modo. Cada año puede llevar su propia selección temporal; no se aplica la fecha de un ejercicio a otro. Rojo propio: cotización 285.841 frente a 287.508 céntimos para 60.000 euros en 2018.
- **CV2-01:** se rechazan claves con segmentos extra o campos no canónicos antes de sumar consignaciones. Una deducción no puede duplicarse bajo `codigo:extra:importe`. Se comprobaron los cuatro campos usados por los controles existentes: cumple, importe, base y unidades.
- **CV2-02:** ambas fechas del certificado riojano deben ser fechas civiles reales, no instantes normalizados por Date.parse. Febrero de 2025 no tiene día 29 ni 30 y abril no tiene día 31. Se conserva la distinción entre fecha de emisión y diagnóstico; esto no acepta el derecho fiscal.
- **CMV2-01:** el texto y las ayudas de conciliación distinguen la reconstrucción hasta 2014 del ajuste desde cuota suministrada. No se cambia el motor ni se presenta la conciliación como oracle independiente.

`rojo-retenciones.log` contiene cuatro casos fallidos; `rojo-contratos.log`, los dos casos adicionales. Los 49 tests focalizados pasan. IPC tiene informe y rojo separados en ../ipc-escenarios. Las pruebas de implementación no sustituyen el contraste independiente de estas correcciones y AUD-MODO.

## Preservación v2

PRE-01/02/03/04 se reprodujeron antes de editar. El parser rechaza claves repetidas y constantes ajenas a JSON. Un schema cerrado valida campos, tipos enteros exactos, afirmaciones de autenticidad, adquisiciones y relaciones con dependencias. Las fechas se comprueban explícitamente con zona y calendario: la dependencia opcional del format checker no estaba instalada y una prueba adicional detectó esa carencia. No se sanea silenciosamente un paquete recibido.

Las URLs se clasifican por host, espacio documental, ruta e identificador. Se rechazan búsquedas libres, parámetros duplicados, puertos inválidos y rutas no clasificadas. Las familias BOE incluyen originales, consolidaciones, ELI, traducciones y reproducciones autonómicas con formatos definidos. Los endpoints adicionales se contrastaron con las adquisiciones conservadas; el conjunto final mantiene los 708 objetos originales. El primer plan provisional excluía 106 por falta de clasificación de rutas; no se usó para exportar y queda en scratch propio como diagnóstico. No se modificaron bytes de originales.

Se rechazan ancestros symlink al entrar en raíz, caché, documentos y destino. El protocolo sincroniza archivos tras permisos, directorio CAS, destino y padres antes del marcador final. Corrección posterior PREV2-02: antes del enlace final, un fallo deja el destino sin marcador; después del enlace puede quedar visible con durabilidad indeterminada. Véase correcciones/preservacion-v3/INFORME.md. Son garantías locales bajo un operador cooperativo y un filesystem que respete fsync, no una transacción ante escritor hostil ni una simulación real de corte eléctrico.

Pasan 16 pruebas, Ruff y mypy con stubs de jsonschema. Se realizó exportación, restauración en otro directorio y verificación completa: **708 objetos, 974.801.535 bytes**. Manifiesto v2: `1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db`. El paquete y la restauración están bajo `.cache/orquestador-preservacion/` en la raíz principal. Se conserva el manifiesto v1 histórico. Las copias locales no acreditan una custodia remota.

## Integración de evidencias

Se integra el adaptador de cinco entidades sin conectar todavía el generador ni las rutas de blobs. Sus pruebas ahora usan scratch y pines de ejecución actuales, sin reescribir el informe del autor ni objetos documentales versionados. Preparar pines en un test no constituye aprobación editorial para publicar. La prueba positiva ejecuta el coordinador real; no se confía en un recibo fabricado.

Las 319 propuestas estatales y 136 autonómicas se conservan como candidatas. No se registran por igualdad numérica ni se amplía el alcance de decisiones previas. Falta exposición efectiva de helpers, integración CAS, adaptación explícita de contratos de decisión y revisión independiente de cada enlace. Estos bloqueos limitan el alcance del candidato.

## Validación integrada

Pasan **517 pruebas en 41 archivos**; aparte, 15 pruebas de contenido y 16 de preservación. No sumar los recuentos focalizados solapados. Lint y typecheck principal/vendor correctos. Los once snapshots históricos verifican. CI ejecuta el test de evidencia en el job que dispone de Nix y la prueba Python de preservación en el entorno fijado del corpus.

Los contadores de ocurrencias, fichas y unidades pendientes son métricas del inventario técnico; no miden reglas fiscales certificadas.

La regeneración conserva original y ocurrencia de Madrid. No migra atestación: el binding conserva revisión pendiente y autenticidad histórica indeterminada.
