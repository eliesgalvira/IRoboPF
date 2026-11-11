import { createHash } from "node:crypto"
import { inflateSync } from "node:zlib"
import capturas from "./fixtures/revision-b05-capturas2024.json"
import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { HistoriaRenovablesMurcia2024 as Historia } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/murcia-renovables-historia-esquema"
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional, sumar } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { efectivo, agua } from "./revision-f-fixtures"
import { historia2024, renovables2024 } from "./murcia-renovables-origen2024-fixtures"

// Pruebas normales para ejecutar en raíz DESPUÉS de integrar candidato y parche.
// Expectativas anteriores preservadas por valor en previo; esta versión sustituye su prueba TS.
// No se extrapolan estas cinco observaciones a toda la anual ni se autentican documentos.
function canonical(solicitudes: readonly Solicitud[], edad=40, anio: 2025 | 2027=2025, bruto="50000") {
  const c: CasoFiscalAnual = { anio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1",
    situacionFamiliar: { tipo: "individual", edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [{ importeIntegroCentimos: Number(bruto)*100 }] }, reducciones: [], deducciones: [],
    retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: { solicitudes } }
  // Mutación deliberada para probar el límite de año sin falsear una conversión de tipos.
  Reflect.set(c, "anio", anio)
  return Effect.runSync(Effect.result(liquidarIrpfAnual(c, { modo: "canonico" })))
}
function explicit(solicitudes: readonly Solicitud[], edad=40, anio: 2025 | 2027=2025, bruto="50000") {
  const c=efectivo()
  const entrada = { ...c, edad, deduccionesTerritoriales2025: { solicitudes },
    conciliacion: { ...c.conciliacion }, trabajo: { ...c.trabajo,
      rendimientos: [{ ...c.trabajo.rendimientos[0], integro: bruto }] } }
  Reflect.set(entrada, "ejercicio", anio); Reflect.set(entrada, "devengo", `${anio}-12-31`)
  Reflect.set(entrada.conciliacion, "ejercicio", anio); Reflect.set(entrada.trabajo, "ejercicio", anio)
  return Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(entrada)))
}
for (const [name, run] of [["canonica",canonical],["explicita",explicit]] as const) describe(`B05 GRANT0 ${name}`,()=>{
  function book(s: readonly Solicitud[], bruto="50000") {
    const r=run(s,40,2025,bruto);expect(r._tag).toBe("Success")
    if(r._tag!=="Success")throw new Error(JSON.stringify(r.failure))
    const b=r.success.deduccionesTerritoriales2025
    if(b===undefined || !("completoEnRamasSolicitadas" in b))throw new Error("Sin libro F")
    expect(b.completoEnRamasSolicitadas).toBe(true)
    return b
  }
  // Observaciones oficiales PDF/SES contrastadas además con oráculo Fraction propio.
  it.each(capturas.rows)("O1 artefacto y resultado: $id",row=>{
    const h=historia2024(),r=h.trabajo.rendimientos[0]!
    const b=book([renovables2024({...h,factura:{...h.factura,importeEUR:row.input.cost},
      pagos:h.pagos.map(p=>({...p,importeEUR:row.input.cost})),
      trabajo:{...h.trabajo,rendimientos:[{...r,integro:row.input.gross,
        cotizaciones:{...r.cotizaciones,seguridadSocial:row.input.ss}}]}})])
    const o=row.observed
    expect(b.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({
      politica:"decimal80-casillas2024-centimos-half-up",generado:racional(o["2038"]),
      aplicado2024:racional(o["1055"]),saldoPorInsuficiencia2024:racional(o["2039"]),ultimoEjercicio:2026,
      liquidacion:{baseGeneral:racional(o["0505"]),cuotaAutonomica:racional(o["0533"]),cuotaEstatal:racional(o["0532"])}})
  })
  it("O2: ayuda sin régimen fiscal identificable no acredita origen sin otras rentas",()=>{
    const h=historia2024()
    const r=run([renovables2024({...h,ayudas:[{id:"ayuda-sin-programa",beneficiario:"s-1",instalacionId:"solar2024",
      fecha:"2024-07-01",importeEUR:"2000",soporte:"resolucion-sin-regimen"}]})])
    expect(r._tag).toBe("Failure")
  })
  const changes: readonly [string,(h:Historia)=>Historia][]=[
    ["familia de origen",h=>{ Reflect.set(h,"familia","desconocida"); return h }],
    ["otras rentas de origen",h=>{ Reflect.set(h,"otrasRentas","desconocidas"); return h }],
    ["identidad de instalador",h=>({...h,factura:{...h.factura,emisor:"otro"}})],
    ["operación bancaria",h=>({...h,pagos:[{...h.pagos[0]!,operacionId:"otra"}]})],
    ["pago en efectivo",h=>{ Reflect.set(h.pagos[0]!,"medio","efectivo"); return h }],
    ["fecha inexistente",h=>({...h,pagos:[{...h.pagos[0]!,fecha:"2024-06-31"}]})],
    ["factura fuera de origen",h=>({...h,factura:{...h.factura,fecha:"2023-12-31"}})],
    ["ayuda posterior",h=>{ Reflect.set(h.inventario,"ayudasPosteriores2024","desconocidas"); return h }],
    ["nueva inversión2025",h=>{ Reflect.set(h.inventario,"inversiones2025","existentes"); return h }],
    ["menor de edad2024",h=>({...h,nacimiento:"2007-01-01"})],
    ["saldo externo anidado",h=>{ Reflect.set(h.empleo,"saldo","1"); return h }],
  ]
  it.each(changes)("rechaza perfil incoherente: %s",(_n,f)=>expect(run([renovables2024(f(historia2024()))])._tag).toBe("Failure"))
  it("concilia edad2025",()=>expect(run([renovables2024()],41)._tag).toBe("Failure"))
  it.each(["eleccion2024","eleccion2025"] as const)("no_aplicar no genera saldo: %s",field=>{
    const h=historia2024();expect(run([renovables2024({...h,[field]:"no_aplicar"})])._tag).toBe("Failure")
  })
  it("cap: invertir20000 no transporta el exceso sobre7000",()=>{
    // Control de tope sin ayudas; el régimen RD477 se comprueba por separado.
    const h=historia2024(),b=book([renovables2024({...h,factura:{...h.factura,importeEUR:"20000"},
      pagos:[{...h.pagos[0]!,importeEUR:"20000"}]})])
    expect(b.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({generado:racional("7000"),
      excesoSobreTope:racional("3000"),saldoPorInsuficiencia2024:racional("4705.1")})
  })
  it("dos órdenes conservan generación y no la regeneran2025",()=>{
    for(const s of [[renovables2024(),agua()],[agua(),renovables2024()]]){
      const b=book(s),a=b.aplicaciones.find(x=>x.codigo===renovables2024().codigo)!
      expect(b.ordenAplicado).toEqual([agua().codigo,renovables2024().codigo])
      expect(a).not.toHaveProperty("generado")
      const h=a.saldoHistoricoRenovablesMurcia!
      expect(sumar(sumar(h.origen.aplicado2024,h.aplicado2025),h.pendiente2025)).toEqual(h.origen.generado)
      expect(h.origen.ultimoEjercicio).toBe(2026)
      if(a.arrastre !== undefined)expect(a.arrastre.ultimoEjercicio).toBe(2026)
    }
  })
  const concesion={norma:"Real Decreto 477/2021",programa:4,referencia:"RD477-revision",autoridad:"CARM",
    fecha:"2024-06-01",beneficiario:"s-1",instalacionId:"solar2024"} as const
  function aid(h:Historia, value="2000"):Historia {
    return {...h,ayudas:[{id:"a-revision",beneficiario:"s-1",instalacionId:"solar2024",fecha:"2024-07-01",
      importeEUR:value,soporte:"resolucion-revision",concesion}]}
  }
  it("O2: concesión nominal RD477 programa4 reduce inversión sin alterar base",()=>{
    const b=book([renovables2024(aid(historia2024()))])
    expect(b.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({inversionNeta:racional("8000"),
      generado:racional("4000"),saldoPorInsuficiencia2024:racional("1705.1"),
      liquidacion:{baseGeneral:racional("26000"),cuotaAutonomica:racional("2294.9")},
      ayudasNoIntegrables:[{id:"a-revision",norma:"Real Decreto 477/2021",programa:4,referenciaResolucion:"RD477-revision",importe:racional("2000")}]})
  })
  it.each(["otra-norma","otro-programa","titular","instalacion","antes-vigencia","despues-cobro","fecha-inexistente"])("O2 rechaza concesión: %s",caso=>{
    const h=aid(historia2024()),a=h.ayudas[0]!
    const c={...concesion,...(caso==="otra-norma"?{norma:"otra"}:caso==="otro-programa"?{programa:5}:
      caso==="titular"?{beneficiario:"otro"}:caso==="instalacion"?{instalacionId:"otra"}:
      {fecha:caso==="antes-vigencia"?"2021-06-29":caso==="despues-cobro"?"2024-07-02":"2024-02-30"})}
    Reflect.set(a,"concesion",c)
    expect(run([renovables2024(h)])._tag).toBe("Failure")
  })
  it.each(["beneficiario-distinto","beneficiario-ausente"])("O3 rechazo bancario: %s",caso=>{
    const h=historia2024(),p=h.pagos[0]!
    const {beneficiario:omitido,...resto}=p
    expect(omitido).toBe("instalador")
    const pago=caso==="beneficiario-distinto"?{...p,beneficiario:"tercero"}:resto
    Reflect.set(h,"pagos",[pago])
    expect(run([renovables2024(h)])._tag).toBe("Failure")
  })
  it("ayuda total nominal: cero demostrado",()=>{
    const b=book([renovables2024(aid(historia2024(),"10000"))])
    expect(b.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({generado:racional("0"),saldoPorInsuficiencia2024:racional("0")})
  })
  it("medio céntimo de generación se separa de exceso matemático",()=>{
    const h=historia2024(),b=book([renovables2024({...h,factura:{...h.factura,importeEUR:"10000.01"},
      pagos:h.pagos.map(p=>({...p,importeEUR:"10000.01"}))})])
    expect(b.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({generacionAntesTope:racional("5000.005"),
      generado:racional("5000.01"),excesoSobreTope:racional("0"),ajusteCuantizacionGenerado:racional("0.005"),
      saldoPorInsuficiencia2024:racional("2705.11")})
  })
  // Expectativas Fraction de la política, NO observaciones Open adicionales.
  it.each([["13999.99","7000","0","0.005"],["14000","7000","0","0"],
    ["14000.01","7000","0.005","0"]])("tope y ajuste separados, coste %s",(cost,g,excess,adjust)=>{
    const h=historia2024(),b=book([renovables2024({...h,factura:{...h.factura,importeEUR:cost},
      pagos:h.pagos.map(p=>({...p,importeEUR:cost}))})])
    expect(b.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({generado:racional(g),
      excesoSobreTope:racional(excess),ajusteCuantizacionGenerado:racional(adjust)})
  })
  it.each(["10000","30000"])("conserva saldo y plazo con cuota2025 escasa, bruto %s",bruto=>{
    const b=book([renovables2024()],bruto),a=b.aplicaciones[0]!,h=a.saldoHistoricoRenovablesMurcia!
    expect(sumar(sumar(h.origen.aplicado2024,h.aplicado2025),h.pendiente2025)).toEqual(h.origen.generado)
    expect(a.arrastre).toMatchObject({primerEjercicio:2025,ultimoEjercicio:2026,saldo:h.pendiente2025})
    expect(a).not.toHaveProperty("generado")
    if(bruto==="10000")expect(h.aplicado2025).toEqual(racional("0"))
  })
  it("O4: intento2027 fuera del contrato no produce liquidación",()=>{
    // La canónica tipada no admite2027: el cast adverso llega a datos ausentes.
    // Se caracteriza ese defecto de diagnóstico; no prueba caducidad fiscal.
    if (name === "canonica") expect(() => run([renovables2024()],42,2027)).toThrow(/DecimalError.*undefined/)
    else expect(run([renovables2024()],42,2027)._tag).toBe("Failure")
  })
})

// Artefactos primarios preservados por valor. pdfText es derivado del PDF cuya
// huella también se comprueba; no es una nueva extracción PDF en este test.
describe("B05 cinco artefactos Open2024 versionados",()=>{
  it.each(capturas.rows)("PDF/SES por ámbito: $id",row=>{
    for(const a of Object.values(row.artifacts)){
      expect(createHash("sha256").update(Buffer.from(a.base64,"base64")).digest("hex")).toBe(a.sha256)
    }
    const pdf=Buffer.from(row.artifacts.pdf.base64,"base64")
    expect(pdf.subarray(0,5).toString()).toBe("%PDF-")
    const text=Buffer.from(row.artifacts.pdfText.base64,"base64").toString("utf8")
    const ses=inflateSync(Buffer.from(row.artifacts.ses.base64,"base64")).toString("latin1")
    const header=ses.slice(0,ses.indexOf("?>"))
    for(const [k,v] of Object.entries({EjModelo:"2024",VersionReglas:"N000086471",VersionModelo:"0.09",CodModelo:"100"}))
      expect(header).toContain(`${k}="${v}"`)
    expect(row.url).toContain("/PARE-RW24/OPEN/")
    const fields=new Map<string,string[]>(),stack:{indent:number;name:string}[]=[]
    for(const line of ses.split(/\r?\n/)){
      const indent=line.length-line.trimStart().length,section=/^ *\[([A-Z0-9_]+)\]$/.exec(line)
      while(stack.length > 0 && stack[stack.length-1]!.indent>=indent)stack.pop()
      if(section !== null){stack.push({indent,name:section[1]!});continue}
      const m=/^ *(\w+)~([123])~([^~\r\n]*)(?:~(?:254|255))?$/.exec(line)
      if(m === null)continue
      const key=[...stack.map(x=>x.name),m[1]].join("/")
      fields.set(key,[...(fields.get(key)??[]),`${m[2]}:${m[3]}`])
    }
    const one=(key:string,suffix="")=>{
      const v=fields.get(`DECLARACIONES/IRPF2024/${suffix}${key}`)
      expect(v).toHaveLength(1);expect(v![0]).toMatch(/^1:/)
      return v![0]!.slice(2)
    }
    expect(one("SPNIF")).toBe("90000000B");expect(one("ZCCAD")).toBe("13")
    expect(one("ZFNAC_D")).toBe("01/01/1985");expect(one("TITULAR")).toBe("DECLARANTE")
    expect(fields.get("DECLARACIONES/INDV")).toEqual(["1:true"])
    expect(racional(one("IDII","ATRABAJO/DLGTRABAJO/"))).toEqual(racional(row.input.gross))
    expect(racional(one("GSS","ATRABAJO/DLGTRABAJO/"))).toEqual(racional(row.input.ss))
    expect(racional(one("IMP1MU4","MURCIA/"))).toEqual(racional(row.input.cost))
    const amounts:Record<string,string>=row.observed
    for(const [box,key,suffix] of [["0505","BLGGRAV",""],["0533","CIGAUT",""],["1055","MU4","MURCIA/"],
      ["2038","CANTMU4","MURCIA/"],["2039","PDTEMU4","MURCIA/"]]){
      const expected=amounts[box!]!
      expect(racional(one(key!,suffix!))).toEqual(racional(expected))
      const matches=[...text.matchAll(new RegExp("(-?[\\d.]+,\\d\\d)\\s+"+box+"\\b","g"))]
      expect(matches.length).toBeGreaterThan(0)
      for(const m of matches)expect(racional(m[1]!.replaceAll(".","").replace(",","."))).toEqual(racional(expected))
    }
    expect(text).toMatch(/Ejercicio\s+2024\b/)
    expect(text).toContain("90000000B")
    expect(sumar(racional(amounts["1055"]!),racional(amounts["2039"]!))).toEqual(racional(amounts["2038"]!))
  })
})
