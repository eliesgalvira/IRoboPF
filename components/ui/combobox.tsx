"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface OpcionCombobox<TValor extends string> {
  readonly valor: TValor
  readonly etiqueta: string
}

export function Combobox<TValor extends string>({
  className,
  compacto = false,
  etiqueta,
  opciones,
  onChange,
  valor,
}: {
  readonly className?: string
  readonly compacto?: boolean
  readonly etiqueta: string
  readonly opciones: ReadonlyArray<OpcionCombobox<TValor>>
  readonly onChange: (valor: TValor) => void
  readonly valor: TValor
}) {
  const [abierto, fijarAbierto] = React.useState(false)
  const contenedor = React.useRef<HTMLDivElement>(null)
  const opcionSeleccionada = opciones.find((opcion) => opcion.valor === valor)

  React.useEffect(() => {
    const cerrarAlPulsarFuera = (evento: MouseEvent) => {
      if (!contenedor.current?.contains(evento.target as Node)) {
        fijarAbierto(false)
      }
    }

    document.addEventListener("mousedown", cerrarAlPulsarFuera)
    return () => document.removeEventListener("mousedown", cerrarAlPulsarFuera)
  }, [])

  return (
    <div className={cn("relative grid gap-2", className)} ref={contenedor}>
      <span className="flex min-h-10 items-end text-sm leading-tight font-bold">
        {etiqueta}
      </span>
      <Button
        aria-expanded={abierto}
        className={cn(
          "justify-between border-[var(--rule)] bg-[var(--paper-2)] px-3 font-[var(--mono)] text-[var(--ink)] hover:bg-[var(--paper-2)]",
          compacto ? "h-9 text-sm" : "h-11 text-base"
        )}
        onClick={() => fijarAbierto((actual) => !actual)}
        role="combobox"
        type="button"
        variant="outline"
      >
        <span className="truncate">
          {opcionSeleccionada?.etiqueta ?? "Seleccionar"}
        </span>
        <ChevronsUpDown aria-hidden className="size-4 opacity-60" />
      </Button>
      {abierto ? (
        <div
          className="absolute top-full z-20 mt-1 max-h-72 w-full overflow-auto border border-[var(--rule)] bg-[var(--paper)] shadow-[4px_4px_0_var(--rule)]"
          role="listbox"
        >
          {opciones.map((opcion) => (
            <Button
              aria-selected={opcion.valor === valor}
              className={cn(
                "flex min-h-10 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--paper-2)]",
                opcion.valor === valor && "font-bold"
              )}
              key={opcion.valor}
              onClick={() => {
                onChange(opcion.valor)
                fijarAbierto(false)
              }}
              role="option"
              type="button"
              variant="unstyled"
            >
              <span>{opcion.etiqueta}</span>
              {opcion.valor === valor ? (
                <Check aria-hidden className="size-4 shrink-0" />
              ) : null}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
