import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { calcularAhorroConMinimos } from "../lib/dominio/irpf/cuotas/cuota-integra-ahorro"

const A = Decimal.clone({ precision: 80 })
const base = new A("10000.123456789012345678901234567890123456789")
const general = new A("1000.123456789012345678901234567890123456789")

// Oráculos decimales finitos, calculados fuera del motor con 100 cifras.
// En 2014 la base tras remanente baja de 6000: aplica .115/.095.
// En 2015 se resta la cuota del remanente a 990+exceso*.105 y
// 1040+exceso*.11; el remanente tributa a .095/.10 respectivamente.
it.each([
  {
    anio: 2014 as const,
    brutas: [
      "1270.017901234406790123440679012344067901234405",
      "990.012962962846296296284629629628462962962845",
    ],
    netas: [
      "626.77839506147283950614728395061472839506147",
      "479.14170678991234567899123456789912345678991",
    ],
  },
  {
    anio: 2015 as const,
    brutas: [
      "990.012962962846296296284629629628462962962845",
      "1040.01358024679135802467913580246791358024679",
    ],
    netas: [
      "557.7746913578024691357802469135780246913578",
      "544.36092592569259259256925925925692592592569",
    ],
  },
])(
  "el ahorro de $anio cruza tramo con remanentes distintos y precisión 80",
  ({ anio, brutas, netas }) => {
    const r = calcularAhorroConMinimos({
      anio,
      base,
      baseGeneral: general,
      minimoEstatal: new Decimal(5550),
      minimoAutonomico: new Decimal("5956.65"),
      aritmetica: A,
    })
    expect(r.estatal.remanente.toFixed()).toBe(
      "4549.876543210987654321098765432109876543211"
    )
    expect(r.autonomico.remanente.toFixed()).toBe(
      "4956.526543210987654321098765432109876543211"
    )
    expect([r.estatal.bruta.toFixed(), r.autonomico.bruta.toFixed()]).toEqual(
      brutas
    )
    expect([
      r.estatal.despuesMinimo.toFixed(),
      r.autonomico.despuesMinimo.toFixed(),
    ]).toEqual(netas)
  }
)

it.each([2014, 2015] as const)(
  "los límites del remanente conservan toda la base fraccionaria en %i",
  (anio) => {
    const pequena = new A("1.123456789012345678901234567890123456789")
    const r = calcularAhorroConMinimos({
      anio,
      base: pequena,
      baseGeneral: new Decimal(-10),
      minimoEstatal: new Decimal(5550),
      minimoAutonomico: new Decimal("5956.65"),
      aritmetica: A,
    })
    for (const componente of [r.estatal, r.autonomico]) {
      expect(componente.remanente.toFixed()).toBe(pequena.toFixed())
      expect(componente.despuesMinimo.toFixed()).toBe("0")
      expect(componente.minoracion.toFixed()).toBe(componente.bruta.toFixed())
    }
  }
)
