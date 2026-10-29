import { Effect } from 'effect'
import { calcularRetencionTrabajoAeat, type CasoRetencionTrabajo } from '../../../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat'
import { tablaUmbralesRetencionTrabajo } from '../../../../lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026'
const base: CasoRetencionTrabajo = {
  anio: 2020, edad: 40, retribucionAnualCentimos: 1800000, cotizacionesCentimos: 114300,
  situacionFamiliar: 'situacion3', situacionLaboral: 'activo', contrato: 'general',
  descendientes: [], ascendientes: [], discapacidad: 'sin-discapacidad',
  movilidadGeografica: false, movilidadReducidaPerceptor: false, irregular1Centimos: 0,
  irregular2Centimos: 0, pensionCompensatoriaConyugeCentimos: 0, anualidadesAlimentosHijosCentimos: 0,
  residenciaCeutaMelilla: false, rendimientosCeutaMelilla: false, pagosViviendaHabitual: false,
}
const hijo = (edad: number) => ({edad, computoPorEntero: false, discapacidad: 'sin-discapacidad' as const, movilidadReducida: false, adopcionOAcogimientoMenosTresAnios: false})
const casos: Array<{id: string; input: CasoRetencionTrabajo; expectedImporte?: number | undefined; scope: string}> = []
for (const anio of [2020,2021,2022,2023,2024,2025,2026] as const) {
 casos.push({id:`ordinario-${anio}`,input:{...base,anio},expectedImporte:anio<=2022?171900:anio===2023?114120:91260,scope: 'Versión de cierre, cotización suministrada sintética constante; no cálculo SS'})
}
for (const anio of [2020,2021] as const) casos.push({id:`alto-${anio}`,input:{...base,anio,retribucionAnualCentimos:40000000,cotizacionesCentimos:0},expectedImporte:anio===2020?16892000:17088000,scope:'Aislamiento escala, cotización cero sintética'})
for (const retribucionAnualCentimos of [2199999,2200000,2200001,3520000,3520001]) casos.push({id:`corte-${retribucionAnualCentimos}`,input:{...base,retribucionAnualCentimos,cotizacionesCentimos:0,situacionFamiliar:'situacion2',descendientes:[hijo(10),hijo(12)]},expectedImporte:retribucionAnualCentimos===2200001?263780:undefined,scope:'Dos hijos elegibles por mitad; cónyuge elegible; RED20 cero'})
for (const edad of [24,25]) casos.push({id:`hijo-${edad}`,input:{...base,anio:2026,retribucionAnualCentimos:3000000,descendientes:[hijo(edad)]},scope:'Edad 25 sin discapacidad: debería excluirse o rechazarse'})
for (const convivencia of [1,0]) casos.push({id:`divisor-${convivencia}`,input:{...base,anio:2026,retribucionAnualCentimos:3000000,ascendientes:[{edad:70,convivencia,discapacidad:'sin-discapacidad',movilidadReducida:false}]},scope:'Cero debe rechazarse, uno control'})
for (const irregular1Centimos of [9000000,9000001,15000000]) casos.push({id:`irregular-${irregular1Centimos}`,input:{...base,anio:2026,retribucionAnualCentimos:30000000,cotizacionesCentimos:0,irregular1Centimos},scope:'Límite reducción comunicada 90000 y 30% retribución'})
casos.push({id:'irregular-30',input:{...base,anio:2026,retribucionAnualCentimos:10000000,irregular1Centimos:3000001},scope:'Supera 30% aunque no 90000'})
for (const contrato of ['general','inferior-anio','especial'] as const) casos.push({id:`minimo-${contrato}`,input:{...base,anio:2026,retribucionAnualCentimos:1000000,contrato},scope:'Control mínimo de contrato; no decide clasificación artistas'})
const resultados = []
for (const caso of casos) {
 const exit = await Effect.runPromiseExit(calcularRetencionTrabajoAeat(caso.input,{modo:'canonico'}))
 const nonFinite = exit._tag === 'Success' ? Object.entries(exit.value).filter(([key, value]) => key.endsWith('Centimos') && !Number.isFinite(value)).map(([key, value]) => ({key, value: String(value)})) : []
 resultados.push({...caso,exit, nonFinite, matchesExpected: exit._tag === 'Success' && caso.expectedImporte !== undefined ? exit.value.importeRetencionAnualCentimos === caso.expectedImporte : null})
}

const tablas = []
for (const anio of [2020,2021,2022,2023,2024,2025,2026] as const) {
 for (const fecha of [`${anio}-01-01`,`${anio}-02-01`,`${anio}-02-08`,`${anio}-06-28`,`${anio}-09-10`,`${anio}-10-21`,`${anio}-11-27`]) {
  tablas.push({anio,fecha,tabla:tablaUmbralesRetencionTrabajo({anio,fecha})})
 }
}
process.stdout.write(JSON.stringify({resultados,tablas,fechas:["2023-01-31","2023-02-01","invalid","2022-12-31"].map(fecha=>({fecha,tabla:tablaUmbralesRetencionTrabajo({anio:2023,fecha})}))},null,2))
