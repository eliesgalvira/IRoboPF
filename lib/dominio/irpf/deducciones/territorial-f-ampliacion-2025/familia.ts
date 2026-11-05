import { racional, sumar } from "../anual-territorial-racional"
import type { SolicitudF, PersonaF } from "./esquemas"
import {
  D,
  requerido,
  texto,
  opcion,
  entero,
  fecha,
  aniversario,
  edad,
  convivencia,
  dias,
  dinero,
  magnitudF,
  exigirProductoresBasesF,
  decimal,
  ids,
  unicos,
  minimo,
  sumarRepartoExactoF,
  salidaExactaF,
  renta,
  rentaFamiliarMadrid,
  baseFamiliar,
  base,
  pagos,
  sumaPagos,
  falta,
  excluir,
  salida,
  dependencia,
  type ResultadoF,
} from "./comun"

export const CODIGOS_FAMILIA_F = [
  "madrid_acogimiento_familiar_menores",
  "madrid_acogimiento_mayores_65_discapacidad",
  "madrid_cuidado_ascendientes",
  "madrid_gastos_educativos",
  "madrid_cuidado_hijos_mayores_dependientes_discapacidad",
  "madrid_condicion_familia_numerosa",
  "madrid_familias_dos_descendientes_ingresos_reducidos",
  "murcia_material_escolar_libros_texto",
  "murcia_conciliacion",
  "murcia_acogimiento_mayores_65_discapacidad",
  "murcia_mujeres_trabajadoras",
  "murcia_familia_monoparental",
] as const
function personas(s: SolicitudF): readonly PersonaF[] {
  const ps = requerido(s.hechos.personas, "personas")
  unicos(
    ps.map((p) => texto(p.id, "persona.id")),
    "personas.id"
  )
  for (const p of ps) {
    const id = texto(p.id, "persona.id")
    if ((p.progenitores ?? []).includes(id))
      falta("persona.id", "Hijo incluido entre sus propios progenitores")
    if (p.relacion !== "contribuyente" && id === s.contexto.contribuyente)
      falta("persona.id", "Identidad del familiar igual al titular")
  }
  return ps
}
function numerosa(s: SolicitudF): string {
  const t = requerido(s.hechos.titulo, "titulo")
  const categoria = opcion(
    t.categoria,
    ["general", "especial", "no_numerosa"],
    "titulo.categoria"
  )
  if (categoria !== "no_numerosa") {
    texto(t.referencia, "titulo.referencia")
    if (fecha(t.efectos, "titulo.efectos") > "2025-12-31")
      excluir("titulo.efectos", "Título sin efectos al devengo")
    if (
      !ids(t.titulares, "titulo.titulares").includes(s.contexto.contribuyente)
    )
      excluir("titulo.titulares", "Título ajeno")
  }
  return categoria
}
function convivenciaComoMenor(p: PersonaF): number {
  const total = convivencia(p)
  const e = edad(p.nacimiento)
  if (e < 18) return total
  if (e > 18) return 0
  // Art.173.4.d CC: el acogimiento cesa al alcanzar la mayoría de edad.
  // Art.6 Madrid exige más de183 días en ese régimen, no ser menor al devengo.
  const mayoria = aniversario(fecha(p.nacimiento, "persona.nacimiento"), 18)
  return requerido(p.convivencia, "persona.convivencia").reduce((n, periodo) => {
    if (periodo.desde >= mayoria) return n
    return n + (periodo.hasta < mayoria
      ? dias(periodo.desde, periodo.hasta)
      : dias(periodo.desde, mayoria) - 1)
  }, 0)
}
export function familiaF(s: SolicitudF): ResultadoF {
  const c = s.codigo
  if (c === "madrid_condicion_familia_numerosa") {
    rentaFamiliarMadrid(s)
    const cat = numerosa(s)
    const t = requerido(s.hechos.titulo, "titulo")
    if (cat === "no_numerosa")
      excluir("titulo", "Sin condición de familia numerosa")
    if (fecha(t.efectos, "titulo.efectos") < "2023-01-01")
      excluir(
        "titulo.efectos",
        "Fuera del año de reconocimiento y dos siguientes"
      )
    return dependencia(
      s,
      {
        magnitud: "cuota_integra_autonomica",
        factor: cat === "especial" ? "1" : "0.5",
        topeEUR: cat === "especial" ? "12372" : "6186",
        operacion:
          "min(tope, cuotaIntegraAutonomica × factor); sin consumir cuota aquí",
      },
      "Art.13: fórmula disponible; la cuota íntegra autonómica la produce la anual"
    )
  }
  const ps = personas(s)
  if (c === "madrid_familias_dos_descendientes_ingresos_reducidos") {
    if (ps.length < 2) excluir("personas", "Menos de dos descendientes")
    ps.forEach((p) => minimo(s, p))
    const titulares = ids(
      s.hechos.titularesConMismoMinimo,
      "titularesConMismoMinimo"
    )
    const titularesDeclarados = [
      ...new Set(
        ps.flatMap((p) => [
          ...ids(p.titularesMinimo, "persona.titularesMinimo"),
        ])
      ),
    ]
    if (
      titulares.length !== titularesDeclarados.length ||
      titulares.some((id) => !titularesDeclarados.includes(id))
    )
      falta(
        "titularesConMismoMinimo",
        "La colección no coincide con todos los titulares de los mínimos declarados"
      )
    const esperados = [
      ...new Set([...titulares, ...ps.map((p) => texto(p.id, "persona.id"))]),
    ]
    exigirProductoresBasesF(s, esperados)
    const bs = requerido(s.hechos.basesOtrosTitulares, "basesOtrosTitulares")
    unicos(
      bs.map((b) => b.id),
      "basesOtrosTitulares.id"
    )
    if (
      bs.length !== esperados.length ||
      bs.some((b) => !esperados.includes(b.id))
    )
      falta(
        "basesOtrosTitulares",
        "Faltan bases exhaustivas de TODOS los titulares del mínimo y descendientes"
      )
    const suma = bs.reduce(
      (a, b) =>
        a
          .plus(magnitudF(s, "general", b.generalEUR, b.id))
          .plus(magnitudF(s, "ahorro", b.ahorroEUR, b.id)),
      new D(0)
    )
    if (suma.gt(24744)) excluir("basesOtrosTitulares", "Suma superior a24.744")
    return dependencia(
      s,
      {
        magnitud: "cuota_tras_resto_deducciones",
        factor: "0.1",
        operacion:
          "10% de cuota íntegra autonómica menos resto autonómicas y parte estatal sobre ella",
      },
      "Art.14: fórmula explícita pendiente de una única cuota después del resto"
    )
  }
  if (c === "madrid_acogimiento_familiar_menores") {
    renta(s, "26414.22")
    let total = racional("0")
    let orden = 0
    for (const p of [...ps].sort(
      (a, b) =>
        requerido(a.orden, "persona.orden") -
        requerido(b.orden, "persona.orden")
    )) {
      opcion(
        p.acogimientoTipo,
        ["simple", "permanente", "preadoptivo", "administrativo", "judicial"],
        "acogimientoTipo"
      )
      texto(p.acogimientoCertificado, "acogimientoCertificado")
      if (
        p.adopcionFecha !== undefined &&
        fecha(p.adopcionFecha, "adopcionFecha").startsWith("2025-")
      )
        continue
      if (convivenciaComoMenor(p) <= 183) continue
      orden++
      if (entero(p.orden, "orden", 1, 100) !== orden)
        falta(
          "orden",
          "El orden debe corresponder sólo a menores no adoptados con >183 días"
        )
      total = sumarRepartoExactoF(s, total,
        new D(orden === 1 ? "618.60" : orden === 2 ? "773.25" : "927.90"), p.titularesDeduccion)
    }
    return salidaExactaF(s, total, [
      "Orden calculado tras excluir adopciones2025 y convivencia como menor<=183; art6 y art173.4.d CC",
    ])
  }
  if (
    c === "madrid_acogimiento_mayores_65_discapacidad" ||
    c === "murcia_acogimiento_mayores_65_discapacidad"
  ) {
    if (c.startsWith("madrid")) renta(s, "26414.22")
    let total = racional("0")
    for (const p of ps) {
      const e = edad(p.nacimiento)
      const grado = decimal(p.discapacidadPorcentaje, "discapacidadPorcentaje")
      if (grado.gt(100)) falta("discapacidadPorcentaje", "Grado>100")
      if (grado.gte(33))
        texto(p.certificadoDiscapacidad, "certificadoDiscapacidad")
      if ((e <= 65 && grado.lt(33)) || convivencia(p) <= 183) continue
      if (e > 65 && entero(p.gradoParentesco, "gradoParentesco", 0, 10) <= 4)
        continue
      if (
        dinero(p.contraprestacionEUR, "contraprestacionEUR").gt(0) ||
        dinero(p.ayudasAcogimientoEUR, "ayudasAcogimientoEUR").gt(0)
      )
        continue
      texto(p.certificadoSinAyudas, "certificadoSinAyudas")
      texto(p.certificadoPadron, "certificadoPadron")
      total = sumarRepartoExactoF(s, total,
        new D(c.startsWith("madrid") ? "1546.50" : 600), p.titularesDeduccion)
    }
    return salidaExactaF(s, total, [
      ">65 o grado>=33; >183 días; mayores sin parentesco hasta cuarto; sin contraprestación/ayudas",
    ])
  }
  if (c === "madrid_cuidado_ascendientes") {
    let total = racional("0")
    for (const p of ps) {
      opcion(p.relacion, ["ascendiente"], "persona.relacion")
      minimo(s, p)
      total = sumarRepartoExactoF(s, total, new D("515.50"), p.titularesDeduccion)
    }
    return salidaExactaF(s, total, ["Art7bis no importa límite de renta de art7"])
  }
  if (
    c === "madrid_gastos_educativos" ||
    c === "murcia_material_escolar_libros_texto"
  ) {
    const madrid = c.startsWith("madrid")
    if (madrid) rentaFamiliarMadrid(s)
    else renta(s, numerosa(s) === "no_numerosa" ? 20000 : 33000)
    const pagadores = madrid
      ? [
          ...new Set(
            ps.flatMap((p) => [
              ...ids(p.titularesDeduccion, "persona.titularesDeduccion"),
            ])
          ),
        ]
      : [s.contexto.contribuyente]
    const pp = pagos(
      s,
      madrid
        ? ["escolaridad", "idiomas", "uniforme"]
        : ["material_escolar", "libros_texto"],
      undefined,
      pagadores
    )
    if (pp.some((p) => !ps.some((x) => x.id === p.beneficiarioId)))
      falta("pagos.beneficiarioId", "Pago sin persona identificada")
    let total = racional("0")
    for (const p of ps) {
      minimo(s, p)
      texto(p.certificadoEducativo, "certificadoEducativo")
      const etapa = opcion(
        p.etapa,
        madrid
          ? [
              "infantil_primero",
              "infantil_segundo",
              "primaria",
              "eso",
              "fp_basica",
            ]
          : ["infantil_segundo", "primaria", "eso"],
        "etapa"
      )
      const propios = pp.filter((x) => x.beneficiarioId === p.id)
      if (madrid) {
        const titulares = ids(
          p.titularesDeduccion,
          "persona.titularesDeduccion"
        )
        if (
          propios.some(
            (x) => !titulares.includes(texto(x.pagador, "pago.pagador"))
          )
        )
          falta(
            "pago.pagador",
            "Pagador de otro descendiente, sin titularidad de este gasto"
          )
        if (titulares.length > 1)
          propios.forEach((x) =>
            opcion(x.atribucion, ["gasto_comun"], "pago.atribucion")
          )
      }
      if (!madrid) {
        if (propios.length === 0)
          falta("pagos", "Adquisición de material/libros no declarada")
        total = sumarRepartoExactoF(s, total,
          D.max(0, new D(120).minus(dinero(p.ayudasEscolaresEUR, "ayudasEscolaresEUR"))), p.titularesDeduccion)
      } else {
        if (etapa === "infantil_primero") {
          opcion(
            p.tipoPreciosEscolaridad,
            ["privado_no_autorizado"],
            "tipoPreciosEscolaridad"
          )
          if (propios.some((x) => x.concepto !== "escolaridad"))
            falta(
              "pago.concepto",
              "Primer ciclo sólo escolaridad sin precio público/autorizado"
            )
        }
        let cuantia = new D(0)
        for (const x of propios)
          cuantia = cuantia.plus(
            D.max(
              0,
              dinero(x.importeEUR, "importeEUR").minus(
                dinero(x.ayudasEUR, "ayudasEUR")
              )
            ).times(x.concepto === "uniforme" ? "0.05" : "0.15")
          )
        const maximo =
          etapa === "infantil_primero"
            ? 1031
            : propios.some((x) => x.concepto === "escolaridad")
              ? "927.90"
              : "412.40"
        total = sumarRepartoExactoF(s, total, D.min(maximo, cuantia), p.titularesDeduccion)
      }
    }
    return salidaExactaF(s, total, [
      "Tope por hijo antes del reparto; ayudas por su concepto/descendiente",
    ])
  }
  if (c === "murcia_mujeres_trabajadoras") {
    opcion(s.hechos.sexo, ["mujer"], "sexo")
    renta(s, 20000)
    const empleos = requerido(s.hechos.empleos, "empleos")
    if (empleos.length !== 1)
      falta(
        "empleos",
        "Una trayectoria laboral por titular; aportar intervalos disjuntos"
      )
    const e = requerido(empleos[0], "empleo")
    opcion(e.tipoActividad, ["cuenta_propia", "cuenta_ajena"], "tipoActividad")
    texto(e.referenciaSS, "referenciaSS")
    texto(e.certificadoActividad, "certificadoActividad")
    if (e.empleador !== s.contexto.contribuyente)
      falta("empleo.empleador", "Trayectoria ajena")
    const periodos = requerido(e.periodosTrabajo, "periodosTrabajo")
    const trabajados = convivencia({ convivencia: periodos })
    if (trabajados === 0) excluir("periodosTrabajo", "Sin días trabajados")
    let total = racional("0")
    for (const p of ps) {
      texto(p.certificadoParentesco, "certificadoParentesco")
      const relacion = opcion(
        p.relacion,
        ["hijo", "descendiente", "ascendiente"],
        "relacion"
      )
      const grado = decimal(p.discapacidadPorcentaje, "discapacidadPorcentaje")
      if (grado.gte(65))
        texto(p.certificadoDiscapacidad, "certificadoDiscapacidad")
      const e = edad(p.nacimiento)
      if (relacion === "hijo" && e < 18) {
        const o = entero(p.orden, "orden", 1, 100)
        texto(p.certificadoOrden, "certificadoOrden")
        total = sumar(total, racional(new D(o === 1 ? 300 : o === 2 ? 350 : 400).times(trabajados).toFixed(), "365"))
      } else if ((relacion === "ascendiente" && e > 75) || grado.gte(65)) {
        if (convivencia(p) > 183) total = sumar(total, racional("400"))
      }
    }
    return salidaExactaF(
      s,
      total,
      [
        "Literal apartado14.4: prorrata días trabajados para hijo; persona única sin doble cuantía",
      ],
      ["Alta y trabajo declarados, sin autenticar documento SS"]
    )
  }
  if (c === "murcia_familia_monoparental") {
    texto(
      s.hechos.certificadoFamiliaMonoparental,
      "certificadoFamiliaMonoparental"
    )
    const convivientes = ids(s.hechos.convivientes, "convivientes")
    const esperados = [
      s.contexto.contribuyente,
      ...ps.map((p) => texto(p.id, "persona.id")),
    ]
    if (
      convivientes.length !== esperados.length ||
      convivientes.some((id) => !esperados.includes(id))
    )
      falta(
        "convivientes",
        "Declarar todos los convivientes, incluidos adultos ajenos"
      )
    const desde = fecha(s.hechos.situacionFamiliaDesde, "situacionFamiliaDesde")
    if (dias(desde < "2025-01-01" ? "2025-01-01" : desde, "2025-12-31") < 183)
      excluir("situacionFamiliaDesde", "Situación familiar menos de183 días")
    let hijos = 0
    let alimentos = new D(0)
    for (const p of ps) {
      if (p.relacion === "ascendiente") {
        minimo(s, p)
        continue
      }
      opcion(
        p.relacion,
        ["hijo", "descendiente", "tutela", "acogimiento"],
        "relacion"
      )
      texto(p.certificadoParentesco, "certificadoParentesco")
      if (dinero(p.rentasNoExentasEUR, "rentasNoExentasEUR", true).gt(8000))
        excluir(
          "rentasNoExentasEUR",
          "Descendiente conviviente con rentas>8000"
        )
      if (
        edad(p.nacimiento) < 18 ||
        decimal(p.discapacidadPorcentaje, "discapacidadPorcentaje").gte(33)
      ) {
        if (convivencia(p) === 0)
          falta(
            "persona.convivencia",
            "Internamiento/dependencia requiere subrama específica"
          )
        hijos++
        alimentos = alimentos.plus(
          dinero(p.alimentosExentosEUR, "alimentosExentosEUR")
        )
      }
    }
    if (hijos === 0) excluir("personas", "Sin descendiente elegible")
    if (base(s).plus(alimentos).gt(35240))
      excluir("bases+alimentos", "Suma superior a35.240")
    return salida(s, new D(303), [
      "Convivencia183 inclusiva; suma alimentos exentos de descendientes elegibles",
    ])
  }
  // Cuidado de hogar: cada cuota se identifica por mes y trabajador, sin bases escalares externas.
  const madrid = c === "madrid_cuidado_hijos_mayores_dependientes_discapacidad"
  if (madrid) rentaFamiliarMadrid(s)
  const empleados = requerido(s.hechos.empleos, "empleos")
  unicos(
    empleados.map(
      (e) =>
        texto(e.trabajador, "trabajador") + ":" + entero(e.mes, "mes", 1, 12)
    ),
    "empleo-mes"
  )
  const pp = pagos(s, ["cuota_hogar"])
  let hijos = new D(0)
  let mayores = new D(0)
  const usadosHijos = new Set<string>()
  const usadosMayores = new Set<string>()
  for (const e of empleados) {
    if (e.empleador !== s.contexto.contribuyente)
      falta("empleador", "Empleador distinto al titular")
    texto(e.referenciaSS, "referenciaSS")
    fecha(e.altaEmpleador, "altaEmpleador")
    const p = ps.find((p) => p.id === e.beneficiarioId)
    if (p === undefined)
      falta("empleo.beneficiarioId", "Falta persona cuidada identificada")
    const mes = entero(e.mes, "mes", 1, 12)
    const corte = `2025-${String(mes).padStart(2, "0")}-${[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1]}`
    const nacimiento = fecha(p.nacimiento, "persona.nacimiento")
    const limiteEdad = madrid ? 3 : 12
    if (
      p.relacion === "hijo" &&
      Number(nacimiento.slice(0, 4)) + limiteEdad === 2025 &&
      Number(nacimiento.slice(5, 7)) === mes
    )
      falta(
        "cuotaMesCumpleEdad",
        "Mes en que cumple edad límite: delimitar periodo exigido, sin inventar criterio de último día"
      )
    const menor =
      p.relacion === "hijo" && edad(p.nacimiento, corte) < (madrid ? 3 : 12)
    if (menor) {
      minimo(s, p)
      if (madrid && entero(e.diasAlta, "diasAlta", 0, 365) < 183)
        excluir("diasAlta", "Empleador sin183 días de alta")
      if (
        ids(p.progenitores, "progenitores").length > 1 &&
        entero(e.otroProgenitorDiasAlta, "otroProgenitorDiasAlta", 0, 365) <
          (madrid ? 183 : 1)
      )
        excluir(
          "otroProgenitorDiasAlta",
          "Otro progenitor sin actividad exigida"
        )
      if (!madrid && baseFamiliar(s).gt(34000))
        excluir("bases", "Unidad familiar>34000")
    } else {
      const grado = decimal(p.discapacidadPorcentaje, "discapacidadPorcentaje")
      const esPropio =
        p.relacion === "contribuyente" && p.id === s.contexto.contribuyente
      if (!madrid) {
        opcion(p.relacion, ["ascendiente"], "relacion")
        if (edad(p.nacimiento) <= 65)
          excluir("edad", "Conciliación mayores exige>65")
        renta(s, 34000)
        minimo(s, p)
      } else {
        if (
          grado.lt(33) &&
          (edad(p.nacimiento) <= 65 ||
            !["I", "II", "III"].includes(texto(p.dependencia, "dependencia")))
        )
          excluir("dependencia", "No es dependencia>65 ni discapacidad>=33")
        if (grado.gte(33))
          texto(p.certificadoDiscapacidad, "certificadoDiscapacidad")
        else texto(p.certificadoDependencia, "certificadoDependencia")
        if (!esPropio) {
          if (p.relacion === "conyuge" || p.relacion === "colateral_segundo") {
            if (
              convivencia(p) <= 183 ||
              dinero(p.rentasNoExentasEUR, "rentasNoExentasEUR", true).gt(8000)
            )
              excluir(
                "convivencia/rentas",
                "Cónyuge/colateral requiere>183 días y renta<=8000"
              )
          } else minimo(s, p)
          if (entero(e.diasAlta, "diasAlta", 0, 365) < 183)
            opcion(
              e.prestacionesTipo,
              [
                "desempleo",
                "pension_ss",
                "clases_pasivas",
                "mutualidad_analoga",
              ],
              "prestacionesTipo"
            )
        }
      }
    }
    if (madrid && entero(e.horasMes, "horasMes", 0, 744) < 40)
      excluir("horasMes", "Servicio inferior a40 horas/mes")
    const cuantia = sumaPagos(
      pp.filter((p) => p.objetoId === e.trabajador && p.mes === mes)
    )
    if (menor) {
      hijos = hijos.plus(cuantia)
      usadosHijos.add(texto(e.trabajador, "trabajador"))
    } else {
      mayores = mayores.plus(cuantia)
      usadosMayores.add(texto(e.trabajador, "trabajador"))
    }
  }
  if (
    pp.some(
      (p) =>
        !empleados.some((e) => e.trabajador === p.objetoId && e.mes === p.mes)
    )
  )
    falta("pago.objetoId/mes", "Cuota no conciliada con empleo-mes")
  if (madrid) {
    const fn = numerosa(s) !== "no_numerosa"
    return salida(
      s,
      D.min(
        fn ? "618.60" : "463.95",
        hijos.plus(mayores).times(fn ? "0.40" : "0.25")
      ),
      ["Mes, persona cuidada y cuotas SS sin doble aplicación"]
    )
  }
  if ([...usadosHijos].some((id) => usadosMayores.has(id)))
    falta(
      "trabajador",
      "Ambas deducciones murcianas requieren empleados distintos"
    )
  return salida(
    s,
    D.min(400, hijos.times("0.20")).plus(D.min(400, mayores.times("0.20"))),
    ["Máximo400 por rama;800 sólo con personas contratadas distintas"]
  )
}
