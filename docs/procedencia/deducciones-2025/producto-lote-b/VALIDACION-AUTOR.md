# Validación de autor del candidato privado

Validación terminada tras asignación de PESADO2 el5/11/2026. Una suite a la vez, Vitest con un worker y fileParallelism=false; cada ejecución con timeout -k30s. La raíz permaneció de sólo lectura y no se instalaron dependencias. Se usaron los paquetes fijados en su node_modules, sin copiarlo ni enlazarlo dentro de la entrega.

## Resultado

| Comprobación focal | Resultado final |
| --- | --- |
| Vitest del módulo y tests propios | 48 pruebas correctas |
| TypeScript estricto, configuración y diagnósticos Effect de raíz | Correcto, exit0 |
| Oxlint1.78.0 y ambos plugins anti-slop de raíz | Correcto, exit0 |
| ESLint9.39.4 con configuración raíz, sin caché y max-warnings=0 | Correcto, exit0 |
| Python: cobertura48, municipios41, parche y hashes | Correcto |

ESLint emite dos avisos de arranque porque la entrega privada no contiene React ni pages; no son diagnósticos de archivos ni exenciones de reglas. No se cambió la configuración raíz para ocultarlos. La validación privada conserva estos avisos.

Se heredó el tsconfig raíz con la única adaptación de resolución hacia las dependencias fijadas y selección exclusiva de los cuatro archivos TypeScript nuevos (tres de módulo, uno de tests); incremental=false para no dejar caché. Vitest también resuelve Decimal, Effect y Vitest a las dependencias de raíz. Configuraciones y logs quedan privadamente en validacion/, sellados en el manifiesto y fuera del parche público. Node24.19.0 y Bun1.3.13 se proporcionaron mediante Nix; Vitest4.1.5, TypeScript5.9.3, Decimal10.6.0 y Effect4.0.0-beta.57 son los de raíz.

## Fallos reproducidos y correcciones

Los33 casos iniciales pasaban. Se añadieron casos adversos antes de corregir producto: seis fallos quedaron en rojo-identidad-tiempo.log y un séptimo de antecedente transitorio en rojo-antecedente.log. Se conservan logs, parche y manifiesto del candidato inicial. Los tests no se eliminaron ni se relajaron para hacerlos pasar.

- Acogido igual a acogedor: antes devolvía cálculo parcial; ahora rechaza. Comprueba declarantes y todos los titulares del acogimiento.
- Hijo estudiante igual a un progenitor: antes sumaba cuantía; ahora rechaza, incluidos progenitores ajenos a la declaración individual.
- Hijo monoparental igual al progenitor o representante: antes sumaba200; ahora rechaza.
- Resolución judicial anterior al nacimiento: antes podía activar curatela representativa; ahora rechaza la cronología imposible.
- Resolución de acogimiento anterior al nacimiento: antes sumaba; ahora rechaza.
- Declarante en su propio mínimo familiar: antes aceptaba la colección contradictoria; ahora rechaza.
- Patria potestad originada después de la entrada de Ley8/2021 etiquetada como transitoria: antes sumaba200 por repetir la etiqueta; ahora exige resolución originaria anterior al3/9/2021. La fecha deriva de DFtercera (rbc-ley-2), publicación3/6/2021 y DTsegunda (cinco-DT2) ya auditadas. No se exige ni se inventa un plazo de revisión desde la DTquinta original.

Se amplió el contrato temporal: intervalo de acogimiento y cota de días posibles en2025; intervalo de estudios coincidente con el ejercicio, pagos posteriores al nacimiento y propiedad anterior a gastos/certificación forestales. Los nuevos casos cubren intervalos imposibles y de otros ejercicios. También comprueban una suma4250/21 y15% de0,01=3/2000 sin redondeo monetario intermedio.

Tipos detectó inicialmente Error nativo, Date nativo, condición numérica y ensanchamiento de un literal de test; el diagnóstico posterior señaló instanceof sobre un Schema. Se corrigieron mediante Schema.TaggedErrorClass, DateTime/Option, condición booleana explícita, literal preservado y Schema.is. Se consultaron effect-solutions list/show error-handling/data-modeling y las fuentes locales DateTime/Data. Oxlint detectó un tipo anónimo de retorno que descartaba inferencia; se eliminó esa anotación, sin desactivar reglas. Los logs iniciales también se conservan.

## Límites conservados

La matriz sigue en9 códigos nuevos de cálculo parcial,2 contratos existentes para reutilización y37 pendientes. No se amplía de forma implícita conjunta/individual, ni se añaden liquidación, dispatcher, inventario, CI o cuota regional duplicada. Continúan los límites de agregación forestal, composición educativa individual y cuota/arrastre de vivienda protegida descritos en ALCANCE.md. Los documentos referenciados no acreditan automáticamente autenticidad, vigencia material ni derechos particulares. La validación técnica de autor no sustituye revisión independiente del cambio.

PESADO2 queda liberado al terminar esta validación. PESADO1 y la repetición de CI corresponden al padre.
