"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import type { ReactElement } from "react"

export function Tooltip({
  children,
  contenido,
}: {
  readonly children: ReactElement
  readonly contenido: string
}) {
  return (
    <TooltipPrimitive.Provider delay={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger render={children} />
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner sideOffset={8}>
            <TooltipPrimitive.Popup className="max-w-64 border border-[var(--rule)] bg-[var(--paper)] px-3 py-2 text-xs leading-5 text-[var(--ink)] shadow-[3px_3px_0_var(--rule)]">
              {contenido}
              <TooltipPrimitive.Arrow className="fill-[var(--paper)]" />
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
