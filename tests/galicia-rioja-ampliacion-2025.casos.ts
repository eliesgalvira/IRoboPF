import type {
  Contexto,
  Documento,
  Pago,
  ClaveAnual,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/comun"
import type { HechosAmpliacionE2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025"
import type {
  Hijo,
  CuidadoHijo,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/familia"
import type {
  Entidad,
  Operacion,
  Vigilancia,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/inversion"
import type {
  Inmueble,
  Obra,
  AlquilerVacio,
} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/vivienda-galicia"
import type { ViviendaRioja } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/vivienda-rioja"
export const doc = (fecha = "2025-01-01", referencia = "D"): Documento => ({
  referencia,
  fecha,
  emisor: "ORG",
})
export const A = { id: "A", nacimiento: "1990-01-01", discapacidad: 0 }
export const H: Hijo = {
  persona: { id: "H", nacimiento: "2023-02-01", discapacidad: 0 },
  titularesMinimo: ["A", "B"],
  convivientes: ["A", "B"],
}
const valores: readonly (readonly [ClaveAnual, string])[] = [
  ["baseImponibleTotal", "20000"],
  ["minimoPersonalFamiliar", "5000"],
  ["baseLiquidableGeneral", "15000"],
  ["baseLiquidableAhorro", "1000"],
  ["cuotaIntegraAutonomica", "1000"],
  ["patrimonioInicialAjustado", "100000"],
  ["patrimonioFinalAjustado", "200000"],
  ["baseEstatalViviendaSinAdecuacion", "0"],
  ["baseConsumidaRehabilitacionAdecuacion", "0"],
  ["baseConsumidaAdquisicionSegunda", "0"],
  ["baseConsumidaViviendaMunicipios", "0"],
  ["cuotaElectricoConsumidaDeclaracion", "0"],
  ["mecenazgoConsumidoDeclaracion", "0"],
]
export function ctx(territorio: Contexto["territorio"] = "galicia"): Contexto {
  return {
    ejercicio: 2025,
    territorio,
    titular: "A",
    modalidad: "individual",
    declarantes: ["A"],
    personas: [A],
    magnitudes: valores.map(([clave, euros]) => ({
      clave,
      euros,
      ejercicio: 2025,
      declarantes: ["A"],
      nodoDerivacion: `anual.${clave}`,
    })),
    expediente: "completo_todos_pagadores",
    creditoMecenazgoRioja: "no_aplicado",
  }
}
export function pago(
  concepto: string,
  importe = "1000",
  id = "P",
  pagador = "A",
  receptor = "R"
): Pago {
  return {
    id,
    pagador,
    receptor,
    fecha: "2025-08-01",
    importe,
    factura: `F${id}`,
    concepto,
    medio: "transferencia",
    subvencion: "0",
    especieExenta: "0",
  }
}
export const cuidado: CuidadoHijo = {
  ...H,
  periodo: { desde: "2025-01-01", hasta: "2025-12-31" },
  centro: {
    territorio: "galicia",
    tipo: "escuela",
    jornadaPorcentaje: 100,
    altaSS: null,
  },
  progenitores: [
    {
      id: "A",
      actividad: { desde: "2024-01-01", hasta: "2027-01-01" },
      altaSS: doc(),
      lugar: "fuera_hogar",
    },
    {
      id: "B",
      actividad: { desde: "2024-01-01", hasta: "2027-01-01" },
      altaSS: doc(),
      lugar: "fuera_hogar",
    },
  ],
  pagos: [pago("asistencia")],
  titularesDeduccion: ["A", "B"],
}
export const seguimiento: Vigilancia = {
  desde: "2024-01-01",
  hasta: "2036-01-01",
  corte: "2025-12-31",
  estado: "observado_sin_incumplimiento",
  soporte: doc(),
}
export const entidad: Entidad = {
  id: "E",
  forma: "SL",
  socios: 2,
  constitucion: "2025-01-01",
  domicilioSocial: "galicia",
  domicilioFiscal: "galicia",
  actividad: "economica",
  seguimiento,
  empleos: [
    {
      id: "TR",
      contrato: { desde: "2025-01-01", hasta: "2030-01-01" },
      jornadaPorcentaje: 100,
      residencia: "galicia",
      altaSS: doc(),
    },
  ],
  plantillaAnterior: "0",
  plantillaPosterior: "1",
  permanenciaPlantilla: seguimiento,
  inicioEjercicioIS: "2025-01-01",
  selloInnovadora: null,
  calificacionIEBT: null,
  participacionUniversidad: null,
  agraria: "agraria_exclusiva",
  registroAgrario: doc(),
}
export const operacion: Operacion = {
  id: "O",
  entidad,
  titular: "A",
  fecha: "2025-01-01",
  modalidad: "capital",
  acuerdo: "constitucion",
  escritura: doc(),
  pagos: [pago("inversion", "1000", "P", "A", "E")],
  importeGarantizado: "0",
  valorNoDinerario: "0",
  tasacion: null,
  patrimonioNeto: "10000",
  participacionFamiliarPorcentaje: 10,
  participacionPropiaPorcentaje: 10,
  fechaVencimiento: "2031-01-01",
  amortizaciones: [],
  mantenimiento: seguimiento,
  funciones: "sin_ejecutivas_sin_laboral",
  funcionesSeguimiento: seguimiento,
  otrasDeduccionesMismaOperacion: [],
}
export const inmueble: Inmueble = {
  id: "I",
  territorio: "galicia",
  titulares: [
    { titular: "A", numerador: 1, denominador: 2 },
    { titular: "B", numerador: 1, denominador: 2 },
  ],
  uso: "habitual",
  residencia: { desde: "2020-01-01", hasta: "2030-01-01" },
  adquisicion: "2020-01-01",
  precioAdquisicion: "100000",
  valorMercadoInicio: "100000",
  valorSuelo: "20000",
  catastralSuelo: "20000",
  catastralConstruccion: "80000",
}
export const obra: Obra = {
  inicio: "2025-01-01",
  fin: "2025-06-01",
  costeGlobal: "60000",
  objeto: "estructuras_fachadas_cubiertas",
  permisos: doc(),
  pagos: [pago("rehabilitacion")],
}
export const alquilerVacio: AlquilerVacio = {
  id: "AV",
  inmueble: { ...inmueble, uso: "arrendamiento" },
  vacioDesde: "2022-01-01",
  vacioHasta: "2025-01-01",
  contrato: "2025-04-01",
  tipoContrato: "LAU_art2",
  arrendatarios: [{ id: "INQ", vinculo: "sin_parentesco" }],
  rentaMensual: "700",
  duracion: { desde: "2025-04-01", hasta: "2028-04-01" },
  contratosSucesivos: [],
  seguimiento: doc(),
  valorReferencia: "100000",
  imposibilidadValorReferencia: null,
  valorMercado: "100000",
}
export const vivienda: ViviendaRioja = {
  inmueble: { ...inmueble, territorio: "la-rioja" },
  municipio: "Ábalos",
  municipioHabitual: "Logroño",
  operacion: "adquisicion",
  fechaInicioInversion: "2020-01-01",
  finConstruccion: "2020-01-01",
  primeraOcupacion: "2020-01-01",
  excepcionOcupacion: null,
  excepcionPermanencia: null,
  ampliacionPlazoConstruccion: null,
  obra: null,
  pagos: [pago("adquisicion")],
  coberturaIntereses: "0",
  inversionAnteriorDeducida: "0",
  gananciaExentaReinversion: "0",
  inversionNuevaAcumuladaAntes2025: "0",
  deduccionPre2013: doc("2012-01-01"),
  ejercicioDeduccionAnterior: 2012,
  excepcion6812: null,
  primerPagoObra: "2012-01-01",
  informeDiscapacidad: doc(),
}
export const viviendaHistorica: ViviendaRioja = {
  ...vivienda,
  inmueble: {
    ...vivienda.inmueble,
    adquisicion: "2010-01-01",
    residencia: { desde: "2016-01-01", hasta: "2030-01-01" },
  },
  fechaInicioInversion: "2012-01-01",
  finConstruccion: "2016-01-01",
  primeraOcupacion: "2016-01-01",
  operacion: "rehabilitacion",
  obra: { ...obra, inicio: "2012-01-01", fin: "2016-01-01" },
}
export const contratoAlquiler = {
  id: "C",
  fecha: "2020-01-01",
  territorio: "galicia",
  municipio: "Ábalos",
  arrendador: "R",
  titularesContrato: ["A", "B"],
  titularesDerecho: ["A", "B"],
  uso: "habitual",
  ocupacion: { desde: "2020-01-01", hasta: "2030-01-01" },
  fianzaIGVS: doc(),
  denunciaFianza: null,
  modeloITP: doc(),
  regimen: "privativo",
  conyuges: [],
  pagos: [pago("alquiler")],
} as const
export const suministro = {
  vivienda: "I",
  municipio: "Ábalos",
  tenencia: "propiedad",
  residencia: { desde: "2020-01-01", hasta: "2030-01-01" },
  excepcionResidencia: null,
  adquisicionOContrato: "2020-01-01",
  monoparental: "no",
  titularesDerecho: ["A", "B"],
  ocupantes: [
    { id: "A", actividadEnVivienda: "no" },
    { id: "B", actividadEnVivienda: "no" },
  ],
  usosPrevios: [],
  contratos: [
    {
      id: "C",
      titulares: ["A", "B"],
      alta: "2025-01-01",
      baja: null,
      servicio: "internet",
      pagos: [pago("suministro")],
    },
  ],
} as const
export const ayudaComun = {
  id: "AY",
  beneficiario: "A",
  pagador: "administracion_gallega",
  resolucion: doc(),
  fechaCobro: "2025-08-30",
  ejercicioImputacion: 2025,
  concedido: "1000",
  partes: [
    {
      id: "PARTE",
      clasificacion: "integrada",
      importe: "1000",
      baseLiquidableAtribuida: "800",
      nodoImputacionAnual: "anual.ganancia.subvencion.BLG",
      declaracionIntegracion: doc(),
    },
  ],
  deportistaAltoNivel: doc(),
  actividadDeportiva: "sin_rendimiento_economico",
  diagnostico: doc(),
} as const
export const tiposMedios = [
  {
    ambito: "estatal",
    numeradorPorcentaje: "12",
    denominador: "1",
    ejercicio: 2025,
    declarantes: ["A"],
    nodoDerivacion: "anual.tipoMedio.estatal",
  },
  {
    ambito: "autonomico",
    numeradorPorcentaje: "8",
    denominador: "1",
    ejercicio: 2025,
    declarantes: ["A"],
    nodoDerivacion: "anual.tipoMedio.autonomico",
  },
] as const
export type Caso = {
  readonly hechos: HechosAmpliacionE2025
  readonly contexto: Contexto
  readonly esperado: string
  readonly fuente: string
}
// Esperados calculados a mano desde las citas; no consultan parámetros del catálogo.
export const casos: readonly Caso[] = [
  {
    hechos: {
      codigo: "galicia_nacimiento_adopcion_hijos",
      eventos: [
        {
          id: "N",
          fecha: "2025-02-01",
          tipo: "nacimiento",
          hijos: [
            {
              ...H,
              persona: { ...H.persona, nacimiento: "2025-02-01" },
              ordenPorProgenitor: [
                { titular: "A", orden: 2 },
                { titular: "B", orden: 1 },
              ],
            },
          ],
          progenitores: ["A", "B"],
          soporte: doc(),
        },
      ],
      municipioGallego: { habitantes: 6000, fusionIncorporacion: null },
    },
    contexto: ctx(),
    esperado: "600.00",
    fuente: "art5.Dos.1b:1200/2",
  },
  {
    hechos: {
      codigo: "rioja_nacimiento_adopcion_hijos",
      eventos: [
        {
          id: "N",
          fecha: "2025-02-01",
          tipo: "nacimiento",
          hijos: [
            {
              ...H,
              persona: { ...H.persona, nacimiento: "2025-02-01" },
              ordenPorProgenitor: [
                { titular: "A", orden: 2 },
                { titular: "B", orden: 1 },
              ],
            },
          ],
          progenitores: ["A", "B"],
          soporte: doc(),
        },
      ],
      municipioGallego: { habitantes: 6000, fusionIncorporacion: null },
    },
    contexto: ctx("la-rioja"),
    esperado: "375.00",
    fuente: "art32.1:750/2",
  },
  {
    hechos: {
      codigo: "galicia_familia_numerosa",
      titulo: doc(),
      vigencia: { desde: "2024-01-01", hasta: "2030-01-01" },
      categoria: "general",
      hijos: [
        H,
        { ...H, persona: { ...H.persona, id: "H2" } },
        { ...H, persona: { ...H.persona, id: "H3" } },
      ],
      titulares: ["A", "B"],
      eleccion: "numerosa",
    },
    contexto: ctx(),
    esperado: "250.00",
    fuente: "5.Tres.2: (250+250)/2",
  },
  {
    hechos: {
      codigo: "galicia_cuidado_hijos_menores",
      hijos: [cuidado],
      municipio: "Ábalos",
      trasladoResidencia: "2025-01-01",
      residencia: { desde: "2025-01-01", hasta: "2030-01-01" },
    },
    contexto: ctx(),
    esperado: "150.00",
    fuente: "5.Cinco:1000*30%/2",
  },
  {
    hechos: {
      codigo: "rioja_escuelas_infantiles_pequenos_municipios",
      hijos: [
        { ...cuidado, centro: { ...cuidado.centro, territorio: "la-rioja" } },
      ],
      municipio: "Ábalos",
      trasladoResidencia: "2025-01-01",
      residencia: { desde: "2025-01-01", hasta: "2030-01-01" },
    },
    contexto: ctx("la-rioja"),
    esperado: "150.00",
    fuente: "32.3:1000*30%/2",
  },
  {
    hechos: {
      codigo: "rioja_hijo_0_3_escolarizado",
      hijos: [
        { ...cuidado, centro: { ...cuidado.centro, territorio: "la-rioja" } },
      ],
      municipio: "Ábalos",
      trasladoResidencia: "2025-01-01",
      residencia: { desde: "2025-01-01", hasta: "2030-01-01" },
    },
    contexto: ctx("la-rioja"),
    esperado: "100.00",
    fuente: "32.6:1000*20%/2",
  },
  {
    hechos: {
      codigo: "rioja_hijo_0_3_pequenos_municipios",
      hijos: [H],
      meses: Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1,
        municipio: "Ábalos",
        titularesPorHijo: [{ hijo: "H", titulares: ["A", "B"] }],
      })),
      inicioResidencia: "2024-01-01",
      residencia: { desde: "2024-01-01", hasta: "2030-01-01" },
      excepcionPermanencia: null,
    },
    contexto: ctx("la-rioja"),
    esperado: "600.00",
    fuente: "32.5:12*100/2",
  },
  {
    hechos: {
      codigo: "rioja_menor_acogimiento_guarda_adopcion",
      menores: [
        {
          hijo: H,
          resolucion: doc(),
          regimen: "temporal",
          convivencia: [{ desde: "2025-01-01", hasta: "2025-07-02" }],
          adopcion: null,
        },
      ],
    },
    contexto: ctx("la-rioja"),
    esperado: "150.00",
    fuente: "32.4:183días,300/2",
  },
  {
    hechos: {
      codigo: "rioja_fijacion_poblacion_ocupada_medio_rural",
      alta: doc("2024-01-01"),
      tipo: "agraria_propia",
      cesesPrevios: [],
      residenciaRioja: { desde: "2024-01-01", hasta: "2030-01-01" },
      actividad: { desde: "2024-01-01", hasta: "2030-01-01" },
      historia: "completa",
    },
    contexto: ctx("la-rioja"),
    esperado: "1000.00",
    fuente: "32.8:1000 por titular,segundo año",
  },
  {
    hechos: {
      codigo: "galicia_alquiler_vivienda_habitual",
      contratos: [contratoAlquiler],
      hijosMenores: [
        { id: "H", nacimiento: "2023-01-01" },
        { id: "H2", nacimiento: "2023-01-01" },
      ],
      derechoInversionVivienda: "sin_derecho",
    },
    contexto: ctx(),
    esperado: "100.00",
    fuente: "5.Siete:1000*20%/2",
  },
  {
    hechos: {
      codigo: "rioja_arrendamiento_menores_36",
      contratos: [{ ...contratoAlquiler, territorio: "la-rioja" }],
      hijosMenores: [],
      derechoInversionVivienda: "sin_derecho",
    },
    contexto: ctx("la-rioja"),
    esperado: "100.00",
    fuente: "32.12:1000*20%/2",
  },
  {
    hechos: { ...suministro, codigo: "rioja_internet_jovenes_emancipados" },
    contexto: ctx("la-rioja"),
    esperado: "200.00",
    fuente: "32.9:1000*40%/2",
  },
  {
    hechos: {
      ...suministro,
      codigo: "rioja_luz_gas_jovenes_emancipados",
      contratos: [{ ...suministro.contratos[0], servicio: "luz" }],
    },
    contexto: ctx("la-rioja"),
    esperado: "100.00",
    fuente: "32.10:1000*20%/2",
  },
  {
    hechos: {
      codigo: "galicia_inversion_entidades_nuevas_reciente_creacion",
      operaciones: [operacion],
    },
    contexto: ctx(),
    esperado: "300.00",
    fuente: "5.Nueve:1000*30%",
  },
  {
    hechos: {
      codigo: "galicia_inversion_entidades_nuevas_financiacion",
      operaciones: [operacion],
    },
    contexto: ctx(),
    esperado: "300.00",
    fuente: "5.Diez:1000*30%",
  },
  {
    hechos: {
      codigo: "galicia_inversion_empresas_agrarias",
      operaciones: [operacion],
    },
    contexto: ctx(),
    esperado: "200.00",
    fuente: "5.Quince:1000*20%",
  },
  {
    hechos: {
      codigo: "galicia_inversion_mab",
      operaciones: [
        {
          id: "M",
          titular: "A",
          fecha: "2025-01-01",
          importe: "1000",
          escritura: doc(),
          mercado: "segmento_expansion_MAB",
          participacionPorcentaje: 5,
          entidad,
          mantenimiento: seguimiento,
          otrasDeduccionesMismaInversion: [],
        },
      ],
    },
    contexto: ctx(),
    esperado: "37.50",
    fuente: "5.Once:1000*15%/4",
  },
  {
    hechos: {
      codigo: "galicia_climatizacion_agua_caliente_renovables",
      inmuebles: [
        {
          inmueble,
          renovable: "solar",
          obra: "unifamiliar",
          instalador: "R",
          registroOVI: doc(),
          documentacionOVI: doc("2026-01-01"),
          certificadoComunero: null,
          pagos: [pago("generacion")],
        },
      ],
      plazoAutoliquidacion: "2026-06-30",
      eleccion: "renovables",
    },
    contexto: ctx(),
    esperado: "25.00",
    fuente: "5.Trece:1000/2*5%,máximo personal280",
  },
  {
    hechos: {
      codigo: "galicia_rehabilitacion_centros_historicos",
      inmuebles: [
        {
          inmueble,
          obra,
          centro: "Allariz",
          municipio: "Allariz",
          instrumento: "Plan especial del casco histórico",
          aprobacion: "9.5.1995",
          certificadoPerimetro: doc(),
        },
      ],
    },
    contexto: ctx(),
    esperado: "75.00",
    fuente: "5.Catorce:1000/2*15%",
  },
  {
    hechos: {
      codigo: "galicia_obras_eficiencia_energetica",
      eleccion: "eficiencia",
      plazoAutoliquidacion: "2026-06-30",
      viviendas: [
        {
          inmueble,
          obra: { ...obra, pagos: [pago("mejora_energetica")] },
          letraCO2Antes: 7,
          letraCO2Despues: 6,
          letraConsumoAntes: 7,
          letraConsumoDespues: 6,
          registro: doc("2025-07-01"),
          informeTecnico: doc("2025-07-01"),
          presentacionDocumentacion: doc("2026-01-01"),
          pagosCertificado: [pago("certificado", "100", "CERT")],
        },
      ],
    },
    contexto: ctx(),
    esperado: "125.00",
    fuente: "5.Dieciocho:500*15%+100/2",
  },
  {
    hechos: {
      codigo: "galicia_aldeas_modelo",
      viviendas: [
        {
          inmueble,
          declaracion: doc(),
          certificadoPerimetro: doc(),
          operacion: "adquisicion",
          obra: null,
          pagos: [pago("adquisicion")],
          coberturaIntereses: "0",
          otrasDeduccionesMismaInversion: [],
        },
      ],
    },
    contexto: ctx(),
    esperado: "75.00",
    fuente: "5.Veinte:1000/2*15%",
  },
  {
    hechos: {
      codigo: "galicia_arrendamiento_viviendas_vacias",
      viviendas: [{ ...alquilerVacio, vacioHasta: "2025-04-01" }],
      inventarioArrendables: ["I"],
      historiaPrimerArriendo: [{ inmueble: "I", primerContrato: "2025-04-01" }],
    },
    contexto: ctx(),
    esperado: "250.00",
    fuente: "5.Veintitrés:500*1/2,renta700",
  },
  {
    hechos: {
      codigo: "galicia_adecuacion_inmueble_vacio_arrendamiento",
      viviendas: [
        {
          alquiler: alquilerVacio,
          obra: {
            ...obra,
            inicio: "2024-01-01",
            fin: "2025-01-01",
            pagos: [pago("reparacion")],
          },
          baseConsumidaAnterior: "0",
          basePendienteAnterior: [],
        },
      ],
      inventarioArrendables: ["I"],
      ordenBase: ["AV"],
    },
    contexto: ctx(),
    esperado: "75.00",
    fuente: "5.Veintidós:1000/2*15%",
  },
  {
    hechos: {
      codigo: "rioja_vivienda_habitual_pequenos_municipios",
      viviendas: [vivienda],
      otrasModalidadesElegidas: [],
    },
    contexto: ctx("la-rioja"),
    esperado: "25.00",
    fuente: "32.2:500*5%",
  },
  {
    hechos: {
      codigo: "rioja_inversion_vivienda_jovenes_menores_36",
      viviendas: [vivienda],
      otrasModalidadesElegidas: [],
    },
    contexto: ctx("la-rioja"),
    esperado: "75.00",
    fuente: "32.11:500*15%",
  },
  {
    hechos: {
      codigo: "rioja_obras_rehabilitacion_vivienda_habitual",
      viviendas: [viviendaHistorica],
      otrasModalidadesElegidas: [],
    },
    contexto: ctx("la-rioja"),
    esperado: "35.00",
    fuente: "DT1a:500*7%",
  },
  {
    hechos: {
      codigo: "rioja_adquisicion_construccion_vivienda_jovenes",
      viviendas: [
        {
          ...vivienda,
          operacion: "adquisicion",
          inmueble: {
            ...vivienda.inmueble,
            adquisicion: "2012-01-01",
            residencia: { desde: "2012-01-01", hasta: "2030-01-01" },
          },
          fechaInicioInversion: "2012-01-01",
          finConstruccion: "2012-01-01",
          primeraOcupacion: "2012-01-01",
        },
      ],
      otrasModalidadesElegidas: [],
    },
    contexto: ctx("la-rioja"),
    esperado: "25.00",
    fuente: "DT1b:500*5%",
  },
  {
    hechos: {
      codigo: "rioja_segunda_vivienda_medio_rural",
      viviendas: [
        {
          ...viviendaHistorica,
          operacion: "adquisicion",
          inmueble: { ...viviendaHistorica.inmueble, uso: "esporadico" },
        },
      ],
      otrasModalidadesElegidas: [],
    },
    contexto: ctx("la-rioja"),
    esperado: "40.00",
    fuente: "DT1c:500*8%",
  },
  {
    hechos: {
      codigo: "rioja_adecuacion_vivienda_discapacidad",
      viviendas: [{ ...viviendaHistorica, operacion: "adecuacion" }],
      otrasModalidadesElegidas: [],
    },
    contexto: { ...ctx("la-rioja"), personas: [{ ...A, discapacidad: 33 }] },
    esperado: "75.00",
    fuente: "DT1d:500*15%",
  },
  {
    hechos: {
      codigo: "rioja_paliar_subida_intereses_hipotecarios",
      viviendas: [
        {
          inmueble: vivienda.inmueble,
          prestamos: [
            {
              id: "L",
              destino: "financiacion_habitual",
              pagos: [pago("intereses")],
              cobertura: "0",
            },
          ],
          diasResidenciaHabitual: [
            { desde: "2025-01-01", hasta: "2025-12-31" },
          ],
          diasOtraVivienda: [],
          titularesDerecho: ["A", "B"],
        },
      ],
      deduccionesElegidas: [],
    },
    contexto: ctx("la-rioja"),
    esperado: "75.00",
    fuente: "DAsegunda:1000*15%/2",
  },
  {
    hechos: {
      codigo: "galicia_ayudas_incendios_peifoga_2025",
      ayudas: [{ ...ayudaComun, concepto: "decreto76_2025" }],
      tiposMedios,
    },
    contexto: ctx(),
    esperado: "160.00",
    fuente: "5.Dieciséis:800*(12+8)%",
  },
  {
    hechos: {
      codigo: "galicia_ayudas_deportistas_alto_nivel",
      ayudas: [{ ...ayudaComun, concepto: "actividad_deportiva" }],
      tiposMedios,
    },
    contexto: ctx(),
    esperado: "160.00",
    fuente: "5.Diecinueve:800*(12+8)%",
  },
  {
    hechos: {
      codigo: "galicia_ayudas_ela_fenotipos",
      ayudas: [{ ...ayudaComun, concepto: "ELA_fenotipo" }],
      tiposMedios,
    },
    contexto: ctx(),
    esperado: "160.00",
    fuente: "5.Veinticuatro:800*(12+8)%",
  },
  {
    hechos: {
      codigo: "galicia_ayudas_talidomida",
      ayudas: [{ ...ayudaComun, concepto: "talidomida1950_1985" }],
      tiposMedios,
    },
    contexto: ctx(),
    esperado: "160.00",
    fuente: "5.Veintiséis:800*(12+8)%",
  },
  {
    hechos: {
      codigo: "galicia_libros_texto_material_escolar",
      miembros2024: [
        { persona: A, renta2024: "60000", pensionIncapacidad: "ninguna" },
        { persona: H.persona, renta2024: "0", pensionIncapacidad: "ninguna" },
      ],
      descendientes: [
        {
          persona: { ...H.persona, nacimiento: "2015-01-01" },
          progenitores: ["A", "B"],
          titularesMinimo: ["A", "B"],
          titularesDeduccion: ["A", "B"],
          nivel: "primaria",
          centro: "fondos_publicos",
          curso: "2025/26",
          ayudasCurso: [],
          compras: [
            {
              pago: pago("compra"),
              facturaFecha: "2025-08-01",
              categoria: "texto",
            },
          ],
        },
      ],
    },
    contexto: ctx(),
    esperado: "52.50",
    fuente: "5.Veinticinco:min(1000*15%,105)/2",
  },
  {
    hechos: {
      codigo: "rioja_vehiculos_electricos_nuevos",
      elegido: "V",
      vehiculos: [
        {
          id: "V",
          propietario: "A",
          matriculacion: "2025-01-01",
          primeraMatriculacion: "nuevo",
          afectacion: "privado",
          categoria: "M1",
          motor: "BEV",
          homologacion: doc(),
          precio: "1000",
          saldoPendientePrecio: "0",
          contratoFinanciacion: null,
          bateria: "litio",
          potenciaKWh: 40,
          autonomiaKm: 300,
          normaUNE15194: null,
          proporcion: [1, 1],
          pagos: [pago("vehiculo")],
        },
      ],
    },
    contexto: ctx("la-rioja"),
    esperado: "0.00",
    fuente: "DA3 Ley10/2017: M1 suspendido durante vigencia DA58 estatal en2025",
  },
  {
    hechos: {
      codigo: "rioja_donaciones_fomento_mecenazgo",
      bloque: "a_b",
      donaciones: [
        {
          id: "D",
          fecha: "2025-01-01",
          donante: "A",
          beneficiario: {
            id: "ORG",
            clase: "sector_publico_rioja",
            domicilioFiscal: "la-rioja",
            actividadRioja: "si",
            registro: doc(),
            autorizacionHacienda: null,
            vinculoDonante: "ninguno",
          },
          modalidad: "a",
          valor: { tipo: "dinero", euros: "1000" },
          certificado: doc(),
          comunicacion: doc("2026-01-31"),
          viaInformacion: "autonomica_enero",
          estrategiaRegional: doc(),
          bienRioja: "no",
          titularidadBien: "otra",
          empresa: null,
          autorHeredero: null,
          aceptacionConsejeria: null,
        },
      ],
    },
    contexto: ctx("la-rioja"),
    esperado: "150.00",
    fuente: "32.14a:1000*15%,límite500 y30%cuota",
  },
  {
    hechos: {
      codigo: "rioja_cantidades_patrimonio_historico",
      bienes: [
        {
          id: "BIEN",
          titular: "A",
          derecho: "propiedad",
          registro: doc(),
          uso: "particular",
          pagos: [pago("conservacion")],
        },
      ],
    },
    contexto: ctx("la-rioja"),
    esperado: "150.00",
    fuente: "32.15:1000*15%,máximo500",
  },
]
