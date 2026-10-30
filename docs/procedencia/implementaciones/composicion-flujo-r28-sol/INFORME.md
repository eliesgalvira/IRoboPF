# Composición de flujos R28: entrega parcial ejecutable

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

**No alcanza la implementación completa solicitada.** Se entrega contrato común, adaptadores, compositor desde AST, puertas ejecutables y contenidos por los65 sitios y19 etapas. Solo el recorrido de valor de `anual.pagos.retenciones` llega a terminales. Los otros64 sitios conservan bloqueos individuales; la admisión del dominio permanece pendiente en todos. No recomiendo integrar esto como composición completa ni hacer wiring público. No se declara cerrado el encargo global.

Base del candidato documentado: `5e69c68077ffd18be20457160595adb3f0ff52e4`.

## Implementado

`flujo-ast.mjs` coteja cada fuente cargada contra el blob de la base, conserva SHA256, índices UTF16 y nodo AST exacto. Comprueba argumentos por identidad dentro de su llamada, no por texto homónimo. Resuelve bindings lexicales, imports relativos explícitos y sustituciones por propiedad. Las fuentes alteradas bloquean la derivación.

`flujo-adaptadores.mjs` normaliza los tres vocabularios a productor→consumidor, conservando identidad de registro, propiedad, condición y evidencia. Cada relación histórica tiene disposición individual; sus ambigüedades no se convierten en aristas demostradas. `historical`/`historicalNodes` y la ficha histórica conservan los registros y reservas sin reescribir los lotes. Los cuatro inputs R28 están fijados por su manifiesto y siguen pendientes de revisión independiente.

`flujo-componer.mjs` parte del argumento importe de cada llamada real crearLineaCalculo, no de listas por sufijo. Sigue propiedades de objetos, llamadas con bindings concretos, condicionales, primitivas monetarias, constructores y operaciones Decimal; conserva selección de función y Match con precedencia expresada. Los índices estáticos se distinguen de los dinámicos. El subconjunto está documentado en CONTRATO.md. Las formas no admitidas producen unresolved con puerto/fuente, incluso funciones con auxiliares pendientes, retornos imperativos, callbacks y servicios. El pequeño evaluador de constantes no ejecuta TS y bloquea spreads.

`flujo-fronteras.mjs` conserva firmas y argumentos concretos de DA61, monetarias, diferencial, derechos, cuotas y SS, separando cada salida. No utiliza el comodín «campos de fórmula». Estos contratos de llamada son evidencia técnica, no prueba completa de la influencia de todos sus campos. Los bindings y condiciones aún no resueltos siguen bloqueando su sitio.

Aporte y etapas son propiedades distintas. Las19 llamadas etapa tienen fichas individuales, con argumento4 AST, regla, instancia, condición y reserva anual. El saldo del activo no se incorpora a aporte. Los activos de esas dos primeras instancias no se hacen alcanzables desde anual. La API aislada no recibe por defecto la exclusión anual de activos/discapacidad.

El compositor entrega composicion.json.gz, omisiones.json.gz y fichas legibles en sitios/ y etapas/. Cada sitio incluye fórmula TS, mapa de productores, condiciones y referencia a evidencia exacta. El cierre de valor no equivale a admisión, pago realizado, autenticidad documental o aplicabilidad jurídica. `completeRuleAcceptance=false`, `wiringAllowed=false`; relaciones nuevas pending-independent.

`flujo-contrato.mjs` rechaza duplicados, referencias inexistentes, fuentes/rangos, terminales no declarados, bindings de otra llamada, unidades incompatibles, ausencia de evidencia, estados promovidos y cierres con unresolved. La puerta adicional verifyCandidate reconstruye toda la receta contra los inputs fijados: borrar una relación o cambiar rol, instancia, lado/año codificado o conversión no pasa por declarar otro hash. Esta igualdad protege la receta; puede conservar un error del autor y no se vende como analizador universal ni revisión independiente.

## Pendiente sustantivo

El archivo omisiones enumera por sitio cada puerto bloqueado con fuente, símbolo, propiedad, instancia, unidad y motivo. **No sustituye la implementación restante.** Faltan contratos ejecutables completos para folds/mapas y estados mutables, servicios/admisión, índices y arrays dinámicos, alias/spreads y las formas imperativas conservadas. El compositor conserva argumentos y condiciones en esos puntos, pero no acredita sus cierres.

En particular, falta cerrar DA61/80bis y derechos por sus consumidores reales; resolver las ramas de escalas/publicadas sin tratar ausencia como otra llamada; completar las condiciones de actividad/inicio y exenciones por rama; y acreditar de extremo a extremo cada componente SS por modo/lado/año y los retornos/presentación del subcaso de retención. Los casos de TS contrastan propiedades concretas; no reemplazan esos contratos. Los hechos del subcaso no se sustituyen por anuales ni se equiparan soportadas declaradas con estimadas.

Las constantes false2012–2015, ocho ramas rectificadas y los rangosR28 se conservan como inputs candidatos; esta entrega no acepta la revisión paralela. Ahorro no recibe publicadas que no se pasan. No se acepta una regla por coincidir su código con una fórmula ni por contar65 sitios.

## Casos y resultados

Se reproduce primero el instrumento rojoR28, adaptando únicamente importación TypeScript y salida a scratch propio:54 comprobaciones,28 fallos conservados en rojos-recibidos.json, salida1. Los originales y sus esperados no cambian. No se anuncia una suite histórica globalmente verde.

Pasan16 pruebas focalizadas propias: puertas y mutaciones, pertenencia de argumento, inventario de salidas/etapas sin aceptación por recuento, schema/determinismo, precisión del rastro y half-up, corte2018, modo canónico2018 frente a máximo legacy mutado, independencia del lado trabajador ante mutación empresarial, MEI por año/lado, saldo/cuota de activo, cliente único/discapacidad/rechazo, edad/exención y vitalicia2014/2015. Son ensayos de software, no16 reglas fiscales aceptadas. El loader transpila TS del checkout en memoria y resuelve dependencias externas existentes; no modifica el motor en disco ni ejecuta una copia de app del integrador.

Tipos checkJs/TypeScript del alcance y oxlint con16 reglas anti-slop a error, un hilo y disable-nested-config terminan con0 en el pase de pruebas. No se ejecuta Next build ni suites legacy masivas. La última validación separada, tras ampliar solo la salida legible, fija generación, reconstrucción, tipos y lint; sus códigos se conservan en calidad-final.json.

La caché comparte únicamente contexto de entrada y llamada/propiedad. Los parámetros de callbacks sin instancia acreditada no se consideran entradas públicas; esta distinción tiene una regresión propia.

## Decisiones, objeciones y coste

Las cuatro decisiones de CONTRATO.md fijan objeción experta, respuesta y coste. Se añade: compartir productores por contexto de entrada y llamadas AST evita agotar el presupuesto recorriendo varias veces el mismo cálculo. Objeción: compartir por nombre uniría invocaciones distintas. Respuesta: la clave incluye archivo/rango, propiedad, contexto de llamada, unidad y rol; callbacks sin instancia permanecen bloqueados. Coste: algunos bucles requieren un contrato cuantificado adicional y no se declaran cerrados.

La limitación central es de la implementación entregada, no un fallo de entorno que pueda contabilizarse como pase. El coste de conservarla candidata es terminar y contrastar los contratos pendientes antes de sustituirla por una versión completa. Al integrar se debe contrastar todas las conclusiones nuevas.

## Conservación y transporte

No se modifican motor, adaptadores activos, confianza, inventario, snapshots, informes ajenos, ESTADO ni DECISIONES. Madrid mantiene identidad real2020 y estado pendiente; no se integra Madridv2. Los228 pares del ensayoR27 no se convierten en264; el BOE de42900459 bytes y el límite genérico permanecen fuera de este alcance. V4/R21 y v5r2/R26 conservan sus pins y reservas; Crossa siguev1, misma casa/dueño, sin independencia ni transferencia.

El [manifiesto](manifiesto.json) conserva los hashes y el contenido del paquete histórico; esa integridad no acredita fiscalidad.

La inferencia dimensional general también está incompleta: fuera de las conversiones monetarias explícitas, las unidades se propagan desde el consumidor. La igualdad de unidades de los puertos impide ciertos cruces, pero no demuestra por sí sola el tipo dimensional de cada multiplicando/divisor. No se presenta ese control como contrato dimensional completo. Debe resolverse junto a las firmas pendientes antes de usar el grafo para aceptar relaciones.

En la comprobación posterior de unidades se reclasificó la aplicación de primitiva monetaria como valor, separada de selección. La primera tentativa emitía una relación incompatible cuando el consumidor pedía otra unidad y fallaron tres pruebas propias. Se conservan pruebas-unidades-inicial.log y generacion-unidades-inicial.log. La corrección bloquea ese puerto antes de emitir la relación y exige el par exacto de unidades para cada conversión. No resuelve la inferencia dimensional general ni cambia el motor.
