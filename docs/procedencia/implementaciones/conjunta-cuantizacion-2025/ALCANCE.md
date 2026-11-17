# Candidato: cuantización conjunta ordinaria 2025

Estado: contraste focal ejecutado. Las diez referencias conjuntas coinciden al
céntimo y la muestra nacional alcanza 68/80, con 71 comparables. Tipos y lints
locales pasan. Esto no acredita otros perfiles ni una fórmula interna única de Open.

La composición valida y concilia primero el contrato
`conjunta-trabajo-ordinario-2025`: unidad matrimonial o monoparental validada, único perceptor laboral, adultos
18–64, primer hijo menor de tres con derecho completo, residentes vivos y
convivientes todo el año, sin discapacidad, ahorro, otras rentas ni deducciones.
El bruto mínimo de 30000 excluye DA61 positiva, pero **no** garantiza BLG≥mínimo.

La política nueva sólo se selecciona después de esa validación cuando:

- existe tabla ordinaria publicada para el territorio documentalmente cubierto;
- BLG es al menos cada mínimo nominal estatal y autonómico;
- los pagos son centesimales (también exigidos por el esquema de entrada);
- para cada componente el gravamen del mínimo es centesimal o los gravámenes de
  base y mínimo tienen igual residuo módulo .01.

Se evalúa cada fila mediante cuota fija publicada más exceso por tipo. Se aplica
HALF_UP al céntimo a los cuatro gravámenes positivos, se restan mínimos por
componente, se suman netas y después se descuentan los pagos efectivos una vez.
No se redondea la suma ni el diferencial para decidir sus operandos. La salida
presentada conserva su formato de dos decimales.

Esta frontera suficiente procede de propiedades monetarias, sin IDs, importes
esperados, residuales de comparación ni correcciones territoriales de redondeo.
Las tablas locales reutilizan Aragón, Galicia y Castilla y León; las restantes
transcriben el manual. El selector normativo compartido individual no cambia.
La política no incluye Madrid. Incluye monoparentales del mismo contrato y frontera monetaria, sin ampliar custodia ni hechos civiles. Ahorro y deducciones ajenos al
contrato mantienen el rechazo existente; no se convierten en nuevos casos admitidos.

Fuera de la frontera monetaria, los contratos antes admitidos conservan el
algoritmo decimal anterior completo, incluidas sus tablas anteriores: también
BLG<min y Balears con residuos distintos. No se habilita allí esta política.

## Reserva probatoria

La reconstrucción independiente de las ocho referencias SES/PDF es compatible
con A=[Q(Gs)−Q(Ms)]+[Q(Ga)−Q(Ma)]−P y con
B=Q(Gs−Ms)+Q(Ga−Ma)−P. La primera rama de la frontera permite trasladar Q por
céntimos; la segunda cancela errores iguales de cuantización. Balears tiene
residuos .005 en base y mínimo, de modo que 2462.63−984.38=1478.25.
No se identifica la etapa interna de Open ni su representación numérica.

Se verifican tres coincidencias matrimoniales recuperadas: Aragón01 −1368.73,
Aragón02-v2 1233.20 y Murcia −1541.89; se conservan CLM −1282.00,
Castilla y León −1315.00, Valencia −1585.25, Galicia −1732.12 y Balears −1262.75.
Además, Castilla y León monoparental pasa de −967.25 a −967.24, conservando
los documentos originales y el resultado esperado. Madrid monoparental
conserva −1823.80 mediante la ruta decimal.

## Composición, salida y rastro

El cambio común es necesario para que las cuotas públicas y las disponibilidades
que alimentan cuotas líquidas, DA61 y pagos consuman los mismos operandos.
Se adelanta el cálculo de mínimos respecto a los gravámenes generales, sin
cambiar el orden relativo de las operaciones Effect. La selección ocurre antes
de gravar; los desgloses retienen el decimal previo a Q y las tablas publicadas.
El resultado conjunto añade política, cuatro gravámenes y dos netas; el rastro
usa esos mismos seis valores y explica la reserva A/B únicamente al aplicar
la política. El resultado sigue con aceptación fiscal pendiente.

Sin contrato conjunto validado la selección devuelve undefined; con territorio sin tabla también. La función común de cuantización y el selector global de
tablas siguen intactos. Las pruebas ejecutadas comprueban un individual con
gravamen estatal 5264.625 sin cuantizar y Madrid monoparental conservando
la suma decimal de sus desgloses. Castilla y León monoparental se contrasta con oráculo racional independiente.

## Fuentes y validación pendiente

- `docs/fuentes/aeat/manual-renta-2025-parte-1.md`: mínimos pp.908–914;
  escala estatal p.942; Aragón p.944; Balears p.945; CLM/CyL pp.947–948;
  Galicia p.949; Murcia p.950; Valencia pp.951–952.
- `tools/procedencia/simuladores/conjunta-referencias/index.json`: ocho referencias
  matrimoniales y dos monoparentales sintéticas, conservando entradas, capturas
  y resultados esperados.
- `docs/procedencia/simuladores/medicion-2025/conjuntas-oficiales/`: paquetes
  completos contrastados por la revisión independiente. Las huellas identifican
  artefactos; no autentican jurídicamente su origen.
- Revisión documental independiente de etapas: informe y reconstrucción exacta
  anclados en el manifiesto privado de esta entrega. No se copian identidades ni PDF.
- Arquitectura: `docs/procedencia/RASTRO-INSTRUMENTADO.md` y
  `docs/adr/0004-refactorizar-dominio-con-servicios-effect.md`.

Pruebas ejecutadas: ocho referencias matrimoniales con casillas intermedias, equivalencia A/B,
pagos, rastro y reservas; BLG<min; Balears fuera de equivalencia; pagos inválidos;
ahorro/deducciones excluidos; individual, Castilla y León monoparental y preservación de Madrid monoparental.
También se rechazan las bases y cotizaciones contradictorias antes de calcular,
los cambios de componentes SES incompatibles con el PDF y los cinco negativos
externos alterados. El fallo de composición se comprueba por su causa tipada.
La CLI effect-solutions no estaba disponible; se consultó la fuente local de
Effect y se conservaron sus patrones existentes.

La revisión independiente condicionó su aprobación al contraste dinámico de las
referencias y adversas, ya ejecutado. La publicación exige además el sanitizador,
el inventario regenerado, los pasos exactos Nix/workflows y el CI remoto.
Los doce puntos del rastro conservan identidades literales verificables. El
catálogo CAS histórico completo no se declara actualizado: su generación se
detuvo al superar el inventario comprimido el límite de objeto de 10 MB.
Se conserva ese límite y el catálogo anterior. Conforme a
`docs/procedencia/CI.md`, el CI verifica contenido y rastro con fixtures y omite
explícitamente el corpus CAS histórico; no acredita este último.

Extensión contrastada tras revisión estática independiente: Castilla y León monoparental tiene gravámenes exactos 4866.875, 4654.625, 1021.25 y 967.50; A=B da −967.24 con pagos 8500. Madrid se conserva fuera: el mínimo autonómico gravado 980.7011 no es centesimal y su residuo difiere de 6716.65168. Su coincidencia puntual A=B no acredita la frontera suficiente para todos los importes. No se identifica una fórmula interna única de Open.
