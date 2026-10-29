# Contraste del padre y decisión nominal de Madrid 2020

Se reciben intactas la propuesta R25 y la revisión independiente R27. El padre corrobora el número, su unidad, la identidad de la celda y la discordancia impresa. Se prepara una decisión separada para esa proposición nominal. No se incorpora el payload R25 ni se sustituye la decisión histórica a la que apunta. Ningún registro activo, atestación, inventario, snapshot o cálculo cambia.

## Qué se ha contrastado

El padre inspeccionó personalmente tabla.png, norma-p4.png, manual-2020-previa.png y manual-2020.png de la revisión R27, y después vigencia-2018.png y vigencia-2022.png. La ley imprime 53.407,20 bajo la cabecera de euros; la página anterior del manual identifica Madrid y su continuación imprime 53.407,29 antes del encabezado de Murcia. No se presenta esa diferencia como un defecto de extracción ni como una errata declarada oficialmente por AEAT.

La tabla legal expresa comienzos de tramo. Su quinta fila empieza en 53.407,20; la anterior empieza en 33.007,20 y abarca otros 20.400,00. La estructura del motor guarda límites superiores y su cuarta pareja contiene importe(53407.2). La traducción nominal de fila legal a celda del motor queda explicitada; no acredita la elección de fila en el punto exacto de frontera ni las cuotas, tipos o reglas de integración.

La disposición de 2018 dice que los apartados IRPF indicados se aplican a todos los períodos que finalicen durante 2018. La de 2021 establece aplicación a períodos iniciados desde el 1 de enero de 2022. Esos pasajes aportan contexto; no sustituyen una búsqueda exhaustiva de reformas intermedias ni autorizan por sí solos un selector civil de 2020. La corrección de firma de 2019 no se ha revalidado aquí. Continúan indeterminadas la autenticidad histórica y la aplicabilidad a un contribuyente.

`contrastar.py` reabre los tres originales desde el paquete v5 r2 conservado fuera de T3, verifica SHA-256, SHA-512 y tamaño, reextrae nueve selecciones y la tabla y reproduce sus diez PNG exactamente. Comprueba además los offsets de número y unidad. El recibo está en contraste-evidencias.json. No hubo descarga, nueva copia de originales ni modificación del manifiesto de preservación. La reproducción técnica no sustituye las lecturas anteriores ni demuestra vigencia o autenticidad.

## Decisión separada

decision-nominal.json es una proyección nueva del padre sobre las conclusiones nominales examinadas por el autor R25 y el revisor independiente R27. Identifica al padre como responsable de la proyección y fija por hash las fuentes de esa decisión. Su estado accepted se refiere exclusivamente a la proposición nominal especificada. No representa una aceptación del binding nuevo, del consumidor futuro o de una regla fiscal completa. Las condiciones exactas nuevas y su traducción al contrato operativo requieren revisión independiente de la implementación y del payload final.

Se corrige la redacción ambigua «componente autonómico de la base»: se habla del componente autonómico del IRPF aplicado a la base liquidable general. Año 2020 identifica la celda y su contexto documental, sin habilitar fechas, residencia, fallecimiento ni elegibilidad. Se conservan las reservas y la discordancia del manual como parte obligatoria de la proposición, no como información descartable del informe.

El consumidor actual rechaza correctamente la propuesta R25 por ausencia de condiciones en su decisión histórica. Sus restricciones posteriores de ruta de dos segmentos y Madrid 2022 no son un defecto fiscal demostrado: expresan una capacidad todavía no implementada. No se fabrican pruebas fiscales rojas para eliminarlas. La ampliación debe introducir un contrato nominal explícito, identidad completa y rechazo de todos los contextos civiles; los tests iniciales deben describir esa capacidad nueva y preservar las restricciones de los 264 enlaces existentes.

## Encargo sustantivo siguiente

Implementar un contrato nominal versionado, con referencias documentales tipadas y cierre físico verificado, que pueda consumir esta decisión sin convertirla en selección temporal. Producir un payload nuevo de Madrid 2020 y un ámbito exacto; conservar los candidatos anteriores. Comprobar el coordinador real en scratch: integridad y número verificables, revisión del binding pendiente, autenticidad indeterminada y completeRuleAcceptance false. No publicar, registrar revisores, promover atestaciones o regenerar snapshots activos. La revisión posterior debe examinar los bytes finales, la proyección, el consumidor y las contrapruebas, no solo el pase de schemas.

## Objeción, respuesta y coste

Un experto rechazaría usar una afirmación nominal para calcular el impuesto, o atribuir al revisor una decisión cuyo texto exacto no escribió. Por ello la proyección conserva autoría del padre, sus antecedentes exactos, ámbito nominal y revisión del binding todavía pendiente. Coste: un contrato y una revisión nuevos antes de incorporación, sin resolver por este camino la vigencia íntegra. Tampoco se inventa Madrid 2022 para aprovechar un consumidor ya existente.

Comando de reproducción: desde la raíz, `PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r29/uv flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/correcciones/madrid-nominal-r29/contrastar.py`. Resultado: tres originales y diez selecciones/renders correctos. Se conserva el log de ejecución y los controles de calidad del alcance.

Crossa sigue en v1 desfasado, copia local fuera de Victus del mismo dueño y casa. V5 r2 conserva su corte R26. Sin LFS, gasto, transferencia externa, PR, main, despliegue ni limpieza. El encargo global permanece abierto.
