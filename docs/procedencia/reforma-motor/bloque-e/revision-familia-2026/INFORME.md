# Revisión independiente E familiar 2012–2026 + B territorial 2026

Fecha: 4/11/2026. Revisor: gpt-6.1-sol, esfuerzo high. Una revisión, sin subdelegación. Checkout leído en /home/elies/Repos/IRoboPF, sin modificación productiva ni operación VCS mutante. Turno PESADO1 utilizado secuencialmente y LIBERADO al cerrar.

## Dictamen acotado

No se han encontrado fallos reproducibles que bloqueen este candidato por importe incorrecto o publicación falsa en el alcance examinado. No equivale a certificación tributaria total, acreditación histórica universal ni cierre de F. No se exige otra revisión ordinaria para integrar este resultado.

Identidad: las 21 rutas de recepcion.json coinciden al principio y al final (hashes-iniciales.json, hashes-finales.json). candidato-eb.patch conserva SHA256 5ccbde642e39bbdb9c1ceb06700f38f3326c57096024870a2c23c28726c5a526. Se conserva la base declarada 1f71fb9d7e5cf311677f7de1eba7e323f6f0adfc. No se ha revalidado mediante una nueva aplicación la cadena de preimágenes ya comprobada por el padre.

## Evidencia independiente y resultados

764 discriminantes propios pasan (resultados-propios.json; resumen en pruebas-propias.log). Un proceso Bun, sin workers adicionales. Se consultaron AGENTS.md y las fuentes locales Effect.test.ts para Effect.runSync y Effect.result. effect-solutions list no está disponible en el entorno prescrito; no se instaló ni sustituyó por una herramienta prohibida.

El oráculo numérico de escalas se extrajo nuevamente de las celdas HTML de los originales CAS, verificando SHA256. Se usa FUENTES/ESCALAS de investigación solamente como localizador de original y artículo; los números no se copian de fixtures ni de lib. 17 tablas, 115 filas: límites, cuotas fijas y tipos coinciden con la transcripción productiva. La extracción normaliza separadores españoles, la raya inicial de Asturias a cero, la columna ordinal de Canarias y el cierre tipográfico » de Castilla y León. extraer-primarios.py permite reproducirlo sin red ni nuevas dependencias.

Se probaron cuatro puntos por fila: límite menos 0,01, límite, límite más 0,01 y límite más 123,4567 EUR. El esperado es la cuota fija del primario más el exceso por el tipo de esa fila. Además de verificar el núcleo, se comprobaron base y mínimo altos en composición para los 17 territorios.

Las 24 filas de diferencias-cuotas.json se consumen individualmente también como minoración del mínimo. Para cada fila se construye una familia completa de tamaño suficiente para que su mínimo autonómico caiga dentro de esa fila; se comprueban tanto cuota numérica como cuotaFija del desglose en base y mínimo. Los 24 casos pasan. Esto distingue el consumo real de la cuota oficial de la mera conservación de una tabla documental.

594 regresiones existentes pasan, 8 archivos, maxWorkers=1, cache desactivada, 4,74 s (regresiones.log). Incluyen las 575 focales del autor más redondeo-salarial-open y retenciones-derechos. Son evidencia de regresión, no el único oráculo fiscal. No se repitió CI general, corpus, inventario, tipos ni lint.

## Reglas y casos discriminantes

| Riesgo | Esperado independiente | Resultado |
|---|---|---|
| Familia en cada ejercicio 2012–2026 | Orden por edad, sin depender del orden de entrada; mitad para cada padre; mínimo propio sin reparto | Coincide; regresión adicional de los 255 pares ejercicio/territorio |
| Rentas | 8.000 y declaración 1.800 incluidos; un céntimo más excluye | Coincide en los 15 ejercicios |
| Edad del hijo | 24 elegible; 25 excluido sin discapacidad; 25+ con discapacidad elegible | Coincide |
| Menor de tres | Incremento a edad 0 y 2; no a 3 al devengo | Coincide en 2012, 2014, 2015, 2026 |
| Dependencia sin convivencia | No basta antes de 2015; sí desde 2015 si no hay alimentos judiciales impeditivos | Coincide |
| Adopción/acogimiento | Primer evento: año inicial y dos siguientes; posterior constitución no reinicia | Coincide para distancias 0, 2 y 3 |
| Grado | Próximo con rentas hasta 8.000 cede al siguiente; con 8.000,01 conserva prioridad | Coincide; los hechos mixtos no soportados se rechazan |
| Custodia exclusiva | Todo al elegible; cero al otro sin convivencia y con alimentos judiciales | Coincide al calcular ambos contribuyentes |
| Discapacidad estatal | 33 con/sin asistencia y 65+; importes distintos antes/después de 2015 | Coincide; Ley39/2010 art.61 y LIRPF60 |
| Baleares | 65: 5.550+1.820=7.370; 75: 8.910 | Coincide; el 10% del mínimo propio total explica el adicional65 |
| Rioja | Descendiente65: 9.900+3.000=12.900; no extender incremento a contribuyente/ascendiente | Coincide con art.31 bis |
| Canarias | Art.18 quater corregido: propio5.606; discapacidad65+asistencia12.120 | Coincide; evidencia de la corrección conservada |
| Asturias | Arts.2 bis–quinquies; propio6.105, descendientes/discapacidad incrementados; escala completa | Sin discrepancia en lo cotejado; discapacidad65+asistencia13.200 |
| 2026 deducciones | Lista vacía en los17 territorios; no heredar catálogo2025 | Coincide |
| Forales/desconocido | Rechazo explícito | Coincide en selector y regresiones de frontera |

En una ampliación propia hubo dos falsos rojos por un esperado erróneo del revisor: asistencia 2012/2014 se escribió como suma5.511 en lugar de 2.316+2.316=4.632. Se corrigió contra el original Ley39/2010 (hash verificado), no contra el resultado del motor. incidencia-oraculo-propio.log conserva esos dos fallos; ley39-2010-extracto.txt conserva la evidencia. La última ejecución pasa764/764. No es un hallazgo productivo.

## Revisión normativa e integración

Se cotejaron directamente los primarios CAS de Extremadura y Valencia: Ley2/2026 DF2.1 y DF7 justifican 7,75/9,75 con efectos1/1/2026; Ley5/2026 art.18 fija 8,8–29,35 para2026. Su DT3 establece otra escala desde2027 y no se consume aquí. El consolidado permite comprobar continuidad del resto de escalas con sus notas de reforma; no se infiere por coincidencia con2025. Para Ceuta/Melilla se extrajo la tabla del art.65 al que remite DA32, no se duplicó indebidamente el nuevo tramo estatal de300.000.

LIRPF57–61/63/66/76 y Ley26/2014 sustentan separación de mínimos estatales/autonómicos, cuantías2015+, escala general estatal y ahorro desde2025. Los extractos de primarios están en extractos-primarios.json. Se reutilizan originales por hash, sin adquisición masiva. Las tablas y notas son evidencia oficial consolidada de corte; no certifican futuros cambios posteriores a4/11/2026.

Inspección de rutas: derechos.ts contiene la decisión única de elegibilidad y reparto; composicion-anual.ts valida ámbito y conciliación antes de monetizar y llama al mismo cálculo para estatal y autonómico. Sus llamadas a gravar reciben la escala publicada tanto para la base como para el mínimo. El clon Decimal local preserva la precisión global20; se comprobó al final. comunidad-autonoma.ts:459–474 selecciona2026 con catálogo de deducciones vacío. La API anual selecciona mínimos por ejercicio; la entrada efectiva conserva2025, ámbito/SS efectiva y política Open restringida. Las regresiones originales Open y retenciones pasan. No se encontró una segunda fórmula familiar ni un nuevo silencio que convierta la falta de hechos en importe cero.

API-MOTOR.md, FAMILIA-ANUAL.md y B2026.md declaran límites y revisión pendiente de forma compatible con el producto revisado. No se identificó una afirmación pública falsa que deba bloquear. La matriz de ejecución no se ha tratado como acreditación legal independiente.

## Límites y entrega

Fuera: ascendientes, fallecimientos, conjunta, adopción adulta, grafos/censos no admitidos, especialidad propia de alimentos no representada, régimen foral, deducción territorial Ceuta/Melilla, entrada efectiva fuera2025, acreditación histórica A y C semántica. No se reabre fallecidos2025 ni la revisión general E común publicada. No se revisan cambios concurrentes C, deducciones del padre o textos de catálogo Valencia. No se exige checkout global quieto. Las tablas históricas no alteradas no reciben aquí una auditoría jurídica universal.

Todos los comandos de prueba/script se envolvieron en timeout -k30s: extracción/lectura30s, propios60s, regresión2m. Entorno env-pruebas.sh cargado dentro del timeout; UV_CACHE_DIR=/home/elies/.cache/uv. No instalaciones, worktrees, copias completas, cambios productivos, commits, bookmarks, push, PR o despliegue. No borrados.

manifiesto-revision.json enumera los artefactos propios y hashes. revision-externa.patch contiene únicamente altas externas del informe, scripts y resumen; los oráculos y resultados completos permanecen en esta entrega y se referencian por hash. No incluye ni modifica recepcion.json ni candidato-eb.patch. Las recomendaciones productivas son ninguna: no hay fix propuesto. PESADO1 LIBERADO.
