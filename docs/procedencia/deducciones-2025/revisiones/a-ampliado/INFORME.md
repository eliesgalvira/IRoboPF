# Revisión A ampliada — documentación 2025

Candidato examinado: `6301c8da457ced81c348bdb10d8e5e04f67ec7fe`. Contraste de ampliaciones: `937ea5d504755a337274e420e5123d2b492ef1c6`. Se entregan [49 decisiones individuales](decisiones.json): 48 descripciones concordantes en el alcance expresado y una diferencia documental reproducida. Son resultados para recepción del padre, sin autoaceptación ni validación de liquidaciones. No se modifica producto ni documentación de otros autores.

**AAMP-01: atribución incorrecta de ocho citas.** El expediente `andalucia_donativos_finalidad_ecologica` etiqueta `CA-andalucia-274` a `279`, `281` y `282` como artículo 22. Su encabezado real en los bytes fijados es **22 quater**, sobre celiaquía. Estas citas entran también en la cadena de cobertura y en las proposiciones para cálculo. La coincidencia literal del texto no acredita su atribución. El original BOJA del artículo 22 y la sección propia del manual sí respaldan 10%, máximo 150 euros, entidades y certificado. Se debe sustituir o retirar únicamente la atribución ajena; no cambiar esa cuantía. [Hallazgo y corrección mínima](hallazgos.json). No se ha demostrado un fallo de cuota en la API actual por este defecto.

Las nueve rectificaciones nuevas se observan en las fichas: alternativa VPO/edad; habilitación y pago individual del alquiler andaluz; acogimiento de 90 días; residencia aragonesa en ambos años; autorización educativa y reparto de guardería; incompatibilidad adopción/acogimiento catalana; vías y reparto del alquiler; exclusión de elegibles al artículo 89.A; facturación autónoma en ángel inversor. Se conservan las tres minoraciones de ayudas tras el tope y las cinco ampliaciones catalanas previas. No se reabre lo corroborado sin cambio.

El alquiler andaluz conserva 1.200/1.500 euros desde 1/1/2025: DF novena.1 y DF decimoctava.b de Ley 8/2025, que incluye los apartados uno a cinco. Tampoco se restaura la renta suprimida en nacimiento. La residencia aragonesa de 600 euros corresponde a 160-2.8 bajo 160-1; el pago bancario a DA segunda, no a 110-1. La excepción de parentesco en dependencia cede al siguiente grado cuando el más cercano tiene rentas no superiores a 8.000 euros. Para mayores de 70, la sección propia del manual exige trabajo o actividad económica y considera capital las ganancias no derivadas de transmisión; no queda abierta esa interpretación en el manual fijado.

En vivienda se distingue el 68.1 histórico de vivienda del 68.1 vigente de inversión empresarial. Los originales RDL 20/2011, Ley 16/2012, RD 960/2013 y RD 861/2008 permiten reconstruir bases 9.040/12.080, DT18/DT12, patrimonio, reinversión y rehabilitación estructural superior al 25% excluyendo suelo. Un consolidado pedido con fecha histórica cuyos bytes son posteriores no sustituye esa reconstrucción. La exigencia del régimen transitorio estatal de 613-1 no se extiende automáticamente a toda deducción autonómica de vivienda. Cooperativas conserva mantenimiento de las condiciones 2.1/2.2 durante cinco años y excepciones de reinversión/transmisión; no se importa el límite por vivienda de 612-3 a 612-11. Los originales regionales y las dos correcciones BOA incorporados no justifican cambiar esos resultados.

**Reserva de Orden VEH/192/2018 resuelta en esta entrega.** Se ha recuperado el [PDF oficial español de DOGC 7750, 1712225](https://portaldogc.gencat.cat/utilsEADOP/PDF/7750/1712225.pdf), tres páginas y 48.768 bytes. [Metadatos y hashes](fuentes-complementarias.json), [once citas reextraíbles](citas-complementarias.json). Artículo 1 aprueba el modelo 993; artículo 2 delimita entidades receptoras; artículo 3 remite al anexo; artículo 4 establece presentación telemática y plazo 1–20 de enero por el año natural anterior. La disposición final da entrada a los veinte días de publicación. El anexo concreta tipo de donación, identificación de entidad y donante, representante cuando proceda e importe. Esto cierra la reserva de procedimiento de las tres deducciones catalanas de donativos; sus porcentajes y entidades habilitadas siguen procediendo de 612-6/7/8. No se usa la página ATC como sustituto de toda la orden. Los originales permanecen fuera del repositorio y no se modifica el paquete revisado.

Las decisiones separan ficha, evidencia y cálculo. La concordancia se refiere a las magnitudes y condiciones individualizadas, contrastadas con artículo y sección propia del manual; no convierte todas las citas auxiliares compartidas en requisitos aplicables a cada código. El control semántico automático adicional cubre 436 atribuciones únicas de los tres consolidados; no certifica por sí solo todas las etiquetas de todos los originales. Cada decisión deja una obligación concreta de hechos, fronteras, reparto, vigencia y procedencia para el propietario de la ruta única. Los contraejemplos históricos de `b95e56d6` no se presentan como fallos de la API actual. No se añade un evaluador regional ni se acredita una liquidación con sondeos de consignación.

Verificación realizada:

- 75 pruebas focalizadas del autor: verdes; tipos y ESLint focalizados: sin errores.
- Reextracción del autor: 47 documentos, ambos hashes y tamaño, 4.078 citas: correcta.
- Suite externa independiente: 48 documentos íntegros, once citas complementarias y 436 atribuciones únicas; reproduce las ocho atribuciones incorrectas de AAMP-01.
- Regresión ordinaria independiente: dos positivos y un rojo documental conservado. No necesita CAS, red, caché ni objetos Git históricos.
- Cotejo físico completo inicial/final contra HEAD, enlaces como enlaces; transporte POSIX y reconstrucción exacta sin Git documentados privadamente. Cero cambios a archivos preexistentes y cero borrados.

Desde raíz, con dependencias del proyecto instaladas:

```sh
bun run test tests/deducciones-procedencia-2025-a.test.ts tests/deducciones-procedencia-2025-a-evidencias.test.ts --maxWorkers=1
python3 docs/procedencia/deducciones-2025/revisiones/a-ampliado/casos.py
```

El segundo termina con salida 1 mientras AAMP-01 persista. Las suites de corpus son **externas opcionales**, no requisitos de tests ordinarios. Con PyMuPDF 1.26.7 y beautifulsoup4 4.14.3 instalados en entorno aislado:

```sh
python3 docs/procedencia/deducciones-2025/lotes/a/verificar.py --cas "$CAS_AUTOR"
python3 docs/procedencia/deducciones-2025/revisiones/a-ampliado/corpus.py --cas "$CAS_AUTOR" --cas "$CAS_COMPLEMENTARIO"
```

Se puede repetir `--cas` para varios almacenes. La última orden conserva salida 1 por las ocho atribuciones. Los logs, originales nuevos, manifiesto antes/después, patch y prueba de reconstrucción se entregan al padre por el transporte privado. No se repite CI global ni se altera el resultado verde comunicado para el candidato.
