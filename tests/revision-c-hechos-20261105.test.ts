import { expect, it } from "vitest"
import {
  evaluarTraslado,
  evaluarConciliacion,
  evaluarEnfermedad,
  evaluarEstudiosNoSuperiores,
  evaluarGuarderia,
  evaluarIdiomas,
  evaluarSegurosImpago,
  evaluarTercerSector,
  evaluarDiscapacidad,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025"
import type {
  Marco,
  Pago,
  Descendiente,
  Conciliacion,
  Traslado,
  Seguros,
  Enfermedad,
  Resultado,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025"
const marco = (territorio: Marco["territorio"] = "canarias"): Marco => ({
  ejercicio: 2025,
  territorio,
  contribuyente: "P",
  modalidad: "individual",
  devengo: "2025-12-31",
  causaDevengo: "fin_ejercicio",
  baseGeneral: "20000",
  baseAhorro: "0",
  exhaustividad: "declaracion_completa",
})
const pago = (importe = "1000", id = "F1"): Pago => ({
  id,
  fecha: "2025-02-15",
  pagador: "P",
  perceptor: "CENTRO",
  factura: id,
  importe,
  ayudasExentas: "0",
  reembolsos: "0",
  medio: "transferencia",
})
const hijo = (id = "H"): Descendiente => ({
  id,
  nacimiento: "2023-01-01",
  titulares: ["P"],
  minimo: {
    ejercicio: 2025,
    persona: id,
    contribuyente: "P",
    expediente: "M-" + id,
  },
  convivenciaDesde: "2023-01-01",
  convivenciaHasta: "2025-12-31",
})
function importe(r: Resultado, n: string) {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado === "calculo_parcial") expect(r.importeExacto).toBe(n)
}
function rechazo(r: Resultado) {
  expect(r.estado).toBe("no_soportado")
  expect(r).not.toHaveProperty("importeExacto")
}
const conciliacion = (): Conciliacion => ({
  ...marco("illes-balears"),
  nacimiento: "1980-01-01",
  discapacidad: 0,
  resolucionDiscapacidad: "",
  familia: "ordinaria",
  tituloFamilia: "",
  minimoDiscapacidad: [],
  actividad: { tipo: "trabajo", identificador: "CT", diasRETA: 0 },
  titulares: ["P"],
  menores: [
    {
      ...hijo(),
      gastos: [{ ...pago(), servicio: "guarderia", altaSeguridadSocial: "" }],
    },
  ],
})
const traslado = (): Traslado => ({
  ...marco(),
  traslado: {
    fecha: "2024-03-01",
    persona: "P",
    islaOrigen: "Tenerife",
    islaDestino: "La Palma",
    actividad: "trabajo",
    contratoOAlta: "CT",
    modalidadOrigen: "conjunta",
    baseGeneralOrigen: "60500",
    baseAhorroOrigen: "0",
    permanenciaHasta: "2025-12-31",
  },
  cuotaTrabajoActividad: {
    ejercicio: 2025,
    persona: "P",
    importe: "299.99",
    liquidacion: "L",
  },
})
const seguro = (territorio: Marco["territorio"]): Seguros => ({
  ...marco(territorio),
  viviendas: [
    {
      catastro: "RC",
      territorio,
      arrendatario: "A",
      inicio: "2024-01-01",
      finInicial: "2025-01-01",
      destino: "vivienda",
      fianzaDeposito: "D",
      rendimiento: "capital_inmobiliario",
      rentaMensual: "800",
      certificadoObligacionesFiscales: "C",
      poliza: "POL",
      cobertura: "impago_rentas",
      gastos: [pago("199.99")],
    },
  ],
})
const enfermedad = (): Enfermedad => ({
  ...marco(),
  nacimiento: "1959-12-31",
  discapacidad: 0,
  pacientesMinimo: [],
  gastos: [
    {
      ...pago("6000"),
      paciente: "P",
      concepto: "dental",
      profesional: "medico",
      colegiacion: "COL",
    },
  ],
})
// Oráculos: citas auditadas que se identifican en FUENTES.json; no se importan tests ni fórmulas de autor.
it("CAMP01 origen conjunto2024 inclusivo, cuota299.99 y reserva2027", () => {
  const h = traslado()
  h.baseGeneral = "99999"
  const r = evaluarTraslado(h)
  importe(r, "299.99")
  if (r.estado === "calculo_parcial")
    expect(r.reservas.join(" ")).toContain("2027-12-31")
  h.traslado.baseAhorroOrigen = "0.01"
  rechazo(evaluarTraslado(h))
})
it("CAMP01 origen2025 conserva reserva2028 y límite61770", () => {
  const h = traslado()
  h.traslado.fecha = "2025-03-01"
  h.traslado.baseGeneralOrigen = "61770"
  h.cuotaTrabajoActividad.importe = "900"
  const r = evaluarTraslado(h)
  importe(r, "300")
  if (r.estado === "calculo_parcial")
    expect(r.reservas.join(" ")).toContain("2028-12-31")
})
it("CAMP02 general40/660 frontera exacta", () => {
  const h = conciliacion()
  h.menores[0].gastos[0].importe = "1649.99"
  importe(evaluarConciliacion(h), "659.996")
  h.menores[0].gastos[0].importe = "1650.01"
  importe(evaluarConciliacion(h), "660")
})
it("CAMP02 ya reforzado antes de julio", () => {
  const h = conciliacion()
  h.nacimiento = "1990-01-01"
  h.devengo = "2025-07-10"
  h.causaDevengo = "fallecimiento"
  h.menores[0].gastos[0].importe = "1800"
  importe(evaluarConciliacion(h), "900")
})
it("CAMP02 especial renta42900 vs42900.01 sin alterar tipo", () => {
  const h = conciliacion()
  h.familia = "numerosa_especial"
  h.tituloFamilia = "T"
  h.baseGeneral = "42900"
  importe(evaluarConciliacion(h), "500")
  h.baseAhorro = "0.01"
  rechazo(evaluarConciliacion(h))
})
it("CAMP02 RETA182/183 discrimina40/50", () => {
  const h = conciliacion()
  h.actividad.tipo = "economica"
  h.actividad.diasRETA = 182
  importe(evaluarConciliacion(h), "400")
  h.actividad.diasRETA = 183
  importe(evaluarConciliacion(h), "500")
})
it("ROJO R1: dos titulares reparten límite660; gasto propio1000 genera330", () => {
  const h = conciliacion()
  h.titulares = ["P", "Q"]
  h.menores[0].titulares = ["P", "Q"]
  importe(evaluarConciliacion(h), "330")
})
it("ROJO R1: reforzado dos titulares reparten límite900; gasto propio1000 genera450", () => {
  const h = conciliacion()
  h.nacimiento = "1990-01-01"
  h.titulares = ["P", "Q"]
  h.menores[0].titulares = ["P", "Q"]
  importe(evaluarConciliacion(h), "450")
})
it("ROJO R2: RETA365 incompatible con fallecimiento11julio", () => {
  const h = conciliacion()
  h.actividad.tipo = "economica"
  h.actividad.diasRETA = 365
  h.devengo = "2025-07-11"
  h.causaDevengo = "fallecimiento"
  rechazo(evaluarConciliacion(h))
})
it("Conciliación excluye efectivo, servicios a edad incorrecta y pagador ajeno", () => {
  const h = conciliacion()
  h.menores[0].gastos[0].medio = "efectivo"
  rechazo(evaluarConciliacion(h))
  h.menores[0].gastos[0].medio = "transferencia"
  h.menores[0].gastos[0].servicio = "comedor_centro"
  rechazo(evaluarConciliacion(h))
  h.menores[0].gastos[0].servicio = "guarderia"
  h.menores[0].gastos[0].pagador = "Q"
  rechazo(evaluarConciliacion(h))
})
it("Guardería neto, reparto y exclusión año de cumplir3", () => {
  const u = {
    ...hijo(),
    centro: "CENTRO",
    autorizacion: "A",
    gastos: [{ ...pago(), ayudasExentas: "100", reembolsos: "100" }],
  }
  importe(evaluarGuarderia({ ...marco(), hijos: [u] }), "144")
  u.nacimiento = "2022-12-31"
  u.convivenciaDesde = "2022-12-31"
  rechazo(evaluarGuarderia({ ...marco(), hijos: [u] }))
})
it("Estudios agregado dos hijos199 y no pago duplicado", () => {
  const a = {
    ...hijo(),
    etapa: "basica" as const,
    gastos: [{ ...pago("198.99"), concepto: "libro" as const }],
  }
  const b = {
    ...hijo("H2"),
    etapa: "basica" as const,
    gastos: [{ ...pago("0.02", "F2"), concepto: "libro" as const }],
  }
  importe(evaluarEstudiosNoSuperiores({ ...marco(), hijos: [a, b] }), "199")
  b.gastos[0].id = "F1"
  rechazo(evaluarEstudiosNoSuperiores({ ...marco(), hijos: [a, b] }))
})
it("Idiomas neto tras ayuda200 y reembolso100", () => {
  const u = {
    ...hijo(),
    etapa: "primaria" as const,
    idioma: "inglés",
    actividad: "extraescolar" as const,
    gastos: [{ ...pago(), ayudasExentas: "200", reembolsos: "100" }],
  }
  importe(evaluarIdiomas({ ...marco("illes-balears"), hijos: [u] }), "105")
})
it("Enfermedad65 exactos500,66 años600, renta alta150", () => {
  const h = enfermedad()
  h.nacimiento = "1960-12-31"
  importe(evaluarEnfermedad(h), "500")
  h.nacimiento = "1959-12-31"
  importe(evaluarEnfermedad(h), "600")
  h.baseGeneral = "46455.01"
  importe(evaluarEnfermedad(h), "150")
  h.gastos[0].concepto = "prima_seguro"
  rechazo(evaluarEnfermedad(h))
})
it("Seguros ambos territorios75% y topes agregados", () => {
  for (const t of ["canarias", "illes-balears"] as const) {
    const h = seguro(t)
    importe(evaluarSegurosImpago(h), "149.9925")
    h.viviendas = [
      ...h.viviendas,
      {
        ...h.viviendas[0],
        catastro: "RC2",
        gastos: [pago("1000", "F2")],
      },
    ]
    importe(evaluarSegurosImpago(h), t === "canarias" ? "150" : "440")
  }
})
it("Tercer sector base165:41.25 máximo agregado", () => {
  const d = {
    entidad: "CENTRO",
    registro: "R",
    regimen: "is9_3" as const,
    certificado: "C",
    pago: pago("164.99"),
  }
  importe(
    evaluarTercerSector({ ...marco("illes-balears"), donaciones: [d] }),
    "41.2475"
  )
  d.pago.importe = "165.01"
  importe(
    evaluarTercerSector({ ...marco("illes-balears"), donaciones: [d] }),
    "41.25"
  )
})
it("Discapacidad88/165 íntegros, sin autorreferencia", () => {
  const u = {
    persona: "H",
    residencia: "illes-balears" as const,
    condicion: "descendiente" as const,
    naturaleza: "fisica_sensorial" as const,
    grado: 33,
    resolucion: "R",
    minimo: { contribuyente: "P", ejercicio: 2025 as const, expediente: "M" },
  }
  importe(
    evaluarDiscapacidad({ ...marco("illes-balears"), personas: [u] }),
    "88"
  )
  u.grado = 65
  importe(
    evaluarDiscapacidad({ ...marco("illes-balears"), personas: [u] }),
    "165"
  )
  u.persona = "P"
  rechazo(evaluarDiscapacidad({ ...marco("illes-balears"), personas: [u] }))
})
