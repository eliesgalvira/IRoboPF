# Candidato R59: dominio y protocolo

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

El dominio nuevo es `causal-rentas-r59`, versión 3. Se usan fuentes históricas fijadas por R36 y una composición reconstruida de sus operaciones. Los programas participantes se conservan separados mediante prefijos `rentas:` y `ss:`; el resto del identificador conserva archivo, intervalo UTF16 y operación. Los frames identifican función y llamada con esos identificadores. Una referencia de evento identifica una ocurrencia dentro de la ejecución, nunca una cuantía.

Las ocho fases generales comparten entorno: íntegro laboral, SS, trabajo, íntegro inmobiliario, neto inmobiliario, ganancias, otras rentas y artículo 20. Se transportan diez propiedades hasta `origen.decimal`, con display separado. La llamada SS recibe directamente el productor del año y el productor del binding salarial. La evaluación SS es interna; no emite artificialmente sus once líneas. El fallback de trabajo no es alcanzado: la llamada general proporciona siempre `cotizacionTrabajador`. No se inventa una entrada para activar ese fallback.

El productor y el núcleo público reconstruyen el contrato antes de evaluar. El verificador vuelve a exigirlo, comprueba relaciones locales y compara con replay completo. Este replay comparte semántica: no es un segundo oracle independiente. Los ensayos separan la API financiera TS real del productor y comprueban expectativas racionales cuando se declaran. El productor no ejecuta ni transpila el motor.

Las obligaciones editoriales R36 permanecen `candidate-finite-program`, con revisión y admisión pendientes. La igualdad del contrato derivado no autentica el runtime ni valida derechos. Datos ordinarios densos, síncronos, finitos, sin getters/proxies hostiles ni callbacks externos; Decimal concreto sin reconfiguración; instrumentación fija. Se aceptan fechas Date en el campo original y su proyección UTC, sin reinterpretar períodos.

La gramática añadida es concreta: Option.fromNullishOr/getOrElse/match, EffectArray.map, map de array de partes civiles, split/padStart/join, destructuración posicional y sus defaults, DateTime.makeUnsafe/toPartsUtc, getUTCFullYear/Month/Date y Match.undefined. No habilita Schema/Result ni asignaciones arbitrarias: esas formas no se alcanzan en esta vertical. La fuente financiera mantiene toda fórmula, orden y cardinalidad de llamadas.

`admissionClosed`, `siteClosed`, `wiringAllowed` y `completeRuleAcceptance` permanecen false. No se resuelven las diez salidas explícitas de rentas, las 28 escalas ni las 19 familias de actividad. Tras este hito seguirían las otras 38 salidas, composición y admisión del objetivo global 65/19. La revisión independiente corresponde al integrador.

El dato de entrada se presupone árbol JSON ordinario acíclico; la única excepción es Date concreta en fechaFallecimiento, sin métodos/prototipos alterados. No se acredita comportamiento ante proxies, getters o reconfiguración global de primitivas. Las unidades explícitas de entradas, selectores y fronteras monetarias no constituyen un teorema dimensional de todos los eventos internos; estos pueden conservar etiquetas contextuales/estructurales.
