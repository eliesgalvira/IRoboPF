# Ascendientes, arrendamiento social aragonés y familiar extremeño de 2025

Integración comprobada. Las tres primeras revisiones y los contrastes graves
están terminados con las correcciones comprobadas dentro de su alcance.
Pasan los 31 comandos del CI local, con inventario y generados actualizados.
La publicación y la comprobación remota son posteriores a este registro.

El corte conecta hechos de tres ámbitos con la composición anual existente.
La ruta de ascendientes admite Madrid, Castilla-La Mancha y Comunitat Valenciana
para 2025. La ruta aragonesa combina trabajo o pensión ordinaria con un inmueble
y su petición de deducción social. La solicitud extremeña representa un familiar
con ausencia expresa de rentas o la pensión pública exenta acotada, junto con
su censo patrimonial y familiar. Los límites completos figuran en la
[API del motor](../../API-MOTOR.md).

Cada entrada conserva sus productores de hechos y el consumo común de cuota.
No se añade una fórmula alternativa de liquidación. Este alcance técnico no
habilita la aceptación fiscal general ni amplía los perfiles no representados.

## Defectos encontrados y correcciones

ASC-H1 permitía que el mismo titular constase como residente y no residente
respecto de dos ascendientes. Eso producía cuotas sin un censo anual coherente.
La corrección compara economía, residencia y declaración por titular antes de
repartir los mínimos. Grado, vínculo y convivencia siguen perteneciendo a cada
relación. Se reprodujeron las seis salidas originales y el contraste posterior
pasó 132 comprobaciones propias, incluidos los controles monetarios coherentes.

AR-M1 admitía un seguro de 100 euros con devengo de 2024 y factura y pago de
2025. En el caso revisado reducía indebidamente el diferencial de 8.465,41 a
8.448,63 euros. El productor inmobiliario común ahora rechaza períodos declarados
inválidos, invertidos o que salgan de 2025. La imputación entre ejercicios
requiere una rama específica; la fecha de pago no la sustituye. El campo sigue
siendo opcional conforme al contrato previo. P4b conserva sus condiciones más
estrictas sobre gastos del período exclusivamente arrendado.

AR-M2 admitía que el gestor fuera también el propietario o el arrendatario.
El perfil mixto exige ahora identidades distintas para esos roles. Es una
limitación del perfil implementado, no una prohibición jurídica universal ni
una comprobación de habilitación administrativa.

El contraste independiente de M1/M2 reprodujo 40 rojos sobre las preimágenes y
pasó 71 comprobaciones con la corrección. Pasaron también 80 regresiones P4b.
Los cuatro controles oficiales mantienen 60,13; 59,07; 39,66 y 59,08 euros de
deducción. Esos cuatro casos respaldan el criterio operativo acotado de
atribución y redondeo; no certifican todos los posibles hechos del Plan.

EXT-R1-H-EXIGIBILIDAD admitía un cobro exigible antes del inicio de efectos
de la pensión y aplicaba 150 euros en ambas API. Se añade un control previo:
la exigibilidad pertenece al período declarado, incluidos sus extremos. No
se cambia la fórmula, el reparto ni el contrato patrimonial. Los 14 fallos
de autor se reproducen antes de la corrección y pasan después, junto con
los nueve controles de fechas válidas. Pasan 252 pruebas en siete archivos.
Dos errores de tipos del test compartido se corrigieron después; las 23
focales, los tipos globales y ambos linters finales pasan. Las repeticiones
no se suman como nuevos casos. El contraste grave es favorable acotado: reproduce los dos originales con
150 euros y pasa 30 pruebas propias finales, incluidas las fronteras y los
controles de 150, 75, 50, 220, 110 y 220/3 euros. Los diez rojos PRE se
conservan, junto con los errores corregidos del arnés independiente.

La primera revisión EXT conserva sus 86 observaciones conformes y seis rojas:
dos reproducen la exigibilidad; dos reservan el significado de vivienda omitida;
dos proceden de supuestos distintos de cotizaciones en las entradas del arnés.
No se alteran sus expectativas para presentar un resultado verde. La vivienda
se documenta dentro del censo mundial exhaustivo y la ausencia expresa de otros
inmuebles; la revisión no demostró una vivienda real omitida con esos mismos
hechos. Las entradas canónica y explícita que calculan distintas bases no
acreditan igualdad económica si una estima cotizaciones y la otra consigna cero.

## Evidencia y límites

[REVISIONES.json](REVISIONES.json) conserva las huellas de los dictámenes y
separa pruebas de autor, revisión inicial, contrastes y ejecución pendiente.
Las 2.012 pruebas de autor del corte base son cobertura de varias ejecuciones
conciliadas, no una única ejecución. Las regresiones repetidas no se suman como
casos fiscales nuevos.

Las entradas mínimas originales y sus controles están en
[ascendientes](../../../../tests/ascendientes-conciliacion-titular.test.ts),
[devengo e identidades](../../../../tests/aragon-m1-m2.test.ts) y
[cuatro observaciones aragonesas](../../../../tests/aragon-social-mixto.test.ts).
Los productores de hechos extremeños tienen sus
[pruebas de autor](../../../../tests/ext-familiar-pension-exenta-2025.test.ts);
su primera revisión y el contraste de exigibilidad están terminados, con
las reservas indicadas arriba.

Siguen abiertas ASC-H2, componentes económicos distintos que producen el mismo
neto, y ASC-H3, situación regional de devengo contradictoria. La primera revisión
no aisló daño monetario adicional en ellas; se conservan como defectos de
validación y no se presentan como corregidas. AR-O1 sólo distingue el diagnóstico
de un perfil inválido que ambas API rechazan. No se incorporan esas reservas a
los positivos de la revisión.

La campaña histórica permanece separada: una captura oficial no cuenta como
comparación de un caso con el motor. Este corte no aumenta por sí solo su
cobertura comparada.

## Integración con la procedencia histórica

El primer CI local rechazó las huellas anteriores de composición y conexión.
Se conciliaron las quince fuentes modificadas y ocho altas contra las imágenes
revisadas, conservando los fallos. Después, R52 intentó interpretar el nuevo
productor mixto aragonés con una gramática finita que no cubre sus operaciones
BigInt. Se declara esa importación concreta como frontera de contrato pendiente,
igual que los demás productores nuevos. El intérprete documental debe rechazar
su ejecución y mantener `completeRuleAcceptance` y `wiringAllowed` en falso.
No se amplía la gramática ni se atribuye al producto la acreditación histórica.
La prueba nueva ejercita la llamada real del despachador; el control inicial
sobre un esquema no alcanzado por esa entrada se conserva como error de prueba.

## CI local completo

Los 31 pasos exactos del workflow pasan con PATH limpio y runtimes fijados.
[CI.json](CI.json) conserva las huellas de resultados, log y supervisor, los
resúmenes separados de cada ejecución y los límites de la reproducción.
Los dos fallos locales previos permanecen documentados. El segundo era una
expectativa de diagnóstico anterior al censo valenciano: el rechazo sigue
siendo obligatorio y la prueba exige su causa exacta. No cambió ningún importe.
