# Auditoría candidata: trabajo, deducciones estatales y obligación de declarar, 2012–2026

Esta entrega no acepta ningún hallazgo. La revisión independiente debe releer los originales y comprobar los supuestos antes de convertir cualquier candidato en corrección. No se ha modificado el motor ni ejecutado una prueba de regresión contra él: se proponen las pruebas que deberán fallar antes del arreglo. Las comprobaciones numéricas ejecutadas son independientes y están identificadas como tales.

Ámbito: régimen común, las quince comunidades de régimen común y Ceuta/Melilla representadas por el motor. Navarra y los tres territorios históricos vascos no están en el tipo `ComunidadAutonoma`; no se extrapolan estos resultados a normativa foral. `simulada-estatal` es un caso técnico, no un territorio legal. La referencia temporal es el 29 de octubre de 2026; no se afirma que el ejercicio 2026 esté cerrado.

## Resultado sustantivo

La tabla nominal del artículo 20 reproduce las cuantías principales de los períodos examinados. Las divergencias más importantes están en las condiciones y en la integración anual:

- **Otras rentas**: `calcularReduccionRendimientosTrabajo` solo recibe año, fallecimiento y rendimiento previo. No recibe las rentas distintas del trabajo. Con rendimiento previo de 14.000 € y ganancia sujeta de 7.000 €, en 2024 devuelve 7.302 €, cuando no procede reducción. En 2012–2014 el efecto es distinto: corresponde la reducción mínima de 2.652 €, no necesariamente cero.
- **Deducción anual por trabajo de 2025–2026**: existe una política nominal en `compatibilidad-historica.ts`, pero `liquidarTrabajoIndividualSimple` calcula la cuota líquida restando solo deducciones autonómicas. La deducción posterior en la conciliación legacy no corrige la cuota diferencial anual. Hay que evitar duplicarla cuando se incorpore al motor anual.
- **Artículo 80 bis, 2012–2014**: falta la deducción de hasta 400 €. La Ley 26/2009, artículo 70, fija su fórmula desde 2010 con vigencia indefinida; la Ley 26/2014 la suprime desde 2015. El Python también la omite. Su límite específico debe aplicarse, no basta con restar 400 a cualquier cuota.
- **Gastos**: la cotización deducible se estima a partir del bruto con el cálculo laboral legacy. Faltan cotizaciones efectivas, derechos pasivos, colegios de huérfanos, sindicatos, colegios profesionales obligatorios, defensa jurídica, movilidad y gastos aumentados por discapacidad activa. Tener mínimos por discapacidad implementados no cubre estos gastos.
- **Extremo de 2024–2026**: a rendimiento previo exactamente 19.747,50 €, la rama `<=` calcula `2364.34−1.14×(19747.50−17673.52)=−0.0028`. El artículo exige rendimiento inferior al umbral; corresponde cero. Es una diferencia subcéntimo en una etapa exacta: no se afirma sin prueba adicional que cambie siempre un céntimo de la cuota final.
- **Explicación**: con bruto cero se reportan 2.000 € de gastos y hasta 7.302 € de reducción aunque el saldo de base quede en cero. Son cuantías teóricas, no importes aplicados. La distinción importa para la procedencia de cada paso.
- **Obligación de declarar**: existe la constante de 22.000 €, pero no un evaluador completo del artículo 96. El array de rendimientos no identifica pagadores ni sus obligaciones de retener. El umbral no es una exención ni sustituye la liquidación anual.

Los estados de `hallazgos.json` se refieren al alcance indicado en cada registro. Un `match` de coeficientes no valida las condiciones omitidas ni acredita todos los perfiles admitidos por la interfaz.

## Fórmulas y fronteras

Sea `R` el rendimiento íntegro menos los gastos de las letras a–e del artículo 19.2; desde 2015 **no** se resta el gasto de la letra f para determinar el argumento del artículo 20. Para el salario simple que solo tiene SS, el motor elige correctamente este argumento. Al añadir sindicatos, colegios o defensa habrá que incorporarlos a `R`.

| Ejercicios | Reducción nominal del contribuyente elegible |
|---|---|
| 2012–2014 | 4.080 hasta 9.180; `4080−0,35×(R−9180)` hasta 13.260; 2.652 después. Otras rentas >6.500 llevan a 2.652. |
| 2015–2017 | 3.700 hasta 11.250; `3700−1,15625×(R−11250)` hasta 14.450; cero después. |
| 2018 | Devengo anterior al 5 de julio: fórmula 2017. Resto: antigua más mitad de la diferencia positiva entre nueva y antigua. No es un prorrateo por días trabajados. |
| 2019–2022 | 5.565 hasta 13.115; `5565−1,5×(R−13115)` hasta 16.825; cero después. |
| 2023 | 6.498 hasta 14.047,50; `6498−1,14×(R−14047,50)` hasta 19.747,50; cero después. |
| 2024–2026 | 7.302 hasta 14.852; `7302−1,75×(R−14852)` hasta 17.673,52; `2364,34−1,14×(R−17673,52)` con R inferior a 19.747,50; cero desde ese límite. |

Desde 2015 se exige que otras rentas no exentas no excedan 6.500 €. AEAT explica que se computa su suma algebraica sin las reglas de integración y compensación, con rendimientos netos antes de sus reducciones. No debe usarse automáticamente la base general ni el rendimiento inmobiliario ya reducido como sustituto. El importe aplicado queda limitado al saldo de trabajo disponible. Los aumentos anteriores a 2015 por prolongación de actividad, movilidad y discapacidad requieren evaluación separada.

`bordes.json` recoge las comparaciones de las fórmulas del Python en umbral−0,01, umbral y umbral+0,01. La igualdad de las dos ramas en 17.673,52 da 2.364,34. La fórmula 2023 llega exactamente a cero. Las pendientes nominales examinadas son 0,35, 1,15625, 1,5, 1,14, 1,75 y 1,14. No se han confundido pendientes de reducción con tipos marginales de gravamen.

Para 2018, a R=10.000, la reducción es 3.700 para fallecimiento el 4 de julio y 4.632,50 para el 5 de julio o devengo ordinario. El código interpreta `Date` en UTC. TDE-35 registra la ambigüedad: `2018-07-05T00:00:00+02:00` se transforma en 4 de julio UTC. Los llamadores y tests leídos emplean UTC, pero el contrato público solo exige `Date`. La contrarrevisión debe fijar si representa una fecha civil UTC o un instante; no se acepta todavía un defecto de calendario.

## Vigencias y transitorios que no deben mezclarse con retenciones

- **2015**: los 2.000 € generales del artículo 19.2.f sustituyen una parte de la estructura anterior. La DT sexta permite el régimen transitorio de movilidad a quien aceptó el puesto en 2014 y continúa en 2015. El motor solo conserva metadatos descriptivos. AEAT 2015, PDF físico 144–145, explica el incremento antiguo y su incompatibilidad con el gasto nuevo por movilidad. No sumar ambos incrementos. La DT conserva el incremento antiguo del 100% de la reducción general 2014 (de 2.652 a 4.080, con su tramo y condición de otras rentas), junto al gasto general de 2.000 y a la reducción general 2015 que procedan. Ejemplo candidato con R previo de 20.000: gasto general 2.000, reducción general 2015 cero, incremento transitorio 2.652 y saldo de trabajo 15.348; no añadir otros 2.000 por movilidad.
- **2018**: Ley 6/2018, PDF 77–78, contiene la fórmula anual de la DA 47; la misma disposición contiene reglas diferentes para retención. El límite reducido para declarar es 12.643 cuando el devengo sucede desde la entrada en vigor; antes es 12.000. El régimen ordinario de 14.000 empieza en 2019.
- **2023**: Ley 31/2022, PDF 84–85, aplica la nueva reducción anual desde el 1 de enero. La continuación de las reglas antiguas durante enero se refiere a retenciones; no se debe calcular una media anual 1/12–11/12.
- **2024**: RDL 4/2024, PDF 23–24, da efectos desde el 1 de enero a la nueva reducción y al límite de declarar de 15.876. Su publicación en junio no implica una semisuma anual ni un corte por fallecimiento anterior a junio.
- **2025**: Ley 5/2025, disposición final tercera, PDF 46–47, introduce la DA 61 con efectos desde el 1 de enero. Hasta 16.576 de rendimientos íntegros cualificados: 340; de ahí hasta 18.276: `340−0,2×(bruto−16576)`. No procede para toda pensión o prestación por el mero hecho de ser rendimiento del trabajo.
- **2026**: RDL 5/2026, artículo 28, PDF 45–46, fija desde el 1 de enero 590,89; primer umbral 17.094 y extinción en 20.048,45. Es norma anual. Se ha localizado su convalidación, BOE-A-2026-6483. Una fuente de algoritmo de retención no acredita por sí sola esta deducción anual.

La deducción DA 61 exige servicios efectivos en relación laboral o estatutaria, otras rentas distintas de esas rentas cualificadas no superiores a 6.500, y límite de cuota íntegra estatal y autonómica proporcional al neto de trabajo pertinente. Se resta de la cuota líquida total tras la deducción por doble imposición internacional. La pensión cuenta como otra renta a estos efectos aunque para el artículo 20 siga siendo renta del trabajo. AEAT 2025 contiene un ejemplo salario 6.000 + pensión 12.000 + intereses 150 sin derecho a esta deducción.

Referencia para los auditores de retenciones, sin editar sus informes: Ley 6/2018 pp. 77–79; Ley 31/2022 pp. 84–85; RDL 4/2024 pp. 23–24; Ley 5/2025 pp. 46–47; RDL 5/2026 pp. 45–46. Los hashes y rutas están en `documentos.json`. Este informe no certifica el procedimiento de retención.

## Gastos y entradas necesarias

La regla anual deduce las cotizaciones efectivas y las demás cantidades admitidas, no un tipo universal sobre el rendimiento agregado. La situación laboral, el periodo cotizado, las bases reales, la pluralidad de empleos y los regímenes de funcionarios invalidan esa inferencia fuera del perfil simple.

Los gastos sindicales requieren importe satisfecho; la colegiación requiere obligatoriedad y parte destinada a fines esenciales, con tope reglamentario de 500 € anuales; defensa jurídica exige litigio directo con el pagador y tope de 300 €. Deben comprobarse los bordes de ambos límites y la ausencia de estos requisitos. No se aplica el tope de 500 a cuotas sindicales.

El gasto general de 2.000 no se multiplica por pagadores. Movilidad exige inscripción como desempleado y traslado causal de residencia; se aplica al año de cambio y al siguiente con el límite de los rendimientos asociados. Discapacidad exige trabajo activo y acreditación: incremento 3.500 o 7.750 según grado/necesidad de ayuda/movilidad. Se necesitan fechas y rendimientos asociados; la condición de discapacidad del mínimo personal no contiene esa información completa. No deben prorratearse automáticamente los importes anuales por días: la limitación por rendimiento asociado tiene naturaleza distinta.

El neto general del artículo 19 puede resultar negativo por gastos a–e. El suelo de cero no es una regla universal para todos los gastos: afecta al límite de f y a la reducción del artículo 20. El contrato actual no permite introducir los gastos que mostrarían esa diferencia. Es una laguna de alcance, no una prueba ejecutada de cuota negativa perdida.

## Obligación de declarar

El parámetro 22.000 es adecuado para el supuesto general restringido. Para varios pagadores y otros supuestos del artículo 96.3, la sucesión es 11.200 (2012–2014), 12.000 (2015–2017), 12.000/12.643 según devengo (2018), 14.000 (2019–2022), 15.000 (2023), 15.876 (2024–2026). Los importes del segundo y restantes se ordenan por cuantía, no por fecha, y normalmente no deben superar 1.500 para mantener el límite general. No todo caso con varios pagadores obliga a declarar.

La excepción de 2.500 para devengos del 1 al 22 de enero de 2025 requiere la norma original no convalidada y su derogación, además del manual AEAT. No debe extenderse a todo el año. El manual descargado lo precisa en su página física 26.

Faltan en el motor pensiones compensatorias, pagadores sin obligación de retener, tipos fijos, procedimiento de prestaciones pasivas y las restantes causas desglosadas a continuación. La lectura adicional de originales cierra la identificación normativa básica de RETA, IMV, otras fuentes de renta y beneficios ejercitados; sigue pendiente su contrarrevisión y la casuística completa del procedimiento especial de prestaciones pasivas. El resultado debe distinguir obligación, posibilidad de devolución mediante declaración voluntaria y deuda anual. La elección legacy del menor entre cuota y límite de retención es una hipótesis de simulación; no constituye el artículo 96.

TDE-31 a TDE-34 desglosan cuatro ausencias adicionales:

- **RETA/RETM desde 2023**: DF primera y quinta del RDL 13/2022, PDF 62–64. El alta en cualquier momento del año como trabajador por cuenta propia obliga a declarar incluso con rendimiento cero. AEAT 2025, PDF 28, distingue trabajadores del mar por cuenta ajena y religiosos sin actividad económica; una alta asimilada no debe traducirse ciegamente en esta causa.
- **IMV desde 2020**: RDL 20/2020 original, artículo 33, PDF 28; Ley 19/2021, artículo 36, PDF 34–35 y entrada en vigor PDF 57. La obligación alcanza al titular y a los integrantes de la unidad de convivencia para percibir/mantener la prestación, incluidos menores sin rentas. No equivale a unidad familiar IRPF ni exige automáticamente declaración conjunta. Los manuales 2020, PDF 41, 2021, PDF 44, y 2025, PDF 24, confirman la continuidad y el cambio de numeración de la letra del artículo original.
- **Fuentes distintas del trabajo**: el límite conjunto de capital mobiliario y ganancias sujetos a retención es 1.600; imputaciones inmobiliarias, Letras y ayudas de vivienda tienen límite conjunto 1.000, que incluye otras ayudas públicas desde 2018. Existe además la regla alternativa de rentas íntegras conjuntas de hasta 1.000 y pérdidas inferiores a 500. No son franquicias acumulables. Salario de 20.000 más alquiler ordinario de 1 euro no encaja en la excepción por fuentes. La Ley 16/2013, PDF 17–18, introduce desde 2014 la excepción de IIC cuya base de retención no coincide con la ganancia que se integra. La Ley 6/2018, PDF 83, amplía las ayudas públicas desde el 1 de enero.
- **Beneficios y devolución**: el ejercicio de ciertos derechos obliga a declarar, aunque no se superen los límites por renta. La Ley 16/2012, PDF 7–8, elimina vivienda del artículo 96.4 desde 2013 pero preserva la obligación en DT 18.3 para quien aplica la deducción transitoria. La reforma de 2015 suprime cuenta ahorro-empresa. El artículo 61 del Reglamento precisa el ejercicio del derecho; el artículo 65 exige declaración para solicitar devolución. La declaración voluntaria se distingue de la obligación por rentas.

El Reglamento consolidado consultado todavía muestra 15.000 en el artículo 61.3.A.2, mientras que el artículo 96 de la Ley, reformado por RDL 4/2024, fija 15.876 desde 2024. Se da prioridad a la norma de rango legal y al manual del ejercicio; no se traslada mecánicamente el número del Reglamento. Esta diferencia entre fuentes no es por sí misma un error del motor.


## Deducciones no modeladas: propuesta de ampliación, sin implementación

| Familia | Base normativa a versionar | Entradas mínimas y precaución |
|---|---|---|
| Trabajo 2012–2014 y 2025–2026 | Art. 80 bis histórico; DA 61 | Base imponible, clase de trabajo, otras rentas, cuotas y netos para límite; orden de aplicación. Prioridad alta porque altera el caso salarial simple. |
| Donativos y cuotas a partidos | Art. 68.3, Ley 49/2002, art. 68.3.c | Beneficiario, importe, recurrencia, base y límites; separar ejercicios y reformas. No usar porcentajes actuales en todos los años. |
| Vivienda habitual | Art. 68.1 histórico y DT 18 | Fecha de adquisición, deducción previa, pagos/financiación, base y reparto estatal/autonómico. No basta con ser propietario. |
| Alquiler habitual | Art. 68.7 histórico y DT 15 | Contrato anterior a 2015, pagos previos, base imponible y cantidades satisfechas; régimen cerrado de transición. |
| Maternidad y guardería | Art. 81 y reformas de 2018/2023 | Meses, edad/adopción, situación laboral/prestaciones/cotizaciones, gastos no subvencionados, anticipos y centro autorizado. Puede generar devolución. |
| Familia numerosa y discapacidad a cargo | Art. 81 bis desde 2015 y reformas | Título/categoría, miembros y meses, beneficiarios, cesión/prorrateo, cotizaciones/prestaciones y anticipos. El mínimo familiar no es sustituto. |
| Doble imposición internacional | Art. 80 | Rentas extranjeras general/ahorro, impuesto extranjero efectivo, tipo medio y límite español; orden previo a DA 61. |
| Ceuta/Melilla y regímenes territoriales especiales | Art. 68.4; DA 57 y prórrogas para La Palma | Residencia, origen efectivo de renta, duración y patrimonio cuando proceda. Tener comunidad Ceuta/Melilla no demuestra por sí solo todos los requisitos. |
| Empresas nuevas, actividades económicas y patrimonio histórico | Art. 68.1/68.2/68.5 y versiones históricas | Inversión, certificados, participaciones, mantenimiento, base y límites; no ejecutables con solo salario. |
| Eficiencia energética y vehículo eléctrico/recarga | DA 50, DA 58 y prórrogas originales | Certificados antes/después, pagos, subvenciones, titularidad, fechas y límites plurianuales. Las prórrogas y decretos no convalidados impiden asumir vigencia uniforme en 2026. |
| Rentas irregulares y artistas | Art. 18, DT de prestaciones y DA 60 | Clase, periodo de generación, cobros previos, límites, imputación y actividad; son reducciones de rendimientos, no deducciones de cuota. |

Esta tabla es una propuesta de cobertura con norma e inputs explícitos. No valida porcentajes ni todas las condiciones de familias no ejecutadas. Hace falta auditoría histórica propia antes de añadir cada evaluador. También quedan fuera la liquidación conjunta, no residentes, impatriados, actividades económicas completas y regímenes forales.

## Procedencia, decisiones y coste asumido

1. **Conservar originales y seleccionar por versión real.** Objeción experta: una fecha en la URL no demuestra que el servidor devolvió esa versión. Se comprobó el contenido y se rechazó `p=20120101`, que devolvió artículo 20 actual. Motivo: evitar acreditar 2012 con 2026. Coste: descargas adicionales y comprobación de selector/publicación. El original rechazado se conserva en caché, fuera del manifiesto probatorio.
2. **Separar norma, valor nominal y aplicación.** Objeción experta: etiquetar toda la tabla como errónea ocultaría los coeficientes correctos; etiquetarla validada ocultaría condiciones ausentes. Motivo: permitir correcciones con pruebas específicas. Coste: más registros y más casos que revisar. Ningún hallazgo propio queda aceptado.
3. **No corregir el legacy.** Objeción experta: conservar errores como referencia puede confundir a consumidores. Motivo: el oracle documenta compatibilidad, no autoridad fiscal; la divergencia queda explícita. Coste: mantener resultados separados y prevenir doble deducción al integrar DA 61 anual.
4. **Extraer texto y cajas, sin renderizar manuales completos.** Objeción experta: una extracción textual puede perder estructura de tabla o carácter. Motivo: las fórmulas principales se citan también en prosa de la disposición original; los candidatos incluyen página física, cajas y texto reextraíble. Coste: revisión visual independiente pendiente; solo se producen facsímiles de páginas concretas.
5. **No equiparar hash y autenticidad.** Objeción experta: HTTPS y hash no validan firma del BOE ni CSV. Motivo: registrar exactamente lo comprobado. Coste: autenticación PAdES/CSV, sello temporal y eventual WARC pendientes; no se certifica autenticidad criptográfica del emisor.
6. **Ampliaciones con inputs, no parámetros sueltos.** Objeción experta: una deducción sin calendario, elegibilidad y límite puede empeorar la exactitud. Motivo: las familias propuestas tienen requisitos distintos y algunas son reembolsables. Coste: catálogo aún no ejecutable y más diseño/pruebas antes de aumentar cobertura.

## Reproducción y límites de esta ronda

Se ha leído el contrato completo, el brief completo, coordinación, lint, README, AGENTS, glosario, alcance legacy, ADR de separación y los módulos pertinentes. Solo se ha usado `jj log` para identificar la revisión inicial; no hay commits, init, bookmarks, PR ni cambios de producción. No se ha escrito TypeScript ni Effect, no hay instalación global, build ni suite pesada.

Scripts propios en `.cache/procedencia/trabajo-deducciones-estatales/`: `adquirir.py`, `ampliar.py`, `historicas.py` llaman al descargador común con bloqueo y User-Agent del proyecto; `extraer.py` localiza páginas; `bordes.py` evalúa únicamente la función pura del Python mediante AST y lee por streaming el XML de `CONTROL_GENERAL`; `empaquetar.py` inicia el paquete; `enriquecer-fuentes.py`, `afinar-hallazgos.py` y `vincular-inventario.py` completan fuentes y vínculos; `verificar-entrega.py` comprueba la reextracción final. Los scripts de elaboración pueden regenerar borradores: para comprobar la entrega final usar los comandos de verificación del cierre, sin regenerar los borradores. Las fórmulas leídas no ejecutan pandas ni regeneran Excel. `comparacion-tablas.json` compara 75 celdas G2:G16 y J2:M16 con Python, TypeScript y la tabla nominal independiente. Todas coinciden en ese alcance; la etiqueta 2018 se decodificó como `inlineStr`, no como número. El primer intento buscó `sharedStrings.xml`, ausente en este libro; se corrigió el lector de auditoría sin tocar el original. Estas celdas conservan el control histórico; no se ha cargado el libro de 145 MiB en memoria.

Comandos utilizados:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/adquirir.py
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/ampliar.py
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/historicas.py
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/bordes.py
```

PyMuPDF se ejecuta con `uv run --python` apuntando al Python de Nix, `UV_PYTHON_DOWNLOADS=never`, `--with pymupdf` y `LD_LIBRARY_PATH` del `stdenv.cc.cc.lib` de Nix. El intento inicial con Python descargado por uv falló por el cargador dinámico de NixOS; el segundo detectó la falta de libstdc++, resuelta con la biblioteca Nix. No se ocultaron esos fallos ni se instalaron paquetes globales.

`cobertura.json` separa ejercicios examinados, documentos obtenidos, revisión pendiente y lagunas. `documentos.json` conserva URLs canónica/final, fecha UTC, estado HTTP, cabeceras, tamaños, MIME y SHA-256/SHA-512. `citas-candidatas.json` no usa la numeración de las transcripciones Markdown: el PDF AEAT 2025 descargado lleva versión de 20/05/2026 y sitúa DA 61 en páginas 1371–1374. Las páginas 1194–1195 de otra versión no son trasladables a este hash.


## Cierre de la entrega y lectura para contrarrevisión

La entrega contiene **35 hallazgos candidatos**: 12 `match` restringidos, 5 `mismatch`, 16 `missing` y 2 `ambiguous`. Se describen **258 pares hallazgo–ejercicio**, con los 17 territorios comunes representados explícitamente. Esto no equivale a 258 liquidaciones ejecutadas ni a aceptación fiscal. Los 35 registros tienen vínculos a elementos del inventario provisional, comprobando que el hash del archivo implementado coincide con el inventariado; la relación semántica sigue pendiente de revisión.

Se conservan **38 documentos oficiales** con sus originales en caché y hashes SHA-256/SHA-512 comprobados. Hay **1.991 citas candidatas**: 1.669 bloques PDF, 16 filas de tabla con sus celdas y 306 párrafos HTML. Se seleccionaron **126 citas focales** en `citas-focales.json` y `focusedCitationIds` de cada hallazgo. El resto incluye contexto y no representa otras tantas reglas probadas. Las 1.991 reextracciones coinciden con el texto conservado; esta comprobación técnica hecha por el mismo auditor no constituye contrarrevisión.

`bordes.json` conserva 46 cálculos de fronteras de la reducción/Python; `bordes-deducciones.json` añade 26 casos decimales de DA 61 y artículo 80 bis, incluidas fronteras de otras rentas y dos ejemplos AEAT. Son cálculos independientes, no resultados de ejecutar el motor TypeScript. El ejemplo con cotización efectiva de 1.200 requiere resolver antes el input ausente TDE-01 o probar la deducción sobre una cuota ya calculada.

Lectura sugerida: comenzar por TDE-09/10 (otras rentas), TDE-18 (extremo negativo), TDE-20/22/23 (deducciones anuales), TDE-25/26 y TDE-31 a TDE-35 (declarantes y fechas). Para cada registro, abrir primero sus citas focales en el original cuyo hash se indica; después revisar los límites del `match` y la objeción experta propia de ese hallazgo. Las citas legales principales incluyen [artículo 20 de 2024, PDF 23](https://www.boe.es/boe/dias/2024/06/27/pdfs/BOE-A-2024-12944.pdf#page=23), [DA 61 de 2025, PDF 46–47](https://www.boe.es/boe/dias/2025/07/25/pdfs/BOE-A-2025-15424.pdf#page=46) y [DA 61 de 2026, PDF 45–46](https://www.boe.es/eli/es/rdl/2026/02/17/5/dof/spa/pdf#page=45).

Se leyó la nota de frontera del auditor de retenciones 2012–2019. La coincidencia de una media en ciertos algoritmos de retención de 2018 no convierte ambas operaciones en una sola: la liquidación anual usa devengo/fallecimiento; retenciones usa satisfacción y regularización. No se ha editado el informe del otro auditor.

Lagunas concretas: manuales oficiales 2012–2013 no recuperados; manual 2026 final y cierre del ejercicio pendientes; autenticidad PAdES/CSV sin validar; fórmulas históricas completas de deducciones no ejecutadas y de artículo 18/DA 60 pendientes de auditoría específica; casos completos del procedimiento 146 y convenios especiales pendientes; pruebas del motor y contrarrevisión jurídica no ejecutadas. La cobertura de fuentes y las ausencias del motor están separadas en `cobertura.json`.

Decisión de publicación: se excluyen las cabeceras de sesión indicadas por el usuario, también en las fuentes embebidas. Objeción experta: un registro HTTP íntegro podría facilitar reproducción forense. Motivo: esas cabeceras no acreditan el contenido fiscal y no deben publicarse. Coste aceptado: no se conserva su valor en los artefactos versionables; permanecen URLs, fechas, estado, Content-Type/Length, ETag/Last-Modified cuando existen, tamaños y hashes. No se han alterado bytes PDF/HTML ni sus hashes.

Comprobaciones finales reproducibles, desde la raíz del checkout:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/cobertura.py
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/comparar-tablas.py
nix shell nixpkgs#python3 -c python .cache/procedencia/trabajo-deducciones-estatales/bordes-deducciones.py
```

Para las citas, con el entorno Python/Nix descrito arriba: `uv run --python <PythonNix> --with pymupdf python .cache/procedencia/trabajo-deducciones-estatales/verificar-entrega.py`. La salida esperada es reextracción completa coincidente; no imprime cabeceras de sesión. No se han realizado commits, init ni otras operaciones VCS mutantes.

La versión AEAT 2018 V8 tiene un defecto en la advertencia de la página 2: el mes del cierre electrónico aparece como caracteres ilegibles tanto en texto como en el render de esa página. Se conserva esa limitación; no se infiere el mes. El NIPO, el ejercicio, el nombre V8 y el hash identifican la edición utilizada. Se completaron las fechas legibles de AEAT 2017 (25/05/2018) y 2019 (05/05/2020).
