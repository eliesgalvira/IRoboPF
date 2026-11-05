import Decimal from "decimal.js"
import { clasificarReparacionVI100B2025, type AyudaIncendioNoIntegrada2025 } from "./incendios"
import { Result, Schema } from "effect"
import { fecha } from "../deducciones/asturias-cantabria-hechos-2025/comun"
import { racional, type Racional } from "../deducciones/anual-territorial-racional"
import { CensoIngresosIdentificados2025 } from "./contrato"

// El cobro agregado necesita <=18 cifras (<=16 tras conciliar concesiones).
// Transporte interno:18 enteros+80 posiciones decimales=98 cifras; hasta100
// sumandos acotados añaden como máximo2 enteros. No modifica Decimal global
// ni la precisión80 de composición. Derivación:PRECISION.md.
export const DecimalIngreso2025 = Decimal.clone({ precision: 100 })
type Ayuda = Exclude<CensoIngresosIdentificados2025["ayudas"][number], {readonly programa:"galicia-vi100b-reparacion-2025"}>
export type PreparacionIngresos2025 = {
  readonly censo: CensoIngresosIdentificados2025
  readonly noIntegradas: readonly AyudaIncendioNoIntegrada2025[]
  readonly totalGeneral: Decimal
  readonly ayudas: readonly { readonly hechos: Ayuda; readonly cobrado: string; readonly integrado: string }[]
}
export type IngresoIdentificadoIntegrado2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly ayudaId: string
  readonly beneficiario: string
  readonly programa: Ayuda["programa"]
  readonly clasificacionFiscal: "ganancia-patrimonial-no-transmision-no-exenta" | "ayuda-reparacion-DA5_3-con-exceso-general" | "ayuda-reparacion-DA5_3-sin-exceso"
  readonly hechosDeportivos?: Extract<Ayuda, { readonly programa: "galicia-deportistas-resultados-2025" }>
  readonly fiscalidadDeportiva?: { readonly concepto: "ganancia-no-transmision"; readonly exento: "0"; readonly limiteArt7m: "60100"; readonly motivoNoExencion: "resultados-no-formacion-tecnificacion" }
  readonly resolucion: Ayuda["resolucion"]
  readonly cobros: Ayuda["cobros"]
  readonly cobrado: Racional
  readonly integradoBaseGeneral: string
  readonly integradoBaseLiquidable: string
  readonly nodoFiscalOrigen: string
  readonly criterio: "cobro-art14_2_c-sin-reducciones-ni-compensaciones-base" | "cobro-art14_2_c-exceso-reparacion-DA5_3"
}
export type LibroIngresosIdentificados2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly liquidacion: string
  readonly ingresos: readonly IngresoIdentificadoIntegrado2025[]
  readonly totalIntegradoGeneral: Racional
  readonly ayudasNoIntegradas: readonly AyudaIncendioNoIntegrada2025[]
  readonly reservas: readonly string[]
  readonly aceptacionFiscal: "pendiente"
}
type Rechazo = { readonly estado: "no_soportado"; readonly motivo: string }
type Ambito = {
  readonly anio: number
  readonly comunidadAutonoma: string
  readonly contribuyenteId?: string | undefined
  readonly fallecimiento: boolean
}
/** No transforma una concesión en renta ni acepta bases atribuidas del cliente. */
export function prepararIngresosIdentificados2025(
  entrada: CensoIngresosIdentificados2025,
  ambito: Ambito
): Rechazo | { readonly estado: "preparado"; readonly preparacion: PreparacionIngresos2025 } {
  const decoded = Schema.decodeUnknownResult(CensoIngresosIdentificados2025)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(decoded)) return { estado: "no_soportado", motivo: "Censo P1 cerrado: programa/clasificación, cobros2025 y hechos primarios; no bases, compensaciones ni cuotas externas" }
  const censo = decoded.success
  if (ambito.anio !== 2025 || !["asturias", "galicia", "extremadura", "illes-balears"].includes(ambito.comunidadAutonoma) || ambito.fallecimiento || censo.contribuyenteId !== ambito.contribuyenteId)
    return { estado: "no_soportado", motivo: "Ingreso identificado: territorio soportado2025 individual ordinario con identidad anual propia" }
  const ayudas = new Set<string>(), resoluciones = new Set<string>(), cobros = new Set<string>(), justificantes = new Set<string>()
  const preparadas: { readonly hechos: Ayuda; readonly cobrado: string; readonly integrado: string }[] = []
  const noIntegradas: AyudaIncendioNoIntegrada2025[] = []
  let total = new DecimalIngreso2025("0")
  for (const a of censo.ayudas) {
    if (ayudas.has(a.ayudaId) || resoluciones.has(a.resolucion.referencia))
      return { estado: "no_soportado", motivo: "ayudaId o resolución duplicada en censo de ingresos" }
    ayudas.add(a.ayudaId); resoluciones.add(a.resolucion.referencia)
    if (a.beneficiario !== censo.contribuyenteId || a.cobros.some(c => c.beneficiario !== a.beneficiario))
      return { estado: "no_soportado", motivo: "Beneficiario del ingreso/cobro distinto del contribuyente" }
    if(a.programa === "galicia-vi100b-reparacion-2025") {
      if(ambito.comunidadAutonoma!=="galicia" || censo.ayudas.length!==1)
        return {estado:"no_soportado",motivo:"VI100B: un expediente sin mezclar otros programas y residencia Galicia2025"}
      try {noIntegradas.push(clasificarReparacionVI100B2025(a,censo.contribuyenteId))}
      catch(cause){return {estado:"no_soportado",motivo:cause instanceof Error?cause.message:"VI100B: hechos no conciliados"}}
      continue
    }
    if (a.programa === "galicia-deportistas-resultados-2025") {
      const d = a.reconocimientoGallego
      if (ambito.comunidadAutonoma !== "galicia" || censo.ayudas.length !== 1)
        return { estado: "no_soportado", motivo: "Deportistas: Galicia, un expediente exhaustivo; concurrencia de ayudas pendiente" }
      if (a.relacionLaboral !== "ninguna" || a.contraprestacionServicios !== "ninguna" || a.becaEstudios !== "no")
        return { estado: "no_soportado", motivo: "Deportistas: falta productor de trabajo/becas, exigibilidad art14.1a, gastos y atribución neta a BLG; no clasificar como ganancia" }
      if (a.ordenacionPorCuentaPropia !== "ninguna")
        return { estado: "no_soportado", motivo: "Deportistas: actividad económica excluida de art5.Diecinueve; falta productor específico de subvención de actividad" }
      if (a.finalidad !== "resultados_deportivos" || a.otrasExenciones !== "ninguna")
        return { estado: "no_soportado", motivo: "Deportistas formación/tecnificación u otra exención: faltan reconocimiento DAN estatal RD971/2007, programa CSD y financiación art4 RIRPF, censo anual de ayudas para límite conjunto60100 y clasificación previa trabajo/ganancia; no se presume exención ni parte gravada" }
      if (!fecha(a.convocatoria.fecha) || !fecha(d.fecha) || !fecha(d.vigenteHasta) ||
          a.convocatoria.fecha > a.resolucion.fecha || d.fecha > a.resolucion.fecha ||
          d.vigenteHasta < "2025-12-31" || d.titular !== censo.contribuyenteId)
        return { estado: "no_soportado", motivo: "Deportistas: convocatoria/reconocimiento gallego propio vigente no conciliados" }
      let cobrado = new DecimalIngreso2025("0")
      for (const c of a.cobros) {
        if (cobros.has(c.cobroId) || justificantes.has(c.justificante) || c.ordenante !== a.administracion ||
            !fecha(c.fecha) || !fecha(a.resolucion.fecha) || c.fecha < a.resolucion.fecha || !c.fecha.startsWith("2025-") || !new DecimalIngreso2025(c.euros).gt(0))
          return { estado: "no_soportado", motivo: "Deportistas: cobro duplicado, pagador ajeno, fecha inválida o cobro no positivo2025" }
        cobros.add(c.cobroId); justificantes.add(c.justificante)
        cobrado = cobrado.plus(c.euros)
      }
      if (!cobrado.eq(a.resolucion.importeConcedido))
        return { estado: "no_soportado", motivo: "Deportistas: cobro parcial/excesivo o saldo histórico pendiente; sólo concesión íntegra2025 conciliada" }
      total = total.plus(cobrado)
      preparadas.push({ hechos: a, cobrado: cobrado.toFixed(), integrado: cobrado.toFixed() })
      continue
    }
    const balears = a.programa === "balears-d33-2018-art3_2e-cobro2025"
    const talidomida = a.programa === "talidomida-rd574-2023-cobro2025"
    const region = balears ? "illes-balears" : talidomida ? "galicia" : a.programa === "asturias-ela-2025" ? "asturias" : a.programa === "galicia-bs215a-2025" ? "galicia" : "extremadura"
    if (region !== ambito.comunidadAutonoma)
      return { estado: "no_soportado", motivo: "Programa regional distinto del territorio de residencia" }
    const inicio = balears ? "2018-10-20" : talidomida ? "2023-07-06" : region === "asturias" ? "2025-06-27" : region === "galicia" ? "2025-07-15" : "2025-01-01"
    if (!balears && !talidomida && region !== "asturias" && (censo.ayudas.length !== 1 ||
      (region === "galicia" ? new DecimalIngreso2025(a.resolucion.importeConcedido).gt("12000") : !new DecimalIngreso2025(a.resolucion.importeConcedido).eq("2000"))))
      return { estado: "no_soportado", motivo: "Extensión regional: un expediente2025; Galicia máximo12000, Extremadura cuantía fija2000" }
    if (!fecha(a.resolucion.fecha) || a.resolucion.fecha < inicio)
      return { estado: "no_soportado", motivo: "Resolución fuera de la convocatoria regional2025 o fecha civil inválida" }
    let cobrado = new DecimalIngreso2025("0")
    for (const c of a.cobros) {
      if (cobros.has(c.cobroId) || justificantes.has(c.justificante))
        return { estado: "no_soportado", motivo: "Cobro o justificante repetido entre ingresos identificados" }
      cobros.add(c.cobroId); justificantes.add(c.justificante)
      if (!fecha(c.fecha) || c.fecha < a.resolucion.fecha || !c.fecha.startsWith("2025-"))
        return { estado: "no_soportado", motivo: "Cobro fuera de2025, anterior a resolución o fecha civil inválida" }
      const importe = new DecimalIngreso2025(c.euros)
      if (!importe.gt("0")) return { estado: "no_soportado", motivo: "Se necesita cobro positivo; concesión sin cobro no integra renta" }
      cobrado = cobrado.plus(importe)
    }
    if (cobrado.gt(a.resolucion.importeConcedido))
      return { estado: "no_soportado", motivo: "Cobros superiores a la resolución; falta conciliación del expediente" }
    if (talidomida && (censo.ayudas.length !== 1 || a.expediente.titular !== censo.contribuyenteId || !cobrado.eq(a.resolucion.importeConcedido)))
      return { estado: "no_soportado", motivo: "Talidomida RD574/2023: un expediente propio sin cobros previos y pago único íntegro2025; parcialidad/historia requiere conciliación adicional" }
    if (!talidomida && region === "galicia" && !cobrado.eq(a.resolucion.importeConcedido))
      return { estado: "no_soportado", motivo: "Galicia: el evaluador clasifica toda la concesión; cobro parcial requiere libro de saldo pendiente no representado" }
    let integrado = cobrado
    if (a.programa === "balears-d33-2018-art3_2e-cobro2025") {
      const e = a.expediente, cierre = e.reparacionFinalizada, t = e.pagoTardio
      if (censo.ayudas.length !== 1 || e.propietarioPleno !== censo.contribuyenteId ||
        !fecha(e.adquisicion) || e.adquisicion > "2018-10-09" || !fecha(e.inicioResidenciaHabitual) || e.inicioResidenciaHabitual < e.adquisicion || e.inicioResidenciaHabitual > "2018-10-09" ||
        !fecha(e.solicitud) || e.solicitud < "2018-10-20" || (e.solicitud > "2019-04-01" && e.solicitud < "2019-04-13") || e.solicitud > "2019-05-01" || a.resolucion.fecha < "2019-04-13" || e.solicitud > a.resolucion.fecha ||
        !cobrado.eq(a.resolucion.importeConcedido) || cobrado.gt("10000") || cobrado.gt(e.informeTecnico.danosValorados) ||
        !fecha(cierre.fecha) || cierre.fecha < a.cobros[0]!.fecha || cierre.vivienda !== e.vivienda || cierre.informeDanos !== e.informeTecnico.referencia ||
        !fecha(e.informeTecnico.fecha) || e.informeTecnico.fecha < "2018-10-09" || e.informeTecnico.fecha > a.resolucion.fecha || e.informeTecnico.vivienda !== e.vivienda || e.informeTecnico.propietario !== censo.contribuyenteId ||
        !fecha(t.notificacionConcesion) || t.notificacionConcesion < a.resolucion.fecha)
        return { estado: "no_soportado", motivo: "Balears D33/2018 art3.2e: expediente propio, solicitud dentro del corte (sin intervalo2-12abril ni calendario inhábil tras1mayo), pago unico integro2025 <=10000 y dano peritado; fin de reparacion2025 posterior al cobro; informe e identidad propios y concesion posterior a Ley17/2019" }
      // Ley14/2014 art30: no basta con seis años de inactividad ni una etiqueta de firmeza.
      // Corte conservador: reclamaciones de pago documentadas, cronológicas, sin
      // intervalo que alcance cuatro años; nunca se reconstruye una prescripción cumplida.
      let anterior = t.notificacionConcesion
      const registros = new Set<string>()
      for (const r of t.reclamacionesPago) {
        if (!fecha(r.fecha) || r.fecha < anterior || r.fecha > a.cobros[0]!.fecha ||
          Number(r.fecha.slice(0, 4)) - Number(anterior.slice(0, 4)) > 3 ||
          r.acreedor !== censo.contribuyenteId || r.expediente !== e.referencia ||
          !new DecimalIngreso2025(r.importePrincipal).eq(a.resolucion.importeConcedido) ||
          registros.has(r.referencia) || registros.has(r.registro) || r.referencia === r.registro)
          return { estado: "no_soportado", motivo: "Balears pago tardio: falta reclamacion de principal propio documentada antes de prescripcion; sin litigio, intereses cobrados ni reapertura de convocatoria" }
        registros.add(r.referencia); registros.add(r.registro); anterior = r.fecha
      }
      if (Number(a.cobros[0]!.fecha.slice(0, 4)) - Number(anterior.slice(0, 4)) > 3)
        return { estado: "no_soportado", motivo: "Balears pago tardio: intervalo hasta cobro sin reclamacion conservadora del derecho" }
      let reparado = new DecimalIngreso2025("0")
      const documentos = new Set<string>([...justificantes])
      for (const r of e.reparaciones) {
        if (r.pagador !== censo.contribuyenteId || r.vivienda !== e.vivienda || !fecha(r.fecha) || r.fecha > cierre.fecha ||
          !new DecimalIngreso2025(r.euros).gt("0") || documentos.has(r.factura) || documentos.has(r.justificante) || r.factura === r.justificante)
          return { estado: "no_soportado", motivo: "Balears reparacion: factura/pago duplicado, identidad/inmueble ajeno, fecha o coste no positivo" }
        documentos.add(r.factura); documentos.add(r.justificante)
        reparado = reparado.plus(r.euros)
      }
      // Ley17/2019 DF1/2: ayuda por daño, no condicionada a ejecutar obras.
      // DA5.3 LIRPF: sólo exceso sobre coste efectivo; peritaje no es gasto fiscal.
      integrado = DecimalIngreso2025.max("0", cobrado.minus(reparado))
    }
    total = total.plus(integrado)
    preparadas.push({ hechos: a, cobrado: cobrado.toFixed(), integrado: integrado.toFixed() })
  }
  return { estado: "preparado", preparacion: { censo, totalGeneral: total, ayudas: preparadas, noIntegradas } }
}
/** Sólo composición: BIG/BLG calculadas, nunca etiquetas sobre una renta agregada. */
export function atribuirIngresosIdentificados2025(
  preparacion: PreparacionIngresos2025,
  baseImponibleGeneral: Decimal,
  baseLiquidableGeneral: Decimal
): Rechazo | { readonly estado: "integrado"; readonly libro: LibroIngresosIdentificados2025 } {
  if (!baseImponibleGeneral.eq(baseLiquidableGeneral) || baseImponibleGeneral.lt(preparacion.totalGeneral))
    return { estado: "no_soportado", motivo: "P1 requiere BIG=BLG sin pérdidas, reducciones ni compensaciones de base no atribuidas; no admite prorrateo" }
  const contribuyente = preparacion.censo.contribuyenteId
  const liquidacion = "motor-anual:2025:" + contribuyente
  const ingresos = preparacion.ayudas.map(({ hechos: a, cobrado, integrado }): IngresoIdentificadoIntegrado2025 => {
    const ingreso: IngresoIdentificadoIntegrado2025 = {
      ejercicio: 2025, contribuyente, ayudaId: a.ayudaId, beneficiario: a.beneficiario,
      programa: a.programa, clasificacionFiscal: a.programa === "balears-d33-2018-art3_2e-cobro2025" ? (new DecimalIngreso2025(integrado).gt("0") ? "ayuda-reparacion-DA5_3-con-exceso-general" : "ayuda-reparacion-DA5_3-sin-exceso") : "ganancia-patrimonial-no-transmision-no-exenta",
      resolucion: a.resolucion, cobros: a.cobros, cobrado: racional(cobrado),
      integradoBaseGeneral: integrado, integradoBaseLiquidable: integrado,
      nodoFiscalOrigen: liquidacion + ":ganancia-no-transmision:" + a.ayudaId,
      criterio: a.programa === "balears-d33-2018-art3_2e-cobro2025" ? "cobro-art14_2_c-exceso-reparacion-DA5_3" : "cobro-art14_2_c-sin-reducciones-ni-compensaciones-base",
    }
    if (a.programa !== "galicia-deportistas-resultados-2025") return ingreso
    return { ...ingreso, hechosDeportivos: a, fiscalidadDeportiva: {
      concepto: "ganancia-no-transmision", exento: "0", limiteArt7m: "60100",
      motivoNoExencion: "resultados-no-formacion-tecnificacion",
    } }
  })
  return { estado: "integrado", libro: {
    ejercicio: 2025, contribuyente, liquidacion, ingresos,
    totalIntegradoGeneral: racional(preparacion.totalGeneral.toFixed()),
    ayudasNoIntegradas: preparacion.noIntegradas,
    reservas: ["Resoluciones, diagnóstico, justificantes de cobro y exhaustividad declarados; no se certifica su autenticidad ni aceptación fiscal", "También Balears D33/2018 art3.2e, reparación habitual sin estructura, pago tardío único2025 conservado por reclamaciones; reparación finalizada2025 sin concurrencias, sin etiqueta de cierre fiscal; sólo exceso DA5.3 integrado. También ayuda gallega dineraria por resultados sin trabajo/beca/actividad, íntegra2025; excluidas formación/tecnificación y otras exenciones. Sólo Asturias ELA2025, Galicia BS215A2025 y Extremadura ELA convocatoria2025; también RD574/2023 Imserso con pago único íntegro2025 en Galicia; VI100B reparación justificada2025 se clasifica separadamente DA5.3 sin integrar renta; excluidas prestaciones SAAD, otras estatales y convocatorias2026"],
    aceptacionFiscal: "pendiente",
  } }
}
