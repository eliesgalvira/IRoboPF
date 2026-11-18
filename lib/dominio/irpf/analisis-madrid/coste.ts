import Decimal from "decimal.js"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../../laboral/cotizaciones-perfil-uniforme"
import { obtenerParametrosCotizacionLegacy } from "../../laboral/cotizaciones-sociales"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import calendario from "../../../../docs/analisis-madrid/calendario-oficina.json"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
export const PERFIL_OFICINA = "oficina-exclusiva-grupo7-cnae62-rg-indefinido-completa-12uniformes-v1"
/** Selección sintética de un perfil completo; no certifica hechos ni convenio. */
export function estimarOficina(anio: AnioFiscal, salario: Decimal, perfil: typeof PERFIL_OFICINA) {
  if (perfil !== PERFIL_OFICINA) throw new RangeError("Perfil histórico de oficina no declarado")
  const periodos = calendario.periodos.filter(p => p.anio === anio)
  if (periodos.reduce((n,p) => n + p.hastaMes - p.desdeMes + 1, 0) !== 12) throw new RangeError("Calendario incompleto")
  // Sin mínimos vinculantes Bcc=Bcp; el diferencial sobre el desglose compartido es exacto.
  for (const p of periodos) {
    if (salario.lt(new D(p.minimoCC).mul(12)) || salario.mul(p.minimoCP.denominador).lt(new D(p.minimoCP.numerador).mul(12)))
      throw new RangeError("Fuera de perfil: remuneración inferior al mínimo mensual CCgrupo7/CP; no se estima")
  }
  const legacy = calcularDesgloseCotizacionesPerfilUniforme({ anio, salarioBrutoAnual: salario })
  const parametros = obtenerParametrosCotizacionLegacy(anio)
  const it = anio === 2018 ? "0.0065" : "0.008", ims = anio === 2018 ? "0.0035" : "0.007"
  const diferencial = new D(legacy.baseOrdinaria).mul(new D(it).plus(ims).minus("0.015"))
  const ordinaria = new D(legacy.cotizacionEmpresarialOrdinaria).plus(diferencial)
  return { ...legacy, cotizacionEmpresarialOrdinaria: ordinaria,
    cotizacionEmpresarial: ordinaria.plus(legacy.meiEmpresarial).plus(legacy.solidaridadEmpresarial),
    metodo: PERFIL_OFICINA, naturaleza: "estimacion-anual-continua-sin-ingreso-TGSS", perfil: calendario.perfil,
    bases: { CC: legacy.baseOrdinaria.toFixed(), CP: legacy.baseOrdinaria.toFixed(), minimosNoVinculantes: true },
    periodos, AT: { it, ims, total: new D(it).plus(ims).toFixed(), diferencialLegacyEUR: diferencial.toFixed(),
      fuentes: "docs/analisis-madrid/fuentes-metodo-ipc-coste.json", relevo2025: "DA4 hasta24/12; LGSS DA61 desde25/12; mismo1.5%" },
    tipos: { ordinariosCompartidos: Object.fromEntries(Object.entries(parametros.tiposSeguridadSocial).filter(([k]) => k !== "atep").map(([k,v]) => [k, { empresa: v.empresarial.toFixed(), trabajador: v.trabajador.toFixed() }])),
      MEI: { empresa: parametros.mei.empresarial.toFixed(), trabajador: parametros.mei.trabajador.toFixed() },
      solidaridad: anio === 2025 ? { empresa: ["0.0077", "0.0083", "0.0098"], trabajador: ["0.0015", "0.0017", "0.0019"], limitesExceso: ["0.1*tope", "0.5*tope"] } : null },
    fuenteCalendario: "docs/analisis-madrid/calendario-oficina.json",
    fuentesTipos: "docs/analisis-madrid/fuentes-ipc-ss-2018-2025.json#/ss",
    advertencia: "No acredita salario legal, convenio, hechos laborales ni cuota ingresable; sin redondeo mensual TGSS",
  }
}
