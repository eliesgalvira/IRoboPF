import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CANARIAS_NACIMIENTO_ADOPCION_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 10 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "265 euros por primer o segundo hijo; 530 euros por tercero; 796 euros por cuarto; 928 euros por quinto o sucesivos. Incremento adicional por discapacidad igual o superior al 65%",
  },
  requisitos: [
    "Hijo nacido o adoptado durante el período impositivo",
    "El hijo debe convivir con el contribuyente",
    "Para el incremento por discapacidad, discapacidad física, psíquica o sensorial igual o superior al 65% y convivencia ininterrumpida desde nacimiento/adopción hasta final del período",
    "Base imponible general + base imponible del ahorro dentro de límites",
    "1. Los contribuyentes podrán deducirse la cantidad que en cada caso corresponda de las siguientes:",
    "a) Por cada hijo nacido o adoptado en el periodo impositivo que conviva con el contribuyente:",
    "– 265 euros, cuando se trate del primer o segundo hijo.",
    "– 530 euros, cuando se trate del tercero.",
    "– 796 euros, cuando se trate del cuarto.",
    "– 928 euros, cuando se trate del quinto o sucesivos.",
    "b) En caso de que el hijo o hija nacido o adoptado tenga una minusvalía física, psíquica o sensorial igual o superior al 65 %, siempre que dicho hijo o hija haya convivido con el contribuyente ininterrumpidamente desde su nacimiento o adopción hasta el final del periodo impositivo, la cantidad a deducir será la que proceda de entre las siguientes, además de la que proceda por la aplicación del apartado a) anterior:",
    "– 600 euros, cuando se trate del primer o segundo hijo que padezca dicha discapacidad.",
    "– 1.100 euros, cuando se trate del tercer o posterior hijo que padezca dicha discapacidad, siempre que sobrevivan los anteriores discapacitados.",
    "d) Para determinar el número de orden del hijo nacido o adoptado se atenderá a los hijos que convivan con el contribuyente a la fecha de devengo del impuesto, computándose a dichos efectos tanto los hijos naturales como los adoptivos.",
    "e) A los efectos previstos en el presente artículo, se considerará que conviven con el contribuyente, entre otros, los hijos nacidos o adoptados que, dependiendo de este, estén internados en centros especializados.",
    "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
    "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
    "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
    "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
    "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
    "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
    "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    "2. Solo tendrán derecho a la aplicación de esta deducción los contribuyentes que no hayan obtenido rentas en el periodo impositivo en que se origina el derecho a la deducción por importe superior a 46.455 euros; y, en el supuesto de tributación conjunta, cuando la unidad familiar no haya obtenido rentas por importe superior a 61.770 euros.",
    "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
  ],
  limites: [
    "265 euros si se trata del primero o segundo hijo",
    "530 euros si se trata del tercero",
    "796 euros si se trata del cuarto",
    "928 euros si se trata del quinto o sucesivos",
    "Incremento adicional por discapacidad: 600 euros si es primer o segundo hijo con discapacidad",
    "Incremento adicional por discapacidad: 1.100 euros si es tercer o posterior hijo con discapacidad y sobreviven los anteriores hijos con discapacidad",
    "Base imponible general + base imponible del ahorro: máximo 46.455 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 61.770 euros en tributación conjunta",
  ],
  prorrateo: [
    "Si ambos progenitores o adoptantes tienen derecho y no optan por conjunta, se prorratea por partes iguales",
  ],
  compatibilidades: [
    "Compatible con la deducción autonómica canaria por familia numerosa",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "ordenHijoNacidoOAdoptado",
    "numeroHijosNacidosOAdoptados",
    "discapacidadHijo65",
    "convivenciaIninterrumpidaHijo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "numeroProgenitoresConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [182, 183],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_DISCAPACIDAD_MAYORES_65_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_discapacidad_mayores_65",
    "Por contribuyentes con discapacidad y mayores de 65 años",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 11 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "400 euros por contribuyente con discapacidad igual o superior al 33%; 160 euros por contribuyente mayor de 65 años. Ambas cuantías son compatibles entre sí",
  },
  requisitos: [
    "Discapacidad igual o superior al 33% para la cuantía por discapacidad",
    "Edad superior a 65 años para la cuantía por edad",
    "Circunstancias personales a fecha de devengo del impuesto",
    "Base imponible general + base imponible del ahorro dentro de límites",
    "a) 400 euros por cada contribuyente con discapacidad igual o superior al 33%.",
    "b) 160 euros por cada contribuyente mayor de 65 años.",
    "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
    "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
    "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
    "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
    "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
    "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
    "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    "2. Solo tendrán derecho a la aplicación de esta deducción los contribuyentes que no hayan obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción por importe superior a 46.455 euros; y, en el supuesto de tributación conjunta, cuando la unidad familiar no haya obtenido rentas por importe superior a 61.770 euros.",
    "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
  ],
  limites: [
    "400 euros por discapacidad igual o superior al 33%",
    "160 euros por contribuyente mayor de 65 años",
    "Base imponible general + base imponible del ahorro: máximo 46.455 euros en tributación individual",
    "Base imponible general + base imponible del ahorro: máximo 61.770 euros en tributación conjunta",
  ],
  prorrateo: [],
  compatibilidades: [
    "La cuantía por discapacidad y la cuantía por edad son compatibles entre sí",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "edadContribuyente",
    "gradoDiscapacidadContribuyente",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [184],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_FAMILIA_NUMEROSA_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_familia_numerosa",
    "Por familia numerosa",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 13 Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "mixta",
    descripcion:
      "597 euros para familia numerosa general; 796 euros para especial. Si cónyuge o descendiente con mínimo tiene discapacidad igual o superior al 65%, 1.326 euros general y 1.459 euros especial",
  },
  requisitos: [
    "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
    "Ley 40/2003, artículos 2 a 6: comprobar composición familiar y supuestos equiparados, edad, convivencia y dependencia económica; clasificación especial con cinco o más hijos y supuestos legales de cuatro, incluido el umbral de renta; cada hijo con discapacidad computa como dos para la categoría. El título debe estar vigente al devengo.",
    "Título de familia numerosa a fecha de devengo del impuesto",
    "Clasificación según la Ley 40/2003 de protección a las familias numerosas",
    "Título expedido por órgano competente",
    "1. El contribuyente que posea, a la fecha de devengo del impuesto, el título de familia numerosa, expedido por el órgano competente en materia de servicios sociales del Gobierno de Canarias o por los órganos correspondientes de otras comunidades autónomas, podrá deducirse las siguientes cantidades según corresponda:",
    "– 597 euros, cuando se trate de familia numerosa de categoría general.",
    "– 796 euros, cuando se trate de familia numerosa de categoría especial.",
    "Cuando alguno de los cónyuges o descendientes a quienes sea de aplicación el mínimo personal y familiar del impuesto tenga un grado de minusvalía física, psíquica o sensorial igual o superior al 65%, la deducción anterior será de 1.326 y 1.459 euros, respectivamente.",
    "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
    "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
    "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
    "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
    "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
    "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
    "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
  ],
  limites: [
    "597 euros para familia numerosa de categoría general",
    "796 euros para familia numerosa de categoría especial",
    "1.326 euros para categoría general si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
    "1.459 euros para categoría especial si cónyuge o descendiente con derecho al mínimo tiene discapacidad igual o superior al 65%",
  ],
  prorrateo: [
    "Se aplica por el contribuyente con quien conviva el resto de miembros de la familia numerosa",
    "Si conviven con más de un contribuyente, se prorratea por partes iguales",
  ],
  compatibilidades: [
    "Compatible con la deducción canaria por nacimiento o adopción de hijos",
  ],
  incompatibilidades: [],
  entradaNecesaria: [
    "categoriaFamiliaNumerosa",
    "conyugeODependienteDiscapacidad65",
    "numeroContribuyentesConDerecho",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [187, 188],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025 = {
  ...fichaImplementadaBasica(
    { estado: "implementada" },
    "canarias_contribuyentes_desempleados",
    "Por contribuyentes desempleados",
    "circunstancias_personales_familiares"
  ),
  normativa:
    "Art. 16 bis Texto Refundido de Canarias en materia de tributos cedidos, aprobado por Decreto-Legislativo 1/2009",
  cuantia: {
    tipo: "importe_fijo",
    euros: "120",
    por: "contribuyente desempleado",
  },
  requisitos: [
    "Percibir prestaciones de desempleo",
    "Estar en situación de desempleo durante más de seis meses del período impositivo",
    "Rendimientos íntegros del trabajo superiores a 15.876 euros e iguales o inferiores a 22.000 euros",
    "Base imponible general + ahorro excluida la parte correspondiente a rendimientos del trabajo no superior a 1.600 euros",
    "Los contribuyentes que perciban prestaciones por desempleo podrán deducir la cantidad de 120 euros siempre que concurran todos los siguientes requisitos:",
    "– Estar en situación legal de desempleo durante más de seis meses del periodo impositivo.",
    "– La suma de los rendimientos íntegros del trabajo ha de ser superior a 15.876 euros e igual o inferior a 22.000 euros, tanto en tributación individual como en tributación conjunta.",
    "– La suma de la base imponible general y del ahorro, excluida la parte correspondiente a los rendimientos del trabajo, no podrá superar la cantidad de 1.600 euros.",
    "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
    "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
    "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
    "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
    "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
    "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
    "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
  ],
  limites: [
    "120 euros por contribuyente que cumpla los requisitos",
    "En tributación conjunta pueden beneficiarse todos los miembros de la unidad familiar que cumplan la situación de desempleo",
  ],
  prorrateo: [],
  incompatibilidades: [],
  entradaNecesaria: [
    "percibePrestacionDesempleo",
    "mesesDesempleo",
    "rendimientosIntegroTrabajo",
    "baseImponibleGeneral",
    "baseImponibleAhorro",
    "rendimientoTrabajoCasilla0025",
  ],
  fuenteManual: {
    documento: "ManualRenta2025Parte2",
    paginas: [201, 202],
  },
} as const satisfies FichaDeduccionAutonomica

export const CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "canarias_alquiler_vivienda_habitual",
    "Por alquiler de vivienda habitual",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "24% del alquiler; límite 740 euros, o 760 euros si menor de 40 o mayor de 75",
    },
    [
      "24% de cantidades satisfechas",
      "Límite general: 740 euros",
      "Límite incrementado: 760 euros",
      "Base imponible general + ahorro máximo 46.455 euros individual y 61.770 conjunta",
    ],
    [194, 195, 196]
  ),
  normativa:
    "Artículo 15 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
  requisitos: [
    "1. Los contribuyentes podrán deducirse el 24% de las cantidades satisfechas en el periodo impositivo, con un máximo de 740 euros anuales, por el alquiler de su vivienda habitual, siempre que concurran los siguientes requisitos:",
    "Este importe se incrementará en 15.315 euros en el supuesto de opción por la tributación conjunta.",
    "b) Que las cantidades satisfechas en concepto de alquiler excedan del 10% de las rentas obtenidas en el periodo impositivo, que a estos efectos se descontará, si lo hubiere, en el importe de las subvenciones que por este concepto hubiera percibido el arrendatario.",
    "El importe de la deducción prevista tendrá un máximo de 760 euros anuales si el contribuyente tiene una edad inferior a 40 años o una edad igual o superior a 75 años y cumple los anteriores requisitos.",
    "A estos efectos, se entiende por vivienda habitual aquella en la que resida el contribuyente por un plazo superior a un año.",
    "2. La aplicación de la presente deducción queda condicionada a la declaración por parte del contribuyente del número de identificación fiscal del arrendador, de la identificación catastral de la vivienda habitual y del canon arrendaticio anual.",
    "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
    "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
    "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
    "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
    "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
    "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
    "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
  ],
  limites: [
    "a) Que no hayan obtenido rentas superiores a 46.455 euros en el periodo impositivo.",
    "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
  ],
  prorrateo: [],
  incompatibilidades: [],
  compatibilidades: [],
}

export const CANARIAS_GASTO_ENFERMEDAD_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "canarias_gasto_enfermedad",
    "Por gasto de enfermedad",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "12% de gastos médicos/sanitarios y aparatos; límite 500/700 euros, incremento 100 euros solo en tributación individual, o límite 150 euros si supera umbral",
    },
    [
      "12% de gastos deducibles",
      "Límite 500 euros individual y 700 euros conjunta si cumple umbral de bases",
      "Incremento 100 euros solo en tributación individual por mayor de 65 o discapacidad igual/superior al 65%",
      "Si se superan umbrales de base: límite 150 euros por contribuyente",
    ],
    [202, 203, 204]
  ),
  normativa:
    "Artículo 16 ter del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
  requisitos: [
    "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
    "1. Los contribuyentes podrán deducir un 12% de los gastos y honorarios profesionales abonados durante el periodo impositivo por la prestación de servicios realizada por quienes tengan la condición de profesionales médicos o sanitarios, excepto farmacéuticos, conforme a lo dispuesto en los artículos 2 y 3 de la Ley 44/2003, de 21 de noviembre , de ordenación de las profesiones sanitarias, por motivo de la prevención, diagnóstico y tratamiento de enfermedades, salud dental, embarazo y nacimiento de hijos, accidentes e invalidez, tanto propios como de las personas que se incluyan en el mínimo familiar.",
    "En ningún caso se incluye la asistencia con fines estéticos, excepto cuando constituyan la reparación de daños causados por accidentes o intervenciones que afecten a las personas y los tratamientos destinados a la identidad sexual. Tampoco se integrarán en la base de la deducción las primas satisfechas por seguros médicos ni el importe de las prestaciones médicas que sean reintegrables por la Seguridad Social o las entidades que la sustituyan.",
    "Los contribuyentes podrán deducir un 12% de los gastos en la adquisición de aparatos y complementos, incluidas las gafas graduadas y las lentillas, que por sus características objetivas solo puedan destinarse a suplir las deficiencias físicas de las personas.",
    "2. La base de esta deducción estará constituida por las cantidades justificadas con factura.",
    "La factura deberá cumplir todas las condiciones establecidas en el reglamento por el que se regulan las obligaciones de facturación, aprobado por el Real Decreto 1619/2012, de 30 de noviembre . La factura recibida por el contribuyente deberá conservarse durante el plazo de prescripción.",
    "3. Cuando se trate de gastos y honorarios abonados a profesionales médicos o sanitarios, la aplicación de la deducción queda condicionada a la declaración por parte del contribuyente del número de identificación fiscal del prestador de cada servicio y de su importe anual.",
    "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
    "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
    "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
    "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
    "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
    "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
    "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
    "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
  ],
  limites: [
    "Esta deducción tendrá un límite anual de 500 euros en tributación individual y 700 euros en tributación conjunta. Estos límites se incrementarán en 100 euros en tributación individual cuando el contribuyente sea una persona mayor de 65 años o con discapacidad y acredite un grado de discapacidad igual o superior al 65%.",
    "4. Tendrán derecho a la aplicación de esta deducción los contribuyentes que no hayan obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción por importe superior a 46.455 euros; y, en el supuesto de tributación conjunta, cuando la unidad familiar no haya obtenido rentas por importe superior a 61.770 euros.",
    "Para contribuyentes que hayan obtenido rentas superiores a 46.455 en tributación individual o superiores a 61.770 euros en el supuesto de tributación conjunta, el importe de la deducción tendrá un límite anual de 150 euros.",
    "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    "Incremento 100 euros solo en tributación individual por mayor de 65 o discapacidad igual/superior al 65%.",
  ],
  prorrateo: [],
  incompatibilidades: [],
  compatibilidades: [],
}

export const CANARIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_donaciones_finalidad_ecologica",
      nombreCatalogadoDesdeCodigo("canarias_donaciones_finalidad_ecologica"),
      categoriaCatalogadaDesdeCodigo("canarias_donaciones_finalidad_ecologica"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 10%; menor entre 150 y 10% cuota; entidad y certificado art.5.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 168.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [168],
      [
        "canarias_donaciones_finalidad_ecologica:importe",
        "canarias_donaciones_finalidad_ecologica:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 3 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) Las entidades públicas dependientes de la Comunidad Autónoma de Canarias, cabildos insulares o corporaciones municipales canarias, cuya finalidad sea la defensa y conservación del medio ambiente, quedando afectos dichos recursos al desarrollo de programas de esta naturaleza.",
      "b) Las entidades sin fines lucrativos y las entidades beneficiarias del mecenazgo, reguladas respectivamente en los artículos 2 y 16 de la Ley 49/2002, de 23 de diciembre , de Régimen Fiscal de entidades sin fines lucrativos y de incentivos fiscales al mecenazgo, siempre que su fin exclusivo sea la defensa del medio ambiente y se hallen inscritas en los correspondientes registros de la Comunidad Autónoma de Canarias.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "La aplicación por el contribuyente de las deducciones previstas en los artículos 3, 4 y 4-bis de este texto refundido exigirá el cumplimiento de los requisitos siguientes:",
      "a) Obtener de la entidad donataria certificación en la que figure, además del número de identificación fiscal y de los datos de identificación personal del donante y de la entidad donataria, fecha y destino del donativo, y su importe, cuando este sea dinerario. Tratándose de donaciones no dinerarias, deberá acreditarse el valor de los bienes donados, mediante certificación expedida por la empresa de base tecnológica beneficiaria, así como los datos identificativos del documento público u otro documento auténtico acreditativo de la entrega del bien o derecho donado.",
      "c) Constar en la certificación señalada en la letra a) anterior la mención expresa de que la donación se haya efectuado de manera irrevocable y de que la misma se ha aceptado. La revocación de la donación determinará la obligación de ingresar las cuotas correspondientes a los beneficios disfrutados en el periodo impositivo del ejercicio en el que dicha revocación se produzca, sin perjuicio de los intereses de demora que procedan.",
      "Artículo 5: certificado con NIF e identificación del donante y donatario, fecha, destino e importe; aceptación e irrevocabilidad. La certificación adicional de proyecto del artículo 4 bis no se exige a esta deducción.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducirse el 10 por 100, y con el límite del 10 por 100 de la cuota íntegra autonómica, del importe de las donaciones dinerarias puras y simples efectuadas durante el período impositivo a cualquiera de las siguientes instituciones:",
      "2. El importe de la deducción no podrá exceder de 150 euros.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_donaciones_patrimonio_historico",
      nombreCatalogadoDesdeCodigo("canarias_donaciones_patrimonio_historico"),
      categoriaCatalogadaDesdeCodigo(
        "canarias_donaciones_patrimonio_historico"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 20%; menor entre 150 y 10% cuota; bien protegido y donatario habilitado.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 169 a 170.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [169, 170],
      [
        "canarias_donaciones_patrimonio_historico:importe",
        "canarias_donaciones_patrimonio_historico:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) Las Administraciones Públicas, así como las entidades e instituciones dependientes de las mismas.",
      "b) La Iglesia católica y las iglesias, confesiones o comunidades religiosas que tengan acuerdos de cooperación con el Estado español.",
      "c) Las fundaciones o asociaciones que, reuniendo los requisitos establecidos en el título II de la Ley 49/2002, de 23 de diciembre , de Régimen Fiscal de entidades sin fines lucrativos y de incentivos fiscales al mecenazgo, incluyan entre sus fines específicos, la reparación, conservación o restauración del patrimonio histórico.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "La aplicación por el contribuyente de las deducciones previstas en los artículos 3, 4 y 4-bis de este texto refundido exigirá el cumplimiento de los requisitos siguientes:",
      "a) Obtener de la entidad donataria certificación en la que figure, además del número de identificación fiscal y de los datos de identificación personal del donante y de la entidad donataria, fecha y destino del donativo, y su importe, cuando este sea dinerario. Tratándose de donaciones no dinerarias, deberá acreditarse el valor de los bienes donados, mediante certificación expedida por la empresa de base tecnológica beneficiaria, así como los datos identificativos del documento público u otro documento auténtico acreditativo de la entrega del bien o derecho donado.",
      "c) Constar en la certificación señalada en la letra a) anterior la mención expresa de que la donación se haya efectuado de manera irrevocable y de que la misma se ha aceptado. La revocación de la donación determinará la obligación de ingresar las cuotas correspondientes a los beneficios disfrutados en el periodo impositivo del ejercicio en el que dicha revocación se produzca, sin perjuicio de los intereses de demora que procedan.",
    ],
    limites: [
      "1. Los contribuyentes podrán deducirse el 20 por 100, y con el límite del 10 por 100 de la cuota íntegra autonómica, de las cantidades donadas para la rehabilitación o conservación de bienes que se encuentren en el territorio de la Comunidad Autónoma de Canarias que formen parte del patrimonio histórico de Canarias y estén inscritos en el Registro Canario de Bienes de Interés Cultural o incluidos en el Inventario de Bienes Muebles a que se refiere la Ley 4/1999, de 15 de marzo , de Patrimonio Histórico de Canarias; asimismo, cuando se trate de edificios catalogados formando parte de un conjunto histórico de Canarias será preciso que esas donaciones se realicen a favor de cualquiera de las siguientes entidades:",
      "2. El importe de la deducción no podrá exceder de 150 euros.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia",
      nombreCatalogadoDesdeCodigo(
        "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 15%, 5% cuota; bases 50.000/3.000 según destinatario; art.5.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 170 a 171.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [170, 171],
      [
        "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia:importe",
        "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 bis del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) Las donaciones dinerarias efectuadas a la Administración pública de la Comunidad Autónoma de Canarias, corporaciones locales canarias y a las entidades públicas de carácter cultural, deportivo o de investigación que dependan de las mismas, siempre que se destinen a la financiación de programas de gasto o actuaciones que tengan por objeto la promoción de cualquier actividad cultural, deportiva o de investigación distinta de las descritas en los artículos 3 y 4.",
      "b) Las donaciones dinerarias efectuadas a empresas culturales con fondos propios inferiores a 300.000 euros, cuya actividad sea la cinematografía, las artes escénicas, la música, la pintura y otras artes visuales o audiovisuales o la edición, siempre que se destinen al desarrollo de su actividad.",
      "c) Las donaciones dinerarias efectuadas a empresas científicas con fondos propios inferiores a 300.000 euros, cuya actividad principal sea la investigación, siempre que se destinen al desarrollo de su actividad.",
      "d) Las donaciones dinerarias efectuadas a las universidades públicas y privadas, a los centros de investigación y a los centros superiores de enseñanzas artísticas de la Comunidad Autónoma de Canarias, cuando se destinen a la financiación de programas de gasto o actuaciones que tengan por objeto actividades de investigación o docencia.",
      "e) Las donaciones dinerarias efectuadas a las universidades públicas de la Comunidad Autónoma de Canarias y a los centros públicos de enseñanzas artísticas superiores de la citada comunidad con destino a la financiación de programas de gasto o actuaciones para el fomento del acceso a la educación superior.",
      "f) Las aportaciones de capital efectuadas a empresas de base tecnológica creadas o desarrolladas a partir de patentes o de resultados generados por proyectos de investigación realizados en universidades canarias.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "La aplicación por el contribuyente de las deducciones previstas en los artículos 3, 4 y 4-bis de este texto refundido exigirá el cumplimiento de los requisitos siguientes:",
      "a) Obtener de la entidad donataria certificación en la que figure, además del número de identificación fiscal y de los datos de identificación personal del donante y de la entidad donataria, fecha y destino del donativo, y su importe, cuando este sea dinerario. Tratándose de donaciones no dinerarias, deberá acreditarse el valor de los bienes donados, mediante certificación expedida por la empresa de base tecnológica beneficiaria, así como los datos identificativos del documento público u otro documento auténtico acreditativo de la entrega del bien o derecho donado.",
      "b) En el caso de la deducción regulada en el artículo 4-bis, cuando el destinatario de la donación sea una entidad o universidad canaria de naturaleza pública, en la certificación expedida a la que se refiere la letra anterior se le incorporará la identificación del proyecto de interés cultural, deportivo investigación o docente. Cuando el donatario tenga naturaleza privada, deberá constar una certificación adicional, expedida por la consejería competente, en la que se haga constar que el citado proyecto es de interés cultural, deportivo de investigación o docente.",
      "c) Constar en la certificación señalada en la letra a) anterior la mención expresa de que la donación se haya efectuado de manera irrevocable y de que la misma se ha aceptado. La revocación de la donación determinará la obligación de ingresar las cuotas correspondientes a los beneficios disfrutados en el periodo impositivo del ejercicio en el que dicha revocación se produzca, sin perjuicio de los intereses de demora que procedan.",
    ],
    limites: [
      "Los contribuyentes podrán deducir el 15 por 100, con el límite del 5 por 100 de la cuota íntegra autonómica, de las donaciones y aportaciones efectuadas para los destinatarios y finalidades que se indican a continuación:",
      "La base máxima de deducción, a estos efectos, será de 50.000 euros por periodo impositivo.",
      "La base máxima de deducción, a estos efectos, será de 3.000 euros por periodo impositivo.",
      "La base máxima de la deducción, a estos efectos, será de 50.000 euros por periodo impositivo.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_donaciones_entidades_sin_animo_lucro",
      nombreCatalogadoDesdeCodigo(
        "canarias_donaciones_entidades_sin_animo_lucro"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_donaciones_entidades_sin_animo_lucro"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 20% primeros 150; resto 15 o 17,5%; base máxima 10% liquidable.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 171 a 172.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [171, 172],
      [
        "canarias_donaciones_entidades_sin_animo_lucro:importe",
        "canarias_donaciones_entidades_sin_animo_lucro:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 ter del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes podrán aplicar en la cuota autonómica una deducción adicional a la prevista en el artículo 68.3 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, por los donativos, donaciones y aportaciones a las entidades a quienes se refiere la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, de acuerdo con la siguiente escala:",
      "Base de deducción importe hasta Porcentaje de deducción 150 euros. 20 Resto base de deducción. 15",
      "Si en los dos periodos impositivos inmediatos anteriores se hubieran realizado donativos, donaciones o aportaciones con derecho a deducción en favor de una misma entidad por importe igual o superior, en cada uno de ellos, al del ejercicio anterior, el porcentaje de deducción aplicable a la base de la deducción en favor de esa misma entidad que exceda de 150 euros será el 17,5%.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "2. La base de la deducción a la que se refiere este artículo no podrá exceder del 10% de la base liquidable del contribuyente. La base de la deducción será la definida en la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [
      "3. La deducción a la que se refiere el presente artículo será incompatible con las previstas en los artículos 3 y 4 bis de esta ley cuando la misma se aplique sobre las cantidades aportadas a los mismos beneficiarios perceptores de los donativos, donaciones y aportaciones que originan la aplicación de aquella.",
    ],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_restauracion_bienes_interes_cultural",
      nombreCatalogadoDesdeCodigo(
        "canarias_restauracion_bienes_interes_cultural"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_restauracion_bienes_interes_cultural"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 10%; 10% cuota; restauración de bien protegido.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 174.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [174],
      [
        "canarias_restauracion_bienes_interes_cultural:importe",
        "canarias_restauracion_bienes_interes_cultural:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 6 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) Que los citados bienes estén inscritos en el Registro Canario de Bienes de Interés Cultural o afectados por la declaración de Bien de Interés Cultural, siendo necesario, en este caso, que los inmuebles reúnan las condiciones que reglamentariamente se determinen.",
      "b) Que las obras de restauración, rehabilitación o reparación hayan sido autorizadas por el órgano competente de la Comunidad Autónoma o, en su caso, por el cabildo insular o ayuntamiento correspondiente.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "El importe de las deducciones previstas en los artículos 6, 14, 14-bis y 14-ter del presente texto refundido no podrá superar el 15 por 100 de la cuota íntegra autonómica.",
    ],
    limites: [
      "Los contribuyentes podrán deducirse el 10 por 100 de las cantidades destinadas por los titulares de bienes inmuebles ubicados en el territorio de la Comunidad Autónoma de Canarias a la restauración, rehabilitación o reparación de los mismos, con el límite del 10 por 100 de la cuota íntegra autonómica, y siempre que concurran las siguientes condiciones:",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_estudios_educacion_superior",
      nombreCatalogadoDesdeCodigo("canarias_estudios_educacion_superior"),
      categoriaCatalogadaDesdeCodigo("canarias_estudios_educacion_superior"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 1.800 fuera isla, 1.920 liquidable inferior a 37.062; 900 misma isla con traslado; 40% cuota.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 174 a 177.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [174, 175, 176, 177],
      [
        "canarias_estudios_educacion_superior:importe",
        "canarias_estudios_educacion_superior:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 7 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes podrán deducirse por cada descendiente o adoptado soltero menor de 25 años que dependa económicamente de ellas y que curse los estudios de educación superior previstos en el apartado 5 del artículo 3 de la Ley Orgánica 2/2006, de 3 de mayo , de Educación:",
      "a) 1.800 euros con carácter general cuando cursen los estudios de educación superior fuera de la isla en la que se encuentre la residencia habitual de la contribuyente.",
      "b) 900 euros cuando, cursando estudios de educación superior en la misma isla en la que se encuentre la residencia habitual del contribuyente, los descendientes o adoptados trasladen su domicilio a una vivienda arrendada, colegio mayor o menor o residencia de estudiantes, situado en el municipio donde radique el centro docente de educación superior o municipio limítrofe, pero, en todo caso, distinto al municipio de residencia habitual de contribuyente.",
      "La aplicación de la presente deducción, recogida en la letra b), queda condicionada a la declaración por parte de contribuyente del número de identificación fiscal del arrendador, de la identificación catastral de la vivienda arrendada y del canon arrendaticio anual o, en su caso, del número de identificación fiscal del colegio mayor o menor o de la residencia de estudiantes.",
      "La cuantía de la deducción prevista en la letra a) será de 1.920 euros para los contribuyentes cuya base liquidable sea inferior a 37.062 euros.",
      "a) Cuando los estudios no abarquen un curso académico completo o un mínimo de 30 créditos;",
      "b) cuando en la isla de residencia del contribuyente exista oferta educativa pública, diferente de la virtual o a distancia, para la realización de los estudios que determinen el traslado a otro lugar para ser cursados;",
      "c) cuando el contribuyente haya obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción por importe superior a 46.455 euros; en el supuesto de tributación conjunta, cuando la unidad familiar haya obtenido rentas por importe superior a 61.770 euros;",
      "d) cuando la persona descendiente que origina el derecho a la deducción haya obtenido rentas en el periodo impositivo por importe superior a 8.000 euros.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "2. Las deducciones anteriores, que se aplicarán en la declaración correspondiente al periodo impositivo en que se inicie el curso académico, tendrán como límite el 40 % de la cuota íntegra autonómica. Se asimilan a descendientes aquellas personas vinculadas con el contribuyente por razón de tutela o acogimiento no remunerado, en los términos previstos en la legislación vigente.",
      "3. La deducción prevista en la letra a) del apartado uno no se aplicará cuando concurra cualquiera de los siguientes supuestos:",
      "La deducción prevista en la letra b) del apartado 1 anterior no se aplicará cuando concurran los supuestos previstos en las citadas letras c) y d).",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "4. Cuando varios contribuyentes tengan distinto grado de parentesco con quien curse los estudios que originan el derecho a la deducción, solamente podrán practicar la deducción los del grado más cercano.",
      "Cuando dos o más contribuyentes tengan derecho a esta deducción y no opten o no puedan optar por la tributación conjunta, la deducción se prorrateará entre ellos.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_estudios_no_superiores",
      nombreCatalogadoDesdeCodigo("canarias_estudios_no_superiores"),
      categoriaCatalogadaDesdeCodigo("canarias_estudios_no_superiores"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: Gasto hasta 133 primer descendiente y 66 restantes; renta 46.455/61.770.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 177 a 179.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [177, 178, 179],
      [
        "canarias_estudios_no_superiores:importe",
        "canarias_estudios_no_superiores:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 7 bis del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "1. Los contribuyentes podrán deducirse las cantidades satisfechas en el periodo impositivo por la adquisición de libros de texto y materiales didácticos, cualquiera que sea su soporte, incluido el digital, transporte, uniforme y comedores escolares, hasta un máximo de 133 euros, por su primer descendiente o adoptado y 66 euros adicionales por cada uno de los restantes, que den lugar a la aplicación del mínimo por descendiente y que se encuentre escolarizado, que cursen estudios de primer y segundo grado de educación infantil, educación básica y educación secundaria posobligatoria previstos en los apartados 3 y 4 del artículo 3 de la Ley Orgánica 2/2006, de 3 de mayo , de Educación.",
      "Se asimilan a descendientes aquellas personas vinculadas con el contribuyente por razón de tutela o acogimiento no remunerado, en los términos previstos en la legislación vigente.",
      "El gasto se deberá justificar a través de factura, que debe cumplir todas las condiciones establecidas en el reglamento por el que se regulan las obligaciones de facturación, aprobado por el Real Decreto 1619/2012, de 30 de noviembre . La factura recibida por el contribuyente deberá conservarse durante el plazo de prescripción, admitiéndose copia de esta en el supuesto de que dos o más contribuyentes tengan derecho a la deducción y no opten, o no puedan optar, por la tributación conjunta.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "Esta deducción no se aplicará cuando el contribuyente haya obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción por importe superior a 46.455 euros; en el supuesto de tributación conjunta, cuando la unidad familiar haya obtenido rentas por importe superior a 61.770 euros.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "2. Cuando varios contribuyentes tengan distinto grado de parentesco con quien curse los estudios que originan el derecho a la deducción, solamente podrán practicar la deducción los de grado más cercano.",
      "Cuando dos o más contribuyentes tengan derecho a esta deducción, la deducción se prorrateará entre ellos por partes iguales.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_traslado_residencia_otra_isla_trabajo",
      nombreCatalogadoDesdeCodigo(
        "canarias_traslado_residencia_otra_isla_trabajo"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_traslado_residencia_otra_isla_trabajo"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 300 por contribuyente año traslado y siguiente; permanencia año y tres siguientes; cuota trabajo/actividad.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 179 a 180.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [179, 180],
      [
        "canarias_traslado_residencia_otra_isla_trabajo:importe",
        "canarias_traslado_residencia_otra_isla_trabajo:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 8 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "3. El incumplimiento de las condiciones de la deducción regulada en el apartado anterior dará lugar a la integración de las cantidades deducidas en la cuota íntegra autonómica del ejercicio en el que se produce el incumplimiento, con los correspondientes intereses de demora.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "1. Los contribuyentes que trasladen su residencia habitual desde la isla en la que esta figurare a cualquiera de las demás islas del archipiélago para realizar una actividad laboral por cuenta ajena o una actividad económica, siempre que permanezcan en la isla de destino durante el año en el que se produzca el traslado y los tres siguientes, podrán practicar una deducción de 300 euros en la cuota íntegra autonómica en el periodo impositivo en el que se produzca el cambio de residencia y en el siguiente, con el límite de la parte autonómica de la cuota íntegra procedente de rendimientos del trabajo y de actividades económicas en cada uno de los dos ejercicios en que sea aplicable la deducción.",
      "2. En el supuesto de tributación conjunta, la deducción de 300 euros se aplicará, en cada uno de los dos periodos impositivos en los que sea aplicable la deducción, a cada uno de los contribuyentes que traslade su residencia en los términos previstos en el apartado anterior, con el límite de la parte autonómica de la cuota íntegra procedente de rendimientos del trabajo y de actividades económicas que corresponda a las personas contribuyentes que generen derecho a la aplicación de la deducción.",
      "4. Solo tendrán derecho a la aplicación de esta deducción los contribuyentes que no hayan obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción por importe superior a 46.455 euros; y en el supuesto de tributación conjunta, cuando la unidad familiar no haya obtenido rentas por importe superior a 61.770 euros.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_inversion_entidades_nuevas_reciente_creacion",
      nombreCatalogadoDesdeCodigo(
        "canarias_inversion_entidades_nuevas_reciente_creacion"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_inversion_entidades_nuevas_reciente_creacion"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 20%/4.000; 30%/6.000 universidades y supuestos laborales/cooperativos; participación hasta 40%; tres años.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 180 a 182.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [180, 181, 182],
      [
        "canarias_inversion_entidades_nuevas_reciente_creacion:importe",
        "canarias_inversion_entidades_nuevas_reciente_creacion:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 9 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes podrán aplicar una deducción del 20 % de las cantidades invertidas durante el ejercicio en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en las sociedades mercantiles que revistan la forma de sociedad anónima y sociedad de responsabilidad limitada.",
      "3. Para la aplicación de la deducción deberán cumplirse los siguientes requisitos:",
      "a) Que, como consecuencia de la participación adquirida por el contribuyente, computada junto con la que posean de la misma entidad su cónyuge o personas unidas al contribuyente por razón de parentesco, en línea recta o colateral, por consanguinidad o afinidad hasta el tercer grado incluido, no se llegue a poseer durante ningún día del año natural más del 40 % del total del capital social de la entidad o de sus derechos de voto.",
      "b) Que el contribuyente no ejerza funciones ejecutivas ni de dirección en la entidad participada.",
      "c) Que dicha participación se mantenga un mínimo de tres años.",
      "d) Que la entidad de la que se adquieran las acciones o participaciones cumpla los siguientes requisitos:",
      "1.º Que tenga su domicilio social y fiscal en la Comunidad Autónoma de Canarias.",
      "2.º Que desarrolle una actividad económica. A estos efectos no se considerará que desarrolla una actividad económica cuando tenga por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo establecido en el artículo 4.ocho.dos a) de la Ley 19/1991, de 6 de junio , del Impuesto sobre el Patrimonio.",
      "3.º Que, para el caso en que la inversión efectuada corresponda a la constitución de la entidad, desde el primer ejercicio fiscal esta cuente, al menos, con una persona contratada con contrato laboral y a jornada completa y dada de alta en el Régimen General de la Seguridad Social.",
      "4.º Que, para el caso en que la inversión efectuada corresponda a una ampliación de capital de la entidad, dicha entidad hubiera sido constituida dentro de los tres años anteriores a la ampliación de capital y que la plantilla media de la entidad durante los dos ejercicios fiscales posteriores al de la ampliación se incremente respecto de la plantilla media que tuviera en los doce meses anteriores al menos en una persona con los requisitos anteriores, y dicho incremento se mantenga durante al menos otros veinticuatro meses. Para el cálculo de la plantilla media total de la entidad y de su incremento se tomarán las personas empleadas en los términos que disponga la legislación laboral, teniendo en cuenta la jornada contratada en relación con la jornada completa.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "2. El límite de deducción aplicable será de 4.000 euros anuales.",
      "4. La deducción contenida en este artículo será del 30 por 100 de las cantidades invertidas, con un límite de 6.000 euros, en el caso de sociedades creadas o participadas por universidades o centros de investigación.",
      "5. La deducción contenida en este artículo también será aplicable, en el porcentaje y límite establecidos en el apartado 4 y cumpliendo los requisitos establecidos en el apartado 3, excepto el contenido en el párrafo 3.º de dicho apartado, por las cantidades invertidas en el ejercicio en la adquisición de acciones, participaciones y aportaciones sociales como consecuencia de acuerdos de constitución o de ampliación de capital de sociedades anónimas laborales, sociedades de responsabilidad limitada laborales y sociedades cooperativa.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_acogimiento_menores",
      nombreCatalogadoDesdeCodigo("canarias_acogimiento_menores"),
      categoriaCatalogadaDesdeCodigo("canarias_acogimiento_menores"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 330 por menor, días de convivencia y reparto; adopción en ejercicio excluye.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 184 a 185.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [184, 185],
      [
        "canarias_acogimiento_menores:importe",
        "canarias_acogimiento_menores:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 11 bis del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "2. No dará lugar a esta deducción cuando la adopción del menor se produzca durante el periodo impositivo.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "1. Los contribuyentes podrán deducir la cantidad de 330 euros por cada menor en régimen de acogimiento familiar de urgencia, temporal o permanente previsto en el artículo 173 bis del Código Civil , siempre que convivan con el menor en la totalidad del periodo impositivo. Si la convivencia es inferior al periodo impositivo, la cuantía de la deducción se prorrateará por los días reales de convivencia en el periodo impositivo.",
      "3. Cuando dos o más contribuyentes tengan derecho a esta deducción y no opten o no puedan optar por la tributación conjunta, la deducción se prorrateará entre ellos por partes iguales.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_familias_monoparentales",
      nombreCatalogadoDesdeCodigo("canarias_familias_monoparentales"),
      categoriaCatalogadaDesdeCodigo("canarias_familias_monoparentales"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 133 únicos; convivencia y descendientes definidos; 183 días ante alteración; renta.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 185 a 186.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [185, 186],
      [
        "canarias_familias_monoparentales:importe",
        "canarias_familias_monoparentales:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 11 ter del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "1. Los contribuyentes que tengan a su cargo descendientes podrán deducir la cantidad única de 133 euros, siempre que no conviva con cualquier otra persona distinta a los citados descendientes, salvo que se trate de ascendientes que generen el derecho a la aplicación del mínimo por ascendientes.",
      "Se considerarán descendientes a los efectos de la presente deducción:",
      "a) Los hijos menores de edad, tanto por relación de paternidad como de adopción, siempre que convivan con el contribuyente y no tengan rentas anuales, excluidas las exentas, superiores a 8.000 euros.",
      "b) Los hijos mayores de edad con discapacidad, tanto por relación de paternidad como de adopción, siempre que convivan con el contribuyente y no tengan rentas anuales, excluidas las exentas, superiores a 8.000 euros.",
      "c) Los descendientes a los que se refieren las letras a) y b) anteriores que, sin convivir con el contribuyente, dependan económicamente de ella y estén internados en centros especializados.",
      "Se asimilarán a descendientes aquellas personas vinculadas al contribuyente por razón de tutela y acogimiento, en los términos previstos en la legislación vigente.",
      "2. En caso de convivencia con descendientes que no den derecho a deducción, no se perderá el derecho a la misma siempre y cuando las rentas anuales del descendiente, excluidas las exentas, no sean superiores a 8.000 euros.",
      "4. Cuando a lo largo del periodo impositivo se lleve a cabo una alteración de la situación familiar por cualquier causa, a efectos de aplicación de la deducción, se entenderá que ha existido convivencia cuando tal situación se haya producido durante al menos 183 días al año.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "3. Esta deducción no se aplicará cuando el contribuyente haya obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción, por importe superior a 46.455 euros; en el supuesto de tributación conjunta, cuando la unidad familiar haya obtenido rentas por importe superior a 61.770 euros.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_custodia_guarderias",
      nombreCatalogadoDesdeCodigo("canarias_custodia_guarderias"),
      categoriaCatalogadaDesdeCodigo("canarias_custodia_guarderias"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 18%, 530 por menor; menor de tres; meses al cumplir tres; reparto y factura.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 186 a 187.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [186, 187],
      [
        "canarias_custodia_guarderias:importe",
        "canarias_custodia_guarderias:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 12 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Por los descendientes menores de 3 años, los progenitores o tutores con quienes convivan podrán deducirse el 18% de las cantidades satisfechas en el periodo impositivo por los gastos de custodia en guarderías autorizadas para su apertura y funcionamiento, con un máximo de 530 euros anuales por cada descendiente.",
      "Se asimilan a descendientes aquellas personas vinculadas con el contribuyente por razón de tutela o acogimiento no remunerado, en los términos previstos en la legislación vigente.",
      "Los gastos citados se deberán justificar a través de factura que debe cumplir todas las condiciones establecidas en el reglamento por el que se regulan las obligaciones de facturación aprobado por el Real Decreto 1619/2012, de 30 de noviembre . La factura recibida por el contribuyente deberá conservarse durante el plazo de prescripción, admitiéndose copia de esta en el supuesto de que dos o más contribuyentes tengan derecho a la deducción y no opten, o no puedan optar, por la tributación conjunta.",
      "4. La aplicación de la presente deducción queda condicionada a la declaración por parte del contribuyente del número de identificación fiscal de la guardería autorizada y del importe abonado en el periodo impositivo.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "2. Son requisitos, para poder practicar esta deducción, que los contribuyentes no hayan obtenido rentas por importe superior a 46.455 euros en el periodo impositivo. En el supuesto de tributación conjunta, este requisito se entenderá cumplido si la renta de la unidad familiar no excede de 61.770 euros.",
      "La deducción y el límite a la misma en el periodo impositivo en el que el niño cumpla los 3 años se calcularán de forma proporcional al número de meses en que se cumplan los requisitos previstos en el presente artículo.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "3. Cuando dos o más contribuyentes tengan derecho a la deducción y no opten, o no puedan optar, por la tributación conjunta, su importe se prorrateará entre ellos por partes iguales.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_inversion_vivienda_habitual",
      nombreCatalogadoDesdeCodigo("canarias_inversion_vivienda_habitual"),
      categoriaCatalogadaDesdeCodigo("canarias_inversion_vivienda_habitual"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 5/3,5%, menores40 5,5/4%; base6.000; renta fronteras; art68.1 versión2012.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 188 a 190.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [188, 189, 190],
      [
        "canarias_inversion_vivienda_habitual:importe",
        "canarias_inversion_vivienda_habitual:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 14 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Remisión al artículo 68.1 vigente el 1 de enero de 2012: vivienda habitual con ocupación efectiva dentro de doce meses y residencia continuada de tres años, salvo causas justificadas; adquisición o rehabilitación y gastos de financiación admisibles. Las inversiones anteriores ya deducidas y las ganancias exentas por reinversión condicionan la nueva base. El límite autonómico aplicable en 2025 sigue siendo 6.000 euros.",
      "Sin perjuicio de la aplicación en el tramo autonómico de la deducción por inversión en vivienda habitual contemplada en la normativa estatal del impuesto sobre la renta de las personas físicas, se establece una deducción por las cantidades satisfechas en el periodo impositivo por la adquisición de la vivienda que constituya o vaya a constituir la residencia habitual del contribuyente, en los mismos términos y siempre que concurran los mismos requisitos exigidos en el artículo 68.1 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, según redacción vigente el 1 de enero de 2012.",
      "El porcentaje de deducción aplicable será el que corresponda de los siguientes:",
      "– Si la renta es inferior a 26.035 euros: el 5%.",
      "– Si la renta es igual o superior a 26.035 euros e inferior a 46.455 euros: el 3,5%.",
      "Los citados porcentajes serán del 5,5% y del 4%, respectivamente, si el contribuyente es menor de 40 años.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "El importe de las deducciones previstas en los artículos 6, 14, 14-bis y 14-ter del presente texto refundido no podrá superar el 15 por 100 de la cuota íntegra autonómica.",
    ],
    limites: [
      "La base máxima de esta deducción será de 6.000 euros anuales.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_rehabilitacion_energetica_vivienda",
      nombreCatalogadoDesdeCodigo(
        "canarias_rehabilitacion_energetica_vivienda"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_rehabilitacion_energetica_vivienda"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 12%; base7.000, 10% cuota; certificados antes/después y pago no efectivo.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 190 a 193.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [190, 191, 192, 193],
      [
        "canarias_rehabilitacion_energetica_vivienda:importe",
        "canarias_rehabilitacion_energetica_vivienda:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 14 bis del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "La vivienda habitual deberá ser propiedad del contribuyente.",
      "No darán derecho a practicar esta deducción las obras realizadas en plazas de garaje, jardines, parques, piscinas e instalaciones deportivas y otros elementos análogos.",
      "A los efectos de la presente deducción, se entenderá por obras de rehabilitación energética las destinadas a la mejora del comportamiento energético de las edificaciones reduciendo su demanda energética, al aumento del rendimiento de los sistemas e instalaciones térmicas o a la incorporación de equipos que utilicen fuentes de energía renovables. También tendrán tal consideración las de mejora de las instalaciones de suministro e instalación de mecanismos que favorezcan el ahorro de agua, así como la implantación de redes de saneamiento separativas en el edificio y otros sistemas que favorezcan la reutilización de las aguas grises y pluviales en el mismo edificio o en la parcela o que reduzcan el volumen de vertido al sistema público de alcantarillado. En el supuesto de edificaciones en régimen de propiedad horizontal en que la obra de rehabilitación energética sea contratada por la comunidad de propietarios, el importe del gasto se imputará a los diferentes propietarios con derecho a deducción en función de su cuota de participación.",
      "2. La obra de rehabilitación energética deberá acreditarse mediante los certificados de calificación energética, en los términos establecidos en el Real Decreto 390/2021, de 1 de junio , por el que se aprueba el procedimiento básico para la certificación de la eficiencia energética de los edificios, debidamente inscritos en el Registro de certificados de eficiencia energética de edificios de la consejería competente en materia de transición ecológica y energía, en el que conste el certificado obtenido antes de la realización de las obras de rehabilitación energética y el expedido tras su finalización.",
      "3. La base de la deducción estará constituida por las cantidades satisfechas, mediante tarjeta de crédito o débito, transferencia bancaria, cheque nominativo o ingreso en cuenta en entidades de crédito, a las personas o entidades que realicen las obras. En ningún caso darán derecho a practicar esta deducción las cantidades satisfechas mediante entregas de dinero de curso legal.",
      "El gasto de las obras de rehabilitación energética se deberá justificar a través de factura, que debe cumplir todas las condiciones establecidas en el Reglamento por el que se regulan las obligaciones de facturación aprobado por el Real Decreto 1619/2012, de 30 de noviembre . En el supuesto de edificaciones en régimen de propiedad horizontal en el que la obra de rehabilitación energética sea contratada por la comunidad de propietarios, esta certificará el importe del gasto imputable a cada vivienda y que ha sido efectivamente satisfecho por el propietario en el periodo impositivo.",
      "La factura recibida por el contribuyente o, en su caso, la certificación emitida por la comunidad de propietarios deberá conservarse durante el plazo de prescripción, admitiéndose copia de la misma en el supuesto de que dos o más contribuyentes tengan derecho a la deducción y no opten, o no puedan optar, por la tributación conjunta.",
      "4. No generarán derecho a la presente deducción las cantidades destinadas a mobiliario o a electrodomésticos.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "El importe de las deducciones previstas en los artículos 6, 14, 14-bis y 14-ter del presente texto refundido no podrá superar el 15 por 100 de la cuota íntegra autonómica.",
    ],
    limites: [
      "1. Los contribuyentes podrán practicar la deducción del 12 % y con el límite del 10 % de la cuota íntegra autonómica de las cantidades destinadas a las obras de rehabilitación energética en la vivienda habitual del contribuyente en los términos expresados en el artículo anterior.",
      "La base máxima anual de esta deducción será de 7000 euros por contribuyente.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "5. Cuando dos o más contribuyentes tengan derecho a la deducción y no opten, o no puedan optar, por la tributación conjunta, su importe se prorrateará entre ellos por partes iguales.",
    ],
    incompatibilidades: [
      "6. La presente deducción es incompatible con la deducción por cantidades destinadas a restauración, rehabilitación o reparación y con la deducción por inversión en vivienda habitual reguladas en los artículos 6 y 14, respectivamente, del presente texto refundido, no pudiendo aplicarse sobre las mismas cantidades ambas deducciones.",
    ],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_adecuacion_vivienda_discapacidad",
      nombreCatalogadoDesdeCodigo("canarias_adecuacion_vivienda_discapacidad"),
      categoriaCatalogadaDesdeCodigo(
        "canarias_adecuacion_vivienda_discapacidad"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 14%,18% mayor65; discapacidad65; base15.000; familiar renta35.735.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 193 a 194.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [193, 194],
      [
        "canarias_adecuacion_vivienda_discapacidad:importe",
        "canarias_adecuacion_vivienda_discapacidad:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 14 ter del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes que acrediten un grado de discapacidad igual o superior al 65% podrán deducir el 14% de las cantidades satisfechas durante el periodo impositivo en la adecuación de la vivienda que constituya o vaya a constituir su residencia habitual.",
      "El porcentaje de deducción será del 18% si el contribuyente fuera mayor de 65 años.",
      "2. La presente deducción del 14% resultará igualmente aplicable cuando la discapacidad igual o superior al 65% sea padecida por el cónyuge, ascendientes o descendientes que convivan con el contribuyente y siempre que aquellos individualmente considerados no tengan rentas anuales, excluidas las exentas, superiores a 35.735 euros.",
      "El porcentaje de deducción será del 18% si el cónyuge, ascendientes o descendientes fuera mayor de 65 años.",
      "3. Las obras e instalaciones en que consista la adecuación deberán resultar estrictamente necesarias para la accesibilidad y comunicación sensorial, de manera que faciliten el desenvolvimiento digno y adecuado de las personas con discapacidad, extremo que habrá de ser acreditado ante la administración tributaria mediante resolución o certificado expedido por la consejería competente en materia de valoración de discapacidad.",
      "4. La base de la deducción la constituyen las cantidades satisfechas durante el periodo impositivo en las obras e instalaciones en que consista la adecuación de la vivienda habitual.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
      "El importe de las deducciones previstas en los artículos 6, 14, 14-bis y 14-ter del presente texto refundido no podrá superar el 15 por 100 de la cuota íntegra autonómica.",
    ],
    limites: [
      "5. La base máxima de esta deducción será de 15.000 euros.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "6. Cuando dos o más contribuyentes tengan derecho a la aplicación de esta deducción respecto de los mismos ascendientes o descendientes para un mismo periodo impositivo, la base máxima de la deducción se prorrateará entre ellos por partes iguales. No obstante, cuando los contribuyentes tengan distinto grado de parentesco con el ascendiente o descendiente, la aplicación de la reducción corresponderá a los de grado más cercano.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_arrendamiento_dacion_pago",
      nombreCatalogadoDesdeCodigo("canarias_arrendamiento_dacion_pago"),
      categoriaCatalogadaDesdeCodigo("canarias_arrendamiento_dacion_pago"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 25%,1.200; renta46.455 +15.315 conjunta; operación art35bis.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 196 a 197.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [196, 197],
      [
        "canarias_arrendamiento_dacion_pago:importe",
        "canarias_arrendamiento_dacion_pago:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 15 bis del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "En los supuestos de arrendamiento vinculados a determinadas operaciones de dación en pago contempladas en el artículo 35 bis de este texto refundido, los arrendatarios podrán deducirse el 25% de las cantidades satisfechas durante el ejercicio correspondiente, por el arrendamiento de la vivienda habitual, con un máximo de 1.200 euros anuales y con un nivel de renta no superior a 46.455 euros. Este importe se incrementará en 15.315 euros en el supuesto de opción por la tributación conjunta.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_adecuacion_inmueble_arrendamiento",
      nombreCatalogadoDesdeCodigo("canarias_adecuacion_inmueble_arrendamiento"),
      categoriaCatalogadaDesdeCodigo(
        "canarias_adecuacion_inmueble_arrendamiento"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 10%,150 por inmueble; reparto según propiedad; factura y LAU; no duplicar primas.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 197 a 198.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [197, 198],
      [
        "canarias_adecuacion_inmueble_arrendamiento:importe",
        "canarias_adecuacion_inmueble_arrendamiento:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 15 ter del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes podrán deducir el 10 % de las cantidades satisfechas en el periodo impositivo de los gastos de reparación y conservación, así como cualquier otro necesario para que un inmueble se encuentre en condiciones de ser arrendado, gastos de formalización de contratos de arrendamiento, gastos de primas de seguros por daños e impagos y los gastos necesarios para la obtención de certificados de eficiencia energética.",
      "2. La base de esta deducción estará constituida por las cantidades justificadas con factura, que deberá cumplir todas las condiciones establecidas en el Reglamento por el que se regulan las obligaciones de facturación aprobado por el Real Decreto 1619/2012, de 30 de noviembre . La factura recibida por el contribuyente deberá conservarse durante el plazo de prescripción.",
      "4. La deducción solo resultará aplicable a los arrendamientos de vivienda previstos en el artículo 2 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos.",
      "5. En caso de incurrir en gastos de reparación y conservación del inmueble, la aplicación de la presente deducción queda condicionada a la declaración por parte del contribuyente del número de identificación fiscal del prestador de los servicios y de su importe anual.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "3. El límite máximo de deducción es de 150 euros tanto en tributación individual como en tributación conjunta, por inmueble arrendado.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "Cuando dos o más contribuyentes tengan derecho a esta deducción, su importe se prorrateará entre ellos en función del porcentaje de participación en la propiedad o usufructo del inmueble.",
    ],
    incompatibilidades: [
      "6. La presente deducción es incompatible con la deducción por gastos en primas de seguros de crédito para cubrir impagos de rentas de arrendamientos de vivienda regulada en el artículo 15 quater del presente texto refundido, no pudiendo aplicarse sobre las mismas cantidades ambas deducciones.",
    ],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_primas_seguro_impago_arrendamientos",
      nombreCatalogadoDesdeCodigo(
        "canarias_primas_seguro_impago_arrendamientos"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_primas_seguro_impago_arrendamientos"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 75%,150; contrato un año, fianza, rendimiento capital, alquiler hasta800.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 198 a 200.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [198, 199, 200],
      [
        "canarias_primas_seguro_impago_arrendamientos:importe",
        "canarias_primas_seguro_impago_arrendamientos:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 15 quater del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Se establece una deducción del 75% de los gastos satisfechos por el contribuyente durante el ejercicio en concepto de primas de seguros de crédito que cubran total o parcialmente el impago de las rentas a las que el contribuyente tenga derecho por razón del arrendamiento de un bien inmueble, situado en Canarias, a un tercero destinado a vivienda, con un máximo de 150 euros anuales, siempre y cuando se cumplan los siguientes requisitos:",
      "a) Que la duración del contrato de arrendamiento de vivienda con un mismo arrendatario sea igual o superior a un año.",
      "b) Que se haya constituido el depósito de la fianza a la que se refiere el artículo 36.1 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, a favor del órgano competente de la Administración de la Comunidad Autónoma de Canarias.",
      "c) Que el contribuyente declare en el impuesto sobre la renta de las personas físicas el rendimiento derivado de las rentas del arrendamiento de la vivienda como rendimientos del capital inmobiliario.",
      "d) Que el arrendador esté al corriente de sus obligaciones fiscales e identifique en sus declaraciones de IRPF al arrendatario y el número de referencia catastral del bien arrendado.",
      "e) Que el importe mensual del arrendamiento no sea superior a 800 euros.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_puesta_viviendas_mercado_arrendamiento",
      nombreCatalogadoDesdeCodigo(
        "canarias_puesta_viviendas_mercado_arrendamiento"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_puesta_viviendas_mercado_arrendamiento"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 1.000 inmueble, una vez, hasta cinco; porcentaje propiedad; tres años efectivos y sustitución seis meses.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 200 a 201.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [200, 201],
      [
        "canarias_puesta_viviendas_mercado_arrendamiento:importe",
        "canarias_puesta_viviendas_mercado_arrendamiento:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 16 del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Los contribuyentes propietarios o usufructuarios de inmuebles respecto de los que durante todo el periodo impositivo anterior hubiera procedido la imputación de una renta inmobiliaria en los términos del artículo 85 de la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, podrán deducir en la cuota 1.000 euros por cada uno de estos bienes inmuebles radicados en Canarias que se destinen a los arrendamientos de vivienda previstos en el artículo 2 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, siempre que el arrendamiento no constituya una actividad económica.",
      "También podrán aplicar esta deducción los contribuyentes que adquieran por cualquier título un bien inmueble, siempre que en el periodo impositivo anterior no hubiese sido arrendado y, en el plazo máximo de seis meses desde la adquisición, lo destinen al arrendamiento de viviendas previsto en el artículo 2 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, siempre que el arrendamiento no constituya una actividad económica.",
      "2. La deducción será única por cada inmueble y aplicable en el primer periodo impositivo en el que la vivienda sea arrendada.",
      "3. Para aplicar esta deducción deberán concurrir todos los requisitos siguientes:",
      "a) El contrato de arrendamiento deberá tener una duración efectiva de al menos tres años. No obstante, no se perderá el derecho a la deducción en caso de que el contrato de arrendamiento tenga una duración inferior a tres años cuando dicho inmueble pase a estar en situación de expectativa de alquiler y vuelva a ser objeto de un nuevo contrato de arrendamiento de vivienda dentro del plazo de seis meses desde la finalización del anterior contrato, siempre que la suma de los periodos de duración de estos contratos de arrendamiento sea de al menos tres años.",
      "b) El arrendatario de la vivienda no podrá ser el cónyuge ni un pariente, por consanguinidad o por afinidad, hasta el tercer grado inclusive, del contribuyente.",
      "c) Solo se aplicará esta deducción a un máximo de cinco inmuebles, destinados al arrendamiento de vivienda, excluidos garajes y trasteros. A los exclusivos efectos del cálculo de este número de inmuebles, cada uno computará como una unidad, con independencia del porcentaje de titularidad.",
      "4. El incumplimiento de los requisitos establecidos en este artículo para tener derecho a la aplicación de la deducción, dará lugar a que el contribuyente deba proceder a la integración en el Impuesto sobre la Renta de las Personas Físicas en el ejercicio del incumplimiento, de la cantidad que en su día se dedujo, liquidándose intereses de demora en los términos previstos en la Ley 58/2003, de 17 de diciembre , General Tributaria, y en su normativa de desarrollo.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "El importe de la deducción se prorrateará en función del porcentaje de participación en la propiedad o usufructo del inmueble.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_familiares_dependientes_discapacidad",
      nombreCatalogadoDesdeCodigo(
        "canarias_familiares_dependientes_discapacidad"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_familiares_dependientes_discapacidad"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 600 persona discapacidad65 con mínimo; renta46.455/61.770; asistencia20% cuotas hasta500.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 204 a 205.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [204, 205],
      [
        "canarias_familiares_dependientes_discapacidad:importe",
        "canarias_familiares_dependientes_discapacidad:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 16 quater del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "1. Los contribuyentes que tengan derecho a la aplicación del mínimo por discapacidad de descendientes o ascendientes conforme a la normativa estatal del impuesto sobre la renta de las personas físicas, siempre que tales descendientes o ascendientes tuvieran una discapacidad igual o superior al 65%, podrán deducirse de la cuota íntegra autonómica la cantidad de 600 euros por persona con discapacidad.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "2. Esta deducción no se aplicará cuando el contribuyente haya obtenido rentas en el periodo impositivo en el que se origina el derecho a la deducción por importe superior a 46.455 euros; en el supuesto de tributación conjunta, cuando la unidad familiar haya obtenido rentas por importe superior a 61.770 euros.",
      "4. Asimismo, cuando se acredite que las personas con discapacidad necesitan ayuda de terceras personas y generen derecho a la aplicación del mínimo en concepto de gastos de asistencia, conforme a la normativa estatal reguladora del impuesto sobre la renta de las personas físicas, el contribuyente podrá deducirse de la cuota íntegra autonómica la cantidad resultante de aplicar el 20% de las cantidades satisfechas en el periodo impositivo por las cuotas a la Seguridad Social de un trabajador incluido en el Sistema Especial del Régimen General de la Seguridad Social de Empleados del Hogar, con el límite de 500 euros anuales por contribuyente.",
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "3. Cuando varios contribuyentes tengan derecho a la aplicación de la deducción prevista en el presente artículo, se estará a las reglas del prorrateo, convivencia y demás límites previstos en la normativa estatal del impuesto sobre la renta de las personas físicas.",
      "Las cuotas satisfechas se atribuirán íntegramente al contribuyente que figure como empleador salvo que se trate de matrimonios en régimen de gananciales, en cuyo caso se atribuirán a los cónyuges por partes iguales. Se deberá consignar en la autoliquidación el número de identificación fiscal o número de identidad de extranjero del empleado que genera el derecho a esta deducción.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "canarias_cuotas_seguridad_social_empleados_hogar",
      nombreCatalogadoDesdeCodigo(
        "canarias_cuotas_seguridad_social_empleados_hogar"
      ),
      categoriaCatalogadaDesdeCodigo(
        "canarias_cuotas_seguridad_social_empleados_hogar"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 20%,500 anuales; empleador, descendientes con rentas de trabajo/actividad o edades/grados tasados.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 205 a 206.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [205, 206],
      [
        "canarias_cuotas_seguridad_social_empleados_hogar:importe",
        "canarias_cuotas_seguridad_social_empleados_hogar:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 16 quinquies del texto refundido de Canarias, Decreto Legislativo 1/2009; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "1. Los contribuyentes podrán deducir un 20 % de las cantidades satisfechas en el periodo impositivo por las cuotas a la Seguridad Social de un trabajador incluido en el Sistema Especial para Empleados del Hogar del Régimen General de la Seguridad Social, correspondiente a la cotización anual de un empleado o empleada del hogar familiar, que constituya la vivienda habitual del empleador o empleadora.",
      "El importe máximo de la deducción no podrá superar los 500 euros anuales, con independencia del número de personas contratadas.",
      "2. Solo tendrán derecho a la aplicación de esta deducción cualquiera de los siguientes contribuyentes:",
      "a) Los contribuyentes que a la fecha de devengo del impuesto tengan derecho a la aplicación del mínimo por descendientes regulado en la normativa del impuesto sobre la renta de las personas físicas, siempre que perciban rendimientos del trabajo o de actividades económicas.",
      "b) Los contribuyentes que tengan una edad igual o superior a 75 años.",
      "c) Los contribuyentes mayores de 65 años si tienen la consideración de personas con discapacidad física, orgánica o sensorial con un grado igual o superior al 65 por 100 o con discapacidad cognitiva, psicosocial, intelectual o del desarrollo con un grado igual o superior al 33 %.",
      "4. La aplicación de la deducción queda condicionada a la declaración por parte del contribuyente del número de identificación fiscal o número de identidad de extranjero del trabajador incluido en el Sistema Especial para Empleados del Hogar del Régimen General de la Seguridad Social que genera el derecho a esta deducción.",
      "1. Los contribuyentes del Impuesto sobre la Renta de las Personas Físicas que residan habitualmente en la Comunidad Autónoma de Canarias podrán practicar las deducciones autonómicas que se regulan en este Texto Refundido, en los términos establecidos en los artículos siguientes. A estos efectos, se estará al concepto de residencia habitual recogido en la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas.",
      "2. La determinación de las circunstancias personales y familiares que deban tenerse en cuenta para la aplicación de estas deducciones se realizará atendiendo a la situación existente en la fecha del devengo, salvo que expresamente se disponga otra cosa.",
      "4. En el caso de que los contribuyentes que formen parte de una unidad familiar opten por la tributación conjunta y alguno de ellos resida en otra comunidad autónoma distinta de la Comunidad Autónoma de Canarias, será de aplicación lo dispuesto en este Texto Refundido siempre que el miembro de la misma residente habitualmente en la Comunidad Autónoma de Canarias tenga la mayor base liquidable, de conformidad con las normas de individualización del impuesto.",
      "A los efectos de la aplicación de las deducciones autonómicas de la Comunidad Autónoma de Canarias en el impuesto sobre la renta de las personas físicas, las referencias contenidas a la expresión “renta” en las normas reguladoras de las mismas deberán entenderse hechas a la base imponible general y del ahorro definida en la Ley 35/2006, de 28 de noviembre , del Impuesto sobre la Renta de las Personas Físicas y de modificación parcial de las Leyes de los Impuestos sobre Sociedades, sobre la Renta de no Residentes y sobre el Patrimonio, o en el texto legal que lo sustituya.",
      "1. La suma de las deducciones previstas en este capítulo aplicadas sobre la cuota íntegra autonómica en ningún caso podrá superar el importe de la misma.",
      "2. Sobre un mismo bien, por parte de un mismo contribuyente, no se podrá aplicar más de una de las deducciones previstas en el presente capítulo.",
      "3. Las bases de las deducciones a la cuota íntegra autonómica reguladas en el presente texto refundido, se minorarán en el importe de las ayudas concedidas por las Administraciones Públicas en el periodo impositivo de que se trate, que cubran la totalidad o parte de los gastos que dan derecho a la deducción.",
      "Lo establecido en este apartado será aplicable cuando la ayuda tenga la consideración de renta exenta a los efectos del Impuesto sobre la Renta de las Personas Físicas.",
    ],
    limites: [
      "3. Cuando las personas a que se refiere el apartado 1, integradas en una unidad familiar, opten por tributar conjuntamente en los términos de la normativa estatal reguladora del Impuesto sobre la Renta de las Personas Físicas, las deducciones autonómicas previstas en este texto refundido que se imputarán a la unidad familiar serán aquellas que le hubieran correspondido a cada contribuyente si hubieran optado por la tributación individual, si bien los límites que en las mismas se contemplan se referirán a la cuota íntegra autonómica correspondiente a la tributación conjunta.",
    ],
    prorrateo: [
      "3. Las cuotas satisfechas se atribuirán íntegramente al contribuyente que figure como empleador salvo que se trate de matrimonios en régimen de gananciales, en cuyo caso se atribuirán a los cónyuges por partes iguales.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CANARIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CANARIAS_NACIMIENTO_ADOPCION_2025,
  CANARIAS_DISCAPACIDAD_MAYORES_65_2025,
  CANARIAS_FAMILIA_NUMEROSA_2025,
  CANARIAS_ALQUILER_VIVIENDA_HABITUAL_2025,
  CANARIAS_GASTO_ENFERMEDAD_2025,
  CANARIAS_CONTRIBUYENTES_DESEMPLEADOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
