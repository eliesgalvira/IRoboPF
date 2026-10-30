# Revisión independiente del codec v3, R47-N01 / R48

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

R47-N01 queda corroborado como corregido en el candidato examinado, con alcance técnico de identidad. La compatibilidad v3 exige regenerar los recibos v2: el consumidor actual los deja pending. No se reproduce un defecto nuevo de producto en los casos acotados. Estas conclusiones nuevas requieren contraste del padre; no hay aceptación propia, atestación, promoción ni aceptación fiscal. El encargo global continúa abierto.

Base examinada: `85705808bf692ebd54f1a1cc432ff0cc7142d834`, 21.594 entradas. Se examinaron R48, el informe e instrumentos R47 y el código y pruebas indicados.

## R47-N01 — Tres colisiones anteriores y corrección limitada

Los tres ensayos recibidos comprueban primero que ambas instancias Decimal nativas pertenecen al dominio y que el descriptor de constructor cambia de true a false; después exigen codificaciones distintas. Con el runtime anterior fallan las tres desigualdades, exit 1. Con el actual pasan las tres, exit 0. Las copias solo sustituyen la ruta importada: los esperados históricos permanecen intactos. El runtime anterior está copiado en scratch con sustitución exclusiva de su import relativo de derechos. Los diffs y CAS fijan originales y adaptación.

En v2 se excluía constructor entero cuando contenía uno de los dos constructores nativos. En v3 `Object.entries(descriptors)` conserva esa propiedad en orden, con enumerable/configurable/writable, y normaliza solo su valor a `['native-constructor','Decimal']`. La versión pasa a `admission-value-v3`. La guardia, comparación del recibo, operadores del intérprete, contratos y fórmulas quedan idénticos fuera de ese bloque: el contraste compara los bytes anteriores y actuales tras retirar exclusivamente el codec y su comentario, sin reformatear ni reconstruir esperados.

Objeción experta: ambos valores representan siete euros y la equivalencia CJS/ESM es necesaria. Respuesta: esa equivalencia deliberada del constructor no justifica borrar atributos que el contrato promete conservar. Coste: versionado incompatible y regeneración de recibos. No se demuestra cuota distinta ni bypass público por cambiar únicamente esos flags.

## R48-S01 — Presencia, orden y marcador dentro del dominio

La batería recibida comprueba las ocho combinaciones, equivalencia CJS/ESM en cada una, ausencia/reinserción, datos ordinarios con el texto del marcador y las dos versiones en frontera anual. Los casos propios I01 intercambian además el valor de constructor CJS y ESM entre instancias de ambas familias: se comprueban igualdad deliberada, orden y los cuatro primeros componentes de cada tupla de propiedad, además de la tupla completa del constructor.

I02 inserta propiedades adicionales antes y después de retirar/reinsertar constructor: original, ausente y reinsertado siguen distintos y admitidos por la guardia. I03 reemplaza constructor por arrays ordinarios con el mismo texto del marcador y cambia cada atributo de una propiedad adicional de esos arrays. La codificación recursiva distingue esos datos entre sí y del constructor nativo; el array de datos recibe su etiqueta e identidad, no el marcador reservado sin envoltura. I04 confirma un objeto ordinario y ejercita una función externa con r36Origin fabricado en la entrada pública anual: pending, traza vacía y ningún sitio publicado. No se atribuye admisión a una llamada aislada al encoder.

Objeción experta: una matriz finita no demuestra inyectividad universal de JavaScript. Respuesta: el dictamen se limita al cambio y al dominio nativo fijado, sin funciones externas, proxies, accessors, ciclos o bibliotecas alteradas. Coste: futuras ampliaciones del dominio requieren otro contrato; no se exige ni se afirma serialización universal o sandbox hostil.

## R48-S02 — Frontera real de recibos, dos clases de evidencia

I06 genera realmente los argumentos con el runtime v2 adaptado y entrega el recibo a `obtenerEscalaAutonomicaPublicada` durante `evaluateCompleteAdmission` anual actual. La frontera se alcanza una vez; v2 devuelve pending por recibo no ligado y cero sitios; v3 funciona. Los demás puertos son sintéticos. Esto acredita protocolo, no resultado monetario real ni autenticación del emisor.

Se ejecutan aparte dos pruebas preservadas R47, seleccionadas por nombre y adaptadas solo por ruta. La primera genera un DTO con la API TS real y fija su recibo antes de consumirlo; funciona en el servicio anual y los adversos de año/modo/orden quedan pending. La segunda usa dos llamadas reales con `retencionesSoportadasCentimos` propio no enumerable, valores 1 y 2: producen totales distintos; el recibo del primero funciona para el primero y no se reutiliza para el segundo. Se conservan todos sus esperados. Hay dos pruebas ejecutadas y 26 excluidas por el filtro, no 28 pases. No se revisan otra vez A02–A05 ni se atribuye validez legal a las cuantías calculadas.

Objeción experta: un positivo sintético podría parecer liquidación real. Respuesta: separar las dos ejecuciones y señalar qué API produjo cada valor. Coste: la composición financiera, proveedores y validez fiscal conservan obligaciones independientes.

## R48-S03 — Software e IR separados

El fragmento reconstruido y el recibido son idénticos, gzip SHA-256 `9d8f62076250c197e6fd840ac5b336306dc5cdcb3ff6a183ec8892604ac29b9a`. El runtime anterior es `2ed6fffae1c812265f3947c0b6942597ba410c51aa3151796ecc8116f90becb9`; el actual, `525d42752be323bfd504b3230ed2522b4ab416b14bd734981c60c2b3d3e8ed94`. `contraste-fuentes.json` registra productor, compilador, verificador, schema y derechos por separado. El IR no incluye este cambio del consumidor: su igualdad no demuestra runtime idéntico.

Las 17 puertas de sitios conservan admissionClosed/siteClosed false; wiringAllowed y completeRuleAcceptance permanecen false. Se verifica el candidato y se comprueban esas banderas sin promover ninguna. El cotejo físico de toda la base cubre también motor, inventario, confianza, 264 enlaces limitados/Madrid pendiente y 45 snapshots; no se regeneran. No se reconstruyen matrices legacy ni se ejecutan renders/builds.

Objeción experta: hashes y reconstrucción pueden repetir el mismo error semántico. Respuesta: usarlos para integridad y separación de software, acompañados de discriminantes independientes. Coste: mantener revisión semántica y contraste del padre como condiciones; ningún recuento constituye aceptación fiscal. Las 349 pruebas declaradas por el padre contienen 338 recibidas + ocho nuevas + tres rojos ahora verdes, con solapamiento semántico: no son 349 garantías independientes ni se suman a esta ejecución.

## Calidad, incidentes y reproducción

COMANDOS.json contiene órdenes y códigos de cada ejecución del arnés; sus JSON detallan cada aserción. Herramientas por Nix, dependencias del padre solo lectura, Vitest con un trabajador, cache false y directorio absoluto propio. Pruebas, tipos, contraste de fuentes, recepción y reconstrucción usan locks concretos sin anidarlos ni retenerlos durante redacción. No se instala nada ni se crea node_modules o entorno Python.

El primer enumerador falló ENOBUFS por el límite por defecto al leer ls-tree; se repitió con maxBuffer suficiente antes de escribir. La primera batería codec-final dio 15 pases y nueve fallos: uno por resolución CJS de decimal.js y ocho por un esperado propio incorrecto, que comparaba IDs de referencia de una codificación aislada con IDs de una codificación anidada. Se conserva el instrumento inicial en scratch y como fuente de la entrega. La corrección comprueba orden/flags y tupla del constructor explícitamente, manteniendo igualdad CJS/ESM y todos los esperados recibidos. NODE_PATH fija dependencias para createRequire del test recibido, sin editarlo. El primer tsc detecta una condición implícita del descriptor; se cambia a `=== undefined`. ESLint inicialmente no resolvía su import de configuración: copia propia con rutas absolutas a las mismas dependencias, sin desactivar reglas. Los fallos quedan registrados y no se presentan como pases.

TS nuevo usa strict, exactOptionalPropertyTypes, noImplicitAny heredado y noUncheckedIndexedAccess adicional. Los cuerpos MJS siguen fuera de checkJs: tsc no los acredita. Oxlint conserva las 16 reglas a error, un hilo y --disable-nested-config. Los instrumentos JS tienen ese límite de tipado explícito.

## Preservación y entrega

CAS.json fija 102 fuentes técnicas, tamaño, SHA-256, SHA-512 y copias por ambos hashes en `.cache/revision-codec-admision-r48-sol/cas/`, fuera de informes. Incluye fuentes del grafo/derechos, runtimes, pruebas, configuración y entradas de dependencias; bun.lock fija el cierre instalado, sin afirmar que una entrada de paquete por sí sola preserve cada byte transitivo. No hay originales PDF en Git ni documentos fiscales nuevos.

Solo se escriben las dos rutas asignadas. El cotejo inicial completo da 21.594 coincidencias, cero extras y cero borrados. El final repite lstat, readlink, bytes y bit ejecutable de cada entrada, un blob cada vez, y censa extras sin seguir enlaces; el detalle comprimido queda en scratch. No se sustituye por diff vacío. Todos los archivos documentales de esta entrega son nuevos, baseSha256 null; no se modifica ningún archivo previo autorizado o ajeno.

MANIFIESTO.json y cambios.diff.gz transportan el payload textual; binarios, si existen, se identifican por ruta/hash. Se ensaya aplicar el patch en scratch nuevo y comparar bytes, tamaño, hash y modo, incluido vacio.txt. Los sobres se excluyen de su propio payload para evitar autorreferencia; TRANSPORTE.json los fija y RECONSTRUCCION.json documenta el ensayo. Los logs mayores de 1 MB se comprimen. No se incluyen dependencias ni copias de la app en informes.

V5 r2 continúa solo lectura en `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/`, corte R26, pin `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`, sin reexportación. Crossa v1 sigue desfasado, misma casa/propietario, copia fuera de Victus y no custodia independiente. Sin VCS mutante, commits, bookmarks, PR, main, deploy, servidor, preview, LFS, gasto, transferencias, mensajes externos o limpieza. Este dictamen examina el codec candidato de esa versión. 

## Resultado final de calidad

codec-cierre: 24/24 (ocho recibidas, catorce propias, dos de protocolo), exit 0. Tres rojos recibidos actuales: 3/3, exit 0. Recibos reales: dos ejecutadas correctas y 26 excluidas por filtro. No se suman repeticiones o solapamientos como garantías independientes. Tipos-cierre, oxlint-cierre y eslint-cierre: exit 0. El segundo tsc detectó dos parámetros inferidos any desde MJS; se anotó explícitamente la tupla consumida por el test, sin relajar configuración. ESLint advierte detección de React ausente en este checkout y asume última versión; el alcance son instrumentos sin React. Se conserva la advertencia, sin presentarla como validación de componentes.
