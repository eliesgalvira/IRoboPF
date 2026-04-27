"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export function Checkbox({
  checked,
  etiqueta,
  onCheckedChange,
}: {
  readonly checked: boolean
  readonly etiqueta: string
  readonly onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <CheckboxPrimitive.Root
        checked={checked}
        className={cn(
          "grid size-5 place-items-center border border-[var(--rule)] bg-[var(--paper-2)] text-[var(--ink)]",
          "hover:bg-[var(--paper)] focus-visible:ring-2 focus-visible:ring-[var(--mark)] focus-visible:outline-none"
        )}
        onCheckedChange={onCheckedChange}
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden className="size-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span>{etiqueta}</span>
    </label>
  )
}
