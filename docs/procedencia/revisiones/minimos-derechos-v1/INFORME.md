# Revisión de mínimos por derechos v1

**Requiere cambios.** Se conservan tres defectos reproducidos sin fixes: renta propia no conciliada, edad de adopción calculada solo por años y entrada anual que permite omitir la especialidad de alimentos. El reparto básico de CX-06-A funciona en la ruta nueva, pero eso no permite aceptar toda la elegibilidad ni cerrar el contrato anual.

Revisor: agente Codex de esta sesión, checkout T3 t3-cdbbbec4, revisión personal el 29-10-2026. Sin subdelegación ni operaciones VCS mutantes. HEAD y base son 65cff4fd8eb8c6269c2ce97b88e770aa711bff7f. Se comprobaron las 9.391 entradas de base mediante lstat y readlink para enlaces: cero ausentes y cero cambios de bytes frente a blobs de base. Diff versionado vacío. El detalle comprimido está en base.json.gz. node_modules es exclusivamente el enlace de lectura autorizado.

Se leyeron BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO y DECISIONES, integración-ronda13, implementación minimos-derechos, auditoría y revisión anteriores de mínimos y correcciones-x-v1. La revisión publicacion-cuota-v2 contextualiza el cierre técnico de ronda14; no se repite ni se hereda su aceptación. Se examinaron derechos-contrato.ts, derechos.ts, caso-fiscal-anual.ts, liquidar-irpf-anual.ts, las tablas utilizadas y sus pruebas. Solo se entrega esta carpeta; no se cambia código, oracle, informes ajenos, registro, confianza ni atestaciones.

## MDV1-01 — Alta: renta propia duplicada sin conciliación

Localización: liquidar-irpf-anual.ts, validación de derechos desde línea 191; derechos.ts, titularesConDerecho y datosTitulares.

El contribuyente s-1 declara renta no exenta cero en su relación con el hijo. El mismo caso anual tiene exclusivamente trabajo bruto de 30.000 euros, sin pérdidas ni exenciones. La API calcula rendimiento neto muy superior a 8.000 y aun así da Success. La renta cero provoca que el mínimo pase al abuelo de grado 2. datosTitulares solo compara repeticiones dentro del censo familiar; nunca compara con el rendimiento del propio caso. No se trata de verificar documentos externos: son dos afirmaciones contradictorias dentro de la misma entrada.

La renta normativa no es bruto ni base liquidable. Debe conciliarse el saldo algebraico de categorías netas no exentas antes de integración/compensación y reducciones, con la salvedad del trabajo explicada por AEAT. El contraejemplo no tiene categorías ausentes que puedan justificar un saldo cero. Fuente: art.61.1 y Manual 2025, requisitos c), precisión de renta.

Acción: derivar el dato del contribuyente desde los hechos anuales conciliados, o rechazar la contradicción; si el contrato anual no puede acreditar exhaustividad, rechazar esa concurrencia o explicitar una entrada conciliada antes de calcularla. No validar la mera repetición de la cifra.

Objeción experta: el motor anual sigue siendo parcial y tampoco debe identificar renta con base liquidable. Respuesta: el rojo exige rechazo de una contradicción patente, no una fórmula universal basada en esa base. Coste: definir semántica y precisión monetaria de la conciliación y adaptar consumidores; no basta comparar bruto con renta declarada.

## MDV1-02 — Media: menor al adoptar rechazado por resta de años

Localización: derechos.ts:121–128. Nacimiento 31-12-2007, adopción/inscripción 02-01-2025, devengo 31-12-2025. Tenía 17 años al adoptar y cumple 18 al devengo. La condición 2025−2007>=18 lo rechaza como adopción en mayoría de edad.

El autor excluye deliberadamente adopciones realizadas en mayoría de edad; este caso no pertenece a esa exclusión. No se pide ampliar ese alcance. Es un error de la frontera temporal, con error tipado pero clasificación falsa. Art.58.2 y Manual 2025, cuantías B: primer período y dos siguientes a partir del evento habilitante. El esperado estatal es 2.400+2.800=5.200 euros para un titular. En la API anual, el mínimo estatal total es 10.750; Madrid 5.956,65+2.575,85+3.005,16=11.537,66. Minoración general de control: 10.750×9,5%+11.537,66×8,5%=2.001,9511, presentada como 2.001,95.

Acción: comparar fecha civil completa al evento, conservando el rechazo de adopciones realmente adultas y las validaciones de fecha.

Objeción experta: cumplir 18 en el ejercicio no equivale a ser adulto al constituirse la adopción. Respuesta: se conservan ambos momentos y un control anual; no se elude la exclusión declarada. Coste: comparación civil y regresiones antes/en/después del cumpleaños.

El primer rojo se produjo contra el helper; el pase final lo reproduce primero mediante liquidarIrpfAnualConDerechos. No se exige solo un helper verde.

## MDV1-03 — Alta: la frontera anual admite alimentos excluidos

Localización: derechos.ts:30–34 y 134–139; liquidar-irpf-anual.ts:191 y ruta explícita.

Contribuyente con dependencia económica, sin custodia, alimentos judiciales true y aplicaEspecialidadAlimentos false. El otro progenitor tiene custodia exclusiva. Se excluye correctamente al pagador del mínimo, pero la API anual devuelve liquidación calculada sin representar la cuantía de alimentos ni aplicar/rechazar la especialidad. El flag falso permite atravesar una exclusión que el informe presenta como fuera de alcance.

Fuente: art.58 en conexión con arts.64/75; Manual 2025 requisitos, apartado b), criterios 2 y advertencia TEAC. La especialidad no es una elección libre del pagador sin custodia. Su cálculo depende además de importe y base. Al no tener importe, esta ruta no puede decidir que no produce efecto.

Acción: rechazar en la frontera anual esos hechos del contribuyente hasta disponer de contrato para alimentos. Que otro titular sea pagador no debe impedir calcular la declaración del progenitor custodio. El helper puede seguir determinando correctamente quién tiene mínimo: el defecto está en presentar una liquidación anual de quien necesita la capacidad ausente.

Objeción experta: falta de soporte no prueba por sí sola una cifra incorrecta. Respuesta: el hallazgo es aceptación indebida de un caso fuera de alcance, no una cuota fiscal alternativa inventada. Coste: reducción de entradas aceptadas y futura integración de alimentos; no hay autorización para implementarla en esta revisión.

## Decisiones acotadas y controles

1. **Reparto y orden.** Dos padres con hijos de 8/5 dan 2.550 cada uno; uno solo 5.100. Ensayo propio con 1/2/3/4 titulares mediante helper y API anual. Se ordenan elegibles por nacimiento; un hijo excluido por 8.000,01 no ocupa primer lugar. Objeción: contar titulares no acredita parentescos reales. Respuesta: resultados condicionados al censo aportado y jurídicamente válido. Coste: no certificar hechos ni convertir cuatro titulares sintéticos en afirmación de viabilidad de cuatro progenitores de primer grado.
2. **Rentas, declaración y discapacidad.** Controles propios ±0,01 en 8.000 y 1.800; cumpleaños 25; adulto con discapacidad y exclusión posterior por renta. Art.60 vincula discapacidad familiar al derecho al mínimo. Objeción: tags y dos cifras fiscales no son certificados ni verifican la declaración externa. Respuesta: la preclasificación sigue siendo responsabilidad de entrada; MDV1-01 trata una contradicción interna distinta. Coste: revisión documental pendiente, no aceptación automática por Schema.
3. **Grado y capacidades excluidas.** Prioridad próxima y subida al siguiente a 7.999,99/8.000/8.000,01 pasan. Rentas mixtas y tres grados se rechazan por canal recuperable. Objeción: el derecho material puede existir aunque el motor rechace. Respuesta: capacidad pendiente, no error numérico ni mínimo cero. Coste: estos casos siguen sin liquidación automatizada.
4. **Adopción/acogimiento.** Primer evento 2022 no aumenta en 2025; 2023–2025 sí. El incremento por edad/adopción se suma una sola vez. Temporal, urgencia y guarda judicial aumentan solo por menor de tres en los controles. El primer evento es un hecho declarado: historialCompleto=true no reconstruye acogimientos anteriores. Objeción: una fecha omitida puede reiniciar falsamente el plazo. Respuesta: no se certifica la historia; exigir documentos externos para acreditar esa afirmación. Coste: capacidad probatoria pendiente, además del defecto civil MDV1-02.
5. **Censos, IDs y errores.** Duplicados exactos de sujetos/titulares, fecha imposible, devengo no ordinario, censo incompleto e ID con nombre se rechazan en la API anual como ResultadoNoSoportado. Effect.result no atraparía Die; los controles terminaron sin defectos. Objeción: IDs distintos pueden representar a la misma persona y una lista marcada completa puede omitirla. Respuesta: no hay autenticación ni deduplicación personal externa. Coste: declarar la frontera de responsabilidad. No se propone publicar DNI o datos personales.
6. **Legacy.** Rechaza derechos nuevos; su rastro dice que el perfil parcial no acredita derecho ni reparto. CX-06-A se resuelve para el contraejemplo en la ruta nueva, no mediante dividir universalmente el helper antiguo. Objeción: podrían existir consumidores no examinados que eliminen la advertencia. Respuesta: se prueba API y rastro; no se certifica toda la UI. Coste: coexistencia de contratos y revisión de consumidores futuros.
7. **Alcance excluido.** Conjunta, ascendientes, fallecimientos, tutela/curatela no representadas, grafos sujeto/titular, más de dos grados, grados próximos con rentas mixtas y empate natal con divisores distintos continúan pendientes. Las exclusiones expresas no se clasifican como errores aritméticos. Objeción: una lista de exclusiones escrita no garantiza rechazo. Respuesta: se ensayan fronteras representativas y MDV1-03 documenta precisamente la que se atraviesa. Coste: no anunciar elegibilidad completa Madrid 2025 para toda familia.

## Componentes y ahorro

Para dos hijos y dos titulares: Estado 5.550+2.550=8.100; Madrid 5.956,65+(2.575,85+2.897,83)/2=8.693,49. Con base general suficiente, minoración 769,50+738,94665=1.508,44665, presentada 1.508,45. Son componentes separados; no se divide el conjunto por dos.

Caso propio con trabajo cero, ganancia sujeta al ahorro 20.000 y renta propia declarada 20.000: la API produce BG=0 y BA=20.000. Remanentes 8.100 y 8.693,49; cuotas de mínimo en ahorro 570+2.100×10,5%=790,50 y 570+2.693,49×10,5%=852,81645. Minoración total 1.643,32 y cuota restante 2.436,68 sobre cuota previa 4.080. Pasa por la liquidación real y su rastro, no solo calcularAhorroConMinimos. Se verifica divisor 2, valor autonómico y ausencia del ID del hijo en el rastro.

Objeción experta: estos números no acreditan todo redondeo por casillas ni la calificación de cualquier ganancia. Respuesta: control discriminante de conexión y separación de remanentes sobre hechos simples. Coste: aceptación limitada a las operaciones comprobadas; no revalidación fiscal del motor anual ni de las 98 pruebas citadas por el autor.

## Fuentes, vigencia y erratas

Fuentes primarias leídas personalmente:

- [Ley 35/2006 en compilación oficial AEAT 2025](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/Normativa-IRPF25/Ley-35-2006.pdf), páginas físicas 36–38, arts.58/60/61 y contexto 56/64. Reextracción Poppler en ley-58-61.txt; original ya versionado en correcciones-x-v1, SHA256 95d7f10a386b345af1cb9249821faa0c8bf56a9e7b4c578ac9194c50f9b6bf94. Ambos hashes y tamaño recalculados en original-ley.json. Se cita «su importe se prorrateará entre ellos por partes iguales» (art.61.1). No se inventan coordenadas o facsímiles nuevos.
- [Ley 26/2014, BOE-A-2014-12327](https://www.boe.es/buscar/doc.php?id=BOE-A-2014-12327), art.primero.34/36/37 y DF6: reforma de esos artículos efectiva desde 1-1-2015. Las excepciones de DF6 no desplazan esos apartados. La ficha de análisis consultada no lista corrección de errores de esos preceptos. Esto no demuestra exhaustividad de toda errata histórica. La compilación 2025 corrobora el texto vigente utilizado.
- [Manual 2025: requisitos](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/concepto-requisitos-descendientes.html), apartados a–d y criterio de alimentos. Selector: «sin que en este supuesto tenga la posibilidad de optar». Distingue renta neta de bruto y de base compensada. La referencia a TEAC de 29-5-2023 se ha leído en el manual; no se afirma haber reabierto ambos expedientes TEAC.
- [Manual 2025: cuantías](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/cuantias-aplicables.html), A orden; B incremento y tabla de acogimientos. Selector: «hasta agotar el plazo máximo de tres años». Explica equivalencia desde 18-8-2015 entre acogimiento preadoptivo y guarda preadoptiva. No se usa Modelo145 como norma anual.
- [Manual 2025: condiciones](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/condiciones-aplicacion-minimo-descendientes.html), puntos1/2, fecha de devengo y excepción de grado. Selector: «a los del siguiente grado».
- [Hacienda, Tributación Autonómica 2025, capítulo IV](https://www.hacienda.gob.es/SGFAL/FinanciacionTerritorial/Autonomica/Capitulo-IV-Tributacion-Autonomica-2025.pdf), p.141, mínimos madrileños y referencia a Ley13/2023; [Manual Renta2025](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/ManualRenta2025Parte1_es_es.pdf), capítulo14, p.912. Contraste de cantidades utilizadas, no revisión completa nueva de todos los artículos autonómicos.

La nota116 de la compilación AEAT p.36 dice artículo52 al comentar la reforma de57; el original Ley26/2014.33 identifica57. Es una errata editorial detectada en contexto; no se utiliza para cambiar cuantías ni se oculta. El intento de consolidado BOE p=20251231 falló por timeout: no se presenta como leído. Las consultas web complementan los originales conservados.

Los tres HTML del manual se readquirieron con el wrapper del corpus, UA identificativo, metadatos saneados y SHA256/512, en primarios. No hay OCR ni facsímil nuevo, validación PAdES/CSV o sello de tiempo. Integridad local verificada; adquisición oficial HTTPS sin autenticidad histórica validada; interpretación acotada argumentada; exactitud limitada a casos; aceptación completa false. No hay promoción ni atestación.

## Comprobaciones y reproducción

Se ejecutaron 41 pruebas existentes de mínimos/derechos: correctas. Suite propia final: 32 pruebas, 29 controles correctos y tres rojos conservados MDV1-01/02/03. No se suman esos recuentos como reglas fiscales aceptadas. No se ejecutaron Next build ni suites legacy completas.

Primer pase propio: error del revisor en esperado 125654 frente a 125704. Se corrige solo este test nuevo, con derivación (5.550+1.200)×9,5%+(5.956,65+1.287,925)×8,5%=1.257,038875. El log inicial se conserva; no es defecto del motor. Ningún oracle previo cambia.

Tipos del proyecto con --incremental false correctos; tipos propios finales correctos. Oxlint del alcance y entrega con --disable-nested-config y 16 reglas a error, ESLint de entrega correctos. Primer ESLint desde checkout ignoró la ruta externa; no cuenta. Se repitió desde raíz del padre únicamente sobre la entrega. Primer tipo propio falló por comentario @ts-expect-error desplazado al formatear; se corrigió solo su posición y se conserva el log.

Receta desde el checkout fijado, siempre bajo flock /tmp/irobopf-validacion-pesada.lock y nix shell nixpkgs#bun nixpkgs#nodejs:

    node_modules/.bin/vitest run --config .cache/revision-derechos/vitest.config.mjs
    node_modules/.bin/tsc -p .cache/revision-derechos/tsconfig.json --noEmit --incremental false
    node_modules/.bin/vitest run tests/minimos-derechos.test.ts tests/minimos-procedencia.test.ts --maxWorkers=1
    node_modules/.bin/tsc --noEmit --incremental false

La configuración scratch de Vitest incluye la ruta absoluta de casos.test.ts de esta carpeta y maxWorkers:1; cacheDir está en la .cache propia. La configuración scratch de tipos extiende ../../tsconfig.json e incluye solo ese test absoluto, con exclude:[] e incremental:false. No se copian configuraciones ni fuentes a docs. Los imports del test fijan el motor de este checkout; al relocalizarlo hay que registrar los nuevos hashes.

Lint final desde /home/elies/Repos/IRoboPF, con el mismo lock y Nix:

    node_modules/.bin/oxlint --disable-nested-config docs/procedencia/revisiones/minimos-derechos-v1/casos.test.ts
    node_modules/.bin/eslint docs/procedencia/revisiones/minimos-derechos-v1/casos.test.ts

Descargas: UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-cdbbbec4/.cache/revision-derechos/venv antes de bash tools/procedencia/run.sh tools/procedencia/descargar.py URL --root /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/minimos-derechos-v1/primarios. Extracción: nix shell nixpkgs#poppler-utils -c pdftotext -f36 -l38 -layout ORIGINAL DESTINO. Todo serializado. No se reconstruye inventario.

## Entrega y límites

manifiesto.json fija path/sha256/size/baseSha256 por archivo. entrega.patch contiene solo altas textuales de la revisión; binarios y originales se integran por hash, nunca por parche. base.json.gz conserva comprobación de entradas y enlaces. No hay borrados. Logs menores de 1MB; el control masivo va comprimido. Ningún árbol de ejecución, copia de motor, tsconfig o node_modules forma parte de la entrega.

Decisión de conservar tres rojos sin fixes: objeción experta, una revisión que corrige su objeto pierde separación entre hallazgo y cambio. Respuesta: entregar reproducciones y acción concreta al padre. Coste: la ruta continúa con esos defectos y debe contrarrevisarse tras corregirlos. No se hereda aceptación de rondas previas.

Se conservan inventario 4f00b24bfa37baa3521d54af1448d99a2ef6d1eee3e08bcf8b4d16ec97af7314, artifact b5450d431eefa13765ec0009a6be579e15848524799f2a467a46b5746caf087f y 52.377 ocurrencias, no reglas aceptadas. v1/v2 y payload Madrid permanecen sin cambio ni atestación. Crossa sigue siendo v1 histórico comunicado por coordinador, misma casa/dueño; sin comprobación propia ni custodia independiente. No se tocan preservados, contexto, Reactivity, originales o worktrees; sin LFS, gasto, transferencia externa, PR o despliegue.
