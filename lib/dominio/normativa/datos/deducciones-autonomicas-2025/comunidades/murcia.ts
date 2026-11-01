import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada, fichaImplementadaFormula } from "../helpers"

export const MURCIA_GASTOS_GUARDERIA_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "murcia_gastos_guarderia",
    "Por gastos de guardería",
    "circunstancias_personales_familiares",
    {
      tipo: "porcentaje",
      porcentaje: "20",
      base: "gastos educativos de primer ciclo de Educación Infantil",
      limiteMaximoEuros: "1000",
    },
    [
      "20% de cantidades satisfechas",
      "Máximo 1.000 euros por hijo o descendiente",
      "Base imponible general + ahorro máximo 30.000 euros individual y 50.000 conjunta",
    ],
    [447, 448, 449]
  ),
  requisitos: [
    "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",

    "De acuerdo con lo establecido en el artículo 46.1.c) de la Ley 22/2009, de 18 de diciembre , por la que se regula el sistema de financiación de las Comunidades autónomas de régimen común y Ciudades con Estatuto de Autonomía y se modifican determinadas normas tributarias, se establece una deducción autonómica por gastos de guardería, con las siguientes condiciones:",
    "2. La base de deducción estará constituida por las cantidades satisfechas por los conceptos de custodia, alimentación y adquisición de vestuario de uso exclusivo escolar. A estos efectos las cantidades satisfechas a guarderías y centros de educación infantil por la preinscripción y matrícula de dichos menores se considerarán gastos de custodia. Dicha base de deducción se minorará en el importe de las becas y ayudas obtenidas de cualquier Administración Pública que cubran todos o parte de los gastos citados.",
    "3. La cantidad a deducir no excederá de 1.000 euros por cada uno de los hijos o descendientes que generen el derecho a la deducción.",
    "1. Los contribuyentes podrán deducir el 20 por 100 de las cantidades satisfechas por gastos educativos originados durante el período impositivo por los hijos o descendientes por los que tengan derecho al mínimo por descendientes regulado en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas, y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de No Residentes y sobre el Patrimonio, correspondientes a la etapa de Primer Ciclo de Educación Infantil a que se refiere el artículo 14.1 de la Ley Orgánica 2/2006, de 3 de mayo , de Educación, cursada en centros autorizados e inscritos por la Consejería competente en materia de educación.",
  ],
  limites: [
    "1. Los contribuyentes podrán deducir el 20 por 100 de las cantidades satisfechas por gastos educativos originados durante el período impositivo por los hijos o descendientes por los que tengan derecho al mínimo por descendientes regulado en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas, y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de No Residentes y sobre el Patrimonio, correspondientes a la etapa de Primer Ciclo de Educación Infantil a que se refiere el artículo 14.1 de la Ley Orgánica 2/2006, de 3 de mayo , de Educación, cursada en centros autorizados e inscritos por la Consejería competente en materia de educación.",
    "3. La cantidad a deducir no excederá de 1.000 euros por cada uno de los hijos o descendientes que generen el derecho a la deducción.",
    "4. Será requisito para la aplicación de esta deducción que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supere la cantidad de 30.000 euros, en declaraciones individuales y 50.000 euros en declaraciones conjuntas.",
    "6. Los contribuyentes deberán conservar, durante el plazo máximo de prescripción, las facturas acreditativas de los gastos previstos en el apartado 1.",
  ],
  prorrateo: [
    "5. Solo tendrán derecho a practicar la deducción los contribuyentes que convivan con los menores escolarizados. Cuando el menor conviva con más de un progenitor, tutor o adoptante, el importe de la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos, en caso de que optaran por tributación individual.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
}

export const MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "murcia_arrendamiento_vivienda_habitual",
    "Por arrendamiento de vivienda habitual",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "10",
      base: "cantidades no subvencionadas satisfechas por alquiler de vivienda habitual",
      limiteMaximoEuros: "300",
    },
    [
      "10% de cantidades no subvencionadas",
      "Máximo 300 euros anuales por contrato",
      "Base imponible general menos mínimo personal y familiar inferior a 40.000 euros",
      "Base imponible del ahorro no superior a 1.800 euros",
    ],
    [462, 463]
  ),
  requisitos: [
    "2. La base de esta deducción estará constituida por las cantidades justificadas con factura o recibo satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito, a las personas o entidades que sean arrendadores de la vivienda. En ningún caso, darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero en efectivo.",
    "3. Para la aplicación de esta deducción deberán cumplirse los siguientes requisitos:",
    "1) Que concurra en el contribuyente alguna de las siguientes circunstancias:",
    "a) Que el contribuyente tenga cuarenta años o menos a la fecha de devengo del impuesto.",
    "b) Que forme parte de una familia que tenga la consideración legal de numerosa.",
    "c) Que padezca una discapacidad con un grado reconocido igual o superior al 65 %.",
    "2) Que se trate del arrendamiento de la vivienda habitual del contribuyente, ocupada efectivamente por el mismo y localizada en el territorio de la Comunidad Autónoma de la Región de Murcia. El concepto de vivienda habitual será el contenido en la normativa del impuesto sobre la renta de las personas físicas.",
    "En caso de tributación conjunta, el requisito de la edad debe cumplirlo al menos uno de los cónyuges.",
    "5) Que ni el contribuyente ni ninguno de los miembros de su unidad familiar sean titulares de más del 50 % del pleno dominio o de un derecho real de uso o disfrute de otra vivienda.",
    "6) Que el contribuyente no tenga derecho durante el mismo período impositivo a deducción alguna por inversión en vivienda habitual.",
    "1. Los contribuyentes que durante el periodo impositivo satisfagan cantidades en concepto de alquiler de su vivienda habitual situada en la Comunidad Autónoma de la Región de Murcia podrán aplicar sobre la cuota íntegra autonómica una deducción del 10 % de las cantidades no subvencionadas satisfechas en el ejercicio, con el límite de 300 euros anuales por contrato de arrendamiento, tanto en tributación individual como en conjunta.",
  ],
  limites: [
    "1. Los contribuyentes que durante el periodo impositivo satisfagan cantidades en concepto de alquiler de su vivienda habitual situada en la Comunidad Autónoma de la Región de Murcia podrán aplicar sobre la cuota íntegra autonómica una deducción del 10 % de las cantidades no subvencionadas satisfechas en el ejercicio, con el límite de 300 euros anuales por contrato de arrendamiento, tanto en tributación individual como en conjunta.",
    "4) Que la base imponible general menos el mínimo personal y familiar del contribuyente sea inferior a 40.000 euros, siempre que la base imponible del ahorro no supere los 1.800 euros.",
  ],
  prorrateo: [
    "3) Que el contribuyente sea titular de un contrato de arrendamiento por el cual se haya presentado, a fecha de devengo del impuesto sobre la renta de las personas físicas, el correspondiente modelo del impuesto sobre transmisiones patrimoniales y actos jurídicos documentados. En el caso de que a esta fecha no hubiera finalizado el plazo de declaración por el del impuesto sobre transmisiones patrimoniales y actos jurídicos documentados, la presentación podrá realizarse antes de la finalización de dicho plazo. En el supuesto de matrimonios en régimen de gananciales, la deducción corresponderá a los cónyuges por partes iguales, aunque el contrato de arrendamiento conste sólo a nombre de uno de ellos.",
    "4. Cuando dos contribuyentes tengan derecho a la aplicación de la deducción, el importe total, sin exceder del límite establecido por contrato de arrendamiento, se prorrateará por partes iguales en la declaración de cada uno de ellos.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
}

export const MURCIA_GASTOS_VETERINARIOS_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "murcia_gastos_veterinarios",
    "Por gastos veterinarios",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "gastos por servicios veterinarios prestados a animales domésticos",
      limiteMaximoEuros: "100",
    },
    [
      "30% de cantidades satisfechas",
      "Límite máximo 100 euros anuales por declaración",
      "Base imponible general + ahorro máximo 25.000 euros individual y 40.000 conjunta",
    ],
    [479, 480]
  ),
  requisitos: [
    "3. La base de esta deducción estará constituida por las cantidades justificadas mediante la correspondiente factura.",
    "1. Los contribuyentes podrán aplicar una deducción del 30 % de las cantidades satisfechas en el período impositivo en concepto de gastos por servicios veterinarios prestados a sus animales domésticos. El importe máximo de la deducción será de 100 euros.",
  ],
  limites: [
    "1. Los contribuyentes podrán aplicar una deducción del 30 % de las cantidades satisfechas en el período impositivo en concepto de gastos por servicios veterinarios prestados a sus animales domésticos. El importe máximo de la deducción será de 100 euros.",
    "2. Será requisito para la aplicación de la deducción que la cantidad resultante de la suma de la base imponible general y del ahorro no supere la cantidad de 25.000 euros en declaraciones individuales y 40.000 euros en declaraciones conjuntas.",
  ],
  prorrateo: [],
  compatibilidades: [],
  incompatibilidades: [],
}

export const MURCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementadaFormula(
      "murcia_vivienda_jovenes_hasta_40",
      [440, 441, 442]
    ),
    requisitos: [
      "Remisión histórica estatal: el artículo 68.1 anterior a 2013 fija base máxima de 9.040 euros, con gastos y financiación; minoración por inversiones deducidas en viviendas anteriores y por ganancia exenta de reinversión. La DT 18 exige adquisición o pagos de construcción anteriores a 2013 y deducción previa, salvo la excepción del artículo 68.1.2.ª; rehabilitación/ampliación y adecuación requieren pagos anteriores a 2013 y terminación antes de 2017. Se separa el acceso al tramo estatal de la deducción regional propia.",

      "2. La base de esta deducción estará constituida por las cantidades satisfechas para la adquisición o rehabilitación de la vivienda incluidos los gastos originarios que hayan corrido a cargo del contribuyente, y, en el caso de financiación ajena, la amortización, los intereses y demás gastos derivados de la misma.",
      "3. Para poder aplicar esta deducción, será requisito indispensable que las cantidades satisfechas en el ejercicio por la adquisición de la vivienda que constituya o vaya a constituir la vivienda habitual, lo sean en viviendas de nueva construcción. A estos efectos se considerará vivienda nueva aquella cuya adquisición represente la primera transmisión de la misma con posterioridad a la declaración de obra nueva, siempre que no hayan transcurrido tres años desde ésta.",
      "4. Se entenderá por vivienda habitual la vivienda en la que el contribuyente resida por un plazo continuado de tres años. No obstante, se entenderá que la vivienda tuvo aquel carácter cuando, a pesar de no haber transcurrido dicho plazo, se produzca el fallecimiento del contribuyente o concurran circunstancias que necesariamente exijan el cambio de vivienda, tales como separación matrimonial, traslado laboral, obtención de primer empleo, de empleo más ventajoso u otros análogos.",
      "5. Se considerará rehabilitación de vivienda las obras en la misma que cumplan cualquiera de los siguientes requisitos:",
      "a) Que hayan sido calificadas o declaradas como actuación protegida en materia de rehabilitación de viviendas en los términos previstos en el Real Decreto 2066/2008, de 12 de diciembre , por el que se regula el Plan Estatal de Vivienda y Rehabilitación 2009-2012, o con aquellas normas de ámbito estatal o autonómico que las sustituyan.",
      "b) Los establecidos en la normativa reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "7. Las limitaciones a la deducción cuando se hubiera disfrutado de la deducción por otras viviendas habituales anteriores, cuando la enajenación de una vivienda habitual hubiera generado una ganancia patrimonial exenta por reinversión, así como las especialidades en caso de tributación conjunta, serán las establecidas con carácter general en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "8. La presente deducción requerirá que el importe comprobado del patrimonio del sujeto pasivo, al finalizar el período de la imposición, exceda del valor que arrojase su comprobación al final del mismo, al menos en la cuantía de las inversiones realizadas, de acuerdo con los requisitos establecidos con carácter general por la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "1. De acuerdo con lo dispuesto en el artículo 46.1 c), de la Ley 22/2009, de 18 de diciembre , por la que se regula el sistema de financiación de las comunidades autónomas de régimen común y ciudades con Estatuto de Autonomía y se modifican determinadas normas tributarias, se establece una deducción por inversión en vivienda habitual del 5 por 100 sobre la base de deducción, que podrán aplicar los contribuyentes con residencia habitual en la Región de Murcia cuya edad sea igual o inferior a 40 años en el momento del devengo del impuesto y cuya base imponible sea inferior a 40.000 euros, siempre que la base imponible del ahorro no supere los 1.800 euros.",
      "6. La base máxima de esta deducción vendrá constituida por el importe anual establecido como límite para la deducción de vivienda habitual contemplada en la normativa estatal, minorado en aquellas cantidades que constituyan para el contribuyente base de dicha deducción estatal, sin que en ningún caso la diferencia pueda ser negativa.",
      "En todo caso, el importe de la deducción prevista en el apartado 2 del artículo 1, Uno, del presente Texto Refundido no podrá superar los 300 euros anuales.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "9. La presente deducción será incompatible con la deducción por adquisición de nueva vivienda habitual o ampliación de la vivienda habitual actual por familias numerosas, establecida en el apartado Quince del presente artículo.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "5% máximo300; edad<=40; base imponible<40.000 y ahorro<=1.800; nueva construcción primera transmisión<=3 años declaración obra o rehabilitación elegible; base máxima estatal minorada base estatal; patrimonio y otras viviendas; incompatibleQuince; habitual3 años salvo excepciones.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_donativos_patrimonio_cultural_actividades",
      [442, 443, 444]
    ),
    requisitos: [
      "Ley de Mecenazgo, artículo 3: titulares de proyectos desarrollados en Murcia, incluidas las entidades culturales, científicas, tecnológicas, deportivas no profesionales y ambientales, administraciones, universidades, centros de investigación y profesionales previstos en ese artículo. Se excluyen incumplimientos tributarios, de Seguridad Social y de cuentas; tampoco beneficia al mecenas el proyecto de cónyuge, pareja estable o parientes hasta tercer grado, ni las participaciones comunes o interés fraudulento descritos en el artículo. El crédito fiscal del artículo 12 es una cantidad reconocida por la Administración para pagar derechos públicos; no equivale por sí solo a una deducción reconocida.",

      "1. De acuerdo con lo establecido en el artículo 46.1.c) de la Ley 22/2009, de 18 de diciembre , por la que se regula el sistema de financiación de las Comunidades autónomas de régimen común y Ciudades con Estatuto de Autonomía y se modifican determinadas normas tributarias, se establece una deducción en la cuota íntegra autonómica por las donaciones dinerarias puras y simples efectuadas durante el período impositivo, de acuerdo con las siguientes condiciones:",
      "a) El importe a deducir será el 50 % de las cantidades donadas.",
      "b) Las donaciones deberán realizarse a favor de cualquiera de los titulares de los proyectos que reciben aportaciones del mecenas recogidos en el artículo 3 de la Ley de Mecenazgo de la Región de Murcia.",
      "c) En todo caso, las cantidades donadas deberán tener como destino la protección del patrimonio cultural de la Región de Murcia o la promoción de actividades culturales, artísticas, sociales, científico-tecnológicas y medioambientales.",
      "d) En el caso de que por las cantidades donadas el contribuyente aplique las deducciones estatales por donativos previstas en la normativa reguladora del Impuesto sobre la Renta de las Personas Físicas, la base de deducción autonómica se minorará en las cantidades que constituyan la base de deducción en aquellas.",
      "5. La efectividad de los donativos y aportaciones deducibles se justificará mediante certificación expedida por la entidad beneficiaria, que contenga los siguientes datos:",
      "a) El número de identificación fiscal y los datos de identificación personal del donante y de la entidad donataria.",
      "b) Mención expresa de que la entidad donataria se encuentra incluida en las reguladas en el artículo 3 de la Ley de Mecenazgo de la Región de Murcia.",
      "c) Fecha e importe del donativo cuando este sea dinerario.",
      "d) Documento público u otro documento auténtico que acredite la entrega del bien donado cuando no se trate de donativos en dinero. Cuando se trate de dinero la entrega del importe donado deberá realizarse necesariamente mediante transferencia bancaria, cuyos datos identificativos deberán asimismo constar en la certificación.",
      "e) Destino que la entidad donataria dará al objeto donado en el cumplimiento de su finalidad específica.",
      "f) Mención expresa del carácter irrevocable de la donación, sin perjuicio de lo establecido en las normas imperativas civiles que regulan la revocación de donaciones.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "4. Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere el artículo 12 de la Ley de Mecenazgo de la Comunidad Autónoma de la Región de Murcia, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "50% donativo dinerario puro y simple a titulares art.3 Ley Mecenazgo; fines culturales/artísticos/sociales/ciencia/ambiente; restar base donativo estatal; incompatibilidad crédito fiscal12; certificado5 y transferencia.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_donativos_investigacion_biosanitaria",
      [444, 445]
    ),
    requisitos: [
      "Ley de Mecenazgo, artículo 3: titulares de proyectos desarrollados en Murcia, incluidas las entidades culturales, científicas, tecnológicas, deportivas no profesionales y ambientales, administraciones, universidades, centros de investigación y profesionales previstos en ese artículo. Se excluyen incumplimientos tributarios, de Seguridad Social y de cuentas; tampoco beneficia al mecenas el proyecto de cónyuge, pareja estable o parientes hasta tercer grado, ni las participaciones comunes o interés fraudulento descritos en el artículo. El crédito fiscal del artículo 12 es una cantidad reconocida por la Administración para pagar derechos públicos; no equivale por sí solo a una deducción reconocida.",

      "2. De acuerdo con lo establecido en el artículo 46.1.c) de la Ley 22/2009, de 18 de diciembre , por la que se regula el sistema de financiación de las Comunidades autónomas de régimen común y Ciudades con Estatuto de Autonomía y se modifican determinadas normas tributarias, se establece una deducción en la cuota íntegra autonómica por las donaciones dinerarias puras y simples efectuadas durante el período impositivo, de acuerdo con las siguientes condiciones:",
      "a) El importe a deducir será el 50 % de las cantidades donadas.",
      "b) En todo caso, las cantidades donadas deberán tener como destino la investigación biosanitaria a que se refiere la Ley 4/1994, de 26 de julio , de Salud de la Región de Murcia.",
      "c) Las donaciones deberán realizarse a favor de cualquiera de las siguientes entidades:",
      "1.º) La Comunidad Autónoma de la Región de Murcia, así como las entidades dependientes del sector público autonómico que ejerzan la actividad reseñada en la letra b). A estos efectos, se incluye a las universidades públicas de la Comunidad Autónoma de la Región de Murcia.",
      "2.º) Las entidades sin fines lucrativos a que se refieren los artículos 2 y 3 de la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, siempre que entre sus fines principales se encuentre alguno de los reseñados en la letra b) y se hallen inscritas en los registros correspondientes de la Comunidad Autónoma de la Región de Murcia.",
      "d) En el caso en que por las cantidades donadas el contribuyente aplique las deducciones estatales por donativos previstas en la normativa reguladora del Impuesto sobre la Renta de las Personas Físicas, la base de deducción autonómica se minorará en las cantidades que constituyan la base de deducción en aquellas.",
      "5. La efectividad de los donativos y aportaciones deducibles se justificará mediante certificación expedida por la entidad beneficiaria, que contenga los siguientes datos:",
      "a) El número de identificación fiscal y los datos de identificación personal del donante y de la entidad donataria.",
      "b) Mención expresa de que la entidad donataria se encuentra incluida en las reguladas en el artículo 3 de la Ley de Mecenazgo de la Región de Murcia.",
      "c) Fecha e importe del donativo cuando este sea dinerario.",
      "d) Documento público u otro documento auténtico que acredite la entrega del bien donado cuando no se trate de donativos en dinero. Cuando se trate de dinero la entrega del importe donado deberá realizarse necesariamente mediante transferencia bancaria, cuyos datos identificativos deberán asimismo constar en la certificación.",
      "e) Destino que la entidad donataria dará al objeto donado en el cumplimiento de su finalidad específica.",
      "f) Mención expresa del carácter irrevocable de la donación, sin perjuicio de lo establecido en las normas imperativas civiles que regulan la revocación de donaciones.",
    ],
    limites: [],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "4. Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere el artículo 12 de la Ley de Mecenazgo de la Comunidad Autónoma de la Región de Murcia, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "50% dinerario para investigación biosanitaria a región/universidad pública o entidad49/2002 elegible inscrita; minorar base estatal; incompatible crédito fiscal12 y certificado5/transferencia.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_donaciones_bienes_patrimonio_cultural",
      [445, 446, 447]
    ),
    requisitos: [
      "Ley de Mecenazgo, artículo 3: titulares de proyectos desarrollados en Murcia, incluidas las entidades culturales, científicas, tecnológicas, deportivas no profesionales y ambientales, administraciones, universidades, centros de investigación y profesionales previstos en ese artículo. Se excluyen incumplimientos tributarios, de Seguridad Social y de cuentas; tampoco beneficia al mecenas el proyecto de cónyuge, pareja estable o parientes hasta tercer grado, ni las participaciones comunes o interés fraudulento descritos en el artículo. El crédito fiscal del artículo 12 es una cantidad reconocida por la Administración para pagar derechos públicos; no equivale por sí solo a una deducción reconocida.",

      "3. Los contribuyentes podrán deducirse de la cuota íntegra autonómica del impuesto el 15 % de las donaciones puras y simples efectuadas durante el período impositivo de bienes que, formando parte del patrimonio cultural de la Comunidad Autónoma de la Región de Murcia, se encuentren inscritos en el Inventario del Patrimonio Cultural de la Comunidad Autónoma de la Región de Murcia, siempre que se realicen a favor de cualquiera de las siguientes entidades:",
      "a) La Comunidad Autónoma de la Región de Murcia y las Corporaciones Locales de la Región, así como las Entidades Públicas de carácter cultural dependientes de cualquiera de ellas.",
      "b) Las universidades que desarrollen su actividad docente e investigadora en el territorio de la región, los Centros de Investigación y los Centros Superiores de Enseñanzas Artísticas de la región.",
      "c) Las entidades sin fines lucrativos reguladas en los apartados a) y b) del artículo 2 de la Ley 49/2002, de 23 de diciembre , de Régimen Fiscal de las Entidades sin Fines Lucrativos y de los Incentivos Fiscales al Mecenazgo, siempre que persistan fines de naturaleza exclusivamente cultural y se hallen inscritas en los correspondientes registros de la Comunidad Autónoma de la Región de Murcia.",
      "La base de la deducción será el valor contable que tuviesen los bienes donados en el momento de la transmisión y, en su defecto, el valor determinado conforme a las normas del impuesto sobre el patrimonio.",
      "5. La efectividad de los donativos y aportaciones deducibles se justificará mediante certificación expedida por la entidad beneficiaria, que contenga los siguientes datos:",
      "a) El número de identificación fiscal y los datos de identificación personal del donante y de la entidad donataria.",
      "b) Mención expresa de que la entidad donataria se encuentra incluida en las reguladas en el artículo 3 de la Ley de Mecenazgo de la Región de Murcia.",
      "c) Fecha e importe del donativo cuando este sea dinerario.",
      "d) Documento público u otro documento auténtico que acredite la entrega del bien donado cuando no se trate de donativos en dinero. Cuando se trate de dinero la entrega del importe donado deberá realizarse necesariamente mediante transferencia bancaria, cuyos datos identificativos deberán asimismo constar en la certificación.",
      "e) Destino que la entidad donataria dará al objeto donado en el cumplimiento de su finalidad específica.",
      "f) Mención expresa del carácter irrevocable de la donación, sin perjuicio de lo establecido en las normas imperativas civiles que regulan la revocación de donaciones.",
    ],
    limites: [
      "El valor determinado de acuerdo con lo dispuesto en el apartado anterior tendrá como límite máximo el valor normal en el mercado del bien o derecho transmitido en el momento de su transmisión.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "4. Las deducciones establecidas en este artículo resultarán incompatibles con el crédito fiscal a que se refiere el artículo 12 de la Ley de Mecenazgo de la Comunidad Autónoma de la Región de Murcia, en tanto el referido crédito fiscal permanezca vigente.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15% bien inscrito inventario regional a beneficiario elegible; valor contable o patrimonio, limitado mercado; certificado/documento entrega; incompatible crédito fiscal12.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_dispositivos_ahorro_agua", [449, 450]),
    requisitos: [
      "1. De acuerdo con lo previsto en el artículo 46.1.c) de la Ley 22/2009, de 18 de diciembre , por la que se regula el sistema de financiación de las Comunidades autónomas de régimen común y Ciudades con Estatuto de Autonomía y se modifican determinadas normas tributarias, se establece para los contribuyentes del Impuesto sobre la Renta de las Personas Físicas con residencia habitual en la Región de Murcia una deducción en el tramo autonómico del citado Impuesto del 20% de las inversiones realizadas en dispositivos domésticos de ahorro de agua, de acuerdo con lo establecido en el artículo 4 de la Ley 6/2006, de 21 de julio , de ahorro de agua, sobre incremento de las medidas de ahorro y conservación en el consumo de agua en la Comunidad Autónoma de la Región de Murcia.",
      "2. La base de esta deducción estará constituida por las cantidades satisfechas para la adquisición e instalación de los dispositivos domésticos de ahorro de agua que hayan corrido a cargo del contribuyente.",
      "3. Para poder aplicar esta deducción, será requisito indispensable que las cantidades satisfechas en el ejercicio lo sean para la adquisición e instalación de los dispositivos domésticos de ahorro de agua en viviendas que constituyan la vivienda habitual del contribuyente, conforme a la definición que de la misma se realiza en el artículo 1, Uno, 5, de este Texto Refundido.",
    ],
    limites: [
      "4. La base máxima anual de esta deducción se establece en la cantidad de 300 euros, sin que, en todo caso, el importe de la citada deducción pueda superar los 60 euros anuales.",
      "5. La deducción establecida en este apartado Cuatro requerirá el reconocimiento previo de la Administración regional sobre su procedencia en la forma que reglamentariamente se determine, consistiendo en todo caso en un procedimiento de un solo y simple acto que dé la máxima facilidad al contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% adquisición+instalación; base<=300 y deducción<=60 anual; dispositivos art.4 Ley6/2006 en habitual y reconocimiento previo regional. No aplicar corrección alquiler2024 a este apartado.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_instalaciones_recursos_energeticos_renovables",
      [450, 451, 452]
    ),
    requisitos: [
      "1. De acuerdo con lo establecido en el artículo 46.1.c) de la Ley 22/2009, de 18 de diciembre , por la que se regula el sistema de financiación de las comunidades autónomas de régimen común y Ciudades con Estatuto de Autonomía y se modifican determinadas normas tributarias, se establece una deducción en la cuota íntegra autonómica por la inversión en instalación de sistemas destinados al aprovechamiento de energías renovables, de acuerdo con las siguientes condiciones:",
      "2. Solo darán derecho a la deducción las inversiones en la adquisición e instalación en la vivienda habitual de sistemas que empleen energías renovables destinadas exclusivamente al autoconsumo para las que se haya presentado la declaración responsable ante el órgano competente, cuando esta venga exigida por la normativa aplicable.",
      "En el caso del sistema de aprovechamiento de energía fotovoltaica, la deducción no será aplicable a la modalidad con excedentes no acogida a compensación.",
      "El concepto de vivienda habitual será el contemplado en la normativa reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "Se entiende por energías renovables aquellas a las que se refiere el artículo 2.a) de la Directiva (UE) 2018/2001 del Parlamento Europeo y del Consejo, de 11 de diciembre de 2018 , relativa al fomento del uso de energía procedente de fuentes renovables.",
      "3. También resultará de aplicación esta deducción a las inversiones realizadas en viviendas destinadas al arrendamiento, siempre que este arrendamiento no tenga la consideración de actividad económica, según lo establecido en el artículo 27.2 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio.",
      "4. La base de deducción estará constituida por las cantidades satisfechas por el contribuyente durante el ejercicio por la totalidad del coste de la instalación, con exclusión de las ayudas y subvenciones percibidas para esta finalidad.",
      "El gasto de instalación energética se deberá justificar a través de factura emitida por instalador habilitado que debe cumplir todas las condiciones establecidas en el Reglamento por el que se regulan las obligaciones de facturación aprobado por el Real Decreto 1619/2012, de 30 de noviembre .",
      "Las cantidades satisfechas a los instaladores que realicen la instalación deberán realizarse mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuentas en entidades de crédito. En ningún caso darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero de curso legal.",
      "5. El importe de la deducción será el siguiente:",
      "a) En caso de declaración individual:",
      "b) En caso de declaración conjunta:",
      "6. En el caso de que esta deducción concurra con otras deducciones autonómicas, ésta se aplicará en último lugar.",
      "7. En el caso de que la inversión se realice a través de una Comunidad de Propietarios, para tener acceso a la deducción por parte de los comuneros será necesario acreditar dicha inversión por medio de certificado emitido por el representante legal de la Comunidad, en el que se indique el coeficiente de participación y las aportaciones económicas que corresponda a cada comunero. La deducción podrá aplicarla cada uno de los propietarios individualmente en el porcentaje que le corresponda en la comunidad de propietarios.",
      "8. La deducción solo será aplicable a las inversiones realizadas en viviendas radicadas en la Región de Murcia.",
    ],
    limites: [
      "En ningún caso el importe de la deducción podrá superar los 7.000 euros.",
      "1.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es inferior a 35.000 euros, el 50 por 100 de la base de deducción.",
      "2.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 35.000 euros e inferior a 45.000 euros, el 37,50 por 100 de la base de deducción.",
      "3.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 45.000 euros e inferior a 60.000 euros, el 25 por 100 de la base de deducción.",
      "4.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 60.000 euros, no habrá derecho a la deducción.",
      "1.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es inferior a 50.000 euros, el 50 por 100 de la base de deducción.",
      "2.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 50.000 euros e inferior a 75.000 euros, el 37,50 por 100 de la base de deducción.",
      "3.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 75.000 euros e inferior 95.000 euros, el 25 por 100 de la base de deducción.",
      "4.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 95.000 euros, no habrá derecho a la deducción.",
      "Si el importe de la deducción no pudiera aplicarse en su totalidad en el periodo impositivo de la realización de la inversión, por insuficiencia de la cuota íntegra autonómica, la cantidad restante podrá ser aplicada, como máximo, en los dos periodos impositivos posteriores.",
    ],
    prorrateo: [
      "Cuando exista más de un contribuyente con derecho a practicar la deducción por una misma vivienda, el importe y el límite máximo de la citada deducción se prorrateará en la declaración de cada uno de ellos en proporción a la cantidad invertida.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "50/37,50/25% según renta individual <35.000/<45.000/<60.000; conjunta<50.000/<75.000/<95.000; resto sin derecho; máximo7.000 y reparto proporcional inversión; ayudas restan; autoconsumo salvo excedentes no compensados, habitual o alquiler no actividad en Murcia; factura/pago bancario/declaración responsable; último lugar y arrastre2 años.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_inversion_entidades_nuevas_reciente_creacion",
      [452, 453, 454]
    ),
    requisitos: [
      "a) La participación del contribuyente, computada junto con las del cónyuge o personas unidas por razón de parentesco, en línea directa o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no puede ser superior al 40 % del capital social de la sociedad objeto de la inversión o de sus derechos de voto en ningún momento y durante los tres años siguientes a la constitución o ampliación.",
      "b) La entidad en la que hay que materializar la inversión debe cumplir los siguientes requisitos:",
      "1. Debe tener el domicilio social y fiscal en la Comunidad Autónoma de la Región de Murcia y mantenerlo durante los tres años siguientes a la constitución o ampliación.",
      "2. Debe desempeñar una actividad económica durante los tres años siguientes a la constitución o ampliación. A tal efecto, no debe tener por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo dispuesto en el artículo 4.Ocho. Dos. a) de la Ley 19/1991, de 6 de junio , del Impuesto sobre el Patrimonio.",
      "3. Debe contar, como mínimo y desde el primer ejercicio fiscal, con una persona contratada con contrato laboral y a jornada completa, dadas de alta en el régimen general de la Seguridad Social, durante los tres años siguientes a la constitución o ampliación.",
      "4. En caso de que la inversión se realizase mediante una ampliación de capital, la sociedad mercantil debió haber sido constituida en los tres años anteriores a la fecha de esta ampliación, y que además, durante los veinticuatro meses siguientes a la fecha del inicio del período impositivo del Impuesto sobre Sociedades en el que hubiese realizado la ampliación, su plantilla media se hubiese incrementado, al menos en dos personas, con respecto a la plantilla media de los doce meses anteriores, y que dicho incremento se mantenga durante un período adicional de otros veinticuatro meses.",
      "Para el cálculo de la plantilla media total de la empresa y de su incremento se tomarán las personas empleadas, en los términos que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación a la jornada completa.",
      "c) El contribuyente puede formar parte del consejo de administración de la sociedad en la que materializó la inversión, pero en ningún caso puede llevar a cabo funciones ejecutivas ni de dirección durante un plazo de diez años. Tampoco puede mantener una relación laboral con la entidad objeto de la inversión durante ese mismo plazo.",
      "d) Las operaciones en las que sea aplicable la deducción deben formalizarse en escritura pública, en la que se debe especificar la identidad de los inversores y el importe de la inversión respectiva.",
      "e) Las participaciones adquiridas deben mantenerse en el patrimonio del contribuyente durante un período mínimo de tres años, siguientes a la constitución o ampliación.",
      "f) La aplicación de la deducción requerirá la comunicación previa a la Administración regional en la forma que reglamentariamente se determine.",
      "2. El incumplimiento de los requisitos anteriores conlleva la pérdida del beneficio fiscal, de conformidad con la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica, y con un límite de 4.000 euros, el 20 % de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en sociedades anónimas, limitadas, anónimas laborales, limitadas laborales o cooperativas, siempre que se cumplan los siguientes requisitos:",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "3. La deducción contenida en este apartado resultará incompatible, para las mismas inversiones, con la deducción autonómica por inversión en acciones de entidades que cotizan en el segmento de empresas en expansión del mercado alternativo bursátil.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% máximo4.000; participación familiar hasta tercero<=40%; domicilio/actividad/empleo1 durante3 años; ampliación antigüedad<=3 e incremento2 empleados24+24 meses; no ejecución/dirección ni relación laboral10 años; escritura/comunicación previa; mantener3 años; incompatibleSiete yVeinticuatro.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_inversion_mab", [454, 455, 456]),
    requisitos: [
      "2. Para poder aplicar la deducción a la que se refiere el apartado 1 deben cumplirse los siguientes requisitos:",
      "a) La participación conseguida por el contribuyente en la sociedad objeto de la inversión no puede ser superior al 10 % de su capital social.",
      "b) Las acciones adquiridas deben mantenerse en el patrimonio del contribuyente durante un período de dos años, como mínimo.",
      "c) La sociedad objeto de la inversión debe tener el domicilio social y fiscal en la Comunidad Autónoma de la Región de Murcia, y no debe tener como actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo dispuesto por el artículo 4.Ocho. Dos. a) de la Ley 19/1991, de 6 de junio , del Impuesto sobre el Patrimonio.",
      "d) Los requisitos indicados en las letras a) y c) anteriores deberán cumplirse durante todo el plazo de mantenimiento indicado en la letra b), contado desde la fecha de adquisición de la participación.",
      "e) Las operaciones en las que sea aplicable la deducción deben formalizarse en escritura pública, en la que se debe especificar la identidad de los inversores y el importe de la inversión respectiva.",
      "f) La aplicación de la deducción requerirá la comunicación previa a la Administración regional en la forma que reglamentariamente se determine.",
      "3. El incumplimiento de los requisitos anteriores conlleva la pérdida del beneficio fiscal, de conformidad con la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir en la cuota íntegra autonómica, y con un límite de 10.000 euros, el 20 % de las cantidades invertidas durante el ejercicio en la adquisición de acciones como consecuencia de acuerdos de ampliación de capital suscritos por medio del segmento de empresas en expansión del mercado alternativo bursátil, aprobado por acuerdo del Consejo de Ministros de 30 de diciembre de 2005.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "4. La deducción contenida en este apartado resultará incompatible, para las mismas inversiones, con la deducción autonómica por inversión en la adquisición de acciones o participaciones sociales en entidades nuevas o de reciente creación.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% máximo10.000; ampliación MAB expansión; <=10%,mantener2 años; domicilio Murcia,no patrimonial durante plazo; escritura/comunicación previa; incompatibleSeis yVeinticuatro; regularizar incumplimiento.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_material_escolar_libros_texto",
      [456, 457]
    ),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",

      "1. Los contribuyentes podrán aplicar una deducción autonómica por la adquisición de material escolar y libros de texto derivados de la escolarización de sus descendientes en el segundo ciclo de educación infantil, educación primaria y educación secundaria obligatoria.",
      "3. Tendrán derecho a esta deducción quienes cumplan los siguientes requisitos:",
      "a) En el supuesto de contribuyentes que no formen parte de una unidad familiar que tenga la condición legal de familia numerosa:",
      "b) En el supuesto de contribuyentes que formen parte de una unidad familiar que tenga la condición legal de familia numerosa:",
      "5. Para la aplicación de la presente deducción, sólo se tendrán en cuenta aquellos descendientes que den derecho a la aplicación del mínimo por descendientes en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio.",
      "6. El importe de la deducción deberá minorarse, por cada descendiente, en la cantidad correspondiente a las becas y ayudas obtenidas en el período impositivo procedentes de la Comunidad Autónoma de la Región de Murcia o de cualquier otra Administración Pública, que cubra la totalidad o parte de los gastos por adquisición de material escolar o libros de texto.",
    ],
    limites: [
      "2. El importe de la deducción será de 120 euros por cada descendiente.",
      "1.º En caso de declaración individual, aquellos en que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supere los 20.000 euros.",
      "2.º En caso de declaración conjunta, aquellos en que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supere los 40.000 euros.",
      "1.º En caso de declaración individual, aquellos en que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supere los 33.000 euros.",
      "2.º En caso de declaración conjunta, aquellos en que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supere los 53.000 euros.",
    ],
    prorrateo: [
      "4. La deducción corresponderá al ascendiente que haya satisfecho las cantidades destinadas a la adquisición de los libros de texto y del material escolar. Cuando exista más de un declarante con derecho a la aplicación de la deducción, el importe de la misma se prorrateará por partes iguales en la declaración de cada uno de ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "120 por descendiente con mínimo, segundo infantil/primaria/ESO; renta<=20.000/40.000 o familia numerosa<=33.000/53.000; pagador y reparto igual entre declarantes con derecho; becas minoran deducción por hijo.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_nacimiento_adopcion", [457, 458]),
    requisitos: [
      "1. Los contribuyentes podrán deducir, por cada hijo nacido o adoptado en el período impositivo en el que se produzca el nacimiento o la adopción, las siguientes cantidades:",
      "4. En el caso de que el número de hijos de cada progenitor dé lugar a la aplicación de un importe diferente, ambos se aplicarán la deducción que corresponda en función del número de hijos preexistente. Si dándose esta circunstancia la declaración fuere conjunta, la deducción será la suma de lo que a cada uno correspondería si la declaración fuera individual, según lo dispuesto en el párrafo anterior.",
    ],
    limites: [
      "a) 100 euros si se trata del primer hijo.",
      "b) 200 euros si se trata del segundo hijo.",
      "c) 300 euros si se trata del tercer hijo o sucesivos.",
      "2. Será requisito para la aplicación de la deducción que la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supere la cantidad de 30.000 euros, en declaraciones individuales, y 50.000 euros en declaraciones conjuntas.",
    ],
    prorrateo: [
      "3. Cuando los hijos nacidos o adoptados en el periodo impositivo convivan con ambos progenitores o adoptantes y estos sean declarantes con derecho a la aplicación de la deducción, el importe de la misma se practicará por mitad en la declaración de cada uno de los progenitores o adoptantes, salvo que estos tributen presentando una única declaración conjunta, en cuyo caso se aplicará en la misma la totalidad del importe que corresponda por esta deducción.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "100/200/300 primer/segundo/tercero+; año del evento; renta<=30.000/50.000; mitad con dos declarantes elegibles individuales; conjunta suma derechos según orden preexistente de cada padre.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_contribuyentes_discapacidad", [458]),
    requisitos: [],
    limites: [
      "1. Los contribuyentes que tengan acreditado un grado de discapacidad igual o superior al 33 % tendrán derecho a aplicar en la cuota íntegra autonómica del Impuesto sobre la Renta de las Personas Físicas una deducción de 150 euros.",
      "2. Tendrán derecho a aplicar esta deducción aquellos contribuyentes cuando la suma de las bases imponibles general y del ahorro no sea superior a 40.000 euros, ya sea tributación individual o conjunta.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "150; discapacidad>=33%; renta general+ahorro<=40.000 tanto individual como conjunta; acreditación regional.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_conciliacion", [458, 459, 460, 461]),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",
      "Remisión a los artículos 59 y 61 LIRPF: ascendiente mayor de 65 años o con discapacidad cualquiera que sea su edad, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros; convivencia al menos la mitad del período, con regla especial si fallece y asimilación de internamiento de ascendiente con discapacidad dependiente. El grado de parentesco determina la prioridad del mínimo.",

      "La deducción resultará aplicable por las cotizaciones efectuadas en los meses del periodo impositivo en los que el contribuyente tenga, al menos, un hijo menor de 12 años por el que se aplique el mínimo por descendientes.",
      "2. Para la aplicación de la presente deducción deben cumplirse los siguientes requisitos:",
      "a) El contribuyente debe estar en situación de alta en la Seguridad Social como empleador titular de un hogar familiar, tener contratada y cotizar por una o varias personas por el Sistema Especial de Empleados de Hogar del Régimen General de la Seguridad Social durante el periodo en que se pretenda aplicar la deducción.",
      "c) Que el titular del hogar familiar y, en su caso, su cónyuge o pareja de hecho, sean madres o padres de hijos que formen parte de la unidad familiar.",
      "d) Que el titular del hogar familiar y, en su caso, el cónyuge o pareja de hecho que formen parte de la unidad familiar, perciban rendimientos del trabajo o de actividades económicas.",
      "a) El contribuyente debe estar en situación de alta en la Seguridad Social como empleador y tener contratada y cotizar por una o varias personas por el Sistema Especial de Empleados de Hogar del Régimen General de la Seguridad Social durante el periodo en que se pretenda aplicar la deducción.",
      "c) Que el contribuyente perciba rendimientos del trabajo o de actividades económicas.",
    ],
    limites: [
      "1. Los contribuyentes que tengan contratada a una persona para atender o cuidar a descendientes menores por razones de conciliación por la que se efectúen cotizaciones por el Sistema Especial de Empleados de Hogar del Régimen General de la Seguridad Social podrán deducir el 20 por ciento de las cuotas ingresadas por tales cotizaciones con el límite de deducción de 400 euros anuales.",
      "b) La cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no debe superar la cantidad de 34.000 euros, en la unidad familiar",
      "3. Los contribuyentes que tengan contratada a una persona para atender o cuidar a mayores de sesenta y cinco años que estén a su cuidado y por los que se apliquen el mínimo por ascendientes podrán deducir el 20 por ciento de las cuotas ingresadas por tales cotizaciones con el límite de deducción de 400 euros anuales, siempre que se cumplan los siguientes requisitos:",
      "b) La cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro del contribuyente no debe superar la cantidad de 34.000 euros.",
      "4. Para la aplicación simultánea por un mismo contribuyente de las deducciones previstas en los apartados anteriores se requerirá que se haya contratado a personas distintas para las funciones citadas, con un límite máximo en total en ese caso de 800 euros anuales.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% cuotas hogar máximo400 menores<12 por meses, renta unidad<=34.000,empleador y otro progenitor trabajo/actividad; mayores>65 con mínimo:20% máximo400,renta personal<=34.000; simultáneas requieren personas contratadas distintas, máximo800.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_acogimiento_mayores_65_discapacidad",
      [461]
    ),
    requisitos: [
      "2. No se podrá practicar la presente deducción en el supuesto de acogimiento de mayores de sesenta y cinco años, cuando el acogido esté ligado al contribuyente por un vínculo de parentesco de consanguinidad o de afinidad de grado igual o inferior al cuarto.",
      "El contribuyente que desee gozar de la deducción deberá obtener certificado expedido por el órgano competente de la Administración regional acreditativo de que ni el contribuyente ni la persona acogida, han recibido ayudas de la Comunidad de Murcia vinculadas al acogimiento, y acreditar la convivencia en el domicilio de las personas acogidas mediante el correspondiente certificado de empadronamiento.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducir 600 euros por cada persona mayor de sesenta y cinco años o con discapacidad igual o superior al 33 por 100, que conviva con el contribuyente durante más de ciento ochenta y tres días al año en régimen de acogimiento sin contraprestación, cuando no diera lugar a la obtención de ayudas o subvenciones de la Comunidad de Autónoma de la Región de Murcia.",
    ],
    prorrateo: [
      "3. Cuando la persona acogida genere el derecho a la deducción para más de un contribuyente simultáneamente, el importe de la misma se prorrateará por partes iguales en la declaración de cada uno de ellos si optaran por tributación individual.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "600 por >65 o discapacidad>=33%, >183 días,sin contraprestación ni ayudas,excluir parentesco hasta cuarto para mayores; reparto igual individual; certificado ayudas y empadronamiento.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_mujeres_trabajadoras", [463, 464, 465]),
    requisitos: [
      "1. Las mujeres que realicen una actividad por cuenta propia o ajena por la cual estén dadas de alta en el régimen correspondiente de la Seguridad Social o mutualidad, podrán deducir las siguientes cantidades por cada hijo menor de 18 años o persona dependiente a su cargo:",
      "4. El importe de la deducción por hijo a cargo se calculará de forma proporcional al número de días trabajados.",
      "5. Una misma persona no podrá dar derecho a la aplicación de más de una deducción de las previstas en el apartado 1.",
    ],
    limites: [
      "– 300 euros si se trata del primer hijo.",
      "– 350 euros si se trata del segundo hijo.",
      "– 400 euros si se trata del tercer hijo o sucesivos.",
      "– 400 euros por persona dependiente a su cargo.",
      "2. Será requisito para la aplicación de la deducción que la cantidad resultante de la suma de la base imponible general y del ahorro no supere la cantidad de 20.000 euros en declaraciones individuales y 40.000 euros en declaraciones conjuntas.",
      "3. Se considera persona dependiente, a efectos de esta deducción, al ascendiente mayor de 75 años y al ascendiente o descendiente con un grado de discapacidad igual o superior al 65 por 100, cualquiera que sea su edad. Para la aplicación de la deducción será requisito que dicha persona conviva con el contribuyente durante más de ciento ochenta y tres días al año.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "300/350/400 por hijo<18 según orden y400 dependiente; actividad alta SS/mutualidad; renta<=20.000/40.000; dependiente ascendiente>75 o ascendiente/descendiente discapacidad>=65%,convivencia>183 días; hijos proporcional días trabajados; sin doble deducción misma persona.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_nueva_vivienda_o_ampliacion_familias_numerosas",
      [465, 466]
    ),
    requisitos: [
      "Remisión histórica estatal: el artículo 68.1 anterior a 2013 fija base máxima de 9.040 euros, con gastos y financiación; minoración por inversiones deducidas en viviendas anteriores y por ganancia exenta de reinversión. La DT 18 exige adquisición o pagos de construcción anteriores a 2013 y deducción previa, salvo la excepción del artículo 68.1.2.ª; rehabilitación/ampliación y adecuación requieren pagos anteriores a 2013 y terminación antes de 2017. Se separa el acceso al tramo estatal de la deducción regional propia.",

      "1. Se establece para los contribuyentes del impuesto sobre la renta de las personas físicas con residencia habitual en la Región de Murcia que sean miembros de una familia que tenga la condición legal de familia numerosa una deducción en la cuota íntegra autonómica del 10 % de la cantidad destinada a la adquisición de una nueva vivienda habitual. En el caso de familias numerosas de categoría especial el porcentaje de deducción será del 15 %. Para la aplicación de esta deducción deberán cumplirse las siguientes condiciones:",
      "a) Que la adquisición de la nueva vivienda habitual tenga lugar dentro de los cinco años siguientes a la fecha en que la familia del sujeto pasivo haya alcanzado la consideración legal de numerosa o, si ya lo fuese con anterioridad, en el plazo de los cinco años siguientes al nacimiento o adopción de cada hijo.",
      "Se entenderá comprendido en el supuesto anterior la adquisición de un inmueble contiguo a la vivienda habitual que dentro del plazo indicado anteriormente se una físicamente a esta para formar una única vivienda de mayor superficie, aunque se mantengan registralmente como fincas distintas.",
      "El concepto de vivienda habitual será el fijado por la normativa estatal del impuesto sobre la renta de las personas físicas vigente a 31 de diciembre de 2012.",
      "b) Que dentro del plazo de cinco años desde la adquisición de la nueva vivienda habitual se proceda a la venta de la anterior, salvo que se trate de adquisición de un inmueble para ampliación de la vivienda actual.",
      "c) Que la superficie útil de la vivienda adquirida sea superior en más de un 10 % a la superficie útil de la anterior vivienda habitual.",
      "En el caso de que el inmueble adquirido sea contiguo a la vivienda habitual y se una físicamente a esta, para el cómputo del aumento de superficie se considerará la superficie total resultante de dicha unión. A estos efectos se atenderá a la información que conste en el Catastro.",
      "4. Cuando se pierda el derecho a las deducciones practicadas por incumplimiento del requisito de la venta de la vivienda anterior o ampliación de la vivienda habitual, en el plazo establecido, el contribuyente estará obligado a sumar a la cuota líquida autonómica devengada en el ejercicio en que se hayan incumplido dicho requisito, las cantidades indebidamente deducidas, más los intereses de demora correspondientes.",
    ],
    limites: [
      "2. La base máxima de la deducción es de 5.000 euros anuales y está constituida por las cantidades satisfechas para la adquisición de la vivienda, incluidos los gastos originados a cargo del adquirente y, en caso de financiación ajena, la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios, y demás gastos derivados de la misma. Si se aplicaran estos instrumentos de cobertura, los intereses satisfechos por el contribuyente se minoran en las cantidades obtenidas por su aplicación.",
      "3. La presente deducción se podrá aplicar por un período máximo de quince años a partir del ejercicio en el que se lleve a cabo la adquisición de la nueva vivienda o del inmueble destinado a la ampliación de la vivienda actual.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "10% general/15% especial; base<=5.000 anual, plazo máximo15 años; adquirir<=5 años de título o nacimiento; vender anterior<=5 años salvo anexo; superficie>10% mayor,anexo unión física; habitual definición2012; gastos/financiación minorados cobertura; regularizar incumplimiento e incompatibleUno.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_familia_monoparental", [467, 468]),
    requisitos: [
      "Remisión a los artículos 59 y 61 LIRPF: ascendiente mayor de 65 años o con discapacidad cualquiera que sea su edad, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros; convivencia al menos la mitad del período, con regla especial si fallece y asimilación de internamiento de ascendiente con discapacidad dependiente. El grado de parentesco determina la prioridad del mínimo.",

      "2. Se considerarán descendientes a los efectos de la presente deducción:",
      "c) Los descendientes a que se refieren las letras a) y b) anteriores que, sin convivir con el contribuyente, dependan económicamente de él y estén internados en centros especializados.",
      "3. Se asimilarán a descendientes aquellas personas vinculadas al contribuyente por razón de tutela y acogimiento, en los términos previstos en la legislación aplicable.",
      "6. Cuando a lo largo del ejercicio se lleve a cabo una alteración de la situación familiar por cualquier causa, a efectos de aplicación de la deducción, se entenderá que ha existido convivencia cuando tal situación se haya producido durante al menos 183 días al año.",
    ],
    limites: [
      "1. Podrá aplicar una deducción de 303 euros sobre la cuota autonómica del impuesto todo contribuyente que tenga a su cargo descendientes, siempre que no conviva con cualquier otra persona ajena a los citados descendientes, salvo que se trate de ascendientes que generen el derecho a la aplicación del mínimo por ascendientes establecido en el artículo 59 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio.",
      "a) Los hijos menores de edad, tanto por relación de paternidad como de adopción, siempre que convivan con el contribuyente y no tengan rentas anuales, excluidas las exentas, superiores a 8.000 euros.",
      "b) Los hijos mayores de edad con discapacidad, tanto por relación de paternidad como de adopción, siempre que convivan con el contribuyente y no tengan rentas anuales, excluidas las exentas, superiores a 8.000 euros.",
      "4. En caso de convivencia con descendientes que no den derecho a deducción, no se perderá el derecho a la misma siempre y cuando las rentas anuales del descendiente, excluidas las exentas, no sean superiores a 8.000 euros.",
      "5. No tendrán derecho a esta deducción los contribuyentes cuya suma de base imponible y anualidades por alimentos exentas excedan de 35.240 euros. Las anualidades por alimentos exentas que hay computar son las percibidas por los hijos que convivan y den derecho a aplicar la deducción al contribuyente.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "303; descendientes elegibles rentas<=8.000,convivencia sin tercero salvo ascendiente con mínimo,asimilados tutela/acogimiento; suma base+alimentos exentos hijos<=35.240; cambio familiar convivencia>=183 días.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_ensenanza_idiomas", [468]),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",

      "3. El contribuyente deberá disponer de los justificantes acreditativos del pago de las enseñanzas objeto de deducción.",
    ],
    limites: [
      "1. El contribuyente cuya suma de la base imponible general y del ahorro sea inferior a 25.000 euros en declaraciones individuales y 40.000 euros en conjuntas puede aplicar una deducción del 15 % de las cantidades pagadas por los gastos de aprendizaje extraescolar de idiomas extranjeros por los hijos que cursen los estudios correspondientes al segundo ciclo de educación infantil, educación primaria, educación secundaria obligatoria, bachillerato y ciclos formativos de formación profesional específica, con el límite de 300 euros por hijo siempre que este dé derecho a la deducción del mínimo por descendientes.",
    ],
    prorrateo: [
      "2. Si los hijos conviven con ambos padres y estos optan por la tributación individual, la deducción se prorratea por partes iguales en la declaración de cada uno de ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "15% máximo300 por hijo con mínimo y etapas admitidas,extraescolar; renta<25.000/40.000 estricta; mitad individual con ambos padres; justificantes.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_acceso_internet", [469, 470]),
    requisitos: [
      "a) El contribuyente deberá tener su residencia habitual en alguno de los municipios de la Región de Murcia cuya población de derecho a 31 de diciembre sea inferior a 15.000 habitantes.",
      "b) Solo puede aplicarse en el ejercicio en que se celebre el contrato de conexión.",
      "c) La línea de alta velocidad contratada debe estar destinada a uso exclusivo en la vivienda habitual del contribuyente y no vinculada al ejercicio de cualquier actividad empresarial o profesional.",
      "d) No resulta de aplicación si el contrato de conexión supone simplemente un cambio de compañía prestadora del servicio y el contrato con la compañía anterior se ha realizado en otro ejercicio. Tampoco resulta de aplicación cuando se contrate la conexión a una línea de alta velocidad y el contribuyente mantenga, simultáneamente, otras líneas contratadas en ejercicios anteriores.",
      "Esta deducción solo puede aplicarse una única vez por vivienda y por contribuyente, independientemente del régimen de ocupación de la citada vivienda.",
      "4. El contribuyente deberá disponer de los justificantes acreditativos de la contratación de la línea y del pago de las cuotas del servicio.",
    ],
    limites: [
      "1. Los contribuyentes que durante el ejercicio accedan a Internet mediante la contratación de líneas de alta velocidad pueden deducir el 30 % de las cantidades satisfechas, en concepto de cuota de alta y cuotas mensuales, con un límite máximo de 300 euros y según los siguientes requisitos:",
      "2. El límite máximo de la deducción se aplica respecto a todas las cantidades satisfechas durante el ejercicio, ya correspondan a un solo contrato de conexión o a varios que se mantengan simultáneamente.",
    ],
    prorrateo: [
      "3. Si en la misma vivienda habitual convive más de un contribuyente con derecho a la deducción, la misma se prorrateará entre todos ellos a partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% máximo300 conjunto contratos; alta y cuotas solo año contratación; municipio<15.000 a31 diciembre,vivienda habitual uso privado; no mero cambio proveedor ni línea anterior simultánea; una vez vivienda/contribuyente,reparto convivientes,justificantes.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_vehiculos_electricos",
      [470, 471, 472, 473]
    ),
    requisitos: [
      "1. Los contribuyentes podrán aplicar una deducción por la adquisición de un vehículo eléctrico, con las siguientes condiciones:",
      "a) A los efectos de la presente deducción, se considerarán vehículos eléctricos los siguientes: Vehículos eléctricos puros (BEV), vehículos eléctricos de autonomía extendida (EREV), vehículos híbridos “enchufables” (PHEV), vehículos eléctricos de células de combustible (FCV) y vehículos eléctricos híbridos de células de combustible (FCHV), según la definición de los mismos que se establece en el Real Decreto 266/2021, de 13 de abril , por el que se aprueba la concesión directa de ayudas a las comunidades autónomas y a las ciudades de Ceuta y Melilla para la ejecución de programas de incentivos ligados a la movilidad eléctrica (MOVES III) en el marco del Plan de Recuperación, Transformación y Resiliencia Europeo.",
      "b) Darán derecho a la presente deducción los siguientes tipos de vehículos:",
      "– Turismos (categoría M1).",
      "– Motocicletas (categorías L3e, L4e y L5e) de motor eléctrico, con una potencia del motor igual o superior a 3 kW, y una autonomía mínima de 70 km.",
      "– Ciclomotores (categoría L1e).",
      "c) Dicho vehículo no debe estar afecto a ninguna actividad económica y podrá ser adquirido de forma directa o por medio de operaciones de leasing o renting.",
      "d) Deberá tratarse de vehículos nuevos o de importación, matriculados por primera vez en España a nombre del beneficiario, salvo en el caso de renting, en los que podrá estar matriculado a nombre de la empresa de renting.",
      "También dará derecho a la aplicación de la presente deducción la adquisición de vehículos de demostración con hasta dieciocho meses de antigüedad, contada desde su primera matriculación hasta la fecha de la factura de compraventa o del contrato de renting, siempre que el concesionario o punto de venta hubiera adquirido el vehículo del fabricante o importador como vehículo nuevo.",
      "a) En caso de declaración individual:",
      "b) En caso de declaración conjunta:",
      "4. Esta deducción solo será aplicable a los contribuyentes que tengan su domicilio fiscal en la Región de Murcia en el ejercicio de adquisición del vehículo.",
      "5. Para la aplicación de la presente deducción el contribuyente deberá disponer del correspondiente contrato de compraventa, leasing o renting.",
      "El contribuyente deberá mantener la titularidad del vehículo durante al menos cinco años, salvo fallecimiento del contribuyente o siniestro total del vehículo. En el caso de adquisición del vehículo mediante una operación de renting, el contrato deberá mantenerse al menos dos años desde la fecha de su entrada en vigor.",
    ],
    limites: [
      "2. La base de deducción estará constituida por el valor de adquisición del vehículo, incluidos los gastos y tributos inherentes a la misma y minorado en las subvenciones o ayudas públicas percibidas por la citada adquisición, con los límites siguientes:",
      "– 45.000 euros en caso de turismos (53.000 euros si se trata de vehículos BEV de 8 o 9 plazas).",
      "– 10.000 euros en caso de motocicletas.",
      "– 3.000 euros en caso de ciclomotores.",
      "3. El importe de la deducción, que en ningún caso podrá superar los 7.000 euros por vehículo, será el siguiente:",
      "1.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro no supera los 35.000 euros, el 30 por 100 de la base de deducción.",
      "2.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 35.000 euros e inferior a 45.000 euros, el 22,50 por 100 de la base de deducción.",
      "3.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 45.000 euros e inferior a 60.000 euros, el 15 por 100 de la base de deducción.",
      "4.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 60.000 euros, no habrá derecho a la deducción.",
      "1.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es inferior a los 50.000 euros, el 30 por 100 de la base de deducción.",
      "2.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 50.000 euros e inferior a 75.000 euros, el 22,50 por 100 de la base de deducción.",
      "3.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 75.000 euros e inferior a 95.000 euros, el 15 por 100 de la base de deducción.",
      "4.º) Si la cantidad resultante de la suma de la base imponible general y de la base imponible del ahorro es igual o superior a 95.000 euros, no habrá derecho a la deducción.",
      "6. En el caso de que el importe de la deducción no pueda aplicarse en su totalidad en el periodo impositivo de la realización de la inversión, por insuficiencia de la cuota íntegra autonómica, la cantidad restante podrá ser aplicada, como máximo, en los tres periodos impositivos posteriores.",
      "Reserva a 35.000 euros exactos en individual: solapamiento del 30 % y del 22,50 % en el original de la Ley 3/2025; el manual aplica 22,50 %. La corrección de 30/10/2025 no resuelve esta contradicción. No se determina una cuota para esa igualdad.",
    ],
    prorrateo: [
      "En el supuesto de compraventa de vehículos en régimen de gananciales la deducción podrá prorratearse a partes iguales por ambos cónyuges aun cuando la factura se emita únicamente a nombre de uno de ellos.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30/22,50/15%,tope7.000/vehículo; bases45.000 turismo,53.000 BEV8/9 plazas,10.000 moto,3.000 ciclomotor; ayudas restan; nuevo/importado/demostración<=18 meses,privado; mantener5 años salvo muerte/siniestro,renting2; gananciales mitad; arrastre3 años; tramos conjunto50.000/75.000/95.000 e individual35.000/45.000/60.000.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_recarga_vehiculos_electricos",
      [473, 474, 475]
    ),
    requisitos: [
      "RD 821/2023, artículo primero.Cuatro: reproduce los costes del programa 2 y limita la capacidad nominal de producción in situ a la potencia o capacidad máxima de la infraestructura conectada; añade recarga inteligente para determinadas solicitudes de hasta 22 kW acogidas al reglamento europeo. RD 406/2023 modifica el programa 1, sin sustituir estos costes. El RDL 3/2025 establece MOVES III para 2025 y remite al RD 266/2021; no convierte los porcentajes de ayuda en porcentaje de esta deducción regional.",
      "Programa 2 del anexo I del RD 266/2021: proyecto, obra civil, ingeniería, dirección, infraestructura, instalación eléctrica y conexión necesarias, adecuación, permisos, señalización y gestión/control/seguridad. Generación o almacenamiento local solo si sirven exclusivamente al punto; se excluyen contadores inteligentes. La deducción regional remite a costes, sin importar los porcentajes de subvención del anexo III.",

      "1. Los contribuyentes podrán aplicar una deducción por la instalación, en finca de su propiedad o en garaje comunitario, de una infraestructura de recarga de vehículos eléctricos de su titularidad destinados a su uso particular.",
      "Se podrán deducir los costes que resulten subvencionables según el “Programa de incentivos 2” del Real Decreto 266/2021, de 13 de abril , por el que se aprueba la concesión directa de ayudas a las comunidades autónomas y a las ciudades de Ceuta y Melilla para la ejecución de programas de incentivos ligados a la movilidad eléctrica (MOVES III) en el marco del Plan de Recuperación, Transformación y Resiliencia Europeo.",
      "El contribuyente deberá justificar la inversión mediante la aportación de la correspondiente factura.",
      "3. Para la aplicación de la deducción deberá mantenerse la titularidad y el funcionamiento de la instalación durante al menos dos años a partir de su puesta en marcha.",
    ],
    limites: [
      "2. La base de la deducción vendrá determinada por las cantidades satisfechas para la instalación de la citada infraestructura, incluidos los gastos y tributos inherentes a la misma, minorada con las subvenciones o ayudas públicas percibidas, con un límite máximo de 4.000 euros.",
      "4. En el caso de que el importe de la deducción no pueda aplicarse en su totalidad en el periodo impositivo de la realización de la inversión, por insuficiencia de la cuota íntegra autonómica, la cantidad restante podrá ser aplicada, como máximo, en los tres periodos impositivos posteriores.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Base gasto neto ayudas<=4.000; instalación propia/garaje común para vehículo propio particular; costes Programa2 RD266/2021,factura; mantener titularidad/funcionamiento2 años; arrastre3 años. La norma no expresa porcentaje: no inventar fórmula porcentual; contrastar criterio AEAT antes de conectar cálculo.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_cristales_lentes_soluciones_limpieza",
      [475, 476]
    ),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",
    ],
    limites: [
      "Los contribuyentes podrán aplicar una deducción del 30 % de las cantidades satisfechas en el período impositivo por la adquisición de cristales graduados, lentes de contacto y soluciones de limpieza para los menores de doce años por los que se apliquen el mínimo por descendientes. El importe máximo de la deducción será de 100 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% máximo100; cristales graduados,lentes y limpieza para menor<12 con mínimo; no proyectar límites renta de deporte ni afirmar100 por hijo: texto fija importe máximo de deducción.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_deporte_actividades_saludables",
      [476, 477]
    ),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",
      "Remisión a los artículos 59 y 61 LIRPF: ascendiente mayor de 65 años o con discapacidad cualquiera que sea su edad, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros; convivencia al menos la mitad del período, con regla especial si fallece y asimilación de internamiento de ascendiente con discapacidad dependiente. El grado de parentesco determina la prioridad del mínimo.",

      "1. Los contribuyentes podrán deducir un 30 % de las cantidades satisfechas en el periodo impositivo en gastos asociados a los servicios relativos al ejercicio físico y a la práctica deportiva siguientes: los prestados en gimnasios y centros deportivos, por las cuotas de pertenencia a las federaciones deportivas, por servicios de entrenamiento prestados por técnicos y entrenadores deportivos y por la práctica de pilates y yoga.",
      "En el caso de mayores de sesenta y cinco años la deducción ascenderá al 100 % de estas cantidades.",
      "En ningún caso se integrarán en la base de esta deducción las cuotas estatutarias periódicas abonadas a entidades o clubes sociales o entidades deportivas sin ánimo de lucro.",
      "3. La base de esta deducción estará constituida por las cantidades justificadas con factura, que deberá cumplir las condiciones establecidas en el Reglamento por el que se regulan las obligaciones de facturación aprobado por el Real Decreto 1619/2012, de 30 de noviembre . La factura recibida por el contribuyente deberá conservarse durante el plazo de prescripción.",
    ],
    limites: [
      "Esta deducción tendrá un límite máximo anual de 150 euros. El límite de deducción se establecerá por contribuyente y los desembolsos podrán ir destinados a actividades desarrolladas por el contribuyente, su cónyuge y aquellas personas que den derecho a la aplicación de los mínimos familiares por descendientes y ascendientes.",
      "2. Será requisito para la aplicación de la deducción que la cantidad resultante de la suma de la base imponible general y del ahorro no supere la cantidad de 25.000 euros en declaraciones individuales y 40.000 euros en declaraciones conjuntas.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% o100% mayores65,tope150 anual por contribuyente; gimnasio,federación,entrenamiento,pilates/yoga; excluir cuotas estatutarias clubes sin lucro; familiares con mínimo/cónyuge; renta<=25.000/40.000; factura/conservación.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_enfermedades_raras", [477, 478]),
    requisitos: [
      "Remisión a los artículos 58 y 61 LIRPF: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia en los términos legales, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros. Se atiende al devengo, con reglas de fallecimiento y reparto entre titulares; las anualidades de los artículos 64 y 75 tienen tratamiento propio.",
      "Remisión a los artículos 59 y 61 LIRPF: ascendiente mayor de 65 años o con discapacidad cualquiera que sea su edad, rentas no exentas no superiores a 8.000 euros y sin declaración con rentas superiores a 1.800 euros; convivencia al menos la mitad del período, con regla especial si fallece y asimilación de internamiento de ascendiente con discapacidad dependiente. El grado de parentesco determina la prioridad del mínimo.",

      "Estos gastos podrán ir destinados al propio contribuyente, su cónyuge y aquellas personas que den derecho a la aplicación de los mínimos familiares por descendientes y ascendientes y se acreditarán mediante la correspondiente factura.",
    ],
    limites: [
      "Los contribuyentes podrán deducir las cantidades satisfechas en el periodo impositivo con destino al tratamiento y cuidado de las personas afectadas por las enfermedades denominadas «raras», con un límite de 300 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Cantidades tratamiento/cuidado máximo300; contribuyente,cónyuge o familiares con mínimo; factura; no añadir límite renta no previsto ni porcentaje arbitrario.",
    },
  },
  {
    ...fichaImplementadaFormula("murcia_inversion_economia_social", [478, 479]),
    requisitos: [
      "2. La aplicación de esta deducción está sujeta al cumplimiento de los requisitos y condiciones siguientes:",
      "b) La entidad en la que debe materializarse la inversión tendrá que cumplir los siguientes requisitos:",
      "– Formar parte de la economía social, en los términos previstos en la Ley 5/2011, de 29 de marzo , de Economía Social.",
      "– Tener su domicilio social y fiscal en Murcia.",
      "– Contar, como mínimo, con una persona ocupada con contrato laboral y a jornada completa, y dada de alta en el régimen general de la Seguridad Social.",
      "3. Las operaciones en las que sea de aplicación la deducción deberán formalizarse en escritura pública, en la que se hará constar la identidad de los inversores y el importe de la inversión respectiva.",
      "4. Las aportaciones habrán de mantenerse en el patrimonio del contribuyente durante un periodo mínimo de cinco años.",
      "5. Los requisitos que ha de cumplir la entidad en la que se materializó la inversión deberán cumplirse durante un periodo mínimo de cinco años a contar desde la aportación.",
      "El incumplimiento de los requisitos y condiciones expuestos, a excepción del relativo a la formalización de las operaciones en escritura pública, comporta la pérdida del beneficio fiscal y, en tal caso, el contribuyente deberá incluir en la declaración del impuesto correspondiente al ejercicio en que se haya producido el incumplimiento la parte del impuesto que se hubiera dejado de pagar como consecuencia de la deducción practicada, junto con los intereses de demora devengados.",
    ],
    limites: [
      "1. Los contribuyentes podrán aplicarse una deducción del 20 por 100 de las cantidades invertidas durante el periodo impositivo en las aportaciones realizadas con la finalidad de ser socio en entidades que formen parte de la economía social. El importe máximo de esta deducción será de 4.000 euros.",
      "a) La participación alcanzada por el contribuyente como consecuencia de la aportación realizada, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco hasta el tercer grado incluido, en línea recta o colateral, por consanguinidad o afinidad, no puede ser superior al 40 por 100 del total del capital social de la entidad objeto de la inversión o de sus derechos de voto.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [
      "6. La presente deducción resultará incompatible, para las mismas inversiones, con la “Deducción por inversión en la adquisición de acciones o participaciones sociales en entidades nuevas o de reciente creación” y la “Deducción por inversión en acciones de entidades que cotizan en el segmento de empresas en expansión del mercado alternativo bursátil”.",
    ],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% máximo4.000; socio economía social,participación familiar tercero<=40%; domicilio social/fiscalMurcia y empleado jornada completa; escritura; aportación y requisitos entidad5 años; regularizar intereses; incompatibleSeis/Siete mismas inversiones.",
    },
  },
  {
    ...fichaImplementadaFormula(
      "murcia_regimen_transitorio_inversion_vivienda_habitual",
      [480, 481]
    ),
    requisitos: [
      "Remisión histórica estatal: el artículo 68.1 anterior a 2013 fija base máxima de 9.040 euros, con gastos y financiación; minoración por inversiones deducidas en viviendas anteriores y por ganancia exenta de reinversión. La DT 18 exige adquisición o pagos de construcción anteriores a 2013 y deducción previa, salvo la excepción del artículo 68.1.2.ª; rehabilitación/ampliación y adecuación requieren pagos anteriores a 2013 y terminación antes de 2017. Se separa el acceso al tramo estatal de la deducción regional propia.",
      "Acceso histórico contrastado: 1998 y 1999/2000 distinguen vivienda nueva por primera transmisión dentro de dos y tres años de obra nueva respectivamente. Ley 7/2000: edad hasta 30 años; Ley 7/2001 DA 1 prorroga esa regla en 2002. Ley 15/2002 eleva a 35 años y establece 3 %/5 %. Las reformas de 2005, 2006, 2007, 2008/2009, 2010 y 2011 cambian el umbral del tipo incrementado a 18.180, 20.000, 22.000, 24.200, 26.620 y 24.107,2 euros respectivamente; el acceso histórico debe probarse y la DT primera.2 exige además las condiciones actuales de Uno.",

      "2. Los contribuyentes que en ejercicios anteriores, de acuerdo con la normativa vigente en la fecha de devengo que se relaciona en el punto 3, se aplicaron las deducciones autonómicas en el Impuesto sobre la Renta de las Personas Físicas, por inversión en vivienda habitual para jóvenes con residencia en la Comunidad Autónoma de la Región de Murcia, podrán aplicar la deducción establecida en el artículo 1.uno del texto refundido de las Disposiciones Legales vigentes en la Región de Murcia en materia de Tributos Cedidos aprobado mediante Decreto Legislativo 1/2010, de 5 de noviembre , siempre que se cumplan los requisitos establecidos en dicho precepto en el ejercicio en que se pretenda aplicar.",
      "3. La normativa a que se refiere el punto 2 anterior es la siguiente:",
      "a) Para el año 2001, la Ley 7/2000, de 29 de diciembre , de Medidas Tributarias y en materia de Juego, Apuestas y Función Publica.",
      "b) Para el año 2002, la Ley 7/2001, de 20 diciembre , de Medidas Fiscales en Materia de Tributos Cedidos y Tasas.",
      "c) Para el año 2003, la Ley 15/2002, de 23 de diciembre , de Medidas Tributarias en materia de Tributos Cedidos y Tasas Regionales.",
      "d) Para el año 2005, la Ley 8/2004, de 28 de diciembre , de medidas administrativas, tributarias, de tasas y de Función Pública.",
      "e) Para el año 2006, la Ley 9/2005, de 29 de diciembre , de Medidas Tributarias en materia de Tributos Cedidos y Tributos Propios año 2006.",
      "f) Para el año 2007, la Ley 12/2006, de 27 de diciembre , de Medidas Fiscales, Administrativas y de Orden Social para el año 2007.",
      "g) Para los años 2008 y 2009, la Ley 11/2007, de 27 de diciembre , de Medidas Tributarias en materia de Tributos Cedidos y Tributos Propios, año 2008.",
      "h) Para el año 2010, la Ley 13/2009, de 23 de diciembre , de medidas en materia de tributos cedidos, tributos propios y medidas administrativas.",
      "i) Para el año 2011, la Ley 4/2010, de 27 de diciembre , de Presupuestos Generales de la Comunidad Autónoma de la Región de Murcia para el ejercicio 2011.",
      "4. La aplicación del tramo autonómico de la deducción por inversión en vivienda habitual para los contribuyentes que hubiesen invertido en ésta con anterioridad a 1 de enero de 2013, se realizará en los términos y condiciones que establezca la normativa estatal reguladora del régimen transitorio aplicable a la citada deducción.",
    ],
    limites: [
      "1. Los contribuyentes que aplicaron las deducciones autonómicas en el Impuesto sobre la Renta de las Personas Físicas, por adquisición o rehabilitación de vivienda habitual, establecidas para el ejercicio 1998 por la Ley 13/1997, de 23 de diciembre , de Medidas Fiscales, Presupuestarias y Administrativas, para el ejercicio 1999 por la Ley 11/1998, de 28 de diciembre , de Medidas Financieras, Administrativas y de Función Pública Regional, y para el ejercicio 2000 por la Ley 9/1999, de 27 de diciembre , de Medidas Tributarias y de Modificación de diversas leyes regionales en materia de tasas, puertos, educación, juego y apuestas y construcción y explotación de infraestructuras, podrán aplicar una deducción del 2% de las cantidades satisfechas en el ejercicio por la adquisición o rehabilitación de la vivienda que constituya o vaya a constituir vivienda habitual del contribuyente, en el territorio de la Región de Murcia, siempre que, en el primer caso, se trate de viviendas de nueva construcción. Esta deducción será del 3% en el caso de contribuyentes cuya base imponible general menos el mínimo personal y familiar sea inferior a 24.200 euros, siempre que la base imponible del ahorro no supere 1.800 euros. En ambos casos deberán concurrir el resto de requisitos regulados en el artículo 1, uno, de la citada Ley 9/1999, de 27 de diciembre .",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
    cuantia: {
      tipo: "mixta",
      descripcion:
        "2% general/3% si general-mínimo<24.200 y ahorro<=1.800 para beneficiarios1998-2000; requisitos Ley9/1999; otros beneficiarios2001-2011 remitenUno vigente; inversiones pre2013 tramo estatal por régimen transitorio.",
    },
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const MURCIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...MURCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  MURCIA_GASTOS_GUARDERIA_2025,
  MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  MURCIA_GASTOS_VETERINARIOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
