import { describe, expect, it } from "vitest"
import { ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/asturias"
import { CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/cantabria"

const fichas = [
  ...ASTURIAS_DEDUCCIONES_AUTONOMICAS_2025,
  ...CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025,
]
const texto = (codigo: string) =>
  JSON.stringify(fichas.find((f) => f.codigo === codigo))

describe("condiciones descriptivas con consecuencias de derecho", () => {
  it("alquiler cántabro exige superar el diez por ciento de renta y pago bancario", () => {
    const t = texto("cantabria_arrendamiento_jovenes_mayores_discapacidad")
    expect(t).toContain("excedan del 10")
    expect(t).toContain("efectivo")
    expect(t).toContain("36")
  })
  it("cuidado no equipara un ascendiente de setenta con mayor de setenta", () => {
    const t = texto("cantabria_cuidado_familiares")
    expect(t).toContain("mayor de setenta")
    expect(t).toContain("ciento ochenta y tres")
    expect(t).toContain("incompatible")
  })
  it("acogimiento exige selección pública y excluye adopción en el ejercicio", () => {
    const t = texto("cantabria_acogimiento_familiar_menores")
    expect(t).toContain("seleccionados")
    expect(t).toContain("ni adopten")
    expect(t).toContain("supervisión")
  })
  it("inversión excluye dirección y empleo aunque la participación sea del cuarenta por ciento", () => {
    const t = texto("cantabria_inversion_entidades_nuevas_reciente_creacion")
    expect(t).toContain("funciones ejecutivas")
    expect(t).toContain("relación laboral")
    expect(t).toContain("escritura pública")
  })
  it("traslado laboral permite el ejercicio siguiente y exige tres años posteriores", () => {
    const t = texto(
      "cantabria_traslado_residencia_motivos_laborales_despoblamiento"
    )
    expect(t).toContain("en el siguiente")
    expect(t).toContain("los tres siguientes")
  })
  it("estudios exige bachillerato, FP o universidad y menor de veinticinco", () => {
    const t = texto("cantabria_traslado_estudios_despoblamiento")
    expect(t).toContain("menor de 25")
    expect(t).toContain("bachillerato")
  })
  it("la residencia exige todo el año y no solo el devengo", () => {
    expect(
      texto("cantabria_residencia_municipio_riesgo_despoblamiento")
    ).toContain("todo el año natural")
  })
  it("nuevos inversores excluyen cualquier vivienda y limitan segundo grado", () => {
    const t = texto("cantabria_inversiones_nuevos_contribuyentes_extranjero")
    expect(t).toContain("vivienda turística")
    expect(t).toContain("segundo grado")
    expect(t).toContain("un mes")
  })
  it("los suministros consumidos no son gastos del nuevo residente", () => {
    expect(
      texto("cantabria_desplazamiento_permanencia_nuevos_residentes")
    ).toContain("no incluyéndose el coste")
  })
  it("celiaquía distingue cónyuge en conjunta y familiares con mínimo", () => {
    const t = texto("asturias_enfermedad_celiaca")
    expect(t).toContain("cónyuge")
    expect(t).toContain("conjunta")
    expect(t).toContain("mínimo")
  })
  it("el mínimo por descendientes puede perderse por declaración superior a mil ochocientos", () => {
    expect(
      texto("asturias_descendiente_fallecimiento_progenitor_accidente_laboral")
    ).toContain("1.800")
  })
  it("mantiene visible el solapamiento legal de treinta años", () => {
    const t = texto("asturias_gastos_vitales_hasta_35")
    expect(t).toContain("30–35")
    expect(t).toContain("ambigüedad")
  })
})

it("conserva la negación que gobierna las exclusiones del acogimiento", () => {
  const t = texto("asturias_acogimiento_no_remunerado_mayores_65")
  expect(t).toContain("La presente deducción no será de aplicación cuando:")
})

it("remite a la definición completa de monoparental y sus alimentos exentos", () => {
  const t = texto("asturias_arrendamiento_vivienda_habitual")
  expect(t).toContain("anualidades por alimentos exentas")
  expect(t).toContain("custodia compartida")
})
