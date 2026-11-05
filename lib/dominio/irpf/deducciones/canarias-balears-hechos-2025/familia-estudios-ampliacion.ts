import { edad, fecha, texto, unico } from "./comun"
import type {
  DeclaracionC,
  MagnitudesAnualesC,
  MinimoC,
  PagoC,
  ResultadoAmpliacionC,
} from "./ampliacion-comun"
import {
  accesoC,
  anualesC,
  ceroC,
  comprobar,
  diasC,
  enteroC,
  eurosC,
  evaluarC,
  gastosC,
  minimoC,
  noNegativoC,
  ordinalC,
  periodoC,
  personaC,
  rentaC,
  resultadoC,
  recortarPeriodoC,
} from "./ampliacion-comun"

export type CodigoFamiliaEstudiosC =
  | "canarias_acogimiento_menores"
  | "canarias_familias_monoparentales"
  | "canarias_familiares_dependientes_discapacidad"
  | "canarias_cuotas_seguridad_social_empleados_hogar"
  | "canarias_estudios_educacion_superior"
  | "balears_estudios_superiores_fuera_isla"
  | "balears_libros_texto"
  | "balears_nacimiento"
  | "balears_adopcion"
  | "balears_gastos_ela"
export type PersonaFamiliaC = {
  id: string
  nacimiento: string
  discapacidad: number
  naturalezaDiscapacidad: "fisica_sensorial" | "psiquica"
  rentaNoExenta: string
  minimo: MinimoC
  progenitores: readonly string[]
  titularesAcogimiento: readonly string[]
  convivencia: readonly { desde: string; hasta: string }[]
  adopcion: string
  inscripcionCivil: string
  progenitorPrevio: string
  expediente: string
  acogimiento: "urgencia" | "temporal" | "permanente" | "ninguno"
  ingresoCentroEspecializado: string
  gastos: readonly (PagoC & {
    concepto: "libro" | "tratamiento_ela" | "prima_seguro"
  })[]
  diagnosticoELA: string
  estudio: {
    nivel:
      | "universidad"
      | "artistica_superior"
      | "fp_superior"
      | "otros_superiores"
      | "infantil_segundo_ciclo"
      | "primaria"
      | "eso"
      | "bachillerato"
      | "fp"
    centro: string
    inicioCurso: string
    creditos: number
    curso: "completo" | "parcial"
    ofertaPublicaPresencialIsla: readonly string[]
    islaResidencia: string
    islaCentro: string
    municipioResidencia: string
    municipioCentro: string
    municipioAlojamiento: string
    municipiosLimitrofes: readonly string[]
    alojamiento: string
    estadoCivil: "soltero" | "casado"
    sostenimiento: string
  }
}
export type ContribuyenteFamiliaC = {
  persona: string
  nacimiento: string
  discapacidad: number
  naturalezaDiscapacidad: "fisica_sensorial" | "psiquica"
  resolucionDiscapacidad: string
  familia:
    | "ordinaria"
    | "numerosa_general"
    | "numerosa_especial"
    | "monoparental_7_7"
  tituloFamilia: string
  residenciaFiscal2024: "canarias" | "illes-balears" | "otra"
  conyugePareja: string
  ordenHijos: readonly string[]
  diasRETA: readonly { desde: string; hasta: string }[]
  alteracionFamilia: string
  otrosConvivientes: readonly {
    persona: string
    relacion: "ascendiente" | "descendiente" | "otra"
    rentaNoExenta: string
    minimo: MinimoC
    intervalos: readonly { desde: string; hasta: string }[]
  }[]
}
export type CuotaHogarC = {
  empleador: string
  empleado: string
  altaSistema: string
  viviendaHabitual: string
  regimen: "gananciales" | "separacion"
  conyuge: string
  necesidadAsistencia: readonly MinimoC[]
  pagos: readonly PagoC[]
}
export type SolicitudFamiliaEstudiosC = DeclaracionC & {
  codigo: CodigoFamiliaEstudiosC
  personas: readonly PersonaFamiliaC[]
  contribuyentes: readonly ContribuyenteFamiliaC[]
  cuotasHogar: readonly CuotaHogarC[]
  ayudasNacimiento: readonly PagoC[]
}

function validarPersonaC(
  h: DeclaracionC,
  u: PersonaFamiliaC,
  propio = false
): void {
  texto(u.id)
  fecha(u.nacimiento)
  unico(u.progenitores)
  comprobar(
    !u.progenitores.includes(u.id) && (propio || !h.declarantes.includes(u.id)),
    "Hijo/familiar no puede ser contribuyente ni su propio progenitor"
  )
  comprobar(
    Number.isFinite(u.discapacidad) &&
      u.discapacidad >= 0 &&
      u.discapacidad <= 100,
    "Grado de discapacidad inválido"
  )
  comprobar(
    u.convivencia.every((i) => i.desde >= u.nacimiento),
    "Convivencia anterior al nacimiento"
  )
  if (!propio) {
    comprobar(u.minimo.persona === u.id, "Mínimo de otra persona")
    minimoC(h, u.minimo)
  }
}
function cuotasC(
  h: SolicitudFamiliaEstudiosC,
  m: MagnitudesAnualesC,
  persona: string,
  asistencia: boolean
) {
  return h.cuotasHogar.reduce((s, c) => {
    texto(c.empleado)
    texto(c.altaSistema)
    texto(c.viviendaHabitual)
    comprobar(
      c.empleado !== c.empleador,
      "Empleado y empleador deben ser distintos"
    )
    if (asistencia && c.necesidadAsistencia.length === 0) return s
    c.necesidadAsistencia.forEach((v) => {
      minimoC(h, v)
      if (asistencia)
        comprobar(
          m.minimos.some(
            (x) =>
              x.tipo === "asistencia" &&
              x.beneficiario === v.persona &&
              x.titulares.includes(persona)
          ),
          "Falta mínimo de asistencia derivado del anual"
        )
    })
    comprobar(
      c.regimen === "gananciales" || c.regimen === "separacion",
      "Régimen matrimonial desconocido"
    )
    if (c.regimen === "gananciales") {
      texto(c.conyuge)
      comprobar(c.conyuge !== c.empleador, "Cónyuges idénticos")
      comprobar(
        c.pagos.every(
          (p) =>
            p.naturaleza === "comun" &&
            p.distribucion.length === 2 &&
            p.distribucion.every(
              (d) =>
                (d.persona === c.empleador || d.persona === c.conyuge) &&
                eurosC(d.porcentaje).comparar(enteroC(50)) === 0n
            )
        ),
        "Cuotas gananciales requieren atribución50/50 a cónyuges"
      )
    } else
      comprobar(
        c.pagos.every(
          (p) => p.pagador === c.empleador && p.naturaleza === "propio"
        ),
        "Cuotas de separación deben atribuirse al empleador"
      )
    return s.sumar(gastosC(h, c.pagos, persona))
  }, ceroC())
}
export function evaluarFamiliaEstudiosAmpliacionC(
  h: SolicitudFamiliaEstudiosC,
  m: MagnitudesAnualesC
): ResultadoAmpliacionC {
  const can = h.codigo.startsWith("canarias_")
  return evaluarC(h, can ? "canarias" : "illes-balears", () => {
    anualesC(h, m)
    unico(h.personas.map((u) => u.id))
    h.personas.forEach((u) => {
      const propio =
        h.codigo === "balears_gastos_ela" && h.declarantes.includes(u.id)
      const sinMinimo =
        h.codigo === "canarias_acogimiento_menores" ||
        h.codigo === "canarias_familias_monoparentales"
      validarPersonaC(h, u, propio || sinMinimo)
      if (sinMinimo)
        comprobar(
          !h.declarantes.includes(u.id),
          "Descendiente/acogido idéntico al contribuyente"
        )
      if (!propio && !sinMinimo)
        comprobar(
          m.minimos.some(
            (v) =>
              v.beneficiario === u.id &&
              v.tipo === u.minimo.relacion &&
              v.titulares.length === u.minimo.titulares.length &&
              v.titulares.every((t) => u.minimo.titulares.includes(t))
          ),
          "Mínimo particular no concordante con el derecho derivado del anual"
        )
    })
    unico(h.contribuyentes.map((c) => c.persona))
    h.contribuyentes.forEach((c) => {
      personaC(h, c.persona)
      fecha(c.nacimiento)
      comprobar(
        Number.isFinite(c.discapacidad) &&
          c.discapacidad >= 0 &&
          c.discapacidad <= 100,
        "Grado del contribuyente inválido"
      )
    })
    comprobar(
      h.contribuyentes.length === h.declarantes.length,
      "Faltan contribuyentes identificados"
    )
    unico([
      ...h.personas.flatMap((u) => u.gastos.map((p) => p.id)),
      ...h.cuotasHogar.flatMap((c) => c.pagos.map((p) => p.id)),
    ])
    let total = ceroC()
    const traza = [h.codigo, `Magnitudes anuales ${m.calculoId}`]
    const cuota = noNegativoC(m.cuotaIntegraAutonomica)
    if (h.codigo === "balears_gastos_ela") {
      accesoC(h, 52800, 84480)
      for (const u of h.personas) {
        texto(u.diagnosticoELA)
        comprobar(
          u.gastos.every((p) => p.concepto === "tratamiento_ela"),
          "Prima sanitaria o gasto ajeno aELA excluido"
        )
        total = total.sumar(gastosC(h, u.gastos))
      }
      return resultadoC(total.minimo(enteroC(3500)), traza, [
        "ELA: máximo agregado3500, no por paciente; compatible6quinquies; diagnóstico y causa de cada factura sujetos a cotejo",
      ])
    }
    for (const c of h.contribuyentes) {
      const persona = c.persona
      let importe = ceroC()
      const us = h.personas.filter((u) =>
        h.codigo === "canarias_acogimiento_menores"
          ? u.titularesAcogimiento.includes(persona)
          : h.codigo === "canarias_familias_monoparentales"
            ? u.progenitores.includes(persona)
            : u.minimo.titulares.includes(persona)
      )
      const rend = m.personas.find((p) => p.persona === persona)
      comprobar(rend !== undefined, "Rendimientos del contribuyente ausentes")
      switch (h.codigo) {
        case "canarias_acogimiento_menores":
          for (const u of us) {
            comprobar(
              ["urgencia", "temporal", "permanente"].includes(u.acogimiento),
              "Modalidad de acogimiento excluida"
            )
            texto(u.expediente)
            comprobar(
              u.adopcion === "" || !u.adopcion.startsWith("2025-"),
              "Adopción en el ejercicio excluye acogimiento"
            )
            comprobar(
              edad(u.nacimiento, h.devengo) < 18,
              "Acogido mayor de edad"
            )
            unico(u.titularesAcogimiento)
            comprobar(
              u.titularesAcogimiento.length > 0 &&
                !u.titularesAcogimiento.includes(u.id),
              "Titulares de acogimiento inválidos"
            )
            const dias = diasC(
              h,
              u.convivencia.flatMap((i) =>
                recortarPeriodoC(h, i.desde, i.hasta)
              )
            )
            importe = importe.sumar(
              enteroC(330)
                .por(enteroC(dias))
                .dividir(enteroC(ordinalC(h.devengo)))
                .dividir(enteroC(u.titularesAcogimiento.length))
            )
          }
          break
        case "canarias_familias_monoparentales": {
          accesoC(h, 46455, 61770)
          let habilitado = false
          if (c.alteracionFamilia !== "") periodoC(h, c.alteracionFamilia)
          for (const u of us) {
            const conv = diasC(h, u.convivencia)
            comprobar(
              noNegativoC(u.rentaNoExenta).comparar(enteroC(8000)) <= 0n,
              "Descendiente con renta superior8000"
            )
            if (
              (edad(u.nacimiento, h.devengo) < 18 || u.discapacidad > 0) &&
              (conv > 0 || u.ingresoCentroEspecializado !== "")
            ) {
              comprobar(
                c.alteracionFamilia === "" || conv >= 183,
                "Alteración familiar sin183días de convivencia"
              )
              habilitado = true
            }
          }
          for (const u of c.otrosConvivientes) {
            texto(u.persona)
            comprobar(u.persona !== persona, "Conviviente autorreferente")
            const dias = diasC(h, u.intervalos)
            if (dias === 0) continue
            if (u.relacion === "ascendiente") minimoC(h, u.minimo)
            else
              comprobar(
                u.relacion === "descendiente" &&
                  noNegativoC(u.rentaNoExenta).comparar(enteroC(8000)) <= 0n,
                "Otro conviviente excluye monoparentalidad"
              )
          }
          comprobar(habilitado, "No hay descendiente habilitante")
          importe = enteroC(133)
          break
        }
        case "canarias_familiares_dependientes_discapacidad":
          accesoC(h, 46455, 61770)
          for (const u of us) {
            comprobar(
              u.discapacidad >= 65 &&
                m.minimos.some(
                  (v) =>
                    v.tipo === "discapacidad" &&
                    v.beneficiario === u.id &&
                    v.titulares.includes(persona)
                ),
              "Familiar sin grado65/mínimo de discapacidad anual"
            )
            importe = importe.sumar(
              enteroC(600).dividir(enteroC(u.minimo.titulares.length))
            )
          }
          importe = importe.sumar(
            cuotasC(h, m, persona, true)
              .por(eurosC("0.20"))
              .minimo(enteroC(500))
          )
          break
        case "canarias_cuotas_seguridad_social_empleados_hogar": {
          const a = edad(c.nacimiento, h.devengo)
          const activo =
            eurosC(rend.rendimientosTrabajoActividad).n > 0n &&
            us.some((u) => u.minimo.relacion === "descendiente")
          const mayor =
            a >= 75 ||
            (a > 65 &&
              c.discapacidad >=
                (c.naturalezaDiscapacidad === "psiquica" ? 33 : 65))
          comprobar(
            activo || mayor,
            "Empleador sin descendientes/rendimientos o edad/discapacidad habilitante"
          )
          if (mayor && a < 75) texto(c.resolucionDiscapacidad)
          importe = cuotasC(h, m, persona, false)
            .por(eurosC("0.20"))
            .minimo(enteroC(500))
          break
        }
        case "canarias_estudios_educacion_superior":
        case "balears_estudios_superiores_fuera_isla": {
          accesoC(h, can ? 46455 : 33000, can ? 61770 : 52800)
          for (const u of us) {
            comprobar(
              u.minimo.relacion === "descendiente",
              "Estudios superiores requieren un descendiente con mínimo anual"
            )
            const e = u.estudio
            texto(e.centro)
            texto(e.sostenimiento)
            periodoC(h, e.inicioCurso)
            comprobar(
              [
                "universidad",
                "artistica_superior",
                "fp_superior",
                "otros_superiores",
              ].includes(e.nivel),
              "Nivel no superior"
            )
            comprobar(
              noNegativoC(u.rentaNoExenta).comparar(enteroC(8000)) <= 0n,
              "Renta descendiente superior8000"
            )
            if (can)
              comprobar(
                edad(u.nacimiento, h.devengo) < 25 &&
                  e.estadoCivil === "soltero",
                "Descendiente canario debe ser soltero menor25"
              )
            const fuera = e.islaResidencia !== e.islaCentro
            if (!can || fuera) {
              comprobar(
                e.curso === "completo" ||
                  (Number.isFinite(e.creditos) && e.creditos >= 30),
                "Curso parcial con menos30créditos"
              )
              if (can)
                comprobar(
                  e.ofertaPublicaPresencialIsla.length === 0,
                  "Oferta pública presencial en isla de residencia excluye traslado"
                )
            } else {
              texto(e.alojamiento)
              comprobar(
                e.municipioCentro !== e.municipioResidencia &&
                  (e.municipioAlojamiento === e.municipioCentro ||
                    e.municipiosLimitrofes.includes(e.municipioAlojamiento)),
                "Alojamiento o municipio sin traslado admisible"
              )
            }
            if (!can)
              comprobar(fuera, "Estudios baleares deben cursarse fuera de isla")
            const baseL = eurosC(rend.liquidableGeneral).sumar(
              eurosC(rend.liquidableAhorro)
            )
            const fijo = can
              ? fuera
                ? baseL.comparar(enteroC(37062)) < 0n
                  ? 1920
                  : 1800
                : 900
              : 1800
            importe = importe.sumar(
              enteroC(fijo).dividir(enteroC(u.minimo.titulares.length))
            )
          }
          importe = importe.minimo(cuota.por(eurosC(can ? "0.40" : "0.50")))
          break
        }
        case "balears_libros_texto": {
          const joven = edad(c.nacimiento, h.devengo) < 30
          const reta = diasC(h, c.diasRETA)
          const reforzado =
            joven ||
            c.discapacidad >= 33 ||
            m.minimos.some(
              (v) => v.tipo === "discapacidad" && v.titulares.includes(persona)
            ) ||
            c.familia !== "ordinaria" ||
            (h.devengo >= "2025-07-25" && reta >= 183)
          if (c.discapacidad >= 33) texto(c.resolucionDiscapacidad)
          if (c.familia !== "ordinaria") texto(c.tituloFamilia)
          comprobar(
            c.familia !== "numerosa_especial" || h.devengo >= "2025-07-25",
            "Numerosa especial antes25julio: rama de versión de renta pendiente"
          )
          accesoC(
            h,
            33000,
            52800,
            eurosC(
              c.familia === "ordinaria"
                ? "1"
                : c.familia === "numerosa_especial"
                  ? "1.30"
                  : "1.20"
            )
          )
          for (const u of us) {
            comprobar(
              u.minimo.relacion === "descendiente" &&
                u.progenitores.includes(persona),
              "Libros baleares requieren un hijo con mínimo por descendientes"
            )
            comprobar(
              [
                "infantil_segundo_ciclo",
                "primaria",
                "eso",
                "bachillerato",
                "fp",
              ].includes(u.estudio.nivel) &&
                u.gastos.every((p) => p.concepto === "libro"),
              "Estudios o material distintos de libros de texto"
            )
            importe = importe.sumar(
              gastosC(h, u.gastos, persona).minimo(
                enteroC(reforzado ? 350 : 220).dividir(
                  enteroC(u.minimo.titulares.length)
                )
              )
            )
          }
          break
        }
        case "balears_nacimiento":
        case "balears_adopcion": {
          const nacimiento = h.codigo === "balears_nacimiento"
          comprobar(
            h.ayudasNacimiento.length === 0,
            "Ayuda pública balear por nacimiento incompatible"
          )
          if (nacimiento)
            comprobar(
              c.residenciaFiscal2024 === "illes-balears",
              "Falta residencia fiscal balear del ejercicio anterior"
            )
          const factor = eurosC(c.familia === "ordinaria" ? "1" : "1.20")
          if (c.familia !== "ordinaria") texto(c.tituloFamilia)
          if (!nacimiento) accesoC(h, 33000, 52800, factor)
          const limite = enteroC(
            h.modalidad === "individual" ? 52800 : 84480
          ).por(factor)
          const factorRenta =
            nacimiento && rentaC(h).comparar(limite) > 0n
              ? eurosC("0.50")
              : enteroC(1)
          unico(c.ordenHijos)
          comprobar(
            c.ordenHijos.length === us.length &&
              c.ordenHijos.every((id) => us.some((u) => u.id === id)),
            "Orden familiar incompleto respecto de hijos con mínimo"
          )
          for (const u of us) {
            const evento = nacimiento ? u.nacimiento : u.inscripcionCivil
            if (evento === "" || !evento.startsWith("2025-")) continue
            periodoC(h, evento)
            comprobar(
              u.progenitores.includes(persona),
              "Contribuyente no es progenitor/adoptante"
            )
            comprobar(diasC(h, u.convivencia) > 0, "Hijo sin convivencia")
            if (!nacimiento) {
              texto(u.expediente)
              comprobar(
                u.progenitorPrevio !== c.conyugePareja ||
                  c.conyugePareja === "",
                "Adopción de hijo de cónyuge/pareja excluida"
              )
            }
            const orden = c.ordenHijos.indexOf(u.id) + 1
            const fijo =
              orden === 1 ? 800 : orden === 2 ? 1000 : orden === 3 ? 1200 : 1400
            const divisor =
              nacimiento && h.devengo >= "2025-07-25"
                ? u.progenitores.length
                : u.minimo.titulares.length
            comprobar(
              divisor >= 1 && divisor <= 2,
              "Progenitores fuera de alcance"
            )
            importe = importe.sumar(
              enteroC(fijo).por(factorRenta).dividir(enteroC(divisor))
            )
          }
          traza.push(
            "Nacimiento/adopción prioritarios: cuantía previa a cuota, anticipos, abono y regularización del anual"
          )
          break
        }
        default:
          throw new RangeError("Código de familia/estudios desconocido")
      }
      total = total.sumar(importe)
      traza.push(`Persona ${persona}: ${importe.n}/${importe.d}`)
    }
    const porcentaje =
      h.codigo === "canarias_estudios_educacion_superior"
        ? 40
        : h.codigo === "balears_estudios_superiores_fuera_isla"
          ? 50
          : undefined
    if (porcentaje !== undefined)
      total = total.minimo(cuota.por(enteroC(porcentaje)).dividir(enteroC(100)))
    return resultadoC(
      total,
      traza,
      [
        "Mínimos, parentesco preferente, dependencia económica, orden familiar y títulos particulares no autenticados por su referencia",
        "Pagos propios no se dividen nuevamente; libros reparte el máximo por hijo",
        "La prioridad, anticipos/abonos de nacimiento/adopción y posible insuficiencia de cuota requieren composición anual",
      ],
      false,
      porcentaje === undefined
        ? undefined
        : { codigo: h.codigo, porcentaje: String(porcentaje) }
    )
  })
}
