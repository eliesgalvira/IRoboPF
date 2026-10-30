# Contraste del codec de admisión v3

R47-N01 queda corroborado como corregido en el alcance técnico de identidad revisado. La versión v3 distingue los atributos de constructor y conserva la equivalencia deliberada CJS/ESM. Los recibos v2 requieren regeneración; el consumidor actual no los acepta silenciosamente. No se demuestra un defecto nuevo en esta contrarrevisión. No se cambia producto ni se habilitan admisión, publicación o aceptación fiscal.

## Contraste sustantivo

El contraste de integración examina el informe, los cuatro dictámenes, las pruebas propias y sus correcciones de arnés. Los fallos iniciales del revisor quedan conservados y explicados: resolución CJS, comparación de identificadores de referencias de contextos distintos y anotaciones de tipos. No se alteraron los esperados históricos de las tres colisiones.

Se coteja de nuevo que los bytes del runtime fuera del codec y su comentario son idénticos. Runtime anterior: `2ed6fffae1c812265f3947c0b6942597ba410c51aa3151796ecc8116f90becb9`; actual: `525d42752be323bfd504b3230ed2522b4ab416b14bd734981c60c2b3d3e8ed94`. El fragmento conserva SHA-256 `9d8f62076250c197e6fd840ac5b336306dc5cdcb3ff6a183ec8892604ac29b9a`. Se distinguen explícitamente software e IR: un fragmento idéntico no acredita un consumidor idéntico. Los seis pins de software seleccionados coinciden con las fuentes del contraste de integración.

Se reproducen 19 pruebas correctas: 14 del revisor, dos de protocolo con argumentos realmente codificados por v2/v3 y tres discriminantes originales ahora correctos. Se reproducen aparte dos pruebas con resultados de la API TS real; las otras 26 del archivo quedan excluidas por filtro, no se cuentan como pases. En el primer caso, el recibo fijado a la llamada real funciona y rechaza los cambios de contexto. En el segundo, pagos propios no enumerables de uno y dos céntimos producen resultados distintos, y no se reutiliza el recibo del primero para el segundo.

Los instrumentos solo cambian rutas para ejecutarse en scratch de integración; `adaptacion-rutas.diff` conserva esas diferencias. No se ejecutan sus escritores contra los informes históricos. Pasan tipos principal/vendor, ESLint y Oxlint con las 16 reglas anti-slop a error. MJS mantiene checkJs=false; tsc no acredita sus cuerpos. No se repite la batería de 349 pruebas ya pasada sobre estos mismos bytes ni se suman los recuentos solapados.

## Decisiones y límites

- R47-N01: corroborado como corregido, para los atributos del constructor Decimal nativo. No demuestra una cuota distinta ni un bypass público por esos atributos.
- R48-S01: corroborados presencia, orden, atributos y separación del marcador frente a datos ordinarios. Dominio nativo y configuración fijados; no serialización universal ni sandbox para JavaScript hostil.
- R48-S02: corroborada la compatibilidad explícita v3. El ensayo de frontera con puertos sintéticos acredita protocolo; las dos pruebas separadas usan resultados reales. Ninguna autentica el emisor ni valida fiscalidad.
- R48-S03: corroborada la separación de integridad del IR y del software. Las 17 puertas, wiringAllowed y completeRuleAcceptance siguen falsas.

Objeción experta: dar por bueno un codec puede confundirse con aceptar los valores que transporta. Respuesta: cerrar únicamente el hallazgo técnico reproducido, mantener las obligaciones de proveedores/composición y fiscalidad separadas, y no encadenar otra revisión favorable idéntica. Coste: los recibos antiguos deben regenerarse y la composición necesita revisión propia.
