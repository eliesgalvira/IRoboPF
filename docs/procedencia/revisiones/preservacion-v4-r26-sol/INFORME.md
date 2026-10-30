# Contrarrevisión independiente del consumidor v4 corregido en R26

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Este dictamen no emite atestación candidata ni modifica confianza.

Se examina exclusivamente el cambio de `edicion.py` y `schema.json` entre `6207b0bb1baafc8dfec8e4617b406a459dcd0f4d` y la base recibida `6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9`. `cambio-revisado.diff` conserva ese cambio. Las fuentes anteriores se leen mediante `git show` y se guardan en scratch propio, sin checkout ni mutación VCS. El consumidor anterior conserva su schema anterior, usa las dependencias recibidas actuales y comparte los esperados originales con el actual. Esto aísla el cambio revisado; no pretende reconstruir todo el entorno histórico de R24.

La recepción física comprueba todas las 15.456 entradas con lstat, readlink, bytes y modo ejecutable contra un blob de la base cada vez. `fisico-inicio.json.gz` conserva el resultado y el diff; el cierre usa el mismo procedimiento en `fisico-final.json.gz`. El índice no es el testigo de integridad.

## Matriz de los cinco hallazgos R24

| Hallazgo | Juicio sobre el cambio exacto | Garantía que sigue sin darse |
| --- | --- | --- |
| PV24-01, selección incompleta | El cambio no añade documentos ni cierra el censo. Las cuatro fuentes localizadas siguen fuera del corte. | Exhaustividad de referencias fiscales, reconstrucción de citas dependientes de esos originales. |
| PV24-02, saneamiento | Amplía la política para valores URL/localizadores y la separa por pin. Se contrastan credenciales, query decodificada y casefold, identificadores documentales y residuales sintéticos. | Anonimización de prosa/código/Markdown, archivo hostil arbitrario y certificación de privacidad. |
| PV24-03, validación del sobre | Unicidad de referencias, fuentes/no resueltas y adquisiciones nuevas; 16 patrones con fin absoluto. La excepción histórica queda anclada a los bytes completos. | Autenticidad del emisor, independencia de observaciones y aceptación jurídica. |
| PV24-04, conjunto exacto | Verify compara nombres en raíz, sha256 y dependencies; contrasta tipos, ancestros y huellas. | Defensa frente a un escritor concurrente hostil o garantía universal de portabilidad Unicode. |
| PV24-05, coherencia | Load exige las tres identidades iguales cuando sanitized=false, incluso historical=true, y rechaza ancestros auxiliares conflictivos. | Recuperar o autenticar un origen ausente de un derivado saneado. |

Los cinco métodos rojos protectores originales se conservan sin modificar esperados ni informes previos. No corresponden uno a uno a estos cinco hallazgos: incluyen dos pruebas de unicidad de PV24-03, un hash con LF, un extra y una identidad incoherente. La matriz evita convertir cinco métodos en cinco garantías independientes.

## Controles que discriminan el diseño

`repro.py antes` importa el consumidor de la versión anterior en un módulo aislado y ejecuta exactamente los cinco métodos R24, los diez controles R26 y los nueve adversos heredados. Reproduce cinco fallos R24 y doce aserciones/subcasos fallidos de R26, sin errores de ejecución; nueve adversos pasan. Algunos controles R26 ya pasaban antes: diez métodos no significan diez defectos arreglados. `repro.py despues` repite los mismos esperados con el consumidor de esta base. Los JSON y logs conservan resultados por método.

`independientes.py` añade casos propios, sin volver a contar los del padre como aportación nueva:

- El colector real se contrasta ejecutando únicamente su expresión AST de deduplicación: registros idénticos con orden distinto de claves se colapsan; dos horas de adquisición diferentes sobreviven. Load rechaza duplicados, pero admite observaciones distintas por hora o URL final. La proyección completa contiene la dependencia de adquisición: dos referencias auxiliares diferentes también son observaciones diferentes, no prueba de dos descargas independientes.
- Un sobre sintético mantiene edición 4 y base histórica; con pin nuevo no obtiene permiso para repetir adquisiciones. La copia real del sobre se muta solo en scratch añadiendo una exclusión: con el pin original debe fallar la integridad; con el pin recalculado debe fallar la unicidad histórica. No se modifica el original ni se intenta publicar la mutación.
- Cada uno de los 16 patrones admite una muestra válida y rechaza LF, CR, CRLF y NUL finales. Se repite el contraste con el motor ECMAScript de Node, además del motor Python usado por jsonschema.
- Schema admite referencias duplicadas que load rechaza. Load admite un sobre cuyo CAS sintético fue corrompido, mientras verify detecta los bytes distintos. Esto demuestra las fronteras operativas, no solo las describe.
- Extras vacíos en las tres carpetas, CAS sustituido por symlink y objeto cuyo nombre hash contiene directorio o symlink se rechazan. Las pruebas conservan los originales sintéticos apartados en su scratch; no borran datos reales.
- Los conflictos a y a/b/c, en ambos órdenes, se prueban mediante el programa materializar real. Se exige que no llegue a existir el destino. a/b y ab se admiten: el control no confunde prefijo léxico con ancestro.
- Los tres campos sourceSha256/sourceSha512/sourceSize discordantes se rechazan con sanitized=false, también para históricos. Con sanitized=true se admite la diferencia declarada; no se finge haber reconstruido el origen.
- Credenciales HTTP, ACCESS_TOKEN codificado y mezclado en mayúsculas, /run/user, /Users y file:// se eliminan en sintéticos anidados. BOE e idAnuBlob sobreviven. Diagnósticos provocados por entradas sintéticas no deben imprimir la sentinela.

Los resultados discriminantes se entregan en `casos-maquina.json`, con esperado y resultado en cada frontera. Se conserva cualquier fallo como evidencia; el revisor no cambia el paquete ni los esperados para obtener verde.

## Política de saneamiento y exposición

La política nueva reconoce claves estructurales conocidas, valores que empiezan exactamente por las familias de localizadores declaradas y HTTP/HTTPS con credenciales o una lista finita de parámetros privados. parse_qsl decodifica el nombre del parámetro y casefold elimina diferencias de caja. Se retira el valor URL completo, no se intenta salvar una URL parcialmente sensible. Esto evita conservar el secreto dentro de la propia query reconstruida y sacrifica el resto del localizador. Los identificadores documentales públicos como idAnuBlob y el id BOE no pertenecen a esa lista privada.

Los controles demuestran residuales: prosa que contiene un path, URL precedida de espacio y FILE:// en mayúsculas conservan la sentinela. Son límites reproducibles de la política mecánica exacta, no pruebas de un secreto real filtrado. Extenderla a normalización de toda cadena o anonimización de prosa sería una exigencia nueva, con riesgo de destruir identificadores y citas legítimas. No se declara resuelta esa tarea ni se altera la política desde una revisión sin fixes.

El pin histórico usa clean(policy=1) y conserva originales anteriores. historical=true evita sanear de nuevo esos auxiliares: el flag no constituye prueba independiente de antigüedad. El ancla externa y la procedencia revisada deben justificar la etiqueta para una edición nueva. El consumidor no acepta por sí solo un paquete de origen desconocido para transferirlo. privacyCertification permanece false. Una discrepancia bajo política 2 no se etiqueta automáticamente como contraseña, token real o dato personal: puede ser un localizador inocuo. No se imprime contenido sensible real.

## Copia real y límites de preservación

Se verifica en lectura el paquete completo de `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v4-938f230888d2/paquete`, con manifest-externo.json y pin `938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2`. El consumidor usado es el de esta base y se fijan sus fuentes por SHA256 en `copia-real.json`. No se repite una restauración integral: R24 ya la hizo y estos cambios de rechazo se ejercitan con sintéticos. No hay cambio de bytes que justifique otra copia de 1,5 GB.

Verify debe cotejar 1.443 objetos y 6.816 referencias auxiliares, ambos hashes y tamaño por entrada, conjunto exacto y política histórica. Debe conservar 33 observaciones de adquisición y 23 registros distintos. Esos recuentos describen el corte y no acreditan fuentes independientes o cobertura fiscal. No se ejecuta collect, confirm sobre copias reales, ni materializar sobre ellas. El consumidor histórico conservado dentro del paquete y el consumidor corregido actual son versiones distintas; un pin de datos no identifica automáticamente el software que los valida.

No se releen entregas R25 no recibidas, ni carpetas de compañeros R26. Las cuatro ausencias del mapa del padre se mantienen pendientes: localizarlas fuera de v4 no completa su censo ni autoriza v5. Inventario fijado, artefacto, 65 sitios, 36 snapshots y confianza activa permanecen intactos. Madrid, los 264 pares/102 sujetos y composición/publicación siguen bloqueados por los motivos recibidos; esta revisión no produce una aceptación sustitutiva.

Integridad, autenticidad, cifra, interpretación y revisión permanecen ejes distintos. No se comprueban PAdES/CSV, cierre binario Nix sin red, apagado real, disco defectuoso, bombas gzip ni escrituras concurrentes hostiles. La copia local y Crossa v1 desfasado, mismo dueño y casa, no constituyen custodia independiente. No hay transferencia externa, atestación real, confianza mutada, arreglo del producto, commit, PR ni cierre global. Las conclusiones nuevas de este revisor necesitan contraste posterior.

## Decisiones, objeciones y costes

1. Examinar el cambio aislado con las mismas dependencias actuales. Objeción experta: podría atribuirse al diff una mejora que procede de un helper histórico diferente. Respuesta: se cambia exclusivamente edicion/schema en scratch y se fijan hashes; no se afirma reproducción integral del entorno histórico. Coste: juicio limitado a este cambio y necesidad de identificar el consumidor al usar el paquete.
2. Conservar compatibilidad solo por pin completo. Objeción experta: los duplicados inflan evidencia. Respuesta: se informa observaciones y distintos por separado y la mutación del sobre pierde la excepción; no se acepta el histórico como evidencia independiente. Coste: política histórica mantenida y revisión adicional antes de cualquier transferencia o confianza.
3. No crear otra restauración completa. Objeción experta: un lector correcto podría ocultar defectos de escritura. Respuesta: R24 ya restauró completo; los rechazos y la ausencia de escritura antes del conflicto se prueban ahora con materialización sintética. Coste: no se repite el ensayo integral de almacenamiento ni se amplían sus garantías físicas.
4. Mantener límites de privacidad expresos. Objeción experta: una lista finita deja variantes reconocibles sin cubrir. Respuesta: se demuestran residuales, se conserva privacyCertification=false y se exige revisión orientada al destino antes de transferir; no se atribuye al corte una filtración que no se ha observado. Coste: no hay certificación universal, y endurecer el contrato de privacidad requerirá otra implementación y revisión.
5. No corregir producto ni informes ajenos. Objeción experta: entregar un hallazgo sin arreglo retrasa el uso. Respuesta: la independencia y la propiedad exclusiva de esta revisión exigen que el padre reciba y contraste primero; las fuentes originales y rojos quedan intactos. Coste: otra fase de decisión si aparece un bloqueo nuevo y ninguna promoción automática por este informe.

## Veredicto y resultados efectivos

El cambio exacto queda corroborado en las garantías acotadas descritas. No se ha demostrado un nuevo defecto bloqueante de este cambio. Esto no aprueba toda la implementación, no cierra PV24-01 y no concede confianza ni aceptación fiscal. Los residuales de saneamiento están probados y limitan el uso de la política; no se convierten por inferencia en una filtración de credenciales reales.

La ejecución posterior pasa los cinco métodos R24, los diez R26 y los nueve adversos heredados. Los siete métodos independientes pasan. La copia real completa verifica con ambos hashes/tamaño, conjunto exacto y política histórica; el recibo conserva 33 observaciones/23 distintas y privacyCertification=false. La mutación del sobre real en scratch se rechaza por duplicados con pin nuevo, manteniendo base/edición originales. El ensayo AST del colector conserva dos adquisiciones distintas y colapsa dos representaciones idénticas.

El contraste de política encuentra tres auxiliares no históricos del corte que cambiarían con clean(policy=2). `exposicion-real.json` clasifica sin valores las diferencias efectivamente presentes; no certifica presencia o ausencia de credenciales. Es una reserva concreta para cualquier distribución futura y no autoriza reescribir los originales.

El cotejo final vuelve a confirmar HEAD y las 15.456 entradas físicas de base intactas, sin diferencias de bytes, tipo o modo ejecutable. Todos los entregables son nuevos dentro de la carpeta exclusiva; la caché no se entrega. El manifiesto no toma el índice como prueba y el patch excluye binarios, descritos por ruta/hash. Los recuentos son evidencia operacional de estos controles, nunca medida de completitud del encargo.

El agregado de exposición real localiza cuatro valores de localizador explícito en dos auxiliares y un valor de URL privada o malformada en `revisiones/preservacion/casos/claims.json`. Se omiten los valores completos. Ese nombre de fixture no basta para demostrar que una credencial sea ficticia o real, y la categoría agrupa ambas causas deliberadamente: no se afirma una contraseña expuesta ni ausencia universal de secretos. Los históricos marcados como tales y la prosa/código no forman parte de este agregado de auxiliares nuevos JSON.

`calidad-cierre.log` confirma Ruff y mypy parcial sobre las seis fuentes Python propias, además del contraste ECMAScript y oxlint sobre el instrumento JS con las 16 reglas a error. No se desactiva ninguna regla ni se extrapola este control a todo el repositorio.
