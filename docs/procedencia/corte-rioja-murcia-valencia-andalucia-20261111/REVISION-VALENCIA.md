# Cierre documental de la primera revisión de Valencia

Continúa la revisión iniciada en `revision-valencia-salud-descendientes-20261111`.
No es una segunda revisión. Se conserva íntegra su recepción anterior, incluida
la suite, sus expectativas Fraction y su parche. Alcance exclusivo: salud propia,
salud propia más deporte y art. 4.Uno.t, y regreso T02.

**Dictamen monetario favorable dentro del perfil y los casos ejecutados**, con
la reserva de secuencia de controles indicada abajo. No queda una objeción
monetaria demostrada abierta en esta primera revisión.

La evidencia del padre `producto-rioja-murcia81-historico-20261111/valencia-01/`
contiene `salida.log`, `COMANDO.json`, `supervision.json` y `RESULTADO.json`:
cinco suites, 432/432 pruebas correctas (241 de esta revisión, 95 del autor,
45 T02, 28 anuales y 23 de cuota conjunta). El comando incluye ambas suites
nuevas y las tres regresiones, con un trabajador y límites temporales; la
supervisión registra salida primaria 0, limpieza verificada y ningún
superviviente. Esta es evidencia recibida y leída, no ejecución propia.

R1 queda cerrada por esa ejecución: la suite independiente incluye controles
positivos de cuota cero y negativos a cero en ambas APIs; comprueba además
cuota positiva escasa, orden experto independiente del orden de entrada,
consumo único antes del 10 % residual, categorías/topes/reintegros, frontera
familiar 30.000 con decimales y regreso T02. Se mantiene la independencia de
sus expectativas: no se han tomado valores esperados del autor.

R2, R3 y R4 quedan atendidas documentalmente por `INTEGRACION.md`, párrafos
«Valencia, salud y dos descendientes» y «Los límites de renta valencianos»:

- R2: identifica los artículos 2 y 3 del [Decreto-ley 1/2026](https://www.boe.es/buscar/doc.php?id=DOGV-r-2026-90037)
  y sus efectos desde el 1 de enero de 2025; el corte de diciembre de 2025
  resulta insuficiente por sí solo para esa modificación retroactiva.
- R3: exige incluir en reembolsos las prestaciones reintegrables que cubren
  el gasto aunque todavía no se hayan cobrado, con acreditación en expediente.
- R4: declara que las referencias documentales no autentican los documentos.
  El orden salud/deporte se describe como elección del perfil, sin prioridad
  normativa ni optimización inferida.

Esos párrafos responden a las observaciones. No convierten las referencias en
prueba de autenticidad ni acreditan expedientes concretos. Continúan las
reservas materiales de la recepción inicial: categorías consolidadas y gasto
propio son el corte técnico; exigir registro para todas las categorías y
finalidad no estética general no son obligaciones legales universales. Rechazar
un pago compartido por falta de regla implementada tampoco declara una
incompatibilidad legal universal entre salud y deporte.

La comparación byte a byte confirma que el PRE de
`correcciones-tipos-02/pre/lib/dominio/irpf/bases-familiares-2025/valencia.ts`
coincide con el POST originalmente revisado. La raíz actual sólo sustituye
`!u.textos[k]?.trim()` por `(u.textos[k]?.trim().length ?? 0) === 0`.
Para el contrato de valores string opcionales conserva el rechazo de ausencia
y blancos, y la admisión de texto no blanco; no cambia cantidades ni orden.
La equivalencia se establece por lectura estática, sin runtime nuevo.
Las dos suites y sus dos JSON de expectativas coinciden con los artefactos
recibidos. Los artefactos/fuentes originales conservan sus hashes.

**Reserva de orden de controles:** los 432 resultados corresponden a la versión
anterior a ese ajuste de tipos. La repetición focal posterior anunciada por el
padre queda pendiente y no se presenta aquí como realizada. El cierre monetario
se apoya en la versión ejecutada y en el carácter mecánico del único delta
verificado; no certifica ejecución de la versión posterior. Si el focal falla,
se reabre la observación concreta en esta misma revisión con su log.

No se atribuye CI global verde, tipado completo, cumplimiento de todos los pasos
workflow/Nix, inventario, generados, autorización de publicación ni aceptación
fiscal de documentos reales. No se evalúan los otros bloques de INTEGRACION.
No se ha ejecutado runtime fiscal/JS/TS/Bun/CI/inventario ni suites en esta
continuación, ni escrito código Effect; se conservan las consultas locales
Effect documentadas en el informe inicial. La raíz permanece sólo lectura.
