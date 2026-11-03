# Unidades y correspondencias por lote

> Antecedente conservado. Los cinco defectos técnicos y el alcance vigente se
> documentan en la [corrección del 4 de noviembre](../correcciones-cinco/INFORME.md).
> Las cifras y dictámenes de este documento corresponden al candidato anterior.

Contrato candidato v2, seleccionado mediante los argumentos existentes `--obligations` y `--obligations-sha256`. El SHA256 esperado debe proceder de la selección externa del lote. Recalcularlo no convierte un registro en revisado. El esquema v1 y los bytes históricos de obligaciones, mapping y resultados del piloto se conservan. No cambia ninguna puerta fiscal.

El registro contiene obligaciones físicas enumeradas de forma independiente, correspondencias propuestas y pruebas reproducibles. El mapping sigue siendo otra entrada, y el censo se genera del código. No se construyen obligaciones a partir del mapping. Una celda sin prueba de unidad o sin correspondencia conserva `not-verifiable`; una igualdad con unidad solo produce `match` técnico. `review`, `legalAcceptance` y `acceptance` permanecen pendientes para lotes explícitos. La revisión independiente por lote corresponde a quien recibe el candidato.

## API

```sh
DATOS_RUNTIME_ROOT=INSTALACION_EXTERNA \
DATOS_MAPPING=lote-mapping.json \
DATOS_OBLIGATIONS=lote-obligaciones.json \
DATOS_OBLIGATIONS_SHA256=SHA256_SELECCIONADO_EXTERNAMENTE \
DATOS_BASE=SHA_COMPLETO_DECLARADO \
DATOS_CAS=CAS_EXTERNO DATOS_WORK=TEMPORAL_EXTERNO \
DATOS_OUTPUT=manifiesto.json tools/procedencia/datos/ejecutar.sh
```

La CLI Python permite además `--read-root` repetido. Para replay se usa el mismo entorno y `--verify manifiesto.json`, sin volver a aportar mapping o registro: ambos se recuperan del CAS por sus hashes. La igualdad exigida abarca código, originales, extracción, censo, dependencias y manifiesto. No necesita Git.

En v2 cada obligación añade `subject`, `conditions` y `engineExpression` (objeto o `null`). El mapping declara el mismo sujeto y condiciones, y su `expression` debe coincidir exactamente con `engineExpression`. Año, territorio, documento, página, fila, columna, unidad y caja siguen siendo obligatorios según el formato. Estas declaraciones describen el ámbito candidato; no acreditan por sí solas su aplicabilidad jurídica.

Cada entrada de `semantics` usa como clave JSON canónico compacto del binding, con claves ordenadas (`file`, `path`, `symbol`). Contiene `unit`, `sourceSha256`, `quote`, `position` y `targets`. `position` declara `start`, `end` y `offsetEncoding: "utf16"`. Cada target declara exactamente `code`, `year`, `territory`, `row`, `column`, `subject`, `conditions`. No se comparte una prueba entre campos o anualidades por igualdad numérica. Además se rechazan contradicciones con años, territorios y unidades técnicas conocidos del censo efectivo, generado separadamente. Las dimensiones que el censo no conoce siguen siendo declaraciones candidatas sujetas a revisión.

El resolver `binding-position.mjs` obtiene la propiedad desde el export y su camino estructural. Se admiten objetos y arrays literales sin spreads, getters, propiedades calculadas ni duplicados. Las aserciones de tipo y paréntesis no cambian la ruta. Un helper identidad con un parámetro puede desenvolverse si su AST demuestra que devuelve ese mismo parámetro; se fija también su posición y texto en `adapter`. Las filas publicadas tienen un adaptador explícito que exige el texto exacto del helper `filas` y traduce `baseInferior`, `cuota`, `tipo` a las tres posiciones de la tupla. Cualquier otro cálculo indirecto necesita una propuesta de adaptador con prueba discriminante: no se resuelve buscando el mismo número o una cita en cualquier sitio.

El comando siguiente obtiene posiciones, pero su salida no declara unidad, ámbito ni revisión:

```sh
timeout -k 30s 20m bun tools/procedencia/datos/binding-position.mjs \
  lib/dominio/normativa/datos/ipc-2012-2026.ts \
  IPC_ANUAL_DICIEMBRE '["2013"]'
```

Las únicas operaciones son `subtract` con dos EUR, `sum` de EUR y `percent` sobre una proporción. `percent` multiplica por 100. El IPC decimal es proporción; el índice INE es otra magnitud y no se enlaza automáticamente a la tasa anual. Las bases SS mensuales y anuales requieren condiciones distintas y una conversión propuesta explícitamente: no se introduce multiplicación implícita por doce. El test sintético observa 12 %, frente a `.003 × 100 = .300`, y exige diferencia.

## Cabeceras y literales

Una prueba PDF v2 declara `bbox`, `literal`, `unit` y `relation`. El documento y página son los de la obligación. Se reextraen las palabras totalmente contenidas, respetando caja y mayúsculas. `column` exige cabecera encima de la celda con solapamiento horizontal y sin abarcar el centro de otra columna de la misma fila. `adjacent` exige unidad a la derecha, solapamiento vertical y separación máxima de 24 puntos. La cabecera debe contener un token de unidad reconocido: euros/Euros/EUR/€, porcentaje/Porcentaje/%, proporción/fracción/por uno o índice/Índice/index/Index, respectivamente, con límites de palabra. No se inventa una unidad a partir de cualquier frase. No basta encontrar «euros» en la página. La asociación geométrica es comprobación técnica; las unidades propuestas necesitan revisión independiente.

El literal reproducible es la secuencia de palabras del PDF unida por espacios, no una transcripción de sus operadores de dibujo. Se conservan también cita y geometría. No se aplica case folding ni limpieza del interior de los números. Los signos ASCII emitidos como un token separado solo se recomponen si signo y número están totalmente dentro de la misma caja; se conservan el literal original y ambas coordenadas y se declara esa transformación en `normalization`. Los signos cercanos externos siguen causando rechazo según RP07.

Las propuestas reales de `EXTENSION.md` (2012–2018), `EXTENSION-PROPUESTA.md` (2019–2026) e IPC/SS se incorporan como declaraciones por celda, sin ampliar un vocabulario global. Una cabecera `(euros)`, `%` o una unidad en prosa necesita su propia caja y literal exactos. `unitEvidence: null` conserva la falta de prueba.

`literalVariant` permite `{"kind":"open","literal":"en adelante"}` en EUR; también puede declarar exactamente `En adelante` o `En adelante.`. Para porcentajes se admite `{"kind":"percent-suffix","literal":"9,50%"}`. Registro y mapping deben declarar la misma variante. No se aceptan `66. 593,00`, `53.407,20,00`, `29,50.` ni decimales anglosajones por limpieza universal. La corroboración normativa de `66.593,00` corresponde a una selección del original, no a reparar todas las cadenas con espacios.

## Historia y runtime

`retiradas.json` fija las cuatro tablas combinadas retiradas y la huella de su fuente histórica. La sucesión es selección territorial y cálculo por escala; no existe un binding numérico sucesor intercambiable. `retirements` permite conservar ese historial en un registro v2, con `successor: null` cuando no hay sustitución uno a uno. Una prueba retirada no puede reutilizarse con el mismo hash como evidencia viva. Una correspondencia nueva exige otra preimagen, posición y ámbito; no se actualiza el hash histórico como si fuera la misma prueba.

El piloto histórico conserva sus resultados originales, incluidas las igualdades anteriores a la prueba de unidades. Su replay de extracción y comparación usa su código exacto y el censo preservado; no se presenta como regeneración del runtime antiguo. La ejecución actual se entrega por separado con 277 obligaciones y pruebas v2, manteniendo sin correspondencia los campos históricamente sin unidad probada.

La huella de dependencias existente mide todos los archivos del paquete realmente resuelto: rutas relativas a su raíz y SHA256 de sus bytes, ordenados. No incluye la ruta absoluta de instalación. El lock y el código también se fijan. Los registros previos de 2019–2026 contienen diferencias reales en archivos de Effect 4.1.2, incluidos JavaScript y mapas, incluso tras reinstalar esa versión; no justifican excluir archivos ni sustituir la huella. La medición completa se conserva. Se corrige por separado la selección del paquete: `DATOS_RUNTIME_ROOT` fija una instalación externa que contiene `node_modules`. El resolver genera aliases explícitos para las tres dependencias, desactiva la instalación automática y propaga esas opciones también al Bun aislado que genera el inventario. La configuración temporal queda fuera de los artefactos: se miden los bytes de los paquetes realmente importados, con rutas relativas a cada paquete, sin incluir las rutas de instalación. El replay con los mismos bytes exige igualdad completa; el adverso modifica un hash de Effect y recalcula el objeto CAS, y debe seguir fallando.

## Pruebas

```sh
timeout -k 30s 20m uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 \
  python -m unittest discover -s tools/procedencia/datos/tests
```

Las fixtures pequeñas no dependen de originales privados, Git, cachés del padre ni red para obtener datos. Las dependencias deben estar instaladas en el entorno del ejecutor. Se conservan sin cambios los casos históricos RP01–RP09 y sus expectativas; los casos que describían defectos antiguos siguen siendo rojos. Los controles estrictos de correcciones, signos y geometría se ejecutan aparte. La entrega privada contiene los resultados reales y los intentos fallidos, sin convertirlos en pases.

El ejemplo ejecutable está en `tools/procedencia/datos/tests/test_unidades_enlaces.py`: crea un PDF pequeño, genera el registro y el mapping como entradas separadas, fija el SHA256 del registro, invoca la CLI real y vuelve a ejecutarla desde los objetos CAS. Su correspondencia de proporción a porcentaje tiene esta forma (las posiciones se obtienen del resolver y se fijan aparte):

```json
{
  "op": "percent",
  "args": [{
    "binding": {
      "file": "lib/dominio/normativa/datos/ipc-2012-2026.ts",
      "path": ["2013"],
      "symbol": "IPC_ANUAL_DICIEMBRE"
    }
  }]
}
```

Para incorporar un lote se enumeran primero sus obligaciones desde el original, se declaran las cabeceras por posición y literal, y después se proponen sus correspondencias con el censo. Cada binding necesita una prueba por propiedad y todos sus targets explícitos. Si faltan unidad, sujeto, condiciones o resolución de una expresión indirecta, se conserva la celda con prueba/correspondencia nula o se propone el adaptador separado; no se elimina esa obligación ni se sustituye por un campo de igual valor. El revisor recibe el registro, su pin externo, los originales por hash y ambos replays.

La propagación usa `BUN_OPTIONS`, documentado por [Bun](https://bun.sh/docs/runtime/environment-variables), para que el proceso aislado conserve los mismos aliases y `--no-install`. Una fixture instala paquetes sintéticos privados y exige que tanto el proceso principal como el aislado importen su marcador; cualquier resolución al paquete global falla. La caché de transpilación se desactiva durante el censo.
