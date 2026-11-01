# Revisión acotada de las correcciones A y E

**Las correcciones E quedan contrastadas favorablemente. La corrección de URL deja un defecto reproducido en enlaces Markdown; requiere un ajuste y recontraste limitado a ese defecto.** No se acepta fiscalmente el lote de 49 deducciones ni se revisan otras regiones, R01–R03, otros esquemas o el arnés D.

Se revisaron los commits `9b3a95009646bd876781425aae68b64cde0ae484` y `3a032fe7c53fe25333d378e081bae1cae4948114` sobre HEAD `b95e56d6edc6c53ad68e41cd03e23ec85a6f073b`, incluyendo CONTRASTE y la revisión E original conservada en `8735223356240125b12e9eaf106a08a079de7695`. No se hicieron fixes ni mutaciones VCS.

## Defecto nuevo: parámetro sensible vacío dentro de Markdown

**Prioridad media.** En `scripts/procedencia/deducciones-2025/verificar.py`, `privacidad` reconoce URL mediante `https?://[^\s<>\"]+`. Al analizar `Documento: [norma](https://example.invalid/norma?%54OKEN)`, incorpora el paréntesis Markdown final a la URL. `parse_qsl` devuelve el nombre `TOKEN)` y el conjunto de parámetros prohibidos no lo detecta. La reserva se admite. También sucede con `?session)`.

La misma URL sin el envoltorio Markdown se rechaza correctamente. El caso es una reserva en prosa con enlace convencional y parámetro codificado o vacío, dentro del alcance de la corrección; no depende de un esquema ajeno. No se ha demostrado una filtración de credenciales reales. El contrato promete rechazar esos nombres incluso sin valor.

[Casos independientes](casos-url.py) reproduce dos rojos y dos controles verdes sobre un paquete A válido, sin modificarlo. Termina con salida 1 mientras persista el defecto. Los diagnósticos de los controles rechazados no contienen la URL ni el nombre codificado recibido.

Decisión: corregir el reconocimiento de los límites del enlace para comprobar su destino sin incorporar el delimitador Markdown. Conservar URL legítimas y los controles actuales. El recontraste necesario se limita a estos casos y sus regresiones; no exige repetir las correcciones favorables.

## Decisiones sobre los hallazgos anteriores

| Hallazgo | Evidencia independiente | Decisión |
| --- | --- | --- |
| Incendios Galicia | Encabezado en 387, art. 5.Dieciséis; cuantía por tipos medios en 388 antes de eficiencia energética, que empieza en y=208,93 | Sustitución correcta |
| Deportistas Galicia | Encabezado y art. 5.Diecinueve en 390, desde y=397,69; cuantía por tipos medios en esa página; aldeas modelo comienza en 391, y=165,73 | Sustitución correcta |
| ELA Galicia | Encabezado y art. 5.Veinticuatro en 399, desde y=446,53; cuantía por tipos medios en 399; libros comienza en 400, y=81,73 | Sustitución correcta |
| Bicicletas | Art. 32.13, sección 504 entre y=194,53 y 631,38; después comienza rehabilitación; 505–506 no sustentan bicicletas | Referencia limitada a 504 correcta |
| Celiaquía | Art. 32.20, sección en 520 desde y=366,13; 521 comienza con intereses hipotecarios | Referencia limitada a 520 correcta |
| Positivo sintético ambiguo | Ahora usa descendiente común, mínimo y dos titulares expresos; conserva 125 por titular | Rectificación de prueba justificada; no demuestra un error financiero previo |
| Certificado con diagnóstico futuro | Reproducción histórica con emisión 1/1/2025 y diagnóstico 31/12/2025: antes devuelve parcial 250 y falla la aserción; ahora rechaza y pasan los controles originales E | Arreglo correcto de coherencia del soporte |
| URL en reserva y prosa | Los tres rojos de A se reproducen sobre bytes anteriores; ahora pasan. Userinfo y parámetros sensibles codificados/vacíos se rechazan; URL oficial DOGC con `/home/` permanece admitida | Corrección original contrastada, con defecto residual Markdown descrito arriba |
| Fecha nula en schema | Norma nula antes admitida por schema aislado; ahora rechazada. Manual nulo requiere reserva no vacía. Clases normativas y reservas ausentes, vacías o de espacios se rechazan | Corrección coherente con runtime en el ámbito cambiado |

El PDF comprobado tiene 635 páginas y SHA256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. Se reextrajeron los literales y se inspeccionaron visualmente las cinco páginas corregidas; se leyó el contexto de encabezados anterior y posterior, sin usar pies de página como títulos de sección. Las 1.048 citas actuales pasan además el cotejo literal con SHA256/SHA512 y tamaño de sus originales. Esto no acredita exhaustividad jurídica.

El art. 1.Cuatro de la [Ley 9/2025](https://web.larioja.org/bor-portada/boranuncio?n=38181676-5-HTML-574314-X) exige certificado de diagnóstico definitivo e identificación del médico activo, con fechas de emisión y diagnóstico. La DF única.2 atribuye efectos expresos desde 1/1/2025 a esta deducción. Ambos pasajes se reextrajeron del original fijado del lote. El acceso web adicional no respondió; el contraste se sostiene en los bytes oficiales conservados. La ley no enuncia literalmente la desigualdad entre fechas: su rechazo es una inferencia de coherencia del certificado, no una condición tributaria añadida ni una exigencia de emisión en 2025.

Los [casos propios de celiaquía](casos-celiaquia.ts) comprueban doce combinaciones de dos titulares, dos modalidades y tres pares de fechas: diagnóstico posterior rechazado, mismo día admitido y diagnóstico de 2025 certificado en 2026 admitido. Cada titular obtiene parcial 125 cuando corresponde; el agregado rechaza esos parciales también en conjunta. No se suman como total de declaración.

## Validación y límites

Se ejecutaron los casos originales E antes y después, los tres casos de A antes y después, y las 47 regresiones Python, todas conformes tras los cambios salvo los dos casos Markdown nuevos. La selección Vitest ejecutada pasó **166 pruebas en seis archivos**: E, correcciones E, contratos de deducciones, contrato documental, catálogo autonómico y ámbito. Se registra el conjunto efectivamente ejecutado, sin identificarlo artificialmente con la cifra histórica de 159. Los doce casos propios de celiaquía pasan.

HEAD y los 15.381 archivos versionados se cotejaron físicamente con la base antes y después; no hay cambios versionados previos ni ajenos. La entrega pública se limita a esta carpeta. Evidencias, versiones anteriores, transporte, manifiesto y comprobación del patch quedan en el área privada solicitada. Un caché Python generado durante la reproducción se registra allí como efecto incidental fuera de la entrega, sin limpieza ni cambios de fuentes.

El resultado favorable de E y de la restricción de fecha nula no pide otra ronda. Subsisten las reservas normativas previas; esta revisión no las convierte en conformidad fiscal completa. Solo el defecto Markdown nuevo justifica corrección y recontraste.
