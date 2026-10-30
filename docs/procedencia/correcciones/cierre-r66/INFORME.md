# Resultado técnico de los 65 sitios

La reparación de R64-PUSH-01 queda corroborada y el dictamen R65 se acepta exclusivamente en su alcance técnico condicionado. El resultado de los 65 sitios es 64 corroboraciones bajo condiciones y un bloqueo demostrado. No se promueven confianza, admisión, composición, wiring ni aceptación fiscal.

## Contraste sustantivo de integración

Se leen informe, dictámenes de los diez IDs, resultados, prueba propia y recibo terminal del revisor. Se contrasta el arreglo ya recibido: identidad compartida raw/props para arrays en el modo R62, versión de mutación local a cada evaluación e instantáneas serializadas al emitir. No se amplía a cualquier programa mutable ni se cambia una fórmula fiscal.

Se ejecuta una sola prueba focalizada del revisor sobre los bytes actuales de integración. Única adaptación: imports de scripts a rutas absolutas y carpeta propia de ejecución; las expectativas permanecen intactas. Compara el retorno entero con la API real excluyendo solo el campo editorial procedencia, prefijos de ambos pasos, longitudes [1,2], selecciones previas [0,1], ancestría de ambas mutaciones y aislamiento de dos ejecuciones. La entrada y la evidencia histórica permanecen intactas. Resultado: un pase, cero fallos y cero omisiones. El JSON y el gzip resultantes coinciden byte a byte con los del revisor; SHA256 del gzip `d98a80734e70d6601eea8354006fbef09b09475f427f2fc86a20dde3e774bc5e`.

El comando usa Node de Nix, Vitest configLoader native, cache:false, cacheDir propio, un trabajador y lock pesado solo durante la ejecución. `contraste.json`, instrumento adaptado, configuración y resultados permiten reproducirlo. No es otra revisión independiente ni se suman estos pases a los ocho ya ejecutados por el revisor como si fueran casos distintos. No se repiten suites verdes ni builds sin cambios de producto.

Las 65 decisiones se concilian con `lib/procedencia/rastro-generado.json`: conjuntos exactos e IDs únicos, 64 estados condicionados y uno bloqueado. `matriz-65.json` conserva cada dictamen por puntero/hash, condición, reserva y recepción de integración. `MATRIZ-65.md` ofrece la tabla legible. Los cuatro indicadores globales siguen falsos. Los sitios explícitos conservan la exclusión de actividad; ninguna suma por ID acredita todas sus variantes.

## Objeciones, costes y límites

La objeción relevante sería confundir un retorno correcto con semántica universal, aceptación fiscal o admisión pública. Se responde manteniendo descriptor/software/runtime exactos, datos ordinarios, perfil admitido y evidencia completa. El coste es conservar dos semánticas y renovar testigos con cambios de software; el replay compartido no constituye un segundo oracle completo. D137 y el informe final exponen esta limitación, la deuda checkJs, las reservas documentales y las estimaciones del trabajo excluido.

## Referencias del resultado

[INFORME-FINAL.md](../../INFORME-FINAL.md) presenta el resultado y los límites del alcance final. [commit-comprobado.json](commit-comprobado.json) conserva la verificación del respaldo documental.
