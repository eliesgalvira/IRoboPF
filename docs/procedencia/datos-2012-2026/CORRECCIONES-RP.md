# Correcciones de la canalización: candidato para revisión

El bloque A permanece abierto. El manifiesto histórico y la revisión previa se conservan intactos. Este candidato cambia la admisión de coincidencias y requiere una nueva ejecución; no se atribuyen sus resultados al histórico.

| ID | Cambio y cobertura |
| --- | --- |
| RP01 | Una etiqueta coincidente no acredita unidad. El registro independiente fija cajas/literales de cabecera y unidades de campos por archivo/hash/cita. Las operaciones propagan EUR para suma/resta y convierten proporción a porcentaje. Se acreditan las dos escalas de 2014 y los metadatos INE. Los otros tres cuadros conservan `source-unit-unproven`; no basta la anterior lectura favorable de sus importes. |
| RP02 | `obligaciones.json` conserva las 277 posiciones revisadas de los originales: documento/hash, página, ámbito, fila, columna, caja y unidad. Su hash se fija en el código. El mapping y la extracción no crean ni eliminan obligaciones. Cambiar el registro exige actualizar explícitamente su hash y volver a revisar el cambio. |
| RP03 | `compare` exige obligaciones y acceso a originales, verifica documento/página y pruebas de unidad. Sigue siendo un comparador numérico: cada resultado lo declara. No autentica palabras, geometría ni rangos. La autenticación reproducible exige `run`/`--verify`, que reextrae todos los artefactos. |
| RP04 | Una caja sin palabras lanza error. Los trazos explícitos admitidos conservan `extraction-absent`, sin cero. |
| RP05 | La fila debe ser el índice decimal canónico. Los rangos se obtienen del árbol JSON con el mismo Pointer; se rechazan claves duplicadas y literales no numéricos. |
| RP06 | El cambio del valor efectivo sigue produciendo `difference` cuando la comparación acredita ambas unidades. |
| RP07 | La revisión reprodujo ocho signos externos ignorados por usar otra fuente o tener desplazamiento vertical. El arreglo candidato comprueba distancia horizontal y solapamiento de cajas, sin exigir igual coordenada superior. Rechaza la lectura ambigua; no adivina el signo. Requiere contraste independiente. |
| RP08 | El manifiesto v2 fija auxiliares Python, generadores JavaScript, locks, registro, versiones efectivas y hashes de módulos Python cargados. El censo añade hashes de los árboles efectivamente resueltos de Decimal, TypeScript y Effect. No publica rutas locales de dependencias. |
| RP09 | Sin binding significa sin correspondencia en los exports admitidos del inventario revisado. No demuestra ausencia en todos los exports o cálculos del motor. |

## API y reproducción

`compare(tables, cells, items, *, obligations, store, semantics, repo)` es una operación numérica con evidencia externa explícita. Sin obligaciones o originales falla. Sin prueba de unidad de fuente/campo/operación devuelve `not-verifiable` con motivo. Las semánticas son un registro revisado separado, nunca datos que aporte el mapping. Una igualdad aislada no prueba condiciones jurídicas ni uso por el motor.

`run(repo, cas, roots, work, mapping, base)` y CLI `--base SHA` reciben una base declarada, para funcionar también en una exportación sin Git. `base` no autentica el checkout: los hashes de código e inventario identifican el candidato. El wrapper exige además `DATOS_BASE`. CAS, temporales y manifiestos actuales se mantienen externos. `--verify` exige igualdad determinista del manifiesto completo, incluidos código y runtime; un entorno distinto requiere nueva ejecución. La ejecución histórica v1 no se reinterpreta con la API v2.

Pruebas ordinarias, desde un checkout limpio con Python y uv:

```sh
uv run --no-project --python python3 --with pymupdf==1.26.7 --with jsonschema==4.25.1 python tools/procedencia/datos/tests/test_flujo.py
uv run --no-project --python python3 --with pymupdf==1.26.7 --with jsonschema==4.25.1 python docs/procedencia/datos-2012-2026/revision-canalizacion/regresiones.py
```

Solo generan fixtures pequeños y temporales. No necesitan CAS privado, corpus real ni objetos Git antiguos. `casos.py` se conserva como documento del comportamiento anterior; sus expectativas de carencias ya no son criterios de éxito del código corregido. El piloto real es una ejecución local separada, con raíces CAS explícitas y posterior `--verify`.

Para ampliar tablas: registrar antes sus obligaciones físicas y cabeceras, acreditar las unidades de campos/operaciones con fuente versionada y añadir discriminantes sintéticos. No se admite actualizar el registro desde la salida del extractor. No se amplían aquí las tablas ni se acepta A.

La ejecución candidata sobre la base declarada extrae 277 celdas: 50 `match`, 226 `not-verifiable` y una `extraction-absent`, sin diferencias numéricas admitidas. Las 37 igualdades anteriores restantes quedan sin verificación de unidad. El manifiesto y su reconstrucción exacta se entregan externamente por hash. Pasan las 18 pruebas sintéticas y los dos rojos estrictos corregidos, Ruff y MyPy. La comprobación JavaScript conserva cinco TS2339 ajenos en `inventario-ast.mjs`; no se cambia ese archivo ni se excluyen sus errores. La integración global y la revisión independiente corresponden al padre.


## Continuación comprobada

Se preservan las 277 obligaciones y sus posiciones de la revisión independiente, sin regenerarlas desde el extractor. Se han reabierto los originales por hash para verificar las ocho cabeceras de las escalas de 2014, los metadatos INE y las 39 pruebas de campo. La interfaz `FilaEscalaPublicada` declara euros y tipos en fracción; `filas` asigna la tupla a `baseInferior`, `cuota` y `tipo`. Suma y resta conservan euros solo con operandos compatibles; `percent` convierte únicamente una proporción acreditada. Los otros cuadros no reciben pruebas de unidad nuevas por coincidencia aritmética.

Los dos rojos estrictos se reprodujeron sobre la base en una exportación sin Git antes de aplicar el candidato. Las pruebas ordinarias y los controles estrictos se ejecutan también allí con los bytes candidatos. Se añaden discriminantes para unidades de operaciones y selectores JSON con valores repetidos. Los logs, manifiesto actual, originales y reconstrucción se conservan en la entrega privada; no se incorporan originales al repositorio. El candidato sigue pendiente de recepción y revisión independiente de sus bytes finales.

La pasada completa de `bash scripts/ci-comprobaciones.sh` ha terminado con salida 0 en la exportación sin Git. El piloto actual conserva 277 celdas y su manifiesto v2 se reconstruye exactamente allí, incluidos los 404 artefactos referenciados. Esto no elimina los cinco errores del control checkJs adicional ni acepta globalmente el bloque A.

## Signos externos y geometría

La [revisión independiente](revision-correcciones/INFORME.md) sostiene las correcciones anteriores dentro del piloto, salvo RP07. Sus ocho contraejemplos se reprodujeron antes del arreglo y pasan después. El criterio candidato considera ambiguo un signo externo a menos de 12 puntos horizontales cuando sus cajas comparten al menos la mitad de la altura de la menor. Es una precaución de extracción para estas tablas, no una convención contable ni una garantía para cualquier maquetación. Las cajas deben incluir el signo cuando forma parte del valor; una ambigüedad requiere revisar el original.

Los controles incluyen distintas fuentes y posiciones verticales, signos interiores, otras filas y columnas alejadas. Pasan 21 pruebas sintéticas y las dos regresiones independientes con ocho subcasos. Se conserva el informe del defecto sin modificar sus expectativas. No se cambian obligaciones, unidades, normas ni cálculos del motor. El arreglo queda pendiente de revisión independiente antes de ampliar el piloto.
