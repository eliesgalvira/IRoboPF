# Auditoría candidata de escalas autonómicas 2022–2026

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Esta entrega no cierra la auditoría normativa exhaustiva: cubre la lectura de las tablas y resolutores del motor, el contraste de todas las escalas generales de 2022–2025 con los manuales AEAT de cada ejercicio y las dos variantes explícitas por fallecimiento. Falta completar la cadena de normas originales y modificaciones de cada territorio. Ningún hallazgo está aceptado.

## Resultado comprobado

Los cuatro manuales PDF originales están conservados por hash. Se han extraído 481 filas comparadas, con páginas, cajas en puntos PDF desde esquina superior izquierda, texto literal y cajas de celdas. Ceuta y Melilla comparten evidencia: sus filas se comparan con cada tabla ejecutable, pero las citas no se duplican como documentos distintos. Las filas incluyen 10 tramos valencianos anteriores al 28/10/2022 y 9 extremeños anteriores al 15/09/2023. Murcia 2022 presenta cuatro filas y el tramo final en un párrafo en páginas 979–980: 8.716,67 euros más 22,70 % del exceso sobre 60.000 euros. No se ha inventado una quinta fila.

No aparece diferencia de límites o tipos en las 481 filas. Hay 28 cuotas acumuladas que difieren de la suma exacta del motor redondeada half-up a dos decimales. Son 18 filas de Cataluña 2022–2024, seis de Canarias 2022–2023, dos de Madrid 2022 y dos de Murcia 2022. Esta cuenta excluye el tramo final de Murcia expresado en prosa. La coincidencia de tipos no valida esas cuotas.

Se han ejecutado 1.877 evaluaciones acotadas de la función real de escalas, para 72 tablas generales (17 territorios reales y una simulación, por cuatro años), y contrastado con una fórmula independiente en Python Decimal: cero diferencias aritméticas. Incluyen cada límite finito y ±0,01 euros, cero, negativo y bases de hasta 400.000 euros. Son comprobaciones técnicas, no 1.877 validaciones normativas. Las variantes por fallecimiento tienen contraste documental específico; no se afirma haber ejecutado el mismo barrido numérico sobre ellas.

## Diferencias concretas

| Caso | Base EUR | Motor antes del redondeo | Cuota publicada EUR | Resultado half-up del motor |
|---|---:|---:|---:|---:|
| Cataluña 2022–2024 | 21.000,00 | 2.399,106 | 2.399,10 | 2.399,11 |
| Cataluña 2022–2024 | 90.000,00 | 15.902,838 | 15.902,83 | 15.902,84 |
| Madrid 2022 | 34.360,50 | 3.725,91690 | 3.725,91 | 3.725,92 |
| Madrid 2022 | 55.596,90 | 7.421,05050 | 7.421,04 | 7.421,05 |
| Canarias 2022–2023 | 55.276,00 | 7.894,395 | 7.894,39 | 7.894,40 |
| Murcia 2022 | 21.028,20 | 2.168,767350 | 2.168,76 | 2.168,77 |

Cataluña: la cuota de 2.399,10 consta en la Ley 2/2021 original, tabla en página 47 del PDF BOE, y en el artículo 611-1 del Decreto Legislativo 1/2024 original, página 6 del DOGC. Madrid: Ley 8/2022 original, página 3. Se proponen pruebas que fallen antes de cualquier cambio. Objeción experta: no basta ver un céntimo distinto, hay que determinar si la norma prescribe usar cuota tabulada más exceso, y comprobar la política de redondeo en la liquidación. Motivo: ambos originales permiten formular un contraejemplo preciso. Coste aceptado: `mismatch` es candidato, no autorización para corregir ni conclusión sobre todos los importes finales.

`comparacion-filas.json` contiene cada fila, cuota exacta reconstruida y cita. `hallazgos.json` separa territorio, ejercicio y variante. En las variantes condicionales se registra su tabla específica, no la general.

## Fechas, herencias y fórmulas

- Valencia 2022: tabla antigua antes del 28 de octubre y nueva desde ese día. El código convierte Date a día UTC. Extremadura 2023: tabla antigua antes del 15 de septiembre y nueva desde ese día; compara milisegundos con medianoche UTC. El decreto-ley extremeño 4/2023, disposición final tercera, distingue expresamente fallecidos anteriores. Una entrada `2023-09-15T00:00:00+02:00` selecciona la antigua, mientras `2023-09-15T00:00:00Z` selecciona la nueva. Se registra ambigüedad del contrato de fecha civil, sin afirmar que la UI produzca esa entrada.
- Asturias 2025: la Ley 3/2025 entra en vigor el día siguiente a su publicación en BOPA de 2/12/2025. El resolver de 2025 no recibe fallecimiento y siempre entrega la tarifa nueva. Falta resolver devengos anteriores y eventual criterio de retroactividad; el preámbulo menciona el ejercicio 2025, pero no sustituye una regla operativa de vigencia. Se registra como ambiguo.
- Herencias: cada tabla 2022, 2023 y 2024 se ha comparado con su manual, aunque reutilice objetos de 2025. Una misma referencia de código no ha servido como evidencia de otro año. La trazabilidad inversa a 2025 puede cambiar años anteriores si se edita la tabla compartida: requiere pruebas de herencia y posterior contrarrevisión.
- No se ha encontrado escala condicional por base baja en los resolutores 2022–2025 ni en las secciones de escalas de esos manuales. `baseLiquidableGeneral` no selecciona tarifa en esos ejercicios. No trasladar aquí excepciones de ejercicios anteriores. Los mínimos reducen la cuota aplicando la misma escala a `min(base,mínimo)`; auditar importes de mínimos corresponde a otro lote.
- `calcularDesgloseCuotaPorEscala` integra cada ancho positivo por su tipo. No almacena cuotas fijas ni redondea tramo a tramo. Los límites son crecientes; el último es Infinity. Para base no positiva retorna lista vacía. El alcance numérico supone base finita válida; no se presenta NaN/Infinity de entrada como caso fiscal soportado.

## Territorios y legacy

`ComunidadAutonoma` contiene 15 comunidades de régimen común, Ceuta, Melilla y `simulada-estatal`. Navarra y País Vasco no aparecen en ese tipo ni en las tablas. Ceuta y Melilla sí están implementadas en 2022–2025 con la escala de cinco tramos hasta 22,5 %, acorde con la remisión de DA32 LIRPF al artículo 65 que muestran los manuales. Esto no certifica deducciones territoriales ni una declaración completa de esas ciudades.

En 2026 el resolver rechaza explícitamente todas las comunidades reales y ciudades, y solo permite la simulación. No hay `irpf-autonomico-2026.ts`. Los datos 2025 no se han marcado como validados para 2026. Sigue pendiente investigación legislativa territorial de 2026, distinta de identificar este rechazo.

La liquidación simulada usa `calcularCuotaPorEscalaGeneral`, es decir, escala conjunta legacy 19/24/30/37/45/47 %, y asigna cero a la cuota autonómica. No duplica la escala estatal real. A base 400.000 euros la cuota conjunta legacy es 172.901,50; duplicar la estatal real produce 174.901,50. El Python no tiene territorio: no puede ser oráculo para Madrid o Cataluña. Se ejecutó exclusivamente la función pura Python de cuotas mediante AST, evitando generación Excel, y se leyeron en streaming 30 filas 2022–2026 de `CONTROL_TRAMOS_IRPF`. No se cargaron hojas DAT ni el libro completo en RAM. Las celdas conservadas son valores XML crudos; si una celda es sharedString, su índice no se interpreta como cantidad fiscal.

## Evidencia y límites

`documentos.json` conserva canonicalUrl, finalUrl, retrievedAt, estado, cabeceras originales, SHA-256/SHA-512, tamaño, MIME y ruta del blob. Las fechas de edición de manuales son 23/06/2023, 07/06/2024, 14/01/2026 y 20/05/2026, respectivamente. La página siempre corresponde al blob adquirido, no a otra edición indexada por un buscador.

`verificacion-citas.json` comprueba hash y reextracción literal por caja. Es verificación mecánica del mismo auditor, no revisión independiente. No se han validado firmas PAdES ni CSV, ni producido sellado temporal externo. No se ha hecho OCR ni renderizado manuales completos. Los hashes no acreditan por sí solos la autenticidad jurídica.

Las rutas ELI ensayadas para Valencia, Murcia y Canarias devolvieron HTML de error con HTTP 200. Se conservan como intentos rechazados, nunca como PDF ni prueba legal. Para Valencia se obtuvo después el PDF original DOGV mediante la ficha BOE. La ausencia de cadena original en otros territorios no se oculta con un consolidado actual.

Pendiente por todos los años/territorios: cerrar modificaciones, correcciones de errores, derogaciones y vigencia exacta. En particular, falta cadena original completa para Andalucía, Aragón, Illes Balears, Cantabria, Castilla-La Mancha, Castilla y León, Galicia y los cambios posteriores de Madrid/Murcia/Valencia/Cataluña, además de los antecedentes de las escalas anteriores por fallecimiento. Las normas obtenidas para Asturias, Extremadura, La Rioja y Canarias aportan tramos o vigencia concretos, pero no se declaran cadenas completas. `cobertura.json` mantiene `complete: false` y detalla la matriz de 102 entradas: 68 generales reales, dos variantes, cinco simulaciones, diez ausencias forales y 17 rechazos reales de 2026. No son 102 checks normativos aprobados.

Objeción experta al alcance documental: aún no cumple la petición exhaustiva de originales para cada herencia. Motivo de conservarla: ofrece evidencia concreta y contraejemplos revisables sin contaminar el motor. Coste aceptado explícito: la investigación normativa restante sigue abierta y no debe cerrarse por el número de filas o por los tests existentes.

## Reproducción

Scratch exclusivo: `.cache/procedencia/autonomicas-2022-2026/`. Los scripts allí son auxiliares de investigación, no código del motor. Descargas mediante importación de `tools/procedencia/descargar.py`, con lock compartido, User-Agent IRoboPF y pausa; no se paralelizan peticiones dentro de un lote.

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2022-2026/download.py
nix shell nixpkgs#bun -c bun .cache/procedencia/autonomicas-2022-2026/engine.mjs
nix shell nixpkgs#bun -c bun .cache/procedencia/autonomicas-2022-2026/borders.mjs
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2022-2026/check_numeric.py
```

Para PyMuPDF se usó `uv run --python python3 --with pymupdf python <script>` dentro de `nix shell nixpkgs#python3 nixpkgs#uv`, con `LD_LIBRARY_PATH` apuntando a `lib` de `nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath`. Esto resolvió tanto el intérprete uv incompatible con NixOS como la dependencia libstdc++. Se conservan `audit_pdf.py`, `legal_rows.py`, `support.py`, `report.py` y `finalize.py`. No se escribió TypeScript ni código Effect nuevo; no corresponde ejecutar anti-slop sobre documentos JSON/Markdown.

## Ampliación: Murcia y Canarias, originales recuperados

El original BORM del Decreto-Ley 4/2022, anuncio 4846, página 4, reproduce expresamente la cuota fija de **8.716,67 euros** para base **superior** a 60.000 euros. El motor suma 8.625,84147 en los tramos anteriores. Por tanto, a 60.000,01 euros calcula 8.625,84374 (8.625,84 liquidado), mientras el párrafo normativo da 8.716,67227 (8.716,67 liquidado): diferencia de **90,83 euros**. A 100.000 euros, 17.705,84 frente a 17.796,67. No es un error de un céntimo ni basta retocar un tipo marginal. La literalidad introduce una discontinuidad en el borde; el mejor experto objetaría corregir el motor sin descartar una corrección oficial de errores o un criterio posterior. Se conserva como `mismatch` candidato y se propone probar ambos lados y el punto exacto antes de cualquier fix.

El original BOE-A-2023-12084, Decreto-ley canario 1/2023, artículo primero.Tres, páginas 5–6, establece expresamente la tabla para 2022 y 2023 y publica las cuotas con céntimos. La disposición final única, página 8, remite efectos a los periodos indicados. Confirma las tres discrepancias de un céntimo de cada ejercicio. Estos dos casos pasan también a `mismatch` candidato.

Resultado actualizado: **75 hallazgos candidatos: 66 match de alcance acotado, siete mismatch y dos ambiguous; cero aceptados**. Las siete diferencias se agrupan por año/territorio: Cataluña 2022–2024, Canarias 2022–2023, Madrid 2022 y Murcia 2022. Los dos ambiguos corresponden al contrato temporal UTC/civil y a Asturias 2025 por fallecimiento. No son siete bugs independientes necesariamente: varias diferencias comparten la pérdida de la cuota fija tabulada en la representación del motor.
