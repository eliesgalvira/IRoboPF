import { expect, it } from "vitest"
import { Effect } from "effect"
import type { DerechosMinimos2025 } from "../lib/dominio/irpf/minimos/derechos-contrato"
import {
  calcularRetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
const hechos = (contribuyenteId: string): DerechosMinimos2025 => ({
  ejercicio: 2025,
  territorio: "madrid",
  regimen: "comun",
  modalidad: "individual",
  devengo: "2025-12-31",
  contribuyenteId,
  edadContribuyenteDevengo: 40,
  discapacidadContribuyente: { _tag: "SinDiscapacidad" },
  ascendientes: "ninguno",
  fallecimientosEnElEjercicio: "ninguno",
  descendientesCompletos: true,
  descendientes: [
    {
      sujetoId: "s-3",
      fechaNacimiento: "2017-01-01",
      edadDevengo: 8,
      vivoAlDevengo: true,
      rentasNoExentasCentimos: 0,
      declaracion: { modalidad: "no-presenta" },
      discapacidad: { _tag: "SinDiscapacidad" },
      titularesCompletos: true,
      titulares: ["s-1", "s-2"].map((titularId) => ({
        titularId,
        grado: 1,
        vinculo: { clase: "consanguinidad" },
        relacion: "convivencia",
        custodia: "compartida",
        alimentosJudiciales: false,
        aplicaEspecialidadAlimentos: false,
        residenteIrpf: true,
        rentasNoExentasCentimos: 2605600,
      })),
    },
  ],
})
const caso: CasoRetencionTrabajo = {
  anio: 2025,
  edad: 40,
  perfilTemporal: "cierre",
  retribucionAnualCentimos: 3000000,
  cotizacionesCentimos: 194400,
  situacionFamiliar: "situacion3",
  situacionLaboral: "activo",
  contrato: "general",
  descendientes: [],
  ascendientes: [],
  discapacidad: "sin-discapacidad",
}
it("dos titulares reciben el mismo reparto también en retenciones", () => {
  for (const id of ["s-1", "s-2"]) {
    const r = Effect.runSync(
      calcularRetencionTrabajoAeat(
        { ...caso, derechosMinimos: hechos(id) },
        { modo: "canonico" }
      )
    )
    expect(r.minimoPersonalFamiliarCentimos).toBe(675000)
    expect(
      r.rastro.pasos
        .flatMap((p) => p.lineasCalculo ?? [])
        .find((l) => l.etiqueta === "Mínimo personal y familiar")?.formula
    ).toContain("divisor 2")
  }
})
it("computoPorEntero no permite conceder un entero a cada titular", () => {
  const parcial = {
    edad: 8,
    computoPorEntero: true,
    discapacidad: "sin-discapacidad" as const,
    movilidadReducida: false,
    adopcionOAcogimientoMenosTresAnios: false,
  }
  const r = calcularRetencionTrabajoAeat(
    { ...caso, descendientes: [parcial] },
    { modo: "canonico" }
  )
  expect(Effect.runSync(Effect.exit(r))._tag).toBe("Failure")
})
it("rechaza incoherencia y especialidades no conectadas sin inventar un reparto", () => {
  for (const input of [
    { ...caso, edad: 41 },
    { ...caso, situacionFamiliar: "situacion2" as const },
    { ...caso, situacionLaboral: "pensionista" as const },
  ]) {
    expect(
      Effect.runSync(
        Effect.exit(
          calcularRetencionTrabajoAeat(
            { ...input, derechosMinimos: hechos("s-1") },
            { modo: "canonico" }
          )
        )
      )._tag
    ).toBe("Failure")
  }
})

it("no presume edad cuando una llamada antigua la omite", () => {
  const efecto = calcularRetencionTrabajoAeat(
    {
      ...caso,
      // @ts-expect-error frontera JavaScript de entrada insuficiente.
      edad: undefined,
    },
    { modo: "canonico" }
  )
  expect(Effect.runSync(Effect.exit(efecto))._tag).toBe("Failure")
})
