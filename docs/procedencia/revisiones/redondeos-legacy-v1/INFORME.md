# Revisión independiente de redondeos legacy v1

Base comprobada: eaed990c620b5fc4d3ff2e74dc68e0c8481c43db. Revisión personal, sin subdelegación ni fixes. Solo se escribe en esta carpeta absoluta del padre. No se cambia el fixture canonical-tabular-hashes.json, código, originales, package, lockfiles, CI, ESTADO ni DECISIONES. No hay operaciones VCS mutantes, PR, despliegue ni borrados.

## Método y decisión

Se extraen las 18 hojas del original ZIP/XML en una única pasada secuencial bajo flock /tmp/irobopf-validacion-pesada.lock. La extracción resuelve nombres y relaciones reales, conserva dimensiones y comprueba direcciones, filas, columnas, tipos y ausencia de fórmulas. Los esperados son valores del archivo; el motor solo genera el lado observado. Cada hoja deja un parcial persistido. Hashes independientes en hashes-excel-independientes.json, detalle y distribución en resultados.json; originales y fuentes quedan fijados en integridad.json.

Objeción experta: regenerar el fixture desde el mismo motor produciría una prueba circular, y un hash solo no explicaría dónde falla. Decisión: canonicalización independiente idéntica a la definida por el helper y contraste simultáneo por celda, con primeras discrepancias y distribución. Coste: una pasada completa de 32 millones de celdas y conservación de evidencia nueva. La canonicalización pierde precisión inferior al céntimo, incluido el multiplicador IPC con cuatro decimales; no acredita identidad binary64. Se cuentan por separado diferencias crudas de serialización y no se permite tolerancia de un céntimo.

## Hallazgos y decisión de integración

RLV1-01. El fixture viejo no es evidencia extraída del Excel. El helper construirFixtureCanonicoDesdeTablasEffect genera expresamente los hashes desde TypeScript aunque source nombre el Excel. El fixture permanece intacto. rojos.mjs contrasta la extracción nueva contra el fixture y contra el motor y conserva fallos reales en rojos.log. Propuesta al padre: conservar el antiguo como caracterización de TS previo y adoptar los hashes independientes como contrato de reproducción Excel solo mediante una decisión explícita. Objeción: sustituir todos los hashes sin separar procedencias ocultaría una regresión histórica. Coste: mantener dos contratos con nombres y alcances distintos. No convertir un verde de DAT en verde global de las 18 hojas.

RLV1-02. Baseline COMPARATIVA_INFLACION: 1.290 filas, 16.770 celdas, 69 diferencias canónicas. Todas son motor menos Excel = +1 céntimo; columnas K:15, L:53, J:1. Primeras: K5 16206.19 frente a 16206.18 y L13 28.74 frente a 28.73. Se conservan ambas hojas CONTROL sin diferencias, 195 + 348 = 543 celdas, y las tres hojas no detalle en la evidencia nueva. Objeción: corregir aquí inflación mezclaría propietarios y versiones. Decisión: registrar el defecto de esta base y dejar su corrección al checkout asignado. Coste: esta revisión no cierra ni verifica esa futura implementación.

La adaptación del test de caracterización mantiene cálculo unitario e IPC contra su fixture previo y coteja solo detalle contra la ejecución independiente de cuerpos Python originales. Se revisaron oracle_caracterizacion.py, la salida, el test y los rojos de la entrega inicial: D32, E12 y W12 fallaban antes; Q2 ya pasaba. La corrección de 20000 euros en 2012, tramo e íntegra 3979.30 frente al TS anterior 3979.31, tiene referencia al XML original y no una expectativa inventada. No se cambió el oracle histórico.

## Tipos, orden y límites

El original usa np.arange entero, np.int64; oracle_caracterizacion.py cambia el iterable a np.float64 para permitir salarios no enteros. No son literalmente el mismo experimento. boundaries.py vuelve a compilar solo obtener_parametros, calcular_cuotas_por_tramo y procesar_ano, sin ejecutar el generador Excel. Contrasta ambos tipos donde el salario es entero y reproduce los casos no enteros como extensión de caracterización. boundaries.json conserva tipos de cuotas en igualdad de tramos y vecinos binary64, topes y solidaridad. Se contrasta el resultado con detalle-tabular sin modificarlo.

La elección del primer operando en min a igualdad del tope conserva NumPy; al superarlo, el tope constante produce float Python. Tramos agotados operan con constantes Python y el parcial con NumPy. La adaptación mantiene orden de sumas, solidaridad y restas antes de redondear columnas. En igualdad de límite el map puede producir un cero NumPy adicional frente al break original; el tramo de igualdad ya ha convertido la suma a NumPy. No se observa por ello un cambio de redondeo.

RedondearPython descompone binary64 y decide el empate mediante enteros; redondearNumpy escala primero y desempata al par. No se usa epsilon. Los casos ±2.675 separan ambos contratos (±2.67 y ±2.68). Se prueban cero con signo, subnormales, negativos y decimales 0–4; los salarios negativos son ensayos técnicos, no entradas fiscales aceptadas. La mensualización de céntimos conserva Math.round y su asimetría; los porcentajes mantienen HALF_UP. Ninguno de estos contratos constituye una regla TGSS o fiscal general.

Objeción experta: un helper exportado que recibe number no garantiza equivalencia universal con Python. Decisión: limitar la conclusión al dominio contrastado y exponer los casos fuera del rango; no cambiar algoritmos en una revisión. Coste: no se promete corrección para decimales negativos/fraccionarios, escalados desbordados o magnitudes arbitrarias. El documento del implementador ya restringe a decimales enteros pequeños y salarios del perfil; esa restricción no es una validación runtime del helper.

## Integridad y alcance documental

Integridad: hashes SHA-256/SHA-512 del original y fuentes, base fija y presencia de archivos. Autenticidad: no se acredita autoría ni entorno histórico del Excel. Interpretación: reproducción de fórmulas legacy, sin afirmar vigencia. Exactitud: se refiere al contrato canónico de las celdas y a los casos Python expresamente ejecutados. Aceptación: no hay aceptación fiscal ni promoción de registros o atestaciones.

Crossa se mantiene como copia v1 histórica, misma casa y propietario, comunicada por el coordinador; esta revisión no la verifica ni la llama remota o independiente. No se toca v1 preservado, v2, restauraciones, contexto ni Reactivity. No hay LFS, gastos ni transferencias externas.

Los scripts y comandos de reproducción están en COMANDOS.md y validar.sh. validacion/ es una copia de trabajo para comprobaciones, no código para integrar. No se ejecuta Next build ni ninguna suite legacy completa adicional. Los resultados finales medidos se incorporan en el apartado siguiente.

## Contraste completo terminado

15 hojas DAT, 1.500.015 filas de datos y 32.700.327 celdas, con cero diferencias canónicas. Cabeceras y número de columnas coinciden en todas: 23 columnas en 2012–2014, 21 en 2015–2020 y 22 en 2021–2026. Cada hoja contiene exactamente salarios enteros de 0 a 100000 y filas Excel 2–100002. Dimensiones: A1:W100002, A1:U100002 y A1:V100002 respectivamente. La comprobación cubre cada dirección, no solo primeras/últimas filas.

Las 18 hojas suman 32.717.640 celdas de datos y 1.501.407 filas; las cabeceras se verifican aparte. No se suman a estas cifras los ensayos focalizados solapados. El comparador registró RSS de aproximadamente 106–184,6 MB en cierres de hoja; no es una medición del pico agregado del proceso Python y Bun. Techo virtual de cada proceso del contraste: 5.000.000 KiB. Un único generador de hoja activo, sin pools; Python productor y Bun consumidor se comunican por una tubería con contrapresión.

Las celdas D32 = 1.9, E12/W12 = 9.36 y Q2 = 1274.87 se conservan en samples de DAT_2012. El texto decimal 9.359999999999999 citado en la entrega anterior se representa como el mismo binary64 9.36. En esta extracción, rawDifferences es cero en las 15 hojas DAT: no se observan discrepancias adicionales de Number. Esto no equivale a identidad de las cadenas XML.

## Fronteras y caracterización ejecutadas

606 filas de fronteras contrastadas exactamente contra Python, sin diferencias. Se incluyen 120 casos con salarios enteros ejecutados con ambos tipos NumPy; todos coinciden. Se repiten los 165 casos de caracterización del padre: 157 enteros coinciden entre np.int64 y np.float64; ocho son no enteros y solo acreditan la extensión float64. Las 165 filas coinciden con caracterizacion-python.json. No se infiere equivalencia de tipos para todos los enteros de 64 bits fuera del rango representable exactamente por binary64.

65 pares valor/decimales, cada uno contrastado con round Python y NumPy. Se detecta un límite real fuera del dominio salarial declarado: redondearPython(56294995342131.5, 3) devuelve 56294995342131.51, mientras Python devuelve 56294995342131.5. El BigInt ya redondeado se convierte a Number antes de dividir, provocando una segunda pérdida de precisión. RLV1-03, observación de alcance, no bloqueo de DAT 0–100000. Los demás casos ensayados, incluidos subnormales y negativos, coinciden. Objeción experta: una API number sin guardas puede usarse fuera de su dominio. Propuesta: explicitar y eventualmente validar el dominio o implementar conversión final correctamente redondeada, después de un rojo; coste: contrato más estrecho o complejidad adicional. Esta revisión no aplica el fix.

Pruebas existentes: 31 correctas en cuatro archivos, un trabajador. Typecheck de lib y pruebas seleccionadas, con configuración estricta de base y sin incremental: correcto. No es typecheck de todas las pantallas ni suite global. El primer intento de lint encontró un error de invocación de oxlint por rutas con '..'; ESLint ignoró los dos scripts fuera de base y uv no pudo ejecutar el wheel de Ruff en NixOS. Esos intentos no se cuentan como validación de los scripts; se repiten desde esta carpeta con rutas sin '..' y Ruff de Nix. Se conservan los logs originales.

Integridad final: original de 151.830.635 bytes, SHA-256 106c8cd765c60d587938939fff5b0dec8ff1ea76b690eee142fc59e16739c1a7, coincidente con la entrega anterior; SHA-512 completo en integridad.json. Las 6.005 entradas del árbol base están presentes. Dos son enlaces simbólicos históricos de preservacion-v2 a un directorio, no archivos regulares; se distinguen en nonRegular y no se cuentan como borrados ni se recorren. El primer chequeo is_file los marcaba como no archivos; se precisó el criterio de presencia con exists/is_symlink sin alterar esos enlaces.

Los 17 rojos de rojos.log corresponden a 16 hashes antiguos distintos del Excel (15 DAT y comparativa) y a la comparativa del motor actual. Los dos controles antiguos sí coinciden. No se ejecutó de nuevo una suite pesada para producir estos rojos: son aserciones sobre los hashes independientes ya extraídos.

Repetición de lint: oxlint 0, ESLint 0 y Ruff 0 (lint-final-status.log). Oxlint mantiene las 16 reglas a error, sin baseline ni desactivaciones. ESLint emite únicamente el aviso de que la copia acotada no contiene pages; no ignora los scripts en este pase. No se añade una carpeta de aplicación ni se desactiva una regla para ocultarlo. Los scripts de revisión son JavaScript de orquestación y Python de extracción; no son código Effect nuevo ni archivos renombrados para evadir diagnósticos. Las fuentes TypeScript examinadas pasan lint y typecheck en su copia idéntica.

## Entrega al padre

Integrar únicamente los archivos enumerados en MANIFIESTO.json, todos nuevos, con path/sha256/size/baseSha256=null. entrega.patch contiene sus altas textuales (excluye el manifiesto y a sí mismo para evitar autorreferencias). La carpeta validacion/ y sus enlaces son infraestructura local no integrable y quedan conservados, sin borrarlos. No se entrega ningún binario nuevo. La integridad de los archivos de entrada y los dos hashes del Excel permiten repetir el contraste contra la misma base.

Dictamen: reproducción DAT aceptable dentro del contrato técnico completo cotejado, con controles preservados. El fixture viejo necesita una decisión de procedencia; inflación de esta base sigue roja; el helper Python no es universal fuera del dominio declarado. No hay aceptación fiscal automática ni recomendación de usar las fórmulas legacy como legislación vigente.
