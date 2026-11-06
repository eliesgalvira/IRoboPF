import { Schema } from "effect"
import { Euros } from "../trabajo-anual/contrato"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const Soporte = Schema.Struct({ referencia: Texto, emisor: Texto, fecha: Fecha })
const Cobro = Schema.Struct({ id: Texto, fecha: Fecha, importe: Euros, cuenta: Texto, referenciaBancaria: Texto, exigibleEl: Fecha, descuentosNomina: Euros, retencion: Euros, compensaciones: Euros })
/** Censo de ingresos, no magnitud fiscal. Sólo SS pública española contributiva. */
export const EconomiaExentaFamiliar2025 = Schema.Union([
  Schema.Struct({ perfil: Schema.Literal("sin-rentas"), censoCompleto: Schema.Literal(true), soporte: Soporte }),
  Schema.Struct({ perfil: Schema.Literal("pension-ss-incapacidad"), censoCompleto: Schema.Literal(true),
    otrasRentasSujetas: Schema.Literals(["ninguna", "presentes", "desconocidas"]), otrasExentas: Schema.Literals(["ninguna", "presentes", "desconocidas"]),
    atrasosOtrosEjercicios: Schema.Literal("ninguno"), prestacionesDevengadasNoCobradas: Schema.Literal("ninguna"), anticiposOtrosEjercicios: Schema.Literal("ninguno"), devoluciones: Schema.Literal("ninguna"),
    prestaciones: Schema.Array(Schema.Struct({ id: Texto, organismo: Schema.Literals(["INSS", "ISM", "mutualidad", "privada", "extranjero"]),
      sistema: Schema.Literal("SS-espanola-contributiva"),
      grado: Schema.Literals(["absoluta", "gran-invalidez", "gran-incapacidad", "total", "parcial", "desconocida"]),
      resolucion: Soporte, efectosDesde: Fecha, efectosHasta: Fecha,
      cobros: Schema.Array(Cobro).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
    })).check(Schema.isMinLength(1), Schema.isMaxLength(10)),
  }),
])
export type EconomiaExentaFamiliar2025 = typeof EconomiaExentaFamiliar2025.Type
const Diario = Schema.Struct({ fecha: Fecha, saldoCierre: Euros, movimientos: Schema.Array(Schema.Struct({
  id: Texto, sentido: Schema.Literals(["entrada", "salida"]), importe: Euros,
  causa: Schema.Literals(["pension", "consumo", "transferencia-propia"]), referencia: Texto,
})) })
export const PatrimonioFamiliarExt2025 = Schema.Struct({
  devengo: Schema.Literal("2025-12-31"), titular: Id,
  residenciaFiscalTodo2025: Schema.Literal("extremadura"), residenciaEspanaTodo2025: Schema.Literal(true),
  regimenEspecialExpatriados: Schema.Literal("no"), censoMundialCompleto: Schema.Literal(true), soporte: Soporte,
  cuentas: Schema.Array(Schema.Struct({ id: Texto, titular: Id, porcentajeBasisPoints: Schema.Number.check(Schema.isInt(), Schema.isBetween({minimum:1,maximum:10000})),
    titularidadDesde: Fecha, titularidadInvariable2025: Schema.Literal(true), remuneracion2025: Schema.Literal("ninguna"),
    saldo30Septiembre: Euros, saldo31Diciembre: Euros, diarioQ4: Schema.Array(Diario).check(Schema.isMinLength(92), Schema.isMaxLength(92)),
    movimientosQ4Completos: Schema.Literal(true), adquisicionesBienesQ4: Schema.Literal("ninguna"),
    cancelacionesDeudaQ4: Schema.Literal("ninguna"), prestamosIngresadosQ4: Schema.Literal("ninguno"), soporte: Soporte,
  })).check(Schema.isMaxLength(30)),
  vivienda: Schema.optionalKey(Schema.Struct({ id: Texto, titular: Id, porcentajeBasisPoints: Schema.Number.check(Schema.isInt(), Schema.isBetween({minimum:1,maximum:10000})),
    plenoDominioDesde: Fecha, ocupacionHabitualDesde: Fecha, ocupacionIninterrumpidaHasta: Fecha,
    catastral: Schema.Struct({ importe: Euros, soporte: Soporte }),
    adquisicion: Schema.Struct({ precio: Euros, fecha: Fecha, soporte: Soporte }),
    valoresAdministrativos: Schema.Array(Schema.Struct({ importe: Euros, soporte: Soporte })),
    censoValoresAdministrativosCompleto: Schema.Literal(true),
  })),
  deudas: Schema.Array(Schema.Struct({ id: Texto, deudor: Id, principalPendiente: Euros, origen: Fecha,
    destino: Schema.Literals(["vivienda", "consumo"]), bienFinanciado: Schema.optionalKey(Texto), soporte: Soporte })),
  otrasClases: Schema.Struct({ inmuebles: Schema.Literal("ninguno"), derechosReales: Schema.Literal("ninguno"),
    valoresParticipaciones: Schema.Literal("ninguno"), segurosRentas: Schema.Literal("ninguno"),
    negocios: Schema.Literal("ninguno"), vehiculosJoyasArte: Schema.Literal("ninguno"),
    creditosCriptoEfectivo: Schema.Literal("ninguno"), otrosDerechos: Schema.Literal("ninguno"),
    deudasCargas: Schema.Literal("ninguna"),
  }),
})
export type PatrimonioFamiliarExt2025 = typeof PatrimonioFamiliarExt2025.Type
const Convivencia = Schema.Union([
  Schema.Struct({ clase: Schema.Literal("ninguna"), soporte: Soporte }),
  Schema.Struct({ clase: Schema.Literal("efectiva"), inicio: Fecha, fin: Fecha,
    acreditacion: Schema.Struct({ referencia: Texto, emisor: Texto, fecha: Fecha, organo: Schema.Literal("organismo-publico-competente") }) }),
])
/** Parientes lineales vivos completos, primer grado; otros grados aún fuera de cobertura. */
export const HechosFamiliarExentoExt2025 = Schema.Struct({
  perfil: Schema.Literal("familiar-pension-exenta-2025"), ejercicio: Schema.Literal(2025),
  familiar: Schema.Struct({ id: Id, nacimiento: Fecha, vivoTodo2025: Schema.Literal(true),
    discapacidad: Schema.Struct({ grado: Schema.Number.check(Schema.isInt(), Schema.isBetween({minimum:0,maximum:100})),
      desde: Fecha, hasta: Fecha, certificado: Soporte }),
    economia: EconomiaExentaFamiliar2025, patrimonio: PatrimonioFamiliarExt2025,
    dependencia: Schema.Union([
      Schema.Struct({ situacion: Schema.Literal("sin-ayuda-reconocida"), censoCompleto: Schema.Literal(true), soporte: Soporte }),
      Schema.Struct({ situacion: Schema.Literal("reconocida-no-cobrada"), importeMensualReconocido: Euros, evaluacionSocial: Soporte, resolucion: Soporte,
        efectosDesde: Fecha, cobrosHastaDevengo: Schema.Array(Cobro).check(Schema.isMaxLength(0)), censoCobrosCompleto: Schema.Literal(true) }),
    ]),
  }),
  parientesLinealesVivosCompletos: Schema.Literal(true),
  otrosGradosVivos: Schema.Literal("ninguno"), soporteCensoLineal: Soporte,
  parientes: Schema.Array(Schema.Struct({ id: Id, nacimiento: Fecha, vivoTodo2025: Schema.Literal(true),
    parentescoRespectoFamiliar: Schema.Literals(["progenitor", "hijo"]), filiacion: Soporte,
    residencia2025: Schema.Literals(["extremadura", "otra"]), poblacionMunicipio: Schema.Number.check(Schema.isInt(), Schema.isGreaterThanOrEqualTo(3000)),
    convivencia: Convivencia,
    economia: Schema.Union([Schema.Struct({ perfil: Schema.Literal("declarante-en-composicion") }), EconomiaExentaFamiliar2025]),
  })).check(Schema.isMinLength(1), Schema.isMaxLength(30)),
})
export type HechosFamiliarExentoExt2025 = typeof HechosFamiliarExentoExt2025.Type
