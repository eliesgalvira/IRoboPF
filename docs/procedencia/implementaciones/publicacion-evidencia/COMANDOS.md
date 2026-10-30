# Reproducción

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Desde el checkout de la base declarada, con los archivos de esta entrega y node_modules existente de solo lectura:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/implementaciones/publicacion-evidencia/validar.sh
```

El script ejecutado conserva formato, generación del schema, tipos principal/vendor, lint global, ensayo de las 16 reglas, 21 pruebas focalizadas y 17 de contenido histórico. Las pruebas nuevas generan dos veces desde la misma entrada mediante el coordinador real, exigen identidad del snapshot y dejan resultado.json y metricas.json en su scratch. No actualizan el alias de rastro ni el registro de snapshots del repositorio.

Para publicar en la raíz integrada, después de regenerar inventario, payload registrado y snapshot técnico v1 con los procedimientos del integrador:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bun -e '
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { prepararEntrada } from "./scripts/procedencia/evidencia-contenido.mjs";
import { publicar } from "./scripts/procedencia/contenido-publicar.mjs";
const root=process.cwd();
const alias=JSON.parse(readFileSync("lib/procedencia/rastro-generado.json","utf8"));
const entrada=prepararEntrada(root,alias.actual.versiones.snapshot);
writeFileSync("docs/procedencia/implementaciones/publicacion-evidencia/entrada-integrada.json",JSON.stringify(entrada,null,2)+"\n");
const datos=resolve(root,"docs/procedencia/implementaciones/contenidos/datos");
const resultado=await publicar(root,entrada,datos,datos);
process.stdout.write(JSON.stringify(resultado)+"\n");
'
```

Este último comando queda preparado para el integrador; no se ha ejecutado sobre la raíz compartida. PrepararEntrada es inspección de los pins existentes, no autorización editorial para añadir bindings. No descubre ni incorpora los 455 candidatos externos al registro. El alias no se cambia en este comando. Al seleccionarlo después, usar las versiones del snapshot devuelto y su catalogo exacto; conservar las referencias de resultados anteriores.

Para producir el sobre de entrega, después de cerrar informes y logs:

```sh
nix shell nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock python3 docs/procedencia/implementaciones/publicacion-evidencia/entrega.py
```

Las únicas operaciones Git del script son show y ls-tree. Compara cada archivo con eaed990c620b5fc4d3ff2e74dc68e0c8481c43db y verifica presencia de todo el árbol base. MANIFIESTO.json y entrega.patch son sobres sin autorreferencia. No copiar .cache, node_modules ni metadatos VCS.

Comprobación adicional ejecutada del puente, sin editar sus pruebas:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
```

La medición independiente se ejecutó en un proceso Bun nuevo bajo el mismo lock, importando buscar/leerSnapshot y verificarSoftwareExplicacion. Seleccionó el resultado.json más reciente del scratch de esta suite, verificó las fuentes, midió performance.now antes/después de dos búsquedas idénticas de Madrid y process.memoryUsage().rss. El resultado completo está en metricas.json; las medidas dentro del proceso de pruebas permanecen en metricas.json del propio scratch. No se deben comparar RSS del proceso de generación con el proceso nuevo como si fueran la misma carga.
