import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
// Perfil efectivo del autor, cambiando territorio y solicitud. Oráculo: misma cuota con hechos propios coherentes.
it("H1 API efectiva: edad40 anual no puede convertirse en85 por solicitud", () => {
  const solicitud = {
    solicitudes: [
      {
        lote: "C",
        codigo: "canarias_gasto_enfermedad",
        hechos: {
          nacimiento: "1985-01-01",
          discapacidad: 0,
          pacientesMinimo: [],
          gastos: [
            {
              id: "p",
              fecha: "2025-06-01",
              pagador: "A",
              perceptor: "M",
              factura: "f",
              importe: "10000",
              ayudasExentas: "0",
              reembolsos: "0",
              medio: "transferencia",
              paciente: "A",
              concepto: "dental",
              profesional: "medico",
              colegiacion: "c",
            },
          ],
        },
      },
    ],
  } as const
  const caso = {
    ejercicio: 2025,
    comunidadAutonoma: "canarias",
    contribuyenteId: "A",
    edad: 40,
    modalidad: "individual",
    residenciaTodoElAnio: true,
    devengo: "2025-12-31",
    otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "ninguno",
    discapacidad: "ninguna",
    reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno",
    deducciones: "territoriales-por-hechos-y-da61",
    deduccionesTerritoriales2025: solicitud,
    rentasExtranjeras: "ninguna",
    especialidades: "ninguna",
    perfil: "solo-trabajo",
    conciliacion: {
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["certificado"],
    },
    trabajo: {
      ejercicio: 2025,
      territorio: "comun",
      reduccionesArt18: "ninguna",
      movilidad: "ninguna",
      discapacidadActiva: "ninguna",
      rendimientos: [
        {
          id: "r",
          clase: "empleo-laboral",
          integro: "30000",
          cotizaciones: {
            clase: "efectivas",
            seguridadSocial: "0",
            derechosPasivos: "0",
            colegiosHuerfanos: "0",
          },
          sindicato: { importe: "0", satisfecho: "no" },
          colegio: {
            importe: "0",
            satisfecho: "no",
            obligatorio: "no",
            finesEsenciales: "no",
          },
          defensa: {
            importe: "0",
            satisfecho: "no",
            litigioDirectoPagador: "no",
          },
        },
      ],
    },
    retenciones: [],
  } as const
  const bien = Effect.runSync(liquidarIrpfAnualExplicito(caso))
  expect(bien.deduccionesTerritoriales2025?.total).toEqual({
    numeradorEuros: "500",
    divisor: "1",
  })
  const rechazo = Effect.runSync(
    Effect.flip(
      liquidarIrpfAnualExplicito({
        ...caso,
        deduccionesTerritoriales2025: {
          solicitudes: [
            {
              ...solicitud.solicitudes[0],
              hechos: {
                ...solicitud.solicitudes[0].hechos,
                nacimiento: "1940-01-01",
              },
            },
          ],
        },
      })
    )
  )
  expect(rechazo._tag).toBe("ResultadoNoSoportado")
  expect(rechazo.motivo).toMatch(/Edad contradictoria/)
})
