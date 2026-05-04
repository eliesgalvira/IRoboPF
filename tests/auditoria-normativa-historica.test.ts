import { describe, expect, it } from "@effect/vitest"

import {
  construirContratoUrlAuditoriaNormativaV1,
  comunidadesAuditoriaNormativa,
  detallePerfilAuditoriaNormativa,
  describirComunidadAutonomaAuditoria,
  describirPerfilAuditoriaNormativa,
  escenarioAuditoriaPorDefecto,
  escenarioPermiteReferenciaTecnica2026,
  impactoDesdePerspectivaCiudadano,
  leerEscenarioAuditoriaNormativaDesdeUrl,
  normalizarEscenarioAuditoriaNormativa,
  perfilAuditoriaNormativaParaRetencionPersonalizada,
  perfilesAuditoriaNormativa,
  serializarEscenarioAuditoriaNormativa,
  umbralRetencionPerfilAuditoriaEuros,
  varianteAuditoriaPorDefecto,
} from "../lib/dominio/auditoria/auditoria-normativa-historica"

describe("auditoria normativa historica", () => {
  it("usa IRPF final y salario bruto real constante como variante por defecto", () => {
    expect(varianteAuditoriaPorDefecto).toEqual({
      magnitudAuditada: "irpf_final",
      estrategiaProyeccionSalarial: "salario_bruto_real_constante",
    })
    expect(escenarioAuditoriaPorDefecto).toMatchObject({
      perfil: "soltero_sin_hijos",
      comunidadAutonoma: "simulada-estatal",
      comunidadesAutonomas: ["simulada-estatal"],
      anioReferencia: 2025,
      anioComparado: 2019,
    })
  })

  it("declara los perfiles navegables de auditoria normativa", () => {
    expect(perfilesAuditoriaNormativa).toEqual([
      "soltero_sin_hijos",
      "pareja_con_hijos",
      "trabajador_medio_comunidad",
      "trabajador_mediano_comunidad",
      "distribucion_sintetica_comunidad",
    ])
    expect(
      describirPerfilAuditoriaNormativa("trabajador_mediano_comunidad")
    ).toMatchObject({
      etiqueta: "MEDIANO CCAA",
    })
  })

  it("presenta las fichas de perfil con ortografía española completa", () => {
    const detalles = perfilesAuditoriaNormativa.map(
      (perfil) => describirPerfilAuditoriaNormativa(perfil).detalle
    )

    expect(detalles.join("\n")).not.toMatch(
      /\b(\u0061\u006e\u006f\u0073|\u0063\u006f\u006e\u0079\u0075\u0067\u0065|\u0061\u0075\u0074\u006f\u006e\u006f\u006d\u0069\u0061)\b/i
    )
    expect(describirPerfilAuditoriaNormativa("pareja_con_hijos").detalle).toBe(
      "Matrimonio con cónyuge sin rentas > 1.500 euros y dos hijos de 8 y 5 años"
    )
  })

  it("declara las comunidades navegables para los perfiles de auditoria", () => {
    expect(comunidadesAuditoriaNormativa).toContain("simulada-estatal")
    expect(comunidadesAuditoriaNormativa).toContain("comunitat-valenciana")
    expect(describirComunidadAutonomaAuditoria("andalucia")).toMatchObject({
      etiqueta: "Andalucía",
    })
  })

  it("parsea el contrato URL v1 sin nulls en el modelo resultante", () => {
    const escenario = leerEscenarioAuditoriaNormativaDesdeUrl(
      new URLSearchParams(
        "v=1&perfil=trabajador_medio_comunidad&periodo=2024-2026&anioReferencia=2026&estrategiaSalario=coste_laboral_real_constante&magnitud=coste_laboral&comunidad=madrid"
      )
    )

    expect(escenario).toEqual({
      perfil: "trabajador_medio_comunidad",
      comunidadAutonoma: "madrid",
      comunidadesAutonomas: ["madrid"],
      anioReferencia: 2025,
      anioComparado: 2024,
      estrategiaProyeccionSalarial: "coste_laboral_real_constante",
      magnitudAuditada: "coste_laboral",
    })
  })

  it("reserva 2026 a perfiles con retencion tecnica y comunidad simulada estatal", () => {
    expect(
      escenarioPermiteReferenciaTecnica2026(escenarioAuditoriaPorDefecto)
    ).toBe(true)
    expect(
      escenarioPermiteReferenciaTecnica2026({
        ...escenarioAuditoriaPorDefecto,
        comunidadAutonoma: "madrid",
        comunidadesAutonomas: ["madrid"],
      })
    ).toBe(false)
    expect(
      normalizarEscenarioAuditoriaNormativa({
        ...escenarioAuditoriaPorDefecto,
        perfil: "pareja_con_hijos",
        anioReferencia: 2026,
      })
    ).toMatchObject({
      perfil: "pareja_con_hijos",
      anioReferencia: 2026,
    })
  })

  it("documenta el caso concreto de pareja con hijos para retenciones 2026", () => {
    expect(detallePerfilAuditoriaNormativa("pareja_con_hijos")).toMatchObject({
      etiquetaCalculo: "Pareja con dos hijos",
      situacionRetencion: "situacion2",
      descendientes: [
        { edad: 8, computoPorEntero: true },
        { edad: 5, computoPorEntero: true },
      ],
      umbralRetencion2026Euros: 19_262,
    })
    expect(detallePerfilAuditoriaNormativa("soltero_sin_hijos")).toMatchObject({
      situacionRetencion: "situacion3",
      descendientes: [],
      umbralRetencion2026Euros: 15_876,
    })
  })

  it("usa el umbral anual del perfil en las tarjetas de formulas", () => {
    expect(
      perfilAuditoriaNormativaParaRetencionPersonalizada("pareja_con_hijos")
    ).toBe("pareja_con_hijos")
    expect(
      perfilAuditoriaNormativaParaRetencionPersonalizada("soltero_sin_hijos")
    ).toBeUndefined()

    expect(
      umbralRetencionPerfilAuditoriaEuros({
        anio: 2019,
        perfil: "soltero_sin_hijos",
      })
    ).toBe(14_000)
    expect(
      umbralRetencionPerfilAuditoriaEuros({
        anio: 2019,
        perfil: "pareja_con_hijos",
      })
    ).toBe(17_634)
    expect(
      umbralRetencionPerfilAuditoriaEuros({
        anio: 2023,
        perfil: "pareja_con_hijos",
      })
    ).toBe(19_241)
    expect(
      umbralRetencionPerfilAuditoriaEuros({
        anio: 2025,
        perfil: "pareja_con_hijos",
      })
    ).toBe(19_262)
    expect(
      umbralRetencionPerfilAuditoriaEuros({
        anio: 2026,
        perfil: "pareja_con_hijos",
      })
    ).toBe(19_262)
  })

  it("degrada parametros URL invalidos al escenario por defecto", () => {
    const escenario = leerEscenarioAuditoriaNormativaDesdeUrl(
      new URLSearchParams(
        "v=1&perfil=inventado&periodo=abcd-2026&anioReferencia=2030&estrategiaSalario=inventada&magnitud=inventada&comunidad=ninguna"
      )
    )

    expect(escenario).toEqual(escenarioAuditoriaPorDefecto)
  })

  it("serializa el escenario al contrato URL versionado", () => {
    const parametros = serializarEscenarioAuditoriaNormativa({
      ...escenarioAuditoriaPorDefecto,
      perfil: "pareja_con_hijos",
      anioComparado: 2024,
      comunidadAutonoma: "catalunya",
      comunidadesAutonomas: ["catalunya"],
      magnitudAuditada: "salario_neto_anual",
    })

    expect(parametros.toString()).toBe(
      "v=1&perfil=pareja_con_hijos&anioReferencia=2025&periodo=2024-2025&estrategiaSalario=salario_bruto_real_constante&magnitud=salario_neto_anual&comunidad=catalunya"
    )
    expect(
      construirContratoUrlAuditoriaNormativaV1({
        ...escenarioAuditoriaPorDefecto,
        anioComparado: 2024,
      })
    ).toMatchObject({
      v: 1,
      periodo: "2024-2025",
    })
  })

  it("normaliza cualquier contrato antiguo de varias comunidades a seleccion singular", () => {
    const escenario = leerEscenarioAuditoriaNormativaDesdeUrl(
      new URLSearchParams(
        "v=1&comunidad=madrid&comunidades=catalunya,madrid,ninguna&periodo=2019-2025"
      )
    )

    expect(escenario).toMatchObject({
      comunidadAutonoma: "madrid",
      comunidadesAutonomas: ["madrid"],
    })

    const parametros = serializarEscenarioAuditoriaNormativa({
      ...escenarioAuditoriaPorDefecto,
      comunidadAutonoma: "catalunya",
      comunidadesAutonomas: ["catalunya", "madrid"],
    })

    expect(parametros.get("comunidad")).toBe("catalunya")
    expect(parametros.get("comunidades")).toBeNull()
  })

  it("expresa una bajada de IRPF como mejora para el ciudadano", () => {
    expect(
      impactoDesdePerspectivaCiudadano({
        magnitud: "irpf_final",
        resultadoRealCentimos: 660_00,
        resultadoContrafactualCentimos: 1_000_00,
      })
    ).toBe(340_00)
  })

  it("expresa una subida de salario neto como mejora para el ciudadano", () => {
    expect(
      impactoDesdePerspectivaCiudadano({
        magnitud: "salario_neto_anual",
        resultadoRealCentimos: 20_340_00,
        resultadoContrafactualCentimos: 20_000_00,
      })
    ).toBe(340_00)
  })
})
