# Revisión independiente de escalas y mínimos

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `7668bdad60a79a8b3ad8e1e1b911f3d6c223692a`.

Dictamen: contenido aprovechable como explicación candidata de operaciones implementadas, con ajustes necesarios antes de adaptarlo al publicador. No hay demostración nueva de una cuota errónea del motor en esta revisión. Hay carencias reproducibles de soporte primario enlazado y de explicación de una condición familiar. Estos hallazgos propios son **candidatos para contraste del padre**. Ninguna aceptación jurídica limitada se amplía a regla completa.

Se revisan los 28 sitios, el concepto Madrid y las 264 celdas. `decisiones-sitios.json` conserva decisión por ID y las cinco secciones examinadas; `decision-concepto.json` decide el concepto; `decisiones-celdas.json` contiene 264 decisiones individualizadas. La derivación CEL-01 siguiente se comparte expresamente entre celdas, sin suprimir ninguna decisión. `correspondencias-r19.json` coteja cada decisión con su payload actual por ID, itemId y hash; no atesta esos payloads ni duplica la revisión jurídica del otro revisor.

## Hallazgos nuevos candidatos

### SEM-01 — Las cuantías madrileñas de 2025 no tienen sus pasajes primarios en las fichas que las enseñan

Afecta directamente a `anual.explicito.cuota.autonomica`, `anual.minimo.autonomico`, `anual.cuota.minimo-autonomico-tramo` y a las composiciones que dependen de ellas. La ficha explícita afirma mínimo 5.956,65, tabla MADRID_2025 y Ley 13/2023. Sus fuentesPrimarias remiten a páginas de una compilación de LIRPF; no incluyen la norma madrileña de la tabla ni el pasaje del mínimo. Las diez celdas de MADRID_2022 corresponden a otra tabla y no suplen esa falta. La cifra puede ser correcta y, aun así, la cadena editorial está incompleta.

Reproducción roja en `adversos.py`: revisar las citas enlazadas por esa ficha y comprobar que no contienen siquiera el literal 5.956,65. Esta búsqueda es un detector de ausencia en este conjunto, nunca criterio suficiente de autenticidad, vigencia o aceptación. El diagnóstico completo es la inspección de la lista de fuentes, de sus documentos y de las afirmaciones concretas. No se infiere un error fiscal de la falta del literal.

Ajuste: enlazar el original exacto de la norma madrileña y sus pasajes de tabla y mínimos, con ambos hashes, página/caja/captura; derivar las cuantías por rol y año. Reutilizar solo la adquisición ya preservada cuya identidad se pueda demostrar; no adivinar URL ni añadir otra versión silenciosamente.

Objeción del mejor experto: el texto ya declara pendiente la vigencia, por lo que no promete aceptación. Respuesta: esa reserva evita una certificación falsa, pero no satisface la explicación documental del parámetro concreto. Coste: mantener las fichas como candidatas y completar las referencias antes de publicarlas como documentación de ese valor.

### SEM-02 — Falta el pasaje que sustenta el juego propio de mínimos 2012–2014

`anual.minimo.contribuyente` explica 5.151/918/1.122 y atribuye Ley 39/2010 art.61. En el conjunto enlazado se citan páginas63/64 de esa ley, páginas30/31/34 de la reforma2014 y páginas35–38 de la compilación2025. Los pasajes enlazados no reproducen 5.151. La compilación posterior no prueba retrospectivamente el juego anterior. El original de Ley 39/2010 está preservado y las 244 citas globales incluyen el pasaje pertinente: falta conectarlo a esta ficha, no descargar otra versión.

Reproducción roja independiente: segundo diagnóstico de `adversos.py`. Ajuste: enlazar las tres citas existentes `docs/procedencia/evidencias/estatales/citas/min-2012-2014-contribuyente-{general,adicionalMayor65,adicionalMayor75}.json`, todas del original e7b629… página61, reextraídas también aquí. No hace falta duplicar el recorte ya preservado. Explicar el soporte temporal2012–2014 por afirmación, sin usar por asociación el artículo62 de escalas de la página siguiente. Revisar del mismo modo las otras cuantías antiguas de discapacidad.

Objeción: el mismo PDF está en originales.json y basta buscar dentro. Respuesta: un original de cientos de páginas no es una cita de la afirmación; el encargo exige el pasaje y facsímil exactos. Coste: seleccionar las referencias existentes y revisar su alcance, conservando los originales e históricos.

### SEM-03 — «Grado preferente» no explica la excepción de renta del titular próximo

`anual.minimo.descendientes` y la derivación común explican renta del descendiente, elegibilidad previa, orden y reparto. No explican que la renta del **titular de grado más próximo** también decide qué grado recibe el derecho cuando concurren titulares de distinto grado. Son dos rentas distintas. El código `titularesConDerecho` en `lib/dominio/irpf/minimos/derechos.ts` comprueba `cercanos.every((t) => t.rentasNoExentasCentimos <= 800000)` antes de devolver `siguientes`.

Contraejemplo: menor con renta0, padre y abuelo residentes con relación habilitante y todos los demás hechos iguales. Padre con renta8.000 da paso al grado siguiente; padre con8.000,01 conserva el grado próximo. Decir solo «grado preferente» permite dos interpretaciones incompatibles y no enseña cómo reconstruir la selección. Los casos `FAM-padre-renta...` de `adversos.py` fijan las expectativas sin importar el motor. No se anuncia una cuota calculada para hechos familiares incompletos.

Ajuste: explicar por separado renta del descendiente, renta de los titulares próximos, concurrencia de grados, elección de titulares, orden de los descendientes que generan derecho y reparto del importe. Añadir un ejemplo de cada lado de 8.000, incluyendo cómo se concilia la renta propia antes de reducciones/compensaciones. Mantener MDV2-P01 abierto y la exclusión anual del custodio pagador sin mínimo; no derivar una especialidad de alimentos por descarte.

Objeción: «grado preferente» remite implícitamente al art.61 y el código está indexado. Respuesta: una explicación experta debe expresar la condición que invierte el resultado; el índice no la explica. Coste: más texto y casos familiares, sin cambiar motor ni promover el alcance jurídico.

## Decisiones compartidas y objeciones descartadas

**CEL-01, aplicable individualmente a las 264 decisiones del JSON.** La fórmula Q+(B−L)t distingue base inferior y cuota fija, EUR de renta y EUR de impuesto, y tipo por uno. Cada registro identifica tabla, fila0-based, columna, ejercicio y condiciones heredadas de la decisión previa. Los textos no se reducen a cambiar títulos: identifican el papel de cada celda, las cuotas publicadas y el tratamiento especial de Murcia. La aritmética B=L+1 es aprovechable como ejemplo de fila. Objeción: ese ejemplo no prueba el selector. Respuesta: el autor lo reconoce y aquí se demuestra con un mutante inclusivo de Murcia que sobrevive aL+1 y se distingue enL. Coste: conservar las 264 celdas como candidatas, sin declarar selector verificado por los ejemplos y exigir pruebas de frontera y tiempo cuando se integren. El tipo usado como dependencia no se acepta por una decisión EUR sobre base/cuota.

**ESC-01, escalas publicadas.** La explicación distingue una fila seleccionada por escala de la suma de anchos marginales. En2012–2014 suma ordinaria y complementaria; `simulada-estatal` conserva un contrato conjunto separado. Murcia60000 es la fila anterior;60000+ε usa la cláusula estricta. Objeción: el salto publicado parece transcripción errónea. Respuesta: ni continuidad matemática ni el helper permiten reescribir la fuente. Coste: conservar discontinuidad y reservas históricas, sin extrapolar a fallecimientos o2026.

**AH-01, ahorro.** Dos remanentes separados y los órdenes temporales son sustantivos. Para2015, con BA6000 y remanentes2500/1000, resultan332,50 estatales y500 autonómicos; dividir el total por dos falla. Para2014, BA9000 y remanente1000, F(8000)=1760 frente F(9000)−F(1000)=1800. Objeción: un caso sin cruzar un tramo deja pasar el orden equivocado. Respuesta: el caso nuevo cruza6000 y discrimina40EUR. Coste: mantener casos de orden y componentes, sin aceptar el derecho al mínimo ni la regla jurídica completa por igualdad de resultados.

**FAM-01, mínimos.** El mínimo propio no se reparte; el reparto corresponde a cada derecho descendiente. El helper antiguo filtra antes de ordenar y no acredita renta/convivencia. Tres hijos mayores de3 a medias dan5550+(2400+2700+4000)/2=10100, no la mitad del mínimo propio. Objeción: la selección de titulares también puede cambiar el orden y la renta a cotejar. Respuesta: SEM-03 exige explicitar esa condición y MDV2-P01 sigue siendo reserva, no cuota legal resuelta. Coste: explicación adicional por cruce, sin convertir declaraciones de hechos en verificación administrativa.

**BAS-01, signos y deducciones.** BIG y BLG pueden ser negativas mientras la tarifa recibe base positiva. Consignación autonómica se limita a cuota autonómica general más ahorro; la ruta simulada conserva su excepción. DA61 se resta una sola vez después de la cuota líquida legal/art80, luego se restan retenciones y pagos. Objeción: usar la misma etiqueta «cuota» puede duplicar la deducción o redondear antes. Respuesta: conservar nombres, unidades y orden de las dos rutas (céntimos agregados frente decimal explícito). Coste: no unificar sus contratos ni prometer351 evaluadores por tener351 entradas de catálogo.

**MAD-01, concepto2020.** El límite53.407,20 deBOCM y el53.407,29 del manual siguen distintos. La derivación7395,8289 es de tabla publicada; la ficha declara que el motor2020 conserva integración. Objeción: usar ese resultado como expected de cualquier representación sería falso. Respuesta: aceptar editorialmente solo la explicación del límite y de la diferencia, sin extenderla a cuotas fijas ni a una errata oficialAEAT no acreditada. Coste: conservar ambas fuentes y la distinción de contratos.

**DESC-01, alcance del explícito.** Se descarta la sospecha inicial de obsolescencia por familiares: `trabajo-anual/conexion-contrato.ts` exige `familiaresConDerechoMinimo:"ninguno"`, edad18–64 y sin discapacidad. Es otra ruta distinta de `liquidarTrabajoIndividualSimple` con derechos. Objeción: ambas se llaman anuales y compartenMadrid2025. Respuesta: cotejar símbolo, schema y llamada exactos. Coste: mantener explicaciones separadas aunque compartan cifras.

## Correspondencias, dependencias y adaptación futura

Los selectores UTF16 de las28 llamadas se contrastan con códigoExacto, hash de fuente y sujeto/revisión del rastro actual. La revisión histórica de la autoría no se cambia para parecer actual. Las264 celdas enlazan la tabla/símbolo/ruta de segmentos, y `correspondencias-r19.json` vuelve a resolver su decisión hacia el payload actual. Igualdad numérica nunca decide esa identidad.

`dependencias.json.gz` es un índice de módulos, no cierre transitivo: lo declara su razón. Para publicar hay que ampliar el cierre. Por ejemplo, la conexión explícita depende de conexion-contrato, adaptarTrabajoAnual, calcularDeduccionTrabajo, reducción con otras rentas, parámetros territoriales, tablas y mínimos. El grupo mínimos necesita derechos-contrato, y las condiciones anuales de conciliación/exclusión viven también en liquidar-irpf-anual. El grupo de escalas remite a datos anuales desde escalas-gravamen. Un índice de ocurrencias de esas funciones no acredita las importaciones, las condiciones ni el wiring. Esto es una necesidad concreta de integración, no una acusación de que el autor haya prometido un cierre que no afirma.

Propuesta sin implementar:

- Resolver cada siteId a su referencia actual exacta y emitir una **nueva revisión** de Entidad Step con sus secciones candidatas. No sobrescribir la revisión259584 histórica.
- Copiar solo campos compatibles de las cinco secciones. entradasSalidas y derivacionComun requieren representación explícita: crear Entidad Derivation por derivación común, arista `derivacion`, y aristas `entrada` a parámetros reales. Conservar texto específico del sitio en Step; no sustituirlo por el común.
- Mapear archivo/hash/localizador a `fuentes`; la unidad EUR/año no debe sustituir ciegamente la unidad runtime EUR: conservar importe de ejercicio y convención de unidad de la línea.
- Crear Document/Citation/Facsimile y aristas `evidencia`, `documento`, `captura` con originales por hash y recetas exactas. Los encabezados TextPositionSelector prueban localización, no toda la norma ni la vigencia. No transformarlos directamente en el selector PDF de Entidad sin dimensiones, caja y receta.
- Para celdas, resolver itemId en el inventario actual y mantener ejercicio/territorio/componente/supuesto como discriminantes. Conectar cada celda a su payload R19 exacto mediante registro de revisión nuevo del padre, solo después del contraste correspondiente. No convertir decisionPrevia en atestación actual.
- `Entidad.ambito` admite conocido/desconocido; una lista de años/territorios de la superposición no es por sí sola un predicado de vigencia. Mantener desconocido donde falte selector temporal acreditado, nunca fabricar el producto cartesiano de años por territorios.
- Mantener integridad, autenticidad, interpretación y revisiónBinding separadas. La política sigue candidata y aceptaciónFiscalCompleta false. Regenerar snapshot/publicador con el cierre físico completo, conservando los 32 anteriores.

Objeción del mejor experto: un mapeo meramente estructural puede producir páginas válidas con evidencia incorrecta. Respuesta: gates por afirmación, identidad exacta, dependencia transitiva y cierre físico antes de crear la nueva revisión publicable. Coste: trabajo posterior del padre y otra revisión del wiring; esta entrega no publica ni implementa UI.

## Límites y preservación

Se examinaron el informe, las editoriales y los recibos terminados, junto con el código pertinente. Los informes previos se usaron como índice.

Las fuentes primarias se registran por ruta literal, SHA256/SHA512 y tamaño en `originales-reabiertos.json`; `reextraccion-independiente.json` conserva las 244 citas, cajas, texto reextraído y las afirmaciones/celdas que las invocan. La asociación no significa que una página pruebe todas las afirmaciones de una ficha: SEM-01/02 lo refutan. `paginas-reextraidas.json` conserva el texto de las56 páginas únicas. Reabrir19 originales no equivale a leer cada página de esos19PDF enteros; la revisión se limita a sus pasajes invocados. Las compilaciones se usan para su texto reproducido, no para cerrar reformas históricas por asociación.

No se validan PAdES, CSV, confianza histórica, revocación ni custodia remota. El apéndice95d7… carece de URL en originales.json de la autoría: completar metadatos de adquisición oficiales antes de hacerlo Document público; no inventar esa URL. Crossa conserva v1 histórico desfasado, mismo dueño/casa, sin custodia independiente. Los paquetes y CAS del padre solo se leen.

No se anuncia cierre del BRIEF. Los inventarios, objetos, snapshots y cifras del encargo son identidades técnicas de referencia, no reglas completas aceptadas. Las264 propuestas permanecenpending y el payload individualMadrid e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258 no recibe atestación de esta revisión.

## Resultado de las comprobaciones propias

- HEAD y 13.422 entradas físicas coinciden, incluidos enlaces comprobados con lstat/readlink. El diff inicial de trabajo está vacío; el diff contra la base del autor se entrega en `diff-base.txt`.
-19 originales por SHA256/SHA512/tamaño y 244 citas geométricas correctos;56 páginas únicas reextraídas.28 llamadas por hash/UTF16/código/sujeto coinciden.264 triples de tabla/fila cotejados contra el TypeScript actual mediante extracción textual independiente y contra inventario actual, sin importar motor.
-61 facsímiles únicos regenerados por receta con coincidencia exacta en el pase final. Mi primer instrumento obtuvo52/61 porque no aplicaba el clip heredado de la caja de la cita en nueve recortes antiguos. Corregí únicamente mi instrumento para resolver `parameters.clip` o, en su ausencia, la caja de cita. No es un defecto de la autoría. Se conserva el primer log y el final.
-18 comprobaciones adversariales correctas; dos diagnósticos editoriales rojos preservados con salida1. No son18 supuestos fiscales íntegros nuevos: incluyen experimentos de mutación/metamórficos y reproducción deliberada deL+1 para demostrar su insuficiencia. No se ejecuta el motor para fabricar las expectativas ni se proclama una regresión runtime de todo el motor por estas comprobaciones aritméticas.
-117 archivos del recibo de esta autoría cotejados;264 correspondencias técnicas a R19 con estado pending. Estas comprobaciones no revisan por asociación sus ámbitos jurídicos.
-16 reglas anti-slop a error sin cambios. No hayTS/Effect nuevo. Ruff y tipos de los dos instrumentosPython son los controles propios; no se sustituyen por los pases del autor. El primer pase de mypy señaló una anotación de lista ausente en mi instrumento; se conserva y se corrige solo esa anotación antes del pase final.

La inspección visual propia consta en `inspeccion-visual-propia.json`:18 páginas, identificadas por original/página/hash del render/receta90 dpi. Incluye todas las representaciones tabulares distintas de las celdas seleccionadas, la tabla partida de Catalunya2022, la cláusula murciana fuera de tabla, las dos tablas distintas de Valencia en una página, Madrid2020/2022, mínimos antiguos/actuales y DA61. Es una muestra propia; las restantes 38 páginas únicas tienen reextracción y reproducción, no una inspección visual personal atribuida. Los renders propios quedan en scratch, regenerables desde los originales preservados; no se duplican estos PDF en la entrega.

Los JSON de control o logs que superan1 MB se entregan comprimidos con extensión `.json.gz`; los nombres sin sufijo en el texto denotan el mismo artefacto antes de empaquetarlo. `manifiesto.json` es la lista literal y definitiva de rutas, hash, tamaño ybaseSha256; no se incluye a sí mismo. `entrega.patch.gz` transporta las altas textuales y `binarios.json` identifica los demás binarios por hash. La entrega se limita a esta carpeta; el cierre comprueba de nuevo todos los bytes de la base y cero borrados. No se cambian originales, snapshots históricos, paquetes, registros ni atestaciones reales. Los nuevos hallazgos siguen siendo candidatos hasta contraste del padre.
