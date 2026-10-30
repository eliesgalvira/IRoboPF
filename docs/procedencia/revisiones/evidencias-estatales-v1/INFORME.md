# Revisión independiente de evidencias estatales v1

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Decisión: conservar las 319 correspondencias como candidatos históricos comprobados numéricamente; ninguno queda autorizado para registro o aceptación fiscal por este informe. Las 26 celdas de base y cuota permanecen bloqueadas por falta de exposición efectiva en la versión examinada. La identidad del helper canónico ausente no se sustituye por una hoja legacy.

Base examinada: c61a306107f280c399eb57e57a7c45452bd68864. La entrega corresponde a ed6a43fd750de05609abc3710dabdc2f8261020c y snapshot babfc930e2c4096600e68895d13bbfae23c996bacd3ba7fbd376ae32f8713c68; ese desfase declarado no es un defecto. Se examinaron el informe de coherencia-ronda9 y el informe estatal, y se procesaron íntegros cobertura, payloads y citas. Los bytes del inventario histórico se recuperaron de objetos por contenido; las fuentes históricas, de los blobs versionados.

## Resultado reproducido

`reextraer.py` terminó con código 0: 319 payloads, 83 citas (81 numéricas y dos de contexto), 13 PNG, siete originales y 26 celdas. Se comprobaron SHA-256, SHA-512 y tamaño de los originales, hashes de referencias y fuentes históricas, página, MediaBox/CropBox/rotación, texto exacto de cada caja, coordenadas de cada palabra numérica, offsets de número/unidad, igualdad Decimal, identidad de archivo/símbolo/ruta/ocurrencia y receta PNG a 144 dpi con PyMuPDF 1.26.7. Los 13 PNG regenerados coinciden byte a byte; no se escribieron imágenes nuevas. El manifiesto y gzip históricos coinciden con sus hashes. No se ejecutó una reconstrucción del motor ni el coordinador actual.

`decisiones-319.json` contiene una decisión por payload con hash, año, unidad, valor, identidad, cita, decisión previa íntegra, objeción, coste y pendientes. Hay 266 mínimos, 42 metadatos de reducción y 11 gastos legacy. La puerta de archivo pasa en 76 (57 históricos y 19 de 2025); falla en 243. Esta puerta no comprueba por sí sola el alcance semántico. Los 319 enlaces quedan bloqueados, incluidos los 76: no confundir archivo referido con aceptación de correspondencia.

Integridad comprobada no significa autenticidad: no se verificaron PAdES, CSV, confianza histórica ni sello externo. Interpretación limitada a cuantía nominal y pasaje; exactitud limitada a la hoja efectiva del inventario histórico. No se certifican consumo canónico, elegibilidad, cálculo anual ni liquidación. MIN-012 acredita importes históricos con sus límites; MIN-013 acepta el texto de reforma, no todos los aliases. TDE acepta afirmaciones nominales acotadas, no cada enlace ni el helper canónico. Ningún resultado se autoacepta fiscalmente.

## Hallazgos y decisiones refinadas

**ESTV1-01, precisión documental de las 26 celdas:** los offsets de unidad seleccionan un «euros» ajeno a la cabecera de su tabla. Ejemplo ordinaria fila 1 cuota: número 2.124,86, unidad en offset 269, dentro del mínimo por discapacidad; complementaria fila 1 cuota: 132,80, unidad en offset 2217, dentro del pasaje de anualidades. Es integridad literal correcta con asociación semántica débil. La inspección visual confirma EUR y no demuestra una cifra fiscal equivocada. `unidades-refinadas-26.json` conserva los 26 contextos y la propuesta: selector geométrico de «Hasta euros» para base y «Euros» para cuota, ligado a su columna. No alterar mayúsculas en el original para satisfacer el lexer. Objeción experta: cualquier palabra euros de una página no acredita la unidad de cualquier número. Coste: precisar selector/contrato y nueva revisión del payload, manteniendo bloqueada la integración. No se atribuye este problema a las 319 hojas, que no incluyen dichas escalas.

**ESTV1-02, contexto partido de discapacidad histórica:** la página 62 de BOE-A-2010-19703 empieza el apartado 60.2 y la 63 continúa sujeto, requisitos y cuantía reforzada. Las citas aisladas de 7.038 y asistencia 2.316 en p63 requieren relacionar también p62; el literal numérico y el sujeto inferible no bastan para presentar la regla completa. `pasajes.json` conserva ambas páginas reextraídas. Decisión: cita nominal utilizable con contexto compuesto, no aceptación de condiciones. Coste: relación entre pasajes y revisión del selector compuesto.

**ESTV1-03, identidad anual y alcance:** se comprobó en Git histórico cada alias de 2015 a 2024: exporta directamente MINIMOS_ESTATALES_2025. Es una relación técnica concreta, no prueba de continuidad normativa. No se amplía MIN-013 ni se cambia engineLocations para obtener verde. El año de un payload expresa la afirmación propuesta; no acredita por sí mismo vigencia. Coste: documentar modificaciones y continuidad por ejercicio y revisar cada enlace exacto.

**Bloqueos previos confirmados, sin presentarlos como defectos nuevos:** CAS no integrado con el puente de esta base; 26 bases/cuotas y seis límites canónicos sin hoja efectiva; 13 tipos sin exposición/conversión; decisiones TDE sin engineLocations; 2018 transitorio y 2026 fuera del cierre del lote. La matriz completa se conserva en `cobertura-revisada.json`. No se atribuye a esta revisión cobertura jurídica adicional por copiarla.

## Inspección visual personal por pasaje

Se abrieron personalmente los 13 PNG completos mediante view_image. Se cotejaron cifras, sujeto, columna y encabezado. El hash completo y ruta están en `pasajes.json`; aquí se identifica por prefijo inequívoco:

| PNG | Pasaje examinado y decisión |
|---|---|
| af9e1038 | BOE 2010 p60: artículo 20, 9.180/13.260/4.080/2.652 y condición 6.500; distinguir del artículo 32 de p61. |
| 3be0721c | BOE 2010 p61: artículo 61, efectos 2011, mínimo 5.151 y adicionales 918/1.122; los importes del artículo 32 arriba no son la cita de trabajo. |
| a3f56f00 | BOE 2010 p62: descendientes 1.836/2.040/3.672/4.182/+2.244, ascendientes 918/+1.122, discapacidad propia y comienzo familiar. La continuación importa. |
| a8aa98f5 | BOE 2010 p63: continuación discapacidad; tabla ordinaria con seis filas. Se distinguen base, cuota, resto y porcentaje, y el mínimo por fallecimiento ajeno a la tabla. |
| 2b960ccb | BOE 2011 p53: siete filas de gravamen complementario general, ejercicios 2012–2013; no confundir con ahorro inferior ni retenciones siguientes. |
| 44647b1f | BOE 2014 p12: defensa 300, otros gastos 2.000, incremento por movilidad también 2.000, discapacidad activa 3.500/7.750; artículo 20 separado con 11.250/14.450/3.700. |
| 6a9e0295 | BOE 2014 p27: 5.550/+1.150/+1.400 y descendientes 2.400/2.700/4.000/4.500/+2.800. No tomar límites de previsión social de arriba. |
| 9dac076b | BOE 2014 p28: ascendientes 1.150/+1.400, discapacidad propia y familiar 3.000/9.000/+3.000; dos sujetos aunque coincidan cifras. |
| b83f068d | BOE 2018 p77: 13.115/16.825/5.565, efectos de entrada en vigor; comienza transitorio 2018. No acredita aplicación uniforme a todo ese ejercicio. |
| f7062564 | BOE 2022 p84: efectos 2023, 14.047,5/19.747,5/6.498; no mezclar artículo 96 que sigue. |
| 0a164092 | BOE 2024 p23: artículo 3 con efectos 2024, 14.852/17.673,52/19.747,5 y 7.302/2.364,34. El efecto 2025 del IVA superior es distinto. |
| 97badfbf | BOE 2013 p75: artículo 64, efectos 2014 y tabla general prorrogada de siete filas. Es el contexto temporal pertinente. |
| 4407d217 | BOE 2013 p76: tabla ahorro y tabla retenciones; cifras iguales a general no permiten intercambiar identidades. |

## Casos propios y límites de ejecución

`discriminantes.py` terminó con código 0: 13 casos. Comprueba mismo 17.707,20 en ordinaria/complementaria pero distinta identidad; mismo 9.000 para discapacidad propia/familiar pero distintas cajas; diez aliases anuales directos; y diferencia entre cuota publicada e integral sin redondear: 17.707,20 × 12 % = 2.124,8640 frente a 2.124,86 publicado, y × 0,75 % = 132,804000 frente a 132,80. No se usa esta diferencia para cambiar reglas de redondeo. Son controles documentales discriminantes, no tests del motor ni regresiones fiscales rojas. No hubo correcciones numéricas ni cambios del oracle.

Evidencia pendiente concreta: cabeceras geométricas de las 26 celdas; enlace compuesto p62–63; continuidad anual de mínimos y fuentes que la acrediten; identidad efectiva y consumo de tablas/helper canónico; conversión porcentual revisada; CAS resoluble por coordinador; contrato explícito del alcance TDE; comprobación fresca del payload que el padre decida integrar; autenticidad histórica de siete originales. Para transitorio 2018 falta completar el pasaje siguiente y su contrato; para 2026 no se extrapola este lote.

## Comandos y entrega

Reproducción desde cualquier directorio (rutas fijas de esta revisión):

```sh
flock /tmp/irobopf-validacion-pesada.lock nix develop path:/home/elies/Repos/IRoboPF/tools/procedencia --command env PYTHONDONTWRITEBYTECODE=1 /home/elies/Repos/IRoboPF/tools/procedencia/.venv/bin/python /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-estatales-v1/reextraer.py
nix shell nixpkgs#python3 -c python /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-estatales-v1/discriminantes.py
```

Un intento inicial de importar PyMuPDF fuera del shell Nix falló por libstdc++.so.6; dentro del entorno fijado funcionó. `rg` no estaba disponible y se usaron lecturas/listados estándar. Ruff y mypy se ejecutaron sobre los instrumentos de revisión; resultados finales en validacion.log. No se escribió Effect ni código de producto; no procede lint/typecheck de aplicación. La reextracción y renders fueron secuenciales bajo flock. Una primera comprobación mypy del instrumento se lanzó sin flock por error operativo; la final se serializa. No hubo Next build, suites legacy, descargas ni gasto.

Solo se escribieron archivos bajo esta carpeta absoluta de revisión. No hay patch de producto porque no se implementó ningún fix. `manifiesto.json` enumera archivos entregables, SHA-256, tamaño y baseSha256 (null para nuevos); se excluyen cachés de herramientas. El propio manifiesto no se incluye circularmente. Estas decisiones no constituyen registro ni atestación.

Control final de base: 5.281 archivos enumerados mediante git ls-tree, cero ausentes en el checkout. `decisiones-citas-83.json` añade la decisión editorial por cita, separada de la reextracción. No se repitió el validador JSON Schema ni se simuló una aceptación del coordinador.

Mypy detectó en el script discriminante reutilización de nombres de variables de texto para productos Decimal. Se conservaron los diagnósticos en `tipos-primer-intento.log` y se renombraron las variables del instrumento. No cambió ningún resultado ni archivo de producto; se repitieron Ruff, tipos y los 13 casos bajo flock.
