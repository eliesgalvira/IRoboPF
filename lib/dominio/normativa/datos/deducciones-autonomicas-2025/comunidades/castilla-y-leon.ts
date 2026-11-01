import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CYL_FAMILIA_NUMEROSA_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "cyl_familia_numerosa",
    "Por familia numerosa",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "600 euros general; 1.500 con cuatro descendientes; 2.500 con cinco; +1.000 por sexto y sucesivos; +600 por discapacidad",
    },
    [
      "600 euros con carácter general",
      "1.500 euros con cuatro descendientes con mínimo",
      "2.500 euros con cinco descendientes con mínimo",
      "Incremento de 1.000 euros por cada descendiente a partir del sexto",
      "Incremento de 600 euros por discapacidad igual o superior al 65%",
    ],
    [283, 284]
  ),
  normativa:
    "Artículo 3. Deducciones por familia numerosa.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
  requisitos: [
    "El importe de la deducción se incrementará en 600 euros cuando alguno de los cónyuges o descendientes a los que sea de aplicación el mínimo por descendiente tenga un grado de discapacidad igual o superior al 65 por 100.",
    "A estos efectos, el grado de discapacidad, cuya determinación se efectuará conforme al baremo establecido actualmente en el artículo 354 del texto refundido de la Ley General de la Seguridad Social, aprobado por el Real Decreto Legislativo 8/2015, de 30 de octubre (BOE de 31 de octubre), se acreditará mediante certificación expedida por el órgano competente en la materia.",
    "El artículo 354 del Texto refundido remite para el reconocimiento del grado de discapacidad a la aplicación del baremo aprobado por el Gobierno mediante real decreto. Actualmente es el Real Decreto 888/2022, de 18 de octubre, por el que se establece el procedimiento para el reconocimiento, declaración y calificación del grado de discapacidad (BOE del 20 de octubre), que entró en vigor el 20 de abril de 2023 y que sustituye al Real Decreto 1971/1999, de 23 de diciembre.",
    "Igualmente, se considerará acreditado un grado de discapacidad igual o superior al 65 por 100, cuando se trate de personas cuya incapacidad sea declarada judicialmente, aunque no se alcance dicho grado.",
    "Téngase en cuenta que, a partir de la entrada en vigor de la Ley 8/2021 de reforma del Código Civil, las referencias realizadas a la incapacitación judicial, se extienden a las resoluciones judiciales en las que se establece la curatela representativa de las personas con discapacidad.",
    "El concepto de familia numerosa es el establecido en la legislación estatal en la materia.",
    "Véase al respecto la Ley 40/2003, de 18 de noviembre, de protección a las familias numerosa (BOE de 19 de noviembre).",
    "-Corresponderá la mitad del importe total de la deducción al contribuyente cuyo cónyuge no haya residido en la Comunidad de Castilla y León en el ejercicio.",
    "Para la aplicación de esta deducción, el contribuyente deberá estar en posesión del documento acreditativo de la condición de familia numerosa expedido por el órgano competente en la materia de la Comunidad de Castilla y León vigente a la fecha de devengo del impuesto.",
    "Los contribuyentes que en el ejercicio citado hubieran tenido derecho a aplicar la presente deducción y hubieran carecido de cuota íntegra autonómica suficiente para aplicarse el total del importe generado por dicha deducción conservarán el derecho a aplicarse el importe no deducido en los tres períodos impositivos consecutivos siguientes hasta agotar, en su caso, el importe total de la deducción.",
    "Por tanto, en la declaración del IRPF del ejercicio 2025 finaliza la posibilidad de aplicar el importe generado en el ejercicio 2022 y no deducido, pudiendo, en su caso, tal y como se indica en el párrafo siguiente, solicitar a la Junta de Castilla y León el abono de la cantidad que les reste por aplicar.",
    "De no resultar finalmente aplicada la totalidad de la deducción podrán solicitar a la Junta de Castilla y León, conforme al procedimiento establecido en la Orden EYH/706/2015, de 24 de agosto (BOCyL del 1 de septiembre), el abono de la cantidad que les reste por aplicar.",
  ],
  limites: [
    "600 euros, con carácter general, por el hecho de tener la condición de familia numerosa el último día del período impositivo (normalmente, el 31 de diciembre).",
    "1.500 euros, en el caso de que se trate de una familia numerosa con cuatro descendientes que den derecho a la aplicación del mínimo por descendientes.",
    "2.500 euros, en el caso de que se trate de una familia numerosa con cinco descendientes que den derecho a la aplicación del mínimo por descendientes, con un incremento de 1.000 euros adicionales a partir del sexto y sucesivos descendientes.",
    "El incremento es aplicable por cada descendiente a partir del sexto. No se trata de un importe único.",
  ],
  prorrateo: [
    "Esta deducción se aplicará por el contribuyente que sea miembro de una familia numerosa y con quien convivan los restantes miembros de la familia numerosa. Cuando estos convivan con más de un contribuyente, el importe de la deducción, en caso de tributación individual, se prorrateará por partes iguales en la declaración de cada uno de ellos.",
    "-En el caso de progenitores divorciados con custodia compartida en el que cada uno de ellos tenga reconocida la condición de titular de familia numerosa, el importe de la deducción se prorrateará entre ellos y con todos los contribuyentes que tengan derecho a aplicar la deducción.",
  ],
  compatibilidades: [],
  incompatibilidades: [],
}

export const CYL_NACIMIENTO_ADOPCION_HIJOS_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "cyl_nacimiento_adopcion_hijos",
    "Por nacimiento o adopción de hijos",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "General: 1.010/1.475/2.351 euros según orden. Medio rural: 1.420/2.070/3.300 euros. Se duplica por discapacidad ≥33%",
    },
    [
      "General: 1.010 euros primer hijo, 1.475 segundo, 2.351 tercero y sucesivos",
      "Medio rural: 1.420 euros primer hijo, 2.070 segundo, 3.300 tercero y sucesivos",
      "Duplicación si discapacidad del nacido/adoptado igual o superior al 33%",
    ],
    [284, 285, 286, 287]
  ),
  normativa:
    "Artículo 4. Deducciones por nacimiento o adopción.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
  requisitos: [
    "Por cada hijo nacido o adoptado en el período impositivo, que genere derecho a la aplicación del mínimo por descendientes, las siguientes cantidades:",
    "1.010 euros si se trata del primer hijo.",
    "1.475 euros si se trata del segundo hijo.",
    "2.351 euros si se trata del tercer hijo o sucesivos.",
    "En el caso de contribuyentes residentes en municipios o entidades locales menores cuya población no exceda de 5.000 habitantes, las cantidades a deducir serán las siguientes:",
    "1.420 euros si se trata del primer hijo.",
    "2.070 euros si se trata del segundo hijo.",
    "3.300 euros si se trata del tercer hijo o sucesivos.",
    'Puede consultar la relación de municipios o entidades locales menores de Castilla y León excluidos de la aplicación del presente supuesto de deducción en el enlace Municipios y entidades locales menores con beneficios fiscales, seleccionando a continuación la opción "Vigente desde 01/01/2025" y acto seguido el arhivo en formato PDF "Relación de municipios o entidades locales menores de Castilla y León cuya población es de más de 5.000 habitantes".',
    "Las cantidades previstas en los apartados A. y B. anteriores se duplicarán en caso de que el nacido o adoptado tenga reconocido un grado de discapacidad igual o superior al 33 por 100.",
    "Importante: si el reconocimiento de la discapacidad fuera realizado con posterioridad al período impositivo correspondiente al nacimiento o adopción y antes de que el menor cumpla cinco años, la deducción se practicará en el período impositivo en que se realice dicho reconocimiento. Para determinar el derecho a aplicar la deducción en ese año y su cuantía habrá que estar a las circunstancias que concurran en el año de nacimiento y a la regulación aplicable dicho año.",
    "A efectos de determinar el número de orden del hijo nacido o adoptado, se tendrá en cuenta al hijo nacido y a los restantes hijos, de cualquiera de los dos progenitores, que convivan con el contribuyente en la fecha de devengo del impuesto (normalmente, el 31 de diciembre), computándose a estos efectos tanto los que lo sean por naturaleza como por adopción.",
    "Si se produce el fallecimiento de un hijo nacido en el periodo impositivo con anterioridad al devengo del impuesto (normalmente, el 31 de diciembre), el mismo no se computaría a efectos de determinar el número de orden de los hijos nacidos o adoptados en el ejercicio, pero dará derecho a aplicar la deducción de 1.010 euros, a pesar de no existir convivencia en la fecha de devengo del impuesto.",
    "Corresponderá la mitad del importe total de la deducción al contribuyente cuyo cónyuge no haya residido en la Comunidad de Castilla y León en el ejercicio.",
    "El contribuyente no tendrá derecho a la aplicación de esta deducción cuando hubiera optado por solicitar ayudas y prestaciones públicas otorgadas por la Junta de Castilla y León de análoga naturaleza por causa de nacimiento o adopción y se hubieran concedido.",
    "En consecuencia, esta deducción resulta incompatible con la percepción de las ayudas reguladas en la ORDEN FAM/83/2024, de 2 de febrero, por la que se modifica la ORDEN FAM/1972/2022, de 29 de diciembre, por la que se aprueban las bases reguladoras para la concesión del Bono Nacimiento a las familias de Castilla y León para el cuidado de hijos, por nacimiento o adopción. La determinación de la incompatibilidad entre la deducción por nacimiento o adopción y el Bono Nacimiento deberá hacerse por cada hijo por quien se perciba.",
    "La normativa reguladora del Bono Nacimiento contempla la concesión de una ayuda complementaria por discapacidad, que podrá ser solicitada al mismo tiempo que la subvención por nacimiento o adopción o posteriormente y antes de que el niño cumpla 5 años, al amparo de las convocatorias posteriores. Si por un primer hijo nacido en 2024 al que se le reconoce la discapacidad en 2025 no se abona dicha ayuda complementaria, procederá aplicar en 2025 el incremento por discapacidad de la deducción por nacimiento previsto en el punto c. anterior, con independencia de si se percibió o no Bono Nacimiento en 2024. No obsta a lo anterior que el contribuyente haya optado por el Bono Nacimiento por un segundo hijo nacido en 2025, sin derecho por lo tanto por este último hijo a la aplicación de la deducción por nacimiento o adopción.",
    "Los contribuyentes que en el ejercicio citado hubieran tenido derecho a aplicar la presente deducción y hubieran carecido de cuota íntegra autonómica suficiente para aplicarse el total del importe generado por dicha deducción conservarán el derecho a aplicarse el importe no deducido en los tres períodos impositivos consecutivos siguientes hasta agotar, en su caso, el importe total de la deducción.",
    "Por tanto, en la declaración del IRPF del ejercicio 2025 finaliza la posibilidad de aplicar el importe generado en el ejercicio 2022 y no deducido, pudiendo, en su caso, tal y como se indica en el párrafo siguiente, solicitar a la Junta de Castilla y León el abono de la cantidad que les reste por aplicar.",
    "De no resultar finalmente aplicada la totalidad de la deducción podrán solicitar a la Junta de Castilla y León, conforme al procedimiento establecido en la Orden EYH/706/2015, de 24 de agosto (BOCyL del 1 de septiembre), el abono de la cantidad que les reste por aplicar.",
  ],
  limites: [],
  prorrateo: [
    "Cuando ambos progenitores o adoptantes tengan derecho a la aplicación de la deducción, su importe, en caso de declaración individual, se prorrateará por partes iguales en la declaración de cada uno de ellos.",
  ],
  compatibilidades: [
    'Esta deducción resulta compatible con la aplicación de las deducciones autonómicas "Por partos o adopciones múltiples", "Por gastos de adopción" y "Por cuidado de hijos menores".',
  ],
  incompatibilidades: [],
}

export const CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025 = {
  ...fichaImplementada(
    { estado: "implementada" },
    "cyl_arrendamiento_vivienda_jovenes",
    "Por arrendamiento de vivienda habitual por jóvenes",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "20% del alquiler, límite 459 euros; 25%, límite 612 euros, en municipio o entidad local menor con población reducida",
    },
    [
      "20%, límite 459 euros",
      "25%, límite 612 euros en municipios o entidades locales menores de población reducida",
      "Base imponible general + ahorro - mínimo personal y familiar máximo 18.900 euros individual y 31.500 conjunta",
    ],
    [303, 304, 305]
  ),
  normativa:
    "Artículo 7. Deducciones en materia de vivienda.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
  requisitos: [
    "Que el contribuyente tenga menos de 36 años a la fecha de devengo del impuesto (normalmente, el 31 de diciembre).",
    "Que la base imponible general más la base imponible del ahorro menos el mínimo personal y familiar (casillas [0435], [0460] y [0520] de la declaración, respectivamente) no supere las siguientes cantidades:",
    "- 18.900 euros en tributación individual.",
    "- 31.500 euros en tributación conjunta.",
    "La deducción se practicará por el titular o titulares del contrato de arrendamiento.",
    "Las cantidades que satisfaga el cónyuge que no figura en el contrato –incluso mediando sociedad de gananciales- no dan derecho a la aplicación de la deducción por no ser arrendatario. Véase al respecto la Sentencia del Tribunal Supremo núm. 220/2009, de 3 de abril (Sala de lo Civil), recaída en el recurso de casación núm. 1200/2004 (ROJ: STS 2464/2009).",
    "Atención: la Junta de Castilla y León ha abonado en el ejercicio 2025 ayudas correspondientes al bono alquiler joven convocado por Orden de la Consejería de Medio Ambiente, Vivienda y Ordenación del territorio de 26 de julio de 2022, modificada por Orden de 24 de marzo de 2025 de dicha consejería, que cubren hasta un máximo de 24 mensualidades de alquiler que pueden corresponder al ejercicio 2025 o a ejercicios anteriores.",
    "El límite de la deducción se establece como la diferencia entre las cantidades efectivamente satisfechas por el arrendatario y el importe total de las ayudas que perciba de cualquier administración o ente público por este concepto, por lo que, en la declaración del IRPF de 2025, al informar en la deducción sobre el importe de las ayudas percibidas por el contribuyente, se deben incluir exclusivamente las ayudas correspondientes a mensualidades de alquiler del ejercicio 2025.",
    "Si el contribuyente hubiera percibido en 2025 el bono alquiler joven por mensualidades de alquiler correspondientes a 2023 o 2024, estas ayudas disminuirán la base de la deducción que se hubiera podido aplicar en dichos ejercicios, por lo que deberá comprobar el cumplimiento del límite de la deducción a que se refiere el párrafo anterior y en caso de superarlo regularizar su situación mediante la presentación de la correspondiente autoliquidación rectificativa ante la AEAT.",
    "Todo lo anterior se debe tener en cuenta, sin perjuicio de la obligación de imputar íntegramente las ayudas percibidas en el ejercicio 2025 en el epígrafe F1 (Ganancias y pérdidas patrimoniales que no derivan de la transmisión de elementos patrimoniales) de",
    "la declaración a efectos de su integración en la base imponible general del ejercicio 2025, pues las ganancias patrimoniales derivadas de ayudas públicas se imputarán al período impositivo en que tenga lugar su cobro.",
    'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por arrendamiento de Andalucía, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Región de Murcia, La Rioja y Comunitat Valenciana" del Anexo B.11 de la declaración.',
  ],
  limites: [
    "El 20 por 100 de las cantidades satisfechas en el período impositivo en concepto de alquiler de la vivienda habitual en Castilla y León, con un límite de 459 euros.",
    "El 25 por 100 de las cantidades satisfechas, con el límite de 612 euros, cuando la vivienda habitual se encuentre situada en un municipio o en una entidad local menor de Castilla y León que no exceda de:",
    "- 10.000 habitantes, con carácter general, o",
    "- 3.000 habitantes si dista menos de 30 kilómetros de la capital de la provincia",
    'A estos efectos, la Orden HAC/197/2015, de 3 de marzo (BOCyL 20-03-2015) dispone que con fecha 1 de enero de cada año se actualizarán las listas de municipios que cumplen los requisitos previstos en la normativa autonómica para la aplicación de beneficios fiscales en los tributos cedidos sobre los cuales la Comunidad de Castilla y León tenga atribuidas competencias normativas. Estas listas se publicarán en el Portal Tributario de la Junta de Castilla y León (véase al respecto https://tributos.jcyl.es), en la sección "Beneficios fiscales".',
    'Puede consultar la relación de municipios o entidades locales menores de Castilla y León excluidos de la aplicación de la presente deducción en el enlace "Municipios y entidades locales menores con beneficios fiscales", seleccionando a continuación la opción "Vigente desde 01/01/2025" y acto seguido el archivo en formato PDF "Relación de municipios o entidades locales menores de Castilla y León que exceden de 10.000 habitantes o que teniendo más de 3.000 habitantes distan menos de 30 kilómetros de la capital de provincia".',
    'Nota: hasta el 31 de diciembre de 2015 se utilizaba el término "municipio". A partir de esa fecha se modifica por el término "población" y desde el 26 de febrero de 2021 se vuelve a sustituir por los términos “municipio” o “entidad local menor”.',
    "Límite adicional: el importe deducible por el contribuyente por aplicación de los puntos anteriores no podrá superar la diferencia entre las cantidades efectivamente satisfechas por el mismo en concepto de renta de alquiler y el importe del total de las ayudas que perciba de cualquier administración o ente público por dicho concepto.",
    "En el supuesto de que el contribuyente tenga derecho a deducción por más de una vivienda y corresponda aplicar porcentajes y límites distintos en función del municipio de residencia el importe aplicable será la suma de las cantidades resultantes de aplicar a los importes satisfechos por cada contrato el porcentaje y el límite que corresponda, con el límite máximo conjunto de 612 euros.",
  ],
  prorrateo: [],
  compatibilidades: [],
  incompatibilidades: [],
}

export const CYL_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_partos_adopciones_multiples",
      nombreCatalogadoDesdeCodigo("cyl_partos_adopciones_multiples"),
      categoriaCatalogadaDesdeCodigo("cyl_partos_adopciones_multiples"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [287, 288, 289],
      [
        "cyl_partos_adopciones_multiples:importe",
        "cyl_partos_adopciones_multiples:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 4. Deducciones por nacimiento o adopción.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "901 euros durante los dos años siguientes al del último nacimiento o adopción que se compute a efectos de entender producido el parto múltiple o a la adopción simultánea que da derecho a aplicar la deducción.",
      "A efectos de determinar el número de orden del hijo nacido o adoptado, se tendrá en cuenta al hijo nacido y a los restantes hijos, de cualquiera de los dos progenitores, que convivan con el contribuyente en la fecha de devengo del impuesto (normalmente, el 31 de diciembre), computándose a estos efectos tanto los que lo sean por naturaleza como por adopción.",
      "-Corresponderá la mitad del importe total de la deducción al contribuyente cuyo cónyuge no haya residido en la Comunidad de Castilla y León en el ejercicio.",
      "El contribuyente no tendrá derecho a la aplicación de esta deducción cuando hubiera optado por solicitar ayudas y prestaciones públicas otorgadas por la Junta de Castilla y León de análoga naturaleza por causa de nacimiento o adopción y se hubieran concedido.",
      "En consecuencia, esta deducción resulta incompatible con la percepción de las ayudas reguladas en la ORDEN FAM/83/2024, de 2 de febrero, por la que se modifica la ORDEN FAM/1972/2022, de 29 de diciembre, por la que se aprueban las bases reguladoras para la concesión del Bono Nacimiento a las familias de Castilla y León para el cuidado de hijos, por nacimiento o adopción.",
      "Conforme a lo anterior, si el parto múltiple se produce en 2025, por el nacimiento de dos hijos de forma simultánea, siempre que en 2025 se perciba el Bono Nacimiento, por uno o los dos hijos, no existirá derecho a la aplicación de las deducciones por parto múltiple ni por nacimiento.",
      "En el caso de partos sucesivos en un periodo de doce meses, por el nacimiento de dos hijos, los dos en 2025 o el primero en 2024 y el segundo en 2025, la percepción del Bono Nacimiento por el primer nacido por cualquier hecho causante que habilitara para su percepción, es independiente del derecho a la aplicación de la deducción por nacimiento y parto múltiple por el segundo nacido, siempre que tampoco se perciba el Bono Nacimiento por este segundo nacido.",
      "La percepción del Bono Nacimiento en el año 2024 por cualquier hecho causante que habilitara para su percepción es independiente del derecho a la deducción por nacimiento o por partos múltiples que se genere en 2025.",
      "Los contribuyentes que en el ejercicio citado hubieran tenido derecho a aplicar la presente deducción y hubieran carecido de cuota íntegra autonómica suficiente para aplicarse el total del importe generado por dicha deducción conservarán el derecho a aplicarse el importe no deducido en los tres períodos impositivos consecutivos siguientes hasta agotar, en su caso, el importe total de la deducción.",
      "Por tanto, en la declaración del IRPF del ejercicio 2025 finaliza la posibilidad de aplicar el importe generado en el ejercicio 2022 y no deducido, pudiendo, en su caso, tal y como se indica en el párrafo siguiente, solicitar a la Junta de Castilla y León el abono de la cantidad que les reste por aplicar.",
      "De no resultar finalmente aplicada la totalidad de la deducción podrán solicitar a la Junta de Castilla y León, conforme al procedimiento establecido en la Orden EYH/706/2015, de 24 de agosto (BOCyL del 1 de septiembre), el abono de la cantidad que les reste por aplicar.",
    ],
    limites: [
      "El 50 por 100 de la cantidad que corresponda por la aplicación de la deducción por nacimiento o adopción si el parto múltiple o la adopción simultánea ha sido de dos hijos que generen el derecho a la aplicación del mínimo por descendientes.",
      "El 100 por 100 de la cantidad que corresponda por la aplicación de la deducción por nacimiento o adopción, si el parto múltiple o adopción simultánea ha sido de tres o más hijos, que generen el derecho a la aplicación del mínimo por descendientes.",
      "Igual deducción se practicará en los supuestos de nacimientos o adopciones independientes producidos en un período de doce meses.",
      "En el caso de nacimiento de dos hijos en un plazo de doce meses, uno en 2024 y otro en 2025, solo podrán aplicar la deducción los progenitores que convivan con los hijos en 2024 y en 2025.",
    ],
    prorrateo: [
      "Cuando ambos progenitores o adoptantes tengan derecho a la aplicación de la deducción, su importe, en caso de declaración individual, se prorrateará por partes iguales en la declaración de cada uno de ellos.",
      "-En el caso de que durante el ejercicio 2024 se hubiera producido un parto múltiple o adopción simultánea y los nacidos en dicho año no formaran parte de un nuevo parto múltiple junto con algún hijo nacido en el ejercicio 2025, se deberá consignar el importe de deducción adicional de 901 euros (prorrateada en función del número de contribuyentes con derecho a la misma) en la casilla correspondiente.",
    ],
    compatibilidades: [
      'Esta deducción resulta compatible con la aplicación de las deducciones autonómicas "Por nacimiento o adopción de hijos", "Por gastos de adopción" y "Por cuidado de hijos menores".',
    ],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_gastos_adopcion",
      nombreCatalogadoDesdeCodigo("cyl_gastos_adopcion"),
      categoriaCatalogadaDesdeCodigo("cyl_gastos_adopcion"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [289, 290],
      ["cyl_gastos_adopcion:importe", "cyl_gastos_adopcion:cumple"],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 4. Deducciones por nacimiento o adopción.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "La deducción será aplicable al período impositivo correspondiente al momento en que se produzca la inscripción en el Registro Civil.",
      "El contribuyente no tendrá derecho a la aplicación de esta deducción cuando hubiera optado por solicitar ayudas y prestaciones públicas otorgadas por la Junta de Castilla y León de análoga naturaleza y se hubieran concedido.",
      "En consecuencia, esta deducción resulta incompatible con la percepción de las ayudas reguladas en la ORDEN FAM/83/2024, de 2 de febrero, por la que se modifica la ORDEN FAM/1972/2022, de 29 de diciembre, por la que se aprueban las bases reguladoras para la concesión del Bono Nacimiento a las familias de Castilla y León para el cuidado de hijos, por nacimiento o adopción.",
      "Los contribuyentes que en el ejercicio citado hubieran tenido derecho a aplicar la presente deducción y hubieran carecido de cuota íntegra autonómica suficiente para aplicarse el total del importe generado por dicha deducción conservarán el derecho a aplicarse el importe no deducido en los tres períodos impositivos consecutivos siguientes hasta agotar, en su caso, el importe total de la deducción.",
      "Por tanto, en la declaración del IRPF del ejercicio 2025 finaliza la posibilidad de aplicar el importe generado en el ejercicio 2022 y no deducido, pudiendo, en su caso, tal y como se indica en el párrafo siguiente, solicitar a la Junta de Castilla y León el abono de la cantidad que les reste por aplicar.",
      "De no resultar finalmente aplicada la totalidad de la deducción podrán solicitar a la Junta de Castilla y León, conforme al procedimiento establecido en la Orden EYH/706/2015, de 24 de agosto (BOCyL del 1 de septiembre), el abono de la cantidad que les reste por aplicar.",
    ],
    limites: [
      "784 euros por cada adopción realizada en el período impositivo de hijos que generen el derecho a la aplicación del mínimo por descendientes.",
      "3.625 euros en el supuesto de adopción internacional.",
      "Se entenderá que la adopción tiene carácter internacional cuando se realice según la legislación vigente y de acuerdo con los tratados y convenios suscritos por España.",
    ],
    prorrateo: [
      "Cuando exista más de un contribuyente con derecho a practicar esta deducción, el importe de la misma se prorrateará por partes iguales en la declaración de cada uno de ellos.",
    ],
    compatibilidades: [
      'Esta deducción resulta compatible con la aplicación de las deducciones autonómicas "Por nacimiento o adopción de hijos", "Por partos o adopciones múltiples" y "Por cuidado de hijos menores".',
    ],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_cuidado_hijos_menores",
      nombreCatalogadoDesdeCodigo("cyl_cuidado_hijos_menores"),
      categoriaCatalogadaDesdeCodigo("cyl_cuidado_hijos_menores"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [290, 291, 292],
      ["cyl_cuidado_hijos_menores:importe", "cyl_cuidado_hijos_menores:cumple"],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 5. Deducciones por cuidado de hijos menores.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Que, a la fecha de devengo del impuesto (normalmente, el 31 de diciembre), los hijos a los que sea de aplicación el mínimo por descendientes tuvieran menos de 4 años de edad.",
      "Que ambos padres realicen una actividad por cuenta propia o ajena, por la cual estén dados de alta en el régimen correspondiente de la Seguridad Social o Mutualidad.",
      "Que, en el supuesto de que la deducción sea aplicable por gastos de custodia por una persona empleada de hogar, esta esté dada de alta en el Sistema Especial para Empleados del Hogar del Régimen General de la Seguridad Social.",
      "Importante: los contribuyentes con derecho a la deducción deberán hacer constar el NIF de la persona empleada del hogar, escuela, centro o guardería infantil en el Anexo B.5 de la declaración.",
      "Que la base imponible general más la base imponible del ahorro menos el mínimo personal y familiar (casillas [0435], [0460] y [0520] de la declaración, respectivamente) no supere las siguientes cantidades:",
      "- 18.900 euros en tributación individual.",
      "- 31.500 euros en tributación conjunta.",
      "El importe total de la deducción aplicada por ambos progenitores, más el importe en su caso, del incremento de la deducción estatal por maternidad, más la cuantía de las ayudas públicas percibidas por este concepto no podrá superar, para el mismo ejercicio, el importe total del gasto efectivo en escuelas infantiles, centros y guarderías infantiles.",
      "En el caso de que el importe de todas las deducciones y ayudas públicas mencionadas superase el gasto satisfecho por la guardería, se minorará el importe máximo de la deducción en la cuantía necesaria. Dicha minoración se debe realizar proporcionalmente a la deducción aplicada de cada uno de los progenitores, con independencia de a qué progenitor se impute la ayuda.",
      "A estos efectos el cálculo para minorar el importe máximo de la deducción en la cuantía necesaria, se realiza de forma independiente por cada uno de los hijos si proceden de distintos progenitores.",
      "El contribuyente no tendrá derecho a la aplicación de esta deducción cuando hubiera optado por solicitar ayudas y prestaciones públicas otorgadas por la Junta de Castilla y León de análoga naturaleza por causa de cuidado de hijos menores y se hubieran concedido.",
      "Se hace constar, a tal efecto, la compatibilidad de la presente deducción con la percepción de las ayudas reguladas en la ORDEN FAM/882/2021, de 12 de julio, por la que se aprueban las bases reguladoras para la concesión del «Bono Concilia» a las familias de Castilla y León para la conciliación de la vida personal, familiar y laboral en el cuidado de menores de cero a tres años, por no presentar naturaleza análoga, de acuerdo con el criterio remitido por la Comunidad Autónoma.",
      "El importe del Bono Concilia percibido no computa a efectos de comprobar que el importe total de la deducción aplicada por ambos progenitores más, en su caso, el importe del incremento por la deducción estatal por maternidad y el de otras ayudas públicas percibidas por el concepto de cuidado de hijos menores, supera el gasto efectivamente incurrido por dicho concepto, ni en la consiguiente minoración de la cuantía máxima deducible si se diera este supuesto.",
      'Se hace constar, adicionalmente, la compatibilidad de la presente deducción con la percepción de "Ayudas por reducción de jornada y excedencia" reguladas por la ORDEN FAM/1454/2023, de 18 de diciembre, por la que se aprueban las bases reguladoras para la concesión de subvenciones destinadas a la conciliación de la vida personal, familiar y laboral en Castilla y León. El importe percibido por estas ayudas por reducción de jornada y excedencia tampoco computa a los efectos mencionados en el párrafo anterior.',
      "Los contribuyentes que en el ejercicio citado hubieran tenido derecho a aplicar la presente deducción y hubieran carecido de cuota íntegra autonómica suficiente para aplicarse el total del importe generado por dicha deducción conservarán el derecho a aplicarse el importe no deducido en los tres períodos impositivos consecutivos siguientes hasta agotar, en su caso, el importe total de la deducción.",
      "Por tanto, en la declaración del IRPF del ejercicio 2025 finaliza la posibilidad de aplicar el importe generado en el ejercicio 2022 y no deducido, pudiendo, en su caso, tal y como se indica en el párrafo siguiente, solicitar a la Junta de Castilla y León el abono de la cantidad que les reste por aplicar.",
      "De no resultar finalmente aplicada la totalidad de la deducción podrán solicitar a la Junta de Castilla y León, conforme al procedimiento establecido en la Orden EYH/706/2015, de 24 de agosto (BOCyL del 1 de septiembre), el abono de la cantidad que les reste por aplicar.",
    ],
    limites: [
      "Los contribuyentes que, por motivos de trabajo, por cuenta propia o ajena, tengan que dejar a sus hijos menores al cuidado de una persona empleada de hogar o en guarderías o centros infantiles podrán optar por deducir alguna de las siguientes cantidades:",
      "El 30 por 100 de las cantidades satisfechas en el período impositivo a la persona empleada del hogar, con el límite máximo de 322 euros, tanto en tributación individual como conjunta.",
      "El 100 por 100 de los gastos satisfechos de preinscripción y de matrícula, así como los gastos de asistencia en horario general y ampliado y los gastos de alimentación, siempre que se hayan producido por meses completos, en escuelas, centros y guarderías infantiles de la Comunidad de Castilla y León, inscritas en el Registro de Centros para la conciliación de la vida familiar y laboral, con el límite máximo de 1.320 euros, tanto en tributación individual como conjunta.",
      "En el caso a) de la deducción por cuidado de hijos (por persona empleada del hogar) la base estará constituida por las cantidades satisfechas a la persona empleada del hogar.",
      "No obstante, en caso de haber percibido subvenciones públicas por este concepto, el importe total de la deducción más la cuantía de dichas subvenciones no podrá superar el gasto efectivo, minorándose en este caso el importe máximo de la deducción en la cuantía necesaria. Si la suma no supera el gasto, no se deberá restar la subvención.",
      "En el caso b) de la deducción por cuidado de hijos (por gastos de guardería) la base de la deducción estará constituida por las cantidades satisfechas a escuelas infantiles, centros y guarderías infantiles en los términos antes indicados minorada, en su caso, en el importe de las subvenciones recibidas por este concepto.",
      "No obstante, en el supuesto de que el contribuyente tuviera derecho al incremento de la deducción estatal por maternidad a que se refiere el artículo 81.2 de la Ley del IRPF, el importe de la misma minorará la cuantía de esta deducción determinada conforme los puntos anteriores. En este supuesto, el límite de 1.320 euros se verá reducido en la cantidad a que el contribuyente tuviera derecho por la deducción estatal.",
    ],
    prorrateo: [
      "Cuando más de un contribuyente tenga derecho a la aplicación de esta deducción respecto de los mismos descendientes, el importe de las cantidades satisfechas se prorrateará entre ellos por partes iguales, respetando, en todo caso, el límite máximo de la deducción.",
      "Si el régimen económico del matrimonio es la sociedad de gananciales, las cantidades satisfechas por el cuidado de los hijos corresponden a los cónyuges por partes iguales, por lo que cada uno de ellos aplicará la deducción por las cantidades que le correspondan. Si el régimen económico del matrimonio es el de separación de bienes o no existe matrimonio ente los cónyuges, la deducción se aplicará por el cónyuge o cónyuges que haya satisfecho los gastos, por las cantidades efectivamente satisfechas.",
    ],
    compatibilidades: [
      'Esta deducción resulta compatible con la aplicación de las deducciones autonómicas "Por nacimiento o adopción de hijos", "Por partos o adopciones múltiples" y "Por gastos de adopción".',
    ],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_cuotas_seguridad_social_empleados_hogar",
      nombreCatalogadoDesdeCodigo(
        "cyl_cuotas_seguridad_social_empleados_hogar"
      ),
      categoriaCatalogadaDesdeCodigo(
        "cyl_cuotas_seguridad_social_empleados_hogar"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [293, 294],
      [
        "cyl_cuotas_seguridad_social_empleados_hogar:importe",
        "cyl_cuotas_seguridad_social_empleados_hogar:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 5. Deducciones por cuidado de hijos menores.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "La deducción será aplicable solo por los contribuyentes que a la fecha de devengo del impuesto tengan un hijo menor de 4 años, al que sea de aplicación el mínimo por descendientes regulado en la normativa del IRPF.",
      "Para aplicar esta deducción la base imponible total (casillas [0435] y [0460] de la declaración) menos el mínimo personal y familiar (casilla [0520] de la declaración) no puede superar las siguientes cantidades:",
      "- 18.900 euros en tributación individual.",
      "- 31.500 euros en tributación conjunta.",
      "El contribuyente no tendrá derecho a la aplicación de esta deducción cuando hubiera optado por solicitar ayudas y prestaciones públicas otorgadas por la Junta de Castilla y León de análoga naturaleza por causa de cuidado de hijos menores y se hubieran",
      "Se hace constar, a tal efecto, la compatibilidad de la presente deducción con la percepción de las ayudas reguladas en la ORDEN FAM/882/2021, de 12 de julio, por la que se aprueban las bases reguladoras para la concesión del «Bono Concilia» a las familias de Castilla y León para la conciliación de la vida personal, familiar y laboral en el cuidado de menores de cero a tres años, por no presentar naturaleza análoga, de acuerdo con el criterio remitido por la Comunidad Autónoma.",
      "Los contribuyentes que en el ejercicio citado hubieran tenido derecho a aplicar la presente deducción y hubieran carecido de cuota íntegra autonómica suficiente para aplicarse el total del importe generado por dicha deducción conservarán el derecho a aplicarse el importe no deducido en los tres períodos impositivos consecutivos siguientes hasta agotar, en su caso, el importe total de la deducción.",
      "Por tanto, en la declaración del IRPF del ejercicio 2025 finaliza la posibilidad de aplicar el importe generado en el ejercicio 2022 y no deducido, pudiendo, en su caso, tal y como se indica en el párrafo siguiente, solicitar a la Junta de Castilla y León el abono de la cantidad que les reste por aplicar.",
      "De no resultar finalmente aplicada la totalidad de la deducción podrán solicitar a la Junta de Castilla y León, conforme al procedimiento establecido en la Orden EYH/706/2015, de 24 de agosto (BOCyL del 1 de septiembre), el abono de la cantidad que les reste por aplicar.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas por los contribuyentes en el período impositivo por las cuotas a la Seguridad Social de un trabajador incluido en el Sistema Especial para Empleados del Hogar del Régimen General de la Seguridad Social.",
      "El límite máximo de la deducción es de 300 euros.",
      "El límite máximo de la deducción opera tanto en tributación individual como en conjunta.",
      "Importante: los contribuyentes con derecho a la deducción deberán hacer constar el NIF de la persona empleada en el Anexo B.5 de la declaración.",
    ],
    prorrateo: [
      "Cuando más de un contribuyente tenga derecho a la aplicación de esta deducción respecto de los mismos descendientes, el importe de las cantidades satisfechas se prorrateará entre ellos por partes iguales, respetando, en todo caso, el límite máximo de la deducción.",
      "Las cuotas satisfechas se atribuirán íntegramente al contribuyente que figure como empleador salvo que se trate de matrimonios en régimen de gananciales, en cuyo caso se atribuirán a los cónyuges por partes iguales.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_contribuyentes_discapacidad",
      nombreCatalogadoDesdeCodigo("cyl_contribuyentes_discapacidad"),
      categoriaCatalogadaDesdeCodigo("cyl_contribuyentes_discapacidad"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [294, 295],
      [
        "cyl_contribuyentes_discapacidad:importe",
        "cyl_contribuyentes_discapacidad:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 6. Deducción por discapacidad.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Que la suma de la base imponible general y la base imponible del ahorro del contribuyente menos el mínimo personal y familiar (casillas [0435], [0460] y [0520] de la declaración, respectivamente) no supere las siguientes cantidades:",
      "- 18.900 euros en tributación individual.",
      "- 31.500 euros en tributación conjunta.",
      "Que el contribuyente no sea usuario de residencias públicas o concertadas de la Comunidad de Castilla y León.",
      "Que el grado de discapacidad se acredite mediante certificación expedida por el órgano competente en la materia. Dicho grado será el determinado conforme al baremo al que se refiere actualmente el artículo 354 del texto refundido de la Ley General de la Seguridad Social, aprobado por el Real Decreto Legislativo 8/2015, de 30 de octubre (BOE de 31 de octubre).",
      "Se considerará acreditado un grado de discapacidad igual o superior al 65 por 100, cuando se trate de personas cuya incapacidad sea declarada judicialmente, aunque no se alcance dicho grado.",
      "Téngase en cuenta que, a partir de la entrada en vigor de la Ley 8/2021 de reforma del Código Civil, las referencias realizadas a la incapacitación judicial, se extienden a las resoluciones judiciales en las que se establece la curatela representativa de las personas con discapacidad.",
      "También se considerará acreditado un grado de discapacidad igual o superior al 33 por 100 en caso de pensionistas de la Seguridad Social que tengan reconocida una pensión de incapacidad permanente total, absoluta o gran invalidez y en el caso de los pensionistas de clases pasivas que tengan reconocida una pensión de jubilación o retiro por incapacidad permanente para el servicio o inutilidad.",
    ],
    limites: [
      "300 euros por cada contribuyente, de edad igual o superior a 65 años, afectado por un grado de discapacidad igual o superior al 33 por 100.",
      "656 euros por cada contribuyente, de edad igual o superior a 65 años, afectado por un grado de discapacidad igual o superior al 65 por 100.",
      "300 euros por cada contribuyente menor de 65 años afectado por un grado de discapacidad igual o superior al 65 por 100.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_vivienda_jovenes_medio_rural",
      nombreCatalogadoDesdeCodigo("cyl_vivienda_jovenes_medio_rural"),
      categoriaCatalogadaDesdeCodigo("cyl_vivienda_jovenes_medio_rural"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [295, 296, 297, 298],
      [
        "cyl_vivienda_jovenes_medio_rural:importe",
        "cyl_vivienda_jovenes_medio_rural:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 7. Deducciones en materia de vivienda.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Que el contribuyente tenga su residencia habitual en la Comunidad de Castilla y León y que, a la fecha de devengo del impuesto (normalmente, el 31 de diciembre), tenga menos de 36 años.",
      "Que se trate de su primera vivienda habitual. Se considera que el contribuyente adquiere su primera vivienda cuando no dispusiera ni hubiera dispuesto de ningún derecho de plena propiedad igual o superior al 50 por 100 sobre otra vivienda.",
      "Que la vivienda esté situada en un municipio o en una entidad local menor de Castilla y León que, en el momento de la adquisición o rehabilitación, no exceda de:",
      "- 10.000 habitantes, con carácter general, o",
      "- 3.000 habitantes si dista menos de 30 kilómetros de la capital de la provincia.",
      "A estos efectos, la Orden HAC/197/2015, de 3 de marzo (BOCyL 20-03-2015) dispone que con fecha 1 de enero de cada año se actualizarán las listas de municipios que cumplen los requisitos previstos en la normativa autonómica para la aplicación de beneficios fiscales en los tributos cedidos sobre los cuales la Comunidad de Castilla y León tenga atribuidas competencias normativas.",
      'Puede consultar la relación de municipios o entidades locales menores de Castilla y León excluidos de la aplicación de la presente deducción en el enlace "Municipios y entidades locales menores con beneficios fiscales", seleccionando a continuación la opción "Vigente desde 01/01/2025" y acto seguido el archivo en formato PDF "Relación de municipios o entidades locales menores de Castilla y León que exceden de 10.000 habitantes o que teniendo más de 3.000 habitantes distan menos de 30 kilómetros de la capital de provincia".',
      'Nota: hasta el 31 de diciembre de 2015 se utilizaba el término "municipio". A partir de esa fecha se modifica por el término "población" y desde el 26 de febrero de 2021 se vuelve a sustituir por los términos “municipio” o “entidad local menor”.',
      "Importante: este requisito deberá cumplirse en el momento de la adquisición o rehabilitación de la vivienda habitual. En los supuestos de construcción de vivienda habitual, este requisito deberá cumplirse en el momento en que se realice el primer pago de los gastos derivados de la ejecución de las obras o, en su caso, la primera entrega de cantidades a cuenta al promotor de la vivienda.",
      "Que la vivienda tenga un valor, a efectos del impuesto que grave su adquisición, menor de 150.000 euros.",
      "Que se trate de una vivienda de nueva construcción o de una rehabilitación.",
      "Que la adquisición o rehabilitación de la vivienda se produzca a partir de 1 de enero de 2023.",
      "Que la base imponible general más la base imponible del ahorro menos el mínimo personal y familiar (casillas [0435], [0460] y [0520] de la declaración, respectivamente) no supere las siguientes cantidades:",
      "- 18.900 euros en tributación individual.",
      "- 31.500 euros, en tributación conjunta.",
      "Se considera vivienda de nueva construcción aquella cuya adquisición represente la primera transmisión de la misma con posterioridad a la declaración de obra nueva, siempre que no hayan transcurrido tres años desde esta. Asimismo, se considera vivienda de nueva construcción cuando el contribuyente satisfaga directamente los gastos derivados de la ejecución de las obras.",
      "El concepto de rehabilitación de viviendas es el recogido en el artículo 20. Uno. 22. B de la Ley 37/1992, de 28 de diciembre, del Impuesto sobre el Valor Añadido, o norma que le sustituya.",
      "A efectos de lo dispuesto en el artículo 20.Uno.22.B de la Ley 37/1992, de 28 de diciembre, del Impuesto sobre el Valor Añadido son obras de rehabilitación de edificaciones las que reúnan los siguientes requisitos:",
      "Que su objeto principal sea la reconstrucción de las mismas, entendiéndose cumplido este requisito cuando más del 50 por ciento del coste total del proyecto de rehabilitación se corresponda con obras de consolidación o tratamiento de elementos estructurales, fachadas o cubiertas o con obras análogas o conexas a las de rehabilitación.",
      "Que el coste total de las obras a que se refiera el proyecto exceda del 25 por ciento del precio de adquisición de la edificación si se hubiese efectuado aquélla durante los dos años inmediatamente anteriores al inicio de las obras de rehabilitación o, en otro caso, del valor de mercado que tuviera la edificación o parte de la misma en el momento de dicho inicio. A estos efectos, se descontará del precio de adquisición o del valor de mercado de la edificación la parte proporcional correspondiente al suelo.",
      "La aplicación de la deducción está condicionada a que el importe comprobado del patrimonio del contribuyente al finalizar el período de la imposición exceda del valor que arrojase su comprobación al comienzo del mismo al menos en la cuantía de las inversiones realizadas, sin computar los intereses y demás gastos de financiación. A estos efectos, no se computarán los incrementos o disminuciones de valor experimentados durante el período impositivo por los elementos patrimoniales que al final del mismo sigan formando parte del patrimonio del contribuyente.",
      "Cuando en periodos impositivos posteriores al de su aplicación se pierda el derecho, en todo o en parte, a las deducciones practicadas, el contribuyente estará obligado a sumar a la cuota líquida autonómica devengada en el ejercicio en que se hayan incumplido los requisitos de la deducción las cantidades indebidamente deducidas, más los intereses de demora a los que se refiere el artículo 26.6 de la LGT.",
      "En relación a la LGT véase la Ley 58/2003, de 17 de diciembre, General Tributaria.",
      "Los contribuyentes que hubieran generado el derecho a aplicar la deducción por adquisición o rehabilitación del artículo 7.1 del texto refundido de las disposiciones legales de la Comunidad de Castilla y León en materia de tributos propios y cedidos con anterioridad al 1 de enero de 2023 podrán continuar aplicándolo en el ejercicio 2025, conforme a los requisitos vigentes cuando se obtuvo el derecho, con la salvedad de la base máxima de deducción, que pasa de 9.040 a 10.000 euros anuales.",
    ],
    limites: [
      "El 15 por 100 de las cantidades satisfechas en el período impositivo por la adquisición o rehabilitación de la vivienda que vaya a constituir la residencia habitual del contribuyente en el territorio de la Comunidad de Castilla y León.",
      "También resulta aplicable la deducción en los supuestos de construcción de la vivienda que vaya a constituir la residencia habitual del contribuyente, siempre que las obras finalicen en un plazo no superior a cuatro años desde el inicio de la inversión.",
      "La base máxima de esta deducción será de 10.000 euros anuales y estará constituida por las cantidades satisfechas para la adquisición o rehabilitación de la vivienda, incluidos los gastos originados que hayan corrido a cargo del adquirente y, en el caso de financiación ajena, la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo decimonoveno de la Ley 36/2003, de 11 de noviembre, de Medidas de Reforma Económica, y demás gastos derivados de la misma.",
      "En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se minorarán en las cantidades obtenidas por aplicación del citado instrumento.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad",
      nombreCatalogadoDesdeCodigo(
        "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad"
      ),
      categoriaCatalogadaDesdeCodigo(
        "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [298, 299, 300],
      [
        "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad:importe",
        "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 7. Deducciones en materia de vivienda.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Únicamente podrán ser objeto de deducción las actuaciones de rehabilitación de viviendas subvencionadas en el marco de programas regulados en los Planes Estatales de vivienda gestionados por Dirección General de Vivienda, Arquitectura, Ordenación del Territorio y Urbanismo de la Junta de Castilla y León, con las finalidades mencionadas en el apartado anterior.",
      "Las convocatorias para las que se han realizado pagos durante el año 2025 que pudieran generar el derecho a la aplicación de la deducción son las siguientes:",
      "Convocatoria año 2021 (Orden de 27 de octubre de 2021):",
      "Ayudas destinadas a la rehabilitación edificatoria para la conservación así como a la mejora de la seguridad de utilización y de la accesibilidad de viviendas (2021).",
      "Convocatoria año 2022 (Orden de 14 de octubre de 2022:",
      "Subvenciones destinadas a la mejora de la accesibilidad de viviendas (2022).",
      "Convocatoria año 2023 (Orden de 17 de octubre de 2023):",
      "Subvenciones destinadas a la mejora de la accesibilidad de viviendas (2023).",
      "Convocatoria año 2024 (Orden de 22 de octubre de 2024):",
      "Subvenciones destinadas a la mejora de la accesibilidad de viviendas (2024).",
      "La acreditación de que la rehabilitación de la vivienda habitual se ha realizado en el marco de programas regulados en planes estatales o autonómicos de vivienda, se realizará mediante justificante de la transferencia bancaria emitida por el órgano gestor de dichos programas, la Dirección General de Vivienda, Arquitectura, Ordenación del Territorio y Urbanismo de la Junta de Castilla y León, en pago de la subvención que los financia.",
      "La deducción se practicará en el ejercicio en el que se perciba el pago de la subvención concedida para la actuación de rehabilitación de la vivienda habitual, en los términos previstos en la normativa reguladora de la citada subvención.",
      "Cuando en periodos impositivos posteriores al de su aplicación se pierda el derecho, en todo o en parte, a las deducciones practicadas, el contribuyente estará obligado a sumar a la cuota líquida autonómica devengada en el ejercicio en que se hayan incumplido los requisitos de la deducción las cantidades indebidamente deducidas, más los intereses de demora a los que se refiere el artículo 26.6 de la LGT.",
      "En relación a la LGT véase la Ley 58/2003, de 17 de diciembre, General Tributaria.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado “Información adicional a la deducción autonómica de las Illes Balears por determinadas inversiones de mejora de la sostenibilidad de la vivienda habitual, de Canarias por obras de rehabilitación energética de la vivienda habitual, de Castilla y León por actuaciones de rehabilitación subvencionadas en el marco de planes estatales o autonómicos de vivienda destinadas a la mejora de la eficiencia energética, la sostenibilidad y la adecuación a la discapacidad de la vivienda habitual, de la Región de Murcia por inversión en instalaciones de recursos energéticos renovables y de la Comunitat Valenciana por cantidades invertidas a partir de 2023 en instalaciones de autoconsumo o de generación de energía eléctrica o térmica a través de fuentes renovables", del Anexo B.12 de la declaración.',
    ],
    limites: [
      "El 15 por 100 de las inversiones que se realicen en las actuaciones de rehabilitación de vivienda que a continuación se relacionan, siempre que la vivienda este situada en la Comunidad de Castilla y León; que constituya o vaya a constituir la vivienda habitual del contribuyente y que sean subvencionadas en el marco de programas regulados en planes estatales o autonómicos de vivienda:",
      "Instalación de paneles solares, a fin de contribuir a la producción de agua caliente sanitaria demandada por las viviendas, en un porcentaje, al menos, del 50 por 100 de la contribución mínima exigible por la normativa técnica de edificación aplicable.",
      "Cualquier mejora en los sistemas de instalaciones térmicas que incrementen su eficiencia energética o la utilización de energías renovables. b.",
      "La mejora de las instalaciones de suministro e instalación de mecanismos que favorezcan el ahorro de agua, así como la realización de redes de saneamiento separativas en el edificio que favorezcan la reutilización de las aguas grises en el propio edificio y reduzcan el volumen de vertido al sistema público de alcantarillado.",
      "Las obras e instalaciones de adecuación necesarias para la accesibilidad y comunicación sensorial que facilite el desenvolvimiento digno y adecuado de uno o varios ocupantes de la vivienda que sean personas con discapacidad, siempre que estos sean el sujeto pasivo o su cónyuge o un pariente, en línea directa o colateral, consanguínea o por afinidad, hasta el tercer grado inclusive.",
      "La base de esta deducción estará constituida por las cantidades realmente satisfechas por el contribuyente para la adquisición e instalación de las inversiones a que se refiere el apartado anterior, con el límite máximo de 20.000 euros.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_rehabilitacion_viviendas_medio_rural_alquiler",
      nombreCatalogadoDesdeCodigo(
        "cyl_rehabilitacion_viviendas_medio_rural_alquiler"
      ),
      categoriaCatalogadaDesdeCodigo(
        "cyl_rehabilitacion_viviendas_medio_rural_alquiler"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [300, 301, 302, 303],
      [
        "cyl_rehabilitacion_viviendas_medio_rural_alquiler:importe",
        "cyl_rehabilitacion_viviendas_medio_rural_alquiler:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 7. Deducciones en materia de vivienda.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "El concepto de rehabilitación de viviendas es el recogido en el artículo 20.Uno.22.B de la Ley 37/1992, de 28 de diciembre, del Impuesto sobre el Valor Añadido, o norma que le sustituya.",
      "A efectos de lo dispuesto en el artículo 20.Uno.22.B de la Ley 37/1992, de 28 de diciembre, del Impuesto sobre el Valor Añadido son obras de rehabilitación de edificaciones las que reúnan los siguientes requisitos:",
      "Que su objeto principal sea la reconstrucción de las mismas, entendiéndose cumplido este requisito cuando más del 50 por ciento del coste total del proyecto de rehabilitación se corresponda con obras de consolidación o tratamiento de elementos estructurales, fachadas o cubiertas o con obras análogas o conexas a las de rehabilitación.",
      "Que el coste total de las obras a que se refiera el proyecto exceda del 25 por ciento del precio de adquisición de la edificación si se hubiese efectuado aquélla durante los dos años inmediatamente anteriores al inicio de las obras de rehabilitación o, en otro caso, del valor de mercado que tuviera la edificación o parte de la misma en el momento de dicho inicio. A estos efectos, se descontará del precio de adquisición o del valor de mercado de la edificación la parte proporcional correspondiente al suelo.",
      "La vivienda debe estar situada en un municipio o en una entidad local menor de Castilla y León que, en el momento de la adquisición o rehabilitación, no exceda de:",
      "- 10.000 habitantes, con carácter general, o",
      "- 3.000 habitantes si dista menos de 30 kilómetros de la capital de la provincia.",
      'A estos efectos, la Orden HAC/197/2015, de 3 de marzo (BOCyL 20-03-2015) dispone que con fecha 1 de enero de cada año se actualizarán las listas de municipios que cumplen los requisitos previstos en la normativa autonómica para la aplicación de beneficios fiscales en los tributos cedidos sobre los cuales la Comunidad de Castilla y León tenga atribuidas competencias normativas. Estas listas se publicarán en el Portal Tributario de la Junta de Castilla y León (véase al respecto https://tributos.jcyl.es), en la sección "Beneficios fiscales".',
      'Puede consultar la relación de municipios o entidades locales menores de Castilla y León excluidos de la aplicación de la presente deducción en el enlace "Municipios y entidades locales menores con beneficios fiscales", seleccionando a continuación la opción "Vigente desde 01/01/2025" y acto seguido el archivo en formato PDF "Relación de municipios o entidades locales menores de Castilla y León que exceden de 10.000 habitantes o que teniendo más de 3.000 habitantes distan menos de 30 kilómetros de la capital de provincia".',
      'Nota: hasta el 31 de diciembre de 2015 se utilizaba el término "municipio". A partir de esa fecha se modifica por el término "población" y desde el 26 de febrero de 2021 se vuelve a sustituir por los términos “municipio” o “entidad local menor”.',
      "El valor de la vivienda, a efectos del impuesto que grave la adquisición, debe ser menor de 150.000 euros.",
      "Que durante los cinco años siguientes a la realización de las actuaciones de rehabilitación la vivienda se encuentre alquilada a personas distintas del cónyuge, ascendientes, descendientes o familiares hasta el tercer grado de parentesco (tanto colaterales por consanguinidad como por afinidad) del propietario de la vivienda.",
      "Que, si durante los cinco años previstos en la letra anterior, se produjeran periodos en los que la vivienda no estuviera efectivamente alquilada, la vivienda se encuentre ofertada para el alquiler de acuerdo con los requisitos que se establezcan mediante orden de la consejería competente en materia de hacienda.",
      "Con efectos a partir del 12 de julio de 2019, la Orden EYH/668/2019, de 4 de julio (BOCyL del 11), determina cuándo una vivienda rehabilitada en una población rural se encuentra ofertada para el alquiler, debiendo reunir los siguientes requisitos:",
      "1º. Los contribuyentes interesados en aplicar esta deducción deben tener el inmueble efectivamente alquilado u ofertado para su alquiler.",
      "2º. Tendrán la condición de inmuebles ofertados para el alquiler aquellos cuyo arrendamiento se anuncie o publicite a través de uno o varios de los siguientes medios:",
      "Mediante carteles en el propio inmueble objeto del arrendamiento. a.",
      "A través de diferentes medios publicitarios, incluidos los portales específicos de Internet. b.",
      "A través de agencias inmobiliarias, incluyendo también los anuncios que estas puedan incorporar en sus propios portales inmobiliarios. c.",
      "A través de agentes inmobiliarios. d.",
      "3º. Los inmuebles ofertados para el alquiler no podrán estar efectivamente ocupados durante el período de tiempo en que estén ofertados para el alquiler. Los consumos de suministros asociados al uso de la vivienda, tales como electricidad, agua, gas y/o teléfono, deben evidenciar que la vivienda no se encuentra ocupada durante este periodo de tiempo.",
      "Que el importe del alquiler mensual no supere los 300 euros. El importe del alquiler mensual será la renta que libremente estipulen las partes, y por los conceptos que se pacten.",
      "Si en el contrato no se hace estipulación en contra, los gastos generales de la vivienda, tales como IBI, tasas municipales, gastos de comunidad, etc., correrán a cargo del arrendador, de acuerdo a la normativa civil que regula la materia; si en el contrato de alquiler se pacta la repercusión de esos gastos, serán por cuenta del arrendatario y formarán parte del importe del alquiler.",
      "Que la fianza legal arrendaticia se encuentre depositada conforme lo establecido en la normativa aplicable. d.",
      "Cuando en periodos impositivos posteriores al de su aplicación se pierda el derecho, en todo o en parte, a las deducciones practicadas, el contribuyente estará obligado a sumar a la cuota líquida autonómica devengada en el ejercicio en que se hayan incumplido los requisitos de la deducción las cantidades indebidamente deducidas, más los intereses de demora a los",
      "que se refiere el artículo 26.6 de la LGT.",
      "En relación a la LGT véase la Ley 58/2003, de 17 de diciembre, General Tributaria.",
    ],
    limites: [
      "El 15 por 100 de las cantidades invertidas en actuaciones de rehabilitación de viviendas.",
      "La base de esta deducción estará constituida por las cantidades realmente satisfechas por el contribuyente para la realización de las actuaciones de rehabilitación, con el límite máximo de 20.000 euros, tanto en tributación individual como en conjunta.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_fomento_emprendimiento",
      nombreCatalogadoDesdeCodigo("cyl_fomento_emprendimiento"),
      categoriaCatalogadaDesdeCodigo("cyl_fomento_emprendimiento"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [305, 306, 307],
      [
        "cyl_fomento_emprendimiento:importe",
        "cyl_fomento_emprendimiento:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 8. Deducción para el fomento de emprendimiento.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Para la aplicación de la deducción deben cumplirse los siguientes requisitos y condiciones:",
      "Destino de la inversión: adquisición de acciones o participaciones como consecuencia de acuerdos de constitución de sociedades o de ampliación del capital en las siguientes sociedades:",
      "- Sociedades anónimas, limitadas o laborales cuando la sociedad destine la financiación recibida a proyectos de inversión realizados en el territorio de Castilla y León.",
      "- Sociedades cuyo único objeto social sea la aportación de capital a sociedades anónimas, limitadas o laborales cuyo domicilio social y fiscal se encuentre en Castilla y León, siempre que se cumplan las siguientes condiciones:",
      "Que la sociedad cuyas acciones y participaciones se adquieran utilice en el plazo de seis meses la financiación recibida para aportar capital a una sociedad anónima, limitada o laboral cuyo domicilio social y fiscal se encuentre en Castilla y León.",
      "A estos efectos, los porcentajes del 0,5 por 100 mínimo y del 45 por 100 máximo del capital de la sociedad que se exige para aplicar la deducción se computarán respecto del conjunto de la aportación de capital.",
      "Que la sociedad anónima, limitada o laboral cuyas acciones y participaciones se adquieran cumpla el requisito de generación de empleo que se expone más adelante y no reduzca su plantilla de trabajadores en Castilla y León.",
      "Localización del domicilio social y fiscal: las sociedades anónimas, limitadas o laborales deben tener el domicilio social y fiscal en la Comunidad de Castilla y León.",
      "Porcentaje de capital adquirido: solo darán derecho a aplicarse esta deducción las adquisiciones de acciones o participaciones por importe mínimo del 0,5 por 100 y máximo del 45 por 100 del capital de la sociedad, que se mantengan en el patrimonio del adquirente al menos tres años.",
      "Creación de empleo: las sociedades respecto de las que se adquieran acciones o participaciones deben incrementar en el año en que se realice la inversión o en el ejercicio siguiente y respecto del año anterior:",
      "Su plantilla global de trabajadores, en términos de personas/año regulados en la normativa laboral, y mantener esta plantilla al menos tres años, y/o",
      "El número de contratos suscritos con trabajadores autónomos económicamente dependientes de la sociedad, y mantener estos contratos al menos tres años, y/o",
      "El número de personas que se incorporen al régimen de trabajadores por cuenta propia que tengan el carácter de familiares colaboradores de titulares de acciones o participaciones, y mantener estas altas al menos tres años.",
      "Inversión máxima: la inversión máxima del proyecto que es computable para la aplicación de la deducción será la que resulte de sumar los siguientes importes:",
      "100.000 euros por cada incremento de una persona/año en la plantilla.",
      "50.000 euros por cada contrato con trabajadores autónomos económicamente dependientes de la sociedad.",
      "50.000 euros por cada alta de trabajadores por cuenta propia que tengan el carácter de familiares colaboradores.",
      "El concepto de familiar colaborador es el recogido en el artículo 35 de la Ley 20/2007, de 11 de julio, del Estatuto del trabajo autónomo, o norma que lo sustituya.",
      "Requisitos formales: para la práctica de esta deducción será necesario obtener una certificación expedida por la entidad cuyas acciones o participaciones se hayan adquirido en la que se recoja el cumplimiento, en el periodo impositivo en el que se produjo la adquisición, de los requisitos relativos al destino de la inversión y, en su caso, cumplimiento de las condiciones específicas, a la localización del domicilio social y fiscal, al porcentaje de capital adquirido y finalmente al requisito de creación de empleo.",
      "Cuando en periodos impositivos posteriores al de su aplicación se pierda el derecho, en todo o en parte, a las deducciones practicadas, el contribuyente estará obligado a sumar a la cuota líquida autonómica devengada en el ejercicio en que se hayan incumplido los requisitos de la deducción las cantidades indebidamente deducidas, más los intereses de demora a los que se refiere el artículo 26.6 de la LGT.",
      "En relación a la LGT véase la Ley 58/2003, de 17 de diciembre, General Tributaria.",
      'Importante: una vez introducida por los contribuyentes con derecho a la deducción la información necesaria para su cálculo, será automáticamente trasladada al apartado "Información adicional a la deducción autonómica por inversión en la adquisición de acciones y participaciones sociales en entidades nuevas o de reciente creación de Andalucía, Aragón, Principado de Asturias, Illes Balears, Canarias, Cantabria, Castilla y León, Castilla-La Mancha, Cataluña, Extremadura, Galicia, Madrid, Murcia y Comunitat Valenciana" del Anexo B.11 de la declaración.',
    ],
    limites: [
      "El 20 por 100 de las cantidades invertidas durante el ejercicio en la adquisición de acciones o participaciones como consecuencia de acuerdos de constitución de sociedades o de ampliación del capital en las sociedades mercantiles que más adelante se detallan.",
      "El importe máximo de deducción será de 10.000 euros, tanto en tributación individual como en conjunta.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_recuperacion_patrimonio_historico_cultural_natural",
      nombreCatalogadoDesdeCodigo(
        "cyl_recuperacion_patrimonio_historico_cultural_natural"
      ),
      categoriaCatalogadaDesdeCodigo(
        "cyl_recuperacion_patrimonio_historico_cultural_natural"
      ),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [307, 308],
      [
        "cyl_recuperacion_patrimonio_historico_cultural_natural:importe",
        "cyl_recuperacion_patrimonio_historico_cultural_natural:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9. Deducciones para la recuperación del patrimonio cultural y natural, por donaciones a fundaciones y para el fomento de la investigación, el desarrollo y la innovación y para el fomento de la movilidad sostenible.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "a. Las cantidades destinadas por los titulares de bienes inmuebles ubicados en el territorio de Castilla y León a la restauración, rehabilitación o reparación de los mismos, siempre que concurran las siguientes condiciones:",
    ],
    limites: [
      "El 15 por 100 de las cantidades invertidas con las siguientes finalidades:",
      "a. Las cantidades destinadas por los titulares de bienes inmuebles ubicados en el territorio de Castilla y León a la restauración, rehabilitación o reparación de los mismos, siempre que concurran las siguientes condiciones:",
      "Que dichos bienes estén inscritos en el Registro General de Bienes de Interés Cultural o afectados por la declaración de Bien de Interés Cultural, o inventariados de acuerdo con la Ley de Patrimonio Cultural de Castilla y León, siendo necesario, en este caso, que los inmuebles reúnan las condiciones determinadas en el artículo 61 del Real Decreto 111/1986, de 10 de enero, de desarrollo parcial de la Ley de Patrimonio Histórico Español o las determinadas en la Ley de Patrimonio Cultural de Castilla y León.",
      "Que las obras de restauración, rehabilitación o reparación hayan sido autorizadas por el órgano competente de la Comunidad Autónoma, de la Administración del Estado o, en su caso, por el Ayuntamiento correspondiente.",
      "b. Las cantidades destinadas por los titulares de bienes naturales ubicados en Espacios Naturales y lugares integrados en la Red Natura 2000 sitos en el territorio de Castilla y León, siempre que estas actuaciones hayan sido autorizadas e informadas favorablemente por el órgano competente de la Comunidad Autónoma.",
      "Para aplicar esta deducción la base imponible total (casillas [0435] y [0460] de la declaración) menos el mínimo personal y familiar (casilla [0520] de la declaración) no puede superar las siguientes cantidades:",
      "- 18.900 euros en tributación individual.",
      "- 31.500 euros en tributación conjunta.",
      "La suma de las bases de las tres deducciones autonómicas no podrá exceder del 10 por 100 de la suma de la base liquidable general y de la base liquidable del ahorro del contribuyente o de la unidad familiar en el caso de declaración conjunta. Dicho importe es el resultado de sumar las casillas [0500] y [0510] de la declaración.",
      "Este límite actúa de forma separada e independiente del límite del 10 por 100 aplicable a las mismas deducciones generales por donativos y otras aportaciones, contemplado en la normativa estatal del IRPF.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_donaciones_fundaciones_patrimonio",
      nombreCatalogadoDesdeCodigo("cyl_donaciones_fundaciones_patrimonio"),
      categoriaCatalogadaDesdeCodigo("cyl_donaciones_fundaciones_patrimonio"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [308, 309, 310],
      [
        "cyl_donaciones_fundaciones_patrimonio:importe",
        "cyl_donaciones_fundaciones_patrimonio:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9. Deducciones para la recuperación del patrimonio cultural y natural, por donaciones a fundaciones y para el fomento de la investigación, el desarrollo y la innovación y para el fomento de la movilidad sostenible.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "a. Rehabilitación o conservación de bienes que se encuentren en el territorio de Castilla y León, que formen parte del Patrimonio Histórico Español o del Patrimonio Cultural de Castilla y León y que estén inscritos en el Registro General de Bienes de Interés Cultural o incluidos en el Inventario General a que se refiere la Ley 16/1985, de 25",
    ],
    limites: [
      "El 15 por 100 de las cantidades donadas con las siguientes finalidades:",
      "a. Rehabilitación o conservación de bienes que se encuentren en el territorio de Castilla y León, que formen parte del Patrimonio Histórico Español o del Patrimonio Cultural de Castilla y León y que estén inscritos en el Registro General de Bienes de Interés Cultural o incluidos en el Inventario General a que se refiere la Ley 16/1985, de 25",
      "de junio, del Patrimonio Histórico Español (BOE de 29 de junio), o en los registros o inventarios equivalentes previstos en la Ley 12/2002, de 11 de julio, de Patrimonio Cultural de Castilla y León, cuando se realicen a favor de las siguientes entidades:",
      "Las Administraciones Públicas, así como las Entidades e Instituciones dependientes de las mismas.",
      "La Iglesia Católica y las iglesias, confesiones o comunidades religiosas que tengan suscritos acuerdos de cooperación con el Estado español.",
      "Las fundaciones o asociaciones que, reuniendo los requisitos establecidos en el Título II de la Ley 49/2002, de 23 de diciembre, de régimen fiscal de las entidades sin fines lucrativos y de los incentivos fiscales al mecenazgo (BOE de 24 de diciembre), incluyan entre sus fines específicos la reparación, conservación o restauración del Patrimonio Histórico.",
      "b. Recuperación, conservación o mejora de espacios naturales y lugares integrados en la Red Natura 2000 ubicados en el territorio de Castilla y León, cuando se realicen a favor de las Administraciones Públicas, así como de las entidades e instituciones dependientes de las mismas.",
      "c. Cantidades donadas a Fundaciones inscritas en el Registro de Fundaciones de Castilla y León, siempre que por razón de sus fines estén clasificadas como culturales, asistenciales o ecológicas.",
      "Para aplicar esta deducción la base imponible total (casillas [0435] y [0460] de la declaración) menos el mínimo personal y familiar (casilla [0520] de la declaración) no puede superar las siguientes cantidades:",
      "- 18.900 euros en tributación individual.",
      "- 31.500 euros en tributación conjunta.",
      "El contribuyente deberá estar en posesión de la justificación documental de la donación realizada con los requisitos establecidos en el artículo 24 de la anteriormente citada Ley 49/2002.",
      "La suma de las bases de las tres deducciones autonómicas no podrá exceder del 10 por 100 de la suma de la base liquidable general y de la base liquidable del ahorro del contribuyente o de la unidad familiar en el caso de declaración conjunta. Dicho importe es el resultado de sumar las casillas [0500] y [0510] de la declaración.",
      "Este límite actúa de forma separada e independiente del límite del 10 por 100, aplicable a las mismas deducciones generales, contemplado en la normativa estatal del IRPF.",
      "Véase la deducción por donativos y otras aportaciones en el Capítulo 16 de la Parte 1 de este Manual.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_donaciones_idi",
      nombreCatalogadoDesdeCodigo("cyl_donaciones_idi"),
      categoriaCatalogadaDesdeCodigo("cyl_donaciones_idi"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [310],
      ["cyl_donaciones_idi:importe", "cyl_donaciones_idi:cumple"],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9. Deducciones para la recuperación del patrimonio cultural y natural, por donaciones a fundaciones y para el fomento de la investigación, el desarrollo y la innovación y para el fomento de la movilidad sostenible.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Fundaciones y otras instituciones cuya actividad principal sea la investigación, el desarrollo y la innovación empresarial para la financiación de proyectos desarrollados en Castilla y León con alguna de estas finalidades.",
    ],
    limites: [
      "El 15 por 100 de las cantidades donadas a favor de las siguientes entidades:",
      "Universidades públicas de la Comunidad de Castilla y León.",
      "Fundaciones y otras instituciones cuya actividad principal sea la investigación, el desarrollo y la innovación empresarial para la financiación de proyectos desarrollados en Castilla y León con alguna de estas finalidades.",
      "La suma de las bases de las tres deducciones autonómicas no podrá exceder del 10 por 100 de la suma de la base liquidable general y de la base liquidable del ahorro del contribuyente o de la unidad familiar en el caso de declaración conjunta. Dicho importe es el resultado de sumar las casillas [0500] y [0510] de la declaración.",
      "Este límite actúa de forma separada e independiente del límite del 10 por 100, aplicable a las mismas deducciones generales por donativos y otras aportaciones, contemplado en la normativa estatal del IRPF.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_movilidad_sostenible",
      nombreCatalogadoDesdeCodigo("cyl_movilidad_sostenible"),
      categoriaCatalogadaDesdeCodigo("cyl_movilidad_sostenible"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [310, 311, 312],
      ["cyl_movilidad_sostenible:importe", "cyl_movilidad_sostenible:cumple"],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Artículo 9. Deducciones para la recuperación del patrimonio cultural y natural, por donaciones a fundaciones y para el fomento de la investigación, el desarrollo y la innovación y para el fomento de la movilidad sostenible.; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "El valor de adquisición del vehículo, impuestos incluidos, no podrá superar los 40.000 euros.",
      "El vehículo adquirido no podrá estar afecto a actividades profesionales o empresariales, cualquiera que sea el titular de estas actividades.",
      "La deducción solamente será de aplicación en el periodo impositivo en el cual se matricule el vehículo cuya adquisición genera el derecho a aplicar la deducción.",
      "El vehículo adquirido deberá mantenerse en el patrimonio del contribuyente al menos durante cuatro años desde su adquisición.",
      "La autonomía en modo eléctrico de los vehículos cuya adquisición genere el derecho a aplicar la deducción se determinará mediante la aplicación del procedimiento WLTP (Worldwide harmonized Light vehicles Test Procedure) o del procedimiento que le sustituya a efectos del Impuesto Especial sobre Determinados Medios de Transporte.",
      "La adquisición por el contribuyente de un vehículo que genere el derecho a la aplicación de la deducción, la fecha de esta adquisición y la cantidad efectivamente satisfecha por el contribuyente se acreditarán mediante factura.",
      "Importante: la deducción solo podrá aplicarse por parte de aquel a cuyo nombre se emita la factura.",
      "Cuando en periodos impositivos posteriores al de su aplicación se pierda el derecho, en todo o en parte, a las deducciones practicadas, el contribuyente estará obligado a sumar a la cuota líquida autonómica devengada en el ejercicio en que se hayan incumplido los requisitos de la deducción las cantidades indebidamente deducidas, más los intereses de demora a los que se refiere el artículo 26.6 de la LGT.",
      "En relación a la LGT véase la Ley 58/2003, de 17 de diciembre, General Tributaria.",
      "Importante: los contribuyentes con derecho a la deducción deberán consignar en la casilla [0943] del Anexo B.4 el número de matrícula del vehículo.",
    ],
    limites: [
      "El 15 por 100 de las cantidades destinadas por el contribuyente a la adquisición de un vehículo turismo nuevo que tenga alguna de las siguientes consideraciones:",
      "Vehículo eléctrico puro.",
      "Vehículo eléctrico con autonomía extendida.",
      "Vehículo híbrido enchufable con autonomía en modo eléctrico de más de 40 kilómetros.",
      "El importe máximo de la deducción será de 4.000 euros por cada vehículo, tanto en tributación individual como en conjunta.",
      "En el supuesto de que el contribuyente tuviera derecho a la deducción por la adquisición de vehículos eléctricos “enchufables” y de pila de combustible y puntos de recarga, prevista en la disposición adicional quincuagésima octava de la Ley del IRPF, la cuantía de la misma minorará el importe máximo de deducción de 4.000 euros establecido en el párrafo anterior.",
      "- Teniendo en cuenta que la deducción autonómica puede aplicarse sobre las cantidades satisfechas para la adquisición de uno o varios vehículos en el mismo periodo impositivo, en caso de que un contribuyente adquiera más de un vehículo eléctrico nuevo, la cuantía de la deducción estatal minorará el importe máximo de deducción de 4.000 euros respecto del vehículo por el que se aplique la deducción estatal y no minorará el importe máximo de deducción de 4.000 euros correspondiente a cada uno de los demás vehículos adquiridos.",
      "- Se debe aplicar la minoración de la deducción estatal sobre el importe de la autonómica con independencia de que la deducción estatal se haya aplicado en otro ejercicio y siempre que se trate del mismo vehículo.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
  {
    ...fichaImplementada(
      { estado: "implementada" },
      "cyl_vivienda_nueva_construccion",
      nombreCatalogadoDesdeCodigo("cyl_vivienda_nueva_construccion"),
      categoriaCatalogadaDesdeCodigo("cyl_vivienda_nueva_construccion"),
      {
        tipo: "mixta",
        descripcion:
          "Consignación de importe externo; no acredita evaluación automática de fórmula, requisitos, límites, prorrateos ni incompatibilidades.",
      },
      [
        "Ficha normalizada desde el Manual Renta 2025 Parte 2, páginas 282 a 313.",
        "El importe consignado requiere comprobación fiscal externa.",
      ],
      [312, 313, 314],
      [
        "cyl_vivienda_nueva_construccion:importe",
        "cyl_vivienda_nueva_construccion:cumple",
      ],
      ["Cumplir los requisitos indicados en la ficha normativa normalizada."]
    ),
    normativa:
      "Disposición transitoria quinta del texto refundido aprobado por Decreto Legislativo 1/2008; Decreto Legislativo 1/2013, de 12 de septiembre; IRPF 2025.",
    requisitos: [
      "Cuando se adquiera una vivienda habitual habiendo disfrutado de esta deducción por la adquisición de otras viviendas habituales anteriores, no se podrá practicar deducción por la adquisición de la nueva en tanto las cantidades invertidas en la misma no superen las invertidas en las anteriores, en la medida en que hubiesen sido objeto de deducción.",
      "Cuando la enajenación de una vivienda habitual hubiera generado una ganancia patrimonial exenta por reinversión, la base de deducción por la adquisición de la nueva se minorará en el importe de la ganancia patrimonial a la que se aplique la exención por reinversión. En este caso, no se podrá practicar deducción por la adquisición de la nueva mientras las cantidades invertidas en la misma no superen tanto el precio de la anterior, en la medida en que haya sido objeto de deducción, como la ganancia patrimonial exenta por reinversión.",
      "La deducción se podrá aplicar en el ejercicio tributario en que se satisfaga la primera cantidad para la adquisición de la vivienda y en los cuatro ejercicios tributarios siguientes.",
    ],
    limites: [
      "El 7,5 por 100 de las cantidades satisfechas durante el ejercicio por la adquisición de la vivienda que vaya a constituir su residencia habitual siempre que se cumplan, simultáneamente, los siguientes requisitos:",
      "Que el contribuyente tenga su residencia habitual en la Comunidad de Castilla y León. a.",
      "Que se trate de su primera vivienda.",
      "Se considera que el contribuyente adquiere primera vivienda cuando no dispusiera, ni hubiera dispuesto, de ningún derecho de plena propiedad igual o superior al 50 por 100 sobre otra vivienda.",
      "Que la vivienda se encuentre situada en Castilla y León. c.",
      "Que se trate de vivienda de nueva construcción.",
      "Tendrán la consideración de viviendas de nueva construcción aquellas situadas en edificaciones para las cuales el visado del proyecto de ejecución de nueva construcción al que se refiere el artículo 2.a) del Real Decreto 1000/2010, de 5 de agosto, sobre visado colegial obligatorio, o norma que le sustituya, se haya obtenido entre el día 1 de",
      "septiembre de 2011 y el día 31 de diciembre de 2012.",
      "La base de esta deducción estará constituida por:",
      "Las cantidades satisfechas para la adquisición, incluidos los gastos originados que hayan corrido a cargo del adquirente.",
      "En el caso de financiación ajena, la amortización, los intereses, el coste de los instrumentos de cobertura del riesgo de tipo de interés variable de los préstamos hipotecarios regulados en el artículo decimonoveno de la Ley 36/2003, de 11 de noviembre, de medidas de reforma económica, o norma que le sustituya, y demás gastos derivados de la misma.",
      "En caso de aplicación de los citados instrumentos de cobertura, los intereses satisfechos por el contribuyente se minorarán en las cantidades obtenidas por la aplicación del citado instrumento.",
      "La base máxima de la deducción será de 9.040 euros anuales.",
      "Importante: la deducción resulta aplicable por las cantidades satisfechas tanto por la adquisición de la vivienda propiamente dicha como por las abonadas mientras la vivienda está en construcción, no siendo aplicable a los supuestos de ampliación o de rehabilitación. Los contribuyentes con derecho a la deducción deberán hacer constar la fecha de visado del proyecto en el Anexo B.4 de la declaración.",
    ],
    prorrateo: [],
    compatibilidades: [],
    incompatibilidades: [],
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const CYL_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...CYL_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  CYL_FAMILIA_NUMEROSA_2025,
  CYL_NACIMIENTO_ADOPCION_HIJOS_2025,
  CYL_ARRENDAMIENTO_VIVIENDA_JOVENES_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
