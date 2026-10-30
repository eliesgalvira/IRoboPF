# Correcciones de la contrarrevisión de admisión

Los cinco hallazgos R44-A01..05 quedan reproducidos y corregidos como candidatos técnicos. La admisión no se declara suficiente ni se conecta a publicación. Hace falta una revisión independiente nueva de estos bytes. No se cambia ninguna fórmula fiscal.

## Defectos reproducidos

Antes de editar producto se reproducen exactamente 58 pruebas: 49 pasan y nueve fallan, materializando los cinco hallazgos. El helper financiero sintético se extrae a scratch; solo sirve para aislar propagación, no acredita fórmulas. Se conservan fuentes del arnés previo y `rojos-previos.json/log`. La prueba con DTO anual real y campo no enumerable demuestra que dos casos con pagos distintos reutilizaban el mismo recibo.

## Cambios y objeciones

R44-A01: codec `admission-value-v2`, con discriminantes separados de los objetos de datos, propiedades propias y descriptores, orden, huecos y referencias compartidas, prototipo ordinario/null y valores numéricos especiales. Decimal y Date conservan su identidad de tipo y propiedades; las funciones internas requieren origen de programa. La codificación anterior no se acepta como recibo actual. Objeción: una representación por etiquetas puede volver a colisionar con datos que tengan esas etiquetas. Respuesta: los datos también se envuelven como objetos o arrays, y se ejercen colisiones, alias, ausencia, cero negativo y propiedades no enumerables. Coste: recibos versionados y nueva revisión; no autentica al emisor ni pretende serializar JS arbitrario.

R44-A02: el resultado opcional de escala exige `undefined` o un array de filas con las propiedades y tipos derivados de `FilaEscalaPublicada`. La interfaz fija campos Decimal y el booleano opcional; no se copian importes ni se recalculan cuotas. Objeción: que el productor futuro sea correcto no prueba que esta frontera rechace un número. Respuesta: la frontera ejecuta su schema, rechaza 17/null/objetos/filas incompletas y conserva los positivos. Coste: nueva dependencia fijada de la interfaz; su forma no valida cuantías, vigencias o emisor. Los contratos de otras fronteras mantienen sus límites explícitos.

R44-A03: Array exige `Array.prototype`, conforme al dominio anunciado. Una subclase produce pending, no rechazo fiscal. Objeción: un array heredado puede ser benigno. Respuesta: se hace ejecutable el límite declarado sin atribuir comportamiento malicioso al ejemplo. Coste: datos fuera de ese dominio requieren otro contrato revisado.

R44-A04: las referencias a reexportaciones conservan el módulo donde existe el nodo de llamada. El verificador contrasta hashes y coordenadas UTF-16 contra nodos AST reales para grafo, derechos y servicios. Objeción: el hash y la reconstrucción ya fijaban el origen. Respuesta: fijaban dos rangos inexistentes; ahora se comprueba el pasaje. Coste: lectura de fuentes y TypeScript en la verificación documental; el consumidor de ejecución sigue sin transpilar el motor. Un nodo AST real no demuestra por sí solo la semántica de toda la operación.

R44-A05: se extraen las tres declaraciones reales `titular`, `inicio` e `incremento` a una proyección finita de IR. Sus argumentos son el elemento seleccionado y el caso capturado; se preservan fuentes, operadores y constantes, sin duplicar manualmente la regla. La frontera compara el booleano del recibo con esa selección antes de aceptar cantidades externas. Objeción: tratarlo como puerto monetario dejaría incompleta la selección. Respuesta: se representa su dependencia no monetaria y se rechaza la contradicción al primer resultado; un paquete sin proyección queda pending. Coste: una raíz documental adicional y su revisión, sin validar importes ni habilitar el anual.

## Validación y límites

Pasan las 58 comprobaciones de la revisión adaptadas al candidato actual y 256 del pase de regresión, que incluyen 236 controles anteriores y 20 nuevos. No se suman como cobertura independiente ni como cierre fiscal. Los controles nuevos incluyen alias, huecos, propiedades adicionales, formas de escala, siete casos de selección de incremento y rechazo del codec anterior. Los casos de proyección aislada no afirman admisión temporal de sus datos.

`adaptacion-candidato.diff` conserva las dos expectativas que cambian por la corrección: ancla desplazada ahora rechazada y recibo contradictorio detenido en la primera llamada, antes de la segunda. También fija la reconstrucción del candidato actual en vez del artefacto histórico. No se modifican los tests o los esperados recibidos. Los cinco rojos históricos permanecen intactos; la validación de integración no repite aquí los 306 controles históricos completos.

Tipos principal/vendor, Oxlint y ESLint global pasan. Los logs conservan los fallos de anotación TS2339 y de nombres detectados y corregidos en las pruebas, sin alterar esperados. ESLint conserva avisos preexistentes. Los MJS de producto mantienen checkJs=false; tsc no acredita sus cuerpos.

Artefacto corregido SHA-256 `9d8f62076250c197e6fd840ac5b336306dc5cdcb3ff6a183ec8892604ac29b9a`: 27.379 nodos del grafo, 716 de derechos y 17 sitios todavía sin cierre. Schema y verificador pasan. `artefacto.json` fija dependencias y la proyección; `calidad-final.json` y logs conservan comandos/códigos. No se reescribe el fragmento histórico ni se migra aceptación.
