/** Ejecución backend de los dos ejemplos; no usa el oracle de expectativas. */
import { Effect, Schema } from "effect"
import { liquidarIrpfAnualExplicito } from "../../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../../../../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import casos from "./casos.json"

const resultados = casos.slice(0, 2).map(({ nombre, entrada }) => ({
  nombre,
  resultado: Effect.runSync(liquidarIrpfAnualExplicito(
    Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
  )),
}))
process.stdout.write(JSON.stringify(resultados, null, 2) + "\n")
