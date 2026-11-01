# Validación de la migración

Se verificaron los 48 snapshots existentes durante el primer pase, incluidas sus dependencias, paquetes, documentos y enlaces. El snapshot final adicional `f4b1aa7c6bea6b43031bf0e661751daa65a4d5950f661491ff86780fdea00885` pasa las pruebas de contenido y el cotejo del rastro de 65 puntos. Los 20 tests de contenido/rutas pasan. El ensayo del almacén rechaza configuración ausente o relativa, ubicación dentro de Git, symlinks, hash inválido y corrupción.

El mapa resuelve 426 referencias completas y abreviadas; los 213 destinos existen en un clon independiente que contiene únicamente la historia filtrada. El filtro cotejó cada archivo ajeno al almacén, incluidos modos y enlaces simbólicos, para cada commit. Ninguna otra referencia local preexistente se movió.

La compilación local `next build --webpack --experimental-build-mode compile` termina correctamente. Las cinco rutas documentales trazan entre 1,27 y 1,66 MB de dependencias, con cero objetos del almacén y cero archivos ausentes. Es una medición local de NFT, no un despliegue ni una medición del paquete final de Vercel. El tipado del alcance y lint pasan. El tipado global mantiene 12 diagnósticos en los arneses archivados `redondeo-salarial-open/runner.ts` y `rutas.ts`; el modo compile no ejecuta ese control global.

## Discrepancia previa del registro activo

`verificar-enlaces.mjs` reconstruye correctamente el inventario actual, pero el auxiliar rechaza `Binding de otro snapshot de inventario`. El primer payload, `enlaces/madrid-2020-limite.json`, fija el manifiesto `30dfbc31…`, mientras el actual tiene hash `b173ac39…`.

El inventario, el registro, ese payload, el coordinador y el auxiliar Python son idénticos byte a byte a los de `2b6afac3`, anterior a la migración. La condición que falla compara esos dos hashes. [discrepancia-registro-previa.json](discrepancia-registro-previa.json) conserva la comparación. Este resultado no se presenta como una verificación satisfactoria del registro actual: las aceptaciones históricas no se renuevan automáticamente después de cambiar el inventario.

Los enlaces conservados dentro de cada snapshot sí verifican contra sus propias dependencias. Resolver el registro activo requiere decidir qué bindings se renuevan para el nuevo inventario y revisar sus bytes; no forma parte de mover el almacenamiento y no se ha simulado una aceptación.

Los resultados y hashes de logs están en [validacion.json](validacion.json). Los logs íntegros, incluidas las ejecuciones iniciales con entorno incompleto, se conservan junto al respaldo fuera del repositorio.
