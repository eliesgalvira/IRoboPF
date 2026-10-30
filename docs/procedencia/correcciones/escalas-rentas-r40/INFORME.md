# Contratos candidatos de escalas y rentas

Se incorporan como candidatos los 28 recorridos de escalas, bases y mínimos, y los 20 de rentas con 19 instancias de actividad. Se entregan programas finitos, consumidores, schemas, pruebas y contratos exteriores. No se conectan al producto ni se aceptan sus cierres o cifras fiscales. La admisión común y la composición con los otros lotes siguen pendientes.

## Contraste de integración

Se leen productores, consumidores, pruebas, contratos y fuentes pertinentes. Escalas resuelve importaciones por módulo, opera tablas y selectores y conserva salidas por instancia; su proyección anual omite presentación, cronometraje y el catálogo sin valor por código. Los callbacks de rentas, SS, validadores de derechos, retención y DA61 son fronteras explícitas, todavía condicionadas. La receta comprobada no demuestra por sí sola suficiencia causal o corrección dimensional.

Rentas baja helpers propios a operadores, separa salarios de cotizaciones, aporte de etapas y pagos de rendimientos. La ruta explícita conserva sus rechazos y la ruta general exige un caso previamente admitido. Las dos instancias de activos aislados no se vuelven alcanzables en la conexión anual. Los consumidores de bajo nivel y los wrappers de ensayo no son una API pública de evaluación de programas arbitrarios; el uso del verificador y las condiciones exteriores deberán examinarse independientemente.

Reconstrucción estructural exacta de los dos artefactos: escalas contiene 20.900 operaciones de 57 fuentes y rentas 6.196 operaciones de 17 fuentes. Son fuentes de software, no documentos oficiales nuevos. La cifra de operaciones no constituye cobertura jurídica ni suficiencia del contrato.

Pasan 18 pruebas Vitest: 17 grupos de escalas y un grupo que ejecuta los 41 controles de rentas. La ejecución directa de los 41 controles también pasa y su JSON coincide exactamente con el recibido; no se suma como otra suite independiente. Se conservan casos y esperados de los autores, incluidos los rojos históricos. No se ejecutan suites Excel masivas ni Next build.

Seis discriminantes propios pasan: cuota sintética racional con nueve decimales y perturbación de cuota fija; tres recorridos canónico/legacy/canónico con salarios, cotizaciones y otras rentas diferentes; y rechazo de frontera ausente. Comprueban aritmética, transporte y selección técnica, sin fijar cifras fiscales ni admitir un caso anual.

## Adaptación del arnés a las reglas del proyecto

El primer typecheck global falla en el test de escalas. La configuración aislada recibida permitía any implícito y no aplicaba todos los diagnósticos del proyecto. Se conserva `types.log`, la prueba original íntegra y el diff de adaptación. Se cambian imports a los paquetes tipados, lectura estática del mismo JSON, anotaciones de salidas/callbacks, guardas de variantes y conversión DateTime al mismo instante. No cambia ningún caso, esperado, consumidor, productor, schema o dato del motor.

Se conservan además el primer intento de tipado, el rechazo anti-slop a un parámetro object y el rechazo ESLint al any explícito heredado. Las correcciones usan tipos de testigos y protocolo concretos; no desactivan reglas. Las comprobaciones terminales pasan: typecheck principal/vendor, checkJs de los once MJS del alcance, Oxlint global y ESLint global. ESLint conserva nueve avisos no bloqueantes, incluidos dos en los productores nuevos. Las 16 reglas anti-slop siguen a error. CheckJs mantiene los límites dinámicos declarados por los autores; no acredita tipado estático fiscal completo.

La prueba funcional se repite tras modificar imports, fechas y guardas: 18/18. Las anotaciones posteriores solo eliminan tipos amplios y no cambian ejecución. El archivo integrado difiere del recibido únicamente por esta adaptación, fijada por hashes en `adaptacion-pruebas.json`. El transporte original sigue reconstruyendo los bytes originales; no se altera su manifiesto para fingir que ya contenía el arreglo de integración.

Ambos schemas pasan Draft202012Validator. Los instrumentos propios y sus comandos se conservan como texto. Cada comprobación pesada usa el bloqueo compartido y un trabajador, con UV y cachés propios y cargador Vitest nativo. No se ejecutan productores sobre sus carpetas históricas.

## Decisión y límites

Los dos lotes son candidatos sujetos a revisión independiente. Sus cierres de valor y selección no acreditan por sí solos el cierre de sitio, la admisión ni la publicación.
