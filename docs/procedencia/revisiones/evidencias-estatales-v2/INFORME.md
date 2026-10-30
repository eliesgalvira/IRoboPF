# Revisión estatal v2: decisiones nuevas por celda y ejercicio

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `5799bb03826719a4dd3500a962e2d6bb5124fdca`.

Se entregan **78 decisiones nuevas `accepted` de alcance limitado**: 36 de escala ordinaria y 42 de complementaria, correspondientes a 26 celdas de base/cuota por los ejercicios 2012, 2013 y 2014. `decisiones-canonicas.json` es una lista, con ID nuevo, año, tabla, fila, columna, valor, condiciones y localizador exacto de celda (`TABLA[fila].campo`), SHA actual y `line`. Todas mantienen `completeRuleAcceptance: false`. `mapeo-78.json` relaciona cada ID de payload actual con su decisión. No se aceptan los payloads operativamente ni se escriben registros o atestaciones: el padre debe preparar los nuevos enlaces y pedir revisión exacta.

Se examinaron D043–D046, integración de ronda 11, redondeos r11, la entrega de X y su contrarrevisión; informes estatales v1/v2, revisión v1 y propuestas r12. Las discrepancias de contrato de X no se convierten en expectativas generales ni alteran el oracle.

## Qué queda acreditado

- **83 citas históricas**, siete originales y **13 PNG**: texto, geometría, selectores numéricos y regeneración a 144 dpi coinciden. Los PDF se comprueban por SHA-256, SHA-512 y tamaño. Los 13 PNG coinciden tanto con v1 como con el CAS v2 y se inspeccionaron personalmente.
- **26 cabeceras corregidas**: se reextrajeron las palabras dentro de cada caja geométrica. `Hasta euros` identifica base; `Euros`, cuota. Las cajas están encima y en la columna correspondiente. Los offsets antiguos ajenos a cabecera se conservan como defecto documental histórico; no se necesita otro fix numérico.
- **Contexto compuesto p62–63** de BOE-A-2010-19703: hashes, orden y texto verificados. El art. 60.2 empieza sujeto y cuantía ordinaria en p62 y continúa derecho, cuantía reforzada y asistencia en p63. El enlace editorial subsana la separación del contexto; no acepta elegibilidad, convivencia o reparto ni supone soporte automático de reglas compuestas.
- **319 correspondencias históricas** comprobadas de nuevo contra el artefacto y las fuentes de época obtenidas mediante `git show`. Se conservan separadas en `correspondencias-historicas-319.json`: 266 mínimos, 42 metadatos de reducción y 11 gastos legacy. No son decisiones actuales ni aceptaciones de helpers canónicos.
- **78 identidades actuales** comprobadas contra el artefacto fijado y los bytes actuales del código. Las 78 proyecciones `legal-decision-scope` y llamadas a `select_decision` pasan, igual que el localizador exacto; otras columnas se rechazan. `remapeo-revisado-78.json` verifica además los hashes y correspondencias v2→r12.

Inventario `ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397`, artefacto `ae25e219e75593d7a0d408e325db872faca31261ded79a2115a563536073b3d0`. Se comprueban esos bytes y las fuentes concretas, sin reconstrucción global. Snapshot v2 de contexto: `efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6`; técnico v1: `8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3`. No se afirma nueva verificación de todas sus fichas/dependencias.

## Cadena normativa y hallazgos

**ESTV2-01. Bases y cuotas ordinarias, 2012–2014.** La página física 63 de BOE-A-2010-19703 contiene el art. 62.Uno, que modifica el art. 63.1 LIRPF con efectos desde 2011 y vigencia indefinida. Se cotejaron las seis filas, incluidas 120.000,20/22.358,36 y 175.000,20/34.733,36. El índice de modificaciones del art. 63 no intercala sustitución en 2012–2014; la siguiente reforma es Ley 26/2014 art. 1.39, con efectos 2015. La consulta del análisis oficial de la Ley 39/2010 no identifica errata que cambie estas celdas. Esto describe las fuentes consultadas, no una búsqueda universal de toda jurisprudencia. Objeción: un número igual de otra escala o ejercicio no prueba continuidad. Coste: decisión individual con fuente primaria y cadena temporal, limitada a cuantías.

**ESTV2-02. Complementaria, 2012–2013 y prórroga 2014.** Se reabrieron RDL 20/2011, DF segunda.Primero, DA35.1.a LIRPF, p53, y Ley 22/2013 art. 64.Uno, pp75–76. Se incorpora el eslabón adicional Ley 2/2012 art. 61, pp68–69: vuelve a añadir DA35 con efectos desde 2012 y publica las mismas siete filas. Se inspeccionaron esas dos páginas nuevas. Las tablas de ahorro de DA35.1.b y las de retenciones de DA35.2 son objetos distintos; que estas últimas repitan base y cuota no las convierte en evidencia intercambiable de la escala general. Objeción: prorrogar 2013 por analogía o usar la tabla de retención daría una cadena falsa. Coste: adquisición y lectura de otro original y su contexto; 2014 cita expresamente la prórroga.

**ESTV2-03. Erratas investigadas, sin cambio de celdas.** BOE-A-2012-352 consta de cuatro páginas: sí corrige el título y aspectos editoriales de DF segunda, además del rendimiento cedido de DA12. No cambia las celdas DA35.1.a. Sería incorrecto decir simplemente que no afecta a DF segunda. BOE-A-2014-2109 corrige otros artículos, disposiciones y créditos, sin cambiar art. 64. Las tres erratas de Ley 2/2012 (BOE-A-2012-9005, 10341 y 11832) se refieren a bonificaciones portuarias, DA39/DF21 y una referencia del anexo XII, respectivamente; no art. 61. Se conservaron los cinco originales por ambos hashes y sus ocho páginas reextraídas/renderizadas. Su texto completo se leyó; la inspección visual adicional focalizada cubre p2 de 2012-352, sin atribuir inspección visual a las ocho páginas. Objeción: ignorar erratas porque un informe anterior coincide no acredita la tabla. Coste: búsqueda adicional y originales nuevos.

**ESTV2-04. Índice informativo con enlace equivocado.** La nota de DA35 del consolidado BOE remite al RDL 20/2011 pero enlaza `BOE-A-2011-11641`. Se resolvió por título, fecha y original `BOE-A-2011-20638`, no siguiendo ciegamente el enlace. La captura HTML y los análisis XML quedan por hash. Objeción: un enlace oficial tampoco garantiza identidad semántica. Coste: comprobar el documento primario; no atribuir valor normativo al índice consolidado.

**ESTV2-05. Tipos y alias fuera de aceptación.** Se localizaron las 13 celdas de porcentaje y se comprobó su correspondencia aritmética dividiendo por 100: por ejemplo 12 → 0,12 y 0,75 → 0,0075. La conversión identidad falla para las trece. No se crean payloads ni decisiones aceptadas para ellas. Los 190 alias de mínimos 2015–2024 conservan su bloqueo de continuidad normativa anual: importación e igualdad no acreditan vigencia. Las 53 hojas legacy de trabajo tampoco se convierten en decisiones del helper canónico. Objeción: estas extensiones excederían la evidencia de los 78 objetos revisados. Coste: quedan como tareas separadas con su contrato y revisión propios.

## Inspección visual

Se abrieron los 13 facsímiles históricos completos. Se distinguieron artículo 20 de artículo 32 en pp60–61 de 2010; mínimos personales/descendientes/ascendientes y discapacidad en pp61–63; bases, cuotas, resto y porcentaje en las escalas; gastos de defensa, movilidad y discapacidad activa frente a reducción en p12 de 2014; mínimos y previsión social en pp27–28; transición 2018 en p77; efectos 2023 en p84 de 2022; efectos IRPF 2024 frente a IVA 2025 en p23 de 2024; y prórroga general frente a ahorro/retención en pp75–76 de 2013. `citas-propias-pasajes.json` fija páginas, texto, cajas y hashes. No se deduce una aceptación fiscal anual de estos mínimos o gastos de su lectura visual.

## Comprobaciones reales y límites

`reproduccion.log` termina con 83 citas, 13 PNG, 26 unidades, 319 correspondencias históricas y 78 decisiones/proyecciones correctas. `ampliacion.log` registra diez pasajes nuevos, trece tipos y cinco documentos de análisis. El primer intento de reproducción falló al exigir que la etiqueta del inventario histórico fuese literalmente `EUR`; contiene, entre otras, `EUR (mínimo anual del código)`. Se corrigió el instrumento para conservar ambas etiquetas, sin normalizar el inventario ni aceptar semántica por esa igualdad. El diagnóstico original queda en `reproduccion-primer-intento.log`.

Oxlint con `--disable-nested-config`, ESLint del archivo revisado, typecheck principal/vendor y ensayo de las 16 reglas anti-slop: exit 0. Ruff y mypy de los instrumentos se ejecutan con sus logs; mypy usa seguimiento silencioso de imports y no constituye tipado estricto de cada dependencia del corpus. Las tareas pesadas se serializan con el lock de máquina y un trabajador. Python del corpus usa `bash tools/procedencia/run.sh`, Nix/uv fijados y `UV_PROJECT_ENVIRONMENT` absoluto en la caché propia. No hay Next build, suites legacy completas, código Effect nuevo ni cambios de cálculo; no procede inventar un rojo fiscal antes de un fix inexistente. Los discriminantes documentales no se incorporan a la suite general.

Integridad: comprobada en el alcance descrito. Autenticidad: adquisición HTTPS y hashes, sin validación PAdES/CSV o confianza histórica. Interpretación: cuantías de las celdas y ejercicios expresos. Exactitud: correspondencia con artefacto fijado y fuente actual, sin certificar el consumo de cada hoja en toda liquidación. Aceptación: decisión editorial limitada; binding nuevo pendiente y aceptación completa siempre false. `select_decision` valida la proyección y el estado, no demuestra por sí solo vigencia anual o aceptación del payload.

## Reproducción y entrega

Desde el checkout fijado, ejecutar secuencialmente:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-estatales-v2/venv"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-estatales-v2/reproducir.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-estatales-v2/ampliacion.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-estatales-v2/cerrar.py
```

Las adquisiciones conservan URLs, fecha UTC, estado HTTP, cabeceras permitidas, tamaño, SHA-256 y SHA-512. Descargas secuenciales con UA `IRoboPF-auditoria/1.0 (revision documental estatal)`, pausas de dos segundos y tope de 60 MB en la ampliación (el PDF de 2012 ocupa 14,4 MB). La consulta inicial tuvo tope 8 MB. Los originales nuevos están en el CAS de esta entrega fuera de T3; no se modificó el corpus raíz. No se afirma incorporación al paquete de preservación v2.

`manifiesto.json` enumera path/sha256/size/baseSha256; las adiciones tienen baseSha256 null. `entrega.patch` contiene solo texto y los binarios se integran por archivo/hash. El manifiesto no se incluye a sí mismo. Cero borrados. La entrega no contiene node_modules, fuentes de aplicación copiadas, tsconfig ni cachés. Scratch y renders de ejecución viven en la `.cache` del checkout. No se hicieron operaciones VCS mutantes, fixes, promoción de registros, PR ni despliegue. No se modifican ESTADO, DECISIONES o informes ajenos.

Crossa sigue siendo v1 histórico comunicado por el coordinador, misma casa y propietario, sin nueva verificación propia ni custodia independiente. Se preservan v1 y v2. No hubo LFS, gasto, subida de originales ni limpieza.
