# Madrid: compra compartida y rentas familiares de 2025

Este corte integra la [compra compartida entre cónyuges](../deducciones-2025/madrid-cotitularidad-20261112/ALCANCE.txt),
los [intereses bancarios familiares](../deducciones-2025/familia-intereses-bancarios-20261112/ALCANCE.txt)
y el [alquiler ordinario de otro familiar](../deducciones-2025/familia-alquiler-ordinario-20261112/ALCANCE.txt).
La entrega de alquiler ya contiene la ampliación de intereses; no se apilan sus
dos parches. Los estados de autor en esos alcances se conservan como historia.

La compra compartida exige dos cónyuges en separación de bienes, adquisición
terminada de 2025, titularidad estable y costes documentados proporcionales.
El coste completo y el porcentaje propio llegan al núcleo una sola vez. El
tope anual sigue siendo individual. La renta de los familiares se deriva de
hechos en su libro común, sin incorporarla como renta del contribuyente.

Intereses ordinarios privativos y alquiler anual de propiedad exclusiva amplían
el censo familiar de Madrid y Comunitat Valenciana en sus perfiles declarados.
Se mantienen separados neto anterior a reducciones, base general y ahorro.
El artículo 20 y los umbrales de mínimos y declaración consumen la magnitud
correspondiente. Los contratos externos de Andalucía y Murcia conservan su
alcance anterior. No se habilitan otras rentas, años o derechos por analogía.

La unión conserva dos correcciones de preparación del autor. Un censo mundial
que declara una única vivienda de propiedad exclusiva contradice una segunda
compra compartida y se rechaza antes de calcular. Además, la fixture del límite
familiar usa 30.930 × 3 = 92.790 euros; con base propia de 26.056, la frontera
del cónyuge es 66.734. Las preimágenes y causas se conservan en la entrega.

El integrador reproduce el fallo pendiente de tipos: TS17 en
`madrid-cotitularidad.ts:42`, `effect(strictBooleanExpressions)`. La condición
opcional produce `boolean | undefined`. Se aplica la comparación `=== true`
preparada en el archivo del autor, conservando la decisión para `undefined`,
`false` y `true`. No cambia fórmulas, admisión ni importes. El PRE termina con
salida 2 y su log queda preservado. Las 986 regresiones posteriores pasan en
24 archivos, incluidas las nuevas guardas temporales gallegas. No se suman
repeticiones ni las validaciones solapadas de los tres autores.

Las fuentes primarias y sus huellas están en los tres índices de fuentes
adjuntos a los alcances. El CI global y la revisión independiente corresponden
a la imagen integrada y se registran después de estas validaciones focales.
El perfil y la aceptación documental siguen acotados; esta integración no
certifica el ejercicio completo ni añade observaciones de Open.

La imagen anterior a la revisión pasó los [31 comandos del CI local](CI-ANTES-IDENTIDADES.json),
con runtimes exactos, entorno limpio e inventario regenerado. El fallo PRE de
tipos quedó resuelto. La revisión independiente posterior detectó H1/H2:
títulos exclusivos incompatibles en la misma vivienda concedían 1.320 euros,
y una cuenta exclusiva duplicada entre familiares alteraba las bases y la
deducción valenciana de 180,93 euros. Este CI anterior no valida su corrección.

La corrección concilia la identidad de la compra con los alquileres del censo
también en la ruta de propietario único. Las cuentas y liquidaciones bancarias
se contrastan entre todos los miembros con claves de entidad e identificador,
antes de producir bases individuales. Las contradicciones se rechazan sin
deduplicar ni elegir un titular. Se conservan los activos distintos, las mismas
etiquetas bancarias en entidades distintas y los ceros válidos. La revisión de
esta corrección y el nuevo CI completo se registran después. El intento inicial
con imagen incorrecta permanece invalidado y no cuenta como validación.

La imagen corregida pasa los [31 comandos del CI local](CI.json), con runtimes
exactos, entorno limpio e inventario regenerado. El fallo PRE de tipos queda
resuelto y la [revisión independiente y su contraste](REVISION.md) cierran
H1/H2. Las 1.012 pruebas focales del integrador pasan en 25 archivos tras
conciliar las identidades de las fixtures. Las ejecuciones y reservas
anteriores se conservan como tales; no se atribuye verde al intento invalidado
ni el CI anterior a la corrección. La comprobación remota corresponde al commit
publicado.
