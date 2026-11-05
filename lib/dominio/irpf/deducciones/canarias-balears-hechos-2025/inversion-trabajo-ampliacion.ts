import { fecha, texto, unico } from "./comun"
import type {
  DeclaracionC,
  MagnitudesAnualesC,
  PagoC,
  ResultadoAmpliacionC,
} from "./ampliacion-comun"
import {
  eurosAnualesC,
  noNegativoAnualC,
  accesoC,
  anualesC,
  aniversarioC,
  ceroC,
  comprobar,
  diasC,
  enteroC,
  eurosC,
  evaluarC,
  gastosC,
  noNegativoC,
  ordinalC,
  periodoC,
  personaC,
  rentaC,
  resultadoC,
} from "./ampliacion-comun"

export type InversionEntidadC = {
  id: string
  persona: string
  fecha: string
  modalidad: "constitucion" | "ampliacion"
  escritura: string
  aportacion: string
  entidad: {
    nif: string
    clase: "sa" | "sl" | "sal" | "sll" | "cooperativa"
    constitucion: string
    domicilioSocial: "canarias" | "illes-balears"
    domicilioFiscal: "canarias" | "illes-balears"
    actividad: "operativa" | "patrimonial" | "arrendamiento"
    cifraNegocio: string
    universidadesCentros: readonly string[]
    selloInnovador: string
    registroInnovador: string
    vigenciaSelloHasta: string
  }
  participaciones: readonly {
    desde: string
    hasta: string
    tenedores: readonly {
      persona: string
      relacion: "propio" | "conyuge" | "pariente"
      grado: number
      capital: string
      votos: string
    }[]
  }[]
  cargo: "socio" | "consejero_sin_direccion" | "ejecutivo" | "empleado"
  empleados: readonly {
    persona: string
    domicilioFiscal: "canarias" | "illes-balears"
    jornadaPorcentaje: string
    altaGeneral: string
    socio: "si" | "no"
  }[]
  plantillaAnterior: string
  plantillaActual: string
  mantenimientoHasta: string
}
/** Histórico interno por inversión: cantidades efectivamente aplicadas por el
 * motor en ejercicios anteriores; nunca una deducción consignada por usuario. */
export type HistoricoInversionC = {
  calculoId: string
  ejercicio: 2025
  operaciones: readonly {
    id: string
    aplicado2023: string
    aplicado2024: string
  }[]
}
export type SolicitudInversionC = DeclaracionC & {
  codigo:
    | "canarias_inversion_entidades_nuevas_reciente_creacion"
    | "balears_inversion_entidades_nuevas_reciente_creacion"
  inversiones: readonly InversionEntidadC[]
}
export function evaluarInversionAmpliacionC(
  h: SolicitudInversionC,
  m: MagnitudesAnualesC,
  historico: HistoricoInversionC
): ResultadoAmpliacionC {
  const can =
    h.codigo === "canarias_inversion_entidades_nuevas_reciente_creacion"
  return evaluarC(h, can ? "canarias" : "illes-balears", () => {
    anualesC(h, m)
    comprobar(
      historico.calculoId === m.calculoId && historico.ejercicio === 2025,
      "Histórico inversor ajeno al anual"
    )
    unico(historico.operaciones.map((o) => o.id))
    unico(h.inversiones.map((o) => o.id))
    let total = ceroC()
    const traza = [h.codigo, `Magnitudes anuales ${m.calculoId}`]
    for (const persona of h.declarantes) {
      const ops = h.inversiones.filter((o) => o.persona === persona)
      let base = ceroC()
      let especial = false
      for (const o of ops) {
        personaC(h, o.persona)
        texto(o.escritura)
        texto(o.entidad.nif)
        fecha(o.fecha)
        fecha(o.entidad.constitucion)
        fecha(o.mantenimientoHasta)
        comprobar(
          o.fecha <= h.devengo &&
            o.entidad.constitucion <= o.fecha &&
            o.fecha >= (can ? "2025-01-01" : "2023-01-01"),
          "Inversión fuera del ejercicio o de sus dos siguientes"
        )
        comprobar(
          o.entidad.domicilioSocial === (can ? "canarias" : "illes-balears") &&
            o.entidad.domicilioFiscal ===
              (can ? "canarias" : "illes-balears") &&
            o.entidad.actividad === "operativa",
          "Domicilio o actividad excluidos"
        )
        comprobar(
          ["sa", "sl", "sal", "sll", "cooperativa"].includes(o.entidad.clase) &&
            ["socio", "consejero_sin_direccion"].includes(o.cargo),
          "Forma societaria o cargo excluido"
        )
        comprobar(
          o.mantenimientoHasta >= h.devengo,
          "Permanencia interrumpida: requiere regularización"
        )
        const laboral = ["sal", "sll", "cooperativa"].includes(o.entidad.clase)
        const e = o.entidad.universidadesCentros.length > 0 || (can && laboral)
        if (ops[0] === o) especial = e
        comprobar(
          especial === e,
          "Inversiones generales y especiales mezcladas: composición de límites pendiente"
        )
        const dias = diasC(
          h,
          o.participaciones.map((p) => ({ desde: p.desde, hasta: p.hasta }))
        )
        comprobar(
          dias === ordinalC(h.devengo),
          "Participación no cubre todo el período fiscal"
        )
        for (const p of o.participaciones) {
          unico(p.tenedores.map((t) => t.persona))
          let capital = ceroC(),
            votos = ceroC()
          comprobar(
            p.tenedores.some(
              (t) => t.persona === persona && t.relacion === "propio"
            ),
            "Falta la participación del inversor identificado"
          )
          for (const t of p.tenedores) {
            comprobar(
              t.relacion === "propio"
                ? t.persona === persona
                : t.persona !== persona,
              "Identidad del grupo familiar incoherente"
            )
            comprobar(
              Number.isInteger(t.grado) && t.grado >= 0 && t.grado <= 3,
              "Parentesco fuera del grupo hasta tercer grado"
            )
            capital = capital.sumar(noNegativoC(t.capital))
            votos = votos.sumar(noNegativoC(t.votos))
          }
          comprobar(
            capital.comparar(enteroC(40)) <= 0n &&
              votos.comparar(enteroC(40)) <= 0n,
            "Participación o votos superiores40%"
          )
        }
        if (!(can && laboral)) {
          unico(o.empleados.map((e) => e.persona))
          comprobar(
            o.empleados.some((e) => {
              texto(e.altaGeneral)
              return (
                noNegativoC(e.jornadaPorcentaje).comparar(enteroC(100)) ===
                  0n &&
                e.persona !== persona &&
                (can ||
                  (e.domicilioFiscal === "illes-balears" && e.socio === "no"))
              )
            }),
            "Falta empleado a jornada completa habilitante"
          )
        }
        if (!can) {
          comprobar(
            noNegativoC(o.entidad.cifraNegocio).comparar(enteroC(2000000)) <=
              0n,
            "Cifra de negocios superior2millones"
          )
          comprobar(
            noNegativoC(o.plantillaActual).comparar(
              noNegativoC(o.plantillaAnterior)
            ) >= 0n,
            "Plantilla media no mantenida"
          )
        }
        if (o.modalidad === "ampliacion") {
          const plazo = can ? 3 : 2
          const joven = o.fecha <= aniversarioC(o.entidad.constitucion, plazo)
          if (!joven && !can) {
            texto(o.entidad.selloInnovador)
            texto(o.entidad.registroInnovador)
            fecha(o.entidad.vigenciaSelloHasta)
            comprobar(
              o.entidad.vigenciaSelloHasta >= o.fecha,
              "Sello innovador no vigente"
            )
          } else
            comprobar(
              joven,
              "Entidad constituida fuera del plazo de ampliación"
            )
          if (can) {
            noNegativoC(o.plantillaActual)
            noNegativoC(o.plantillaAnterior)
            traza.push(
              "Ampliación canaria: incremento de al menos un empleo en los dos ejercicios posteriores y mantenimiento24meses pendientes de control en su plazo"
            )
          }
        } else
          comprobar(
            o.modalidad === "constitucion",
            "Operación no constitutiva ni ampliación"
          )
        const porcentaje = can ? (e ? "0.30" : "0.20") : e ? "0.50" : "0.30"
        const calculada = noNegativoC(o.aportacion).por(eurosC(porcentaje))
        if (can) base = base.sumar(calculada)
        else {
          const hist = historico.operaciones.find((x) => x.id === o.id)
          comprobar(hist !== undefined, "Falta histórico anual de la inversión")
          const aplicado = noNegativoC(hist.aplicado2023).sumar(
            noNegativoC(hist.aplicado2024)
          )
          comprobar(
            aplicado.comparar(calculada) <= 0n,
            "Histórico aplicado supera derecho original"
          )
          base = base.sumar(calculada.restar(aplicado))
        }
        traza.push(
          `Inversión ${o.id}: permanencia y condiciones hasta ${aniversarioC(o.fecha, can ? 3 : 4)}; sin certificación futura`
        )
      }
      const tope = can ? (especial ? 6000 : 4000) : especial ? 12000 : 6000
      total = total.sumar(base.minimo(enteroC(tope)))
    }
    h.inversiones.forEach((o) => personaC(h, o.persona))
    return resultadoC(total, traza, [
      "Permanencia, grupo familiar y actividad/plantilla posteriores al devengo son obligaciones futuras, no hechos certificados",
      "Ampliación canaria: incremento en dos ejercicios posteriores y mantenimiento24meses se comprobarán en sus ejercicios; cálculo provisional condicionado",
      "Las aportaciones, escritura, universidades participantes y sello/registro innovador requieren cotejo material",
    ])
  })
}

export type AltaAutonomoC = {
  persona: string
  altasCenso: readonly string[]
  bajasCenso: readonly string[]
  domiciliosActividad: readonly { territorio: string; volumen: string }[]
  certificadoCenso: string
}
export type SolicitudAutoocupacionC = DeclaracionC & {
  codigo: "balears_fomento_autoocupacion"
  altas: readonly AltaAutonomoC[]
}
export function evaluarAutoocupacionAmpliacionC(
  h: SolicitudAutoocupacionC,
  m: MagnitudesAnualesC
): ResultadoAmpliacionC {
  return evaluarC(h, "illes-balears", () => {
    comprobar(
      h.codigo === "balears_fomento_autoocupacion",
      "Código de autoocupación incorrecto"
    )
    anualesC(h, m)
    accesoC(h, 33000, 52800)
    unico(h.altas.map((a) => a.persona))
    let total = ceroC()
    for (const a of h.altas) {
      personaC(h, a.persona)
      texto(a.certificadoCenso)
      unico(a.altasCenso)
      comprobar(
        a.altasCenso.length === 1,
        "No es primera alta censal o historial no unitario"
      )
      periodoC(h, a.altasCenso[0])
      a.bajasCenso.forEach(fecha)
      comprobar(
        a.bajasCenso.every((f) => f >= aniversarioC(a.altasCenso[0], 1)),
        "Baja censal antes de un año"
      )
      const volumen = a.domiciliosActividad.reduce(
        (s, d) => s.sumar(noNegativoC(d.volumen)),
        ceroC()
      )
      const bal = a.domiciliosActividad
        .filter((d) => d.territorio === "illes-balears")
        .reduce((s, d) => s.sumar(noNegativoC(d.volumen)), ceroC())
      comprobar(
        volumen.n > 0n && bal.por(enteroC(2)).comparar(volumen) > 0n,
        "Actividad no principalmente balear"
      )
      total = total.sumar(enteroC(1000))
    }
    return resultadoC(
      total,
      [
        "Art7bis:1000 por contribuyente; primera alta en2025; actividad principalmente balear",
      ],
      [
        "Permanencia censal de un año pendiente hasta aniversario; volumen territorial y censo sujetos a cotejo; no se certifican antecedentes omitidos",
      ]
    )
  })
}

export type DestinoPlazaC = {
  persona: string
  cuerpo: "autonomico_complemento" | "policia_nacional" | "guardia_civil"
  nominaComplemento: string
  isla: "Mallorca" | "Menorca" | "Ibiza" | "Formentera"
  desde: string
  hasta: string
}
export type SolicitudPlazasC = DeclaracionC & {
  codigo: "balears_plazas_dificil_cobertura"
  destinos: readonly DestinoPlazaC[]
  gastos: readonly (PagoC & {
    concepto:
      | "intereses_hipoteca_habitual"
      | "alquiler_habitual"
      | "transporte_aereo_interinsular"
      | "transporte_maritimo_interinsular"
  })[]
}
export function evaluarPlazasAmpliacionC(
  h: SolicitudPlazasC,
  m: MagnitudesAnualesC
): ResultadoAmpliacionC {
  return evaluarC(h, "illes-balears", () => {
    comprobar(
      h.codigo === "balears_plazas_dificil_cobertura",
      "Código de plazas incorrecto"
    )
    anualesC(h, m)
    accesoC(h, 52800, 84480)
    h.destinos.forEach((d) => personaC(h, d.persona))
    let total = ceroC()
    comprobar(
      h.gastos.every((p) =>
        [
          "intereses_hipoteca_habitual",
          "alquiler_habitual",
          "transporte_aereo_interinsular",
          "transporte_maritimo_interinsular",
        ].includes(p.concepto)
      ),
      "Gasto de principal hipotecario u otro concepto excluido"
    )
    for (const persona of h.declarantes) {
      const ds = h.destinos.filter((d) => d.persona === persona)
      if (ds.length === 0) continue
      const dias = diasC(
        h,
        ds.map((d) => ({ desde: d.desde, hasta: d.hasta }))
      )
      comprobar(
        dias * 2 > ordinalC(h.devengo),
        "Destino no supera mitad del período"
      )
      const bajo =
        rentaC(h).comparar(
          enteroC(h.modalidad === "individual" ? 33000 : 52800)
        ) <= 0n
      let limite = ceroC()
      for (const d of ds) {
        comprobar(
          [
            "autonomico_complemento",
            "policia_nacional",
            "guardia_civil",
          ].includes(d.cuerpo),
          "Cuerpo excluido"
        )
        if (d.cuerpo === "autonomico_complemento") texto(d.nominaComplemento)
        comprobar(
          ["Mallorca", "Menorca", "Ibiza", "Formentera"].includes(d.isla),
          "Isla desconocida"
        )
        const factor =
          d.cuerpo === "autonomico_complemento"
            ? "1"
            : d.isla === "Mallorca"
              ? "0.70"
              : d.isla === "Formentera"
                ? "1.30"
                : "1"
        limite = limite.sumar(
          enteroC(bajo ? 2000 : 1000)
            .por(eurosC(factor))
            .por(enteroC(diasC(h, [{ desde: d.desde, hasta: d.hasta }])))
            .dividir(enteroC(dias))
        )
      }
      total = total.sumar(
        gastosC(h, h.gastos, persona).por(eurosC("0.40")).minimo(limite)
      )
    }
    return resultadoC(
      total,
      [
        "Art7ter:40%; máximo2000/1000; PN/GC Mallorca-30%,Formentera+30%; islas ponderadas por días de destino",
      ],
      [
        "Habitualidad, complemento y naturaleza interinsular del transporte requieren soporte particular; no se admiten cuotas de principal hipotecario",
      ]
    )
  })
}

export type MagnitudesEmergenciaC = {
  calculoId: string
  ejercicio: 2025
  tipoMedioGravamen: { numerador: string; denominador: string }
  ayudasIntegradas: readonly {
    ayudaId: string
    persona: string
    incluidaBaseImponibleGeneral: string
    incluidaBaseLiquidable: string
  }[]
}
export type SolicitudEmergenciaC = DeclaracionC & {
  codigo: "balears_subvenciones_zona_emergencia_proteccion_civil"
  ayudas: readonly {
    id: string
    persona: string
    concedente: "comunidad_illes_balears"
    acuerdoConsejoMinistros: string
    resolucion: string
    importeRecibido: string
  }[]
}
export function evaluarEmergenciaAmpliacionC(
  h: SolicitudEmergenciaC,
  m: MagnitudesAnualesC,
  e: MagnitudesEmergenciaC
): ResultadoAmpliacionC {
  return evaluarC(h, "illes-balears", () => {
    comprobar(
      h.codigo === "balears_subvenciones_zona_emergencia_proteccion_civil",
      "Código de emergencia incorrecto"
    )
    anualesC(h, m)
    comprobar(
      e.calculoId === m.calculoId && e.ejercicio === 2025,
      "Tipo medio/integración ajenos al anual"
    )
    unico(h.ayudas.map((a) => a.id))
    unico(e.ayudasIntegradas.map((a) => a.ayudaId))
    const denominador = noNegativoC(e.tipoMedioGravamen.denominador),
      numerador = noNegativoC(e.tipoMedioGravamen.numerador)
    comprobar(
      denominador.n > 0n && numerador.comparar(denominador) <= 0n,
      "Tipo medio inválido"
    )
    let base = ceroC()
    for (const a of h.ayudas) {
      personaC(h, a.persona)
      texto(a.acuerdoConsejoMinistros)
      texto(a.resolucion)
      comprobar(
        a.concedente === "comunidad_illes_balears",
        "Ayuda no concedida por comunidad balear"
      )
      const i = e.ayudasIntegradas.find(
        (i) => i.ayudaId === a.id && i.persona === a.persona
      )
      comprobar(i !== undefined, "Ayuda sin integración anual identificada")
      comprobar(
        noNegativoAnualC(i.incluidaBaseLiquidable).comparar(
          noNegativoAnualC(i.incluidaBaseImponibleGeneral)
        ) <= 0n &&
          noNegativoAnualC(i.incluidaBaseImponibleGeneral).comparar(
            noNegativoAnualC(a.importeRecibido)
          ) <= 0n,
        "Integración fiscal superior a ayuda"
      )
      base = base.sumar(noNegativoAnualC(i.incluidaBaseLiquidable))
    }
    comprobar(
      base.comparar(eurosAnualesC(m.baseLiquidableGeneral).maximo(ceroC())) <= 0n,
      "Ayudas integradas superan la base liquidable general anual"
    )
    return resultadoC(
      base.por(numerador).dividir(denominador),
      [
        "Art3ter: tipo medio de gravamen del motor anual × parte de ayuda integrada en base liquidable",
        `Cálculo anual ${m.calculoId}`,
      ],
      [
        "El puerto exige el tipo medio legal calculado por anual; no se deduce automáticamente de cuota total que incluye ahorro; acuerdo de emergencia y resolución sujetos a cotejo",
      ]
    )
  })
}
