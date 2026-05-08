"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

export function Switch({
  checked,
  descripcion,
  etiqueta,
  onCheckedChange,
}: {
  readonly checked: boolean
  readonly descripcion?: string
  readonly etiqueta: string
  readonly onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-11 items-start justify-between gap-5 py-0.5">
      <span className="grid min-w-0 gap-1">
        <span className="text-sm leading-tight font-bold">{etiqueta}</span>
        {descripcion !== undefined && descripcion !== "" ? (
          <span className="text-sm leading-6 text-[var(--ink-soft)]">
            {descripcion}
          </span>
        ) : null}
      </span>
      <SwitchPrimitive.Root
        checked={checked}
        className={cn(
          "mt-0.5 h-7 w-12 shrink-0 rounded-full border border-[var(--rule)] bg-[var(--paper-2)] p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--mark)] focus-visible:outline-none",
          checked && "bg-[var(--ink)]"
        )}
        onCheckedChange={onCheckedChange}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block size-6 rounded-full bg-[var(--ink)] transition-transform",
            checked && "translate-x-5 bg-[var(--paper)]"
          )}
        />
      </SwitchPrimitive.Root>
    </label>
  )
}
