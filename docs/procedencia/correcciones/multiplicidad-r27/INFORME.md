# Varios enlaces documentales para una ocurrencia

RX25-01 se reproduce con los 264 pares exactos y el coordinador real antes de editar: `ID duplicado`, después de reconstruir inventario y verificar evidencia. `antes/recorrido.json` y su log conservan el fallo; las fuentes de ese ensayo quedan fijadas en su entrada de dependencias. La revisión original permanece intacta. No se sustituye el lote por un enlace escogido de cada sujeto.

## Contrato corregido

El adaptador construye una ocurrencia por itemId y conserva las cuatro entidades documentales de cada payload: Rule, Citation, Facsimile y Document. Cada ocurrencia enlaza todas sus proposiciones, sin asignarle como ámbito general el del primer año. Cuando tiene varios enlaces, su texto distingue expresamente la ocurrencia técnica de los ámbitos documentales particulares. El contenido preciso y las condiciones siguen en cada proposición.

El recibo nuevo tiene versión 2. Sus estados se identifican por sujeto, revisión y hash de payload. La revisión del sujeto se calcula después de agregar todas sus aristas; todos sus estados apuntan a esa misma revisión exacta. Los recibos históricos versión 1 conservan la exigencia de un estado por sujeto. El snapshot mantiene su formato 2, cuyo array de evidencias ya permite representar estos registros; la extensión semántica queda fijada en el recibo y las fuentes de software versionadas.

La cobertura exige correspondencia exacta entre cada arista normativa y su estado. Omitir un año de una ocurrencia compartida, duplicar un par o cruzar payloads no queda oculto por compartir itemId. Las entidades del recibo se cotejan una vez por recibo mediante su referencia exacta, en lugar de repetir el recorrido completo para cada estado. No se omite el cotejo de bytes.

Los nodos documentales permanecen separados por payload. Los bytes públicos se deduplican por hash, exigiendo igualdad de tamaño y MIME. El recorrido de enlaces deja de tener el límite fijo de 32 nodos: se acota por la cantidad del snapshot y las cuatro entidades por binding más el sujeto. No se permite un recorrido ilimitado. GET selecciona todos los estados del sujeto y revisión exactos; la ficha presenta cada binding por separado, incluidos su autenticidad y revisión limitada o pendiente. No se extiende una aceptación al resto.

## Decisiones y costes

Objeción experta: agrupar por número o tomar el primer año perdería ámbito y autoridad. Respuesta: agrupar exclusivamente por identidad de inventario, conservar payloads y aprobaciones exactos y comprobar todas las aristas. Coste: un recibo nuevo y una revisión distinta del sujeto cuando cambia su conjunto documental; no se reutiliza un hash histórico.

Objeción experta: permitir sujetos repetidos en estados podría ocultar duplicados. Respuesta: la clave es la terna sujeto/revisión/payload y debe coincidir con el grafo y el recibo. La versión 1 no recibe retrospectivamente esa cardinalidad. Coste: mantener ambos contratos y probar omisiones de un único enlace entre varios.

Objeción experta: un pase de 264 aprobaciones candidatas activaría confianza sin revisión de la corrección. Respuesta: el ensayo ocurre exclusivamente en un árbol propio, con el registro candidato ya revisado como representación. El registro activo sigue vacío y no se incorporan las 264 entradas al producto. Coste: una contrarrevisión nueva del cambio y del recorrido completo antes de cualquier promoción operativa.

Objeción experta: mostrar un solo estado en una ficha compartida induce a generalizarlo. Respuesta: listado mínimo de estados exactos, sin diseño visual nuevo; cada proposición sigue enlazada por revisión. Coste: mayor longitud de la respuesta cuando existen muchos ejercicios. No es una selección temporal ni una declaración anual aceptada.

## Reproducción

`preparar.py` deriva del instrumento independiente R25 y fija árboles propios según `IRPF_MULTIPLICIDAD_ETAPA=antes|despues|despues-url|despues-acotado`, bajo `.cache/orquestador-recepcion/r27/multiplicidad/`. No crea checkouts ni modifica VCS. Copia software, payloads, atestaciones, decisiones, originales y facsímiles exactos. El registro de confianza candidato solo se instala en esos árboles. `recorrido.mjs` ejecuta generación, coordinador, publicación, verificación y GET importados, sin servidor ni resultados inyectados. El antes queda congelado; no se reescribe después del cambio.

`comprobar-publicacion.mjs` coteja todos los pares por identidad, sus proposiciones y aristas, y conserva negativos sobre omisión, duplicación, cruce y revisión. La prueba de ficha añade dos estados distintos para comprobar que uno no sustituye al otro. Son comprobaciones técnicas; los datos sintéticos de presentación no son fuentes fiscales.

Todos los ensayos pesados se serializan con el lock compartido y un trabajador. Se consultaron las guías Effect de modelos y pruebas y la fuente local antes de modificar las fronteras tipadas. No cambian cálculo, inventario ni cifras. La regeneración del contenido actual, las regresiones y los resultados finales se registrarán al concluir las comprobaciones. Sin aceptación fiscal, PR, despliegue, gasto, LFS o transferencia externa. Crossa conserva v1 desfasado.

## Segundo bloqueo del recorrido

Tras agrupar los sujetos, el recorrido alcanza la URL oficial BORM y falla en `verificarPublico`: el contrato anterior rechazaba cualquier query. Se conserva el rojo completo en `despues/recorrido.json`, con el original `https://www.borm.es/services/anuncio/ano/2022/numero/4846/pdf?id=811060` intacto. No se elimina el parámetro para cambiar la identidad documental.

La corrección admite únicamente el endpoint HTTPS exacto de anuncios BORM, con año, número e id numéricos acotados y fin absoluto. No admite queries libres, credenciales, fragmentos, claves duplicadas, parámetros extra, dominios parecidos ni grafías codificadas de la clave. Objeción experta: generalizar una excepción de URL filtraría secretos futuros. Respuesta: contrato estructural mínimo del identificador público observado, con adversos explícitos, conservando el rechazo general fuera de ese endpoint. Coste: otro endpoint legítimo con query requerirá un contrato y revisión propios; no se presenta esta excepción como anonimización universal ni validación del emisor.

`incidencias.json` distingue la selección inicial de Vitest sin archivos y la cancelación de una prueba focalizada aún en cola, sin atribuirles cobertura. El rojo del BORM es la ejecución real completa, anterior a su corrección. Las repeticiones usan `despues-url`, sin sobrescribir los dos recorridos fallidos.

## Tercer bloqueo: original de 42,9 MB

El recorrido `despues-url` supera la colisión y la URL BORM, pero el publicador rechaza el original BOE-A-2010-19703. Su SHA-256 es `e7b629a20bde61bcb42c54b2caf3af06f2b44613fc6f89718ff5ff9763d4a4f4` y mide 42.900.459 bytes; respalda 36 payloads y doce sujetos. No se trata del recibo JSON. El fallo, la entrada fijada y los bytes originales se conservan. El lote completo **no publica todavía**.

El límite de diez millones de bytes permanece en publicador y lector. Servir originales grandes exige un almacén local externo explícito, fijado por hash y con verificación física, rutas y mediciones propias. No se aumenta el límite genérico ni se incorpora ese PDF a Git. Se prepara una implementación aislada Sol y posterior revisión independiente. Esto no autoriza alojamiento, LFS ni gasto.

El ensayo adicional `despues-acotado` excluye únicamente los 36 payloads que dependen de ese original. `alcance-publicacion.json` enumera cada exclusión, hash, tamaño y motivo. Conserva los otros 228 pares, noventa sujetos, incluidos años compartidos y BORM. No se escoge un enlace por sujeto ni se llama completo a ese subconjunto. Los 264 candidatos y atestaciones siguen intactos; la proyección de confianza solo existe en scratch.

La primera ejecución de `validar-final.sh` pasó tipos, lint, Ruff y mypy, y se detuvo antes de regenerar al faltar el comprobante positivo. `regeneracion.log` conserva ese fallo de la puerta; no acredita regeneración ni regresiones. La comprobación acotada permitirá regenerar únicamente el contenido activo de Madrid, que sigue pendiente. La publicación de los 264 queda bloqueada por el CAS externo y por la revisión nueva del cambio.

## Ajustes de los instrumentos GET

La publicación y verificación del subconjunto concluyeron antes de que el primer instrumento GET fallara por exigir la frase «no acreditadas» en la ficha de ocurrencia compartida. Ese ámbito reside en las proposiciones enlazadas; la ficha compartida contiene el aviso de que no es una regla fiscal aceptada. Se conserva `despues-acotado/recorrido.json`, su log y `recorrido-inicial.mjs`. El fallo no se atribuye al publicador.

La continuación GET lee el snapshot ya publicado, sin volver a ejecutar ni simular el coordinador. Coteja cada payload y enlace Rule, las filas exactas de aceptación limitada y aceptación completa falsa, y los bytes/hash de cada respuesta PDF/PNG. Un primer contador de texto incluyó también una frase explicativa de la ficha simple: se conserva en `instrumento-get-1.log` y `comprobar-get-inicial.mjs`. La versión final cuenta etiquetas dt/dd concretas. Son rectificaciones del instrumento propio; los rojos de revisores recibidos permanecen intactos.

## Resultado del subconjunto

Verificado el snapshot scratch `f3504d80a123fb0de6d9c5fe4b393a4916b88b0776ebeb14de73fc246915f9fe`: 228 pares, noventa sujetos y dieciocho objetos públicos. GET de las noventa fichas devuelve todos sus estados exactos; cada PDF/PNG servido coincide en tamaño y SHA-256. El ensayo GET dura 31.865 segundos. El máximo observado de enlaces documentales únicos es 7. Las cuatro mutaciones de cobertura se rechazan. No se presenta ese tiempo como latencia de una petición individual ni como prueba de producción.

Tipos principal/vendor, lint, Ruff y mypy del instrumento final son correctos. Lint conserva cuatro avisos heredados de variables sin uso, cero errores; no se reescriben esos instrumentos ajenos. Las quince pruebas focalizadas de presentación y BORM ya pasaron. La confianza activa y el inventario permanecen fijados. Los 36 enlaces excluidos y las revisiones nuevas siguen pendientes.

## Regeneración activa

Los 36 snapshots históricos verificaron con el nuevo consumidor; quedan conservados. Generados V1 `4e64f896ee2daf9d8d4e4e6d3d2b73c404b70e97a002e39e37bdb83326b636d5` y V2 `0bde6df52abc5563cc710ad5fccd8ff6289deb02d076dfbd8bd1e17edbc398df`, total 38. El cierre activo contiene 719 objetos. La entrada del reintento es idéntica a la fijada antes del fallo de entorno; la publicación nueva termina con Python disponible. Inventario, algoritmo y datos no cambian. Registro activo y revisores coinciden en bytes antes/después; Madrid permanece pending y aceptación completa false. `historicos.json`, `regeneracion.json`, `cierre/regeneracion.log` y `cierre/reanudacion.log` distinguen las fases.

## Validación terminada y límites

Pasan las 43 pruebas de cinco archivos seleccionados y las veinte pruebas de contenido; logs en `cierre/regresiones.log` y `cierre/contenido.log`. El grupo de quince pruebas focalizadas está incluido en las 43; no se suma otra vez. Tipos principal/vendor, lint (cero errores/cuatro avisos heredados), Ruff y mypy del preparador final correctos. Los 36 snapshots históricos verifican y los dos nuevos conservan cierre e identidad fiscal. No se ejecutó Next build ni las suites legacy masivas porque este cambio no altera cálculo ni datos.

La comprobación completa de 264 sigue fallando por el original grande; las métricas positivas corresponden a 228 pares explícitos. Quedan pendientes el contrato de CAS local externo, revisión independiente de la multiplicidad y BORM, y aprobación operativa de pares exactos. Los gráficos de dependencias y Madrid2020 v2 mantienen bloqueos distintos. Ningún objeto o registro se autoacepta fiscalmente.
