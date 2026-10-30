# Revisión independiente de cadena autonómica B

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Corte documental: 29/10/2026. **Ocho candidatos aceptados con alcance limitado y uno pendiente de evidencia o contrato de aplicación.** Este dictamen requiere la prueba fallida correspondiente antes de fundamentar una corrección de código. No se ejecutó el motor ni se certifica una liquidación fiscal.

Se revisan los nueve IDs, las 25 etapas y los 75 pares año-territorio. Se reextraen las 167 filas originales desde los HTML oficiales, sin diferencias con las celdas candidatas. Estos cuatro denominadores son diferentes: no representan 75 liquidaciones validadas. `cobertura.json` enumera todos los IDs y pares; `matriz-variantes.json` da decisión, alcance, condiciones y citas por etapa; `filas.json` permite comprobar cada fila, sin coordenadas ficticias para HTML.

## Dictamen por ID

| ID | Decisión | Severidad | Proposición aceptada / siguiente acción |
|---|---|---|---|
| cadena-b-ext-2026 | accepted | P2 | Falta soporte territorial; reforma publicada con efectos enero2026 y tipos7,75/9,75. Añadir prueba antes de implementar, sin heredar2025. |
| cadena-b-ext-consolidado-2018 | accepted | P2 documental | Conflicto10,50 frente originales9,50. Conservar9,5 actual; evitar consolidado defectuoso como autoridad. |
| cadena-b-cat-cuotas-2020 | accepted | P2 | Diferencia de cuota tabulada frente integral para2020–21. Probar cuota más exceso y mínimo antes de corregir representación. |
| cadena-b-cat-cuotas-2022 | accepted | P2 | Diferencia análoga2022–24, conservada en refundición2024. No extrapolar a2025. |
| cadena-b-cat-minimo-2020 | needs-evidence | P2 | Texto6.105 y protección STC comprobados; falta definir si se reconstruye obligación histórica protegida o se calcula una nueva liquidación. No cambiar5550 universalmente. |
| cadena-b-sin-modelo-2026-castilla-la-mancha | accepted | P2 capacidad | Carencia de soporte; no inexistencia de norma ni permiso de copiar parámetros completos. |
| cadena-b-sin-modelo-2026-castilla-y-leon | accepted | P2 capacidad | Igual alcance; mínimos propios requieren conservar atribución normativa. |
| cadena-b-sin-modelo-2026-catalunya | accepted | P2 capacidad | Igual alcance; escala2025 identificada, sin cierre fiscal2026. |
| cadena-b-sin-modelo-2026-galicia | accepted | P2 capacidad | Igual alcance; escala y mínimos2022 tienen retroactividad expresa. |

`revisiones.json` conserva los estados candidatos y la revisión pendiente previa, incorpora `acceptanceScope`, evidencia y objeciones por ID. No se han actualizado los hallazgos del autor. «Accepted» no acepta todas las proposiciones de un informe por asociación.

## Evidencia decisiva y reproducción

**Extremadura2026.** Leídos BOE-A-2026-17839, pp66 y78, y duplicado DOE de04/08/2026, pp95 y112 (página física, 1-based). Se verifica tanto cabecera real de publicación como disposición operativa: DF2.Uno modifica art1; DF7 da efectos01/01/2026 a apartados1–16. El BOE se publicó17/08/2026, no en enero. Tabla:7,75%;9,75%;964,88 a12.450;1.720,50 a20.200. Contraprueba: tabla2023–25 da1.771 en20.200; diferencia50,50 de cuota bruta. No equivale a diferencia final de deuda. Se inspeccionaron visualmente tabla y DF7 del BOE, sin tachaduras en los pasajes relevantes. No se trasladará la excepción por fallecimiento de DF3.2 del DL4/2023: no aparece en DF7 de2026.

**Extremadura2018.** Original Ley1/2018 DA2.Uno, BOE-A-2018-1918 p46 (también inspección visual), y TR2018 BOE-A-2018-8159 art1 p8 publican9,50. DF4 de Ley1/2018 p53 fija enero2018; sus excepciones son DA1 y DA2.Dos, no DA2.Uno. HTML histórico del TR2013 conserva10,50 junto a1.182,75: conflicto real, no corrupción del hash. La contraprueba12.450×10,50%=1.307,25 refuta la coherencia del consolidado, pero la preferencia normativa se apoya en los originales. Código actual: `irpf-autonomico-2018.ts:174`,9,5. No cambiarlo.

**Cataluña2020–2024.** Ley5/2020 art87, BOE p62; Ley2/2021 art41, pp46–47; DL1/2024 art611-1 p6. Los originales publican cuotas que no se recuperan exactamente integrando tipos. Código actual2020: `irpf-autonomico-2020.ts:199`;2022: `irpf-autonomico-2022.ts:149`. El cálculo `escalas-gravamen.ts:48` suma tramos, y `liquidar-irpf-anual.ts:372` lo usa para cuota autonómica; la resta del mínimo pasa por la misma escala en línea460.

Ejecuté aritmética independiente con Decimal, entradas transcritas personalmente de originales y sin usar los vectores del autor. Base90.000 en2020: publicada15.908,31; integral15.908,316, half-up15.908,32. Con mínimo5.550, quedan15.242,31 frente15.242,32. Base21.000 en2022: publicada2.399,10; integral2.399,106; después del mínimo5.550:1.816,35 frente1.816,36. Esto descarta que el mínimo cancele siempre el céntimo. **No se ha ejecutado liquidarIRPF ni demostrado una deuda final del motor**. `casos.json` separa aritmética ejecutada, lectura estática y contratos de prueba propuestos. La corrección requiere primero un test fallido, incluyendo frontera±0,01, exceso y mínimo, sin inventar truncamiento por tramo universal.

**Cataluña mínimo2020.** Ley5/2020 art88.b p62 dice6.105, condicionado a suma de bases liquidables general y ahorro≤12.450. STC186/2021, BOE-A-2021-19515 p13, FJ3D y fallo: nulidad con protección frente a revisión de obligaciones devengadas a su amparo. La referencia a6.150 en un antecedente no reemplaza el precepto. El alias `minimos-autonomicos-2020.ts:68` usa mínimos estatales; el resolutor no recibe situación procedimental. El texto primario permite aceptar la historia, pero no decidir aquí una semántica del producto ausente. Propuesta: especificar reconstrucción histórica protegida, distinguirla de nueva liquidación y probar umbral con BLG+BLA, antes de modificar mínimos. No usar la nulidad como borrado retroactivo de la historia.

## Etapas y condiciones que cierran objeciones

- Castilla-La Mancha: Ley18/2010 art único y DF2; Ley9/2014 art1, DT1/DT2 y DF3. Las transitorias entran tras publicación DOCM15/12/2014 y regulan exclusivamente2014, pese al BOE de2015. Tabla desde2015 es otra. Los mínimos descendientes de2014 no se prolongan por semejanza.
- Castilla y León: Ley19/2010 DF13 da efectos de escala desde2010 aunque entrada general2011; refundición2013 conserva tabla. Ley10/2014 art1bis contiene mínimos propios, no mera remisión estatal; DF16 enero2015. Ley7/2015 art1.1 y DF12 introducen escala2016. Ley2/2022 art1.1 expresa enero2022. El resto7.750 de la fila12.450 aparece en original2016.
- Galicia2014–15: art67.Uno Ley11/2013 distingue BLG≤17.707,20 (11,5%) y superior (primera tasa12%). **DF4 excluye art67 de la vigencia anual:** permite persistencia2015 hasta reforma2016. No suavizar el salto. En el código2014 el selector usa BLG (`irpf-autonomico-2014.ts:289`) y la liquidación reutiliza la escala para el mínimo: no volver a seleccionar por cuantía de este.
- Galicia2022: Ley18/2021 publica inicialmente9,4%; Ley7/2022 arts1–2 sustituye escala y añade mínimos; DF4 p125 retrotrae ambos a01/01/2022. No convertir fecha de publicación BOE11/03/2023 en ejercicio aplicable. La variante inicial se conserva como historia, no como liquidación final2022.
- Extremadura2013–14: DTúnica.2 Ley6/2013 exige persistencia del gravamen complementario; se reextrajo personalmente BOE-A-2013-13616 p75, art64 de Ley22/2013, que extiende expresamente a2014. La excepción por fallecimiento de DTúnica.3 trata deducciones derogadas, no la tarifa. DF4.a da efectos enero2013; Ley1/2015 DF5.a sustituye desde enero2015.
- Extremadura2023: original DL4/2023 DF3 separa efectos enero y fallecidos anteriores a entrada15/09; convalidación DOE-e-2023-90275 y corrección DOE-e-2023-90266 examinadas en HTML original. No confundir fecha civil con instante UTC en futuros tests.
- Cataluña: reforma2020, reforma2022, refundición2024 y reforma2025 son etapas separadas. DL5/2025 art3.1 expresa enero2025; la publicación BOE identifica convalidación201/XV, DOGC14/05/2025. Persistencia al corte2026 no garantiza normas posteriores al29/10.

La matriz completa conserva las25 etapas, incluidas las refundiciones sin cambio numérico. El historial específico de los artículos se extrajo de nuevo desde los HTML originales guardados; se usa para identificar reformas, nunca para sustituir originales. Las21 peticiones históricas no se interpretan como21 fechas de entrada en vigor. El estándar razonable para persistencia combina historial específico, originales sucesivos, disposiciones temporales y correcciones conocidas, sin exigir demostrar ausencia universal en todo boletín.

## Correcciones, duplicados y objeciones descartadas

Comprobados directamente los originales de las nueve correcciones de la ampliación del autor. Galicia2014: presupuestos, no art67. Galicia2016: tasas y vacaciones, no art1. Galicia2022 (Ley7/2022): BOE-A-2023-7334 corrige otros preceptos, no arts1–2/DF4. Cataluña2020:5901,6424 y15177; en5901 pp7–8 el artículo87 citado pertenece al texto de función pública modificado por art103, no al art87 IRPF. Cataluña2022:4851 y6905 modifican tasas, bomberos, urbanismo y otros preceptos, no art41. Extremadura2018:DOE-e-2018-90261 cambia tasas veterinarias, no DA2.Uno. Castilla y León2016:BOCL-h-2016-90285 elimina una coma en DA1 sobre minas, canteras y túneles, no escala. Extremadura2023: corrección afecta ayudas y créditos, no escala/DF3.

Además descargué mediante `tools/procedencia/descargar.py` la corrección de Ley18/2021, DOG17/02/2022 pp11653–11657. Leídas las cinco páginas: tarifas portuarias y preceptos administrativos ajenos a escala/DF5. Original, hash y citas completas en `correccion-galicia-2022.json`. La búsqueda adicional sobre Ley2/2026 extremeña no aportó corrección de su escala; no se confunde con Ley2/2026 madrileña de vivienda. No se declara inexistencia universal de correcciones.

No se exige recuperar indiscriminadamente cada duplicado regional si existe original BOE con referencia a publicación regional, cadena coherente y ninguna contradicción localizada. Se utilizó duplicado DOE2026 para la novedad prioritaria. Esta decisión no autentica firmantes ni libera de investigar una contradicción futura. Los resultados `pdfsig -nocert` del autor **no se aceptan como identidad confiable del emisor**; no he repetido validación de certificados, OCSP ni sellos temporales.

## Ejecución, estado actual y límites

Se comprobó memoria inicial:11.290MiB totales,8.465MiB disponibles. Un único proceso de extracción por vez, sin build ni suite legacy. Nix/uv, sin instalación global ni cambio de node_modules. No se escribió Effect, motor, tests mantenidos ni VCS. Solo carpeta de revisión y scratch propio. No se repararon metadatos.

`integridad.json`:110 adquisiciones candidatas contrastadas personalmente por SHA256 y tamaño. `control.json`:167 filas y2.263 citas de bloques comprobadas; originales PDF abiertos personalmente. Las diferencias iniciales al usar `get_text(clip=...)` desaparecen con el método declarado por el autor, `get_textbox`: los dos métodos tienen distinta selección de caracteres y espacios; no se acusa corrupción por esa diferencia. `citas-refinadas.json` preserva páginas completas en los pasajes prioritarios para no separar tabla, título y ámbito. Inspección visual de seis páginas prioritarias; **no inspección visual de cada página de todos los boletines**. Los hashes acreditan integridad respecto a adquisición, no autenticidad ni vigencia.

`codigo-observado.json` fija huellas del código actual leído o inventariado; una huella de archivo no acredita revisión semántica de todas sus líneas. La revisión del código se concentra en resolutor2026, selección gallega, mínimos catalanes, tablas de los candidatos y ruta de cálculo. No se han ejecutado75 liquidaciones ni551 vectores ajenos. La cobertura anual es documental y queda explícita así en cada fila.

Se distingue la foto original de la actual: no se rechazan huellas antiguas por la integración de lint. Madrid2020 y explicación de año corregidos por el padre no pertenecen a este ámbito y no alteran los nueve dictámenes. Los mecanismos del inventario y corpus no se usan como autoridad fiscal ni como aceptación automática.

Reproducción de trabajo propio: scripts `extract.py`, `pages_review.py`, `history.py`, `visual.py`, `extra.py`, `new_extract.py`, `cases.py` y `deliver.py` en `.cache/procedencia/revision-cadena-autonomica-b/`. Ejecutar con Python Nix; para PDF, uv `--python` al Python Nix, `--with pymupdf`, y biblioteca runtime C++ Nix en `LD_LIBRARY_PATH`; HTML usa `--with beautifulsoup4`. Las pruebas propias cubren aritmética y extracción; no incluyen regresiones ejecutadas contra el motor.

Comprobación adicional terminada: `control-filas-pdf.json` reextrae156 citas de filas y sus celdas (780 cajas), sin diferencias mediante `get_textbox`. Junto con2.263 bloques son3.043 cajas. Esto verifica reproducibilidad geométrica/textual; no convierte las167 filas HTML en167 reglas fiscales aceptadas. El script propio `check_rows.py` tuvo un intento fallido al reutilizar un TextPage cuyo objeto Page había expirado; se corrigió conservando Page y la ejecución final terminó correctamente. No se modificó ningún original ni cita del autor.
