# Contrarrevisión de preservación v2

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `c61a306107f280c399eb57e57a7c45452bd68864`; corte del 29 de octubre de 2026. **Requiere cambios acotados en dos puntos residuales. El paquete concreto y la restauración existente superan la comprobación independiente de integridad.** Ese resultado no implica aceptación fiscal.

Se examinaron el informe de coherencia de ronda 9, revisión anterior completa (31 archivos y sus JSON), implementación, schema, clasificador de URLs, 16 pruebas y manifiestos. El informe de coherencia está en `docs/procedencia/correcciones/coherencia-ronda9/INFORME.md`. Los seis archivos centrales examinados coinciden por hash con la base; constan en `evidencia-fuentes.json`.

## Paquete y comparación con v1

Se leyó en flujo de 1 MiB cada objeto de `paquete-v2` y de `restauracion-v2`, bajo `.cache/orquestador-preservacion/` de la raíz principal. El cálculo propio no llama a fingerprint del producto. En **cada copia: 708 objetos, 974.801.535 bytes, SHA-256 y SHA-512 coincidentes**, sin error. Ambos manifiestos coinciden byte a byte con el confiado, SHA-256 `1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db`. `hashes.json` conserva todos los resultados; `ejecucion.log`, los totales.

Los triples SHA-256/SHA-512/tamaño son exactamente los mismos que v1. Los 708 punteros v2 coinciden en oid y tamaño y son idénticos a los de v1. Cambian los registros documentales: 2.125 dependencias frente a 1.420 y 2.919 adquisiciones frente a 2.905. Se cotejaron las 2.919 adquisiciones con sus JSON fuente actuales, incluidos hash de metadatos, URLs, fecha, estado y huellas del original: cero discrepancias. Esto comprueba coherencia documental local, no quién sirvió realmente los bytes.

Cuatro dependencias del manifiesto ya difieren de las fuentes presentes en la raíz principal: ESTADO.md, delegaciones-ronda9.json, enlaces/madrid-2020-limite.json y enlaces/registro.json. Ninguna dependencia falta en el pase. El detalle está en `comparacion.json`. Una restauración no revalida estas dependencias: preserva los originales de una instantánea, no asegura que el corpus cierre las necesidades del código y registro actuales. No se regeneró un plan desde la raíz en movimiento ni se confundieron referencias hexadecimales sin tipo con documentos ausentes.

Decisión: comprobar las dos copias completas existentes y la ida/vuelta sintética de la suite, sin otra restauración de casi 1 GB. Objeción experta: verificar una carpeta ya restaurada no reproduce personalmente toda su creación. Coste asumido: no afirmo haber ejecutado otra restauración real completa; la integridad actual de ambas copias sí queda comprobada independientemente. No aporta evidencia suficiente multiplicar copias en el mismo equipo.

## PRE-01, PRE-02 y PRE-03

Los casos anteriores quedan rechazados: claves JSON repetidas incluso anidadas, NaN/Infinity, booleanos y floats en campos enteros, autenticidad inventada, cabeceras privadas superiores/anidadas, URLs no clasificadas, id libre, query duplicada y puerto malformado. El endpoint BOE válido sigue admitido. Las pruebas rechazan symlinks en fuente, destino, manifiesto y entrada de caché. Las 16 pruebas existentes pasan; `adversarial.json` conserva 32 comprobaciones adicionales, con controles positivos explícitos. No son 32 errores.

Las fechas civiles imposibles, hora 24 y ausencia de zona son rechazadas; el 29 de febrero de 2024 válido se admite. Permanece el siguiente contraejemplo:

**PREV2-01, P2 — desplazamiento horario imposible admitido.** `validate`, líneas 235–242 de preservacion.py, acepta `2026-01-01T00:00:00+00:99`. La expresión regular solo comprueba dígitos; `datetime.fromisoformat` normaliza el desplazamiento y el FormatChecker del entorno instalado no aporta la validación opcional de date-time. El manifiesto conserva el texto imposible. Se reproduce con el mismo entorno jsonschema del padre, sin desactivar controles. La primera prueba de `residuales_test.py` exige rechazo y falla.

Decisión propuesta al padre: validar también los rangos de los componentes del offset sin depender de normalización ni de extras opcionales. Objeción experta: que un parser produzca un datetime no prueba que el timestamp conservado esté bien formado. Coste: rechazo de adquisiciones antes toleradas y una regresión nueva, sin cambiar fechas históricas silenciosamente. No he observado ese valor en las adquisiciones reales del paquete y este defecto no invalida sus hashes.

## PRE-04 y fallos de publicación

La secuencia positiva sincroniza creación del destino y su padre, creación del CAS y destino, objeto tras flush/chmod, CAS con entradas, destino, temporal del marcador tras chmod, enlace del marcador y finalmente destino. `fsync-orden.json` conserva el orden real. Se corrigió la ausencia de sincronización de directorios identificada en PRE-04. No se simuló corte eléctrico ni se probó un filesystem que incumpla fsync.

**PREV2-02, P2 — la promesa «un fallo de sincronización no publica marcador» es excesiva.** En `publish`, líneas 101–106, el enlace ya existe cuando se ejecuta el último fsync. Se indujo individualmente fallo en cada una de las nueve llamadas de una transferencia mínima: las ocho primeras devuelven error sin marcador; la novena devuelve error **con manifest.json visible**. La segunda prueba roja exige el contrato escrito en el informe del padre y falla. `fallos-publicacion.json` registra los nueve resultados. El fallo del fsync del temporal también deja un temporal sin marcador; es residuo recuperable, no corrupción del original.

Decisión propuesta al padre: distinguir fallo previo a publicación de publicación visible con durabilidad no confirmada, y establecer diagnóstico/recuperación explícitos; corregir la promesa documental y probar el fallo final. Objeción experta: borrar el marcador tras un fsync fallido tampoco demuestra que el borrado persista; no prometer una transacción durable imposible con ese simple rollback. Coste: estado operativo adicional y tratamiento de destino incompleto/indeterminado. La operación sí propaga el error; no se ha demostrado un retorno de éxito falso ni bytes incorrectos en la transferencia positiva.

Estas garantías son locales bajo operador cooperativo. Comprobaciones previas de rutas, permisos 0444 y enlace exclusivo no protegen frente al propietario que cambie permisos o sustituya rutas concurrentemente. No se exige ni se promete seguridad concurrente hostil. Fijar fuera del paquete el hash confiado del manifiesto sigue siendo necesario: otro manifiesto coherente puede describir otro conjunto.

## Privacidad, autenticidad y aceptación

El cierre de esquema y la clasificación documental mejoran el control de metadatos, pero no son una prueba universal de ausencia de datos personales. Rutas relativas y ciertos títulos admiten texto; documentos oficiales pueden contener nombres. No se analizaron semánticamente los casi 1 GB para certificar anonimización, ni debe transformarse un original bajo el mismo hash. Mantener revisión editorial antes de publicar y preservar las exclusiones; no ampliar endpoints solo para recuperar un contador.

Integridad: comprobada para ambos conjuntos completos en esta ejecución. Autenticidad: no se repitieron firmas ni CVE, porque el encargo prohíbe red y no hay bytes nuevos; se conserva el alcance anterior de ocho firmas criptográficamente válidas entre once PDF, tres sin firma, sin confianza histórica/revocación certificada. Ese resultado anterior no se presenta como comprobación nueva de los 708 documentos. Interpretación: no se revisan vigencia ni requisitos jurídicos. Exactitud: no hay validación fiscal numérica nueva. Aceptación: ninguna regla ni payload nuevo aceptado, tampoco traslado de la revisión de Madrid.

El usuario eligió dejar preparada la transferencia. Los punteros son preparación, no recibos de carga. No hay nueva custodia externa acreditada, ni independencia entre dos carpetas locales, ni prueba de recuperación desde un remoto vacío. Se conserva el paquete y la restauración; no se solicita cuota, no se sube LFS y no se estima gasto nuevo. Coste explícito: permanece el riesgo común de pérdida del equipo.

## Reproducción y entrega

`COMANDOS.md` recoge comandos exactos y alcance. `tests.log`: 16 pruebas correctas. `rojo-residual.log`: dos expectativas residuales fallidas, sin corrección posterior. No se cambian cuantías, oracle, producto, package, lockfiles o CI. No corresponde patch de implementación. No se ejecutaron Next build ni suites legacy. Lectura completa, tests y tipos se serializaron mediante `flock /tmp/irobopf-validacion-pesada.lock`, un proceso. Se usó el entorno Python Nix/uv existente en modo offline. Ruff detectó primero dos problemas del script de revisión, corregidos en ese script; no se cambió ninguna regla ni extensión para eludir lint.

`manifiesto.json` enumera los archivos entregables con SHA-256, tamaño y baseSha256 (null para archivos nuevos); se excluye a sí mismo de su hash. `scratch/` contiene únicamente casos sintéticos propios, conserva el caso con marcador tras error y no debe integrarse como corpus oficial. `mypy-cache/` es caché de herramienta y no es parte de la entrega. El padre conserva la responsabilidad de integración selectiva y de comprobar ausencia de borrados; esta revisión no muta su índice ni registros de aceptación.

Comprobación final de los dos scripts: Ruff correcto y mypy limitado correcto, tras corregir la anotación del cursor JSON del script propio (diagnóstico inicial conservado). Preflight: los 5.281 archivos de la base siguen presentes en el worktree, cero ausencias. No se declara una comprobación atómica de todo el árbol del padre en movimiento.
