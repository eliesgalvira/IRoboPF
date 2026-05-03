"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"

const ComboboxAnchorContext =
  React.createContext<React.RefObject<HTMLDivElement | null> | null>(null)

function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: React.ComponentProps<typeof ComboboxPrimitive.Root<Value, Multiple>>
) {
  const anchor = React.useRef<HTMLDivElement>(null)

  return (
    <ComboboxAnchorContext.Provider value={anchor}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxAnchorContext.Provider>
  )
}

const ComboboxValue = ComboboxPrimitive.Value

const asignarRefs =
  <T,>(...refs: ReadonlyArray<React.Ref<T> | undefined>) =>
  (valor: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(valor)
      } else if (ref !== undefined && ref !== null) {
        ref.current = valor
      }
    }
  }

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

function ComboboxChevronTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      type="button"
      aria-label="Abrir selector"
      className={cn(
        "group grid size-7 shrink-0 place-items-center border-l-2 border-[var(--rule)] text-[var(--ink)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none data-[popup-open]:bg-[var(--mark)]",
        className
      )}
      {...props}
    >
      <ChevronDown
        aria-hidden
        className="size-4 transition-transform group-data-[popup-open]:rotate-180"
      />
    </ComboboxPrimitive.Trigger>
  )
}

const ComboboxInputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.InputGroup>
>(function ComboboxInputGroup({ className, ...props }, ref) {
  const anchor = React.useContext(ComboboxAnchorContext)

  return (
    <ComboboxPrimitive.InputGroup
      className={cn(
        "flex min-h-10 items-center border-2 border-[var(--rule)] bg-[var(--paper)] px-2 py-1 shadow-[3px_3px_0_0_var(--rule)]",
        className
      )}
      ref={asignarRefs(ref, anchor)}
      {...props}
    />
  )
})

const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ComboboxPrimitive.Chips>
>(function ComboboxChips({ className, ...props }, ref) {
  const anchor = React.useContext(ComboboxAnchorContext)

  return (
    <ComboboxPrimitive.Chips
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1 border-2 border-[var(--rule)] bg-[var(--paper)] px-2 py-1 shadow-[3px_3px_0_0_var(--rule)]",
        className
      )}
      ref={asignarRefs(ref, anchor)}
      {...props}
    />
  )
})

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
  const anchor = React.useContext(ComboboxAnchorContext)

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        anchor={anchor}
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
  ComboboxChevronTrigger,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
}
