# Evidencia estatal v2 candidata

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Base examinada: `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`. Evidencia candidata sin aceptación fiscal.

`entradas-leidas.json` fija los archivos completos procesados por la receta, incluidos los JSON de los lotes estatales y su revisión. Las nuevas exposiciones se examinan en `escalas-publicadas.ts` y en el inventario fijado; el histórico y el posterior se comparan por separado.

## Resultado documental y límites

ESTV1-01 se subsana en 26 citas nuevas: 12 celdas de la escala ordinaria y 14 de la complementaria. Para base se identifica la cabecera geométrica «Hasta euros» y se enlaza el token `euros` dentro de ella; para cuota se conserva `Euros`, con su caja de cabecera propia. Las coordenadas y offsets anteriores/nuevos están en `unidades-geometricas-26.json`. La cabecera complementaria «Incremento en cuota íntegra estatal» se distingue de «Cuota íntegra» ordinaria. No se busca una unidad en un párrafo vecino ni se altera el literal para satisfacer el lexer.

ESTV1-02 se representa mediante dos citas de contexto nuevas, p62 y p63 del mismo original BOE-A-2010-19703, ordenadas en `contexto-compuesto.json`. Se relacionan las tres citas históricas de discapacidad familiar, sin reescribirlas. La página 62 comienza el artículo 60.2 y la 63 continúa sujeto, requisitos y cuantías. La relación editorial compuesta queda propuesta; no se afirma soporte de condiciones compuestas en el coordinador ni se acepta elegibilidad.

Se proponen 78 payloads: 26 identidades efectivas distintas por tres ejercicios. Todos pertenecen al archivo canónico y a los símbolos ordinario/complementario exactos, con ruta de fila y columna. **Todos permanecen bloqueados** por territorio técnico vacío, ausencia del archivo canónico en la decisión jurídica previa y revisión nueva pendiente. Los 13 tipos quedan sin payload por conversión porcentual no autorizada. Las restantes tablas del archivo quedan fuera de este lote documental.

La matriz original de 319 payloads se revisa contra su inventario histórico y sus fuentes históricas. Se compara además cada identidad exacta con el inventario actual y se conserva la referencia a los bloqueos individuales del revisor anterior. No se migran los 190 aliases de mínimos 2015–2024, ni se amplía MIN-013, ni se promueven las 53 hojas legacy de trabajo. Que una decisión jurídica previa esté aceptada no acepta un binding fresco. La continuidad anual de esos diez años sigue pendiente de cadena normativa; `continuidad-2015-2024.json` conserva una decisión por ejercicio, sin inferir vigencia de la importación técnica.

## Comprobaciones y dimensiones

Integridad: originales por SHA-256/SHA-512/tamaño, textos y geometría reextraídos, hashes de inventarios y fuentes, renders con receta original y comparación de bytes, schemas de citas y payloads. Los resultados ejecutados se recogen en `resultados.json`, `discriminantes.json` y los logs finales; no se suman pruebas solapadas.

Autenticidad: no validada por este trabajo. No se verifican PAdES, CSV, confianza histórica ni sello externo. HTTPS y hashes no acreditan por sí solos al emisor.

Interpretación: cuantías nominales por sujeto, columna y componente. Inspección visual personal de los facsímiles ordinario p63, complementario p53 y discapacidad p62–63. No se afirma inspección visual nueva de los otros diez facsímiles.

Exactitud: comparación Decimal por identidad de fuente/símbolo/ruta del inventario fijado. No equivale a reconstrucción fresca del motor ni a prueba de consumo anual de todas sus hojas.

Aceptación: ninguna. Propuesta de registro separada, atestaciones nulas y `completeRuleAcceptance: false`. No se ejecuta el coordinador: no se cumplen sus requisitos de ámbito y decisión. No se crea una decisión para evitar ese rechazo.

## Decisiones y coste

El contrato propuesto detalla cada elección y objeción en `CONTRATO-PROPUESTO.md`. La decisión principal conserva el bloqueo territorial: un experto rechazaría asignar territorio a todo un archivo que mezcla componentes y autonomías. Coste: revisión explícita por símbolo antes de registrar.

Se conservan PNG nuevos en CAS propio por hash y se reutilizan originales del corpus raíz. Un experto rechazaría un cierre que solo enumera hashes sin objetos resolubles; el cierre declara rutas y verifica su presencia. Coste: aproximadamente cuatro MB de facsímiles en esta entrega, sin duplicar el corpus de casi un GB. Ninguna copia nueva externa; La evidencia de este análisis no acredita custodia independiente ni restauración externa.

Se conserva el primer fallo de la receta al recortar una cabecera con caja ajustada a los glifos. Se usan palabras reextraídas y unión geométrica de sus cajas para la cabecera. Objeción experta: corregir el texto extraído para que coincida escondería el defecto; no se normalizan ni modifican los bytes del PDF. Coste: la comprobación de cabecera usa la capa de palabras y su geometría, además del texto de página completo. El primer lint detectó un import Python sin uso, retirado antes del cierre.

No hay fixes numéricos de producto ni cambios de oracle. Los rojos documentales v1 quedan expresados por los 26 offsets ajenos a cabecera. Los discriminantes alteran el valor en memoria, separan base/cuota y componentes, comprueban el rechazo de ámbito/localización y distinguen cuota publicada de integral no redondeada. No se presentan como regresiones fiscales del motor.

## Entrega e integración

`REPRODUCCION.md` fija comandos, versiones, manifiestos y fuentes históricas/current explícitas. La integración debe comprobar `manifiesto.json` y el sobre `cierre.json`, copiar únicamente archivos de esta carpeta y verificar los hashes contra la base. Los PNG se integran por archivo/hash; `entrega.patch` contiene adiciones textuales. No hay modificaciones de archivos existentes ni borrados. Debe encargarse una revisión nueva del payload exacto y resolver los bloqueos antes de aplicar cualquier registro.

## Bloqueo adicional reproducido del contrato de decisión

`select_decision` rechaza EEA-CUOTAS-FIJAS antes de comprobar localización: sus objetos históricos usan `lines` y `currentSha256`, mientras el schema operativo admite `line` y `sha256`. El rechazo real se conserva en `rojo-schema-decision.log`. Incluso resolviendo esa incompatibilidad editorial, ninguno de esos localizadores refiere al archivo canónico. Objeción experta: eliminar campos o renombrarlos automáticamente para obtener verde podría alterar el alcance y la identidad temporal de una revisión. Decisión: conservar la decisión íntegra y bloquear los 78 candidatos también por schema; coste: aclaración editorial revisada separada, sin parche al software ni al informe ajeno. El caso discriminante exige este rechazo; no es una relajación del schema ni una prueba de producto corregida.

## Resultado ejecutado final

La reextracción final termina con código 0: siete originales, 83 citas, 13 renders idénticos, 26 unidades corregidas, 78 payloads candidatos y 319 comparaciones históricas/current iguales por identidad. Los 28 casos documentales pasan; se comprueban por separado 78 ámbitos vacíos, 78 localizaciones incompatibles y 78 rechazos del schema de decisión. El contexto compuesto y la distinción cuota publicada/integral quedan comprobados. `documental-final.log` conserva la salida real.

Lint y typecheck principal/vendor terminaron sin diagnósticos. Ruff y compilación sintáctica pasan; `python-cierre.log` registra los controles Python finales. Estos controles no acreditan una suite global de producto ni una validación fiscal.

Las cajas geométricas de cabecera se conservan en `unidades-geometricas-26.json`; los payloads mantienen el schema vigente de cita, con offsets literales, fila y columna. El coordinador actual no consume ese archivo auxiliar como una validación semántica automática de columna. Objeción experta: pasar el schema de cita no comprueba por sí solo la asociación geométrica. Coste: el revisor debe examinar esa relación y su reproducción antes de aceptar el binding; no se amplía el schema ni el software productivo en esta entrega.

La comprobación NUL precisó el problema restante: dos entradas de scratch de la revisión de preservación v2 son enlaces simbólicos, no archivos regulares. `is_file()` los marcaba como ausentes. El cierre final comprueba la presencia del enlace y coteja sus bytes de destino con `git show` de la base, sin seguirlo ni repararlo. Objeción experta: seguir enlaces ajenos no comprueba preservación del enlace y podría leer otro árbol; coste: control separado de entradas simbólicas. Se conserva el rechazo intermedio en `cierre-enlaces-scratch.log`. Esto no cambia la política del CAS candidato, que sigue rechazando symlinks.

La lectura posterior del primer sobre completo detectó que `cerrar.py` había cambiado durante ese cierre al ajustar la lectura literal de symlinks. No se acepta ese sobre intermedio. La ejecución definitiva serializa lint, tipos, cierre y relectura de todos los hashes bajo el mismo lock y sin más ediciones. Objeción experta: un manifiesto generado mientras se edita una dependencia no es un cierre estable; coste: repetir el sobre y su comprobación completa, conservando las evidencias documentales ya verificadas.
