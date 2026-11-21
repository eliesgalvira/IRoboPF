# Procedencia documental de las tablas de 2025

Extrae escalas de gravamen y mínimos personales y familiares de la edición HTML
del Manual práctico de Renta 2025 de la AEAT, usa el PDF del mismo manual como
segundo testigo y coteja cada valor, por clave, con los datos del motor.

## Decisiones

**El HTML es la fuente y el PDF sólo testigo.** El HTML trae `<table>` con
filas y columnas reales; leerlo con un analizador (`parse5`) no exige adivinar
nada. Del PDF no se lee ninguna tabla: sólo se comprueba que el literal ya
extraído aparece en las páginas declaradas. Reconstruir filas del PDF por
distancias exigiría umbrales.

**Todo lo que decide la extracción está en la especificación.** Cada tabla es
un JSON en `procedencia/especificaciones/2025/` que se decodifica con `Schema`.
El programa no tiene casos por territorio ni por tabla. Una clave que el esquema
no declara es un error al decodificar, no se ignora.

**Documentos por contenido.** Los originales no entran en git. Viven en un
almacén `sha256/<hash>` cuya ruta se pasa con `--almacen` o
`PROCEDENCIA_ALMACEN`. `procedencia/fuentes/manifiesto.json` registra hash, URL,
bytes, tipo y fecha de obtención. Al leer, se recalcula el SHA-256, y un
documento que no figura en el manifiesto no se usa.

**Dos etapas.** `extraer` lee los originales y sella
`procedencia/resultados/2025/extraccion/<tabla>.json`. `cotejar` sólo lee lo
sellado y el motor, y escribe `cotejo.json`, `excepciones.json` y
`resumen.json`. La CI no tiene originales, así que ejecuta `cotejar` y exige que
no cambie ningún byte. Si un valor del motor de 2025 cambia y su celda no, la
CI falla. Cada extracción sellada guarda el SHA-256 de su especificación y
`cotejar` rechaza la que no coincide, así que cambiar una especificación sin
volver a extraer también la hace fallar.

**Localizar sin adivinar.**

- La tabla se localiza con `UnicaTablaDelDocumento` o por el literal exacto de
  su `<caption>`. Si hay cero o más de una, es un error.
- La fila de cabecera es la única cuyas celdas son exactamente las cabeceras
  declaradas. Las demás filas de la tabla son de datos.
- La columna de cada celda es la de su cabecera, según la alineación de la
  tabla HTML.
- En una escala, la fila es su índice entre las filas de datos, que es el número
  de tramo, y la clave lo guarda como entero: las salidas ordenan las claves por
  territorio, magnitud, fila (numérica en las escalas, por texto en el cuadro) y
  columna, de modo que el tramo 2 va antes que el 10.
- En un cuadro, la fila se identifica por el literal exacto de su cabecera de
  fila.
- Las celdas combinadas (`colspan`/`rowspan`), las tablas anidadas y cualquier
  elemento fuera de la lista de abajo son `EstructuraNoAdmitida`.

**Elementos de texto de una celda.**

- Cada `<p>` y cada `<li>` es un elemento.
- El texto suelto entre ellos forma un elemento propio.
- Los elementos de formato (`a`, `abbr`, `b`, `em`, `i`, `span`, `strong`,
  `sub`, `sup`, `u`) se funden con el texto que los rodea.
- Una celda de escala ha de tener un solo elemento. Si no tiene ninguno es
  `CeldaAusente`, y si tiene varios, `CeldaAmbigua`.

**Normalización canónica, y nada más.** Las entidades HTML las decodifica el
analizador. El espacio duro (U+00A0) pasa a espacio, los espacios HTML se
colapsan y el texto se recorta. Otros espacios Unicode no se tocan, así que un
literal que los contenga no casa. La especificación tiene que escribir sus
literales ya normalizados; si no, falla al decodificarse.

**Gramática cerrada de literales.**

- Un número está en formato español estricto: `0` o grupos de tres separados por
  `.`, y `,` antes de los decimales. La especificación declara cuántos decimales
  admite cada columna (por ejemplo `[2]`, o `[0, 2]` donde el manual mezcla
  `6.000` y `6.000,00`).
- El sufijo, si se declara (`%`), es obligatorio y va pegado al número. Si no se
  declara, está prohibido.
- Los centinelas son literales exactos declarados. Hoy sólo existe `En adelante`
  → `sin-limite`.
- Un literal fuera de la gramática es `LiteralFueraDeGramatica`; no se limpia.

**Unidad con evidencia.** Cada columna (o partida) declara su unidad y el
literal que la prueba en la cabecera (o en la plantilla). Si ese literal no
está, es `UnidadNoDeclarada` y la columna no se extrae.

**Cuadro de partidas.**

- Cada celda declarada enumera sus partidas, sus remisiones y sus notas.
- Una partida es una plantilla con un único hueco `{importe}`. Encaja con un
  elemento si este empieza por el texto anterior al hueco y acaba por el
  posterior, y el hueco se lee con la gramática.
- Si una partida encaja con cero elementos es `CeldaAusente`; con más de uno,
  `CeldaAmbigua`. Un elemento que no encaja con ninguna declaración es
  `ContenidoNoDeclarado`, y uno que encaja con dos, `CeldaAmbigua`.
- Una partida puede dar varias claves, todas declaradas; por ejemplo, la
  discapacidad del contribuyente, de los descendientes y de los ascendientes.
- Una partida puede no dar ninguna (`claves: []`) cuando el manual da un
  importe que no es una magnitud del motor, como «(*) En caso de fallecimiento
  del descendiente 2.400 euros.». El importe se extrae y lleva testigo como
  cualquier otro, pero no hay clave que cotejar: no es una excepción ni un
  «sin homólogo». Se cuenta en `sinClaveDeMotor` y `resumen.json` lo lista con
  su procedencia. Inventar una clave para él en el vocabulario del motor
  supondría afirmar que el motor tiene esa magnitud. Una remisión copia también
  estos valores, igual que los demás valores directos de la celda remitida.
- Una remisión es un literal exacto («igual que los mínimos estatales.») y la
  fila a la que remite, dentro de la misma columna. Se resuelve copiando los
  valores directos de la celda remitida con el territorio de la fila que remite.
  Esos valores quedan marcados como `Remision` y no admiten cadenas de
  remisiones.
- Las notas se registran con su procedencia y no tienen clave.

**Testigo PDF.**

- Para un literal numérico (sin el sufijo), el testigo es una aparición del
  literal como token numérico completo, es decir, maximal (`9,50` no aparece
  dentro de `19,50%`), en algún elemento de texto de las páginas declaradas.
- Para un centinela, es un elemento de texto entero igual al literal.
- Una aparición es (documento, página, elemento, ocurrencia dentro del
  elemento), y atestigua como mucho una celda en toda la ejecución, no sólo
  dentro de su tabla: varias páginas del PDF contienen dos tablas (la 1128,
  Madrid y Murcia; la 1131, Ceuta y Melilla y las dos del ahorro), y contar
  por tabla dejaría que un mismo «0» sirviera a las dos.
- Cada celda sólo puede usar apariciones de su literal en las páginas que
  declara su tabla. Como las páginas de dos tablas pueden solaparse en parte,
  la pregunta es si existe un emparejamiento que dé a cada celda una aparición
  distinta. Se responde de forma exacta con el emparejamiento máximo (caminos
  aumentantes), cuyo tamaño no depende del orden de las tablas.
- El cálculo se hace por literal y por grupo de tablas que comparten alguna
  aparición de ese literal. Si el emparejamiento cubre todas las celdas del
  grupo, todas tienen testigo. Si no, ninguna, porque nada vincula una
  aparición con una celda y elegir cuáles se quedan sin él sería inventarlo.
  `SinTestigo` guarda las tablas del grupo, las celdas que piden el literal,
  las apariciones disponibles y cuántas celdas se cubren como máximo.
- Cada valor guarda las apariciones candidatas, todas las del literal en las
  páginas de su tabla, con página, elemento, ocurrencia y posición. No hay
  asignación de una aparición a una celda, porque el método no la conoce.
- `extraer` procesa siempre todas las especificaciones, porque el testigo de
  una tabla depende de las demás que declaran sus páginas. Extraer una sola
  dejaría selladas las otras con un testigo calculado sin ella.
- Límite que queda: el testigo prueba que el literal está en las páginas
  declaradas tantas veces como celdas lo piden, no que esté dentro de la
  tabla. Un «0» de la prosa de la misma página cuenta. Delimitar la tabla
  dentro de la página exigiría leer la geometría del PDF, que es justo lo que
  este método excluye.
- «Sin testigo» se cuenta aparte de «distinto». Las páginas las declara el
  autor; `buscar` sólo le ayuda a encontrarlas.

**Proyección del motor.** `lib/procedencia/motor-2025.ts` convierte los datos de
2025 en registros con clave (territorio, magnitud, fila, columna), valor exacto
y unidad.

- La cuota estatal de los territorios reales usa
  `TRAMOS_IRPF_ESTATAL_GENERAL_2025` (magnitud `escala-general-estatal`).
- Cada territorio usa su escala de `ESCALAS_AUTONOMICAS_IRPF_2025`.
- `TRAMOS_IRPF_AHORRO_2025` es una sola escala conjunta (estatal más
  autonómica) que se aplica igual en todos los territorios. Se proyecta como
  `escala-ahorro-agregada` del territorio `estatal`.
- Los mínimos salen de `MINIMOS_ESTATALES_2025` y de
  `MINIMOS_AUTONOMICOS_IRPF_2025`.
- `simulada-estatal` no es un territorio fiscal y se excluye. La liquidación lo
  trata como caso técnico con la escala conjunta `TRAMOS_IRPF_DESDE_2021`, y el
  resumen lo lista como excluido.

**Almacenado y derivado.** Es «almacenado» lo que el motor guarda tal cual:

- los tipos (convertidos de fracción a porcentaje multiplicando por 100, de
  forma exacta);
- los mínimos;
- la base de inicio de los tramos 2 y siguientes, que es el límite superior
  guardado del tramo anterior.

Es «derivado» lo que se sigue de esos datos por aritmética exacta:

- la base 0 del primer tramo;
- el resto de base (límite superior menos inicio, o `sin-limite` si el límite es
  infinito);
- la cuota íntegra al inicio de cada tramo, como suma exacta de anchura × tipo
  de los tramos anteriores.

El cotejo cuenta aparte las coincidencias y diferencias derivadas.

**Sin redondeo declarado; la comparación es siempre exacta.** El manual imprime
la cuota acumulada con dos decimales (Asturias: 1.751,36 frente a 1.751,364 que
se sigue de integrar los tipos del motor). El manual no dice con qué modo
redondea lo que imprime, así que declarar «medio hacia arriba» (o cualquier
otro) sería decisión del autor de la especificación y no de la fuente. Además,
la diferencia entre la cuota publicada y la integrada es justo un hecho que este
cotejo tiene que contar, no absorber. Por eso no hay redondeo ni tolerancia de
ningún tipo: esa celda sale `ValorDistinto` con los dos valores exactos y
`origenMotor: "derivado"`, y se cuenta aparte en `distintasDerivadas`.

**Cotejo por clave.** El cotejo recorre la unión de claves del manual, del motor
y de las excepciones. Cada clave termina en uno de estos estados:

- coincidente;
- distinta (`ValorDistinto`, con el origen del valor del motor);
- unidad distinta;
- ambigua (`ClaveDuplicada` o `CeldaAmbigua`);
- ausente en el manual;
- sin homólogo en el motor;
- excepción de extracción;
- fuera de alcance.

El alcance de una tabla son sus `territorios` × su `magnitud`. Una clave del
motor que ninguna especificación cubre es «fuera de alcance». No cuenta como
ausente, pero su valor sigue en `cotejo.json`.

## Cómo añadir una tabla

1. `bun scripts/procedencia.ts obtener --url <url> --tipo html --almacen <dir>`
   (y lo mismo con el PDF si aún no está). Imprime el SHA-256.
2. Para cada literal que interese, `bun scripts/procedencia.ts buscar --sha256 <pdf> --literal "<literal>" --almacen <dir>`
   lista las páginas donde aparece. Hay que declararlas todas las que cubre la
   tabla.
3. Crear `procedencia/especificaciones/2025/<tabla>.json`, con `tabla` igual al
   nombre del archivo. Escalas: véase
   `escala-general-autonomica-andalucia.json`. Cuadros: `tipo: "cuadro"`,
   `cabeceraDeFilas`, `columnas`, `filas` (literal → territorio) y `celdas` con
   `partidas`, `remisiones` y `notas` (esquema en
   `lib/procedencia/especificacion.ts`).
4. `bun scripts/procedencia.ts extraer --almacen <dir>`. La orden extrae todas
   las tablas, sella la extracción, regenera el cotejo y escribe en pantalla
   los contadores. Las excepciones quedan en
   `procedencia/resultados/2025/excepciones.json`.

## Dudas abiertas

- **Ahorro.** El manual publica una escala estatal y una autonómica del ahorro;
  el motor sólo guarda su suma. Mientras el motor no guarde las dos mitades, las
  claves del manual saldrán «sin homólogo en el motor» y la escala agregada,
  «fuera de alcance». Igualarlas sumando en el cotejo sería decidir algo que la
  fuente no dice.
- **Territorios sin fila en el cuadro de mínimos.** Siete territorios del motor
  no tienen fila en el cuadro comparativo. Si el cuadro los incluye en su
  alcance, sus claves saldrán «ausente en el manual». Que en ellos rijan los
  mínimos estatales lo dice la ley, no el cuadro.
- **Baleares, contribuyente mayor de 65 años.** El cuadro da «6.105 euros
  anuales si tiene más de 65 años» y «+ 1.265 euros anuales, mayor de 65 años»,
  que se extraen como valores sin clave de motor. El motor guarda un adicional
  de 1.820, que no aparece literal en el cuadro, así que esa clave sale
  «ausente en el manual». Cómo se relacionan es una cuestión fiscal, no de
  extracción, y no se deriva.
