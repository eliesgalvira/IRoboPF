# Revisión independiente de escalas R60 integrado por R62

Alcance: versión y condiciones examinadas en este dictamen. El [informe final](../../INFORME-FINAL.md) reúne el resultado de los 65 sitios y sus límites.

Dictamen técnico condicionado de los 28 IDs, sin fixes ni aceptación fiscal. El detalle individual está en DICTAMEN28.md y DICTAMEN28.json. Se distingue el alcance de 22 sitios generales del de seis explícitos de trabajo/pensión. Las seis variantes de actividad tienen bloqueo causal demostrado: no se han implementado las 19 familias. Una conclusión favorable dentro de estas condiciones permite cerrar esta revisión del lote; no pide otra revisión idéntica.

Base examinada: `1b0676b83dd3be448484c8167ebd1e308dacae30`, 23.648 entradas. La entrega original procede de `59bb5565456caa5a44078f3b9a5ac4301934fb86`; manifiesto `7bd368af57c8bea8d243bbde30027a1e89a636cf6d2e66274505d8276bb3393e`.

## Qué se examinó

Se examinaron D131–D133, informes de implementación y recepción, tabla de 28 sitios, comandos y rojos; los ocho scripts causal-escalas-r60, consumidor R36, cambios del núcleo R57, protocolo R54, contratos y cuerpos de conexión explícita, gastos/art20/DA61, mínimos y derechos, tarifas generales y ahorro, y selección normativa. Las 28 referencias fuente se cotejan por SHA256 y offsets UTF16 contra el texto del importe; cada salida propia exige el nodo del importe dentro de su slice.

La ampliación conserva la separación de invocación, programa, propiedad, rama y transporte. Los prefijos separan programas y los frames distinguen las llamadas a las mismas funciones con bases distintas. Se captura la llamada real a crearLineaCalculo: origen.decimal conserva el valor previo a presentación y resultado lleva el formato. EUR de base, EUR de cuota, ratios, céntimos y cadena decimal se distinguen en los contratos; las anotaciones internas contextuales no son un sistema dimensional universal.

## Evidencia independiente y objeciones

Las pruebas propias contrastan selección y valores de líneas completas contra la API financiera real, usando su conjunto esperado de sitios y no solo los IDs que decida emitir el candidato. Se conservan casos y testigos comprimidos por hash. La aritmética racional con Fraction no importa el motor ni el intérprete: fija tablas y fórmulas de contraste de las fuentes examinadas y compara valores exactos. No vuelve a autenticar jurídicamente esas tablas.

Se prueban alrededor de la frontera publicada de Madrid 13.362,22 €, y en 19.004,63/35.425,68/57.320,40. El cálculo publicado usa Q+(B−L)t: integrar los anchos perdería la cuota fija. Con base cero no hay tramo emitido. Los remanentes incluyen G=0/5.500/5.800 en 2012, 2014, 2015 y 2025: discriminan F(A−r) histórico frente a F(A)−F(r), el recargo estatal y el componente autonómico de 2015, además del mínimo autonómico distinto en Madrid.

Hay pérdidas generales y de ahorro, agregado de deducción superior al techo en Madrid y simulada, modo legacy, 2026 simulada, dos fechas del corte de Baleares, discapacidad positiva y retención opcional concreta con subcaso propio. Las regresiones recibidas cubren otras edades, territorios y discapacidad en tres roles; no se repiten indiscriminadamente. El subcaso de retención mantiene su año/contexto y su propio importe de retribución; el anual conserva los pagos y soportadas. No se reabre la revisión favorable de SS, retenciones o rentas.

Las contrapruebas alteran programa, sources, unidades/metadata, obligaciones, catálogo y kind; también retorno, selección de rama, frame, slice, transporte, software y enlace de componente de igual valor. Alterar el payload no puede cambiar el patrón derivado. La mutación del catálogo exportado se revierte en memoria al terminar el ensayo y la metadata del payload no altera la referencia privada. Se comprueban hojas de entrada por propiedad: los pagos/soportadas no entran en las bases. La igualdad numérica de dos componentes de ahorro no autoriza compartir raíz o slice.

El replay de R60 compara toda la evidencia reconstruida, a diferencia de verificadores locales de lotes anteriores. Rechazar una mutación demuestra vinculación con la ejecución fijada, no corrección independiente de esa semántica. La suficiencia condicionada se apoya además en fuentes, API real, cálculo racional, identidad de propiedades y discriminantes de rama. No se atribuye universalidad a un slice ni se exige que sea el conjunto mínimo absoluto de dependencias.

### Schema y selección normativa

Objeción: validar con Schema y devolver raw input sería incorrecto si el decoder transforma o aplica defaults. El núcleo hace precisamente esa reutilización en el éxito; no debe describirse como implementación genérica de decode. Los schemas alcanzables actuales de conexión, gastos y deducción usan Struct/Union/Literals/String/Number/Array con checks y rechazo de campos sobrantes. Se comprueba con el decoder real que los éxitos alcanzados son estructuralmente iguales a la entrada. No se reproduce una transformación/default omitido dentro del dominio actual. Si se introducen esos operadores habrá que extender la semántica y revisar el cambio. El schemaProgram de rentas sirve solo para construir schemas estructurales; los valores financieros los produce el núcleo, no ese evaluador.

Objeción: sustituir un servicio normativo por una constante podría perder selección. En la capa real de ParametrosNormativosIrpf, minimosEstatales2025 es exactamente MINIMOS_ESTATALES_2025. Los años 2012–2014 seleccionan sus tablas y el selector territorial recibe año/base/fecha; no se afirma equivalencia con una capa inyectada arbitraria. Coste: conservar contrato de ese servicio y revisar cambios de fuente/contexto, no ampliar ahora el intérprete a cualquier servicio.

### Derechos y actividad

rightsPreadmitted declara una precondición; no comprueba residencia, convivencia, renta ni derecho jurídico. El caso de derechos pasa primero por la API real. La variante propia invierte el orden y añade menor de tres: el resultado 6.700 € distingue el reparto 2.400/2 y 2.700+2.800, sin usar el orden de entrada. Ascendientes siguen excluidos del contrato de derechos, aunque el helper familiar ordinario conserve su alcance parcial. No se convierte la identidad de entrada preadmitida en admisión probada.

La rama de actividad tiene caso admitido por la API real; el modo causal rechaza exactamente al llamar a adaptarActividadGeneral. En conexion.ts la propiedad financiera es aporte.importeEurosExactos; el adaptador obtiene el aporte mediante calcularActividad2025. Dos aportes de ensayo, 12.345,67 y 23.456,78 €, cambian las seis salidas del consumidor histórico. Esos callbacks se usan solo como testigos de sensibilidad; nunca se suministran al modo causal. Coste: mantener seis sitios condicionados a trabajo/pensión y seis variantes con bloqueo demostrado, sin implementar las familias excluidas.

## Validaciones y límites técnicos

Se utiliza la recepción existente de 107 pruebas correctas (12 del candidato y 95 compartidas), tipos TS principal/vendor verdes y lint: Oxlint correcto con plugins reales y 16 reglas a error; ESLint exit 0 con 16 avisos, doce previos y cuatro del auxiliar nuevo. No se presenta como nueva ejecución de este revisor. No hay cambios de producto que justifiquen repetirla completa ni repetir el typecheck global. Las pruebas propias y sus resultados/exits se enumeran en COMANDOS.json y COBERTURA.json.

CheckJs permanece separado: los 43 diagnósticos del host R60 con noImplicitAny:false y los 1.102 del host estricto R61 no son comparables. Tipos TS verdes no acreditan tipado integral MJS. Tampoco el arnés MJS propio obtiene una certificación de tipos por pasar pruebas. R40-03 sobre errores/entorno/interrupción Effect queda fuera del contrato; no se registra como bug nuevo. Dominio ordinario, acíclico, síncrono, finito, sin reconfiguración hostil, con software/runtime fijados y datos previamente admitidos.

Las desviaciones históricas se conservan: primer lock físico del autor omitido, rojo original posterior a introducir kind y guías consultadas con éxito tardíamente. Los rojos de catálogo/alias y los errores de tipos iniciales permanecen en los originales. No se reescribe esa cronología. El propio primer arnés Bun falló al cargar una resolución incompatible de Effect; no ejecutó casos. El primer contraste racional esperaba incorrectamente un tramo cero en base cero; se corrigió solo esa expectativa. Un intento del racional ampliado se lanzó antes de existir extra-resultados.json: verificó las 153 comparaciones anuales y terminó 1 por archivo ausente. Ambos intentos quedan conservados, sin atribuir esos rojos al candidato.

## Integridad y entrega

Antes de escribir se cotejaron personalmente las 23.648 entradas de HEAD con blobs individuales por lstat/readlink/bytes/ejecutable bajo el lock físico: cero diferencias y cero extras de trabajo; .git es el archivo de control T3, excluido del censo de trabajo. No había node_modules local. No se usó un diff vacío como sustituto. El cotejo terminal repite las entradas y enumera extras autorizados e infraestructura.

Se cotejaron personalmente las 416 rutas del transporte original con SHA256/SHA512/tamaño/modo y sus preimágenes, más su coincidencia no-cache con la integración. Se conservaron por hash 90 originales técnicos y los 50 logs históricos, incluidos rojos/cancelaciones. No se tocaron motor, inventario, snapshots, ESTADO, DECISIONES ni informes ajenos; tampoco VCS, red externa, PR, despliegue, servidor, preview, LFS, gasto, transferencia o limpieza.

El payload propio enumera SHA256/SHA512/tamaño/modo/baseSha256 por ruta. Todas sus rutas son nuevas y tienen preimagen inexistente en la base exacta. El patch gzip y los objetos binarios/vacíos se reconstruyen en scratch, sin checkout, y se cotejan bytes, modos y conjunto exacto. Sobre y recibo terminal son externos al payload, sin autorreferencia; reconstrucción y contenedores se excluyen expresamente. Ningún archivo alcanza 10 MiB. No hay logs de procesos activos al cerrar el manifiesto.

## Trabajo pendiente dentro del lote

No se solicita otra revisión favorable ni fixes sin defecto reproducido. El alcance condicionado permite cerrar esta revisión técnica de los 28 IDs; actividad conserva bloqueo demostrado. Tras esta entrega queda la recepción del padre, estimada en 30–60 minutos según el coste de sus comprobaciones seleccionadas. Las combinaciones no ejecutadas, admisión factual, equivalencia universal Effect y fiscalidad no se convierten en garantías. Las diez salidas explícitas del último lote conservan su trámite separado; no se estima ni se inicia aquí ese trabajo ni las 19 familias. No hay autoaceptación fiscal.

Resultados propios terminales: tres pruebas Vitest en dos archivos; 36 casos y 792 salidas comparadas con la API real, 183 comparaciones racionales (153 anuales y 30 explícitas), 20 comprobaciones de rechazo y sensibilidad de las seis salidas de actividad. Los cinco éxitos de schema examinados preservan la entrada estructural. No se reproduce defecto funcional nuevo en el alcance revisado. Los recuentos se solapan y no se suman como reglas aceptadas.

Cotejo documental adicional: se recupera el contrato original comprimido por hash y se compara su digest de programa con los 36 testigos propios. Esta comprobación de JSON/hash se lanzó con un trabajador sin el lock pesado; se registra como desviación propia de serialización, sin atribuirle cumplimiento íntegro de ese requisito. No evalúa fórmulas y no sustituye los ensayos financieros, que sí tomaron el lock por comando, ni los cotejos físicos serializados. Se conserva el resultado; no se repite una revisión favorable por esta incidencia.

Ajv propio: cancelado mientras esperaba el lock, exit 143. Se comprobó el cmdline del flock propio y la ausencia de hijos antes de terminarlo; Node no llegó a iniciarse y no se ejecutó ningún caso. El log vacío se conserva como objeto vacío en el transporte. No se atribuye pase a schema de los 36 testigos nuevos: se usa únicamente la evidencia estricta recibida de 50 testigos/1.144 salidas, más los cinco éxitos de decoder contrastados en los ensayos propios. La cancelación evita demorar el cierre por una repetición estructural opcional; no interrumpe validaciones ajenas.
