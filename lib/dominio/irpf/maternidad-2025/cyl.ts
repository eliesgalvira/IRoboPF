import Decimal from "decimal.js"
import { cuidadoMenoresCyl, type ResultadoHechos } from "../deducciones/castilla-y-leon-hechos-2025"
import type { MagnitudesTerritorialesAnuales } from "../deducciones/anual-territorial"
import type { SolicitudCuidadoCyl81 } from "./contrato"
import { exigir81, type LibroMaternidad81 } from "./producir"

const D=Decimal.clone({precision:200})
/** Reutiliza la fórmula regional; no admite ni recalcula un incremento externo. */
export function evaluarCuidadoCyl81(s: SolicitudCuidadoCyl81, m: MagnitudesTerritorialesAnuales): ResultadoHechos {
  const libro=m.libroMaternidad81
  exigir81(libro!==undefined,"CyL necesita el libro81 de esta composición; no pedir incremento al cliente")
  exigir81(libro.hijos.length===1,"CyL: varios niños requieren techo regional agregado y atribución por niño; primera rama un niño")
  exigir81(m.caso.comunidadAutonoma==="castilla-y-leon" && m.caso.contribuyenteId===libro.beneficiaria,"libro81 de otra anual/persona")
  const h=libro.hijos.find(h=>h.hijo===s.hechos.hijo)
  exigir81(h!==undefined,"CyL: niño no producido nominalmente por art81")
  const p=m.caso.derechosMinimos?.descendientes.find(p=>p.sujetoId===h.hijo)
  exigir81(p!==undefined && p.titulares.length===1 && p.titulares[0].titularId===libro.beneficiaria,"CyL: otra titularidad necesita cálculo nominal y techo de ambos progenitores")
  exigir81(m.atribucionesMinimo?.some(a=>a.sujetoId===h.hijo && a.titulares.length===1 && a.titulares[0]===libro.beneficiaria)===true,"CyL: reparto único no conciliado")
  exigir81(m.rentasTrabajoAnuales?.integroTrabajo.gt(0)===true || m.rentaActividadAnualB?.gt(0)===true,"CyL: actividad propia no representada en esta anual")
  exigir81(h.hechos.facturas.every(f=>f.pagosEmpresa.length===0),"CyL: gasto empresarial en especie necesita atribución regional; art81 sí lo netea")
  exigir81(h.hechos.ayudas.every(a=>a.programa!=="analoga_junta"),"CyL: ayuda análoga de la Junta concedida, selección regional incompatible")
  const completos=h.hechos.calendario.filter(m=>h.meses.some(x=>x.mes===m.mes && x.contratoCompleto))
  for(const mes of completos){
    for(const contrato of mes.contratos){
      const centro=h.hechos.centros.find(c=>c.id===contrato.centro)
      exigir81(centro!==undefined && ["05","09","24","34","37","40","42","47","49"].includes(centro.municipio.slice(0,2)) && centro.registroCyl.estado==="inscrito" && centro.registroCyl.desde<=contrato.desde && centro.registroCyl.hasta>=contrato.hasta,"CyL: centro sin registro autonómico/ubicación conciliada para el período")
      for(const padre of h.hechos.progenitores){
        exigir81(padre.actividades.some(a=>a.desde<=contrato.desde && a.hasta>=contrato.hasta) && padre.altas.some(a=>a.desde<=contrato.desde && a.hasta>=contrato.hasta),"CyL: falta actividad/alta de progenitor en el período de cuidado")
      }
    }
  }
  exigir81(h.pagosRegionales.every(p=>p.pagador===libro.beneficiaria),"CyL: gasto de otro pagador requiere atribución nominal; estatal conserva el pago parental entero")
  let divisor=BigInt(h.incremento.divisor)
  while(divisor%2n===0n)divisor/=2n
  while(divisor%5n===0n)divisor/=5n
  exigir81(divisor===1n,"CyL: incremento periódico requiere transporte racional regional; no aproximar")
  const incremento=new D(h.incremento.numeradorEuros).div(h.incremento.divisor).toFixed()
  const ayudas=new D(h.ayudasRegionales.numeradorEuros).div(h.ayudasRegionales.divisor).toFixed()
  const marco={ejercicio:2025,territorio:"castilla-y-leon",modalidad:"individual",contribuyente:libro.beneficiaria,declarantes:[libro.beneficiaria],baseGeneral:m.baseGeneral.toFixed(),baseAhorro:m.baseAhorro.toFixed(),minimoPersonalFamiliar:m.minimoPersonalFamiliar.toFixed()}
  const magnitud={ejercicio:2025,declarantes:[libro.beneficiaria],concepto:"incremento_estatal_maternidad",valor:incremento}
  return cuidadoMenoresCyl(marco,{
    opcion:"centro",hijos:[{id:h.hijo,nacimiento:h.hechos.nacimiento,titularesMinimo:[libro.beneficiaria]}],
    mesesCompletos:completos.length,pagos:h.pagosRegionales.map(p=>({...p})),ayudas,
    incrementoEstatalMaternidad:magnitud,progenitoresActividad:[libro.beneficiaria],progenitoresAlta:[libro.beneficiaria],exhaustividad:"completa",
  })
}

/** Pagos del mismo libro81: evita contar otra vez una factura al seleccionar CyL. */
export function operaciones81(libro: LibroMaternidad81 | undefined): readonly string[] {
  return libro?.hijos.flatMap(h=>h.hechos.facturas.flatMap(f=>[f.id,...f.pagos.map(p=>p.id),...f.pagosEmpresa.map(p=>p.id)]))??[]
}
