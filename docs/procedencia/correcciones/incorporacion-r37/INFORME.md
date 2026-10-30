# Contraste del padre de la incorporación local R36

Se recibe y corrobora la revisión independiente Sol de la operación R36. No hay un defecto nuevo de producto reproducido ni un fix adicional. La aceptación se limita a la fidelidad de la incorporación, los estados del preparador, la recuperación serial y los tres localizadores corregidos; no certifica reglas fiscales, suficiencia causal, composición anual ni disponibilidad de un servicio.

## Recepción comprobada

Base del hijo: `50f9e949544e20d3e4e0bffc79b926d396267319`. El padre compara las 20.227 entradas físicas contra los blobs, un archivo cada vez, incluyendo tipo, enlaces simbólicos y ejecutabilidad: todas coinciden. No hay borrados ni modificaciones de base. Son 49 archivos y 2.789.130 bytes, incluidos cuatro sobres de transporte. El manifiesto SHA-256 es `73b8964e37b21b0f62ad60e2e3c7236694c07fbb66d53c0c80e6b4f1b7ef9089` y el patch comprimido `af953cfc4cfc74212a1bf4fe78467e5d263f223e2727dc675863bc90aa411e8a`.

El padre reconstruye los 45 archivos de contenido mediante patch y tres binarios en un directorio ordinario propio; coteja cada byte por hash y después integra las 49 altas. `recepcion.json` enumera todos los archivos y sus huellas. No se copia metadata VCS, entornos o originales PDF del checkout. Las seis sobras históricas del padre siguen excluidas e intactas.

La primera consulta al hilo usó dos identificadores mal transcritos y devolvió `thread_not_found`. Se recuperó el identificador exacto del registro R36 y se leyó la entrega final, que confirma ejecución Sol. No se consultaron entregas parciales de los otros cinco encargos activos ni se cambió de proveedor.

## Contraste ejecutado

Se leen informe, resultados, decisiones, instrumentos, casos y límites. Los instrumentos de la revisión se adaptan únicamente en rutas de importación y salida hacia scratch propio. Se conservan los textos exactos ejecutados y sus diffs; nunca se ejecutan productores sobre el informe recibido.

Los cuatro comandos terminan con código cero:

- Recuperación: 26 casos, con resultados JSON idénticos a la revisión. Incluyen dieciséis fallos tras fsync en ambos sentidos, dos tras escrituras, cuatro rechazos de preflight y cuatro fallos del procedimiento de publicación. Los archivos desconocidos, symlinks, hardlinks y planes alterados se rechazan antes de crear el diario o escribir los destinos.
- Preparador: nueve combinaciones. Solo los pares previos o posteriores exactos producen el plan aprobado; mixtos y desconocidos se rechazan.
- Operación: cotejo del plan, aprobación, autoridad, extremos activos, 264 pares/102 sujetos, Madrid histórico pendiente y aceptación completa falsa. El índice conserva exactamente los 44 snapshots anteriores más el nuevo; rastro y bytes publicados coinciden con los extremos aprobados.
- Localizadores SS: semilla de `sumarRendimientosTrabajo` y bandas literales de `calcularTotalSolidaridad`, comprobadas mediante sus ancestros y rangos AST.

La repetición de recuperación usa la versión posterior con la guarda de optionalidad del cargador ya corregida; sus resultados coinciden exactamente con los 26 casos originales. El fallo inicial de mypy y ambas versiones del revisor se conservan sin atribuirle una repetición que no hizo.

El padre no repite en esta recepción los GET completos ni el verificador de los 45 snapshots: ya los ejecutó en R36 y la revisión independiente los repitió con restauración propia y cuatro adversos nuevos. Se examinan sus instrumentos, diffs, logs y recibos; la identidad física del software y de los artefactos revisados queda cotejada. Los resultados GET y de calidad del revisor permanecen atribuidos al revisor. No hay cambio de código de producto que justifique otra suite global o regeneración.

## Dictamen y límites conservados

Se corrobora la operación local descrita. Los 264 enlaces mantienen aceptación limitada por celda/año. Madrid 2020 conserva el payload histórico pendiente y atestación nula; el candidato nominal posterior no se activa. Toda aceptación de regla fiscal completa permanece falsa. Los tres localizadores SS no resuelven los nueve rojos semánticos ni acreditan once cierres causales.

El procedimiento requiere plan aprobado, `flock` externo y escritores detenidos. No ofrece atomicidad entre dos archivos: un lector concurrente puede observar estados intermedios. Las inyecciones ocurren después de fsync real, no acreditan apagón físico ni durabilidad universal. Un último fsync fallido puede dejar bytes o marcador visibles; la recuperación vuelve a leer los destinos. La receta de publicación ensayada sigue siendo un procedimiento escrito que utiliza `durable_replace`, no una nueva API de producción.

No se solicita otra contrarrevisión de esta corroboración favorable: el cambio acotado ya tiene contraste independiente y del padre, sin un nuevo hallazgo que resolver. Continúan los cinco encargos Sol R36 sobre retenciones, SS, admisión, escalas y rentas. El encargo global sigue abierto.

V5 permanece congelado en corte R26. Crossa conserva v1 desfasado, copia local fuera de Victus del mismo dueño y casa; no es custodia independiente ni remota. No hay LFS, gasto, transferencias, despliegue, PR, cambios a main o limpieza.

## Reproducción de esta recepción

Desde `/home/elies/Repos/IRoboPF`, con los instrumentos archivados en este directorio y salidas en `.cache/orquestador-recepcion/r37`:

```sh
nix shell nixpkgs#python3 nixpkgs#patch -c flock /tmp/irobopf-recepcion-acotada.lock python3 .cache/orquestador-recepcion/r37/recibir.py
nix shell nixpkgs#python3 nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock python3 .cache/orquestador-recepcion/r37/contrastar.py
```

Los scripts rechazan destinos de ensayo ya existentes. Para una repetición nueva hay que adaptar su scratch a otro directorio absoluto propio, conservando el diff y sin sobrescribir esta evidencia. `validacion.json` identifica los cuatro comandos ejecutados y sus logs.
