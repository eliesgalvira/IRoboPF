# anual.ss.solidaridad-empresarial

Recorrido del candidato histórico en EUR anual, instancia 0, desde caso.anio/contexto.modo y caso.rendimientos.trabajo[*].importeIntegroCentimos hasta origen.decimal.

El programa compartido está en fragmento.json.gz. Sus dos annualBindings ordenados calculan rendimientoIntegroTrabajo y cotizacionesSociales; globalBindings resuelve cada llamada, función y tabla. Los callbacks capturan el entorno de esta invocación. outputBindings selecciona exactamente esta expresión: lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:38068:38111:get. La llamada final es lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:37939:38430:call; instancia lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:38042:38043:literal. No se identifica con otra salida por igualdad de importe.

recorridos.json.gz conserva argumentos efectivos, bindings, rama/celda/índice y decimal final para ambos modos y todos los años, más las dos saturaciones de 2018 en la batería numérica de 684 casos. Las fuentes se identifican por rango UTF16/archivo/hash en cada operación. Las dimensiones por función/campo/celda constan en unitContracts/fieldUnits/cells. El programa conserva semillas, orden Decimal, condiciones y propiedades; la prosa no sustituye su ejecución.

Objeción: el recorrido de un caso no demuestra exhaustividad. Respuesta: se incluyen ambas ramas en el programa y discriminantes por obligación, con revisión posterior obligatoria. Coste: conservación de trazas y revisión del contrato finito.

valueClosed/selectionClosed son derivados técnicos candidatos de inspectSS; un pendiente abre ambos. La cota conservadora exige todas las obligaciones SS. Admision anual-publico-r32 externa: admissionClosed=false y siteClosed=false. No acepta norma, elegibilidad ni cuota mensual TGSS.

Expresión de software recibida como referencia: if(canonico,weighted(bandas,tiposSolidaridad[anio].empresa),totalLegacy*5/6). Selección: 2025/2026 empresa [0,1,2]; legacy tags y exceso<=0. Las reservas históricas se conservan en R34; la instancia concreta de salida queda fijada por el ancla exacta indicada arriba.


En el programa, los campos del resultado canónico y legacy conservan sus productores separados. No se intercambian cocientes, sumandos ni los ceros de diferentes unidades. El recorrido completo de condiciones/celdas/callbacks está en las operaciones alcanzadas de globalBindings y en las trazas de esta salida.
