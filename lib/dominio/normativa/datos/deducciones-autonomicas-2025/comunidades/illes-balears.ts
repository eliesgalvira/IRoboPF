import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "balears_arrendamiento_vivienda_habitual",
    "Por arrendamiento de la vivienda habitual en el territorio de las Illes Balears",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "15% límite 530 euros; 20% límite 650 euros para colectivos cualificados",
    },
    [
      "15%, límite 530 euros: menores de 36 o mayores de 65 sin actividad",
      "20%, límite 650 euros: menores de 30, discapacidad, familia numerosa/monoparental o autónomos",
      "Límite base general: 33.000 euros individual y 52.800 conjunta",
    ],
    [133, 134, 135, 136]
  ),
  normativa:
    "Artículo 3 bis del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
  requisitos: [
    "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
    "Ley 8/2018, artículos 6 y 7.7: familia numerosa conforme a la legislación estatal y familia monoparental con un hijo con discapacidad reconocida del 33% o superior; para equiparación monoparental a efectos fiscales, un hijo con discapacidad del 33% o superior o dos o más hijos, con reconocimiento y condiciones legales de edad, convivencia y dependencia.",
    "1. Los contribuyentes menores de treinta y seis años, y también los mayores de sesenta y cinco años que no ejerzan ninguna actividad laboral o profesional, que sean arrendatarios de una vivienda habitual en el territorio de las Illes Balears pueden deducir, de la cuota íntegra autonómica, el 15 % de los importes satisfechos en el periodo impositivo, con un máximo de 530 euros anuales, siempre que se cumplan los siguientes requisitos:",
    "a) Que se trate del arrendamiento de la vivienda habitual del contribuyente, ocupada efectivamente por este, y que la duración del contrato de arrendamiento sea igual o superior a un año.",
    "b) Que, durante al menos la mitad del periodo impositivo, ni el contribuyente ni ninguno de los miembros de su unidad familiar sean titulares, del pleno dominio o de un derecho real de uso o disfrute, de otra vivienda distante a menos de 70 quilómetros de la vivienda arrendada, excepto en los casos en que la otra vivienda esté ubicada fuera de las Illes Balears o en otra isla, o genere, por el contribuyente o el resto de miembros de su unidad familiar, rendimientos del capital inmobiliario durante el mismo periodo impositivo.",
    "c) Que el contribuyente no tenga derecho en el mismo periodo impositivo a ninguna deducción por inversión en vivienda habitual.",
    "Ley 6/2025, disposición final segunda y disposición final vigesimoprimera.2: efectos desde el 25 de julio de 2025. Para fallecimientos anteriores al 25 de julio de 2025 no se aplica esta reforma: no se incorpora el colectivo de autónomos con 183 días en arrendamiento y libros, ni la nueva deducción por ocupación; en nacimiento se conserva el reparto anterior entre progenitores con derecho.",
  ],
  limites: [
    "2. La aplicación de esta deducción exige que la base imponible total del contribuyente no supere el importe de 52.800 euros en el caso de tributación conjunta y de 33.000 euros en el de tributación individual. En caso de tributación conjunta, solo se pueden beneficiar de esta deducción los contribuyentes integrados en la unidad familiar que cumplan las condiciones establecidas en el apartado anterior y por el importe de las cuantías efectivamente satisfechas por estos.",
    "3. Cuando el contribuyente sea menor de 30 años, tenga reconocido un grado de discapacidad igual o superior al 33%, tenga derecho al mínimo por discapacidad de ascendientes o descendientes en el impuesto sobre la renta de las personas físicas, o sea el padre, la madre o los padres que convivan con el hijo o los hijos sometidos a la patria potestad y que integren una familia numerosa, en los términos que establece el artículo 6 de la Ley 8/2018 , de 13 de julio, de apoyo a las familias, o una familia monoparental de las previstas en el artículo 7.7 de la citada Ley 8/2018 , o un trabajador autónomo que esté de alta en el régimen especial de trabajadores autónomos o por cuenta propia de la Seguridad Social que proceda un mínimo de 183 días a lo largo del periodo impositivo correspondiente, se podrá deducir el 20% de los importes satisfechos en el periodo impositivo, con un máximo de 650 euros anuales, o, en el caso de familias numerosas de categoría especial, siempre que se cumplan los requisitos establecidos en el apartado 1 de este artículo, con los límites de renta a que se refiere el apartado 2 anterior.",
    "Además, en el supuesto de familias numerosas o monoparentales de las previstas en el artículo 7.7 de la citada Ley 8/2018 , los límites de renta a que se refiere el apartado 2 de este artículo se incrementarán en un 20% y, en el caso particular de familias numerosas de categoría especial, en un 30%.",
  ],
  prorrateo: [],
  incompatibilidades: [],
  compatibilidades: [],
}

export const BALEARS_LIBROS_TEXTO_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "balears_libros_texto",
    "Por gastos de adquisición de libros de texto",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de importes destinados a libros de texto, límite 220 euros por hijo o 350 euros con límite incrementado",
    },
    [
      "100% del gasto en libros de texto",
      "Límite general: 220 euros por hijo",
      "Límite incrementado: 350 euros por hijo",
    ],
    [136, 137, 138]
  ),
  normativa:
    "Artículo 4 del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
  requisitos: [
    "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
    "Ley 8/2018, artículos 6 y 7.7: familia numerosa conforme a la legislación estatal y familia monoparental con un hijo con discapacidad reconocida del 33% o superior; para equiparación monoparental a efectos fiscales, un hijo con discapacidad del 33% o superior o dos o más hijos, con reconocimiento y condiciones legales de edad, convivencia y dependencia.",
    "2. A efectos de la aplicación de esta deducción, sólo podrán tenerse en cuenta los hijos que, a su vez, den derecho al mínimo por descendientes regulados en el artículo 58 de la Ley 35/2006 .",
    "Ley 6/2025, disposición final segunda y disposición final vigesimoprimera.2: efectos desde el 25 de julio de 2025. Para fallecimientos anteriores al 25 de julio de 2025 no se aplica esta reforma: no se incorpora el colectivo de autónomos con 183 días en arrendamiento y libros, ni la nueva deducción por ocupación; en nacimiento se conserva el reparto anterior entre progenitores con derecho.",
  ],
  limites: [
    "1. Por el concepto de gastos en libros de texto editados para el desarrollo y la aplicación de los currículos correspondientes al segundo ciclo de educación infantil, a la educación primaria, a la educación secundaria obligatoria, al bachillerato y a los ciclos formativos de formación profesional específica, se deducirá el 100% de los importes destinados a estos gastos por cada hijo que curse estos estudios, hasta el límite máximo de 220 euros por hijo.",
    "3. En cualquier caso, la aplicación de esta deducción exige que la base imponible total no supere el importe de 52.800 euros en el caso de tributación conjunta y de 33.000 euros en el caso de tributación individual, así como la justificación documental, mediante las facturas o los documentos equivalentes correspondientes, los cuales deben mantenerse a disposición de la administración tributaria.",
    "4. Cuando el contribuyente sea menor de 30 años, tenga reconocido un grado de discapacidad igual o superior al 33%, tenga derecho al mínimo por discapacidad de ascendientes o descendientes en el impuesto sobre la renta de las personas físicas, o sea el padre, la madre o los padres que convivan con el hijo o los hijos sometidos a la patria potestad y que integren una familia numerosa, en los términos que establece el artículo 6 de la Ley 8/2018, de 31 de julio , de apoyo a las familias, o una familia monoparental de las previstas en el artículo 7.7 de la citada Ley 8/2018 , o un trabajador autónomo que esté de alta en el régimen especial de trabajadores autónomos o por cuenta propia de la Seguridad Social que proceda un mínimo de 183 días a lo largo del periodo impositivo correspondiente, el límite máximo a que hace referencia el apartado 1 de este artículo será de 350 euros por hijo.",
    "Además, en el supuesto de familias numerosas o monoparentales de las previstas en el artículo 7.7 de la citada Ley 8/2018 , los límites de renta a que se refiere el apartado 3 de este artículo se incrementarán en un 20% y, en el caso particular de familias numerosas de categoría especial, en un 30%.",
  ],
  prorrateo: [
    "Si los hijos conviven con ambos padres y éstos optan por la tributación individual, la deducción se prorrateará por partes iguales en la declaración de cada uno.",
  ],
  incompatibilidades: [],
  compatibilidades: [],
}

export const BALEARS_NACIMIENTO_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "balears_nacimiento",
    "Por nacimiento",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "800 euros primer hijo, 1.000 segundo, 1.200 tercero y 1.400 cuarto y siguientes; 50% si supera límites",
    },
    [
      "800 euros primer hijo",
      "1.000 euros segundo hijo",
      "1.200 euros tercer hijo",
      "1.400 euros cuarto y siguientes",
      "Si se superan límites de renta, puede aplicarse el 50%",
    ],
    [155, 156, 157, 158]
  ),
  normativa:
    "Artículo 6 ter del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
  requisitos: [
    "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
    "Ley 8/2018, artículos 6 y 7.7: familia numerosa conforme a la legislación estatal y familia monoparental con un hijo con discapacidad reconocida del 33% o superior; para equiparación monoparental a efectos fiscales, un hijo con discapacidad del 33% o superior o dos o más hijos, con reconocimiento y condiciones legales de edad, convivencia y dependencia.",
    "1. Por cada nacimiento de un hijo o una hija en el periodo impositivo que dé derecho a la aplicación del mínimo por descendientes previsto en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas y de modificación parcial de leyes de los impuestos sobre sociedades, sobre la renta de no residentes y sobre el patrimonio, los contribuyentes podrán deducir de la cuota íntegra autonómica las siguientes cantidades:",
    "a) Por el primer hijo o hija: 800 euros.",
    "b) Por el segundo hijo o hija: 1.000 euros.",
    "c) Por el tercer hijo o hija: 1.200 euros.",
    "d) Por el cuarto hijo o hija y siguientes: 1.400 euros.",
    "La aplicación de estas deducciones no puede dar como resultado una cuota líquida negativa, sin perjuicio de lo que prevén los apartados 6, 7 y 9 de este artículo.",
    "2. A efectos de determinar el derecho a esta deducción y el número de orden del hijo nacido, se tendrán en cuenta los hijos que convivan con el contribuyente y para los cuales se pueda aplicar el mínimo por descendientes mencionado en el apartado anterior en la fecha de devengo del impuesto, y se computarán tanto los hijos naturales como los adoptivos.",
    "3. La aplicación de esta deducción requiere que se verifiquen los siguientes requisitos:",
    "a) Que el contribuyente haya sido residente fiscal en las Illes Balears el ejercicio anterior al del nacimiento.",
    "4. Cuando concurran dos progenitores con derecho ambos o solo uno de ellos a la deducción, y no opten por la tributación conjunta entre ellos, el importe de la deducción que corresponda a cada uno de los que tienen derecho a la deducción será del 50% de este importe.",
    "5. De acuerdo con el apartado anterior, en caso de que el número de hijos de cada progenitor dé lugar a la aplicación de un importe diferente, cada uno se aplicará la mitad de la deducción que le corresponda en función del número de hijos preexistente.",
    "Si se verifica la circunstancia prevista en el párrafo anterior de este apartado y la declaración es conjunta, la deducción será la suma de la que correspondería a cada progenitor si la declaración fuera individual.",
    "6. Los contribuyentes con derecho a la aplicación de esta deducción pueden solicitar a la consejería competente en materia de hacienda, en los términos que se establezcan mediante una orden de la persona titular de dicha consejería, el abono anticipado de esta deducción, que será, en su caso, objeto de regularización en el momento de presentar la declaración del impuesto.",
    "7. En el caso de que esta deducción concurra con otras deducciones autonómicas, esta se aplicará en primer lugar.",
    "Si hay insuficiencia de cuota, de manera que no se pueda aplicar esta deducción en la cuantía total, el contribuyente puede solicitar a la consejería competente en materia de hacienda, en los términos que se fijen mediante una orden de la persona titular de la citada consejería, el abono del importe que no se haya podido deducir, que tiene la consideración de renta a los efectos de lo que dispone el apartado 9 de este artículo.",
    "9. La renta imputable al contribuyente que pueda resultar de lo que prevén los apartados 6 y 7 de este artículo tiene la consideración de prestación pública por nacimiento a los efectos del artículo 7.h) de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas.",
    "Ley 6/2025, disposición final segunda y disposición final vigesimoprimera.2: efectos desde el 25 de julio de 2025. Para fallecimientos anteriores al 25 de julio de 2025 no se aplica esta reforma: no se incorpora el colectivo de autónomos con 183 días en arrendamiento y libros, ni la nueva deducción por ocupación; en nacimiento se conserva el reparto anterior entre progenitores con derecho.",
  ],
  limites: [
    "b) Que la base imponible total no supere el importe de 52.800 euros en el caso de tributación individual y de 84.480 euros en el de tributación conjunta.",
    "Sin embargo, en el caso de familias numerosas, o de las familias monoparentales previstas en el artículo 7.7 de la Ley 8/2018, de 31 de julio , de apoyo a las familias, los límites de renta a los que hace referencia la letra b) anterior se incrementarán un 20 %.",
    "Asimismo, los contribuyentes que superen los límites de renta mencionados en esta letra b) tendrán derecho a aplicar el 50 % de la deducción correspondiente.",
    "El eventual exceso del importe del pago anticipado respecto del límite a la deducción que prevé el último párrafo del apartado 1 tiene la consideración de renta a los efectos de lo que dispone el apartado 9, ambos de este artículo.",
  ],
  prorrateo: [],
  incompatibilidades: [
    "8. Esta deducción será incompatible con la percepción de ayudas y prestaciones públicas concedidas u otorgadas por la Comunidad Autónoma de las Illes Balears por causa de nacimiento.",
  ],
  compatibilidades: [],
}

export const BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "balears_gastos_mayores_65_discapacidad",
    "Por determinados gastos relativos a personas mayores de 65 años o a personas con discapacidad",
    "circunstancias_personales_familiares",
    {
      tipo: "porcentaje",
      porcentaje: "40",
      base: "gastos por servicios de residencia, centros de día, comedor, custodia o contratación de cuidador",
      limiteMaximoEuros: "660",
    },
    [
      "40% de los gastos satisfechos",
      "Máximo 660 euros anuales por persona que genere derecho",
      "Base imponible general + ahorro máximo 33.000 euros individual y 52.800 conjunta",
    ],
    [160, 161]
  ),
  normativa:
    "Artículo 6 quinquies del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
  requisitos: [
    "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
    "a) Estancias en residencias o centros de día.",
    "b) Servicio de custodia, servicio de comedor y actividades en los centros de día.",
    "c) Contratación laboral de una persona para cuidar de la persona mayor de 65 años o con discapacidad.",
    "2. Para poder aplicar esta deducción se cumplirán los siguientes requisitos:",
    "a) La base imponible total del contribuyente no puede superar el importe de 33.000 euros en el caso de tributación individual y de 52.800 euros en el de tributación conjunta.",
    "b) El pago de los gastos que dan derecho a la deducción se hará mediante tarjeta de crédito o de débito, transferencia bancaria, cheque nominativo o ingreso en cuentas de entidades de crédito.",
    "c) En el caso de deducción de los gastos de la contratación laboral de una persona, esta tiene que estar dada de alta en la Seguridad Social.",
    "3. Los ascendientes a cargo a que hacen referencia los apartados anteriores tienen que darán lugar al derecho de los contribuyentes a aplicar el mínimo por ascendientes que prevé el artículo 59 de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas y modificación parcial de las leyes de los impuestos sobre sociedades, sobre la renta de no residentes y sobre el patrimonio.",
    "Cuando, de acuerdo con el mencionado precepto legal, dos o más contribuyentes tengan derecho a aplicar esta deducción respecto de ascendientes comunes, cada uno de los contribuyentes se podrá aplicar la deducción íntegramente.",
    "4. La deducción regulada en este artículo también es aplicable a los contribuyentes con un grado de discapacidad reconocido del 33 % o superior o que tengan a cargo personas con un grado de discapacidad reconocido del 33 % o superior, siempre que se verifiquen los requisitos establecidos en las diversas letras de los apartados 1 y 2 y los contribuyentes tengan derecho a aplicar cualesquiera de los componentes del mínimo por discapacidad que prevé el artículo 60 de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas y modificación parcial de las leyes de los impuestos sobre sociedades, sobre la renta de no residentes y sobre el patrimonio.",
  ],
  limites: [
    "1. Se establece una deducción en la cuota íntegra autonómica por la cuantía correspondiente al 40 %, con un límite de 660 euros, de los gastos satisfechos durante el ejercicio por razón de la prestación de los servicios siguientes al contribuyente o a cada uno de los ascendientes del contribuyente mayores en ambos casos de 65 años:",
    "Ley 7/2024: 40% y límite de 660 euros por cada persona que genere derecho; no se aplica el límite histórico de 3.600 euros de la Ley 12/2023. Efectos desde el 13 de diciembre de 2024.",
  ],
  prorrateo: [
    "5. Cuando dos contribuyentes tengan derecho a aplicar esta deducción respecto de descendientes comunes a su cargo y opten por la declaración individual, se prorrateará entre los contribuyentes por partes iguales.",
  ],
  incompatibilidades: [
    "6. En todo caso, la deducción regulada en este artículo es incompatible con la deducción por gastos relativos a los descendientes o acogidos menores de seis años por motivos de conciliación regulada en el artículo 6 bis de este texto refundido.",
  ],
  compatibilidades: [],
}

export const BALEARS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_mejora_sostenibilidad_vivienda",
      nombreCatalogadoDesdeCodigo("balears_mejora_sostenibilidad_vivienda"),
      categoriaCatalogadaDesdeCodigo("balears_mejora_sostenibilidad_vivienda"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 50%,base10.000; mejora un nivel; renta33.000/52.800; arrendador fianza y no repercutir.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 131 a 133.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [131, 132, 133],
      [
        "balears_mejora_sostenibilidad_vivienda:importe",
        "balears_mejora_sostenibilidad_vivienda:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 3 del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "La referencia fiscal al RD 235/2013 se conserva como antecedente técnico: el RD 390/2021 lo derogó y regula la certificación y registro en su artículo 6. Se exigen los certificados registrados anterior y posterior y la mejora de al menos un nivel; la derogación técnica no elimina estas condiciones fiscales.",
      "1. Se establece una deducción del 50% del importe de las inversiones que mejoren la calidad y la sostenibilidad de las viviendas, que se hagan en el inmueble, situado en las Illes Balears, que constituya o vaya a constituir la vivienda habitual del contribuyente o de un arrendatario en virtud de un contrato de alquiler suscrito con el contribuyente sometido a la legislación de arrendamientos urbanos. A este efecto, se entiende que mejoran la calidad y la sostenibilidad de las viviendas las siguientes inversiones:",
      "a) La instalación de equipos de generación o que permitan utilizar energías renovables como la energía solar, la biomasa o la geotermia que reduzcan el consumo de energía convencional térmica o eléctrica del edificio. Incluirá la instalación de cualquier tecnología, sistema o equipo de energía renovable, como instalaciones de generación solar fotovoltaica para autoconsumo, paneles solares térmicos, a fin de contribuir a la producción de agua caliente sanitaria demandada por las viviendas, o la producción de agua caliente para las instalaciones de climatización.",
      "b) Las de mejora de las instalaciones de suministro e instalación de mecanismos que favorezcan el ahorro de agua, así como la implantación de redes de saneamiento separativas en el edificio y otros sistemas que favorezcan la reutilización de las aguas grises y pluviales en el mismo edificio o en la parcela o que reduzcan el volumen de vertido al sistema público de alcantarillado.",
      "3. En todo caso, para la aplicación de la deducción se mejorará como mínimo en un nivel la calificación de la eficiencia energética de la vivienda habitual. A tal efecto, se requerirá el registro de los certificados de eficiencia energética de la vivienda conforme a lo dispuesto en el Real decreto 235/2013, de 5 de abril , por el que se aprueba el procedimiento básico para la certificación energética de los edificios, antes y después de realizar las inversiones.",
      "4. Para poder aplicar esta deducción, la base imponible total del contribuyente no podrá superar el importe de 33.000 euros en el caso de tributación individual, ni el importe de 52.800 euros en el caso de tributación conjunta.",
      "Asimismo, cuando, de acuerdo con lo previsto en el apartado 1 anterior, el contribuyente sea el arrendador de la vivienda, la aplicación de la deducción requiere que se cumplan los siguientes requisitos:",
      "a) Que la duración del contrato de arrendamiento de la vivienda con un mismo arrendatario sea igual o superior a un año.",
      "b) Que se haya constituido el depósito de la fianza a que se refiere el artículo 36.1 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, a favor del Instituto Balear de la Vivienda.",
      "c) Que el contribuyente declare en el impuesto sobre la renta de las personas físicas el rendimiento derivado de las rentas del arrendamiento de la vivienda como rendimientos del capital inmobiliario.",
      "d) Que el contribuyente no repercuta en el arrendatario el coste de las inversiones citadas en el apartado 1 anterior.",
    ],
    limites: [
      "2. La base de la deducción por inversiones en la vivienda corresponderá al importe realmente satisfecho por el contribuyente para realizar las inversiones a que se refiere el apartado anterior, con un límite máximo de 10.000 euros por periodo impositivo.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_subvenciones_zona_emergencia_proteccion_civil",
      nombreCatalogadoDesdeCodigo(
        "balears_subvenciones_zona_emergencia_proteccion_civil"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_subvenciones_zona_emergencia_proteccion_civil"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: Tipo medio por subvención integrada en liquidable; ayuda autonómica por emergencia declarada.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 136.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [136],
      [
        "balears_subvenciones_zona_emergencia_proteccion_civil:importe",
        "balears_subvenciones_zona_emergencia_proteccion_civil:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 3 ter del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Se establece una deducción en la cuota íntegra del impuesto a favor de los contribuyentes que integren en la base imponible general rendimientos correspondientes a subvenciones o ayudas públicas otorgadas por la comunidad autónoma de las Illes Balears por razón de daños que lleven causa de emergencias que, de acuerdo con el artículo 23 de la Ley 17/2015, de 9 de julio , del Sistema Nacional de Protección Civil, hayan sido declaradas por el Consejo de Ministros como zonas afectadas gravemente por una emergencia de protección civil.",
      "El importe de esta deducción será el resultado de aplicar el tipo mediano de gravamen al importe de la subvención en la base liquidable.",
    ],
    limites: [],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_idiomas_extraescolares",
      nombreCatalogadoDesdeCodigo("balears_idiomas_extraescolares"),
      categoriaCatalogadaDesdeCodigo("balears_idiomas_extraescolares"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 15%,110 hijo, mínimo descendientes, reparto, renta y facturas.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 138 a 139.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [138, 139],
      [
        "balears_idiomas_extraescolares:importe",
        "balears_idiomas_extraescolares:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 bis del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "2. A efectos de la aplicación de esta deducción, solo se podrán tener en cuenta los hijos que, a su vez, den derecho al mínimo por descendientes regulado en el artículo 58 de la Ley 35/2006 .",
    ],
    limites: [
      "1. Por el concepto de gastos en el aprendizaje extraescolar de idiomas extranjeros por los hijos que cursen los estudios a que se refiere el artículo 4 anterior, se deducirá el 15 % de los importes destinados a dicho aprendizaje, con el límite de 110 euros por hijo.",
      "3. En cualquier caso, la aplicación de esta deducción exige que la base imponible total no supere el importe de 52.800 euros en el caso de tributación conjunta y de 33.000 euros en el caso de tributación individual, así como la justificación documental, mediante las facturas o los documentos equivalentes correspondientes, los cuales deben mantenerse a disposición de la administración tributaria.",
    ],
    prorrateo: [
      "Si los hijos conviven con ambos padres y estos optan por la tributación individual, la deducción se prorrateará por partes iguales en la declaración de cada uno de ellos.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_estudios_superiores_fuera_isla",
      nombreCatalogadoDesdeCodigo("balears_estudios_superiores_fuera_isla"),
      categoriaCatalogadaDesdeCodigo("balears_estudios_superiores_fuera_isla"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 1.800 descendiente,50% cuota;30 créditos/curso; renta y descendiente8.000.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 140 a 141.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [140, 141],
      [
        "balears_estudios_superiores_fuera_isla:importe",
        "balears_estudios_superiores_fuera_isla:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 ter del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "2. A efectos de aplicar esta deducción, solo se podrán tener en cuenta los descendientes que, a su vez, dan derecho al mínimo por descendientes que regula el artículo 58 de la Ley 35/2006 .",
      "3. Esta deducción no será aplicable en los siguientes casos:",
      "a) Cuando los estudios no completen un curso académico o un mínimo de treinta créditos.",
      "b) Cuando la base imponible total del contribuyente sea superior a 33.000 euros en el caso de tributación individual o a 52.800 en el caso de tributación conjunta.",
      "c) Cuando el descendiente que genera el derecho a la deducción obtenga durante el ejercicio rentas superiores a 8.000 euros.",
    ],
    limites: [
      "1. Se establece una deducción de 1.800 euros por cada descendente que dependa económicamente del contribuyente y curse, fuera de la isla del archipiélago balear en que se encuentre la residencia habitual del contribuyente, estudios universitarios, enseñanzas artísticas superiores, formación profesional de grado superior, enseñanzas profesionales de artes plásticas y diseño de grado superior, enseñanzas deportivas de grado superior o cualquier otro estudio que, de acuerdo con la legislación orgánica estatal en materia de educación, se considere educación superior, con el límite del 50 % de la cuota íntegra autonómica. La deducción se aplica a la declaración del ejercicio en el que se empieza el curso académico.",
    ],
    prorrateo: [
      "Si los descendientes conviven con dos o más ascendientes y estos tributan de manera individual, la deducción se prorrateará por partes iguales en la declaración de cada uno.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_arrendador_vivienda_permanente_primas_seguro",
      nombreCatalogadoDesdeCodigo(
        "balears_arrendador_vivienda_permanente_primas_seguro"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_arrendador_vivienda_permanente_primas_seguro"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 75%,440; fianza, duración inicial un año; renta52.800/84.480 y justificantes.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 141 a 142.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [141, 142],
      [
        "balears_arrendador_vivienda_permanente_primas_seguro:importe",
        "balears_arrendador_vivienda_permanente_primas_seguro:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 quater del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Se establece una deducción en la cuota íntegra autonómica por la cuantía correspondiente al 75 % de los gastos satisfechos por el contribuyente durante el ejercicio en concepto de primas de seguros que cubran total o parcialmente el impago de las rentas a que el contribuyente tenga derecho por razón del arrendamiento a terceros de uno o varios inmuebles situados en las Illes Balears destinados a vivienda, con un máximo de 440 euros anuales, siempre que se cumplan los siguientes requisitos:",
      "a) Que la duración inicial del contrato de arrendamiento de la vivienda con un mismo arrendatario sea igual o superior a un año, sin perjuicio de las prórrogas obligatorias para el arrendador reguladas en el artículo 9 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos.",
      "b) Que se haya constituido el depósito de la fianza a que hace referencia el artículo 36.1 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, a favor del Instituto Balear de la Vivienda.",
      "c) Que el contribuyente declare en el impuesto sobre la renta de las personas físicas el rendimiento derivado de las rentas del arrendamiento de la vivienda como rendimientos del capital inmobiliario.",
    ],
    limites: [
      "3. En cualquier caso, la aplicación de las deducciones a que hacen referencia los dos apartados anteriores exige que la base imponible total del contribuyente no supere el importe de 84.480 euros en el caso de tributación conjunta y de 52.800 euros en el caso de tributación individual, así como la justificación documental, mediante las facturas o los documentos equivalentes correspondientes, los cuales se tienen que mantener a disposición de la administración tributaria.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_arrendador_vivienda_permanente_otros_gastos",
      nombreCatalogadoDesdeCodigo(
        "balears_arrendador_vivienda_permanente_otros_gastos"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_arrendador_vivienda_permanente_otros_gastos"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 50%,1.500 o1.800 Alquiler Seguro; dos ejercicios sin alquilar; renta<=15/m2.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 142 a 144.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [142, 143, 144],
      [
        "balears_arrendador_vivienda_permanente_otros_gastos:importe",
        "balears_arrendador_vivienda_permanente_otros_gastos:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 quater del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) Que la duración inicial del contrato de arrendamiento de la vivienda con un mismo arrendatario sea igual o superior a un año, sin perjuicio de las prórrogas obligatorias para el arrendador reguladas en el artículo 9 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos.",
      "b) Que se haya constituido el depósito de la fianza a que hace referencia el artículo 36.1 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, a favor del Instituto Balear de la Vivienda.",
      "c) Que el contribuyente declare en el impuesto sobre la renta de las personas físicas el rendimiento derivado de las rentas del arrendamiento de la vivienda como rendimientos del capital inmobiliario.",
      "a) Que la vivienda no se haya arrendado durante, como mínimo, los dos ejercicios fiscales inmediatamente anteriores al ejercicio fiscal en que se aplique la deducción.",
      "b) Que el importe de la renta del arrendamiento para cada arrendatario no sea superior a 15 euros mensuales por metro cuadrado de superficie útil de la vivienda arrendada.",
      "c) Que los gastos se satisfagan en el mismo periodo impositivo.",
    ],
    limites: [
      "El límite máximo de 1.500 euros a que se refiere el primer párrafo de este apartado se tiene que incrementar hasta los 1.800 euros para los contribuyentes que, cumpliendo todos los requisitos aplicables a esta deducción, arrienden la vivienda a la Administración de la comunidad autónoma de las Illes Balears o a un ente integrante del sector público instrumental de esta administración para su subarrendamiento a los beneficiarios correspondientes en el marco de los programas de Alquiler Seguro u otros específicos aprobados al efecto por la comunidad autónoma.",
      "3. En cualquier caso, la aplicación de las deducciones a que hacen referencia los dos apartados anteriores exige que la base imponible total del contribuyente no supere el importe de 84.480 euros en el caso de tributación conjunta y de 52.800 euros en el caso de tributación individual, así como la justificación documental, mediante las facturas o los documentos equivalentes correspondientes, los cuales se tienen que mantener a disposición de la administración tributaria.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [
      "2. Asimismo, se establece una deducción en la cuota íntegra autonómica, compatible con la deducción regulada en el apartado anterior y aplicable por una sola vez en el primer ejercicio fiscal en que se verifiquen todos los requisitos de esta deducción, por la cuantía correspondiente al 50 % de los gastos satisfechos por el contribuyente durante el ejercicio en concepto de primas de seguros de daños, de gastos de conservación y reparación y, si procede, del resto de gastos inherentes a la comunidad de propietarios, de gastos tributarios, de gastos vinculados a la formalización de los contratos de arrendamiento y de gastos para obtener certificados de eficiencia energética relacionados con las viviendas arrendadas, con un máximo de 1.500 euros, siempre que se trate de viviendas situadas en las Illes Balears y se cumplan todos los requisitos establecidos en las letras a), b) y c) del apartado anterior, así como los siguientes requisitos adicionales:",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_arrendamiento_traslado_laboral",
      nombreCatalogadoDesdeCodigo("balears_arrendamiento_traslado_laboral"),
      categoriaCatalogadaDesdeCodigo("balears_arrendamiento_traslado_laboral"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 15%,440 por contribuyente; temporal hasta tres años, misma relación laboral y otra isla.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 144 a 145.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [144, 145],
      [
        "balears_arrendamiento_traslado_laboral:importe",
        "balears_arrendamiento_traslado_laboral:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 quinquies del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Se establece una deducción del 15 % de los gastos satisfechos por el contribuyente durante el ejercicio en concepto de renta de alquiler de vivienda por razón del traslado temporal de su isla de residencia a otra isla del archipiélago balear en el ámbito de una misma relación laboral por cuenta ajena, con un máximo de 440 euros anuales, siempre y cuando se cumplan los siguientes requisitos:",
      "a) Que se trate del arrendamiento de un inmueble destinado a vivienda del contribuyente y ocupado efectivamente por este.",
      "b) Que se haya constituido el depósito de la fianza a la que se refiere el artículo 36.1 de la Ley 29/1994, de 24 de noviembre , de arrendamientos urbanos, a favor del Instituto Balear de la Vivienda.",
      "d) Que el contribuyente identifique al arrendador en la autoliquidación del impuesto.",
      "e) Que el contribuyente pueda justificar documentalmente ante la administración tributaria el gasto constitutivo de la base de la deducción y el resto de requisitos exigibles para la deducción.",
      "2. En caso de tributación conjunta, la deducción será aplicable a cada uno de los contribuyentes que trasladen su residencia en los términos establecidos en el apartado anterior.",
    ],
    limites: [
      "c) Que la base imponible total del contribuyente no supere la cuantía de 33.000 euros en el caso de tributación individual y de 52.800 en el caso de tributación conjunta.",
      "f) Que el traslado temporal no supere los tres años de duración.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento",
      nombreCatalogadoDesdeCodigo(
        "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 40%,500; propiedad, ocupación o suspensión con dudoso cobro; renta33.000/52.800.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 145 a 146.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [145, 146],
      [
        "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento:importe",
        "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 4 sexties del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "2. Los gastos deducibles son los siguientes:",
      "a) El impuesto sobre bienes inmuebles.",
      "b) La tasa de residuos sólidos urbanos.",
      "c) Los gastos de suministro de los servicios de la vivienda, como por ejemplo electricidad, agua, gas y telecomunicaciones.",
      "d) Los gastos ordinarios de comunidad.",
      "e) Los gastos de conservación y mantenimiento de la vivienda.",
      "f) Los gastos asociados a procedimientos judiciales cuya finalidad sea la recuperación de la posesión del inmueble.",
      "3. Para poder aplicar esta deducción, la base imponible total del contribuyente no puede superar el importe de 33.000 euros en el caso de tributación individual, ni el importe de 52.800 euros en el caso de tributación conjunta.",
      "Ley 6/2025, disposición final segunda y disposición final vigesimoprimera.2: efectos desde el 25 de julio de 2025. Para fallecimientos anteriores al 25 de julio de 2025 no se aplica esta reforma: no se incorpora el colectivo de autónomos con 183 días en arrendamiento y libros, ni la nueva deducción por ocupación; en nacimiento se conserva el reparto anterior entre progenitores con derecho.",
    ],
    limites: [
      "1. Se establece una deducción del 40%, con el límite de 500 euros, de los gastos satisfechos por el contribuyente propietario de un inmueble ocupado ilegalmente o sobre el que se haya suspendido el lanzamiento por encontrarse el arrendatario en situación de vulnerabilidad económica que le impida encontrar una alternativa para sí mismo y para las personas con quienes convive, siempre que en este último caso, además, el arrendador tenga derecho a deducir en la determinación de los rendimientos del capital inmobiliario del mismo ejercicio fiscal la deuda del arrendatario en concepto de saldo de dudoso cobro, de acuerdo con la legislación estatal reguladora del impuesto sobre la renta de las personas físicas.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_donaciones_investigacion_desarrollo_innovacion",
      nombreCatalogadoDesdeCodigo(
        "balears_donaciones_investigacion_desarrollo_innovacion"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_donaciones_investigacion_desarrollo_innovacion"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 25%,15% cuota; entidades tasadas, certificado y resolución cuando proceda.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 146 a 147.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [146, 147],
      [
        "balears_donaciones_investigacion_desarrollo_innovacion:importe",
        "balears_donaciones_investigacion_desarrollo_innovacion:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 5 del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) La Administración de la comunidad autónoma de las Illes Balears o las entidades instrumentales que dependen de la misma cuya finalidad esencial sea la investigación, el desarrollo científico o tecnológico, o la innovación.",
      "b) La Universidad de las Illes Balears.",
      "c) Las entidades sin finalidad lucrativa a que hacen referencia los artículos 2 y 3 de la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, siempre y cuando el fin exclusivo o principal que persigan sea la investigación, el desarrollo científico o tecnológico, o la innovación, en el territorio de las Illes Balears y estén inscritas en el Registro Único de Fundaciones de las Illes Balears.",
      "d) Las entidades parcialmente exentas del impuesto sobre sociedades a que se refiere el artículo 9.3 de la Ley 27/2014, de 27 de noviembre , del impuesto sobre sociedades.",
      "2. La efectividad de las citadas donaciones en cada periodo impositivo deberá acreditarse mediante un certificado de la entidad donataria.",
      "Asimismo, en los casos de la letra c) del apartado anterior, la aplicación de la deducción exige que la consejería competente en materia de investigación, desarrollo científico o tecnológico, o innovación, declare, mediante una resolución, que la entidad donataria verifica los requisitos que establece la citada letra c).",
    ],
    limites: [
      "1. Se establece una deducción del 25% de las donaciones dinerarias que se realicen durante el periodo impositivo, hasta el límite del 15% de la cuota íntegra autonómica, destinadas a financiar la investigación, el desarrollo científico o tecnológico, o la innovación, a favor de cualquiera de las siguientes entidades:",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_mecenazgo_cultural_cientifico_tecnologico",
      nombreCatalogadoDesdeCodigo(
        "balears_mecenazgo_cultural_cientifico_tecnologico"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_mecenazgo_cultural_cientifico_tecnologico"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 15%,660; especial público25%,1.200 sin renta; comodato días y máximo tres ejercicios.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 148 a 150.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [148, 149, 150],
      [
        "balears_mecenazgo_cultural_cientifico_tecnologico:importe",
        "balears_mecenazgo_cultural_cientifico_tecnologico:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 5 bis del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Ley 3/2015, artículos 4 y 7 a 14: beneficiario habilitado y al corriente de obligaciones; donación pura, simple e irrevocable, certificado de entidad o declaración jurada de persona física, con identificación fiscal, fecha, importe o valoración, destino y aceptación documental. La revocación exige reintegro e intereses.",
      "Comodato: bienes culturales cualificados o locales destinados al proyecto; base anual del 4% de la valoración por la Comisión de Valoración del Patrimonio Histórico, o del valor catastral de locales científicos o tecnológicos, proporcional a los días. Certificado o declaración jurada con entrega, duración, valoración, documento auténtico y destino.",
      "Convenio: compromiso escrito de difundir la participación del colaborador a cambio de la ayuda; certificado o declaración jurada que identifique a las partes, beneficiario habilitado, documento del convenio, importe y finalidad. No basta el porcentaje del artículo 5 bis.",
      "1. Se establece una deducción del 15 % de las cuantías en que se valoren las donaciones, las cesiones de uso o los contratos de comodato, y de las cuantías satisfechas en virtud de convenios de colaboración empresarial efectuados de acuerdo con lo que dispone la Ley 3/2015, de 23 de marzo , por la que se regula el consumo cultural y el mecenazgo cultural, científico y de desarrollo tecnológico, y se establecen medidas tributarias.",
      "3. La aplicación de esta deducción exige que la base imponible total del contribuyente no exceda de la cuantía de 33.000 euros en el caso de tributación individual y de 52.800 euros en el caso de tributación conjunta.",
      "4. Asimismo, se establece una deducción del 25% de las cuantías de las donaciones dinerarias o del valor del resto de donaciones y modalidades a que se refieren el apartado 1 del presente artículo y el artículo 3 de la mencionada Ley 3/2015 , cuando el beneficiario del mecenazgo sea la Administración de la comunidad autónoma de las Illes Balears o cualquiera de las entidades instrumentales a que hace referencia la letra b) del artículo 4.1 de la misma Ley 3/2015 y el proyecto o la actividad cultural objeto del mecenazgo constituya un proyecto propio de la Administración de la comunidad autónoma o de sus entidades instrumentales.",
    ],
    limites: [
      "En estos casos no serán aplicables los límites relativos a la base imponible del apartado 3 anterior, y el límite máximo de la deducción aplicable será de 1.200 euros por ejercicio, sin perjuicio del resto de las condiciones del apartado 2 de este mismo artículo.",
    ],
    prorrateo: [
      "2. El límite de la deducción aplicable es de 660 euros por ejercicio. En caso de que la cesión de uso o el contrato de comodato tenga una duración inferior a un año, esta deducción se debe prorratear en función del número de días del periodo anual. Si la duración es superior a un año, la deducción no se puede aplicar a más de tres ejercicios.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_mecenazgo_deportivo",
      nombreCatalogadoDesdeCodigo("balears_mecenazgo_deportivo"),
      categoriaCatalogadaDesdeCodigo("balears_mecenazgo_deportivo"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 15%,660; renta33.000/52.800; cesión días y hasta tres ejercicios; Ley6/2015.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 150.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [150],
      [
        "balears_mecenazgo_deportivo:importe",
        "balears_mecenazgo_deportivo:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 5 ter del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Ley 6/2015, artículos 4 y 7 a 14: beneficiario habilitado, domiciliado fiscalmente en las Illes Balears y al corriente de obligaciones; donación entre vivos pura y simple. Certificado de entidad o declaración jurada de persona física con NIF, fecha, importe o valoración, destino, documento auténtico y mención de irrevocabilidad; reintegro e intereses en caso de revocación.",
      "Comodato de bienes deportivos, bienes inventariados, locales, terrenos o inmuebles destinados al proyecto deportivo: base anual del 4% de la valoración del bien o del valor catastral de los inmuebles, proporcional a los días. Certificado o declaración jurada con fecha de entrega, duración, valoración, constitución documental y finalidad.",
      "Convenios de colaboración: compromiso escrito de difusión de la participación del colaborador y certificado o declaración jurada del beneficiario con las partes, habilitación, documento del convenio, importe y finalidad.",
      "1. Se establece una deducción del 15% de las cuantías en que se valoren las donaciones, las cesiones de uso o los contratos de comodato, y de las cuantías satisfechas en virtud de convenios de colaboración efectuados de acuerdo con lo dispuesto en la Ley 6/2015, de 30 de marzo , por la que se regula el mecenazgo deportivo y se establecen medidas tributarias.",
      "3. La aplicación de esta deducción exige que la base imponible total del contribuyente no exceda de la cuantía de 33.000 euros en el caso de tributación individual y de 52.800 euros en el caso de tributación conjunta.",
    ],
    limites: [],
    prorrateo: [
      "2. El límite de la deducción aplicable es de 660 euros por ejercicio. En caso de que la cesión de uso o el contrato de comodato tenga una duración inferior a un año, esta deducción se prorrateará en función del número de días del período anual. Si la duración es superior a un año, la deducción no se puede aplicar a más de tres ejercicios.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_fomento_lengua_catalana",
      nombreCatalogadoDesdeCodigo("balears_fomento_lengua_catalana"),
      categoriaCatalogadaDesdeCodigo("balears_fomento_lengua_catalana"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 15%,10% cuota; certificado, resolución tasada e incompatibilidad5bis.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 151 a 152.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [151, 152],
      [
        "balears_fomento_lengua_catalana:importe",
        "balears_fomento_lengua_catalana:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 5 quater del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "a) La Administración de la comunidad autónoma de las Illes Balears o las entidades instrumentales que dependen de ella cuya finalidad esencial sea el fomento de la lengua catalana.",
      "b) La Universidad de las Illes Balears, los centros de investigación y los centros superiores de enseñanzas artísticas de la comunidad autónoma de las Illes Balears.",
      "c) Las entidades sin finalidad lucrativa a las que se refieren los artículos 2 y 3 de la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin finalidades lucrativas y de los incentivos fiscales al mecenazgo, siempre que el fin exclusivo o principal que persigan sea en el territorio el fomento de la lengua catalana, y estén inscritas en el Registro de Fundaciones de la Administración de la comunidad autónoma de las Illes Balears.",
      "d) Las entidades parcialmente exentas del impuesto sobre sociedades a que se refiere el artículo 9.3 de la Ley 27/2014, de 27 de noviembre , del Impuesto sobre Sociedades.",
      "2. La efectividad de dichas donaciones en cada periodo impositivo se deberá acreditar mediante un certificado de la entidad donataria.",
      "Asimismo, en los casos de la letra c) del apartado anterior, la aplicación de la deducción exige que la consejería competente en materia de política lingüística declare, mediante una resolución, que la entidad donataria verifica los requisitos establecidos en la citada letra c).",
    ],
    limites: [
      "1. Se establece una deducción del 15 % de las donaciones dinerarias que se realicen durante el periodo impositivo, hasta el límite del 10 % de la cuota íntegra autonómica, a entidades que tengan por objeto el fomento de la lengua catalana, a favor de cualquiera de las siguientes entidades:",
    ],
    prorrateo: [],
    incompatibilidades: [
      "3. Esta deducción es incompatible con la deducción regulada en el artículo 5 bis del presente texto refundido.",
    ],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_entidades_tercer_sector",
      nombreCatalogadoDesdeCodigo("balears_entidades_tercer_sector"),
      categoriaCatalogadaDesdeCodigo("balears_entidades_tercer_sector"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 25%,base165; entidad registrada y certificado.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 152.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [152],
      [
        "balears_entidades_tercer_sector:importe",
        "balears_entidades_tercer_sector:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 5 quinquies del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "2. La efectividad de la donación se ha de acreditar mediante la expedición, por parte de la entidad beneficiaria, del correspondiente certificado.",
    ],
    limites: [
      "1. Se establece una deducción del 25 %, aplicable sobre una base máxima de 165 euros, de las donaciones dinerarias que se hagan durante el periodo impositivo, a favor de las entidades sin ánimo de lucro a las que se refiere la Ley 3/2018, de 29 de mayo , del tercer sector de acción social, que estén inscritas en el registro correspondiente de la Consejería de Asuntos Sociales y Deportes, y que, además, cumplan los requisitos de los artículos 2 y 3 de la Ley 49/2002, de 23 de diciembre , de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo, o estén parcialmente exentas del impuesto sobre sociedades de acuerdo con el artículo 9.3 de la Ley 27/2014, de 27 de noviembre , del impuesto sobre sociedades.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_declarantes_discapacidad_o_descendientes_discapacidad",
      nombreCatalogadoDesdeCodigo(
        "balears_declarantes_discapacidad_o_descendientes_discapacidad"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_declarantes_discapacidad_o_descendientes_discapacidad"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 88 físico33<65;165 físico65 o psíquico33; miembros unidad familiar; renta.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 152 a 153.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [152, 153],
      [
        "balears_declarantes_discapacidad_o_descendientes_discapacidad:importe",
        "balears_declarantes_discapacidad_o_descendientes_discapacidad:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 6 del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "1. Por cada contribuyente y, en su caso, por cada miembro de la unidad familiar residente en las Illes Balears que tenga la consideración legal de persona con discapacidad física, psíquica o sensorial, se establecen las siguientes deducciones según la naturaleza y el grado de la minusvalía:",
      "a) Minusvalía física o sensorial de grado igual o superior al 33 % e inferior al 65 %: 88 euros.",
      "b) Minusvalía física o sensorial de grado igual o superior al 65 %: 165 euros.",
      "c) Minusvalía psíquica de grado igual o superior al 33 %: 165 euros.",
      "2. En caso de que los cónyuges hayan optado por la tributación individual y tengan derecho al mínimo por descendientes que regula el artículo 58 de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas y de modificación parcial de las leyes de los impuestos sobre sociedades, sobre la renta de no residentes y sobre el patrimonio, cada uno tiene derecho a aplicarse íntegramente la deducción.",
    ],
    limites: [
      "3. Tienen derecho a esta deducción los contribuyentes para quienes la cuantía resultante de la suma de su base imponible total no supere el importe de 33.000 euros en caso de tributación individual y de 52.800 euros en caso de tributación conjunta.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_conciliacion_menores_6",
      nombreCatalogadoDesdeCodigo("balears_conciliacion_menores_6"),
      categoriaCatalogadaDesdeCodigo("balears_conciliacion_menores_6"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 40%,660; reforzada50%,900 desde11julio; renta, trabajo, banco, días y reparto.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 153 a 155.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [153, 154, 155],
      [
        "balears_conciliacion_menores_6:importe",
        "balears_conciliacion_menores_6:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 6 bis del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "Ley 8/2018, artículos 6 y 7.7: familia numerosa conforme a la legislación estatal y familia monoparental con un hijo con discapacidad reconocida del 33% o superior; para equiparación monoparental a efectos fiscales, un hijo con discapacidad del 33% o superior o dos o más hijos, con reconocimiento y condiciones legales de edad, convivencia y dependencia.",
      "a) Estancias de niños y niñas de cero a tres años en escuelas infantiles o en guarderías.",
      "b) Servicio de custodia, servicio de comedor y actividades extraescolares de niños y niñas de tres a seis años en centros educativos.",
      "c) Contratación laboral de una persona para cuidar del menor.",
      "2. Para poder aplicar esta deducción se tienen que cumplir los requisitos siguientes:",
      "a) Que los contribuyentes desarrollen actividades por cuenta ajena o por cuenta propia generadoras de rendimientos del trabajo o de rendimientos de actividades económicas.",
      "c) Que el pago de los gastos que dan derecho a la deducción se haga mediante tarjeta de crédito o de débito, transferencia bancaria, cheque nominativo o ingreso en cuentas de entidades de crédito.",
      "3. En el supuesto de deducción de los gastos de la contratación de una persona empleada, esta tiene que estar dada de alta en el régimen especial para empleados del hogar de la Seguridad Social.",
      "6. Cuando el contribuyente sea menor de 36 años, tenga reconocido un grado de discapacidad igual o superior al 33 %, tenga derecho al mínimo por discapacidad de ascendientes o descendientes en el impuesto sobre la renta de las personas físicas, o sea el padre, madre o padres que convivan con el hijo o hijos sometidos a la patria potestad y que integren una familia numerosa, en los términos que establece el artículo 6 de la Ley 8/2018 , de 13 de julio, de apoyo a las familias, o una familia monoparental de las que prevé el artículo 7.7 de la citada Ley 8/2018 , o un trabajador autónomo que esté de alta en el régimen especial de trabajadores autónomos o por cuenta propia de la Seguridad Social que corresponda un mínimo de 183 días a lo largo del periodo impositivo correspondiente, se puede deducir el 50 % de los importes satisfechos en el periodo impositivo, con un máximo de 900 euros anuales, siempre que se cumplan los requisitos establecidos en los apartados 1 y 2 de este artículo, y sin perjuicio de tener en cuenta asimismo lo establecido en los apartados 3, 4 y 5 anteriores.",
      "Ley 3/2025: desde el 11 de julio de 2025 el apartado 6 incorpora autónomos con 183 días y eleva al 30% el incremento de renta de familias numerosas especiales. Para fallecimientos anteriores al 11 de julio de 2025 se conserva la redacción de Ley 11/2023: 50%, máximo 900 euros para menores de 36 años, discapacidad y familias cualificadas; incremento de renta del 20% para familias numerosas o monoparentales. El régimen general continúa en 40%, máximo 660 euros.",
    ],
    limites: [
      "1. Se establece una deducción del 40 %, con un límite de 660 euros, del importe anual satisfecho por los gastos derivados de la prestación de los siguientes servicios a descendientes o acogidos menores de seis años:",
      "b) Que la base imponible total no supere el importe de 33.000 euros en el caso de tributación individual y de 52.800 euros en el de tributación conjunta.",
      "Sin embargo, en el supuesto de familias numerosas o monoparentales, los límites de renta a que se refiere la letra b) del apartado 2 de este artículo se incrementarán un 20 %, y, en el caso particular de familias numerosas de categoría especial, un 30 %.",
    ],
    prorrateo: [
      "4. Cuando dos contribuyentes tengan derecho a la aplicación de esta deducción y opten por la declaración individual, se tiene que prorratear entre ellos por partes iguales.",
      "5. Si todos los descendientes o acogidos dejan de ser menores de seis años a lo largo del año, el límite máximo de la deducción se tiene que prorratear por la suma del número de días en qué los descendientes o acogidos hayan sido menores de seis años durante el año natural. También se tiene que prorratear de la misma forma el límite máximo de la deducción si los descendientes han nacido o han sido adoptados a lo largo del año, o si los menores han sido acogidos a lo largo del año.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_adopcion",
      nombreCatalogadoDesdeCodigo("balears_adopcion"),
      categoriaCatalogadaDesdeCodigo("balears_adopcion"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 800/1.000/1.200/1.400; mínimo, reparto, inscripción civil; renta; exclusión hijo pareja.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 158 a 160.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [158, 159, 160],
      ["balears_adopcion:importe", "balears_adopcion:cumple"],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 6 quater del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "Ley 8/2018, artículos 6 y 7.7: familia numerosa conforme a la legislación estatal y familia monoparental con un hijo con discapacidad reconocida del 33% o superior; para equiparación monoparental a efectos fiscales, un hijo con discapacidad del 33% o superior o dos o más hijos, con reconocimiento y condiciones legales de edad, convivencia y dependencia.",
      "1. Por cada adopción en el periodo impositivo de un hijo o una hija que dé derecho a la aplicación del mínimo por descendientes previsto en el artículo 58 de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas y de modificación parcial de leyes de los impuestos sobre sociedades, sobre la renta de no residentes y sobre el patrimonio, los contribuyentes podrán deducir de la cuota íntegra autonómica las siguientes cantidades:",
      "a) Por el primer hijo o hija: 800 euros.",
      "b) Por el segundo hijo o hija: 1.000 euros.",
      "c) Por el tercer hijo o hija: 1.200 euros.",
      "d) Por el cuarto hijo o hija y siguientes: 1.400 euros.",
      "La aplicación de estas deducciones no puede dar como resultado una cuota líquida negativa, sin perjuicio de lo que prevén los apartados 6 y 9 de este artículo.",
      "2. A efectos de determinar el derecho a esta deducción y el número de orden del hijo adoptado, se tendrán en cuenta los hijos que convivan con el contribuyente y para los cuales se pueda aplicar el mínimo por descendentes mencionado en el apartado anterior en la fecha de devengo del impuesto, y se computarán tanto los hijos naturales como los adoptivos.",
      "4. De acuerdo con el apartado anterior, en caso de que el número de hijos de cada contribuyente dé lugar a la aplicación de un importe diferente, cada uno se aplicará la mitad de la deducción que les corresponda en función del número de hijos preexistente.",
      "Si se da esta circunstancia y la declaración es conjunta, la deducción será la suma de la que correspondería a cada uno si la declaración fuera individual.",
      "6. En caso de que esta deducción concurra con otras deducciones autonómicas, esta se aplicará en primer lugar.",
      "Si hay insuficiencia de cuota, de manera que no se pueda aplicar esta deducción en la cuantía total, el contribuyente puede solicitar a la consejería competente en materia de hacienda, en los términos que se fijen mediante una orden de la persona titular de la citada consejería, el abono del importe que no se haya podido deducir, que tiene la consideración de renta a los efectos de lo que dispone el apartado 9.",
      "7. La deducción solo se aplicará en el periodo impositivo en que se haya inscrito la adopción en el Registro Civil.",
      "8. Esta deducción no es aplicable en el caso de la adopción del hijo del cónyuge o de la pareja de hecho.",
      "9. La renta imputable al contribuyente que pueda resultar de lo que prevé el apartado 6 de este artículo tiene la consideración de prestación pública por adopción a los efectos del artículo 7.h) de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas.",
    ],
    limites: [
      "5. La aplicación de esta deducción exigirá que la base imponible total no supere el importe de 33.000 euros en el caso de tributación individual y de 52.800 euros en el caso de tributación conjunta.",
      "No obstante, en el caso de las familias numerosas, o de las familias monoparentales previstas en el artículo 7.7 de la Ley 8/2018, de 31 de julio , de apoyo a las familias, los límites de renta a que hace referencia el párrafo anterior tendrán que incrementarse en un 20 %.",
    ],
    prorrateo: [
      "3. Cuando concurran dos contribuyentes con derecho a la deducción y no opten por la tributación conjunta, el importe se prorrateará entre estos a partes iguales.",
    ],
    incompatibilidades: [
      "Asimismo, esta deducción es incompatible con la percepción de ayudas y prestaciones públicas concedidas u otorgadas por la comunidad autónoma de las Illes Balears por causa de nacimiento.",
    ],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_gastos_ela",
      nombreCatalogadoDesdeCodigo("balears_gastos_ela"),
      categoriaCatalogadaDesdeCodigo("balears_gastos_ela"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 100%,3.500; renta52.800/84.480; factura, familiar con mínimo; excluye seguros.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 161 a 162.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [161, 162],
      ["balears_gastos_ela:importe", "balears_gastos_ela:cumple"],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 6 sexties del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Solo cuando el supuesto de esta deducción exige derecho a un mínimo estatal: Remisión a los artículos 58 a 61 de la Ley 35/2006: descendiente menor de 25 años o con discapacidad cualquiera que sea su edad, convivencia o dependencia económica asimilada; ascendiente mayor de 65 años o con discapacidad y convivencia al menos la mitad del período. Rentas anuales no exentas no superiores a 8.000 euros y exclusión si presenta declaración con rentas superiores a 1.800 euros, con las reglas especiales de conjunta. Prorrateo entre titulares del mismo grado y preferencia del grado más próximo conforme al artículo 61. La discapacidad y los gastos de asistencia requieren las circunstancias acreditadas del artículo 60.",
      "A estos efectos, solo se pueden tener en cuenta los descendientes y los ascendientes del contribuyente que den derecho a aplicar el mínimo por descendientes o por ascendientes que regulan los artículos 58 y 59 de la Ley 35/2006, de 28 de noviembre , del impuesto sobre la renta de las personas físicas y modificación parcial de las leyes de los impuestos sobre sociedades, sobre la renta de no residentes y sobre el patrimonio.",
      "3. Los gastos que dan derecho a la deducción se justificarán mediante las facturas o los documentos equivalentes correspondientes, que se mantendrán a disposición de la administración tributaria.",
      "4. No se integran en la base de esta deducción las primas de seguros de salud ni el resto de gastos que no lleven causa de la esclerosis lateral amiotrófica.",
    ],
    limites: [
      "1. Se establece una deducción en la cuota íntegra autonómica por la cuantía correspondiente al cien por cien de los gastos satisfechos durante el ejercicio derivados de la esclerosis lateral amiotrófica del contribuyente, o de los descendientes o de los ascendientes del contribuyente a cargo de este, con un límite máximo de 3.500 euros.",
      "2. En todo caso, la aplicación de esta deducción exige que la base imponible total no supere el importe de 84.480 euros en el caso de tributación conjunta y de 52.800 euros en el caso de tributación individual.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [
      "Sin perjuicio de lo anterior, esta deducción es compatible con la deducción regulada en el artículo 6 quinquies de este texto refundido respecto de determinados gastos relativos a personas mayores de 65 años o a personas con discapacidad.",
    ],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_inversion_entidades_nuevas_reciente_creacion",
      nombreCatalogadoDesdeCodigo(
        "balears_inversion_entidades_nuevas_reciente_creacion"
      ),
      categoriaCatalogadaDesdeCodigo(
        "balears_inversion_entidades_nuevas_reciente_creacion"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 30%,6.000; especial50%,12.000; participación hasta40%; cuatro años.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 162 a 165.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [162, 163, 164, 165],
      [
        "balears_inversion_entidades_nuevas_reciente_creacion:importe",
        "balears_inversion_entidades_nuevas_reciente_creacion:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 7 del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Cuando las inversiones se lleven a cabo en sociedades participadas por centros de investigación o universidades la deducción será del 50 % con un importe máximo de 12.000 euros por ejercicio y por contribuyente.",
      "2. Para que se pueda aplicar esta deducción será necesario cumplir los requisitos y las condiciones siguientes:",
      "a) La participación conseguida por el contribuyente, computada juntamente con la del cónyuge o las personas unidas por razón de parentesco en línea directa o colateral, por consanguinidad o afinidad, hasta el tercer grado incluido, no podrá ser superior al 40 % del capital social de la sociedad objeto de la inversión o de los derechos de voto de la sociedad.",
      "b) La entidad en que se materializará la inversión debe cumplir los siguientes requisitos:",
      "1.º Debe tener naturaleza de sociedad anónima, sociedad limitada, sociedad anónima laboral, sociedad limitada laboral o sociedad cooperativa.",
      "2.º Debe tener el domicilio social y fiscal en las Illes Balears.",
      "3.º Debe desarrollar una actividad económica. A este efecto, no debe tener por actividad principal la gestión de un patrimonio mobiliario o inmobiliario, de acuerdo con lo previsto en el artículo 4, apartado 8, número Dos.a), de la Ley 19/1991, de 6 de junio , del impuesto sobre el patrimonio, ni dedicarse a la actividad de arrendamiento de inmuebles.",
      "4.º Como mínimo, debe ocupar una persona domiciliada fiscalmente en las Illes Balears con un contrato laboral a jornada completa, dada de alta en el régimen general de la Seguridad Social y que no sea socia ni partícipe de la sociedad.",
      "5.º En caso de que la inversión se haya realizado mediante una ampliación de capital, la sociedad debe haberse constituido en los dos años anteriores a la fecha de esta ampliación, a no ser que se trate de una empresa innovadora en materia de investigación y desarrollo que, de acuerdo con lo que establece la Orden ECC/1087/2015, de 5 de junio , por la que se regula la obtención del sello de pequeña y mediana empresa innovadora y se crea y regula el Registro de la Pequeña y Mediana Empresa Innovadora, tenga vigente este sello y esté inscrita en el citado registro.",
      "6.º Debe mantener los puestos de trabajo. A este efecto, se considera que se mantienen los puestos de trabajo cuando se conserva la plantilla media total, en términos de personas por año que regula la normativa laboral, calculada así como prevé el artículo 102 de la Ley 27/2014, de 27 de noviembre , del impuesto sobre sociedades.",
      "c) El contribuyente puede formar parte del consejo de administración de la sociedad en la que se ha materializado la inversión, pero, en ningún caso, puede llevar a cabo funciones ejecutivas ni de dirección en la misma. Tampoco puede mantener una relación laboral con la entidad objeto de la inversión.",
      "d) Las operaciones en que sea aplicable la deducción se formalizarán en escritura pública, en la que se especificarán la identidad de los inversores y el importe de la inversión respectiva.",
      "e) Las participaciones adquiridas se mantendrán en el patrimonio del contribuyente durante un período mínimo de cuatro años.",
      "3. El incumplimiento de los requisitos y las condiciones que establecen las letras a), c), e) y f) del apartado 2 anterior, comporta la pérdida del beneficio fiscal, y el contribuyente incluirá en la declaración del impuesto correspondiente al ejercicio en el que se ha producido el incumplimiento la parte del impuesto que se ha dejado de pagar como consecuencia de la deducción practicada, junto con los intereses de demora devengados.",
    ],
    limites: [
      "1. Se establece una deducción del 30 % de las cuantías invertidas durante el ejercicio en la adquisición de acciones, de participaciones sociales o de aportaciones obligatorias o voluntarias efectuadas por los socios como consecuencia de acuerdos de constitución de sociedades o de ampliación de capital en las sociedades a que se refiere el apartado 2 siguiente. El importe máximo de esta deducción es de 6.000 euros por ejercicio. En el caso de declaración conjunta, el importe máximo de deducción es de 6.000 euros por cada contribuyente de la unidad familiar que haya efectuado la inversión. Esta deducción se aplicará en el ejercicio en que se materialice la inversión y en los dos siguientes con el límite de 6.000 euros anuales.",
      "7.º La cifra anual de negocio de la entidad no puede superar el límite de 2.000.000 de euros, calculada así como prevé el artículo 101 de la Ley del impuesto sobre sociedades .",
      "f) Los requisitos que establecen los puntos 2.º, 3.º, 4.º, 6.º y 7.º de la letra b) anterior, y el límite máximo de participación que establece la letra a), así como también la prohibición que contiene la letra c), deben cumplirse durante un período mínimo de cuatro años a contar desde la fecha de efectividad del acuerdo de ampliación de capital o de constitución de la entidad que origina el derecho a la deducción.",
    ],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_fomento_autoocupacion",
      nombreCatalogadoDesdeCodigo("balears_fomento_autoocupacion"),
      categoriaCatalogadaDesdeCodigo("balears_fomento_autoocupacion"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 1.000 primera alta censo, un año, actividad principalmente Balears; renta33.000/52.800.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 165 a 166.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [165, 166],
      [
        "balears_fomento_autoocupacion:importe",
        "balears_fomento_autoocupacion:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 7 bis del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "Los contribuyentes que causen alta por primera vez en el Censo de Empresarios, Profesionales y Retenedores, previsto en el Real decreto 1065/2007, de 27 de julio , por el que se aprueba el Reglamento General de las actuaciones y los procedimientos de gestión e inspección tributaria y de desarrollo de las normas comunes de los procedimientos de aplicación de los tributos, podrán aplicar una deducción en la cuota íntegra del impuesto sobre la renta de las personas físicas de 1.000 euros.",
      "La deducción se practicará en el período impositivo en que se produzca el alta en el citado censo y serán requisitos necesarios para su aplicación que la actividad se desarrolle principalmente en el territorio de la comunidad autónoma de las Illes Balears y que el contribuyente se mantenga en este censo durante al menos un año desde el alta.",
      "En caso de tributación conjunta, la deducción mencionada en el párrafo anterior se aplicará íntegramente por cada uno de los miembros de la unidad familiar que, en su caso, generen el derecho en el mismo periodo impositivo.",
      "Para poder aplicarse esta deducción, la base imponible total del contribuyente no puede superar el importe de 33.000 euros en el caso de tributación individual y de 52.800 euros en el de tributación conjunta.",
    ],
    limites: [],
    prorrateo: [],
    incompatibilidades: [],
    compatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "balears_plazas_dificil_cobertura",
      nombreCatalogadoDesdeCodigo("balears_plazas_dificil_cobertura"),
      categoriaCatalogadaDesdeCodigo("balears_plazas_dificil_cobertura"),
      {
        tipo: "mixta",
        descripcion:
          "Importe final de consignación externa; esta ficha no acredita el cálculo automático de la deducción. Regla: 40%;topes2.000/1.000 según renta; PN/GC Mallorca-30%,Formentera+30%; más mitad año.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 166 a 167.",
        "La consignación del importe no verifica por sí sola los requisitos de la norma.",
      ],
      [166, 167],
      [
        "balears_plazas_dificil_cobertura:importe",
        "balears_plazas_dificil_cobertura:cumple",
      ],
      ["Las condiciones individuales se detallan en requisitos."]
    ),
    normativa:
      "Artículo 7 ter del texto refundido de Illes Balears, Decreto Legislativo 1/2014; redacción aplicable al ejercicio 2025.",
    requisitos: [
      "1. Se establece una deducción en la cuota íntegra autonómica por la cuantía correspondiente al 40 % de los gastos satisfechos durante el ejercicio en concepto de adquisición o construcción o alquiler de la vivienda en las Illes Balears o del transporte aéreo o marítimo interinsular de los contribuyentes que, de acuerdo con la legislación vigente aplicable en el ámbito del sector público de la Administración de la comunidad autónoma de las Illes Balears, perciban el complemento de difícil o de muy difícil cobertura durante todo el periodo impositivo o más de la mitad de este periodo.",
      "2. Esta deducción es aplicable también a los contribuyentes que ocupen puestos de trabajo de la Policía Nacional o de la Guardia Civil con destino efectivo en las Illes Balears durante todo el periodo impositivo o más de la mitad de este periodo, que se entenderán a estos efectos como de difícil cobertura.",
      "4. En el supuesto de adquisición o construcción de la vivienda, el inmueble constituirá la vivienda habitual del contribuyente y los gastos deducibles son, únicamente, los intereses inherentes a los préstamos con garantía hipotecaria de la vivienda construida o adquirida.",
    ],
    limites: [
      "3. Cuando la base imponible total del contribuyente no supere el importe de 33.000 euros en el caso de tributación individual y de 52.800 euros en el de tributación conjunta, el límite máximo de la deducción es de 2.000 euros.",
      "Cuando la base imponible total del contribuyente no supere el importe de 52.800 euros en el caso de tributación individual y de 84.480 euros en el de tributación conjunta, el límite máximo de la deducción es de 1.000 euros.",
      "5. En cuanto a los contribuyentes mencionados en el apartado 2 con destino efectivo en la isla de Mallorca o en la isla de Formentera, los límites máximos de la deducción a que hace referencia el apartado 3 se reducirán un 30 % o se incrementarán un 30 %, respectivamente.",
    ],
    prorrateo: [
      "En casos de destino en diferentes islas en un mismo periodo impositivo, los límites máximos de la deducción se prorratearán en función de los días de destino en cada una de las islas.",
    ],
    incompatibilidades: [],
    compatibilidades: [],
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const BALEARS_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...BALEARS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  BALEARS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  BALEARS_LIBROS_TEXTO_2025,
  BALEARS_NACIMIENTO_2025,
  BALEARS_GASTOS_MAYORES_65_DISCAPACIDAD_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
