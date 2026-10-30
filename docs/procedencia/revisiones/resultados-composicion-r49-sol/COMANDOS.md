# Comandos, códigos y reproducción

Ejecutados desde /home/elies/.t3/worktrees/IRoboPF/t3-c432bd2e. Herramientas por Nix; dependencias existentes del padre en lectura. No se instala nada ni se crea node_modules en el checkout.

## Lectura y recepción

- git rev-parse HEAD: 0, 8136b0ffa00423eaffd1668e3bc14b45dae594b6.
- Intento rg inicial: 127, no estaba en PATH. Las búsquedas posteriores usan nix shell nixpkgs#ripgrep -c rg. Una tubería posterior dejó su segundo rg fuera de Nix (127); se corrigió poniendo ambos en bash dentro de Nix. Una búsqueda de una ruta anual supuesta inexistente dio 2; se localizó la función real en trabajo-anual/conexion.ts. Son consultas fallidas, no pruebas.
- Lecturas cat/sed y CLI effect-solutions list/show testing error-handling: 0, salvo glob inicial controles/*ts (no existía; los instrumentos son .ts.txt). Se leyó después el instrumento exacto.
- Recepción física inline: nix shell nixpkgs#python3 nixpkgs#uv -c bash con PYTHONDONTWRITEBYTECODE=1, UV_PROJECT_ENVIRONMENT absoluto propio y uv run --no-project --python del Nix python. 0, tras completar 21.681 blobs individuales bajo flock /tmp/irobopf-recepcion-acotada.lock. Resultado en controles/recepcion-inicial.json.
- Las únicas órdenes Git empleadas son lectura: rev-parse, ls-tree, cat-file y diff. No hay operaciones JJ ni Git mutantes.

## Validación

El prefijo de Node es:

    nix shell nixpkgs#nodejs -c bash -c 'flock /tmp/irobopf-validacion-pesada.lock node ...'

El lock se toma por comando, no durante redacción o API. En cada proceso se libera incluso con salida no cero. Las configuraciones exactas y el resolver están en controles/*.txt; se ejecutan desde .cache/revision-resultados-composicion-r49-sol/. El resolver solo busca paquetes ausentes en /home/elies/Repos/IRoboPF; no lee trabajo parcial de otro hijo.

Vitest:

    node --import "$PWD/.cache/revision-resultados-composicion-r49-sol/resolver.mjs"       /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run       --config "$PWD/.cache/revision-resultados-composicion-r49-sol/vitest.config.mts"       --configLoader native --exclude "**/rojo.test.ts"

Configuración native, cache:false, cacheDir absoluto propio, maxWorkers:1; incluye el arnés independiente y las 18 pruebas recibidas. Se preservan todos los intentos:

| Log | Código | Resultado |
| --- | --- | --- |
| pruebas-1.log | 1 | No resuelve effect, ninguna prueba ejecutada |
| pruebas-2.log | 1 | 57 pasan y una expectativa propia errónea de 49 nodos añadidos, frente a 42 |
| pruebas-final.log | 0 | 58 correctas, antes del cotejo adicional del texto del nodo |
| pruebas-terminal.log | 1 | 46 correctas y doce fallos de búsqueda textual propia que omitía espacios/saltos |
| pruebas-cierre.log | 0 | 58 correctas con búsqueda corregida |
| pruebas-entrega.log | 0 | 58 correctas con guardia undefined explícita final |

El log pruebas-terminal puede mostrar código actualizado en el marco de la aserción: el proceso había cargado la búsqueda anterior. controles/arnes-3.test.ts.txt conserva ese archivo anterior. Las fuentes intermedias se conservan; no se cambia producto ni rojo histórico.

Rojo original: mismo comando Vitest, con filtro posicional rojo.test.ts y sin --exclude. Código 1 esperado por la aserción original payload._tag; controles/rojo-reproducido.log. Adaptación exclusiva de prefijos de import. No es un pase.

Tipos:

    node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc       -p "$PWD/.cache/revision-resultados-composicion-r49-sol/tsconfig.json"

Proyección del tsconfig vigente: strict, exactOptionalPropertyTypes, aislación, verbatimModuleSyntax y plugin Effect se conservan; resolución de dependencias al padre, include solo las dos pruebas nuevas, incremental:false/noEmit. No se reduce la exigencia por el fallo histórico de resolución R45. MJS importado mantiene el checkJs del proyecto, sin atribuirle tipado completo nuevo.

tipos-1.log: 2 por nodeBuiltinImport en la lectura documental. tipos-final.log: 0 tras documentarla con la excepción local motivada, fuera del motor Effect. tipos-2.log: 2 por la condición de Node/undefined añadida después. tipos-terminal.log: 0 tras guardia explícita. No se modifican diagnósticos históricos ni tipos ajenos.

Oxlint:

    node --import "$PWD/.cache/revision-resultados-composicion-r49-sol/resolver.mjs"       /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint       --threads 1 --disable-nested-config       --config "$PWD/.cache/revision-resultados-composicion-r49-sol/oxlint.json"       "$PWD/docs/procedencia/revisiones/resultados-composicion-r49-sol/revision.test.ts"       "$PWD/docs/procedencia/revisiones/resultados-composicion-r49-sol/rojo.test.ts"

Las 16 reglas están a error; no se excluyen las pruebas por residir en docs o cache. lint-1.log: 1 (aserción sin justificación y ampliación de tipo innecesarias); lint-final.log y lint-terminal.log: 0, sin desactivar reglas. validar.sh.txt conserva el ejecutor de tipos/lint y sus códigos.

No se ejecutan Next build, render, matrices Excel ni suites legacy/globales ajenas. El alcance nuevo sí pasa tipos con diagnósticos Effect y lint.

## Preservación y transporte

Los scripts completos auditar.py.txt, preservar.py.txt y empaquetar.py.txt usan biblioteca estándar. Ejecutar por:

    nix shell nixpkgs#python3 nixpkgs#uv -c bash -c       'flock /tmp/irobopf-validacion-pesada.lock env PYTHONDONTWRITEBYTECODE=1        UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-resultados-composicion-r49-sol/env"        uv run --no-project --python "$(command -v python3)" python RUTA_ABSOLUTA_DEL_SCRIPT'

Preservación: 0, 124 fuentes locales/técnicas iniciales y ocho entradas adicionales de runtime/paquetes por ambos hashes: 132 entradas, sin confundirlas con cobertura. La ampliación se hizo mediante biblioteca estándar bajo lock acotado sin pruebas.

El cotejo físico utiliza /tmp/irobopf-recepcion-acotada.lock y git cat-file --batch: solicita y consume exactamente un blob completo antes del siguiente; no carga el árbol completo de contenidos. Comprueba lstat, readlink, bytes y ejecutabilidad de cada entrada, y después extras de disco, sin depender de índice. El lock se toma dentro del script, no se anida. Código 0 requerido.

Transporte: empaquetar.py usa patch -p1, código 0, scratch nuevo y cotejo exacto de todos los archivos del manifiesto, incluidos vacíos restaurados por objeto. Se entrega el recibo transporte.json; no se incluye a sí mismo en el manifiesto. Los logs mayores de 1 MB se comprimen; el recibo físico extenso se conserva como JSON gzip.

El recibo documental de cotejo se obtiene antes del empaquetado. Tras este se repite el cotejo completo y censo definitivo en .cache/revision-resultados-composicion-r49-sol/fisico-terminal.json.gz, sin cambiar después el payload del transporte. Los archivos de los dos prefijos autorizados son los únicos extras; .git se reconoce como administración preexistente. La escritura del propio recibo ocurre después de su censo, evitando autorreferencia.
