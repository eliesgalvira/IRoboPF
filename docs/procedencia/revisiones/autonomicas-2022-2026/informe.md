# Contrarrevisión independiente: autonómicas 2022–2026

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Revisión de 29/10/2026, sobre el código actual del checkout compartido. **75/75 IDs y 481/481 filas revisados; cinco decisiones `accepted` de alcance delimitado y 70 `needs-evidence`. Ninguna escala completa queda certificada.** No hay candidatos rechazados íntegramente; sí se descartan extensiones injustificadas de sus conclusiones. `revisiones.json` conserva estado anterior, decisión, razón, alcance, evidencias, objeciones y siguiente acción por ID. `cobertura.json` enumera los 75 y los índices de las 481 filas, sin omisiones.

Las modificaciones previas de Madrid **2020** y de la etiqueta del ejercicio no corrigen Madrid **2022** ni las cuotas fijas examinadas en esta versión. Los hashes están en `integridad.json`; una diferencia histórica por lint no se interpreta por sí sola como corrupción.

## P1: Murcia 2022, aceptado para el supuesto ordinario y la función de cuota

ID `AUT22-26-2022-murcia-general`. El motor conserva solo límite y tipo en `lib/dominio/normativa/datos/irpf-autonomico-2022.ts:207`; `lib/dominio/irpf/cuotas/escalas-gravamen.ts:48` suma las integrales parciales. El original **BORM 226 de 29/09/2022, anuncio 4846, PDF físico p. 4** establece expresamente el régimen para base **superior** a 60.000 euros. Se inspeccionó visualmente la página: no hay tachado de ese párrafo.

Cadena y contraprueba examinadas personalmente:

- Ley 14/2018, art. 56.9: calendario de escalas; original BOE-A-2019-2039, p. 48, con la cuota alta anterior de 8.716,67. Es antecedente, no la escala deflactada.
- DL 4/2022, artículo único: sustituye DA5.4 para el período 2022, deflacta los tramos inferiores y conserva expresamente aquella cuota alta en el párrafo final; entrada en vigor el mismo día de publicación.
- Historial BOE del DL 1/2010, bloque DA5: solo identifica para ese apartado la reforma de 29/09/2022 y el antecedente de 2018. Se usa como índice de reformas, no como sustituto de la norma original.
- Ley 12/2022, art. 56, original pp. 43–44: revisados todos sus apartados; no sustituye DA5.4. El cambio de escala ordinaria desde 2023 no rectifica por sí solo el régimen especial 2022.
- Cuadro oficial de medidas CARM, original descargado, p. física 195: distingue la tabla anterior y su sustitución por DL4/2022, y reproduce la cuota fija del párrafo. Inspección visual realizada: resaltado de la tabla antigua, texto de sustitución y tabla nueva en rojo; los tachados de otras columnas no anulan el párrafo IRPF. Es contraprueba informativa oficial, no norma nueva. El nombre mutable del archivo no se usa para fechar su publicación.
- Búsquedas de corrección de errores por título, número y cifra en BORM/BOE/CARM sin rectificación localizada. Esto no demuestra inexistencia universal de una corrección; se ha contrastado además la cadena y el criterio oficial, en lugar de limitarse a una búsqueda negativa.

Los cuatro casos se ejecutaron contra la función real. Expectativa independiente: cuota fija del tramo más exceso, con condición estricta `>60000`. `casos.json` contiene importes exactos y comparaciones; **las siete comparaciones contra cuota tabulada fallaron**, sin tocar el motor.

| Base EUR | Motor exacto | Fórmula del original | Motor a céntimos | Original a céntimos |
|---:|---:|---:|---:|---:|
| 59.999,99 | 8.625,839648 | 8.625,831378 | 8.625,84 | 8.625,83 |
| 60.000,00 | 8.625,84147 | 8.625,8332 | 8.625,84 | 8.625,83 |
| 60.000,01 | 8.625,84374 | 8.716,67227 | 8.625,84 | 8.716,67 |
| 100.000,00 | 17.705,84147 | 17.796,67 | 17.705,84 | 17.796,67 |

**90,83 euros es la diferencia liquidada motor/fórmula por encima del umbral**, no la magnitud exacta del salto de la propia fórmula tabulada. En el punto exacto sigue el cuarto tramo: 4.142,62 + (60.000 − 35.394) × 18,22 %. No sustituirlo por 8.716,67 ni usar la integral previa como cuota fija normativa.

Corrección propuesta para esa versión: convertir estos casos en prueba fallida del contrato elegido, preservar la condición estricta y representar la cuota fija. No ajustar un tipo marginal para compensar ni imponer continuidad por intuición. La aceptación no comprende fallecidos anteriores a la entrada en vigor, mínimos, deducciones, redondeo de todas las casillas ni declaración completa. El flujo actual resta mínimos y redondea después (`liquidar-irpf-anual.ts:516` y `:544`); un contraejemplo de cuota pura no fija por sí solo cualquier resultado final.

## P2: Cataluña 2022–2024, Canarias 2022–2023 y Madrid 2022

Los seis IDs siguen `needs-evidence` para aceptación fiscal completa, aunque se confirma personalmente la incompatibilidad documental y numérica. No se acepta una cuota legal anual únicamente por coincidencia con el manual.

Cataluña: Ley 2/2021, art. 41, tabla que continúa en p. 47; DL1/2024, art. 611-1, p. 6. La cuota 2.399,10 a 21.000 figura en ambos originales; el motor produce 2.399,106. Falta cerrar todas las reformas/correcciones e intervalos de vigencia 2022–2024, incluido el paso al texto refundido. Examinar la primera parte de la tabla y la disposición final, no solamente una fila.

Canarias: DL1/2023, art. primero.Tres, pp. 5–6, fija expresamente 2022 y 2023; DF única p. 8 remite a esos períodos y recoge publicación BOC 31/01/2023 y convalidación. Se inspeccionó visualmente la tabla p. 6. A 55.276 la integral produce 7.894,395, mientras la tabla da 7.894,39. El nombre candidato `law-canarias-correccion` no convierte este decreto-ley en una mera corrección de errores: es una reforma normativa. La ficha BOE consultada remite a convalidación; falta cerrar la cadena completa del texto modificado y todas las posibles rectificaciones.

Madrid: Ley8/2022, original BOE-A-2023-7340 p. 3, cuota 7.421,04 en 55.596,90; motor 7.421,0505. DF p. 5: efectos para períodos iniciados desde 01/01/2022, con publicación BOCM 21/11/2022. No confundir con la corrección de Madrid 2020 ya integrada. Falta completar revisión de correcciones/reformas del texto modificado antes de aceptar la escala completa.

Acción común: los casos y las 28 filas discrepantes están listos para pruebas acotadas. Definir cuota fija más exceso y política de redondeo, comprobar su interacción con mínimos y desglose, y cerrar vigencia. Que una integral sea aritméticamente correcta no la hace equivalente a una tabla con cuotas fijas.

## Fechas civiles y Asturias

`AUT22-26-fechas-zona` se acepta **como ambigüedad técnica del contrato**, no como fallo demostrado de la UI. El Date recibido en `irpf-autonomico-2022.ts:330` se reduce al día UTC; en `irpf-autonomico-2023.ts:241` se compara con medianoche UTC. Dos llamadas con la misma fecha escrita seleccionan distinto primer tipo:

- Valencia: 28/10/2022 a medianoche Z → 9 %; a medianoche +02:00 → 10 %.
- Extremadura: 15/09/2023 a medianoche Z → 8 %; a medianoche +02:00 → 9,5 %.

Son instantes distintos; la objeción «es correcto comparar instantes» solo resuelve el asunto si se declara y hace cumplir ese contrato. No acredita la fecha civil del fallecimiento. DOGV original 27/10/2022, DF cuarta, y DL4/2023 extremeño, DF tercera, deben leerse con sus efectos y especialidad de fallecidos. El original BOE extremeño indica además corrección DOE de 19/09/2023: no se declara cerrada esa cadena con el PDF BOE solo. Los antecedentes de las dos tablas antiguas permanecen pendientes.

`AUT22-26-asturias-devengo-2025` y la aceptación global de Asturias 2025 siguen `needs-evidence`. La Ley3/2025 se publicó en BOPA el 02/12/2025, entra el 03/12 y no declara retroactividad expresa en su DF. Se comprobó el original de DL2/2014, la reforma, el historial, el criterio AEAT general y la Ley5/2025 posterior (BOE publicado 09/02/2026, efectos de su DF tercera diferenciados). Su art. 39 trata deducciones y otros preceptos; la alusión a efectos 2025 de esas medidas no extiende por sí sola la tarifa de otra ley.

El original de DL2/2014 tampoco es por sí solo la tarifa inmediatamente anterior a diciembre de 2025: su p.7 comienza con 12 % hasta 17.707,20; las tablas del motor 2022–2024 ya tienen 10 % hasta 12.450. Falta documentar esa reforma intermedia, y no se usa el original de 2014 como esperado para fallecidos de 2025.

La LGT original art.10.2 (p.13) añade una objeción que no debe omitirse: distingue tributos periódicos y períodos iniciados desde la entrada en vigor. LIRPF original arts.12–13 fija año natural y devengo por fallecimiento. Por eso no basta combinar «entrada 03/12» con «fecha de muerte» para inventar una regla automática. Hace falta resolver el alcance temporal de la reforma y el criterio para fallecidos. El motor devuelve 9 % para 02/12,03/12 y31/12: ejecutado en `soporte-ejecutado.json`; **no se fijó esperado normativo ni se presenta como prueba fiscal fallida**.

## Cobertura, evidencia y objeciones restantes

Las restantes coincidencias de escalas se mantienen `needs-evidence`: 481 filas verificadas no sustituyen originales, reformas y vigencias. Cada ID tiene sus páginas, hash y filas en el JSON, incluidas ambas variantes de fallecimiento y Ceuta/Melilla por separado. Las fuentes compartidas no se cuentan como testimonios independientes. Para Andalucía, Aragón, Illes Balears, Cantabria, Castilla-La Mancha, Castilla y León, Galicia y las anualidades restantes de los otros territorios no se ha cerrado en esta revisión la cadena original completa. Es una limitación material pendiente, no un porcentaje fiscal aprobado.

Se aceptan con alcance técnico `AUT22-26-formula`, `AUT22-26-simulacion` y `AUT22-26-soporte`: lectura del código y ejecuciones propias. El resolver 2026 rechaza 17 territorios reales y admite la simulación. Esto **no acredita ausencia de normativa 2026**. La Ley asturiana5/2025 adquirida es un ejemplo de publicación normativa posterior, no validación de las tarifas de todo 2026 ni cierre del ejercicio. La simulación usa escala legacy conjunta y cuota autonómica cero; no es duplicación de la escala estatal real. No reejecuté Excel ni Python legacy y no acepto esa parte por el relato del autor.

Se reextrajeron las **543 citas** del candidato del blob original, con igualdad literal en las cajas; las **481 filas** se reinterpretaron desde el texto extraído y se compararon con las tablas importadas del código actual. Los 17 documentos candidatos verifican hash; tres rutas ELI devuelven el mismo HTML de error y se excluyen como evidencia normativa. Se descargaron fuentes adicionales con el helper del proyecto y su lock/UA/ritmo, conservando errores e intentos. HTML lleva hash/URL, sin páginas o cajas ficticias. Se revisaron visualmente las páginas decisivas de Murcia, Cataluña, Madrid, Canarias y el cuadro CARM. No se afirma inspección visual humana de las 543 cajas ni validación criptográfica de firma/CSV.

Objeciones descartadas: corrupción por cambios de lint; que la cifra de Murcia solo aparezca en el manual; que el régimen alto murciano pueda hacerse continuo sin alterar el original; que el rechazo técnico 2026 demuestre vacío normativo; que una simulación sea una escala autonómica legal. Objeciones mantenidas: cadena incompleta por año, política legal de cuotas/redondeo, contrato civil, fallecidos asturianos, alcance incompleto de la liquidación y autenticidad criptográfica no validada. La objeción experta del autor se conserva y responde en cada registro.

## Reproducción y entrega

Scratch: `.cache/procedencia/revision-autonomicas-2022-2026/`. Scripts propios: `motor.mjs`, `comprobar.py`, `casos.mjs`, `soporte.mjs`, `descargas.py`, `extra.py`, `visuales.py`, `nuevos.py`, `entrega.py`. Un worker para las evaluaciones; memoria comprobada antes del trabajo. Bun/Python/uv provistos por Nix. No se escribió ningún patrón Effect nuevo.

```sh
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-autonomicas-2022-2026/motor.mjs
nix shell nixpkgs#python3 -c python .cache/procedencia/revision-autonomicas-2022-2026/comprobar.py
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-autonomicas-2022-2026/casos.mjs
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-autonomicas-2022-2026/soporte.mjs
```

Ejecutado: 1.530 puntos de función de escala contra Python Decimal, cero diferencias aritméticas; cuatro llamadas de fecha civil; 18 llamadas de soporte2026; tres fechas asturianas; siete comparaciones con fórmulas tabuladas, todas discrepantes. Las variantes de fallecimiento tienen comparación de filas, sin atribuirles el barrido completo de límites de las tablas generales. Transcripciones y citas están separadas de estos resultados. Las siete comparaciones registran `assertionPassed:false`; son un harness de investigación que guarda resultados, no siete tests mantenidos ni una ejecución de la liquidación integral.

Archivos principales: `revisiones.json`, `cobertura.json`, `filas-verificadas.json`, `casos.json`, `ejecucion.json`, `soporte-ejecutado.json`, `citas-refinadas.json`, `citas-adicionales.json`, `documentos-adicionales.json`, `integridad.json`. No se autoriza modificación de código por este informe. Sigue pendiente una investigación normativa extensa para cerrar las 70 decisiones `needs-evidence`.
