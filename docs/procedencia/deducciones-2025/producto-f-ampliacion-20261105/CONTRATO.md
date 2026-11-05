# Ampliación F por hechos, 2025

Candidato combinado de Madrid/Murcia, con conexión anual preparada sobre la publicación b9122c2b.
Los cinco deltas centrales se explican en [conexión anual](CONEXION-ANUAL.md);
los evaluadores publicados se reutilizan. La [matriz](matriz-51.json) distingue 36
ramas nuevas con cálculo numérico, cinco fórmulas condicionadas y diez contratos
reutilizados. **No acredita cobertura íntegra de todas las ramas de 51 códigos.**

`evaluarAmpliacionF2025` recibe `tipo: "territorial_f_ampliacion_2025"`, `codigo`,
`contexto` y `hechos`. El esquema exportado permite campos opcionales para emitir
el siguiente campo que falta por rama. No son permisos para omitir un requisito:
los evaluadores exigen los hechos que consumen. Las entradas se decodifican antes
de evaluar, sin diccionarios abiertos, conversiones de tipos ni booleano `cumple`.

Los diez códigos existentes reciben sus hechos originales dentro de
`hechosPrevios` y llaman al módulo corregido de raíz. Conservan sus reservas y
su elegibilidad externa previa. No importan entregas privadas, no repiten fórmulas
y no amplían conjunta. Adopción/nacimiento conservan el rechazo F-R01 del hijo
incluido entre sus propios progenitores. Las personas de las ramas nuevas tienen
el mismo rechazo explícito de identidad.

Las ramas nuevas evalúan individual ordinaria. Un resultado monetario conserva
`estado: "calculo_parcial"`, `aceptacionFiscal: "pendiente"`, euros compatibles con
el contrato existente, céntimos enteros como texto, importe decimal anterior a
presentación, citas, rastro y reservas. Se usa un constructor Decimal local de
80 cifras; no se modifica la precisión global. Sólo se presenta a dos decimales
al terminar la deducción, como en el contrato integrado. Esta función autónoma no aplica cuota. La conexión anual consume el racional
anterior a presentación y conserva divisores no finitos.

`formulaEnRama: "completa_en_subcontrato"` en la matriz significa que la fórmula
numérica existe para los hechos delimitados, no que estén cerradas las demás
ramas, la autenticidad documental, el derecho fiscal o la composición anual.
La columna de condiciones pendientes describe cada límite de implementación.

## Hechos y unidades

- Importes monetarios: textos EUR sin separadores de miles, con hasta dos
  decimales. Bases/rentas admiten signo; pagos, ayudas y precios son no negativos.
  No se recibe ningún importe de deducción calculado por terceros.
- Porcentajes y superficies: textos decimales con unidad indicada por su campo.
  Días, meses, orden, población y número de empleados: enteros acotados.
- Fechas: ISO civil existente. Convivencia y trabajo se declaran como intervalos
  disjuntos dentro de 2025. Se calculan días incluyendo ambos extremos.
- `bases` identifica general y ahorro por persona; las comprobaciones familiares
  exigen correspondencia exhaustiva con `miembrosUnidad`. El límite de dos o más
  descendientes usa además las bases de todos los titulares del mínimo y de los
  propios descendientes. No basta la renta de la referencia elegida.
- Cada persona, pago, inversión, contrato y vivienda tiene identidad estable.
  `titularesMinimo` y `titularesDeduccion` son colecciones exhaustivas declaradas.
  La autenticidad de esos datos y documentos no se certifica automáticamente.
- Cada pago identifica fecha, pagador, beneficiario y objeto, concepto y
  soporte de pago. Factura y medio bancario se exigen en las ramas que los prevén. Ayudas se asignan al mismo gasto. La base estatal de un
  donativo es una asignación de la operación que debe conciliarse con la anual;
  no es el importe de la deducción estatal ni una acreditación de ésta.
- Los certificados se aportan como referencias. Se comprueba la presencia de
  referencias concretas y los hechos tipados del supuesto; no se trata un
  certificado genérico como prueba universal de todos los requisitos.
- Los pagos de gasto común identifican `atribucion: "gasto_comun"`; alquiler
  murciano con varios titulares identifica además `regimenReparto`. Se concilia
  la colección de pagos de los titulares antes de aplicar el máximo y el reparto.
  En las otras ramas el pagador sigue siendo la referencia propia.
- Los porcentajes propios no pueden superar el agregado familiar que los incluye
  ni100 %. Una persona no puede figurar como titular de su propio mínimo ni en
  listas incompatibles de titulares/prioridad. Se rechazan fechas de inversión u
  ocupación futuras declaradas como consumadas y convivencia anterior al nacimiento.

## Cuota y fórmulas condicionadas

Un rechazo con `dependenciaAnual` conserva `magnitud`, `factor`, `topeEUR` cuando
proceda y `operacion`. Si existe una base calculable, conserva `baseCalculadaEUR`.
No contiene importe deducido ni cero de sustitución:

- Familia numerosa Madrid: 50/100 % de cuota íntegra autonómica, máximo individual
  6.186/12.372; la cuota debe producirla la anual una sola vez.
- Dos o más descendientes Madrid: 10 % de cuota autonómica después del resto de
  autonómicas y de la parte estatal que corresponda sobre ella.
- Financiación variable Madrid: 25 % del exceso de intereses reales sobre los
  calculados con las mismas condiciones y Euríbor diciembre de 2022, máximo300.
  Se conserva la fórmula; falta trayectoria contractual para ese contrafactual.
- Vivienda joven Murcia: 5 %, máximo300, base estatal de vivienda pendiente de
  conciliación y reserva F-N02 de comparación patrimonial final/final.
- Transitorio Murcia: fórmulas diferenciadas por acceso histórico, base estatal,
  viviendas anteriores/reinversión y límites de Ley9/1999. La rama Uno vigente
  conserva F-N02. Gasto de 2025 no prueba por sí solo derecho histórico.

Vehículos sólo mantiene F-N01 en base imponible individual exactamente35.000,
independiente del precio. Las demás fronteras se calculan. Las reservas no se
extienden a otras deducciones.

Los importes de renovables, vehículos e inversiones extranjeras se calculan antes
de cuota y conservan orden/arrastre obligatorio. La existencia de esos saldos
requiere un libro canónico de aplicaciones históricas; no se acepta una cifra
externa sin operaciones que la originen.

## Criterios AEAT nuevos: recarga y agua

Los [criterios y localizadores](fuentes-criterios-aeat-2025.json) identifican los
HTML oficiales fijados por hash, con receta de normalización reproducible y
verificador sin red. Se conserva el tenor legal original; no se afirma que una
página administrativa lo haya enmendado.

Recarga aplica el100 % de la base, máximo4.000 por infraestructura y contribuyente.
La rama sin ayudas exige finca propia e instalación de titularidad identificada,
vehículo particular (su propiedad no es requisito adicional), una infraestructura,
finalización/factura2025 y trayectoria efectiva hasta devengo. Las fechas futuras
no acreditan mantenimiento ya sucedido. Se exige referencia de seguimiento2 años.
Los costes se identifican por operación y concepto Programa2; contadores
inteligentes quedan fuera. Producción/almacenamiento local exige exclusividad y
capacidad que no supere la infraestructura conectada.

`regimenPago: "propio"` exige un titular y sus pagos. Gananciales y pagos separados
requieren títulos completos, referencia del régimen, alcance exhaustivo de costes
y aportaciones conciliadas con cada operación. Gananciales atribuye la mitad;
otros regímenes atribuyen pagos efectivos. Se limita la base atribuida por
infraestructura/contribuyente, sin repartir automáticamente un gasto propio.

Las ayudas positivas se rechazan acotadamente: la página conserva minoración
general y excepción para costes Programa2, frente al tenor legal neto de ayudas.
No se inventa una conciliación ni se usa el porcentaje de subvención MOVES.

`aplicacionAnualRecarga` describe origen2025, límite, unicidad de infraestructura,
orden después de deducciones no arrastrables y vehículos, antes de renovables,
arrastre de tres periodos hasta2028 y seguimiento de titularidad/funcionamiento
hasta el segundo aniversario de puesta en marcha, con excepción de fallecimiento.
Este contrato no aplica cuota, no genera un saldo consumido ni sustituye la anual.

Agua aplica el criterio operativo AEAT del20 % con base300 y máximo60 a pagos
propios de dispositivos identificados en reconocimiento regional previo. La rama
habilitada exige resolución identificada por titular/vivienda, fecha y órgano,
y residencia continuada consolidada tres años o cambio forzoso documentado de los
supuestos descritos por AEAT. Se concilian pagos con el periodo de residencia.
La residencia reciente sin esos tres años ni excepción requiere otra subrama;
lo mismo ocurre con reconocimiento posterior al corte, ayudas y fallecimiento.
No se traslada a agua un requisito de propiedad de la finca que su fuente no fija.

F-N03 continúa como reserva **literal** de Cuatro.3=>Uno.5; la aplicación operativa
se identifica expresamente como criterio AEAT, con aceptación fiscal pendiente.
F-N02 de vivienda joven permanece sin resolver: su manual no corrige final/final.

## Composición y pruebas

`evaluarSolicitudesAmpliacionF2025` devuelve resultados por código, sin total.
Rechaza códigos y operaciones repetidos. No elige automáticamente entre
incompatibles ni acumula deducciones de una misma base en solicitudes separadas.
La nueva conexión usa el libro anual común; la función autónoma no mezcla
códigos con consignaciones ni cuota. Reetiquetar una operación duplicada vulnera la exhaustividad
declarada y no puede detectarse sólo por su nuevo identificador.

La matriz enumera las subramas pendientes: conjunta nueva, excepciones de
habitualidad/mínimos, historiales, mezcla de topes, cronologías de reemplazos o
reinversión y otros hechos concretos. No se utiliza una exigencia semántica global
como bloqueo de todo el lote.

Los34 oráculos monetarios originales conservan sus valores y orden. Los19
casos del integrador se mantienen byte a byte. El antecedente95/95 no se atribuye
al cambio nuevo. La validación de autor actual pasó182 casos focales y572 de
regresión,con dos TODO preexistentes;tipos strict/Effect,Oxlint/antislop y ESLint
sin diagnósticos. Se comprobaron cinco canarios deliberados y se conservaron los
rojos previos a las correcciones propias de tipos/lint. La prueba nueva incluye
orden,cuota única agotada,arrastre y seguimiento de recarga por ambas API.
La revisión monetaria independiente del combinado y la conexión sigue pendiente.
