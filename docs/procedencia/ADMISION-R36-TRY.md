# R36: frontera explícita de `TryStatement`

El traductor representa ahora un `TryStatement` mediante una sentencia `pending-control`, vinculada al nodo fuente completo de `try` con sus cláusulas `catch` y `finally`. Se elimina el aborto de compilación por ese tipo de sentencia. No se implementa todavía su semántica de ejecución.

Cuando el intérprete alcanza esa frontera, devuelve `outcome: pending`, motivo `Semántica de TryStatement pendiente`, ningún valor calculado y ningún sitio admitido. Conserva en el rastro el identificador del nodo, que remite al archivo relativo, hash y rango UTF-16 de la fuente. No ejecuta ninguna parte de `try`, `catch` o `finally`, ni las sentencias posteriores de ese bloque. Las operaciones anteriores ya ejecutadas permanecen en el rastro. Una rama que no alcanza el `try` puede continuar con su comportamiento representado.

La frontera no consume recibos ni acepta evidencia externa para convertirse en éxito. No acredita una cuota ni la validez fiscal de un caso. `wiringAllowed`, `completeRuleAcceptance`, `admissionClosed` y `siteClosed` conservan sus puertas cerradas.

## Por qué se conserva una frontera

El intérprete utiliza excepciones internas para retornos, continuación de bucles, rechazo de dominio y falta de evidencia. También puede producir defectos propios. Tratarlas todas como excepciones del programa fuente permitiría que un `catch` ocultase un pendiente o cambiase un retorno.

La [semántica ECMAScript de `try`](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-try-statement-runtime-semantics-evaluation) distingue las terminaciones de tipo `throw` de las demás y establece cómo el resultado de `finally` conserva o sustituye la terminación previa. Una implementación completa necesita representar esas distinciones y los ámbitos del parámetro de `catch`. Esta entrega no supone que añadir un bloque nativo del intérprete baste para cumplirlas.

El censo AST de `lib/dominio/irpf/deducciones/` en este corte contiene 26 sentencias `try` en 26 archivos. Ese recuento describe sintaxis presente; no acredita 26 deducciones ni que todos esos módulos se hayan compilado o ejecutado íntegramente.

## Contrato y comprobaciones

- El [compilador](../../scripts/procedencia/flujo-admision-r36-compilador.mjs) emite la frontera sin traducir los cuerpos opacos. Detiene la traducción del resto de ese bloque, que la frontera hace inalcanzable en el intérprete.
- El [schema](../../schemas/procedencia/flujo/admision-r36.schema.json) cierra el nodo a `id`, `op: pending-control` y `syntax: TryStatement`. No permite un valor alternativo ni campos añadidos.
- El [verificador](../../scripts/procedencia/flujo-admision-r36-verificador.mjs) exige que el rango coincida con un `TryStatement` real de la fuente fijada, además de verificar la identidad del archivo. Un rango de otro nodo AST válido no basta. La sentencia no se acepta como expresión.
- El [intérprete](../../scripts/procedencia/flujo-admision-r36-runtime.mjs) conserva el pendiente al alcanzar el nodo. Las otras sentencias no soportadas siguen rechazadas; no se añade una tolerancia general de sintaxis.

Las [diez regresiones](../../tests/admision-r36-try.test.mjs) usan las tres formas de `try`, una función real de deducciones y las [fixtures de control](../../tests/fixtures/admision-r36-try.ts). Comprueban el pendiente antes de cualquier efecto de los cuerpos, la conservación de recorridos sin `try`, el rechazo de evidencia que pretenda liberar la frontera y los anclajes adulterados. Aíslan el grafo usando su subschema publicado y el verificador real; no simulan un artefacto completo con contratos monetarios y servicios. El validador completo de producción conserva todos sus requisitos. Las diez pasan y están añadidas a una lista explícita del workflow, que conserva sus 31 comandos.

## Límite observado después de `TryStatement`

La construcción global de `buildCompleteAdmission()` sigue sin completarse. Tras representar `TryStatement`, los tres archivos `admision-r46`, `admision-r48` y `flujo-admision-r36` encuentran una declaración no resuelta, `RangeError`, en `lib/dominio/irpf/liquidacion/composicion-anual.ts`.

Ese bloqueo también se reproduce con el compilador anterior de `6a9054ef`, al compilar directamente `componerLiquidacionAnual`. Estaba oculto por el aborto anterior al recorrer el grafo global. No se amplían aquí intrínsecos, clases ni contratos de otros compositores para hacer pasar esas tres suites. El [inventario histórico de la suite](INVENTARIO-SUITE-20261113.md) conserva la ejecución anterior al ajuste; sus otros grupos no se declaran resueltos.

Por tanto, esta entrega cierra el tratamiento explícito de `try` dentro del traductor finito, con una frontera pendiente. No certifica una ejecución completa de R36 ni una admisión anual completa.
