import {
  cero,
  mas,
  menos,
  por,
  producto,
  compara,
  min,
  max,
  euros,
  r,
  exige,
  ids,
  fecha,
  dias2025,
  documento,
  contexto,
  magnitud,
  pagos,
  resultado,
  paso,
  proteger,
} from "./comun"
import type { Contexto, Documento, Periodo, Pago, Resultado, R } from "./comun"
export type Electrico = {
  readonly codigo: "rioja_vehiculos_electricos_nuevos"
  readonly elegido: string
  readonly vehiculos: readonly {
    readonly id: string
    readonly propietario: string
    readonly matriculacion: string
    readonly primeraMatriculacion: "nuevo" | "usado"
    readonly afectacion: "privado" | "actividad"
    readonly categoria:
      | "M1"
      | "N1"
      | "L1e"
      | "L2e"
      | "L3e"
      | "L5e"
      | "L6e"
      | "L7e"
      | "bicicleta"
    readonly motor: "BEV" | "REEV" | "GLP" | "GNC" | "GNL" | "bifuel" | "otro"
    readonly homologacion: Documento
    readonly precio: string
    readonly saldoPendientePrecio: string
    readonly contratoFinanciacion: Documento | null
    readonly bateria: "litio" | "otra"
    readonly potenciaKWh: number
    readonly autonomiaKm: number
    readonly normaUNE15194: Documento | null
    readonly proporcion: readonly [number, number]
    readonly pagos: readonly Pago[]
  }[]
}
export function electrico(c: Contexto, h: Electrico): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      ids(h.vehiculos.map((x) => x.id)) &&
        h.vehiculos.some((x) => x.id === h.elegido),
      "Elección de un vehículo por titular requerida"
    )
    const x = h.vehiculos.find((x) => x.id === h.elegido)
    exige(x !== undefined, "Vehículo desconocido")
    documento(x.homologacion)
    exige(
      fecha(x.matriculacion) &&
        ids([x.propietario]) &&
        x.propietario === c.titular,
      "Propietario o matriculación inválidos"
    )
    const [n, d] = x.proporcion
    exige(
      Number.isInteger(n) && Number.isInteger(d) && n > 0 && d >= n,
      "Titularidad de vehículo inválida"
    )
    const pagado = pagos(x.pagos, ["vehiculo"], true, "hasta2025", "satisfecho")
    const saldo = euros(x.saldoPendientePrecio)
    exige(
      compara(mas(pagado, saldo), euros(x.precio)) === 0,
      "Precio de adquisición no conciliado con contraprestación y saldo de financiación"
    )
    if (compara(saldo, cero) > 0) {
      exige(
        x.contratoFinanciacion !== null,
        "Falta contrato del saldo de precio financiado"
      )
      documento(x.contratoFinanciacion)
    }
    const base = producto(euros(x.precio), r(BigInt(n), BigInt(d)))
    const bici = x.categoria === "bicicleta",
      moto = ["L3e", "L5e"].includes(x.categoria),
      mn = ["M1", "N1"].includes(x.categoria)
    if (bici) {
      exige(x.normaUNE15194 !== null, "Falta normaUNE-EN15194:2009")
      documento(x.normaUNE15194)
    }
    const apto =
      ["N1", "L1e", "L2e", "bicicleta"].includes(x.categoria) &&
      x.matriculacion >= "2025-01-01" &&
      x.matriculacion <= "2025-12-31" &&
      x.primeraMatriculacion === "nuevo" &&
      x.afectacion === "privado" &&
      compara(euros(x.precio), euros("50000")) <= 0 &&
      (mn
        ? ["BEV", "REEV", "GLP", "GNC", "GNL", "bifuel"].includes(x.motor)
        : x.motor === "BEV") &&
      (!moto ||
        (x.bateria === "litio" && x.potenciaKWh >= 3 && x.autonomiaKm >= 70)) &&
      (!bici || x.bateria === "litio")
    const limite = max(
      cero,
      menos(
        euros(bici ? "225" : "300"),
        magnitud(c, "cuotaElectricoConsumidaDeclaracion")
      )
    )
    const v = apto ? min(por(base, 15, 100), limite) : cero
    return resultado(
      c,
      v,
      [
        paso(
          x.id,
          "15%; DA3 conserva N1,L1e,L2e,bicicleta en2025; precio<=50000,registro2025,nuevo y privado;225 bici/300 otras por declaración",
          base,
          v
        ),
      ],
      [
        "Categoría homologada debe corresponder a especificaciones técnicas;un vehículo por contribuyente;saldo del límite por declaración procede de composición anual",
      ]
    )
  })
}
export type Valoracion =
  | { readonly tipo: "dinero"; readonly euros: string }
  | {
      readonly tipo: "bienes"
      readonly valorContable: string | null
      readonly valorPatrimonio: string
      readonly mercado: string
      readonly informe: Documento
    }
  | {
      readonly tipo: "usufructo_inmueble"
      readonly valorCatastral: string
      readonly duracion: readonly Periodo[]
      readonly mercado: string
    }
  | {
      readonly tipo: "usufructo_valores"
      readonly dividendosIntereses2025: string
      readonly mercado: string
    }
  | {
      readonly tipo: "usufructo_otros"
      readonly valorUsufructoITP: string
      readonly interesLegalNumerador: number
      readonly interesLegalDenominador: number
      readonly mercado: string
    }
  | {
      readonly tipo: "deposito_cultural"
      readonly valorArt18: string
      readonly mercado: string
      readonly informeConsejeria: Documento
    }
export function valoracion(v: Valoracion): R {
  switch (v.tipo) {
    case "dinero":
      return euros(v.euros)
    case "bienes":
      documento(v.informe)
      return min(euros(v.valorContable ?? v.valorPatrimonio), euros(v.mercado))
    case "usufructo_inmueble":
      return min(
        por(por(euros(v.valorCatastral), 2, 100), dias2025(v.duracion), 365),
        euros(v.mercado)
      )
    case "usufructo_valores":
      return min(euros(v.dividendosIntereses2025), euros(v.mercado))
    case "usufructo_otros":
      exige(
        Number.isInteger(v.interesLegalNumerador) &&
          Number.isInteger(v.interesLegalDenominador) &&
          v.interesLegalNumerador >= 0 &&
          v.interesLegalDenominador > 0,
        "Interés legal inválido"
      )
      return min(
        por(
          euros(v.valorUsufructoITP),
          v.interesLegalNumerador,
          v.interesLegalDenominador * 100
        ),
        euros(v.mercado)
      )
    case "deposito_cultural":
      documento(v.informeConsejeria)
      return min(euros(v.valorArt18), euros(v.mercado))
  }
}
export type BeneficiarioMecenazgo = {
  readonly id: string
  readonly clase:
    | "fundacion"
    | "asociacion_utilidad_publica"
    | "deportiva"
    | "federacion_sin_lucro"
    | "asociacion_autorizada"
    | "sector_publico_rioja"
    | "entidad_local_rioja"
    | "universidad_rioja"
    | "investigacion_rioja"
    | "artistico_superior_rioja"
    | "empresa_cultural"
    | "persona_fisica"
    | "otra"
  readonly domicilioFiscal: "la-rioja" | "otro"
  readonly actividadRioja: "si" | "no"
  readonly registro: Documento | null
  readonly autorizacionHacienda: Documento | null
  readonly vinculoDonante:
    | "ninguno"
    | "familiar_hasta3"
    | "pareja"
    | "atribucion_rentas"
}
function beneficiario(b: BeneficiarioMecenazgo, donante: string): boolean {
  exige(
    [
      "fundacion",
      "asociacion_utilidad_publica",
      "deportiva",
      "federacion_sin_lucro",
      "asociacion_autorizada",
      "sector_publico_rioja",
      "entidad_local_rioja",
      "universidad_rioja",
      "investigacion_rioja",
      "artistico_superior_rioja",
      "empresa_cultural",
      "persona_fisica",
      "otra",
    ].includes(b.clase),
    "Clase de beneficiario desconocida"
  )
  exige(
    ids([b.id]) && b.id !== donante,
    "Beneficiario y donante no pueden ser la misma identidad"
  )
  if (b.registro !== null) documento(b.registro)
  if (b.autorizacionHacienda !== null) documento(b.autorizacionHacienda)
  if (b.clase === "otra") return false
  if (b.clase === "persona_fisica")
    return (
      b.domicilioFiscal === "la-rioja" &&
      b.registro !== null &&
      b.vinculoDonante === "ninguno"
    )
  if (
    [
      "fundacion",
      "asociacion_utilidad_publica",
      "deportiva",
      "federacion_sin_lucro",
      "asociacion_autorizada",
    ].includes(b.clase)
  )
    return (
      (b.domicilioFiscal === "la-rioja" ||
        b.registro !== null ||
        b.actividadRioja === "si") &&
      (b.clase !== "asociacion_autorizada" || b.autorizacionHacienda !== null)
    )
  return b.domicilioFiscal === "la-rioja"
}
export type Mecenazgo = {
  readonly codigo: "rioja_donaciones_fomento_mecenazgo"
  readonly bloque: "a_b" | "d_e"
  readonly donaciones: readonly {
    readonly id: string
    readonly fecha: string
    readonly donante: string
    readonly beneficiario: BeneficiarioMecenazgo
    readonly modalidad: "a" | "b" | "d" | "e"
    readonly valor: Valoracion
    readonly certificado: Documento
    readonly comunicacion: Documento
    readonly viaInformacion:
      | "autonomica_enero"
      | "AEAT_copia_autonomica"
      | "intercambio_regulado"
    readonly estrategiaRegional: Documento | null
    readonly bienRioja: "si" | "no"
    readonly titularidadBien:
      | "administracion_rioja"
      | "BIC_inventariado"
      | "otra"
    readonly empresa: {
      readonly domicilio: "la-rioja" | "otro"
      readonly fondosPropios: string
      readonly actividad:
        | "cine_audiovisual"
        | "escenicas"
        | "artes_plasticas"
        | "libro"
        | "patrimonio"
        | "folclore"
        | "artes_aplicadas"
        | "otra"
    } | null
    readonly autorHeredero: Documento | null
    readonly aceptacionConsejeria: Documento | null
  }[]
}
export function mecenazgo(c: Contexto, h: Mecenazgo): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(
      ids(h.donaciones.map((d) => d.id)) && ["a_b", "d_e"].includes(h.bloque),
      "Donaciones/elección inválidas"
    )
    let ab = cero,
      dTotal = cero,
      eTotal = cero
    const tr = []
    for (const d of h.donaciones) {
      exige(
        fecha(d.fecha) && d.donante === c.titular,
        "Donante/fecha incompatibles"
      )
      documento(d.certificado)
      documento(d.comunicacion)
      exige(
        (h.bloque === "a_b" ? ["a", "b"] : ["d", "e"]).includes(d.modalidad),
        "Incompatibilidad entre a/b y d/e"
      )
      if (d.viaInformacion !== "intercambio_regulado")
        exige(
          d.comunicacion.fecha >= "2026-01-01" &&
            d.comunicacion.fecha <= "2026-01-31",
          "Comunicación de mecenazgo fuera de enero2026"
        )
      const base = valoracion(d.valor)
      let apto =
        beneficiario(d.beneficiario, d.donante) &&
        ((d.fecha >= "2025-01-01" && d.fecha <= "2025-12-31") ||
          (d.valor.tipo.startsWith("usufructo_") && d.fecha <= "2025-12-31"))
      if (d.modalidad === "a") {
        exige(
          d.estrategiaRegional !== null,
          "Falta actividad de estrategia regional"
        )
        documento(d.estrategiaRegional)
      }
      if (d.modalidad === "b")
        apto = apto && d.bienRioja === "si" && d.titularidadBien !== "otra"
      if (d.modalidad === "d") {
        exige(d.empresa !== null, "Falta empresa cultural")
        apto =
          apto &&
          d.beneficiario.clase === "empresa_cultural" &&
          d.empresa.domicilio === "la-rioja" &&
          compara(euros(d.empresa.fondosPropios, true), euros("300000")) < 0 &&
          d.empresa.actividad !== "otra"
      }
      if (d.modalidad === "e") {
        exige(
          d.autorHeredero !== null && d.aceptacionConsejeria !== null,
          "Falta autor/heredero o aceptación cultural"
        )
        documento(d.autorHeredero)
        documento(d.aceptacionConsejeria)
      }
      const v = apto
        ? por(base, ["a", "b"].includes(d.modalidad) ? 15 : 20, 100)
        : cero
      if (["a", "b"].includes(d.modalidad)) ab = mas(ab, v)
      else if (d.modalidad === "d") dTotal = mas(dTotal, v)
      else eTotal = mas(eTotal, v)
      tr.push(
        paso(
          d.id,
          "ValoraciónArt18 y mercado;modalidad,destinatario,certificado y comunicación",
          base,
          v
        )
      )
    }
    const bruto = mas(
      min(ab, euros("500")),
      mas(min(dTotal, euros("500")), min(eTotal, euros("500")))
    )
    const limite = max(
      cero,
      menos(
        por(magnitud(c, "cuotaIntegraAutonomica"), 30, 100),
        magnitud(c, "mecenazgoConsumidoDeclaracion")
      )
    )
    const v = min(bruto, limite)
    return resultado(
      c,
      v,
      [
        ...tr,
        paso(
          "limite30",
          "a+b500 conjunto,d500,e500;total<=30%cuota íntegra autonómica",
          bruto,
          v
        ),
      ],
      [
        "Cuota líquida no negativa pendiente aplicación coordinada;crédito fiscal incompatible controlado en contexto",
      ]
    )
  })
}
export type Patrimonio = {
  readonly codigo: "rioja_cantidades_patrimonio_historico"
  readonly bienes: readonly {
    readonly id: string
    readonly titular: string
    readonly derecho: "propiedad" | "usufructo"
    readonly registro: Documento
    readonly uso: "particular" | "empresarial"
    readonly pagos: readonly Pago[]
  }[]
}
export function patrimonio(c: Contexto, h: Patrimonio): Resultado {
  return proteger(() => {
    contexto(c, "la-rioja")
    exige(ids(h.bienes.map((b) => b.id)), "Bienes repetidos")
    let base = cero
    const tr = []
    for (const b of h.bienes) {
      documento(b.registro)
      exige(
        b.titular === c.titular &&
          ["propiedad", "usufructo"].includes(b.derecho),
        "Titular/derecho patrimonial no identificado"
      )
      const pagado = pagos(
        b.pagos,
        [
          "investigacion",
          "conservacion",
          "restauracion",
          "rehabilitacion",
          "consolidacion",
        ],
        true,
        "ejercicio",
        "satisfecho"
      )
      exige(
        b.pagos.every((p) => p.pagador === c.titular),
        "Atribuir pagos de cada titular: no mezclar expedientes empresariales"
      )
      if (b.uso === "particular") base = mas(base, pagado)
      tr.push(
        paso(
          b.id,
          "Registro patrimonial,propiedad/usufructo y exclusión inversión empresarial",
          pagado,
          b.uso === "particular" ? pagado : cero
        )
      )
    }
    const v = min(euros("500"), por(base, 15, 100))
    return resultado(c, v, tr, [
      "Cuota líquida no negativa pendiente aplicación coordinada;no aplicar límite30% del apartado14 al apartado15",
    ])
  })
}
