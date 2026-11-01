# Compatibilidad del catálogo de deducciones

La revisión de 2025 conserva los campos existentes de `FichaDeduccionAutonomica`, sus códigos y las exportaciones del catálogo. Se añadirá procedencia verificable sin cambios de diseño en `app/procedencia/**` ni en otros componentes.

Se ha incorporado el contrato aditivo descrito a continuación y se ha contrastado técnicamente mediante revisión independiente. Los dictámenes normativos de las deducciones siguen pendientes. La ausencia de procedencia revisada no debe interpretarse como conformidad normativa.

## Conexión documental

Se añade `procedencia?` a `FichaDeduccionAutonomica` y se exporta `obtenerProcedenciaDeduccion2025`. Se conservan campos, exports, códigos, cifras e identidades de objetos. La referencia contiene versión, ejercicio, código, estado documental y opcionalmente el SHA-256 del paquete. No contiene citas extensas, rutas de almacenamiento ni originales.

Hay dos vías de construcción: helpers y literales regionales exportados directamente. Sin modificar los regionales no es posible hacer obligatorio un campo físico en todas las fichas. Por ello el consumidor debe llamar al accessor, también para una ficha importada directamente: la ausencia del campo devuelve `pendiente`. No debe interpretar `ficha.procedencia === undefined` como una revisión favorable. Los helpers conservan exactamente su construcción anterior. Una referencia candidata explícita se devuelve sin promoverla a aceptación.

El estado documental no depende de `estado` fiscal (`implementada`, etc.). No se generan dictámenes para rellenar las 351 entradas. El accessor no importa censo, fuentes ni lotes JSON y no hace IO; el lector documental y el verificador viven en scripts, fuera del grafo de cliente. El backend de presentación deberá resolver las referencias y servir documentos ligeros; esta entrega no implementa esa capa ni modifica UI.

El SHA-256 de paquete identifica los bytes JSON exactos, sin canonicalización implícita. Los documentos se referencian mediante `(lote, documentoId)` y tienen SHA-256/SHA-512 independientes de su URL. Adquisiciones distintas del mismo contenido conservan sus propios metadatos. Los IDs de cita son locales a cada deducción. Una corrección documental cambia el hash del paquete. El hash no acredita vigencia ni aceptación. La inclusión de referencias candidatas en fichas queda pendiente de integración de los lotes y revisión independiente.

Las comparaciones documentales admiten el campo aditivo `momento: "antes" | "despues"`; si falta se consideran actuales. Los lectores que distingan errores corregidos de diferencias vigentes deben usar ese campo, no interpretar texto libre. Esto no cambia la interfaz de cálculo ni las cifras.

En los manifiestos de fuentes, `fechaPublicacion` puede ser `null` para un manual cuya fecha de publicación no esté acreditada. En ese caso se exige `reservaFechaPublicacion`; la fecha del pie se conserva aparte como `fechaEditorial`. El lector no debe mostrar esta última como fecha de publicación. No cambia la forma de las fichas ni la interfaz del motor.

El formato ejecutable se documenta en [contrato](contrato/README.md). Los nombres mínimos comunes permanecen; los subcampos fiscales heterogéneos de `vigencia` y `manual` admiten reservas explícitas y extensiones. Las comprobaciones conocidas de referencias no se omiten por esa apertura. Antes de integrar lotes con convenciones distintas se debe acordar una ampliación aditiva del schema, sin adaptar datos fiscales a etiquetas ficticias para superar controles.

## Certificados de celiaquía y atribución del parcial

`evaluarCeliaquiaRioja` conserva su firma y estados. Un diagnóstico posterior a la emisión del certificado devuelve `no_soportado`; se admite la emisión posterior a 2025 para un diagnóstico de ese ejercicio. El importe parcial pertenece al contribuyente indicado y nunca representa el total de una declaración conjunta. El agregado sigue rechazando estos parciales. No cambia la interfaz visual ni se añaden integrantes familiares al contrato.
