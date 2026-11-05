import type { HechosMaternidad2025 } from "../lib/dominio/irpf/maternidad-2025/contrato"
import type { Ambito81 } from "../lib/dominio/irpf/maternidad-2025/producir"
import type { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"

export function hechos81(meses=12, gastoCentimos=120000): HechosMaternidad2025 {
  const porMes=Math.floor(gastoCentimos/meses), resto=gastoCentimos%meses
  const moneda=(n:number)=>`${Math.floor(n/100)}.${String(n%100).padStart(2,"0")}`
  const fin=(m:number)=>`2025-${String(m).padStart(2,"0")}-${m===2?28:[4,6,9,11].includes(m)?30:31}`
  return {
    ejercicio:2025,beneficiaria:"s-1",residencia:{pais:"ES",desde:"2020-01-01",hasta:"2026-12-31",referencia:"residencia"},censo:"todos_hijos_progenitores_facturas_ayudas_anticipos",
    hijos:[{
      id:"s-2",nacimiento:"2023-01-01",filiacion:"biologica",convivencia:"estable_2025",segundoCiclo:{calendario:"no_cumple3_2025"},
      progenitores:[{id:"s-1",papel:"madre_biologica",altas:[{desde:"2020-01-01",hasta:"2026-12-31",referencia:"ss",regimen:"seguridad_social"}],actividades:[{desde:"2020-01-01",hasta:"2026-12-31",referencia:"empleo",empresa:"empresa1",clase:"cuenta_ajena"}]}],
      antecedenteInfancia2022:"sin_cobros_2022",
      calendario:Array.from({length:12},(_,i)=>({mes:i+1,complementoInfancia:[],contratos:i<meses?[{centro:"centro1",desde:`2025-${String(i+1).padStart(2,"0")}-01`,hasta:fin(i+1),referencia:`contrato${i+1}`}]:[]})),
      centros:[{id:"centro1",nif:"B00000000",municipio:"47186",clase:"guarderia",autorizacion:{desde:"2020-01-01",hasta:"2026-12-31",referencia:"licencia_apertura",clase:"apertura_funcionamiento_municipal",autoridad:"ayuntamiento"},registroCyl:{estado:"inscrito",desde:"2020-01-01",hasta:"2026-12-31",referencia:"registro_cyl"}}],
      facturas:Array.from({length:meses},(_,i)=>({id:`factura${i+1}`,centro:"centro1",mes:i+1,concepto:"asistencia",pagos:[{id:`pago${i+1}`,fecha:fin(i+1),pagador:"s-1",importe:moneda(porMes+(i<resto?1:0))}],pagosEmpresa:[]})),
      ayudas:[],anticipos140:[],
    }],
  }
}
export function derechos81(nacimiento="2023-01-01",rentaMadre=2800000): DerechosMinimosAnuales {
  return {ejercicio:2025,territorio:"castilla-y-leon",regimen:"comun",modalidad:"individual",devengo:"2025-12-31",contribuyenteId:"s-1",edadContribuyenteDevengo:40,discapacidadContribuyente:{_tag:"SinDiscapacidad"},ascendientes:"ninguno",fallecimientosEnElEjercicio:"ninguno",descendientesCompletos:true,conciliacionRentasContribuyente:{perfil:"caso-anual-parcial",otrasRentasOGastosNoRepresentados:"ninguno"},descendientes:[{sujetoId:"s-2",fechaNacimiento:nacimiento,edadDevengo:2025-Number(nacimiento.slice(0,4)),vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:"no-presenta"},discapacidad:{_tag:"SinDiscapacidad"},titularesCompletos:true,titulares:[{titularId:"s-1",grado:1,vinculo:{clase:"consanguinidad"},relacion:"convivencia",custodia:"no-procede",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:rentaMadre}]}]}
}
export function ambito81(nacimiento="2023-01-01"): Ambito81 {
  return {anio:2025,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},derechosMinimos:derechos81(nacimiento)}
}
