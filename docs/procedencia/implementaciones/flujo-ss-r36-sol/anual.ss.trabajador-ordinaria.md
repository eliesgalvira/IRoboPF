# anual.ss.trabajador-ordinaria

Recorrido candidato en EUR anual, instancia 0, desde caso.anio/contexto.modo y caso.rendimientos.trabajo[*].importeIntegroCentimos hasta origen.decimal.

El programa compartido está en fragmento.json.gz. Sus dos annualBindings ordenados calculan rendimientoIntegroTrabajo y cotizacionesSociales; globalBindings resuelve cada llamada, función y tabla. Los callbacks capturan el entorno de esta invocación. outputBindings selecciona exactamente esta expresión: lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:37008:37058:get. La llamada final es lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:36882:37269:call; instancia lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:36982:36983:literal. No se identifica con otra salida por igualdad de importe.

recorridos.json.gz conserva argumentos efectivos, bindings, rama/celda/índice y decimal final para ambos modos y todos los años, más las dos saturaciones de 2018 en la batería numérica de 684 casos. Las fuentes se identifican por rango UTF16/archivo/hash en cada operación. Las dimensiones por función/campo/celda constan en unitContracts/fieldUnits/cells. El programa conserva semillas, orden Decimal, condiciones y propiedades; la prosa no sustituye su ejecución.

Objeción: el recorrido de un caso no demuestra exhaustividad. Respuesta: se incluyen ambas ramas en el programa y discriminantes por obligación, con revisión posterior obligatoria. Coste: conservación de trazas y revisión del contrato finito.

valueClosed/selectionClosed son derivados técnicos candidatos de inspectSS; un pendiente abre ambos. La cota conservadora exige todas las obligaciones SS. Admision anual-publico-r32 externa: admissionClosed=false y siteClosed=false. No acepta norma, elegibilidad ni cuota mensual TGSS.

Expresión de software recibida como referencia: base*(.047+.0155+0+.001+0). Selección: lado trabajador de cinco categorías. Las reservas históricas se conservan en R34; aquí la instancia concreta de salida tiene este origen exacto, sin buscar por cifra:

```ts
crearLineaCalculo({
              siteId: "anual.ss.trabajador-ordinaria",
              instancia: 0,
              importe: cotizacionesSociales.cotizacionTrabajadorOrdinaria,
              unidad: "EUR",
              etiqueta: "Cotización del trabajador ordinaria",
              formula:
                "Base ordinaria x tipos del trabajador sin MEI ni solidaridad",
            })
```

En el programa, los campos del resultado canónico y legacy conservan sus productores separados. No se intercambian cocientes, sumandos ni los ceros de diferentes unidades. El recorrido completo de condiciones/celdas/callbacks está en las operaciones alcanzadas de globalBindings y en las trazas de esta salida.
