# Revisión independiente del contrato 2025

**Dictamen: desfavorable para integrar el consumidor sin resolver R01–R03.** Revisión técnica del commit `37eb33d02955e5b0858d5f0b144caa1d4d31fe6c`, HEAD verificado antes de escribir. No valida las 351 normas ni acepta jurídicamente ninguna deducción. No se hicieron cambios de producto ni fixes.

## Defectos reproducidos

| ID | Severidad | Resultado y consecuencia |
| --- | --- | --- |
| R01 | Alta | `verificar.py:132–151` contrasta los tres dictámenes actuales entre sí, pero no con `comparaciones`. Con dictámenes `coincide` acepta una comparación explícitamente **actual** `diferencia`, con valor 90 frente a regla 100 y contraejemplo; también acepta una comparación actual `no_verificable` sin pendientes. El resumen puede ocultar contradicciones y reservas que ya constan en el propio paquete. |
| R02 | Media | `verificar.py:103–104` identifica documento y adquisición como una sola entidad. Dos lotes con el mismo manual y bytes correctos, recuperados a horas diferentes, fallan por metadatos contradictorios si comparten ID; con IDs independientes fallan por hash repetido. Las dos adquisiciones legítimas no son expresables conservando sus fechas. El positivo con metadatos compartidos idénticos sí pasa. |
| R03 | Media | `verificar.py:100` busca `[?&]token=` sobre `url.query`, que ya no contiene `?`. El primer parámetro `token` sintético pasa; el mismo parámetro en segunda posición se rechaza. Una URL de descarga autenticada podría terminar en el manifiesto público pese al filtro anunciado. No se probaron credenciales reales ni se publican datos de sondeos privados. |

Los casos R01 distinguen expresamente comparaciones actuales de diferencias históricas corregidas. Una corrección deberá preservar esa distinción; rechazar indiscriminadamente toda comparación `diferencia` rompería el positivo histórico. R02 requiere separar identidad de contenido y adquisición, o una representación aditiva equivalente; no se propone modificar hashes ni inventar fechas.

## Evidencia y expectativas

[casos.py](casos.py) ejecuta 25 casos independientes: **20 pasan y cinco quedan rojos** (tres fallos de aserción por aceptación indebida y dos errores por rechazo de adquisiciones válidas). No se usan `xfail`, fixes ni expectativas adaptadas para hacer pasar defectos. [hallazgos.json](hallazgos.json) relaciona defectos y casos.

El positivo completo fabrica en memoria 351 registros inequívocamente sintéticos, con dos fuentes HTML, citas/localizadores, manual, vigencia, comparaciones y CAS externo con tamaños y SHA-256/SHA-512 coherentes. No se guarda como resultado fiscal. El parcial recibe un lote completo; se rechazan omisiones internas, comunidad incorrecta, duplicados, campos obligatorios ausentes, citas anidadas rotas, manual cruzado, rangos vacíos y diferencias sin discriminante. Se comprueban tamaño, SHA-512, objeto ausente y escape por symlink, además de userinfo, campos privados y posición de parámetros URL. Los fixtures y logs se conservan fuera de Git, sin consultar ni modificar originales fiscales.

Reproducción desde la raíz, con `REVIEW_TMP` y `UV_CACHE_DIR` fijados por el operador a directorios privados externos existentes:

```sh
nix shell nixpkgs#python3 nixpkgs#uv --command uv run --no-project --python python3 --no-managed-python --with jsonschema==4.26.0 python docs/procedencia/deducciones-2025/revisiones/contrato/casos.py
```

El comando termina con código 1 por las cinco pruebas rojas conservadas. Un caso individual se selecciona añadiendo, por ejemplo, `Contrato.test_positivo_completo_cas` o `Contrato.test_R03_url_primer_parametro`.

Se reprodujeron **10/10 pruebas originales** y lint con **cero errores y 18 avisos** preexistentes. El typecheck global reproduce exactamente cuatro diagnósticos: tres TS2307 por módulos de caché ausentes en pruebas r47/r52 y un TS7006 en r52. Ninguno señala archivos del contrato; el segundo paso del typecheck encadenado no se ejecuta tras fallar el primero. No se corrigió deuda ajena ni se ejecutaron build o suites legacy pesadas.

## Compatibilidad, objeciones descartadas y límites

La inspección del diff confirma una propiedad opcional y export aditivos, sin cambios en helpers o regionales. Las diez pruebas confirman los 351 códigos, referencia pendiente en catálogo/literales y conservación de identidad del literal comprobado. La referencia candidata explícita conserva identidad y no se promueve a aceptación. El accessor no importa JSON ni realiza IO; el JSON pesado y el consumidor quedan fuera de ese módulo. No se afirma haber construido o medido el bundle.

Se descarta como defecto exigir comparación histórica cuando `dictamenAntes` era `diferencia`: un paquete con contraejemplo histórico, cambio/prueba roja, comparación histórica explicada en `motivo` y comparación actual coincidente **pasa**. No se interpreta esa diferencia corregida como una discrepancia actual. También pasa un global `no_verificable` con reserva concreta, y se rechaza `coincide` cuando el dictamen de cálculo ya declara ese límite. R01 es el hueco distinto entre comparaciones y dictámenes.

Cobertura completa sin CAS declara honestamente `no_comprobada`; es un eje separado documentado, no un defecto. La oficialidad de dominios, reextracción literal, interpretación fiscal, efectividad de las pruebas narradas y suficiencia jurídica de reservas no están implementadas ni se anuncian verificadas. El filtro de privacidad se presenta como defensa parcial, no como garantía general; R03 es una omisión reproducida dentro de un patrón concreto que sí pretende rechazar. No se exige resolver toda posible URL o dato personal. No se descargaron páginas ni se ejecutaron recetas arbitrarias.

La revisión añade exclusivamente informe, hallazgos y casos en esta carpeta. El cotejo final verifica todos los archivos base sin alteración y cero borrados; hashes y manifiesto de transporte se entregan exclusivamente en privado. La aceptación normativa de las 351 fichas corresponde a sus auditores y a la revisión posterior de sus evidencias.
