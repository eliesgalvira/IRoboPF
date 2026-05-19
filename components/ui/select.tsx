"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

export interface OpcionSelect<TValor extends string> {
  readonly valor: TValor
  readonly etiqueta: string
}

export function Select<TValor extends string>({
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
  readonly opciones: ReadonlyArray<OpcionSelect<TValor>>
  readonly onChange: (valor: TValor) => void
  readonly valor: TValor
}) {
  const items = React.useMemo(
    () =>
      opciones.map((opcion) => ({
        label: opcion.etiqueta,
        value: opcion.valor,
      })),
    [opciones]
  )

  return (
    <SelectPrimitive.Root
      items={items}
      modal={false}
      onValueChange={(siguiente) => {
        if (siguiente !== null) {
          onChange(siguiente as TValor)
        }
      }}
      value={valor}
    >
      <div className={cn("grid", compacto ? "gap-1.5" : "gap-2", className)}>
        <SelectPrimitive.Label
          className={cn(
            "flex items-end text-sm leading-tight font-bold",
            compacto ? "min-h-8" : "min-h-10"
          )}
        >
          {etiqueta}
        </SelectPrimitive.Label>
        <SelectPrimitive.Trigger
          className={cn(
            "flex w-full items-center justify-between border border-[var(--rule)] bg-[var(--paper-2)] px-3 font-[var(--mono)] text-[var(--ink)] hover:bg-[var(--paper-2)] focus-visible:ring-2 focus-visible:ring-[var(--mark)] focus-visible:outline-none",
            compacto ? "h-8 text-sm" : "h-11 text-base"
          )}
        >
          <SelectPrimitive.Value placeholder="Seleccionar" />
          <SelectPrimitive.Icon>
            <ChevronsUpDown aria-hidden className="size-4 opacity-60" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </div>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          align="start"
          alignItemWithTrigger={false}
          collisionAvoidance={{
            align: "shift",
            fallbackAxisSide: "none",
            side: "flip",
          }}
          collisionPadding={12}
          className="z-50 w-[var(--anchor-width)] max-w-[calc(100vw-1.5rem)]"
          positionMethod="fixed"
          side="bottom"
          sideOffset={4}
        >
          <SelectPrimitive.Popup className="max-h-[min(var(--available-height),18rem)] origin-[var(--transform-origin)] overflow-auto border border-[var(--rule)] bg-[var(--paper)] shadow-[4px_4px_0_var(--rule)] transition-[opacity,scale] duration-100 outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <SelectPrimitive.List>
              {opciones.map((opcion) => (
                <SelectPrimitive.Item
                  className={cn(
                    "flex min-h-10 w-full cursor-default items-center justify-between gap-3 px-3 py-2 text-left text-sm outline-none hover:bg-[var(--paper-2)] data-[highlighted]:bg-[var(--paper-2)]",
                    opcion.valor === valor && "font-bold"
                  )}
                  key={opcion.valor}
                  label={opcion.etiqueta}
                  value={opcion.valor}
                >
                  <SelectPrimitive.ItemText>
                    {opcion.etiqueta}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden className="size-4 shrink-0" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
