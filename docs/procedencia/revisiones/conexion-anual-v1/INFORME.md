# Revisión de la conexión anual explícita, v1

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`. Esta revisión no acepta una liquidación completa ni promueve reglas o atestaciones.

## Alcance y método

Se examinaron integración-ronda10 y las revisiones trabajo-anual-implementacion, contratos-v2 y actividades-implementacion; seis archivos de conexión anual, informes, logs, manifiesto y parche, adaptadores y auxiliares consumidos y enlace del rastro. La revisión anterior de etapas no se atribuye a esta conexión.

Los sondeos importan la API exportada de esta base, sin mocks. `preparar.py` crea expectativas con Decimal de Python a 120 cifras, fórmulas independientes y filas publicadas; no consulta resultados del motor para definir lo esperado. Solo reutiliza la estructura de hechos de un caso EDS anterior. Todos los datos son sintéticos. `casos.json` fija entradas y expectativas; `resultados.json` conserva salidas y comparaciones. Los sondeos no sustituyen una declaración de Renta WEB ni acreditan hechos aportados.

Se usa una copia de validación dentro de la única carpeta autorizada, con node_modules enlazado para lectura. No se escribe en el checkout examinado. Preflight fija presencia de archivos de base y hashes de las copias. Los 25 tests del autor se ejecutan sin modificar. Las comprobaciones pesadas se serializan con el lock común y un trabajador. No Next build, suites legacy completas, regeneración del inventario, descargas documentales ni instalaciones globales.

## Decisiones, objeciones y coste

1. Revisar hechos condicionados, sin autenticar declaraciones de conciliación. Objeción experta: una referencia libre o un booleano no prueba que dos certificados sean disjuntos. Se exige distinguir esa limitación de un fallo aritmético. Coste: la API sigue necesitando conciliación externa y no puede anunciar detección de identidades falsas.
2. Excluir activos de esta conexión es coherente con la falta de conciliación histórica señalada anteriormente. Objeción: excluye también activos sencillos correctos. Coste: menor cobertura explícita; no trasladar una aceptación del adaptador a la liquidación.
3. Contrastar cuotas publicadas, en vez de usar el motor como oracle. Objeción: una diferencia subcéntimo puede desaparecer en presentación. Se busca un caso donde cambie el céntimo y se conservan ambas magnitudes. Coste: hay que revisar la selección de escala y su contrato de redondeo, sin corregir fixtures antiguos para obtener verde.
4. Comprobar enlaces realmente devueltos, además de resolver manualmente las fichas. Objeción: un catálogo correcto no asegura que un resultado histórico conserve su versión. Coste: la corrección debe fijar contexto y snapshot al producir el resultado; enlazarlo posteriormente con el catálogo entonces vigente no basta.

## Cinco dimensiones

- Integridad: hashes de base, entrega, originales reabiertos y artefactos de esta revisión. La igualdad de bytes no acredita al emisor.
- Autenticidad: no nueva comprobación PAdES, CSV ni confianza histórica. Los originales proceden del corpus autorizado. No se afirma verificación propia de Crossa; es la copia histórica v1 comunicada por el coordinador, mismo dueño y vivienda. v1 y v2 permanecen intactos.
- Interpretación: art19/art20, mínimos y escala de Madrid, orden de DA61 después de art80, signo de pérdidas y composición EDS. No se cierra toda la cadena jurídica del sistema ni se añade ámbito por coincidencia numérica.
- Exactitud: pruebas y comparaciones indicadas con entradas concretas; se separan diferencias aritméticas, límites de precisión, errores de preparación y validación runtime.
- Aceptación: ninguna nueva aceptación fiscal, binding o atestación. El resultado sigue condicionado a los hechos y a los límites descritos.

## Fuentes reabiertas

Ley 13/2023 de Madrid, BOE-A-2024-5610, SHA256 `502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de`, página física 3: escala y mínimo 5.956,65; página 14: efectos para períodos desde 1/1/2023. El manual AEAT 2025 original `02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4`, páginas 1090 y 1128, confirma esos valores en 2025; páginas 1068 y 1120 confirman el mínimo estatal 5.550 y la escala estatal utilizada en el oracle. Se reabre el original, no se utiliza la transcripción de una auditoría como prueba.

Art19: Ley26/2014 páginas 11–12 y manual 2025 páginas 254–260: gastos a–e, defensa 300, f limitado y argumento del art20 sin f. DA61: Ley5/2025 páginas 46–47, mismo hash que la entrega original, orden tras art80 y limitación por cuotas atribuibles. Pérdidas: manual 2025 página 1001, integración con signo. RETA: manual página 430; art32: Ley26/2014 páginas 17–19, Ley31/2022 páginas 85–86 (6.498, 14.047,50, 19.747,50 y 7% solo 2023); RD633/2015 página 7 (5%, máximo 2.000 e incompatibilidad); Ley11/2013 páginas 16–17 (inicio después de reducciones anteriores). La Ley IRPF original de 2006 página 20 se usa para contexto de actividad, no para atribuirle cuantías reformadas posteriores.

`originales-reabiertos.json` fija hashes y páginas. Las extracciones son texto, no nuevos facsímiles ni coordenadas verificadas. Poppler avisa de fuentes incrustadas del manual; el aviso se mantiene como incidencia de extracción, sin convertirlo en validación de autenticidad. No se cierra toda la cadena histórica de reformas.

## Incidencias del entorno, separadas del producto

El primer ejecutor directo mezcló Effect 4.1.0 resuelto por Bun en caché y la dependencia fijada del padre, al faltar node_modules junto al checkout. `error-entorno-resultados.json` conserva la traza `impl.base.get`; no se cuenta como defecto de la API. Además, el instrumento inicial intentó leer un caso fallido como éxito al inspeccionar el rastro. Se corrige el instrumento, se ejecuta con una única dependencia desde la copia cotejada y `--no-install`, sin alterar expectativas.

El primer lint de la copia recorrió node_modules porque faltaba `.gitignore`; el primer typecheck carecía de cinco JSON documentales importados por tests. Se completó la copia con los archivos originales y typecheck principal/vendor pasa. El ensayo de anti-slop confirma 16 reglas a error. Los intentos de lint fuera del directorio base y sobre la copia ignorada no cuentan como verdes: durante el trabajo el padre añadió `/docs/procedencia/revisiones/*/checkout-validacion/` a su .gitignore. Por ello la salida cero del lint global de la copia no acredita cobertura. La comprobación definitiva usa `lint-input`, con seis archivos de producto y tres instrumentos idénticos, sin cambiar extensiones: oxlint y ESLint terminan en cero. `lint-archivos-reales.log` acredita los diez archivos analizados (incluye la configuración). Las 16 reglas permanecen a error; solo las rutas de carga de plugins se hacen absolutas. ESLint emite el aviso contextual de que no hay directorio pages en esa copia acotada; no hay errores de fuentes.

## Dictamen y hallazgos nuevos

**Requiere cambios.** Los 25 tests del autor pasan, pero los contrastes propios reproducen diferencias de cuota publicada y una conexión de rastro incompleta. No se ha aplicado ningún fix. Los rojos se conservan antes de cualquier corrección del padre.

### CAV1-01 — P2: Madrid 2025 usa integración de tipos, no la cuota fija publicada

Localización: `trabajo-anual/conexion.ts:195–205` llama al selector para 2025; `cuotas/escalas-publicadas.ts:121` solo contempla Madrid 2022. Devuelve undefined y se integra la escala de tipos. El informe del autor y la fórmula del rastro dicen «escala publicada Madrid», pero la columna de cuota íntegra publicada no se usa.

Reproducción `cuota-publicada-centimo`: trabajo laboral bruto 25.000,02, gastos efectivos cero, f=2.000, art20=0, BLG=23.000,02, sin pagos ni DA61. Estado: escala estatal 2.532,753 menos mínimo 527,25 = **2.005,503**. Madrid: **1.739,53 + (23.000,02 − 19.004,63) × 0,128 − 5.956,65 × 0,085 = 1.744,62467**. Total **3.750,12767**, presentación half-up **3.750,13**. La API devuelve **3.750,12424**, presentación **3.750,12**.

Otro control de signo: bruto 60.000 produce 15.337,605 (presenta 15.337,61), frente a 15.337,60275 con cuota publicada (presenta 15.337,60). No es un sesgo único a favor del contribuyente. Afecta también al perfil EDS; por ejemplo base 38.000: 8.136,5374 frente a 8.136,53643, aunque ese ejemplo redondea igual. No se cuentan estas discrepancias como defectos independientes.

Fuente reabierta: Ley13/2023 página 3 y manual AEAT2025 página 1128, misma tabla. No se traslada a 2025 una aceptación de Madrid 2020/2022. Objeción experta: el redondeo oficial de cada casilla sigue pendiente y varias diferencias desaparecen al presentar. Respuesta: el error existe bajo la propia política publicada de conservar decimales y redondear al final; el caso discriminante cambia un céntimo. Coste propuesto: seleccionar una tabla con cuotas fijas para el ámbito correcto, mantener las pruebas rojas y revisar independientemente la política de casillas. No basta añadir un epsilon ni regenerar el oracle.

### CAV1-02 — P2: el rastro de la API nueva no fija contexto ni snapshot

Localización: `trabajo-anual/conexion.ts:360`. Se retorna `{titulo, pasos}` directamente, a diferencia de la API anterior que enlaza antes de devolver. El reexport de `liquidar-irpf-anual.ts` no añade ese paso.

Trabajo devuelve 15 líneas y EDS del sondeo devuelve 23, todas con origen pero **cero enlaces** y contexto ausente. La unión de ambas rutas cubre los **16 siteId nuevos**. La comprobación del catálogo acredita los **65 puntos** y el snapshot `5da224c83aa1f524f4871646791e5fc4f6fbbbe28b940e7b03997d6fe615aab8`; al enlazar manualmente las líneas resuelven a fichas Step. Esa operación manual es un control positivo, no una reparación del resultado original. El cambio del padre `instancia: instancia` coincide con el manifiesto del autor al deshacer únicamente esa sustitución; la extracción de etapas funciona.

Se conservan decimales anteriores al formato, unidad EUR e instancias distintas. La carencia es el contexto y la versión del resultado real, no ausencia de fichas ni error del extractor. Las fichas son técnicas y no sustituyen citas ni aceptan jurídicamente las fórmulas.

Objeción experta: un consumidor podría llamar después al enlazador. Respuesta: entonces podría fijar un snapshot posterior al cálculo y perder su identidad histórica, además de que la salida actual no ofrece el enlace prometido. Coste propuesto: fijar ámbito y perfil y enlazar al producir la salida, con pruebas de resolución y rechazo de retagging. El nombre exacto del perfil del contexto debe decidirse en el contrato; el rojo `solo-trabajo` es una propuesta explícita, no una nueva regla jurídica.

### CAV1-03 — P3: el agregado laboral admite por entrada una cuantía que DA61 rechaza al sumar

Localización: `trabajo-anual/conexion.ts:224–229` y `trabajo-anual/contrato.ts:4–5`. Dos rendimientos laborales distintos de 999.999.999.999,99 cada uno cumplen el schema anual (hasta 100 rendimientos). El agregado de 1.999.999.999.999,98 se pasa como `brutoServicios`, cuyo schema Euros solo admite 12 enteros. Resultado: `ResultadoNoSoportado`, «Entrada de deducción inválida o etapa incorrecta». Con idénticas cuantías calificadas como pensiones se calcula, porque no se llama a DA61. La deducción laboral nominal a ese bruto es cero.

Es un rechazo tipado, no Die, ni una cuota errónea devuelta. Objeción experta: el caso es extremo y es legítimo imponer límites técnicos. Respuesta: el límite del agregado no está expresado en el contrato anual y la razón atribuida a la etapa de deducción es engañosa. Coste propuesto: decidir y documentar una cota agregada temprana, o admitir la magnitud calculada necesaria sin ensanchar importes aportados. No se propone extender cobertura fiscal ni aceptar importes ilimitados.

## Controles que no demuestran otro defecto

- Trabajo laboral/estatutario homogéneo y pensión sola se admiten. Pensión no recibe DA61. Mezcla pensión/empleo y trabajo/EDS rechaza. Los 18 y 64 años se admiten; 17, 65 y edad fraccionaria se rechazan, igual que año, territorio, devengo o modalidad fuera del contrato.
- Gastos reales: dos pagadores con 1.200 de SS cada uno, 600 de sindicato, 400 de colegio y 250 de defensa cada uno dejan BIG **33.600**, con colegio limitado a 500, defensa a 300 y f a 2.000 una sola vez. La cuota conserva el defecto CAV1-01; eso no invalida la comprobación de la base. El texto de conciliación declara procedencia aportada y no autentica documentos.
- Se rechazan cotizaciones estimadas, retenciones no efectivas, de otro año y operaciones repetidas. Dos retenciones efectivas iguales con IDs distintos suman 200. Campos extra en raíz, rendimiento y pago EDS se rechazan. No se ha probado identidad real de las operaciones.
- EDS sin activos: RETA 300 sobre ingresos 20.000 da P=19.700; opción G da BIG=18.715, o 14.972 con inicio. Cliente único da BIG=17.645,85, o 14.116,68 con inicio. Retención 1.000 y pago 130 de 100 se restan después de cuota, sin volver a deducir RETA ni art32. Repetición de operación entre retención y modelo130 y de justificante entre RETA/gasto se rechaza. Activos y mezcla se rechazan.
- Pérdidas de trabajo y EDS se conservan en BIG y BLG, con cuota cero, sin fabricar reducción negativa ni una bolsa de arrastre ya gestionada. El alcance excluye saldos anteriores.
- Mínimos diferenciados: casos en torno a BLG 5.550 dejan la cuota estatal en cero o fracción positiva, mientras Madrid conserva cuota cero hasta su propio mínimo 5.956,65. No se reutiliza un mínimo común para ambos componentes.
- La ampliación de magnitudes calculadas permite art20/DA61 con cuatro o más decimales internos. No se atribuye a la API equivalencia casilla a casilla con Renta WEB.

## Precisión

`precision.json` repite el caso discriminante y 10.000 ingresos máximos EDS con Decimal global a 20, 60 y 80 cifras. En estos casos las salidas coinciden entre precisiones; **CAV1-01 no se corrige aumentando precisión**. El máximo probado conserva BIG 9.999.999.999.997.900 y devuelve cuota 4.499.999.999.983.372,605; la diferencia frente a 4.499.999.999.983.372,60275 vuelve a proceder de la cuota fija, no de un error nuevo de precisión demostrado.

El helper DA61 admite una cuota `818.8197` seguida de ceros y un último 1 en la posición decimal 60, pero su operación a 60 cifras significativas devuelve `478.8217`, sin ese residuo diminuto. Se documenta como límite de la ampliación de schema, ya advertido por el autor, **no como fallo de céntimo anual demostrado**: las entradas ordinarias del anual no generan esa precisión. Objeción experta: 60 decimales admitidos no equivalen a 60 decimales conservados cuando existen enteros. Coste: especificar precisión significativa y cotas de las magnitudes calculadas antes de prometer exactitud decimal ilimitada. No se propone modificar auxiliares fuera de esta revisión.

## Resultado final y reproducción

**84 casos propios: 58 coinciden íntegramente y 26 discrepan**; 25 discrepancias remiten a CAV1-01 y una a CAV1-03. Los campos de bases y pagos pueden coincidir aunque el caso completo figure rojo por cuota. Hay 32 rechazos tipados (31 esperados y el del agregado extremo), **cero Die en el entorno corregido**. Se añaden cuatro aserciones rojas para los tres hallazgos: cuota, contexto, enlaces y rechazo extremo. No se suman estos recuentos con las 25 pruebas del autor ni con las repeticiones de precisión.

Validación de producto: `tests-autor.log` 25/25; `lint-real.log` focalizado con salida cero en ambos analizadores, y `typecheck-final.log` principal/vendor sin diagnósticos y salida cero; `anti-slop.log` confirma las 16 reglas a error. El catálogo verifica 65 puntos, con las 16 incorporaciones. Las fuentes copiadas y existentes en la base coinciden byte a byte (`copias-verificadas.json`). El cotejo de entrega solo difiere en conexion.ts por el cambio explícito de instancia del padre, comprobado por sustitución inversa y SHA256.

Los comandos se ejecutan desde el checkout base, usando el directorio absoluto de esta entrega como `OUT`, siempre dentro de `flock /tmp/irobopf-validacion-pesada.lock` y el shell `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 nixpkgs#poppler-utils`. No se requiere instalar dependencias:

```sh
python3 "$OUT/preparar.py"
bun --no-install "$OUT/sondeos.mjs"   # salida 1: discrepancias deliberadamente conservadas
bun --no-install "$OUT/precision.mjs"
bun --no-install "$OUT/rojos.mjs"     # salida 1: cuatro aserciones rojas
python3 "$OUT/cerrar.py"
```

Los instrumentos importan la copia exacta `checkout-validacion`, que tiene un enlace de solo lectura al node_modules del padre. El directorio de trabajo debe ser la base para resolver el contenido versionado original. `validar.sh` y `completar-validacion.sh` conservan la secuencia de pruebas/tipos/lint y la reparación de la preparación. No se debe interpretar la salida cero del shell que imprime estados como salida cero de cada comando: los logs y estados individuales mandan. No ejecutar las suites legacy completas para reproducir esta revisión.

Se conserva la copia de validación para reproducibilidad y no se propone integrarla como una segunda copia del producto. La entrega a integrar es el informe, hallazgos, instrumentos, manifiesto, entradas, salidas, extracciones y logs. Ningún archivo de implementación original cambia; no hay parche de fixes. El parche adjunto añade únicamente documentación e instrumentos de esta revisión. No se borran cachés, originales, worktrees ni informes ajenos.

El preflight inicial clasificó dos symlinks deliberados de fixtures de preservación como archivos no regulares. La comprobación final distingue presencia del enlace de existencia del destino: no son borrados de esta revisión ni se reparan. No se basa el dictamen de integridad en el índice Git.

Reproducción del lint definitivo: ejecutar `python3 "$OUT/lint-real.py"`, entrar en `$OUT/lint-input` y ejecutar oxlint con `--threads 1` y ESLint mediante Node de Nix, con el lock común. Los paths de los binarios y comandos exactos se conservan en la entrega. No se afirma lint global verde de archivos que quedaron ignorados.
