import { describe, expect, it } from "vitest"
import {
  evaluarAmpliacionF2025 as evaluar,
  CODIGOS_AMPLIACION_F,
} from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025"

// Expectativas fijadas desde decisiones/citas de F ampliado, sin importar fórmulas
// del catálogo. No ejecutado durante fase ligera.
function solicitud<T extends object>(codigo: string, hechos: T) {
  return {
    tipo: "territorial_f_ampliacion_2025",
    codigo,
    contexto: {
      ejercicio: 2025,
      territorio: codigo.startsWith("madrid_") ? "madrid" : "murcia",
      contribuyente: "a",
      modalidad: "individual",
    },
    hechos: {
      bases: [{ id: "a", generalEUR: "20000", ahorroEUR: "0" }],
      miembrosUnidad: ["a"],
      elecciones: [],
      ...hechos,
    },
  }
}
const periodo = [{ desde: "2025-01-01", hasta: "2025-12-31" }]
const persona = () => ({
  id: "h",
  nacimiento: "2015-01-01",
  relacion: "hijo",
  rentasNoExentasEUR: "0",
  declaracionTipo: "no_presentada",
  discapacidadPorcentaje: "0",
  situacionDevengo: "vivo",
  certificadoParentesco: "registro",
  alimentos64175: "no",
  titularesMinimo: ["a"],
  titularesDeduccion: ["a"],
  gradoMasCercanoConPrioridad: [],
  progenitores: ["a"],
  convivencia: periodo,
  orden: 1,
  certificadoOrden: "libro",
  etapa: "primaria",
  certificadoEducativo: "centro",
  ayudasEscolaresEUR: "0",
  alimentosExentosEUR: "0",
})
const acogido = () => ({
  ...persona(),
  relacion: "acogido",
  nacimiento: "1950-01-01",
  gradoParentesco: 5,
  contraprestacionEUR: "0",
  ayudasAcogimientoEUR: "0",
  certificadoSinAyudas: "certificado",
  certificadoPadron: "padron",
})
const pago = (concepto: string, importeEUR = "100", objetoId = "v") => ({
  id: "p",
  fecha: "2025-06-01",
  importeEUR,
  ayudasEUR: "0",
  concepto,
  beneficiarioId: "h",
  objetoId,
  pagador: "a",
  medio: "transferencia",
  factura: "f",
  soportePago: "banco",
  computoBaseEstatalEUR: "0",
  mes: 1,
})
const vivienda = (territorio = "madrid") => ({
  id: "v",
  territorio,
  adquisicion: "2025-01-01",
  precioEUR: "100000",
  gastosEUR: "0",
  tributosEUR: "0",
  porcentajePropiedad: "100",
  titulares: ["a"],
  ocupacionDesde: "2025-02-01",
  permanenciaHasta: "2025-12-31",
  municipio: "municipio",
  poblacion: 1000,
  fechaPoblacion: "2024-01-01",
  referenciaPoblacion: "ine",
  superficieAnterior: "100",
  superficieNueva: "120",
  porcentajeOtraViviendaFamiliar: "0",
  derechoInversionVivienda: "no",
})
const contrato = () => ({
  id: "ct",
  viviendaId: "v",
  desde: "2025-02-01",
  hasta: "2028-02-01",
  vaciaDesde: "2024-02-01",
  parentescoGrado: 5,
  fianza: "fianza",
  titulares: ["a"],
  itpPresentado: "2025-02-02",
  itpVence: "2025-03-01",
})
const titulo = {
  categoria: "no_numerosa",
  efectos: "2025-01-01",
  titulares: ["a"],
  referencia: "titulo",
}
const empleo = () => ({
  tipoActividad: "cuenta_ajena",
  empleador: "a",
  trabajador: "trabajador",
  altaEmpleador: "2024-01-01",
  referenciaSS: "ss",
  certificadoActividad: "actividad",
  beneficiarioId: "h",
  diasAlta: 365,
  otroProgenitorDiasAlta: 365,
  horasMes: 40,
  mes: 1,
  periodosTrabajo: periodo,
})
const entidad = (territorio = "madrid") => ({
  id: "e",
  forma: "sl",
  domicilioSocial: territorio,
  domicilioFiscal: territorio,
  actividad: "economica_no_patrimonial",
  registro: "registro",
  certificado: "certificado",
  cuentasPresentadas: "si",
  situacionTributaria: "al_corriente",
  situacionSS: "al_corriente",
  gradoVinculo: 5,
  interesComun: "no",
  proyectoMurcia: "si",
  creditoFiscalVigente: "no",
  destino: "cultural",
  creacion: "2025-01-01",
  empleadosJornadaCompleta: 1,
  escritura: "escritura",
  comunicacionPrevia: "comunicacion",
  universidadInvestigacion: "no",
  funcionesEjecutivas: "no",
  relacionLaboral: "no",
})
const inversion = () => ({
  id: "i",
  entidadId: "e",
  fecha: "2025-06-01",
  tipo: "constitucion",
  importeEUR: "1000",
  gastosEUR: "0",
  tributosEUR: "0",
  porcentajeCapitalFamiliar: "40",
  porcentajeVotosFamiliar: "40",
  porcentajeCapitalPropio: "10",
  porcentajeVotosPropio: "10",
  patrimonioHastaDevengo: "sin_transmision",
  escritura: "escritura",
  comunicacionPrevia: "comunicacion",
})
const prestamo = () => ({
  id: "hip",
  tipo: "hipoteca",
  viviendaId: "v",
  fecha: "2024-01-01",
  destinoContrato: "vivienda",
  obligadoIntereses: "a",
})

// Fixture adaptado al contrato de hechos aportado por el integrador.
const recargaCompleta = {
  id: "inst", viviendaId: "v", vehiculoId: "veh",
  tipoCoste: "programa2_rd266_2021", puestaMarcha: "2025-06-01",
  finalizacion: "2025-06-01", facturaFecha: "2025-06-01", uso: "particular",
  titulares: ["a"], regimenPago: "propio", propiedadHastaDevengo: "2025-12-31",
  funcionamientoHastaDevengo: "2025-12-31", referenciaPropiedadInstalacion: "titulo",
  referenciaMantenimientoDosAnios: "obligacion2",
}
const casos = [
  {
    codigo: "madrid_intereses_estudios_grado_master_doctorado",
    hechos: {
      prestamos: [
        {
          id: "est",
          fecha: "2024-01-01",
          tipo: "entidad_credito_estudios",
          entidadCredito: "banco",
          destinoContrato: "grado",
          soporteDestino: "matricula",
          obligadoIntereses: "a",
          estudios: "grado_oficial",
          beneficiarioId: "a",
        },
      ],
      pagos: [pago("intereses_estudios", "100", "est")],
    },
    esperado: 100,
  },
  {
    codigo: "madrid_acogimiento_familiar_menores",
    hechos: {
      personas: [
        {
          ...persona(),
          acogimientoTipo: "permanente",
          acogimientoCertificado: "consejeria",
        },
      ],
    },
    esperado: 618.6,
  },
  {
    codigo: "madrid_acogimiento_mayores_65_discapacidad",
    hechos: { personas: [acogido()] },
    esperado: 1546.5,
  },
  {
    codigo: "madrid_cuidado_ascendientes",
    hechos: {
      personas: [
        { ...persona(), relacion: "ascendiente", nacimiento: "1950-01-01" },
      ],
    },
    esperado: 515.5,
  },
  {
    codigo: "madrid_gastos_educativos",
    hechos: { personas: [persona()], pagos: [pago("escolaridad", "200")] },
    esperado: 30,
  },
  {
    codigo: "madrid_cuidado_hijos_mayores_dependientes_discapacidad",
    hechos: {
      personas: [{ ...persona(), nacimiento: "2024-01-01" }],
      empleos: [empleo()],
      titulo,
      pagos: [pago("cuota_hogar", "100", "trabajador")],
    },
    esperado: 25,
  },
  {
    codigo: "murcia_material_escolar_libros_texto",
    hechos: { personas: [persona()], titulo, pagos: [pago("libros_texto")] },
    esperado: 120,
  },
  {
    codigo: "murcia_conciliacion",
    hechos: {
      personas: [persona()],
      empleos: [empleo()],
      pagos: [pago("cuota_hogar", "100", "trabajador")],
    },
    esperado: 20,
  },
  {
    codigo: "murcia_acogimiento_mayores_65_discapacidad",
    hechos: { personas: [acogido()] },
    esperado: 600,
  },
  {
    codigo: "murcia_mujeres_trabajadoras",
    hechos: { personas: [persona()], empleos: [empleo()], sexo: "mujer" },
    esperado: 300,
  },
  {
    codigo: "murcia_familia_monoparental",
    hechos: {
      personas: [persona()],
      convivientes: ["a", "h"],
      situacionFamiliaDesde: "2025-01-01",
      certificadoFamiliaMonoparental: "registro",
    },
    esperado: 303,
  },
  {
    codigo: "madrid_gastos_arrendamiento_viviendas",
    hechos: {
      viviendas: [vivienda()],
      contratos: [contrato()],
      pagos: [pago("reparacion")],
    },
    esperado: 10,
  },
  {
    codigo: "madrid_arrendamiento_viviendas_vacias",
    hechos: { viviendas: [vivienda()], contratos: [contrato()] },
    esperado: 1000,
  },
  {
    codigo: "madrid_cambio_residencia_municipio_despoblacion",
    hechos: {
      viviendas: [vivienda()],
      nacimientoContribuyente: "2000-01-01",
      fechaTraslado: "2025-02-01",
      modalidadAccesoActividad: "compra_onerosa",
    },
    esperado: 1000,
  },
  {
    codigo: "madrid_vivienda_municipios_despoblacion",
    hechos: { viviendas: [vivienda()], nacimientoContribuyente: "2000-01-01" },
    esperado: 1000,
  },
  {
    codigo: "madrid_vivienda_nacimiento_adopcion_hijos",
    hechos: {
      viviendas: [vivienda()],
      personas: [{ ...persona(), nacimiento: "2024-01-01" }],
    },
    esperado: 1000,
  },
  {
    codigo: "madrid_intereses_vivienda_jovenes_menores_30",
    hechos: {
      viviendas: [vivienda()],
      nacimientoContribuyente: "2000-01-01",
      prestamos: [prestamo()],
      pagos: [pago("intereses_hipoteca", "100", "hip")],
    },
    esperado: 25,
  },
  {
    codigo: "madrid_arrendamiento_vivienda_habitual",
    hechos: {
      viviendas: [vivienda()],
      nacimientoContribuyente: "2000-01-01",
      contratos: [contrato()],
      pagos: [pago("alquiler", "5000")],
    },
    esperado: 1237.2,
  },
  {
    codigo: "murcia_arrendamiento_vivienda_habitual",
    hechos: {
      viviendas: [vivienda("murcia")],
      nacimientoContribuyente: "2000-01-01",
      contratos: [contrato()],
      pagos: [pago("alquiler", "2000")],
      titulo,
      personas: [
        { ...persona(), id: "a", relacion: "contribuyente", progenitores: [] },
      ],
      minimoPersonalFamiliarEUR: "5550",
    },
    esperado: 200,
  },
  {
    codigo: "murcia_nueva_vivienda_o_ampliacion_familias_numerosas",
    hechos: {
      viviendas: [vivienda("murcia")],
      titulo: { ...titulo, categoria: "general", efectos: "2024-01-01" },
      tipoAmpliacion: "anexo_unido_fisicamente",
      pagos: [pago("ampliacion_vivienda", "1000")],
    },
    esperado: 100,
  },
  {
    codigo: "murcia_acceso_internet",
    hechos: {
      viviendas: [{ ...vivienda("murcia"), fechaPoblacion: "2025-12-31" }],
      contratos: [
        {
          ...contrato(),
          tipo: "internet_alta_velocidad",
          usoProfesional: "no",
          lineasAnterioresVigentes: [],
          historialDeduccionVivienda: "ninguna",
          historialDeduccionTitular: "ninguna",
        },
      ],
      pagos: [pago("internet_alta", "100", "ct")],
    },
    esperado: 30,
  },
  {
    codigo: "murcia_vehiculos_electricos",
    hechos: {
      residenciaFiscalAdquisicion: "murcia",
      vehiculos: [
        {
          id: "v1",
          categoria: "M1",
          tecnologia: "BEV",
          plazas: 5,
          adquisicion: "2025-06-01",
          matriculacion: "2025-06-01",
          contrato: "contrato",
          modalidad: "compraventa",
          titular: "a",
          uso: "particular",
          procedencia: "nuevo",
          propiedadHastaDevengo: "sin_transmision",
          importeEUR: "10000",
          gastosEUR: "0",
          tributosEUR: "0",
          ayudasEUR: "0",
          titularesReparto: ["a"],
        },
      ],
    },
    esperado: 3000,
  },
  {
    codigo: "murcia_instalaciones_recursos_energeticos_renovables",
    hechos: {
      viviendas: [vivienda("murcia")],
      instalaciones: [
        {
          id: "inst",
          viviendaId: "v",
          tecnologia: "solar_fotovoltaica",
          modalidadExcedentes: "sin_excedentes",
          declaracionResponsable: "declaracion",
          instaladorHabilitado: "carnet",
          uso: "habitual",
          inversionesPorTitular: [{ id: "a", importeEUR: "100" }],
        },
      ],
      pagos: [pago("instalacion_renovable", "100", "inst")],
    },
    esperado: 50,
  },
  {
    codigo: "madrid_donativos_fundaciones_clubes_deportivos",
    hechos: {
      entidades: [{ ...entidad(), forma: "fundacion" }],
      pagos: [pago("donativo_dinerario", "1000", "e")],
      liquidableGeneralEUR: "5000",
      liquidableAhorroEUR: "0",
    },
    esperado: 75,
  },
  {
    codigo: "murcia_donativos_patrimonio_cultural_actividades",
    hechos: {
      entidades: [entidad("murcia")],
      pagos: [
        {
          ...pago("donativo_dinerario", "1000", "e"),
          computoBaseEstatalEUR: "200",
        },
      ],
    },
    esperado: 400,
  },
  {
    codigo: "murcia_donativos_investigacion_biosanitaria",
    hechos: {
      entidades: [
        {
          ...entidad("murcia"),
          forma: "region_murcia",
          destino: "investigacion_biosanitaria",
          biosanitaria: "registro",
        },
      ],
      pagos: [
        {
          ...pago("donativo_dinerario", "1000", "e"),
          computoBaseEstatalEUR: "200",
        },
      ],
    },
    esperado: 400,
  },
  {
    codigo: "murcia_donaciones_bienes_patrimonio_cultural",
    hechos: {
      entidades: [
        {
          ...entidad("murcia"),
          forma: "entidad_contabilidad",
          inventarioBien: "inventario",
          documentoEntrega: "acta",
          valorContableEUR: "600",
          valorMercadoEUR: "500",
        },
      ],
      pagos: [pago("donacion_bien", "0", "e")],
    },
    esperado: 75,
  },
  {
    codigo: "madrid_inversion_entidades_nuevas_reciente_creacion",
    hechos: { entidades: [entidad()], inversiones: [inversion()] },
    esperado: 400,
  },
  {
    codigo: "madrid_autoempleo_jovenes_menores_35",
    hechos: {
      nacimientoContribuyente: "2000-01-01",
      fechaAltaCenso: "2025-01-01",
      primeraAltaCenso: "si",
      actividadTerritorio: "principalmente_madrid",
      empleos: [empleo()],
    },
    esperado: 1031,
  },
  {
    codigo: "madrid_inversiones_mercado_alternativo_bursatil",
    hechos: {
      entidades: [entidad()],
      inversiones: [{ ...inversion(), tipo: "mab_expansion_ampliacion" }],
    },
    esperado: 200,
  },
  {
    codigo: "madrid_inversiones_nuevos_contribuyentes_extranjero",
    hechos: {
      entidades: [{ ...entidad(), emisorNacionalidad: "extranjera" }],
      inversiones: [{ ...inversion(), tipo: "fondos_propios_cotizados" }],
      fechaResidenciaMadrid: "2025-01-01",
      historialResidencia: [2020, 2021, 2022, 2023, 2024].map((ejercicio) => ({
        ejercicio,
        territorio: "extranjero",
      })),
    },
    esperado: 200,
  },
  {
    codigo: "murcia_inversion_entidades_nuevas_reciente_creacion",
    hechos: { entidades: [entidad("murcia")], inversiones: [inversion()] },
    esperado: 200,
  },
  {
    codigo: "murcia_inversion_mab",
    hechos: {
      entidades: [entidad("murcia")],
      inversiones: [{ ...inversion(), tipo: "mab_expansion_ampliacion" }],
    },
    esperado: 200,
  },
  {
    codigo: "murcia_inversion_economia_social",
    hechos: {
      entidades: [entidad("murcia")],
      inversiones: [
        { ...inversion(), tipo: "aportacion_socio_economia_social" },
      ],
    },
    esperado: 200,
  },
]

describe("F ampliación: oráculos preparados por código, sin cuota alternativa", () => {
  it.each([
    "titularesMinimo",
    "titularesDeduccion",
    "gradoMasCercanoConPrioridad",
  ] as const)("no sitúa al hijo en lista incompatible %s", (lista) => {
    const p = { ...persona(), [lista]: ["a", "h"] }
    const r = evaluar(
      solicitud("murcia_material_escolar_libros_texto", {
        personas: [p],
        titulo,
        pagos: [pago("libros_texto")],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("cónyuge con identidad del titular no es persona dependiente distinta", () => {
    const r = evaluar(
      solicitud("madrid_cuidado_hijos_mayores_dependientes_discapacidad", {
        personas: [
          {
            ...persona(),
            id: "a",
            progenitores: [],
            relacion: "conyuge",
            nacimiento: "1950-01-01",
            discapacidadPorcentaje: "33",
            certificadoDiscapacidad: "certificado",
          },
        ],
        empleos: [{ ...empleo(), beneficiarioId: "a" }],
        titulo,
        pagos: [pago("cuota_hogar", "100", "trabajador")],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("participación propia no supera agregado familiar", () => {
    const r = evaluar(
      solicitud("madrid_inversion_entidades_nuevas_reciente_creacion", {
        entidades: [entidad()],
        inversiones: [
          {
            ...inversion(),
            porcentajeCapitalPropio: "50",
            porcentajeCapitalFamiliar: "40",
          },
        ],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("votos propios no superan agregado familiar", () => {
    const r = evaluar(
      solicitud("murcia_inversion_entidades_nuevas_reciente_creacion", {
        entidades: [entidad("murcia")],
        inversiones: [
          {
            ...inversion(),
            porcentajeVotosPropio: "50",
            porcentajeVotosFamiliar: "40",
          },
        ],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("porcentajes sobre100 son hechos inválidos, no fórmula alternativa", () => {
    const r = evaluar(
      solicitud("madrid_inversion_entidades_nuevas_reciente_creacion", {
        entidades: [entidad()],
        inversiones: [
          {
            ...inversion(),
            porcentajeCapitalPropio: "101",
            porcentajeCapitalFamiliar: "101",
          },
        ],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("dos descendientes no omite otro titular del mínimo", () => {
    const r = evaluar(
      solicitud("madrid_familias_dos_descendientes_ingresos_reducidos", {
        personas: [
          { ...persona(), titularesMinimo: ["a", "b"] },
          { ...persona(), id: "h2", titularesMinimo: ["a", "b"] },
        ],
        titularesConMismoMinimo: ["a"],
        basesOtrosTitulares: [
          { id: "a", generalEUR: "20000", ahorroEUR: "0" },
          { id: "h", generalEUR: "0", ahorroEUR: "0" },
          { id: "h2", generalEUR: "0", ahorroEUR: "0" },
        ],
      })
    )
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
    expect(r.siguienteHecho).toBe("titularesConMismoMinimo")
  })
  it("rechaza ocupación futura que no acredita habitualidad al devengo", () => {
    const r = evaluar(
      solicitud("madrid_vivienda_municipios_despoblacion", {
        viviendas: [
          {
            ...vivienda(),
            adquisicion: "2025-12-01",
            ocupacionDesde: "2026-01-01",
          },
        ],
        nacimientoContribuyente: "2000-01-01",
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("inversión futura dentro ventana extranjera no se deduce en2025", () => {
    const r = evaluar(
      solicitud("madrid_inversiones_nuevos_contribuyentes_extranjero", {
        entidades: [{ ...entidad(), emisorNacionalidad: "extranjera" }],
        inversiones: [
          {
            ...inversion(),
            fecha: "2026-01-01",
            tipo: "fondos_propios_cotizados",
          },
        ],
        fechaResidenciaMadrid: "2025-01-01",
        historialResidencia: [2020, 2021, 2022, 2023, 2024].map(
          (ejercicio) => ({ ejercicio, territorio: "extranjero" })
        ),
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  // Murcia art1.Trece.4 y Madrid art11.5: gasto común y máximo antes de reparto.
  it("alquiler Murcia reúne pagos de cotitulares, máximo300 antes de mitad", () => {
    const r = evaluar(
      solicitud("murcia_arrendamiento_vivienda_habitual", {
        viviendas: [vivienda("murcia")],
        nacimientoContribuyente: "2000-01-01",
        contratos: [
          {
            ...contrato(),
            titulares: ["a", "b"],
            regimenReparto: "cotitulares_gasto_comun",
          },
        ],
        pagos: [
          { ...pago("alquiler", "2000"), atribucion: "gasto_comun" },
          {
            ...pago("alquiler", "1000"),
            id: "p2",
            pagador: "b",
            atribucion: "gasto_comun",
          },
        ],
        titulo,
        personas: [
          {
            ...persona(),
            id: "a",
            relacion: "contribuyente",
            progenitores: [],
          },
        ],
        minimoPersonalFamiliarEUR: "5550",
      })
    )
    expect(r.estado, r.motivo).toBe("calculo_parcial")
    expect(r.importe).toBe(150)
  })
  it("educación reúne gasto común por hijo antes de reparto", () => {
    const p = {
      ...persona(),
      progenitores: ["a", "b"],
      titularesMinimo: ["a", "b"],
      titularesDeduccion: ["a", "b"],
    }
    const r = evaluar(
      solicitud("madrid_gastos_educativos", {
        personas: [p],
        pagos: [
          { ...pago("escolaridad", "200"), atribucion: "gasto_comun" },
          {
            ...pago("escolaridad", "200"),
            id: "p2",
            pagador: "b",
            atribucion: "gasto_comun",
          },
        ],
      })
    )
    expect(r.estado, r.motivo).toBe("calculo_parcial")
    expect(r.importe).toBe(30)
  })
  // Primaria: murcia_instalaciones_recursos_energeticos_renovables-regla-49-p47.
  it("renovables comparte tope7000 proporcional, no7000 por titular", () => {
    const r = evaluar(
      solicitud("murcia_instalaciones_recursos_energeticos_renovables", {
        viviendas: [vivienda("murcia")],
        instalaciones: [
          {
            id: "inst",
            viviendaId: "v",
            tecnologia: "solar_fotovoltaica",
            modalidadExcedentes: "sin_excedentes",
            declaracionResponsable: "declaracion",
            instaladorHabilitado: "carnet",
            uso: "habitual",
            inversionesPorTitular: [
              { id: "a", importeEUR: "15000" },
              { id: "b", importeEUR: "15000" },
            ],
          },
        ],
        pagos: [pago("instalacion_renovable", "15000", "inst")],
      })
    )
    expect(r.importe).toBe(3500)
  })
  // Primarias: murcia_material_escolar_libros_texto-regla-23-p47 y -25-p48.
  it("material escolar120 menos beca60 antes de mitad=30", () => {
    const r = evaluar(
      solicitud("murcia_material_escolar_libros_texto", {
        personas: [
          {
            ...persona(),
            titularesDeduccion: ["a", "b"],
            titularesMinimo: ["a", "b"],
            progenitores: ["a", "b"],
            ayudasEscolaresEUR: "60",
          },
        ],
        titulo,
        pagos: [pago("libros_texto")],
      })
    )
    expect(r.importe).toBe(30)
  })
  it("transitorio pendiente pide historial concreto, no criterio normativo universal", () => {
    const r = evaluar(
      solicitud("murcia_regimen_transitorio_inversion_vivienda_habitual", {
        viviendas: [vivienda("murcia")],
        pagos: [pago("adquisicion_vivienda")],
        ramaTransitoria: "1998_2000",
        derechoHistoricoReferencia: "expediente",
      })
    )
    expect(r.siguienteHecho).toBe("historial_inversion_vivienda")
    expect(r.dependenciaAnual?.magnitud).toBe("historial_inversion_vivienda")
    expect(r.importe).toBeUndefined()
  })
  it("no declara convivencia anterior al nacimiento", () => {
    const r = evaluar(
      solicitud("madrid_gastos_educativos", {
        personas: [
          { ...persona(), nacimiento: "2025-06-01", etapa: "infantil_segundo" },
        ],
        pagos: [pago("escolaridad", "200")],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("fórmulaFN no suplanta rechazo por título fuera de ventana", () => {
    const r = evaluar(
      solicitud("madrid_condicion_familia_numerosa", {
        titulo: { ...titulo, categoria: "general", efectos: "2022-12-31" },
      })
    )
    expect(r.estado).toBe("excluida")
    expect(r.siguienteHecho).toBe("titulo.efectos")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("fórmula dos descendientes no suplanta rechazo de suma24744,01", () => {
    const r = evaluar(
      solicitud("madrid_familias_dos_descendientes_ingresos_reducidos", {
        personas: [persona(), { ...persona(), id: "h2" }],
        titularesConMismoMinimo: ["a"],
        basesOtrosTitulares: [
          { id: "a", generalEUR: "24744.01", ahorroEUR: "0" },
          { id: "h", generalEUR: "0", ahorroEUR: "0" },
          { id: "h2", generalEUR: "0", ahorroEUR: "0" },
        ],
      })
    )
    expect(r.estado).toBe("excluida")
    expect(r.siguienteHecho).toBe("basesOtrosTitulares")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("fórmula financiación no suplanta rechazo de precio390000,01", () => {
    const r = evaluar(
      solicitud("madrid_incremento_costes_financiacion_vivienda", {
        viviendas: [
          {
            ...vivienda(),
            adquisicion: "2024-01-01",
            ocupacionDesde: "2024-02-01",
            precioEUR: "390000.01",
          },
        ],
        prestamos: [{ ...prestamo(), tipo: "hipoteca_variable" }],
        pagos: [pago("intereses_hipoteca", "100", "hip")],
      })
    )
    expect(r.estado).toBe("excluida")
    expect(r.siguienteHecho).toBe("adquisicion/precio")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("reserva patrimonial no suplanta edad>40", () => {
    const r = evaluar(
      solicitud("murcia_vivienda_jovenes_hasta_40", {
        nacimientoContribuyente: "1984-12-31",
        viviendas: [vivienda("murcia")],
        pagos: [pago("adquisicion_vivienda", "6000")],
      })
    )
    expect(r.estado).toBe("excluida")
    expect(r.siguienteHecho).toBe("edad")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("reserva agua no suplanta falta de reconocimiento previo", () => {
    const r = evaluar(
      solicitud("murcia_dispositivos_ahorro_agua", {
        viviendas: [{ ...vivienda("murcia"), ahorroAguaDispositivo: "art4" }],
        pagos: [pago("dispositivo_ahorro_agua", "100")],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.siguienteHecho).toBe("reconocimientoAhorroAgua")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("recarga no incluye contador inteligente en basePrograma2", () => {
    const r = evaluar(
      solicitud("murcia_recarga_vehiculos_electricos", {
        viviendas: [vivienda("murcia")],
        instalaciones: [
          recargaCompleta,
        ],
        pagos: [pago("contador_inteligente", "100", "inst")],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.siguienteHecho).toBe("pago.concepto")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("transitorio no emite fórmula antes de identificar derecho histórico", () => {
    const r = evaluar(
      solicitud("murcia_regimen_transitorio_inversion_vivienda_habitual", {
        viviendas: [vivienda("murcia")],
        pagos: [pago("adquisicion_vivienda")],
        ramaTransitoria: "1998_2000",
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.siguienteHecho).toBe("derechoHistoricoReferencia")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it.each(casos)("$codigo", ({ codigo, hechos, esperado }) => {
    const r = evaluar(solicitud(codigo, hechos))
    expect(r.estado, r.motivo).toBe("calculo_parcial")
    expect(r.importe).toBe(esperado)
    expect(r.aceptacionFiscal).toBe("pendiente")
    expect(r.citas.length).toBeGreaterThan(0)
  })
  it("registra41 ramas nuevas únicas", () =>
    expect(new Set(CODIGOS_AMPLIACION_F).size).toBe(41))
  it("reutiliza Madrid múltiples2886,80 sin copiar fórmula", () => {
    const contexto = {
      ejercicio: 2025,
      territorio: "madrid",
      contribuyente: "a",
      modalidad: "individual",
    }
    const r = evaluar(
      solicitud("madrid_nacimiento_adopcion_hijos", {
        hechosPrevios: {
          codigo: "madrid_nacimiento_adopcion_hijos",
          contexto,
          declarantes: ["a"],
          elegibilidadExterna: true,
          eventos: [
            {
              ejercicio: 2025,
              hijos: ["h1", "h2"],
              progenitoresConvivientes: ["a"],
            },
          ],
          historia: [
            {
              ejercicio: 2025,
              general: 20000,
              ahorro: 0,
              basesUnidadFamiliar: [20000],
            },
          ],
        },
      })
    )
    expect(r.importe).toBe(2886.8)
  })
  it("reutiliza guardería dos hijos2000 sin doble tope global", () => {
    const contexto = {
      ejercicio: 2025,
      territorio: "murcia",
      contribuyente: "a",
      modalidad: "individual",
    }
    const r = evaluar(
      solicitud("murcia_gastos_guarderia", {
        hechosPrevios: {
          codigo: "murcia_gastos_guarderia",
          contexto,
          declarantes: ["a"],
          elegibilidadExterna: true,
          baseImponible: 20000,
          gastos: ["h1", "h2"].map((hijo) => ({
            hijo,
            titulares: ["a"],
            custodia: 5000,
            alimentacion: 0,
            vestuarioEscolar: 0,
            ayudas: 0,
          })),
        },
      })
    )
    expect(r.importe).toBe(2000)
  })
  it.each(["madrid_adopcion_internacional", "murcia_nacimiento_adopcion"])(
    "reutiliza corrección de propio progenitor: %s",
    (codigo) => {
      const r = evaluar(
        solicitud(codigo, {
          hechosPrevios: {
            baseGeneralEUR: "20000",
            baseAhorroEUR: "0",
            eventos: [
              {
                hijo: "a",
                fecha: "2025-01-01",
                tipo: codigo.startsWith("madrid")
                  ? "adopcion_internacional"
                  : "nacimiento",
                soporte: "registro",
                normaConvenioAplicable: "convenio",
                progenitoresConvivientesConDerecho: ["a"],
                ordenParaContribuyente: 1,
                soporteOrden: "libro",
              },
            ],
          },
        })
      )
      expect(r.estado).toBe("no_soportado")
      expect(r.siguienteHecho).toBe("evento.hijo")
      expect(r.importe).toBeUndefined()
    }
  )
  it.each(["1e3", "-1", "1.001", "NaN"])("rechaza importe %s", (importeEUR) => {
    const r = evaluar(
      solicitud("madrid_gastos_arrendamiento_viviendas", {
        viviendas: [vivienda()],
        contratos: [contrato()],
        pagos: [{ ...pago("reparacion"), importeEUR }],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it.each(["2025-02-29", "2024-12-31", "2026-01-01"])(
    "rechaza fecha pago %s",
    (fecha) => {
      expect(
        evaluar(
          solicitud("madrid_gastos_arrendamiento_viviendas", {
            viviendas: [vivienda()],
            contratos: [contrato()],
            pagos: [{ ...pago("reparacion"), fecha }],
          })
        ).estado
      ).toBe("no_soportado")
    }
  )
  it("acogimiento183 no da importe;184 sí", () => {
    const p = {
      ...persona(),
      acogimientoTipo: "permanente",
      acogimientoCertificado: "consejeria",
      convivencia: [{ desde: "2025-01-01", hasta: "2025-07-02" }],
    }
    expect(
      evaluar(
        solicitud("madrid_acogimiento_familiar_menores", { personas: [p] })
      ).importe
    ).toBe(0)
    expect(
      evaluar(
        solicitud("madrid_acogimiento_familiar_menores", {
          personas: [
            {
              ...p,
              convivencia: [{ desde: "2025-01-01", hasta: "2025-07-03" }],
            },
          ],
        })
      ).importe
    ).toBe(618.6)
  })
  it("material escolar beca120 elimina cuantía fija120", () =>
    expect(
      evaluar(
        solicitud("murcia_material_escolar_libros_texto", {
          titulo,
          personas: [{ ...persona(), ayudasEscolaresEUR: "120" }],
          pagos: [pago("libros_texto")],
        })
      ).importe
    ).toBe(0))
  it("educación beca total elimina base porcentual", () =>
    expect(
      evaluar(
        solicitud("madrid_gastos_educativos", {
          personas: [persona()],
          pagos: [{ ...pago("escolaridad", "200"), ayudasEUR: "200" }],
        })
      ).importe
    ).toBe(0))
  it("donativo íntegro en base estatal no se deduce dos veces", () =>
    expect(
      evaluar(
        solicitud("murcia_donativos_patrimonio_cultural_actividades", {
          entidades: [entidad("murcia")],
          pagos: [
            {
              ...pago("donativo_dinerario", "1000", "e"),
              computoBaseEstatalEUR: "1000",
            },
          ],
        })
      ).importe
    ).toBe(0))
  it("renta familiarFN conserva fórmula sobre cuota, sin importe", () => {
    const r = evaluar(
      solicitud("madrid_condicion_familia_numerosa", {
        titulo: { ...titulo, categoria: "general", efectos: "2023-01-01" },
      })
    )
    expect(r.dependenciaAnual).toMatchObject({
      magnitud: "cuota_integra_autonomica",
      factor: "0.5",
      topeEUR: "6186",
    })
    expect(r.importe).toBeUndefined()
  })
  it("dos descendientes depende de cuota DESPUÉS de resto", () => {
    const r = evaluar(
      solicitud("madrid_familias_dos_descendientes_ingresos_reducidos", {
        personas: [persona(), { ...persona(), id: "h2" }],
        titularesConMismoMinimo: ["a"],
        basesOtrosTitulares: [
          { id: "a", generalEUR: "20000", ahorroEUR: "0" },
          { id: "h", generalEUR: "0", ahorroEUR: "0" },
          { id: "h2", generalEUR: "0", ahorroEUR: "0" },
        ],
      })
    )
    expect(r.dependenciaAnual).toMatchObject({
      magnitud: "cuota_tras_resto_deducciones",
      factor: "0.1",
    })
    expect(r.importe).toBeUndefined()
  })
  it("base35000 vehículo reservada antes de inspeccionar precio", () => {
    const r = evaluar(
      solicitud("murcia_vehiculos_electricos", {
        bases: [{ id: "a", generalEUR: "34000", ahorroEUR: "1000" }],
      })
    )
    expect(r.reservas.join()).toContain("F-N01")
    expect(r.importe).toBeUndefined()
  })
  it("agua requiere reconocimiento fechado antes de aplicar criterio AEAT", () => {
    const r = evaluar(
      solicitud("murcia_dispositivos_ahorro_agua", {
        viviendas: [
          {
            ...vivienda("murcia"),
            reconocimientoAhorroAgua: "reconocimiento",
            ahorroAguaDispositivo: "art4",
          },
        ],
        pagos: [pago("dispositivo_ahorro_agua", "400")],
      })
    )
    expect(r.siguienteHecho).toBe("fechaReconocimientoAhorroAgua")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("vivienda joven no enmienda comparación patrimonial", () => {
    const r = evaluar(
      solicitud("murcia_vivienda_jovenes_hasta_40", {
        nacimientoContribuyente: "2000-01-01",
        viviendas: [vivienda("murcia")],
        pagos: [pago("adquisicion_vivienda", "6000")],
      })
    )
    expect(r.reservas.join()).toContain("F-N02")
    expect(r.dependenciaAnual?.factor).toBe("0.05")
    expect(r.importe).toBeUndefined()
  })
  it("recarga con ayudas conserva reserva concreta frente a dos incisos AEAT", () => {
    const r = evaluar(
      solicitud("murcia_recarga_vehiculos_electricos", {
        viviendas: [vivienda("murcia")],
        instalaciones: [
          recargaCompleta,
        ],
        pagos: [
          {
            ...pago("infraestructura_recarga", "5000", "inst"),
            ayudasEUR: "1500",
          },
        ],
      })
    )
    expect(r.siguienteHecho).toBe("ayudas.clasificacionPrograma2YConciliacionLegal")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("incremento financiación sin contrato no sustituye el contrafactual por un importe externo", () => {
    const r = evaluar(
      solicitud("madrid_incremento_costes_financiacion_vivienda", {
        viviendas: [
          {
            ...vivienda(),
            adquisicion: "2024-01-01",
            ocupacionDesde: "2024-02-01",
          },
        ],
        prestamos: [{ ...prestamo(), tipo: "hipoteca_variable" }],
        pagos: [pago("intereses_hipoteca", "100", "hip")],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.siguienteHecho).toBe("contratoMadrid: calendario contractual y saldo documentado")
    expect(r.dependenciaAnual).toBeUndefined()
    expect(r.importe).toBeUndefined()
  })
  it("transitorio no infiere acceso desde gasto2025", () => {
    const r = evaluar(
      solicitud("murcia_regimen_transitorio_inversion_vivienda_habitual", {
        viviendas: [vivienda("murcia")],
        pagos: [pago("adquisicion_vivienda")],
        ramaTransitoria: "1998_2000",
        derechoHistoricoReferencia: "expediente",
      })
    )
    expect(r.importe).toBeUndefined()
    expect(r.dependenciaAnual?.operacion).toContain("24200")
  })
  it.each([
    ["34999.99", 50],
    ["35000", 37.5],
    ["44999.99", 37.5],
    ["45000", 25],
    ["59999.99", 25],
  ] as const)("renovables frontera de base %s", (generalEUR, esperado) => {
    const r = evaluar(
      solicitud("murcia_instalaciones_recursos_energeticos_renovables", {
        bases: [{ id: "a", generalEUR, ahorroEUR: "0" }],
        viviendas: [vivienda("murcia")],
        instalaciones: [
          {
            id: "inst",
            viviendaId: "v",
            tecnologia: "solar_fotovoltaica",
            modalidadExcedentes: "sin_excedentes",
            declaracionResponsable: "declaracion",
            instaladorHabilitado: "carnet",
            uso: "habitual",
            inversionesPorTitular: [{ id: "a", importeEUR: "100" }],
          },
        ],
        pagos: [pago("instalacion_renovable", "100", "inst")],
      })
    )
    expect(r.importe).toBe(esperado)
  })
  it.each([
    ["40", 400],
    ["40.01", undefined],
  ] as const)("inversión participación familiar %s", (porcentaje, esperado) => {
    const r = evaluar(
      solicitud("madrid_inversion_entidades_nuevas_reciente_creacion", {
        entidades: [entidad()],
        inversiones: [
          { ...inversion(), porcentajeCapitalFamiliar: porcentaje },
        ],
      })
    )
    expect(r.importe).toBe(esperado)
    if (esperado === undefined) expect(r.estado).toBe("excluida")
  })
  it("incompatibilidad se verifica sobre MISMA operación", () => {
    const r = evaluar(
      solicitud("murcia_inversion_economia_social", {
        entidades: [entidad("murcia")],
        inversiones: [
          { ...inversion(), tipo: "aportacion_socio_economia_social" },
        ],
        elecciones: [{ codigo: "murcia_inversion_mab", objetoId: "i" }],
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("mujer trabajadora182 días:300×182/365=149,59; sin prorratear dos veces", () => {
    const r = evaluar(
      solicitud("murcia_mujeres_trabajadoras", {
        personas: [persona()],
        empleos: [
          {
            ...empleo(),
            periodosTrabajo: [{ desde: "2025-01-01", hasta: "2025-07-01" }],
          },
        ],
        sexo: "mujer",
      })
    )
    expect(r.importe).toBe(149.59)
  })
  it("ampliación exactamente10% no basta", () => {
    const r = evaluar(
      solicitud("murcia_nueva_vivienda_o_ampliacion_familias_numerosas", {
        viviendas: [{ ...vivienda("murcia"), superficieNueva: "110" }],
        titulo: { ...titulo, categoria: "general", efectos: "2024-01-01" },
        tipoAmpliacion: "anexo_unido_fisicamente",
        pagos: [pago("ampliacion_vivienda", "1000")],
      })
    )
    expect(r.estado).toBe("excluida")
    expect(r.importe).toBeUndefined()
  })
  it("uniforme no toma porcentaje15% de escolaridad", () => {
    const r = evaluar(
      solicitud("madrid_gastos_educativos", {
        personas: [persona()],
        pagos: [pago("uniforme", "200")],
      })
    )
    expect(r.importe).toBe(10)
  })
  it("duplicar persona o pago no produce segunda cuantía", () => {
    expect(
      evaluar(
        solicitud("madrid_cuidado_ascendientes", {
          personas: [
            { ...persona(), relacion: "ascendiente", nacimiento: "1950-01-01" },
            { ...persona(), relacion: "ascendiente", nacimiento: "1950-01-01" },
          ],
        })
      ).estado
    ).toBe("no_soportado")
    expect(
      evaluar(
        solicitud("madrid_gastos_arrendamiento_viviendas", {
          viviendas: [vivienda()],
          contratos: [contrato()],
          pagos: [pago("reparacion"), pago("reparacion")],
        })
      ).estado
    ).toBe("no_soportado")
  })
  it("hecho importeExterno no sustituye pagos ni préstamo", () => {
    const r = evaluar(
      solicitud("madrid_intereses_estudios_grado_master_doctorado", {
        importeExterno: "1000",
      })
    )
    expect(r.estado).toBe("no_soportado")
    expect(r.importe).toBeUndefined()
  })
  it("1000 por cinco viviendas, sexta requiere elección", () => {
    const vs = [1, 2, 3, 4, 5].map((i) => ({ ...vivienda(), id: "v" + i }))
    const cc = vs.map((v) => ({
      ...contrato(),
      id: "c" + v.id,
      viviendaId: v.id,
    }))
    expect(
      evaluar(
        solicitud("madrid_arrendamiento_viviendas_vacias", {
          viviendas: vs,
          contratos: cc,
        })
      ).importe
    ).toBe(5000)
    expect(
      evaluar(
        solicitud("madrid_arrendamiento_viviendas_vacias", {
          viviendas: [...vs, { ...vivienda(), id: "v6" }],
          contratos: cc,
        })
      ).estado
    ).toBe("no_soportado")
  })
})
