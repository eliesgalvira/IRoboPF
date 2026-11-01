import assert from "node:assert/strict"
import { casos } from "../../lotes/c/casos"
import { calcularDeduccionesAutonomicasAplicadas as auxiliar, calcularDeduccionesConsignadas as manual } from "../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

// Hechos hipotéticos adicionales, fijados por la revisión. No representan declaraciones reales.
export const hechos = [
  { codigo: casos[0].codigo, residencia: "Canarias todo 2025", modalidad: "individual", renta: 20000, cuotaAutonomicaDisponible: 5000, nacimiento: "2025-02-01", hijosConvivientesAlDevengo: 3, hijosPreviosConDiscapacidad65: 0, discapacidadNuevoHijo: 65, convivenciaIninterrumpida: true, titularesConDerecho: 1 },
  { codigo: casos[1].codigo, residencia: "Canarias todo 2025", modalidad: "dos individuales", tituloGeneralVigenteAlDevengo: true, convivenciaConRestoMiembros: true, titulares: 2, discapacidad65: false, cuotaAutonomicaDisponiblePorTitular: 5000 },
  { codigo: casos[2].codigo, residencia: "Canarias todo 2025 ambos", modalidad: "conjunta", edadesAlDevengo: [40, 42], discapacidadReconocida: [33, 33], baseGeneralConjunta: 20000, baseAhorro: 0, cuotaAutonomicaDisponible: 5000 },
  { codigo: casos[3].codigo, residencia: "Canarias todo 2025 ambos", modalidad: "conjunta", mesesDesempleoLegal: [8, 8], prestacionesPercibidas: [true, true], rendimientosIntegrosTrabajo: [9000, 9000], otrasBases: 0, cuotaAutonomicaDisponible: 5000 },
  { codigo: casos[4].codigo, residencia: "Illes Balears todo 2025", modalidad: "individual", edadAscendientes: [70, 72], rentasAscendientes: [0, 0], declaracionesConRentaSuperior1800: [false, false], convivenciaTodoEjercicio: true, derechoMinimoAscendientes: true, titularesConDerecho: 1, residenciaPorPersona: [2000, 2000], pagoBancario: true, baseGeneral: 20000, baseAhorro: 0, ayudas: 0, deduccionConciliacion: false, cuotaAutonomicaDisponible: 5000 },
] as const

export const fronteras = [
  { nombre: "primer hijo total y primer discapacitado", entradas: { ...casos[0].entradas, canariasOrdenHijoNacimientoAdopcion: "primero-segundo" }, territorio: "canarias", esperado: 865 },
  { nombre: "familia especial dos titulares", entradas: { canariasCategoriaFamiliaNumerosa: "especial" }, territorio: "canarias", esperado: 398 },
  { nombre: "un contribuyente discapacitado mayor65", entradas: { canariasContribuyenteDiscapacidad33: true, canariasContribuyenteMayor65: true, canariasDiscapacidadMayoresCumpleLimites: true }, territorio: "canarias", esperado: 560 },
  { nombre: "un desempleado que cumple", entradas: { canariasDesempleadoCumpleRequisitos: true }, territorio: "canarias", esperado: 120 },
  { nombre: "cuidados una persona base1650", entradas: { "balears_gastos_mayores_65_discapacidad:cumple": true, "balears_gastos_mayores_65_discapacidad:base": 1650 }, territorio: "illes-balears", esperado: 660 },
  { nombre: "cuidados dos personas base1000 cada una", entradas: { "balears_gastos_mayores_65_discapacidad:cumple": true, "balears_gastos_mayores_65_discapacidad:base": 2000 }, territorio: "illes-balears", esperado: 800 },
] as const

let rojos = 0
for (const c of casos) {
  const ambito = { ejercicio: 2025 as const, territorio: c.codigo.startsWith("canarias") ? "canarias" as const : "illes-balears" as const }
  const observado = auxiliar(c.entradas, ambito)
  console.log(JSON.stringify({codigo: c.codigo, esperado: c.esperado, observado}))
  // El booleano y el agregado no pueden representar todos los hechos anteriores.
  assert.equal(manual(c.entradas, ambito), 0)
  assert.equal(manual({ [c.codigo + ":cumple"]: true, [c.codigo + ":importe"]: c.esperado }, ambito), c.esperado)
  if (observado !== c.esperado) rojos++
}
for (const c of fronteras) {
  const observado = auxiliar(c.entradas, { ejercicio: 2025, territorio: c.territorio })
  console.log(JSON.stringify({nombre: c.nombre, esperado: c.esperado, observado}))
  if (observado !== c.esperado) rojos++
}
// Se exige la expectativa fiscal: falla mientras persistan los cinco defectos y dos fronteras.
assert.equal(rojos, 0, `${rojos} discrepancias fiscales del auxiliar; no son errores demostrados de la ruta anual`)
