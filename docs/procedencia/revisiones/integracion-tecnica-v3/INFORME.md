# Contrarrevisión técnica de d9ff49c7

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Corte: 29 de octubre de 2026. Base examinada: `d9ff49c7fbb237437ab55e3839ab8f2cfa44e328`. Se conserva el historial de revisiones; este informe no lo sustituye.

**Dictamen: inventario técnicamente aprobable en el alcance declarado y CG-01/02/03 sin regresión demostrada en las pruebas ejecutadas. Corpus aprovechable como integridad con aceptación fiscal cerrada; queda una extensión reproducida de COR-04 que requiere endurecer el reconocimiento de tokens.** No se acepta el encargo documental completo ni una liquidación anual por estos resultados.

## Base, aislamiento y verificaciones

Se examinaron informes COR-01–08 e INV2-R01–03, corrección de ganancias, implementación, pruebas y contratos relacionados.

El diff contra la base está vacío. De 841 archivos de la base, ninguno falta en disco. `base-check.json` conserva hashes de los generadores, helper, corpus, inventario y cálculo revisado. No hay borrados masivos que integrar. El único resultado escrito en el padre es esta carpeta de revisión; las pruebas corrieron en `/tmp/irobopf-review-v3/procedencia`, copia propia cuya ruta contiene deliberadamente `procedencia`. node_modules apunta al compartido y solo se lee. No se regeneró el artefacto del padre ni del worktree.

Resultados independientes:

- Corpus: 20/20 pruebas offline; firmas reales, rechazo de alteración, geometría, hosts, schemas, aceptación inventada y atomicidad PNG incluidos.
- Inventario: 16/16, incluida precarga de dependencia, edición en scratch y obtención del valor nuevo 5551, con proceso limpio. Reconstrucción baseline contra el artefacto integrado correcta.
- Ganancias y liquidación: 14/14 y 57/57; 71 en total.
- Lint de aplicación, humo de 16 reglas anti-slop y typecheck de aplicación/vendor: salida 0. Ruff: helper, corpus, tests y scripts Python propios sin diagnósticos. No se escribió Effect ni TypeScript nuevo.
- Muestra independiente del inventario: 313 hojas runtime y 187 literales AST, cero discrepancias. Se reutilizó el script histórico exacto, sin preload ni arreglo del nombre de directorio. Comparte parser TS; no es una segunda implementación del lenguaje.

Los logs y scripts reproducibles acompañan al informe. No hubo Next build, suite legacy pesada ni adquisición documental nueva; Nix obtuvo DejaVu Fonts para el PDF sintético. Las pruebas de red son simulaciones locales, no acreditan disponibilidad de portales ni cadenas TLS.

## Decisión por hallazgo anterior del corpus

- **COR-01: cerrado para integración técnica, puente pendiente.** API con accepted=True y CLI --accepted rechazan incluso la cita real íntegra. Revisión y semántica inventadas fallan por schema. Salida ordinaria: integrity=verified, inventoryBinding=unverified y revisiones/fiscalAcceptance pendientes. Objeción: cerrar una puerta no implementa el vínculo al motor. Motivo del cierre acotado: elimina la aceptación circular demostrada. Coste: no se puede promover ninguna cifra fiscal con esta herramienta todavía.
- **COR-02: corregido en caminos ensayados.** Metadatos sintéticos de sesión y extensiones privadas desaparecen en caché devuelta, redirección, importación, historial y public_document; el original importado queda intacto y la exportación elimina localPath superior. Objeción: allowlist de campos no prueba que todo valor de texto arbitrario sea publicable. Motivo: saneamiento comprobado en los caminos afectados, sin publicar secretos reales. Coste: pérdida deliberada de cabeceras y ausencia de captura HTTP íntegra/WARC.
- **COR-03: corregido.** Índice con URL ajena rechazado en suite; cadena discontinua o destino externo rechazados en ataque propio; redirecciones desconocidas quedan pending, también al importar. Objeción: una cadena declarada localmente no autentica el servidor. Motivo: ahora separa identidad del índice y autorización del origen de integridad de bytes. Coste: legacy incompleto permanece pendiente.
- **COR-04: caso original corregido, extensión abierta IT3-01.** ASCII, U+2212, U+FE63, U+FF0D, U+FF0B y U+00B1 se rechazan al intentar omitir el signo. U+207B/U+208B todavía pasan. Motivo y coste detallados abajo.
- **COR-05: corregido en verify.** API valida documento y cita; campos documentales desconocidos y autenticidad inventada se rechazan, al igual que revisiones inventadas. Objeción: schema cerrado no equivale a prueba semántica. Motivo: corrige la divergencia API/CLI descrita. Coste: productores legacy deben adaptar metadatos antes de promoción; no se acepta automáticamente la semántica de campos admitidos.
- **COR-06: corregido para publicación atómica.** Ensayo de fallo en os.replace no deja blob parcial y reintento funciona; código usa temporal vecino, flush/fsync y replace. Objeción: no se simuló corte de energía ni fsync del directorio. Motivo: corrige publicación parcial bajo hash final. Coste: no se afirma transacción durable de todo el corpus.
- **COR-07: corregido para plataforma declarada.** Flake/lock fijan nixpkgs y Linux x86_64; uv frozen usa Python Nix explícito. Receta observada PyMuPDF 1.26.7/MuPDF 1.26.12. Cambiar DPI, anotaciones o versión del render invalida la cita. Objeción: no se probó reconstrucción en una segunda máquina. Motivo: entorno reconstruible y receta verificable. Coste: dependencia de Nix/plataforma y no garantía multiplataforma.
- **COR-08: corregido para hosts identificados.** Suite comprueba www3.agenciatributaria.gob.es, bocyl.jcyl.es, www.borm.es y www.hacienda.gob.es; fuente técnica no autorizada rechazada. Objeción: dominio permitido no acredita norma ni vigencia. Motivo: compatibilidad explícita sin autoautorizar todos los orígenes de caché. Coste: nuevas fuentes exigen política revisada.

Además, comparación propia del recorte con los píxeles de la página completa: igualdad en 0/90/180/270 grados con CropBox desplazado. No demuestra que texto invisible o una capa de texto falsa corresponda al dibujo. No se exige resolver firmas históricas, CSV jurídico, WARC o TSA para aceptar este helper de integridad; siguen pendientes explícitos.

## IT3-01 — P2: signos matemáticos Unicode aún omitibles

Ubicación: `tools/procedencia/corpus.py:184–190`, función verify_binding. `unsafe` enumera signos concretos, pero omite SUPERSCRIPT MINUS U+207B y SUBSCRIPT MINUS U+208B. Ninguno satisface isalnum, por lo que el span que empieza después del signo pasa.

Reproducción mínima: texto `⁻8,50%`; number={start:1,end:5,literal:"8,50"}; numberFormat="es-ES"; value="8.50"; unit={start:5,end:6,literal:"%"}; unitCode="percent". verify_binding devuelve True. Igual resultado con `₋8,50%`. Esperado: rechazar el token no soportado, sin normalizar ni decidir silenciosamente que el número es positivo.

Reproducción de extremo a extremo completada: dos PDF sintéticos con DejaVu Sans conservan literalmente cada signo en la capa de texto; cite y verify aceptan el binding positivo y devuelven integrity=verified. Los PDF, PNG, manifiestos y citas se conservan en synthetic-sign-pdf, etiquetados como sintéticos, nunca como originales oficiales. La primera prueba con la fuente china-s perdió el glifo; su fallo se conserva y no cuenta como evidencia de este resultado.

Impacto acotado: el control técnico de correspondencia permite omitir un signo matemático adyacente. No demuestra cifra errónea en documentos oficiales actuales ni evasión de --accepted. No es una certificación fiscal falsa: la puerta fiscal continúa cerrada.

Objeción experta: el uso tipográfico de un signo elevado/bajo puede ser ambiguo y no tiene por qué significar una pérdida tributaria. Precisamente por esa ambigüedad debe rechazarse la lectura positiva automática, no imponerse conversión a negativo. Motivo de P2: afecta la garantía declarada de no aceptar substrings de tokens numéricos, en una API utilizable por nuevos documentos. Coste recomendado: definir una frontera de token conservadora con pruebas Unicode adversariales; habrá citas que requieran tratamiento explícito. No bastaría convertir todo carácter matemático en menos, ni declarar aceptados los valores por coincidir con la cita.

## Inventario: cierre y ataques

**INV2-R01 cerrado:** la regresión real precarga MINIMOS_ESTATALES_2024, cambia la dependencia 2025 de 5550 a 5551 en scratch y exige 5551. El generador lanza un proceso nuevo. Objeción: las dependencias instaladas siguen siendo parte del entorno confiable. Motivo: elimina caché de imports del llamador. Coste: proceso y reconstrucción más caros; no convierte el generador en sandbox.

**INV2-R02 cerrado:** suite y muestra completa corren desde una ruta que contiene procedencia, sin preload que altere cwd. sourcePaths filtra respecto de lib. Objeción: no se ha probado cada plataforma/symlink. Motivo: reproduce el caso anterior sin parche. Coste: alcance de plataforma explícito.

**INV2-R03 cerrado:** suite exige rechazo de prototipo personalizado, Number NaN y Decimal NaN. BigInt, alias y límite Infinity permanecen soportados; ciclos/tipos ajenos no se omiten. Objeción: no prueba exhaustividad semántica. Motivo: corrige los casos demostrados. Coste: tipos nuevos pueden detener generación y requieren decisión de contrato.

Ataques completos de contenedores con hashes recalculados: valor adulterado, hoja con su índice omitidos, counts falsos, cobertura/hash de fuente falso, ubicación imposible, grafo reemplazado y archivo extra. Los siete contenedores pasan readArtifact (integridad autocontenida) pero compareFiles y CLI check los rechazan. Es correcto que readArtifact por sí solo no pruebe correspondencia con código. No presentar esa lectura como aceptación fiscal.

El ensayo histórico se detuvo durante el octavo caso por presión de memoria: el proceso padre retenía aproximadamente 2 GiB y su hijo reconstruía, con otros trabajos activos en la máquina. Salida 143 deliberada; ningún caso no terminado se contabiliza como rechazado. El caso de índice omitido y el cambio de fuente se completaron en procesos de shell separados: ambos rechazados por diferencias de conjuntos/bytes, con log propio. Se conserva el script histórico byte a byte, como .mjs.txt, sin volverlo código mantenido ni desactivar lint para ejecutarlo.

La suite además comprueba aceptación de evidencia introducida, referencias rotas, conjuntos incompletos, clasificación e identidad al insertar elementos. Los IDs son ocurrencias versionadas; no conceptos jurídicos. El inventario integrado contiene 47.789 ocurrencias con solapamiento, todas pendientes. La reconstrucción puede repetir omisiones del extractor: muestra y controles externos reducen ese riesgo sin probar exhaustividad.

Objeción de recursos: repetir reconstrucciones innecesarias consume ~2,2 GiB cada una. Motivo de las ejecuciones: cada ataque CLI debe contrastarse con fuentes, no solo con hashes rehechos. Coste: ejecución secuencial y lock global; se interrumpió el arnés que retenía memoria y no se publicó ni regeneró un artefacto nuevo.

## CG-01/02/03: aceptación de implementación acotada

- CG-01: conserva pérdidas, evita exenciones negativas y mantiene saldo +10000−4000=6000; incluye pérdida aislada y pérdida con tratamiento de vivienda. No califica si una pérdida es fiscalmente computable.
- CG-02: la exención usa fecha de adquisición y no exige venta en 2012; pruebas de 11/12 de mayo, 31 de diciembre/1 de enero, vinculación y conservación de total. No certifica hechos aportados ni todos los regímenes concurrentes.
- CG-03: vitalicia condicionada a ejercicio>=2015, manteniendo vivienda habitual en 2014. No corrige acumulados incoherentes entre transmisiones ni requisitos no modelados.

Objeción: 71 pruebas verdes no prueban una declaración completa ni todos los años. Motivo del dictamen: expectativas discriminantes de las tres proposiciones previamente aceptadas y regresión de liquidación sin fallos. Coste: mantener abiertos CG-04 y demás contratos de compensaciones, acumulados y requisitos. La exactitud aritmética de estas sumas, la integridad del corpus, la interpretación normativa previa y la aceptación fiscal global son cuatro afirmaciones distintas.

## Reproducción

Crear copia scratch del árbol d9ff49c7 sin .git/.jj/.cache/node_modules y enlazar dependencias compartidas en lectura. No ejecutar los scripts de mutación sobre el padre. Comandos desde scratch, uno por vez bajo `flock /tmp/irobopf-validacion-pesada.lock`:

```sh
bash tools/procedencia/run.sh tests/procedencia-corpus_test.py -v
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun run test:inventario
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/ganancias-patrimoniales-procedencia.test.ts tests/liquidacion-irpf-anual.test.ts --maxWorkers=1
bash tools/procedencia/run.sh adversarial.py
bash tools/procedencia/run.sh sign-pdf.py
nix shell nixpkgs#bun nixpkgs#nodejs -c bun sample.mjs
```

Copiar primero scripts propios a la raíz scratch y los históricos .mjs.txt a su nombre original. `sample.mjs` escribe en ../results; crear ese directorio. El arnés histórico review.mjs reproduce las mutaciones y escribe ../results, pero retiene memoria: preferir casos individuales en esta máquina. `remaining.sh` conserva/restaura la fuente scratch mediante trap. Los scripts Python propios requieren el wrapper fijado. Los .mjs históricos se retiran del árbol analizado antes de lint/typecheck; no se alteraron reglas ni fuentes de producción.

Para sign-pdf.py, obtener previamente `nix build --no-link --print-out-paths nixpkgs#dejavu_fonts > ../font-path.txt` (ensayo ejecutado con DejaVu 2.37). Los scripts propios ya están en esta carpeta; copiarlos, no ejecutarlos desde aquí. El directorio scratch y los scripts históricos quedan preservados para reproducción. No se editó ESTADO ni DECISIONES porque el mandato restringe la salida a esta carpeta; las objeciones, motivos y costes quedan aquí para integración por el padre.
