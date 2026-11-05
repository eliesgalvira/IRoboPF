import { describe, expect, it } from "vitest";
import Decimal from "decimal.js";
import { Effect, Result } from "effect";
import { agua, recarga, efectivo } from "./revision-f-fixtures";
import {
  aplicarDeduccionesTerritoriales2025 as aplicar,
  type MagnitudesTerritorialesAnuales,
} from "../lib/dominio/irpf/deducciones/anual-territorial";
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual";
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional";
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas";

const magnitudes = (
  cuota = "100",
  territorio: "madrid" | "murcia" = "murcia",
): MagnitudesTerritorialesAnuales => ({
  caso: {
    anio: 2025,
    comunidadAutonoma: territorio,
    contribuyenteId: "s-1",
    situacionFamiliar: {
      tipo: "individual",
      edad: 25,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  baseGeneral: new Decimal(20000),
  baseAhorro: new Decimal(0),
  minimoPersonalFamiliar: new Decimal(5550),
  cuotaAutonomica: new Decimal(cuota),
  sujetosConMinimo: [],
  basesLiquidables: { general: new Decimal(20000), ahorro: new Decimal(0) },
});
const inversion = {
  id: "inv",
  entidadId: "emisor",
  fecha: "2025-06-01",
  tipo: "fondos_propios_cotizados",
  importeEUR: "5000",
  gastosEUR: "0",
  tributosEUR: "0",
  patrimonioHastaDevengo: "sin_transmision",
  escritura: "contrato",
};
const extranjero = (): Solicitud => ({
  lote: "F-ampliado",
  codigo: "madrid_inversiones_nuevos_contribuyentes_extranjero",
  hechos: {
    fechaResidenciaMadrid: "2025-01-01",
    historialResidencia: [2020, 2021, 2022, 2023, 2024].map((ejercicio) => ({
      ejercicio,
      territorio: "extranjero",
    })),
    entidades: [{ id: "emisor", emisorNacionalidad: "extranjera" }],
    inversiones: [inversion],
  },
});
const vivienda = (): Solicitud => ({
  lote: "F-ampliado",
  codigo: "madrid_vivienda_municipios_despoblacion",
  hechos: {
    miembrosUnidad: ["s-1"],
    nacimientoContribuyente: "2000-01-01",
    viviendas: [
      {
        id: "viviendaMadrid",
        territorio: "madrid",
        adquisicion: "2025-01-01",
        ocupacionDesde: "2025-02-01",
        permanenciaHasta: "2025-12-31",
        precioEUR: "100000",
        gastosEUR: "0",
        tributosEUR: "0",
        porcentajePropiedad: "100",
        titulares: ["s-1"],
        municipio: "municipio",
        poblacion: 1000,
        fechaPoblacion: "2024-01-01",
        referenciaPoblacion: "INE",
      },
    ],
  },
});
const futura = (): Solicitud => ({
  lote: "F-ampliado",
  codigo: "madrid_inversion_entidades_nuevas_reciente_creacion",
  hechos: {
    entidades: [
      {
        id: "emisor",
        forma: "sl",
        domicilioSocial: "madrid",
        domicilioFiscal: "madrid",
        actividad: "economica_no_patrimonial",
        universidadInvestigacion: "no",
        creacion: "2026-01-01",
        certificadoPlantilla: "certificado",
        plantillaAntes: "1",
        plantillaPosterior: "2",
        plantillaMantenida: "compromiso_24_meses_adicionales",
      },
    ],
    inversiones: [
      {
        ...inversion,
        tipo: "ampliacion",
        importeEUR: "1000",
        porcentajeCapitalPropio: "10",
        porcentajeCapitalFamiliar: "10",
        porcentajeVotosPropio: "10",
        porcentajeVotosFamiliar: "10",
      },
    ],
  },
});
type ResumenAPI = Effect.Effect<{ readonly deduccionesTerritoriales2025?: ReturnType<typeof aplicar> | undefined }, {readonly _tag:"RechazoAPI";readonly motivo:string}>
function canonico(
  solicitudes: readonly Solicitud[],
  territorio: "madrid" | "murcia" = "murcia",
): ResumenAPI {
  return liquidarIrpfAnual(
    {
      ...magnitudes("0", territorio).caso,
      rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
      deduccionesTerritoriales2025: { solicitudes },
    },
    { modo: "canonico" },
  ).pipe(Effect.map(r => ({deduccionesTerritoriales2025:r.deduccionesTerritoriales2025})), Effect.mapError(e => ({_tag:"RechazoAPI" as const,motivo:String(e)})))
}
function explicito(
  solicitudes: readonly Solicitud[],
  territorio: "madrid" | "murcia" = "murcia",
): ResumenAPI {
  return liquidarIrpfAnualExplicito({
    ...efectivo(),
    edad: 25,
    comunidadAutonoma: territorio,
    deduccionesTerritoriales2025: { solicitudes },
  }).pipe(Effect.map(r => ({deduccionesTerritoriales2025:r.deduccionesTerritoriales2025})), Effect.mapError(e => ({_tag:"RechazoAPI" as const,motivo:String(e)})))
}
describe("Revisión monetaria independiente F", () => {
  // AEAT 2025 agua:20% de min(pago,300); recarga:100% de min(pago,4000).
  for (const [euros, esperado] of [
    ["0", "0"],
    ["299.99", "59.998"],
    ["300", "60"],
    ["300.01", "60"],
  ])
    it(`agua frontera ${euros}`, () => {
      const s = agua();
      const r = aplicar(
        {
          solicitudes: [
            {
              ...s,
              hechos: {
                ...s.hechos,
                pagos: s.hechos.pagos!.map((p) => ({
                  ...p,
                  importeEUR: euros,
                })),
              },
            },
          ],
        },
        magnitudes("10000"),
      );
      expect(r.total).toEqual(racional(esperado));
    });
  for (const euros of ["3999.99", "4000", "4000.01"])
    it(`recarga frontera ${euros}`, () => {
      const s = recarga();
      const r = aplicar(
        {
          solicitudes: [
            {
              ...s,
              hechos: {
                ...s.hechos,
                pagos: s.hechos.pagos!.map((p) => ({
                  ...p,
                  importeEUR: euros,
                })),
              },
            },
          ],
        },
        magnitudes("0.01"),
      );
      const generado = euros === "3999.99" ? "3999.99" : "4000";
      expect(r.aplicaciones[0]).toMatchObject({
        generado: racional(generado),
        aplicado: racional("0.01"),
        arrastre: {
          saldo: racional(euros === "3999.99" ? "3999.98" : "3999.99"),
          ultimoEjercicio: 2028,
        },
      });
    });
  // DL1/2010 Madrid art17bis.3: después del resto, incluso con cuota insuficiente.
  it("R1 orden Madrid: vivienda no arrastrable antes de extranjero", () => {
    const r = aplicar(
      { solicitudes: [extranjero(), vivienda()] },
      magnitudes("1000", "madrid"),
    );
    expect(
      r.aplicaciones.find(
        (a) => "codigo" in a && a.codigo === vivienda().codigo,
      ),
    ).toMatchObject({ aplicado: racional("1000") });
    if (!("ordenAplicado" in r)) throw new Error("Falta libro F")
    expect(r.ordenAplicado).toEqual([vivienda().codigo, extranjero().codigo]);
  });
  it("R2 extranjero: genera saldo2025 aplicable hasta2030", () => {
    const r = aplicar(
      { solicitudes: [extranjero()] },
      magnitudes("1", "madrid"),
    );
    expect(r.aplicaciones[0]).toMatchObject({
      generado: racional("1000"),
      aplicado: racional("1"),
      arrastre: {
        primerEjercicio: 2026,
        ultimoEjercicio: 2030,
        saldo: racional("999"),
      },
    });
  });
  for (const [nombre, api] of [
    ["canónica", canonico],
    ["efectiva", explicito],
  ] as const) {
    it(`R1 API ${nombre}: conserva prelación vivienda/extranjero`, () => {
      const inv = extranjero();
      const r = Effect.runSync(
        api(
          [
            {
              ...inv,
              hechos: {
                ...inv.hechos,
                inversiones: [{ ...inversion, importeEUR: "50000" }],
              },
            },
            vivienda(),
          ],
          "madrid",
        ),
      );
      expect(
        r.deduccionesTerritoriales2025?.aplicaciones.find(
          (a) => "codigo" in a && a.codigo === vivienda().codigo,
        ),
      ).toMatchObject({ aplicado: racional("1000") });
      expect(r.deduccionesTerritoriales2025).toMatchObject({
        ordenAplicado: [vivienda().codigo, extranjero().codigo],
      });
    });
    it(`R3 API ${nombre}: sociedad futura no genera400`, () => {
      const r = Effect.runSync(Effect.result(api([futura()], "madrid")));
      if (Result.isSuccess(r))
        expect(r.success.deduccionesTerritoriales2025?.total).toEqual(
          racional("0"),
        );
      else expect(r.failure).toBeDefined();
    });
    it(`API ${nombre}: historia positiva impide cuota final`, () => {
      const s = recarga();
      const h = s.historialRecarga!;
      const r = Effect.runSync(
        Effect.result(
          api([
            {
              ...s,
              historialRecarga: {
                ...h,
                infraestructuras: [
                  {
                    objetoId: "previa",
                    ejercicioOrigen: 2024,
                    referencia: "origen",
                  },
                ],
              },
            },
          ]),
        ),
      );
      expect(Result.isFailure(r)).toBe(true);
    });
    it(`API ${nombre}: agua/recarga sin doble consumo`, () => {
      const r = Effect.runSync(api([recarga(), agua()]));
      expect(r.deduccionesTerritoriales2025).toMatchObject({
        ordenAplicado: [agua().codigo, recarga().codigo],
        completoEnRamasSolicitadas: true,
      });
    });
  }
});

// Frontera de base imponible; el precio no selecciona el tramo (reserva F-N01).
describe("F-N01 y precisión en frontera", () => {
 const vehiculo = (importeEUR = "1000"): Solicitud => ({lote:"F-ampliado",codigo:"murcia_vehiculos_electricos",historialSaldosIncentivoMurcia:{codigo:"murcia_vehiculos_electricos",periodos:[2022,2023,2024],contribuyente:"s-1",referencia:"censo",operaciones:[]},hechos:{residenciaFiscalAdquisicion:"murcia",vehiculos:[{id:"veh",adquisicion:"2025-06-01",matriculacion:"2025-05-01",uso:"particular",categoria:"M1",tecnologia:"BEV",modalidad:"compraventa",procedencia:"nuevo",contrato:"contrato",titular:"s-1",propiedadHastaDevengo:"sin_transmision",titularesReparto:["s-1"],plazas:5,importeEUR,gastosEUR:"0",tributosEUR:"0",ayudasEUR:"0"}]}})
 for(const [base,importe] of [["34999.9999999999999999999999999999999999999999","300"],["35000.0000000000000000000000000000000000000001","225"],["45000","150"]]) it(`BI ${base}`,()=>{
  const r=aplicar({solicitudes:[vehiculo()]},{...magnitudes("10000"),baseGeneral:new Decimal(base)})
  expect(r.total).toEqual(racional(importe))
 })
 it("35000 exactos siguen pendientes",()=>{
  const r=aplicar({solicitudes:[vehiculo()]},{...magnitudes("10000"),baseGeneral:new Decimal(35000)})
  expect(r).toMatchObject({completoEnRamasSolicitadas:false})
 })
 it("precio35000 no abre la reserva y topa7000 con BI20000",()=>{
  expect(aplicar({solicitudes:[vehiculo("35000")]},magnitudes("10000")).total).toEqual(racional("7000"))
 })
})
