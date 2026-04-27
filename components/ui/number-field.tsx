"use client"

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { CircleHelp, Minus, Plus } from "lucide-react"

import { Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function NumberField({
  ayuda,
  etiqueta,
  formato,
  max,
  min = 0,
  onChange,
  paso = 1,
  valor,
}: {
  readonly ayuda?: string
  readonly etiqueta: string
  readonly formato?: Intl.NumberFormatOptions
  readonly max?: number
  readonly min?: number
  readonly onChange: (valor: number) => void
  readonly paso?: number
  readonly valor: number
}) {
  return (
    <NumberFieldPrimitive.Root
      className="grid gap-2"
      format={formato}
      locale="es-ES"
      max={max}
      min={min}
      onValueChange={(siguiente) => onChange(siguiente ?? min)}
      snapOnStep
      step={paso}
      value={valor}
    >
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-bold">{etiqueta}</label>
        {ayuda ? (
          <Tooltip contenido={ayuda}>
            <button
              aria-label={`Ayuda sobre ${etiqueta}`}
              className="text-[var(--ink-soft)] hover:text-[var(--ink)]"
              type="button"
            >
              <CircleHelp aria-hidden className="size-3.5" />
            </button>
          </Tooltip>
        ) : null}
      </div>
      <NumberFieldPrimitive.Group className="grid h-11 grid-cols-[2.25rem_1fr_2.25rem] border border-[var(--rule)] bg-[var(--paper-2)] focus-within:ring-2 focus-within:ring-[var(--mark)]">
        <ControlNumero direccion="menos" />
        <NumberFieldPrimitive.Input className="min-w-0 bg-transparent px-3 text-base font-[var(--mono)] outline-none" />
        <ControlNumero direccion="mas" />
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  )
}

function ControlNumero({ direccion }: { readonly direccion: "mas" | "menos" }) {
  const Control =
    direccion === "mas"
      ? NumberFieldPrimitive.Increment
      : NumberFieldPrimitive.Decrement
  const Icono = direccion === "mas" ? Plus : Minus

  return (
    <Control
      aria-label={direccion === "mas" ? "Incrementar" : "Reducir"}
      className={cn(
        "flex h-full items-center justify-center border-[var(--rule)] text-[var(--ink-soft)] hover:bg-[var(--paper)] disabled:opacity-35",
        direccion === "mas" ? "border-l" : "border-r"
      )}
      type="button"
    >
      <Icono aria-hidden className="size-4" />
    </Control>
  )
}
