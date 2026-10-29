import {it,expect} from 'vitest'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import {buildAdmissionFragment,verifyAdmissionFragment} from '../../../../scripts/procedencia/flujo-admision-r32.mjs'
const f=buildAdmissionFragment()
it('RA34-S01 llamada territorial 2014 resuelta en cuerpos o contrato especifico',()=>{
 const callee='resolverParametrosComunidadAutonoma2014'
 expect(f.bodies.some(b=>b.id.endsWith('#'+callee))||f.admissionProgram.some(s=>s.callee===callee)).toBe(true)
})
it('RA34-S02 agregado manual tiene puerto o binding por propiedad',()=>{
 const property='deduccionAutonomicaAgregadaCentimos'
 expect(f.ports.some(p=>p.property.includes(property))||f.parameterBindings.some(p=>p.publicOrigin.includes(property))).toBe(true)
})
it('RA34-S03 cuerpos reales y retencion ejecutable no son inventados',()=>{
 expect(f.bodies.some(b=>b.id.endsWith('#validarDerechosMinimos'))).toBe(true)
 expect(f.predicates.some(p=>p.id==='retencion.esCasoCalculable.expanded')).toBe(true)
 expect(f.predicates).toHaveLength(53)
})
it('RA34-S04 schema permisivo interno no evita reconstruccion estricta',()=>{
 const require=createRequire('/home/elies/Repos/IRoboPF/package.json');const Ajv=require('ajv');const validate=new Ajv().compile(JSON.parse(readFileSync('schemas/procedencia/flujo/admision-r32.schema.json','utf8')))
 expect(validate(f)).toBe(true)
 const bad=structuredClone(f);bad.admissionProgram=[{operacionInventada:true}]
 expect(validate(bad)).toBe(true);expect(()=>verifyAdmissionFragment(bad)).toThrow()
 const pending=structuredClone(f);pending.sites[0].admissionClosed=false;expect(validate(pending)).toBe(false)
})
