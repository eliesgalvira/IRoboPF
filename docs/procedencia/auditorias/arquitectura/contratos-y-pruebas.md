# Contratos y pruebas de aceptación propuestas

Estado: pendiente de contrarrevisión. Los JSON Schema son Draft 2020-12, con `additionalProperties: false`; los `$id` proponen un espacio de nombres, no afirman que esas URLs estén publicadas. `model.schema.json` contiene las definiciones; los otros 13 archivos son puntos de entrada. No se ha escrito código de aplicación.

## Semántica que Schema no puede demostrar

- Referencia: `revision` es el hash de bytes de la entidad referenciada. `Entry.blob.sha256` debe coincidir con ella. No contiene su propio hash. Un ID puede tener varias revisiones en un snapshot para variantes de fecha/territorio. Prohibir dos bytes distintos para la misma revisión.
- Cierre: toda referencia debe resolverse a un tipo admisible en el snapshot. `Citation.supports` son IDs inversos, resueltos por snapshot para evitar ciclos CAS. No implica que todas las revisiones de ese ID estén respaldadas: solo las que incluyen esa cita en sus referencias directas. `Page.refs` se valida según sección: fórmula→Formula/Parameter, derivación→Derivation, norma→Rule, captura→Citation/Facsimile.
- Temporalidad: fechas ISO reales, inicio anterior al final exclusivo y ejercicios compatibles con la base temporal. Una norma retroactiva puede publicarse después de iniciar su ámbito: no rechazarla por eso. Document conserva versión de texto distinta de Scope. La fecha del servidor no decide la norma.
- Territorio: resolver España/comunidad/provincia foral según ámbito y régimen explícitos. No usar prefijo textual ni `ES` como comodín de herencia. La lista de territorios admitidos no acredita cobertura fiscal. IDs históricos existentes del motor se traducen mediante tabla explícita del inventario; `simulada-estatal` queda separado.
- Estados: autor distinto del revisor; el revisor relee los hashes exactos. Review aceptada requiere informe y evidencias, no solo cambiar enum. Estado de autenticidad es por comprobación, no por elemento. Un resultado `invalida` debe bloquear una afirmación de autenticidad; varios checks no se reducen por mayoría.
- `releasePolicy=revisada`: comprobar que los elementos a los que el release atribuya evidencia aceptada tienen cierre, citas verificadas e informes independientes. Puede contener lagunas declaradas, pero no anunciar cobertura total ni calificarlas aceptadas.
- Valor: cadena decimal exacta y unidad explícita; tabla conserva clave por fila/celda. Una unidad por celda permite umbral EUR y tipo fracción sin confundirlos. Infinito se representa por una condición de tramo en Formula, no decimal especial. Porcentajes y fracciones son unidades distintas. No NaN ni Infinity ni number para importes.
- Fórmula en español es documentación, nunca código ejecutable. `Formula.inputs` enumera variables y unidades. Bordes establecen dominio, inclusión/exclusión y comportamiento fuera del soporte. La igualdad de un número citado con el motor exige evaluar una Derivation cuando hay transformación (por ejemplo mensual→anual), no buscar una cadena.
- Herencia: `inherited` exige regla de continuidad verificada; mismo valor numérico en dos años no prueba vigencia. Todos los años efectivos se enumeran; ausencia no implica prórroga.
- Trazabilidad: `siteId` estable por punto semántico, `instanceId` único dentro del rastro. Un paso repetido en tramos no reutiliza instanceId. Cada línea enlazada tiene al menos una regla y cita; una suma puramente técnica puede marcar no-aplica con motivo y referencia a convención técnica. Cita pendiente no impide calcular con los parámetros compilados, pero impide presentarlos como verificados.
- Snapshot y BindingIndex: versiones de algoritmo/datos/explicación idénticas a las del rastro. Motor y corpus incompatible es fallo de procedencia explícito, no descarga de «latest». Caso contrafactual fija escenario completo por revision, no solo nombre.
- Geometría: cajas `[x0,y0,x1,y1]` no degeneradas, dentro de ancho/alto; orden de lectura explícito por orden de array. Las páginas rotadas se extraen en el sistema declarado antes de convertir a píxeles. Convención CropBox no equivale al origen PDF nativo inferior izquierdo. Página física 1 no tiene por qué mostrar número impreso 1. Tabla conserva encabezado, fila, columna y cajas de celdas; si cruza páginas son varias citas.
- OCR: nunca se etiqueta como capa de texto; guardar extractor/version y revisión humana. Normalización tolerante es una comprobación adicional con versión propia, no reemplaza `quote.exact` ni altera el original. HTML usa selector más TextQuote con contexto; un DOM reconstruido debe seguir algoritmo fijado. No ejecutar scripts del HTML adquirido ni servirlo como HTML activo del mismo origen de la app.
- Render: image hash corresponde al archivo, no a un lienzo similar. Igualdad de bytes solo bajo herramienta, entorno y encoder fijados. Una captura contextual más amplia es otro Facsimile del mismo Citation. PDF no textual puede tener recorte aunque su cita OCR esté pendiente.
- Cadena de confianza: hash verifica integridad relativa a manifiesto confiable; manifiesto servido junto a blob no es firma del editor oficial. Fijar hash esperado en release de aplicación/repo y conservar reportes de autenticidad. Redirección fuera del editor oficial requiere revisión y no queda autenticada por tener HTTP 200.

## Matriz de pruebas

Todas son pruebas propuestas para el editor; las comprobaciones ejecutadas en esta entrega se listan al final. No llamarlas «pasadas» por estar descritas.

| ID | Prueba positiva | Mutación/contraejemplo y resultado exigido |
|---|---|---|
| C01 | Validar cada raíz con Draft202012 y format checker | Campo desconocido, versión errónea, referencia mal formada: rechazar |
| C02 | Decimal `0.075` con unidad `fraccion` | Número JSON 0.075, `NaN`, coma decimal: rechazar |
| C03 | Tabla con límites/porcentajes y clave de fila | Duplicar clave o unidad equivocada: error semántico |
| C04 | Grafo con Rule→Citation→Document | Referencia rota, tipo erróneo, ciclo por hash: rechazar publicación |
| C05 | Snapshot resuelve misma revisión por dos paquetes | Bytes distintos o tamaño/hash incorrectos: rechazar |
| C06 | Publicación y vigencia retroactiva documentadas | Resolver por fecha de descarga en lugar de devengo: test falla |
| C07 | Dos variantes intranuales, frontera `[a,b)` | Día b en primera variante o dos reglas simultáneas sin discriminante: rechazar |
| C08 | Fallecimiento antes/después del cambio normativo | Sustituir por 31/12 automáticamente: test falla |
| C09 | Continuidad de un año mediante Rule | Copiar valor anterior sin regla de continuidad: rechazar sello revisado |
| C10 | Regla estatal y autonómica distintas | Aplicar `simulada-estatal` a comunidad real o foral por fallback: rechazar |
| C11 | Estados independientes | Firma válida marca review aceptada automáticamente: test falla |
| C12 | Revisor nuevo con informe y hashes | Mismo authorId/reviewerId, reporte sin original: rechazar aceptación |
| C13 | Cita PDF página 1 y cajas reales | Página 0, cajas invertidas/fuera de página, quote alterada: rechazar |
| C14 | PDF rotado 90°, CropBox desplazado | Interpretar origen inferior izquierdo o MediaBox: captura no coincide, test falla |
| C15 | Fila de tabla con encabezado y dos páginas | Capturar número de fila vecina: rechazar correspondencia de valor |
| C16 | Cita HTML selector+quote contra bytes guardados | HTML modificado en origen no actualiza cita antigua; si bytes locales cambian, falla hash |
| C17 | OCR marcado y revisión humana pendiente | Cambiar extraction a text-layer sin respaldo: verificador falla |
| C18 | Recorte reproducido con entorno fijado | Cambiar encoder/DPI sin nueva revisión: hash falla |
| C19 | Derivación anual explicita 12×importe mensual | Comparar directamente mensual con anual o aplicar 14 pagas: falla comparación |
| C20 | Cada rama del rastro tiene siteId y refs | Una línea sin binding, binding por etiqueta traducida o manual de otro año: falla cobertura |
| C21 | Repeticiones tienen instanceId único | Reusar ID en dos tramos o usar posición como identidad estable: falla semántica |
| C22 | Calcular con red deshabilitada | Resolver parámetros desde PDF remoto en ejecución: falla frontera |
| C23 | Solicitar ficha solo con IDs públicos | Salario/resultados/fecha personal en URL, request o log: falla privacidad |
| C24 | Rastro v1 produce aviso pendiente | Migración inventa cita o acepta legado como norma: falla |
| C25 | Código N con snapshot compatible | Algoritmo/datos/explicación N−1 sin rechazo explícito: falla |
| C26 | Publicar objetos antes del manifiesto/alias | Interrumpir publicación entre fases: alias previo sigue utilizable |
| C27 | Cache hit devuelve mismos bytes del paquete | Respuesta truncada, MIME HTML por error, hash distinto o zip bomb: rechazo y no cachear como éxito |
| C28 | URL desconocida da 404 sin guardar ficha | Hash presente en índice pero caído: 503, no 404 persistente |
| C29 | HTML/RSC respetan Vary en host real | Servir RSC a navegación HTML o mezclar despliegues: falla |
| C30 | Alias revalidado y snapshot antiguo retenido | Alias stale actualiza mitad de referencias: falla |
| C31 | Página sin JS conserva fórmula/norma/bordes | Evidencia solo canvas/imagen, foco inaccesible o color como único estado: falla accesibilidad |
| C32 | Restauración desde segunda copia sin caché web | Manifest sin blob recuperable: no publicar como preservado |
| C33 | Document headers ausentes son null explícito | Inventar ETag/publicación/CSV a partir del nombre: rechazar ingreso |
| C34 | Firma con revisión posterior identificada | Reporte PAdES dice válida sin alcance de bytes/revocación: no acreditar autenticidad completa |
| C35 | Datos remotos tratados como datos | HTML activo same-origin, eval de fórmula, URL arbitraria del cliente: falla frontera |
| C36 | Medición con paquetes representativos | RSS/build/bundle sobre presupuesto: ajustar partición/prerender antes de publicar |

## Coordinación con pipeline e inventario

El pipeline mantiene la autoridad de adquisición, extracción, recortes y verificación. Este diseño no implementa esos trabajos. La conversión de `descargar.py` debe conservar el original y todos los headers en el registro de adquisición original; Document usa resumen mínimo de cabeceras para consumo web. `localPath` se permite en un documento interno y se elimina de paquetes públicos. Para valor desconocido, usar la variante `unknown`; no cero. `identifier` desconocido puede decir «no identificado» con versión explícita; no inventar BOE/CSV.

El inventario podrá asignar itemIds; las ubicaciones estables de este informe permiten cruzar antes de que eso exista. No se puede calcular cobertura global sumando esta propuesta como auditoría fiscal. Las fichas individuales de todos los conceptos fiscales son trabajo posterior de generación desde inventario y evidencias; aquí se entrega su contrato completo, no fichas ficticias de 2012–2026.

`Review.reportRef` es un Blob de informe, listado en `Snapshot.reviewReports`; no es una entidad fiscal. Los `examined` identifican revisiones documentales/candidatas anteriores, nunca el propio objeto aceptado por hash circular. Fechas desconocidas de Rule se permiten como null para registrar lagunas y convenciones técnicas; una regla legal no puede considerarse temporalmente revisada mientras su aplicabilidad quede sin determinar.

## Verificación realizada

Se ejecutaron 49 comprobaciones estructurales: 14 metaschemas, 13 ejemplos sintéticos válidos de forma, 13 rechazos por campo desconocido y 9 casos negativos (decimal numérico, ejercicio fuera de ámbito, territorio inventado, fecha imposible, página cero, hash inválido, HTTP 404 como adquisición válida, DPI cero y aceptación sin revisor). Resultado detallado en `validacion-esquemas.json`.

No se ejecutaron C03–C36 como suite semántica de aplicación. Los fixtures sintéticos solo comprueban forma: sus hashes repetidos, fechas y textos no representan fuentes ni un grafo publicable. Están en scratch, fuera del corpus. No hay pruebas fiscales nuevas ni fixes. No se ejecutaron builds ni suite legacy.

La primera invocación de uv no pudo ejecutar el Python gestionado genérico bajo NixOS. Se resolvió fijando Python de `nixpkgs#python3`. La primera generación de fixtures no satisfacía la condición `enlazada` de Binding; el schema la rechazó correctamente y se corrigió el fixture para representar `pendiente`. No se relajó esa restricción.
