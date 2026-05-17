import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada } from "../helpers"

export const ASTURIAS_ACOGIMIENTO_MAYORES_65_2025 = fichaImplementada(
  { estado: "implementada" },
  "asturias_acogimiento_no_remunerado_mayores_65",
  "Por acogimiento no remunerado de mayores de 65 años",
  "circunstancias_personales_familiares",
  {
    tipo: "importe_fijo",
    euros: "500",
    por: "persona mayor de 65 años acogida",
  },
  [
    "500 euros por persona acogida",
    "Base imponible general + ahorro: máximo 26.000 euros individual y 37.000 conjunta",
  ],
  [89, 90]
)

export const ASTURIAS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
  { estado: "implementada" },
  "asturias_arrendamiento_vivienda_habitual",
  "Por arrendamiento de vivienda habitual",
  "vivienda_habitual",
  {
    tipo: "mixta",
    descripcion:
      "10% con límite 500 euros; 30% con límite 1.500 euros para colectivos protegidos o concejos en riesgo",
  },
  [
    "General: 10%, máximo 500 euros",
    "Jóvenes hasta 35, familias numerosas, monoparentales, víctimas de violencia de género o despoblamiento: 30%, máximo 1.500 euros",
    "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta",
  ],
  [93, 94]
)

export const ASTURIAS_FAMILIAS_NUMEROSAS_2025 = fichaImplementada(
  { estado: "implementada" },
  "asturias_familias_numerosas",
  "Para familias numerosas",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "1.000 euros categoría general; 2.000 euros categoría especial",
  },
  ["1.000 euros para categoría general", "2.000 euros para categoría especial"],
  [96, 97]
)

export const ASTURIAS_CENTROS_CERO_TRES_2025 = fichaImplementada(
  { estado: "implementada" },
  "asturias_centros_cero_tres",
  "Por gastos de descendientes en centros de cero a tres años",
  "circunstancias_personales_familiares",
  {
    tipo: "mixta",
    descripcion:
      "15% con límite 500 euros por descendiente; 30% con límite 1.000 euros en concejos en riesgo",
  },
  [
    "General: 15%, máximo 500 euros por descendiente",
    "Despoblamiento: 30%, máximo 1.000 euros por descendiente",
    "General: base imponible general + ahorro máximo 26.000 euros individual y 37.000 conjunta",
    "Despoblamiento: máximo 35.000 euros individual y 45.000 conjunta",
  ],
  [100, 101, 102]
)

export const ASTURIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vivienda_discapacidad",
    "Por adquisición o adecuación de la vivienda habitual para contribuyentes con discapacidad",
    "vivienda_habitual",
    {
      tipo: "porcentaje",
      porcentaje: "3",
      base: "cantidades satisfechas por adquisición o adecuación de vivienda habitual por discapacidad",
      limiteMaximoEuros: "450",
    },
    [
      "Fórmula: min(3% de cantidades satisfechas, 450 euros), por base máxima de 15.000 euros.",
      "Discapacidad igual o superior al 65% del contribuyente, cónyuge, ascendientes o descendientes.",
      "Cónyuge, ascendientes o descendientes deben convivir más de 183 días al año y no tener rentas anuales, incluidas exentas, superiores a 35.000 euros.",
      "La adecuación debe ser estrictamente necesaria para accesibilidad y comunicación sensorial, acreditada por resolución o certificado competente.",
      "Si varios contribuyentes tienen derecho por los mismos ascendientes o descendientes, se prorratea por partes iguales; si hay distinto parentesco, corresponde al grado más cercano.",
      "Si el contribuyente con discapacidad aplica la deducción, los familiares convivientes no pueden aplicarla.",
    ],
    [91, 92],
    [
      "asturias_vivienda_discapacidad:base",
      "asturias_vivienda_discapacidad:cumple",
    ],
    ["Vivienda habitual en el Principado de Asturias."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vivienda_protegida",
    "Por inversión en vivienda habitual que tenga la consideración de protegida",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "100% del gasto efectivo por adquisición o rehabilitación de vivienda habitual protegida; límite 5.000 euros en el ejercicio de adquisición/rehabilitación y 1.000 euros en ejercicios sucesivos o cantidades pendientes.",
    },
    [
      "Fórmula ejercicio adquisición/rehabilitación: min(100% gasto efectivo, 5.000 euros).",
      "Fórmula ejercicios sucesivos: min(100% gasto efectivo o pendiente, 1.000 euros).",
      "Si no hay cuota íntegra autonómica suficiente, el importe no deducido puede aplicarse en los tres períodos impositivos siguientes, respetando el límite de 1.000 euros.",
      "La vivienda debe tener calificación de protegida conforme a normativa estatal o autonómica.",
      "Si varios contribuyentes tienen derecho sobre los mismos bienes, el importe máximo se prorratea por partes iguales.",
    ],
    [92, 93],
    [
      "asturias_vivienda_protegida:importe",
      "asturias_vivienda_protegida:cumple",
    ],
    ["Gastos acreditados mediante factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_adopcion_internacional",
    "Por adopción internacional de menores",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "1500",
      por: "menor adoptado internacionalmente",
    },
    [
      "Fórmula: 1.500 euros por hijo adoptado internacionalmente.",
      "El menor debe convivir con el declarante.",
      "La adopción se entiende realizada en el ejercicio de inscripción en el Registro Civil español, o de resolución judicial/administrativa si la inscripción no es necesaria.",
      "Si existe más de un contribuyente con derecho y presentan individual, se prorratea por partes iguales.",
    ],
    [95, 96],
    [
      "asturias_adopcion_internacional:unidades",
      "asturias_adopcion_internacional:cumple",
    ],
    ["Adopción internacional de menor conforme a la Ley 54/2007."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_partos_multiples_adopciones_misma_fecha",
    "Por partos múltiples o por dos o más adopciones constituidas en la misma fecha",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "1000",
      por: "hijo nacido o adoptado en parto múltiple o adopciones múltiples de la misma fecha",
    },
    [
      "Fórmula: 1.000 euros por cada hijo nacido o adoptado.",
      "Aplicable en el período del nacimiento o adopción.",
      "El menor debe convivir con el progenitor o adoptante en la fecha de devengo.",
      "En matrimonios o uniones de hecho, si presentan individual, se prorratea por partes iguales.",
    ],
    [96],
    [
      "asturias_partos_multiples_adopciones_misma_fecha:unidades",
      "asturias_partos_multiples_adopciones_misma_fecha:cumple",
    ],
    ["Parto múltiple o dos o más adopciones constituidas en la misma fecha."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_familias_monoparentales",
    "Para familias monoparentales",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "500",
      por: "contribuyente de familia monoparental",
    },
    [
      "Fórmula: 500 euros por contribuyente.",
      "Base imponible general + ahorro + anualidades por alimentos exentas: máximo 45.000 euros.",
      "No aplicable a custodia compartida.",
      "Si hay alteración familiar durante el año, se entiende convivencia si se produce al menos 183 días al año.",
    ],
    [97, 98],
    [
      "asturias_familias_monoparentales:unidades",
      "asturias_familias_monoparentales:cumple",
    ],
    [
      "Contribuyente con descendientes a cargo y sin convivencia con persona ajena a esos descendientes, salvo ascendientes con derecho al mínimo.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_acogimiento_familiar_menores",
    "Por acogimiento familiar de menores",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "500 euros por menor acogido si convive 183 días o más; 250 euros si convive más de 90 días y menos de 183 días.",
    },
    [
      "Fórmula: 500 euros por menor con convivencia de al menos 183 días; 250 euros por menor con convivencia superior a 90 días e inferior a 183 días.",
      "Acogimiento familiar de urgencia, temporal o permanente; excluidos los acogimientos con finalidad preadoptiva.",
      "Si hay más de un contribuyente con derecho y presentan individual, se prorratea por partes iguales.",
    ],
    [98, 99],
    [
      "asturias_acogimiento_familiar_menores:importe",
      "asturias_acogimiento_familiar_menores:cumple",
    ],
    ["Menor en régimen de acogimiento familiar."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_certificacion_gestion_forestal_sostenible",
    "Por certificación de la gestión forestal sostenible",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "cantidades invertidas para obtener certificación de gestión forestal sostenible",
      limiteMaximoEuros: "1000",
    },
    [
      "Fórmula: min(30% de cantidades invertidas, 1.000 euros por contribuyente).",
      "Se aplica en el ejercicio en que se obtiene la certificación.",
      "Base: costes asociados a la certificación, excluidas subvenciones recibidas para esa finalidad.",
      "Si hay varios contribuyentes con derecho sobre los mismos bienes y presentan individual, se prorratea por partes iguales.",
    ],
    [99, 100],
    [
      "asturias_certificacion_gestion_forestal_sostenible:base",
      "asturias_certificacion_gestion_forestal_sostenible:cumple",
    ],
    [
      "Propietario de montes situados en Asturias con certificación de gestión forestal sostenible.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_libros_texto_material_escolar",
    "Por adquisición de libros de texto y material escolar",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de libros de texto y material escolar de Primaria/ESO, minorado por becas y ayudas, con límites por descendiente según base, tributación y familia numerosa.",
    },
    [
      "Fórmula: min(100% de gastos - becas/ayudas, límite por descendiente aplicable).",
      "Individual no numerosa: 50 euros hasta 6.500; 37,50 euros hasta 10.000; 25 euros hasta 26.000.",
      "Conjunta no numerosa: 100 euros hasta 12.000; 75 euros hasta 20.000; 50 euros hasta 37.000.",
      "Familia numerosa: 75 euros por descendiente en individual y 150 euros por descendiente en conjunta.",
      "Base imponible general + ahorro: máximo 26.000 euros individual y 37.000 conjunta.",
      "La deducción se prorratea por partes iguales cuando exista más de un contribuyente con derecho; el límite máximo no se prorratea.",
    ],
    [103, 104, 105],
    [
      "asturias_libros_texto_material_escolar:importe",
      "asturias_libros_texto_material_escolar:cumple",
    ],
    [
      "Gastos por descendientes en Educación Primaria o Secundaria Obligatoria; también tutela y acogimiento.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_segundo_sucesivos_hijos_concejos_despoblamiento",
    "Por nacimiento o adopción de segundo y sucesivos hijos en concejos en riesgo de despoblamiento o en crisis demográfica",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "300",
      por: "segundo o sucesivo hijo nacido o adoptado",
    },
    [
      "Fórmula: 300 euros por cada segundo o sucesivo hijo nacido o adoptado.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "El menor debe convivir con el declarante a la fecha de devengo; si fallece antes, basta convivencia a fecha de fallecimiento.",
      "Residencia habitual del declarante en concejo en riesgo de despoblamiento o en crisis demográfica.",
      "En nacimientos o adopciones de hijos comunes en individual, se prorratea en todo caso.",
    ],
    [105, 106],
    [
      "asturias_segundo_sucesivos_hijos_concejos_despoblamiento:unidades",
      "asturias_segundo_sucesivos_hijos_concejos_despoblamiento:cumple",
    ],
    ["Nacimiento o adopción del segundo hijo o sucesivos."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_autonomos_concejos_despoblamiento",
    "Para contribuyentes que se establezcan como autónomos en concejos en riesgo de despoblamiento o en crisis demográfica",
    "otros_conceptos",
    {
      tipo: "importe_fijo",
      euros: "1000",
      por: "contribuyente autónomo con derecho",
    },
    [
      "Fórmula: 1.000 euros por contribuyente con derecho; en conjunta, multiplicar por el número de miembros que cumplan requisitos.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Residencia habitual en concejo en riesgo de despoblamiento o en crisis demográfica.",
      "Inicio de actividad en Asturias como autónomo o trabajador por cuenta propia durante el período.",
      "Alta durante mínimo un año, salvo fallecimiento.",
      "No aplicable a autónomos colaboradores ni socios de sociedades mercantiles de capital.",
      "No aplicable si cesó en la misma actividad en los seis meses anteriores al inicio.",
    ],
    [106, 107, 108],
    [
      "asturias_autonomos_concejos_despoblamiento:unidades",
      "asturias_autonomos_concejos_despoblamiento:cumple",
    ],
    ["Alta en RETA o mutualidad correspondiente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_transporte_publico_despoblamiento",
    "Por gastos de transporte público para residentes en concejos en riesgo de despoblamiento o en crisis demográfica",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de abonos de transporte público personales del contribuyente con límite 100 euros, más 10% de abonos de descendientes estudiantes fuera del concejo con límite 300 euros por descendiente.",
    },
    [
      "Fórmula general: min(100% de gastos de abonos unipersonales y nominales del contribuyente, 100 euros por contribuyente).",
      "En conjunta, el límite de 100 euros se multiplica por el número de miembros con derecho, con el límite de gastos efectivos.",
      "Incremento descendientes: min(10% de gastos de abonos por descendiente o adoptado, 300 euros por descendiente).",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Residencia habitual en concejo en riesgo de despoblamiento o en crisis demográfica.",
      "Descendiente con derecho al mínimo que curse bachillerato, FP o enseñanzas universitarias fuera del concejo.",
      "Si el descendiente convive con más de un contribuyente de idéntico grado, se prorratea por partes iguales.",
    ],
    [108, 109, 110],
    [
      "asturias_transporte_publico_despoblamiento:importe",
      "asturias_transporte_publico_despoblamiento:cumple",
    ],
    ["Gastos acreditados por factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_formacion_trabajos_cualificados_idi",
    "Por gastos de formación en trabajos especialmente cualificados relacionados con I+D, científicos o técnicos",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos de formación satisfechos para trabajos especialmente cualificados de I+D, científicos o técnicos",
      limiteMaximoEuros: "2000",
    },
    [
      "Fórmula: min(100% de gastos de formación, 2.000 euros).",
      "No más de tres años desde que el contribuyente finalizó su formación académica.",
      "Residencia habitual en Asturias mantenida al menos tres años.",
      "Por cuenta ajena: contrato de trabajo. Por cuenta propia: alta en Seguridad Social o mutualidad durante mínimo un año salvo fallecimiento.",
      "Se aplica una sola vez, en el período de incorporación al mercado laboral.",
      "Trabajos especialmente cualificados: grupo de cotización 1 y actividades de I+D, científicas o técnicas según la ficha.",
      "Incompatible por contribuyente con la deducción por traslado de domicilio fiscal por motivos laborales para trabajos especialmente cualificados.",
    ],
    [110, 111, 112, 113],
    [
      "asturias_formacion_trabajos_cualificados_idi:base",
      "asturias_formacion_trabajos_cualificados_idi:cumple",
    ],
    ["Gastos de formación satisfechos por el contribuyente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_traslado_domicilio_fiscal_motivos_laborales",
    "Para contribuyentes que trasladen su domicilio fiscal al Principado de Asturias por motivos laborales",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "15% de gastos generados por traslado de domicilio fiscal por motivos laborales; límite 1.000 euros general o 2.000 euros si desarrolla trabajos especialmente cualificados.",
    },
    [
      "Fórmula general: min(15% de gastos de traslado, 1.000 euros por contribuyente con derecho).",
      "Fórmula trabajos cualificados: min(15% de gastos de traslado, 2.000 euros por contribuyente con derecho).",
      "En conjunta, el límite de 1.000 o 2.000 euros se aplica por cada contribuyente con derecho.",
      "Aplicable en el período del traslado y durante los tres ejercicios posteriores.",
      "No residencia habitual en Asturias durante los cuatro años anteriores al traslado.",
      "Residencia habitual fijada en Asturias y mantenida al menos tres años adicionales al traslado.",
      "Gastos deducibles: viaje y mudanza, escolarización de descendientes, adquisición o arrendamiento de vivienda habitual y servicios/suministros vinculados.",
      "Incompatible por contribuyente, en trabajos cualificados, con la deducción por gastos de formación en trabajos cualificados.",
    ],
    [113, 114, 115, 116],
    [
      "asturias_traslado_domicilio_fiscal_motivos_laborales:importe",
      "asturias_traslado_domicilio_fiscal_motivos_laborales:cumple",
    ],
    [
      "Traslado de domicilio fiscal al Principado de Asturias por motivos laborales.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vivienda_determinados_colectivos",
    "Por adquisición o rehabilitación de vivienda habitual para determinados colectivos",
    "vivienda_habitual",
    {
      tipo: "mixta",
      descripcion:
        "5% de cantidades satisfechas; 10% en concejos en riesgo para jóvenes hasta 35, familias numerosas o monoparentales; base máxima 10.000 euros.",
    },
    [
      "Supuesto A, concejos en riesgo: 5% general; 10% si el contribuyente tiene edad igual o inferior a 35 años, es miembro de familia numerosa o familia monoparental.",
      "Supuesto B, resto de concejos: 5% para contribuyentes de edad igual o inferior a 35 años si el valor de la vivienda no excede de 250.000 euros.",
      "Base máxima: 10.000 euros en individual y conjunta; si varios contribuyentes tienen derecho por los mismos bienes, se prorratea la base máxima.",
      "Deducción máxima operativa: 500 euros al 5% o 1.000 euros al 10%.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "La vivienda debe constituir o ir a constituir vivienda habitual; en concejos en riesgo, el domicilio fiscal debe mantenerse al menos tres años salvo fallecimiento.",
    ],
    [116, 117, 118],
    [
      "asturias_vivienda_determinados_colectivos:importe",
      "asturias_vivienda_determinados_colectivos:cumple",
    ],
    ["Gastos acreditados mediante factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_vehiculos_electricos",
    "Por adquisición de vehículos eléctricos",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "15",
      base: "cantidades satisfechas por adquisición de vehículo eléctrico nuevo o kilómetro cero, minoradas por ayudas públicas",
      limiteMaximoEuros: "7500",
    },
    [
      "Fórmula: min(15% de base, 7.500 euros), por base máxima de 50.000 euros por vehículo.",
      "Cada contribuyente tiene derecho por un solo vehículo.",
      "Vehículo eléctrico nuevo o kilómetro cero de categoría enchufable o pila de combustible según MOVES III.",
      "El vehículo no puede estar afecto a actividades económicas.",
      "La deducción corresponde al contribuyente que figure en el contrato de compraventa.",
      "Si hay varios adquirentes, la base máxima de 50.000 euros es conjunta y se prorratea entre adquirentes.",
      "Ámbito temporal prorrogado a 2025.",
    ],
    [119, 120],
    [
      "asturias_vehiculos_electricos:base",
      "asturias_vehiculos_electricos:cumple",
    ],
    ["Contrato de compraventa del vehículo."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_cuidado_descendientes_hasta_25",
    "Por el cuidado de descendientes o adoptados de hasta 25 años de edad",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "600 euros por descendiente de hasta 25 años con derecho al mínimo; también hasta cumplir 26 años si cumple el resto de requisitos, con prorrateo por meses en el año en que cumpla 26.",
    },
    [
      "Fórmula general: 600 euros por descendiente o adoptado.",
      "Año en que cumple 26 años: 600 euros x meses que cumplen requisitos / 12; se computa hasta el mes anterior al cumpleaños 26.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Progenitores, adoptantes o tutores deben convivir con el descendiente a la fecha de devengo.",
      "Si hay más de un contribuyente con derecho, se prorratea por partes iguales.",
      "Incompatible, para los mismos descendientes y por contribuyente, con gastos de descendientes en centros de cero a tres años.",
    ],
    [120, 121],
    [
      "asturias_cuidado_descendientes_hasta_25:importe",
      "asturias_cuidado_descendientes_hasta_25:cumple",
    ],
    [
      "Descendiente o adoptado que genere derecho al mínimo por descendientes, o supuesto extendido hasta 26 años.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_emancipacion_jovenes_hasta_35",
    "Por emancipación de jóvenes de hasta 35 años de edad",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos directamente vinculados a la emancipación",
      limiteMaximoEuros: "1000",
    },
    [
      "Fórmula: min(100% de gastos de emancipación, 1.000 euros por contribuyente).",
      "Contribuyente menor de 36 años; también aplicable en el ejercicio en que cumpla 36 si emancipación y gastos son previos al cumpleaños.",
      "Emancipación: dejar de convivir con ascendientes y trasladar domicilio a nueva vivienda habitual en Asturias en propiedad o arrendamiento.",
      "Se pierde la deducción si retorna al hogar familiar antes de tres años.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Gastos vinculados: mobiliario, transporte, arrendamiento o adquisición de vivienda, entre otros.",
    ],
    [121, 122],
    [
      "asturias_emancipacion_jovenes_hasta_35:base",
      "asturias_emancipacion_jovenes_hasta_35:cumple",
    ],
    ["Gastos acreditados mediante factura o medio admitido en Derecho."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_ayudas_ela",
    "Por la obtención de ayudas o subvenciones otorgadas por el Principado de Asturias a enfermos de Esclerosis Lateral Amiotrófica",
    "circunstancias_personales_familiares",
    {
      tipo: "mixta",
      descripcion:
        "Resultado de aplicar los tipos medios de gravamen a la cuantía de la ayuda o subvención ELA integrada en la base liquidable.",
    },
    [
      "Fórmula: ayuda integrada en base liquidable x tipos medios de gravamen aplicables.",
      "Solo por ayudas o subvenciones públicas otorgadas por el Principado de Asturias a enfermos de ELA integradas en la base imponible general.",
      "No tiene límite cuantitativo específico en la ficha; el importe depende de los tipos medios de gravamen.",
    ],
    [122, 123],
    ["asturias_ayudas_ela:importe", "asturias_ayudas_ela:cumple"],
    ["Ayuda o subvención ELA integrada en la base imponible general."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_gastos_arrendamiento_viviendas",
    "Por gastos derivados del arrendamiento de viviendas",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "100",
      base: "gastos deducibles vinculados al arrendamiento de viviendas a precios con sostenibilidad social",
      limiteMaximoEuros: "500",
    },
    [
      "Fórmula: min(100% de gastos deducibles, 500 euros anuales).",
      "Límite global independiente del número de inmuebles arrendados.",
      "En tributación conjunta, el límite de 500 euros se aplica por cada miembro que realice la inversión con sus propios ingresos.",
      "Gastos: reparación y conservación, formalización de contratos, primas de seguros por daños e impagos, certificados de eficiencia energética vinculados.",
      "El contribuyente debe obtener rendimientos de capital inmobiliario por arrendamiento de viviendas destinadas a vivienda habitual del arrendatario.",
      "Arrendamientos retribuidos a precios con sostenibilidad social: renta no superior al valor superior del rango del sistema estatal de referencia o normativa autonómica aplicable.",
    ],
    [123, 124, 125],
    [
      "asturias_gastos_arrendamiento_viviendas:base",
      "asturias_gastos_arrendamiento_viviendas:cumple",
    ],
    [
      "Gastos vinculados a arrendamientos que cumplan el requisito de renta durante los meses de vigencia del contrato.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_gastos_vitales_hasta_35",
    "Por los gastos vitales en que incurran los contribuyentes de hasta 35 años",
    "otros_conceptos",
    {
      tipo: "mixta",
      descripcion:
        "100% de gastos vitales; límite 2.000 euros hasta 25 años, 1.500 euros de 26 a 30 años y 1.000 euros de 31 a 35 años.",
    },
    [
      "Fórmula hasta 25 años: min(100% de gastos, 2.000 euros).",
      "Fórmula 26 a 30 años: min(100% de gastos, 1.500 euros).",
      "Fórmula 31 a 35 años: min(100% de gastos, 1.000 euros).",
      "Si el contribuyente está en dos tramos de edad durante el ejercicio, se aplica el límite de mayor cuantía.",
      "En conjunta, el límite se aplica por cada miembro que cumpla requisitos.",
      "Base imponible general + ahorro: máximo 28.000 euros anuales.",
      "Gastos admisibles en sentido amplio: vivienda y suministros, educativos, transporte y movilidad, tecnología, deportivos y culturales.",
    ],
    [125, 126],
    [
      "asturias_gastos_vitales_hasta_35:importe",
      "asturias_gastos_vitales_hasta_35:cumple",
    ],
    ["Contribuyente de hasta 35 años; gastos acreditados documentalmente."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_descendiente_fallecimiento_progenitor_accidente_laboral",
    "Por descendientes en caso de fallecimiento de progenitor como consecuencia de accidentes laborales",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "1000",
      por: "descendiente con derecho al mínimo",
    },
    [
      "Fórmula: 1.000 euros anuales por descendiente con derecho al mínimo por descendientes.",
      "Aplicable hasta que el descendiente deje de generar derecho al mínimo por descendientes.",
      "Requisito: fallecimiento del otro progenitor como consecuencia de accidente laboral, producido desde 1 de enero del ejercicio o con anterioridad.",
      "Solo se computan descendientes comunes con el progenitor difunto; el nasciturus genera derecho desde el ejercicio de nacimiento.",
    ],
    [126, 127],
    [
      "asturias_descendiente_fallecimiento_progenitor_accidente_laboral:unidades",
      "asturias_descendiente_fallecimiento_progenitor_accidente_laboral:cumple",
    ],
    ["Descendiente que genere derecho al mínimo por descendientes."]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_inversion_entidades_nuevas_reciente_creacion",
    "Por inversión en la adquisición de acciones y participaciones sociales de nuevas entidades o de reciente creación",
    "otros_conceptos",
    {
      tipo: "porcentaje",
      porcentaje: "30",
      base: "cantidades invertidas en acciones o participaciones sociales de nuevas entidades o de reciente creación",
      limiteMaximoEuros: "6000",
    },
    [
      "Fórmula: min(30% de inversión, 6.000 euros anuales).",
      "En conjunta, el límite de 6.000 euros se aplica a las inversiones realizadas por cada miembro que cumpla requisitos.",
      "Participación del contribuyente y familiares hasta tercer grado no superior al 40% del capital o derechos de voto durante ningún día del año.",
      "Participación mantenida al menos tres años.",
      "Entidad con domicilio social y fiscal en Asturias, microempresa o pyme, y actividad económica real.",
      "Constitución: al menos una persona contratada a jornada completa desde el primer ejercicio fiscal.",
      "Ampliación: entidad constituida en los tres años anteriores e incremento de plantilla media durante los dos ejercicios posteriores, mantenido 24 meses.",
    ],
    [127, 128],
    [
      "asturias_inversion_entidades_nuevas_reciente_creacion:base",
      "asturias_inversion_entidades_nuevas_reciente_creacion:cumple",
    ],
    [
      "Inversión por constitución o ampliación de capital en sociedad anónima, limitada, cooperativa o laboral.",
    ]
  ),
  fichaImplementada(
    { estado: "implementada" },
    "asturias_enfermedad_celiaca",
    "Por gastos derivados de la enfermedad celíaca diagnosticada",
    "circunstancias_personales_familiares",
    {
      tipo: "importe_fijo",
      euros: "100",
      por: "persona integrante del núcleo familiar con enfermedad celíaca diagnosticada",
    },
    [
      "Fórmula: 100 euros por persona integrante del núcleo familiar diagnosticada con enfermedad celíaca.",
      "Base imponible general + ahorro: máximo 35.000 euros individual y 45.000 conjunta.",
      "Importe máximo de 100 euros por persona que dé derecho a deducción, sin perjuicio de prorrateo.",
      "Si dos o más contribuyentes tienen derecho respecto de los mismos ascendientes o descendientes, el importe máximo se prorratea por partes iguales.",
    ],
    [128, 129],
    [
      "asturias_enfermedad_celiaca:unidades",
      "asturias_enfermedad_celiaca:cumple",
    ],
    [
      "El contribuyente debe satisfacer efectivamente los gastos y contar con informe médico oficial de diagnóstico.",
    ]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...ASTURIAS_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  ASTURIAS_ACOGIMIENTO_MAYORES_65_2025,
  ASTURIAS_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  ASTURIAS_FAMILIAS_NUMEROSAS_2025,
  ASTURIAS_CENTROS_CERO_TRES_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
