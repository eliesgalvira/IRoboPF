/** Adaptador de correspondencias SES. No contiene motor fiscal; core se inyecta sin copiarlo. */
export function materialize(rule,{H,P},core){
 if(rule.kind==='reserva')return rule;
 if(!rule.transform)return rule;
 const get=s=>core.at({H,P},s), d=s=>core.decimal(String(get(s))), asString=a=>{
  core.need(a[1]>0n,'denominador');const n=a[0]*100n;core.need(n%a[1]===0n,'no-centimos-exactos');const c=n/a[1];return `${c/100n}.${String(c%100n).padStart(2,'0')}`;
 };
 let value;
 switch(rule.transform){
 case 'fecha':{const s=get(rule.source);core.need(/^\d{4}-\d{2}-\d{2}$/.test(s),'fecha-ISO');value=s.split('-').reverse().join('/');break;}
 case 'territorio':{value=rule.table[get(rule.source)];core.need(value!==undefined,'territorio');break;}
 case 'gastoGeneralTrabajo':value=asString(core.sub(core.sub(d(rule.sources[0]),d(rule.sources[1])),d(rule.sources[2])));break;
 case 'resta':value=asString(core.sub(d(rule.sources[0]),d(rule.sources[1])));break;
 case 'halfup2':value=asString(core.quant(d(rule.source)));break;
 case 'fraccion60':value=asString(core.quant(core.mul(d(rule.source),[3n,5n])));break;
 case 'resto40':{const a=d(rule.source);value=asString(core.sub(a,core.quant(core.mul(a,[3n,5n]))));break;}
 case 'tipoTotal':{const a=core.div(core.mul(d(rule.sources[0]),[10000n,1n]),d(rule.sources[1]));value=asString([a[0]/a[1],100n]);break;}
 case 'propiedad':core.need(get(rule.source)==='propiedad'&&H.entrada.inmuebles[0].titulares.length===1&&H.entrada.inmuebles[0].titulares[0]===H.entrada.contribuyenteId,'propiedad-exclusiva');value='100';break;
 case 'modalidad':core.need(get(rule.source)==='individual','modalidad');value='true';break;
 case 'uso':core.need(get(rule.source)==='alquiler-vivienda','uso');value='true';break;
 default:throw Error('transformacion-desconocida');
 }
 return {kind:'correspondencia',literal:value,numeric:rule.numeric??false};
}
export function bind(row,rule,context,core){
 contextSES(context,core);
 core.need(row.path===rule.row.path&&row.scope===rule.row.scope&&row.key===rule.row.key&&row.type===rule.row.type&&row.flag===rule.row.flag,'identidad-fila');
 if(rule.kind==='reserva')return false;
 if(rule.kind==='negativo-exacto'){
  core.need(row.type==='2'&&row.value===rule.literal,'marcador-exacto');
  // 254/255 son ausencia serializada, no booleanos: preservar byte y ámbito.
  core.need(rule.source&&core.at(context,rule.source)!==undefined,'ausencia-sin-hecho');
  return core.binding(row,{kind:'literal',literal:rule.literal},context);
 }
 return core.binding(row,materialize(rule,context,core),context);
}
export function transportsSES(S,records,core){
 core.transports(S,{records});
 const t=S.transportesInternos.find(t=>t.campo==='DF_DATOS_SI');
 return compareDG_TI(t.etapas.at(-1).contenido,records,core);
}
export function compareDG_TI(text,records,core){
 const lines=text.split('\n');
 core.need(lines.length===3&&lines[2]==='','DG-TI-lineas');
 const dp=k=>records.find(r=>r.path==='DECLARACIONES/DP'&&r.key===k)?.value;
 const dg=['DG','DG00000','1','0','0',''];
 const ti=['TI','TI00000','00000000000',dp('DPNIF_D'),dp('DP_APENOM_D'),'','',dp('DPFNAC_D'),'H','','',dp('CAC_D'),'','','','','0,00','','','',''];
 core.need(JSON.stringify(lines[0].split('\t'))===JSON.stringify(dg),'DG-completo');
 core.need(JSON.stringify(lines[1].split('\t'))===JSON.stringify(ti),'TI-completo');
 core.need(records.find(r=>r.path==='DECLARACIONES/DP'&&r.key==='HOMBRE_D')?.value==='true','TI-sexo');
 return {DG:dg.map((value,index)=>({index,value,role:['tipo','id-tecnico','unidad-individual','sin-conyuge','sin-descendientes','terminador'][index]})),TI:ti.map((value,index)=>({index,value,role:({0:'tipo',1:'id-tecnico',2:'id-tecnico-cero',3:'NIF-declarante-DP',4:'nombre-declarante-DP',7:'nacimiento-DP',8:'sexo-DP',11:'territorio-DP',16:'importe-cero-sin-renta-adicional'})[index]??'vacío-plantilla-no-dato-fiscal'}) )};
}
export const negativeMeaning=(row)=>row.value==='254'
 ? 'Marcador de ausencia en esta celda serializada; no equivale a false ni a importe 254. Exigir tipo2 y byte254; en tipo3 el flag254 acompaña un valor presente.'
 : 'Marcador de celda sin valor de desglose/cálculo en esta instancia; no equivale a false ni a importe255. En tipo3 flag255 acompaña un valor presente, incluso true o renta positiva.';
/** Guardas del dominio nominal. Los sellos y el censo completo se verifican en el comprobador. */
export function contextSES({H,P},core){
 core.need(H.entrada.ejercicio===2025&&P.result.ejercicio===2025,'ejercicio');
 core.need(['andalucia','madrid'].includes(H.entrada.comunidadAutonoma),'territorio-dominio');
 core.need(H.entrada.modalidad==='individual'&&H.entrada.edad===40&&H.entrada.familiares==='ninguno'&&H.entrada.discapacidad==='ninguna','perfil-nominal');
 const i=H.entrada.inmuebles[0];
 core.need(H.entrada.inmuebles.length===1&&i.id==='V'&&i.titular===H.entrada.contribuyenteId&&i.regimenMatrimonial==='no-casado','inmueble-unico');
 core.need(H.entrada.trabajo.rendimientos.length===1&&H.entrada.otrasRentas==='ninguna','renta-unica-sin-duplicar-alias');
 core.need(i.contrato.arrendatario==='inquilino-ficticio'&&i.gastos.length===1&&i.gastos[0].prestadorNif==='prestador-ficticio'&&i.gastos[0].id==='REP','roles-nominales');
 core.need(i.contrato.parentesco==='ninguno'&&i.contrato.destino==='vivienda-permanente-persona-fisica','contrato');
 core.need(i.usosDesdeAdquisicion[1]?.desde==='2024-12-01'&&i.usosDesdeAdquisicion[1]?.hasta==='2025-12-31','periodo-alquiler');
 return true;
}
