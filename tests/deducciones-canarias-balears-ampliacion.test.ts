import { describe, expect, it } from "vitest"
import type { ResultadoAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/ampliacion-comun"
import { evaluarDonacionesAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/donaciones-ampliacion"
import { evaluarViviendaAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/vivienda-ampliacion"
import { evaluarFamiliaEstudiosAmpliacionC } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/familia-estudios-ampliacion"
import {
  evaluarInversionAmpliacionC,
  evaluarAutoocupacionAmpliacionC,
  evaluarPlazasAmpliacionC,
  evaluarEmergenciaAmpliacionC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/inversion-trabajo-ampliacion"
import {
  anualC,
  pagoC,
  solicitudDonacionC,
  solicitudViviendaC,
  historicoViviendaC,
  solicitudFamiliaC,
  contribuyenteC,
  solicitudInversionC,
  historicoInversionC,
  autoocupacionC,
  plazasC,
  emergenciaC,
  magnitudesEmergenciaC,
} from "./canarias-balears-ampliacion.fixtures"

function cuantia(r: ResultadoAmpliacionC, n: string, d = "1"): void {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado === "calculo_parcial") {
    // Oráculo racional independiente: no usa Decimal ni constantes del módulo.
    expect(BigInt(r.importeExacto.numerador) * BigInt(d)).toBe(
      BigInt(n) * BigInt(r.importeExacto.denominador)
    )
    expect(r.aceptacionFiscal).toBe("pendiente")
    expect(r.reservas.length).toBeGreaterThan(1)
  }
}
function rechaza(r: ResultadoAmpliacionC): void {
  expect(r.estado).toBe("no_soportado")
  expect(r).not.toHaveProperty("importeExacto")
  expect(r).not.toHaveProperty("presentacionEuros")
}

describe("Treinta y seis códigos: oráculos normativos por hechos", () => {
  it.each([
    ["canarias_donaciones_finalidad_ecologica", "100", "1"],
    ["canarias_donaciones_patrimonio_historico", "150", "1"],
    [
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia",
      "150",
      "1",
    ],
    ["canarias_donaciones_entidades_sin_animo_lucro", "715", "4"],
    ["balears_donaciones_investigacion_desarrollo_innovacion", "250", "1"],
    ["balears_fomento_lengua_catalana", "150", "1"],
    ["balears_mecenazgo_cultural_cientifico_tecnologico", "150", "1"],
    ["balears_mecenazgo_deportivo", "150", "1"],
  ] as const)("%s", (codigo, n, d) => {
    const h = solicitudDonacionC(codigo)
    cuantia(evaluarDonacionesAmpliacionC(h, anualC(h)), n, d)
  })
  it.each([
    ["canarias_restauracion_bienes_interes_cultural", "100"],
    ["canarias_inversion_vivienda_habitual", "55"],
    ["canarias_rehabilitacion_energetica_vivienda", "120"],
    ["canarias_adecuacion_vivienda_discapacidad", "140"],
    ["canarias_arrendamiento_dacion_pago", "250"],
    ["canarias_adecuacion_inmueble_arrendamiento", "100"],
    ["canarias_puesta_viviendas_mercado_arrendamiento", "1000"],
    ["canarias_alquiler_vivienda_habitual", "760"],
    ["balears_mejora_sostenibilidad_vivienda", "500"],
    ["balears_arrendador_vivienda_permanente_otros_gastos", "500"],
    ["balears_arrendamiento_traslado_laboral", "150"],
    ["balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento", "400"],
    ["balears_arrendamiento_vivienda_habitual", "150"],
  ] as const)("%s", (codigo, n) => {
    const h = solicitudViviendaC(codigo)
    cuantia(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()), n)
  })
  it.each([
    ["canarias_acogimiento_menores", "330"],
    ["canarias_familias_monoparentales", "133"],
    ["canarias_familiares_dependientes_discapacidad", "800"],
    ["canarias_cuotas_seguridad_social_empleados_hogar", "200"],
    ["canarias_estudios_educacion_superior", "1920"],
    ["balears_estudios_superiores_fuera_isla", "1800"],
    ["balears_libros_texto", "220"],
    ["balears_nacimiento", "800"],
    ["balears_adopcion", "800"],
    ["balears_gastos_ela", "1000"],
  ] as const)("%s", (codigo, n) => {
    const h = solicitudFamiliaC(codigo)
    const m = anualC(h)
    if (codigo === "canarias_familiares_dependientes_discapacidad")
      m.minimos = [
        ...m.minimos,
        { beneficiario: "H", tipo: "discapacidad", titulares: ["P"] },
        { beneficiario: "H", tipo: "asistencia", titulares: ["P"] },
      ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), n)
  })
  it.each([
    [true, "200"],
    [false, "300"],
  ] as const)("inversión canaria=%s", (can, n) => {
    const h = solicitudInversionC(can)
    cuantia(evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()), n)
  })
  it("autoocupación1000, plazas PN Mallorca1400 y emergencia160", () => {
    const a = autoocupacionC()
    cuantia(evaluarAutoocupacionAmpliacionC(a, anualC(a)), "1000")
    const p = plazasC()
    cuantia(evaluarPlazasAmpliacionC(p, anualC(p)), "1400")
    const e = emergenciaC()
    cuantia(
      evaluarEmergenciaAmpliacionC(e, anualC(e), magnitudesEmergenciaC()),
      "160"
    )
  })
})

describe("Donaciones: máximos, reiteración, comodato e incompatibilidades", () => {
  it.each([
    ["a", "administracion", "docencia"],
    ["b", "empresa_cultural", "deporte"],
    ["c", "empresa_cientifica", "cultura"],
    ["d", "universidad", "deporte"],
  ] as const)(
    "4bis apartado%s no admite finalidad%s",
    (rama, clase, finalidad) => {
      const h = solicitudDonacionC(
        "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
      )
      const d = h.donaciones[0]
      d.destino4bis = rama
      d.entidad.clase = clase
      d.entidad.finalidad = finalidad
      rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
    }
  )
  it("mecenazgo cultural no admite un proyecto clasificado exclusivamente deportivo", () => {
    const h = solicitudDonacionC(
      "balears_mecenazgo_cultural_cientifico_tecnologico"
    )
    h.donaciones[0].entidad.finalidad = "deporte"
    rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
  })
  it("mantiene medio céntimo exacto y redondea sólo para presentación", () => {
    const h = solicitudDonacionC(
      "balears_donaciones_investigacion_desarrollo_innovacion"
    )
    h.donaciones[0].pagos[0].importe = "0.02"
    const r = evaluarDonacionesAmpliacionC(h, anualC(h))
    cuantia(r, "1", "200")
    if (r.estado === "calculo_parcial") expect(r.presentacionEuros).toBe("0.01")
  })
  it("ecología máximo150 y límite10% cuota, no150 por entidad", () => {
    const h = solicitudDonacionC("canarias_donaciones_finalidad_ecologica")
    h.donaciones[0].pagos[0].importe = "5000"
    const m = anualC(h)
    cuantia(evaluarDonacionesAmpliacionC(h, m), "150")
    m.cuotaIntegraAutonomica = "1000"
    cuantia(evaluarDonacionesAmpliacionC(h, m), "100")
  })
  it("4bis empresa:3000 de base; fondos299999.99 sí y300000 no", () => {
    const h = solicitudDonacionC(
      "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia"
    )
    const d = h.donaciones[0]
    d.destino4bis = "b"
    d.entidad.clase = "empresa_cultural"
    d.pagos[0].importe = "10000"
    d.entidad.fondosPropios = "299999.99"
    const m = anualC(h)
    m.cuotaIntegraAutonomica = "100000"
    cuantia(evaluarDonacionesAmpliacionC(h, m), "450")
    d.entidad.fondosPropios = "300000"
    rechaza(evaluarDonacionesAmpliacionC(h, m))
  })
  it("4ter: no usa37.5 histórico; primer tramo150 global y base10% liquidable", () => {
    const h = solicitudDonacionC(
      "canarias_donaciones_entidades_sin_animo_lucro"
    )
    const m = anualC(h)
    m.baseLiquidableGeneral = "1000"
    m.personas[0].liquidableGeneral = "1000"
    cuantia(evaluarDonacionesAmpliacionC(h, m), "20")
    m.baseLiquidableGeneral = "20000"
    m.personas[0].liquidableGeneral = "20000"
    h.donaciones[0].aportacion2024 = "50"
    cuantia(evaluarDonacionesAmpliacionC(h, m), "315", "2")
    h.donaciones[0].otrasDeduccionesMismoBeneficiario = ["art3"]
    rechaza(evaluarDonacionesAmpliacionC(h, m))
  })
  it("mecenazgo público25%1200 sin límite de renta", () => {
    const h = solicitudDonacionC(
      "balears_mecenazgo_cultural_cientifico_tecnologico"
    )
    h.baseGeneral = "100000"
    h.donaciones[0].entidad.clase = "administracion"
    h.donaciones[0].pagos[0].importe = "10000"
    cuantia(evaluarDonacionesAmpliacionC(h, anualC(h)), "1200")
  })
  it("comodato100000 valor,100días: límite660*100/365, fracción exacta", () => {
    const h = solicitudDonacionC("balears_mecenazgo_deportivo")
    const d = h.donaciones[0]
    d.modalidad = "comodato"
    d.comodato.hasta = "2025-04-10"
    // Base4000*100/365;15%=600*100/365, inferior al máximo660*100/365.
    cuantia(evaluarDonacionesAmpliacionC(h, anualC(h)), "60000", "365")
    d.comodato.ejerciciosPrevios = [2022, 2023, 2024]
    rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
  })
  it("lengua incompatible5bis; certificado o perceptor ausente no generan cero", () => {
    const h = solicitudDonacionC("balears_fomento_lengua_catalana")
    h.donaciones[0].otrasDeduccionesMismoBeneficiario = ["art5bis"]
    rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
    h.donaciones[0].otrasDeduccionesMismoBeneficiario = []
    h.donaciones[0].pagos[0].perceptor = "OTRO"
    rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
  })
})

describe("Vivienda: base, renta, edad, propiedad y fechas", () => {
  it.each([
    ["26034.99", "330"],
    ["26035", "240"],
    ["46454.99", "240"],
  ] as const)("art14 menor40 renta%s", (renta, n) => {
    const h = solicitudViviendaC("canarias_inversion_vivienda_habitual")
    h.baseGeneral = renta
    h.viviendas[0].gastos[0].importe = "10000"
    cuantia(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()), n)
  })
  it("art14 renta46455 excluida; histórico de reinversión resta base", () => {
    const h = solicitudViviendaC("canarias_inversion_vivienda_habitual")
    h.baseGeneral = "46455"
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
    h.baseGeneral = "20000"
    const hist = historicoViviendaC()
    hist.viviendas[0].inversionesAnterioresDeducidas = "800"
    cuantia(evaluarViviendaAmpliacionC(h, anualC(h), hist), "11")
  })
  it("energía base7000 y cuota10%; conserva grupo compartido15%", () => {
    const h = solicitudViviendaC("canarias_rehabilitacion_energetica_vivienda")
    h.viviendas[0].gastos[0].importe = "10000"
    const m = anualC(h)
    const r = evaluarViviendaAmpliacionC(h, m, historicoViviendaC())
    cuantia(r, "840")
    if (r.estado === "calculo_parcial")
      expect(r.limitesComposicion).toContainEqual({
        grupo: "canarias_arts6_14_14bis_14ter",
        porcentaje: "15",
      })
    m.cuotaIntegraAutonomica = "1000"
    cuantia(evaluarViviendaAmpliacionC(h, m, historicoViviendaC()), "100")
    h.viviendas[0].gastos[0].medio = "efectivo"
    rechaza(evaluarViviendaAmpliacionC(h, m, historicoViviendaC()))
  })
  it("adecuación discapacidad65, edad65 exacta14%, mayor65 18% y renta35735", () => {
    const h = solicitudViviendaC("canarias_adecuacion_vivienda_discapacidad")
    const d = h.viviendas[0].discapacidad
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "140"
    )
    d.nacimiento = "1959-12-31"
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "180"
    )
    d.persona = "ASC"
    d.parentesco = "ascendiente"
    d.rentaNoExenta = "35735"
    // La cotitularidad de vivienda no acredita el censo del art.14 ter.6.
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
    d.rentaNoExenta = "35735.01"
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
  })
  it("15ter gasto común2000 y50% de propiedad:75; no duplica gasto propio", () => {
    const h = solicitudViviendaC("canarias_adecuacion_inmueble_arrendamiento")
    const v = h.viviendas[0]
    v.porcentaje = "50"
    v.gastos = [
      {
        ...v.gastos[0],
        importe: "2000",
        naturaleza: "comun",
        distribucion: [
          { persona: "P", porcentaje: "50" },
          { persona: "Q", porcentaje: "50" },
        ],
      },
    ]
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "75"
    )
  })
  it("puesta alquiler: mil único por inmueble, hasta5, no por factura", () => {
    const h = solicitudViviendaC(
      "canarias_puesta_viviendas_mercado_arrendamiento"
    )
    h.viviendas[0].porcentaje = "25"
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "250"
    )
    h.viviendas[0].historial.aplicacionesPrevias = [2024]
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
  })
  it("otros gastos: renta15/m² inclusive, programa1800 y1500 agregado", () => {
    const h = solicitudViviendaC(
      "balears_arrendador_vivienda_permanente_otros_gastos"
    )
    const v = h.viviendas[0]
    v.gastos[0].importe = "10000"
    v.alquiler.rentaMensual = "1200"
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "1500"
    )
    v.alquiler.programa = "alquiler_seguro"
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "1800"
    )
    v.alquiler.rentaMensual = "1200.01"
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
  })
  it("ocupación no existe para devengo24julio; suspensión requiere saldo dudoso derivado", () => {
    const h = solicitudViviendaC(
      "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento"
    )
    h.devengo = "2025-07-24"
    h.causaDevengo = "fallecimiento"
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
    h.devengo = "2025-07-25"
    h.viviendas[0].ocupacionIlegal.situacion = "suspension_vulnerabilidad"
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
    const hist = historicoViviendaC()
    hist.viviendas[0].saldoDudosoCobroDeducible2025 = "100"
    cuantia(evaluarViviendaAmpliacionC(h, anualC(h), hist), "400")
  })
  it("alquiler canario edad75 inclusiva760; renta46455 inclusiva y ahorro cuenta", () => {
    const h = solicitudViviendaC("canarias_alquiler_vivienda_habitual")
    h.viviendas[0].nacimientoContribuyente = "1950-12-31"
    h.baseGeneral = "46455"
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "760"
    )
    h.baseAhorro = "0.01"
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
  })
  it("RETA al fallecer sólo días reales; reforma arrendamiento desde25julio", () => {
    const h = solicitudViviendaC("balears_arrendamiento_vivienda_habitual")
    h.devengo = "2025-07-25"
    h.causaDevengo = "fallecimiento"
    h.viviendas[0].nacimientoContribuyente = "1980-01-01"
    h.viviendas[0].colectivo.altaRETA = [
      { desde: "2025-01-01", hasta: "2025-12-31" },
    ]
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
    h.viviendas[0].colectivo.altaRETA = [
      { desde: "2025-01-01", hasta: "2025-07-25" },
    ]
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "200"
    )
  })
  it("inventario de otras viviendas computa la unión de días, frontera70km", () => {
    const h = solicitudViviendaC("balears_arrendamiento_vivienda_habitual")
    const v = h.viviendas[0]
    v.otrasViviendas = [
      {
        titular: "P",
        isla: "Menorca",
        territorio: "illes-balears",
        distanciaKm: "69.99",
        diasDerecho: [{ desde: "2025-01-01", hasta: "2025-04-10" }],
        rentasCapital: "0",
      },
      {
        titular: "P",
        isla: "Menorca",
        territorio: "illes-balears",
        distanciaKm: "69.99",
        diasDerecho: [{ desde: "2025-04-11", hasta: "2025-07-19" }],
        rentasCapital: "0",
      },
    ]
    rechaza(evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()))
    v.otrasViviendas.forEach((o) => {
      o.distanciaKm = "70"
    })
    cuantia(
      evaluarViviendaAmpliacionC(h, anualC(h), historicoViviendaC()),
      "150"
    )
  })
})

describe("Familia y estudios: días exactos, derechos y gastos propios", () => {
  it("acogimiento183 días:330*183/365, y muerte100días de192", () => {
    const h = solicitudFamiliaC("canarias_acogimiento_menores")
    h.personas[0].convivencia = [{ desde: "2025-07-02", hasta: "2025-12-31" }]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "60390", "365")
    h.devengo = "2025-07-11"
    h.causaDevengo = "fallecimiento"
    h.personas[0].convivencia = [{ desde: "2025-01-01", hasta: "2025-04-10" }]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "33000", "192")
    h.personas[0].adopcion = "2025-05-01"
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)))
  })
  it("monoparental alteración exige183 días, no182; renta8000 inclusiva", () => {
    const h = solicitudFamiliaC("canarias_familias_monoparentales")
    h.contribuyentes[0].alteracionFamilia = "2025-07-02"
    h.personas[0].rentaNoExenta = "8000"
    h.personas[0].convivencia = [{ desde: "2025-07-02", hasta: "2025-12-31" }]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "133")
    h.personas[0].convivencia = [{ desde: "2025-07-03", hasta: "2025-12-31" }]
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)))
  })
  it("superiores: frontera liquidable37062, crédito30 e ingreso8000", () => {
    const h = solicitudFamiliaC("canarias_estudios_educacion_superior")
    const u = h.personas[0]
    u.estudio.curso = "parcial"
    u.rentaNoExenta = "8000"
    const m = anualC(h)
    m.baseLiquidableGeneral = "37062"
    m.personas[0].liquidableGeneral = "37062"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "1800")
    u.estudio.creditos = 29
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, m))
    u.estudio.creditos = 30
    u.rentaNoExenta = "8000.01"
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, m))
  })
  it("libros gasto propio100 con dos titulares mantiene100 y reparte sólo tope220", () => {
    const h = solicitudFamiliaC("balears_libros_texto")
    h.personas[0].minimo.titulares = ["P", "Q"]
    h.personas[0].gastos[0].importe = "100"
    const m = anualC(h)
    m.minimos = [
      { beneficiario: "H", tipo: "descendiente", titulares: ["P", "Q"] },
    ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "100")
    h.personas[0].gastos[0].importe = "1000"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "110")
  })
  it("libros común200 a50% atribuye100 una vez; conjunta reúne220 de máximo", () => {
    const h = solicitudFamiliaC("balears_libros_texto")
    h.personas[0].minimo.titulares = ["P", "Q"]
    h.personas[0].progenitores = ["P", "Q"]
    h.personas[0].gastos = [
      {
        ...h.personas[0].gastos[0],
        importe: "200",
        naturaleza: "comun",
        distribucion: [
          { persona: "P", porcentaje: "50" },
          { persona: "Q", porcentaje: "50" },
        ],
      },
    ]
    let m = anualC(h)
    m.minimos = [
      { beneficiario: "H", tipo: "descendiente", titulares: ["P", "Q"] },
    ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "100")
    h.modalidad = "conjunta"
    h.declarantes = ["P", "Q"]
    h.miembrosUnidadFamiliar = ["P", "Q", "H"]
    h.contribuyentes = [
      h.contribuyentes[0],
      { ...contribuyenteC(), persona: "Q" },
    ]
    m = anualC(h)
    m.minimos = [
      { beneficiario: "H", tipo: "descendiente", titulares: ["P", "Q"] },
    ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "200")
  })
  it("nacimiento: desde25julio dos progenitores aunque sólo uno tenga derecho", () => {
    const h = solicitudFamiliaC("balears_nacimiento")
    h.personas[0].progenitores = ["P", "Q"]
    h.personas[0].convivencia = [{ desde: "2025-01-01", hasta: "2025-07-25" }]
    h.devengo = "2025-07-24"
    h.causaDevengo = "fallecimiento"
    h.personas[0].convivencia[0].hasta = "2025-07-24"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "800")
    h.devengo = "2025-07-25"
    h.personas[0].convivencia[0].hasta = "2025-07-25"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "400")
    h.baseGeneral = "52800.01"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "200")
  })
  it("adopción hijo de pareja excluida; inscripción2026 no se anticipa", () => {
    const h = solicitudFamiliaC("balears_adopcion")
    h.contribuyentes[0].conyugePareja = "EX"
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)))
    h.contribuyentes[0].conyugePareja = ""
    h.personas[0].inscripcionCivil = "2026-01-01"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "0")
  })
  it("ELA agregado3500 y exclusión de primas, no3500 por familiar", () => {
    const h = solicitudFamiliaC("balears_gastos_ela")
    h.personas[0].gastos[0].importe = "5000"
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "3500")
    h.personas[0].gastos[0].concepto = "prima_seguro"
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)))
  })
  it("rechaza hijo=P y mínimo no derivado del motor anual", () => {
    const h = solicitudFamiliaC("balears_libros_texto")
    h.personas[0].id = "P"
    h.personas[0].minimo.persona = "P"
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)))
    const f = solicitudFamiliaC("balears_libros_texto")
    const m = anualC(f)
    m.minimos = []
    rechaza(evaluarFamiliaEstudiosAmpliacionC(f, m))
  })
  it("gananciales atribuye cuotas50/50; gasto propio separado no se divide", () => {
    const h = solicitudFamiliaC(
      "canarias_cuotas_seguridad_social_empleados_hogar"
    )
    const c = h.cuotasHogar[0]
    c.regimen = "gananciales"
    c.conyuge = "Q"
    c.pagos = [
      {
        ...c.pagos[0],
        naturaleza: "comun",
        distribucion: [
          { persona: "P", porcentaje: "50" },
          { persona: "Q", porcentaje: "50" },
        ],
      },
    ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)), "100")
    c.pagos[0].distribucion = [{ persona: "P", porcentaje: "100" }]
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, anualC(h)))
  })
  it("nacimiento conjunto suma derechos sin duplicar el mismo hijo", () => {
    const h = solicitudFamiliaC("balears_nacimiento")
    h.modalidad = "conjunta"
    h.declarantes = ["P", "Q"]
    h.miembrosUnidadFamiliar = ["P", "Q", "H"]
    h.contribuyentes = [
      h.contribuyentes[0],
      { ...contribuyenteC(), persona: "Q" },
    ]
    h.personas[0].progenitores = ["P", "Q"]
    h.personas[0].minimo.titulares = ["P", "Q"]
    const m = anualC(h)
    m.minimos = [
      { beneficiario: "H", tipo: "descendiente", titulares: ["P", "Q"] },
    ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "800")
    h.personas = [...h.personas, { ...h.personas[0] }]
    rechaza(evaluarFamiliaEstudiosAmpliacionC(h, m))
  })
  it("estudios superiores conjuntos comparten un único límite del50% de cuota", () => {
    const h = solicitudFamiliaC("balears_estudios_superiores_fuera_isla")
    h.modalidad = "conjunta"
    h.declarantes = ["P", "Q"]
    h.miembrosUnidadFamiliar = ["P", "Q", "H"]
    h.contribuyentes = [
      h.contribuyentes[0],
      { ...contribuyenteC(), persona: "Q" },
    ]
    h.personas[0].minimo.titulares = ["P", "Q"]
    const m = anualC(h)
    m.cuotaIntegraAutonomica = "1000"
    m.minimos = [
      { beneficiario: "H", tipo: "descendiente", titulares: ["P", "Q"] },
    ]
    cuantia(evaluarFamiliaEstudiosAmpliacionC(h, m), "500")
  })
})

describe("Inversión, trabajo y magnitudes anuales", () => {
  it.each([
    [true, "4000", "6000"],
    [false, "6000", "12000"],
  ] as const)("topes generales/especiales can=%s", (can, general, especial) => {
    const h = solicitudInversionC(can)
    h.inversiones[0].aportacion = "100000"
    cuantia(
      evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()),
      general
    )
    h.inversiones[0].entidad.universidadesCentros = ["UNI1"]
    cuantia(
      evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()),
      especial
    )
  })
  it("participación40% inclusiva y40.01 excluida con grupo familiar", () => {
    const h = solicitudInversionC()
    const p = h.inversiones[0].participaciones[0]
    p.tenedores[0].capital = "40"
    cuantia(
      evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()),
      "200"
    )
    p.tenedores[0].capital = "40.01"
    rechaza(evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()))
  })
  it("empresa balear negocio2millones inclusive y2millones.01 excluido", () => {
    const h = solicitudInversionC(false)
    h.inversiones[0].entidad.cifraNegocio = "2000000"
    cuantia(
      evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()),
      "300"
    )
    h.inversiones[0].entidad.cifraNegocio = "2000000.01"
    rechaza(evaluarInversionAmpliacionC(h, anualC(h), historicoInversionC()))
  })
  it("inversión balear2023: remanente derivado100, sin repetir derecho300", () => {
    const h = solicitudInversionC(false)
    h.inversiones[0].fecha = "2023-01-01"
    h.inversiones[0].entidad.constitucion = "2023-01-01"
    const hist = historicoInversionC()
    hist.operaciones[0].aplicado2023 = "200"
    cuantia(evaluarInversionAmpliacionC(h, anualC(h), hist), "100")
    h.inversiones[0].fecha = "2022-12-31"
    rechaza(evaluarInversionAmpliacionC(h, anualC(h), hist))
  })
  it("inversión conjunta conserva máximo6000 por cada inversor, antes de cuota disponible", () => {
    const h = solicitudInversionC(false)
    const p = h.inversiones[0]
    p.aportacion = "100000"
    const q = {
      ...p,
      id: "INV2",
      persona: "Q",
      participaciones: [
        {
          desde: "2025-01-01",
          hasta: "2025-12-31",
          tenedores: [
            {
              persona: "Q",
              relacion: "propio" as const,
              grado: 0,
              capital: "20",
              votos: "20",
            },
          ],
        },
      ],
    }
    h.inversiones = [p, q]
    h.modalidad = "conjunta"
    h.declarantes = ["P", "Q"]
    h.miembrosUnidadFamiliar = ["P", "Q"]
    const hist = historicoInversionC()
    hist.operaciones = [
      ...hist.operaciones,
      { id: "INV2", aplicado2023: "0", aplicado2024: "0" },
    ]
    cuantia(evaluarInversionAmpliacionC(h, anualC(h), hist), "12000")
  })
  it("autoocupación: primera alta,50% actividad insuficiente y baja antes de un año", () => {
    const h = autoocupacionC()
    h.altas[0].domiciliosActividad = [
      { territorio: "illes-balears", volumen: "100" },
      { territorio: "otra", volumen: "100" },
    ]
    rechaza(evaluarAutoocupacionAmpliacionC(h, anualC(h)))
    h.altas[0].domiciliosActividad = [
      { territorio: "illes-balears", volumen: "100" },
    ]
    h.altas[0].bajasCenso = ["2025-12-31"]
    rechaza(evaluarAutoocupacionAmpliacionC(h, anualC(h)))
  })
  it("plazas: más de mitad, isla Formentera+30%, frontera renta33000", () => {
    const h = plazasC()
    h.destinos[0].isla = "Formentera"
    h.gastos[0].importe = "10000"
    h.baseGeneral = "33000"
    cuantia(evaluarPlazasAmpliacionC(h, anualC(h)), "2600")
    h.baseAhorro = "0.01"
    cuantia(evaluarPlazasAmpliacionC(h, anualC(h)), "1300")
    h.destinos[0].desde = "2025-07-03"
    rechaza(evaluarPlazasAmpliacionC(h, anualC(h)))
  })
  it("emergencia: no aplica tipo a ayuda exenta ni usa cuota total con ahorro", () => {
    const h = emergenciaC(),
      e = magnitudesEmergenciaC()
    e.ayudasIntegradas[0].incluidaBaseImponibleGeneral = "0"
    e.ayudasIntegradas[0].incluidaBaseLiquidable = "0"
    cuantia(evaluarEmergenciaAmpliacionC(h, anualC(h), e), "0")
    e.ayudasIntegradas[0].incluidaBaseLiquidable = "1"
    rechaza(evaluarEmergenciaAmpliacionC(h, anualC(h), e))
  })
  it("magnitudes de otro contribuyente o renta no concordante se rechazan", () => {
    const h = autoocupacionC(),
      m = anualC(h)
    m.declarantes = ["Q"]
    rechaza(evaluarAutoocupacionAmpliacionC(h, m))
    const n = anualC(h)
    n.personas[0].imponibleAhorro = "0.01"
    rechaza(evaluarAutoocupacionAmpliacionC(h, n))
  })
  it("conjunta monoparental permite un contribuyente y un hijo; umbral52800", () => {
    const h = autoocupacionC()
    h.modalidad = "conjunta"
    h.miembrosUnidadFamiliar = ["P", "H"]
    h.baseGeneral = "52800"
    cuantia(evaluarAutoocupacionAmpliacionC(h, anualC(h)), "1000")
    h.baseAhorro = "0.01"
    rechaza(evaluarAutoocupacionAmpliacionC(h, anualC(h)))
  })
  it("pagos propios no pueden distribuirse a otro, ni duplicarse IDs", () => {
    const h = solicitudDonacionC("canarias_donaciones_finalidad_ecologica")
    h.donaciones[0].pagos[0].distribucion = [
      { persona: "Q", porcentaje: "100" },
    ]
    rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
    h.donaciones[0].pagos = [pagoC(), pagoC()]
    rechaza(evaluarDonacionesAmpliacionC(h, anualC(h)))
  })
})
