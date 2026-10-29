import { calcularDerechosMinimos } from "/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef/lib/dominio/irpf/minimos/derechos"
import {MINIMOS_ESTATALES_2025, obtenerMinimosAutonomicosIrpf2025} from "/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef/lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import type {
  DerechosMinimos2025,
  DescendienteDerechos,
  TitularDescendiente,
} from "/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef/lib/dominio/irpf/minimos/derechos-contrato"
import { sinDiscapacidad, type CasoFiscalAnual } from "/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef/lib/dominio/irpf/caso-fiscal-anual"
import { liquidarIrpfAnualConDerechos, liquidarIrpfAnual } from "/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

const titular = (
  titularId = "s-1",
  rentasNoExentasCentimos = 2605600,
  grado = 1
): TitularDescendiente => ({
  titularId,
  grado,
  rentasNoExentasCentimos,
  vinculo: { clase: "consanguinidad" },
  relacion: "convivencia",
  custodia: "no-procede",
  alimentosJudiciales: false,
  aplicaEspecialidadAlimentos: false,
  residenteIrpf: true,
})
const hijo = (
  titulares = [titular()],
  fechaNacimiento = "2017-12-31"
): DescendienteDerechos => ({
  sujetoId: "s-3",
  fechaNacimiento,
  edadDevengo: 2025 - Number(fechaNacimiento.slice(0, 4)),
  vivoAlDevengo: true,
  rentasNoExentasCentimos: 0,
  declaracion: { modalidad: "no-presenta" },
  discapacidad: sinDiscapacidad,
  titulares,
  titularesCompletos: true,
})
const hechos = (descendiente: DescendienteDerechos): DerechosMinimos2025 => ({
  ejercicio: 2025,
  territorio: "madrid",
  regimen: "comun",
  modalidad: "individual",
  devengo: "2025-12-31",
  contribuyenteId: "s-1",
  edadContribuyenteDevengo: 40,
  discapacidadContribuyente: sinDiscapacidad,
  ascendientes: "ninguno",
  fallecimientosEnElEjercicio: "ninguno",
  descendientesCompletos: true,
  conciliacionRentasContribuyente: {
    perfil: "caso-anual-parcial",
    otrasRentasOGastosNoRepresentados: "ninguno",
  },
  descendientes: [descendiente],
})
const casoAnual = (
  derechosMinimos: DerechosMinimos2025,
  bruto = 3000000,
  ganancia = 0
): CasoFiscalAnual & {derechosMinimos: DerechosMinimos2025} =>
  ({
    anio: 2025,
    comunidadAutonoma: "madrid",
    derechosMinimos,
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: sinDiscapacidad,
      descendientes: [],
      ascendientes: [],
    },
    rendimientos: {
      trabajo: [{ importeIntegroCentimos: bruto }],
      gananciasPatrimoniales: [
        {
          importeGananciaCentimos: ganancia,
          tratamientoMayores65: { _tag: "SinExencionMayores65" },
        },
      ],
    },
    reducciones: [],
    deducciones: [],
    retencionesSoportadasCentimos: 0,
    pagosACuentaCentimos: 0,
  })

const anual = (...args: Parameters<typeof casoAnual>) => liquidarIrpfAnualConDerechos(casoAnual(...args))
const falloAlimentos = (h: DerechosMinimos2025) => {
  const r = Effect.runSync(Effect.result(anual(h)))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) {
    expect(r.failure._tag).toBe("ResultadoNoSoportado")
    expect(r.failure.motivo).toBe("El tratamiento de alimentos propios sin derecho al mínimo está pendiente y queda fuera del alcance anual actual")
    expect(JSON.stringify(r.failure)).not.toMatch(/\bs-(?:1|2|3|4)\b/)
    expect(r.failure.motivo).not.toContain("necesita resolver la especialidad")
  }
}
for (const custodia of ["exclusiva", "compartida", "sin-custodia"] as const) {
  for (const alimentosJudiciales of [true, false]) {
    for (const causa of ["renta", "declaracion"] as const) {
      for (const delta of [-1, 0, 1]) {
        const limite = causa === "renta" ? 800000 : 180000
        it(`matriz ${custodia} alimentos ${alimentosJudiciales} ${causa} ${delta}`, () => {
          const d: DescendienteDerechos = {
            ...hijo([{...titular(), custodia, alimentosJudiciales, relacion: custodia === "sin-custodia" ? "dependencia-economica" : "convivencia"}]),
            rentasNoExentasCentimos: limite + delta,
            declaracion: causa === "renta" ? {modalidad:"no-presenta"} : {modalidad:"individual",rentasCentimos:limite+delta},
          }
          const h = hechos(d)
          if (alimentosJudiciales && (delta > 0 || custodia === "sin-custodia")) falloAlimentos(h)
          else {
            const r = Effect.runSync(anual(h))
            expect(r.rendimientoNetoTrabajoCentimos).toBe(2605600)
            expect(JSON.stringify(r.rastro)).not.toMatch(/\bs-(?:1|2|3|4)\b/)
          }
        })
      }
    }
  }
}
for (const delta of [-1, 0, 1]) {
  it(`grado propio lejano frente a próximo renta ${800000+delta}`, () => {
    const d = hijo([{...titular(),grado:2,custodia:"compartida",alimentosJudiciales:true}, {...titular("s-2",800000+delta),custodia:"compartida"}])
    if(delta > 0) falloAlimentos(hechos(d))
    else expect(Effect.runSync(anual(hechos(d))).cuotaMinimoPersonalCentimos).toBe(148051)
  })
}
for (const edad of [24,25,26]) {
  for (const discap of [false,true]) {
    it(`edad ${edad} discapacidad ${discap}`, () => {
      const d: DescendienteDerechos = {...hijo([{...titular(),custodia:"compartida",alimentosJudiciales:true}],`${2025-edad}-01-01`),discapacidad:discap ? {_tag:"Discapacidad65OMas"}:sinDiscapacidad}
      if (edad >=25 && !discap) falloAlimentos(hechos(d))
      else expect(Effect.runSync(anual(hechos(d)))._tag).toBe("LiquidacionIrpfAnualCalculada")
    })
  }
}
for (const orden of [false,true]) {
  it(`dos hijos con orden invertido ${orden}`, () => {
    const d = {...hijo([{...titular(),custodia:"exclusiva",alimentosJudiciales:true}]),rentasNoExentasCentimos:800001}
    const otro = {...hijo(),sujetoId:"s-4",fechaNacimiento:"2020-01-01",edadDevengo:5}
    falloAlimentos({...hechos(d),descendientes:orden ? [otro,d]:[d,otro]})
  })
}
for (const aplica of [false,true]) {
  it(`hechos de otro titular flag ${aplica}, sin mínimo propio`, () => {
    const d = {...hijo([{...titular(),custodia:"exclusiva"},{...titular("s-2"),custodia:"sin-custodia",relacion:"dependencia-economica",alimentosJudiciales:true,aplicaEspecialidadAlimentos:aplica}]),rentasNoExentasCentimos:800001} satisfies DescendienteDerechos
    expect(Effect.runSync(anual(hechos(d)))._tag).toBe("LiquidacionIrpfAnualCalculada")
  })
}
it.each([2605000,3000000,0])("renta propia incorrecta %s se distingue de exclusión", (renta) => {
  const h=hechos(hijo([titular("s-1",renta)]))
  const r=Effect.runSync(Effect.result(anual(h)))
  expect(Result.isFailure(r)).toBe(true)
  if(Result.isFailure(r)) expect(r.failure.motivo).toContain("renta propia")
})
it("API pública general también devuelve error tipado", () => {
 const d={...hijo([{...titular(),custodia:"exclusiva",alimentosJudiciales:true}]),rentasNoExentasCentimos:800001} satisfies DescendienteDerechos
 const r=Effect.runSync(Effect.result(liquidarIrpfAnual(casoAnual(hechos(d)),{modo:"canonico"})))
 expect(Result.isFailure(r)).toBe(true)
 if(Result.isFailure(r)) expect(r.failure.motivo).toContain("tratamiento de alimentos propios")
})
for (const invalid of [
  {...hijo(),titulares:[]},
  {...hijo(),rentasNoExentasCentimos:NaN},
  {...hijo(),fechaNacimiento:"2025-02-30"},
  {...hijo(),titulares:[{...titular(),custodia:"exclusiva",relacion:"ninguna"}]},
  {...hijo(),titulares:[{...titular(),alimentosJudiciales:true,aplicaEspecialidadAlimentos:true,custodia:"compartida"}]},
  {...hijo(),titulares:[{...titular(),custodia:"exclusiva"},{...titular("s-2"),custodia:"compartida"}]},
] satisfies DescendienteDerechos[]) {
  it(`estructura inválida no causa Die: ${JSON.stringify(invalid)}`, () => {
    const r = Effect.runSync(Effect.result(anual(hechos(invalid))))
    expect(Result.isFailure(r)).toBe(true)
    if (Result.isFailure(r)) {
      expect(r.failure._tag).toBe("ResultadoNoSoportado")
      expect(r.failure.motivo).not.toBe("El tratamiento de alimentos propios sin derecho al mínimo está pendiente y queda fuera del alcance anual actual")
    }
  })
}

it("helper aislado conserva cero por hijo no elegible sin aplicar exclusión anual", () => {
 const d={...hijo([{...titular(),custodia:"exclusiva",alimentosJudiciales:true}]),rentasNoExentasCentimos:800001} satisfies DescendienteDerechos
 const r=Effect.runSync(calcularDerechosMinimos(hechos(d),MINIMOS_ESTATALES_2025))
 expect(r.descendientes.toNumber()).toBe(0)
 expect(r.total.toNumber()).toBe(5550)
 falloAlimentos(hechos(d))
})
it("dos hijos elegibles: componentes estatal y autonómico separados en general y ahorro", () => {
 const h={...hechos(hijo([titular(),titular("s-2")])),descendientes:[hijo([titular(),titular("s-2")]),{...hijo([titular(),titular("s-2")]),sujetoId:"s-4",fechaNacimiento:"2020-01-01",edadDevengo:5}]}
 expect(Effect.runSync(calcularDerechosMinimos(h,MINIMOS_ESTATALES_2025)).total.toNumber()).toBe(8100)
 expect(Effect.runSync(calcularDerechosMinimos(h,obtenerMinimosAutonomicosIrpf2025("madrid"))).total.toNumber()).toBe(8693.49)
 expect(Effect.runSync(anual(h)).cuotaMinimoPersonalCentimos).toBe(150845)
 const ahorro={...h,descendientes:h.descendientes.map(d=>({...d,titulares:d.titulares.map(t=>({...t,rentasNoExentasCentimos:2000000}))}))}
 const r=Effect.runSync(anual(ahorro,0,2000000))
 expect(r.cuotaMinimoPersonalAhorroCentimos).toBe(164332)
 expect(r.cuotaMinimoPersonalCentimos).toBe(0)
})
