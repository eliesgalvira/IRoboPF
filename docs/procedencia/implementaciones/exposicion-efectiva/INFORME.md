# Exposición efectiva y resolución documental

Implementación personal sobre `c61a306107f280c399eb57e57a7c45452bd68864`, sin subdelegar ni mutar VCS. Se conservan originales, registros, candidatos, decisiones, snapshots y artefacto compartido. No hay cambios de cifras, cálculos, dependencias, lockfiles, CI, atestaciones, subidas ni gasto. La revisión independiente nueva corresponde al padre después de integrar.

## Decisiones, objeciones y costes

Se exportan las trece tablas antes privadas de escalas-publicadas, junto con las dos que ya estaban exportadas. El extractor evalúa ese único módulo adicional con una lista explícita de quince exportaciones de datos: 76 filas, 228 hojas numéricas. Conserva símbolo, ruta de celda y hash de fuente; no busca coincidencias numéricas en otras tablas. Las funciones exportadas no se invocan. Los módulos confiables sí ejecutan sus inicializadores al importarse; esto no es un sandbox para código hostil. La nueva exposición no prueba selección anual ni vigencia: ambas siguen pendientes. Objeción experta: llamar «efectiva» a una tabla podría confundirse con su uso efectivo en una liquidación. Se mantiene la aplicabilidad «datos evaluados; selección por motor pendiente». Coste: nuevos IDs versionados y regeneración del inventario por el padre; no se migra ninguna aceptación.

El CAS recibe raíces absolutas explícitas por API o CLI (`--cas-root`, repetible), cada una con subdirectorio `sha256`. Sin opción sigue usando los fixtures autocontenidos. No hay descubrimiento global ni descarga implícita. Verifica SHA-256 y, para el original, SHA-512 y tamaño; rechaza symlinks en hoja y ancestros, archivos no ordinarios, ausencias y corrupción. Relee las dependencias al terminar Python y Node. Objeción experta: un CAS local no acredita preservación externa ni autenticidad. Coste: IO de hashes adicional; se presupone filesystem estable y operador cooperativo, sin resistencia a carreras hostiles/ABA. Los PNG también deben estar en una raíz CAS explícita: no se buscan por nombre en carpetas de evidencia.

La lectura de decisiones usa el schema `legal-decision-scope`: exactamente uno de `status` o `decision`, con estado reconocido y `engineLocations` no vacío. Dos campos, incluso coincidentes, son ambiguos y se rechazan. Se valida una proyección operativa cerrada; el resto de la prosa editorial se conserva en el documento referenciado y no concede permisos. Solo `accepted` supera la puerta existente; `needs-evidence` no cambia de estado. Se admiten localizadores objeto `path`/`symbol` y cadena `archivo#símbolo`. Los sufijos simples de propiedad/índice restringen la ruta de tabla; no se eliminan para aceptar todo el archivo. Formatos no reconocidos y campos `file` en vez de `path` quedan pendientes, sin conversión heurística. Línea y hash históricos son metadatos de la revisión, no prueba de que la fuente actual tenga esos mismos bytes; el payload comprueba por separado la identidad actual. Objeción experta: una revisión a nivel de archivo no acepta toda regla dentro del archivo. Esta puerta conserva su alcance técnico previo y sigue exigiendo revisión del binding exacto; ninguna salida acepta una regla completa. Coste: algunos candidatos continúan bloqueados hasta aclaración editorial independiente.

Se añade únicamente la grafía literal `Euros` al vocabulario de unidades. No se modifica ni normaliza el texto de la cita. Se conserva el signo ASCII dentro del token y se rechaza omitirlo; siguen los controles de signos Unicode, marcas y U+FFFD. Porcentaje/fracción permanece pendiente y `identity` sigue siendo la única conversión admitida. Objeción experta: dividir por cien sin fijar columna, unidad y precisión de origen permitiría enlaces plausibles pero falsos. Coste: los tipos documentales no se promocionan en esta entrega.

## Pruebas y reproducciones

Los logs `rojo-*` se obtuvieron antes de corregir cada defecto: cero hojas canónicas, `decision` rechazado, configuración CAS inexistente, contradicción tolerada y unidad `Euros` rechazada. No se corrigió cifra alguna ni se cambió el oracle.

La prueba fresca precarga mínimos y Murcia, cambia solo su copia scratch (5550→5551 y 8716.67→8716.68), exige el valor nuevo y reconstruye dos veces para comparar bytes. Comprueba la identidad de las 228 celdas de las quince tablas, añade un dato fuera de lista y una función que fallaría si se invocase. Se mantienen los ataques de flatten, exclusiones, IDs y artefacto adulterado con hashes recalculados. El baseline del ataque ahora se genera en scratch porque el artefacto publicado debe permanecer intacto; no se reescribe para conseguir verde.

Resultados registrados: 16 pruebas de inventario; 25 de corpus; 23 del puente. Lint global (16 reglas anti-slop a error y ESLint), typecheck de aplicación/vendor, Ruff y comprobación mypy con imports omitidos y cuerpos no anotados comprobados. Esta última no equivale a tipado estricto completo. Un fallo intermedio de regresión exigía el diagnóstico «Facsímil»: se conservó la expectativa y se restauró el diagnóstico en la implementación (`regresion-diagnostico.log`).

Comandos desde la raíz, siempre secuenciales bajo `flock /tmp/irobopf-validacion-pesada.lock`:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun run test:inventario
bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
bash tools/procedencia/run.sh tests/procedencia-corpus_test.py
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run lint
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run typecheck
nix shell nixpkgs#ruff -c ruff check tools/procedencia/{cas,enlaces,corpus}.py tests/procedencia-{enlaces,corpus}_test.py
nix shell nixpkgs#mypy -c mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs tools/procedencia/{cas,enlaces,corpus}.py
```

Effect: antes de editar se ejecutó el lanzador Nix disponible con `list` y `show basics` y se consultó Predicate.ts local. No se introducen flujos Effect nuevos. node_modules enlaza al repositorio principal solo para lectura. No se ejecutó Next build ni suites legacy pesadas.

## Integración y límites

El padre debe verificar base, manifiesto, hashes y ausencia de borrados, integrar selectivamente y regenerar el inventario **una sola vez** después de reunir sus cambios. Después podrá ejecutar el coordinador con raíces reales, por ejemplo `bun scripts/procedencia/verificar-enlaces.mjs --cas-root /ruta/corpus --cas-root /ruta/recortes-cas`, bajo el entorno y lock indicados. Las raíces son directorios que contienen `sha256`, no el directorio `sha256` mismo. Las raíces explícitas sustituyen la predeterminada: incluir fixtures expresamente si se desea usarlos también.

No se ejecuta aquí el coordinador completo contra el artefacto publicado porque quedó deliberadamente obsoleto respecto a las fuentes editadas. Las pruebas del puente verifican el original real de Madrid movido a CAS externo en scratch, conservando el fixture autocontenido; no equivalen a una ejecución de todos los candidatos nuevos. El padre debe fijar los payloads al inventario nuevo y obtener una revisión independiente nueva. No se amplía `engineLocations`, no se conectan candidatos ni se abren puertas de aceptación.

Integridad: comprobaciones de bytes, referencias y reextracción. Autenticidad: no nueva validación de emisor, firma histórica o CSV. Interpretación: revisiones previas con sus límites; ningún nuevo cierre jurídico. Exactitud: correspondencia decimal y extracción técnica comprobadas en los casos ensayados, sin alterar el cálculo. Aceptación: pendiente, `completeRuleAcceptance: false`; ningún resultado se autoacepta fiscalmente.

`manifiesto.json` enumera archivo, SHA-256, tamaño y baseSha256 (null para altas), además del control de presencia de todos los archivos base. `entrega.patch` contiene las diferencias textuales. Ambos excluyen su propia autorreferencia; `entrega-hashes.json` fija sus hashes. No se entregan binarios nuevos.
