import Decimal from 'decimal.js';
import { Effect } from 'effect';
import { it, expect } from 'vitest';
import { producirVehiculoDA58 as producir } from '../../lib/dominio/irpf/vehiculo-da58-2025/productor';
import { liquidarIrpfAnual as canonica, liquidarIrpfAnualExplicito as efectiva } from '../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual';
const D = Decimal.clone({ precision: 200 });
import rows from './oraculos.json';
const rat = (x) => new D(x.n).div(x.d).toFixed();
function hechos(precio = '30000', tributos = '0', gastos = '0', ayuda = '0') {
    const total = new D(precio).plus(tributos).plus(gastos).toFixed();
    return { ejercicio: 2025, contribuyente: 'u', opcion: 'adquisicion_y_matriculacion_2025', historia: 'sin_otra_compra_DA58_ni_anticipos_previos', referenciaHistoria: 'declaración censo', vehiculo: { id: 'v', bastidor: 'VIN documental', matricula: 'matrícula documental', titular: 'u', titularFactura: 'u', vendedor: 'concesionario', factura: 'F1', fechaAdquisicion: '2025-09-16', primeraMatriculacion: '2025-09-18', nuevo: true, categoria: 'M1', tecnologia: 'BEV', plazas: 7, autonomiaWLTP: '30', fichaTecnica: 'FT', modeloIDAE: 'modelo elegible declarado', referenciaIDAE: 'documento de elegibilidad', fechaConsultaIDAE: '2025-09-16', afectacion: 'ninguna', permanencia: 'prevista_cuatro_anios', precioSinIVA: precio, tributos, gastosInherentes: gastos, pagos: [{ id: 'p1', fecha: '2025-09-16', pagador: 'u', importe: total, vendedor: 'concesionario', documento: 'recibo1' }], ayudas: ayuda === '0' ? [] : [{ id: 'exp1', vehiculoId: 'v', programa: 'MOVES III', referencia: 'reserva prevista', importe: ayuda, estado: 'prevista_no_cobrada_2025' }], exhaustividad: 'pagos_ayudas_y_titularidad_completos' } };
}
function sobre(h = hechos(), region = true) { const v = h.vehiculo; return { vehiculoDA582025: h, solicitudes: region ? [{ lote: 'D51', codigo: 'cyl_movilidad_sostenible', hechos: { vehiculos: [{ id: v.id, tipo: 'electrico', wltp: v.autonomiaWLTP, precio: new D(v.precioSinIVA).plus(v.tributos).plus(v.gastosInherentes).toFixed(), fechaMatricula: v.primeraMatriculacion, afectacion: 'no', adquirentes: ['u'], pagos: v.pagos.map(({ id, fecha, pagador, importe }) => ({ id, fecha, pagador, importe })) }], exhaustividad: 'completa' } }] : [] }; }
function caso(bruto = 60000) { return { anio: 2025, contribuyenteId: 'u', comunidadAutonoma: 'castilla-y-leon', situacionFamiliar: { tipo: 'individual', edad: 40, discapacidad: { _tag: 'SinDiscapacidad' }, descendientes: [], ascendientes: [] }, rendimientos: { trabajo: [{ importeIntegroCentimos: bruto * 100 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0 }; }
function explicito(bruto = '60000') { return { ejercicio: 2025, comunidadAutonoma: 'castilla-y-leon', contribuyenteId: 'u', edad: 40, modalidad: 'individual', residenciaTodoElAnio: true, devengo: '2025-12-31', otrasRentas: 'ninguna', familiaresConDerechoMinimo: 'ninguno', discapacidad: 'ninguna', reduccionesBase: 'ninguna', saldosAnteriores: 'ninguno', deducciones: 'territoriales-por-hechos-y-da61', deduccionesTerritoriales2025: { solicitudes: [] }, rentasExtranjeras: 'ninguna', especialidades: 'ninguna', perfil: 'solo-trabajo', conciliacion: { ejercicio: 2025, estado: 'totales-anuales-sin-duplicados', procedencia: ['certificado'] }, retenciones: [], trabajo: { ejercicio: 2025, territorio: 'comun', reduccionesArt18: 'ninguna', movilidad: 'ninguna', discapacidadActiva: 'ninguna', rendimientos: [{ id: 'empleo', clase: 'empleo-laboral', integro: bruto, cotizaciones: { clase: 'efectivas', seguridadSocial: '0', derechosPasivos: '0', colegiosHuerfanos: '0' }, sindicato: { importe: '0', satisfecho: 'no' }, colegio: { importe: '0', satisfecho: 'no', obligatorio: 'no', finesEsenciales: 'no' }, defensa: { importe: '0', satisfecho: 'no', litigioDirectoPagador: 'no' } }] } }; }
const runC = (c) => Effect.runSync(canonica(c, { modo: 'canonico' }));
const runE = (c) => Effect.runSync(efectiva(c));
it.each(rows)('Fraction productor y ambas API $precio + $tributos + $gastos ayuda $ayuda', r => {
    const h = hechos(r.precio, r.tributos, r.gastos, r.ayuda), b = producir(h, 'u', new D(99999));
    expect(b.base.toFixed()).toBe(rat(r.base));
    expect(b.generada.toFixed()).toBe(rat(r.generada));
    for (const [build, run, amount] of [[caso, runC, (x) => new D(x.cuotaLiquidaCentimos).div(100)], [explicito, runE, (x) => new D(x.cuotaLiquidaLegal)]]) {
        const sin = run(build()), con = run({ ...build(), deduccionesTerritoriales2025: sobre(h) });
        // Sólo se cuantiza en la salida pública a céntimos.
        expect(amount(sin).minus(amount(con)).toDecimalPlaces(2).toFixed(2)).toBe(new D(rat(r.generada)).plus(rat(r.regional)).toDecimalPlaces(2).toFixed(2));
        expect(con.deduccionesTerritoriales2025.vehiculoDA582025.generada.toFixed()).toBe(rat(r.generada));
    }
});
it.each([0, 12000, 20000, 26000])('cuota insuficiente %s: techo regional resta generada, ambas API', bruto => {
    for (const [build, run] of [[() => caso(bruto), runC], [() => explicito(String(bruto)), runE]]) {
        const a = run({ ...build(), deduccionesTerritoriales2025: sobre(hechos(), false) }), b = run({ ...build(), deduccionesTerritoriales2025: sobre() });
        const libro = b.deduccionesTerritoriales2025.vehiculoDA582025;
        expect(libro.generada.toFixed()).toBe('3000');
        expect(libro.aplicada.lte(3000)).toBe(true);
        expect(b.deduccionesTerritoriales2025.aplicaciones[0].generado).toEqual({ numeradorEuros: '1000', divisor: '1' });
        if (bruto === 26000)
            expect(libro.aplicada.toFixed()).toBe(run === runC ? '1902.78' : '2155.5');
        if (bruto === 0 || bruto === 12000)
            expect(libro.aplicada.toFixed()).toBe('0');
        const amount = (x) => new D(x.cuotaLiquidaLegal ?? new D(x.cuotaLiquidaCentimos).div(100));
        expect(amount(a).minus(amount(b)).lte(1000)).toBe(true);
        if (process.env.REVIEW_OUT)
            fs.appendFileSync(process.env.REVIEW_OUT + '/insuficiencia.jsonl', JSON.stringify({ bruto, api: run === runC ? 'canonica' : 'efectiva', generada: libro.generada.toFixed(), aplicada: libro.aplicada.toFixed(), regional: b.deduccionesTerritoriales2025.total, delta: amount(a).minus(amount(b)).toFixed() }) + '\n');
    }
});
const cambios = {
    'pago duplicado': (h) => h.vehiculo.pagos.push({ ...h.vehiculo.pagos[0] }),
    'documento duplicado': (h) => { h.vehiculo.pagos[0].importe = '15000'; h.vehiculo.pagos.push({ ...h.vehiculo.pagos[0], id: 'p2' }); },
    'ayuda duplicada': (h) => { h.vehiculo.ayudas = hechos('30000', '0', '0', '1000').vehiculo.ayudas; h.vehiculo.ayudas.push({ ...h.vehiculo.ayudas[0] }); },
    'ayuda excesiva': (h) => h.vehiculo.ayudas = hechos('30000', '0', '0', '30001').vehiculo.ayudas,
    'ayuda ajena': (h) => { h.vehiculo.ayudas = hechos('30000', '0', '0', '1').vehiculo.ayudas; h.vehiculo.ayudas[0].vehiculoId = 'otro'; },
    'sin censo ayudas': (h) => delete h.vehiculo.ayudas,
    'sin exhaustividad': (h) => delete h.vehiculo.exhaustividad,
    'sin historia': (h) => delete h.historia,
    'factura ajena': (h) => h.vehiculo.titularFactura = 'otro',
    'titular ajeno': (h) => h.vehiculo.titular = 'otro',
    'vendedor ajeno': (h) => h.vehiculo.pagos[0].vendedor = 'otro',
    'pagador ajeno': (h) => h.vehiculo.pagos[0].pagador = 'otro',
    'fecha imposible': (h) => h.vehiculo.primeraMatriculacion = '2025-02-29',
    'futura': (h) => h.vehiculo.primeraMatriculacion = '2026-09-18',
    'anterior': (h) => h.vehiculo.pagos[0].fecha = '2024-12-31',
    'consulta posterior': (h) => h.vehiculo.fechaConsultaIDAE = '2025-10-01',
    'pago posterior': (h) => h.vehiculo.pagos[0].fecha = '2025-10-01',
    'matricula previa': (h) => h.vehiculo.primeraMatriculacion = '2025-09-15',
    'anticipo': (h) => h.opcion = 'anticipo_25_por_ciento',
    'PHEV': (h) => h.vehiculo.tecnologia = 'PHEV',
    'L3e': (h) => h.vehiculo.categoria = 'L3e',
    '8 plazas': (h) => h.vehiculo.plazas = 8,
    'bajo WLTP': (h) => h.vehiculo.autonomiaWLTP = '29.9999999999999',
    'sobre precio': (h) => { h.vehiculo.precioSinIVA = '45000.000000001'; h.vehiculo.pagos[0].importe = '45000.000000001'; },
    'base externa': (h) => h.base = '20000',
    'ayuda cobrada': (h) => { h.vehiculo.ayudas = hechos('30000', '0', '0', '1000').vehiculo.ayudas; h.vehiculo.ayudas[0].estado = 'cobrada_2025'; },
};
it.each(Object.keys(cambios))('rechazo concreto productor + ambas API: %s', k => { const h = hechos(); cambios[k](h); expect(() => producir(h, 'u', new D(9999))).toThrow(); expect(() => runC({ ...caso(), deduccionesTerritoriales2025: sobre(h) })).toThrow(); expect(() => runE({ ...explicito(), deduccionesTerritoriales2025: sobre(h) })).toThrow(); });
it('pagos partidos distintos y ayuda igual valor: estatal cero primario; CyL conserva pagos', () => { const h = hechos('10000', '0', '0', '10000'); h.vehiculo.pagos[0].importe = '2500'; h.vehiculo.pagos.push({ ...h.vehiculo.pagos[0], id: 'p2', documento: 'recibo2', importe: '7500' }); const b = producir(h, 'u', new D(9999)); expect(b.generada.toFixed()).toBe('0'); expect(runC({ ...caso(), deduccionesTerritoriales2025: sobre(h) }).deduccionesTerritoriales2025.total).toEqual({ numeradorEuros: '1500', divisor: '1' }); });
it.each(['vehiculo', 'pago', 'fecha', 'importe', 'titular', 'duplicacion', 'estatalExterna'])('conciliación regional ambas API: %s', k => { const s = sobre(), v = s.solicitudes[0].hechos.vehiculos[0]; if (k === 'vehiculo')
    v.id = 'otro'; if (k === 'pago')
    v.pagos[0].id = 'otro'; if (k === 'fecha')
    v.pagos[0].fecha = '2025-09-17'; if (k === 'importe')
    v.pagos[0].importe = '29999'; if (k === 'titular')
    v.adquirentes = ['otro']; if (k === 'duplicacion')
    s.solicitudes.push(s.solicitudes[0]); if (k === 'estatalExterna')
    v.deduccionEstatal = '0'; expect(() => runC({ ...caso(), deduccionesTerritoriales2025: s })).toThrow(); expect(() => runE({ ...explicito(), deduccionesTerritoriales2025: s })).toThrow(); });
it('región distinta conserva rechazo', () => { expect(() => runC({ ...caso(), comunidadAutonoma: 'andalucia', deduccionesTerritoriales2025: sobre(hechos(), false) })).toThrow(); expect(() => runE({ ...explicito(), comunidadAutonoma: 'andalucia', deduccionesTerritoriales2025: sobre(hechos(), false) })).toThrow(); });
it.each(['40000', '40000.000000000000000000000000000000000000000000000000000000000000000000000001'])('frontera CyL de 80 cifras %s', p => { for (const [build, run] of [[caso, runC], [explicito, runE]]) {
    const b = run({ ...build(), deduccionesTerritoriales2025: sobre(hechos(p)) });
    expect(b.deduccionesTerritoriales2025.total).toEqual({ numeradorEuros: p === '40000' ? '1000' : '0', divisor: '1' });
} });
it.each(['2025-01-01', '2025-12-31'])('fechas inclusivas %s', f => { const h = hechos(); for (const key of ['fechaAdquisicion', 'primeraMatriculacion', 'fechaConsultaIDAE'])
    h.vehiculo[key] = f; h.vehiculo.pagos[0].fecha = f; expect(producir(h, 'u', new D(9999)).generada.toFixed()).toBe('3000'); });
it('no mezcla donativos fiscales externos ni otra fuente autonómica', () => { for (const [build, run] of [[caso, runC], [explicito, runE]]) {
    const s = sobre();
    s.donativosEstatales2025 = { base: '100', deduccion: '80' };
    expect(() => run({ ...build(), deduccionesTerritoriales2025: s })).toThrow();
} ; expect(() => runC({ ...caso(), deducciones: [{ tipo: 'autonomica', importeCentimos: 100000 }], deduccionesTerritoriales2025: sobre() })).toThrow(); });
