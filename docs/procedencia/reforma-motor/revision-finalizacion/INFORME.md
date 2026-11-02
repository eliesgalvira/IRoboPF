# Revisión independiente de la finalización del motor

El candidato no cierra la retirada: conserva una escala exportada incorrecta y una tabla pública que la reproduce. Además, la entrada anual desde JavaScript admite una modalidad fuera del contrato. Los fixes de identidad de conjunta pasan las comprobaciones delimitadas de esta revisión. No se modifica producto, expectativas ordinarias, datos regionales, confianza ni puertas de aceptación.

Se cotejó HEAD con la base preparada y sus dos diferencias documentales respecto de la base del candidato. Se verificaron las 95 preimágenes, los 77 payloads y las 18 retiradas antes/después de aplicar el fixture. Los cambios propios se limitan a esta carpeta. Los documentos anteriores permanecen intactos.

## 1. Retirada real: incompleta

**R-M01, defecto financiero en API de cuotas.** `lib/dominio/irpf/cuotas/escalas-gravamen.ts:23–51` conserva `calcularCuotaPorEscalaGeneral` y `calcularDesgloseCuotaPorEscalaGeneral`, ambas dependientes de `obtenerTramosIrpfLegacy`. En `lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:92` la primera frontera es 17707. Para año 2014 y base 17707.20, la primera API devuelve **4382.5425**, frente a **4382.532** al integrar los mismos tipos con la frontera 17707.20. Diferencia precisa: 0.0105 euros. R-M01 en [casos originales](casos.test.ts.txt) falla ordinariamente; no es un fallo esperado invertido.

El contraste documental ya está delimitado en el lote escalas-mínimos 2012–2018, `CONTRAEJEMPLO.md`: manual 2014, página física 467; Ley 39/2010, modificación del art. 63.1.1, [BOE-A-2010-19703, página física 63](https://www.boe.es/boe/dias/2010/12/23/pdfs/BOE-A-2010-19703.pdf), SHA-256 `e7b629a20bde61bcb42c54b2caf3af06f2b44613fc6f89718ff5ff9763d4a4f4`. Se reutiliza ese contraste; no se introduce una interpretación normativa de otras tarifas. El cálculo aquí contrasta una representación combinada técnica; no es una liquidación madrileña ni una certificación autonómica.

**R-M02, defecto de exportación.** `lib/dominio/analisis-salarial/progresividad-frio.ts:707–723`, `construirTablaControlTramosIrpfCompatible`, sigue produciendo 17707 para la primera fila 2014. R-M02 exige 17707.2 y falla. Recorrido efectivo: `lib/export/auditoria-excel.ts:133` consume la tabla; `auditoria-progresividad-frio.ts` también la importa. Su traslado desde compatibilidad no la retira ni corrige sus datos. Es la misma raíz que R-M01, con otra superficie observable.

**Objeción descartada: impacto anual 2014 por esa rama.** Aunque `liquidar-irpf-anual.ts:487,585` sigue llamando a las funciones generales cuando `escalaAutonomicaIgualEstatal` es verdadera, `comunidades/comunidad-autonoma.ts:161,180,203,230` fija false en 2012–2015, incluida `simulada-estatal`. Por tanto, no queda demostrado un error anual 2014 por los límites truncados. El control R-C01 usa capital inmobiliario simplificado de 17707.20, trabajo vacío, individual de 40 años, sin familiares, deducciones ni pagos: devuelve base 1770720 y cuota íntegra 438253 céntimos, correcta para ese contraste. Una exploración salarial previa de 25000 también pasó; no se conserva como contraejemplo financiero.

Desde 2016 el selector sí habilita esa rama para `simulada-estatal`; también la alcanza el salario sin comunidad explícita. No se ha probado que sus valores para esos años sean incorrectos. No se debe declarar defectuoso un cálculo solo por contener `Legacy` en su nombre. Sí quedan dos selectores de escala y wrappers generales por resolver en la retirada. Los nombres residuales de IPC, cotización, dinero y presentación no son por sí mismos otra liquidación fiscal. Se localizaron los consumidores del export de tramos; no se afirma equivalencia financiera de todos los años ni una retirada completa de todos los exports históricos.

Condición de cierre: retirar o sustituir la API incorrecta y su tabla de exportación, revisar los consumidores efectivos y preservar el contraste de céntimos con la representación escogida. Si se elimina un export, sustituir el test por el contrato de su sucesor y comprobar ausencia de consumidores. No desplazar indiscriminadamente fronteras canarias: base desde y límite hasta no tienen el mismo contrato.

## 2. Conjunta Madrid/Murcia: fixes comprobados, alcance parcial

Pasan los diez tests de `tests/deducciones-conjunta-identidad.test.ts`: controles históricos 2886.80/2000, F-M01 721.70 y F-M02 1000; ambos órdenes y referencias, progenitor/titular b, varios titulares, reparto individual, tope por hijo, identidades incompletas/inconsistentes y ajenos. Se ejercitan API directa, despachador y auxiliar. Los siete adversos propios de [adversos.test.ts](adversos.test.ts) añaden rechazos en el despachador, hijos repetidos, eventos repetidos y discrepancia de unidades; pasan. No se asume que una lista de IDs por sí sola acredita jurídicamente la unidad completa: los evaluadores siguen siendo parciales y exigen elegibilidad externa.

Precisión de objeto: F-M02 de la revisión F ampliada y del candidato es **guardería Murcia**, código `murcia_gastos_guarderia`, no material escolar. El encargo usa esa otra denominación, pero sus controles/importes identifican guardería. No se ha revisado ni certificado el caso distinto de material escolar. No se reabren las 351 deducciones ni las reservas documentales E/F ya revisadas.

## 3. Derechos familiares y retenciones: conexión comprobada, admisión anual pendiente

Se retiraron físicamente FamiliarFiscal y los dos helpers familiares insuficientes; los tests ejercitan rechazo del modo antiguo y de listas parciales, también por el servicio. Derechos y retenciones pasan sus controles y rechazos, incluidos alimentos propios sin mínimo, coherencia de rentas y omisión de derechos en la entrada que los exige. Esto no amplía la familia anual admitida más allá de Madrid 2025 individual con hechos completos.

**R-M03, modalidad anual no rechazada en runtime.** `liquidar-irpf-anual.ts:198–228` comprueba `familiar.tipo !== "individual"` solo cuando existe `derechosMinimos`. Sin esa propiedad, la API pública acepta `tipo: "conjunta"` desde JavaScript, con Madrid 2025, edad 40, listas familiares vacías, trabajo 30000 y sin deducciones/pagos. `Effect.exit` devuelve Success con el perfil individual. El contrato TypeScript impide escribirlo sin supresión, pero no protege consumidores JavaScript; el test conserva esa entrada deliberada y espera Failure. No se afirma que la cuota calculada sea una cuota conjunta correcta ni se certifican otros años/comunidades. La condición de cierre es rechazar la modalidad fuera del contrato antes de calcular, por API pública y servicio, independientemente de derechos. No habilitar conjunta anual como arreglo de esta revisión.

## 4. Garantías retiradas/sustituidas: cobertura acotada

Pasan cuota/neto contra la ruta anual en siete fronteras de bruto de R47, el control de retirada y las siete referencias salariales de `anual-salarial-completo.test.ts`, junto con sus rechazos de ámbito, cotizaciones y retenciones. Estas últimas ejercitan `liquidarIrpfAnualExplicito` con importes efectivos: no prueban que cada ruta anual tenga igual cobertura. La cuota explícita mantiene su propio recorrido condicionado; no debe ocultarse bajo la expresión «una sola cuota» ni confundirse con el perfil salarial simulado.

El censo AST comprueba integridad estructural de fuentes, llamadas y argumentos y sus mutaciones; pasa. No interpreta semánticamente el grafo financiero. Su filtro por nombres `calcular.*Legacy` no detecta los wrappers generales conservados; los rojos R-M01/M02 muestran que un censo verde y ausencia de carpetas no acreditan retirada correcta. La tabla de sustituciones del informe de integración reconoce pendientes de interpretación simbólica y transporte. Las garantías Excel/equivalencia de redondeos retiradas no quedan automáticamente recuperadas por esas pruebas. Los contratos históricos conservan su genealogía; no acreditan las nuevas fuentes. No se ha demostrado una equivalencia general de todas las rutas reformadas.

## 5. Privacidad, ejecución y límites

Dependencias instaladas con `bun install --frozen-lockfile`, sin copiar node_modules ni CAS de otra entrega. Se inspeccionaron tests ordinarios y CI: no se localizaron imports desde caché ni lecturas de rutas privadas u objetos Git antiguos en los tests TypeScript/MJS ordinarios buscados. Los ensayos que crean cachés/mini-CAS sintéticos no implican dependencia de un CAS privado. No se ejecutó el corpus local excluido ni se afirma auditar cada acceso transitivo del repositorio.

Ejecuciones completas de esta revisión (siempre un trabajador):

- Siete suites: identidad conjunta, retirada, integración derechos, retenciones con derechos, retención AEAT, R47 y conexión anual: **87 pases**.
- Tres suites: anual salarial completo, mínimos derechos y salario neto IRPF: **90 pases**.
- Configuración documental propia: **8 pases y 3 fallos ordinarios**, R-M01, R-M02 y R-M03. El código de salida 1 es evidencia conservada.

Reproducción desde raíz: `bun run test --config docs/procedencia/reforma-motor/revision-finalizacion/vitest.config.ts --reporter=verbose --maxWorkers=1`. Las pruebas documentales se incluyen mediante esa configuración explícita, sin alterar la ordinaria. Se consultaron effect-solutions (basics, testing) y ejemplos del repositorio local antes de escribir el arnés Effect.

No se ejecutaron build, lint, typecheck, workflow completo, inventarios ni las revisiones generales E/F/obligaciones: no son necesarios para reproducir estos fallos y corresponde al receptor repetir la matriz tras la corrección. Los 22 verdes y build del autor son evidencia del autor, no ejecuciones de esta revisión. Jujutsu está instalado pero no reconoce este checkout; no se inicializó ni se mutó VCS. Las lecturas de HEAD/base y la retirada final se distinguen de cambios de producto.

Pendientes internos concretos: corregir/suprimir los exports R-M01/M02 con pruebas de sus consumidores; cerrar la admisión R-M03; delimitar la coexistencia de la API explícita y el perfil anual técnico; completar las garantías simbólicas declaradas pendientes; repetir CI sobre la integración final recibida. Esta revisión no acepta el candidato ni promueve su confianza.

## Conservación tras la retirada de las API

Los tres rojos originales se reprodujeron antes del arreglo. Su archivo se conserva byte a byte como `casos.test.ts.txt`, con hash en `historico.json`, para no mantener importaciones de API retiradas en el código compilable. Las regresiones actuales están en `tests/motor-unico-revision.test.ts`; la configuración documental sigue ejecutando los adversos de conjunta. Este añadido no modifica el dictamen sobre el candidato revisado.
