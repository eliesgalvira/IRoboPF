import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { casoP4a } from "./inmobiliario-p4a.fixtures"
export function casoExtVacia(ingreso = "36000"): CasoInmobiliarioP4a {
  const c = casoP4a()
  return { ...c, comunidadAutonoma: "extremadura", inmuebles: c.inmuebles.map(v => ({ ...v,
    ubicacion: "extremadura", contrato: { ...v.contrato, firma: "2025-01-01", hasta: "2028-01-01" },
    usosDesdeAdquisicion: [{ desde: "2020-01-01", hasta: "2024-12-31", uso: "a-disposicion" }, { desde: "2025-01-01", hasta: "2025-12-31", uso: "alquiler-vivienda" }],
    exigibilidades: v.exigibilidades.map(x => ({ ...x, importe: ingreso })),
    vaciaExt2025: {
      construccionTerminada: "2010-01-01", documentoConstruccion: "OBRA", naturaleza: "urbana-residencial-terminada-habitable", anejos: "ninguno",
      censoDerechos: { documento: "CENSO-MUNDIAL", desde: "2024-01-01", hasta: "2025-12-31", cobertura: "mundial-propiedad-usufructo-cualquier-porcentaje", inmuebles: [v.id] },
      catastro2024: { documento: "CATASTRO2024", municipio: "Merida", suelo: "10000", construccion: "50000", notificacion: "2011-12-01", entradaVigor: "2012-01-01", procedimiento: "colectivo-general", vigencia: "sin-variaciones-2024" },
      observaciones2024: [{ desde: "2024-01-01", hasta: "2024-12-31", documento: "USOS-INSPECCION-SUMINISTROS2024", ocupacion: "ninguna", afectacion: "ninguna", obras: "ninguna", impedimentoUrbanistico: "ninguno" }],
      observacion2025: { hasta: "2025-12-31", documento: "OCUPACION2025", arrendatario: "inquilino", ocupacionDesde: "2025-01-01", incidencias: "ninguna" }, procedimientos: [],
    },
  })), deduccionesTerritoriales2025: { solicitudes: [{ lote: "D51", codigo: "extremadura_arrendadores_viviendas_vacias", hechos: { exhaustividad: "completa", viviendas: [{ id: "V1", diasVaciaAntes: 366, inicioContrato: "2025-01-01", finContrato: "2028-01-01", destino: "habitual" }] } }] } }
}
