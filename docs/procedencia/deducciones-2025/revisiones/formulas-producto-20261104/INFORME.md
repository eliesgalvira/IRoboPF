# Revisión independiente del candidato valenciano 2025

Dictamen de cambio de producto: **requiere correcciones acotadas en fórmulas**. Tres hallazgos P2 reproducidos; el enrutamiento privado añadido recibe dictamen favorable en sus 23 comprobaciones, condicionado a conservar el estado parcial. No se certifica cobertura fiscal universal ni se reabre F, guardia, los nueve auxiliares o los doce datos ya aceptados.

Fecha: 2026-11-04. Base declarada: 461e16323ca11e428c3e391568755c3e6b2766ab. Revisor en raíz de sólo lectura, sin worktree, subdelegación ni VCS mutante. Las nueve postimágenes coinciden exactamente con manifiesto y evaluadores.patch del autor (candidato-congelado.json). No se editó producción ni recepción. PESADO1 usado secuencialmente y **liberado al entregar**.

## Hallazgos de fórmula

**H1 · P2 · deporte, gastos.ts:170–172.** Se multiplica dos veces por proporcion. Entrada individual A, liquidable 12.000, gasto común 200, ayudas/reembolsos 0, declarantes con derecho A/B, edad del declarante 50 y grado 0. Legal: 200 / 2 × 30% = **30**. Real: **15**, calculo_parcial. Test rojo H1-deporte-reparto-doble. El art.4.Uno.ad, redacción DL1/2026 art.3, exige repartir la base una sola vez; citas valenciana_deporte_actividades_saludables-o2-revision y operativo, original CAS 0da3faeb4a83f7ff11bbecb54ddfb6d96c7e9d18c87e91a60555fb54ee029b4c. Reparación: retirar una multiplicación por proporcion; conservar tipo por edad/discapacidad y tope. No ajustar el esperado para acomodar el fallo.

**H2 · P2 · fertilidad, index.ts:165–172.** Una unidad fuera del intervalo excluye toda la solicitud después de sumar las elegibles. Entrada conjunta A/B, renta conjunta 12.000, ambas mujeres tratadas en clínica autorizada con gasto 500, A=45 años, B=46. Legal: **100 para A, cero para B**; no hay una regla que prive a A por la edad de su cónyuge. Real: **excluida sin importe**. Test rojo H2-fertilidad-mixta. Art.4.Uno.ab, cita valenciana_tratamientos_fertilidad-n1: condición individual de edad de la mujer tratada. Reparación: exclusión por unidad; emitir excluida por edad sólo cuando todas las unidades quedan fuera, y mantener el parcial válido al combinar edades. Si no se soporta esta composición, devolver rechazo explícito de composición, nunca excluir a la elegible como si careciera del derecho.

**H3 · P2 · comodato inmueble, donaciones-inversion.ts:65–72.** diasComodato se lee como decimal no acotado. Entrada período 2025 completo, fecha 1enero, valor catastral 36.500, diasComodato=366, sin deducción estatal, renta12.000. La valoración anual al 4% × días del período /365 no admite 366 días en2025. Legal para365 días: base1.460, deducción máxima **365**; para los hechos incompatibles recibidos corresponde **no_soportado**, sin importe. Real: **366**, calculo_parcial. Test rojo H3-comodato-366dias. Art.4.Uno.s.4, pasaje primario conservado en gl-35/gl-38/gl-41: proporción según días de cada período impositivo. Reparación: entero0..365 y coherencia con duración del período (o rechazo explícito de períodos que aún no se representen); no recortar silenciosamente un hecho imposible.

Las entradas completas, esperados y resultados reales de los tres casos constan en resultados.json. Son fallos nuevos del candidato ejecutable, no reservas de acreditación universal.

**O1 · P3, observación no bloqueante de importe.** cuota.ts sustituye motivo del generado por una frase genérica. Con renovables desaparece, por ejemplo, la exclusión de instalaciones obligatorias CTE. El estado y aceptacionFiscal siguen pendientes, pero se pierden las reservas específicas. Test rojo O1-cuota-conserva-reserva-CTE. Reparación pequeña: conservar generado.motivo junto al motivo propio de aplicación a cuota. El evaluador base sí conserva reservas en las40 comprobaciones. No se exige aquí acreditar esas reservas.

## Integración privada (separada)

Se revisó producto-valenciana-integracion-20261104/contratos-2025.ts, integracion.patch, manifiesto y sondeo. No se aplicó el parche. La preimagen coincide con contratos-2025.ts de raíz; los hashes del candidato y parche coinciden con su manifiesto. El cambio añade exclusivamente la variante valenciana_hechos, validación de esquema y ámbito y claves de duplicación por código.

**Favorable en el alcance probado: 23/23 aserciones independientes.** Igualdad completa con resultado directo (importe61,50, motivo específico, calculo_parcial y aceptacionFiscal pendiente); rechazo de agregado; ejercicio/territorio/modalidad/titular/declarantes discordantes; duplicados de identidad; extras superiores y de unidad; NaN; conjunta con orden de declarantes distinto y conjunto discordante; normalización individual del contexto sin declarantes; duplicado de hechos y hechos/consignación en ambos órdenes; ausencia de mutación. No usa catálogo para obtener importes ni abre calcularDeduccionGenerica. Se conserva el rechazo de parciales, así que q2/q3/r/s separados no pasan a una suma fiscal final por este cambio.

El runtime privado se construyó cambiando únicamente rutas de importación. Fue necesario fijar Effect y Decimal a las dependencias de la raíz: la resolución Bun desde Backups encontraba Effect4.1.2 de caché y provocaba cuatro rechazos de esquema espurios con esquemas de otra versión. Con imports absolutos a dependencias del proyecto:23 verdes. Este incidente de carga del arnés no es defecto del producto. integracion-resultados.json y logs/integracion.log conservan la ejecución final. No se presentan las once aserciones del autor como pruebas nuevas.

No se probó todavía una composición aplicada de integración+arreglos, pues producción sigue congelada. La integración favorable no subsana H1–H3.

## Ramas realmente comprobadas

La siguiente tabla contiene **40 entradas nuevas** del revisor, con cifras distintas o ramas distintas de los40 casos base del autor. El contrato no recibe los esperados. La función se importa de raíz; no se copia implementación ni se usa catálogo como oráculo. Las cifras son aritmética independiente contrastada con los primarios extraídos y la precedencia de g-vivienda, g-inversion-dana y g-cultura-lengua. Cada fila es un caso concreto, no una certificación de todas sus combinaciones.

| Fórmula (prefijo valenciana_) | Esperado / real € | Rama ejecutada |
| --- | --- | --- |
| nacimiento_adopcion_multiples | 246 / 246 | `{"numeros":{"personasMismaFecha":3},"textos":{}}` |
| nacimiento_adopcion_acogimiento_discapacidad | 303 / 303 | `{"numeros":{"grado":70,"otrasPersonasDerecho":1},"textos":{"tipo":"adopcion"}}` |
| familia_numerosa_monoparental | 330 / 330 | `{"numeros":{},"textos":{"categoria":"general"}}` |
| custodia_guarderias_menores_3 | 150 / 150 | `{"numeros":{"gastoCustodia":1000,"diasMenorTres":365},"textos":{}}` |
| conciliacion_trabajo_familia | 230 / 230 | `{"numeros":{"mesesDerecho":6,"cotizacionIntegraIntervalo":400},"textos":{}}` |
| discapacidad_65 | 197 / 197 | `{"numeros":{"edad":70,"grado":40},"textos":{"prestacionExenta":"no"}}` |
| empleados_hogar_cuidado_personas | 200 / 200 | `{"numeros":{"cuotasMesesDerecho":400},"textos":{"grupo":"ascendientes","limite":"reforzado"}}` |
| arrendador_renta_precio_referencia | 100 / 100 | `{"numeros":{"rendimientoIntegro":2000,"rentaMensualConRepercusiones":500,"precioReferenciaHistorico":500},"textos":{"celdaCaLabVersion2025":"fuente/2025"}}` |
| primera_vivienda_menores_35 | 123 / 123 | `{"numeros":{"edad":34,"pagosSinIntereses":2460},"textos":{}}` |
| vivienda_discapacidad | 123 / 123 | `{"numeros":{"pagosSinIntereses":2460},"textos":{"discapacidadCualificadaDevengo":"certificado"}}` |
| vivienda_ayudas_publicas | 160 / 160 | `{"numeros":{"ayudaIntegradaDestinada":2000,"tipoMedioAutonomico":8},"textos":{"regimen":"regeneracion"}}` |
| arrendamiento_actividad_distinto_municipio | 100 / 100 | `{"numeros":{"distanciaKm":70,"alquilerNoReembolsado":1000,"diasContrato":365},"textos":{}}` |
| autoconsumo_renovables | 600 / 600 | `{"numeros":{"gasto":2000,"ayudas":500,"reembolsos":0,"fraccionPagadaVivienda":1},"textos":{"vivienda":"habitual"}}` |
| donaciones_finalidad_ecologica | 112.5 / 112.5 | `{"numeros":{"valorAportado":500},"textos":{}}` |
| donaciones_bienes_patrimonio_cultural | 112.5 / 112.5 | `{"numeros":{"valorAportado":500},"textos":{}}` |
| donativos_conservacion_patrimonio_cultural | 112.5 / 112.5 | `{"numeros":{"valorAportado":500},"textos":{}}` |
| conservacion_patrimonio_cultural_titulares | 112.5 / 112.5 | `{"numeros":{"valorAportado":500},"textos":{"titularidadInventarioIntervencion":"factura"}}` |
| donaciones_lengua_valenciana | 112.5 / 112.5 | `{"numeros":{"valorAportado":500},"textos":{"grupoDestinatario":"4"}}` |
| donaciones_cesiones_fines_culturales_cientificos_deportivos | 100 / 100 | `{"numeros":{"valorCatastral":36500,"diasComodato":100},"textos":{"clase":"comodato_inmueble","deduccionEstatal683a":"no"}}` |
| dos_o_mas_descendientes | 200 / 200 | `{"numeros":{"descendientesMinimo":3,"imponiblesAgregadasPersonasUnicas":29999,"cuotaIntegraAutonomica":2500,"minoracionesEstatales":500},"textos":{}}` |
| incremento_costes_financiacion_vivienda | 50 / 50 | `{"numeros":{"diasPrestamoAnterior":360,"intereses2025":1200,"intereses2024":1100},"textos":{}}` |
| material_escolar | 22 / 22 | `{"numeros":{"diasDesempleo":73},"textos":{}}` |
| obras_conservacion_mejora_periodo | 500 / 500 | `{"numeros":{"gasto":1000,"ayudas":0,"reembolsos":0},"textos":{"planYActuacionCalificados":"plan","accesibilidad33":"si"}}` |
| obras_conservacion_mejora_2014_2015 | 50 / 50 | `{"numeros":{"gasto":1000,"ayudas":0,"reembolsos":0,"baseConsumidaHistorica":4500},"textos":{"anioObra":"2014","plan2013a2015YBaseHistorica":"plan"}}` |
| abonos_culturales | 21 / 21 | `{"numeros":{"gasto":100,"ayudas":0,"reembolsos":0},"textos":{"adhesionYProrrogaVigentes2025":"convenio"}}` |
| vehiculos_orden_5_2020 | 66 / 66 | `{"numeros":{"gasto":1000,"ayudas":0,"reembolsos":0},"textos":{"clase":"kit","caracteristicasOrden5":"ficha"}}` |
| inversion_entidades_nuevas_reciente_creacion | 300 / 300 | `{"numeros":{"inversionDesembolsada":1000},"textos":{"regimen":"general"}}` |
| municipio_riesgo_despoblamiento | 594 / 594 | `{"numeros":{"descendientesSinABC":3},"textos":{"municipioFondo2024o2025":"fondo"}}` |
| tratamientos_fertilidad | 100 / 100 | `{"numeros":{"edad":45,"gastoTratamiento":500},"textos":{"clinicaAutorizada":"registro"}}` |
| gastos_salud | 30 / 30 | `{"numeros":{"gasto":100,"ayudas":0,"reembolsos":0},"textos":{"clase":"mental"}}` |
| fomento_formacion_musical | 90 / 90 | `{"numeros":{"gasto":90,"ayudas":0,"reembolsos":0},"textos":{"relacion":"conyuge"}}` |
| ayudas_publicas_erte_covid | 24 / 24 | `{"numeros":{"ayudaTotal":500,"ayudaIntegrada":300,"ayudaExenta":200,"tipoMedioAutonomico":8},"textos":{}}` |
| donaciones_covid_investigacion | 117.5 / 117.5 | `{"numeros":{"valorAportado":500},"textos":{}}` |
| donaciones_covid_gastos_crisis_sanitaria | 117.5 / 117.5 | `{"numeros":{"valorAportado":500},"textos":{"aceptacionYDestinoDL4":"resolucion"}}` |
| dana_danos_materiales_vivienda_habitual | 500 / 500 | `{"numeros":{"gasto":800,"ayudas":300,"reembolsos":0},"textos":{"anexoFiscalAcuerdo4nov2024":"anexo","municipio":"Loriguilla","subambito":"nucleo_A3"}}` |
| dana_aportaciones_fondos_propios_entidades | 450 / 450 | `{"numeros":{"inversionDesembolsada":1000},"textos":{"anexoFiscalAcuerdo4nov2024":"anexo","municipio":"anexo_fiscal","entidad":"preexistente","solicitudERTEPorTemporal":"exp","domiciliosSocialFiscalYMantenimiento":"escritura"}}` |
| nacimiento_adopcion_guarda_acogimiento | 900 / 900 | `{"numeros":{"ordenPorContribuyente":3},"textos":{"tipo":"nacimiento"}}` |
| ascendientes_mayores_discapacidad | 197 / 197 | `{"numeros":{"edad":76,"grado":0,"rentaNoExenta":8000,"rentaDeclaracion":1800,"diasConvivencia":183},"textos":{"claseDiscapacidad":"fisica"}}` |
| arrendamiento_cesion_uso_vivienda | 300 / 300 | `{"numeros":{"condicionesReforzadas":2,"alquilerSinServicios":1000,"diasContrato":365},"textos":{"contrato":"alquiler"}}` |
| deporte_actividades_saludables | 50 / 50 | `{"numeros":{"gasto":100,"ayudas":0,"reembolsos":0,"edad":75,"grado":0},"textos":{}}` |

| Grupo adicional | Comprobación efectivamente ejecutada | Resultado |
| --- | --- | --- |
| Deporte | 65/66/75/76, gasto100 sin discapacidad | 30/50/50/100 |
| Salud, música y deporte | Individual54/57/60k; conjunta72/75/78k, gasto suficiente | 150/75/0 para cada concepto |
| Fertilidad | 39/40/45/46 y renta28.500 | excluida/50/50/excluida; mixta H2 roja |
| Múltiples | Reparto mitad y factor renta mitad | 61,50 |
| Despoblación | Dos descendientes y renta90k | 528, sin límite general ajeno |
| Inversión z | 29/30diciembre, inversión50k cualificada, liquidable1.000 | 9.900/15.000; no se añade tope4.Dos |
| Ayudas | Ayudas+reembolsos superiores al gasto en salud/deporte/renovables/DANA vivienda | 0, nunca negativo |
| Prorratas no implementadas | Siete ramas en devengo30junio: custodia, material, conciliación, nacimiento, ascendientes y ambos alquileres | no_soportado, nunca cero anual disfrazado |
| q2/q3/r/s | Base30% con liquidable1.000 y aportación9.000 | 62,50/62,50/62,50/75; techo conjunto pendiente de composición |
| Consolidación | Salud categoría repetida, abonos y conciliación con dos unidades | Rechazo concreto |
| Valoraciones s | Especie/usufructo/comodato mueble | Rechazo concreto; no se presume valor |
| Arrastres renovables | Origen2020/2021 para2025 | Caducado/reparto de cuota admisible; autor prueba también duplicados |
| Calendario/identidades | 29feb2025, devengo2026, declarantes repetidos y unidades repetidas | Rechazo |
| Efectos secundarios y extras | Solicitud compartida repetida sin mutación, campo importe superior y número extra sin uso | Sin mutación ni inyección de importe; ruta directa permite/ignora extras superiores, integración los rechaza |

No se afirmó comprobar todos los historiales de arrastre, todas las valoraciones ni la autenticidad de identidades/expedientes. Los IDs se deduplican sintácticamente; identidades reales distintas siguen siendo hechos aportados. El esquema de base admite números/textos extra no consumidos: no acreditan ramas ni causan aceptación fiscal.

Los topes se revisaron según su sujeto:297 por menor;197 por contribuyente/ascendiente según letra; base8.800 por vivienda y ejercicio con fracción efectiva; bases5.500 y4.500/5.000 por vivienda; tramos de donaciones sobre unidad consolidada; deportes/salud/música con límite y reparto de base distintos. La sonda de música conjunta de150 se registra como comportamiento, sin inferir automáticamente que todos los límites deban multiplicarse por número de declarantes. No se ha elevado esa sonda a hallazgo sin resolver la regla de tributación conjunta aplicable.

q2/q3/r/s comparten techo del30%: sus parciales aislados no pueden sumarse como importe fiscal aceptado. La documentación del candidato y el rechazo del agregado lo mantienen pendiente y visible. No se convierte esa integración futura en defecto de fórmula aislada. Renovables distingue base máxima y deducción no aplicada por insuficiencia de cuota; la observación O1 concierne a reservas perdidas, no a inventar un arrastre del exceso de inversión.

## Fuentes y validación

Se leyeron INFORME.txt, manifiesto y evaluadores.patch; los siete módulos, tests y documento del candidato; matriz e informe de investigación y reservas; hechos-calculo y decisiones g; rectificaciones y citas g-vivienda, g-inversion-dana y g-cultura-lengua. contraste-primarios.json guarda los pasajes primarios ya extraídos por código y referencias:7 originales CAS dirigidos comprobados por SHA256, sin descarga, copia de originales ni reextracción masiva. Se reutilizan decisiones previas de remisiones, no se vuelve a auditar guardia+12datos. Los extractos complementarios conservan su procedencia versionada; esta revisión no pretende rehacer su cadena completa.

- Regresiones focales: **148/148**, tres archivos, un worker,1,45s. Sin CI completo.
- Pruebas independientes de fórmulas/contrato: **106**,102verdes,3hallazgos rojos y1observación roja. El runner sale1 deliberadamente.
- Integración privada: **23/23**, runtime de dependencias raíz.
- Todas las órdenes de scripts y pruebas se ejecutaron con timeout -k30s y límite exterior, source de env-pruebas dentro del timeout; cachés fuera de entrega, sin instalar dependencias.

Reproducción desde raíz, sin editarla:

```sh
timeout -k 30s 3m bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; bun /home/elies/Backups/IRoboPF/producto-valenciana-revision-formulas-20261104/revision.ts'
timeout -k 30s 3m bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; bun /home/elies/Backups/IRoboPF/producto-valenciana-revision-formulas-20261104/integracion-revision.ts'
```

La entrega contiene parche de pruebas/documento, manifiesto, logs y resultados con entradas completas. Sólo el padre integra en procedencia-documental. Sin commit, push, bookmark, PR, borrado, worktree ni cambios en originales. Los hashes antes/después se comparan en fuentes-despues.json y preservacion.json. No se confunde cálculo parcial con aceptación fiscal.
