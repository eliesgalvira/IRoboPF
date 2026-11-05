import Decimal from "decimal.js"
import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales as M } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import {
  DonacionesC36,
  ViviendaC36,
  FamiliaC36,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import {
  DonacionCHechos,
  ViviendaCHechos,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas-base"
import { donacionC, viviendaC } from "./canarias-balears-ampliacion.fixtures"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"

export function magnitudesConexionC36(
  territorio: M["caso"]["comunidadAutonoma"] = "canarias"
): M {
  return {
    caso: {
      anio: 2025,
      comunidadAutonoma: territorio,
      contribuyenteId: "s-1",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        discapacidad: { _tag: "SinDiscapacidad" },
        descendientes: [],
        ascendientes: [],
      },
    },
    baseGeneral: new Decimal("20000.123456789123456789"),
    baseAhorro: new Decimal(0),
    basesLiquidables: {
      general: new Decimal("20000.123456789123456789"),
      ahorro: new Decimal(0),
    },
    minimoPersonalFamiliar: new Decimal(5550),
    cuotaAutonomica: new Decimal(1000),
    sujetosConMinimo: [],
    atribucionesMinimo: [],
    rentasTrabajoAnuales: {
      integroTrabajo: new Decimal(30000),
      restoRentas: new Decimal(0),
    },
  }
}
export function donativoConexionC36(
  codigo: (typeof DonacionesC36.Type)["codigo"] = "canarias_donaciones_finalidad_ecologica",
  importe = "1000"
): typeof DonacionesC36.Type {
  const d = donacionC()
  d.id = "D" + codigo
  d.certificado = "CERT" + codigo
  d.entidad.finalidad =
    codigo === "canarias_donaciones_patrimonio_historico"
      ? "patrimonio"
      : codigo === "canarias_donaciones_finalidad_ecologica"
        ? "medio_ambiente_exclusivo"
        : codigo === "balears_fomento_lengua_catalana"
          ? "lengua_catalana"
          : "cultura"
  d.entidad.territorio = codigo.startsWith("canarias_")
    ? "canarias"
    : "illes-balears"
  d.pagos = [
    {
      ...d.pagos[0],
      pagador: "s-1",
      id: "P" + codigo,
      factura: "F" + codigo,
      importe,
      distribucion: [{ persona: "s-1", porcentaje: "100" }],
    },
  ]
  // La fixture selecciona hechos físicos de la recepción congelada. El contrato
  // público se prueba por separado con exceso de propiedades intencionado.
  const datos = Schema.decodeUnknownSync(DonacionCHechos)(d)
  return {
    lote: "C36",
    codigo,
    hechos: {
      donaciones: [datos],
      ordenTramoInicial: [d.id],
      historiaDonativos: [],
      censoHistoria2023Y2024: "completo",
      exhaustividad: "completa",
    },
  }
}
export function viviendaConexionC36(
  codigo: (typeof ViviendaC36.Type)["codigo"],
  sufijo = "1"
): typeof ViviendaC36.Type {
  const v = viviendaC()
  v.id = "V" + sufijo
  v.catastro = "RC" + sufijo
  v.gastos = [
    {
      ...v.gastos[0],
      id: "P" + sufijo,
      factura: "F" + sufijo,
      pagador: "s-1",
      importe: "10000",
      distribucion: [{ persona: "s-1", porcentaje: "100" }],
      concepto:
        codigo === "canarias_rehabilitacion_energetica_vivienda"
          ? "energia"
          : codigo === "canarias_adecuacion_vivienda_discapacidad"
            ? "accesibilidad"
            : "reparacion",
    },
  ]
  const datos = Schema.decodeUnknownSync(ViviendaCHechos)(v)
  return {
    lote: "C36",
    codigo,
    hechos: {
      nacimientoContribuyente: "1985-01-01",
      viviendas: [
        {
          ...datos,
          uso: "habitual_propia",
          propietarios: [
            { persona: "s-1", porcentaje: "100", titulo: "TIT" + sufijo },
          ],
          certificadoNecesidadAccesibilidad: "DISC1",
          historiaContratos: [],
          censoContratos: "completo_desde_adquisicion",
        },
      ],
      exhaustividad: "completa",
    },
  }
}
export function derechosConexionC36(): DerechosMinimosAnuales {
  return {
    ejercicio: 2025,
    territorio: "illes-balears",
    regimen: "comun",
    modalidad: "individual",
    devengo: "2025-12-31",
    contribuyenteId: "s-1",
    edadContribuyenteDevengo: 40,
    discapacidadContribuyente: { _tag: "SinDiscapacidad" },
    ascendientes: "ninguno",
    fallecimientosEnElEjercicio: "ninguno",
    descendientesCompletos: true,
    conciliacionRentasContribuyente: {
      perfil: "caso-anual-parcial",
      otrasRentasOGastosNoRepresentados: "ninguno",
    },
    descendientes: [
      {
        sujetoId: "s-2",
        fechaNacimiento: "2025-02-01",
        edadDevengo: 0,
        vivoAlDevengo: true,
        rentasNoExentasCentimos: 0,
        declaracion: { modalidad: "no-presenta" },
        discapacidad: { _tag: "SinDiscapacidad" },
        titulares: [
          {
            titularId: "s-1",
            grado: 1,
            vinculo: { clase: "consanguinidad" },
            relacion: "convivencia",
            custodia: "exclusiva",
            alimentosJudiciales: false,
            aplicaEspecialidadAlimentos: false,
            residenteIrpf: true,
            rentasNoExentasCentimos: 2000012,
          },
        ],
        titularesCompletos: true,
      },
    ],
  }
}
export function magnitudesConFamiliaC36(): M {
  const m = magnitudesConexionC36("illes-balears")
  return {
    ...m,
    caso: { ...m.caso, derechosMinimos: derechosConexionC36() },
    sujetosConMinimo: ["s-2"],
    atribucionesMinimo: [{ sujetoId: "s-2", titulares: ["s-1"] }],
  }
}
export function nacimientoConexionC36(): typeof FamiliaC36.Type {
  return {
    lote: "C36",
    codigo: "balears_nacimiento",
    hechos: {
      contribuyente: {
        nacimientoContribuyente: "1985-01-01",
        naturalezaDiscapacidad: "fisica_sensorial",
        resolucionDiscapacidad: "",
        familia: {
          categoria: "ordinaria",
          titulo: "",
          titulares: ["s-1"],
          descendientes: ["s-2"],
          desde: "2025-01-01",
          hasta: "2025-12-31",
        },
        residenciaFiscal2024: "illes-balears",
        documentoResidencia2024: "RES2024",
        altasRETA: [],
        alteracionFamilia: "",
        otrosConvivientes: [],
      },
      personas: [
        {
          id: "s-2",
          convivencia: [{ desde: "2025-02-01", hasta: "2025-12-31" }],
          expediente: "RCN1",
        },
      ],
      cuotasHogar: [],
      ayudasNacimiento: [],
      registroCobrosNacimiento: {
        consulta: "registro-administrativo-particular",
        censo: "completo",
        cobros: [],
      },
      censoDescendientes: ["s-2"],
      censoPersonas: "completo_segun_nucleo_v4",
      exhaustividad: "completa",
    },
  }
}
export function casoUniformeC36(): CasoFiscalAnual {
  const m = magnitudesConexionC36()
  return {
    ...m.caso,
    anio: 2025,
    situacionFamiliar: m.caso.situacionFamiliar,
    rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
    reducciones: [],
    deducciones: [],
    retencionesSoportadasCentimos: 0,
    pagosACuentaCentimos: 0,
  }
}
export function casoExplicitoC36(
  solicitudes: readonly (typeof import("../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas").SolicitudAnualC36.Type)[]
) {
  const caso = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
    ejercicio: 2025,
    comunidadAutonoma: "canarias",
    contribuyenteId: "s-1",
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
    deduccionesTerritoriales2025: { solicitudes },
    rentasExtranjeras: "ninguna",
    especialidades: "ninguna",
    perfil: "solo-trabajo",
    conciliacion: {
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["CERT-TRABAJO"],
    },
    trabajo: {
      ejercicio: 2025,
      territorio: "comun",
      reduccionesArt18: "ninguna",
      movilidad: "ninguna",
      discapacidadActiva: "ninguna",
      rendimientos: [
        {
          id: "trabajo",
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
  })
  if (caso.ejercicio !== 2025 || caso.perfil !== "solo-trabajo")
    throw new RangeError("Fixture C36 fuera de alcance")
  return caso
}
