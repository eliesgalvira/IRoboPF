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
  declaradas. Las filas de datos son las de `<tbody>` que la siguen; una
  anterior, o una posterior fuera de `<tbody>` (un `<tfoot>`), es
  `FilaNoDeclarada`, porque contarla desplazaría o añadiría tramos.
- Una escala ha de declarar las columnas de base y de resto, y sus tramos han
  de ser coherentes consigo mismos con aritmética exacta: la primera base es 0,
  cada base es mayor que la anterior e igual a la anterior más su resto, y el
  último tramo, y sólo él, es abierto. Si no, `EscalaIncoherente`, con las claves de
  las celdas que no encajan. La cuota no se comprueba contra los tipos: que la
  publicada no sea la integrada es lo que el cotejo cuenta.
- La columna de cada celda es la de su cabecera, según la alineación de la
  tabla HTML.
- En una escala, la fila es su índice entre las filas de datos, que es el número
  de tramo, y la clave lo guarda como entero: las salidas ordenan las claves por
  territorio, magnitud, fila (numérica en las escalas, por texto en el cuadro) y
  columna, de modo que el tramo 2 va antes que el 10.
- En un cuadro, la fila se identifica por el literal exacto de su cabecera de
  fila.
- Las tablas anidadas y cualquier elemento, atributo o clase de una fila o de
  una celda fuera de la lista cerrada de abajo son `EstructuraNoAdmitida`.

**Lista cerrada de lo que puede haber en una fila y en sus celdas.** Aplanar
cualquier descendiente leería texto que el navegador no muestra
(`<span hidden>1</span>9,50` se leería 19,50). La lista es la mínima que cubre
las 20 páginas de 2025, sacada de los originales: `tr` sin atributos; `th` con la
clase `texto_cen`; `td` con las clases `texto_cen`, `texto_der`, `letrita`,
`revsar` y `"texto_der` (así, con la comilla, en el ahorro estatal) y el
atributo vacío `letrita2`; `ul`; `li`, `p` y `span` con `letrita` (y `p` con
`sangrado-izq`); `strong`. Cualquier otro elemento (`b`, `sup`…), atributo
(`hidden`, `style`, `aria-hidden`, `colspan`…) o clase (`d-none`…) hace fallar
la tabla, aunque sea inocuo: decidir que lo es sería interpretar el CSS de la
página. Si una edición nueva trae otro, se añade a la lista tras mirarlo. Los
atributos de `<table>`, `<caption>` y de las secciones no se comprueban.

**Elementos de texto de una celda.**

- Cada `<p>` y cada `<li>` es un elemento.
- El texto suelto entre ellos forma un elemento propio.
- `span` y `strong` se funden con el texto que los rodea.
- Una celda de escala ha de tener un solo elemento. Si no tiene ninguno es
  `CeldaAusente`, y si tiene varios, `CeldaAmbigua`.

**Normalización canónica, y nada más.** Las entidades HTML las decodifica el
analizador. El espacio duro (U+00A0) pasa a espacio, cada corrida de espacios
HTML (espacio, tabulador, salto de línea, avance de página, retorno) pasa a un
espacio y se quita el espacio que quede en cada extremo. Ningún otro carácter
se borra, tampoco en los extremos: `trim()` quitaría U+202F y otros espacios
Unicode, y la regla no sería la misma dentro y fuera del texto. Un texto de
celda que, normalizado, contenga otro espacio Unicode o un carácter de control
o de formato (por ejemplo U+202F o U+200B) hace fallar la tabla con
`EstructuraNoAdmitida`, y un literal así en la especificación no se decodifica.
La especificación tiene que escribir sus literales ya normalizados.

**Gramática cerrada de literales.**

- Un número está en formato español estricto: `0` o grupos de tres separados por
  `.`, y `,` antes de los decimales. La especificación declara cuántos decimales
  admite cada columna (por ejemplo `[2]`, o `[0, 2]` donde el manual mezcla
  `6.000` y `6.000,00`).
- El sufijo, si se declara (`%`), es obligatorio y va pegado al número. Si no se
  declara, está prohibido.
- Los centinelas son literales exactos declarados.
- Un literal fuera de la gramática es `LiteralFueraDeGramatica`; no se limpia.

**Unidad con evidencia tipada.** Cada columna (o partida) declara su unidad
junto con el literal que la prueba, y el vocabulario cierra qué literales
prueban cada unidad: `(euros)` y `euros` para EUR; `(%)`, `porcentaje` y
`Porcentaje` para el porcentaje, que son los que traen las tablas de 2025. Una
evidencia que no sea de su unidad (porcentaje con `(euros)`) no se puede
escribir. El literal tiene que estar entero en la cabecera (o en el texto fijo
de la plantilla, a un lado del hueco), sin una letra ni una cifra pegada. Como
la cabecera y la plantilla sólo encajan si el HTML las trae literalmente, la
comprobación se hace al decodificar la especificación.

**Cuadro de partidas.**

- Cada celda de la tabla está declarada, y una celda es la lista ordenada y
  completa de sus bloques: partidas, remisiones y notas. El contenido de la
  celda en el HTML ha de ser exactamente esa secuencia, elemento a elemento y en
  ese orden; cada elemento se compara con el bloque de su misma posición. Si
  sobra, falta o cambia de sitio alguno, la celda entera es `CeldaNoCoincide`,
  con las dos secuencias y las claves de sus partidas, y no da ningún valor:
  con las posiciones descuadradas, quedarse con una parte sería elegir. Como
  no hay búsqueda entre plantillas, dos plantillas solapadas («+ {importe} euros
  anuales.» y «{importe} euros anuales.») no se confunden.
- Una partida es una plantilla con un único hueco `{importe}`. Encaja con su
  elemento si este empieza por el texto anterior al hueco y acaba por el
  posterior, y el hueco se lee con la gramática.
- Una partida puede dar varias claves, todas declaradas; por ejemplo, la
  discapacidad del contribuyente, de los descendientes y de los ascendientes.
- Cada partida declara de dónde sale su alcance (a qué beneficiario y
  condición se refieren sus claves): de la cabecera de su columna («Mínimo por
  discapacidad del contribuyente, descendientes y ascendientes» para las tres
  claves de discapacidad) o de una nota anterior de la misma celda, que tiene un
  identificador y a la que apunta («Solo para el caso del mínimo por
  descendientes:» en La Rioja). El esquema rechaza una referencia a una nota
  que no existe o que va después, y la extracción, al exigir la secuencia,
  comprueba que la frase existe, es literal y precede al importe. Cada valor
  guarda en `alcance` ese literal y, si es una nota, su ubicación.
- Límite: el programa no comprueba que la frase diga lo que el autor entiende
  al poner las claves. Que «Solo para el caso del mínimo por descendientes:»
  limite los dos importes siguientes a `discapacidad-descendientes` es una
  lectura del autor, ahora atada a un literal concreto que se puede revisar.
- Una partida puede no dar ninguna (`claves: []`) cuando el manual da un
  importe que no es una magnitud del motor, como «(\*) En caso de fallecimiento
  del descendiente 2.400 euros.». El importe se extrae y lleva testigo como
  cualquier otro, pero no hay clave que cotejar: no es una excepción ni un
  «sin homólogo». Se cuenta en `sinClaveDeMotor` y `resumen.json` lo lista con
  su procedencia. Inventar una clave para él en el vocabulario del motor
  supondría afirmar que el motor tiene esa magnitud. Una remisión copia también
  estos valores: llegan como referidos, sin clave y sin testigo directo, y se
  siguen contando en `sinClaveDeMotor`.
- La única remisión es `RemisionAMinimosEstatales`, con su literal exacto
  («igual que los mínimos estatales.») y sin campo de fila: su destino es, por
  construcción, la celda de la misma columna en la fila del territorio
  `estatal`. Un nombre de fila libre podría apuntar a Andalucía y copiar sus
  5.790 € como si fueran los estatales. La remisión ha de ser todo el
  contenido de su celda, fuera de la fila estatal, y la celda estatal de su
  columna ha de tener partidas.
- Se resuelve sólo si la celda estatal se leyó entera: sin excepciones y con
  todas sus partidas declaradas extraídas. Entonces copia todos sus valores con
  el territorio de la fila que remite, marcados como `Remision`. Si no, la
  remitente recibe `RemisionNoResuelta`, con las excepciones de la celda de
  origen y las claves que habría dado, y no copia nada: copiar el subconjunto
  que quede haría pasar una remisión incompleta por resuelta.
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
- `TRAMOS_IRPF_AHORRO_2025` es una sola escala conjunta (estatal más
  autonómica) que se aplica igual en todos los territorios. Se proyecta como
  `escala-ahorro-agregada` del territorio `estatal`.
- `simulada-estatal` no es un territorio fiscal y se excluye. La liquidación lo
  trata como caso técnico con la escala conjunta `TRAMOS_IRPF_DESDE_2021`, y el
  resumen lo lista como excluido.
- Antes de proyectar, cada escala del motor se valida: tipos finitos, límites
  finitos y estrictamente crecientes desde 0 salvo el último, que es el único
  abierto y ha de ser `+Infinity`. Los mínimos han de ser finitos. Un fallo es
  `DatoDelMotorInvalido` y aborta el cotejo: convertir cualquier decimal no
  finito (también `NaN`) en `sin-limite` escondería el error. El tramo abierto
  se representa aparte de los cerrados, así que `sin-limite` sólo sale del
  último.

**Almacenado y derivado.** Es «almacenado» lo que el motor guarda tal cual:

- los tipos (convertidos de fracción a porcentaje multiplicando por 100, de
  forma exacta);
- los mínimos;
- la base de inicio de los tramos 2 y siguientes, que es el límite superior
  guardado del tramo anterior.

Es «derivado» lo que se sigue de esos datos por aritmética exacta:

- la base 0 del primer tramo;
- el resto de base (límite superior menos inicio, o `sin-limite` en el tramo
  abierto);
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

- coincidente: exactamente un valor del manual, igual al del motor, y ninguna
  excepción de extracción que nombre la clave (una celda ambigua y otra buena
  para la misma clave no dan una coincidencia);
- distinta (`ValorDistinto`, con el origen del valor del motor);
- unidad distinta;
- ambigua (`ClaveDuplicada` o `CeldaAmbigua`);
- ausente en el manual;
- sin homólogo en el motor;
- excepción de extracción;
- fuera de alcance.

Una clave identifica un solo valor del motor: si la proyección repite una, el
cotejo falla con `ClaveRepetidaEnMotor` en vez de quedarse con la última. La
clave está discriminada por magnitud: en una escala, índice de tramo y columna
de la escala; en el cuadro, una fila de mínimo con una de sus columnas. Una
clave mal formada no se puede escribir ni decodificar.

El alcance de una tabla son sus `territorios` × su `magnitud`. Una clave del
motor que ninguna especificación cubre es «fuera de alcance». No cuenta como
ausente, pero su valor sigue en `cotejo.json`.

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
