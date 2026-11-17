const contracts = {
  "pension-2025-andalucia-68": {
    "rules": "a0f316febdb424137a53fd5d240bcb884e7edb62f0f09eddcc6255f6de193bce",
    "sections": "055426f5a73d78a69fff5b7df2d662f642a1ed380406a1b891013afd3bae5c89",
    "hechos": "bd4ef5c38c1b928378b4edc524925ea06ee4ea7220ba9b6289bf08a5a488bd2b"
  },
  "pension-2025-madrid-77": {
    "rules": "3c797037dc2818c7fe1127a438c737a2e017186c52dbefe71d43d7cc67835eee",
    "sections": "055426f5a73d78a69fff5b7df2d662f642a1ed380406a1b891013afd3bae5c89",
    "hechos": "02c285769e4430d0f12e233ce7c9ce1fafc651730dd3b87061820d9e1ecf4396"
  }
};
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
const sha=x=>createHash('sha256').update(x).digest('hex');
const at=(o,p)=>p.split('/').reduce((v,k)=>v?.[k],o);
const fraction=s=>{assert.match(String(s),/^-?\d+(?:\.\d+)?$/);const[a,f='']=String(s).split('.');return [BigInt(a+f),10n**BigInt(f.length)];};
const equal=(a,b)=>{const[x,d]=fraction(a),[y,e]=fraction(b);return x*e===y*d;};
const cents=s=>{const[n,d]=fraction(s);assert.equal(n*100n%d,0n);return n*100n/d;};
const money=c=>`${c<0n?'-':''}${(c<0n?-c:c)/100n}.${String((c<0n?-c:c)%100n).padStart(2,'0')}`;
const bytes=s=>{assert.match(s,/^-?\d+(?:,-?\d+)*$/);const n=s.split(',').map(Number);assert.ok(n.every(x=>Number.isInteger(x)&&x>=-128&&x<=255));return Buffer.from(n);};
export function validateContext(h){
 assert.equal(h.ejercicio,2025);assert.equal(h.tipo,'hechos-sinteticos-prospectivos');
 const e=h.entrada,f=h.hechos;assert.equal(e.ejercicio,2025);assert.equal(e.perfil,'solo-trabajo');
 assert.ok(['andalucia','madrid'].includes(e.comunidadAutonoma));assert.ok(e.edad===68||e.edad===77);
 assert.equal(e.modalidad,'individual');assert.equal(e.residenciaTodoElAnio,true);assert.equal(e.devengo,'2025-12-31');
 for(const k of ['otrasRentas','discapacidad','reduccionesBase','rentasExtranjeras','especialidades'])assert.equal(e[k],'ninguna',k);
 assert.equal(e.familiaresConDerechoMinimo,'ninguno');assert.equal(e.saldosAnteriores,'ninguno');assert.equal(e.deducciones,'solo-da61-si-procede');
 assert.equal(f.pension,'jubilacion-ordinaria-sujeta-no-exenta');assert.equal(f.serviciosLaborales2025,'ninguno');assert.equal(f.mutualidadesDT2,'ninguna');
 assert.equal(f.otrosPagadores,'ninguno');assert.equal(f.otrasRentas,'ninguna');assert.equal(f.familiares,'ninguno');assert.equal(f.discapacidad,'ninguna');assert.equal(f.ingresosExentos,'ninguno');
 assert.equal(f.estadoCivil,'soltero');assert.equal(f.vivienda,'sin-propiedad-ni-deducciones-solicitadas');
 assert.equal(e.conciliacion.ejercicio,2025);assert.equal(e.conciliacion.estado,'totales-anuales-sin-duplicados');
 const t=e.trabajo;assert.equal(t.ejercicio,2025);assert.equal(t.territorio,'comun');
 for(const k of ['reduccionesArt18','movilidad','discapacidadActiva'])assert.equal(t[k],'ninguna');
 assert.equal(t.rendimientos.length,1);const r=t.rendimientos[0];assert.equal(r.clase,'pension');assert.equal(r.cotizaciones.clase,'efectivas');
 for(const k of ['seguridadSocial','derechosPasivos','colegiosHuerfanos'])assert.ok(equal(r.cotizaciones[k],'0'));
 for(const k of ['sindicato','colegio','defensa'])assert.ok(equal(r[k].importe,'0'));
 assert.equal(e.retenciones.length,1);assert.equal(e.retenciones[0].ejercicio,2025);assert.equal(e.retenciones[0].efectiva,true);
 assert.equal(h.pesoExterno,null);assert.equal(h.incluidoEnMuestraOriginal,false);
 return true;
}
export function validateBinding({h,parsed,pdfRows,spec,contract}){
 validateContext(h);
 const fixed=contracts[h.id];assert.ok(fixed,'caso-no-revisado');assert.deepEqual(contract,fixed,'contrato-externo');assert.equal(sha(JSON.stringify(h)),fixed.hechos,'hechos-preregistrados');
 assert.equal(sha(JSON.stringify(spec.rules)),contract.rules,'contrato-reglas');
 assert.equal(sha(JSON.stringify(parsed.sections)),contract.sections,'contrato-secciones');
 assert.equal(parsed.records.length,spec.rules.length,'censo');
 const cells=pdfRows.flatMap(r=>{const m=/^(.*?)\s+(-?[\d.]+,\d{2})\s+(\d{4})$/.exec(r.text);return m?[{box:m[3],value:m[2].replaceAll('.','').replace(',','.'),page:r.page,y:r.y}]:[];});
 const box=k=>{const c=cells.filter(c=>c.box===k);assert.ok(c.length>0,'casilla-'+k);assert.ok(c.every(x=>equal(x.value,c[0].value)));return c[0].value;};
 const types=[];
 for(let i=0;i<parsed.records.length;i++){
  const r=parsed.records[i],rule=spec.rules[i],section=parsed.sections[r.scope];
  assert.deepEqual({path:section.path,scope:r.scope,key:r.key,type:r.type,flag:r.flag},rule.row,'identidad-fila');
  switch(rule.kind){
   case 'ausencia-exacta':assert.equal(r.type,'2');assert.equal(r.value,rule.literal);break;
   case 'plantilla-exacta':assert.equal(r.value,rule.literal);break;
   case 'entrada-o-hecho':{assert.ok(rule.source.startsWith('H/'));const value=at(h,rule.source.slice(2));assert.notEqual(value,undefined);const wanted=rule.table?rule.table[value]:String(value);assert.notEqual(wanted,undefined);assert.ok(rule.numeric?equal(r.value,wanted):r.value===wanted,r.key);break;}
   case 'salida-observada':assert.ok(equal(r.value,box(rule.box)),r.key);break;
   case 'salida-derivada':{let value;if(rule.operation==='truncar(100*cuota/base,2)')value=money(cents(box('0587'))*10000n/cents(box('0505')));else{const total=cents(box('0670'));assert.ok(total>0n);const first=(total*6n+5n)/10n;assert.ok(['halfup(total*0.6,2)','total-halfup(total*0.6,2)'].includes(rule.operation));value=money(rule.operation==='halfup(total*0.6,2)'?first:total-first);}assert.ok(equal(r.value,value));break;}
   case 'transporte-completo':{
    const first=inflateSync(bytes(r.value),{maxOutputLength:4194304}).toString('latin1');const second=bytes(first).toString('latin1');
    for(const [j,s]of [first,second].entries()){assert.equal(s,rule.stages[j].text);assert.equal(sha(Buffer.from(s,'latin1')),rule.stages[j].sha256);}
    if(r.key==='DF_AVISOS')assert.equal(second,'[dg1]');else{
     assert.equal(r.key,'DF_DATOS_SI');const territory=h.entrada.comunidadAutonoma==='andalucia'?'01':'12';
     const expected=['DG\tDG00000\t1\t0\t0\t',['TI','TI00000','00000000000','90000000B','PRUEBA C OPEN','','',h.hechos.nacimiento,'H','','',territory,'','','','','0,00','','','',''].join('\t'),''].join('\n');
     assert.equal(second,expected,'DG-TI-completo');
    }break;
   }
   default:throw Error('regla-no-admitida');
  }
  types.push(rule.kind);
 }
 const observed=box('0670');
 return {observed,checkedRecords:types.length,metricChanged:false};
}
export function validateReadbacks({h,initial,work,da61}){
 validateContext(h);
 const pairs=[['Importe íntegro:',h.entrada.trabajo.rendimientos[0].integro],['Retención:',h.entrada.retenciones[0].importe],['Seguridad Social y otros:','0'],['Cuotas satisfechas a Sindicatos:','0'],['Cuotas a Colegios profesionales:','0'],['Gastos de defensa jurídica:','0']];
 const observations=[];
 for(const [title,wanted]of pairs){
  const before=initial.filter(x=>x.visible&&x.title===title);assert.equal(before.length,1,'control-inicial-'+title);
  const after=work.filter(x=>x.id===before[0].id&&x.visible);assert.equal(after.length,1,'control-final-'+title);
  const value=after[0].value===''?'0':after[0].value.replaceAll('.','').replace(',','.');assert.ok(equal(value,wanted),'readback-'+title);
  observations.push({title,id:before[0].id,value:after[0].value,expected:wanted});
 }
 const titles=['Importe íntegro:','Reducciones rendimientos irregulares:','Valoración:','Ingreso a cuenta:','Ingreso a cuenta repercutido:','Contribuciones empresariales a planes de pensiones y mutualidades:','Cantidades aportadas por la empresa por decisión del trabajador a planes de pensiones y mutualidades:','Contribuciones empresariales a seguros colectivos de dependencia:','Gastos Seguridad Social y otros:','Deducción por obtención de rendimientos del trabajo:'];
 for(const title of titles){const matches=da61.filter(x=>x.visible&&x.title===title);assert.equal(matches.length,1,'DA61-control-'+title);assert.equal(matches[0].value,'','DA61-sin-servicios-'+title);}
 return {work:observations,da61Controls:titles.length,scope:'Lectura posterior a acciones de introducir cero conservadas en el terminal original; no se interpreta todo vacío como cero fiscal.'};
}

export const bindingContracts = contracts;
