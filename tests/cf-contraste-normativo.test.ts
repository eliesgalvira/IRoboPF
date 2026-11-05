import type { SolicitudF } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025";
import { expect, it } from "vitest";
import Decimal from "decimal.js";
import { evaluarAmpliacionF2025 as evaluar } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025";
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual";
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas";
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial";
import { consumirCuotaAnualF2025 as consumir } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota";
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional";

function solicitud(codigo: string, hechos: SolicitudF["hechos"]) {
  return {
    tipo: "territorial_f_ampliacion_2025",
    codigo,
    contexto: {
      ejercicio: 2025,
      territorio: codigo.startsWith("madrid") ? "madrid" : "murcia",
      contribuyente: "a",
      modalidad: "individual",
    },
    hechos: {
      bases: [{ id: "a", generalEUR: "20000", ahorroEUR: "0" }],
      miembrosUnidad: ["a"],
      elecciones: [],
      ...hechos,
    },
  };
}
const acogido = (nacimiento: string) => ({
  id: "adulto",
  relacion: "acogido",
  nacimiento,
  orden: 1,
  convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }],
  acogimientoTipo: "permanente",
  acogimientoCertificado: "consejeria",
  titularesDeduccion: ["a"],
});
const magnitudes = (): MagnitudesTerritorialesAnuales => ({
  caso: {
    anio: 2025,
    comunidadAutonoma: "madrid",
    contribuyenteId: "a",
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  baseGeneral: new Decimal(20000),
  baseAhorro: new Decimal(0),
  minimoPersonalFamiliar: new Decimal(5550),
  cuotaAutonomica: new Decimal(1000),
  sujetosConMinimo: [],
  basesLiquidables: { general: new Decimal(20000), ahorro: new Decimal(0) },
});
const noPositivo = (r: ReturnType<typeof evaluar>) =>
  expect(
    r.importeAntesPresentacionEUR === undefined ||
      Number(r.importeAntesPresentacionEUR) === 0,
  ).toBe(true);
it("N1 menor real: art6, 618.60", () => {
  expect(
    evaluar(
      solicitud("madrid_acogimiento_familiar_menores", {
        personas: [acogido("2015-01-01")],
      }),
    ),
  ).toMatchObject({
    estado: "calculo_parcial",
    importeAntesPresentacionEUR: "618.6",
  });
});
it("N1 adulto de 35 años no recibe acogimiento de menores", () => {
  noPositivo(
    evaluar(
      solicitud("madrid_acogimiento_familiar_menores", {
        personas: [acogido("1990-01-01")],
      }),
    ),
  );
});
it("N1 anual no puede publicar618.60 por adulto sin mínimo", () => {
  const s: SolicitudAnualF2025 = {
    lote: "F-ampliado",
    codigo: "madrid_acogimiento_familiar_menores",
    hechos: { personas: [acogido("1990-01-01")] },
  };
  noPositivo(evaluarAnualF2025(s, magnitudes()));
});
const entidad = (territorio = "madrid", creacion = "2025-06-01") => ({
  id: "e",
  forma: "sl",
  domicilioSocial: territorio,
  domicilioFiscal: territorio,
  actividad: "economica_no_patrimonial",
  creacion,
  empleadosJornadaCompleta: 1,
  universidadInvestigacion: "no",
  funcionesEjecutivas: "no",
  relacionLaboral: "no",
  comunicacionPrevia: "comunicacion",
});
const inversion = (tipo = "constitucion") => ({
  id: "i",
  entidadId: "e",
  fecha: "2025-06-01",
  tipo,
  importeEUR: "1000",
  gastosEUR: "0",
  tributosEUR: "0",
  porcentajeCapitalPropio: "10",
  porcentajeVotosPropio: "10",
  porcentajeCapitalFamiliar: "40",
  porcentajeVotosFamiliar: "40",
  patrimonioHastaDevengo: "sin_transmision",
  escritura: "escritura",
  comunicacionPrevia: "comunicacion",
});
for (const territorio of ["madrid", "murcia"]) {
  const codigo = territorio + "_inversion_entidades_nuevas_reciente_creacion";
  it(`N2 ${territorio} constitución simultánea es positiva`, () =>
    expect(
      evaluar(
        solicitud(codigo, {
          entidades: [entidad(territorio)],
          inversiones: [inversion()],
        }),
      ),
    ).toMatchObject({
      estado: "calculo_parcial",
      importeAntesPresentacionEUR: territorio === "madrid" ? "400" : "200",
    }));
  it(`N2 ${territorio} constitución futura no produce deducción2025`, () =>
    noPositivo(
      evaluar(
        solicitud(codigo, {
          entidades: [entidad(territorio, "2026-01-01")],
          inversiones: [inversion()],
        }),
      ),
    ));
}
it("N2 anual Madrid constitución futura no publica400", () => {
  const s: SolicitudAnualF2025 = {
    lote: "F-ampliado",
    codigo: "madrid_inversion_entidades_nuevas_reciente_creacion",
    hechos: {
      entidades: [entidad("madrid", "2026-01-01")],
      inversiones: [inversion()],
    },
  };
  noPositivo(evaluarAnualF2025(s, magnitudes()));
});
it("R1 independiente: dos descendientes antes de extranjero,1000=>100+900", () => {
  const codigos = [
    "madrid_inversiones_nuevos_contribuyentes_extranjero",
    "madrid_familias_dos_descendientes_ingresos_reducidos",
  ];
  const r = consumir(racional("1000"), codigos, [
    racional("1000"),
    {
      codigo: codigos[1]!,
      estado: "no_soportado",
      motivo: "Cuota pendiente",
      citas: [],
      reservas: [],
      rastro: [],
      dependenciaAnual: {
        magnitud: "cuota_tras_resto_deducciones",
        factor: "0.1",
        operacion: "10% remanente",
      },
    },
  ]);
  expect(r.aplicaciones.map((x) => x.aplicado)).toEqual([
    racional("100"),
    racional("900"),
  ]);
});
const p = (computoBaseEstatalEUR: string, medio = "transferencia") => ({
  id: "p",
  fecha: "2025-06-01",
  importeEUR: "1000",
  ayudasEUR: "0",
  concepto: "donativo_dinerario",
  objetoId: "e",
  pagador: "a",
  soportePago: "banco",
  medio,
  computoBaseEstatalEUR,
});
const mecenas = {
  id: "e",
  forma: "universidad_publica_murcia",
  registro: "registro",
  certificado: "certificado",
  proyectoMurcia: "si",
  situacionTributaria: "al_corriente",
  situacionSS: "al_corriente",
  cuentasPresentadas: "si",
  gradoVinculo: 5,
  interesComun: "no",
  creditoFiscalVigente: "no",
  destino: "investigacion_biosanitaria",
  biosanitaria: "registro",
};
for (const [asignacion, esperado] of [
  ["0", "500"],
  ["400", "300"],
  ["1000", "0"],
])
  it(`mecenazgo: base estatal${asignacion}, autonómica${esperado}`, () =>
    expect(
      evaluar(
        solicitud("murcia_donativos_investigacion_biosanitaria", {
          entidades: [mecenas],
          pagos: [p(asignacion!)],
        }),
      ),
    ).toMatchObject({ importeAntesPresentacionEUR: esperado }));
it("mecenazgo: efectivo no publica50%", () =>
  noPositivo(
    evaluar(
      solicitud("murcia_donativos_investigacion_biosanitaria", {
        entidades: [mecenas],
        pagos: [p("0", "efectivo")],
      }),
    ),
  ));
it("asignación estatal inyectada rechazada por frontera anual", () => {
  const { computoBaseEstatalEUR, ...limpio } = p("1000");
  Object.defineProperty(limpio, "computoBaseEstatalEUR", {
    value: computoBaseEstatalEUR,
    enumerable: true,
  });
  const s: SolicitudAnualF2025 = {
    lote: "F-ampliado",
    codigo: "murcia_donativos_investigacion_biosanitaria",
    hechos: { entidades: [mecenas], pagos: [limpio] },
  };
  expect(
    evaluarAnualF2025(s, {
      ...magnitudes(),
      caso: { ...magnitudes().caso, comunidadAutonoma: "murcia" },
    }).estado,
  ).toBe("no_soportado");
});
it("autoempleo: segunda alta censal no genera1031", () =>
  noPositivo(
    evaluar(
      solicitud("madrid_autoempleo_jovenes_menores_35", {
        nacimientoContribuyente: "2000-01-01",
        fechaAltaCenso: "2025-01-01",
        primeraAltaCenso: "no",
        actividadTerritorio: "principalmente_madrid",
        empleos: [{ certificadoActividad: "censo" }],
      }),
    ),
  ));

const vivienda = (adquisicion: string) => ({
  id: "v",
  territorio: "madrid",
  adquisicion,
  precioEUR: "100000",
  gastosEUR: "0",
  tributosEUR: "0",
  porcentajePropiedad: "100",
  titulares: ["a"],
  ocupacionDesde: adquisicion,
  permanenciaHasta: "2025-12-31",
  municipio: "municipio",
  poblacion: 1000,
  fechaPoblacion: "2024-01-01",
  referenciaPoblacion: "ine",
});
it("N3 adquisición2020 no abre anualidad de incentivo creado2024", () =>
  noPositivo(
    evaluar(
      solicitud("madrid_vivienda_municipios_despoblacion", {
        nacimientoContribuyente: "2000-01-01",
        viviendas: [vivienda("2020-01-01")],
      }),
    ),
  ));
it("N4 edad34 al adquirir2024 conserva anualidad2025 con35", () =>
  expect(
    evaluar(
      solicitud("madrid_vivienda_municipios_despoblacion", {
        nacimientoContribuyente: "1990-01-01",
        viviendas: [vivienda("2024-06-01")],
      }),
    ),
  ).toMatchObject({ importeAntesPresentacionEUR: "1000" }));
it("N3 control compra2024 edad25:1000", () =>
  expect(
    evaluar(
      solicitud("madrid_vivienda_municipios_despoblacion", {
        nacimientoContribuyente: "2000-01-01",
        viviendas: [vivienda("2024-06-01")],
      }),
    ),
  ).toMatchObject({ importeAntesPresentacionEUR: "1000" }));
const descendiente = {
  id: "h",
  relacion: "hijo",
  nacimiento: "2019-01-01",
  rentasNoExentasEUR: "0",
  declaracionTipo: "no_presentada",
  discapacidadPorcentaje: "0",
  situacionDevengo: "vivo",
  certificadoParentesco: "registro",
  alimentos64175: "no",
  titularesMinimo: ["a"],
  titularesDeduccion: ["a"],
  gradoMasCercanoConPrioridad: [],
  progenitores: ["a"],
  convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }],
};
it("N3 vivienda por nacimiento adquirida2020 no abre incentivo2023", () =>
  noPositivo(
    evaluar(
      solicitud("madrid_vivienda_nacimiento_adopcion_hijos", {
        personas: [descendiente],
        viviendas: [vivienda("2020-01-01")],
      }),
    ),
  ));
it("N3 control vivienda por nacimiento2024,evento2022:1000", () =>
  expect(
    evaluar(
      solicitud("madrid_vivienda_nacimiento_adopcion_hijos", {
        personas: [{ ...descendiente, nacimiento: "2022-01-01" }],
        viviendas: [vivienda("2024-01-01")],
      }),
    ),
  ).toMatchObject({ importeAntesPresentacionEUR: "1000" }));

it("magnitud propia de80cifras no pasa por parser de céntimos", () => {
  const s: SolicitudAnualF2025 = {
    lote: "F-ampliado",
    codigo: "madrid_donativos_fundaciones_clubes_deportivos",
    hechos: {
      entidades: [
        {
          id: "e",
          forma: "club_deportivo",
          registro: "registro",
          certificado: "certificado",
        },
      ],
    },
  };
  const { computoBaseEstatalEUR: omitido, ...pago } = p("0");
  expect(omitido).toBe("0");
  const m = magnitudes();
  const r = evaluarAnualF2025(
    { ...s, hechos: { ...s.hechos, pagos: [{ ...pago, importeEUR: "5000" }] } },
    {
      ...m,
      basesLiquidables: {
        general: new Decimal("20000.0000000000000000000000000000000000000001"),
        ahorro: new Decimal(0),
      },
    },
  );
  expect(r.importeAntesPresentacionEUR).toBe(
    "300.0000000000000000000000000000000000000000015",
  );
});

it("reutilizado40 rechaza base interna que exigiría redondeo", () => {
  const m = magnitudes();
  const s: SolicitudAnualF2025 = {
    lote: "F-ampliado",
    codigo: "murcia_deporte_actividades_saludables",
    hechos: { hechosPrevios: {} },
  };
  const r = evaluarAnualF2025(s, {
    ...m,
    caso: { ...m.caso, comunidadAutonoma: "murcia" },
    baseGeneral: new Decimal("20000.0000000000000000000000000000000000000001"),
    baseAhorro: new Decimal(1),
  });
  expect(r.siguienteHecho).toBe(
    "productor_precision80_reutilizado:murcia_deporte_actividades_saludables",
  );
  expect(r.importeAntesPresentacionEUR).toBeUndefined();
});
it("miembro familiar externo no adquiere base propia por sustitución", () => {
  const s: SolicitudAnualF2025 = {
    lote: "F-ampliado",
    codigo: "madrid_condicion_familia_numerosa",
    hechos: { miembrosUnidad: ["a", "tercero"] },
  };
  expect(evaluarAnualF2025(s, magnitudes()).siguienteHecho).toBe(
    "identidad_miembro_unidad:tercero",
  );
});
