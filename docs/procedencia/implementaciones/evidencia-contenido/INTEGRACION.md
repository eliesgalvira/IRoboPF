# Adaptador de evidencia documental

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `ed6a43fd750de05609abc3710dabdc2f8261020c`.

## Invocación y frontera de confianza

`entrada.json` fija explícitamente el snapshot babfc930… y los bytes consumidos: registro, payloads completos registrados, citas, manifiestos, originales, crops, decisiones, inventario comprimido, fuentes generadoras, coordinador, auxiliar Python, schemas, receta Nix/uv, contratos y lock de JS. No se buscan candidatos en carpetas de entregas. `prepararEntrada(root, snapshot)` es solo inspección para preparar un próximo lote; su resultado necesita revisión editorial antes de usarlo. Cambiar el claim y recalcular su pin no demuestra la interpretación jurídica.

Desde la raíz, con Nix y dependencias existentes de solo lectura:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bun x vitest run tests/evidencia-contenido-procedencia.test.ts --maxWorkers=1
```

Para wiring, importar `generarEvidencia(root, entrada)` desde `scripts/procedencia/evidencia-contenido.mjs` en un proceso Bun nuevo del checkout integrado. Leer la entrada fijada antes de generar. La función verifica los pins, invoca directamente `verifyLinks(root)` de `verificar-enlaces.mjs` y vuelve a verificar los pins. Ese coordinador reconstruye el inventario en un proceso nuevo, compara los archivos y ejecuta `enlaces.py` mediante `tools/procedencia/run.sh` (Nix fijado y uv frozen). No hay parámetro para inyectar una respuesta JSON o sustituir el ejecutor. No usar un proceso que haya precargado módulos de otra revisión. La instalación JS debe corresponder a bun.lock; el lock no autentica los bytes de node_modules.

La API devuelve `{revision, informe, objetos}`. `objetos` es un Map SHA-256→Buffer con PDF, PNG, receta, entidades y el informe por contenido. El test materializa estos objetos con creación exclusiva, cotejando cualquier objeto ya presente. `resultado.json` identifica el informe de esta entrega, no es un alias latest ni una atestación. Al integrar se debe conservar este informe por su hash y crear una nueva referencia de versión al conectar el contenido. Nunca reemplazar el snapshot de entrada o sus entidades históricas.

La ficha de ocurrencia usa el mismo ID y otra revisión. Para un snapshot nuevo, sustituir esa ocurrencia en la lista nueva, agregar Rule/Citation/Document/Facsimile y todos los auxiliares devueltos; verificar el grafo combinado y conservar el snapshot anterior. No anexar dos revisiones del mismo ID a un índice que espera unicidad. La función rechaza IDs duplicados dentro del lote; varios bindings para una misma ocurrencia necesitan una composición explícita antes de ampliar el adaptador.

## Qué acredita

- **Integridad:** hashes cotejados antes/después, original y PNG presentes, reextracción y render con el wrapper fijado, cierre de aristas y auxiliares comprobado por verificarGrafo.
- **Exactitud:** comparación Decimal del valor efectivo actual de Madrid 2020 con 53.407,20 EUR, en el alcance del payload. No es exactitud de toda la liquidación.
- **Autenticidad:** confianza histórica indeterminada; el digest no autentica al emisor ni resuelve revocación histórica.
- **Interpretación:** se conserva la decisión jurídica limitada y el claim candidato, con sus condiciones. El coordinador comprueba existencia/estado y archivo referido por la decisión; no prueba semánticamente cada palabra del claim.
- **Aceptación:** revisión del binding actual pendiente y aceptación fiscal completa falsa. Ninguna atestación anterior se migra.

El contrato v1 no puede expresar integridad comprobada ni exactitud por separado. Los estados de sus entidades permanecen pendientes por compatibilidad; `informe.estados` conserva el resultado técnico real y debe acompañarlas. `proposed-extension.json` especifica el cambio. Las secciones españolas muestran original, hash, cita literal, página desde 1, bbox, crop y condiciones. El ámbito fiscal estructurado queda desconocido: no se inventa predicado jurídico versionado a partir de un año y territorio.

## Decisiones y objeciones

1. Ejecutar el coordinador real. Objeción experta: un JSON que diga verified puede fabricarse. Motivo: reconstruir fuentes y reextraer original. Coste: una reconstrucción pesada por ejecución, serializada con flock; no prueba identidad del revisor ni elimina carreras ABA.
2. Pines explícitos antes de ejecutar. Objeción: comprobar solo al final puede consumir documentos de revisiones mezcladas. Motivo: fijar el lote editorial y detectar cambios persistentes. Coste: lectura adicional y nueva entrada revisada cada vez que cambia software, fuentes o corpus. No se afirma aislamiento frente a un escritor hostil que restaure bytes entre lecturas.
3. Blobs pequeños completos. Objeción archivística: una URL o un hash sin bytes no cierra el archivo. Motivo: conservar PDF de 213.826 bytes y PNG ya existentes. Coste: duplicación local acotada; no se presupone hosting ni copia externa. Ninguna descarga nueva.
4. Rechazo de geometrías no representables. Objeción: renombrar coordenadas puede mover la caja. Motivo: solo equivalencia comprobable con origen cero, cajas iguales y rotación cero. Coste: próximos PDFs con otras geometrías requieren la extensión propuesta; no se omiten silenciosamente.
5. Grafo candidato con informe separado. Objeción: los estados v1 perderían el éxito técnico o lo exagerarían como aceptación. Motivo: conservar ambos contratos y proponer v2 sin tocar modelos ajenos. Coste: al integrar se debe mostrar estados del informe al conectar; no basta renderizar solo la entidad v1.

## PNG y privacidad

`rutaPublicaBlob(sha256)` produce `/procedencia/objetos/<sha256>` sin query ni identificadores de contribuyente. Es un contrato de ruta, no un servidor existente. Antes de servir, al integrar se debe materializar y verificar el objeto en su CAS real, limitar la ruta a los hashes del manifiesto público, enviar el MIME correcto, `nosniff` y caché inmutable; no introducir rentas, nombres, sesiones o escenarios en URL, PNG o logs. Se pueden servir los PNG como archivos estáticos sin ejecutar cálculos. El original se conserva en el mismo conjunto de objetos. No se añade UI, servidor ni despliegue.

## Validación

`pruebas.log` registra la ejecución real y las mutaciones de documento, claim, unidad, crop, snapshot, duplicados, metadatos privados y campos extra. Estas mutaciones conservan el pin editorial y prueban el rechazo antes de reconstruir: no se presentan como contrarrevisión semántica de claims con pins nuevos. También se comprueban cierre sin blobs y campos extra/privados en entidades. El positivo ejecuta la reextracción y el render del facsímil con MuPDF fijado; no hay imagegen.

`typecheck.log` recoge los proyectos principal/vendor. Las pruebas no amplían las cifras de pruebas históricas ni certifican reglas fiscales. La revisión externa nueva y el wiring quedan a cargo del integrador.

Resultado final: 13 pruebas pasan; typecheck principal/vendor y lint global pasan, sin reglas desactivadas. El facsímil inspeccionado visualmente conserva la última fila 53.407,20 / 7.395,81 / en adelante / 21,00 %. La cuota no se acepta por aparecer junto al límite. La segunda ejecución produce el mismo hash de informe `7c908ca9927277c7674b1c935451739eb28e02ef0dbd7776c52b7001d86d3e20`.

El patch unificado contiene archivos de texto nuevos. PDF y PNG binarios se entregan como archivos en `objetos/`, enumerados con SHA y tamaño en `MANIFIESTO.json`: copiarlos por hash junto al patch o integrar toda la lista por archivos. El manifiesto y SHA256SUMS son sobres de entrega, sin autorreferencias. La base se declara, no se infiere del índice; el integrador comprobará que estas rutas eran nuevas en esa base. No se ejecutó ningún comando VCS, reparación de índice, descarga, build, servidor, PR ni deploy.
