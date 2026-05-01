"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

const Combobox = ComboboxPrimitive.Root
const ComboboxValue = ComboboxPrimitive.Value

function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      className={cn(
        "min-w-0 flex-1 bg-transparent px-2 py-1 font-[family-name:var(--mono)] text-sm outline-none placeholder:text-[var(--ink-soft)]",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips>) {
  return (
    <ComboboxPrimitive.Chips
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1 border-2 border-[var(--rule)] bg-[var(--paper)] px-2 py-1 shadow-[3px_3px_0_0_var(--rule)]",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chip>) {
  return (
    <ComboboxPrimitive.Chip
      className={cn(
        "inline-flex items-center gap-1 border-2 border-[var(--rule)] bg-[var(--paper-2)] px-2 py-0.5 font-[family-name:var(--mono)] text-xs font-bold",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ChipRemove
        aria-label={`Quitar ${children}`}
        className="grid size-4 place-items-center hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none"
      >
        <X aria-hidden className="size-3" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      className={cn(
        "min-w-36 flex-1 bg-transparent px-1 py-1 font-[family-name:var(--mono)] text-sm outline-none placeholder:text-[var(--ink-soft)]",
        className
      )}
      {...props}
    />
  )
}

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        sideOffset={4}
        className="z-30 w-[var(--anchor-width)]"
      >
        <ComboboxPrimitive.Popup
          className={cn(
            "max-h-72 w-[var(--anchor-width)] overflow-auto border-2 border-[var(--rule)] bg-[var(--paper)] shadow-[5px_5px_0_0_var(--rule)] outline-none",
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      className={cn("px-3 py-2 text-sm text-[var(--ink-soft)]", className)}
      {...props}
    />
  )
}

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return <ComboboxPrimitive.List className={cn("grid", className)} {...props} />
}

function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "flex min-h-10 cursor-default items-center gap-2 px-3 py-2 text-sm outline-none",
        "data-[highlighted]:bg-[var(--mark)] data-[highlighted]:text-[var(--mark-ink)] data-[selected]:font-bold",
        className
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator className="text-[var(--ink)] data-[highlighted]:text-[var(--mark-ink)]">
        <Check aria-hidden className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
      <span className="min-w-0">{children}</span>
    </ComboboxPrimitive.Item>
  )
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
}
