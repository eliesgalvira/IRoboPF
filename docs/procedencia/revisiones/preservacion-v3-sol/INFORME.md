# Revisión independiente de preservación v3

Base exacta: `7668bdad60a79a8b3ad8e1e1b911f3d6c223692a`. Revisión personal Sol 6.1 High, sin subdelegación ni fixes. **V3 sirve como copia local restaurable del corte fijado; el validador de ampliaciones requiere cambios antes de considerarlo una puerta cerrada de metadatos y clasificación.** Los hallazgos nuevos son candidatos para contraste del padre. No se cierra el BRIEF.

## Bytes y recuperación efectiva

Se calcularon SHA-256, SHA-512 y tamaño mediante `hashlib` en flujo, sin llamar al fingerprint del producto, para todos los objetos y dependencias de las dos copias inmutables indicadas. En cada copia: 945 hashes únicos, 1.068.593.978 bytes de objetos, 1.910 referencias de dependencia y 1.827 hashes únicos de dependencia. Se verificaron todos los registros, incluso los que comparten hash. `copias.json.gz` conserva rutas literales y ambas huellas. `cierre-dependencias.json` conserva denominadores separados; no se suman referencias duplicadas como objetos nuevos.

Marcadores cotejados byte a byte con los externos versionados:

- Sobre: SHA-256 `147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be`.
- Transporte: SHA-256 `b4e91adcdd69dbe62f221d97bc8910ad1243719b8bdcb63df095ce5679c8db9e`.

Las huellas SHA-512 y tamaños de ambos están en `fuentes.json`. El sobre es **formatVersion 1, edition 3**, y el transporte conserva schema 2. El transporte coincide íntegramente con manifest-v2 histórico salvo sus localizadores `sources`; no se reescribió la historia. Se conservan 708 históricos y se añaden 41 primarios candidatos, ocho capturas secundarias y 188 facsímiles. La clasificación real no eleva las capturas de archivo a originales primarios.

Después de comprobar espacio suficiente (`espacio-previo.json`) se restauró mediante la API real a `/home/elies/.t3/worktrees/IRoboPF/t3-3eb23c23/.cache/preservacion-v3-sol/restauracion-independiente`, inicialmente inexistente. `transfer` y `confirm` terminaron y un pase propio volvió a comprobar ambos hashes/tamaños de todos sus bytes. Los 945 inodos son distintos de los de la fuente. `restauracion.json` y `copias.log` registran el resultado. No se ejecutó el CLI del autor porque escribe recibos en su carpeta: se importó la misma API sin cambiarla.

**PV3-R01 — aceptar restaurabilidad local del corte.** Objeción del mejor archivero: una restauración hecha por el autor puede reproducir su propio error. Respuesta: cotejo completo propio de ambas copias y otra restauración nueva, seguido de hashes independientes. Coste: IO y otra copia local; ninguna protección ante pérdida común del equipo.

## Candidatos nuevos reproducidos

Las reproducciones usan bytes sintéticos pequeños y manifiestos externos propios; no cambian los pins ni los originales reales. `adversos_test.py` exige el comportamiento protector y conserva los rojos en `adversos-rojos.log`. El control positivo restaura exactamente el mismo fixture antes de introducir las mutaciones. Un atacante que sustituya un pin externo sigue estando fuera del modelo: los siguientes casos demuestran qué valida el consumidor cuando recibe una ampliación nueva, no una sustitución indetectable de la v3 fijada.

**PV3-SOL-01, P2 — cierre incompleto del sobre, incluidas dependencias.** En `recolector.py:199–211` se rechazan nombres superiores desconocidos, pero no se exigen todos los campos ni se cierra el contenido de dependencies/baseline/references/exclusions. El ensayo introduce `dependencies[0].headers.Cookie = PRIVATE_SENTINEL`: la transferencia publica esos bytes en manifest.json y termina en vez de rechazarlos. Otro ensayo elimina baseline y usa una dependencia absoluta (y su source correspondiente); también llega a publicación y confirmación. La ruta absoluta es metadato, no una escritura fuera del destino: no se afirma escape físico. La ausencia de JSON Schema completo estaba declarada por PV3-D01; aquí se acredita su consecuencia observable, distinta del transporte v2 cerrado.

Decisión propuesta: contrato cerrado completo del sobre, con campos requeridos, huellas/tamaños exactos de dependencias, unicidad y rutas portables, antes de crear destino. Objeción experta: un hash externo fija bytes, pero no demuestra que esos bytes sean publicables ni un significado completo. Respuesta: mantener el anclaje externo y añadir validación estructural; ninguno sustituye al otro. Coste: schema propio y regresiones, posible rechazo de ampliaciones antes toleradas; no cambiar v3 histórica para ocultarlo.

**PV3-SOL-02, P2 — clase primaria incompatible con adquisición secundaria aceptada.** En `recolector.py:215–226` clase y URLs se validan por separado. Cambiar solo `class` de captura secundaria a `documento-primario-candidato`, conservando ambas URLs web.archive.org, se admite y se restaura como primaria candidata. No se demuestra aceptación fiscal; sí pérdida del significado documental de la clase. Los ocho objetos reales permanecen correctamente clasificados y no se alteraron.

Decisión propuesta: relación ejecutable entre clase y origen de adquisición; las capturas históricas secundarias no pueden promocionarse mediante una etiqueta libre. Objeción experta: distinguir clases solo durante collect deja otra entrada que permite falsearlas. Respuesta: validar también al consumir/transferir, con controles positivos separados para fuentes primarias y secundarias. Coste: política explícita para adquisiciones mixtas y rechazo conservador; una URL oficial tampoco certifica autenticidad.

**PV3-SOL-03, P2 — fallo de confirmación posterior a publicación pierde el estado específico.** `transfer` publica manifest y después llama a confirm; en `recolector.py:305–314` los fsync de confirm no convierten OSError en PublicationDurabilityUnknown. El ensayo hace fallar únicamente el fsync del padre al final de confirm, después de que el publish del marcador haya terminado: queda manifest visible pero sale OSError genérico. Es un error propagado, no retorno falso de éxito. El caso anterior de fallo dentro de publish sigue devolviendo la excepción específica y permite recuperación correcta.

Decisión propuesta: preservar el tercer estado también en la fase de confirmación que forma parte de transfer, indicando marcador visible y recuperación contra pins. Objeción experta: «solo falló confirm» no permite al consumidor asumir que no se publicó el paquete. Respuesta: clasificar el error según la fase efectiva, sin borrar ni prometer rollback. Coste: pequeño cambio de protocolo/excepción y regresión; fsync no demuestra resistencia a hardware defectuoso o corte eléctrico.

**PV3-SOL-04, P3 — ampliación URL acepta identificadores libres.** `url()` acepta `https://www.seg-social.es/descarga/es/PRIVATE_SENTINEL`; basta el prefijo del endpoint. El rechazo exigido por el ensayo falla. Es una regresión de precisión de política frente al clasificador v2 por formatos: no se ha encontrado ni publicado un dato personal real. Se entrega como candidato de endurecimiento editorial, sin afirmar que los objetos reales sean privados.

Decisión propuesta: documentar y validar formatos de identificador de los endpoints realmente usados, con rechazo conservador del resto. Objeción experta: el dominio oficial y un prefijo documental no prueban que una ruta arbitraria esté libre de identificadores personales. Respuesta: mantener allowlist específica por endpoint y revisar los casos existentes sin descargar nada. Coste: posibles falsos rechazos de documentos legítimos y mantenimiento de la política.

## Revisiones reabiertas y objeciones descartadas

**PRE-01/02/03/04 y PREV2-01/02.** Se releen preservacion, preservacion-v2, correcciones/preservacion-v3 e integracion-tecnica-r11, además de la ampliación cerrada v3, integración R17 y recibos R19. El transporte mantiene parser sin duplicados/NaN, schema cerrado y comprobación de enteros exactos. Los adversos propios confirman rechazo de offsets imposibles y admiten +05:45. Fuentes/destinos con ancestro symlink y rutas de escape se rechazan. Corrupción, ausencia y destino existente se rechazan; la recuperación usa otro destino. Publicación de archivo exclusiva y fsync del árbol se conservan. El defecto nuevo del sobre no se atribuye al schema 2 ni revoca estas correcciones.

Objeción experta: repetir solo las pruebas verdes del autor no cuestiona la nueva frontera. Respuesta: añadir mutaciones propias y separar transporte/sobre/fase confirm. Coste: regresiones rojas conservadas y aprobación diferenciada del paquete concreto y la herramienta general.

**RT11-01.** Se vuelve a ejecutar mypy actual sobre preservacion.py y clasificador, recolector/scripts v3 y scripts propios. No se toma el resultado histórico como sustituto. Resultado y límites en logs de calidad; este chequeo comprueba cuerpos no anotados, no convierte el parser dinámico en tipado estricto.

**EC-02/EC-04.** El cierre comprobado es el de dependencias materiales explícitas de este sobre y de sus adquisiciones del anexo. No se interpreta que restaure la aplicación completa, todos los estados históricos del registro o todas las dependencias antiguas de v2. Los propios informes declaran esas limitaciones. Tampoco certifica el wiring/publicación actual por haber comprobado sus archivos históricos. Coste: conservar el repositorio/entorno por separado y revisar el consumidor actual en su tarea propia.

No se exige seguridad contra propietario hostil, carreras ABA o cambios concurrentes de permisos: no es el contrato declarado. Tampoco se equiparan chmod 0444 y anclaje criptográfico a almacenamiento WORM. STAGING identifica el proceso original de la copia; no se usa como prueba de aceptación. El marcador final solo se considera válido al cotejarlo contra el pin externo y todos los bytes.

## Corte y materiales posteriores

V3 no es un censo del corpus actual. `posteriores.json` entrega una unión por SHA-256 de los faltantes que esta revisión pudo localizar y recalcular por ambos hashes/tamaño, con rutas literales y manifiestos fuente. Incluye cotejo familiar/TGSS de R17, mapa R19 de retenciones y los dos lotes editoriales recibidos. Los objetos ya presentes se enumeran aparte. No se añaden controles gzip, patches o manifiestos como si fueran originales documentales. Los candidatos que no se pueden localizar quedan separados, sin inventar rutas ni reemplazar versiones.

Objeción experta: sumar «21 faltantes» y once originales R19 duplica objetos compartidos y omite facsímiles editoriales. Respuesta: unión por hash con fuentes múltiples, cotejo físico y denominadores explícitos. Coste: este listado acredita los lotes enumerados, no una búsqueda universal de toda adquisición posterior; no se realizó otro export ni se modificó el corte v3.

## Límites y entrega

Integridad local comprobada. Autenticidad histórica, confianza PAdES/CSV/sellado y cadena jurídica no se revalidan: ningún hash autentica al emisor ni acredita interpretación o cálculo fiscal. No se trasladan atestaciones; Madrid sigue pendiente y ninguna regla completa se acepta. Las 52.461 ocurrencias, 65 sitios y 264 payloads pendientes no se usan como prueba de completitud. No se regeneran inventario o snapshots.

Crossa conserva v1 histórico desfasado, misma casa y propietario, comunicado por el coordinador y sin comprobación propia aquí. No es custodia independiente/remota. V1/v2/v3 y restauraciones del padre permanecen intactos. Sin LFS, gasto, transferencias externas, red documental, mensajes a terceros, publicaciones, despliegues, servidor, preview, motor, UI ni VCS mutante.

Se leyeron íntegros BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO y DECISIONES, con prevalencia de las restricciones actuales. Lecturas puntuales iniciales sin flock; recorridos masivos, restauración, pruebas y calidad bajo el lock común, un trabajador. Python usa run.sh con UV_PROJECT_ENVIRONMENT absoluto en scratch. Node_modules es un enlace de lectura al padre; no se instala ni modifica allí. No se escribió Effect ni TypeScript.

`arbol-inicio.json.gz` y `arbol-cierre.json.gz` cotejan cada entrada física mediante lstat/readlink y bytes frente al blob del HEAD exacto; el índice no es fuente de verdad. MANIFIESTO.json excluye su propia ruta, enumera path literal, ambos hashes, tamaño y baseSha256; altas null. Patch textual gzip y binarios por hash. Scratch y la nueva restauración permanecen fuera de la entrega y no deben integrarse como corpus. No hay borrados ni cambios de archivos de base.

## Resultados de ejecución y calidad

El pase independiente de ocho pruebas propias termina **1**: tres controles correctos, cuatro expectativas de rechazo fallidas y un error OSError genérico en la prueba que exige PublicationDurabilityUnknown. Son cinco reproducciones rojas para cuatro candidatos; dos pruebas corresponden al cierre incompleto PV3-SOL-01. Las 19 regresiones mantenidas terminan **0**. Ruff inicial termina **0**.

El mypy inicial termina **1**: tres diagnósticos pertenecen a las anotaciones de esta revisión y se corrigen exclusivamente aquí; el cuarto pertenece al recolector del autor. Se conserva el log inicial y se repite el check completo, sin silencios, exclusiones nuevas o fixes de producto.

**PV3-SOL-05, P3 — diagnóstico estático del recolector con importaciones comprobadas.** `docs/procedencia/preservacion-v3/recolector.py:196`: `sum(a['size'] for a in annex)` produce `Generator has incompatible item type "object"; expected "bool" [misc]` con el comando actual `--follow-imports=silent --check-untyped-defs` y stubs de jsonschema. RT11-01 de preservacion.py no reaparece en ese pase. La comprobación anterior del autor con imports skip no equivale a este alcance. No se observa corrupción en la restauración real por este diagnóstico.

Decisión: conservar el rojo de calidad del autor para el padre. Objeción experta: declarar todo mypy verde porque se omiten imports ocultaría el límite del chequeo. Respuesta: comprobar el consumidor junto con la implementación importada y tipar posteriormente las entradas del anexo, sin cambiar su formato ni usar ignores. Coste: pequeña corrección tipada y nueva ejecución por el propietario; no bloquear la conclusión sobre los bytes ya comprobados.

El cotejo posterior localiza **85 hashes distintos ausentes del corte v3, 27.873.106 bytes**, en los lotes explícitos; cero localizadores irresueltos en esos lotes. `posteriores-resumen.json` separa lotes solapados y `posteriores.json` fija la lista exacta con ambos hashes. Estos son objetos documentales y facsímiles adicionales al corte, no 85 fuentes primarias ni 85 reglas. Ningún contador sustituye la lista física o acredita un censo exhaustivo del corpus actual.

## Dictamen de las decisiones del autor

- **PV3-D01:** formato y pins correctos; requiere cierre adicional por PV3-SOL-01. Objeción: el nuevo sobre no debe heredar las garantías de schema 2. Respuesta: aprobación separada; coste: schema/validación del sobre pendientes.
- **PV3-D02:** deduplicación y separación de las 237 adiciones comprobadas. Objeción: los lotes enumerados no prueban exhaustividad. Respuesta: conservar ese límite y lista posterior exacta; coste: ampliación futura sin sustituir v3.
- **PV3-D03:** los eventos reales conservan clases distintas y no incluyen campos headers en el anexo. Objeción: el consumidor admite estructuras y rutas más amplias que los datos concretos. Respuesta: PV3-SOL-01/02/04; coste: validar semántica de clase y formatos URL sin afirmar anonimización universal.
- **PV3-D04:** restauración real aprobable en ámbito local; queda PV3-SOL-03. Objeción: un error de confirm posterior a publicar debe distinguirse de fallo anterior. Respuesta: tercer estado hasta recuperación, nunca borrar para repetir; coste: intervención operativa y prueba adicional del padre.
- **PV3-D05:** límites históricos y exclusión de material no oficial respetados; no se convierte unresolvedReferences en documentos perdidos. Objeción: también puede haber documentación posterior no enumerada. Respuesta: lista acreditada por lotes, sin censo global; coste: búsqueda posterior explícita.
- **PV3-D06:** separación de integridad, autenticidad, interpretación, exactitud y aceptación correcta. Objeción: la palabra «preservado» puede aparentar autenticidad histórica o custodia externa. Respuesta: dictamen estrictamente local y del corte; coste: conserva el riesgo común y las puertas jurídicas abiertas.

El listado posterior desglosa cuatro originales familiares, cinco originales TGSS y doce facsímiles TGSS (los 21 conocidos), **nueve** de los once objetos del mapa de retenciones R19 (dos ya estaban en v3), un original adicional del lote editorial de escalas/mínimos, sus 39 facsímiles nuevos y 15 facsímiles del otro lote editorial. Los 15 originales reutilizados del segundo lote ya estaban en v3. Cada inclusión/ausencia se determina por hash; no se llama «nuevo» a otra ruta del mismo objeto.

Cierre verificado: HEAD sigue exacto; **13.422 entradas de base presentes e idénticas**, incluidos los enlaces cotejados con readlink, diff vacío y cero borrados. Ruff final **0**. Oxlint **0**, con un trabajador y configuración anidada deshabilitada. Mypy **2.4.1**, último pase **1**, deja **únicamente** PV3-SOL-05 en el recolector; las tres fuentes propias quedan sin diagnóstico y preservacion.py ya no presenta RT11-01. Se conservan ambos logs de mypy para no ocultar las correcciones del revisor. La entrega no declara calidad totalmente verde ni aceptación del validador general. Evidencia documental/configuración **0**.
