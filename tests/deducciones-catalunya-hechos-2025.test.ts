import { describe, expect, it } from "vitest"
import {
  evaluarCatalunyaHechos2025 as evaluarReal,
  type SolicitudCatalunyaHechos2025,
} from "../lib/dominio/irpf/deducciones/catalunya-hechos-2025"

// Payload sintético de prueba: valores JSON y ausencia explícita para negativos JS.
type EntradaPrueba =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly EntradaPrueba[]
  | { readonly [campo: string]: EntradaPrueba }
function evaluar(h: EntradaPrueba) {
  // SAFETY: los negativos simulan llamadas JS malformadas; el evaluador ejecuta su Schema antes de operar.
  return evaluarReal(h as SolicitudCatalunyaHechos2025)
}
function descendientesVacios(): {
  id: string
  ejerciciosConMinimo: number[]
  referenciaDerechos: string
}[] {
  return []
}
const contexto = {
  ejercicio: 2025,
  territorio: "catalunya",
  modalidad: "individual",
  contribuyente: "t",
  devengo: "2025-12-31",
}
const pago = {
  id: "p",
  fecha: "2025-06-01",
  pagador: "t",
  importeCentimos: 10000,
  justificante: "recibo-sintetico",
}
const donativo = {
  ...pago,
  entidad: "entidad-sintetica",
  claseEntidad: "privada-sin-lucro",
  calificacionEntidad: "certificado-clase",
  censo: "incluida",
  referenciaCenso: "asiento-sintetico",
  finalidad: "lengua-catalana-occitana",
  certificado: "certificado-donativo",
  modelo993: {
    fecha: "2026-01-20",
    ejercicioInformado: 2025,
    via: "telematica",
    referencia: "acuse-sintetico",
  },
  deduccionEstatalMismoDonativoCentimos: 0,
}
const lengua = () => ({
  ...contexto,
  codigo: "cataluna_donativos_lengua_catalana_occitana",
  cuotaIntegraAutonomicaCentimos: 100000,
  donativos: [{ ...donativo }],
})
const idi = () => ({
  ...lengua(),
  codigo: "cataluna_donativos_idi",
  donativos: [
    {
      ...donativo,
      claseEntidad: "universidad-catalana",
      censo: "no-exigible",
      finalidad: "investigacion-desarrollo-innovacion",
    },
  ],
})
const ambiente = () => ({
  ...lengua(),
  codigo: "cataluna_donaciones_medio_ambiente_patrimonio_natural",
  donativos: [
    { ...donativo, claseEntidad: "fundacion", finalidad: "medio-ambiente" },
  ],
})
const evento = {
  id: "e",
  persona: "h",
  fecha: "2025-01-01",
  nacimiento: "2025-01-01",
  clase: "nacimiento",
  titulares: ["t", "otro"],
  tituloVinculo: "registro-sintetico",
  familia: "ordinaria",
  tituloMonoparental: "",
  normaAcogimiento: "no-aplica",
  acuerdoAcogimiento: "",
}
const nacimiento = () => ({
  ...contexto,
  codigo: "cataluna_nacimiento_adopcion_acogimiento",
  eventos: [{ ...evento }],
})
const viudedad = () => ({
  ...contexto,
  codigo: "cataluna_viudedad_2023_2024_2025",
  viudedad: {
    fecha: "2023-01-01",
    certificado: "certificado-sintetico",
    descendientes: descendientesVacios(),
  },
})
const intereses = () => ({
  ...contexto,
  codigo: "cataluna_intereses_prestamos_master_doctorado",
  prestamos: [
    {
      id: "prestamo",
      prestatario: "t",
      canal: "AGAUR",
      tituloConcesion: "concesion-sintetica",
      estudios: "master",
      pagosIntereses: [{ ...pago }],
    },
  ],
})
function importe(h: EntradaPrueba, centimos: number, exacto?: string) {
  const r = evaluar(h)
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado === "calculo_parcial") {
    expect(r.importePresentadoCentimos).toBe(centimos)
    if (exacto !== undefined) expect(r.importeExactoEuros).toBe(exacto)
    expect(r.aceptacionFiscal).toBe("pendiente")
    expect(r.citas.length).toBeGreaterThan(0)
  }
}
function rechaza(h: EntradaPrueba) {
  expect(evaluar(h).estado).toBe("no_soportado")
}

describe("Catalunya 2025: oráculos documentales independientes del catálogo", () => {
  it("lengua 15%: 100 EUR produce 15 EUR", () => importe(lengua(), 1500, "15"))
  it("lengua: 1.000 EUR donados y cuota 1.000 => máximo 100 EUR", () => {
    const h = lengua()
    h.donativos[0].importeCentimos = 100000
    importe(h, 10000)
  })
  it("consolida destinatarios antes del límite por contribuyente", () => {
    const h = lengua()
    h.donativos[0].importeCentimos = 100000
    h.donativos.push({
      ...h.donativos[0],
      id: "segundo",
      entidad: "otra-entidad",
    })
    importe(h, 10000)
  })
  it("medio ambiente limita 1.000 EUR al 5% de cuota 1.000: 50 EUR", () => {
    const h = ambiente()
    h.donativos[0].importeCentimos = 100000
    importe(h, 5000)
  })
  it("investigación: 100 EUR y estatal 80 => autonómica 20", () => {
    const h = idi()
    h.donativos[0].deduccionEstatalMismoDonativoCentimos = 8000
    importe(h, 2000)
  })
  it("investigación: cuota 100 => máximo 10 EUR", () => {
    const h = idi()
    h.cuotaIntegraAutonomicaCentimos = 10000
    importe(h, 1000)
  })
  it("investigación aplica remanente por donativo antes del tope agregado", () => {
    const h = idi()
    h.donativos[0].deduccionEstatalMismoDonativoCentimos = 10000
    h.donativos.push({
      ...h.donativos[0],
      id: "d2",
      deduccionEstatalMismoDonativoCentimos: 0,
    })
    importe(h, 3000)
  })
  it("rechaza estatal mayor que el donativo", () => {
    const h = idi()
    h.donativos[0].deduccionEstatalMismoDonativoCentimos = 10001
    rechaza(h)
  })
  it("cero cuota produce cero generado por límite propio", () => {
    const h = lengua()
    h.cuotaIntegraAutonomicaCentimos = 0
    importe(h, 0)
  })
  it("conserva exacto 0,0015 EUR y presenta cero céntimos", () => {
    const h = lengua()
    h.donativos[0].importeCentimos = 1
    importe(h, 0, "0.0015")
  })
  it("no introduce truncamiento valenciano: 10 céntimos *15%=1,5 céntimos", () => {
    const h = lengua()
    h.donativos[0].importeCentimos = 10
    importe(h, 2, "0.015")
  })
  for (const censo of ["no-incluida", "no-exigible"])
    it("lengua exige censo: " + censo, () => {
      const h = lengua()
      h.donativos[0].censo = censo
      rechaza(h)
    })
  it("IEC como destinatario nominal no exige censo privado", () => {
    const h = lengua()
    h.donativos[0].claseEntidad = "iec"
    h.donativos[0].censo = "no-exigible"
    importe(h, 1500)
  })
  it("calificación de entidad equivocada no queda suplida por finalidad", () => {
    const h = idi()
    h.donativos[0].claseEntidad = "fundacion"
    rechaza(h)
  })
  it("ambiente exige censo ambiental", () => {
    const h = ambiente()
    h.donativos[0].censo = "no-incluida"
    rechaza(h)
  })
  it("21 enero requiere resolver presentación particular, no falso cero", () => {
    const h = lengua()
    h.donativos[0].modelo993 = { ...donativo.modelo993, fecha: "2026-01-21" }
    rechaza(h)
  })
  it("1 enero es admisible", () => {
    const h = lengua()
    h.donativos[0].modelo993 = { ...donativo.modelo993, fecha: "2026-01-01" }
    importe(h, 1500)
  })
  it("31 diciembre anterior no es período de comunicación 993", () => {
    const h = lengua()
    h.donativos[0].modelo993 = { ...donativo.modelo993, fecha: "2025-12-31" }
    rechaza(h)
  })
  it("nacimiento individual ordinario es 150, aunque haya un solo titular", () => {
    const h = nacimiento()
    h.eventos[0].titulares = ["t"]
    importe(h, 15000)
  })
  it.each(["t", "otro"])(
    "no identifica a la persona nacida con el titular %s",
    (persona) => {
      const h = nacimiento()
      h.eventos[0].persona = persona
      const r = evaluar(h)
      expect(r.estado).toBe("no_soportado")
      expect(r).not.toHaveProperty("importeExactoEuros")
    }
  )
  it("monoparental individual: 300 con título específico", () => {
    const h = nacimiento()
    h.eventos[0].familia = "monoparental"
    h.eventos[0].tituloMonoparental = "titulo-sintetico"
    importe(h, 30000)
  })
  it("monoparental sin título no basta", () => {
    const h = nacimiento()
    h.eventos[0].familia = "monoparental"
    rechaza(h)
  })
  it("dos hijos distintos: 300 en individual ordinario", () => {
    const h = nacimiento()
    h.eventos.push({ ...evento, id: "e2", persona: "h2" })
    importe(h, 30000)
  })
  it("adopción y acogimiento de la misma persona exigen elección", () => {
    const h = nacimiento()
    h.eventos[0].clase = "adopcion"
    h.eventos.push({
      ...evento,
      id: "e2",
      clase: "acogimiento",
      normaAcogimiento: "Ley14/2010",
      acuerdoAcogimiento: "acuerdo",
    })
    rechaza(h)
  })
  it("acogimiento Ley14/2010 anterior a 27 marzo tiene efectos en 2025", () => {
    const h = nacimiento()
    Object.assign(h.eventos[0], {
      nacimiento: "2010-02-01",
      clase: "acogimiento",
      normaAcogimiento: "Ley14/2010",
      acuerdoAcogimiento: "acuerdo",
    })
    importe(h, 15000)
  })
  it("acogimiento mayor de edad no se admite", () => {
    const h = nacimiento()
    Object.assign(h.eventos[0], {
      nacimiento: "2007-01-01",
      clase: "acogimiento",
      normaAcogimiento: "Ley14/2010",
      acuerdoAcogimiento: "acuerdo",
    })
    rechaza(h)
  })
  it("viudedad 2023 continúa en 2025", () => importe(viudedad(), 15000))
  it("viudedad 2022 excluye 2025", () => {
    const h = viudedad()
    h.viudedad.fecha = "2022-12-31"
    expect(evaluar(h).estado).toBe("excluida")
  })
  it("viudedad 2025 incluida", () => {
    const h = viudedad()
    h.viudedad.fecha = "2025-12-31"
    importe(h, 15000)
  })
  it("dos descendientes mantenidos no multiplican los 300", () => {
    const h = viudedad()
    h.viudedad.descendientes = ["h1", "h2"].map((id) => ({
      id,
      ejerciciosConMinimo: [2023, 2024, 2025],
      referenciaDerechos: "derechos-sinteticos",
    }))
    importe(h, 30000)
  })
  it("mínimo sólo actual no presupone mantenimiento", () => {
    const h = viudedad()
    h.viudedad.descendientes = [
      { id: "h", ejerciciosConMinimo: [2025], referenciaDerechos: "derechos" },
    ]
    rechaza(h)
  })
  it("sin mínimo actual conserva rama general 150", () => {
    const h = viudedad()
    h.viudedad.descendientes = [
      { id: "h", ejerciciosConMinimo: [2023], referenciaDerechos: "derechos" },
    ]
    importe(h, 15000)
  })
  it("intereses AGAUR 100 EUR => 100", () => importe(intereses(), 10000))
  it("doctorado también admite intereses", () => {
    const h = intereses()
    h.prestamos[0].estudios = "doctorado"
    importe(h, 10000)
  })
  it("banco sin canal AGAUR genera cero para esa rama", () => {
    const h = intereses()
    h.prestamos[0].canal = "otro"
    importe(h, 0)
  })
  it("otros estudios no habilitan", () => {
    const h = intereses()
    h.prestamos[0].estudios = "otros"
    importe(h, 0)
  })
  it("sumas de céntimos exactas sin flotantes", () => {
    const h = intereses()
    h.prestamos[0].pagosIntereses = [
      { ...pago, importeCentimos: 10 },
      { ...pago, id: "p2", importeCentimos: 20 },
    ]
    importe(h, 30, "0.3")
  })
  it("duplicado de pago entre préstamos rechaza doble cómputo", () => {
    const h = intereses()
    h.prestamos.push({ ...h.prestamos[0], id: "otro-prestamo" })
    rechaza(h)
  })
  for (const valor of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
    it("rechaza céntimos inválidos " + valor, () => {
      const h = lengua()
      h.donativos[0].importeCentimos = valor
      rechaza(h)
    })
  for (const f of ["2025-02-29", "2024-12-31", "2026-01-01"])
    it("rechaza pago con fecha " + f, () => {
      const h = lengua()
      h.donativos[0].fecha = f
      rechaza(h)
    })
  it("no convierte pago de tercero en atribución", () => {
    const h = lengua()
    h.donativos[0].pagador = "otro"
    rechaza(h)
  })
  for (const [campo, valor] of [
    ["modalidad", "conjunta"],
    ["ejercicio", 2024],
    ["territorio", "aragon"],
    ["devengo", "2025-06-01"],
  ])
    it("rechaza ámbito " + campo, () =>
      rechaza({ ...lengua(), [String(campo)]: valor })
    )
  it("rechaza cumple global incluso con los demás hechos", () =>
    rechaza({ ...lengua(), cumple: true }))
  it("rechaza principal como pago deducible", () => {
    const h = intereses()
    rechaza({
      ...h,
      prestamos: [
        {
          ...h.prestamos[0],
          pagosIntereses: [{ ...pago, principalCentimos: 100000 }],
        },
      ],
    })
  })
  it("objeto vacío o lista ausente nunca se transforma en cero", () => {
    rechaza({})
    rechaza({ ...lengua(), donativos: undefined })
  })
  for (const f of [
    "2025-04-31",
    "2025-00-01",
    "2025-13-01",
    "2025-01-00",
    "0000-01-01",
  ]) {
    it("rechaza fecha civil imposible " + f, () => {
      const h = viudedad()
      h.viudedad.fecha = f
      rechaza(h)
    })
  }
  it("año bisiesto 2024 admite 29 febrero en viudedad", () => {
    const h = viudedad()
    h.viudedad.fecha = "2024-02-29"
    importe(h, 15000)
  })
  it("siglo 1900 no es bisiesto", () => {
    const h = viudedad()
    h.viudedad.fecha = "1900-02-29"
    rechaza(h)
  })
  it("siglo 2000 es bisiesto pero viudedad fuera de ventana", () => {
    const h = viudedad()
    h.viudedad.fecha = "2000-02-29"
    expect(evaluar(h).estado).toBe("excluida")
  })
  it("un dato no aplicable tampoco admite un tipo arbitrario", () => {
    const h = nacimiento()
    rechaza({ ...h, eventos: [{ ...evento, acuerdoAcogimiento: false }] })
  })
  it("esquema malformado no genera cero", () => {
    rechaza(null)
    rechaza(undefined)
    rechaza([])
  })
})

describe("CAT-01: antecedente de acogimiento identificado para adopción", () => {
  const eventoAdopcion = {
    id: "adopcion",
    persona: "h",
    fecha: "2025-06-01",
    nacimiento: "2010-01-01",
    clase: "adopcion",
    titulares: ["t"],
    tituloVinculo: "resolucion-2025",
    familia: "ordinaria",
    tituloMonoparental: "",
    normaAcogimiento: "no-aplica",
    acuerdoAcogimiento: "",
  }
  const solicitud = (evento: EntradaPrueba) => ({
    ...contexto,
    codigo: "cataluna_nacimiento_adopcion_acogimiento",
    eventos: [evento],
  })
  const antecedente = {
    persona: "h",
    contribuyente: "t",
    estado: "sin-acogimiento-previo",
    soporte: "expediente-h-t-sin-acogimiento",
  }
  it.each(["ordinaria", "monoparental"])(
    "rechaza %s sin historia y admite ausencia documentada",
    (familia) => {
      const evento = {
        ...eventoAdopcion,
        familia,
        tituloMonoparental: familia === "monoparental" ? "titulo" : "",
      }
      expect(evaluar(solicitud(evento)).estado).toBe("no_soportado")
      expect(
        evaluar(solicitud({ ...evento, antecedenteAcogimiento: antecedente }))
      ).toMatchObject({
        estado: "calculo_parcial",
        importeExactoEuros: familia === "monoparental" ? "300" : "150",
      })
    }
  )
  it.each([
    { ...antecedente, estado: "previo" },
    { ...antecedente, estado: "desconocido" },
    { ...antecedente, persona: "otra" },
    { ...antecedente, contribuyente: "otro" },
    { ...antecedente, soporte: " " },
  ])(
    "no genera derecho con antecedente incompatible, desconocido o ajeno %#",
    (antecedenteAcogimiento) => {
      const r = evaluar(
        solicitud({ ...eventoAdopcion, antecedenteAcogimiento })
      )
      expect(r.estado).toBe("no_soportado")
      expect(r).not.toHaveProperty("importeExactoEuros")
    }
  )
})
