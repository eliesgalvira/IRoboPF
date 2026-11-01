# Comprobaciones y límites

La reconstrucción conserva los **214 commits**, todos sus mensajes, autores y fechas y las **19 firmas**. Se cotejaron archivos y modos en cada commit; 149 SHA cambian. El mapa acumulado resuelve 342 identidades anteriores, comprobadas también por prefijo: 684 consultas. No se poda ningún commit. [Historia](historia.json), [referencias](referencias-verificadas.json).

Se comprobaron 18.123 textos, la validez de 1.954 JSON modificados, los siete fragmentos de un transporte y los originales binarios conservados. Los 906 blobs con rutas confirmadas por la revisión independiente tienen una copia anonimizada. El mapa distingue 5.412 pares de contenido, incluidos los contenedores y sus interiores. [Integridad](transformacion.json), [mapa](objetos.json).

Gitleaks examinó la historia y 21,71 GB de texto extraído. Se revisaron sus 48 alertas históricas y 530 alertas del contenido: identificadores documentales, propiedades del motor y tres apariciones de un ejemplo público de Effect. Ninguna se confirmó como credencial del proyecto. Un segundo pase acotado reprodujo exactamente las 530 alertas para clasificarlas sin publicar sus valores. [Resumen](secretos.json), [clasificación](secretos-clasificacion.json).

## Comportamiento conservado

Pasan los **49 snapshots y sus dependencias documentales**, los 20 tests de contenido/rutas, los dos tests de integridad del almacén y copias anonimizadas, el tipado del producto y vendor y el lint: cero errores, 18 avisos y las 16 reglas anti-slop activas como error. Los lectores de commits históricos resuelven la correspondencia antes de consultar Git; las herramientas usan rutas relativas al proyecto.

El control TypeScript del producto excluye ahora `docs/procedencia`: allí hay reproducciones históricas que importaban otros worktrees. Se conservan íntegros esos programas y los 167 diagnósticos obtenidos con el ámbito anterior; no se presentan como pruebas actuales que hayan pasado. La aplicación, sus scripts y las pruebas en `tests/` siguen incluidos en el control del producto.

Una suite adicional obtuvo 152 pases y 22 fallos, además de una suite rechazada antes de recoger pruebas. Once fallos eran límites de tiempo; los once pasan al repetirlos con margen suficiente. Los otros once y la suite rechazada comparan el código salarial actual con bases anteriores a su corrección. La fuente actual y las fijadas son idénticas a las que existían antes de anonimizar: no se han actualizado esas expectativas ni sus dictámenes. [Comparación anterior y posterior](rechazos-previos.json).

El coordinador del registro activo sigue rechazando un binding de otro inventario. Es la [discrepancia previa](../almacen-externo/VALIDACION.md#discrepancia-previa-del-registro-activo), distinta de la verificación correcta de cada snapshot contra sus propias dependencias. Los metadatos anonimizados tampoco renuevan por sí solos sus hashes históricos o atestaciones; el replay exacto necesita los originales privados. No se modifica ningún criterio de aceptación.

Los resultados y hashes de los logs están en [validacion.json](validacion.json). Los logs completos y los ensayos iniciales permanecen en el respaldo privado.
