import type { CasoGaliciaMixto2025 } from "../lib/dominio/irpf/galicia-mixto-2025/contrato"
import { galiciaInversion } from "./galicia-alquiler-inversion.fixtures"
import { social } from "./aragon-social-mixto.fixtures"

export function galiciaMixto(
  bruto = "20000",
  rentaIntegra = "8900",
  ss = "1000"
): CasoGaliciaMixto2025 {
  const inmueble = galiciaInversion(false, rentaIntegra)
  const trabajo = social(bruto).trabajo
  return {
    perfil: "galicia-trabajo-inmueble-2025",
    ejercicio: 2025,
    comunidadAutonoma: "galicia",
    modalidad: "individual",
    devengo: "2025-12-31",
    residenciaTodoElAnio: true,
    contribuyenteId: "s-1",
    liquidacionId: "GAL-MIXTA-2025",
    edad: 35,
    familiares: "ninguno",
    discapacidad: "ninguna",
    otrasRentas: "ninguna",
    reduccionesBase: "ninguna",
    compensaciones: "ninguna",
    otrasDeducciones: "ninguna",
    censoInmobiliario: {
      documento: "CENSO-MUNDIAL",
      cobertura: "mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025",
      inmuebles: ["V1"],
    },
    inmuebles: inmueble.inmuebles,
    trabajo: {
      ...trabajo,
      rendimientos: trabajo.rendimientos.map((r) => ({
        ...r,
        cotizaciones: { ...r.cotizaciones, seguridadSocial: ss },
      })),
    },
    conciliacion: {
      contribuyenteId: "s-1",
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["CERT-LABORAL"],
    },
    retenciones: [
      {
        id: "RET-LAB",
        documento: "RET-LAB-DOC",
        contribuyenteId: "s-1",
        ejercicio: 2025,
        fecha: "2025-12-31",
        importe: "100",
      },
    ],
    deduccionesTerritoriales2025: inmueble.deduccionesTerritoriales2025!,
  }
}
