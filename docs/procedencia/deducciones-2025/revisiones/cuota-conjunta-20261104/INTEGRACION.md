# Integración de la cuota compartida valenciana

La candidata añade una API de aplicación parcial de cuota y saldos. La revisión
independiente detectó P1 (prioridad de históricos de autoconsumo) y P2 (diagnóstico
de un saldo DANA anterior al régimen). Se conserva el dictamen original en
[REVISION.md](REVISION.md); no se convierte retrospectivamente en favorable.

El integrador añadió dos regresiones permanentes y reprodujo ambos fallos antes
de modificar el código: 21 grupos correctos y dos rojos. Extendió a autoconsumo
la prioridad que ya se exigía en inversión en entidades y validó el origen DANA
también en la composición inicial. Después pasan los 23 grupos y ambos repros
originales sin cambios. Los importes esperados se conservan.

La repetición de los 263 escenarios independientes encontró una observación
del arnés que afirmaba expresamente el comportamiento diagnóstico antiguo de P2.
Se conserva ese intento y se adapta sólo esa observación para exigir rechazo,
como recomendaba el mismo informe. [adaptacion-repros.json](adaptacion-repros.json)
identifica preimagen, cambio y postimagen. La repetición pasa los 263 escenarios
y los 23 grupos permanentes; no cambia ninguna expectativa monetaria.

La corrección focal la ejecuta el integrador, según la recomendación expresa de
la revisión. No se solicita una segunda revisión del mismo alcance. Quedan
vigentes los límites de identidad, soportes y persistencia descritos en la
[API](../../VALENCIANA-CUOTA-CONJUNTA.md). La aplicación sigue siendo individual
ordinaria; no habilita declaración conjunta ni integración anual automática.

El [manifiesto](manifiesto.json) conserva los informes, hashes y registros. Los
archivos `.ts.txt` son copias de los repros, sin incorporación a la compilación.
Los tests permanentes usan el barrel integrado real. El CI completo y la
publicación se documentan en su cierre posterior, separado del sondeo focal.
