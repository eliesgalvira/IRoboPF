import type { FichaDeduccionAutonomica } from "../tipos"
import { fichaImplementada, fichaImplementadaFormula } from "../helpers"

export const MURCIA_GASTOS_GUARDERIA_2025 = fichaImplementada(
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
)

export const MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025 = fichaImplementada(
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
)

export const MURCIA_GASTOS_VETERINARIOS_2025 = fichaImplementada(
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
)

export const MURCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025 = [
  fichaImplementadaFormula("murcia_vivienda_jovenes_hasta_40", [440, 441, 442]),
  fichaImplementadaFormula(
    "murcia_donativos_patrimonio_cultural_actividades",
    [442, 443, 444]
  ),
  fichaImplementadaFormula(
    "murcia_donativos_investigacion_biosanitaria",
    [444, 445]
  ),
  fichaImplementadaFormula(
    "murcia_donaciones_bienes_patrimonio_cultural",
    [445, 446, 447]
  ),
  fichaImplementadaFormula("murcia_dispositivos_ahorro_agua", [449, 450]),
  fichaImplementadaFormula(
    "murcia_instalaciones_recursos_energeticos_renovables",
    [450, 451, 452]
  ),
  fichaImplementadaFormula(
    "murcia_inversion_entidades_nuevas_reciente_creacion",
    [452, 453, 454]
  ),
  fichaImplementadaFormula("murcia_inversion_mab", [454, 455, 456]),
  fichaImplementadaFormula("murcia_material_escolar_libros_texto", [456, 457]),
  fichaImplementadaFormula("murcia_nacimiento_adopcion", [457, 458]),
  fichaImplementadaFormula("murcia_contribuyentes_discapacidad", [458]),
  fichaImplementadaFormula("murcia_conciliacion", [458, 459, 460, 461]),
  fichaImplementadaFormula("murcia_acogimiento_mayores_65_discapacidad", [461]),
  fichaImplementadaFormula("murcia_mujeres_trabajadoras", [463, 464, 465]),
  fichaImplementadaFormula(
    "murcia_nueva_vivienda_o_ampliacion_familias_numerosas",
    [465, 466]
  ),
  fichaImplementadaFormula("murcia_familia_monoparental", [467, 468]),
  fichaImplementadaFormula("murcia_ensenanza_idiomas", [468]),
  fichaImplementadaFormula("murcia_acceso_internet", [469, 470]),
  fichaImplementadaFormula("murcia_vehiculos_electricos", [470, 471, 472, 473]),
  fichaImplementadaFormula(
    "murcia_recarga_vehiculos_electricos",
    [473, 474, 475]
  ),
  fichaImplementadaFormula(
    "murcia_cristales_lentes_soluciones_limpieza",
    [475, 476]
  ),
  fichaImplementadaFormula("murcia_deporte_actividades_saludables", [476, 477]),
  fichaImplementadaFormula("murcia_enfermedades_raras", [477, 478]),
  fichaImplementadaFormula("murcia_inversion_economia_social", [478, 479]),
  fichaImplementadaFormula(
    "murcia_regimen_transitorio_inversion_vivienda_habitual",
    [480, 481]
  ),
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>

export const MURCIA_DEDUCCIONES_AUTONOMICAS_2025 = [
  ...MURCIA_DEDUCCIONES_PENDIENTES_IMPLEMENTADAS_2025,
  MURCIA_GASTOS_GUARDERIA_2025,
  MURCIA_ARRENDAMIENTO_VIVIENDA_HABITUAL_2025,
  MURCIA_GASTOS_VETERINARIOS_2025,
] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
