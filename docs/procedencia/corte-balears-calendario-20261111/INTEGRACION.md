# Anticipos y alquiler baleares, calendario familiar e incentivos murcianos

Preparación del 6 de noviembre, retomada el 11 de noviembre de 2026 sobre
`646daac4f94d8de4af88da66c0e72d14efdee772`. La fusión está aplicada en el checkout, con 30 postimágenes verificadas.
Las cuatro primeras revisiones son favorables dentro de sus alcances. El corte
se publicó en `56ffd1ad` tras superar los 31 comandos locales; ambos trabajos del
[CI remoto](https://github.com/eliesgalvira/IRoboPF/actions/runs/43088216838) pasan.

## Comportamiento representado

El nacimiento balear admite un anticipo nominal del mismo beneficiario y niño,
conciliado con resolución, pago y justificante. En el perfil de cuota suficiente,
el libro reserva el derecho bruto una sola vez y resta el anticipo de la
minoración. La parte anticipada no vuelve a quedar disponible para otra deducción.
La concurrencia inicial se limita a una donación cultural pública de la CAIB.
Con cuota de 1.200 euros, derecho de 800 y anticipo de 800, quedan 400 euros
disponibles para la otra deducción. Se mantienen rechazados la insuficiencia,
los excesos y las regularizaciones no representadas; no equivalen a cero.
La [cumplimentación de AEAT 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/10-cumplimentacion-irpf-deducciones-autonomicas/10_4-illes-balears/10_4_1-nacimiento.html)
documenta la prioridad que utiliza esta composición.

El alquiler balear deriva el derecho material a inversión DT18 de los hechos de
adquisición, pagos, préstamo, patrimonio e historia fiscal. Elegir no aplicarlo,
o carecer de cuota, no demuestra ausencia de derecho. El nuevo contrato sólo
determina la incompatibilidad: no concede la deducción estatal al elegir
`aplicar`. El perfil inmobiliario representa el cambio de vivienda habitual
propia a arrendada a un tercero, sin simultanear dos viviendas habituales.
Las rentas pasan por el productor inmobiliario y el libro común existentes.
El uso gratuito extinguido antes de 2025 constituye otra rama acotada.

En las bases familiares de Madrid y Comunitat Valenciana se admite un calendario
completo de empleo de otra persona, con ingresos y cotizaciones por tramo y
efectos certificados de discapacidad. El incremento de 3.500 o 7.750 euros no
se prorratea por días; se limita con los rendimientos asociados. Trabajo activo
con discapacidad y situación al devengo para mínimos se concilian por separado.
Sin calendario suficiente permanece el rechazo H2. Mezclas de rentas, atrasos,
gastos sin atribución y cambios de categoría siguen fuera de este perfil.
La referencia de [LIRPF, selección histórica de 24/12/2025](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20251224&tn=1)
sustituye el enlace temporal impreciso, sin cambiar los artículos 19 y 20 cotejados.

Recarga y vehículos eléctricos de Murcia no exigen antecedentes de 2022–2024,
anteriores a su vigencia inicial de 2025. El formato anterior vacío se conserva;
las operaciones positivas anteriores se rechazan. Se mantiene el consumo único
de cuota y el saldo generado en 2025. Energías renovables conserva su contrato
histórico. La vigencia se apoya en el artículo 55, apartados siete y ocho, de la
[Ley 3/2025 de Murcia](https://www.boe.es/eli/es-mc/l/2025/07/23/3).

## Revisión e integración

Calendario familiar: dictamen favorable acotado, 30 pruebas propias y 59
corroboradas. Incentivos murcianos: dictamen favorable acotado, 32 pruebas,
incluidas ambas API. Anticipos: dictamen favorable acotado, 745 pruebas en nueve suites, incluidas
300 comparaciones racionales propias. El cierre documental del 11 de noviembre
reutilizó los resultados ejecutados antes de la interrupción por cuota, sin
repetirlos. Alquiler: autor completo, 115 pruebas propias y 1.027 regresiones;
primera revisión independiente favorable acotada: 110 casos propios, 21 oráculos racionales y 267 regresiones. No se suman repeticiones como cobertura nueva.

Los dos archivos compartidos por anticipos y alquiler contienen cambios en
secciones distintas: nacimiento y vivienda. La fusión conserva ambas ramas;
sus regresiones pasan juntas. El workflow incluye las nuevas suites y sus 31
comandos se reprodujeron en entorno limpio, con inventario regenerado, antes
de publicar.

Las referencias documentales de las entradas son hechos declarados: el motor
no autentica sus certificados. Las restricciones descritas delimitan cobertura
técnica y no constituyen prohibiciones tributarias universales. Este corte no
cierra todas las ramas pendientes de deducciones autonómicas de 2025.

La revisión del alquiler distingue el transporte decimal de 80 cifras de una fracción periódica exacta: observó una diferencia de 5,62 × 10⁻⁷⁸ euros, con el mismo céntimo. Conserva los rojos originales y los oráculos racionales; no atribuye esa diferencia a una discrepancia fiscal de céntimos.

La primera ejecución del CI local detectó hashes de fuentes anteriores a este corte. Se actualizan sólo las 19 fuentes productivas recibidas y revisadas. El intérprete documental identifica el calendario nuevo como frontera pendiente y lo rechaza sin contrato externo; no hereda acreditación del motor anterior. El fallo y su prueba de regresión se conservan antes de repetir el workflow completo.

La integración supera los 31 comandos locales exactos, incluidos inventario y
generados. La comprobación remota posterior confirma ambos trabajos correctos.
