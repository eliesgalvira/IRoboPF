"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type OpcionSelectorModoGrafico<TModo extends string> = {
  readonly valor: TModo
  readonly etiqueta: ReactNode
}

export type OpcionesSelectorModoGrafico<TModo extends string> = readonly [
  OpcionSelectorModoGrafico<TModo>,
  OpcionSelectorModoGrafico<TModo>,
]

export function SelectorModoGrafico<TModo extends string>({
  modo,
  opciones,
  ariaLabel,
  alCambiar,
  className,
}: {
  readonly modo: TModo
  readonly opciones: OpcionesSelectorModoGrafico<TModo>
  readonly ariaLabel: string
  readonly alCambiar: (modo: TModo) => void
  readonly className?: string
}) {
  const indiceActivo = opciones[1].valor === modo ? 1 : 0
  const indiceSiguiente = indiceActivo === 1 ? 0 : 1

  return (
    <button
      type="button"
      role="switch"
      aria-checked={indiceActivo === 1}
      aria-label={ariaLabel}
      onClick={() => alCambiar(opciones[indiceSiguiente].valor)}
      className={cn(
        "relative grid h-10 w-28 min-w-28 grid-cols-2 items-center border-2 border-[var(--rule)] bg-[var(--paper)] px-1 font-[family-name:var(--mono)] text-sm font-bold tabular-nums shadow-[3px_3px_0_0_var(--rule)] transition-[box-shadow,translate]",
        "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--rule)]",
        "focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 focus-visible:shadow-[5px_5px_0_0_var(--rule)] focus-visible:ring-2 focus-visible:ring-[var(--mark)] focus-visible:outline-none",
        "active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--rule)]",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-[var(--rule)] transition-transform duration-200 ease-out",
          indiceActivo === 1 && "translate-x-full"
        )}
      />
      {opciones.map((opcion, indice) => {
        const activo = indiceActivo === indice

        return (
          <span
            key={opcion.valor}
            className={cn(
              "relative z-10 text-center transition-[color,opacity] duration-200",
              activo ? "text-[var(--paper)]" : "text-[var(--ink)] opacity-40"
            )}
          >
            {opcion.etiqueta}
          </span>
        )
      })}
    </button>
  )
}
