# Contrarrevisión de conexión anual, v2

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `5799bb03826719a4dd3500a962e2d6bb5124fdca`.

## Dictamen por hallazgo

**CAV1-01: corrección comprobada para el alcance ordinario declarado de Madrid 2025.** La API pública usa las cinco filas con cuota fija de Ley 13/2023, BOE-A-2024-5610, página física 3, coincidentes con el manual AEAT 2025, página 1128. Bruto 25.000,02, sin cotizaciones efectivas aportadas: cuota 3.750,12767 → 3.750,13. Bruto 60.000: 15.337,60275 → 15.337,60. Se prueba el selector, el cálculo público y sus componentes; no se infiere un ámbito de otros años ni de fallecimientos. Los controles del selector rechazan esa extensión devolviendo undefined. Esto no afirma que el resto de la aplicación soporte esos casos.

La expectativa canónica modificada es correcta bajo la política de presentación declarada: bruto 30.000, BLG 26.056, cuota estatal antes de mínimos 2.991,15; Madrid 1.739,53 + (26.056 − 19.004,63) × 0,128 = 2.642,10536. Suma 5.633,25536 → 5.633,26. Mínimos: 5.550 × 0,095 = 527,25 y 5.956,65 × 0,085 = 506,31525; suma 1.033,56525 → 1.033,57. Líquida exacta 4.599,69011 → 4.599,69. La API canónica real devuelve 563326, 103357 y 459969 céntimos. No se alteró ningún oracle ni fixture histórico.

**CAV1-02: corrección comprobada.** Los resultados públicos de trabajo y EDS fijan año 2025, territorio madrid y perfil solo-trabajo/solo-actividad-eds. Las 15 y 23 líneas de las muestras están enlazadas y sus 38 referencias resuelven a Step; la unión contiene los 16 siteId nuevos. Todas apuntan al v2 `efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6`. El reenlace de esos resultados ya versionados se rechaza. El v1 técnico `8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3` no se sustituye ni retaguea. No se revisan aquí todas las fichas del catálogo ni su cierre documental físico.

**CAV1-03: corrección comprobada.** La cota individual conserva doce dígitos enteros y dos decimales, y el agregado admite catorce. Cien entradas máximas suman 99.999.999.999.999,00; la BLG laboral sin otros gastos es 99.999.999.997.999. La prueba usa 1, 99 y 100 entradas tanto de empleo como de pensión; 0 y 101 entradas y el importe individual 1.000.000.000.000 se rechazan con ResultadoNoSoportado, sin Die. DA61 es cero a esas magnitudes. No se afirma precisión decimal ilimitada ni se ensanchan los límites de cada pago.

No se ha demostrado un defecto nuevo del producto dentro del alcance probado. Este dictamen permite cerrar los tres defectos concretos de v1 en esta base; no certifica declaraciones completas, familias, activos EDS, otros años, otros territorios, retenciones estimadas ni todas las reglas del sistema.

## Evidencia primaria y erratas

Se reabrieron los PDF originales del CAS raíz, se calcularon SHA-256, SHA-512 y tamaño y se extrajeron nuevamente las páginas pertinentes con Poppler. Original de la ley: `502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de`; manual: `02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4`. `originales.json` localiza los bytes conservados; no se duplican ni modifican originales.

La página 14 de la ley dispone efectos para períodos iniciados desde el 1 de enero de 2023 y entrada en vigor al día siguiente de su publicación en el BOCM de 21 de diciembre de 2023. La fecha posterior del BOE no desplaza por sí sola esos efectos. El manual identifica expresamente la tabla para 2025. Se consultó además la [ficha BOE](https://www.boe.es/buscar/doc.php?id=BOE-A-2024-5610) y se buscó por título exacto y corrección de errores. No se localizaron referencias posteriores de rectificación de la tabla en esa ficha ni una errata contradictoria en la búsqueda; el [texto de la Comunidad de Madrid](https://gestiona.comunidad.madrid/wleg_pub/html/ficheroTemporal_6579.html) atribuye los artículos 1 y 2 a Ley 13/2023. Esto no es una prueba exhaustiva de ausencia de erratas. La primera búsqueda usó por error 21 de diciembre como fecha del título; se repitió con 15 de diciembre, fecha correcta. No se usa la errata de Madrid 2020 como prueba del ejercicio 2025.

Las extracciones conservadas son texto de páginas, no nuevas citas con coordenadas verificadas ni facsímiles. No se hizo una nueva validación PAdES, CSV o cadena de confianza. El original AEAT se localiza en https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/ManualRenta2025Parte1_es_es.pdf .

## Casos y lectura del contrato

Se examinaron la integración de ronda 11 y D043–D046, redondeos-r11, conexion-anual-v1, su generador y las 84 entradas y expectativas, el informe de implementación, código de conexión, contratos, adaptador laboral, deducciones, escalas, enlazador y pruebas. La revisión de X integrada aporta dos reservas: CX-06-A requiere contrato familiar y CX-07-B no constituye un oracle fiscal. Un rojo de investigación no se convierte en expectativa general.

Los 84 casos anteriores se regeneran en scratch con su fórmula Decimal a 120 cifras, cotejada de nuevo con los primarios y con el cálculo separado de componentes. **84/84 coinciden**, frente a 58/84 en v1. Se conserva la historia sin reescritura. Hay 31 rechazos esperados y cero Die. Se mantiene el caso EDS de 10.000 ingresos máximos, las pérdidas, RETA, art32, retenciones y modelo 130 separados, duplicados, mezclas y hechos excluidos.

**116 casos adicionales coinciden.** Cubren ambos tipos de trabajo alrededor de los límites art20/DA61 y escalas, a −0,01, en el límite y a +0,01; límites de cardinalidad y magnitud; y EDS cerca de cero, mínimos y fronteras de Madrid. Para EDS las entradas monetarias admiten céntimos, por lo que el inverso del gasto del 5 % se cuantiza a céntimos: la BLG efectiva puede quedar a menos de 0,01 del objetivo, y está conservada explícitamente. No se presenta esa rejilla como bases exactamente iguales al objetivo. Los controles directos adicionales sí ensayan las bases exactas de la tabla a ±0,01. Se comparan estatal y autonómica por separado, mínimos propios y ecuación posterior − retenciones − pagos = diferencial en todos los éxitos. La salida sigue declarando aceptación pendiente.

La conciliación de trabajo es una declaración aportada: strings distintos no prueban que dos certificados sean disjuntos. El contrato excluye otras rentas y familiares; su rechazo no niega derechos fiscales de quienes quedan fuera. En EDS se comprueban los efectos integrados de las opciones y pagos de los 84 casos, sin dar por revisado nuevamente todo el submotor contable.

## Decisiones de esta revisión

1. Cerrar los CAV concretos, manteniendo pendiente el contrato fiscal completo. Objeción experta: pasar regresiones no acredita hechos reales ni redondeo por casilla de Renta WEB. Coste: conservar precisión y presentación separadas y no promover atestaciones.
2. Reutilizar las 84 entradas históricas y cotejar sus fórmulas con primarios, añadiendo un contraste de componentes separado. Objeción: copiar expectativas puede repetir el error anterior. Coste: releer la tabla y reconstruir por separado cuota estatal, autonómica, mínimos y pagos, con rejilla adicional; no sustituir las expectativas por salidas del motor.
3. Mantener el límite agregado distinto del individual. Objeción: ampliar sin cota ni cardinalidad permitiría exceder la precisión disponible. Coste: aceptar solo la suma acotada y probar ambos bordes; no prometer importes ilimitados.
4. Revisar la exposición del símbolo por archivo y ruta, sin heredar aceptación. Objeción: quince números correctos y territorio técnico no acreditan vigencia ni equivalencia con hojas legacy. Coste: conservar los estados pendientes y dejar la promoción jurídica al contrato de decisión.
5. Conservar originales en CAS y entregar referencias por ambos hashes. Objeción: una transcripción sola no permite reabrir la fuente. Coste: dependencia explícita del CAS local preservado; no inventar autenticación ni custodia independiente.

## Cinco dimensiones y límites

Integridad: base, manifiesto y artifact solicitados cotejados; originales por ambos hashes; entrega por archivo. Autenticidad: no se añade validación histórica. Interpretación: limitada a la tabla, mínimos y etapas declaradas de 2025. Exactitud: solo casos y controles enumerados. Aceptación: ninguna promoción fiscal, de binding ni atestación.

Crossa es la copia local histórica v1 comunicada por el coordinador, misma casa y dueño; no se presenta como remota, independiente o comprobación propia. v1 preservado y v2/restauración permanecen intactos. Sin LFS, gasto, transferencia externa, PR, despliegue, Next build, suites legacy completas ni borrados.

## CAV2-01 — P2: falta una dependencia de software en el commit base

**Requiere cambios de integración antes de declarar verificado el rastro actual.** `scripts/procedencia/explicacion-version.mjs:12` exige `app/procedencia/[snapshot]/objetos/[hash]/route.ts`. Ese archivo no existe en este checkout y tampoco figura en `git ls-tree -r --name-only HEAD app/procedencia`. No es una ausencia causada por esta revisión: las 8.456 entradas del árbol base están presentes, sin borrados.

La suite real `tests/rastro-anual-procedencia.test.ts` produce cinco pruebas correctas y dos fallidas: tanto la comprobación directa del catálogo como RV3-01 fallan con ENOENT sobre esa ruta. El test RV3-01 ya copia `app/procedencia`; por tanto, no basta repetir la corrección histórica del arnés relatada por el padre. La dependencia falta en la propia base comprometida. El informe de integración y el resultado favorable del padre no acreditan esta instantánea reproducible. No se ha leído ni copiado la versión mutable de otro checkout para ocultar el defecto.

Acción propuesta al integrador: recuperar de su entrega autorizada la ruta exacta, cotejar su hash con la dependencia fijada, incluirla en el árbol que entregue y repetir ambas pruebas. Si el contenido cambia, reconstruir la versión documental según contrato, sin migrar aceptación. Objeción experta: un enlace resoluble dentro del almacén no demuestra disponibilidad de su ruta HTTP ni cierre de software. Coste: nuevo cotejo de integración y revisión del archivo ausente; no una modificación numérica ni un retagging. No se aplicó fix ni se convirtió el fallo en expectativa de éxito.

## Comprobaciones reales y reproducción

Inventario `ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397` y artifact `ae25e219e75593d7a0d408e325db872faca31261ded79a2115a563536073b3d0` coinciden. Se extraen quince hojas efectivas del símbolo exacto MADRID_2025 en escalas-publicadas.ts; sus cinco bases, cinco cuotas y cinco tipos coinciden con el primario. Todas conservan territorio técnico madrid, año 2025 y status pending. El primer instrumento buscó el texto MADRID_2025 en todo el artefacto y contó archivos empaquetados; se corrigió para deserializar las páginas y filtrar símbolo/capa exactos. Ese diagnóstico de instrumento no es un defecto del inventario. No se reconstruyó ni escribió el inventario del producto.

Los 163 éxitos de los 200 casos propios coinciden en ambos componentes y en la resta separada de pagos; los 37 restantes son rechazos esperados, sin Die. Las 86 pruebas de conexión/liquidación pasan. El primer comando nombró incorrectamente tests/rastro-anual.test.ts: Vitest solo ejecutó los otros dos archivos. El pase posterior usó el nombre real y conserva los dos rojos de CAV2-01. No se suman esos recuentos como cobertura fiscal diferente.

Typecheck principal/vendor, lint global y test:lint terminan en cero; el último confirma 16 reglas a error. Los tres instrumentos JavaScript pasan lint explícito con configuración equivalente, sin ignores de scratch y --disable-nested-config. El lint global no se usa para acreditar scripts ignorados. No se afirma comprobación estática checkJs de los instrumentos; los tipos del producto sí están comprobados. Los logs silenciosos conservan sus códigos de salida y se añade listado explícito de cobertura.

Se consultaron effect-solutions list/show testing/error-handling mediante el lanzador Bun prescrito y Effect.ts local, documentación y firma de runSyncExit. Herramientas: Bun 1.3.13, Node 24.19.0 de Nix. Pruebas, tipos, lint, extracción y lectura del artefacto se serializaron con flock y un trabajador. Un generador ligero de entradas se ejecutó fuera del lock; no ejecutó motor ni corpus. La suite heredada RV3-01 usa tmpdir y creó una copia en /tmp; no se movió ni borró esa copia. Los instrumentos propios y demás scratch se mantienen en .cache/conexion-anual-v2. Se deja constancia de esa desviación del arnés, sin presentar que toda escritura temporal quedó en scratch propio.

No se ejecutó el wrapper Python del corpus: solo se leyeron originales y se extrajeron páginas con Poppler, y los instrumentos Python estándar se ejecutaron con Python de Nix. No se creó tools/procedencia/.venv ni se alteraron locks o dependencias.

`reproducir.sh` contiene comandos y rutas. Los instrumentos se entregan para copiar a scratch antes de ejecutarlos; no hay fuentes del producto, tsconfig ni node_modules en esta carpeta. `verificar.log.gz` conserva íntegro un diagnóstico de instrumento mayor de 1 MB que imprimió el contenido de ocho archivos empaquetados por error; no hubo secreto ni original privado copiado. El manifiesto fija el archivo comprimido. Casos y resultados grandes también se entregan comprimidos, con sus hashes. Las fuentes e informes históricos permanecen intactos. El parche añade exclusivamente esta entrega textual; binarios por archivo/hash. No hay parche de implementación.
