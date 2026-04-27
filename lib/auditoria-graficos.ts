const pasosSalarioEuros = [1_000, 2_000, 5_000, 10_000, 20_000, 25_000, 50_000]
const maximoEtiquetasSalario = 10

export function ticksSalarioEuros({
  minimoEuros,
  maximoEuros,
}: {
  readonly minimoEuros: number
  readonly maximoEuros: number
}) {
  const minimo = Math.min(minimoEuros, maximoEuros)
  const maximo = Math.max(minimoEuros, maximoEuros)
  const amplitud = maximo - minimo
  const paso =
    pasosSalarioEuros.find((pasoCandidato) => {
      const primerTick = Math.ceil(minimo / pasoCandidato) * pasoCandidato
      const ultimoTick = Math.floor(maximo / pasoCandidato) * pasoCandidato
      const ticksIntermedios =
        ultimoTick >= primerTick
          ? (ultimoTick - primerTick) / pasoCandidato + 1
          : 0

      return ticksIntermedios <= maximoEtiquetasSalario
    }) ?? pasosSalarioEuros.at(-1)!
  const primerTick = Math.ceil(minimo / paso) * paso
  const ticks = []

  if (amplitud === 0) return [minimo]

  for (let salario = primerTick; salario <= maximo; salario += paso) {
    ticks.push(salario)
  }

  return ticks
}
