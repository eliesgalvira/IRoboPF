# Inventario reproducible del código fiscal

Guía del inventario técnico. Los conteos de este documento corresponden al corte de la versión 2 del 29 de octubre de 2026; el manifiesto utilizado es la autoridad para los conteos de cada versión. El inventario requiere interpretación fiscal. No demuestra que todas las operaciones tengan evidencia ni que las deducciones estén calculadas correctamente.

## Contenido y reproducción

El manifiesto legible es `inventario.json`. El archivo `inventario-datos.json.gz` contiene una lista JSON de parejas `[nombreDeArchivo, contenidoUtf8]`: páginas de elementos, índices, grafo de bindings, catálogo de deducciones, cobertura y lagunas. Sus 341 archivos suman 68.209.019 bytes de JSON; el artefacto comprimido ocupa aproximadamente 8,21 MB. El manifiesto fija su hash y tamaño.

Los comandos se ejecutan desde el checkout de confianza, con dependencias instaladas:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun run inventario:generar
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun run inventario:verificar
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun run test:inventario
nix shell nixpkgs#bun nixpkgs#python3 nixpkgs#uv -c uv run --python python3 --no-python-downloads --with jsonschema==4.25.1 python scripts/procedencia/inventario-validar.py
```

`readArtifact`, en `scripts/procedencia/inventario-artefacto.mjs`, verifica el contenedor y devuelve un Map con los archivos. Leerlo acredita integridad del contenedor, no correspondencia con el motor: para esa comprobación hay que ejecutar `inventario:verificar`. No se debe utilizar una lectura aislada como puerta de aceptación fiscal.

La generación usa un directorio temporal exclusivo dentro de `.cache/procedencia/inventario-integracion/`. Exige que esté vacío, escribe el conjunto completo y elimina solo ese temporal. El archivo comprimido y el manifiesto se reemplazan desde temporales; el manifiesto se publica al final. Una interrupción entre ambos reemplazos deja una discrepancia detectable, no una transacción duradera ni recuperación automática. No se borran archivos de auditorías.

## Cobertura medida

| Medida | Cantidad |
| --- | ---: |
| Fuentes TypeScript de lib | 98 |
| Oracle Python, solo AST | 1 |
| Ocurrencias sintácticas | 19.967 |
| Hojas numéricas efectivas | 16.100 |
| Valores de sondeos del selector | 11.727 |
| Total técnico, con solapamientos | 47.794 |
| Unidades pendientes | 25.171 |
| Fichas de deducciones catalogadas | 351 |
| Sondeos territoriales | 288 |
| Elementos aceptados fiscalmente por el inventario | 0 |

Las tres capas se solapan. Incluyen índices, páginas, fechas y constantes técnicas; no son 47.794 parámetros tributarios distintos. Que un hallazgo externo se haya aceptado no actualiza automáticamente estos elementos: hace falta un enlace revisado al snapshot correspondiente.

El AST conserva literales, strings íntegramente numéricos, tablas, funciones, operadores, llamadas, construcciones, ramas y candidatos a redondeo. La clasificación usa estructura y nombres exactos de operación. No resuelve todos los aliases de funciones ni el shadowing; clasificar Math.floor como redondeo no lo convierte en regla monetaria.

Los módulos locales de datos se ejecutan para expandir variables exportadas directamente, helpers y aliases. El selector real se sondea para cada año 2012–2026 y 18 territorios técnicos, con 18 casos adicionales de fronteras gallegas y fechas intranuales. En 2026 solo devuelve parámetros para simulada-estatal. Esto no certifica vigencia, cobertura completa de fechas ni liquidaciones. Navarra y territorios vascos quedan registrados como no modelados; no se promete un rechazo runtime fuera del contrato tipado.

## Identidades y valores

Cada ID identifica una ocurrencia versionada, no un concepto fiscal permanente. Incluye hash de fuente, capa, archivo, símbolo y ruta serializada como segmentos JSON. Los valores efectivos y seleccionados incorporan también el valor a su identidad, para detectar cambios de una dependencia sin modificación del archivo contenedor. Una inserción que cambia el significado de una posición ya no reutiliza el ID anterior.

Los comentarios o cambios de archivo pueden renovar IDs. El futuro registro de conceptos estables deberá enlazar estas ocurrencias mediante migraciones explícitas y snapshot; ninguna página permanente debe interpretar estos IDs como identidad jurídica. Las localizaciones mantienen offsets UTF-16 para TypeScript y columnas UTF-8 para Python. La fuente de un valor heredado es el export contenedor; el grafo ayuda a localizar sus dependencias, sin fingir una localización exacta de cada hoja.

El recorrido de valores usa predicados de tipo y la identidad de Decimal de la biblioteca. Conserva BigInt y límites Infinity como texto. Expande cada ruta de un alias compartido; rechaza ciclos, tipos ajenos, símbolos y descriptores no soportados con su ruta. No usa nombres de constructores ni Object.prototype.toString para inferir tipos. Null y undefined son ausencias conocidas, no números.

Años, territorios y unidades se infieren por nombre y ruta. Esa inferencia está declarada en el manifiesto y permanece pendiente de interpretación. Una unidad inferida no basta para aceptar un binding documental. Las relaciones con normas, citas y hallazgos siguen vacías hasta promoción revisada.

## Verificación y correcciones adversariales

El verificador reconstruye los archivos desde las fuentes actuales en un temporal independiente y compara el conjunto exacto y todos sus bytes. Incluye valores, conteos, ubicaciones, índices, grafo, catálogo, cobertura y manifiesto. Los inputs registran hashes de fuentes, generadores, schema, package.json y bun.lock. Una alteración seguida de recalcular los hashes propios del artefacto no pasa. Una prueba completa fabrica precisamente ese artefacto: la lectura íntegra funciona y la comparación con las fuentes lo rechaza. También se comprueban archivos ausentes/sobrantes, relaciones rotas y aceptación de evidencia no autorizada.

El validador Python aplica JSON Schema y exige además esa reconstrucción. No usa asserts que desaparezcan con Python optimizado. La CI ejecuta reconstrucción y pruebas con Bun 1.3.13, Python 3.13 y dependencias congeladas. No certifica portabilidad por el mero número de versión: una diferencia de extracción entre entornos debe fallar y examinarse.

## Límites y costes

La reconstrucción contrasta el resultado con el generador y las fuentes; no demuestra que el propio generador encuentre toda la semántica. Por eso se mantienen pruebas con expectativas independientes y la contrarrevisión. No hay análisis dimensional ni de flujo interprocedimental completo. Python no se ejecuta. Los números en prosa libre no se convierten en parámetros, y texto fuera de contenedores o catálogo puede no persistir.

Los exports indirectos y funciones declaradas sin evaluación efectiva se enumeran como lagunas. El grafo estático no demuestra alcanzabilidad. El catálogo conserva 351 fichas, pero una referencia literal o el estado implementada no acredita condiciones, elegibilidad ni ejecución completa: se necesita el trabajo de los auditores de deducciones.

La ejecución de módulos locales confía en el checkout y sus dependencias; no es una sandbox ni admite rutas de código externo. Los sondeos no llaman al oracle generador de Excel ni a servicios remotos.

El índice se reduce a ID y página. El archivo comprimido permite respaldar el inventario completo sin incorporar cientos de páginas repetidas al árbol de documentación. Coste: inspección mediante lector/descompresión, diffs binarios y crecimiento del historial al regenerar. Es una solución de almacenamiento local; el almacenamiento documental definitivo y los conceptos editoriales requieren el ADR y el corpus. El manifiesto sigue siendo legible y el contenido es regenerable sin contratar un servicio.

## Corrección posterior a la segunda contrarrevisión

INV2-R01/R02/R03 motivan proceso Bun nuevo en cada llamada a generate, selección relativa a lib/procedencia y rechazo explícito de prototipos personalizados y NaN. Los objetos de otro contexto JavaScript no forman parte del contrato; fallan, no se omiten. Infinity permanece como centinela de límite abierto. Las regresiones cubren caché de imports sobre copia temporal y nombres de directorio con «procedencia». El proceso nuevo evita reutilización de módulos entre generaciones; no demuestra exhaustividad semántica. La revisión original y scripts exactos, conservados como texto con hashes, están en revisiones/inventario-v2. El manifiesto actual es la autoridad para conteos después de cambios del motor.
