import { describe, expect, it } from "vitest"
import { Result, Schema } from "effect"
import * as cm from "../lib/dominio/irpf/deducciones/castilla-la-mancha-hechos-2025"
import * as cy from "../lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025"
import * as ex from "../lib/dominio/irpf/deducciones/extremadura-hechos-2025"
import entradas from "./fixtures/deducciones-d-ampliacion-2025.json"

const Casos = Schema.Array(
  Schema.Struct({
    codigo: Schema.String,
    funcion: Schema.String,
    territorio: Schema.String,
    datos: Schema.Record(Schema.String, Schema.Json),
    numerador: Schema.String,
    denominador: Schema.String,
  })
)
const leidos = Schema.decodeUnknownResult(Casos)(entradas)
if (Result.isFailure(leidos)) throw new Error("Fixtures de prueba inválidas")
const casos = leidos.success
const funciones = new Map<
  string,
  (contexto: Schema.Json, datos: Schema.Json) => cm.ResultadoHechos | ex.ResultadoHechos
>([
  ["familiaMonoparental", cm.familiaMonoparental],
  ["familiaNumerosaAmpliada", cm.familiaNumerosaAmpliada],
  ["discapacidadFamiliares", cm.discapacidadFamiliares],
  ["gastosEducacion", cm.gastosEducacion],
  ["guarderia", cm.guarderia],
  ["acogimientoMenores", cm.acogimientoMenores],
  ["acogimientoMayores", cm.acogimientoMayores],
  ["alquilerJoven", cm.alquilerJoven],
  ["alquilerDacion", cm.alquilerDacion],
  ["alquilerNumerosa", cm.alquilerNumerosa],
  ["alquilerMonoparental", cm.alquilerMonoparental],
  ["alquilerDiscapacidad", cm.alquilerDiscapacidad],
  ["donacionesCooperacion", cm.donacionesCooperacion],
  ["donacionesIdi", cm.donacionesIdi],
  ["mecenazgoCultural", cm.mecenazgoCultural],
  ["interesesPrimeraVivienda", cm.interesesPrimeraVivienda],
  ["residenciaRural", cm.residenciaRural],
  ["viviendaRural", cm.viviendaRural],
  ["trasladoLaboral", cm.trasladoLaboral],
  ["inversionMercantil", cm.inversionMercantil],
  ["inversionEconomiaSocial", cm.inversionEconomiaSocial],
  ["cuentaVivienda", cm.cuentaVivienda],
  ["perrosAsistencia", cm.perrosAsistencia],
  ["nacimientoCyl", cy.nacimientoCyl],
  ["multiplesCyl", cy.multiplesCyl],
  ["cuidadoMenoresCyl", cy.cuidadoMenoresCyl],
  ["viviendaJovenRuralCyl", cy.viviendaJovenRuralCyl],
  ["rehabilitacionSubvencionadaCyl", cy.rehabilitacionSubvencionadaCyl],
  ["rehabilitacionAlquilerCyl", cy.rehabilitacionAlquilerCyl],
  ["emprendimientoCyl", cy.emprendimientoCyl],
  ["patrimonioCyl", cy.patrimonioCyl],
  ["donacionesPatrimonioCyl", cy.donacionesPatrimonioCyl],
  ["donacionesIdiCyl", cy.donacionesIdiCyl],
  ["movilidadCyl", cy.movilidadCyl],
  ["viviendaNuevaCyl", cy.viviendaNuevaCyl],
  ["alquilerJovenCyl", cy.alquilerJovenCyl],
  ["acogimientoMenoresExt", ex.acogimientoMenoresExt],
  ["viudedadExt", ex.viudedadExt],
  ["cuidadoDiscapacidadExt", ex.cuidadoDiscapacidadExt],
  ["cuidadoHasta14Ext", ex.cuidadoHasta14Ext],
  ["viviendaJovenExt", ex.viviendaJovenExt],
  ["alquilerExt", ex.alquilerExt],
  ["arrendadoresVaciasExt", ex.arrendadoresVaciasExt],
  ["rehabilitacionAlquilerExt", ex.rehabilitacionAlquilerExt],
  ["inversionMercantilExt", ex.inversionMercantilExt],
  ["viviendaRuralExt", ex.viviendaRuralExt],
  ["residenciaRuralExt", ex.residenciaRuralExt],
  ["interesesJovenExt", ex.interesesJovenExt],
  ["donativosExt", ex.donativosExt],
  ["trasladoExt", ex.trasladoExt],
  ["subvencionesElaExt", ex.subvencionesElaExt],
])
function contexto(territorio: string) {
  return {
    ejercicio: 2025,
    territorio,
    contribuyente: "a",
    declarantes: ["a"],
    modalidad: "individual",
    baseGeneral: "10000",
    baseAhorro: "0",
    minimoPersonalFamiliar: "0",
  }
}
function formula(nombre: string) {
  const f = funciones.get(nombre)
  if (f === undefined) throw new Error("Falta evaluador de prueba: " + nombre)
  return f
}
function caso(nombre: string) {
  const c = casos.find((c) => c.funcion === nombre)
  if (c === undefined) throw new Error("Falta caso: " + nombre)
  return c
}
function valor(
  nombre: string,
  datos: Schema.Json,
  contextoAlternativo?: Schema.Json
) {
  const c = caso(nombre)
  return formula(nombre)(contextoAlternativo ?? contexto(c.territorio), datos)
}
function racional(texto: string): readonly [bigint, bigint] {
  const [entero, decimales = ""] = texto.split(".")
  return [BigInt(entero + decimales), 10n ** BigInt(decimales.length)]
}
function comprobar(r: cm.ResultadoHechos | ex.ResultadoHechos, n: string, d = "1") {
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw new Error(r.motivo)
  const [observado, escala] = Schema.is(Schema.String)(r.importeExacto)
      ? racional(r.importeExacto)
      : [BigInt(r.importeExacto.numeradorEuros), BigInt(r.importeExacto.divisor)],
    esperado = BigInt(n),
    denominador = BigInt(d)
  const error = observado * denominador - esperado * escala
  if (!Schema.is(Schema.String)(r.importeExacto)) expect(error).toBe(0n)
  // Oráculo racional BigInt independiente de Decimal, tolera solo la división periódica a80dígitos.
  expect(
    (error < 0n ? -error : error) * 10n ** 60n <= escala * denominador
  ).toBe(true)
  const centimos = (esperado * 200n + denominador) / (denominador * 2n)
  const presentado = Schema.is(Schema.String)(r.importeExacto)
    ? cm.presentar({ ...r, importeExacto: r.importeExacto })
    : ex.presentar(r)
  if (!("importe" in presentado))
    throw new Error("Presentación perdió importe parcial")
  const [pn, pd] = racional(String(presentado.importe))
  expect(pn * 100n).toBe(centimos * pd)
  expect(r.aceptacionFiscal).toBe("pendiente")
  expect(r.pendientes.length).toBeGreaterThan(0)
}

describe("51 códigos · oráculos racionales declarados por regla", () => {
  it("cobertura exacta de las51 altas y sin duplicados", () => {
    expect(casos.length).toBe(51)
    expect(new Set(casos.map((c) => c.codigo)).size).toBe(51)
  })
  for (const c of casos) {
    it(c.codigo, () =>
      comprobar(
        formula(c.funcion)(contexto(c.territorio), c.datos),
        c.numerador,
        c.denominador
      )
    )
    it(c.codigo + " · rechaza desconocidos y expediente no exhaustivo", () => {
      const f = formula(c.funcion),
        ctx = contexto(c.territorio)
      expect(f(ctx, { ...c.datos, importeFiscalExterno: "999" }).estado).toBe(
        "no_soportado"
      )
      expect(f(ctx, { ...c.datos, exhaustividad: "desconocida" }).estado).toBe(
        "no_soportado"
      )
      expect(f({ ...ctx, ejercicio: 2026 }, c.datos).estado).toBe(
        "no_soportado"
      )
      expect(f({ ...ctx, declarantes: ["a", "a"] }, c.datos).estado).toBe(
        "no_soportado"
      )
    })
  }
})

// Casos adversos particulares: no se generan desde las fórmulas.
describe("reservas y ramas normativas delimitadas", () => {
  it("CLM reserva solo concurrencia12/12ter", () => {
    const c = caso("interesesPrimeraVivienda")
    expect(
      valor(c.funcion, { ...c.datos, concurrencia12ter: "si" }).estado
    ).toBe("no_soportado")
    const v = caso("viviendaRural")
    expect(valor(v.funcion, { ...v.datos, concurrencia12: "si" }).estado).toBe(
      "no_soportado"
    )
    comprobar(valor("donacionesIdi", caso("donacionesIdi").datos), "50")
  })
  it("CyL tres reservas conservadas sin cerrar la rama por analogía", () => {
    const p = caso("patrimonioCyl")
    expect(valor(p.funcion, { ...p.datos, acto: "autorizacion" }).estado).toBe(
      "no_soportado"
    )
    expect(valor(p.funcion, { ...p.datos, acto: "informe" }).estado).toBe(
      "no_soportado"
    )
    const e = caso("emprendimientoCyl")
    expect(valor(e.funcion, { ...e.datos, sede: "externa" }).estado).toBe(
      "no_soportado"
    )
    const r = caso("rehabilitacionSubvencionadaCyl")
    expect(
      valor(r.funcion, { ...r.datos, programa: "autonomico" }).estado
    ).toBe("no_soportado")
  })
  it("Ext vivienda enero–21marzo2022 no se decide por retroactividad", () => {
    const c = caso("viviendaRuralExt")
    for (const fechaOperacion of ["2022-01-01", "2022-03-21"])
      expect(valor(c.funcion, { ...c.datos, fechaOperacion }).estado).toBe(
        "no_soportado"
      )
    comprobar(
      valor(c.funcion, { ...c.datos, fechaOperacion: "2022-03-22" }),
      "904"
    )
  })
})

const pago = (
  importe = "1000",
  id = "p",
  pagador = "a",
  fecha = "2025-06-01"
) => ({ id, fecha, pagador, importe })
const anual = (concepto: string, valor = "10000", declarantes = ["a"]) => ({
  ejercicio: 2025,
  concepto,
  valor,
  declarantes,
})
describe("rentas, fechas, titulares, techos y magnitudes anuales", () => {
  it("CLM 36años cuenta admite; 37 excluye; total3000 y anual750", () => {
    const c = caso("cuentaVivienda")
    comprobar(valor(c.funcion, { ...c.datos, nacimiento: "1989-12-31" }), "750")
    comprobar(valor(c.funcion, { ...c.datos, nacimiento: "1988-12-31" }), "0")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        deducidoAnterior: anual("deducciones_cuenta_anteriores:cuenta", "2900"),
      }),
      "100"
    )
  })
  it("interesesCLM tramos12500/27000, resto por un céntimo", () => {
    const c = caso("interesesPrimeraVivienda"),
      ctx = contexto(c.territorio)
    comprobar(
      valor(c.funcion, c.datos, { ...ctx, baseGeneral: "12500" }),
      "150"
    )
    comprobar(
      valor(c.funcion, c.datos, { ...ctx, baseGeneral: "12500.01" }),
      "100"
    )
    comprobar(
      valor(c.funcion, c.datos, { ...ctx, baseGeneral: "27000.01" }),
      "0"
    )
  })
  it("CLM traslado base estricta22946, no umbral municipal5000", () => {
    const c = caso("trasladoLaboral")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        baseLiquidableInicial: anual("base_liquidable_inicio_periodo", "22946"),
      }),
      "0"
    )
  })
  it("alquilerCLM joven no importa prorrateo diario; dación sí", () => {
    const j = caso("alquilerJoven"),
      d = caso("alquilerDacion")
    comprobar(valor(j.funcion, { ...j.datos, inicio: "2025-12-31" }), "306")
    comprobar(
      valor(d.funcion, { ...d.datos, inicio: "2025-12-31" }),
      "50",
      "73"
    )
  })
  it("pago duplicado/negativo/fecha inexistente se rechaza, otro ejercicio no computa", () => {
    const c = caso("donacionesCooperacion")
    expect(
      valor(c.funcion, { ...c.datos, pagos: [pago(), pago()] }).estado
    ).toBe("no_soportado")
    expect(valor(c.funcion, { ...c.datos, pagos: [pago("-1")] }).estado).toBe(
      "no_soportado"
    )
    expect(
      valor(c.funcion, {
        ...c.datos,
        pagos: [pago("1", "p", "a", "2025-02-29")],
      }).estado
    ).toBe("no_soportado")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        pagos: [pago("1000", "p", "a", "2024-12-31")],
      }),
      "0"
    )
  })
  it("magnitud anual de otro concepto/persona/ejercicio no vale como hecho", () => {
    const c = caso("donacionesIdi")
    for (const cuotaAutonomica of [
      anual("base_liquidable_total", "500"),
      anual("cuota_integra_autonomica", "500", ["b"]),
      { ...anual("cuota_integra_autonomica", "500"), ejercicio: 2024 },
    ])
      expect(valor(c.funcion, { ...c.datos, cuotaAutonomica }).estado).toBe(
        "no_soportado"
      )
  })
  it("CyL precio150000 estricto y pueblo3000/distancia30", () => {
    const c = caso("viviendaJovenRuralCyl")
    comprobar(valor(c.funcion, { ...c.datos, valorFiscal: "150000" }), "0")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        poblacion: 3001,
        distanciaCapital: "29.99",
      }),
      "0"
    )
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        poblacion: 3000,
        distanciaCapital: "29.99",
      }),
      "1500"
    )
  })
  it("CyL nueva construcción cinco años y exclusión rehabilitación", () => {
    const c = caso("viviendaNuevaCyl")
    comprobar(
      valor(c.funcion, { ...c.datos, fechaPrimerPago: "2020-12-31" }),
      "0"
    )
    comprobar(valor(c.funcion, { ...c.datos, tipo: "rehabilitacion" }), "0")
  })
  it("naturaleza ninguno genera cero parcial, uno solo conserva reserva", () => {
    const c = caso("patrimonioCyl")
    comprobar(valor(c.funcion, { ...c.datos, acto: "ninguno" }), "0")
  })
  it("Ext parentesco donación a deportista excluye", () => {
    const c = caso("donativosExt")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        donaciones: [
          {
            id: "d",
            fecha: "2025-01-01",
            importe: "3000",
            destino: "deportista",
            domicilio: "extremadura",
            parentesco: "conyuge",
            participacionFamiliar: "0",
            irrevocabilidad: "irrevocable",
          },
        ],
      }),
      "0"
    )
  })
  it("ELA concesión/cobro/integración incoherentes rechaza sin inventar cuota", () => {
    const c = caso("subvencionesElaExt")
    expect(valor(c.funcion, { ...c.datos, cobrada: "2001" }).estado).toBe(
      "no_soportado"
    )
    expect(
      valor(c.funcion, {
        ...c.datos,
        integradaBaseLiquidable: anual(
          "ayuda_ela_integrada_base_liquidable",
          "2001"
        ),
      }).estado
    ).toBe("no_soportado")
  })
})

describe("R1/R2 publicados: invariantes de integración", () => {
  const ordinario = contexto("extremadura")
  const parto = {
    exhaustividad: "todos_los_partos",
    regimenRenta: "ordinario",
    partos: [
      {
        id: "p",
        fecha: "2025-01-01",
        hijosConvivientes: ["h1", "h2"],
        titulares: ["a", "b"],
      },
    ],
  }
  const escolar = {
    exhaustividad: "todos_los_descendientes",
    regimenRenta: "ordinario",
    descendientes: [
      { id: "h1", etapa: "primaria", titularesMinimo: ["a", "b"] },
    ],
  }
  it("individual reparte; conjunta con algún titular conserva íntegro", () => {
    comprobar(ex.partosMultiples(ordinario, parto), "300")
    comprobar(ex.materialEscolar(ordinario, escolar), "15", "2")
    const conjunta = {
      ...ordinario,
      modalidad: "conjunta",
      declarantes: ["a", "h"],
    }
    comprobar(ex.partosMultiples(conjunta, parto), "600")
    comprobar(ex.materialEscolar(conjunta, escolar), "15")
  })
  it("ningún titular conserva cero; ELA no hereda la correcciónR1/R2", () => {
    const conjunta = {
      ...ordinario,
      contribuyente: "z",
      modalidad: "conjunta",
      declarantes: ["z", "h"],
    }
    comprobar(ex.partosMultiples(conjunta, parto), "0")
    comprobar(ex.materialEscolar(conjunta, escolar), "0")
    comprobar(
      ex.ela(
        { ...ordinario, modalidad: "conjunta", declarantes: ["a", "h"] },
        {
          exhaustividad: "todos_los_diagnosticados",
          personas: [
            {
              id: "madre",
              fechaDiagnostico: "2025-01-01",
              relacion: "ascendiente",
              familiaresConDerecho: ["a", "b"],
            },
          ],
        }
      ),
      "1000"
    )
  })
})

describe("fronteras propias y no propagación de excepciones/repartos", () => {
  it("CLM salvaguarda2021 deriva de padrones, no de una cuota externa", () => {
    const c = caso("residenciaRural")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        poblacionAnual: 2100,
        poblacion2021: 1999,
      }),
      "250"
    )
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        poblacionAnual: 1999,
        poblacion2021: 2100,
      }),
      "250"
    )
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        categoria: "intermedia_agricola",
        municipioIntermedio: "02015",
      }),
      "150"
    )
    expect(
      valor(c.funcion, {
        ...c.datos,
        categoria: "intermedia_agricola",
        municipioIntermedio: "99999",
      }).estado
    ).toBe("no_soportado")
  })
  it("CyL9f y7.3 no importan el límite de renta general", () => {
    for (const nombre of ["donacionesIdiCyl", "rehabilitacionAlquilerCyl"]) {
      const c = caso(nombre)
      comprobar(
        valor(nombre, c.datos, {
          ...contexto(c.territorio),
          baseGeneral: "100000",
        }),
        c.numerador,
        c.denominador
      )
    }
  })
  it("cuidado familiar extremeño no hereda R1/R2", () => {
    const c = caso("cuidadoDiscapacidadExt")
    comprobar(
      valor(c.funcion, c.datos, {
        ...contexto(c.territorio),
        modalidad: "conjunta",
        declarantes: ["a", "h"],
      }),
      "110"
    )
  })
  it("identidades imposibles de acogido/adoptado y orden desconocido no generan cuantía", () => {
    const c = caso("acogimientoMenores")
    expect(
      valor(c.funcion, {
        ...c.datos,
        personas: [
          {
            id: "a",
            nacimiento: "2010-01-01",
            inicio: "2025-01-01",
            fin: "2025-12-31",
            orden: 1,
            contraprestacion: "0",
            ayudaJccm: "0",
            adopcion: "no",
            titulares: ["a", "b"],
          },
        ],
      }).estado
    ).toBe("no_soportado")
    const m = caso("multiplesCyl")
    expect(
      valor(m.funcion, { ...m.datos, fechaPrimero: "2024-12-31" }).estado
    ).toBe("no_soportado")
  })
})

describe("PESADO2 · discriminantes de autor sin cambiar los51 oráculos", () => {
  it("CyL7.2: gasto2024 se imputa al cobro de subvención2025", () => {
    const c = caso("rehabilitacionSubvencionadaCyl")
    comprobar(
      valor(c.funcion, {
        ...c.datos,
        pagos: [pago("20000", "p", "a", "2024-06-01")],
      }),
      "3000"
    )
  })
  it("gasto común CyL no acepta pagador ajeno a los titulares del mínimo", () => {
    const c = caso("cuidadoMenoresCyl")
    expect(
      valor(c.funcion, { ...c.datos, pagos: [pago("1200", "p", "intruso")] })
        .estado
    ).toBe("no_soportado")
  })
  it("cuidado14 rechaza pagador fuera de progenitores de la unidad", () => {
    const c = caso("cuidadoHasta14Ext")
    expect(
      valor(c.funcion, {
        ...c.datos,
        pagosUnidad: [pago("3000"), pago("1000", "p2", "intruso")],
      }).estado
    ).toBe("no_soportado")
  })
  it("acogimiento no puede empezar antes de nacer el acogido", () => {
    const c = caso("acogimientoMenores")
    expect(
      valor(c.funcion, {
        ...c.datos,
        personas: [
          {
            id: "h",
            nacimiento: "2025-07-01",
            inicio: "2025-01-01",
            fin: "2025-12-31",
            orden: 1,
            contraprestacion: "0",
            ayudaJccm: "0",
            adopcion: "no",
            titulares: ["a", "b"],
          },
        ],
      }).estado
    ).toBe("no_soportado")
    const e = caso("acogimientoMenoresExt")
    expect(
      valor(e.funcion, {
        ...e.datos,
        personas: [
          {
            id: "h",
            nacimiento: "2025-07-01",
            inicio: "2025-01-01",
            fin: "2025-12-31",
            regimen: "permanente",
            titulares: ["a", "b"],
          },
        ],
      }).estado
    ).toBe("no_soportado")
  })
  it("CyL ayudas/estatal con progenitor externo exige composición completa", () => {
    const c = caso("cuidadoMenoresCyl")
    expect(
      valor(c.funcion, {
        ...c.datos,
        hijos: [
          { id: "h", nacimiento: "2022-01-01", titularesMinimo: ["a", "b"] },
        ],
        progenitoresActividad: ["a", "b"],
        progenitoresAlta: ["a", "b"],
      }).estado
    ).toBe("no_soportado")
  })
  it("persona trasladada no puede haber nacido después del traslado", () => {
    const c = caso("trasladoExt")
    expect(
      valor(c.funcion, { ...c.datos, nacimiento: "2025-07-01" }).estado
    ).toBe("no_soportado")
  })
  it("movilidad no suma pagos superiores al precio del mismo vehículo", () => {
    const c = caso("movilidadCyl")
    expect(
      valor(c.funcion, {
        ...c.datos,
        vehiculos: [
          {
            id: "v",
            tipo: "hibrido",
            wltp: "40.01",
            precio: "40000",
            fechaMatricula: "2025-01-01",
            afectacion: "no",
            adquirentes: ["a", "b"],
            pagos: [pago("40000"), pago("1000", "p2", "b")],
            deduccionEstatal: anual(
              "deduccion_estatal_mismo_vehiculo_para_declaracion:v",
              "1500"
            ),
          },
        ],
      }).estado
    ).toBe("no_soportado")
  })
  it("residenciaExt: cuota conjunta atribuida por bases y sin excepción12bis", () => {
    const c = caso("residenciaRuralExt"),
      ctx = {
        ...contexto(c.territorio),
        modalidad: "conjunta",
        declarantes: ["a", "b"],
      }
    const datos = {
      ...c.datos,
      residentes: [
        {
          id: "a",
          poblacion: 2999,
          baseLiquidableIndividual: anual(
            "base_liquidable_individual:a",
            "10000",
            ["a", "b"]
          ),
        },
        {
          id: "b",
          poblacion: 3000,
          baseLiquidableIndividual: anual(
            "base_liquidable_individual:b",
            "30000",
            ["a", "b"]
          ),
        },
      ],
      cuotaAutonomica: anual("cuota_integra_autonomica", "1000", ["a", "b"]),
    }
    comprobar(valor(c.funcion, datos, ctx), "75", "2")
    comprobar(valor(c.funcion, datos, { ...ctx, baseGeneral: "45000.01" }), "0")
  })
})

describe("PESADO2 · orden de identidades sin significado fiscal", () => {
  it("los mismos titulares en orden inverso no son concurrencias distintas", () => {
    const c = caso("cuidadoMenoresCyl"),
      ctx = {
        ...contexto(c.territorio),
        modalidad: "conjunta",
        declarantes: ["a", "b"],
      }
    comprobar(
      valor(
        c.funcion,
        {
          ...c.datos,
          hijos: [
            { id: "h1", nacimiento: "2022-01-01", titularesMinimo: ["a", "b"] },
            { id: "h2", nacimiento: "2023-01-01", titularesMinimo: ["b", "a"] },
          ],
          progenitoresActividad: ["a", "b"],
          progenitoresAlta: ["a", "b"],
          incrementoEstatalMaternidad: anual(
            "incremento_estatal_maternidad",
            "0",
            ["b", "a"]
          ),
        },
        ctx
      ),
      "1200"
    )
  })
})
