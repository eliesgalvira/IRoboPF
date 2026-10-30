# Contraste del padre: codec de admisión v3

R47-N01 queda corroborado como corregido en el alcance técnico de identidad revisado. La versión v3 distingue los atributos de constructor y conserva la equivalencia deliberada CJS/ESM. Los recibos v2 requieren regeneración; el consumidor actual no los acepta silenciosamente. No se demuestra un defecto nuevo en esta contrarrevisión. No se cambia producto ni se habilitan admisión, publicación o aceptación fiscal.

## Recepción e integridad

Se reciben 62 archivos, 333.402 bytes, incluidos cuatro sobres. El padre coteja físicamente las 21.594 entradas de la base `85705808bf692ebd54f1a1cc432ff0cc7142d834`: lstat, enlaces, bytes y bit ejecutable, un blob cada vez. Cero diferencias y borrados. Se reconstruyen exactamente los 58 archivos del payload, incluidos cinco archivos vacíos por manifiesto. El pin del manifiesto es `ea3e8b1c2869452662884dcf0de3b578112564329d31926e8bdd88943600f15e`.

El primer ensayo propio aplicó incorrectamente `patch -p1`, retirando docs/ de rutas que no tenían prefijo a/b. Falló la comprobación de CAS.json antes de copiar archivos al repositorio. Se conservan instrumento, log y scratch; el segundo ensayo aplica `-p0`, como indica la receta recibida, y coteja el conjunto completo. Es una incidencia del receptor, no un defecto de producto. `incidencia-recepcion.json` conserva el detalle.

Las 102 fuentes técnicas del CAS recibido se cotejan por SHA-256, SHA-512, tamaño y contenido actual, y se preservan fuera del worktree del hijo. Son fuentes del programa, configuración, pruebas y entradas de dependencias. Las entradas de paquete y bun.lock no equivalen a conservar todos los bytes transitivos de node_modules. No se incorporan documentos fiscales ni se reexporta v5.

## Contraste sustantivo

El padre relee el informe, los cuatro dictámenes, las pruebas propias y sus correcciones de arnés. Los fallos iniciales del revisor quedan conservados y explicados: resolución CJS, comparación de identificadores de referencias de contextos distintos y anotaciones de tipos. No se alteraron los esperados históricos de las tres colisiones.

Se coteja de nuevo que los bytes del runtime fuera del codec y su comentario son idénticos. Runtime anterior: `2ed6fffae1c812265f3947c0b6942597ba410c51aa3151796ecc8116f90becb9`; actual: `525d42752be323bfd504b3230ed2522b4ab416b14bd734981c60c2b3d3e8ed94`. El fragmento conserva SHA-256 `9d8f62076250c197e6fd840ac5b336306dc5cdcb3ff6a183ec8892604ac29b9a`. Se distinguen explícitamente software e IR: un fragmento idéntico no acredita un consumidor idéntico. Los seis pins de software seleccionados por la revisión coinciden con el padre.

Se reproducen 19 pruebas correctas: 14 del revisor, dos de protocolo con argumentos realmente codificados por v2/v3 y tres discriminantes originales ahora correctos. Se reproducen aparte dos pruebas con resultados de la API TS real; las otras 26 del archivo quedan excluidas por filtro, no se cuentan como pases. En el primer caso, el recibo fijado a la llamada real funciona y rechaza los cambios de contexto. En el segundo, pagos propios no enumerables de uno y dos céntimos producen resultados distintos, y no se reutiliza el recibo del primero para el segundo.

Los instrumentos solo cambian rutas para ejecutarse en scratch del padre; `adaptacion-rutas.diff` conserva esas diferencias. No se ejecutan sus escritores contra los informes históricos. Pasan tipos principal/vendor, ESLint y Oxlint con las 16 reglas anti-slop a error. MJS mantiene checkJs=false; tsc no acredita sus cuerpos. No se repite la batería de 349 pruebas ya pasada sobre estos mismos bytes ni se suman los recuentos solapados.

## Decisiones y límites

- R47-N01: corroborado como corregido, para los atributos del constructor Decimal nativo. No demuestra una cuota distinta ni un bypass público por esos atributos.
- R48-S01: corroborados presencia, orden, atributos y separación del marcador frente a datos ordinarios. Dominio nativo y configuración fijados; no serialización universal ni sandbox para JavaScript hostil.
- R48-S02: corroborada la compatibilidad explícita v3. El ensayo de frontera con puertos sintéticos acredita protocolo; las dos pruebas separadas usan resultados reales. Ninguna autentica el emisor ni valida fiscalidad.
- R48-S03: corroborada la separación de integridad del IR y del software. Las 17 puertas, wiringAllowed y completeRuleAcceptance siguen falsas.

Objeción experta: dar por bueno un codec puede confundirse con aceptar los valores que transporta. Respuesta: cerrar únicamente el hallazgo técnico reproducido, mantener las obligaciones de proveedores/composición y fiscalidad separadas, y no encadenar otra revisión favorable idéntica. Coste: los recibos antiguos deben regenerarse y la composición necesita revisión propia.

El módulo de resultados R45, recibido en R47, aún carece de contrarrevisión. Se prepara una revisión nueva y acotada de sus variantes success/fail/defect/not-reached, independiente de los puertos que continúan en otro hijo. No se lee su trabajo parcial ni se amplía esta recepción a los 65 cierres pendientes.

Motor, inventario, confianza, 264 enlaces limitados, Madrid pendiente y 45 snapshots permanecen intactos. V5 r2 mantiene el corte R26; Crossa v1 sigue desfasado y es copia local fuera de Victus, del mismo dueño y casa. Sin main, PR, despliegue, LFS, gasto, transferencia o limpieza. El encargo global sigue abierto.
