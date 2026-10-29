# Revisión independiente de rastro, otras rentas y enlaces v3

Dictamen: **solicitar una corrección técnica acotada, RV3-01 (P2)**. TDE-09/10 y ENV2-01 son aprobables dentro de sus contratos explícitos. No se acepta fiscalmente el inventario, una liquidación completa ni el payload nuevo de Madrid.

Base examinada: `c2894133f9b5179a7a67364897fe0b04671715f1`. Revisión personal nueva, sin subdelegación, fixes, operaciones VCS mutantes, servidor ni navegador. El diff de fuentes lib/scripts/components/tests/corpus contra la base estaba vacío. Lectura de BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO, DECISIONES, RASTRO-INSTRUMENTADO, informes de trabajo, enlaces-v2 y sus correcciones. Solo se entrega esta carpeta. No se han modificado registros de confianza ni informes anteriores.

## RV3-01 — La comprobación del rastro actual no detecta software de explicación obsoleto

**Motivo.** `scripts/procedencia/rastro-verificar.mjs:28` compara las versiones declaradas en catálogo y snapshot, pero no reconstruye la versión de explicación desde las fuentes actuales. El bucle de líneas 68–75 solo verifica las fuentes del dominio que contienen puntos. El generador sí incluye `lib/procedencia/rastro-anual.ts`, `rastro.ts`, el extractor y otros módulos en `fuentesSoftware`; el verificador no coteja esos archivos actuales con los hashes conservados. Tampoco forman parte de `generationInputs` del inventario. El verificador de contenido comprueba bytes históricos conservados, que es correcto para su función, pero no cierra esta diferencia con el software actual.

**Reproducción.** `casos/sondeos.mjs.txt` construye una carpeta de inputs en scratch, sin checkout ni metadatos VCS. El control inicial pasa. Cambia únicamente la expresión que construye el href de `rastro-anual.ts` para usar un snapshot de ceros. Se comprueba que los bytes difieren. `verificarRastroGenerado(scratch)` sigue devolviendo 49 puntos y el snapshot original. No se ejecuta ese módulo adulterado ni se presenta el ensayo como falsificación de una API externa: prueba específicamente que la puerta de correspondencia de fuentes no detecta el cambio. El control de mutación en la fuente del dominio sí falla. Véase `logs/sondeos.log`.

**Alcance.** Integridad/versionado de la explicación durante futuras ediciones o empaquetados. Los hashes de algoritmo, datos y explicación del checkout examinado fueron recalculados independientemente y coinciden. No se ha demostrado que el snapshot actual esté corrupto ni que una cifra actual sea incorrecta. La raíz editorial y el checkout estable siguen siendo la frontera de confianza, sin autenticar ejecutores o cálculos de terceros.

**Coste de corregir.** Incorporar al control del rastro actual la receta de versión de explicación y sus dependencias, con prueba negativa de cambio en una fuente no perteneciente al dominio. Mantener la comprobación histórica separada: los snapshots anteriores deben seguir verificándose con sus propios bytes, sin exigírseles fuentes actuales. No requiere reinterpretar fiscalidad ni migrar atestaciones. El padre aplica la corrección; no se entrega parche.

## Rastro: comprobaciones y límites

Se inspeccionaron los 49 puntos y sus expresiones; `casos/puntos.json` conserva siteId, unidad, expresión y localizador de cada uno. Son 45 puntos ordinarios y cuatro resúmenes de retención. Los seis puntos repetidos de tramos/componentes usan el índice de su recorrido; los restantes usan instancia cero y siteId propio. No hay inferencia por etiqueta. El helper guarda `Decimal.toFixed()` antes de producir la presentación monetaria a dos decimales; el porcentaje ya recibe el tipo calculado por retenciones. No se promete recuperar precisión perdida en etapas anteriores que entregan céntimos o números.

El caso propio Madrid 2025 con trabajo, ganancias y retención ejecuta **los 49 siteId**, con 55 instancias y siete líneas internas de retenciones pendientes. El primer intento sin ganancias ejecutaba 48 puntos porque no había tramo de ahorro; se conserva el fallo de preparación de cobertura en `retencion-sin-ahorro.log`. Se añadió una ganancia, sin cambiar expectativas ni implementación. Los 21 casos anuales propios comprueban además formato frente al decimal, URLs compuestas exclusivamente por snapshot/identidad/revisión y fronteras históricas. Las pruebas existentes rechazan instancia duplicada, unidad incompatible, ID dinámico/duplicado y retagging de un rastro ya enlazado; una etiqueta distinta conserva identidad. Los sondeos propios rechazan catálogo con versión incompatible, fuente de dominio alterada y CAS incompleto por objeto desaparecido.

Contexto: año, territorio y perfil se conservan en el rastro calculado, no en la URL. Las fichas son técnicas: ámbito jurídico desconocido, derivación y citas pendientes. Las referencias heredadas a manuales 2025 o al algoritmo 2026 no prueban vigencia de todos los ejercicios. La explicación identifica sus limitaciones, pero esta revisión no cierra el contrato fiscal anual ni la política de redondeo. El agregado del alquiler sigue expresamente simplificado. No se confunden cantidades teóricas con aceptación de su aplicación legal.

La suite de contenido llama directamente al GET de Next: HTML/404, ausencia de scripts y Referrer-Policy no-referrer; no se abrió un servidor. El enlace mínimo del componente usa la referencia generada y no incorpora importes a su URL. No se ensayó telemetría o infraestructura de producción; esta comprobación se limita a rutas, contenido y construcción local del enlace.

El snapshot `9a38821d9d5ea6130e3e4019f40a0b7a3d6d57d6675f8e67643773ade14dfdec` corresponde al catálogo examinado. Algoritmo = hash de generationInputs; datos = hash del artefacto; explicación = hash de generador y fuentesSoftware, recalculados en el control propio. El test histórico verifica una versión contra su inventario conservado. **49.958 ocurrencias y 50.011 fichas (incluidos 49 puntos y cuatro conceptos) no son reglas fiscales aceptadas.**

## TDE-09/10

Se reabrieron por hash los originales de Ley 39/2010 (página física 60) y Ley 26/2014 (página física 12), leyendo las páginas completas y no solo la conclusión del auditor. Textos y hashes en `logs/documentos.log`. El primero preserva 2.652 euros si otras rentas exceden 6.500; el segundo exige que otras rentas no exentas no superen 6.500 para la reducción. Se contrastó el alcance de la suma algebraica y sus límites con la auditoría y contrarrevisión previas; no se hizo una búsqueda legislativa nueva exhaustiva de todos los ejercicios.

Las 25 pruebas propias del padre pasan: quince ejercicios de función, siete liquidaciones y tres casos de pérdida/exención/alquiler. Los sondeos de esta revisión añaden 21 ejecuciones del anual (2012, 2013, 2014, 2015, 2018, 2025 y 2026; otras rentas 6.500, 6.500,01 y −7.000). La igualdad no excluye; el céntimo adicional produce 2.652 en 2012–2014 y cero desde 2015. Pérdidas y exenciones están cubiertas también por la suite seleccionada: la suma usa ganancia sujeta general y de ahorro antes del suelo de bases. El adaptador antiguo declara cero otras rentas; la API canónica exige el saldo.

El log previo distingue 22 fallos numéricos y tres TypeError por omitir contexto.modo. La corrección de preparación no modifica el resultado esperado, y los casos actuales suministran contexto; no se aceptan esos tres errores como discrepancias fiscales anteriores. Se mantienen los límites: alquiler sin gastos/reducciones completos y categorías ausentes. Motivo de no ampliar aceptación: no existen hechos suficientes para probar sus requisitos. Coste: nuevas entradas, fuentes y regresiones cuando se incorporen. La revisión no valida contratos de alquiler ni rentas aún ausentes, ni convierte 2026 en ejercicio cerrado.

## ENV2-01 y puente

Reproducción personal con los PDFs sintéticos conservados `tab.pdf` y `plain.pdf`. El primero sigue extrayendo U+FFFD y rechaza el binding positivo. La misma cita se conserva sin binding con normalization identity y el carácter literal intacto; se comprueba que el PDF no cambia. El positivo íntegro permite cite y verify. Las pruebas corpus añaden sustitución después del número y en otra línea: el rechazo afecta a toda la cita. Motivo del rechazo conservador: se ha perdido información y no procede adivinar el signo. Alcance: binding numérico, no eliminación del documento. Coste: recorte mejor delimitado o revisión de extracción.

24 pruebas corpus y 18 bridge pasan. Una reconstrucción real del coordinador devuelve rebuilt-from-current-code y siete dependencias documentales verificadas. Madrid: valor 53407.2, numericBinding verified, bindingReview pending, authenticity trust-indeterminate, completeRuleAcceptance false. El payload actual `10a3a80560cf492b688bfd8690d727e1a4e1514921f36f97189c69bf637306d3` queda pendiente de atestación del snapshot estable. No se emite ni migra una atestación. ENV1 permanece conservado; los controles del puente se ejecutaron, sin repetir aquí todas las inyecciones tardías del revisor v2. No se afirma atomicidad ni resistencia ABA.

## Separación de conclusiones

- Integridad: controles de bytes, fuentes de dominio, fichas, rutas y corpus favorables; RV3-01 deja incompleta la detección de software de explicación obsoleto.
- Autenticidad: no se validaron de nuevo firmas históricas, CSV ni identidad de ejecutor. El hash identifica bytes, no al emisor.
- Interpretación: aceptación limitada de la condición de otras rentas; fichas de pasos y contratos ausentes siguen pendientes.
- Exactitud: fronteras probadas y binding madrileño coincidentes dentro del alcance indicado; ninguna certificación de cuotas completas.
- Aceptación: TDE-09/10 y ENV2-01 aprobables acotadamente; solicitar RV3-01 antes de dar por cerrada la comprobación del rastro actual. Payload madrileño nuevo sin atestación.

## Reproducción y entrega

Logs: 88 pruebas motor/rastro/otras rentas, 15 contenido, 24 corpus y 18 bridge. Son recuentos de suites, no reglas; los casos propios no se suman a la cobertura fiscal. Trabajo pesado serializado con `flock /tmp/irobopf-validacion-pesada.lock`, un worker. Nix para Bun/Node; Python mediante tools/procedencia/run.sh (Nix/uv). No Next build ni suites legacy. Node_modules enlazado a raíz para lectura, sin instalar globalmente ni editar lockfiles.

Para reproducir instrumentos, copiar los `.txt` a `.cache/procedencia/revision-rastro-v3/` quitando solo la extensión `.txt`; ejecutar los `.mjs` con Bun desde raíz bajo el lock y documentos.py con el wrapper. Son instrumentos conservados de revisión, no código mantenido del producto ni una suite nueva incorporada a CI. No se atribuye lint/typecheck global a esta revisión: no se modificaron fuentes mantenidas. Se consultaron effect-solutions list/show basics/testing y la fuente local v4 para el runner.

El manifiesto SHA-256 cubre todos los entregables excepto el propio manifiesto; incluye además huellas de las fuentes examinadas y la base. No se copia un inventario grande ni metadatos privados. Las reproducciones no cambian archivos de implementación o confianza.
