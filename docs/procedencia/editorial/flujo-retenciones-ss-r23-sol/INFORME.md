# Dependencias de retenciones y cotizaciones: edición candidata R23

Trabajo personal de gpt-6.1-sol con esfuerzo high, sin subdelegación ni cambio de modelo. La prioridad es la solicitada; no hay recibo independiente del service tier en esta interfaz. No se inventa identificador canónico T3 ni se emite atestación. Base exigida y observada: `07c07e6376a72f229be735a904ecf36517a1b571`, con 14.957 entradas físicas. La edición pertenece exclusivamente a `docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/`.

Esta es una expansión técnica candidata de las propiedades asignadas. Las fórmulas y relaciones nuevas necesitan revisión independiente y composición con los otros lotes. No aprueba una implementación propia, una regla completa, un procedimiento AEAT ni una cuota mensual TGSS. No declara terminado el encargo global.

Se leyeron BRIEF, AGENTS, contrato, coordinación, estado y decisiones; las instrucciones actuales prevalecen sobre las órdenes históricas incompatibles de delegación, commits, limpieza y escritura global. Se consultaron las dos entregas R21 concluidas, las enmiendas editoriales R21, técnica R23 y recepción R21–R23. No se inspeccionó preservación v4 ni trabajo de hijos activos.

## Contrato y evidencia de código

`grafo.json` conserva los 17 siteId, sujeto/revisión y snapshot histórico recibidos. No sustituye la identidad histórica por la de una supuesta publicación actual. Cada nodo y arista tiene fuente, SHA256 y rango UTF16, fórmula, propiedad de salida y condiciones. `llamadas.json` registra argumentos efectivos, destino resuelto por símbolo y fuente, y localización exacta de la llamada. `asignaciones-argumentos-retornos.json.gz` permite comprobar declaraciones, llamadas y retornos; su mera presencia es localización, no dependencia. `literales.json` distingue tokens propios de rangos de declaración efectiva y los coteja con el inventario fijado mediante archivo/hash/rango exactos. Un literal no inventariado no recibe una identidad inventada.

Los nodos parametrizados tienen puertos formales y contratos de llamada. Un parámetro de una función interna no se hace pasar por entrada pública ni por frontera externa. Por ejemplo, los tres juegos de argumentos de `reduccionLineal` están fijados explícitamente; la base formal de la escala se enlaza a las llamadas con base, mínimo y anualidades. Las fórmulas descompuestas y esos argumentos, no la contención AST, determinan la relación candidata. El schema y el verificador comprueban la estructura y sus referencias; no descubren por sí solos omisiones semánticas.

El flujo es de entrada a salida. Se separan valor, control que selecciona valor, validación de dominio y cohabitación excluida. Una validación puede impedir toda salida sin aportar un importe a la fórmula. Edad, fecha y número de hijos también pueden seleccionar cantidades: esa segunda función se explica expresamente. `contratos.json`, `fronteras.json` y `rutas-ss.json` conservan los contratos de composición y las ramas por modo/propiedad.

## Pagos y argumentos efectivos del anual

**RSS23-01.** `anual.pagos.retenciones` presenta `caso.retencionesSoportadasCentimos / 100`. No consume la estimación. `anual.pagos.cuenta` presenta `(caso.pagosACuentaCentimos + estimaciónOpcionalCentimos) / 100`. La estimación procede exclusivamente de `retencionTrabajoAeat.importeRetencionAnualCentimos`; si no hay subcaso se usa cero. El diferencial recibe pagos aplicados y soportadas por propiedades separadas. No existe deduplicación porque dos números sean iguales. El llamador debe conciliar hechos para no consignar la misma retención por dos canales.

La llamada real es `dependencias.retencionTrabajoAeat.calcular(caso.retencionTrabajoAeat, contexto)`. El anual exige que los ejercicios coincidan, pero no sustituye el bruto, las cotizaciones, las edades o la familia del subcaso por sus propios cálculos. Por tanto, no hay arista de valor desde la cuota obrera estimada anual a `caso.retencionTrabajoAeat.cotizacionesCentimos`. Tampoco desde los mínimos de liquidación a los de retenciones. El fallo del estimador sí impide que se produzca el resultado anual.

Objeción experta: describir la suma puede legitimar duplicaciones. Respuesta: se documenta como comportamiento técnico y obligación de conciliación, sin afirmar que los hechos fiscales estén bien representados. Coste: composición y validación de hechos pendientes; ningún fix del motor en esta entrega.

## Base de retención y reducción por versión

**RSS23-02.** R es retribución del subcaso convertida a euros; C es su cotización declarada. Los importes opcionales ausentes valen cero. El neto intermedio es `max(0,R−irregular1−irregular2−C)`. Los otros gastos se calculan separadamente: `2000 + movilidad + discapacidad activa`, limitados por `R−C` positivo. El techo de esos gastos no resta irregularidades. Movilidad aporta 2000 si se comunica; discapacidad aporta 7750 en activo con grado desde 65 o de33a65 con movilidad reducida, 3500 en activo con de33a65, cero en los demás casos.

La reducción usa el neto intermedio, antes de esos otros gastos. Antigua: `max(0,3700−max(0,N−11250)×1.15625)`. Nueva2019: `max(0,5565−max(0,N−13115)×1.5)`. Media2018 promedia ambas antes del redondeo final. Rama2023: `max(0,6498−max(0,N−14047.5)×1.14)`. La actual tiene tres tramos: hasta 14852,7302; hasta 17673.52,7302−(N−14852)×1.75; por debajo19747.5,2364.34−(N−17673.52)×1.14; resto cero. Se conserva dónde redondea la implementación, sin atribuir a la fórmula aceptación normativa.

Después se satura el neto reducido y se restan pensionista 600, desempleado 1200, hijos 600 si hay más de dos descendientes y pensión compensatoria declarada; se satura otra vez para obtener la base. Los auxiliares familiares de mínimos no entran en esta base. El número de descendientes sí puede afectarla al cruzar dos/tres, aunque un hijo aislado solo afecte otras cadenas.

Legacy pasa versión undefined y consume la reducción actual. Que la función calcule también variables antigua/nueva no demuestra tránsito de sus valores al resultado de esa rama. No se vinculan los parámetros del artículo20 de la liquidación anual por compartir denominación ni por igualdad numérica.

## Familia y escala propias de retenciones

**RSS23-03.** El mínimo del perceptor es5550 más2550 desde 75,1150 desde 65 y cero incremento antes. La edad omitida usa40 para esta elección. No se selecciona un mínimo autonómico. Los descendientes se ordenan de mayor a menor edad; reciben2400,2700,4000 y4500 según índice. El cómputo entero multiplica por1; el resto por0.5. Menor de3 o adopción/acogimiento comunicado inferior a3 añade2800 con el mismo reparto. Se redondean por separado la suma general y la de menores.

El mínimo de ascendientes suma1150/convivencia cuando edad≥65 o hay discapacidad; añade1400/convivencia desde 75. Ambos grupos se redondean por separado. Discapacidad aporta9000 desde 65 y3000 en de33a65; asistencia aporta3000 desde 65 o de33a65 con movilidad reducida. Perceptor, descendientes y ascendientes conservan sus multiplicadores/divisores y agrupaciones de redondeo distintas. No se deduce renta, parentesco o elegibilidad jurídica de esas edades/flags.

En canónico se filtran primero descendientes con edad<25 o discapacidad. Ese array filtrado determina orden, mínimos, length de umbrales y el beneficio por más de dos hijos. Legacy transmite el array original. La validación exige edades enteras no negativas y convivencia positiva, pero no prueba los hechos jurídicos que harían computable cada familiar. El discriminante de orden cambia qué cuantía se multiplica por cada reparto: edad no es solo una guarda de dominio.

**RSS23-04.** La escala de retención se calcula como cuota fija más exceso sobre `desde` por tipo. Hasta2020, con versión definida y base≥60000, se prolonga17901.5 al45%; desde 2021 y legacy existe el tramo300000 al47%. La búsqueda ordinaria recorre en orden inverso los `desde`; el campo `resto` no interviene en la elección ni en la fórmula. Ni sus anchos ni Infinity son dependencias del importe por cohabitación.

Con anualidades positivas menores que la base, la cuota inicial resta `E(mínimo+1980)` de `E(base−anualidades)+E(anualidades)`; en los demás casos resta `E(mínimo)` de `E(base)`. Se satura en cero. No se trasplantan las escalas del lote A ni los mínimos de liquidación.

Objeción experta: un ejemplo familiar y una tabla completa no bastan para todas las combinaciones. Respuesta: se expanden los auxiliares, argumentos de llamada, filtros y redondeos; los ejemplos solo discriminan relaciones concretas. Coste: revisión independiente de las nuevas aristas y del contrato familiar, sin aceptación jurídica ni habilitación de ramas.

## Umbrales, fecha, exención y cuota limitada

**RSS23-05.** Canónico selecciona versión por ejercicio y fechaPago civil o perfil de cierre, nunca por fechaFallecimiento. Una fecha y cierre simultáneos se rechazan. Cierre exige versión que termine el31 de diciembre; sin ambos datos se exige una sola versión anual completa.2012–2016 carecen de versión canónica;2026 solo admite10 de septiembre–29 de octubre. Regularización se rechaza en ambos modos. Legacy rechaza fechaPago/perfil y no acredita vigencia de los algoritmos antiguos.

Los umbrales reciben `anio` del subcaso y `fecha=version?.desde`, no directamente la fecha de pago ni la del devengo anual. El catálogo selecciona la versión y su comienzo selecciona el período de tabla.2018 cambia5 de julio,2023 cambia1 de febrero,2024 cambia8 de febrero; las demás ventanas del catálogo no implican necesariamente cambio de cantidades. El algoritmo especial de tabla 2018 desde 5 de julio para pensión/desempleo solo se ejecuta con fecha definida. Legacy, al pasar undefined, toma la tabla al cierre sin esa especialidad laboral. Esta diferencia de argumentos queda expuesta, no corregida.

La fila es situaciónFamiliar; la columna es cero, uno o dos/más descendientes. Situación1 sin hijos se rechaza y su celda nula nunca se transforma en cero. El máximo se obtiene de todas las celdas no nulas de la tabla, con `Math.max`; una celda de otra situación puede participar en ese control aunque no sea la fila elegida para el umbral individual.

Exento exige R≤máximo+pensionista+desempleado y R≤umbral+pensionista+desempleado. La reducción hijos 600 no se añade al umbral. Si exento, cuota inicial0. El límite43 devuelve cuota inicial si exento o si R supera el techo; dentro del techo es `max(0,(R−umbralConReducciones)×.43)`. Techo22000 para versión anterior2023 o reducción2019;35200 para el resto, incluido legacy sin versión. La cuota es el mínimo entre inicial y límite43. Se conserva la diferencia entre umbral, control de exención y valor de cuota.

## Tipo e importe

**RSS23-06.** Ceuta/Melilla exige a la vez residencia y rendimientos comunicados. Reduce la cuota en la diferencia positiva con factor.5 en2017/versión inicial2018 y.4 en las demás; no altera la cuota ya calculada. Vivienda, si se comunica y R<33007.2, resta el2% truncado a dos decimales. Se satura la diferencia y se calcula su cociente sobre R por100, truncado a dos decimales; R≤0 produce cero.

A continuación se aplican mínimos de contrato. Especial:15 ordinario,8 Ceuta antes 2019 y6 después. Inferior al año:2 ordinario,1 Ceuta antes 2019 y.8 después. Los demás conservan el tipo calculado. Manuales se rechaza en canónico antes del cálculo; legacy puede alcanzar esa rama por su contrato distinto. La exención inicial no elimina por sí sola el mínimo contractual posterior. El importe es R por tipo entre100, redondeado a céntimos, convertido a entero y presentado según el rastro. Cuota, tipo e importe no se identifican entre sí.

## Cotización por propiedad y modo

**RSS23-07.** La entrada efectiva es salarioBrutoAnual=íntegro de trabajo del anual, anio=caso.anio. La frontera con rentas entrega exclusivamente ese íntegro en euros; no se expande su implementación aquí. El modo selecciona el desglose canónico uniforme o legacy. En legacy, B=min(S,M), X=max(0,S−M), con M=tabla máxima heredada[año]. En canónico2018, B=(7min(S,3751.20×12)+5min(S,3803.70×12))/12; en los otros años B=legacy.baseOrdinaria. X=max(0,S−B). No se confunde M heredado con la base2018 canónica.

Ordinaria empresarial=B×(.236+.055+.002+.006+.015); trabajadora=B×(.047+.0155+0+.001+0). Cada lado solo consume su componente, aunque ambos compartan el objeto. MEI multiplica B por el tipo anual del lado:2023 .005/.001;2024 .0058/.0012;2025 .0067/.0013;2026 .0075/.0015; antes, cero. El selector escrito≥2026 no habilita ejercicios fuera del tipo AnioFiscal por semejanza.

La solidaridad legacy suma bandas min(X,.10M), min(max(0,X−.10M),.40M), max(0,X−.50M) por tipos totales2025 .0092/.0100/.0117 y2026 .0115/.0125/.0146. Antes no hay solidaridad. Reparte ese total5/6 empresarial y1/6 trabajador. La canónica usa las mismas bandas pero tipos por lado:2025 empresa .0077/.0083/.0098, trabajador .0015/.0017/.0019;2026 empresa .0096/.0104/.0122, trabajador .0019/.0021/.0024. Otros años usan ceros. M sigue siendo argumento de estas bandas; eso no devuelve el máximo heredado a B2018 ni hace que un tipo nulo modifique numéricamente solidaridad2018.

Cada total es ordinaria+MEI+solidaridad de su lado. La construcción legacy intermedia no convierte su solidaridad ni sus totales en dependencia del resultado canónico: solo se consume la base heredada cuando corresponde. Coste laboral es íntegro+empresa y se liquida a céntimos; no se suma otra vez trabajador. `rutas-ss.json` distingue individualmente las diez propiedades de desglose y el grafo añade el coste como undécimo sitio.

El producto es un perfil de doce mensualidades uniformes, contrato indefinido, sin horas extra ni especialidades, con AT/EP heredado1.5%. No valida mínimos por grupo/jornada. `redondeoTgss=pendiente` permanece intacto. La aritmética anual y los discriminantes no crean deuda mensual ingresable.

Objeción experta: una fórmula anual puede perder cambios intraanuales y reparto legal. Respuesta:2018, lados y modos están separados expresamente; el contrato conserva el límite mensual pendiente. Coste: no extrapolar este análisis a cuotas ingresadas ni aceptar redondeos por observar coincidencias.

## Omisiones R21 y disposición en esta edición

| Omisión recibida | Disposición candidata | Evidencia concreta |
| --- | --- | --- |
| Cuerpos terminales legacy de cotizaciones | Resuelta por propiedad dentro del lote | S.LB, S.Ltramos, S.LrepartoE/T; ordinarias, MEI y sumas por lado; rutas-ss.json |
| Familia de retenciones sin expansión | Resuelta dentro del lote | R.multiplicador, ordenHijos, menor3, minHijos, minAsc, discapacidad, asistencia, minDisc, minimo; argumentos y retornos |
| Tablas/fechas de retención sin seguir llamador | Resuelta dentro del lote | R.version → version.desde → R.tabla y períodos; R.umbralEuros/columna; contratos.json |
| Base/cuota/tipo/importe mezclados | Separadas por cadenas | R.base, R.cuota, R.tipo, R.importe y discriminantes de mínimo, Ceuta, vivienda y contrato |
| Asociación de195 hojas y130 controles a todo lote B | Reemplazada por disposición individual | ocurrencias-r21.json asigna solo SS a este lote; resto a rentas, con exclusión explícita |
| Íntegro de rentas | Frontera exacta, composición pendiente | sumarRendimientosTrabajo(caso.rendimientos.trabajo,centimosAEuros) → Decimal EUR; archivo/hash/símbolo en fronteras.json |
| Admisión anual general y cuotas posteriores | Frontera de control/composición | construirLiquidarIrpfAnual y propiedades soportadas/pagos/estimadas; no se repiten escalas del lote A |
| Cierre jurídico, autenticidad y redondeo mensual | No aplicables como aceptación técnica | Sin norma nueva, sin revisión fiscal, sin TGSS mensual cerrado |

`ocurrencias-r21.json` conserva cada occurrenceId, origen hoja/control, selector y localizador. Las hojas efectivas de máximo anual conservan rango de declaración y selector[año]; ese rango no se declara token numérico. Para tipos por lado se conserva la propiedad seleccionada y se excluye el otro lado. Índices y claves anuales se distinguen de multiplicadores monetarios. No se copian 325 aristas por mera cohabitación ni se calcula cobertura fiscal a partir de esos recuentos.

## Decisiones de método y límites

1. Fórmulas descompuestas y puertos formales, con AST como evidencia. Objeción: extraer árboles no resuelve causalidad. Respuesta: las relaciones se declaran por lecturas, operaciones y argumentos efectivos; los hechos AST no generan aristas. Coste: autoría y revisión humana posteriores, sin presentarlo como un analizador de flujo general.
2. Fronteras por archivo/hash/símbolo/propiedad. Objeción: una frontera podría ocultar un auxiliar propio. Respuesta: se expanden familia, umbrales, escala, legacy y conversiones; solo rentas y admisión anual ajenas quedan para composición. Coste: no afirmar cierre global ni reutilizar las escalas del lote A.
3. Mutaciones en memoria sobre TS real. Objeción: un discriminante puede pasar por un caso insensible. Respuesta: se contrastan invariantes y variaciones de propiedades distintas, incluidos efectos por modo/fecha y propiedad no consumida. Coste: los casos no prueban todo el dominio ni la vigencia jurídica; se mantienen junto al examen estático.
4. Sin fuentes nuevas. Objeción: el encargo largo requiere evidencia oficial. Respuesta: este lote resuelve dependencias de la fuente fijada, sin realizar auditoría jurídica ni cambiar normas. Coste: interpretación, autenticidad y revisión permanecen separadas; las citas de las ediciones previas no se autoaceptan.
5. Serialización y Nix. Objeción: saltar la cola de validación pondría en riesgo Victus. Respuesta: un trabajador y bloqueo pesado para AST, casos, tipos e inventario; recepción física acotada con su propio bloqueo. Coste: espera por la cola compartida, sin relajar reglas ni atribuir pruebas no ejecutadas.

Inventario30df… y artefacto59ba… permanecen fijados; los 65 sitios no se convierten en una aceptación de 52.461 ocurrencias. R23 conserva 36 snapshots y V1a0c7…/V25737… con cierre de 719 objetos. Madrid e16b… sigue pendiente; los 264 payloads no se promueven. Crossa conserva v1 histórico desfasado, misma casa/dueño, copia local fuera de Victus, sin independencia/remoto. No se escribe allí.

Sin mutaciones VCS, commits, PR, publicación, servidor, preview, rediseño, LFS, gasto, transferencia, interacción enX ni mensajes a terceros. No se toca ESTADO, DECISIONES, informes previos, motor, registros de confianza ni atestaciones. No hay nuevos originales ni CAS que transferir.

## Comprobaciones de entrega

El cotejo inicial verifica HEAD y las 14.957 entradas usando lstat, readlink y bytes contra un blob cada vez: cero diferencias, diff vacío. La comprobación final repetirá el mismo método después de cerrar la entrega; su resultado efectivo se conserva separado. `COMANDOS.md` registra reproducción y límites. El manifiesto enumera rutas relativas,SHA256,tamaño,baseSha256 y HEAD; el patch textual gzip y mapa de binarios transportan adiciones sin commit. Los metadatos autorreferentes quedan explícitamente excluidos de su propio manifiesto.

Resultado de la validación final ejecutada: 28 discriminantes correctos; oxlint sin diagnósticos y las 16 reglas a error; checkJs correcto; 1.446 localizaciones cotejadas, schema correcto y tres alteraciones estructurales rechazadas. Se registran 665 tokens propios, 388 con occurrenceId sintáctico exacto del inventario. Los demás son tokens no inventariados como elemento, no identidades creadas por este autor. Del anexo R21, este lote consume 76 hojas y 15 controles; las otras 234 ocurrencias se asignan explícitamente a rentas. Son denominadores técnicos de disposición, no reglas aceptadas ni demostración del cierre semántico por conteo.

El primer control de tipos falló por cuatro diagnósticos de los instrumentos y se conserva íntegro. El segundo pase completo terminó con código 0, sin cambiar esperados recibidos, relajar reglas ni modificar el motor. Los resultados discriminan relaciones concretas; la revisión independiente de las aristas sigue pendiente. Las nuevas fórmulas y fronteras son una propuesta para esa revisión y posterior composición.

Ampliación de terminales: `terminales-retencion.json` dispone individualmente los tokens de retención y umbrales, con occurrenceId cuando existe, selector de inventario y ruta de propiedad. Se excluyen los campos `resto`, los literales de tipos borrados y los metadatos hash/referencia que solo alimentan el rastro. Una celda de umbral tiene dos lecturas distintas: fila/columna efectiva y candidato al máximo de celdas no nulas; ambas se explican sin atribuirle dependencia sobre la base o el mínimo. Los parámetros internos de escala, calendario, reparto y mínimos se conservan como formales con argumentos resueltos, no como supuestas entradas públicas.

`cadenas-por-sitio.json.gz` expande los pasos y argumentos del grafo para cada propiedad; `caminos-ocurrencias.json.gz` conserva rutas del anexo R21 hacia sus consumidores SS y excluye el lado contrario en los tipos específicos. Estas expansiones recorren relaciones ya declaradas, no inventan causalidad. Un puerto formal se resuelve con la llamada conservada y no se presenta como dato público. El índice 0 de `Parameters<...>[0]` es exclusivamente de tipos y se excluye del flujo runtime, a diferencia de los accesos a tuplas de tipos de solidaridad.

Cotejo físico final ejecutado: HEAD correcto, 14.957 entradas, cero diferencias, cero borrados y diff contra base vacío. `fisico-final.json.gz` y `fisico-final.log` conservan el resultado. Solo se entregan adiciones en la carpeta exclusiva; no se ejecutó ninguna mutación VCS.

Separación adicional por propiedad: los cuatro importes opcionales tienen nodos distintos. Irregular1/2 entran en el neto; pensión compensatoria entra en la base; anualidades entra en cuota, no en el neto. Pensionista, desempleado e hijos también se separan: exención y límite43 consumen las dos primeras propiedades, nunca el importe hijos600. Compartir `importeOpcional` o el objeto de reducción laboral no permite unir todas sus entradas a todos los consumidores.

El pase final completo incluye 28 discriminantes y la disposición de 513 tokens de retención/umbrales, de los que 277 tienen occurrenceId exacto; el resto conserva su identidad de código sin inventar IDs de inventario. La clasificación excluye expresamente los tokens de tipos. Se expanden 503 rutas candidatas del anexo SS; no son 503 reglas ni evidencias independientes. El control posterior a las últimas ediciones se conserva en fisico-cierre.json.gz/fisico-cierre.log, además de los dos controles físicos previos. La aceptación jurídica y la revisión independiente siguen pendientes.
