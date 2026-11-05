# Rebase P1 ELA sobre raíz actual agregada: validación de autor

**1312 pruebas correctas, dos TODO heredados; tipos estrictos/Effect y ambos
linters correctos sobre17 archivos. PESADO2 liberado.** Pendiente primera
revisión independiente. Raíz sólo lectura, sin VCS mutante, inventario ni CI
global. Las20 rutas P1 originales se conservan como recepción autónoma.

## Base recibida y fusión

La base NO es b912 sin modificaciones. Se recibió la raíz actual con agregado125
E38/D51/C36/F/Aragón/histórico, parche preparacion.patch SHA256
92c6c7b56af4fcda2e752dcb20e5f4a613d8e00e358050e94b082c1bb87546b9.
Se contrastaron las73 rutas lib/tests de ese manifiesto antes de probar. Los
SHA de los siete centrales actuales y calcular.ts se preservaron inmediatamente.
Docs, generados y VCS pueden cambiar al publicar; no definen esta preimagen.

Se hizo fusión de tres vías:central actual, preimagen P1 y postimagen P1. Cuatro
conflictos en dos archivos se resolvieron sin descartar ninguna rama:

- composicion-anual.ts:conservar imports usaPrecisionD51/RechazoAragonAnual y
  añadir el productor de ingresos; pasar tanto basesImponiblesE38 como libro P1.
- liquidar-irpf-anual.ts:conservar dependenciaAragon; precisión80 se activa
  para ingreso P1 O derechos O E38/F/C36, preservando la decisión anterior.
- trabajo-anual/conexion.ts:el nodo de bases imponibles E38 recibe baseGeneral
  real (neto más cobros P1); sin P1 sigue recibiendo el neto con signo previo.

Se mantienen la política histórica Open Madrid2018–2024, su cuantización y
límites de admisión; el rechazo F parcial sin cuota ficticia; errores tipados
Aragón; sesiones, límites y conexiones E38/D51/C36/F; cuotas y saldos existentes.
El dispatcher anual-territorial.ts difiere de la raíz sólo en import/campo
interno del libro P1:retirar ambas líneas reconstruye literalmente la preimagen.
La preparación B sigue una vez por sublote; P1 no introduce consumo de cuota.
Resoluciones y delta exacto:recepcion/resoluciones-fusion.json y
recepcion/deltas-siete-centrales.patch.

## Aritmética y conservación

- Composición20|80 conservada; P1 usa80. Decimal local100 y su derivación se
  conservan:18 enteros+80 posiciones requieren98 cifras significativas, más2
  de acarreo para hasta100 sumandos. No hay600 ni política global nueva.
- calcular.ts de la raíz actual permanece a80, sin modificación ni postimagen
  en esta entrega. Su preimagen pequeña/SHA se conserva como recepción.
- Se retienen los argumentos otrasRentas y netoReducido de P1 en DA61. Una prueba
  nueva compara el resultado con35124597/217450 con error<10^-75 y discrimina80
  de60, sin tomar el esperado del motor ni importar constantes del productor.
- Los75 casos P1 originales y su fixture son byteidénticos a la recepción
  validada. Los cuatro módulos nuevos de producto tampoco cambian. Los37
  oráculos B y16 P1 conservan sus hashes y expresiones independientes; no se
  ajustó ningún importe para acomodarlo al agregado.

SHA37B:a3533e782200bc0eea658cd434d46b51339d45dd4c7af1740b9da07de14b9afb.
La recepción P1 original tiene20 rutas y parche
3b2b7f10e7537a02e5def142d398eae6674c75aaed7d3484778a9c564d14e7dc;
se preserva completa y selectivamente en recepcion/p1-original/.

## Validación ejecutada, secuencial

- Vitest:36 archivos,1312 correctos,0 fallos,2 TODO heredados.75 P1 originales,
  un nuevo discriminante ECDF80 y1236 regresiones pertinentes. Incluye
  conexiones/revisiones E38,D51,C36,F,Aragón,histórico; B37/A40/v4; núcleo
  anual, salarios y derechos mínimos. validacion/vitest-01.log y JSON.
- Tipos estrictos/Effect:17 entradas,0 diagnósticos; strict y
  exactOptionalPropertyTypes de raíz. Canario TS3 effect(floatingEffect)
  detectado. tipos-01.log y effect-canario-comando-01.log.
- Oxlint/anti-slop:17 archivos,estado0,hilo1,configuración real y canario
  no-unknown-parameters activo. oxlint-02.log y oxlint-evidencia.json.
- ESLint:17 archivos,0 errores,0 avisos,configuración real y canario
  no-explicit-any activo. eslint-01.log y JSON.
- Python:base y preimágenes, originales/oráculos, conservación de dispatcher y
  calcular80,17 fuentes validadas,imports públicos y reconstrucción portable por
  hunks contra SHA. No lee cuerpos post como entrada para reconstruir.

Timeout interior/exterior -k30s en cada orden pesada; Node3GiB,un worker/hilo,
entorno y caché de usuario. No hubo suites paralelas de este agente ni uso de
PESADO1. Los SHA probados se congelan en validacion/candidato-validado.json.

El único rojo de ejecución del rebase fue de infraestructura:oxlint-01.log
porque faltaba el archivo del canario en la recepción de scripts. Se recibió
ese archivo pequeño y el segundo intento pasó; sin editar producto, tests ni
esperados. Log/preimagen del harness preservados. Los cuatro conflictos de
fusión y el candidato inicial fusionado también se conservan selectivamente
en validacion/rojos/. No hubo fallo monetario nuevo de P1 que corregir.

## Delta externo del padre durante el cierre

Después de completar pesado y liberar PESADO2, el padre corrigió dos tests
raíz, sin cambiar lib ni aritmética ELA:

1. tests/revision-d51/revision-adversa.test.ts:alias @/ a imports relativos.
   Estuvo en la suite de autor con los imports anteriores resueltos por el
   overlay. Se recibió la versión nueva; se recuperó la preimagen exacta por
   SHA cambiando sólo imports y se comprobó igualdad del resto del cuerpo.
   Pre:2ff1150d87294bd0c58c1189258a767aefa3ab8c1cff6eee7172c3db24ed2323.
   Post:01fe40bf91c062d1b7f4f3322c7e245b27eba864d2dcabc20c2c66d74283c379.
2. tests/escalas-madrid-historicas.test.ts:no estaba en estos36 archivos ni en
   el sello73. El padre conserva su fixture monetario y distingue composición
   decimal de API Open por componentes. Se recibe sin editarlo; SHA nuevo
   a9cd909390c6eeae8e35630c23b1d72b28e71faeee6e0f3711aa43f555d3d6b6.

Ambas postimágenes pequeñas y datos en
recepcion/delta-externo-tests/DELTA-FIJADO.json. No forman parte de post/ ni del
parche P1 y no se ejecutaron otra vez tras liberar slot. El padre reportó26
regresiones de flujo correctas; no se presenta como ejecución de este agente.
Las1312 pruebas quedan ligadas a su recepción temporal; la lógica D51 es
idéntica salvo imports. La revisión/CI final del padre cubre los dos tests nuevos.

## Entrega, alcance y pendientes

Parche incremental autónomo sobre las siete preimágenes ACTUALES, con sus SHA;
altas P1 recibidas, un test adicional y documentación actualizada. No revierte
los tests externos ni necesita carpetas P1/ECDF anteriores:preimágenes,
recepciones,env y metadatos únicos están aquí. Sólo usa módulos/tests/paquetes
ya presentes y configuración pública actual de raíz para reproducir. No incluye
node_modules,cachés,venv ni cuerpos CAS. Comandos en validacion/COMANDOS.txt.

Se mantiene el alcance P1:programa personal Asturias ELA2025 cobrado, identidad
propia,censo,resolución,clasificación no transmisión no exenta y perfil sin
reducciones/compensaciones de base no atribuidas. Familias y rechazos ajenos
se conservan. El libro identificado es reutilizable, pero no habilita otras
ayudas,regiones,D/E/C,incendios Galicia ni P2/P3. No certifica autenticidad,
derechos externos o aceptación fiscal. Los2 TODO B heredados siguen visibles.

Pendiente:primera revisión independiente de P1 y contraste final del padre con
los dos tests externos fijados; no se afirma cierre completo del programa.
PESADO2 liberado; no repetir pesado sin nueva asignación.
