import type {
  MarcoB,
  Persona,
  Descendiente,
  ResolucionB,
  PagoB,
  Vivienda,
  Empresa,
  OperacionNueva,
  Participacion,
  Trabajo,
  Cualificacion,
  Traslado,
  EntidadDonataria,
} from "../lib/dominio/irpf/deducciones/asturias-cantabria-ampliacion-2025"
export const ast: MarcoB = {
  ejercicio: 2025,
  territorio: "asturias",
  modalidad: "individual",
  contribuyente: "A",
  declarantes: ["A"],
  baseGeneral: "20000",
  baseAhorro: "0",
  exhaustividad: "completa",
}
export const can: MarcoB = { ...ast, territorio: "cantabria" }
export const doc: ResolucionB = {
  referencia: "EXP1",
  organismo: "Autoridad del expediente",
  fecha: "2025-01-01",
}
export const rep = { titulares: ["A"], exhaustividad: "completa" as const }
export function pago(euros: string, id = "P1", pagador = "A"): PagoB {
  return {
    id,
    pagador,
    receptor: "Proveedor",
    fecha: "2025-05-01",
    euros,
    documento: "Factura-" + id,
    medio: "transferencia",
  }
}
export function persona(id = "H", nacimiento = "2015-01-01"): Persona {
  return {
    id,
    nacimiento,
    discapacidad: null,
    rentaNoExenta: "0",
    rentaBrutaIncluidasExentas: "0",
    declaracionRentas: null,
    convivencia: { inicio: "2025-01-01", fin: "2025-12-31" },
    centroEspecializado: null,
    dependenciaEconomica: [],
  }
}
export function hijo(id = "H", nacimiento = "2015-01-01"): Descendiente {
  return {
    ...persona(id, nacimiento),
    ...rep,
    parentesco: "hijo",
    progenitores: ["A", "B"],
    gradoTitular: 1,
    gradosOtrosAscendientes: [],
  }
}
export function vivienda(
  municipio = "33001",
  titulo: Vivienda["titulo"] = "propiedad"
): Vivienda {
  return {
    id: "V1",
    municipio,
    titulo,
    fechaTitulo: "2025-01-01",
    ocupacion: { inicio: "2025-01-01", fin: "2025-12-31" },
    destino: "habitual",
    contrato: doc,
  }
}
export function trabajo(): Trabajo {
  return { clase: "ajena", contrato: doc, grupoCotizacion: 1 }
}
export function cualificacion(): Cualificacion {
  return {
    actividad: "investigacion_basica",
    memoria: doc,
    proyecto: "ProyectoI+D",
    informeSoftware: null,
    costesInvestigacion: [],
    fechaConstitucionEmpresa: "2020-01-01",
    evidenciasEuropeas: [],
    evaluacionExternaRiesgo: null,
    nuevosProductos: [],
    nuevosMercados: [],
    empleosEstablesCreados: 0,
    trabajadoresAgregados: 1,
    facturacionAgregada: "1000",
    balanceAgregado: "1000",
  }
}
export function traslado(territorio = "asturias"): Traslado {
  return {
    id: "A",
    fecha: "2025-01-01",
    origen: {
      inicio: "2021-01-01",
      fin: "2024-12-31",
      territorio: "madrid",
      municipio: "28079",
    },
    destino: vivienda(
      territorio === "asturias" ? "33001" : "39003",
      "alquiler"
    ),
    historia: [
      {
        inicio: "2021-01-01",
        fin: "2024-12-31",
        territorio: "madrid",
        municipio: "28079",
      },
      {
        inicio: "2025-01-01",
        fin: "2025-12-31",
        territorio,
        municipio: territorio === "asturias" ? "33001" : "39003",
      },
    ],
    trabajo: trabajo(),
    cualificacion: null,
    gastos: [{ ...pago("4000"), concepto: "viaje_mudanza", etapa: "otra" }],
  }
}
export function participaciones(): readonly Participacion[] {
  return [
    {
      inicio: "2025-01-01",
      fin: "2025-12-31",
      personas: [
        {
          id: "A",
          vinculo: "titular",
          grado: 0,
          registroPareja: null,
          capital: "10",
          votos: "10",
        },
      ],
    },
  ]
}
export function empresa(territorio = "asturias"): Empresa {
  return {
    id: "E1",
    forma: "SL",
    constitucion: { ...doc, fecha: "2025-01-01" },
    domicilioSocial: territorio,
    domicilioFiscal: territorio,
    agregacionPyme: [
      {
        id: "E1",
        relacion: "propia",
        porcentajeCapital: "100",
        porcentajeVoto: "100",
        trabajadores: "1",
        facturacion: "100000",
        balance: "100000",
      },
    ],
    balances: [
      {
        inicio: "2025-01-01",
        fin: "2025-12-31",
        activos: [
          {
            id: "A1",
            valor: "100000",
            uso: "explotacion",
            exclusion: "ninguna",
          },
        ],
      },
    ],
    empleo: [
      {
        id: "T1",
        alta: "2025-01-01",
        baja: null,
        jornada: "completa",
        regimen: "general",
        municipioResidencia: territorio === "asturias" ? "33001" : "39003",
      },
    ],
    cierrePrimerEjercicio: "2025-12-31",
    plantillas: [{ ejercicio: 2025, mediaEquivalentes: "1", documento: doc }],
    plantilla12MesesPrevios: "0",
    registroEconomiaSocial: doc,
  }
}
export function operacion(territorio = "asturias"): OperacionNueva {
  return {
    id: "O1",
    fecha: "2025-01-01",
    tipo: "constitucion",
    empresa: empresa(territorio),
    pagos: [pago("20000")],
    escritura: doc,
    participaciones: participaciones(),
    funciones: [],
    transmisiones: [],
  }
}
export function donataria(
  clase: EntidadDonataria["clase"] = "fundacion"
): EntidadDonataria {
  return {
    id: "D1",
    clase,
    domicilio: "cantabria",
    registro: doc,
    cuentasProtectorado: doc,
    depositoCuentas: doc,
    fines: ["cultural"],
    utilidadPublica: null,
    ingresos: "1000",
    aplicadoFinesInteresGeneral: "700",
    memoriaEconomica: null,
    certificacionDonacion: doc,
  }
}
