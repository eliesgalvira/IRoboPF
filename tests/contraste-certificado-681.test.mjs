import {it,expect} from "vitest"
import {Effect,Result} from "effect"
import {aplicarDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial"
// Helpers de construcción de entrada adaptados de las siete pruebas recibidas.
import Decimal from "decimal.js";
import { Schema } from "effect";
import fixture from "./fixtures/aragon-conexion-anual-20261105.json";
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial";
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual";
// Esperados propios: base estatal100000*1/2; exceso110000-100000, regional*1/5.
function entrada(emision, positiva = true) {
    const s = structuredClone(fixture.inversion);
    for (const i of s.hechos.inversiones)
        i.certificadoEntidad.fechaEmision = emision;
    if (!positiva)
        return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [s] });
    s.hechos.inversiones[0].asignacion = { estatalCentimos: 5000000, aragonCentimos: 0, sinDeduccionCentimos: 0 };
    s.hechos.inversiones[1].asignacion = { estatalCentimos: 5000000, aragonCentimos: 1000000, sinDeduccionCentimos: 0 };
    return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [{ ...s, hechos: { ...s.hechos, estatal681: {
                        exhaustividad: "cuentas-y-censo-sin-otros-bienes-ni-deudas", censo: "revision-censo", contribuyente: "t",
                        fechaInicio: "2025-01-01", fechaFin: "2025-12-31", origenFondos: "renta2025-sin-cuentas-ahorro-empresa", referenciaOrigenFondos: "revision-renta",
                        cuentasInicio: [{ id: "banco", titular: "t", saldoCentimos: 100000, referencia: "inicio" }],
                        cuentasFin: [{ id: "banco", titular: "t", saldoCentimos: 100000, referencia: "fin" }],
                        titularidades: s.hechos.inversiones.map(i => ({ inversion: i.id, contribuyente: "t", entidad: i.entidad, escritura: i.escritura, fechaAdquisicion: i.fechaSuscripcion, certificado: i.certificadoEntidad.referencia, referencia: "revision-titulo-" + i.id }))
                    } } }] }, { onExcessProperty: "error" });
}
function magnitudes(estatal = "60000", autonomica = "60000") {
    return { caso: { anio: 2025, comunidadAutonoma: "aragon", contribuyenteId: "t", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } }, baseGeneral: new Decimal(1000000), baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(autonomica), cuotaEstatal681: new Decimal(estatal), sujetosConMinimo: [] };
}
const vacia = Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [] });
function tecnica(s) {
    return liquidarIrpfAnual({ anio: 2025, comunidadAutonoma: "aragon", contribuyenteId: "t", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] }, rendimientos: { trabajo: [{ importeIntegroCentimos: 100000000 }] }, reducciones: [], deducciones: [], deduccionesTerritoriales2025: s, retencionesSoportadasCentimos: 10000, pagosACuentaCentimos: 20000 }, { modo: "canonico" });
}
function explicita(s) {
    const caso = { ejercicio: 2025, comunidadAutonoma: "aragon", contribuyenteId: "t", edad: 40, modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31", otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo", conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{ id: "empleo", clase: "empleo-laboral", integro: "1000000", cotizaciones: { clase: "efectivas", seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" }, sindicato: { importe: "0", satisfecho: "no" }, colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" }, defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] }, retenciones: [{ ejercicio: 2025, operacionId: "retencion", procedencia: "certificado", importe: "100", efectiva: true }] };
    return liquidarIrpfAnualExplicito(caso);
}

const adversos = [
 ['fecha imposible posterior', s => {s.solicitudes[0].hechos.inversiones[0].certificadoEntidad.fechaEmision='2026-02-29'}],
 ['mes imposible posterior', s => {s.solicitudes[0].hechos.inversiones[0].certificadoEntidad.fechaEmision='2027-13-01'}],
 ['anterior a suscripción', s => {s.solicitudes[0].hechos.inversiones[0].certificadoEntidad.fechaEmision='2024-12-31'}],
 ['certificado ajeno', s => {s.solicitudes[0].hechos.inversiones[0].certificadoEntidad.referencia='certificado-de-otro'}],
 ['certificado ausente', s => {s.solicitudes[0].hechos.inversiones[0].certificadoEntidad.referencia=''}],
 ['titular ajeno', s => {s.solicitudes[0].hechos.estatal681.titularidades[0].contribuyente='otro'}],
 ['ejercicio acreditado incorrecto', s => {s.solicitudes[0].hechos.inversiones[0].certificadoEntidad.ejercicio=2026}],
];
for(const [nombre, mutar] of adversos){
 it('CONTRASTE libro '+nombre,()=>{const s=structuredClone(entrada('2027-04-23'));mutar(s);expect(()=>aplicarDeduccionesTerritoriales2025(s,magnitudes())).toThrow()});
 it('CONTRASTE ambas API '+nombre,()=>{
  const s=structuredClone(entrada('2027-04-23'));mutar(s);
  expect(Result.isFailure(Effect.runSync(Effect.result(tecnica(s))))).toBe(true);
  expect(Result.isFailure(Effect.runSync(Effect.result(explicita(s))))).toBe(true);
 });
}
it('CONTRASTE igualdad suscripción y bisiesto posterior válidos',()=>{
 for(const f of ['igual','2028-02-29']){
  const s=structuredClone(entrada('2027-04-23'));
  for(const i of s.solicitudes[0].hechos.inversiones)i.certificadoEntidad.fechaEmision=f==='igual'?i.fechaSuscripcion:f;
  const r=aplicarDeduccionesTerritoriales2025(s,magnitudes());
  expect(r.estatal681?.consumo.total).toEqual({numeradorEuros:'50000',divisor:'1'});
  expect(r.total).toEqual({numeradorEuros:'2000',divisor:'1'});
 }
});
it('CONTRASTE cuotas nulas separadas con emisión2027',()=>{
 const a=aplicarDeduccionesTerritoriales2025(entrada('2027-04-23'),magnitudes('0','60000'));
 const b=aplicarDeduccionesTerritoriales2025(entrada('2027-04-23'),magnitudes('60000','0'));
 expect(a.estatal681?.consumo.total).toEqual({numeradorEuros:'0',divisor:'1'});expect(a.total).toEqual({numeradorEuros:'2000',divisor:'1'});
 expect(b.estatal681?.consumo.total).toEqual({numeradorEuros:'50000',divisor:'1'});expect(b.total).toEqual({numeradorEuros:'0',divisor:'1'});
});

it('CONTRASTE ambas API emisión2027 consumo único',()=>{
 const s=entrada('2027-04-23');
 const bt=Effect.runSync(tecnica(vacia)), rt=Effect.runSync(tecnica(s));
 expect(bt.cuotaLiquidaCentimos-rt.cuotaLiquidaCentimos).toBe(5200000);
 expect(bt.cuotaDiferencialCentimos-rt.cuotaDiferencialCentimos).toBe(5200000);
 expect(rt.retencionesYPagosACuentaCentimos).toBe(30000);
 const be=Effect.runSync(explicita(vacia)), re=Effect.runSync(explicita(s));
 expect(new Decimal(be.cuotaLiquidaLegal).minus(re.cuotaLiquidaLegal).toFixed()).toBe('52000');
 expect(new Decimal(be.cuotaDiferencial).minus(re.cuotaDiferencial).toFixed()).toBe('52000');
});
