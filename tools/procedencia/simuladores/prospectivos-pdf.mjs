/** Correspondencia de casillas del borrador con hechos y predicción previa.
 * No calcula IRPF: lee magnitudes de P y concilia sus sumas/restas declaradas.
 */
import {validatePDFContract} from './prospectivos-estructura.mjs';
import {need, equal, decimal, add, sub, quant} from './prospectivos-core.mjs';

const cents = ([n,d]) => {
  need(d>0n && n>=0n && n*100n%d===0n,'PDF-magnitud-centimos');
  const v=n*100n/d;
  return `${v/100n}.${String(v%100n).padStart(2,'0')}`;
};
const format = value => {
  const [a,b]=cents(decimal(value)).split('.');
  return `${a.replace(/\B(?=(\d{3})+(?!\d))/g,'.')},${b}`;
};
const date = value => {need(/^\d{4}-\d{2}-\d{2}$/.test(value),'PDF-fecha');return value.split('-').reverse().join('/');};

export function validatePdf(rows, contract, H, P) {
  need(equal(rows,contract),'PDF-completo-pagina-posicion-texto');
  validatePDFContract(rows,H.id);
  const h=H.entrada, p=P.result, c=p.composicion, a=p.politicaOpen;
  const w=h.trabajo.rendimientos[0], v=h.inmuebles[0];
  const netoPrevio=cents(sub(decimal(w.integro),decimal(w.cotizaciones.seguridadSocial)));
  const gastosTrabajo=cents(sub(decimal(netoPrevio),decimal(p.rendimientoNetoTrabajo)));
  const liquidaAutonomica=cents(sub(decimal(c.cuotaAutonomicaGeneralDespuesMinimo),decimal(c.deduccionesAutonomicasAplicadas)));
  const numbers={
    '0003':w.integro,'0012':w.integro,'0013':w.cotizaciones.seguridadSocial,
    '0017':netoPrevio,'0018':netoPrevio,'0019':gastosTrabajo,
    '0022':p.rendimientoNetoTrabajo,'0025':p.rendimientoNetoTrabajo,
    '0063':'100','0102':a.ingresos,'0106':a.gastos,'0107':a.gastos,
    '0123':cents(add(decimal(v.catastro2025.construccion),decimal(v.catastro2025.suelo))),
    '0124':v.catastro2025.construccion,'0125':a.porcentaje,'0126':v.adquisicion.precio,
    // Sólo la presentación se cuantiza. La desigualdad exacta de Madrid sigue en GH.
    '0130':cents(quant(decimal(a.costeOperativo))),'0131':a.amortizacion,
    '0149':a.neto,'0150':a.reduccion,'0154':a.netoReducido,'0156':a.netoReducido,
    '0432':p.baseImponibleGeneral,'0435':p.baseImponibleGeneral,'0460':'0',
    '0500':c.baseLiquidableGeneral,'0505':c.baseLiquidableGeneral,'0510':c.baseLiquidableAhorro,
    '0511':c.minimoContribuyente,'0512':c.parametrosComunidad.minimosAutonomicos.contribuyente.general,
    '0519':c.minimoPersonalYFamiliar,'0520':c.minimoPersonalYFamiliarAutonomico,
    '0521':c.minimoPersonalYFamiliar,'0522':'0','0523':c.minimoPersonalYFamiliarAutonomico,'0524':'0',
    '0528':c.cuotaIntegraGeneralEstatal,'0529':c.cuotaIntegraGeneralAutonomica,
    '0530':c.cuotaMinimoPersonalEstatal,'0531':c.cuotaMinimoPersonalAutonomica,
    '0532':c.cuotaEstatalDespuesMinimo,'0533':c.cuotaAutonomicaGeneralDespuesMinimo,
    '0534':c.nodosFiscalesB2025.tiposMediosGenerales.estatal,
    '0535':c.nodosFiscalesB2025.tiposMediosGenerales.autonomico,
    '0536':'0','0537':'0','0538':'0','0539':'0','0540':'0','0541':'0','0542':'0','0543':'0',
    '0545':c.cuotaEstatalDespuesMinimo,'0546':c.cuotaAutonomicaGeneralDespuesMinimo,
    '0564':c.deduccionesAutonomicasAplicadas,'0570':c.cuotaEstatalDespuesMinimo,
    '0571':liquidaAutonomica,'0585':c.cuotaEstatalDespuesMinimo,'0586':liquidaAutonomica,
    '0587':c.cuotaLiquida,'0595':c.cuotaLiquida,'0596':p.retenciones,'0609':p.retenciones,
    '0610':p.cuotaDiferencial,'0670':p.cuotaDiferencial,'0671':liquidaAutonomica,'0675':liquidaAutonomica,
    '1396':v.gastos[0].importe,
  };
  if(h.comunidadAutonoma==='madrid')numbers['1116']=c.deduccionesAutonomicasAplicadas;
  if(h.comunidadAutonoma==='asturias')numbers['1628']=c.deduccionesAutonomicasAplicadas;
  // Identidades de roles de esta proyección sintética, no identificadores reales.
  const text={
    '0002':'PRUEBA C OPEN','0005':'Hombre','0006':'(1) Soltero/a','0010':'01/01/1985',
    '0070':({madrid:'MADRID',andalucia:'ANDALUCÍA',asturias:'PRINCIPADO DE ASTURIAS'})[h.comunidadAutonoma],'0068':'X',
    '0062':'DECLARANTE','0065':'1','0066':'9999999ZZ9999Z0001OI','0067':'X',
    '0069':'CALLE PRUEBA SINTETICA 1','0075':'X','0091':'90000001N',
    '0093':date(v.contrato.firma),'0100':'X','0101':'365','0118':'X',
    '0120':date(v.adquisicion.fecha),'0122':'365',
    '1393':'DECLARANTE','1394':'9999999ZZ9999Z0001OI','1395':'90000002J',
  };
  const seen=new Set();let finalDocument=0,referenceDocument=0;
  for(const row of rows){
    const ss=row.segments;
    need(Array.isArray(ss)&&ss.length>0,'PDF-segmentos');
    const last=ss.at(-1),box=last.value;
    // Casillas a la derecha de los folios de renta: el censo fija página y ambas coordenadas.
    if(h.comunidadAutonoma==='asturias' && box==='0070' && ss.length===2 && last.x===553.43164){
      need(ss[0].value===text['0070'],'PDF-correspondencia:0070');seen.add(box);
    }else if(ss.length===3 && last.x===553.43164 && /^\d{4}$/.test(box)){
      let expected;
      if(box==='0001')expected=ss[0].value==='NIF'?'90000000B':'DECLARANTE';
      else if(Object.hasOwn(numbers,box))expected=format(numbers[box]);
      else expected=text[box];
      need(expected!==undefined&&ss[1].value===expected,'PDF-correspondencia:'+box);
      seen.add(box);
    }else if(row.page===4&&row.text.startsWith('Resultado a ingresar o devolver : ')){
      need(row.text==='Resultado a ingresar o devolver : '+format(p.cuotaDiferencial),'PDF-documento-resultado');finalDocument++;
    }else if(row.page===4&&row.text.startsWith('Importe de la casilla 505 para solicitar el número de referencia el próximo año : ')){
      need(row.text==='Importe de la casilla 505 para solicitar el número de referencia el próximo año : '+format(c.baseLiquidableGeneral),'PDF-documento-base');referenceDocument++;
    }else need(!/\d,\d{2}\b/.test(row.text),'PDF-monetario-sin-mapa');
  }
  need(Object.keys(numbers).every(k=>seen.has(k))&&Object.keys(text).every(k=>seen.has(k))&&seen.has('0001'),'PDF-casillas-faltantes');
  need(finalDocument===1&&referenceDocument===1,'PDF-documento-cardinalidad');
  return {filas:rows.length,casillas:seen.size,paginas:5,posiciones:'horizontal-y-vertical',reservas:[]};
}
