# Contrarrevisión independiente de mínimos por derechos v2 — Sol

**MDV1-01/02/03 corregidos en el alcance probado. El cierre anual conserva una reserva jurídica nueva, MDV2-P01.** No hay defecto numérico nuevo demostrado ni rojo en los 86 casos de esta revisión. No se acepta fiscalmente toda la ruta ni se certifican los hechos declarados.

- **MDV1-01:** rechazo de contradicción con entrada completa, saldo neto anterior a art.20, pérdidas sin truncamiento, exenciones representadas y frontera de céntimos verificados en la API anual.
- **MDV1-02:** menor al constituir, fechas civiles antes/en/después del cumpleaños y separación de inscripción/primer acogimiento verificados. También se verifica la ampliación del padre que exige constitución y rechaza su ausencia. Bisiesto queda pendiente.
- **MDV1-03:** hechos propios sin custodia rechazan aun con flag false; pagador ajeno no bloquea al custodio elegible. Contradicciones de custodia y flags siguen rechazadas.

**MDV2-P01 — reserva de capacidad, sin cuota inventada.** Con custodia exclusiva, alimentos judiciales true, especialidad false y el hijo con 8.000,01 de renta o declaración individual de 1.800,01, desaparece el mínimo por condiciones distintas de la custodia y la API devuelve Success. Son dos caracterizaciones verdes del comportamiento, no demostraciones de corrección fiscal. El art.64 exige falta de derecho al mínimo; el manual describe la exclusión por custodia en términos generales. Esta revisión no obtuvo una fuente primaria específica que cierre ese cruce. Antes de anunciar soporte, resolver el criterio o excluir expresamente esos casos. Objeción experta: custodia no equivale a derecho si fallan arts.58/61, pero tampoco permite inventar una especialidad cuyo importe falta. Coste: investigación jurídica adicional o un rechazo acotado, sin exigir implementar una API familiar universal. Detalle individual en MDV2-P01.json.


Revisor nuevo, trabajo personal con gpt-6.1-sol high, sin subdelegación ni fixes. Base y HEAD: 1ec684b4e4408068282febf1319c12c6ac8a15c1. Código fiscal idéntico a 7956b16ae41b30697cefc5924d562dc6707e5156 en lib y tests. La revisión Astra cancelada no aporta ningún resultado a este dictamen; su log no se ha modificado.

Se leyeron íntegros BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO y DECISIONES —incluidas D054–D056—, corrección familiar r15 e informe v1. Se reabrieron los originales y los cuatro rojos históricos personalmente. El informe de implementación inicial contextualiza el alcance, sin heredar su aceptación.

## Base, integridad y entrega

10.583 entradas verificadas mediante git ls-tree, lstat, readlink para enlaces y SHA-256 contra bytes de git cat-file blob. Cero ausencias, cambios o borrados iniciales; detalle en base-inicial.json.gz. No se confía solo en el índice. node_modules es un enlace de lectura autorizado a /home/elies/Repos/IRoboPF/node_modules; el scratch propio permanece en .cache/minimos-v2-sol del checkout.

Solo se entrega esta carpeta. No se modifica código, informes ajenos, originales, registros, atestaciones, confianza ni estado; ninguna operación VCS mutante. No build, servidor, preview, suites legacy pesadas, LFS, gasto o transferencia externa. Las lecturas web son consultas a fuentes públicas, no envío de archivos. No se leen entregas activas de otros hijos.

El inventario de esta base conserva 21516a24e30d5106d229b1fead87aa0889700df3950fabfe0f4bb69b23631266 y artefacto 5095690502f91a0157ea0323410531f120849cf8e776c3d813fa490fb322df48. Snapshots v1 d452f38ec6018458d6a500b9df141c802fd9e74aa96ac5f3f83eef635d3d214b y v2 5f8043815f095d8bad3bb1ea2656e9669e42cb13386f42104e5587a6bdc26964. No se regeneran ni se promueven: 52.455 ocurrencias, 65 sitios y 715 objetos son recuentos técnicos.

## Decisiones de alcance y objeciones

1. **Conciliación acotada.** El Schema exige declarar perfil caso-anual-parcial y ausencia de rentas/gastos fuera de su representación; el helper aislado no exige esa declaración y la API anual sí. Objeción experta: repetir un neto no prueba su contenido ni la exhaustividad fiscal real. Respuesta: hay cotejo con el saldo derivado del perfil, no mera repetición; la declaración sigue siendo responsabilidad externa. Coste: admitir solo hechos compatibles con ese perfil, dejando fuera categorías, gastos o reducciones no representados. No se exige una API universal que esta ruta no anuncia.
2. **Renta fiscal y céntimos.** Cotejar antes del art.20, integración y compensación preserva pérdidas y excluye exenciones representadas. Objeción: el HALF_UP técnico puede cambiar la prioridad en 8.000. Se comprueba también el mismo lado del umbral, con rechazo si cambia. Coste: algunas entradas requieren más precisión de contrato o revisión humana; no se declara una regla tributaria universal de redondeo.
3. **Dos fechas y primer evento.** La constitución determina la edad del adoptado; la inscripción o resolución habilitante determina el plazo. Objeción: una fecha de acogimiento anterior no demuestra que la adopción actual fuese de menor ni permite reiniciar tres años. Se conservan hechos separados e historial completo declarado. Coste: exigir documentación externa de ambos eventos, sin reconstruir el historial con un booleano. El artículo 176 CC sitúa la constitución en resolución judicial y el art.240 computa mayoría cumplida; no se confunde inscripción con constitución.
4. **Capacidad bisiesta.** El rechazo del 28 de febrero del decimoctavo aniversario de nacido 29-2 es una capacidad pendiente. Objeción: un rechazo conservador pierde casos materialmente legítimos. Coste: revisión civil específica antes de ampliar soporte; no se inventa una fecha de mayoría ni se presenta esa exclusión como inexistencia de derecho.
5. **Alimentos por rol.** Los hechos propios sin custodia no pueden eludirse mediante flag false; otro pagador no debe bloquear al custodio que tiene mínimo. Objeción: excluir a un pagador del mínimo no liquida los arts.64/75. Coste: rechazo anual hasta representar importe y procedimiento, sin cuota alternativa. El custodio debe cumplir además renta, edad, declaración y demás condiciones; custodia por sí sola no acredita el mínimo.
6. **Controles históricos.** Repetir positivos v1 requiere adaptar renta 26050→26056, declaración y fechas, manteniendo esperados. Objeción: un rechazo por campo ausente podría ocultar el defecto anterior. Los tres IDs tienen casos nuevos con contrato completo. Coste: conservar diff de adaptación y dos procedencias de pruebas; ninguna alteración de los artefactos originales.
7. **Separación de componentes.** Se examina la conexión anual y el rastro, además del helper. Objeción: una suma total correcta podría ocultar mezcla estatal/autonómica. Se comprueban importes diferenciados y remanentes del ahorro con expectativas independientes. Coste: exactitud limitada a los casos, sin aceptar la ley madrileña completa ni todo redondeo por casillas.
8. **Integridad documental.** Los cuatro originales familiares coinciden por SHA-256/SHA-512/tamaño. Objeción: checksum no autentica al emisor ni acredita vigencia. Se distingue compilación anual, consolidado informativo y manual administrativo; no se certifican firmas/CSV, historial completo de reformas ni autenticidad histórica. Coste: interpretación y aceptación jurídica limitadas, sin atestaciones nuevas.

## Derivaciones independientes

30.000 − 1.944 − 2.000 = 26.056. Una pérdida representada de 20.000 deja 6.056; de 30.000 deja −3.944, aunque la base del ahorro se limite a cero. Trabajo de 10.000 deja 7.352 antes del art.20, no 10.000 ni la base posterior. El bruto 10.692,90 produce 8.000,00008 y no puede representarse como 8.000 para ceder el mínimo.

Para un custodio con un hijo: 7.950×0,095 + 8.532,50×0,085 = 1.480,5125 → 1.480,51. El esperado nuevo 1.480,50 del padre era erróneo; no exige corregir el motor. Para adopción menor con incremento: 10.750×0,095 + 11.537,66×0,085 = 2.001,9511 → 2.001,95.

Dos hijos con dos titulares: mínimo estatal 8.100 y autonómico 8.693,49, minoración 1.508,45 con general suficiente. Con BG=0 y ahorro=20.000, remanentes separados: estatal 8.100 da 790,50 y autonómico 8.693,49 da 852,81645; total presentado 1.643,32, cuota previa 4.080 y restante 2.436,68. No se divide el mínimo propio del contribuyente.

## Fuentes examinadas

fuentes-verificadas.json registra rutas literales, SHA-256/SHA-512 y tamaños de los originales familiares. Los .txt son reextracciones de lectura, no facsímiles ni originales nuevos.

- [Ley 35/2006, compilación anual AEAT 2025](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/Normativa-IRPF25/Ley-35-2006.pdf): original 95d7f10a386b345af1cb9249821faa0c8bf56a9e7b4c578ac9194c50f9b6bf94 en correcciones-x-v1; arts.58/60/61 y contexto 64/75. original-ley.json recalcula ambos hashes y tamaño. No se convierte la compilación en comprobación exhaustiva de todas las reformas.
- [Código Civil, redacción seleccionada 03-01-2025](https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763&p=20250103&tn=1): original b3178fa6…; artículos176 y240 y notas de modificación personalmente reabiertos. Texto consolidado informativo, no publicación oficial de cada reforma.
- Manual AEAT 2025: [requisitos](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/concepto-requisitos-descendientes.html), [cuantías](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/cuantias-aplicables.html) y [condiciones](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/condiciones-aplicacion-minimo-descendientes.html): originales 6cc6241a…, 7f06478e…, 048341f8…; lectura completa de requisitos, prioridad, orden, renta neta, incremento y no reinicio.
- [Especialidad de alimentos, AEAT 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/especialidades-determinacion-cuota-integra-estatal-autonomica/anualidades-alimentos-favor-hijos/especialidad-tratamiento-anualidades-alimentos.html): consulta complementaria personal y adquisición con wrapper del corpus. El procedimiento depende de cuantía efectivamente satisfecha y base; no se infiere un expected monetario sin esos hechos.

La consulta web BOE y AEAT complementa las copias locales. La búsqueda adicional no obtuvo una consulta DGT primaria específica que cierre el caso de custodio sin mínimo por otras condiciones; no se usa un resumen secundario como fundamento.

## Límites de cierre

No se revalida cotización uniforme, alquiler simplificado, clasificación universal de ganancias, autenticidad histórica ni toda la liquidación fiscal. La declaración de conciliación es suficiente para detectar coherencia interna del perfil representado, con límites honestos; no es prueba externa. No se certifican identidades o censos ni se reconstruye capacidad civil no representada.

Legacy se conserva como contrato separado y no admite derechos nuevos. La ausencia de IDs en los rastros probados no garantiza todos los consumidores futuros. No se ejecutan las suites legacy pesadas ni se extrapolan ejercicios a partir de tests.

Crossa conserva v1 histórico y desfasado, misma casa y dueño, sin custodia independiente. No se toca esa copia ni se afirma una verificación propia en destino. Sin aceptación fiscal completa, promoción de bindings ni atestación.


## Comprobaciones reales y cierre

Pase propio inicial: **86 correctas**, sin rojos. Pase final tras corregir un condicional de mi código de test: **86 correctas**, salida 0 (57 casos nuevos y 29 positivos adaptados de v1). pruebas-final.log identifica cada caso. El cambio propio fue `if (motivo)` a `motivo !== undefined`, exigido por strictBooleanExpressions; no cambia un esperado ni el motor. tipos-propios.log conserva los dos diagnósticos iniciales y tipos-propios-final.log la salida 0.

Suites existentes: primer pase **66 correctas y 6 no ejecutadas**, salida 1 por falta de python3 al arrancar publicación. No fue un rojo fiscal. El pase repetido con Python de Nix y UV_PROJECT_ENVIRONMENT absoluto obtiene **72 correctas de cinco archivos**, salida 0, incluidos rastro y publicación. No se suman con las 86 como reglas aceptadas. La publicación se genera en scratch de este checkout; no cambia el registro ni los snapshots oficiales de base.

Tipos principal y vendor: salida 0. Tipos propios finales: salida 0. Lint global: salida 0, con oxlint --disable-nested-config y ESLint. Lint propio final: oxlint=0, eslint=0, ejecutado desde la raíz sobre las dos rutas de entrega. Ensayo anti-slop: las 16 reglas a error, ambos plugins rechazan el fixture deliberadamente inválido, salida 0; se ejecutó una copia scratch del ensayo existente con --disable-nested-config añadido. No se cambian extensiones, ignores ni reglas.

Effect-solutions list/show basics error-handling testing y fuente local Effect.ts se consultaron antes de escribir los tests. Effect.result deja escapar defectos: los rechazos ensayados con no finitos y Schema no son Die disimulados mediante captura global.

Los cinco originales familiares y sus manifiestos coinciden por SHA-256/SHA-512/tamaño y SHA-256 del manifiesto respectivamente. La ley se reextrajo de su PDF fijado por hash: arts.58/60/61 y64 en páginas físicas36–38, art.75 en la página física 45. ley-75.txt conserva esa página de lectura; la extracción completa queda solo en scratch. No hay facsímil nuevo, autenticación histórica ni reconstrucción de toda la cadena autonómica. El inventario y su artefacto se cotejan sin regenerar sus archivos.

REPRODUCCION.md fija comandos y ajustes de entorno. Se conservan los fallos iniciales y pases finales, sin sustituirlos por una historia toda verde. manifiesto.json enumera las rutas literales relativas a esta entrega, SHA-256, tamaño y baseSha256=null para sus altas. Se excluye a sí mismo por autorreferencia. No hay código del motor, tsconfig, node_modules ni árboles de ejecución dentro de la entrega.

**Decisión final:** las tres correcciones y la ampliación de fecha de constitución son comprobables en la frontera pública actual. No se hereda ningún dictamen anterior. MDV2-P01 permanece como reserva jurídica acotada que debe resolverse o excluirse expresamente antes de cerrar ese alcance anual; no se presenta como un defecto numérico demostrado. No se ha aplicado ningún fix, atestación ni aceptación fiscal completa.
