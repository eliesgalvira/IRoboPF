# Publicación de evidencia por snapshot

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`.

## Contrato y decisiones

1. Snapshot v2 conserva entidades v1 y añade estados técnicos separados por sujeto y revisión exactos, recibo ejecutado, payload y manifiesto de adquisición. Objeción experta: ampliar estados de todas las entidades convertiría un resultado puntual en una aceptación general. Se limita el resultado al sujeto y se conserva el contrato histórico. Coste: el consumidor combina snapshot y entidad; la entidad aislada mantiene sus estados v1 pendientes. Interpretación candidata, revisión del binding pendiente y aceptación fiscal completa false son literales cerrados.
2. El publicador llama al adaptador real; no admite recibos ni runners inyectados. Sustituye la ocurrencia existente y añade las otras cuatro entidades. Objeción: anexar otra revisión del mismo ID introduce ambigüedad. Coste: composición explícita y rechazo de colisiones editoriales; varios bindings por ocurrencia siguen necesitando un contrato nuevo.
3. Se conservan físicamente todas las dependencias fijadas y los objetos del snapshot origen, incluidos paquetes, índices, catálogo, código, inventario, payload, cita, revisión y adquisición. Objeción: nombrar hashes no permite recuperar bytes ausentes. Coste: almacenamiento adicional y cotejo de hashes/tamaños, sin resolver disponibilidad externa. Cada objeto debe ser local y menor o igual a 10 MB; no se genera una URL a un CAS externo no resoluble. Ningún manual grande se añade a Git.
4. El registro se escribe al final, después del cierre físico y semántico. Objeción: publicar primero deja un snapshot visible e incompleto. Coste: objetos no registrados pueden quedar tras un fallo; no se borran y la repetición coteja los existentes. No se promete durabilidad frente a caída eléctrica, transacción multiusuario ni resistencia ABA contra un escritor hostil.
5. Solo PDF y PNG explícitos en publicos se sirven, con hash, tamaño, firma de formato, MIME fijo, nosniff y caché inmutable. Objeción: exponer todos los auxiliares publicaría software y metadatos innecesarios. Coste: endpoint separado y rechazo 404/503; la adquisición completa queda preservada pero no se expone por HTTP.
6. Índice de búsqueda gzip por snapshot con ID, revisión, título y dimensiones candidatas; el verificador lo coteja contra todas las entidades. Objeción: un índice coherente consigo mismo puede mentir. Coste: cotejo completo al publicar/verificar y lectura/hash de disco en cada consulta. Se conserva como máximo un índice decodificado; antes de reutilizarlo se releen y hashean los bytes de disco. No se confía en mtime. El coste es retener ese único índice en memoria; v1 mantiene su búsqueda histórica. Las medidas son descriptivas, sin umbral CI.
7. Se excluye explícitamente lib/procedencia/rastro-generado.json de prepararEntrada. Objeción: fijar el alias que cambia al publicar crea un ciclo. Se fija el snapshot de origen exacto y v2.catalogo identifica su catálogo por hash. Se reconstruye desde los puntos de código y las revisiones del snapshot, se exige pertenencia a los auxiliares originales y se cotejan cobertura, identidades, unidades y revisiones al verificar. Coste: al integrar se debe seleccionar el nuevo snapshot al actualizar el alias después de integrar; no se retaguean resultados antiguos.
8. Las fuentes nuevas de publicación, presentación y HTTP entran en FUENTES_EXPLICACION. Objeción: cambiar la explicación sin invalidar su versión permite verdes obsoletos. Coste: regeneración tras integración. No se promete HTML histórico idéntico entre versiones de React.

<a id="regeneración-en-el-padre"></a>

## Regeneración

Después de reunir el motor y reconstruir inventario, payload y contenido mediante las herramientas existentes, iniciar un proceso Bun nuevo. Importar prepararEntrada de scripts/procedencia/evidencia-contenido.mjs y publicar de scripts/procedencia/contenido-publicar.mjs. Preparar la entrada para el snapshot exacto recién generado y conservar su JSON como entrada revisable. Invocar publicar(root, entrada, destino, origen); origen y destino son directorios de contenido con objetos/ y snapshots.json. El destino puede ser el mismo origen: no se sustituyen objetos históricos. No usar una entrada preparada antes de integrar los archivos definitivos.

El resultado identifica el snapshot nuevo; el integrador puede actualizar únicamente actual.versiones del alias de rastro con las versiones de ese snapshot, conservando bindings y catalogoSha256. Después ejecutar la puerta fresca de rastro y el verificador de contenido. La publicación no constituye autorización para ampliar registros ni migrar atestaciones.

Ejecutar con Bun/Node/Python de Nix, wrapper Python Nix/uv fijado y flock /tmp/irobopf-validacion-pesada.lock. Un trabajador, sin Next build. Los tests crean su propia publicación real en .cache/publicacion-evidencia-* del checkout y conservan resultado.json; esos objetos de scratch no son entrega para Git.

## Límites

No hay cambio numérico ni oracle modificado. EC-01, EC-02 y EC-03 del integrador se conservan. La revisión del binding actual sigue pendiente. Autenticidad procede del manifiesto y conserva fecha y límites, sin repetir pdfsig ni resolver confianza histórica. Un hash no prueba identidad del emisor ni verdad jurídica. No se prueba despliegue, custodia independiente ni restauración en otra máquina.

## Validación

Las pruebas de cierre documental usan un timeout de 30 segundos. Este límite del ensayo no constituye un umbral de latencia ni una medición de producción.

La publicación se ensaya dos veces desde la misma entrada y exige el mismo snapshot. Los controles incluyen sujeto/recibo ajeno, adquisición ausente, auxiliar corrupto, blob privado, PDF/PNG corrupto, rutas inexistentes, campos extra, aceptación false, búsqueda tras corrupción persistente, respuestas HTTP mediante el mismo helper de GET y renderToStaticMarkup. No hay servidor de producción ni navegador. La suite existente conserva los adversos de IDs/receta rehasheados y ámbitos incompatibles. Se ejecutan además las 24 pruebas existentes del puente Python con el wrapper fijado, incluidos cambios de ámbito con hashes rehechos. Las correcciones previas permanecen intactas.

Las cifras de suites no se suman a cobertura fiscal ni a resultados históricos de otros autores. La comparación histórica ensaya el snapshot 31be43e7… y el publicador verifica el origen actual 5da224c8…; no se atribuye un recorrido nuevo de todos los snapshots históricos.

La medición arranca un proceso nuevo y ejecuta dos consultas con RSS y comprobación fresca del software de explicación. No vacía la caché de disco ni mide carga concurrente o despliegue Next. El índice evita descomprimir 256 paquetes por consulta, con coste propio de decodificación.


## Resultado final

El script validar.sh termina con código 0: tipos principal/vendor, ESLint, oxlint, ensayo de las 16 reglas a error, 21 pruebas focalizadas y 17 de contenido histórico. El wrapper del corpus pasa las 24 pruebas del puente en 1,186 s. No se ejecutan Next build ni suites legacy completas. Las pruebas se serializan con el lock común y un trabajador.

Snapshot real de scratch: 9f7e95f09c9b8ca8303c0183cd1c5ddd4a79c06ac0a2ed25fbf94f5ff15fa380. Contiene 51.655 entidades y 966 objetos de dependencia enumerados con tamaño. Catálogo exacto: 27e1a456de414cdd12ef4eeee4322f2cc83545ee24cbc5fdbbf6f926eb50b81e. La segunda generación desde los mismos pins obtiene el mismo hash. La comprobación fresca de FUENTES_EXPLICACION sobre esa publicación pasa en otro proceso.

metricas.json registra la primera consulta del proceso (458,67 ms), la siguiente (116,19 ms), RSS inicial 112.226.304 bytes y RSS final 429.506.560 bytes. Son mediciones de esta máquina, con caché del sistema operativo sin vaciar y un solo índice retenido. No son una garantía de latencia ni memoria de producción. La búsqueda todavía asigna memoria al decodificar el índice; no se oculta ese coste.

Los únicos blobs públicos son el PDF de Madrid (213.826 bytes, 8a77dd28…) y el PNG (12.673 bytes, 95c51f21…), con hashes completos en metricas.json. Ya existen como fixtures de la base. No se entregan binarios nuevos ni los cientos de objetos generados: el integrador los regenera tras integrar, siguiendo COMANDOS.md. El scratch queda en este checkout y no es respaldo independiente.

La ficha recorre hasta 32 nodos documentales para producir enlaces directos. Objeción: un grafo arbitrariamente amplio puede amplificar una petición; coste: un futuro sujeto con más dependencias documentales exige revisar este límite y ahora falla explícitamente, sin ocultar enlaces.

El informe es una entrega de implementación, no una revisión independiente ni una aceptación fiscal. Al integrar se debe integrar por manifiesto y base, regenerar y encargar la revisión nueva prevista.
