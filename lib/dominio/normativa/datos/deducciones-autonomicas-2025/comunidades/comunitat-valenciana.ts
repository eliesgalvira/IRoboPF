import type { FichaDeduccionAutonomica } from "../tipos"

// Datos regionales de 2025; el cálculo único corresponde al contrato común.
export const VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 = [
  {
    codigo: "valenciana_nacimiento_adopcion_multiples",
    comunidad: "comunitat-valenciana",
    nombre: "Por nacimiento o adopción múltiples",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.b; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "246 euros por parto múltiple o adopciones constituidas en la misma fecha",
    },
    requisitos: [
      "Dos o más nacimientos/adopciones; mínimo por descendientes",
      "Las dos adopciones deben constituirse en la misma fecha; no basta tener dos hijos. No extender a dos ejercicios posteriores.",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
      "Acogimiento/guarda formal: modalidades de urgencia, temporal o permanente y delegación para adopción mediante resolución motivada; Ley 26/2018 arts. 127/149 y Código Civil arts. 173 bis/176 bis. La mera convivencia no acredita esa medida.",
    ],
    limites: [
      "Base liquidable general más ahorro: 30.000 individual/47.000 conjunta; reducción 27.000/44.000 a razón de 3.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Reparto por partes iguales entre declarantes con derecho; compatible a), c), d)",
    ],
    compatibilidades: ["compatible a), c), d)"],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [534, 535],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_nacimiento_adopcion_acogimiento_discapacidad",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por nacimiento, adopción, acogimiento o  delegación de guarda de personas con  discapacidad",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.c; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "246 euros si es la única persona con discapacidad; 303 si convive con otra que da derecho",
    },
    requisitos: [
      "Discapacidad 65% o intelectual/mental 33%; permanente desde 30-12-2025; acogimiento/guarda desde 01-06-2025; mínimo descendientes",
      "Antes 1junio: nacimiento/adopción y hermano cualificado para 303; desde 1junio incorpora guarda/acogimiento; desde 30diciembre exige permanencia en intelectual/mental y admite 303 con otra persona con derecho.",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
      "Acogimiento/guarda formal: modalidades de urgencia, temporal o permanente y delegación para adopción mediante resolución motivada; Ley 26/2018 arts. 127/149 y Código Civil arts. 173 bis/176 bis. La mera convivencia no acredita esa medida.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: [
      "Base liquidable general más ahorro: 30.000/47.000; reducción 27.000/44.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Prorrateo entre declarantes; compatible a), b), d); reglas DA sexta",
    ],
    compatibilidades: ["compatible a), b), d)"],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [535, 536, 537, 538, 539],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_familia_numerosa_monoparental",
    comunidad: "comunitat-valenciana",
    nombre: "Por familia numerosa o monoparental",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.d; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "330 euros general; 660 especial",
    },
    requisitos: [
      "Título/categoría a devengo; convivencia; Ley 40/2003 y Decreto 19/2018",
      "35.000 individual o 58.000 conjunta: deducción 0; título/condición a devengo y convivencia. General 330, especial 660, prorrateo entre declarantes.",
    ],
    limites: [
      "General: 30.000/47.000, reducción 27.000/44.000; especial: 35.000/58.000, reducción 31.000/54.000 con divisor 4.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: ["Prorrateo entre declarantes; compatible a), b), c)"],
    compatibilidades: ["compatible a), b), c)"],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [539, 540, 541, 542],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_custodia_guarderias_menores_3",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por las cantidades destinadas a la custodia no  ocasional en guarderías y centros de primer ciclo  de educación infantil de hijos e hijas o personas  adoptadas o acogidas o con delegación de guarda  con fines de adopción, menores de tres años",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.e; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "15% de gastos; límite 297 euros por menor",
    },
    requisitos: [
      "Custodia no ocasional en guardería o primer ciclo infantil; menores de 3; actividad laboral/económica; ampliación acogimiento/guarda desde 01-06-2025",
      "15%, límite 297 por menor, días menor 3; actividad remunerada de personas indicadas; DA16 pago; incompatible i). Desde 1junio guarda/acogimiento.",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
      "Acogimiento/guarda formal: modalidades de urgencia, temporal o permanente y delegación para adopción mediante resolución motivada; Ley 26/2018 arts. 127/149 y Código Civil arts. 173 bis/176 bis. La mera convivencia no acredita esa medida.",
    ],
    limites: [
      "Base liquidable general más ahorro 30.000/47.000; reducción 27.000/44.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Límite por días menor de 3 y entre dos declarantes; pago bancario DA16; incompatible i)",
    ],
    compatibilidades: [],
    incompatibilidades: ["incompatible i)"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [542, 543, 544, 545, 546],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_conciliacion_trabajo_familia",
    comunidad: "comunitat-valenciana",
    nombre: "Por conciliación del trabajo con la vida familiar",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.f; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "460 euros por persona de edad mayor de tres y menor de cinco",
    },
    requisitos: [
      "Madre/acogedora con actividad y alta SS/mutualidad; mínimo descendientes; reglas especiales padre y adopción/guarda/acogimiento",
      "460 anual, mayor 3 menor 5, último día mensual y alta cualquier día; madre/acogedora, padre por muerte/custodia exclusiva o acogedor sin acogedora; adopción/guarda cuarto-quinto año; reparto e incompatibilidad i).",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
      "Acogimiento/guarda formal: modalidades de urgencia, temporal o permanente y delegación para adopción mediante resolución motivada; Ley 26/2018 arts. 127/149 y Código Civil arts. 173 bis/176 bis. La mera convivencia no acredita esa medida.",
    ],
    limites: [
      "Base liquidable general más ahorro 30.000/47.000; límite cotizaciones íntegras del intervalo de edad",
    ],
    prorrateo: [
      "Meses con requisitos; último día del mes para edad y cualquier día para alta; reparto si varios declarantes; incompatible i)",
    ],
    compatibilidades: [],
    incompatibilidades: ["incompatible i)"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [546, 547, 548, 549, 550, 551],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_discapacidad_65",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por contribuyentes con discapacidad, en grado  igual o superior al 33 por 100, de edad igual o  superior a 65 años",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.g; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "197 euros por contribuyente",
    },
    requisitos: [
      "Edad al menos 65 y discapacidad al menos 33%; sin prestación exenta por esa discapacidad; situación a devengo",
      "No procede si recibe prestación exenta por esa discapacidad. Edad>=65; situación a devengo, acreditación DA6. No presumir un importe por miembro de conjunta.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: [
      "Base liquidable general más ahorro 30.000/47.000; reducción 27.000/44.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "DA sexta para acreditación y asimilaciones; cuantía no multiplicada por miembros de conjunta",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [551, 552, 553],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_empleados_hogar_cuidado_personas",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por contratar de manera indefinida a personas  afiliadas en el Sistema Especial de Empleados de  Hogar del Régimen General de la Seguridad Social  para el cuidado de personas",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.i; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "50% de cuotas de cotización satisfechas",
    },
    requisitos: [
      "Contrato indefinido sistema especial hogar; menores de 5 o ascendientes cualificados; actividad laboral/económica",
      "Contrato indefinido, cuotas meses con requisitos último día, trabajo remunerado; menores 5, ascendientes 75 o 65 cualificados; topes menores 660/1100 (también monoparental), ascendientes 330/550; incompatibles e/f/h.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: [
      "Menores: límite 660 o 1.100 euros; ascendientes: 330 o 550; base liquidable 30.000/47.000",
    ],
    prorrateo: [
      "Meses con requisitos el último día; reparto del límite entre declarantes; incompatible e), f), h)",
    ],
    compatibilidades: [],
    incompatibilidades: ["incompatible e), f), h)"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [555, 556, 557, 558, 559],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_arrendador_renta_precio_referencia",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por obtención de rentas derivadas de  arrendamientos de vivienda, cuya renta no supere  el precio de referencia de los alquileres privados de  la Comunitat Valenciana (deducción del arrendador)",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.j; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "5% de rendimientos íntegros",
    },
    requisitos: [
      "Contrato de vivienda iniciado en ejercicio; cambio de inquilino si anterior inferior a tres años; precio de referencia; fianza depositada",
      "No 5% del neto: contrato iniciado 2025, cambio inquilino si anterior<3años, precio referencia y depósito fianza antes finperiodo; art 4Dos patrimonio.",
      "Precio de referencia autonómico: renta mensual pactada más gastos y tributos repercutidos según contrato, excluidos suministros; no superior al precio mediano aplicable a la vivienda. Manual AEAT2025 remite al visor GVA. Identificar tabla, zona, período constructivo, superficie y versión; la antigüedad2018 del conjunto oficial no autoriza indexarlo por IPC o IRAV ni sustituirlo por SERPAVI. Depósito a favor Generalitat antes de finalizar el período; plazo administrativo distinto de un mes desde contrato o inicio real anterior, Decreto46/2022 art3.",
      "La metodología CaLab utiliza superficie construida catastral de uso vivienda, excluidos otros usos y comunes. La reserva es el valor de la celda y versión histórica aplicable en2025; una consulta actual no lo acredita.",
    ],
    limites: [
      "Base máxima 3.300 euros; no confundir base con cuota máxima 165",
    ],
    prorrateo: [
      "Requisito patrimonial art.4.Dos; cuantía conjunta conforme regla común; no consta prorrata específica en j)",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
      "renta y repercusiones contractuales desglosadas; fecha de inicio real y formalización; duración y arrendatarios del contrato anterior; justificante del depósito y fecha; evidencia del valor de referencia autonómico con versión, área y parámetros, conservada privadamente",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [559, 560],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_primera_vivienda_menores_35",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por primera adquisición de su vivienda habitual por  contribuyentes de edad igual o inferior a 35 años",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.k; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "5% de cantidades satisfechas excluidos intereses",
    },
    requisitos: [
      "Primera adquisición vivienda habitual; edad igual o inferior a 35 a devengo; incremento patrimonial art.4.Dos",
      "Edad<=35 al devengo, primera adquisición, vivienda habitual estatal, incremento patrimonio y pago DA16; compatible j/l, incompatible m para mismas cantidades.",
    ],
    limites: [
      "Base liquidable general más ahorro 30.000/47.000; no aplicar automáticamente reducción del art.4.Cinco a la base de esta inversión",
    ],
    prorrateo: [
      "Pago bancario DA16; compatible j), l); incompatible m) para mismas cantidades",
    ],
    compatibilidades: ["compatible j), l)"],
    incompatibilidades: ["incompatible m) para mismas cantidades"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [560, 561, 562],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_vivienda_discapacidad",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por adquisición de vivienda habitual por personas  con discapacidad",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.l; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "5% de cantidades satisfechas excluidos intereses",
    },
    requisitos: [
      "Vivienda habitual; discapacidad 65% o intelectual/mental 33%, permanente desde 30-12-2025; incremento patrimonial",
      "Vivienda habitual estatal y patrimonio; discapacidad 65% o intelectual/mental 33%; desde 30diciembre permanencia. No duplicar con m para mismas cantidades; DA16.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: ["Base liquidable general más ahorro 30.000/47.000"],
    prorrateo: [
      "Pago bancario DA16; compatible j), k); incompatible m) para mismas cantidades",
    ],
    compatibilidades: ["compatible j), k)"],
    incompatibilidades: ["incompatible m) para mismas cantidades"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [562, 563, 564, 565],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_vivienda_ayudas_publicas",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por cantidades destinadas a la adquisición o  rehabilitación de vivienda habitual, procedentes de  ayudas públicas",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.m; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "112 euros o tipo medio general autonómico por ayuda en el supuesto de regeneración previsto",
    },
    requisitos: [
      "Ayuda Generalitat con presupuesto propio o estatal; definición estatal vivienda habitual",
      "Alternativa regeneración: tipo medio general autonómico×ayuda; destino efectivo adquisición/rehabilitación, origen Generalitat y patrimonio; no usar 112 además de alternativa; incompatible k/l mismas cantidades.",
    ],
    limites: [
      "Ayuda efectivamente destinada a adquisición/rehabilitación; patrimonio art.4.Dos",
    ],
    prorrateo: [
      "112 prorrateados por ejercicios de imputación del ingreso; incompatible k), l) para mismas cantidades; DA16",
    ],
    compatibilidades: [],
    incompatibilidades: ["incompatible k), l) para mismas cantidades"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [565, 566],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_arrendamiento_actividad_distinto_municipio",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por arrendamiento de una vivienda, como  consecuencia de la realización de una actividad, por  cuenta propia o ajena, en distinto municipio",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.ñ; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "10% de alquiler; límite 224 euros",
    },
    requisitos: [
      "Actividad en municipio distinto al de residencia anterior; vivienda arrendada a más de 50 km de anterior; alquiler no reembolsado por empleador",
      "Distancia estrictamente>50km (50 no basta), vivienda en CV por trabajo distinto municipio, no reembolso empleador, días contrato; compatible n; DA16; requisito ITP suprimido desde 2019.",
    ],
    limites: [
      "Base liquidable general más ahorro 30.000/47.000 y reducción 27.000/44.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Límite proporcional días de contrato y reparto entre declarantes; compatible n); DA16; suprimido requisito ITP desde 2019",
    ],
    compatibilidades: ["compatible n)"],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [570, 571, 572],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_autoconsumo_renovables",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por cantidades invertidas en instalaciones de  autoconsumo o de generación de energía eléctrica  o térmica a través de fuentes renovables",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.o; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "40% vivienda habitual; 20% segunda residencia",
    },
    requisitos: [
      "Instalaciones en Comunitat, registros/certificación energética y finalidades legales; excluidas obligatorias por CTE",
      "8.800 por vivienda/ejercicio; copropiedad coeficiente; no obligatorias CTE; requisitos técnicos registros, localización CV, justificantes y patrimonio. Arrastre 4años por insuficiencia de cuota, no por cualquier exceso de base.",
      "No se exige titularidad del inmueble. Instalación compartida: coeficiente de participación de la vivienda. Justificantes de gasto y pago; leasing solo coste de adquisición, sin intereses, seguros ni mantenimiento, y ejercicio de opción de compra.",
    ],
    limites: [
      "Base máxima 8.800 euros por vivienda y ejercicio para el conjunto de contribuyentes, distribuida en proporción a las cantidades efectivamente satisfechas; excluir subvenciones. Arrastre durante cuatro ejercicios de la deducción no aplicada por insuficiencia de cuota; el exceso de inversión sobre la base máxima no genera ese arrastre.",
    ],
    prorrateo: [
      "Copropietarios según participación; incremento patrimonial art.4.Dos y pago DA16",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [572, 573, 574, 575, 576],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_donaciones_finalidad_ecologica",
    comunidad: "comunitat-valenciana",
    nombre: "Por donaciones con finalidad ecológica",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 art4.Uno.p; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% primeros 250 euros; 25% resto; primeros 150 si fallecimiento anterior a 01-06-2025",
    },
    requisitos: [
      "Generalitat/entidades locales con finalidad ecológica y entidades no lucrativas cualificadas",
      "20% primeros 250 y 25% resto; tramo 150 antes 1junio. Destinatarios ecológicos enumerados, registros CV, afectación y certificado art 4Tres; DA16. No trasladar tope 30% de q 2/q 3/r/s.",
    ],
    limites: ["Importe donado a entidades legalmente previstas"],
    prorrateo: [
      "Certificación art.4.Tres; pago DA16; no inventar tope general de renta",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "beneficiario y acreditación de su categoría/registro; proyecto o bien y su calificación legal a fecha relevante",
      "objeto, fecha, importe o valoración de la entrega; certificado, aceptación y destino; deducción estatal concurrente",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [576, 577],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_donaciones_bienes_patrimonio_cultural",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por donaciones de bienes integrantes del  Patrimonio Cultural Valenciano",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 art4.Uno.q.1; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% primeros 250 euros; 25% resto; umbral 150 para fallecidos antes de 01-06-2025",
    },
    requisitos: [
      "Inscripción de los bienes en el inventario general del patrimonio cultural valenciano; destinatarios habilitados",
      "Donación pura/simple, bien inventariado y destinatario habilitado Ley 20/2018 art 3; valoración/entrega y certificado. No confundir con gasto propio q 3 ni aplicar por analogía 30% de base.",
      "acreditar inscripción, sección/identificación y acto; donación pura y simple; beneficiario limitado a art3.1.a (fin cultural), b–f y comparables3.2. No trasladar g/h/i de s. Certificado4.Tres.a con número Inventario y valoración/entrega. No imponer declaración interés social: Decreto2/2019 art2.",
    ],
    limites: ["Valor de bienes conforme legislación y reglas de mecenazgo"],
    prorrateo: [
      "Certificación art.4.Tres; valoración y entrega acreditadas; distinguir q.1 de q.2 y q.3",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "bien efectivamente inscrito, sección, identificación y acto de inclusión en Inventario",
      "donatario de art3.1.a con fin cultural, b–f o comparable3.2; exclusiones3.3; donación pura y simple",
      "valoración, entrega y certificado4.Tres.a con número de Inventario",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [577, 578],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_donativos_conservacion_patrimonio_cultural",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por donativos para la conservación, reparación y  restauración de bienes integrantes del Patrimonio  Cultural Valenciano",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 art4.Uno.q.2; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% primeros 250 euros; 25% resto; umbral 150 para fallecidos antes de 01-06-2025",
    },
    requisitos: [
      "Donación dineraria a entidades previstas para conservación/reparación/restauración de bienes inventariados",
      "Dinero para conservación/reparación/restauración de bienes inventariados; destinatarios q 1, afectación siguiente presupuesto Generalitat, certificado y DA16;30% liquidable.",
      "dinero donado para programa/actuación de conservación, reparación o restauración de bien inscrito. Beneficiarios q1; certificado4.Tres.a y destino; Generalitat/entidad pública cultural afectación presupuestaria siguiente ejercicio. Individualizar categoría y acto de intervención cuando proceda; no exigir al donante autorización personal del propietario. No requiere declaración interés social art2 Decreto2/2019.",
    ],
    limites: ["Base no superior al 30% de base liquidable art.4.Dos"],
    prorrateo: [
      "Certificación art.4.Tres; pago bancario DA16; afectación del importe recibido por Generalitat",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "bien inventariado, categoría y actuación concreta de conservación, reparación o restauración",
      "donatario habilitado como en q.1; importe, fecha y pago DA16; certificado4.Tres.a y destino",
      "afectación al siguiente presupuesto cuando corresponda a Generalitat o entidad pública cultural; intervención pertinente sin exigir autorización personal al donante",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [578, 579, 580],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_conservacion_patrimonio_cultural_titulares",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por cantidades destinadas por sus titulares a la  conservación, reparación y restauración de bienes  integrantes del Patrimonio Cultural Valenciano",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 art4.Uno.q.3; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% primeros 250 euros; 25% resto; umbral 150 para fallecidos antes de 01-06-2025",
    },
    requisitos: [
      "Gastos de sus titulares sobre bienes pertenecientes al patrimonio cultural valenciano inscritos en inventario general; destino conservación/reparación/restauración",
      "Titular de bien inventariado; destino conservación/reparación/restauración; no es donación ni corresponde certificado de donatario q 1/q 2. DA16 y 30% liquidable.",
      "gasto propio del titular de bien inscrito; acreditar titularidad, factura/pago, concepto conservación/reparación/restauración y régimen de intervención de su categoría. No donatario, no certificado4.Tres, no declaración interés social. Sustituir entradas genéricas de donación/beneficiario por acto del bien, titularidad, intervención, pagos y ayudas vinculadas sin presumir descuentos no normados.",
    ],
    limites: ["Base no superior al 30% de base liquidable art.4.Dos"],
    prorrateo: [
      "No confundir con donación: gasto del titular; pago bancario DA16",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "titularidad del contribuyente sobre el bien e identificación, sección y acto de inscripción efectiva en el Inventario",
      "categoría del bien y autorización, licencia o régimen de intervención pertinente a conservación, reparación o restauración",
      "facturas, concepto, fechas de ejecución y pagos acreditados por medio admitido DA16; ayudas vinculadas identificadas sin presumir descuentos no normados",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [580, 581],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_donaciones_lengua_valenciana",
    comunidad: "comunitat-valenciana",
    nombre: "Por donaciones destinadas al fomento de la Lengua  Valenciana",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 art4.Uno.r; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20% primeros 250 euros; 25% resto; umbral 150 para fallecidos antes de 01-06-2025",
    },
    requisitos: [
      "Entidades públicas, universidades, enseñanzas artísticas o entidades en censo de fomento valenciano a fin de periodo",
      "Dinero; destinatarios enumerados, censo entidades a último día; afectación presupuestaria cuando Generalitat; certificado art 4Tres y DA16; tramo 150 antes 1junio.",
      "solo dinero para fomento valenciano a los cinco grupos de4.Uno.r; solo grupo5 exige inscripción a último día del período (no siempre31diciembre si fallecimiento). No añadir entidades art3.a/e/g/h/i fuera de lista. Grupos1–4 acreditan categoría legal sin censo. Grupo5 exige acto/certificación oficial de inscripción con fecha efectiva; no sustituir por subvención ni censo catalán. Certificado4.Tres.a y DA16, afectación siguiente presupuesto si Generalitat/entidad pública. La operación del censo en2025 no queda acreditada por el proyecto2021 ni previsión presupuestaria2024.",
    ],
    limites: ["Base no superior al 30% de base liquidable art.4.Dos"],
    prorrateo: [
      "Certificación art.4.Tres; pago bancario DA16; afectación presupuestaria cuando Generalitat",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "grupo legal del donatario: Generalitat/sector instrumental, entidades locales/dependientes, universidades públicas o privadas establecidas en la Comunitat, centros superiores de enseñanzas artísticas o entidades del quinto grupo",
      "solo grupo5: acto o certificación oficial de inscripción efectiva en censo al último día del período, atendiendo a fallecimiento; grupos1–4 acreditan su categoría sin censo",
      "dinero, fecha, pago DA16, destino al fomento del valenciano, certificado4.Tres.a y afectación al siguiente presupuesto cuando proceda",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [581, 582],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo:
      "valenciana_donaciones_cesiones_fines_culturales_cientificos_deportivos",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por donaciones o cesiones de uso o comodatos  para otros fines de carácter cultural, científico o  deportivo no profesional",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 art4.Uno.s; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "25%; primeros 250 al 20% si deducción estatal art.68.3.a; umbral 150 para fallecidos antes de 01-06-2025",
    },
    requisitos: [
      "Proyectos de interés social y beneficiarios Ley 20/2018; deporte no profesional",
      "Interés social y beneficiarios Ley 20/2018 art 3, exclusión q/r; valoración según especie/usufructo/comodato, días y límite mercado; base 30% liquidable, certificaciones diferenciadas art 4Tres y DA16.",
      "art3.1.a–i Ley20/2018 y comparables3.2; exclusiones3.3 y vínculos3.1.h para personas físicas. Art13 consideración legal solo Generalitat/sector instrumental, entidades locales/dependientes, universidades públicas/fundaciones/colegios adscritos, investigación pública. Las universidades privadas admitidas como beneficiarias no adquieren por ello interés social automático. Resto declaración expresa; art16 permite donación anterior posibilitante con declaración posterior, sin retroactividad indiscriminada. Certificados diferenciados4.Tres.a/b, valoración y días. Excluir q/r.",
      "La consideración legal de interés social del art13 requiere comunicación cursada y ausencia de denegación (Decreto2/2019 art19). La reforma procedimental DL14/2025 art80 rige desde30diciembre2025; no se anticipa al resto del año.",
    ],
    limites: [
      "Base con valoración específica donación/usufructo/comodato y límite valor de mercado; base máxima 30% base liquidable",
    ],
    prorrateo: [
      "Comodato/inmueble: regla 4% y días; certificación art.4.Tres; DA16",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "beneficiario art3.1.a–i o comparable3.2, exclusiones3.3 y vínculos de personas físicas art3.1.h",
      "proyecto y vía de interés social: resolución expresa o consideración legal art13 con comunicación cursada y ausencia de denegación; fechas y régimen anterior o desde30diciembre2025",
      "donación, usufructo o comodato, valoración, días, entrega, destino y certificados diferenciados4.Tres.a/b; concurrencia estatal y exclusión q/r",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [582, 583, 584, 585],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_dos_o_mas_descendientes",
    comunidad: "comunitat-valenciana",
    nombre: "Por contribuyentes con dos o más descendientes",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.t; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "10% de cuota íntegra autonómica minorada por deducciones estatales indicadas, excluida esta",
    },
    requisitos: [
      "Al menos dos descendientes con derecho a mínimo; no confundir base imponible agregada con liquidable individual",
      "Agregar contribuyentes con derecho por mismos descendientes, estos y restantes miembros conjunta. Base 30.000,01 excluye. No usar base liquidable individual ni porcentaje de gastos.",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
    ],
    limites: [
      "Suma bases imponibles de contribuyentes con derecho, descendientes y otros miembros conjunta no superior a 30.000 euros",
    ],
    prorrateo: [
      "Tributación individual o conjunta; no sustituir por 10% de gastos",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [587, 588],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_incremento_costes_financiacion_vivienda",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por el incremento de los costes de la financiación  ajena en la inversión de la vivienda habitual",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.u; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "50% de incremento positivo intereses; límite 100 euros",
    },
    requisitos: [
      "Préstamo adquisición/rehabilitación/adaptación vivienda habitual; sin deducción estatal inversión vivienda",
      "Máximo 100, excluida deducción estatal vivienda; préstamo añoanterior usa factor días/360 antes de restar intereses anteriores; definición estatal vivienda, renta 30/47 y reducción aplicable del límite.",
    ],
    limites: ["Base liquidable general más ahorro 30.000/47.000"],
    prorrateo: [
      "Préstamo del año anterior: comparación ajustada mediante días/360; evitar aplicar una diferencia anual simple",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [588, 589, 590],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_material_escolar",
    comunidad: "comunitat-valenciana",
    nombre: "Por cantidades destinadas a la adquisición de  material escolar",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.v; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "110 euros por menor",
    },
    requisitos: [
      "Primaria/ESO/educación especial centro público/concertado; desempleo e inscripción demandante; mínimo descendientes",
      "Primaria/ESO/especial público/concertado al devengo y mínimo descendientes; contribuyente o pareja conviviente demandante desempleado; guarda/acogimiento desde 1junio, días efectivos y suma días guardadores con topeperiodo; reparto, DA16.",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
      "Acogimiento/guarda formal: modalidades de urgencia, temporal o permanente y delegación para adopción mediante resolución motivada; Ley 26/2018 arts. 127/149 y Código Civil arts. 173 bis/176 bis. La mera convivencia no acredita esa medida.",
    ],
    limites: [
      "Base liquidable general más ahorro 30.000/47.000; reducción 27.000/44.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Días desempleo; reparto declarantes; desde 01-06-2025 acogimiento/guarda con días efectivos; DA16",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [590, 591, 592, 593, 594],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_obras_conservacion_mejora_periodo",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por obras de conservación o mejora de la calidad,  sostenibilidad y accesibilidad en la vivienda  habitual, efectuadas en el período",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.w; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "20%; 50% accesibilidad discapacidad al menos 33%",
    },
    requisitos: [
      "Vivienda habitual con propiedad/uso real; obras en planes estatales y normativa autonómica; excluidos conceptos enumerados y subvenciones",
      "Base 5.500 por vivienda, propiedad/uso real, planes vivienda vigentes y normativa autonómica, NIF ejecutor, pago bancario; exclusión subvenciones/renovables y garajes salvo accesibilidad; reparto por titularidad.",
      "Obras ejecutadas desde2017; 50% de accesibilidad cualificada solo desde2022. Pagos2025 no convierten obras2014/2015 en esta letra. Para2025, contrastar carácter subvencionable con RD42/2022 arts110–115 o RD853/2021 programa material pertinente, con reformas y erratas2022. DC09: Orden7diciembre2009 corregida29diciembre, Orden19/2010 y Decreto65/2019 con su transición y reforma DL14/2025 art60 desde30diciembre. DC23 quedó derogada por Ley5/2025 antes de entrar en vigor. No exigir concesión de subvención para acreditar carácter subvencionable.",
    ],
    limites: [
      "Base máxima anual 5.500 euros; base liquidable 30.000/47.000 y reducción 27.000/44.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Base por vivienda y reparto por propiedad; DA16; no duplicar inversiones renovables letra o)",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
      "certificación de fechas y alcance real de ejecución; solicitud de licencia y régimen transitorio; memoria que justifique cada condición técnica y programa, características del edificio, certificados energéticos cuando correspondan, ayudas por concepto y pagos acreditados",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [594, 595, 596, 597, 598, 599],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_obras_conservacion_mejora_2014_2015",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por obras de conservación o mejora de la calidad,  sostenibilidad y accesibilidad en la vivienda  habitual efectuadas en 2014 y 2015",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 DA13; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "10% obras 2014; 25% obras 2015",
    },
    requisitos: [
      "Obras realizadas entre 01-01-2014 y 31-12-2015; pagos actuales conservan régimen propio; requisitos planes vivienda",
      "Obras 2014/2015, vivienda habitual propiedad/uso, plan 2013-2015; baseanual 4.500, acumulada 5.000 por vivienda y porcentaje titularidad. Cero efectivo 25.000/40.000 aunque remisión de acceso 4Cuatro superior. NIF/pago bancario; excluidas subvenciones/renovables/garajes.",
      "Obras2014/2015 pagadas2025 mantienen DA13: RD233/2013 histórico o normativa autonómica de rehabilitación/diseño/calidad, según alternativa que se acredite. No exigir planes2022–2025 ni Decreto65/2019 retroactivamente por fecha de pago. DC09 histórica incorpora errata2009, Orden19/2010 y Decreto184/2013; la sentencia2016 aclarada2017 solo afecta al art22.1 sobre personal de OCAces. Distinguir propiedad y derecho real, pagos y base acumulada por vivienda.",
    ],
    limites: [
      "Base máxima anual 4.500 euros; base acumulada máxima 5.000 por vivienda; reducción propia 23.000-25.000 individual y 37.000-40.000 conjunta, divisores 2.000/3.000; remisión de acceso a art.4.Cuatro",
    ],
    prorrateo: [
      "Reparto por titularidad; no equiparar obras actuales art.4.Uno.w; pagos bancarios y exclusión subvenciones/renovables",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
      "certificación técnica de ejecución2014 o2015, proyecto y solicitud de licencia; justificación de vía estatal histórica o autonómica aplicable; facturas y pagos2025; ayudas, porcentajes de titularidad y base deducida previamente por la vivienda",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [599, 600, 601],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_abonos_culturales",
    comunidad: "comunitat-valenciana",
    nombre: "Por cantidades destinadas a abonos culturales",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.x; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "21% del importe; base máxima 165 euros (cuota máxima 34,65)",
    },
    requisitos: [
      "Abonos de empresas o instituciones adheridas al convenio específico con Culturarts Generalitat sobre Abono Cultural Valenciano",
      "Liquidable estrictamente<50.000; a 50.000 cero. Empresas/instituciones adheridas a convenio específico Culturarts; DA16.165 es base, no deducción.",
      "importe pagado por abono cubierto por convenio específico y adhesión eficaz en fecha relevante. Solicitar convenio/adhesión, fechas y prórroga expresa si venció, modalidad de abono, factura/pago DA16. Ni entrada suelta ni listado promocional2019 prueban2025. Acreditados estos hechos, la regla fiscal general basta:21% de base hasta165, suma liquidables<50000; no inventar reglamento general pendiente ni límite de cuota165. No usar certificado de donatario4.Tres.",
    ],
    limites: ["Suma base liquidable general y ahorro inferior a 50.000 euros"],
    prorrateo: [
      "Pago bancario DA16; no confundir 165 euros de base con límite de cuota",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "convenio específico y adhesión eficaz del emisor en fecha relevante; vigencia y prórroga expresa si venció",
      "modalidad del abono cubierto, factura, importe y fecha del pago admitido DA16; no basta entrada suelta o listado promocional2019",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [601, 602],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_vehiculos_orden_5_2020",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por adquisición de vehículos nuevos  pertenecientes a las categorías incluidas en la  Orden 5/2020, de 8 de junio",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.y; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "10% de cantidades destinadas a un único vehículo nuevo",
    },
    requisitos: [
      "Vehículos categorías Orden 5/2020; no equivale a cualquier vehículo eléctrico",
      "Un vehículo nuevo por contribuyente; factura, categorías Orden 5/2020, máximo subvencionable+10%, excluir ayudas, pago bancario, reparto base mismo vehículo y límite conjunta; tabla exige comprobar características técnicas.",
    ],
    limites: [
      "Base máxima importe subvencionable Orden5/2020 incrementado 10%, excluidas ayudas; liquidable 30.000/47.000",
      "Bases máximas de referencia: bicicleta eléctrica 1.540 euros, kit 660 euros, VMP 495 euros; excluir ayudas públicas. El precio superior al subvencionable no excluye por sí solo la deducción.",
    ],
    prorrateo: [
      "Mismo vehículo: repartir entre contribuyentes con derecho la base máxima. En conjunta el máximo es idéntico al individual y no se multiplica por miembros de la unidad familiar.",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "tipo y prestaciones técnicas del vehículo nuevo; factura, fecha, precio, ayudas, adquirentes y su participación; compra única del ejercicio",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [602, 603, 604, 605, 606],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_inversion_entidades_nuevas_reciente_creacion",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por inversión en adquisición de acciones o  participaciones sociales en entidades nuevas o de  reciente creación",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.z; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30% de la inversión, máximo 6.600 euros; 15% adicional en supuestos cualificados, máximo reforzado 15.000 euros desde el 30 de diciembre de 2025 (9.900 para devengos anteriores). Límites independientes para inversiones distintas.",
    },
    requisitos: [
      "Entidades y requisitos actividad/empleo/participación legales; escritura o certificación cooperativa; mantenimiento tres años",
      "30% general;15% adicional, límite 15.000 desde 30diciembre, independiente de 6.600 si inversiones distintas. No existe tope 30% liquidable en 4Dos para z. Actividad/domicilio 3años, empleo y excepciones, antigüedad ampliaciones 3años antes 30dic y 5/7 después; escritura/certificado; tenencia 3años y arrastre 3; incompatibilidad DANA mismaentidad/ejercicio.",
    ],
    limites: [
      "El artículo 4.Dos no incluye z en el límite del 30% de base liquidable: enumera q.2/q.3/r/s. El artículo 5 DANA tiene su propio límite del 30%. Arrastre de deducción no aplicada por insuficiencia de cuota en los tres ejercicios siguientes.",
    ],
    prorrateo: [
      "Desde 30-12-2025 cambios en z); DA16; incompatible DANA art.5 por misma entidad y ejercicio",
    ],
    compatibilidades: [],
    incompatibilidades: [
      "incompatible DANA art.5 por misma entidad y ejercicio",
    ],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "constitución/ampliación, tipo social, escritura o certificación de cooperativa, fechas e importes suscritos y desembolsados",
      "domicilio social/fiscal y periodos de mantenimiento; actividad y plantilla con jornadas antes y después; ERTE cuando proceda",
      "calificación innovadora/emergente, localización territorial documentada, tenencia de participaciones y deducciones concurrentes por misma entidad/ejercicio",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [606, 607, 608, 609, 610, 611],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_municipio_riesgo_despoblamiento",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por residir habitualmente en un municipio en riesgo  de despoblamiento",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.aa; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "330 euros; incrementos 132 por uno, 198 por dos y 264 por tres o más descendientes",
    },
    requisitos: [
      "Residencia habitual en municipio beneficiario fondo despoblamiento en ejercicio o anterior; art.4.Seis con efectos 01-01-2024",
      "Importe adicional único por número descendientes; reparto solo adicional; excluye mismos descendientes a/b/c. Residencia habitual estatal, municipio beneficiario fondo 2024 o 2025; no imponer renta 4Cuatro.",
    ],
    limites: ["No aplicar límites generales de renta ajenos a aa)"],
    prorrateo: [
      "Prorrateo incremento si varios con derecho; incompatibilidad incrementos con a), b), c) por mismo descendiente",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "municipio de residencia fiscal y pertenencia documental al fondo2024 o2025; descendientes y titulares del incremento sin duplicación con a/b/c",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [611, 612, 613],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_tratamientos_fertilidad",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por las cantidades satisfechas en tratamientos de  fertilidad realizados en clínicas o centros  autorizados",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.ab; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "100 euros",
    },
    requisitos: [
      "Mujeres entre 40 y 45 años; tratamientos en clínica/centro autorizado; cantidades efectivamente satisfechas",
      "100 con reducción 4Cinco y límites 30/47; clínica autorizada; solo mujer tratada 40–45 ambos incluidos a devengo. No aplicar renta 60/78 ni porcentaje de gastos de salud.",
    ],
    limites: [
      "Base liquidable general más ahorro hasta 30.000 individual / 47.000 conjunta. Artículo 4.Cinco: importe íntegro hasta 27.000 / 44.000; multiplicar por (30.000 - base)/3.000 o (47.000 - base)/3.000 en el intervalo. Con 28.500 individual, 100 × 0,5 = 50 euros.",
    ],
    prorrateo: ["No aplicar tasa sobre gasto ni umbral de salud 60.000/78.000"],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "factura y concepto concreto del servicio, pagador/persona beneficiaria, fecha, autorización/registro del prestador y medio de pago; seguros, ayudas y reembolsos",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [613, 614],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_gastos_salud",
    comunidad: "comunitat-valenciana",
    nombre: "Por cantidades satisfechas en determinados gastos  de salud",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.ac; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Enfermedades crónicas/raras y daño cerebral/alzhéimer: hasta 100 o 150 familia numerosa/monoparental; dental/mental 30% máximo150; óptica30% máximo100",
    },
    requisitos: [
      "Factura, acreditación sanitaria, pago bancario; tratamientos no estéticos; óptica ampliada Ley 5/2025",
      "Crónicas/raras y cerebral/alzhéimer 100/150familia; dental/mental 30% máximo 150; óptica 30% máximo 100. Compatibles; familiares con mínimo, reparto base; factura, informe y registro sanitario, DA16; excluye seguros/reembolsos y donativo estatal 68.3. Desde 1enero 2025 renta 60/78 y reducción 54/72 divisor 6000.",
    ],
    limites: [
      "Liquidable 60.000/78.000; reducción límites desde54.000/72.000 divisor6.000 por DL1/2026 efectos2025",
      "Efectos desde 1 de enero de 2025: DL 1/2026 (salud/deporte) y DL 2/2026 (música). Límite íntegro hasta 54.000 individual / 72.000 conjunta; multiplicar por (60.000 - base)/6.000 o (78.000 - base)/6.000 dentro del intervalo; cero en 60.000 / 78.000.",
    ],
    prorrateo: [
      "Conceptos compatibles; gastos cónyuge/descendientes/ascendientes con mínimo; reparto entre declarantes; no subvencionados",
    ],
    compatibilidades: ["Conceptos compatibles"],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
      "factura y concepto concreto del servicio, pagador/persona beneficiaria, fecha, autorización/registro del prestador y medio de pago; seguros, ayudas y reembolsos",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [614, 615, 616],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_fomento_formacion_musical",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por cantidades satisfechas en gastos vinculados  con el fomento y formación musicales",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.ae; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Gastos deducibles hasta150 euros anuales por contribuyente (manual:100%)",
    },
    requisitos: [
      "Conservatorios/escuelas registradas, sociedades federadas, centros oficiales, instrumentos/partituras y conciertos previstos",
      "Hasta 150 por contribuyente; 100% en manual. Conservatorios/escuelas registradas, sociedades federadas, formación centros oficiales, instrumentos/partituras vinculados y conciertos entidades a/b; cónyuge/descendientes con mínimo, reparto base, pago DA16. Efectos 2025 expresos.",
    ],
    limites: [
      "Liquidable60.000/78.000; reducción límite54.000/72.000 divisor6.000",
      "Efectos desde 1 de enero de 2025: DL 1/2026 (salud/deporte) y DL 2/2026 (música). Límite íntegro hasta 54.000 individual / 72.000 conjunta; multiplicar por (60.000 - base)/6.000 o (78.000 - base)/6.000 dentro del intervalo; cero en 60.000 / 78.000.",
    ],
    prorrateo: [
      "DL2/2026 efectos desde01-01-2025; excluir parte subvencionada; reparto gastos familiares y pago bancario",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "factura y concepto concreto del servicio, pagador/persona beneficiaria, fecha, autorización/registro del prestador y medio de pago; seguros, ayudas y reembolsos",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [618, 619, 620],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_ayudas_publicas_erte_covid",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por cantidades procedentes de ayudas públicas  concedidas por la Generalitat en virtud del Decreto  Ley 3/2020, de 10 de abril, a trabajadores y las  trabajadoras afectados por un ERTE y a los que han  reducido la jornada laboral por conciliación familiar  con motivo de la declaración del estado de alarma  por la crisis sanitaria provocada por la Covid-19",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 DA17a; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "Aplicar el tipo medio de gravamen general autonómico multiplicado por la ayuda integrada",
    },
    requisitos: [
      "Trabajadores afectados ERTE o reducción jornada conciliación en marco crisis sanitaria",
      "Ayuda DL3/2020 trabajadores ERTE/reducción jornada conciliación; solo parte efectivamente integrada, no tipo marginal ni estatal.",
    ],
    limites: ["Ayuda del Decreto ley3/2020 integrada en base imponible"],
    prorrateo: [
      "DA17 efectos01-01-2020; no trasladar deducción a ayuda exenta o no integrada",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "acto de concesión o aceptación, régimen y finalidad COVID; importe integrado fiscalmente en2025 o valoración y recepción de la donación según modalidad",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [620, 621],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_donaciones_covid_investigacion",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por donaciones dinerarias dirigidas a financiar  programas de investigación, innovación y  desarrollo científico o tecnológico en el campo del  tratamiento y prevención de las infecciones  producidas por el Covid-19",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 DA17c; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "20% primeros150 euros;25% resto",
    },
    requisitos: [
      "Financiación investigación/innovación/tratamiento/prevención Covid; destinatarios enumerados",
      "20%primeros 150 y 25%resto, investigación Covid, destinatarios enumerados CV y finalidad principal; no aplicar 250 de p–s; DA16.",
    ],
    limites: ["Donaciones dinerarias, no aplicar umbral250 de p)-s)"],
    prorrateo: [
      "Universidades/institutos/centros CV o entidades sin lucro cualificadas; no confundir con donación genérica",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "beneficiario y acreditación de su categoría/registro; proyecto o bien y su calificación legal a fecha relevante",
      "objeto, fecha, importe o valoración de la entrega; certificado, aceptación y destino; deducción estatal concurrente",
      "acto de concesión o aceptación, régimen y finalidad COVID; importe integrado fiscalmente en2025 o valoración y recepción de la donación según modalidad",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [621, 622],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_donaciones_covid_gastos_crisis_sanitaria",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por donaciones para contribuir a la financiación de  los gastos ocasionados por la crisis sanitaria  producida por la Covid-19",
    categoria: "donativos_donaciones",
    normativa:
      "Ley13/1997 DA17d; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "20% primeros150 euros;25% resto",
    },
    requisitos: [
      "Financiación gastos crisis sanitaria Covid; destinatario y aceptación según norma remitida",
      "20/25 tramo 150; dineraria/especie, DL4/2020 art 4 aceptación y destino, valoración si especie; DA16 para dinero. No extender donación genérica.",
    ],
    limites: ["Donaciones dinerarias o en especie conforme DL4/2020 art.4"],
    prorrateo: [
      "No aplicar umbral250 de p)-s); acreditar entrega y valoración de especie",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "beneficiario y acreditación de su categoría/registro; proyecto o bien y su calificación legal a fecha relevante",
      "objeto, fecha, importe o valoración de la entrega; certificado, aceptación y destino; deducción estatal concurrente",
      "acto de concesión o aceptación, régimen y finalidad COVID; importe integrado fiscalmente en2025 o valoración y recepción de la donación según modalidad",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [622, 623],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_dana_danos_materiales_vivienda_habitual",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por destinar cantidades a paliar los daños materiales sobre la \nvivienda habitual derivados del temporal",
    categoria: "vivienda_habitual",
    normativa:
      "DL12/2024 art4; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "100% gastos reparación no cubiertos; máximo2.000 euros",
    },
    requisitos: [
      "Daño directo temporal, vivienda habitual en municipios anexo acuerdo 04-11-2024; descontar seguros y ayudas; excluir enseres/actividad",
      "100% gasto no cubierto, máximo 2.000; renta 45/60, reducción 40/55 divisor 5000; vivienda habitual dañada directamente en municipio anexo; excluye enseres/actividad; reparto ayudas/límite, pago bancario, arrastre 4. Periodos 2024/2025.",
    ],
    limites: [
      "Liquidable45.000/60.000; reducción límite desde40.000/55.000 divisor5.000",
    ],
    prorrateo: [
      "Solo2024-2025; reparto límite declarantes, ayudas unidad convivencia; pago bancario; arrastre cuatro ejercicios",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
      "ámbito territorial fiscal, incluidos subámbitos, y daño directo por el temporal; seguros y ayudas imputados a unidad de convivencia",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [623, 624, 625, 626],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_dana_aportaciones_fondos_propios_entidades",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por aportaciones a los fondos propios de entidades que \ndesarrollen actividades económicas",
    categoria: "otros_conceptos",
    normativa:
      "DL12/2024 art5; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion: "45% aportaciones; máximo9.900 euros",
    },
    requisitos: [
      "Domicilio social/fiscal zona afectada, ERTE entidades preexistentes, actividad y empleo tres años; escritura/certificado cooperativa",
      "45%,máximo 9.900 y base 30% liquidable expresamente propia;13nov 2024–31dic 2025, domicilio social/fiscal zona, ERTE preexistentes, actividad/empleo 3años, escritura/certificado, tenencia 3años, arrastre 3; incompatibilidad z mismaentidad/ejercicio/contribuyente.",
    ],
    limites: ["Base máxima30% de liquidable"],
    prorrateo: [
      "Inversiones13-11-2024 a31-12-2025; mantener participaciones tres años; arrastre tres; incompatible z) misma entidad/ejercicio",
    ],
    compatibilidades: [],
    incompatibilidades: ["incompatible z) misma entidad/ejercicio"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "constitución/ampliación, tipo social, escritura o certificación de cooperativa, fechas e importes suscritos y desembolsados",
      "domicilio social/fiscal y periodos de mantenimiento; actividad y plantilla con jornadas antes y después; ERTE cuando proceda",
      "calificación innovadora/emergente, localización territorial documentada, tenencia de participaciones y deducciones concurrentes por misma entidad/ejercicio",
      "ámbito territorial fiscal, incluidos subámbitos, y daño directo por el temporal; seguros y ayudas imputados a unidad de convivencia",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [626, 627, 628],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_nacimiento_adopcion_guarda_acogimiento",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por nacimiento, adopción, delegación de guarda  con fines de adopción o acogimiento familiar",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.a; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "600 euros primero, 750 segundo, 900 tercero y sucesivos para hechos de 2025; régimen de 300 euros para devengos anteriores al 1 de junio de 2025 y nacidos/adoptados antes de 2025 con derecho previo.",
    },
    requisitos: [
      "Mínimo descendientes; nacimiento/adopción también dos ejercicios posteriores; desde 01-06-2025 acogimiento/guarda",
      "600/750/900 por orden individual para hechos 2025; régimen 300 fallecidos antes 1junio y nacidos/adoptados anteriores con derecho previo. Mínimo descendientes, renta 30/47 reducción 27/44, prorrateo días y declarantes, dos años posteriores solo nacimiento/adopción; compatible b/c/d, no adicional aa mismo descendiente.",
      "Mínimo por descendientes (arts. 58 y 61 LIRPF): menor de 25 años o discapacidad sin límite de edad, convivencia o dependencia en términos legales, rentas anuales no exentas hasta 8.000 euros y sin declaración propia con rentas superiores a 1.800 euros. Situación a devengo y reparto entre titulares conforme al mínimo.",
      "Acogimiento/guarda formal: modalidades de urgencia, temporal o permanente y delegación para adopción mediante resolución motivada; Ley 26/2018 arts. 127/149 y Código Civil arts. 173 bis/176 bis. La mera convivencia no acredita esa medida.",
    ],
    limites: [
      "Liquidable30.000/47.000; reducción27.000/44.000 divisor3.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Nacimiento/adopción: también dos ejercicios posteriores. Acogimiento/guarda: prorrateo por días, sin extensión posterior. Para importes segundo/tercero, las personas computadas deben permanecer más de 183 días (183 no basta); no contar adoptados en el mismo ejercicio. Reparto igual entre declarantes con derecho.",
    ],
    compatibilidades: ["Compatible con b), c), d)"],
    incompatibilidades: [
      "incompatible con el incremento aa) por el mismo descendiente o asimilado.",
    ],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "fechas de nacimiento/adopción y resoluciones de guarda/acogimiento; intervalos efectivos y número de orden por contribuyente",
      "derecho al mínimo por persona: edad, convivencia/dependencia, discapacidad, rentas no exentas y declaración propia",
      "declarantes con derecho y categoría familiar acreditada a devengo",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [529, 530, 531, 532, 533, 534],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_ascendientes_mayores_discapacidad",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por ascendientes mayores de 75 años o mayores de  65 años con discapacidad",
    categoria: "circunstancias_personales_familiares",
    normativa:
      "Ley13/1997 art4.Uno.h; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "importe_fijo",
      euros: "197",
      por: "ascendiente que cumpla requisitos",
    },
    requisitos: [
      "Mayor 75 o mayor 65 con discapacidad 65% o intelectual/mental 33%; rentas no exentas hasta 8.000; declaración hasta 1.800; convivencia mitad periodo",
      "197 por ascendiente:>75 o>65 con discapacidad 65% o intelectual/mental 33% permanente desde 30dic; renta noexenta<=8.000, si declara<=1.800; convivencia mitadperiodo incluso centro especializado dependiente; parentesco próximo salvo excepción; incompatible i y DA6.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: [
      "Liquidable30.000/47.000; reducción27.000/44.000 divisor3.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Parentesco más próximo salvo excepción renta; reparto entre declarantes; DAsexta; incompatible i)",
    ],
    compatibilidades: [],
    incompatibilidades: ["incompatible i)"],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [553, 554, 555],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_arrendamiento_cesion_uso_vivienda",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por arrendamiento o pago por la cesión en uso de  la vivienda habitual",
    categoria: "vivienda_habitual",
    normativa:
      "Ley13/1997 art4.Uno.n; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "20%máximo800;25%máximo950 una condición;30%máximo1.100 dos o más",
    },
    requisitos: [
      "Edad<=35/discapacidad cualificada/violencia género; contrato posterior 23-04-1998 duración>=1año; vivienda habitual; otra vivienda<50km excluye salvo excepciones",
      "20/25/30%, límites 800/950/1100; condiciones<=35/discapacidad/violencia género; contrato>23abril 1998 y>=1año, vivienda CV, restricciones otra vivienda<50km salvo excepciones, sin deducción inversión; días vigencia/circunstancias y reparto gananciales; DA16. Desde 30dic cesiónuso/servicios con recibo separado y errata compatible ñ.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: [
      "Liquidable30.000/47.000; reducción límite27.000/44.000 divisor3.000",
      "Cuando el apartado remite al artículo 4.Cinco, el importe o límite sometido a reducción se multiplica por (30.000 - base liquidable)/3.000 en individual o (47.000 - base liquidable)/3.000 en conjunta dentro del intervalo 27.000–30.000 / 44.000–47.000; en el extremo superior resulta cero. No se reduce automáticamente la inversión de k) o l).",
    ],
    prorrateo: [
      "Días vigencia/circunstancias y reparto límite declarantes; sin deducción inversión vivienda; compatible ñ); DA16",
    ],
    compatibilidades: ["compatible ñ)"],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "situación y titularidad/derecho de uso de vivienda, residencia efectiva, adquisición, ocupación y excepciones justificadas",
      "gastos fechados por concepto, pagador, medio de pago, ayudas, reembolsos y porcentaje de participación",
      "contrato, fechas y distancias cuando sean requisitos; identificación del ejecutor y calificación técnica de obra/instalación",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [566, 567, 568, 569, 570],
    },
    estado: "normalizada_pendiente_tests",
  },
  {
    codigo: "valenciana_deporte_actividades_saludables",
    comunidad: "comunitat-valenciana",
    nombre:
      "Por cantidades satisfechas en gastos asociados a  la práctica del deporte y actividades saludables",
    categoria: "otros_conceptos",
    normativa:
      "Ley13/1997 art4.Uno.ad; ejercicio 2025, con los efectos temporales descritos",
    cuantia: {
      tipo: "mixta",
      descripcion:
        "30%;50%mayor65 o discapacidad33%;100%mayor75 o discapacidad65%; máximo150",
    },
    requisitos: [
      "Gimnasios/entidades deportivas, equipo federado obligatorio, entrenadores y profesionales sanitarios enumerados; factura y pago bancario",
      "30/50/100 según edad estrictamente>65/>75 o discapacidad>=33/>=65;150 máximo por contribuyente; familia con mínimo, reparto base, actividades enumeradas, factura yDA16; renta 60/78 reducción 54/72 divisor 6000 desde 1enero 2025.",
      "DA sexta: certificado del órgano competente. Desde 30 de diciembre, discapacidad intelectual o mental permanente acreditada; pensiones cualificadas asimiladas al grado 33%, y curatela con representación plena o incapacidad declarada judicialmente a los beneficios de 65% o intelectual/mental permanente de 33%. No anticipar estas novedades a devengos anteriores.",
    ],
    limites: [
      "Liquidable60.000/78.000; reducción límite54.000/72.000 divisor6.000 por DL1/2026 efectos2025",
      "Efectos desde 1 de enero de 2025: DL 1/2026 (salud/deporte) y DL 2/2026 (música). Límite íntegro hasta 54.000 individual / 72.000 conjunta; multiplicar por (60.000 - base)/6.000 o (78.000 - base)/6.000 dentro del intervalo; cero en 60.000 / 78.000.",
    ],
    prorrateo: [
      "Gastos propios/cónyuge/familia con mínimo; reparto entre declarantes; acreditación discapacidad DAsexta",
    ],
    compatibilidades: [],
    incompatibilidades: [],
    entradaNecesaria: [
      "fecha de devengo y modalidad individual/conjunta",
      "base liquidable general y del ahorro separadas",
      "identidad sintética del contribuyente y de las personas que generan derecho",
      "cuota íntegra autonómica disponible antes de esta deducción",
      "valores y pruebas de origen por ejercicio, sin importe libre ni booleano global de cumplimiento",
      "edad a devengo, certificado y grado/tipo de discapacidad, permanencia y fecha; pensión cualificada o resolución judicial según supuesto",
      "intervalos de convivencia, parentesco, rentas y presentación de declaración del familiar",
      "factura y concepto concreto del servicio, pagador/persona beneficiaria, fecha, autorización/registro del prestador y medio de pago; seguros, ayudas y reembolsos",
    ],
    fuenteManual: {
      documento: "ManualRenta2025Parte2",
      paginas: [616, 617, 618],
    },
    estado: "normalizada_pendiente_tests",
  },
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
