import type {
  DeclaracionC,
  MagnitudesAnualesC,
  PagoC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/ampliacion-comun"
import type {
  CodigoDonacionC,
  DonacionC,
  SolicitudDonacionesC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/donaciones-ampliacion"
import type {
  CodigoViviendaC,
  ViviendaC,
  SolicitudViviendaC,
  HistoricoViviendasC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/vivienda-ampliacion"
import type {
  CodigoFamiliaEstudiosC,
  PersonaFamiliaC,
  ContribuyenteFamiliaC,
  SolicitudFamiliaEstudiosC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/familia-estudios-ampliacion"
import type {
  InversionEntidadC,
  SolicitudInversionC,
  HistoricoInversionC,
  SolicitudAutoocupacionC,
  SolicitudPlazasC,
  SolicitudEmergenciaC,
  MagnitudesEmergenciaC,
} from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/inversion-trabajo-ampliacion"

export function marcoC(
  territorio: DeclaracionC["territorio"] = "canarias"
): DeclaracionC {
  return {
    ejercicio: 2025,
    territorio,
    contribuyente: "P",
    declarantes: ["P"],
    miembrosUnidadFamiliar: ["P"],
    modalidad: "individual",
    devengo: "2025-12-31",
    causaDevengo: "fin_ejercicio",
    baseGeneral: "20000",
    baseAhorro: "0",
    exhaustividad: "declaracion_completa",
  }
}
export function anualC(h: DeclaracionC): MagnitudesAnualesC {
  return {
    origen: "motor_anual",
    calculoId: "ANUAL1",
    ejercicio: 2025,
    devengo: h.devengo,
    declarantes: h.declarantes,
    cuotaIntegraAutonomica: "10000",
    baseLiquidableGeneral: "20000",
    baseLiquidableAhorro: "0",
    personas: h.declarantes.map((persona, i) => ({
      persona,
      imponibleGeneral: i === 0 ? h.baseGeneral : "0",
      imponibleAhorro: i === 0 ? h.baseAhorro : "0",
      liquidableGeneral: i === 0 ? "20000" : "0",
      liquidableAhorro: "0",
      rendimientosTrabajoActividad: "20000",
    })),
    minimos: [{ beneficiario: "H", tipo: "descendiente", titulares: ["P"] }],
  }
}
export function pagoC(importe = "1000", id = "F1"): PagoC {
  return {
    id,
    fecha: "2025-03-15",
    pagador: "P",
    perceptor: "ENT",
    factura: id,
    importe,
    ayudasExentas: "0",
    reembolsos: "0",
    medio: "transferencia",
    naturaleza: "propio",
    distribucion: [{ persona: "P", porcentaje: "100" }],
  }
}
export function donacionC(): DonacionC {
  return {
    id: "D1",
    donante: "P",
    fechaEntrega: "2025-01-01",
    entidad: {
      nif: "ENT",
      clase: "fundacion49",
      territorio: "canarias",
      registro: "REG1",
      finalidad: "patrimonio",
      fondosPropios: "1000",
      proyecto: "PROY1",
      declaracionProyecto: "DECL1",
      naturaleza: "privada",
      centroUniversitarioOrigen: "UNI1",
      patenteResultado: "PAT1",
    },
    certificado: "CERT1",
    aceptacion: "irrevocable_aceptada",
    bienProtegido: "BIC1",
    modalidad: "dinero",
    destino4bis: "no_aplica",
    pagos: [pagoC()],
    valoracionBien: "1000",
    documentoValoracion: "VAL1",
    comodato: {
      desde: "2025-01-01",
      hasta: "2025-12-31",
      ejerciciosPrevios: [],
      valorFiscal: "100000",
      criterio: "comision_patrimonio",
      documento: "COM1",
    },
    aportacion2023: "100",
    aportacion2024: "100",
    otrasDeduccionesMismoBeneficiario: [],
  }
}
export function solicitudDonacionC(
  codigo: CodigoDonacionC
): SolicitudDonacionesC {
  const can = codigo.startsWith("canarias_")
  const d = donacionC()
  d.entidad.territorio = can ? "canarias" : "illes-balears"
  if (codigo.includes("ecologica"))
    d.entidad.finalidad = "medio_ambiente_exclusivo"
  if (codigo.includes("fines_culturales")) {
    d.entidad.clase = "administracion"
    d.entidad.finalidad = "cultura"
    d.destino4bis = "a"
  }
  if (codigo.includes("investigacion_desarrollo"))
    d.entidad.finalidad = "investigacion"
  if (codigo.includes("lengua")) d.entidad.finalidad = "lengua_catalana"
  if (codigo.includes("mecenazgo"))
    d.entidad.finalidad = codigo.includes("deportivo") ? "deporte" : "cultura"
  return {
    ...marcoC(can ? "canarias" : "illes-balears"),
    codigo,
    donaciones: [d],
    ordenTramoInicial: ["D1"],
  }
}
export function viviendaC(): ViviendaC {
  return {
    id: "V1",
    persona: "P",
    catastro: "RC1",
    territorio: "canarias",
    nacimientoContribuyente: "1990-01-01",
    derecho: "propiedad",
    porcentaje: "100",
    habitualDesde: "2020-01-01",
    adquisicion: "2020-01-01",
    ocupacion: "2020-02-01",
    finObras: "2025-03-01",
    gastos: [{ ...pagoC(), concepto: "reparacion" }],
    titulares: ["P"],
    proteccionPatrimonial: "BIC1",
    autorizacionObras: "EXP1",
    certificadoAntes: { registro: "CEE1", calificacion: "E" },
    certificadoDespues: { registro: "CEE2", calificacion: "D" },
    discapacidad: {
      persona: "P",
      nacimiento: "1960-01-01",
      grado: 65,
      parentesco: "propio",
      rentaNoExenta: "0",
      convivenciaDesde: "2025-01-01",
      convivenciaHasta: "2025-12-31",
      certificadoNecesidad: "DISC1",
    },
    alquiler: {
      arrendador: "P",
      arrendatario: "INQ",
      desde: "2025-01-01",
      hasta: "2028-01-01",
      fianza: "FIAN1",
      rentaMensual: "600",
      superficieUtil: "80",
      rendimiento: "capital_inmobiliario",
      repercusionObras: "0",
      programa: "ordinario",
      parientesGrado: 4,
      islaOrigen: "Mallorca",
      islaDestino: "Menorca",
      relacionLaboralAntes: "CON1",
      relacionLaboralDespues: "CON1",
    },
    historial: {
      alquileres2023: [],
      alquileres2024: [],
      imputacion2024: "todo_ejercicio",
      aplicacionesPrevias: [],
    },
    ocupacionIlegal: { situacion: "ocupacion", resolucion: "JUD1" },
    colectivo: {
      discapacidad: 0,
      resolucion: "",
      familia: "ordinaria",
      titulo: "",
      altaRETA: [],
      actividad: "trabajo",
      minimoDiscapacidad: "",
    },
    otrasViviendas: [],
    dacion: {
      fecha: "2024-01-01",
      escritura: "DAC1",
      acreedor: "ENT",
      deudaExtinguida: "100000",
    },
  }
}
export function solicitudViviendaC(
  codigo: CodigoViviendaC
): SolicitudViviendaC {
  const can = codigo.startsWith("canarias_")
  const v = viviendaC()
  v.territorio = can ? "canarias" : "illes-balears"
  if (codigo.includes("inversion_vivienda"))
    v.gastos[0].concepto = "adquisicion"
  if (codigo.includes("energetica") || codigo.includes("sostenibilidad"))
    v.gastos[0].concepto = "energia"
  if (codigo.includes("adecuacion_vivienda_discapacidad"))
    v.gastos[0].concepto = "accesibilidad"
  if (
    codigo.includes("alquiler_vivienda") ||
    codigo.includes("arrendamiento_dacion") ||
    codigo.includes("arrendamiento_vivienda") ||
    codigo.includes("traslado_laboral")
  ) {
    v.derecho = "arrendatario"
    v.alquiler.arrendatario = "P"
    v.alquiler.arrendador = "ENT"
    v.gastos[0].concepto = "alquiler"
  }
  if (codigo === "canarias_alquiler_vivienda_habitual")
    v.gastos[0].importe = "5000"
  return {
    ...marcoC(can ? "canarias" : "illes-balears"),
    codigo,
    viviendas: [v],
  }
}
export function historicoViviendaC(): HistoricoViviendasC {
  return {
    calculoId: "ANUAL1",
    ejercicio: 2025,
    viviendas: [
      {
        catastro: "RC1",
        persona: "P",
        pagadoHasta2024: "0",
        inversionesAnterioresDeducidas: "0",
        gananciaExentaReinvertida: "0",
        saldoDudosoCobroDeducible2025: "0",
        deduccionesInversionConDerecho: [],
      },
    ],
  }
}
export function familiarC(): PersonaFamiliaC {
  return {
    id: "H",
    nacimiento: "2020-01-01",
    discapacidad: 65,
    naturalezaDiscapacidad: "fisica_sensorial",
    rentaNoExenta: "0",
    minimo: {
      persona: "H",
      titulares: ["P"],
      ejercicio: 2025,
      resolucion: "MIN1",
      relacion: "descendiente",
    },
    progenitores: ["P"],
    titularesAcogimiento: ["P"],
    convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }],
    adopcion: "",
    inscripcionCivil: "",
    progenitorPrevio: "EX",
    expediente: "EXP1",
    acogimiento: "temporal",
    ingresoCentroEspecializado: "",
    gastos: [{ ...pagoC(), concepto: "libro" }],
    diagnosticoELA: "ELA1",
    estudio: {
      nivel: "primaria",
      centro: "CENTRO1",
      inicioCurso: "2025-09-01",
      creditos: 30,
      curso: "completo",
      ofertaPublicaPresencialIsla: [],
      islaResidencia: "Tenerife",
      islaCentro: "Madrid",
      municipioResidencia: "M1",
      municipioCentro: "M2",
      municipioAlojamiento: "M2",
      municipiosLimitrofes: [],
      alojamiento: "AL1",
      estadoCivil: "soltero",
      sostenimiento: "TRANS1",
    },
  }
}
export function contribuyenteC(): ContribuyenteFamiliaC {
  return {
    persona: "P",
    nacimiento: "1990-01-01",
    discapacidad: 0,
    naturalezaDiscapacidad: "fisica_sensorial",
    resolucionDiscapacidad: "",
    familia: "ordinaria",
    tituloFamilia: "",
    residenciaFiscal2024: "illes-balears",
    conyugePareja: "",
    ordenHijos: ["H"],
    diasRETA: [],
    alteracionFamilia: "",
    otrosConvivientes: [],
  }
}
export function solicitudFamiliaC(
  codigo: CodigoFamiliaEstudiosC
): SolicitudFamiliaEstudiosC {
  const can = codigo.startsWith("canarias_")
  const u = familiarC()
  if (codigo.includes("estudios_")) {
    u.nacimiento = "2005-01-01"
    u.estudio.nivel = "universidad"
  }
  if (codigo === "balears_nacimiento") {
    u.nacimiento = "2025-01-01"
  }
  if (codigo === "balears_adopcion") {
    u.adopcion = "2025-03-01"
    u.inscripcionCivil = "2025-03-02"
  }
  if (codigo === "balears_gastos_ela") u.gastos[0].concepto = "tratamiento_ela"
  const cuotas =
    codigo.includes("familiares_dependientes") ||
    codigo.includes("cuotas_seguridad")
      ? [
          {
            empleador: "P",
            empleado: "EMP",
            altaSistema: "SS1",
            viviendaHabitual: "RC1",
            regimen: "separacion" as const,
            conyuge: "",
            necesidadAsistencia: [u.minimo],
            pagos: [pagoC("1000", "SS1")],
          },
        ]
      : []
  return {
    ...marcoC(can ? "canarias" : "illes-balears"),
    codigo,
    personas: [u],
    contribuyentes: [contribuyenteC()],
    cuotasHogar: cuotas,
    ayudasNacimiento: [],
  }
}
export function inversionC(): InversionEntidadC {
  return {
    id: "INV1",
    persona: "P",
    fecha: "2025-01-01",
    modalidad: "constitucion",
    escritura: "ESC1",
    aportacion: "1000",
    entidad: {
      nif: "ENT",
      clase: "sa",
      constitucion: "2025-01-01",
      domicilioSocial: "canarias",
      domicilioFiscal: "canarias",
      actividad: "operativa",
      cifraNegocio: "100000",
      universidadesCentros: [],
      selloInnovador: "",
      registroInnovador: "",
      vigenciaSelloHasta: "2025-12-31",
    },
    participaciones: [
      {
        desde: "2025-01-01",
        hasta: "2025-12-31",
        tenedores: [
          {
            persona: "P",
            relacion: "propio",
            grado: 0,
            capital: "20",
            votos: "20",
          },
        ],
      },
    ],
    cargo: "socio",
    empleados: [
      {
        persona: "EMP",
        domicilioFiscal: "illes-balears",
        jornadaPorcentaje: "100",
        altaGeneral: "SS1",
        socio: "no",
      },
    ],
    plantillaAnterior: "1",
    plantillaActual: "1",
    mantenimientoHasta: "2025-12-31",
  }
}
export function solicitudInversionC(can = true): SolicitudInversionC {
  const o = inversionC()
  o.entidad.domicilioFiscal = can ? "canarias" : "illes-balears"
  o.entidad.domicilioSocial = o.entidad.domicilioFiscal
  return {
    ...marcoC(o.entidad.domicilioFiscal),
    codigo: can
      ? "canarias_inversion_entidades_nuevas_reciente_creacion"
      : "balears_inversion_entidades_nuevas_reciente_creacion",
    inversiones: [o],
  }
}
export function historicoInversionC(): HistoricoInversionC {
  return {
    calculoId: "ANUAL1",
    ejercicio: 2025,
    operaciones: [{ id: "INV1", aplicado2023: "0", aplicado2024: "0" }],
  }
}
export function autoocupacionC(): SolicitudAutoocupacionC {
  return {
    ...marcoC("illes-balears"),
    codigo: "balears_fomento_autoocupacion",
    altas: [
      {
        persona: "P",
        altasCenso: ["2025-01-01"],
        bajasCenso: [],
        domiciliosActividad: [{ territorio: "illes-balears", volumen: "100" }],
        certificadoCenso: "CEN1",
      },
    ],
  }
}
export function plazasC(): SolicitudPlazasC {
  return {
    ...marcoC("illes-balears"),
    codigo: "balears_plazas_dificil_cobertura",
    destinos: [
      {
        persona: "P",
        cuerpo: "policia_nacional",
        nominaComplemento: "",
        isla: "Mallorca",
        desde: "2025-01-01",
        hasta: "2025-12-31",
      },
    ],
    gastos: [{ ...pagoC("5000"), concepto: "alquiler_habitual" }],
  }
}
export function emergenciaC(): SolicitudEmergenciaC {
  return {
    ...marcoC("illes-balears"),
    codigo: "balears_subvenciones_zona_emergencia_proteccion_civil",
    ayudas: [
      {
        id: "AY1",
        persona: "P",
        concedente: "comunidad_illes_balears",
        acuerdoConsejoMinistros: "CM1",
        resolucion: "R1",
        importeRecibido: "1000",
      },
    ],
  }
}
export function magnitudesEmergenciaC(): MagnitudesEmergenciaC {
  return {
    calculoId: "ANUAL1",
    ejercicio: 2025,
    tipoMedioGravamen: { numerador: "20", denominador: "100" },
    ayudasIntegradas: [
      {
        ayudaId: "AY1",
        persona: "P",
        incluidaBaseImponibleGeneral: "1000",
        incluidaBaseLiquidable: "800",
      },
    ],
  }
}
