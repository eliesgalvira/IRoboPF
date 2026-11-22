# Procedencia documental de las tablas de 2025

Extrae escalas de gravamen y mínimos personales y familiares de la edición HTML
del Manual práctico de Renta 2025 de la AEAT, usa el PDF del mismo manual como
segundo testigo y coteja cada valor, por clave, con los datos del motor.

## Decisiones

**El HTML es la fuente y el PDF, testigo celda a celda.** El HTML trae
`<table>` con filas y columnas reales; leerlo con un analizador (`parse5`) no
exige adivinar nada. El PDF de 2025 está etiquetado: su árbol de estructura
trae cada tabla como `Table` con `TR` y `TH`/`TD`. De él no se extrae ningún
valor; se comprueba que la celda del PDF de la misma tabla, fila y columna dice
lo mismo que la del HTML. Ni coordenadas ni texto suelto de la página.

**Todo lo que decide la extracción está en la especificación.** Cada tabla es
un JSON en `procedencia/especificaciones/2025/` que se decodifica con `Schema`.
El programa no tiene casos por territorio ni por tabla. Una clave que el esquema
no declara es un error al decodificar, no se ignora.

**Documentos por contenido.** Los originales no entran en git. Viven en un
almacén `sha256/<hash>` cuya ruta se pasa con `--almacen` o
`PROCEDENCIA_ALMACEN`. `procedencia/fuentes/manifiesto.json` registra hash, URL,
bytes, tipo y fecha de obtención. Al leer, se recalcula el SHA-256, y un
documento que no figura en el manifiesto no se usa.

**Dos etapas y una puerta.** `extraer` lee los originales y sella
`procedencia/resultados/2025/extraccion/<tabla>.json`. `cotejar` sólo lee lo
sellado y el motor, y escribe `cotejo.json`, `excepciones.json` y
`resumen.json`. Lo sellado se decodifica con `Schema` estricto: un campo de más
o un testigo sin su celda no se leen. Cada extracción sellada guarda el SHA-256
de su especificación y `cotejar` rechaza la que no coincide, así que cambiar
una especificación sin volver a extraer la hace fallar.

Repetir los mismos bytes no basta como puerta: con el cotejo regenerado y
guardado, un tipo cambiado en el motor pasaría como una «distinta» más. Por eso
la CI tiene tres capas:

- Lo sellado no puede representar un testigo vacío (ver «Testigo PDF»).
- `procedencia/excepciones-aceptadas/2025.json` lista cada diferencia aceptada,
  con su motivo. `cotejar` y `comprobar` fallan con `DiferenciasNoAceptadas` si
  una clave no coincidente, una excepción de extracción, una composición no
  resuelta o un valor sin testigo no está en la lista con exactamente ese estado
  y esos valores, o si la lista acepta algo que ya no ocurre así. Aceptar una
  diferencia nueva exige editar ese fichero a la vista.
- Un paso reextrae desde las fuentes: `obtener-fuentes` descarga cada documento
  del manifiesto por su URL a un almacén temporal, sin registrar nada, y falla
  con `DescargaFallida` si no responde o con `FuenteCambiada`, que nombra el
  documento, si su tamaño o su SHA-256 no son los registrados. Después,
  `comprobar --almacen` reextrae y exige que todo lo regenerado sea idéntico
  byte a byte a lo sellado.

`comprobar` sin almacén hace las dos primeras capas sin red. La lista nombra
cada clave aceptada con su estado y los valores de los dos lados, agrupadas por
motivo, una por línea. Aceptar por ámbito (una magnitud, un territorio y un
número de claves) no fija los valores: el motor podría cambiar un mínimo de un
territorio sin fila en el cuadro y la clave seguiría «ausente en el manual».
Por lo mismo, aceptar una excepción de extracción no acepta sus claves, que van
en la lista con sus valores. Los motivos son los que constan; donde falta la
cita normativa, se dice.

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

- La especificación declara las páginas (consecutivas), los literales de la
  fila de cabecera tal como los trae el PDF, aparte de los del HTML porque
  pueden diferir («Base liquidable hasta euros» en la escala estatal), y, sólo
  si en esas páginas hay más de una tabla con esa cabecera, el encabezado
  (`H`, `H1`…`H6`) que la precede en el orden del documento. Si no hay ninguna
  tabla así o hay más de una, es `TablaPdfNoLocalizada` con el número
  encontrado, nunca «la primera». El encabezado anterior puede estar al final
  de la página previa, que entonces se declara (Aragón, 1121–1122).
- pdf.js da el árbol página a página: de una tabla que toca la página trae el
  esqueleto entero (todas sus filas y celdas), con el contenido de esa página.
  Una tabla partida se resuelve por estructura: en cada página declarada
  posterior a la de su cabecera, su continuación es la única tabla cuya fila de
  cabecera no tiene contenido (la cabecera repetida es un artefacto, fuera del
  árbol) y ha de tener el mismo esqueleto; si no, `ContinuacionNoLocalizada` o
  `ContinuacionIrregular`. El texto de cada celda es la unión, por orden de
  página, de su contenido en cada trozo.
- Las filas de datos son las posteriores a la cabecera que están en `TBody` o
  directamente en la tabla (el cuadro de mínimos no tiene secciones).
- Normalización del PDF, aparte de la del HTML: los contenidos marcados de una
  celda se unen por salto de línea, cada fin de línea de pdf.js es un salto, y
  cada corrida de espacios y saltos pasa a un espacio sin los de los extremos.
  La etiqueta de un elemento de lista (`Lbl`, la viñeta «•») no es texto de la
  celda: el HTML no la trae, la pinta su hoja de estilo. El texto de un
  contenido marcado sin identificador (un artefacto) no es de ninguna celda.
- En una escala, la fila de datos i es el tramo i y ha de haber tantas como en
  el HTML (`FilasDistintas`). La celda tiene «mismo literal» si su texto es el
  de la celda del HTML, o «mismo valor, otro literal» si la gramática de la
  columna lo lee al mismo valor; se cuentan aparte. Si no,
  `LiteralPdfFueraDeGramatica` o `ValorPdfDistinto`.
- En el cuadro, la fila es la de cabecera de fila con el literal del HTML y el
  testigo es la casilla entera: su texto ha de ser el texto completo de la
  casilla del HTML (sus bloques unidos por un espacio). Comparar bloque a bloque
  no es exacto, porque cuando una frase cruza de página el árbol de pdf.js no
  dice si los dos trozos son el mismo párrafo; el texto completo sí lo es, y
  fija cada importe en su sitio. Si difiere, `TextoDistinto` y ningún importe
  de la casilla tiene testigo.
- El testigo sellado es la celda: página y orden de su tabla en el árbol, fila
  y columna, y las páginas con contenido. «Con testigo» sin celda no se puede
  escribir ni leer. Una página sin árbol de estructura es
  `PaginaSinEstructura`: no hay vía de reserva por texto de la página.
- `tablas` ayuda al autor de especificaciones: lista las tablas del árbol de
  unas páginas, con su encabezado anterior y el texto de sus celdas.

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

**La escala agregada del ahorro, como composición declarada.** El motor guarda
una sola escala del ahorro (estatal más autonómica); el manual publica las dos
mitades. `procedencia/composiciones/2025.json` declara que
`escala-ahorro-agregada` se coteja con la suma, tramo a tramo, de
`escala-ahorro-estatal` y `escala-ahorro-autonomica`. Antes de sumar se exige
que las dos se hayan extraído sin excepciones y tengan los mismos tramos, todas
sus celdas y las mismas bases y restos; cuotas y tipos se suman en decimal exacto. El resultado entra en el
cotejo como `DerivadoDelManual`, con las dos celdas de origen y su testigo, y se
cuenta en `derivadasDelManual`. Si las mitades no encadenan igual, es
`ComposicionNoResuelta` y no se suma nada. Las claves de las mitades siguen
«sin homólogo en el motor», porque el motor no las guarda.

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

- **Ahorro.** Que la escala agregada sea la suma de las mitades sólo comprueba
  la tarifa. No comprueba que la liquidación aplique cada mitad a su propio
  remanente del mínimo personal y familiar: con remanentes distintos, una sola
  tarifa agregada no da las mismas cuotas. Eso es de la liquidación, no de este
  cotejo.
- **Territorios sin fila en el cuadro de mínimos.** Siete territorios del motor
  no tienen fila en el cuadro comparativo. Si el cuadro los incluye en su
  alcance, sus claves saldrán «ausente en el manual». Que en ellos rijan los
  mínimos estatales lo dice la ley, no el cuadro; la cita está pendiente y la
  lista de aceptadas lo dice así.
- **Baleares, contribuyente mayor de 65 años.** El cuadro da «6.105 euros
  anuales si tiene más de 65 años» y «+ 1.265 euros anuales, mayor de 65 años»,
  que se extraen como valores sin clave de motor. El motor guarda un adicional
  de 1.820, que no aparece literal en el cuadro, así que esa clave sale
  «ausente en el manual». Cómo se relacionan es una cuestión fiscal, no de
  extracción, y no se deriva.
