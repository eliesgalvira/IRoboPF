import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CANTABRIA_ARRENDAMIENTO_JOVENES_MAYORES_DISCAPACIDAD_2025 =
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_arrendamiento_jovenes_mayores_discapacidad",
    "Por arrendamiento de vivienda habitual por jóvenes, mayores y personas con discapacidad",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "10",
      base: "cantidades satisfechas por arrendamiento de vivienda habitual",
      limiteMaximoEuros: "300",
    },
    [
      "10% de cantidades satisfechas",
      "Límite 300 euros en tributación individual",
      "Límite 600 euros en tributación conjunta",
    ],
    [208, 209],
    ["importeBase", "cumpleRequisitosYLimites"],
    [
      "1. Por arrendamiento de vivienda habitual.",
      "El contribuyente podrá deducir el 10 por ciento, hasta un límite de 300 euros anuales de las cantidades satisfechas en el periodo impositivo por el arrendamiento de su vivienda habitual si reúne los siguientes requisitos:",
      "a) Tener menos de 36 años cumplidos, o tener 65 o más años. El contribuyente con discapacidad física, psíquica o sensorial que tenga la consideración legal de persona con discapacidad con un grado de disminución igual o superior al 65 por ciento de acuerdo con el baremo a que se refiere el artículo 367 del texto refundido de la Ley General de la Seguridad Social, aprobado por Real Decreto Legislativo 8/2015, de 30 de octubre, está exonerado de cumplir este requisito para tener derecho a gozar de esa deducción.",
      "b) Que las cantidades satisfechas en concepto de alquiler excedan del 10 por ciento de la renta del contribuyente.",
      "En el caso de tributación conjunta, el importe máximo de la deducción será de 600 euros, pero al menos uno de los declarantes deberá reunir los requisitos enunciados anteriormente para tener derecho a gozar de esta deducción.",
      "La base de esta deducción estará constituida por las cantidades justificadas con factura o recibo satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las personas o entidades que sean arrendadores de la vivienda. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "Vivienda habitual: residencia efectiva y permanente, con ocupación en doce meses y permanencia continuada de tres años, salvo fallecimiento o circunstancias que necesariamente exijan el cambio o impidan la ocupación. La calificación se comprueba conforme a la normativa del IRPF.",
      "Discapacidad: certificado o resolución del IMSERSO u órgano autonómico competente; las pensiones de incapacidad permanente total, absoluta o gran invalidez acreditan al menos el 33%, sin acreditar por sí solas el umbral específico del 65%. Se aplican las asimilaciones del artículo 60.3 LIRPF y el artículo 72 RIRPF.",
    ]
  )

export const CANTABRIA_CUIDADO_FAMILIARES_2025 = fichaImplementada(
  { estado: "implementada" },
  "cantabria_cuidado_familiares",
  "Por cuidado de familiares",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "100", por: "familiar que cumpla requisitos" },
  [
    "100 euros por familiar",
    "Un menor de 3 años con discapacidad igual o superior al 65% puede generar doble derecho según la ficha",
    "Rentas brutas del ascendiente o descendiente no superiores a 6.000 euros; en los supuestos de discapacidad, límite de 1,5 veces el IPREM. El artículo 2.2 no establece un límite de base liquidable del contribuyente.",
  ],
  [209, 210],
  ["importeBase", "cumpleRequisitosYLimites"],
  [
    "2. Por cuidado de familiares.",
    "El contribuyente podrá deducir 100 euros por cada descendiente menor de tres años, por cada ascendiente mayor de setenta, y por cada ascendiente, descendiente, cónyuge o hermano con discapacidad física, psíquica o sensorial que tenga un grado de discapacidad igual o superior al 65 por ciento de acuerdo con el baremo a que se refiere el artículo 367 del texto refundido de la Ley General de la Seguridad Social, aprobado por Real Decreto Legislativo 8/2015, de 30 de octubre. Se tendrá derecho a la deducción, aunque el parentesco lo sea por afinidad. Para dar lugar a la deducción, el descendiente, ascendiente o familiar con discapacidad deberá, además, reunir los siguientes requisitos:",
    "a) Convivir más de ciento ochenta y tres días del año natural con el contribuyente. Se exceptúa del cumplimiento de este requisito a los menores de tres años.",
    "b) No tener rentas brutas anuales superiores a 6.000 euros. En los supuestos de discapacidad el límite será de 1,5 veces el IPREM.",
    "Esta deducción será incompatible con la de los hijos a los que sea aplicable la deducción por nacimiento o adopción de hijo, prevista en el apartado 10. En ningún caso existirá esta incompatibilidad para los ascendientes mayores de setenta años o para ascendientes, descendientes, cónyuge o hermanos con el grado de discapacidad regulado en el primer párrafo de este apartado.",
    "Se asimilan a los cónyuges las parejas que cumplan la Ley de Cantabria 1/2005 y estén inscritas en el registro cántabro o en los registros análogos previstos en la disposición adicional segunda. Esta equiparación autonómica no permite por sí sola tributar conjuntamente en el IRPF estatal.",
    "Discapacidad: certificado o resolución del IMSERSO u órgano autonómico competente; las pensiones de incapacidad permanente total, absoluta o gran invalidez acreditan al menos el 33%, sin acreditar por sí solas el umbral específico del 65%. Se aplican las asimilaciones del artículo 60.3 LIRPF y el artículo 72 RIRPF.",
  ]
)

export const CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025 = fichaImplementada(
  { estado: "implementada" },
  "cantabria_nacimiento_adopcion_hijos",
  "Por nacimiento o adopción de hijos",
  "circunstancias_personales_familiares",
  { tipo: "importe_fijo", euros: "1400", por: "hijo nacido o adoptado" },
  [
    "1.400 euros por nacimiento o adopción",
    "Aplicable en el ejercicio del nacimiento o adopción y en los dos ejercicios siguientes",
    "Nacimientos o adopciones desde el 1 de enero de 2024; en declaración individual, prorrateo por mitad a cada progenitor o adoptante. Compatible con la deducción estatal.",
  ],
  [220, 221],
  ["importeBase", "cumpleRequisitosYLimites"],
  [
    "10. Deducción por nacimiento o adopción de hijos:",
    "El contribuyente se podrá deducir 1.400 euros por nacimiento o adopción de hijos, en el ejercicio en que se produzca y los dos siguientes, prorrateándose por mitad a cada progenitor o adoptante en caso de declaración individual. Esta deducción será compatible con la regulada por el Estado y aplicable a los nacimientos y adopciones que se produzcan desde el 1 de enero de 2024.",
  ]
)

export const CANTABRIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_obras_mejora",
    nombreCatalogadoDesdeCodigo("cantabria_obras_mejora"),
    categoriaCatalogadaDesdeCodigo("cantabria_obras_mejora"),
    {
      tipo: "mixta",
      descripcion:
        "15% de las obras elegibles; máximo 1.000 euros individual y 1.500 conjunta, con incremento por discapacidad y arrastre de dos ejercicios.",
    },
    [
      "Artículo 2.3 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 211 a 213.",
      "El límite se incrementa en 500 euros por discapacidad de grado igual o superior al 65%; en conjunta, 500 euros por cada contribuyente con ese grado. No son elegibles obras en viviendas afectas, garajes, jardines, parques, piscinas ni instalaciones deportivas.",
    ],
    [211, 212, 213],
    ["cantabria_obras_mejora:importe", "cantabria_obras_mejora:cumple"],
    [
      "3. Por obras de mejora en viviendas.",
      "El contribuyente se podrá deducir un 15 por ciento de las cantidades satisfechas en obras realizadas, durante el ejercicio fiscal, en cualquier vivienda o viviendas de su propiedad, siempre que esté situada en la Comunidad de Cantabria, o en el edificio en la que la vivienda se encuentre, y que tengan por objeto:",
      "a) Una rehabilitación calificada como tal por la Dirección General de Vivienda del Gobierno de Cantabria.",
      "b) La mejora de la eficiencia energética, la higiene, la salud y protección del medio ambiente y la accesibilidad a la vivienda o al edificio en que se encuentra.",
      "c) La utilización de energías renovables, la seguridad y la estanqueidad y, en particular, la sustitución de instalaciones de electricidad, agua, gas o calefacción.",
      "d) Obras de instalación de infraestructuras de telecomunicación que permitan el acceso a Internet y a servicios de televisión digital en la vivienda del contribuyente.",
      "No darán derecho a practicar esta deducción las obras que se realicen en viviendas afectadas a una actividad económica, plazas de garaje, jardines, parques, piscinas e instalaciones deportivas y otros elementos análogos.",
      "La base de esta deducción estará constituida por las cantidades justificadas con factura y satisfechas mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las personas o entidades que realicen tales obras. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "La deducción tendrá un límite anual de 1.000 euros en tributación individual y 1.500 en tributación conjunta. Estos límites se incrementarán en 500 euros en tributación individual cuando el contribuyente sea una persona con discapacidad y acredite un grado de discapacidad igual o superior al 65 %. En el caso de tributación conjunta el incremento será de 500 euros por cada contribuyente con dicha discapacidad. Las cantidades satisfechas en el ejercicio y no deducidas por exceder del límite anual, podrán deducirse en los dos ejercicios siguientes.",
      "En ningún caso darán derecho a la aplicación de esta deducción, las cantidades satisfechas por las que el contribuyente tenga derecho a practicarse alguna deducción estatal o que provengan de subvenciones no sujetas o exentas del impuesto sobre la renta de las personas físicas que, en su caso, se hubieran percibido o estuvieran asociadas a la realización de dichas obras.",
      "Discapacidad: certificado o resolución del IMSERSO u órgano autonómico competente; las pensiones de incapacidad permanente total, absoluta o gran invalidez acreditan al menos el 33%, sin acreditar por sí solas el umbral específico del 65%. Se aplican las asimilaciones del artículo 60.3 LIRPF y el artículo 72 RIRPF.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",
    nombreCatalogadoDesdeCodigo(
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad"
    ),
    {
      tipo: "mixta",
      descripcion:
        "15% de donaciones a fundaciones y asociaciones de discapacidad elegibles; 12% al Fondo Cantabria Coopera; base limitada al 10% de base liquidable.",
    },
    [
      "Artículo 2.4 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 213 a 214.",
      "La suma de la base de esta deducción y las bases de las deducciones estatales de los artículos 68.3 y 68.5 LIRPF no podrá exceder del 10% de la base liquidable; no es una base adicional independiente.",
    ],
    [213, 214],
    [
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad:importe",
      "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad:cumple",
    ],
    [
      "4. Por donativos a fundaciones o al Fondo Cantabria Coopera o a asociaciones que persigan entre sus fines el apoyo a personas con discapacidad.",
      "Los contribuyentes podrán deducir el 15 por 100 de las cantidades donadas a fundaciones domiciliadas en la Comunidad Autónoma de Cantabria que cumplan con los requisitos de la Ley 50/2002, de 26 de diciembre, de Fundaciones que persigan fines culturales, asistenciales, deportivos o sanitarios o cualesquiera otros de naturaleza análoga a estos. En todo caso, será preciso que estas fundaciones se encuentren inscritas en el Registro de Fundaciones, que rindan cuentas al órgano de protectorado correspondiente y que este haya ordenado su depósito en el Registro de Fundaciones. De igual manera, los contribuyentes podrán deducir el 12 por cien de las cantidades que donen al Fondo Cantabria Coopera.",
      "Igualmente podrán deducir el 15 por 100 de las cantidades donadas a asociaciones domiciliadas en la Comunidad Autónoma de Cantabria que cumplan los requisitos de la Ley 49/2002, de 23 de diciembre, de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, y cuyo objeto sea el apoyo a personas con discapacidad.",
      "La suma de la base de esta deducción y la base de las deducciones a las que se refieren los apartados 3 y 5 del artículo 68 de la Ley 35/2006, de 28 de noviembre, del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de los no Residentes y sobre el Patrimonio, no podrá exceder del 10 por 100 de la base liquidable del contribuyente.",
      "Discapacidad: certificado o resolución del IMSERSO u órgano autonómico competente; las pensiones de incapacidad permanente total, absoluta o gran invalidez acreditan al menos el 33%, sin acreditar por sí solas el umbral específico del 65%. Se aplican las asimilaciones del artículo 60.3 LIRPF y el artículo 72 RIRPF.",
      "Las asociaciones deben ser de utilidad pública y cumplir los requisitos del régimen de entidades sin fines lucrativos de los artículos 2 y 3 de la Ley 49/2002: fines de interés general, destino mínimo del 70% a dichos fines, límites a actividades ajenas, destinatarios y remuneración, inscripción, contabilidad, rendición y memoria económica. Las fundaciones requieren inscripción y cuentas depositadas por el protectorado; no basta el nombre de la entidad.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_acogimiento_familiar_menores",
    nombreCatalogadoDesdeCodigo("cantabria_acogimiento_familiar_menores"),
    categoriaCatalogadaDesdeCodigo("cantabria_acogimiento_familiar_menores"),
    {
      tipo: "mixta",
      descripcion:
        "240 euros por el número máximo de menores acogidos simultáneamente; máximo 1.200 euros; reparto por mitad en declaraciones individuales de la pareja.",
    },
    [
      "Artículo 2.5 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 214 a 215.",
    ],
    [214, 215],
    [
      "cantabria_acogimiento_familiar_menores:importe",
      "cantabria_acogimiento_familiar_menores:cumple",
    ],
    [
      "5. Por acogimiento familiar de menores. Los contribuyentes que reciban a menores en régimen de acogimiento familiar, siempre que hayan sido previamente seleccionados al efecto por una entidad pública de protección de menores y que no tengan relación de parentesco alguna, ni adopten durante el periodo impositivo al menor acogido, podrán deducir: a) 240 euros con carácter general, o b) el resultado de multiplicar 240 euros por el número máximo de menores que haya acogido de forma simultánea en el periodo impositivo. En todo caso, la cuantía de la deducción no podrá superar 1.200 euros. En el supuesto de acogimiento de menores por matrimonios, parejas de hecho o parejas que convivan de forma permanente en análoga relación de afectividad a las anteriores sin haber registrado su unión, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual. Esta deducción será igualmente aplicable a las personas exacogedoras con las que conviva una persona mayor de edad que se hubiera tenido acogida hasta la mayoría de edad, siempre que la convivencia no se haya interrumpido y que la convivencia se dé bajo la aprobación y la supervisión de la entidad pública de protección de menores. En este último caso, la deducción está sujeta a los mismos requisitos que permiten la aplicación del mínimo por descendientes por los/las hijos/as mayores de edad que conviven en el domicilio familiar.",
      "El mínimo por descendientes exige edad inferior a 25 años o discapacidad cualquiera que sea la edad, convivencia o dependencia asimilada y rentas anuales, excluidas las exentas, no superiores a 8.000 euros; no procede si presenta declaración con rentas superiores a 1.800 euros. Se aplican las reglas de reparto y prioridad de grado de los artículos 58 a 61 LIRPF, salvo ampliación o regla especial expresa de esta deducción.",
      "Discapacidad: certificado o resolución del IMSERSO u órgano autonómico competente; las pensiones de incapacidad permanente total, absoluta o gran invalidez acreditan al menos el 33%, sin acreditar por sí solas el umbral específico del 65%. Se aplican las asimilaciones del artículo 60.3 LIRPF y el artículo 72 RIRPF.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_inversion_entidades_nuevas_reciente_creacion",
    nombreCatalogadoDesdeCodigo(
      "cantabria_inversion_entidades_nuevas_reciente_creacion"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_inversion_entidades_nuevas_reciente_creacion"
    ),
    {
      tipo: "mixta",
      descripcion:
        "15% de inversión elegible en constitución o ampliación de capital; máximo 1.000 euros; participación familiar hasta tercer grado no superior al 40% y mantenimiento de tres años.",
    },
    [
      "Artículo 2.6 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 215 a 217.",
    ],
    [215, 216, 217],
    [
      "cantabria_inversion_entidades_nuevas_reciente_creacion:importe",
      "cantabria_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    [
      "6. Deducción por inversión en la adquisición de acciones y participaciones sociales de nuevas entidades o de reciente creación.",
      "1. Los contribuyentes podrán aplicar una deducción del 15% de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en las sociedades mercantiles que revistan la forma de Sociedad Anónima, Sociedad de Responsabilidad Limitada, Sociedad Anónima Laboral o Sociedad de Responsabilidad Limitada Laboral y que tengan la consideración de PYMES de acuerdo con la definición de las mismas dada por la Recomendación de la Comisión Europea de 6 de mayo de 2003.",
      "2. El límite de deducción aplicable será de 1.000 euros anuales.",
      "3. Para la aplicación de la deducción deberán cumplirse los siguientes requisitos:",
      "a) Que, como consecuencia de la participación adquirida por el contribuyente, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco, en línea recta o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no se llegue a poseer durante ningún día del año natural más del 40% del total del capital social de la entidad o de sus derechos de voto.",
      "b) Que dicha participación se mantenga un mínimo de tres años.",
      "c) Que la entidad de la que se adquieran las acciones o participaciones cumpla los siguientes requisitos:",
      "1. Que tenga su domicilio social y fiscal en la Comunidad Autónoma de Cantabria.",
      "2. Que desarrolle una actividad económica. A estos efectos no se considerará que desarrolla una actividad económica cuando tenga por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo establecido en el artículo 4.ocho.dos.a) de la Ley 19/1991, de 6 de junio, del Impuesto sobre el Patrimonio.",
      "3. Que, para el caso en que la inversión efectuada corresponda a la constitución de la entidad, desde el primer ejercicio fiscal esta cuente, al menos, con una persona contratada, a jornada completa, dada de alta en la Seguridad Social y residente en la Comunidad Autónoma de Cantabria.",
      "4. Que, para el caso en que la inversión efectuada corresponda a una ampliación de capital de la entidad, dicha entidad hubiera sido constituida dentro de los tres años anteriores a la ampliación de capital y que la plantilla media de la entidad durante los dos ejercicios fiscales posteriores al de la ampliación se incremente respecto de la plantilla media que tuviera en los doce meses anteriores al menos en una persona con los requisitos anteriores, y dicho incremento se mantenga durante al menos otros veinticuatro meses.",
      "Para el cálculo de la plantilla media total de la entidad y de su incremento se tomarán las personas empleadas en los términos que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación a la jornada completa.",
      "d) El contribuyente o la contribuyente puede formar parte del consejo de administración de la sociedad en la que ha materializado la inversión, pero en ningún caso puede llevar a cabo funciones ejecutivas o de dirección. Tampoco puede mantener una relación laboral con la entidad objeto de la inversión.",
      "e) Las operaciones en las que sea aplicable la deducción deben formalizarse en escritura pública, en la cual debe especificarse la identidad de los inversores y el importe de la respectiva inversión.",
      "f) Los requisitos establecidos por los apartados a y d del artículo 3 así como en los puntos 1, 2 y 3 del apartado c del mismo artículo, deben cumplirse durante un período mínimo de tres años a partir de la fecha de efectividad del acuerdo de ampliación de capital o constitución que origine el derecho a la deducción.",
      "4. El incumplimiento de los requisitos y las condiciones establecidos comporta la pérdida del beneficio fiscal y el contribuyente o la contribuyente debe incluir en la declaración del impuesto correspondiente al ejercicio en el que se ha producido el incumplimiento la parte del impuesto que se ha dejado de pagar como consecuencia de la deducción practicada, junto con los intereses de demora devengados.",
      "Se asimilan a los cónyuges las parejas que cumplan la Ley de Cantabria 1/2005 y estén inscritas en el registro cántabro o en los registros análogos previstos en la disposición adicional segunda. Esta equiparación autonómica no permite por sí sola tributar conjuntamente en el IRPF estatal.",
      "No es actividad económica la gestión patrimonial del artículo 4.Ocho.Dos.a) de la Ley 19/1991: durante más de 90 días del ejercicio, más de la mitad del activo constituido por valores o no afecto a actividades, con las exclusiones legales de valores y beneficios empresariales no distribuidos de los últimos diez años.",
      "PYME según la Recomendación 2003/361/CE: menos de 250 personas y volumen de negocios anual hasta 50 millones de euros o balance hasta 43 millones; se agregan los datos de empresas asociadas y vinculadas en los términos del anexo, no solo los de la sociedad receptora.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_gastos_enfermedad",
    nombreCatalogadoDesdeCodigo("cantabria_gastos_enfermedad"),
    categoriaCatalogadaDesdeCodigo("cantabria_gastos_enfermedad"),
    {
      tipo: "mixta",
      descripcion:
        "10% de gastos sanitarios elegibles no cubiertos; máximo 500 euros individual y 700 conjunta, incrementados por discapacidad. Base liquidable menos mínimo inferior a 22.946/31.485 euros.",
    },
    [
      "Artículo 2.7 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 217 a 218.",
    ],
    [217, 218],
    [
      "cantabria_gastos_enfermedad:importe",
      "cantabria_gastos_enfermedad:cumple",
    ],
    [
      "7. Deducción por gastos de enfermedad.",
      "El contribuyente se podrá deducir un 10 % de los honorarios profesionales abonados durante el año por la prestación de servicios sanitarios por motivo de enfermedad, salud dental, embarazo y nacimiento de hijos, accidentes e invalidez, tanto propios como de las personas que se incluyan en el mínimo familiar, siempre y cuando estos honorarios no estén cubiertos por la Seguridad Social o en su caso por la Mutua o entidad aseguradora correspondiente del contribuyente.",
      "Esta deducción tendrá un límite anual de 500 euros en tributación individual y 700 en tributación conjunta. Estos límites se incrementarán en 100 euros en tributación individual cuando el contribuyente sea una persona con discapacidad y acredite un grado de discapacidad igual o superior al 65 %. En el caso de tributación conjunta el incremento será de 100 € por cada contribuyente con dicha discapacidad.",
      "Requisito para la deducción: Que la base liquidable del periodo, después de las reducciones por mínimo personal y familiar sea inferior a 22.946 euros en tributación individual o a 31.485 euros en tributación conjunta.",
      "La base de esta deducción estará constituida por las cantidades justificadas con factura y satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "Discapacidad: certificado o resolución del IMSERSO u órgano autonómico competente; las pensiones de incapacidad permanente total, absoluta o gran invalidez acreditan al menos el 33%, sin acreditar por sí solas el umbral específico del 65%. Se aplican las asimilaciones del artículo 60.3 LIRPF y el artículo 72 RIRPF.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_gastos_guarderia",
    nombreCatalogadoDesdeCodigo("cantabria_gastos_guarderia"),
    categoriaCatalogadaDesdeCodigo("cantabria_gastos_guarderia"),
    {
      tipo: "mixta",
      descripcion:
        "15% de guardería; máximo 300 euros por hijo menor de tres años, con reparto del límite según gastos justificados; incompatible con guardería en despoblamiento.",
    },
    [
      "Artículo 2.8 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 218 a 219.",
    ],
    [218, 219],
    ["cantabria_gastos_guarderia:importe", "cantabria_gastos_guarderia:cumple"],
    [
      "8. Deducción por gastos de guardería.",
      "El contribuyente se podrá deducir un 15 por ciento en los gastos de guardería de los hijos biológicos o adoptados con un límite de 300 euros anuales por hijo menor de tres años. En caso de tributación individual, se prorrateará la deducción según los gastos justificados por cada contribuyente, sin que pueda superar conjuntamente la cantidad máxima de deducción.",
      "La base de esta deducción estará constituida por las cantidades justificadas con factura y satisfechas mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las personas o entidades que presten los servicios. En ningún caso darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_familias_monoparentales",
    nombreCatalogadoDesdeCodigo("cantabria_familias_monoparentales"),
    categoriaCatalogadaDesdeCodigo("cantabria_familias_monoparentales"),
    {
      tipo: "mixta",
      descripcion:
        "200 euros al titular de familia monoparental; base liquidable menos mínimo inferior a 31.485 euros.",
    },
    [
      "Artículo 2.9 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 220 a 220.",
    ],
    [220],
    [
      "cantabria_familias_monoparentales:importe",
      "cantabria_familias_monoparentales:cumple",
    ],
    [
      "9. Deducción para familias monoparentales.",
      "El titular de familia monoparental podrá deducirse 200 euros anuales en su declaración del IRPF, siempre que la base liquidable del periodo impositivo después de las reducciones por mínimo personal y familiar sea inferior a 31.485 euros.",
      "A los efectos de esta Ley, en los casos de separación legal o cuando no existiera vínculo matrimonial, tendrá la consideración de familia monoparental la formada por la madre o el padre y los hijos que convivan con una u otro y que reúnan alguno de los siguientes requisitos:",
      "a) Hijos menores de edad, con excepción de los que, con el consentimiento de los padres, vivan independientes de estos.",
      "b) Hijos mayores de edad incapacitados judicialmente sujetos a patria potestad prorrogada o rehabilitada.",
      "Criterio del Manual AEAT 2025, página 220: se incluyen los hijos mayores de edad con curatela representativa declarada judicialmente; la referencia a incapacitación judicial se extiende a esas resoluciones tras la Ley 8/2021.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_arrendamiento_municipios_riesgo_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "20% del alquiler; máximo 600 euros individual y 1.200 conjunta; vivienda en municipio delimitado por riesgo de despoblamiento; incompatible para la misma vivienda con alquiler general.",
    },
    [
      "Artículo 2.11.1 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 221 a 223.",
    ],
    [221, 222, 223],
    [
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento:importe",
      "cantabria_arrendamiento_municipios_riesgo_despoblamiento:cumple",
    ],
    [
      "11. Deducciones aplicables a contribuyentes que tengan su residencia habitual en municipios afectados por riesgo de despoblamiento en Cantabria.",
      "Se entenderá por municipios afectados por riesgo de despoblamiento en Cantabria los municipios incluidos en la orden por la que se aprueba la delimitación de municipios afectados por riesgo de despoblamiento en Cantabria aprobada por la Consejería competente en materia de despoblamiento.",
      "Para determinar el concepto de residencia habitual se estará en los dispuesto en el artículo 72 de la Ley del Impuesto sobre la Renta de las Personas Físicas.",
      "La base de las deducciones contempladas en los apartados 11.1, 11.2, 11.3 y 11.4 estará constituida por las cantidades justificadas con facturas o recibos y satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "11.1 Por contratos de arrendamiento de viviendas situadas en municipios afectados por riesgo de despoblamiento y que constituyan o vayan a constituir la vivienda habitual del arrendatario.",
      "El arrendatario podrá deducir el 20 por ciento, hasta un límite de 600 euros anuales en tributación individual y 1.200 euros en tributación conjunta de las cantidades satisfechas en el periodo impositivo por el arrendamiento de su vivienda habitual. Esta deducción es incompatible con la aplicación de la deducción por arrendamiento de vivienda habitual prevista en el apartado 1 de este artículo.",
      "Vivienda habitual: residencia efectiva y permanente, con ocupación en doce meses y permanencia continuada de tres años, salvo fallecimiento o circunstancias que necesariamente exijan el cambio o impidan la ocupación. La calificación se comprueba conforme a la normativa del IRPF.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_guarderia_municipios_riesgo_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_guarderia_municipios_riesgo_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_guarderia_municipios_riesgo_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "30% de guardería; máximo 600 euros por hijo menor de tres años; residencia en municipio delimitado e incompatibilidad con guardería general.",
    },
    [
      "Artículo 2.11.2 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 223 a 224.",
    ],
    [223, 224],
    [
      "cantabria_guarderia_municipios_riesgo_despoblamiento:importe",
      "cantabria_guarderia_municipios_riesgo_despoblamiento:cumple",
    ],
    [
      "11. Deducciones aplicables a contribuyentes que tengan su residencia habitual en municipios afectados por riesgo de despoblamiento en Cantabria.",
      "Se entenderá por municipios afectados por riesgo de despoblamiento en Cantabria los municipios incluidos en la orden por la que se aprueba la delimitación de municipios afectados por riesgo de despoblamiento en Cantabria aprobada por la Consejería competente en materia de despoblamiento.",
      "Para determinar el concepto de residencia habitual se estará en los dispuesto en el artículo 72 de la Ley del Impuesto sobre la Renta de las Personas Físicas.",
      "La base de las deducciones contempladas en los apartados 11.1, 11.2, 11.3 y 11.4 estará constituida por las cantidades justificadas con facturas o recibos y satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "11.2 Deducción por gastos de guardería. Si la vivienda habitual del contribuyente se encuentra situada en municipios afectados por riesgo de despoblamiento, se podrá deducir un 30 % en los gastos de guardería de los hijos o adoptados con un límite de 600 euros anuales por hijo menor de tres años.",
      "Esta deducción es incompatible con la aplicación de la deducción por gastos de guardería prevista en el apartado 8 de este artículo.",
      "Vivienda habitual: residencia efectiva y permanente, con ocupación en doce meses y permanencia continuada de tres años, salvo fallecimiento o circunstancias que necesariamente exijan el cambio o impidan la ocupación. La calificación se comprueba conforme a la normativa del IRPF.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_traslado_residencia_motivos_laborales_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "500 euros por traslado laboral a municipio en riesgo; exige mantenimiento de residencia y límite de cuota procedente de trabajo y actividades económicas.",
    },
    [
      "Artículo 2.11.3 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 224 a 225.",
    ],
    [224, 225],
    [
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento:importe",
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento:cumple",
    ],
    [
      "11. Deducciones aplicables a contribuyentes que tengan su residencia habitual en municipios afectados por riesgo de despoblamiento en Cantabria.",
      "Se entenderá por municipios afectados por riesgo de despoblamiento en Cantabria los municipios incluidos en la orden por la que se aprueba la delimitación de municipios afectados por riesgo de despoblamiento en Cantabria aprobada por la Consejería competente en materia de despoblamiento.",
      "Para determinar el concepto de residencia habitual se estará en los dispuesto en el artículo 72 de la Ley del Impuesto sobre la Renta de las Personas Físicas.",
      "La base de las deducciones contempladas en los apartados 11.1, 11.2, 11.3 y 11.4 estará constituida por las cantidades justificadas con facturas o recibos y satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "11.3 Por los gastos ocasionados al trasladar la residencia habitual a un municipio afectado por riesgo de despoblamiento por motivos laborales por cuenta ajena o por cuenta propia.",
      "El contribuyente podrá deducirse 500 euros en el periodo impositivo en el que se produzca el cambio de residencia y en el siguiente.",
      "El traslado de la residencia habitual desde cualquier punto de España a un municipio afectado por riesgo de despoblamiento debe venir motivado por la realización de una actividad laboral bien por cuenta ajena o bien por cuenta propia.",
      "Para consolidar el derecho a la deducción, es preciso que el contribuyente permanezca en la nueva residencia habitual durante el año en que se produce el traslado y los tres siguientes.",
      "El incumplimiento de cualquiera de los dos requisitos anteriores dará lugar a la aplicación de lo dispuesto en el artículo 59.2.c) del Reglamento del Impuesto sobre la Renta de las Personas Físicas, aprobado por Real Decreto 439/2007, de 30 de marzo, debiendo el contribuyente añadir a la cuota líquida autonómica o complementaria devengada en el ejercicio en que se hayan incumplido los requisitos, la totalidad de las deducciones indebidamente practicadas, más los intereses de demora a que se refiere el artículo 26.6 de la Ley 58/2003, de 17 de diciembre, General Tributaria.",
      "El importe de la deducción no podrá exceder de la parte autonómica de la cuota íntegra procedente de los rendimientos del trabajo y de actividades económicas del ejercicio en que resulte aplicable la deducción.",
      "Particularidades en caso de tributación conjunta. En el supuesto de tributación conjunta, la deducción de 500 euros se aplicará, en cada uno de los periodos impositivos en que sea aplicable la deducción, por cada uno de los contribuyentes que traslade su residencia en los términos anteriormente contemplados, con el límite de la parte autonómica de la cuota íntegra procedente de rendimientos del trabajo y de actividades económicas que corresponda a los contribuyentes que generen derecho a la aplicación de la deducción.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_traslado_estudios_despoblamiento",
    nombreCatalogadoDesdeCodigo("cantabria_traslado_estudios_despoblamiento"),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_traslado_estudios_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "200 euros por hijo estudiante desplazado; rentas anuales inferiores a 8.000 euros y reparto por mitad en individual.",
    },
    [
      "Artículo 2.11.4 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 225 a 226.",
    ],
    [225, 226],
    [
      "cantabria_traslado_estudios_despoblamiento:importe",
      "cantabria_traslado_estudios_despoblamiento:cumple",
    ],
    [
      "11. Deducciones aplicables a contribuyentes que tengan su residencia habitual en municipios afectados por riesgo de despoblamiento en Cantabria.",
      "Se entenderá por municipios afectados por riesgo de despoblamiento en Cantabria los municipios incluidos en la orden por la que se aprueba la delimitación de municipios afectados por riesgo de despoblamiento en Cantabria aprobada por la Consejería competente en materia de despoblamiento.",
      "Para determinar el concepto de residencia habitual se estará en los dispuesto en el artículo 72 de la Ley del Impuesto sobre la Renta de las Personas Físicas.",
      "La base de las deducciones contempladas en los apartados 11.1, 11.2, 11.3 y 11.4 estará constituida por las cantidades justificadas con facturas o recibos y satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "11.4 Por gastos de traslado por razón de estudios en municipios afectados por riesgo de despoblamiento.",
      "El contribuyente con residencia habitual en municipios afectados por riesgo de despoblamiento podrá deducirse 200 euros por cada hijo estudiante menor de 25 años, que no tenga rentas anuales iguales o superiores a 8.000 euros, que curse estudios de bachillerato, formación profesional o enseñanzas universitarias fuera del municipio. En el caso de tributación individual esta deducción se prorrateará por mitad a cada progenitor.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_residencia_municipio_riesgo_despoblamiento",
    nombreCatalogadoDesdeCodigo(
      "cantabria_residencia_municipio_riesgo_despoblamiento"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_residencia_municipio_riesgo_despoblamiento"
    ),
    {
      tipo: "mixta",
      descripcion:
        "20% de cuota íntegra autonómica, máximo 500 euros; contribuyente menor de 40 años residente en municipio afectado por riesgo de despoblamiento.",
    },
    [
      "Artículo 2.11.5 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 226 a 227.",
    ],
    [226, 227],
    [
      "cantabria_residencia_municipio_riesgo_despoblamiento:importe",
      "cantabria_residencia_municipio_riesgo_despoblamiento:cumple",
    ],
    [
      "11. Deducciones aplicables a contribuyentes que tengan su residencia habitual en municipios afectados por riesgo de despoblamiento en Cantabria.",
      "Se entenderá por municipios afectados por riesgo de despoblamiento en Cantabria los municipios incluidos en la orden por la que se aprueba la delimitación de municipios afectados por riesgo de despoblamiento en Cantabria aprobada por la Consejería competente en materia de despoblamiento.",
      "Para determinar el concepto de residencia habitual se estará en los dispuesto en el artículo 72 de la Ley del Impuesto sobre la Renta de las Personas Físicas.",
      "La base de las deducciones contempladas en los apartados 11.1, 11.2, 11.3 y 11.4 estará constituida por las cantidades justificadas con facturas o recibos y satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "11.5 Por residencia habitual en un municipio afectado por riesgo de despoblamiento.",
      "El contribuyente menor de 40 años con residencia habitual durante todo el año natural en un municipio afectado por riesgo de despoblamiento podrá deducirse de la cuota íntegra autonómica el 20 % de su importe hasta un límite de 500 euros.",
      "En el supuesto de tributación conjunta, la cuantía de la deducción será aplicable por cada uno de los contribuyentes que cumpla los requisitos establecidos.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_inversiones_donaciones_economia_social",
    nombreCatalogadoDesdeCodigo(
      "cantabria_inversiones_donaciones_economia_social"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_inversiones_donaciones_economia_social"
    ),
    {
      tipo: "mixta",
      descripcion:
        "20% de aportaciones para ser socio, 50% de donaciones para actividad y 25% para fomento de economía social; límite conjunto 3.000 euros; incompatibilidades por inversión.",
    },
    [
      "Artículo 2.12 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 227 a 229.",
      "En aportaciones para ser socio, mantener la participación durante cinco años. Domicilio social y fiscal en Cantabria, actividad económica y al menos una persona con contrato laboral a jornada completa y alta en Seguridad Social: requisitos de entidad durante tres años. No duplicar la base entre modalidades.",
    ],
    [227, 228, 229],
    [
      "cantabria_inversiones_donaciones_economia_social:importe",
      "cantabria_inversiones_donaciones_economia_social:cumple",
    ],
    [
      "12. Los contribuyentes podrán aplicar las siguientes deducciones por inversiones o donaciones a entidades de la Economía Social establecidas en Cantabria.",
      "a) El 20 por 100 de las cantidades invertidas durante el ejercicio en las aportaciones realizadas con la finalidad de ser socio en entidades que formen parte de la Economía Social a que se refiere el apartado siguiente.",
      "b) El 50 % de las cantidades donadas, con carácter irrevocable, a entidades que formen parte de la Economía social para el desarrollo de actividades económicas tanto nuevas como de afianzamiento de las ya realizadas.",
      "c) El 25 % de las cantidades donadas, con carácter irrevocable, a entidades que formen parte de la Economía social para la realización de actividades de fomento y difusión de la Economía social, en los términos previstos en el artículo 8 de la Ley 5/2011, de 29 de marzo, de Economía Social (BOE del 30).",
      "2. Límite conjunto: El importe máximo de los tres supuestos contemplados de esta deducción es de 3.000 euros, tanto en tributación individual como en tributación conjunta, y sin que ninguna cantidad pueda ser objeto de deducción simultáneamente en dos o más de las modalidades de esta deducción.",
      "Requisitos y otras condiciones para la aplicación de la deducción.",
      "3. La aplicación de esta deducción está sujeta al cumplimiento de los requisitos y condiciones siguientes.",
      "a) La participación alcanzada por el contribuyente computado junto con las del cónyuge o personas unidas por razón de parentesco, en línea directa o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no podrá ser superior al 40 por 100 del capital de la entidad objeto de la inversión o donación.",
      "b) La entidad en la que debe materializarse la inversión o donación tendrá que cumplir los siguientes requisitos:",
      "1.º Formar parte de la economía social, en los términos previstos en la Ley 5/2011, de 29 de marzo, de Economía Social y estar inscrita en los registros o catálogos establecidos que reconozcan la condición de entidad de economía social.",
      "2.º Tener su domicilio social y fiscal en Cantabria.",
      "3.º Contar, en promedio anual, con una persona ocupada con contrato laboral y a jornada completa, y dada de alta en el régimen general de la Seguridad Social.",
      "Los requisitos establecidos en los puntos 1.º, 2.º y 3.º anteriores deberán cumplirse durante un periodo mínimo de tres años a contar desde la aportación o donación.",
      "4. Las operaciones en las que sea de aplicación la deducción deberán formalizarse en escritura pública, en la que se hará constar la identidad de los inversores y el importe de la inversión respectiva.",
      "5. Para tener derecho a esta deducción se debe acreditar la efectividad de la donación y el valor de la misma mediante certificación emitida por la entidad donataria.",
      "6. Las entregas o donaciones que forman la base de esta deducción deberán realizarse mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las entidades que reciban la donación.",
      "En ningún caso, darán derecho a practicar esta deducción las aportaciones o donaciones satisfechas mediante entregas de dinero en efectivo.",
      "7. En el caso de la modalidad 12.a, la participación en el capital adquirido como consecuencia de la inversión realizada, habrá de mantenerse en el régimen de patrimonio del contribuyente durante un período mínimo de cinco años.",
      "8. El incumplimiento de los requisitos y condiciones establecidos en los apartados anteriores comportará la pérdida del beneficio fiscal y, en tal caso, el contribuyente deberá incluir en la declaración del impuesto correspondiente al ejercicio en que se haya producido el incumplimiento la parte del impuesto que se hubiera dejado de pagar como consecuencia de la deducción practicada, junto con los intereses de demora devengados.",
      "9. Esta deducción será incompatible, para las mismas inversiones, con las deducciones “Por donativos a fundaciones o al Fondo Cantabria Coopera.” y “Deducción por inversión en la adquisición de acciones y participaciones sociales de nuevas entidades o de reciente creación”.",
      "Se asimilan a los cónyuges las parejas que cumplan la Ley de Cantabria 1/2005 y estén inscritas en el registro cántabro o en los registros análogos previstos en la disposición adicional segunda. Esta equiparación autonómica no permite por sí sola tributar conjuntamente en el IRPF estatal.",
      "Entidades de economía social: cooperativas, mutualidades, sociedades laborales, empresas de inserción, centros especiales de empleo, cofradías, sociedades agrarias de transformación, fundaciones y asociaciones con actividad económica y demás entidades reconocidas conforme a los artículos 4 a 6 de la Ley 5/2011 vigente en 2025. La modalidad de difusión exige las actividades de fomento del artículo 8.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_gastos_educacion",
    nombreCatalogadoDesdeCodigo("cantabria_gastos_educacion"),
    categoriaCatalogadaDesdeCodigo("cantabria_gastos_educacion"),
    {
      tipo: "mixta",
      descripcion:
        "100% de libros y 15% de idiomas extraescolares en enseñanza obligatoria; límite conjunto 200 euros por unidad familiar; mitad en individual; factura y pago no efectivo.",
    },
    [
      "Artículo 2.13 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 229 a 230.",
    ],
    [229, 230],
    ["cantabria_gastos_educacion:importe", "cantabria_gastos_educacion:cumple"],
    [
      "13 [Sic]. Deducción por gastos de educación.",
      "El contribuyente podrá deducirse:",
      "– El 100 por ciento de las cantidades satisfechas por los gastos destinados a la adquisición de libros de texto editados para las enseñanzas obligatorias cursada por sus hijos o descendientes.",
      "– El 15 por cien de las cantidades satisfechas durante el período impositivo, por la enseñanza de idiomas como actividad extraescolar, recibida por sus hijos o descendientes durante las etapas correspondientes a la enseñanza obligatoria en centros docentes, u otros centros públicos o privados o por personas físicas dadas de alta en el correspondiente epígrafe del impuesto sobre actividades económicas.",
      "La suma de las dos deducciones anteriores no podrá ser superior a 200 euros por unidad familiar, prorrateándose por mitad para cada progenitor en caso de declaración individual.",
      "La base de esta deducción estará constituida por las cantidades justificadas con factura y satisfechas mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las personas o entidades que presten los servicios. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
      "La unidad familiar se determina por el artículo 82 LIRPF a 31 de diciembre: cónyuges no separados y sus hijos legalmente incluidos, o un progenitor y todos los hijos que convivan con él en los supuestos legales; nadie pertenece a dos unidades familiares.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_ayuda_domestica",
    nombreCatalogadoDesdeCodigo("cantabria_ayuda_domestica"),
    categoriaCatalogadaDesdeCodigo("cantabria_ayuda_domestica"),
    {
      tipo: "mixta",
      descripcion:
        "20% de cotizaciones del empleado de hogar, máximo 300 euros; empleador y vivienda habitual en Cantabria, con hijos y rentas laborales o edad de al menos 75 años.",
    },
    [
      "Artículo 2.14 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 230 a 232.",
    ],
    [230, 231, 232],
    ["cantabria_ayuda_domestica:importe", "cantabria_ayuda_domestica:cumple"],
    [
      "14. Deducción por ayuda doméstica.",
      "El contribuyente podrá deducirse el 20 por cien del importe satisfecho en el período impositivo por cuenta del empleador o empleadora a la Seguridad Social correspondiente a la cotización anual de un empleado o empleada del hogar familiar, con un límite de 300 euros, siempre que sus funciones sean desempeñadas en el domicilio que constituya la vivienda habitual del empleador o empleadora, y que conste inscrita en la Tesorería General de la Seguridad Social la afiliación en Cantabria al Sistema Especial del Régimen General de la Seguridad Social de Empleados del Hogar, de la persona empleada.",
      "El contribuyente deberá ser el titular del hogar familiar, a los efectos de esta deducción, de acuerdo con lo previsto en la normativa reguladora del sistema especial del régimen general de la Seguridad Social de empleados del hogar.",
      "En el caso de que se opte por declaración individual solamente podrá acogerse a esta deducción quien figure como empleador en la Tesorería General de la Seguridad Social. Si ambos cónyuges se han dado de alta como empleadores, solo se podrán deducir por una persona empleada, pudiendo prorratearse entre ellos el importe de la deducción.",
      "Para que sea de aplicación la deducción el contribuyente ha de encontrarse en alguno de los dos supuestos siguientes:",
      "a) Que la persona titular del hogar familiar o en su caso su cónyuge o pareja inscrita en el Registro de Parejas de Hecho de la Comunidad Autónoma de Cantabria tengan uno o más hijos menores de edad y los dos perciban rentas del trabajo o rendimientos de actividades económicas, o bien sea una familia monoparental con uno o más hijos en la que el progenitor perciba rentas del trabajo o rendimientos de actividades económicas.",
      "b) Que la persona titular del hogar familiar o, en su caso, su cónyuge o pareja inscrita en el Registro de parejas de hecho de la Comunidad Autónoma de Cantabria, sea de edad igual o superior a 75 años.",
      "Vivienda habitual: residencia efectiva y permanente, con ocupación en doce meses y permanencia continuada de tres años, salvo fallecimiento o circunstancias que necesariamente exijan el cambio o impidan la ocupación. La calificación se comprueba conforme a la normativa del IRPF.",
      "Se asimilan a los cónyuges las parejas que cumplan la Ley de Cantabria 1/2005 y estén inscritas en el registro cántabro o en los registros análogos previstos en la disposición adicional segunda. Esta equiparación autonómica no permite por sí sola tributar conjuntamente en el IRPF estatal.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_inversiones_nuevos_contribuyentes_extranjero",
    nombreCatalogadoDesdeCodigo(
      "cantabria_inversiones_nuevos_contribuyentes_extranjero"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_inversiones_nuevos_contribuyentes_extranjero"
    ),
    {
      tipo: "mixta",
      descripcion:
        "20% de inversión elegible sin intereses; residencia adquirida desde 2025 tras cinco años fuera de España; mantenimiento seis años y arrastre por insuficiencia cinco años.",
    },
    [
      "Artículo 2.15 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 232 a 235.",
    ],
    [232, 233, 234, 235],
    [
      "cantabria_inversiones_nuevos_contribuyentes_extranjero:importe",
      "cantabria_inversiones_nuevos_contribuyentes_extranjero:cumple",
    ],
    [
      "15. Deducción por inversiones de nuevos contribuyentes procedentes del extranjero.",
      "1. Las personas físicas no residentes en España que se conviertan en contribuyentes del Impuesto sobre la Renta de las Personas Físicas en Cantabria, podrán aplicar una deducción del 20 por ciento del valor de adquisición, incluyendo los gastos y tributos inherentes a la adquisición, excluidos los intereses, que hubieran sido satisfechos por el adquirente, en los siguientes elementos patrimoniales:",
      "a) Bienes inmuebles que no estén destinados a vivienda o vivienda turística.",
      "b) Valores representativos de la cesión a terceros de capitales propios, negociados o no, en mercados organizados.",
      "c) Valores representativos de la participación en fondos propios de cualquier tipo de entidad, negociados o no, en mercados organizados.",
      "2. Para la aplicación de la presente deducción será necesario que se cumplan los siguientes requisitos:",
      "a) En el caso de inversión en inmuebles, estos deberán estar situados en Cantabria.",
      "b) En el caso de los valores representativos definidos en las letras b) y c) del apartado anterior la entidad deberá tener su domicilio social y fiscal en Cantabria y desarrollar una actividad económica. No se considerará que se desarrolla una actividad económica cuando se tenga por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo establecido en el artículo 4. Ocho dos. A) de la Ley 19/1991, de 6 de junio, del Impuesto sobre el Patrimonio.",
      "La participación directa o indirecta del contribuyente, junto con la que posean en la misma entidad su cónyuge o cualquier persona unida al contribuyente por parentesco, en línea recta o colateral, por consanguinidad o afinidad, hasta el segundo grado incluido, no puede ser, durante ningún día de los años naturales de mantenimiento de la participación, superior al 40 por ciento del capital social de la entidad o de sus derechos de voto, no pudiendo el contribuyente en ningún caso llevar a cabo funciones ejecutivas ni de dirección ni mantener una relación laboral en la entidad objeto de la inversión.",
      "c) La inversión debe ser realizada en el propio ejercicio de la adquisición de la residencia fiscal en Cantabria, conforme a la normativa del Impuesto sobre la Renta de las Personas Físicas, o en el ejercicio siguiente. En el caso de inversión en valores representativos de la cesión a terceros de capitales propios emitidos por entidades españolas y de valores representativos de la participación en fondos propios de entidades españolas, la inversión también podrá realizarse en el ejercicio anterior al de la adquisición de la citada residencia.",
      "El contribuyente deberá mantener la inversión adquirida durante un plazo de seis años, siendo válidas las transmisiones onerosas de los elementos patrimoniales adquiridos con reinversión total del importe obtenido con la trasmisión, en el plazo de un mes desde las mismas.",
      "d) Que el contribuyente no haya sido residente en España durante los cinco años anteriores al cambio de residencia al territorio de Cantabria.",
      "3. La deducción podrá ser aplicada en el ejercicio en el que se produzca la inversión y en los cinco ejercicios siguientes inmediatos y sucesivos en caso de insuficiencia de cuota íntegra.",
      "En el caso de que la inversión se haya realizado en el ejercicio anterior al de la adquisición de la condición de contribuyente del Impuesto sobre la Renta de las Personas Físicas en Cantabria, para los bienes respecto de los cuales se prevé esta posibilidad en el apartado 2.c), la deducción podrá ser aplicada en el ejercicio en el que se adquiera la citada residencia fiscal o en los cinco ejercicios siguientes inmediatos y sucesivos, en caso de insuficiencia de cuota íntegra.",
      "4. Esta deducción podrá ser de aplicación a todas aquellas personas que se conviertan en contribuyentes del Impuesto sobre la Renta de las Personas Físicas en Cantabria a partir del 1 de enero de 2025 aun cuando las inversiones se hayan realizado durante el ejercicio anterior, en los supuestos recogidos en el apartado 2.c).",
      "Además, deberá mantener la condición de contribuyente del Impuesto sobre la Renta de las Personas Físicas en Cantabria hasta el último ejercicio del periodo de mantenimiento de la inversión.",
      "La pérdida de la residencia en Cantabria en el período de obligación de mantenimiento de la inversión o el incumplimiento de la obligación de mantenimiento de la inversión realizada, incluyendo el supuesto de transmisión sin reinversión total, originarán la pérdida de la deducción aplicada.",
      "5. Esta deducción resultará incompatible, para las mismas inversiones, con la deducción por inversión en la adquisición de acciones y participaciones sociales de nuevas entidades o de reciente creación establecida en apartado 6 de este artículo.",
      "Se asimilan a los cónyuges las parejas que cumplan la Ley de Cantabria 1/2005 y estén inscritas en el registro cántabro o en los registros análogos previstos en la disposición adicional segunda. Esta equiparación autonómica no permite por sí sola tributar conjuntamente en el IRPF estatal.",
      "No es actividad económica la gestión patrimonial del artículo 4.Ocho.Dos.a) de la Ley 19/1991: durante más de 90 días del ejercicio, más de la mitad del activo constituido por valores o no afecto a actividades, con las exclusiones legales de valores y beneficios empresariales no distribuidos de los últimos diez años.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_desplazamiento_permanencia_nuevos_residentes",
    nombreCatalogadoDesdeCodigo(
      "cantabria_desplazamiento_permanencia_nuevos_residentes"
    ),
    categoriaCatalogadaDesdeCodigo(
      "cantabria_desplazamiento_permanencia_nuevos_residentes"
    ),
    {
      tipo: "mixta",
      descripcion:
        "10% de gastos de traslado, máximo 1.000 euros, o 25% y 1.500 por traslado laboral; ejercicio de adquisición de residencia y tres siguientes, con arrastre cuatro años.",
    },
    [
      "Artículo 2.16 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 235 a 237.",
    ],
    [235, 236, 237],
    [
      "cantabria_desplazamiento_permanencia_nuevos_residentes:importe",
      "cantabria_desplazamiento_permanencia_nuevos_residentes:cumple",
    ],
    [
      "16. Deducción para compensar los gastos de desplazamiento y permanencia de nuevos residentes en Cantabria.",
      "1. Los contribuyentes que trasladen su residencia habitual a Cantabria desde otra Comunidad Autónoma, para compensar los gastos de desplazamiento y permanencia que se generan por cambiar de vivienda habitual, podrán beneficiarse de una deducción en la cuota íntegra autonómica del Impuesto sobre la Renta de las Personas Físicas siempre que se cumplan las siguientes condiciones:",
      "a) Que el contribuyente no haya tenido su residencia habitual en Cantabria durante los cuatro años anteriores a la fecha del traslado.",
      "b) Que el contribuyente mantenga su residencia habitual en Cantabria durante, al menos, los tres años inmediatamente posteriores al de la adquisición de la condición de residente.",
      "2. Esta deducción se aplicará en el período impositivo en el que se adquiera la condición de residente habitual en el territorio de Cantabria y durante los tres posteriores. En el supuesto de que se carezca de cuota íntegra autonómica suficiente para aplicar la totalidad de la deducción generada en cada periodo, el importe no deducido podrá compensarse exclusivamente en los cuatro ejercicios siguientes.",
      "3. Esta deducción, así como los importes que queden pendientes de compensación en ejercicios futuros, minorará la cuota íntegra autonómica en primer lugar.",
      "4. La cuantía de la deducción será:",
      "a) Con carácter general, el 10 por 100 de los gastos que se generen para el contribuyente como consecuencia del traslado de su domicilio fiscal a Cantabria con un máximo anual de 1000 euros.",
      "b) Cuando el traslado sea por motivos laborales, lo que se acreditará por cualquier medio de prueba admisible en derecho, el 25 por 100 % de los gastos que se generen para el contribuyente como consecuencia del traslado de su domicilio fiscal a Cantabria hasta un máximo de 1500 euros.",
      "5. A los efectos de la presente deducción, se considerarán gastos generados como consecuencia del traslado de domicilio los siguientes:",
      "a) Gastos de viaje y mudanza necesarios para el establecimiento del contribuyente y los miembros de su unidad familiar en Cantabria.",
      "b) Gastos derivados de la escolarización en Cantabria de los descendientes del contribuyente durante las etapas correspondientes a la enseñanza obligatoria y bachillerato.",
      "c) Gastos por arrendamiento de vivienda habitual del contribuyente en Cantabria, así como los gastos originados por la contratación de servicios o suministros vinculados a la misma, no incluyéndose el coste del servicio o suministro.",
      "6. La pérdida de la residencia en Cantabria en el período de obligación de mantenimiento de la residencia originará la pérdida de la deducción aplicada.",
      "Vivienda habitual: residencia efectiva y permanente, con ocupación en doce meses y permanencia continuada de tres años, salvo fallecimiento o circunstancias que necesariamente exijan el cambio o impidan la ocupación. La calificación se comprueba conforme a la normativa del IRPF.",
      "La unidad familiar se determina por el artículo 82 LIRPF a 31 de diciembre: cónyuges no separados y sus hijos legalmente incluidos, o un progenitor y todos los hijos que convivan con él en los supuestos legales; nadie pertenece a dos unidades familiares.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "cantabria_arrendamiento_viviendas_vacias",
    nombreCatalogadoDesdeCodigo("cantabria_arrendamiento_viviendas_vacias"),
    categoriaCatalogadaDesdeCodigo("cantabria_arrendamiento_viviendas_vacias"),
    {
      tipo: "mixta",
      descripcion:
        "500 euros por vivienda vacía al menos un año puesta en alquiler; prorrata por titularidad, duración efectiva de tres años, renta mensual hasta 1.000 euros y máximo tres viviendas por contribuyente.",
    },
    [
      "Artículo 2.17 del Decreto Legislativo 62/2008. Manual 2025, edición 21/10/2026, páginas físicas 237 a 238.",
      "El contribuyente no puede ser titular de más de tres viviendas, aunque solo pretenda deducir una. No arrendar a cónyuge ni familiares hasta tercer grado; si termina antes de tres años, nuevo alquiler en seis meses para conservar el derecho.",
    ],
    [237, 238],
    [
      "cantabria_arrendamiento_viviendas_vacias:importe",
      "cantabria_arrendamiento_viviendas_vacias:cumple",
    ],
    [
      "17. Deducción por el arrendamiento de viviendas vacías.",
      "1. Los contribuyentes propietarios o usufructuarios de viviendas vacías, durante al menos un año anterior a la celebración de un contrato de arrendamiento de vivienda sujeto a la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos, podrán deducir en la cuota íntegra autonómica 500 euros por cada uno de los bienes inmuebles destinados al arrendamiento de una vivienda.",
      "2. A estos efectos, se entenderá que una vivienda se encuentra vacía cuando no esté habitada, arrendada, en uso, ni afecta a actividades económicas.",
      "3. El importe de la deducción se prorrateará en función del porcentaje de participación en la propiedad del inmueble.",
      "4. Para aplicar esta deducción deberán cumplirse los siguientes requisitos:",
      "a) El contrato de arrendamiento deberá tener una duración efectiva de al menos tres años. No obstante, no se perderá el derecho a la deducción en caso de que el contrato de arrendamiento tenga una duración inferior a tres años cuando dicho inmueble pase a estar en situación de expectativa de alquiler y vuelva a ser objeto de un nuevo contrato de arrendamiento de vivienda dentro del plazo de seis meses desde la finalización del anterior contrato, siempre que la suma de los periodos de duración de ambos contratos de arrendamiento sea de al menos tres años.",
      "b) El arrendatario de la vivienda no podrá ser el cónyuge ni un pariente, por consanguinidad o por afinidad, hasta el tercer grado inclusive, del contribuyente.",
      "c) Que el precio mensual del alquiler de la vivienda incluidos sus anejos no supere 1.000 euros.",
      "d) Sólo podrán aplicar esta deducción los contribuyentes titulares de un máximo de tres viviendas.",
      "Se asimilan a los cónyuges las parejas que cumplan la Ley de Cantabria 1/2005 y estén inscritas en el registro cántabro o en los registros análogos previstos en la disposición adicional segunda. Esta equiparación autonómica no permite por sí sola tributar conjuntamente en el IRPF estatal.",
      "El arrendamiento de vivienda satisface la necesidad permanente de vivienda del arrendatario; el alquiler por temporada es uso distinto, conforme a los artículos 2 y 3 de la Ley 29/1994.",
    ]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CANTABRIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CANTABRIA_ARRENDAMIENTO_JOVENES_MAYORES_DISCAPACIDAD_2025,
  CANTABRIA_CUIDADO_FAMILIARES_2025,
  CANTABRIA_NACIMIENTO_ADOPCION_HIJOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
