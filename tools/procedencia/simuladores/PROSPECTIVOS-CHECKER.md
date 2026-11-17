# Vínculo documental de las observaciones prospectivas

El comprobador concilia las cuatro capturas disponibles con sus hechos H,
predicciones P y fixtures. Asturias completa la selección prospectiva.
No ejecuta el motor, no modifica los originales ni
sus esperados y no incorpora casos o pesos al indicador original de 76/80.

La admisión exige correspondencia completa de los resultados finales al céntimo,
bajo los hechos externos declarados en H. La igualdad intermedia es 3/4:
el segundo caso madrileño conserva una diferencia exacta de 0.00004 EUR entre
el coste operativo y el coste persistido. No se aplica una tolerancia para
ocultar esa diferencia ni se identifica el algoritmo interno de AEAT.

## Evidencia y correspondencias

`prospectivos-censo.json` fija los bytes de H, P, fixtures, recibos, manifiesto,
regresión y parser. La igualdad de entradas comprende la extensión madrileña.
El inventario SES compara íntegramente los 1.309 registros de las cuatro capturas,
en orden, con sus instancias, padres, indentación, ámbitos, tipos, banderas
y valores. Usa `parseSES` sin reescribir ni evaluar sus fuentes.

`prospectivos-estructura.mjs` fija además un contrato nominal independiente del
censo de valores: instancias, claves, tipos, banderas, marcadores y reglas SES;
ocurrencias PDF, incluidos rol, página y ambas coordenadas. No se deriva de
datos modificables durante la ejecución. Reducir o sustituir campos y actualizar
coherentemente censo y sellos no reduce este contrato. Una modificación del
formato requiere revisión expresa de esas huellas estructurales; no basta
regenerarlas. Las comprobaciones monetarias contra H/P siguen siendo necesarias.

Cada registro tiene una regla: una correspondencia con H o P, un marcador
negativo explícito o un elemento de transporte. Los marcadores 254 y 255 no
son ceros fiscales y no se intercambian. Las plantillas regionales inactivas
no acreditan derechos. Los importes, fechas e identidades se concilian con
el perfil declarado; los alias salariales no se suman como varios pagadores.
Una regla de reserva bloquea la admisión de su observación.

El PDF se compara entero, en sus cinco páginas, con texto, coordenadas
horizontal y vertical y casillas. Las casillas monetarias y el documento
de ingreso se contrastan con H/P; ninguna fila monetaria queda aceptada sólo
por coincidir con el censo. El lector compartido conserva el comportamiento
por defecto de tres páginas y expone cinco páginas y posiciones únicamente
mediante opciones explícitas.

Los transportes SES reconstruyen zlib y las listas decimales con límites.
Se comparan todos los campos DG/TI, incluidos los vacíos, y la identidad DP.
La condición GH utiliza racionales BigInt: A incluye gastos,
C=A*b/(b+s) y Hmax=.03*A*31/366. Exige b<=C, h<=C<=A y las dos cotas
uniformes que cubren todo D entre cero y Hmax. Son condiciones externas
de los escenarios, no hechos acreditados por la salida de Open.
Madrid conserva gasto de 1000 EUR y deducción de 100 EUR; el coste
persistido se comprueba por separado.
Asturias conserva gasto de 1000 EUR y deducción de 500 EUR, con las referencias
nominales de inmueble, titular, contrato y tipología conciliadas. La exclusión
unifamiliar y la localización son condiciones externas, no una respuesta
autenticada de SERPAVI. El control municipal del productor sólo comprueba
prefijo y concordancia; esta observación fija explícitamente el municipio 33044.

## Ejecución

Desde la raíz del repositorio, con el entorno Nix de procedencia y las
dependencias del proyecto:

```text
timeout -k 5s 60s node --test tools/procedencia/simuladores/prospectivos-adversos.test.mjs tools/procedencia/simuladores/prospectivos-ses.test.mjs
timeout -k 5s 60s node tools/procedencia/simuladores/prospectivos-checker.mjs
```

La salida JSON separa disponibles, seleccionados, comparables e igualdad
intermedia. Código 0 significa vínculo documental completo de las disponibles;
2 indica reservas semánticas y 1 un rechazo documental. La salida incluye
huellas de la evidencia, contrato, fixtures, comprobador y dependencias locales.
El hash del resultado se conserva fuera del propio resultado para evitar ciclos.
El manifiesto histórico original mantiene `gatePublico: false`: el resultado
de este comprobador es una evidencia posterior y no reescribe ese recibo.

## Límites

P.at acredita una fecha registrada y su vínculo con H, no anterioridad
independiente. Los archivos públicos permiten comprobar el estado final;
no reproducen la secuencia UI ni acreditan una tentativa única. Se conservan
los reintentos de Andalucía y del primer caso madrileño y su enmienda previa.
Los recibos no son atestaciones independientes. La selección está completa,
no tiene ponderación y no certifica otros perfiles fiscales del motor.

El lector de cinco páginas y posiciones es específico de estas observaciones. El lector de las vinculaciones anteriores se conserva byte a byte: sus contratos acreditan su hash y no se resellan para admitir este cambio.
