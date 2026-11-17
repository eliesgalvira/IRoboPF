/** Contrato nominal independiente del censo de valores.
 * Cada huella fija la estructura revisada: instancias, campos, reglas y
 * ocurrencias PDF con rol, página y coordenadas. No se recalcula desde el censo
 * al ejecutar. Cambiar el formato exige revisar este contrato y sus adversas.
 */
import {createHash} from 'node:crypto';
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const requireMatch=(ok,why)=>{if(!ok)throw Error(why);};
const ruleKinds=["constante","negativo-exacto","transformacion","correspondencia","transporte"];
const contracts=[
{
  "id": "asturias-01",
  "fixtureId": "prospectivo-alquiler-2025-1",
  "records": 312,
  "sections": 31,
  "ses": "929721200e30e83e54790562932248702f870358df5d8199201a8bcadc409e2b",
  "rules": "b789534b830fc610a6d60e2b49f7dcbb77f2f4d9c1971a31a7ad3dc38196e647",
  "pdf": "7f3446e629ee4468807fe6887c94f965abf9d63d0319491fbca9bb392586526b",
  "ruleKinds": "011100011110000000011101020010001103020011021111001020311003030000000023222113302033033233102300333334303430302003333333333333103302033300000203133303330003330233023301220003002002320333111313111113331111203313311101110113011113330311311311111020311331313013331111112313111131133311310101111111111111111111111111"
},
  {
    "id": "andalucia-01",
    "fixtureId": "prospectivo-alquiler-2025-2",
    "records": 325,
    "sections": 30,
    "ses": "37c308f6d95ec6f542b77f1b7f62a29fe42e88bec63214ca607a233cf8d36ce2",
    "rules": "341addee47f99c4ba0b50b6bc4787b90c28475250d20068272c21f89556bbb4f",
    "pdf": "652a3309dfd13afc58a34b31ced176bcb1d911e58d73d769e7a1a36a981b8ca7",
    "ruleKinds": "0111000111100000000111010200100011030200110211110010203110333322333330333333303330000000023222113302033033233102300333334034303020033333333333331033020333000002031333033300033302330233012200030020023203331113131111133311112033133111011101130111133303113113111110203113013331111112313111131133311310101111111111111111111111111"
  },
  {
    "id": "madrid-01",
    "fixtureId": "prospectivo-alquiler-2025-3",
    "records": 336,
    "sections": 31,
    "ses": "6a89d7e891cf2cdc91c10e31a92baef261ac7e5944f267e56c9496948a24236a",
    "rules": "782d74b4c6eba9fc27233dde5c5c5acf1e20b7ec3be5d4aa4038b3b1644c675a",
    "pdf": "9b573251b3d1922504569aa1e3435b06da9736b905a27f29cb51c0964259c056",
    "ruleKinds": "011100011110000000011101020010001103020011021111001020311033332233333033333330333300000000232221133020330332331023003333343034303020033333333333331033020333000002031333033300033302330233012200030020023203331113131111133311112033133111011101130111133303113113111110203113013331111112313111131133311310111333011111111111111111111111111111"
  },
  {
    "id": "madrid-02",
    "fixtureId": "prospectivo-alquiler-2025-4",
    "records": 336,
    "sections": 31,
    "ses": "6a89d7e891cf2cdc91c10e31a92baef261ac7e5944f267e56c9496948a24236a",
    "rules": "782d74b4c6eba9fc27233dde5c5c5acf1e20b7ec3be5d4aa4038b3b1644c675a",
    "pdf": "9b573251b3d1922504569aa1e3435b06da9736b905a27f29cb51c0964259c056",
    "ruleKinds": "011100011110000000011101020010001103020011021111001020311033332233333033333330333300000000232221133020330332331023003333343034303020033333333333331033020333000002031333033300033302330233012200030020023203331113131111133311112033133111011101130111133303113113111110203113013331111112313111131133311310111333011111111111111111111111111111"
  }
];
export const sesStructure=p=>({sections:p.sections,records:p.records.map(r=>({scope:r.scope,path:r.path,key:r.key,type:r.type,flag:r.flag,marker:r.type==='2'?r.value:null}))});
export const pdfOccurrences=rows=>rows.map(r=>({page:r.page,y:r.y,segments:r.segments.map(s=>({x:s.x,role:s.value.replace(/\d[\d.]*,\d{2}/g,'#importe')}))}));
export function validateSESContract(observation,parsed){
 const spec=contracts.find(s=>s.id===observation.id);
 requireMatch(spec&&observation.fixtureId===spec.fixtureId,'SES-contrato-observacion');
 requireMatch(parsed.records.length===spec.records&&parsed.sections.length===spec.sections&&digest(sesStructure(parsed))===spec.ses,'SES-estructura-obligatoria');
 // Una reserva puede cerrar el gate, pero nunca habilitar una correspondencia nueva.
 const normalized=observation.rules.map((r,i)=>r.kind==='reserva'?{...r,kind:ruleKinds[Number(spec.ruleKinds[i])]}:r);
 requireMatch(digest(normalized)===spec.rules,'SES-reglas-obligatorias');
}
export function validatePDFContract(rows,fixtureId){
 const spec=contracts.find(s=>s.fixtureId===fixtureId);
 requireMatch(spec&&digest(pdfOccurrences(rows))===spec.pdf,'PDF-ocurrencias-obligatorias');
}
