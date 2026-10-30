# Correcciones de las obligaciones y colecciones en la evidencia causal SS

El contraste de integración reproduce y corrobora R55-N01 y R55-N02 como defectos de evidencia. Se corrigen sus dos causas en el intérprete/verificador causal; no se cambia el motor financiero. La vertical sigue candidata hasta una revisión independiente nueva de estos cambios. No se declara admisión anual, aceptación fiscal ni cierre global 65/19.

## R55-N01: exigir cierre de obligaciones en las API directas

El ensayo original modifica un literal empresarial de `0.236` a `0.999` y declara correctamente su obligación pendiente. `validateSS` lo admite como fragmento pendiente, por diseño. El adaptador lo rechaza, pero las API directas anteriores generan y verifican el testigo adulterado: 9.420 frente a 32.310 en la cuota empresarial ordinaria del ensayo. Eso no demuestra un error del motor auténtico ni una vulneración de autenticación.

El contraste de integración reproduce el contraejemplo byte a byte y los rojos originales por sus aserciones. Dos regresiones propias exigen rechazo del productor directo y del verificador directo. La segunda conserva la IR auténtica y solo declara un pendiente explícito; su sobre se recalcula, de modo que el rojo no depende de un digest obsoleto. Ambas fallan antes de la corrección.

`requireExecutableSS` ejecuta la validación derivada de fuentes y exige lista de pendientes vacía y todas las obligaciones satisfechas. Se aplica a `executeCausalSS` y `verifyCausalSS`. `validateSS` conserva su capacidad de describir fragmentos incompletos; describirlos no autoriza ahora a producir o aceptar evidencia causal ejecutable. No se confía en que el cliente declare satisfechas las obligaciones: la comprobación previa sigue derivándolas de las fuentes.

## R55-N02: distinguir estructura de colección y valores consumidos

El contraste de integración reproduce diez celdas ordinarias en los slices empresarial, trabajador, ambos totales y coste laboral. Cada salida necesita cinco celdas de su lado; las cinco contrarias llegan por el receptor completo de reduce. El dinero coincide, pero esa dependencia financiera es espuria. Cinco regresiones propias fallan por esa contaminación antes del cambio.

La selección conserva receptor e identidad ordenada de cada elemento mediante aristas `identity:receiver` e `identity:element:<índice>`. La cardinalidad sigue siendo el valor del evento estructural. Semilla y callback mantienen sus dependencias normales; las propiedades realmente consumidas por cada invocación siguen proporcionando los operandos financieros. No se eliminan los objetos ni sus identidades de la evidencia: se separa su pertenencia a la colección del recorrido financiero.

El consumidor comprueba receptor array, cardinalidad, número y orden de miembros, correspondencia de sus valores y presencia única de semilla y callback. El replay fijado conserva además la identidad exacta de los productores, incluidos elementos de igual valor. Ocho controles adicionales cubren vacío, repetidos, dos valores, receptor/miembro ausente, cardinalidad/orden falsos y sustitución de productor de igual importe. Todos los adversos conservan las salidas monetarias al adulterar la evidencia.

El schema y la versión estructural 1 se conservan: las aristas siguen su contrato existente de identidad, pero se corrige cómo se producen y comprueban. Los testigos anteriores no se reescriben. No se extiende la conclusión a colecciones arbitrarias ni a otras gramáticas; el alcance sigue siendo la IR SS fijada, datos ordinarios densos y entorno estable.

## Validación y conservación

Los dos rojos originales y las siete regresiones previas se reproducen. La batería integrada contiene 101 pruebas distintas: 15 nuevas, 44 causales recibidas, 21 SS y 21 de puertos. Los recuentos repetidos no se suman. Comandos, resultados y entorno quedan en los JSON/logs del directorio; los pases terminales son la referencia final.

Se regeneran 18 testigos: los diez de R55 y los ocho propios del revisor. Para 198 salidas se exige igualdad de importes, display y transporte; también permanecen iguales programa, fuentes, entradas, contexto, frames, bindings y valores de todos los eventos. Solo cambian aristas de selección de colección, slices derivados y hashes del software. Las cinco salidas afectadas conservan cinco celdas ordinarias propias y cero contrarias en cada testigo. Se comprueba rechazo de los testigos anteriores, verificación de los nuevos y conformidad con schema. Los históricos originales permanecen intactos.

El primer chequeo global detecta tres diagnósticos de estrechamiento sobre `unknown`. Se anota explícitamente la firma `never` de la función local de rechazo; la comparación con TypeScript acredita que emite exactamente el mismo JavaScript. Se preservan ese fallo y la edición intermedia de testigos/fuente en CAS, identificada en `preajuste-tipos.json`. La edición terminal se vuelve a generar con su software exacto.

La revisión recibida no pudo reproducir tipos globales en su checkout por fixtures privados ausentes y una importación histórica absoluta. Su sonda checkJs con Effect activo tiene 85 diagnósticos y no es comparable sin más con la sonda anterior sin plugins. Se conservan ambas descripciones sin llamar verdes a esos ensayos. La validación de integración utiliza el proyecto real, principal y vendor, con diagnósticos Effect activos. La deuda checkJs no se da por resuelta.

## Decisión y alcance

D127 exige cierre en todas las entradas de evidencia y preserva prueba estructural sin atribuir valores hermanos a una cuota. Objeción: excluir una arista del slice podría esconder selección necesaria. Respuesta: conservar referencias ordenadas, comprobar estructura y mantener la ejecución/replay y los operandos propios; pedir revisión nueva de esa separación concreta y de sus límites. Coste: obligaciones estructurales adicionales y nuevos testigos. El replay sigue sin ser un oracle semántico independiente ni una autenticación del entorno.

El cambio afecta al módulo causal y a sus regresiones. No amplía el dictamen a otros sitios, a las 19 familias de actividad, a la composición ni a la admisión anual.

Validación terminal terminada: 101 pruebas correctas, tipos globales principal/vendor y lint global correctos. Los 18 testigos verifican y cumplen schema 2020-12. Los JSON terminales acreditan estos resultados; los fallos anteriores se conservan.
