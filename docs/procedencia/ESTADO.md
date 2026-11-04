# Estado de la auditoría documental

## Prioridad de producto: 4 de noviembre, noche

Actualización posterior a C2025: publicado `10ea938a5ef941a07d940d959e5b0a507bf10b80`;
CI remoto en [ejecución 41926599696](https://github.com/eliesgalvira/IRoboPF/actions/runs/41926599696),
ambos trabajos correctos. Retiradas las ocho entregas de C300 tras preservar
sus archivos únicos por hash; los originales oficiales permanecen en CAS externo.
El piloto histórico compara siete entradas nuevas y conserva siete SKIP: 41
casillas coinciden, 42 difieren, 14 tienen mapeo pendiente y una está ausente.
El resultado final difiere un céntimo en 2018–2021. Se inicia el primer bloque
de capturas pendientes de 2018, separado de la corrección y de nuevos cotejos.

El punto 4 sigue abierto. El balance estático del censo identifica 51 códigos con
evaluación específica por hechos de alcance acotado (40 valencianos y 11 ajenos).
Los otros 300 conservan catálogo, consignación y, en algunos casos, aritmética
auxiliar genérica; eso no acredita una evaluación completa de sus hechos fiscales.
La liquidación anual todavía sólo consume deducciones agregadas externas. Se
trabaja en conectar la cuota valenciana revisada con la única composición anual,
en conciliar las 351 fichas con sus revisiones vigentes y en los evaluadores del
lote Andalucía/Aragón/Catalunya. Estos avances no cierran por sí solos las 351 ni
reabren F general. No se repiten auditorías jurídicas favorables sin cambio material.

El orden vigente es: (1) derechos familiares por año y comunidad mediante la API
única, para el rediseño del viernes 6 a las 20:00; (2) unos 300 casos variados
contra Open 2025, investigando discrepancias; (3) comunidades 2026; (4) cerrar
deducciones autonómicas 2025; (5) A limitado a 2025–2026 y series usadas en la
comparación histórica; (6) D con un máximo de cuatro horas. F completo y el
histórico restante de A quedan aplazados. Los balances antiguos no imponen otro orden.

Añadido de las 20:40: después de que C2025 esté revisado y pase, ejecutar en
segundo plano como tarea ligera C histórico 2018–2024 con las 2.020 entradas
preparadas, investigando discrepancias. Antes de 2018 queda A histórico aplazado.
El [estado por año](ESTADO-POR-ANIO.md) distingue capturas, cotejos, documentos y cálculo.

Corte posterior a la publicación E+B: integradas las cuarenta fórmulas valencianas
como cálculo parcial y su variante en el contrato común. La revisión independiente
detectó tres defectos P2 y una reserva perdida; corregidos con regresiones, pasan
las 106 comprobaciones repetidas. La composición individual de límites y elecciones
está integrada. Su revisión detectó C01: una aportación DANA de 2024 generaba de
nuevo deducción en 2025. Corregido en la guardia común, pasan 180 pruebas focales,
los quince grupos independientes repetidos, tipos y lint. La nueva API parcial
de cuota compartida está integrada: consume una única cuota y distingue saldos
futuros, pérdidas y caducidades. Su revisión detectó prioridad omitida en
autoconsumo y un diagnóstico DANA anterior al régimen. Ambos se corrigieron
con dos regresiones rojas previas; pasan 23 grupos permanentes, 263 escenarios
independientes repetidos y los dos repros originales. La aplicación sigue siendo
individual y requiere orden experto explícito, sin consignación anual automática.
La integración pasa los 30 comandos del workflow en entorno limpio, con 1.545
ejecuciones Vitest y 227 métodos Python ejecutados, además de siete omisiones
explícitas de originales privados. Inventario, tipos y lint pasan; quedan los
18 avisos anteriores. [CI previo a publicar la cuota](revisiones/cuota-valenciana-ci-20261104/CI.md).
La aceptación fiscal completa de las fichas sigue separada de esta entrega de
producto. Publicado en `8584afe2f8448b7491556aa99827168a009433eb`;
`checks` y `corpus` pasan en la
[ejecución 41918467861](https://github.com/eliesgalvira/IRoboPF/actions/runs/41918467861).

C300 ha terminado la red salarial: 300 entradas distintas de Madrid 2025,
3.550 casillas iguales, 650 ausencias oficiales y cero diferencias. La revisión
del corte de 218 detectó cuatro diferencias del artículo 20; la corrección
integrada las resuelve y conserva los siete anclajes anteriores. La política
observada queda acotada a empleo Madrid 2025 y operandos hasta un millón de
euros; fuera se conserva Decimal. El arreglo de lectura del journal pasa siete
pruebas nuevas/focales y catorce portables. El primer intento portable carecía
de `pdftotext`; se conserva junto a la repetición correcta con el ejecutable Nix.
La captura adicional de Andalucía queda corregida y revisada: sus doce casillas
presentes coinciden, conserva dos ausencias y el resultado final es 101,04 EUR.
El conjunto tiene 301 entradas, 3.562 casillas iguales, 652 ausencias y cero
diferencias. Otras once variantes quedan sólo preparadas. El [cierre monetario](simuladores/c300/CIERRE.md)
distingue el alcance salarial y las reservas de hechos sintéticos. Se ha iniciado
el piloto histórico secuencial 2018–2024; todavía no se atribuyen resultados
a las 14.140 comparaciones previstas.
El [CI final de C2025](revisiones/c300-ci-20261104/CI.md) pasa los 30 comandos
del workflow en entorno limpio: 1.573 ejecuciones Vitest, 234 métodos Python
ejecutados y siete omisiones expresas. Las 516 fuentes fijadas conservan sus
hashes; tipos, lint, inventario y generados pasan.

A2025 conserva 1.477 cotejos documentales y las 72 diferencias anteriores en
cuatro territorios, doce con distinto céntimo. La revisión es favorable acotada;
se integran 27 filas oficiales de cuotas fijas y 76 pruebas de importe/alcance.
El sondeo resuelve las 72 diferencias. SS2025–2026, con 88 celdas físicas,
32 coincidencias condicionadas y seis pendientes, está publicado en
`73a9996a257dff2e6ef5e8093b0aa3cd311cf045`. Sus trabajos remotos `checks` y
`corpus` pasan en la [ejecución 41906226556](https://github.com/eliesgalvira/IRoboPF/actions/runs/41906226556).
A no se declara completo.

La conexión efectiva histórica está integrada y revisada: mismo núcleo, año
real y perfil de empleo Madrid sin familia. El sondeo conserva los resultados
completos de 37 entradas de 2025; la revisión añade 1.489 comprobaciones. Sus
positivos históricos comprueban contrato, no equivalencia Open. La matriz prevista
se aplica por separado a cada año: 2.020 × 7 = 14.140 comparaciones. No ha comenzado
la campaña histórica. El cotejo de las series consumidas detectó 40 diferencias
de céntimo en fronteras Madrid 2018–2021 y 2023–2024; se han reproducido en tests.
La selección de sus cuotas fijas está integrada tras revisión independiente
favorable acotada: 238 cuotas históricas, 469 sondeos de tarifa y los vecinos
conservados. Pasan las 47 regresiones permanentes y el bloque focal de 228 pruebas.
2022 no presenta diferencias en el sondeo. Véase la
[integración histórica](datos-2012-2026/producto-series-historicas/INTEGRACION.md).

El candidato combinado pasa los 30 comandos del workflow en entorno limpio:
1.522 ejecuciones Vitest por bloques, con pruebas compartidas, y 234 métodos
Python contabilizados (227 ejecutados y siete de originales privados omitidos
explícitamente). Tipos, lint e inventario pasan; se conservan 18 avisos previos.
Las 510 fuentes fijadas permanecen intactas. El resultado y las limitaciones de
la reproducción manual están en la
[validación previa a publicación](revisiones/integracion-producto-20261104/CI.md).
Publicado en `f4ffa938e2bc994b0fab8c222f2b3157896612f1`, rama
`procedencia-documental`. Sus trabajos remotos `checks` y `corpus` pasan en la
[ejecución 41914153071](https://github.com/eliesgalvira/IRoboPF/actions/runs/41914153071).
Retiradas once carpetas integradas, con sus 196 archivos preservados por hash.
Medición posterior: 96,61 GB de IRoboPF y 318,67 GB libres; no se crearon worktrees.

La instrucción de las 21:50 añade una condición previa a cada push: repetir los
pasos del workflow y verificar los generados en el mismo entorno. Los cambios
del propio CI se reproducen con entorno limpio sin heredar el PATH de trabajo.
Los fallos históricos de PATH en `3f397bef` e inventario en `1f71fb9d` se conservan
como fallos; no basta con que una ejecución posterior esté verde.

El candidato A de importaciones de 2019 y sus dos hallazgos P1 quedan conservados
sin publicar: efectos de módulo que invalidan la prueba y un constructor mal
identificado. C de equivalencia sintética permanece parcial; se cancela su
continuación de acreditación. Se preservan quince archivos y sus parches fuera
del checkout en el respaldo `prioridad-producto-20261104`. Los transportes C y
las correcciones A1–A2 ya publicados se conservan. La comparación solicitada usa
escenarios sintéticos explícitos; la aceptación fiscal general sigue pendiente.

Publicadas protecciones en `3f397bef51b4`: exclusión completa de `/.cache/`,
comprobación de rutas de caché al comienzo del CI y límites internos en scripts
de paquete, Vitest y el lanzador Python. Se retiró `.cache` del seguimiento de
Jujutsu conservando sus bytes locales. Pasan nueve pruebas focales, el control
de rutas raíz/anidadas y la sintaxis del lanzador.

Las comprobaciones de esa protección encontraron una caché histórica ya versionada en
`docs/procedencia/revisiones/preservacion-v2/scratch/.cache`: un enlace simbólico
al scratch antiguo. Se conservó su destino y se retiró del seguimiento en
`95930995a58a`; el árbol seguido ya no contiene ninguna ruta `.cache`.
El aviso del coordinador identifica además el fallo de `3f397bef`: se intentaba
ejecutar `timeout bun` antes de disponer de Bun en el PATH (salida 127).
La corrección impide ejecutar pruebas posteriores si no se instalaron las
dependencias. El CI de `1f71fb9d` supera `corpus`, tipos, lint y pruebas del motor,
pero detecta un inventario desactualizado. Es el único paso fallido de la
[ejecución 41893770656](https://github.com/eliesgalvira/IRoboPF/actions/runs/41893770656).
Se regenera en el candidato familiar; no se declara verde aquella ejecución.

Máximo cinco subagentes: dos pesados y tres ligeros. Investigadores y revisores
leen desde la raíz sin worktree. Cada cambio de importes o datos públicos recibe
una revisión independiente; sólo se repite el contraste de arreglos graves.

La entrega acotada de D queda incorporada en [cotizaciones y producto](D-REDONDEO-PRODUCTO.md):
textos de alcance para el rediseño, distinción entre cotización efectiva y
estimada y discriminantes reutilizables. Sus siete artefactos coinciden por hash
y el replay racional conserva los resultados revisados. El investigador empleó
2 minutos y 44 segundos, sin suites pesadas ni evidencia oficial nueva. La
consulta puntual posterior del padre tampoco aporta una política operativa
nueva: el [manual público de consulta de cuotas, noviembre de 2018](https://sede.seg-social.gob.es/binarios/es/TGSS_Calculo_Cuotas)
describe liquidaciones
reales ya confirmadas, no un simulador de escenarios libres. No se modifican
importes; termina este tramo acotado, mientras D general queda pendiente fuera
del camino crítico de E.

La ampliación familiar integrada cubre 255 combinaciones de 2012–2026 y los 17
territorios comunes. La revisión independiente conjunta E+B es favorable en el
alcance examinado: 764 discriminantes propios, 594 regresiones y 21 hashes de
fuentes intactos. Reextrae 115 filas oficiales de 17 escalas. Mantiene excluidos
ascendientes, fallecimientos y declaración conjunta; la entrada efectiva familiar
sigue limitada a 2025. Véanse [familia](reforma-motor/bloque-e/FAMILIA-ANUAL.md),
[B2026](reforma-motor/bloque-e/B2026.md) y
[dictamen](reforma-motor/bloque-e/revision-familia-2026/INFORME.md).
El inventario está regenerado; se actualizan doce identidades de fuentes y se fijan tres módulos nuevos para
que el CI examine el candidato, sin trasladar aceptación fiscal histórica.
El CI local queda completado: 1.202 ejecuciones Vitest por bloques, con pruebas
compartidas, y 227 métodos Python; tipos y lint correctos (18 avisos previos).
Publicado en `procedencia-documental`, commit `461e16323ca11e428c3e391568755c3e6b2766ab`.
Los trabajos remotos `checks` y `corpus` pasan en la
[ejecución 41902081685](https://github.com/eliesgalvira/IRoboPF/actions/runs/41902081685).
[Cierre de integración](reforma-motor/bloque-e/CIERRE-FAMILIA-2026.md).

Tras comprobar publicación e integridad, se retiraron cinco carpetas compactas
de entregas E+B/D. Sus 121 archivos se conservan por commit o hash en el CAS
externo, con manifiesto de recuperación. No se crearon worktrees. La medición
posterior es 96,53 GB para IRoboPF y 318,96 GB libres; límite: 150 GB.

La guardia del auxiliar rechaza explícitamente una deducción pendiente activa,
evita el cero silencioso y conserva la consignación anual de importes externos.
Se integran doce rectificaciones documentales en nueve fichas valencianas y
tres filas de matriz, conservando cuantías, límites, páginas y estados. Pasan
las catorce pruebas focales nuevas y tipos. La
[revisión independiente](deducciones-2025/revisiones/producto-20261104/INFORME.txt)
es favorable acotada: 333 aserciones propias, fidelidad de las doce propuestas y
ningún error monetario nuevo reproducido en los nueve auxiliares. No se repiten
los dictámenes documentales favorables. En aquel corte E+B, las cuarenta fichas
valencianas aún no tenían evaluadores por hechos; el avance posterior se describe
al principio de este estado. Aquel arreglo documental no cerró el punto 4.


## Motor y API para el rediseño: cierre técnico del 4 de noviembre

Las entradas anual técnica y efectiva consumen una composición común de
mínimos, escalas, ahorro, deducciones y cuota. Los adaptadores mantienen los
hechos y políticas monetarias que les corresponden. La [API vigente](API-MOTOR.md)
explica unidades, discriminantes, errores y ejemplos ejecutables; el rediseño
puede consumir sus resultados sin reconstruir la cuota.

La revisión independiente confirmó la composición única y encontró E-REV-01:
la precisión declarada de 80 cifras se truncaba a 20 en los gravámenes. Se
reprodujo, corrigió y obtuvo [contraste favorable](reforma-motor/bloque-e/CONTRASTE-PRECISION.md).
El CI completo local pasa con 582 pruebas Vitest y 167 Python; las cuatro
pruebas independientes posteriores también pasan y se incorporan al CI local
y remoto. Tipos y lint pasan, con 18 avisos existentes. El cierre no amplía
la cobertura familiar fuera de Madrid 2025 ni acredita documentalmente el
núcleo nuevo. [Alcance del cierre](reforma-motor/bloque-e/CIERRE.md) y
[balance A–F con estimaciones](BALANCE-A-F.md).

Publicado en `ab29bae79b238f1d96b568cd1ba3d4b9688985fb`; `checks` y `corpus`
correctos en la [ejecución remota 41863400023](https://github.com/eliesgalvira/IRoboPF/actions/runs/41863400023).

## Continuación de A y demostración de C

Recibida la reanudación incompleta de escalas y mínimos de A sobre los
extractores corregidos. Conserva 11.204 ocurrencias deduplicadas: propone
269 coincidencias técnicas, 470 escenarios simulados no aplicables y 10.465
sin verificar. La aplicabilidad temporal y territorial sigue pendiente,
también en las coincidencias técnicas. No se aceptan como cobertura fiscal.
El padre verifica los 30 archivos, 31 auxiliares, parche y objetos de resultados.
La revisión independiente detecta dos defectos de salida: los 445 match de
celdas pierden sus reservas de aplicabilidad y tres ocurrencias agregadas
conservan una razón incompatible con su estado. Ambos tienen prueba roja
previa y corrección candidata; pasan seis regresiones nuevas y las 40 anteriores.
Ambos pares canonical/replay se reproducen byte a byte con un único censo
vigente, sin excluir la fuente cambiada por C. Se conservan importes, rechazos,
propuestas de unidad y conteos; solo cambian las tres razones obsoletas.
Las 445 coincidencias conservan sus reservas y están en la cola de aplicabilidad.
El contraste independiente A1–A2 es favorable: reproduce los dos fallos,
ejecuta 46 regresiones y seis métodos propios, y reextrae 100 celdas con 101
bindings AST. Conserva los 1.095 hashes fijados. Las regresiones están incorporadas
al CI: la entrada completa de datos pasa con 121 métodos Python y los controles
IPC/SS del motor. Se integra el candidato con sus antecedentes, reservas y
manifiestos; A sigue abierto por los pendientes siguientes.

Los dos lotes aportan replay idéntico y 40 pruebas propias, según el autor.
El suplemento de mínimos no añade cobertura: se detiene ante una referencia
indirecta de 2019. Los intentos de resolver enlaces concentran 4.612 rechazos
de funciones auxiliares no admitidas, 2.640 de caminos indirectos y 141 de
índices; esos recuentos son intentos, no magnitudes distintas. Siguen faltando
selectores y pruebas físicas de unidad y aplicabilidad. El candidato conserva
una regresión roja de la escala canaria de 2015 y una propuesta separada de
cuotas publicadas, sin aplicar. La revisión aporta sustento para 2015–2016
ordinarios y mantiene reservas sobre política monetaria y fallecimiento.

De C se recibe una demostración de transporte oficial remoto, secuencial y
reanudable, con 16 ejecuciones PDF/SES: siete recargas de casos conservados,
un discriminante de retención, siete ejercicios 2018–2024 y un piloto DA61.
Se han preparado 2.020 entradas, todavía sin ejecutar como lote masivo.
La revisión independiente exige cinco correcciones antes de ampliar: ámbito
SES, cobertura mínima de comparación, integridad e identidad al reutilizar,
recuperación de escrituras parciales y cotejo PDF anterior a la aceptación.
El candidato corregido del orquestador pasa 21 métodos de regresión y conserva
las 16 capturas anteriores. Un piloto nuevo obtiene −721,23 con cotejo previo
a su aceptación; su repetición verifica la evidencia antes de reutilizarla.
Se conserva un intento previo fallido por timeout del diálogo, sin resultado
aceptado. El [contraste independiente](simuladores/TRANSPORTE-REVISADO.md) es
favorable para F1–F5: 65 expectativas propias correctas, sin bloqueos nuevos
reproducidos en ese alcance. Se prepara la integración reproducible y la
proyección estructurada de los seis componentes de cuota ya calculados por el
núcleo común. Se recibe candidato de esa integración con operador real de la
API: 224 casillas iguales, cero diferencias y 14 ausencias en 17 filas, que
representan nueve entradas distintas. Excluye siete capturas de 2018–2024.
Las 17 filas permanecen incompletas por la comprobación de hechos fiscales;
no equivalen a 17 comparaciones plenamente aceptadas. Sus 22 archivos y parche
están recibidos y verificados. La revisión independiente reproduce los importes
y encuentra tres defectos P2: registros personales malformados invisibles,
lanzador omitido de la identidad y separación de rutas eludible por enlace
simbólico. El candidato corregido del orquestador pasa 14 métodos portables,
22 privados y seis del contraste adaptado; mantiene 224 coincidencias y las
17 filas incompletas. El contraste acotado de las tres correcciones es favorable:
14 métodos portables, 22 privados, seis adaptados y cinco propios pasan;
los seis fallos originales se reproducen sobre las preimágenes. La integración
del candidato aprobado en CI está comprobada: incluye las pruebas portables y
el operador real, con Jujutsu en el entorno fijado. El CI completo local termina
con salida cero; lint y tipos pasan, con 18 advertencias existentes. Se incorpora
el candidato a la rama con el inventario y el pin de la proyección actualizados.
Publicado C en `a16b1438b407c55545611d7efaf68f1611e4a940`.
Las cuatro entregas de integración, revisión y correcciones se retiran tras
preservar 2.398 objetos únicos y comprobar sus hashes. Los manifiestos de retirada
conservan su relación con rutas y commit; los originales activos del transporte
histórico permanecen separados para continuar C.
El trabajo posterior es demostrar la equivalencia de configuración de las
simulaciones; no acreditar hechos reales de personas ficticias. Los recibos
fijan base, inventario de fuentes y entorno del
candidato, sin atribuirlo al commit limpio anterior. Siguen pendientes el
adaptador de 2017 y la recuperación ejecutable de PADRE; los intentos fallidos
no prueban la indisponibilidad de todas sus versiones. Los originales y los
registros con identificadores efímeros permanecen privados, fuera del producto.

## Corrección técnica del 4 de noviembre

Los cinco defectos pendientes de unidades/enlaces e IPC/SS están corregidos y
revisados por el orquestador. Pasan 75 tests del bloque, las comprobaciones
generales de CI, 196 pares IPC y cinco bases de 2018; el replay real se reproduce
byte a byte. Los candidatos se integran con sus antecedentes y límites explícitos. Se mantiene el alcance fiscal pendiente:
las declaraciones SS sin pruebas de columna y vigencia ya no producen
coincidencias verificadas. [Cambios, pruebas y límites](datos-2012-2026/correcciones-cinco/INFORME.md).

## Recursos y reanudación del 3 de noviembre

Las [reglas de recursos y entregas](RECURSOS.md) limitan las ejecuciones a dos
suites pesadas en toda la máquina, con `timeout` para cada orden. Las entregas
se conservan como commits o parches y manifiestos, con cachés compartidas y sin
copias completas de dependencias. El límite conjunto de copias y worktrees es
de 150 GB. La retirada de una copia pendiente no acepta su candidato.

La limpieza retira 88 worktrees inactivos, conserva sus ramas y elimina 14
entregas publicadas, 28 exportaciones o archivos redundantes y cuatro archivos
de base ya publicados. Se han vuelto a comprobar los hashes de los 57.241
objetos únicos conservados. Repositorio, respaldos, worktrees restantes y
corpus suman 103,7 GB; quedan 312,7 GB libres en disco (unidades decimales).
Permanecen tres directorios de trabajo: el de escalas, el usado para reproducir
las revisiones pendientes y uno antiguo con metadatos Git/Jujutsu mezclados.
Este último se conserva para no eliminar metadatos sin cotejo.

Se han recuperado los informes de unidades/enlaces e IPC/SS y repetido las
pruebas interrumpidas. Sobre los candidatos conservados pasan los 37 tests
comunes, el wrapper sin Git, el censo IPC/SS y la comprobación aritmética de
196 pares de años y cinco bases de cotización de 2018. Estas comprobaciones no
acreditan por sí solas la vigencia jurídica.

En la reanudación del 3 de noviembre, los siete adversos de unidades/enlaces
terminaron con dos fallos: la cabecera
ajena puede acreditar una unidad al ampliar su caja, y el resolver AST admite
una función `async` como identidad síncrona. Los seis discriminantes IPC/SS
terminan con tres fallos al comprobar sujeto, año y columna/período. Se
conservaron sus aserciones y logs; en ese corte no se integraron los candidatos
ni se declararon cerradas las revisiones. Las ejecuciones anteriores terminadas por SIGTERM
siguen sin contarse como aprobadas.

## CI reproducible

El workflow «Comprobaciones» está verde en [la ejecución 41539191212](https://github.com/eliesgalvira/IRoboPF/actions/runs/41539191212), commit `9f8e6a8f75aaa12fd6ffd18ea8a09eeefe004275`: `checks` y `corpus` correctos. Se reanuda la integración de deducciones y A–F. Las pruebas ordinarias funcionan con un checkout limpio, sin cachés previas, archivos privados, corpus externo local ni objetos Git históricos. Los ensayos que necesitan el corpus completo se mantienen como comprobaciones locales opcionales, con omisión explícita en CI. Cada push debe pasar previamente los mismos comandos del workflow; los cambios se agrupan.

Corregidos los imports privados, las consultas a objetos Git históricos, el registro temporal del ensayo de enlaces y las aserciones de importe de la revisión gallega/riojana. Los verificadores usan fixtures sintéticos en CI y fuentes actuales fijadas por SHA-256. Los comandos se reproducen con [el script de CI](CI.md). La [revisión independiente](ci-reproducible/revision/INFORME.md) es favorable: 21 comandos y cuatro comprobaciones adicionales pasan en una exportación limpia. La pasada local previa al push y la ejecución remota confirman el resultado; esto no aprueba el corpus externo completo.

## Alcance completo aprobado

Además de las deducciones de 2025, está encargado el [plan completo A–F](PLAN-COMPLETO.md): procedencia automática de todos los datos de 2012–2026; comunidades reales en 2026; miles de comparaciones con simuladores oficiales; redondeo observado de cotizaciones; mínimos familiares unificados; y actividad, composición, admisión y puertas. El cierre técnico anterior de 65 sitios conserva sus resultados y deja de ser el límite del encargo.

La [reforma de motor único](REFORMA-MOTOR.md) tiene prioridad. Queda anulada la compatibilidad de fichas, firmas y resultados antiguos: se retiran `FamiliarFiscal`, el modo legacy y las rutas duplicadas. Las páginas actuales pueden adaptarse lo mínimo o desconectarse para compilar. La [API actual](API-MOTOR.md) documenta la retirada integrada y sus límites. La [revisión independiente](reforma-motor/revision-finalizacion/INFORME.md) corroboró los arreglos de conjunta de deducciones y localizó un helper y una tabla truncados, además de un rechazo anual ausente. Las tres observaciones tienen [corrección y regresiones](reforma-motor/correcciones-finalizacion/INFORME.md) y [contraste independiente favorable](reforma-motor/revision-correcciones/INFORME.md). Los tres rojos anteriores se reprodujeron; se conservan la frontera 2014, las escalas canarias y las siete referencias salariales Open. El cambio marginal de 47 a 49 céntimos desde 2021 queda limitado a la simulación que duplica la parte estatal. No procede otra revisión del mismo alcance. La composición común de las entradas efectiva y técnica se cierra en el hito del 4 de noviembre descrito arriba. La extensión familiar y la acreditación normativa siguen pendientes; no se declara completo el bloque E general.

Las ampliaciones regionales de deducciones y el censo automático de A continúan con esa instrucción. La entrega del auxiliar compartido es candidata: sus cálculos útiles deben incorporarse a la ruta única y revisarse allí, sin perpetuar su fachada heredada. Los cambios compartidos tienen un responsable para evitar nuevas APIs divergentes. B, C, D y F continúan según sus dependencias; E se adelanta como parte de la reforma. Cada bloque recibe revisión independiente y un balance de cobertura, diferencias, correcciones y decisiones.

| Bloque | Estado |
| --- | --- |
| A. Datos de 2012–2026 | Extractor corregido y contrastado en el piloto, incluido RP07. Recibidas extracciones parciales de escalas y mínimos de 2012–2018 y 2019–2026; falta completar sus enlaces. IPC/SS: extracción parcial integrada con cinco correcciones técnicas; 13 coincidencias IPC y alcances SS aún sin verificar cuando falta contexto documental. Piloto: 277 celdas, 50 coincidencias, 226 sin verificación y una ausencia explícita |
| B. Comunidades en 2026 | Pendiente de inicio; reutilizará las fuentes de A |
| C. Simuladores oficiales | Cinco correcciones contrastadas; integración y operador API candidatos con coincidencias monetarias condicionadas. Revisión, comprobación de hechos y comparación masiva pendientes |
| D. Redondeo de cotizaciones | Pendiente de inicio con criterio de comportamiento observado |
| E. Mínimos familiares | Motor anual común y API revisados, incluida corrección de precisión. Cobertura familiar Madrid 2025 individual; extensión normativa por año/territorio y acreditación del núcleo pendientes |
| F. Actividad y declaración completa | Encargado; pendiente de productores y contratos anteriores |

## En curso: deducciones autonómicas de 2025

Revisión de **351 fichas** contra los originales de los boletines autonómicos, sus reformas y el manual AEAT. Base: `464e0fd8`; solo commits nuevos. [Censo y reparto](deducciones-2025/censo.json), [criterios de dictamen](deducciones-2025/ENCARGO.md), [transición para el rediseño](deducciones-2025/CAMBIOS-PARA-REDISENO.md).

| Lote | Comunidades | Fichas | Estado |
| --- | --- | ---: | --- |
| A | Andalucía, Aragón, Catalunya | 49 | Revisión: 48 concordancias acotadas y una atribución incorrecta de citas, corregida y contrastada independientemente. Original de Orden VEH/192/2018 recuperado |
| B | Asturias, Cantabria | 48 | Revisión: 45 concordancias acotadas, dos diferencias documentales corregidas y contrastadas; persiste la ambigüedad sobre los 30 años |
| C | Canarias, Illes Balears | 51 | Revisión: 49 concordancias acotadas y dos diferencias temporales, corregidas y contrastadas; persisten tres limitaciones de PDF con HTML oficiales disponibles |
| D | Castilla-La Mancha, Castilla y León, Extremadura | 63 | Revisados los 63 códigos: 57 concordancias documentales condicionadas y seis códigos con reservas. Catálogos ampliados; recuento de municipios CLM corregido y contrastado. Integración del registro XML pendiente |
| E | Galicia, La Rioja | 49 | Cadena temporal de incendios ampliada y contrastada favorablemente, con alcance delimitado |
| F | Madrid, Murcia | 51 | 48 concordancias condicionadas y tres reservas; dos defectos de identidad en conjunta corregidos y contrastados, sin habilitar conjunta anual |
| G | Comunitat Valenciana | 40 | Vivienda e inversión/DANA: localizador corregido y contrastado. Seis propuestas culturales revisadas, con dos defectos documentales corregidos y contrastados; reservas sobre precio histórico y censo de entidades |

El contrato documental inicial muestra pendiente cuando no hay evidencia. Su carácter aditivo ya no limita el modelo definitivo. Los tres defectos del verificador están corregidos y contrastados independientemente: coherencia del dictamen global, adquisiciones compartidas y filtrado de URL. Pasan 37 regresiones y siete casos del revisor; las diez pruebas Vitest se ejecutaron en el repositorio principal. Revisión técnica cerrada, sin aceptar todavía normas. [Contrato y uso](deducciones-2025/contrato/README.md), [dictamen independiente](deducciones-2025/revisiones/contrato-corregido/INFORME.md).

**351 dictámenes candidatos y las siete revisiones independientes recibidos; cobertura completa del censo. Ningún lote aceptado íntegramente todavía.** Los autores propusieron 252 diferencias y 99 no verificables para el alcance completo. Son recuentos provisionales; las revisiones y rectificaciones se deben conciliar antes del balance final. Las diferencias incluyen omisiones de ficha: no equivalen a 252 errores de cálculo.

- [Asturias y Cantabria](deducciones-2025/revisiones/b-condiciones/INFORME.md): revisados los 48 expedientes; 45 concordancias documentales acotadas, dos diferencias y una ambigüedad legal. La [corrección candidata](deducciones-2025/correcciones/b-rectificaciones/INFORME.md) recoge la curatela representativa en la ficha de familia monoparental y declara la diferencia entre el límite estricto de 8.000 euros de la norma y el inclusivo del manual en estudios. El límite del código ya es estricto y no debe cambiarse por esa discrepancia del manual. La frontera asturiana de los 30 años sigue ambigua. Los dos casos documentales fallidos quedan conservados y pasan con la corrección; contraste independiente favorable en su alcance.
- [Andalucía, Aragón y Catalunya](deducciones-2025/revisiones/a-ampliado/INFORME.md): revisados los 49 expedientes; 48 concordancias acotadas y una mezcla de ocho citas de celiaquía en donativos ecológicos. La [corrección](deducciones-2025/correcciones/a-atribucion/INFORME.md) retira esas referencias solo del expediente erróneo y conserva sus usos válidos. El original oficial de la Orden VEH/192/2018 y sus citas están recuperados en la revisión; queda incorporarlos al manifiesto común. La corrección de atribución queda corroborada por revisión independiente.
- [Canarias e Illes Balears](deducciones-2025/revisiones/c-ampliado/INFORME.md): revisados los 51 expedientes; 49 concordancias documentales acotadas y dos diferencias temporales. La [corrección](deducciones-2025/correcciones/c-temporal/INFORME.md) distingue los límites canarios del año de origen del traslado y explica que el porcentaje balear reforzado ya existía antes de julio de 2025. El PDF oficial canario se incorpora al almacén externo y sus citas exactas al manifiesto. Tres PDF del BOIB siguen sin recuperarse; sus HTML oficiales están disponibles. Las dos correcciones temporales quedan corroboradas por revisión independiente.
- [Castilla-La Mancha, Castilla y León y Extremadura](deducciones-2025/correcciones/d/INFORME.md): corregidos cinco artículos extremeños y dos mezclas de secciones; ampliadas las 63 fichas. Las revisiones regionales posteriores cubren los 63 códigos: 57 concordancias documentales condicionadas y seis códigos con reservas concretas. Esto no valida cuotas automáticas ni acredita los hechos particulares de un contribuyente.

La [ampliación de Castilla-La Mancha](deducciones-2025/correcciones/d-clm-remisiones/INFORME.md) y su [revisión independiente](deducciones-2025/revisiones/d-clm-remisiones/INFORME.md) cubren 27 códigos. Se incorporan tres precisiones del catálogo; las propuestas documentales por código se conservan en el expediente regional. Su proyección al registro común requiere normalizar localizadores XML y fuentes complementarias; la proyección incompatible se ha retirado sin perder esa evidencia. Los dos códigos de vivienda conservan la reserva de concurrencia entre norma y manual. Los 2.495 pasajes se han reextraído. La revisión confirma que el anexo enumera 25 municipios; la [corrección del recuento](deducciones-2025/correcciones/remisiones-documentales/INFORME.md) cuenta con [contraste independiente favorable](deducciones-2025/revisiones/remisiones-documentales/INFORME.md).

La [ampliación de Extremadura](deducciones-2025/correcciones/d-extremadura-remisiones/INFORME.md) y su [revisión independiente](deducciones-2025/revisiones/d-extremadura-remisiones/INFORME.md) cubren 19 códigos: 18 concordancias bajo condiciones y una reserva parcial del artículo 11 bis para adquisiciones entre el 1 de enero y el 21 de marzo de 2022. Se incorporan las precisiones descriptivas del catálogo. Los 60 documentos/versiones y 884 citas están comprobados; la matriz y la revisión conservan la reserva temporal. La conciliación de estos dictámenes con el registro común sigue pendiente.

La [ampliación de Castilla y León](deducciones-2025/correcciones/d-cyl-remisiones/INFORME.md) y su [revisión independiente](deducciones-2025/revisiones/d-cyl-remisiones/INFORME.md) cubren los 17 códigos: 14 concordancias documentales bajo condiciones y tres reservas entre norma y manual (alternativa de autorización o informe en patrimonio natural, domicilio en inversión directa y planes autonómicos de rehabilitación). Se incorporan las descripciones y las 34 propuestas por código, incluidas siete comparaciones desfasadas; sus dictámenes se representan con el vocabulario del contrato común, conservando las condiciones y las etiquetas originales; no cambian expectativas de tests ni se implanta cálculo automático de cuotas. Los 45 originales y 1.613 citas están reextraídos. Las reservas y la necesidad de acreditar los hechos de cada contribuyente permanecen explícitas.

- [Galicia y La Rioja](deducciones-2025/correcciones/e-remisiones/INFORME.md): la [revisión independiente](deducciones-2025/revisiones/e-remisiones/INFORME.md) cubre 49 fichas; respalda 48 descripciones y localiza la norma posterior que faltaba para incendios. Se incorporan RDL 10/2026 y su convalidación, con tres citas exactas: 59 fuentes y 1.621 citas reextraídas. La exención personal queda delimitada por el acuerdo y las fechas que exige la norma; no se extiende a toda ayuda autonómica. La rectificación tiene prueba roja previa y cinco controles verdes; falta su contraste acotado. La clasificación y cuota de una ayuda particular siguen sin acreditarse.
- [Madrid y Murcia](deducciones-2025/correcciones/f/INFORME.md): la [revisión independiente](deducciones-2025/revisiones/f-ampliado/INFORME.md) cubre 51 códigos, con 48 concordancias condicionadas y tres reservas: vehículos exactamente a 35.000 euros, comparación patrimonial de vivienda joven y remisión defectuosa en dispositivos de ahorro de agua. Se corrige su atribución documental. Los dos importes históricos pasan en la API actual. Los dos defectos posteriores de identidad en conjunta están corregidos y contrastados en la [revisión del motor](reforma-motor/revision-finalizacion/INFORME.md): nacimiento Madrid y guardería Murcia. Esto no habilita la conjunta anual, que se rechaza explícitamente.
- [Comunitat Valenciana](deducciones-2025/correcciones/g/INFORME.md): 40 fichas rectificadas y 111 localizaciones candidatas resueltas, con 68 fuentes y 2.077 citas. Faltan las remisiones concretas enumeradas; no se consideran imposibilidades externas. Las 40 fichas pasan a `normalizada_pendiente_tests`: una descripción ampliada no acredita su cálculo. El catálogo sigue teniendo 351 entradas, de las que 311 conservan la etiqueta anterior de implementadas, sin que esa etiqueta certifique su corrección.

Las propuestas nuevas de [vivienda valenciana](deducciones-2025/correcciones/g-vivienda/INFORME.md) y de [inversión y territorio DANA](deducciones-2025/correcciones/g-inversion-dana/INFORME.md) cubren seis códigos distintos. Están incorporadas como candidatos documentales, sin aplicar todavía sus cambios al catálogo. Se han reconstruido sus 18 archivos y reextraído las 85 citas; las preimágenes coinciden con los archivos actuales. La [revisión independiente](deducciones-2025/revisiones/g-vivienda-inversion/INFORME.md) respalda cinco dictámenes de alcance y detectó RV01: la cita `gv-31` apuntaba al índice. La [corrección del localizador](deducciones-2025/correcciones/g-localizador/INFORME.md) remite al artículo 60 completo y tiene [contraste independiente favorable](deducciones-2025/revisiones/g-localizador/INFORME.md). La metodología oficial identifica la superficie construida catastral de vivienda; permanece la reserva sobre la celda histórica del precio de referencia. La interpretación EECV queda corroborada en el alcance revisado. Los 35 discriminantes son condiciones documentales, no pruebas ejecutadas de una cuota; no procede repetir los dictámenes favorables. Las [seis propuestas de patrimonio, lengua y mecenazgo](deducciones-2025/correcciones/g-cultura-lengua/INFORME.md) cuentan con [revisión independiente](deducciones-2025/revisiones/g-cultura-lengua/INFORME.md). Sus reglas quedan respaldadas con alcance explícito; se detectaron un fundamento ajeno a abonos y citas del índice o insuficientes. La [corrección documental](deducciones-2025/correcciones/remisiones-documentales/INFORME.md) conserva las fuentes, amplía los pasajes pertinentes y separa sus usos por deducción. El [contraste de las tres rectificaciones](deducciones-2025/revisiones/remisiones-documentales/INFORME.md) es favorable: 18 fallos previos reproducidos, seis métodos actuales y siete discriminantes propios correctos. No se repiten los dictámenes favorables. La operatividad del censo valenciano en 2025 conserva una reserva concreta, que no demuestra su inexistencia ni impide aplicar otras categorías de beneficiarios. Ninguno de estos resultados cierra las 40 fichas.

Las revisiones de las ampliaciones A, B y C cubren 148 fichas: 142 concordancias documentales acotadas, cinco diferencias y una ambigüedad. Las cinco diferencias están corregidas y corroboradas en su alcance por la [revisión independiente](deducciones-2025/revisiones/cinco-rectificaciones/INFORME.md). Este recuento no valida una liquidación ni sustituye el balance final de las 351 fichas. Pasan las 256 pruebas focalizadas de A y C y los casos independientes de sus tres correcciones; pasan además los nueve controles de Cantabria; los cinco grupos de casos propios de la revisión también pasan. No procede repetir las revisiones favorables. La reextracción auxiliar de una cita histórica de la DT segunda requiere otro selector; el original y su literal están comprobados mediante el localizador independiente de la nueva revisión. No afecta al dictamen favorable de los cinco arreglos.

La [reparación del registro común](deducciones-2025/correcciones/registro-clm/INFORME.md) corrige dos incompatibilidades de integración en las Castillas. El CI añade su validación completa sin CAS: esquema, referencias declaradas y coherencia de los 351 registros. No sustituye la reextracción ni resuelve la incorporación pendiente del XML de Castilla-La Mancha. La [revisión independiente](revisiones/ef-obligaciones-20261102/INFORME.md) confirma la conservación literal de las evidencias y reservas. Límite: el CI común no exige conservar todos los metadatos complementarios de vigencia; su presencia actual se comprobó directamente.

La integración anterior reextrajo 13.911 citas de los siete lotes. Tras ampliar A, B y C, el verificador central admite los 351 registros y comprueba sus originales externos con ambos hashes y tamaño; no hay códigos ausentes ni duplicados. Comprobar la integridad de los archivos no sustituye el cotejo jurídico. Las llamadas antiguas sin hechos ya no son un contrato de cálculo válido.

La corrección candidata de los nueve casos del auxiliar compartido incorpora hechos explícitos por persona y evento y rechaza llamadas activas insuficientes. Pasan 612 pruebas integradas, con dos fallos históricos esperados, tipos principales y lint del alcance. Se han reextraído las 286 citas actuales de esos nueve códigos. La ruta anual de importes consignados permanece intacta. La entrega precisa un error del planteamiento inicial: 1.130 euros corresponde al tercer hijo canario más el primer suplemento por discapacidad; para el cuarto son 1.396 euros. La revisión independiente y la conciliación de los dictámenes regionales con la nueva API siguen pendientes. [Alcance](deducciones-2025/correcciones/auxiliar-hechos/INFORME.md), [compatibilidad](deducciones-2025/CAMBIOS-PARA-REDISENO.md#auxiliar-numérico-con-hechos-explícitos).

El contrato admite publicaciones primarias clasificadas como reforma o corrección, sin reclasificarlas como norma inicial. También distingue una URL oficial de una ruta local y el pie editorial del manual de su fecha de publicación no acreditada. El cambio de categorías normativas está corroborado por la revisión B. Los defectos adicionales de credenciales dentro de reservas y fecha nula normativa están corregidos y contrastados. El reconocimiento completo de destinos Markdown tiene [revisión favorable](deducciones-2025/revisiones/markdown-completo/INFORME.md): 53 regresiones, 36 casos anteriores y 84 adversos nuevos pasan. La comprobación usa CommonMark con dependencia fijada; no requiere otra ronda del mismo alcance. [Arreglo y límites](deducciones-2025/correcciones/contrato-url-fecha/CONTRASTE.md).

Se han comprobado también las 425 citas complementarias de las siete revisiones. La reextracción no basta para atribuir una cita al artículo correcto; esa pertenencia y la vigencia se contrastan por separado.

Pendiente no significa «no verificable». Las auditorías históricas sirven de punto de partida, no de validación automática. La ampliación parcial posterior de G aporta 50 citas y once precisiones descriptivas, con transporte comprobado; ese paquete permanece sin integrar y sirve de antecedente para las propuestas específicas posteriores. Los originales nuevos se conservan en el almacén externo. Las fichas pueden cambiar para expresar correctamente el cálculo y su procedencia.

## Extracción automática de datos de 2012–2026

La [canalización candidata](datos-2012-2026/INFORME.md) inventaría 57 módulos y 116.170 rutas efectivas en su versión fijada. Las rutas incluyen alias, textos y metadatos; no son 116.170 magnitudes fiscales distintas.

La primera ejecución extrajo 277 celdas: 87 coincidencias numéricas, 189 sin comparación y una ausencia. La [revisión técnica](datos-2012-2026/revision-canalizacion/INFORME.md) detectó defectos de unidades, signos y obligaciones de cobertura, además de límites en selectores y huellas de ejecución. La [corrección](datos-2012-2026/CORRECCIONES-RP.md) conserva 50 coincidencias con unidad acreditada, 226 celdas sin verificación y una ausencia explícita. Las otras 37 igualdades anteriores dejan de considerarse verificadas porque falta acreditar su unidad; no son nuevas diferencias numéricas. La [revisión posterior](datos-2012-2026/revision-correcciones/INFORME.md) reprodujo el manifiesto y sostuvo las correcciones en el piloto salvo RP07. Sus ocho signos ignorados quedaron corregidos y la [revisión de geometría](datos-2012-2026/revision-geometria/INFORME.md) es favorable en ese alcance: 299 comprobaciones propias y 190 salidas admitidas sin cambios. El padre reproduce los cuatro métodos y reextrae las 277 celdas reales sin diferencias. No se demuestra una cifra financiera errónea en el piloto. Procede ampliar tablas con obligaciones y unidades propias, sin repetir este dictamen favorable. La selección de obligaciones por lote ya tiene implementación candidata: archivo y SHA-256 esperado externos a su contenido, validación separada y manifiesto v3 reconstruible. Las nuevas acreditaciones semánticas siguen rechazadas hasta disponer de evidencia específica. El piloto conserva 50 coincidencias, 226 celdas sin verificación y una ausencia. Pasan 36 pruebas del autor; la recepción comprueba las siete rutas y su reconstrucción exacta. La [revisión independiente conjunta](revisiones/ef-obligaciones-20261102/INFORME.md) corrobora el contrato por lote en su alcance; no procede otra ronda favorable. [Contrato por lote](datos-2012-2026/contrato-obligaciones-lotes/INFORME.md). El control adicional checkJs conserva cinco diagnósticos compartidos, distintos de las comprobaciones ordinarias de CI.

La ampliación IPC/SS recibida, todavía sin integrar ni revisar, registra trece igualdades numéricas de IPC y extrae 395 celdas de bases y 129 de tipos de cotización. Conserva 22 celdas ambiguas como texto. Quedan por completar el estado de publicación del IPC, la asignación de sujetos y vigencias, las remisiones y los enlaces a parámetros consumidos; estas cifras no son valores verificados ni cierre del lote.

Las entregas de escalas y mínimos, todavía sin integrar ni revisar, son parciales. Para 2012–2018 se enumeran 3.479 posiciones: 910 igualdades candidatas, diez diferencias, 2.414 sin verificar, una ausencia y 144 posiciones en seis tablas rechazadas; además quedan 4.021 ocurrencias sin enlace al motor. Para 2019–2026, la estrategia principal registra 83 igualdades candidatas, 3.499 celdas sin verificar y 215 cuadros rechazados. Sus resultados geométricos alternativos no se suman a los principales. Quedan asignaciones, unidades y vigencias por completar, y una discrepancia de huella de ejecución en la segunda entrega. Una igualdad numérica sin esas condiciones no demuestra concordancia normativa.

El catálogo local encuentra los bytes de 79 fuentes y no los de otras 440 en las raíces consultadas. Esa ausencia local no demuestra que una fuente oficial sea inaccesible: hay que buscar en los respaldos y completar las adquisiciones. Los manifiestos, citas y posiciones permanecen en Git; los originales y los artefactos voluminosos se conservan fuera.

## Resultados anteriores

**El cálculo anual salarial de Madrid 2025 está terminado y revisado dentro de su perfil admitido.** Incluye el redondeo contrastado con siete ejecuciones de Renta WEB Open. La interfaz queda para Opus. [Alcance, resultados y límites actuales](DECLARACION-SALARIAL-2025.md).

**El alcance técnico acotado de 65 sitios está cerrado: 64 corroboraciones bajo condiciones y un bloqueo demostrado.** Un sitio es un punto identificado del rastro de cálculo; no equivale a una regla fiscal completa. La auditoría fiscal exhaustiva de 2012–2026 permanece incompleta.

Ese cierre conserva la evidencia de sus versiones de código. El cambio posterior del redondeo salarial tiene su propia revisión; no hereda automáticamente los dictámenes causales históricos.

| Para conocer… | Documento |
| --- | --- |
| Qué permite calcular el backend salarial actual y qué falta para la interfaz | [Declaración salarial 2025](DECLARACION-SALARIAL-2025.md) |
| Qué se demuestra, bajo qué condiciones y qué falta | [Informe final](INFORME-FINAL.md) |
| El resultado de cada uno de los 65 sitios | [Matriz individual](correcciones/cierre-r66/MATRIZ-65.md) y [datos con condiciones y hashes](correcciones/cierre-r66/matriz-65.json) |
| Las decisiones vigentes, objeciones y costes | [Decisiones](DECISIONES.md) |
| La cobertura del inventario y sus lagunas | [Inventario](INVENTARIO.md) |
| La diferencia entre integridad documental y aceptación fiscal | [Corpus](CORPUS.md) y [enlaces verificables](ENLACES-VERIFICABLES.md) |
| Las correcciones públicas contrastadas y sus reservas | [Auditoría de correcciones de X](auditorias/correcciones-x-2051956145145712916/INFORME.md) |

El bloqueo de `anual.explicito.actividad.etapa` depende de productores de las **19 familias de actividad excluidas**. Las variantes de actividad de otras salidas explícitas tampoco quedan cubiertas por el cierre de trabajo/pensión. La composición global y la admisión pública siguen pendientes.

Los indicadores `siteClosed`, `admissionClosed`, `wiringAllowed` y `completeRuleAcceptance` permanecen en **`false`**. Los dictámenes locales no validan hechos o derechos familiares, no certifican toda la semántica de JavaScript/Effect y no eliminan las reservas jurídicas o de autenticidad.

El informe conserva las limitaciones de retenciones, cotizaciones, deducciones y territorios; también distingue los tipos principal/vendor comprobados de la deuda estricta `checkJs`. Las estimaciones de trabajo posterior son orientativas y no comprometen una fecha ni una aceptación fiscal.

El respaldo de código y evidencias seleccionadas utiliza `origin/procedencia-documental`. Los originales grandes requieren el CAS local: una clonación Git no basta. V5 r2 conserva el corte R26; host-b conserva V1 desfasado y no acredita custodia independiente ni respaldo remoto completo. [Conservación y límites](INFORME-FINAL.md#respaldo-y-conservación).

### Continuación del 5/11, conexión anual y lote histórico

C301 sigue publicado en `10ea938a`, con CI remoto verde. La revisión de conexión
anual valenciana detectó dos P2: truncamiento de cuota 20,079 que elevaba el
resultado de 102,42 a 102,43; edad propia contradictoria admitida con id de gasto.
El integrador conserva cuota y movimientos decimales exactos y resuelve el sujeto
por referencias. Pasan 260 regresiones focales y los controles monetarios nuevos;
el CI completo posterior reproduce 31 comandos en entorno limpio: 1.602
ejecuciones Vitest, 247 métodos Python descubiertos (siete omitidos) y todos los
controles correctos. Los 527 archivos fijados permanecen intactos. Se prepara su
publicación en procedencia-documental.

La revisión del registro351 detectó 307 destinos históricos incorrectos, una
proposición CAMP-02 refutada dentro de regla actual y tres nombres de orden
incorrectos. Corregidos y verificadas las preimágenes rojas; seis controles
portables verdes. Los estados jurídicos históricos permanecen intactos.

Catalunya: revisión independiente con un P2 sobre acogimiento previo a la adopción;
corrección privada preparada. Madrid/Murcia: revisión con contradicción de identidad
hijo/progenitor; corrección privada preparada. Asturias/Cantabria: 48 pruebas y
tipos/lints verdes, revisión independiente en curso. Canarias/Baleares: diez
evaluadores parciales nuevos, validación de autor en curso. Castilla-La Mancha,
Castilla y León y Extremadura: doce reglas parciales privadas pendientes de pruebas. El punto4 continúa abierto; no confundir el catálogo351 con
evaluación completa por hechos.

Histórico b01: 59 capturas UI nuevas y una reutilización validada, más SKIP del
piloto previo; 61/2020 en2018, 67/14140 en conjunto. Sin errores, 20m44,70s. Las
60 incorporaciones aún no se han comparado con la API. Dos turnos pesados
reservados temporalmente a producto; siguiente captura y comparación esperan
asignación, sin procesos en bucle ni suites adicionales.
