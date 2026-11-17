import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import origenes from './fixtures/trabajo-alquiler-suelo-desconocido-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { prepararTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/preparar'
import { seleccionarPoliticaAlquilerOpen2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/seleccion-open'
import { producirSolicitudMadridArrendador2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/madrid-arrendador'
import { MINIMOS_ESTATALES_2025 } from '../lib/dominio/normativa/datos/minimos-autonomicos-2025'
import type { EntradaComposicionAnual } from '../lib/dominio/irpf/liquidacion/composicion-anual'

// Sintéticos en memoria. No cambian fixtures ni observaciones oficiales.
function caso(importes = ['1000.00']) {
 const c = structuredClone(origenes.find(x => x.entrada.comunidadAutonoma === 'madrid')!.entrada)
 const v = c.inmuebles[0]!, k = v.contrato, original = v.gastos[0]!
 v.gastos = importes.map((importe, i) => ({ ...original, id: 'revision-gasto-' + i,
  factura: 'sintetico:revision-factura-' + i, importe, totalFactura: importe }))
 return { ...c, otrasDeducciones: 'solo-madrid-gastos-arrendamiento-viviendas', madridArrendador2025: {
  inmuebleId: v.id, catastro: v.catastro, propietario: v.titular, titulo: v.titulo,
  contratoId: k.id, documentoContrato: k.documento,
  localizacion: { comunidad: 'madrid', documento: 'sintetico:revision-localizacion' },
  resguardo: { referencia: k.fianzaDepositada, organismo: 'agencia-vivienda-social-comunidad-madrid',
   inmuebleId: v.id, catastro: v.catastro, contratoId: k.id, arrendador: k.arrendador,
   arrendatario: k.arrendatario, fechaDeposito: '2024-12-02', fechaResguardo: '2024-12-03', posesion: 'original' },
  pagos: v.gastos.map(g => ({ gastoId: g.id, pagador: v.titular, soportePago: 'sintetico:revision-pago-' + g.id })),
 } }
}
type EntradaAdversa = ReturnType<typeof caso> | Omit<ReturnType<typeof caso>, 'madridArrendador2025'>
const decode = (x: EntradaAdversa) => Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(x, { onExcessProperty: 'error' })
type Raw = ReturnType<typeof caso>
const modos = ['explicita', 'canonica'] as const
const ejecutar = (x: EntradaAdversa, modo: typeof modos[number]) => {
 // SAFETY: entradas deliberadamente adversas; la validación pertenece a cada API pública, sin saneamiento previo.
 const c = x as CasoTrabajoAlquilerOrdinario2025
 return modo === 'explicita' ? liquidarIrpfAnualExplicito(c) : liquidarIrpfAnual(c, { modo: 'canonico' })
}
describe('Revisión independiente Madrid: preparada sin ejecución', () => {
 for (const modo of modos) {
  for (const [importes, esperado] of [
   [['1000.00'], '100'], [['2000.00'], '154.65'], [['1000.00', '1000.00'], '154.65'],
   [['1546.50'], '154.65'], [['1546.40'], '154.64'],
  ] as const) it.effect(modo + ': generación y consumo único ' + importes.join('+'), () => Effect.gen(function* () {
   const raw = caso([...importes]), { madridArrendador2025: _extension, ...resto } = raw
   expect(_extension).toBeDefined()
   const antes = yield* ejecutar({ ...resto, otrasDeducciones: 'ninguna' }, modo)
   const despues = yield* ejecutar(raw, modo)
   expect(despues.composicion.deduccionesAutonomicasAplicadas.eq(esperado)).toBe(true)
   expect(antes.cuotaDiferencial.minus(despues.cuotaDiferencial).eq(esperado)).toBe(true)
   expect(antes.composicion.cuotaPosterior.minus(despues.composicion.cuotaPosterior).eq(esperado)).toBe(true)
   expect(despues.retenciones.eq(antes.retenciones)).toBe(true)
   expect(despues.baseImponibleGeneral.eq(antes.baseImponibleGeneral)).toBe(true)
   expect(despues.inmuebles).toEqual(antes.inmuebles)
   const libro = despues.composicion.deduccionesTerritoriales2025!
   expect(libro.aplicaciones).toHaveLength(1)
   const aplicacion = libro.aplicaciones[0]!
   expect('generado' in aplicacion).toBe(true)
   expect('arrastre' in aplicacion).toBe(false)
   expect(despues.aceptacionFiscal).toBe('pendiente')
   expect(despues.composicion.cotizaciones.naturaleza).toBe(modo === 'explicita' ? 'efectivas' : 'estimadas-perfil-uniforme')
   if (modo === 'canonica') expect(despues.politicaOpen).toBeUndefined()
   else expect(despues.rastroOperativo!.deduccionesAutonomicasAplicadas!.eq(esperado)).toBe(true)
  }))
  const adversas: readonly [string, (c: Raw) => void][] = [
   ['depósito posterior al resguardo', c => { c.madridArrendador2025.resguardo.fechaDeposito = '2024-12-04' }],
   ['resguardo sin calendario válido', c => { c.madridArrendador2025.resguardo.fechaResguardo = '2025-02-29' }],
   ['resguardo de otro inmueble', c => { c.madridArrendador2025.resguardo.inmuebleId = 'otro' }],
   ['fianza distinta', c => { c.madridArrendador2025.resguardo.referencia = 'otra' }],
   ['contrato documental distinto', c => { c.madridArrendador2025.documentoContrato = 'otro' }],
   ['título distinto', c => { c.madridArrendador2025.titulo = 'otro' }],
   ['organismo distinto', c => { c.madridArrendador2025.resguardo.organismo = 'otro' }],
   ['pago sin soporte', c => { c.madridArrendador2025.pagos[0]!.soportePago = ' ' }],
   ['pago omitido', c => { c.madridArrendador2025.pagos = [] }],
   ['pago desconocido', c => { c.madridArrendador2025.pagos[0]!.gastoId = 'otro' }],
   ['pagador ajeno', c => { c.madridArrendador2025.pagos[0]!.pagador = 'otro' }],
   ['pago fuera del ejercicio', c => { c.inmuebles[0]!.gastos[0]!.fechaPago = '2026-01-01' }],
   ['soporte de retención reutilizado', c => { c.madridArrendador2025.pagos[0]!.soportePago = c.retenciones[0]!.documento }],
   ['comunidad contradictoria', c => { c.comunidadAutonoma = 'asturias' }],
   ['renuncia contradictoria', c => { c.otrasDeducciones = 'ninguna' }],
  ]
  for (const [nombre, cambiar] of adversas) it.effect(modo + ': rechaza ' + nombre, () => Effect.gen(function* () {
   const c = caso(); cambiar(c)
   const resultado = yield* Effect.result(ejecutar(c, modo))
   expect(resultado._tag).toBe('Failure')
  }))
  for (const clave of ['cuota', 'credito', 'deduccionesTerritoriales2025', 'deduccionesAutonomicasCentimos'])
   it.effect(modo + ': no acepta entrada externa ' + clave, () => Effect.gen(function* () {
    const resultado = yield* Effect.result(ejecutar({ ...caso(), [clave]: '100' }, modo))
    expect(resultado._tag).toBe('Failure')
   }))
 }
 it('La adaptación es determinista y agrupa los pagos en una solicitud', () => {
  const c = decode(caso(['1000.00', '1000.00']))
  const a = producirSolicitudMadridArrendador2025(c)!
  expect(a).toEqual(producirSolicitudMadridArrendador2025(c))
  expect(a.solicitudes).toHaveLength(1)
  const s = a.solicitudes[0]!
  if (s.lote !== 'F-ampliado') throw Error('lote inesperado')
  expect(s.hechos.pagos).toHaveLength(2)
 })
 it.effect('Selector: copia de contenido admisible; cambios monetarios y solicitudes extra rechazados', () => Effect.gen(function* () {
  const c = decode(caso()), p = yield* prepararTrabajoAlquilerOrdinario2025(c)
  const e: EntradaComposicionAnual = {
   hechosAlquilerOpen2025: c, inmueblesP4a: p.inm.inmuebles,
   ambito: { anio: 2025, comunidadAutonoma: c.comunidadAutonoma, contribuyenteId: c.contribuyenteId,
    situacionFamiliar: { tipo: 'individual', edad: c.edad, discapacidad: { _tag: 'SinDiscapacidad' }, descendientes: [], ascendientes: [] } },
   cotizaciones: { naturaleza: 'efectivas', trabajador: p.cotizaciones }, precision: 80, politica: 'decimal-hasta-salida',
   rentasTrabajoAnuales: { integroTrabajo: p.bruto, restoRentas: p.renta },
   serviciosLaborales: { bruto: p.bruto, netoReducido: p.neto, otrasRentas: p.renta },
   basesImponiblesE38: { general: p.base, ahorro: p.cero }, baseGeneral: p.base, baseAhorro: p.cero,
   rentasAntesReducciones: p.neto.plus(p.renta), minimosEstatales: MINIMOS_ESTATALES_2025,
   deduccionesAutonomicasCentimos: 0, deduccionesTerritoriales2025: structuredClone(p.solicitudMadrid),
  }
  expect(yield* seleccionarPoliticaAlquilerOpen2025(e)).toEqual(p.politicaOpen)
  const ajena = producirSolicitudMadridArrendador2025(decode(caso(['2000.00'])))!
  const distinta = yield* Effect.result(seleccionarPoliticaAlquilerOpen2025({ ...e, deduccionesTerritoriales2025: ajena }))
  expect(distinta._tag).toBe('Failure')
  const duplicada = { solicitudes: [...p.solicitudMadrid!.solicitudes, ...p.solicitudMadrid!.solicitudes] }
  const doble = yield* Effect.result(seleccionarPoliticaAlquilerOpen2025({ ...e, deduccionesTerritoriales2025: duplicada }))
  expect(doble._tag).toBe('Failure')
 }))
})
