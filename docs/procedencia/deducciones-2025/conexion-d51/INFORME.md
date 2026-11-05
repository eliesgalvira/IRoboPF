# Conexión anual D51 · rebase validado por autor sobre b9122c2b

La base incremental es la raíz aplicada del corte de114 rutas identificado por parche `f848de69227445de23681a787659e7053d39251ea361c3db828906e56ae8ca99`. Se contrastaron por SHA las74 rutas lib/tests de su manifiesto con post/ y raíz. La raíz ya contiene D51 aislado corregido H1–H3, A40/H12, B37 y C2025; no se reemplaza por v4. El candidato anterior se conserva intacto, y esta entrega tiene sus propios archivos, preimágenes y verificador; no depende operativamente de carpetas anteriores. La recepción corregida y sus oráculos permanecen identificados en procedencia local.

Se conectan las 51 rutas D a la unión común y al punto de composición usado por **`liquidarIrpfAnual` (modo canónico)** y **`liquidarIrpfAnualExplicito`**. La frontera nueva usa `lote: "D51"`, código literal y hechos propios. No modifica los contratos de los doce evaluadores v4 ni sus correcciones R1/R2. El resultado común continúa condicionado y con aceptación fiscal pendiente. Conexión no equivale a cierre de las 51 deducciones completas.

## Frontera y productores

`d51-anual-esquemas.ts` contiene los 51 contratos concretos; no admite contexto, bases, cuotas, deducciones estatales, bases históricas, rendimientos reducidos, tipos medios ni totales fiscales de otras personas. Tampoco admite esos campos anidados. La decodificación común rechaza propiedades sobrantes antes de producir datos; no sobrescribe silenciosamente un cálculo del llamador.

`d51-anual.ts` produce e identifica las magnitudes desde el estado interno de la anual. Cada magnitud interna lleva ejercicio, conjunto de declarantes, concepto y valor. Se reutilizan **BLG/BLA de `basesLiquidables` y mínimo por descendientes de `componentesMinimoEstatal` ya calculados para A40**. No se agrega `produccionD51` ni otro nodo de bases/mínimos. Se reutilizan BIG/BIA, mínimo personal/familiar, cuota autonómica y rentas anuales de trabajo ya existentes. No se infiere BL a partir de una entrada externa ni se reconstruyen reducciones/cotizaciones en D.

Productores disponibles:

- BL total, base imponible menos mínimo y mínimo por descendientes, usando sus conceptos distintos.
- Cuota autonómica antes de deducciones. La atribución a trabajo/actividad sólo se permite en la rama realmente representada de trabajo positivo, sin otras rentas ni ahorro; no se inventa una proporción en rentas mixtas.
- Base liquidable inicial de traslado CLM sólo si el traslado es de2025. El histórico del traslado2024 no se sustituye por la base actual.
- Base liquidable individual sólo de la persona de esta anual individual, nunca la de terceros.
- Bases consumidas de9a–f de CyL: las tres funciones recibidas registran la **base que ellas mismas aplican**, antes de convertirla en deducción. La sesión acumula ese dato en orden de selección e inyecta el resto. No divide una presentación por15% ni duplica la fórmula fiscal. El registro es un observador interno opcional; no forma parte de la solicitud JSON y no altera el contrato ordinario de dos argumentos.

Las ramas con históricos fiscales de vivienda/cuenta, deducción estatal de vehículo/inversión, incremento de maternidad, rendimiento neto reducido por vivienda o integración/tipos de ayuda ELA **no reciben valores del llamador ni ceros por defecto**. Se rechazan sin importe con el nombre del productor faltante. Las rentas de familiares incluidas exentas y obligación de IP tampoco se convierten en una certificación declarada. `matriz-51.json` enumera las dependencias y siguientes ramas por código; señala también productores condicionales y las limitaciones de censo.

Una lista explícitamente vacía puede dar cero cuando no requiere magnitudes por elemento. Ese cero no acredita cálculo de una rama no vacía ni ausencia inferida de datos. No se deduce un saldo histórico cero de la apertura de una cuenta en2025.

## Cuota, identidad y orden

Se conserva **una única llamada al consumidor común de cuota**, después de generar todos los importes. D no crea otro motor, no vuelve a consumir cuota ni aplica importes presentados. El orden de la solicitud determina la aplicación y el pendiente; no se elige la deducción más favorable. El techo de base de CyL y la cuota común se controlan como magnitudes distintas.

Se concilian edad/discapacidad propias, sujetos de mínimo, titulares completos, exclusividad del mínimo y discapacidad familiar con el caso anual. La conexión filial de nacimiento/adopción y monoparentalidad se acota a primer grado conciliado, sin negar otros derechos fuera del modelo. El nacimiento/adopción de CyL se contrasta con fecha/vínculo y cronología de hijos que el censo anual representa; no se certifican antecedentes de hijos ajenos o fuera de ese censo. Acogimiento no se deduce de un vínculo biológico o adoptivo actual; historias de transformación sin representación suficiente se rechazan. Los adultos acogidos o ascendientes sin censo anual compatible no se convierten en descendientes ficticios. Pagadores ajenos a las personas representadas y operaciones monetarias repetidas se rechazan.

El reparto de otros arrendatarios exige conocer su elegibilidad fiscal: esta conexión acotada admite el arrendatario propio y rechaza esa subrama externa. Para repartos de los evaluadores D se conserva la restricción de transporte finito: divisores con factores distintos de2/5, o cocientes de gasto periódicos, necesitan una salida racional del evaluador y se rechazan; no se trata su aproximación a80 dígitos como exacta. Los demás lotes y el transporte racional común no cambian.

Las incompatibilidades se contrastan con la selección real, sin confiar sólo en una marca de no concurrencia dentro de los hechos. Se conservan 12/12ter, alquileres y familias/discapacidad CLM, viudedad/trabajo y vivienda11bis frente a8/11quater de Extremadura. Dos vías de inversión CLM necesitan identidad de inversión para resolver concurrencia: no se declara que inversiones distintas sean incompatibles.

## Recepción corregida y precisión

H1 conserva su máximo **personal** de rehabilitación para alquiler. El máximo distinto por vivienda del11bis no se sustituye por él. H2 y H3 rechazan ayuda positiva sin cronología/atribución fiscal con prioridad sobre la falta de historia: no producen cero ni niegan un derecho general por recibir ayuda. Ambas funciones recibidas de rehabilitación/vivienda se cotejan por bytes; no se corrigen otra vez.

Los prefijos completos v4 permanecen intactos. En la sección nueva sólo se adapta la lectura de magnitudes **anuales** al parser de80 decimales ya existente, conservando el parser de8 para hechos económicos; los alquileres CLM leen las bases anuales con ese parser. La composición usa precisión80 cuando participa D51 y conserva la política previa cuando no participa. La detección previa es segura y no acepta ni valida por sí sola una solicitud. No se redefinen los productores precedentes de los perfiles públicos.

El transporte toma el importe decimal calculado, nunca `presentar`. Las pruebas preparadas comparan racionales por multiplicación cruzada y cubren productos largos, cuota fraccionaria y mínimos por tercios en ambas API. La capacidad declarada es hasta80 dígitos significativos de entrada/operación local y el formato anual acotado; no es exactitud racional infinita ni cobertura de todas las escalas o situaciones.

## Delta combinable y validación

`delta-central.patch` contiene cuatro deltas mínimos sobre raíz: esquema, unión de tipos compartida, rama D51 y precisión80 en composición. Mantiene A40, B37, variantes C y los productores comunes íntegros. La preparación B37 y el tramo de orden fiscal/consumo son idénticos por bytes a la preimagen aplicada: no cambia prioridad primera ni correspondencia por código. `entrega.patch` es incremental; omite los tres tests D51 y el fixture original que ya existen idénticos en raíz. Los comandos preparados los incluyen como regresión, junto a A40/H12, B37 y variantes C; no necesitan copiar esos archivos.

Validación de autor en PESADO2 completada secuencialmente, contra raíz publicada b9122c2b con las114 rutas conservadas. D51:80 pruebas; regresiones A40/H12/B37/C y contratos de trabajo:461 correctas y dos todo preexistentes. Tipos estrictos sin diagnósticos, canario Effect rechazado por floatingEffect; antislop correcto con canario rechazado; ESLint sin errores (avisos de entorno React/pages). Véase VALIDACION-P2.md y logs privados identificados por hash en el manifiesto.

Los tres archivos D51 aislados y su fixture se reutilizan intactos desde raíz; los51 oráculos mantienen su SHA. No hay CI global ni inventario, commits, push, PR, worktree, dependencias o cachés en entrega. Siguen pendientes primera revisión anual independiente D e integración del padre; la matriz no declara cierre universal.

## Resultado del rebase ligero

El verificador Python pasó: pre/post SHA,74 rutas lib/tests congeladas, prefijos de los doce evaluadores, R1/R2 y funciones H1–H3;51 oráculos/rutas y once códigos con productor pendiente. Reconstruye en memoria ambos parches exactamente. El tramo de prioridad/consumo B coincide por bytes con la raíz aplicada. Las pruebas que distinguen BL de BIG y rechazan la inyección de productores compartidos pasaron junto a ambas API, incluido el caso de precisión80 por tercios. La primera revisión anual D sigue pendiente; no se reutiliza la revisión aislada como aprobación anual.

## Corrección de autor tras el rojo

La API explícita alcanzaba DA61 con una cuota de80 dígitos, pero el contrato de magnitudes calculadas de esa etapa admitía60decimales. El primer pase conservado dio78 correctas y un rojo. Se amplió el transporte de magnitudes calculadas a 80 decimales. La aritmética local de trabajo-anual/calcular.ts pasa globalmente de precisión 60 a 80, también para gastos y artículo 80bis, además de DA61. Los hechos monetarios conservan sus parsers originales; sus sumas no alcanzan 60 cifras. La revisión independiente no encontró efecto monetario indebido y comprobó los umbrales de DA61. No se duplica la fórmula ni se salta la etapa por un cero presunto. Una prueba adicional verifica80decimales y rechazo de81. Los umbrales, requisitos, los51 oráculos y las reservas no cambian. Estos dos deltas adicionales de trabajo-anual forman parte del parche incremental; no son una nueva aceptación de hechos fiscales del llamador D51.


Estado posterior del integrador: primera revisión anual favorable, con 31 adversas independientes y 188 pruebas recibidas correctas. La observación P3 sobre el alcance de la precisión se aclara arriba. Véase REVISION.md. La integración conjunta con E38 y el histórico se valida por separado antes de publicar.
