# Órdenes anuales SS 2025–2026

Integrado tras [revisión independiente favorable acotada](revision-ordenes-anuales/INFORME.md).
El padre incorpora la guardia de identidad AST propuesta y su regresión; pasan
22 tests focales integrados. La revisión reprodujo 21 pruebas del autor y nueve
propias. No se declara aceptación fiscal ni vigencia anual cerrada.

El texto siguiente conserva la entrega y sus límites. Su condición de propuesta
corresponde al momento de recepción; los cuatro archivos ya están integrados.
El resultado `acceptance` conserva la etiqueta histórica del formato v1: el
dictamen es el documento enlazado, no una promoción automática del resultado.

Adaptador focal de órdenes anuales SS 2025–2026

Propuesta aditiva contra 461e16323ca11e428c3e391568755c3e6b2766ab. No modifica lib,
contexto.period/local_period, enlaces.run, el contrato compartido, E/C/Valencia ni
el histórico A. CLI orden_anual.py + registro sellado + test offline opt-in.
El padre puede aplicar los cuatro archivos nuevos del parche con su flujo de
revisión. Esta entrega no modifica el checkout, no publica y no requiere turno
pesado. El adaptador no promociona resultados al validador compartido.

Contrato de alcance

Sólo PJC/178/2025 (BOE-A-2025-3780) y PJC/297/2026 (BOE-A-2026-7296), bytes
identificados por SHA256 y tamaño. Título/ejercicio de la primera página,
disposición final tercera, artículos 2/3/4/16/17/33, columna mensual/diaria,
grupo, concepto y sujeto tienen selectores físicos reproducibles. Cada prueba
incluye página 1-based, bbox en puntos PDF y literal obtenido de palabras
contenidas, con flags=0 y sort=True. Los recortes de artículos multipágina se
conservan separados por página. Se valida cada prueba y cada cifra por
flujo.pdf_table (incluida protección de signo fuera de la caja).

La semántica revisable está en un registro cerrado cuyo hash canónico está fijado
en el código. No es un parser jurídico universal: cambiar un año, documento,
artículo, columna, unidad, aportación o selector requiere revisar y versionar el
registro y el sello. Un mapping libre no puede conceder aplicabilidad. Los tests
incluyen mutaciones del contrato y controles físicos independientes del sello.
El sello asegura inmutabilidad, no sustituye el review de la interpretación.

El art.3 fija desde 1 de enero las bases del régimen general por contingencias
comunes; art.4 los tipos comunes; art.16 el MEI; art.17 los tres tipos y reparto
solidario; art.33 los tipos de desempleo indefinido, FOGASA y formación profesional.
Las cláusulas conservan también las condiciones de contrato y las remisiones.
La disposición final tercera fija efectos retroactivos desde 1 de enero. No se
inventa un 31 de diciembre: period.through es null. Los enlaces son comparaciones
numéricas condicionadas al perfil uniforme y ausencia de sustituciones; nunca se
confunden con period(year) ni con aceptación anual. Los recortes identifican los
originales publicados 26-02-2025 y 31-03-2026. No se ha investigado ni certificado
la ausencia de modificaciones posteriores. Fecha de evaluación 04-11-2026; el
tramo 05-11/31-12 de 2026 sigue siendo futuro. IPC 2026 conserva escenario 3%,
INEObservation=false.

Cobertura observada y reservas

88 celdas físicas: 22 bases y 22 tipos por ejercicio. Las bases 2025 ocupan páginas
4 Y 5 (grupos 10–11 continúan en p5); 2026, p4. Se verifican 4.909,50 / 5.101,20
mensuales como máximas y 1.381,20 / 1.424,40 como mínimos de grupos 4–7.
No son los mínimos de todos los grupos: grupos 1–3 tienen mínimos distintos;
grupos 8–11 usan euros/día. DF tercera está en p42 (2025) y p41 (2026).

32 match numéricos (16 por año): 2 máximas mensual×12, 14 aportaciones ordinarias,
4 MEI y 12 solidaridad. Cero diferencias monetarias detectadas. Son comparaciones
de parámetros; no prueban elegibilidad ni cuota final. Cada enlace conserva el
binding de hoja/AST o parámetro efectivo y factor dimensional explícito.

6 pendientes (3 por año): AT/EP empresarial 1,5% exige seleccionar tarifa/actividad;
AT/EP trabajador 0 y FOGASA trabajador 0 exigen una derivación revisada del cargo
empresarial. No se transforma ausencia de literal en un cero. Los artículos
pertinentes se conservan físicamente en el registro para dicha revisión.

42 posiciones de bases restantes no se enlazan al motor (22 mínimas y 20 máximas
de otros grupos/unidades); 14 tipos totales tampoco se consumen. Esas 56 posiciones
tienen evidencia física, pero no se contabilizan como match del motor. Siguen
pendientes los mínimos por grupo/jornada del perfil, elegibilidad, vigencia anual
completa, álgebra y límites/centimos de solidaridad, redondeo TGSS y cuotas
ingresables. No se certifican A histórico ni F.

Verificación y uso

El censo previo sólo se reutiliza para cuatro módulos cuyos bytes actuales
coinciden con los hashes censados: SS, cotizaciones-sociales, perfil-uniforme e
IPC. Los bindings usados de hojas llevan sourceSha256; solidaridad reutiliza las
posiciones AST por año/parte/índice, MEI los parámetros efectivos del censo.
No se regenera inventario, ejecuta TS ni se acredita el candidato completo.
resultado-focal.json contiene hashes de documentos, censo, registro y módulos,
las 88 selecciones y los 38 enlaces/pendientes. El manifiesto de entrega registra
también dependencias, preimágenes en base y postimágenes propuestas.

Pruebas focales reales: 21 tests OK en 3,807 s, un proceso Python con timeout
-k 30s 25s. 6 tests nuevos, 15 existentes (contexto/enlaces). La primera ejecución
conjunta falló por la colisión entre los dos módulos llamados enlaces; el test
fija el import del lote antes de cargar flujo y la repetición completa pasó.
Se conserva el log fallido por trazabilidad. No se ejecutaron suites pesadas.

Repetición en la carpeta de entrega:

    timeout -k 30s 25s bash /home/elies/Backups/IRoboPF/producto-a-ss2025-2026-20261104/reproducir.sh

Tras aplicar, desde el checkout raíz, para ejecutar el adaptador focal:

    timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; /home/elies/.cache/irobopf-corpus/.venv/bin/python tools/procedencia/datos/lotes/ipc-ss/orden_anual.py --repo /home/elies/Repos/IRoboPF --objects /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/objetos-unicos --census /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/ipc-censo-reanudado.json --registry docs/procedencia/datos-2012-2026/lotes/ipc-ss/ordenes-anuales-v1.json --output /home/elies/Backups/IRoboPF/producto-a-ss2025-2026-20261104/resultado-integrado.json'

Para los tests integrados, establecer SS_ANNUAL_OBJECTS y SS_ANNUAL_CENSUS con las
mismas rutas, DATOS_RUNTIME_ROOT=/home/elies/Repos/IRoboPF, PYTHONDONTWRITEBYTECODE=1
y PYTHONPATH=tools/procedencia/datos/lotes/ipc-ss:tools/procedencia/datos, y ejecutar
python -m unittest -v test_orden_anual test_contexto test_enlaces dentro del mismo
timeout/env. Sin las variables de originales/censo, los tests reales se omiten
explícitamente. No hace falta ninguna suite pesada para reproducir esta fase.
