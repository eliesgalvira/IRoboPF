import { describe, expect, it } from "@effect/vitest"

import {
  construirContratoUrlAuditoriaNormativaV1,
  describirPerfilAuditoriaNormativa,
  escenarioAuditoriaPorDefecto,
  impactoDesdePerspectivaCiudadano,
  leerEscenarioAuditoriaNormativaDesdeUrl,
  perfilesAuditoriaNormativa,
  serializarEscenarioAuditoriaNormativa,
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
      anioReferencia: 2026,
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

  it("parsea el contrato URL v1 sin nulls en el modelo resultante", () => {
    const escenario = leerEscenarioAuditoriaNormativaDesdeUrl(
      new URLSearchParams(
        "v=1&perfil=trabajador_medio_comunidad&periodo=2024-2026&anioReferencia=2026&estrategiaSalario=coste_laboral_real_constante&magnitud=coste_laboral&comunidad=madrid"
      )
    )

    expect(escenario).toEqual({
      perfil: "trabajador_medio_comunidad",
      comunidadAutonoma: "madrid",
      anioReferencia: 2026,
      anioComparado: 2024,
      estrategiaProyeccionSalarial: "coste_laboral_real_constante",
      magnitudAuditada: "coste_laboral",
    })
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
      magnitudAuditada: "salario_neto_anual",
    })

    expect(parametros.toString()).toBe(
      "v=1&perfil=pareja_con_hijos&anioReferencia=2026&periodo=2024-2026&estrategiaSalario=salario_bruto_real_constante&magnitud=salario_neto_anual&comunidad=catalunya"
    )
    expect(
      construirContratoUrlAuditoriaNormativaV1({
        ...escenarioAuditoriaPorDefecto,
        anioComparado: 2024,
      })
    ).toMatchObject({
      v: 1,
      periodo: "2024-2026",
    })
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
