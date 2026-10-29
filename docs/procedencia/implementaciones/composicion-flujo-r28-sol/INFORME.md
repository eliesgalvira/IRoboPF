# Composición de flujos R28: entrega parcial ejecutable

**No alcanza la implementación completa solicitada.** Se entrega contrato común, adaptadores, compositor desde AST, puertas ejecutables y contenidos por los65 sitios y19 etapas. Solo el recorrido de valor de `anual.pagos.retenciones` llega a terminales. Los otros64 sitios conservan bloqueos individuales; la admisión del dominio permanece pendiente en todos. No recomiendo integrar esto como composición completa ni hacer wiring público. No se declara cerrado el encargo global.

Runtime: T3 Code/Codex, gpt-6.1-sol, esfuerzo high; prioridad solicitada, sin recibo independiente del servicio efectivo. Trabajo personal, sin subdelegación, cambio de modelo, atestación ni operación VCS mutante. Base/HEAD `5e69c68077ffd18be20457160595adb3f0ff52e4`,15914 entradas. Solo adiciones en el ámbito autorizado y caché propia. El control físico inicial terminó antes de escribir código de producto; el final se entrega aparte. No se confunde diff vacío con árbol físico intacto.

Se consultaron BRIEF, AGENTS, contrato, coordinación, estado/decisiones actuales, los tres informes independientes de flujo, multiplicidadR27, recepcionesR25–R28 y rectificacionesR28. Sus restricciones actuales prevalecen sobre commits, limpieza y delegaciones del BRIEF. Las revisiones y inputs conservados se leen desde este checkout; no se leen entregas parciales ni checkouts de tareas activas. Una consulta general de procesos mostró incidentalmente líneas de otros procesos; no se usaron como fuente ni se inspeccionaron sus archivos. Las herramientas proceden de Nix y node_modules del padre se lee solamente. Se consultaron effect-solutions list/basics/testing y fuente local de Effect; no se escribe Effect ni se cambia cálculo fiscal.

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

Se reproduce primero el instrumento rojoR28, adaptando únicamente importación TypeScript y salida a scratch propio:54 comprobaciones,28 fallos conservados en rojos-recibidos.json, salida1. Los originales y sus esperados no cambian. La primera generación propia había quedado en cola y se canceló antes de ejecutarse para conservar ese orden. No se anuncia una suite histórica globalmente verde.

Pasan16 pruebas focalizadas propias: puertas y mutaciones, pertenencia de argumento, inventario de salidas/etapas sin aceptación por recuento, schema/determinismo, precisión del rastro y half-up, corte2018, modo canónico2018 frente a máximo legacy mutado, independencia del lado trabajador ante mutación empresarial, MEI por año/lado, saldo/cuota de activo, cliente único/discapacidad/rechazo, edad/exención y vitalicia2014/2015. Son ensayos de software, no16 reglas fiscales aceptadas. El loader transpila TS del checkout en memoria y resuelve dependencias externas existentes; no modifica el motor en disco ni ejecuta una copia de app del padre.

Tipos checkJs/TypeScript del alcance y oxlint con16 reglas anti-slop a error, un hilo y disable-nested-config terminan con0 en el pase de pruebas. No se ejecuta Next build ni suites legacy masivas. La última validación separada, tras ampliar solo la salida legible, fija generación, reconstrucción, tipos y lint; sus códigos se conservan en calidad-final.json.

Incidencias propias conservadas: tipos-inicial.log registra errores de inferencia/anotación que se corrigieron sin cambiar esperados. La generación inicial alcanzaba el límite global de18000 puertos por repetir productores; se conserva generacion-inicial.json. El cache posterior comparte únicamente contexto de entrada y llamada/propiedad, no nombres de función. Se detectó además una clasificación incorrecta del parámetro de callback e como entrada pública; se corrigió y añadió regresión. No se acepta su anterior cierre. Un editor auxiliar tuvo un TypeError por reasignar una constante; se repitió solo la edición pendiente.

El primer cotejo usó Python estándar de Nix directamente en scratch, sin uv/run.sh ni las variables exigidas. Es una desviación de herramientas, no una prueba correcta de ese requisito; no creó entorno en tools. El final utiliza el instrumento Node entregado. No se oculta el fallo ni se atribuye a los originales.

## Decisiones, objeciones y coste

Las cuatro decisiones de CONTRATO.md fijan objeción experta, respuesta y coste. Se añade: compartir productores por contexto de entrada y llamadas AST evita agotar el presupuesto recorriendo varias veces el mismo cálculo. Objeción: compartir por nombre uniría invocaciones distintas. Respuesta: la clave incluye archivo/rango, propiedad, contexto de llamada, unidad y rol; callbacks sin instancia permanecen bloqueados. Coste: algunos bucles requieren un contrato cuantificado adicional y no se declaran cerrados.

La limitación central es de la implementación entregada, no un fallo de entorno que pueda contabilizarse como pase. El coste de conservarla candidata es terminar y contrastar los contratos pendientes antes de sustituirla por una versión completa. El padre debe contrastar todas las conclusiones nuevas.

## Conservación y transporte

No se modifican motor, adaptadores activos, confianza, inventario, snapshots, informes ajenos, ESTADO ni DECISIONES. Madrid mantiene identidad real2020 y estado pendiente; no se integra Madridv2. El registro activo continúa vacío. Los228 pares del ensayoR27 no se convierten en264; el BOE de42900459 bytes y el límite genérico permanecen fuera de este alcance. V4/R21 y v5r2/R26 conservan sus pins y reservas; Crossa siguev1, misma casa/dueño, sin independencia ni transferencia.

No hay adquisiciones oficiales nuevas ni originales que requieran un CAS nuevo. No hay PDF, entornos, node_modules ni copia ejecutable de la app en docs. Las evidencias AST son fragmentos técnicos comprimidos. Sin rediseño, UI, servidor, preview, publicación, LFS, gasto, transferencia externa, X, mensajes externos, commit, PR, main o deploy.

El manifiesto registra rutas relativas, SHA256, tamaño, baseSha256=null para adiciones y HEAD. Patch textual gzip y binarios por ruta/hash se ensayan con GNU patch en scratch propio, cotejando cada archivo reconstruido. Los controles mayores de1MB se comprimen. El cotejo final recorre lstat/readlink/bytes/modo de las15914 entradas contra un blob cada vez, además del diff. Esa conservación física no acredita fiscalidad. El manifiesto y los materiales de transporte declaran sus exclusiones autorreferentes.

La inferencia dimensional general también está incompleta: fuera de las conversiones monetarias explícitas, las unidades se propagan desde el consumidor. La igualdad de unidades de los puertos impide ciertos cruces, pero no demuestra por sí sola el tipo dimensional de cada multiplicando/divisor. No se presenta ese control como contrato dimensional completo. Debe resolverse junto a las firmas pendientes antes de usar el grafo para aceptar relaciones.

En la comprobación posterior de unidades se reclasificó la aplicación de primitiva monetaria como valor, separada de selección. La primera tentativa emitía una relación incompatible cuando el consumidor pedía otra unidad y fallaron tres pruebas propias. Se conservan pruebas-unidades-inicial.log y generacion-unidades-inicial.log. La corrección bloquea ese puerto antes de emitir la relación y exige el par exacto de unidades para cada conversión. No resuelve la inferencia dimensional general ni cambia el motor.
