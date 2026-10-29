# Revisión independiente del contrato de trabajo anual

29 de octubre de 2026. Revisor nuevo, trabajo personal sin subdelegación. Base declarada por el encargo: `ed6a43fd750de05609abc3710dabdc2f8261020c`. Se examinan los bytes de este checkout fijados en el manifiesto; corresponde al padre comprobarlos contra esa base antes de integrar. No se ejecutaron operaciones VCS ni fixes.

**Dictamen: no se ha demostrado un defecto de fórmula dentro del contrato condicionado publicado. La conexión anual NO queda aprobada ni se certifica liquidación completa.** Se conservan tres observaciones de integración, con reproducciones y límites. El resultado favorable de etapa no convierte hechos declarados en hechos acreditados.

Se leyeron BRIEF, AGENTS, contrato de auditoría, coordinación, estado y decisiones completos, integración-ronda7, auditoría y contrarrevisión de trabajo-deducciones-estatales y entrega trabajo-anual. Se inspeccionaron íntegros contrato.ts, calcular.ts, adaptador.ts y las 36 pruebas del autor. Los instrumentos propios son reproducciones conservadas `.mjs.txt`, no código de producto excluido artificialmente de lint.

## Contraste de fuentes primarias

Se abrieron de nuevo ocho originales de la caché autorizada y se recalculó SHA-256 antes de extraer. `logs/primarias.json` conserva URLs, hashes, tamaños y extracciones nuevas por página física o selector HTML. No se usaron conversiones Markdown como prueba.

- LIRPF histórica seleccionada a 17/10/2014, hash `669bfabc9a7567c4992efb24d2202fe88ebf9e4092bb728c9af76949f58b8977`: arts. 19, 20, 63.2, 74.2 y 80 bis. La versión seleccionada contiene el artículo 80 bis, no su supresión actual.
- Ley 26/2009, hash `c3be828639755b87a1a88df5c9607836fb93aaf6b569fef48a8cf35ba89d54ba`, p. 73, y corrección `803be426d5ed4ee63c9ddb1413d9395c2482682abe48e631f1ad6b673ca11941`, dos páginas: 400, 8.000 y 12.000; corrección ortográfica, sin cambio de esos importes.
- Ley 26/2014, hash `7393a032cbcbb47b5234894538b06420f4aae4a7106a0094af0ff50c45aaaa0f`, pp. 11–12 y 35: gastos, argumento del artículo 20 y supresión del 80 bis.
- RIRPF original, hash `0f6003cfa63f80e44e4ff31bfe72432e3147d8164347940001c5de7e1c74380f`, pp. 16–17: colegio obligatorio para desempeñar el trabajo, fines esenciales, 500 euros anuales; sindicato sin ese tope.
- AEAT 2015, hash `29a8febe5bcbe944fab2af99363895987aeea87ef4b810f5245021dc55d5af1a`, pp. físicas 144–145: otras rentas algebraicas y DT sexta. No sumar incremento antiguo y nuevo por movilidad.
- Ley 5/2025, hash `9657d0c565a0b0017bee94f8544da006109f54f06286c15a0496ed4f1a3e38ac`, pp. 46–47: DA 61, efectos desde enero, requisitos, límite y orden tras el artículo 80.
- AEAT 2025, hash `02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4`, pp. 1372–1375: límite atribuible y ejemplos salario/pensión. La p. 1375 contiene otra deducción; se conserva como contexto, no como fundamento de DA 61.

Integridad: ocho hashes coinciden. Autenticidad: no se valida PAdES, CSV ni cadena histórica de certificados. Interpretación: lectura independiente de estas etapas y exclusiones; no cierre de todas las vigencias del sistema. Exactitud: resultados de etapa contrastados por casos, sin afirmar exactitud racional de divisiones periódicas ni política final de céntimos. Aceptación: no se modifica registro alguno, no se migra atestación, no se abre aceptación del corpus. No hay nuevas descargas ni facsímiles nuevos.

## Gastos y adaptador

Las cotizaciones efectivas de las tres categorías se suman con sindicato satisfecho. La parte de colegio indicada debe ser la destinada a fines esenciales; el booleano no calcula esa parte. Colegio voluntario o defensa sin litigio directo no deducen; desconocido rechaza. **Defensa es 300, no 350.** Colegio se limita a 500. Ambos límites y los 2.000 generales se aplican una vez al contribuyente, después de sumar sus rendimientos, no por pagador.

Los gastos a–e pueden dejar neto negativo. Con bruto 1.749,99 y gastos 1.750, el neto se conserva en −0,01 y f aplica cero. Con saldo previo 2.000,01, f aplica 2.000 y quedan 0,01. El adaptador entrega por separado `argumentoArt20` (sin restar f) y `rendimientoAntesArt20` (neto del artículo 19). No aplica art. 20 ni vuelve a descontar gastos.

Discapacidad activa: 3.500 para grado 33–64 sin ayuda/movilidad reducida; 7.750 para ese grado con ayuda/movilidad o para grado ≥65. El incremento se limita al saldo restante después del gasto general. Solo se calcula empleo único acreditado durante todo el trabajo. Se comprobaron rechazos de pensión, pluralidad/mixtos, régimen histórico y movilidad ordinaria/DT6/desconocida. El rechazo de varios empleos también excluye casos legalmente válidos: es un coste de cobertura declarado, no una regla que niegue su derecho. 2026 permanece excluido.

**TAI-O1 — Identidad de gasto, condición de integración.** Dos IDs distintos con cuota sindical 600 cada uno suman 1.200 aunque representen el mismo pago. Con dos rendimientos del instrumento, devuelve gastos 3.500; si la cuota sindical es una única operación, corresponden 2.900. La API no tiene identidad de operación para distinguirlo. No es un nuevo fallo de fórmula bajo la precondición expresa del autor de importes sin duplicar. Un experto rechazaría importar certificados indiscriminadamente. El padre debe recibir operaciones disjuntas o importes anuales conciliados y conservar su procedencia. Coste: conciliación previa; no deduplicar solo por igualdad de importe, porque dos pagos iguales pueden ser legítimos.

## Deducciones condicionadas

Artículo 80 bis: se usa BI, no bruto ni BLG; nominal 400 hasta 8.000, descenso 0,1 y cero desde 12.000, solo 2012–2014. El límite usa la suma de tipos medios legales de arts. 63.2 y 74.2, expresados a dos decimales, sobre netos después de arts. 20/32 excluyendo exterior no efectivamente gravado por art. 80. Con tipos 2,35 y 3,16 y rendimiento 1.000, el límite es 55,10; con cuota disponible 25 aplica solo 25. La función no deriva esos tipos ni verifica su origen: eso corresponde a la etapa anterior. No son tipos de retención ni cocientes de cuota líquida.

DA 61: umbrales 16.576/18.276 y nominal 340; reducción 0,2; otras rentas exactamente 6.500 permiten el cálculo y 6.500,01 lo excluyen. Se admite saldo negativo de otras rentas, sin convertirlo a valor absoluto ni suelo cero. La pensión debe integrar esas otras rentas a efectos de DA 61; para art. 20 sigue siendo trabajo. El bruto elegible solo recoge servicios laborales/estatutarios efectivos.

Con neto atribuible 5.000, BLG 10.000 y cuota íntegra general 600, límite 300; con cuota después de art. 80 de 40 aplica 40. Se devuelve `cuotaPosterior`, sin redefinir cuota líquida del artículo 79. No se aplican pagos a cuenta. Neto superior a BLG o al bruto y cuota posterior a art. 80 superior a líquida se rechazan. 2026 se rechaza.

**TAI-O2 — Atribución mixta externa, condición de integración.** La etiqueta `laboral-estatutaria-acreditada` y los importes agregados no prueban por sí solos exclusión de pensiones ni asignación de gastos/reducciones. La función puede evaluar agregados mixtos si esa atribución ya se resolvió externamente; no rechaza todos los mixtos por diseño. No debe anunciarse que automatiza su calificación. Un experto exige procedencia de neto, BLG, cuota general y otras rentas; la futura conexión debe rechazar cuando falte. Coste: mantener perfiles mixtos pendientes hasta disponer de esa etapa, sin sustituir pensión por salario ni otras rentas por BI. No es un contraejemplo a la fórmula con datos externos correctos.

**TAI-O3 — Precisión entre etapas, condición de integración.** Los importes de entrada admiten hasta dos decimales, mientras art. 20 y estas fórmulas pueden producir más: DA 61 a 16.576,01 da nominal 339,998; art. 80 bis a BI 8.000,01 da 399,999. No hay política fiscal final de redondeo en estos archivos. Un experto rechazaría truncar esos resultados para satisfacer el Schema sin justificar la etapa. Coste: fijar una política común o ampliar el contrato de magnitudes calculadas antes de conectar; no se debe forzar una cifra final deseada. Esta observación no acredita por sí sola una cuota final errónea.

## Contrato exigido a la conexión anual

El padre debe fijar contribuyente individual, régimen común, ejercicio/devengo y perfil. Gastos efectivos y rendimientos deben estar imputados al mismo ejercicio, sin duplicación, con hechos acreditados; mantener separado el perfil analítico y compatible-legacy. No presentar este módulo como evaluador de conjunta, art. 18, movilidad, historia de discapacidad o 2026.

Después del adaptador, aplicar art. 20 una vez con su argumento sin f y otras rentas algebraicas fiscales antes de reducciones/compensaciones. Limitar la reducción al saldo positivo disponible, preservando el neto negativo originado por a–e cuando la reducción aplicada es cero. El cierre histórico necesita excluir o resolver también prolongación de actividad de mayores de 65 del antiguo art. 20.2.a, que este adaptador no calcula.

Determinar bases, cuotas y mínimos por las etapas correspondientes. Para 80 bis, construir BI total y tipos medios legales; para DA 61, construir neto atribuible y resto de rentas con trazabilidad y rechazo si la atribución no está cerrada. Aplicar art. 80 antes de la deducción de trabajo, conservar cuota líquida legal y nueva cuota posterior, deducir luego pagos a cuenta. Evitar una segunda deducción por consignación o conciliación legacy. Las pruebas de integración deberán comprobar todos esos enlaces y su rastro: las pruebas presentes no los ejecutan.

## Comprobaciones y reproducción

66 casos propios, cero fallos; entradas, expectativas y salidas completas en `casos/resultados.json`. Cubren gastos, fronteras, signos, tres cotizaciones, desconocidos, ámbito, discapacidad, adaptador, tipos medios, cuotas, otras rentas y nominales. Dos observaciones adicionales no se cuentan como pruebas de defecto. Las 36 pruebas del autor se ejecutan aparte; resultados y comprobaciones de lint/tipos constan en logs y manifiesto.

Para reproducir, copiar `casos/casos.mjs.txt` a `.cache/revision-trabajo-anual/casos.mjs` del checkout examinado y ejecutar con `nix shell nixpkgs#bun nixpkgs#nodejs -c bun .cache/revision-trabajo-anual/casos.mjs`. El extractor conservado requiere Python Nix con PyMuPDF y BeautifulSoup; lee únicamente originales y escribe esta carpeta asignada. Instrumentos con hash, sin promoción a código mantenido ni cambios de lint. Se consultaron effect-solutions list/show testing/data-modeling y fuente v4 de Schema.

Pruebas del autor y typecheck acotado usan un worker y el lock común `/tmp/irobopf-validacion-pesada.lock`. No Next build, suites legacy pesadas, regeneración de inventario, instalación global, mutaciones VCS ni edición de informes ajenos. La revisión no reproduce los 495 tests globales y no los presenta como propios.
