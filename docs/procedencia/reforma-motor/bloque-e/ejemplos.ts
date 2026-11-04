import type { CasoFiscalAnual } from "../../../../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../../../../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { DerechosMinimos2025 } from "../../../../lib/dominio/irpf/minimos/derechos-contrato"

export const analitico: CasoFiscalAnual = {
  anio: 2025,
  comunidadAutonoma: "madrid",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: { _tag: "SinDiscapacidad" },
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
}
export const efectivo: Extract<CasoFiscalAnualExplicito, { readonly ejercicio: 2025 }> = {
  ejercicio: 2025,
  comunidadAutonoma: "madrid",
  edad: 40,
  modalidad: "individual",
  residenciaTodoElAnio: true,
  devengo: "2025-12-31",
  otrasRentas: "ninguna",
  familiaresConDerechoMinimo: "ninguno",
  discapacidad: "ninguna",
  reduccionesBase: "ninguna",
  saldosAnteriores: "ninguno",
  deducciones: "solo-da61-si-procede",
  rentasExtranjeras: "ninguna",
  especialidades: "ninguna",
  perfil: "solo-trabajo",
  conciliacion: {
    ejercicio: 2025,
    estado: "totales-anuales-sin-duplicados",
    procedencia: ["certificado-sintetico"],
  },
  trabajo: {
    ejercicio: 2025,
    territorio: "comun",
    reduccionesArt18: "ninguna",
    movilidad: "ninguna",
    discapacidadActiva: "ninguna",
    rendimientos: [
      {
        id: "pagador-a",
        clase: "empleo-laboral",
        integro: "30000",
        cotizaciones: {
          clase: "efectivas",
          seguridadSocial: "1944",
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
}
export const derechos: DerechosMinimos2025 = {
  ejercicio: 2025,
  territorio: "madrid",
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
      sujetoId: "s-3",
      edadDevengo: 8,
      fechaNacimiento: "2017-01-01",
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
}
export const conDerechos = { ...analitico, derechosMinimos: derechos }
