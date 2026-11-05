import {Schema} from "effect"
import {CasoFiscalAnualExplicito} from "../../lib/dominio/irpf/trabajo-anual/conexion-contrato"
export function casoExplicitoC36(
  solicitudes
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
