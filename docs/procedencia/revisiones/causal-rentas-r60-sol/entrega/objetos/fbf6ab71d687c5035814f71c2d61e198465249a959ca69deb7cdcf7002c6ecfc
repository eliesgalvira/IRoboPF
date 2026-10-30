import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import assert from "node:assert/strict"
import {
  composeRentasR36,
  verifyRentasR36,
  activity,
  work,
  sitesR36,
} from "./flujo-rentas-r36.mjs"
import {
  consumeGeneralRentas,
  consumeExplicitRentas,
  executeRentasFinite,
} from "./flujo-rentas-r36-consumidor.mjs"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const ts = require("typescript"),
  Decimal = require("decimal.js").Decimal
// Contraste TS separado: carga fuentes locales; dependencias de terceros solo lectura.
function loadTs(file, cache = new Map()) {
  file = path.resolve(file)
  if (cache.has(file)) return cache.get(file)
  const exports = {}
  cache.set(file, exports)
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText
  new Function("require", "exports", js)(
    (name) =>
      name.startsWith(".")
        ? loadTs(path.resolve(path.dirname(file), name) + ".ts", cache)
        : require(name),
    exports
  )
  return exports
}
function fixture(file, name) {
  const text = fs.readFileSync(file, "utf8"),
    ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  const matches = []
  function visit(n) {
    if (
      (ts.isFunctionDeclaration(n) || ts.isVariableDeclaration(n)) &&
      n.name?.getText() === name
    )
      matches.push(n)
    ts.forEachChild(n, visit)
  }
  visit(ast)
  const found = matches[0]
  assert(found)
  const js = ts.transpileModule(
    (ts.isVariableDeclaration(found) ? "const " : "") +
      found.getText() +
      "\nreturn " +
      name,
    { compilerOptions: { target: ts.ScriptTarget.ES2022 } }
  ).outputText
  return new Function(js)()
}
export function runRentasSuite() {
  const f = composeRentasR36(),
    cases = []
  const executions = []
  let activeCase = "setup"
  const execute = (name, args) => {
    const r = executeRentasFinite(
      f,
      f.roots[name] ??
        f.globalBindings.find((b) => b.name.endsWith(":" + name))?.name,
      args,
      false
    ).result
    executions.push(
      JSON.parse(
        JSON.stringify({
          case: activeCase,
          entry: name,
          input: args,
          result: r,
        })
      )
    )
    return r
  }
  const check = (id, fn) => {
    try {
      activeCase = id
      fn()
      cases.push({ id, status: "pass" })
    } catch (e) {
      cases.push({ id, status: "fail", error: String(e), stack: e.stack })
    }
  }
  const base = fixture("tests/actividades-economicas-2025.test.ts", "casoBase"),
    income = fixture("tests/actividades-economicas-2025.test.ts", "ingreso"),
    expense = fixture("tests/actividades-economicas-2025.test.ts", "gasto"),
    asset = fixture("tests/actividades-economicas-2025.test.ts", "activo")
  const tsActivity = loadTs(activity).calcularActividad2025,
    tsWork = loadTs(work)
  const runActivity = (c) => execute("calcularActividad2025", [c])
  const amounts = (r) =>
    Object.fromEntries(r.etapas.map((e) => [e.id, e.importe]))
  check("IR-20-19", () => {
    assert.deepEqual(
      f.outputs.map((s) => s.siteId).sort(),
      [...sitesR36].sort()
    )
    assert.equal(f.stages.length, 19)
    assert(f.stages.every((s) => s.valueNode))
    verifyRentasR36(f)
  })
  for (const amount of ["0", "1000", "10000", "20000"])
    for (const option of ["gastos-dificiles", "cliente-unico"])
      check("contraste-TS-EDS-" + amount + "-" + option, () => {
        const c = base()
        c.ingresos = [income(amount, true)]
        c.opcion = option
        assert.deepEqual(runActivity(c), tsActivity(c))
      })
  check("cuota-vs-saldo-independiente", () => {
    const c = base()
    c.ingresos = [income("10000", true)]
    c.activos = [asset()]
    c.aplicarRentasBajas = false
    const r = runActivity(c),
      a = amounts(r)
    assert.equal(a.pc, "260")
    assert.equal(a["pc:saldo"], "740")
    assert.equal(a.amortizacion, "260")
    assert.equal(a.P, "9740")
    assert.equal(f.stages[0].annualReachable, false)
    assert.equal(f.stages[1].annualReachable, false)
  })
  check("colecciones-indices-campos-iguales", () => {
    const c = base()
    c.ingresos = [income("1000", false, "f1"), income("1000", false, "f2")]
    c.gastos = [expense("100")]
    c.reta = [
      {
        id: "r1",
        justificante: "jr1",
        fecha: "2025-06-01",
        importe: "100",
        tipo: "ordinaria",
        propia: true,
        efectiva: true,
        periodo: "2025-06",
      },
    ]
    c.aplicarRentasBajas = false
    const a = amounts(runActivity(c))
    assert.equal(a["ingreso:f1"], "1000")
    assert.equal(a["ingreso:f2"], "1000")
    assert.equal(a.gastos, "100")
    assert.equal(a.reta, "100")
    assert.equal(a.P, "1800")
    c.reta[0].importe = "101"
    const b = amounts(runActivity(c))
    assert.equal(b.gastos, "100")
    assert.equal(b.P, "1799")
    assert.equal(b.ingresos, "2000")
  })
  check("perdida-sin-suelo", () => {
    const c = base()
    c.ingresos = [income("1000")]
    c.gastos = [expense("2000")]
    assert.equal(runActivity(c).aporte.importeEurosExactos, "-1000")
  })
  for (const degree of [0, 33, 65])
    check("discapacidad-" + degree, () => {
      const c = base()
      c.ingresos = [income("10000", true)]
      c.opcion = "cliente-unico"
      c.discapacidad.grado = degree
      assert.equal(
        amounts(runActivity(c)).discapacidad,
        degree === 0 ? "0" : degree === 33 ? "3500" : "7750"
      )
    })
  check("inicio-empleador", () => {
    const c = base()
    c.ingresos = [income("10000")]
    c.aplicarRentasBajas = false
    c.aplicarInicio = true
    assert.equal(amounts(runActivity(c)).reduccionInicio, "1900")
    c.clientes[0].empleadorEnAnioAnteriorAlInicio = true
    assert.equal(amounts(runActivity(c)).reduccionInicio, "0")
  })
  check("rechazo-cliente-70", () => {
    const c = base()
    c.ingresos = [income("10000", false)]
    c.opcion = "cliente-unico"
    assert.equal(runActivity(c).estado, "no-soportado")
  })
  check("pagos-retenciones-separadas", () => {
    const c = base()
    c.ingresos = [income("10000", true)]
    c.aplicarRentasBajas = false
    c.retenciones = [
      {
        id: "r",
        justificante: "cert",
        fecha: "2025-06-01",
        operacionId: "or",
        ingresoId: "factura",
        importe: "500",
        efectiva: true,
      },
    ]
    c.pagosFraccionados = [
      {
        id: "p",
        justificante: "pago",
        fecha: "2025-07-20",
        operacionId: "op",
        periodo: "2025-2T",
        modelo: "130",
        importe: "500",
        efectivo: true,
      },
    ]
    const a = amounts(runActivity(c))
    assert.equal(a.retenciones, "500")
    assert.equal(a.pagos, "500")
    assert.equal(a.ingresos, "10000")
    c.retenciones[0].importe = "501"
    const b = amounts(runActivity(c))
    assert.equal(b.pagos, "500")
    assert.equal(b.aporteBIG, a.aporteBIG)
    c.retenciones[0].efectiva = false
    assert.equal(runActivity(c).estado, "no-soportado")
  })
  const workInput = fixture("tests/trabajo-anual-contratos.test.ts", "gastos")
  check("gastos-efectivos-agregados", () => {
    const c = workInput()
    c.rendimientos = [
      structuredClone(c.rendimientos[0]),
      structuredClone(c.rendimientos[0]),
    ]
    c.rendimientos[1].id = "otro"
    for (const r of c.rendimientos) {
      r.integro = "10000"
      r.cotizaciones.seguridadSocial = "1200"
      r.colegio.importe = "400"
      r.colegio.satisfecho = "si"
      r.colegio.obligatorio = "si"
      r.colegio.finesEsenciales = "si"
      r.defensa.importe = "200"
      r.defensa.satisfecho = "si"
      r.defensa.litigioDirectoPagador = "si"
    }
    const a = execute("calcularGastosTrabajo", [c])
    assert.equal(a.gastosAE, "3200")
    assert.deepEqual(a, tsWork.calcularGastosTrabajo(c))
  })
  check("trabajo-negativo-efectivo", () => {
    const c = workInput()
    c.rendimientos[0].integro = "100"
    c.rendimientos[0].cotizaciones.seguridadSocial = "150"
    const a = execute("calcularGastosTrabajo", [c])
    assert.equal(a.netoArt19, "-50")
    assert.equal(a.generalesAplicados, "0")
    c.rendimientos[0].cotizaciones.clase = "estimadas"
    assert.equal(execute("calcularGastosTrabajo", [c]).estado, "no-soportado")
  })
  for (const [year, p, o, death, expected] of [
    [2025, "16000", "6500", null, "5293"],
    [2025, "16000", "6500.01", null, "0"],
    [2014, "10000", "6501", null, "2652"],
    [2018, "12000", "0", "2018-07-04", "2832.8125"],
    [2018, "12000", "0", "2018-07-05", "4198.90625"],
  ])
    check("art20-" + year + "-" + o + "-" + death, () => {
      const args = {
        anio: year,
        rendimientoPrevioNeto: new Decimal(p),
        otrasRentasNoExentas: new Decimal(o),
        fechaFallecimiento: death ? new Date(death) : undefined,
      }
      assert.equal(
        execute("calcularReduccionTrabajoConOtrasRentas", [args]).toFixed(),
        expected
      )
    })
  check("DA61-cuota-atribuible", () => {
    const c = {
      regla: "da61",
      ambito: "comun-individual",
      ejercicio: 2025,
      brutoServicios: "17000",
      otrasRentasNoExentas: "0",
      netoReducidoServicios: "1000",
      baseLiquidableGeneral: "4000",
      cuotaIntegraGeneral: "800",
      cuotaLiquidaTotal: "250",
      cuotaTrasArt80: "200",
      etapa: "despues-art80-sin-deduccion-trabajo",
      calificacion: "laboral-estatutaria-acreditada",
    }
    const a = execute("calcularDeduccionTrabajo", [c])
    assert.equal(a.deduccionLegal, "255.2")
    assert.equal(a.limiteAtribuible, "200")
    assert.equal(a.importeAplicable, "200")
    assert.deepEqual(a, tsWork.calcularDeduccionTrabajo(c))
    c.baseLiquidableGeneral = "0"
    c.netoReducidoServicios = "0"
    assert.equal(execute("calcularDeduccionTrabajo", [c]).importeAplicable, "0")
  })
  check("art80bis-porcentaje", () => {
    const c = {
      regla: "art80bis",
      ambito: "comun-individual",
      computo: "netos-tras-art20-art32-sin-exterior-no-gravado",
      ejercicio: 2014,
      baseImponible: "9000",
      tipoMedioEstatalPorcentaje: "10",
      tipoMedioAutonomicoPorcentaje: "5",
      rendimientoComputableTrabajoActividad: "1000",
      cuotaTrasArt80: "200",
      etapa: "despues-art80-sin-deduccion-trabajo",
    }
    const a = execute("calcularDeduccionTrabajo", [c])
    assert.equal(a.deduccionLegal, "300")
    assert.equal(a.importeAplicable, "150")
  })
  check("transporte-decimal", () => {
    const r = execute("crearLineaCalculo", [
      {
        siteId: "candidato",
        instancia: 3,
        importe: new Decimal("1.23456789"),
        unidad: "EUR",
        etiqueta: "e",
        formula: "f",
      },
    ])
    assert.equal(r.origen.decimal, "1.23456789")
    assert.equal(r.origen.instanceId, "candidato.3")
    assert.equal(r.resultado, "1.23 euros")
  })
  for (const key of ["unit", "argument4", "callback"])
    check("rechazo-contractual-" + key, () => {
      const c = structuredClone(f)
      if (key === "unit") c.outputs[0].unit = "centimos"
      else if (key === "argument4")
        c.stages[0].argument4 = c.stages[1].argument4
      else c.collections[0].callback = c.collections[1].callback
      assert.throws(() => verifyRentasR36(c))
    })

  check("general-centimos-SS-otras-rentas", () => {
    const caso = {
      anio: 2025,
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 2000000 }],
        capitalInmobiliario: [{ importeIntegroCentimos: 700000 }],
        gananciasPatrimoniales: [
          {
            importeGananciaCentimos: -100000,
            tratamientoMayores65: { _tag: "SinExencionMayores65" },
          },
        ],
      },
      situacionFamiliar: { edad: 40 },
    }
    const calls = []
    const boundaries = {
      "boundary:calcularDesgloseCotizacionesPerfilUniforme": (x) => {
        calls.push(["canonical", x])
        return { cotizacionTrabajador: new Decimal(4000) }
      },
      "boundary:calcularDesgloseCotizacionesSocialesLegacy": (x) => {
        calls.push(["legacy", x])
        return { cotizacionTrabajador: new Decimal(3000) }
      },
    }
    const r = consumeGeneralRentas(f, caso, { modo: "canonico" }, boundaries)
    const a = Object.fromEntries(
      r.lines.map((l) => [l.origen.siteId, l.origen.decimal])
    )
    assert.equal(a["anual.trabajo.integro"], "20000")
    assert.equal(a["anual.trabajo.previo-neto"], "16000")
    assert.equal(a["anual.trabajo.neto"], "14000")
    assert.equal(a["anual.trabajo.reduccion"], "5293")
    assert.equal(a["anual.inmobiliario.neto"], "7000")
    assert.equal(calls[0][0], "canonical")
    assert.equal(calls[0][1].salarioBrutoAnual.toFixed(), "20000")
    assert.equal(
      r.bindings.find((b) => b[0] === "otrasRentasNoExentas")[1].toFixed(),
      "6000"
    )
    consumeGeneralRentas(f, caso, { modo: "compatible-legacy" }, boundaries)
    assert.equal(calls[1][0], "legacy")
  })
  check("exenciones-edad-anio-perdida", () => {
    const run = (year, age, gain, tag) =>
      execute("calcularGananciasPatrimonialesPorTransmision", [
        {
          anio: year,
          edadContribuyente: age,
          ganancias: [
            { importeGananciaCentimos: gain, tratamientoMayores65: tag },
          ],
          convertirCentimos: (c) => new Decimal(c).div(100),
        },
      ])
    assert.equal(
      run(2014, 65, 100000, {
        _tag: "ViviendaHabitualMayores65",
      }).gananciaExenta.toFixed(),
      "1000"
    )
    assert.equal(
      run(2025, 64, 100000, {
        _tag: "ViviendaHabitualMayores65",
      }).gananciaExenta.toFixed(),
      "0"
    )
    assert.equal(
      run(2025, 65, -100000, {
        _tag: "ViviendaHabitualMayores65",
      }).gananciaSujetaAhorro.toFixed(),
      "-1000"
    )
    const tag = {
      _tag: "ReinversionRentaVitaliciaMayores65",
      importeReinvertidoRentaVitaliciaCentimos: 1000000,
      importeTransmisionCentimos: 2000000,
      reinversionesPreviasRentaVitaliciaCentimos: 23500000,
    }
    assert.equal(run(2014, 65, 100000, tag).gananciaExenta.toFixed(), "0")
    assert.equal(run(2015, 65, 100000, tag).gananciaExenta.toFixed(), "250")
  })
  const common = {
    ejercicio: 2025,
    comunidadAutonoma: "madrid",
    edad: 40,
    modalidad: "individual",
    residenciaTodoElAnio: true,
    devengo: "2025-12-31",
    otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "ninguno",
    discapacidad: "ninguna",
    reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno",
    deducciones: "solo-da61-si-procede",
    rentasExtranjeras: "ninguna",
    especialidades: "ninguna",
  }
  check("conexion-anual-rechaza-activos-y-mezclas", () => {
    const c = base()
    c.activos = [asset()]
    assert.equal(
      consumeExplicitRentas(f, {
        ...common,
        perfil: "solo-actividad-eds",
        actividad: c,
      }).status,
      "fail"
    )
    const w = workInput()
    w.rendimientos.push({
      ...structuredClone(w.rendimientos[0]),
      id: "pension",
      clase: "pension",
    })
    assert.equal(
      consumeExplicitRentas(f, {
        ...common,
        perfil: "solo-trabajo",
        trabajo: w,
        conciliacion: {
          ejercicio: 2025,
          estado: "totales-anuales-sin-duplicados",
          procedencia: ["declarado"],
        },
        retenciones: [],
      }).status,
      "fail"
    )
  })
  check("conexion-anual-etapas-por-instancia", () => {
    const c = base()
    c.ingresos = [income("10000")]
    c.aplicarRentasBajas = false
    const b = {
      "boundary:obtenerParametrosComunidadAutonoma": () => ({
        escalaEstatalGeneral: "estatal",
        escalaAutonomica: { tramos: "autonomica" },
        minimosAutonomicos: { contribuyente: { general: new Decimal(5000) } },
      }),
      "boundary:obtenerEscalaAutonomicaPublicada": () => undefined,
      "boundary:MINIMOS_ESTATALES_2025": {
        contribuyente: { general: new Decimal(5000) },
      },
      "boundary:calcularCuotaPorEscala": ({ base }) => base.times("0.1"),
    }
    const r = consumeExplicitRentas(
      f,
      { ...common, perfil: "solo-actividad-eds", actividad: c },
      b
    )
    assert.equal(r.status, "success", JSON.stringify(r))
    assert.equal(r.result.cuotaDiferencial, "900")
    const a = runActivity(c)
    const lines = r.result.rastro.pasos[0].lineasCalculo
    assert.deepEqual(
      lines.map((l) => l.origen.decimal),
      a.etapas.map((e) => e.importe)
    )
    assert.deepEqual(
      lines.map((l) => l.origen.instanceId),
      a.etapas.map((_, i) => "anual.explicito.actividad.etapa." + i)
    )
    assert(!a.etapas.some((e) => e.id === "discapacidad"))
  })

  check("diecinueve-instancias-aisladas", () => {
    const c = base()
    c.ingresos = [income("10000", true)]
    c.gastos = [expense("100")]
    c.reta = [
      {
        id: "r",
        justificante: "jr",
        fecha: "2025-06-01",
        importe: "100",
        tipo: "ordinaria",
        propia: true,
        efectiva: true,
        periodo: "2025-06",
      },
    ]
    c.activos = [asset()]
    c.opcion = "cliente-unico"
    const r = runActivity(c)
    assert.equal(r.etapas.length, 19)
    assert.deepEqual(r, tsActivity(c))
    assert.deepEqual(
      r.etapas.map((e) => e.id),
      [
        "pc",
        "pc:saldo",
        "ingreso:factura",
        "gasto:gasto",
        "reta:r",
        "ingresos",
        "gastos",
        "reta",
        "amortizacion",
        "P",
        "G",
        "RN",
        "adicional",
        "discapacidad",
        "reduccion32_2",
        "reduccionInicio",
        "aporteBIG",
        "retenciones",
        "pagos",
      ]
    )
  })
  check("DA37-y-aniversario-estricto", () => {
    const g = {
      importeGananciaCentimos: 100000,
      tratamientoMayores65: { _tag: "SinExencionMayores65" },
      exencionInmuebleUrbanoAdquirido2012: {
        fechaAdquisicion: "2012-05-12",
        inmuebleUrbano: true,
        tituloOneroso: true,
        operacionConPersonaOEntidadVinculada: false,
      },
      fechaAdquisicion: "2012-05-12",
      fechaTransmision: "2013-05-12",
    }
    const run = () =>
      execute("calcularGananciasPatrimonialesPorTransmision", [
        {
          anio: 2013,
          edadContribuyente: 40,
          ganancias: [g],
          convertirCentimos: (c) => new Decimal(c).div(100),
        },
      ])
    assert.equal(run().gananciaExenta.toFixed(), "500")
    assert.equal(run().gananciaSujetaGeneral.toFixed(), "500")
    g.fechaTransmision = "2013-05-13"
    assert.equal(run().gananciaSujetaAhorro.toFixed(), "500")
    g.exencionInmuebleUrbanoAdquirido2012.fechaAdquisicion = "2012-05-11"
    assert.equal(run().gananciaExenta.toFixed(), "0")
  })
  check("coleccion-vacia-identidad-cero", () => {
    const c = base()
    const r = runActivity(c)
    const a = amounts(r)
    for (const id of [
      "ingresos",
      "gastos",
      "reta",
      "amortizacion",
      "P",
      "G",
      "RN",
      "reduccion32_2",
      "reduccionInicio",
      "aporteBIG",
      "retenciones",
      "pagos",
    ])
      assert.equal(a[id], "0")
    assert.equal(r.etapas.length, 12)
    assert(f.outputs.every((o) => o.valueNode))
  })

  check("conexion-trabajo-cinco-propiedades-y-pagos-reales", () => {
    const c = workInput()
    c.rendimientos[0].integro = "20000"
    c.rendimientos[0].cotizaciones.seguridadSocial = "1200"
    const b = {
      "boundary:obtenerParametrosComunidadAutonoma": () => ({
        escalaEstatalGeneral: "e",
        escalaAutonomica: { tramos: "a" },
        minimosAutonomicos: { contribuyente: { general: new Decimal(5000) } },
      }),
      "boundary:obtenerEscalaAutonomicaPublicada": () => undefined,
      "boundary:MINIMOS_ESTATALES_2025": {
        contribuyente: { general: new Decimal(5000) },
      },
      "boundary:calcularCuotaPorEscala": ({ base }) => base.times("0.1"),
    }
    const input = {
      ...common,
      perfil: "solo-trabajo",
      trabajo: c,
      conciliacion: {
        ejercicio: 2025,
        estado: "totales-anuales-sin-duplicados",
        procedencia: ["fuente"],
      },
      retenciones: [
        {
          operacionId: "op1",
          procedencia: "certificado",
          ejercicio: 2025,
          importe: "333",
          efectiva: true,
        },
      ],
    }
    const r = consumeExplicitRentas(f, input, b)
    assert.equal(r.status, "success", JSON.stringify(r))
    const lines = Object.fromEntries(
      r.result.rastro.pasos
        .flatMap((p) => p.lineasCalculo)
        .map((l) => [l.origen.siteId, l.origen.decimal])
    )
    assert.equal(lines["anual.explicito.trabajo.integro"], "20000")
    assert.equal(lines["anual.explicito.trabajo.gastos-a-e"], "1200")
    assert.equal(lines["anual.explicito.trabajo.gasto-f"], "2000")
    assert.equal(lines["anual.explicito.trabajo.art19"], "16800")
    assert.equal(lines["anual.explicito.retenciones"], "333")
    assert.equal(lines["anual.explicito.pagos"], "0")
    assert.equal(
      new Decimal(lines["anual.explicito.diferencial"])
        .plus(333)
        .plus(lines["anual.explicito.da61"])
        .toFixed(),
      r.result.cuotaLiquidaLegal
    )
    input.retenciones[0].efectiva = false
    assert.equal(consumeExplicitRentas(f, input, b).status, "fail")
  })
  check("mutacion-semantica-G-sin-pin", () => {
    const c = base()
    c.ingresos = [income("20000")]
    c.gastos = [expense("4000")]
    c.aplicarRentasBajas = false
    const mutant = structuredClone(f)
    const ratio = mutant.program.find(
      (n) =>
        n.op === "literal" &&
        n.data.value === "0.05" &&
        n.source.file === activity &&
        n.source.start >= f.stages[10].argument4.start &&
        n.source.end <= f.stages[10].argument4.end
    )
    assert(ratio)
    ratio.data.value = "0.06"
    const r = executeRentasFinite(
      mutant,
      f.roots.calcularActividad2025,
      [c],
      false
    ).result
    const a = amounts(r)
    assert.equal(a.P, "16000")
    assert.equal(a.G, "960")
    assert.equal(a.RN, "15040")
    assert.equal(a.ingresos, "20000")
  })
  check("primitiva-default-destructuracion-array", () => {
    const synthetic = {
      globalBindings: [{ name: "probe", node: "f" }],
      program: [
        {
          id: "f",
          op: "function",
          args: ["read"],
          data: {
            parameters: [
              {
                binding: {
                  elements: [{ binding: { name: "x" }, default: "seven" }],
                },
                rest: false,
                default: null,
              },
            ],
          },
        },
        { id: "seven", op: "literal", args: [], data: { value: 7 } },
        { id: "read", op: "local", args: [], data: { name: "x" } },
      ],
    }
    const r = executeRentasFinite(
      synthetic,
      "probe",
      [[undefined]],
      false
    ).result
    assert.equal(r, 7)
  })
  return {
    fragment: f,
    executions,
    cases,
    passed: cases.filter((c) => c.status === "pass").length,
    failed: cases.filter((c) => c.status === "fail").length,
    scope:
      "Expectativas independientes y contraste TS etiquetado; no aceptación fiscal",
  }
}
