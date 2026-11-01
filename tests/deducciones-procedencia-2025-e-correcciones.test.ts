import { expect, it } from "vitest"
import {
  evaluarCeliaquiaRioja,
  totalDeduccionesEvaluadas,
  type PersonaCeliacaRioja,
} from "../lib/dominio/irpf/deducciones/contratos-2025"
import lote from "../docs/procedencia/deducciones-2025/lotes/e/dictamenes.json"
import limites from "../docs/procedencia/deducciones-2025/revisiones/e/limites-manual.json"
import { RIOJA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/la-rioja"

const contexto = {
  ejercicio: 2025,
  territorio: "la-rioja",
  contribuyente: "titular-a",
  modalidad: "individual",
} as const

function persona(fechaDiagnostico: string, fechaEmision: string): PersonaCeliacaRioja {
  return {
    id: "descendiente",
    relacion: "descendiente",
    titularesDelMinimo: ["titular-a", "titular-b"],
    titularesDeduccion: ["titular-a", "titular-b"],
    certificado: {
      referencia: "supuesto-sintetico",
      medico: "facultativo ficticio",
      colegiado: "ficticio",
      especialidad: "digestivo",
      diagnostico: "definitivo",
      ejercicioMedico: "activo",
      fechaDiagnostico,
      fechaEmision,
    },
  }
}

it.each([
  ["2025-12-31", "2025-01-01"],
  ["2025-12-31", "2025-12-30"],
])("rechaza un diagnóstico %s posterior al certificado %s", (diagnostico, emision) => {
  expect(evaluarCeliaquiaRioja(contexto, [persona(diagnostico, emision)]))
    .toMatchObject({ estado: "no_soportado" })
})

it.each([
  ["2025-12-31", "2025-12-31"],
  ["2025-12-31", "2026-02-01"],
])("admite diagnóstico %s acreditado en %s sin exigir emisión en 2025", (diagnostico, emision) => {
  expect(evaluarCeliaquiaRioja(contexto, [persona(diagnostico, emision)]))
    .toMatchObject({ estado: "calculo_parcial", importe: 125 })
})

it.each(["individual", "conjunta"] as const)("el parcial en %s corresponde al titular y no alimenta el agregado", (modalidad) => {
  const ctx = { ...contexto, modalidad }
  const personas = [persona("2025-12-31", "2026-02-01")]
  expect(evaluarCeliaquiaRioja(ctx, personas)).toMatchObject({
    estado: "calculo_parcial", importe: 125,
  })
  expect(totalDeduccionesEvaluadas(ctx, [
    { tipo: "rioja_celiaquia", contexto: ctx, personas },
  ])).toMatchObject({ estado: "no_soportado" })
})

it.each([
  "galicia_ayudas_incendios_peifoga_2025",
  "galicia_ayudas_deportistas_alto_nivel",
  "galicia_ayudas_ela_fenotipos",
])("la cuantía de %s cita tipos medios, no el 15 %% de la deducción siguiente", (codigo) => {
  const deduccion = lote.deducciones.find((d) => d.codigo === codigo)
  const cita = deduccion?.citas.find((c) => c.id === `${codigo}-manual-cuantia`)
  expect(cita?.textoLiteral).toContain("tipos medios de gravamen")
  expect(cita?.textoLiteral).not.toContain("15 por 100")
})

for (const [codigo, seccion] of Object.entries(limites.secciones)) {
  it(`las citas manuales de ${codigo} están dentro de su sección`, () => {
    const deduccion = lote.deducciones.find((d) => d.codigo === codigo)
    const citas = deduccion?.citas.filter((c) => c.documentoId === "e-765c89ade626abf97268") ?? []
    expect(citas.length).toBeGreaterThan(0)
    for (const cita of citas) {
      const loc = cita.localizador
      expect(loc.tipo).toBe("pdf")
      const pagina = loc.paginaFisica ?? -1
      const y = loc.bbox?.[1] ?? -1
      const [inicio, yInicio] = seccion.inicio
      const [fin, yFin] = seccion.finExclusivo
      expect(pagina > inicio || (pagina === inicio && y >= yInicio)).toBe(true)
      expect(pagina < fin || (pagina === fin && y < yFin)).toBe(true)
    }
  })
}

it.each([
  ["rioja_bicicletas_pedaleo_no_asistido", [504]],
  ["rioja_enfermedad_celiaca", [520]],
] as const)("%s no remite a páginas enteramente ajenas", (codigo, paginas) => {
  const ficha = RIOJA_DEDUCCIONES_AUTONOMICAS_2025.find((f) => f.codigo === codigo)
  expect(ficha?.fuenteManual.paginas).toEqual(paginas)
})
