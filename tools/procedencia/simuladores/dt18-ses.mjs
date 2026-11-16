/** Parser del formato SES observado: ámbitos e instancias, sin cálculo fiscal. */
import { Schema } from 'effect';
const string=Schema.is(Schema.String);
const ensure=(ok)=>{if(!ok)throw Error('dt18-ses-invalido');};
export function parseSES(s){
 ensure(string(s)&&s.length<=4194304&&!s.includes('\r'),'SES tamaño/formato');
 const lines=s.trimEnd().split('\n');
 ensure(/^<\?xml .*EjModelo="2025".*\?><PERSISTENCIAV2>$/.test(lines.shift())&&lines.pop()==='</PERSISTENCIAV2>','SES envoltura/ejercicio');
 const sections=[],records=[],stack=[];
 for(const line of lines){
  if(!line.trim())continue;
  ensure(!line.includes('\t'),'SES indentación');
  const indent=line.length-line.trimStart().length;
  while(stack.length&&stack.at(-1).indent>=indent)stack.pop();
  const section=/^ *\[([A-Z0-9_]+)\]$/.exec(line);
  if(section){const parent=stack.at(-1);ensure(parent?indent===parent.indent+2:section[1]==='DECLARACIONES'&&indent===0,'SES raíz/indentación');const item={id:sections.length,name:section[1],indent,parent:parent?.id??null,path:[...stack.map(s=>s.name),section[1]].join('/')};sections.push(item);stack.push(item);continue;}
  const m=/^ *([A-Z0-9_]+)~([123])~([^~]*)(?:~(254|255))?$/.exec(line);
  ensure(m&&stack.length,'SES registro malformado');
  ensure(m[2]==='1'?!m[4]:m[2]==='2'?(!m[4]&&/^(254|255)$/.test(m[3])):!!m[4],'SES tipo/marca');
  const scope=stack.at(-1),key=m[1];ensure(indent===scope.indent+1,'SES registro indentación');ensure(!records.some(r=>r.scope===scope.id&&r.key===key),'SES clave duplicada');
  records.push({scope:scope.id,path:scope.path,key,type:m[2],value:m[3],flag:m[4]??null});
 }
 ensure(sections.filter(s=>s.parent===null).length===1,'SES raíz cardinalidad');
 return {sections,records};
}
export function housingSES(s,h){
 const p=parseSES(s),base='DECLARACIONES/IRPF2025',home=base+'/INMUEBLES';
 for(const path of [base,home])ensure(p.sections.filter(s=>s.path===path).length===1,'SES ámbito/cardinalidad '+path);
 const wanted={
  [base]:{VHADQ:['1',h.payments],BASE1:['1',h.payments],VIVFA:['1','01/02/2010'],VFA1:['3','01/02/2010'],VIVNIPH:['1',h.loan.candidate],VNI1:['3',h.loan.candidate],VIVPORC:['1','100.0'],TPC1:['3','100.0']},
  [home]:{VURBA:['1','true'],CURBA:['1','true'],VUSOHAB:['1','true'],USOHAB:['1','true'],TIT_C:['1','DECLARANTE'],CLDLG:['1','4'],CL:['1','4'],C_DIASVH:['1','365'],DIASHAB:['1','365'],CDIRECCIONDLG:['1',h.address.candidate],CDIRECCION:['1',h.address.candidate],ORDENINMUEBLE:['1','1'],PCDLG:['1','100.0'],PC:['1','100.0'],IND_C:['1','2'],C_RNR:['2','255'],V01VIRIRI:['2','255']}
 };
 const numeric=new Set(['VHADQ','BASE1','VIVPORC','TPC1','PCDLG','PC']);
 const decimal=v=>{ensure(/^\d+(?:\.\d{1,2})?$/.test(v),'SES decimal');const [a,b='']=v.split('.');return BigInt(a)*100n+BigInt(b.padEnd(2,'0'));};
 const keys=new Set(Object.values(wanted).flatMap(o=>Object.keys(o)));
 for(const r of p.records)if(keys.has(r.key))ensure(Object.hasOwn(wanted[r.path]??{},r.key),'SES clave fuera de ámbito '+r.key);
 for(const [path,fields]of Object.entries(wanted))for(const [key,[type,value]]of Object.entries(fields)){
  const rows=p.records.filter(r=>r.path===path&&r.key===key);ensure(rows.length===1,'SES cardinalidad '+key);
  const r=rows[0];ensure(r.type===type&&(type!=='3'||r.flag==='255')&&(numeric.has(key)?decimal(r.value)===decimal(value):r.value===value),'SES valor/tipo '+key);
 }
 // Inventario de inmueble cerrado al observado. Un campo nuevo requiere discovery.
 ensure(p.records.filter(r=>r.path===home).every(r=>Object.hasOwn(wanted[home],r.key)),'SES inmueble no observado');
 return {schema:'dt18-ses-v2',housingVerified:true,externalHistoryVerified:false,negativeEvidence:'UI antes/después; sólo ausencias observadas en SES, sin inferir historia',records:p.records.filter(r=>keys.has(r.key))};
}
