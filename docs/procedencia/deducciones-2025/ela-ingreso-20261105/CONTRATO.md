# P1: ingreso identificado Asturias ELA 2025

Primera implementación; estado final de ejecución y revisión en INFORME.md.
Base de este rebase: raíz pública actual con agregado125 E38/D51/C36/F/Aragón/
histórico, parche92c6c7b56af4fcda2e752dcb20e5f4a613d8e00e358050e94b082c1bb87546b9.
El commit de referencia b912 no describe por sí solo estos contenidos; mandan
los SHA de preimagen del manifiesto. Se conserva la recepción P1 de20 rutas.
No se repiten auditorías de B ni de los otros lotes.

## Hechos públicos y alcance

`ingresosIdentificados2025` es un censo cerrado de ayudas públicas no derivadas
de transmisión, completo para el contribuyente. Primera rama:
`programa=asturias-ela-2025`, administración Principado, beneficiario propio,
resolución de la Consejería de Salud desde la convocatoria del 27 de junio y
cobros positivos de 2025 posteriores a la resolución. Incluye ayudaId,
referencia/fecha/importe concedido, cobroId/fecha/importe/beneficiario/ordenante y
justificante. Las fechas civiles, identidades y duplicados se comprueban.
El censo es una declaración específica de operaciones, no una acreditación
semántica global de derecho.

La clasificación admitida es ganancia patrimonial no derivada de transmisión,
no exenta, del programa personal señalado. No se infiere de una renta agregada,
de un importe concedido ni de una resolución sin cobro. No se admite base,
compensación, cuota ni tipo calculado por el cliente, en ningún nivel del censo.
Los pagos se expresan en euros con hasta dos decimales; no son magnitudes
internas de 80 decimales.

La API canónica añade un campo opcional a `CasoFiscalAnual`. Admite trabajo no
negativo, estas ayudas y transmisiones positivas sujetas del ahorro opcionales.
No admite aquí alquiler simplificado, pérdidas, reducciones/compensaciones de
base o exenciones de transmisión: la atribución completa no estaría garantizada.
Las magnitudes agregadas externas y campos nuevos ajenos se rechazan sólo en
esta rama nueva, sin cambiar la admisión de perfiles heredados.

La API efectiva añade el perfil `trabajo-y-ayudas-ela`, con
`otrasRentas=solo-ingresos-identificados`, censo obligatorio y los mismos hechos
laborales conciliados. Admite empleo o pensión según la separación previa del
adaptador de trabajo; una pensión de importe cero permite la rama sin trabajo.
Conserva los contratos de familia y los rechazos anteriores del contribuyente
con discapacidad activa o no representada, residencia, modalidad y ejercicio.
Actividad económica y ahorro efectivo siguen fuera: el primero necesita
resolver su interacción con artículo32; el segundo necesita hechos propios de
transmisiones en esa API. No se habilita una etiqueta genérica «otras rentas».

## Integración, precisión y salida reutilizable

1. `prepararIngresosIdentificados2025` suma exclusivamente cobros únicos,
   conciliados con la resolución y el beneficiario; no consume cuota.
2. Ambas API incorporan esa suma a otras rentas no exentas **antes** de aplicar
   artículo20. El neto laboral conserva su identidad y no incluye la ayuda.
3. La suma de cobros se incorpora a BIG y a la base liquidable del perfil sin
   reducciones ni compensaciones. Composición comprueba BIG=BLG y que la base
   no sea inferior a esos cobros. Un saldo laboral negativo o una reducción
   no atribuida no se sustituye por un prorrateo.
4. Las escalas y mínimos existentes recalculan las cuotas de esa liquidación.
   Se llama una sola vez a `producirNodosFiscalesB2025`, conservando su fórmula
   de tipos generales posteriores al mínimo y su truncamiento fiscal a dos
   decimales. Ahorro y cuota disponible no intervienen en ese cociente.
5. `libroIngresosIdentificados2025` devuelve por ayuda el cobrado racional,
   importes realmente integrados en BIG/BLG, expediente, cobros, clasificación,
   criterio y nodo de origen de la misma liquidación. Ambas API lo exponen
   junto a los tipos calculados. D/E/C pueden reutilizar este contrato interno;
   sus adaptadores y sus reglas distintas no quedan habilitados.
6. Asturias ELA concilia el conjunto completo de ayudas seleccionadas, identidad,
   resolución y concesión con el libro, recibe sus integraciones internas y
   reutiliza `resolverDependenciaAnualB`. El libro racional territorial ya
   existente limita y aplica la generación una sola vez. El productor de
   ingresos y el adaptador ELA no consumen cuota.

La API efectiva pasa a la fórmula DA61 existente las otras rentas reales y el
neto reducido laboral, separados de BIG. En los perfiles antiguos conserva
literalmente los argumentos previos. No se introduce una fórmula DA61 nueva.
La API canónica conserva su alcance anterior de DA61.

Se usa Decimal local de precisión100 para sumas y transporte de la rama nueva; composición conserva80 y racionales enteros
para el transporte; no se cambia Decimal global. El productor de tipos B
retiene base y cuotas hasta el decimal80 sin convertirlas a presentación.
El único truncamiento es el porcentaje fiscal exigido por artículos63.2/74.2.
La base actual ya contiene el evaluador DA61 a80 del agregado; su archivo se conserva sin editar y un test discrimina80 de60. La presentación canónica sigue
en céntimos; la generación ELA y el libro identificado se devuelven exactos.

## Límites concretos

- Cobros de otros ejercicios, ayudas de programas anteriores, otras
  administraciones, fenotipos no ELA, ayudas exentas/de trabajo/de actividad,
  transmisión, cobros anteriores a resolución y expediente pendiente de
  conciliación quedan rechazados con motivo; no producen una base cero.
- No se atribuyen reducciones de base, pérdidas ni compensaciones presentes o
  históricas. No hay diferencia contrafactual de cuota ni prorrata inventada.
- El censo, resolución, diagnóstico y justificantes son hechos declarados.
  La referencia a una fuente o expediente no certifica autenticidad ni derecho.
  Las reservas viajan al resultado regional y al libro de ingresos.
- No habilita otras reglas regionales de ELA ni incendios de Galicia. P2
  (donativos estatales) y P3 (maternidad/guardería) no se implementan.
- La comprobación documental del máximo y grado de dependencia propio de la
  convocatoria no se presenta como certificada: el productor concilia cobro
  y resolución, no sustituye al órgano concedente.

## Oráculos y fuentes

`oraculos-p1.json` conserva expectativas normativas independientes de las
constantes del código. Para 20000 de ingreso, las cuotas generales tras mínimos
son 1561.5 y1522.902; los tipos7.80/7.61 producen3082, limitados a1522.902 de
cuota autonómica sin ahorro. Para trabajo33000 y cobro4000, BLG35000, tipos
10.87/10.64 y generación860.4. Son supuestos derivados, no casos fiscales
certificados. El oráculo B aislado4000*(10+8)/100=720 se conserva por SHA; no se
usan esas tasas10/8 como esperado de una liquidación anual.

Fuentes exactas y sellos sin cuerpos en `fuentes-primarias.json`:

- [AEAT, imputación por cobro de ayudas públicas2025](https://www3.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c11-ganancias-perdidas-patrimoniales/imputacion-temporal-ganancias-perdidas-patrimoniales/imputacion-ganancias-perdidas-patrimoniales-ano.html), artículo14.2.c.
- [AEAT, clasificación de subvenciones](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c11-ganancias-perdidas-patrimoniales/declaracion-tributacion-ganancias-perdidas-patrimoniales/especial-referencia-subvenciones-ayudas-publicas.html).
- [AEAT, gravamen estatal y tipo medio](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-estatal.html) y [autonómico](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico.html), artículos63.2/74.2.
- [DL2/2014 Asturias, artículos2,2bis y14quaterdecies](https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&p=20251231&tn=1#a1-18). El artículo ELA tiene redacción publicada29/12/2023; se usa el devengo ordinario2025 de escalas/mínimos publicado, ya presente en raíz.
- [AEAT, deducción Asturias ELA2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/10-cumplimentacion-irpf-deducciones-autonomicas/10_3-principado-asturias/10_3_21-obtencion-ayudas-subvenciones-otorgadas-enfermos.html).
- [AEAT, caso de artículo20 en2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c03-rendimientos-trabajo/caso-practico.html), frontera de otras rentas6500 y reducción7302.
- [Principado, convocatoria ELA27/06/2025](https://actualidad.asturias.es/-/salud-convoca-las-ayudas-para-pacientes-con-ela-dotadas-con-2-1-millones). La revisión independiente identificó el enlace BOPA2025-05442, cuyo cuerpo tampoco fue accesible. Se corrige la referencia anterior sin afirmar lectura ni acreditación de las bases administrativas; véanse REVISION.md y FUENTES-REVISION.json.
