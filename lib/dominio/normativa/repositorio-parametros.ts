import type { FuenteNormativaNormalizada } from "./fuente-normativa"

export interface ParametroNormativoEjecutable<TValor> {
  readonly _tag: "ParametroNormativoEjecutable"
  readonly nombre: string
  readonly valor: TValor
  readonly fuente: FuenteNormativaNormalizada
}

export const parametroNormativo = <TValor>({
  fuente,
  nombre,
  valor,
}: {
  readonly fuente: FuenteNormativaNormalizada
  readonly nombre: string
  readonly valor: TValor
}): ParametroNormativoEjecutable<TValor> => ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
})
