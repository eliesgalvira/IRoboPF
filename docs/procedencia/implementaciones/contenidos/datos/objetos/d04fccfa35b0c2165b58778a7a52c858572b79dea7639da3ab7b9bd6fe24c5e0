"use client"

import * as React from "react"

export function useContadorAnimado(valor: number, duracionMs = 600) {
  const [mostrado, fijarMostrado] = React.useState(valor)
  const anterior = React.useRef(valor)

  React.useEffect(() => {
    const inicio = anterior.current
    const fin = valor
    if (inicio === fin) {
      fijarMostrado(fin)
      return
    }
    const instanteInicial = performance.now()
    let raf = 0
    const animar = (ahora: number) => {
      const progreso = Math.min(1, (ahora - instanteInicial) / duracionMs)
      const suavizado = 1 - Math.pow(1 - progreso, 3)
      const siguiente = inicio + (fin - inicio) * suavizado
      fijarMostrado(siguiente)
      if (progreso < 1) {
        raf = requestAnimationFrame(animar)
      } else {
        fijarMostrado(fin)
        anterior.current = fin
      }
    }
    raf = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(raf)
  }, [valor, duracionMs])

  return mostrado
}
