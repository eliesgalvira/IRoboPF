import { describe, expect, it } from "vitest"
import {
  CODIGOS_VALENCIANOS_EVALUABLES_2025,
  evaluarDeduccionValenciana2025,
  type HechosValencianos2025,
  type UnidadValenciana,
} from "../lib/dominio/irpf/deducciones/valenciana-2025"
import { evaluarCuotaValenciana2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota"

function unidad(
  numeros: UnidadValenciana["numeros"] = {},
  textos: UnidadValenciana["textos"] = {}
): UnidadValenciana {
  return { id: "p", fecha: "2025-06-01", titulares: ["p"], numeros, textos }
}
function solicitud(
  codigo: string,
  u: UnidadValenciana,
  renta = 10000
): HechosValencianos2025 {
  return {
    codigo: "valenciana_" + codigo,
    ejercicio: 2025,
    territorio: "comunitat-valenciana",
    contribuyente: "p",
    declarantes: ["p"],
    modalidad: "individual",
    devengo: "2025-12-31",
    liquidableGeneral: renta,
    liquidableAhorro: 0,
    imponibleGeneral: renta,
    imponibleAhorro: 0,
    unidades: [u],
  }
}
type Caso = {
  codigo: string
  unidad: UnidadValenciana
  renta: number
  esperado: number
}
const casos: readonly Caso[] = [
  {
    codigo: "nacimiento_adopcion_multiples",
    unidad: { ...unidad({ personasMismaFecha: 2 }), titulares: ["p", "q"] },
    renta: 28500,
    esperado: 61.5,
  },
  {
    codigo: "nacimiento_adopcion_acogimiento_discapacidad",
    unidad: {
      ...unidad({ grado: 65, otrasPersonasDerecho: 0 }, { tipo: "nacimiento" }),
      titulares: ["p", "q"],
    },
    renta: 10000,
    esperado: 123,
  },
  {
    codigo: "familia_numerosa_monoparental",
    unidad: unidad({}, { categoria: "especial" }),
    renta: 33000,
    esperado: 330,
  },
  {
    codigo: "custodia_guarderias_menores_3",
    unidad: {
      ...unidad({ gastoCustodia: 2000, diasMenorTres: 365 }),
      titulares: ["p", "q"],
    },
    renta: 10000,
    esperado: 148.5,
  },
  {
    codigo: "conciliacion_trabajo_familia",
    unidad: unidad({ mesesDerecho: 12, cotizacionIntegraIntervalo: 300 }),
    renta: 10000,
    esperado: 300,
  },
  {
    codigo: "discapacidad_65",
    unidad: unidad({ edad: 65, grado: 33 }, { prestacionExenta: "no" }),
    renta: 10000,
    esperado: 197,
  },
  {
    codigo: "empleados_hogar_cuidado_personas",
    unidad: unidad(
      { cuotasMesesDerecho: 2000 },
      { grupo: "menores", limite: "ordinario" }
    ),
    renta: 10000,
    esperado: 660,
  },
  {
    codigo: "arrendador_renta_precio_referencia",
    unidad: unidad(
      {
        rendimientoIntegro: 4000,
        rentaMensualConRepercusiones: 700,
        precioReferenciaHistorico: 750,
      },
      { celdaCaLabVersion2025: "celda/2025" }
    ),
    renta: 10000,
    esperado: 165,
  },
  {
    codigo: "primera_vivienda_menores_35",
    unidad: unidad({ edad: 35, pagosSinIntereses: 10000 }),
    renta: 29000,
    esperado: 500,
  },
  {
    codigo: "vivienda_discapacidad",
    unidad: unidad(
      { pagosSinIntereses: 10000 },
      { discapacidadCualificadaDevengo: "DA6/certificado" }
    ),
    renta: 10000,
    esperado: 500,
  },
  {
    codigo: "vivienda_ayudas_publicas",
    unidad: unidad({ fraccionImputacion: 0.5 }, { regimen: "fijo" }),
    renta: 10000,
    esperado: 56,
  },
  {
    codigo: "arrendamiento_actividad_distinto_municipio",
    unidad: unidad({
      distanciaKm: 51,
      alquilerNoReembolsado: 3000,
      diasContrato: 365,
    }),
    renta: 10000,
    esperado: 224,
  },
  {
    codigo: "autoconsumo_renovables",
    unidad: unidad(
      { gasto: 10000, ayudas: 0, reembolsos: 0, fraccionPagadaVivienda: 1 },
      { vivienda: "habitual" }
    ),
    renta: 10000,
    esperado: 3520,
  },
  {
    codigo: "donaciones_finalidad_ecologica",
    unidad: unidad({ valorAportado: 300 }),
    renta: 10000,
    esperado: 62.5,
  },
  {
    codigo: "donaciones_bienes_patrimonio_cultural",
    unidad: unidad({ valorAportado: 300 }),
    renta: 10000,
    esperado: 62.5,
  },
  {
    codigo: "donativos_conservacion_patrimonio_cultural",
    unidad: unidad({ valorAportado: 300 }),
    renta: 500,
    esperado: 30,
  },
  {
    codigo: "conservacion_patrimonio_cultural_titulares",
    unidad: unidad(
      { valorAportado: 300 },
      { titularidadInventarioIntervencion: "inventario/factura" }
    ),
    renta: 500,
    esperado: 30,
  },
  {
    codigo: "donaciones_lengua_valenciana",
    unidad: unidad({ valorAportado: 300 }, { grupoDestinatario: "1" }),
    renta: 10000,
    esperado: 62.5,
  },
  {
    codigo: "donaciones_cesiones_fines_culturales_cientificos_deportivos",
    unidad: unidad(
      { valorAportado: 300 },
      { clase: "dinero", deduccionEstatal683a: "no" }
    ),
    renta: 10000,
    esperado: 75,
  },
  {
    codigo: "dos_o_mas_descendientes",
    unidad: unidad({
      descendientesMinimo: 2,
      imponiblesAgregadasPersonasUnicas: 30000,
      cuotaIntegraAutonomica: 1000,
      minoracionesEstatales: 200,
    }),
    renta: 10000,
    esperado: 80,
  },
  {
    codigo: "incremento_costes_financiacion_vivienda",
    unidad: unidad({
      intereses2025: 1000,
      intereses2024: 900,
      diasPrestamoAnterior: 360,
    }),
    renta: 10000,
    esperado: 50,
  },
  {
    codigo: "material_escolar",
    unidad: unidad({ diasDesempleo: 180 }),
    renta: 10000,
    esperado: 54.25,
  },
  {
    codigo: "obras_conservacion_mejora_periodo",
    unidad: unidad(
      { gasto: 6000, ayudas: 0, reembolsos: 0 },
      { accesibilidad33: "no", planYActuacionCalificados: "plan/obra" }
    ),
    renta: 10000,
    esperado: 1100,
  },
  {
    codigo: "obras_conservacion_mejora_2014_2015",
    unidad: unidad(
      { gasto: 4500, ayudas: 0, reembolsos: 0, baseConsumidaHistorica: 0 },
      { anioObra: "2015", plan2013a2015YBaseHistorica: "plan/historia" }
    ),
    renta: 24000,
    esperado: 562.5,
  },
  {
    codigo: "abonos_culturales",
    unidad: unidad(
      { gasto: 200, ayudas: 0, reembolsos: 0 },
      { adhesionYProrrogaVigentes2025: "convenio/prorroga" }
    ),
    renta: 10000,
    esperado: 34.65,
  },
  {
    codigo: "vehiculos_orden_5_2020",
    unidad: unidad(
      { gasto: 1600, ayudas: 0, reembolsos: 0 },
      { clase: "bicicleta", caracteristicasOrden5: "ficha/tecnica" }
    ),
    renta: 10000,
    esperado: 154,
  },
  {
    codigo: "inversion_entidades_nuevas_reciente_creacion",
    unidad: unidad(
      { inversionDesembolsada: 40000 },
      {
        regimen: "cualificado",
        viaAdicional: "eecv_art21",
        requisitosAdicionales: "requisitos/art21",
      }
    ),
    renta: 1000,
    esperado: 15000,
  },
  {
    codigo: "municipio_riesgo_despoblamiento",
    unidad: unidad(
      { descendientesSinABC: 2 },
      { municipioFondo2024o2025: "resolucion/municipio" }
    ),
    renta: 10000,
    esperado: 528,
  },
  {
    codigo: "tratamientos_fertilidad",
    unidad: unidad(
      { edad: 40, gastoTratamiento: 1000 },
      { clinicaAutorizada: "registro" }
    ),
    renta: 28500,
    esperado: 50,
  },
  {
    codigo: "gastos_salud",
    unidad: unidad(
      { gasto: 1000, ayudas: 0, reembolsos: 0 },
      { clase: "dental" }
    ),
    renta: 57000,
    esperado: 75,
  },
  {
    codigo: "fomento_formacion_musical",
    unidad: unidad(
      { gasto: 200, ayudas: 0, reembolsos: 0 },
      { relacion: "descendienteMinimo" }
    ),
    renta: 57000,
    esperado: 75,
  },
  {
    codigo: "ayudas_publicas_erte_covid",
    unidad: unidad({
      ayudaTotal: 1000,
      ayudaIntegrada: 1000,
      ayudaExenta: 0,
      tipoMedioAutonomico: 10,
    }),
    renta: 10000,
    esperado: 100,
  },
  {
    codigo: "donaciones_covid_investigacion",
    unidad: unidad({ valorAportado: 300 }),
    renta: 10000,
    esperado: 67.5,
  },
  {
    codigo: "donaciones_covid_gastos_crisis_sanitaria",
    unidad: unidad(
      { valorAportado: 300 },
      { aceptacionYDestinoDL4: "aceptacion/destino" }
    ),
    renta: 10000,
    esperado: 67.5,
  },
  {
    codigo: "dana_danos_materiales_vivienda_habitual",
    unidad: unidad(
      { gasto: 5000, ayudas: 1000, reembolsos: 1000 },
      { anexoFiscalAcuerdo4nov2024: "anexo", municipio: "anexo_fiscal" }
    ),
    renta: 10000,
    esperado: 2000,
  },
  {
    codigo: "dana_aportaciones_fondos_propios_entidades",
    unidad: unidad(
      { inversionDesembolsada: 30000 },
      {
        anexoFiscalAcuerdo4nov2024: "anexo",
        municipio: "anexo_fiscal",
        entidad: "nueva",
        domiciliosSocialFiscalYMantenimiento: "escritura",
      }
    ),
    renta: 100000,
    esperado: 9900,
  },
  {
    codigo: "nacimiento_adopcion_guarda_acogimiento",
    unidad: {
      ...unidad(
        { ordenPorContribuyente: 1 },
        { tipo: "nacimiento", derechoPrevio: "2024/derecho" }
      ),
      fecha: "2024-10-01",
    },
    renta: 10000,
    esperado: 300,
  },
  {
    codigo: "ascendientes_mayores_discapacidad",
    unidad: {
      ...unidad(
        {
          edad: 80,
          grado: 0,
          rentaNoExenta: 0,
          rentaDeclaracion: 0,
          diasConvivencia: 365,
        },
        { claseDiscapacidad: "fisica" }
      ),
      titulares: ["p", "q"],
    },
    renta: 28500,
    esperado: 49.25,
  },
  {
    codigo: "arrendamiento_cesion_uso_vivienda",
    unidad: unidad(
      {
        condicionesReforzadas: 0,
        alquilerSinServicios: 10000,
        diasContrato: 365,
      },
      { contrato: "alquiler" }
    ),
    renta: 28500,
    esperado: 400,
  },
  {
    codigo: "deporte_actividades_saludables",
    unidad: unidad({
      edad: 65,
      grado: 0,
      gasto: 100,
      ayudas: 0,
      reembolsos: 0,
    }),
    renta: 10000,
    esperado: 30,
  },
]

function caso(codigo: string): Caso {
  const encontrado = casos.find((c) => c.codigo === codigo)
  if (encontrado === undefined) throw new Error("Caso ausente: " + codigo)
  return encontrado
}
function calcular(c: Caso) {
  return evaluarDeduccionValenciana2025(solicitud(c.codigo, c.unidad, c.renta))
}
function esperado(c: Caso, importe: number) {
  expect(calcular(c)).toMatchObject({
    estado: "calculo_parcial",
    importe,
    aceptacionFiscal: "pendiente",
  })
}

describe("40 fórmulas parciales valencianas, oráculos independientes matriz g y rectificaciones", () => {
  it("cubre exactamente los 40 códigos sin utilizar el catálogo como oráculo", () => {
    expect(casos).toHaveLength(40)
    expect(new Set(casos.map((c) => "valenciana_" + c.codigo))).toEqual(
      new Set(CODIGOS_VALENCIANOS_EVALUABLES_2025)
    )
  })
  for (const c of casos) it(c.codigo, () => esperado(c, c.esperado))
  for (const c of casos)
    it(c.codigo + ": falta dato no se convierte en cero", () => {
      expect(calcular({ ...c, unidad: unidad() }).estado).toBe("no_soportado")
    })
  it("dos ascendientes comparten renta y reparto sin duplicar identidad", () => {
    const c = caso("ascendientes_mayores_discapacidad")
    const h = solicitud(c.codigo, c.unidad, c.renta)
    expect(
      evaluarDeduccionValenciana2025({
        ...h,
        unidades: [
          { ...c.unidad, id: "a1" },
          { ...c.unidad, id: "a2" },
        ],
      })
    ).toMatchObject({ importe: 98.5 })
  })
  it.each([45, 46])("fertilidad edad %i", (edad) => {
    const c = caso("tratamientos_fertilidad")
    const cambiado = {
      ...c,
      unidad: { ...c.unidad, numeros: { ...c.unidad.numeros, edad } },
    }
    if (edad === 46)
      expect(calcular(cambiado)).toMatchObject({ estado: "excluida" })
    else esperado(cambiado, 50)
  })
  it.each([
    [65, 30],
    [66, 50],
    [76, 100],
  ])("deporte edad %i", (edad, importe) => {
    const c = caso("deporte_actividades_saludables")
    esperado(
      { ...c, unidad: { ...c.unidad, numeros: { ...c.unidad.numeros, edad } } },
      importe
    )
  })
  it.each([183, 184])("acogimiento días %i", (diasMedida) => {
    const c = caso("nacimiento_adopcion_guarda_acogimiento")
    esperado(
      {
        ...c,
        unidad: unidad(
          { ordenPorContribuyente: 2, diasMedida },
          { tipo: "acogimiento", resolucionMedida: "resolucion" }
        ),
      },
      diasMedida === 183 ? 0 : 750
    )
  })
  it("inversión distingue cortes y no aplica art4Dos", () => {
    const c = caso("inversion_entidades_nuevas_reciente_creacion")
    expect(
      evaluarDeduccionValenciana2025({
        ...solicitud(c.codigo, c.unidad, 1000),
        devengo: "2025-12-29",
      })
    ).toMatchObject({ importe: 9900 })
    esperado(
      { ...c, unidad: { ...c.unidad, textos: { regimen: "general" } } },
      6600
    )
  })
  it("renovables: segunda residencia y remanente solo por cuota", () => {
    const c = caso("autoconsumo_renovables")
    esperado(
      { ...c, unidad: { ...c.unidad, textos: { vivienda: "segunda" } } },
      1760
    )
    const r = evaluarCuotaValenciana2025({
      hechos: solicitud(c.codigo, c.unidad),
      cuotaDisponible: 1000,
      referenciaCuota: "cuota/2025",
      arrastres: [],
    })
    expect(r.resultado).toMatchObject({
      importe: 1000,
      estado: "calculo_parcial",
    })
    expect(r.movimientos).toEqual([
      {
        id: "valenciana_autoconsumo_renovables:2025:p",
        origen: 2025,
        aplicado: 1000,
        pendiente: 2520,
        caduca: 2029,
      },
    ])
  })
  it("arrastres identificados se aplican por antigüedad y rechazan duplicados/caducados", () => {
    const c = caso("autoconsumo_renovables")
    const a = {
      hechos: solicitud(c.codigo, c.unidad),
      cuotaDisponible: 100,
      referenciaCuota: "cuota/2025",
      arrastres: [
        {
          id: "r1",
          codigo: "valenciana_" + c.codigo,
          contribuyente: "p",
          origen: 2021,
          pendiente: 200,
          soporte: "declaracion/2021",
        },
      ],
    }
    expect(evaluarCuotaValenciana2025(a).movimientos[0]).toMatchObject({
      aplicado: 100,
      pendiente: 100,
    })
    expect(
      evaluarCuotaValenciana2025({
        ...a,
        arrastres: [...a.arrastres, ...a.arrastres],
      }).resultado.estado
    ).toBe("no_soportado")
    expect(
      evaluarCuotaValenciana2025({
        ...a,
        arrastres: a.arrastres.map((v) => ({ ...v, origen: 2020 })),
      }).resultado.estado
    ).toBe("no_soportado")
  })
  it("DANA reduce límite por renta y aportación por base", () => {
    esperado(
      { ...caso("dana_danos_materiales_vivienda_habitual"), renta: 42500 },
      1000
    )
    esperado(
      { ...caso("dana_aportaciones_fondos_propios_entidades"), renta: 20000 },
      2700
    )
  })
  it("lengua no exige censo a los primeros cuatro grupos", () => {
    const c = caso("donaciones_lengua_valenciana")
    for (const grupoDestinatario of ["1", "2", "3", "4"])
      esperado(
        { ...c, unidad: { ...c.unidad, textos: { grupoDestinatario } } },
        62.5
      )
    expect(
      calcular({
        ...c,
        unidad: { ...c.unidad, textos: { grupoDestinatario: "5" } },
      })
    ).toMatchObject({
      estado: "no_soportado",
      motivo: expect.stringContaining("inscripcionEficazCenso2025"),
    })
  })
  it("rechaza Loriguilla/Valencia sin subámbito y ENISA como acreditación adicional", () => {
    const c = caso("dana_danos_materiales_vivienda_habitual")
    for (const municipio of ["Loriguilla", "Valencia", "fuera"])
      expect(
        calcular({
          ...c,
          unidad: { ...c.unidad, textos: { ...c.unidad.textos, municipio } },
        }).estado
      ).toBe("no_soportado")
    const z = caso("inversion_entidades_nuevas_reciente_creacion")
    expect(
      calcular({
        ...z,
        unidad: {
          ...z.unidad,
          textos: { ...z.unidad.textos, viaAdicional: "ENISA" },
        },
      }).estado
    ).toBe("no_soportado")
  })
  it.each([60000, 78000])("renta alta %i respeta modalidad", (renta) => {
    const c = caso("fomento_formacion_musical")
    const h = solicitud(c.codigo, c.unidad, renta)
    expect(
      evaluarDeduccionValenciana2025({
        ...h,
        modalidad: renta === 78000 ? "conjunta" : "individual",
      })
    ).toMatchObject({ importe: 0 })
  })
  it("validación runtime: identidades, fechas, NaN, importes libres", () => {
    const c = caso("material_escolar")
    const h = solicitud(c.codigo, c.unidad)
    for (const invalidado of [
      { ...h, unidades: [c.unidad, c.unidad] },
      { ...h, declarantes: ["p", "p"] },
      { ...h, devengo: "2025-02-30" },
      { ...h, liquidableAhorro: NaN },
      { ...h, unidades: [{ ...c.unidad, titulares: ["p", "p"] }] },
      { ...h, unidades: [unidad({ importe: 500 })] },
    ])
      expect(evaluarDeduccionValenciana2025(invalidado).estado).toBe(
        "no_soportado"
      )
  })
})

describe("fronteras y reservas por rama", () => {
  it("donación ordinaria cambia umbral por devengo, COVID lo conserva", () => {
    for (const codigo of [
      "donaciones_finalidad_ecologica",
      "donaciones_covid_investigacion",
    ]) {
      const c = caso(codigo)
      expect(
        evaluarDeduccionValenciana2025({
          ...solicitud(c.codigo, { ...c.unidad, fecha: "2025-01-01" }),
          devengo: "2025-05-31",
        })
      ).toMatchObject({ importe: 67.5 })
    }
  })
  it("coma no permite usar el esperado como deducción", () => {
    const c = caso("material_escolar")
    expect(
      calcular({
        ...c,
        unidad: unidad({ esperado: 54.25, diasDesempleo: 180 }),
      }).estado
    ).toBe("no_soportado")
  })
  it("general y ahorro liquidables se suman sin sustituir por imponible", () => {
    const c = caso("tratamientos_fertilidad")
    expect(
      evaluarDeduccionValenciana2025({
        ...solicitud(c.codigo, c.unidad),
        liquidableGeneral: 27000,
        liquidableAhorro: 1500,
        imponibleGeneral: 100000,
      })
    ).toMatchObject({ importe: 50 })
  })
  it.each([
    [54000, 150],
    [57000, 75],
    [60000, 0],
  ])("salud renta individual %i", (renta, importe) => {
    esperado({ ...caso("gastos_salud"), renta }, importe)
  })
  it.each([
    [72000, 150],
    [75000, 75],
    [78000, 0],
  ])("música renta conjunta %i", (renta, importe) => {
    const c = caso("fomento_formacion_musical")
    expect(
      evaluarDeduccionValenciana2025({
        ...solicitud(c.codigo, c.unidad, renta),
        modalidad: "conjunta",
        declarantes: ["p", "q"],
      })
    ).toMatchObject({ importe })
  })
  it("reparto individual/conjunta conserva total de múltiples", () => {
    const c = caso("nacimiento_adopcion_multiples")
    const h = solicitud(c.codigo, c.unidad, 10000)
    expect(evaluarDeduccionValenciana2025(h)).toMatchObject({ importe: 123 })
    expect(
      evaluarDeduccionValenciana2025({
        ...h,
        contribuyente: "q",
        declarantes: ["q"],
      })
    ).toMatchObject({ importe: 123 })
    expect(
      evaluarDeduccionValenciana2025({
        ...h,
        modalidad: "conjunta",
        declarantes: ["p", "q"],
      })
    ).toMatchObject({ importe: 246 })
  })
  it("alquiler comparte límite y distancia exactamente 50 excluye", () => {
    const c = caso("arrendamiento_cesion_uso_vivienda")
    esperado({ ...c, unidad: { ...c.unidad, titulares: ["p", "q"] } }, 200)
    const d = caso("arrendamiento_actividad_distinto_municipio")
    esperado(
      {
        ...d,
        unidad: {
          ...d.unidad,
          numeros: { ...d.unidad.numeros, distanciaKm: 50 },
        },
      },
      0
    )
  })
  it("no duplica topes de conciliación, salud y abonos", () => {
    for (const codigo of [
      "conciliacion_trabajo_familia",
      "gastos_salud",
      "abonos_culturales",
    ]) {
      const c = caso(codigo)
      expect(
        evaluarDeduccionValenciana2025({
          ...solicitud(c.codigo, c.unidad),
          unidades: [c.unidad, { ...c.unidad, id: "otro" }],
        }).estado
      ).toBe("no_soportado")
    }
  })
  it("intereses anterior anual y préstamo nuevo usan factor días/360 antes de restar", () => {
    const c = caso("incremento_costes_financiacion_vivienda")
    esperado(
      {
        ...c,
        unidad: unidad({
          intereses2025: 1000,
          intereses2024: 400,
          diasPrestamoAnterior: 180,
        }),
      },
      50
    )
    esperado(
      {
        ...c,
        unidad: unidad({
          intereses2025: 800,
          intereses2024: 900,
          diasPrestamoAnterior: 360,
        }),
      },
      0
    )
  })
  it("COVID ERTE solo aplica tipo a la parte integrada", () => {
    const c = caso("ayudas_publicas_erte_covid")
    esperado(
      {
        ...c,
        unidad: unidad({
          ayudaTotal: 1000,
          ayudaIntegrada: 200,
          ayudaExenta: 800,
          tipoMedioAutonomico: 10,
        }),
      },
      20
    )
    esperado(
      {
        ...c,
        unidad: unidad({
          ayudaTotal: 1000,
          ayudaIntegrada: 0,
          ayudaExenta: 1000,
          tipoMedioAutonomico: 10,
        }),
      },
      0
    )
  })
  it("comodato inmueble tiene base catastral por días, no importe de libre elección", () => {
    const c = caso(
      "donaciones_cesiones_fines_culturales_cientificos_deportivos"
    )
    esperado(
      {
        ...c,
        renta: 100000,
        unidad: unidad(
          { valorCatastral: 100000, diasComodato: 365 },
          { clase: "comodato_inmueble", deduccionEstatal683a: "no" }
        ),
      },
      1000
    )
  })
  it("salud óptica y gasto propio q3 sin certificado de donatario", () => {
    const c = caso("gastos_salud")
    esperado(
      {
        ...c,
        unidad: unidad(
          { gasto: 400, ayudas: 0, reembolsos: 0 },
          { clase: "optica" }
        ),
      },
      50
    )
    esperado(caso("conservacion_patrimonio_cultural_titulares"), 30)
  })
})
