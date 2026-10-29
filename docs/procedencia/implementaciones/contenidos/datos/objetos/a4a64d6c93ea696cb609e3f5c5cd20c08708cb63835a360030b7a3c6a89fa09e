// Perfil técnico de Calculo_Salario_IRPF.py; no es política de liquidación.
// NumPy redondea después de escalar en binary64. Python round(float, n)
// redondea el racional binary64 original: escalar primero puede crear un empate.
export const redondearNumpy = (valor: number, decimales = 2): number => {
  const escala = 10 ** decimales
  const escalado = Math.abs(valor) * escala
  const inferior = Math.floor(escalado)
  const fraccion = escalado - inferior
  const entero =
    fraccion > 0.5 || (fraccion === 0.5 && inferior % 2 !== 0)
      ? inferior + 1
      : inferior
  return Math.sign(valor) * (entero / escala)
}

export const redondearPython = (valor: number, decimales = 2): number => {
  if (!Number.isFinite(valor) || valor === 0) return valor
  const bits = new DataView(new ArrayBuffer(8))
  bits.setFloat64(0, Math.abs(valor))
  const palabra = bits.getBigUint64(0)
  const exponente = Number((palabra >> 52n) & 2047n)
  const mantisa =
    (palabra & ((1n << 52n) - 1n)) + (exponente === 0 ? 0n : 1n << 52n)
  const potencia = (exponente === 0 ? -1022 : exponente - 1023) - 52
  const numerador =
    mantisa *
    10n ** BigInt(decimales) *
    (potencia >= 0 ? 2n ** BigInt(potencia) : 1n)
  const denominador = potencia < 0 ? 2n ** BigInt(-potencia) : 1n
  const entero = numerador / denominador
  const restoDoble = 2n * (numerador % denominador)
  const ajustado =
    restoDoble > denominador ||
    (restoDoble === denominador && entero % 2n !== 0n)
      ? entero + 1n
      : entero
  // Parsear la magnitud decimal completa evita redondear antes de dividir.
  return Number(`${valor < 0 ? "-" : ""}${ajustado}e-${decimales}`)
}

// Mantiene la presentación histórica de la API de céntimos (empate hacia +∞).
// No es antisimétrica ni una regla TGSS. El tabular divide euros precisos antes.
export const mensualizarCentimosPresentacionLegacy = (anual: number): number =>
  Math.round(anual / 12)
