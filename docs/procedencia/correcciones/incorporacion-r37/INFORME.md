# Contraste de la incorporación local

La operación local R36 queda corroborada en fidelidad de incorporación, estados del preparador, recuperación serial y tres localizadores corregidos. El contraste no reproduce un defecto nuevo. El resultado no certifica reglas fiscales, suficiencia causal, composición anual ni disponibilidad de un servicio.

## Contraste ejecutado

Se leen informe, resultados, decisiones, instrumentos, casos y límites. Los instrumentos de la revisión se adaptan únicamente en rutas de importación y salida hacia scratch propio. Se conservan los textos exactos ejecutados y sus diffs; nunca se ejecutan productores sobre el informe recibido.

Los cuatro comandos terminan con código cero:

- Recuperación: 26 casos, con resultados JSON idénticos a la revisión. Incluyen dieciséis fallos tras fsync en ambos sentidos, dos tras escrituras, cuatro rechazos de preflight y cuatro fallos del procedimiento de publicación. Los archivos desconocidos, symlinks, hardlinks y planes alterados se rechazan antes de crear el diario o escribir los destinos.
- Preparador: nueve combinaciones. Solo los pares previos o posteriores exactos producen el plan aprobado; mixtos y desconocidos se rechazan.
- Operación: cotejo del plan, aprobación, autoridad, extremos activos, 264 pares/102 sujetos, Madrid histórico pendiente y aceptación completa falsa. El índice conserva exactamente los 44 snapshots anteriores más el nuevo; rastro y bytes publicados coinciden con los extremos aprobados.
- Localizadores SS: semilla de `sumarRendimientosTrabajo` y bandas literales de `calcularTotalSolidaridad`, comprobadas mediante sus ancestros y rangos AST.

La repetición de recuperación usa la versión posterior con la guarda de optionalidad del cargador ya corregida; sus resultados coinciden exactamente con los 26 casos originales. El fallo inicial de mypy y ambas versiones del revisor se conservan sin atribuirle una repetición que no hizo.

La verificación de integración no repite en esta recepción los GET completos ni el verificador de los 45 snapshots: ya los ejecutó en R36 y la revisión independiente los repitió con restauración propia y cuatro adversos nuevos. Se examinan sus instrumentos, diffs, logs y recibos; la identidad física del software y de los artefactos revisados queda cotejada. Los resultados GET y de calidad del revisor permanecen atribuidos al revisor. No hay cambio de código de producto que justifique otra suite global o regeneración.

## Dictamen y límites conservados

Se corrobora la operación local descrita. Los 264 enlaces mantienen aceptación limitada por celda/año. Madrid 2020 conserva el payload histórico pendiente y atestación nula; el candidato nominal posterior no se activa. Toda aceptación de regla fiscal completa permanece falsa. Los tres localizadores SS no resuelven los nueve rojos semánticos ni acreditan once cierres causales.

El procedimiento requiere plan aprobado, `flock` externo y escritores detenidos. No ofrece atomicidad entre dos archivos: un lector concurrente puede observar estados intermedios. Las inyecciones ocurren después de fsync real, no acreditan apagón físico ni durabilidad universal. Un último fsync fallido puede dejar bytes o marcador visibles; la recuperación vuelve a leer los destinos. La receta de publicación ensayada sigue siendo un procedimiento escrito que utiliza `durable_replace`, no una nueva API de producción.

## Reproducción

Desde `/home/elies/Repos/IRoboPF`, con los instrumentos archivados en este directorio y salidas en `.cache/orquestador-recepcion/r37`:

```sh
nix shell nixpkgs#python3 nixpkgs#patch -c flock /tmp/irobopf-recepcion-acotada.lock python3 .cache/orquestador-recepcion/r37/recibir.py
nix shell nixpkgs#python3 nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock python3 .cache/orquestador-recepcion/r37/contrastar.py
```

Los scripts rechazan destinos de ensayo ya existentes. Para una repetición nueva hay que adaptar su scratch a otro directorio absoluto propio, conservando el diff y sin sobrescribir esta evidencia. `validacion.json` identifica los cuatro comandos ejecutados y sus logs.
