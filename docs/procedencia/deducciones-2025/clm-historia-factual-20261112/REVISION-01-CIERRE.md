# Cierre de la primera revisión independiente: vivienda rural CLM

Fecha: 12 de noviembre de 2026. Dictamen **favorable acotado** para la ruta
`clm_adquisicion_rehabilitacion_vivienda_zonas_rurales`, con las reservas siguientes.
Las objeciones R1–R4 de esta misma primera revisión quedan cerradas para el perfil
probado. No queda un bloqueo propio de la revisión monetaria dentro de ese alcance.
Este cierre documental incorpora evidencia del integrador; no constituye una nueva
revisión ni una nueva ejecución del revisor.

## Perfil factual cubierto

Una persona en tributación individual, adquisición jurídica de pleno dominio del
100 % de una vivienda en 2024, primera aplicación positiva en 2024 y consumidor
2025. Compra con entrada y precio aplazado al vendedor sin intereses, obligación
nominal y pagos hasta el vencimiento en 2025. Municipio, población y categoría rural
admisibles declarados con soportes por ejercicio. Residencia propia sin frutos ni
rentas, ocupación inmediata y continuidad declarada hasta el cierre de 2025.

La historia positiva se reconstruye a partir de salarios nominales, certificados,
cobros, cuentas, movimientos, inventario, precio, valoración y deuda del vendedor.
Se comprueban continuidad entre ejercicios, titularidad, identidades y fechas,
conciliación de pagos y saldos, y no duplicación de certificados o movimientos.
La valoración se excluye internamente del incremento patrimonial. Los agregados
fiscales patrimoniales externos y una mera declaración de suficiencia se rechazan.

El perfil exige crecimiento patrimonial suficiente para la inversión pagada y cuota
histórica suficiente para la deducción exacta generada. Aplica los límites de base
anual de 12.000 euros y total del menor de 180.000 euros o coste, sin ayudas en este
perfil. No habilita arrastre, otras viviendas deducidas, transmisiones, reinversión,
hipotecas, otros activos/deudas o ingresos no representados, ni casos especiales.

Base, generación y cuota monetaria mantienen conceptos separados: una base histórica
de 10.000,01 euros genera 1.500,0015 euros, con importe monetario de 1.500,00 euros.
La base no se reconstruye invirtiendo ese importe redondeado. En el caso de referencia,
los pagos 2025 de 4.999,99 euros generan exactamente `1499997/2000` euros. La cuota
actual se consume una sola vez mediante el compositor anual existente.

## Resolución de las objeciones

- **R1, patrimonio:** los agregados fiscales de entrada se sustituyen por hechos
  nominales y un productor que deriva cortes, deudas, ajustes e incremento comparable.
  El pago no se usa como prueba automática de crecimiento.
- **R2, edad:** nacimiento civil e identidad del titular se concilian con ambos
  devengos; la edad histórica ya no se selecciona libremente.
- **R3, certificados:** se rechaza el mismo soporte bajo identificadores diferentes,
  y el salario histórico se concilia con su trayectoria bancaria.
- **R4, integración:** la rama de Extremadura conserva su productor anterior sin
  consultar el campo específico de esta ruta CLM.

La copia local de estado `no-solicitada` sólo permite reutilizar las validaciones
económicas comunes. No acredita una aplicación positiva ni aporta un cero histórico:
la liquidación positiva se reconstruye por su productor y el estado original no se
modifica. Esta garantía conserva el límite documentado en la recepción inicial.

## Límite de la entrada canónica

La API canónica aporta bruto salarial y retenciones; **no aporta cotización efectiva**
ni identificadores nominales de empleo. La ausencia se transporta como dato ausente,
sin convertirla en cero ni certificar la estimación interna del motor.

El libro patrimonial acredita la cotización mediante certificado y extracto nominal,
con neto bancario conciliado. Bruto y retenciones deben coincidir con la anual
canónica. La API explícita además concilia cotizaciones efectivas por rendimiento.
El positivo probado con cotización nominal de 1.000 euros no obliga a que la estimación
canónica sea ese importe. Se conserva la política salarial propia de cada API; no se
atribuye igualdad universal a sus cuotas finales.

## Evidencia incorporada

La ejecución aportada por el integrador pasó **778 de 778 pruebas en 14 archivos**,
incluidas las **61 pruebas propias** de esta revisión: 39 de fronteras y 22 de
recepción. El reporte registra cero fallos y pendientes, y la supervisión termina
con código cero y sin procesos supervivientes. Las pruebas ejercitan ambas API,
rechazo de agregados, identidad/edad, certificados, cuentas y deuda, crecimiento
exacto y un céntimo inferior, exclusión de valoración, coherencia salarial y
vencimientos, y base exacta frente a cuota cuantizada.

Se verificaron por lectura y SHA-256 los 39 archivos de la imagen preservada. El delta
mecánico de seis archivos se reconstruyó textualmente contra sus pre/postimágenes y
coincide con esa imagen. Sus cambios son comprobaciones explícitas de `undefined`,
envolturas `Effect.gen` de uniones de API y estrechamiento de fixtures de trabajo2025;
no cambian hechos, fórmulas ni las líneas de expectativas. Los originales de recepción
y adición permanecen preservados por valor.

El padre comunicó asimismo el éxito del oráculo Fraction propio; sus bytes coinciden
con los entregados y con la imagen preservada. Esa comunicación se atribuye al padre:
el cierre no introduce otra ejecución ni presenta un registro independiente de
Fraction como parte del reporte Vitest. Los identificadores y hashes documentales
constan en [EVIDENCIA-REVISION-01.json](EVIDENCIA-REVISION-01.json).

La imagen conjunta incluye una diferencia adicional de integración de Murcia en
`anual-territorial.ts`, condicionada a su historia específica. Se identifica como
contexto de integración; este dictamen no amplía su alcance a una auditoría de Murcia,
Galicia, otras D51 o todo el compositor.

## Fuentes y rectificación temporal

Se retira expresamente la atribución histórica que el primer informe dio a los
selectores solicitados `p=20241231` y `p=20251231`: devolvieron versiones de 2026 y no
acreditan los cortes pretendidos. El informe inicial se conserva como recepción;
esta rectificación forma parte de su cierre.

Para CLM se comprobó la selección efectiva de [31/01/2023 de la Ley 8/2013](https://www.boe.es/buscar/act.php?id=BOE-A-2014-1368&tn=1&p=20230131),
cuya siguiente versión es de 30/03/2026. Su artículo 12 ter cubre el origen 2024 y la
aplicación 2025: adquisición jurídica, porcentaje, bases y requisito patrimonial.
No se aplica el régimen de traslado del artículo 12 quater. Se mantienen separados
los manuales AEAT de cada ejercicio como explicación anual.

La liquidación salarial histórica utiliza los artículos 19, 20, 57 y 74 de la
[LIRPF seleccionada efectivamente a 24/12/2024](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&tn=1&p=20241224).
Para compra, entrega, precio aplazado e intereses se conserva la referencia a los
artículos 1450, 1462, 1500 y 1501 del [Código Civil seleccionado a 01/03/2023](https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763&tn=1&p=20230301).

La adición preserva fuentes primarias CAS con URL, fecha de descarga, cabeceras,
selector real y SHA-256. Los textos relevantes de CLM y LIRPF de las descargas del
revisor coinciden con los originales acreditados del padre, sin confundir igualdad
del texto normativo con identidad de bytes de HTML descargado en distintos momentos.

## Reservas de cierre

Los tipos globales seguían en marcha al recibirse esta evidencia: **no se atribuye
verde de tipos, CI completo, inventario, generados ni validación remota**. La aprobación
de publicación corresponde al integrador tras sus comprobaciones obligatorias.

Los documentos son hechos declarados con coherencia comprobada; no se autentican
referencias ni se acredita automáticamente la ausencia de patrimonio oculto o la
clasificación municipal oficial. La permanencia de tres años y la aceptación fiscal
siguen pendientes. El dictamen cubre el perfil y las pruebas identificados, sin
certificación fiscal universal ni reapertura de las ramas excluidas.
