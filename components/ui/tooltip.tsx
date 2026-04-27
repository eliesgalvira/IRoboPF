"use client"

import * as React from "react"
import type { ReactElement } from "react"

export function Tooltip({
  children,
  contenido,
}: {
  readonly children: ReactElement<React.HTMLAttributes<HTMLElement>>
  readonly contenido: string
}) {
  const [abierto, fijarAbierto] = React.useState(false)
  const contenedor = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!abierto) {
      return
    }

    const cerrarAlPulsarFuera = (evento: PointerEvent) => {
      if (!contenedor.current?.contains(evento.target as Node)) {
        fijarAbierto(false)
      }
    }
    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        fijarAbierto(false)
      }
    }

    document.addEventListener("pointerdown", cerrarAlPulsarFuera)
    document.addEventListener("keydown", cerrarConEscape)
    return () => {
      document.removeEventListener("pointerdown", cerrarAlPulsarFuera)
      document.removeEventListener("keydown", cerrarConEscape)
    }
  }, [abierto])

  return (
    <span
      className="relative inline-flex"
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) {
          fijarAbierto(false)
        }
      }}
      onMouseEnter={() => fijarAbierto(true)}
      onMouseLeave={() => fijarAbierto(false)}
      ref={contenedor}
    >
      {React.cloneElement(children, {
        "aria-expanded": abierto,
        "aria-haspopup": "dialog",
        onClick: (evento: React.MouseEvent<HTMLElement>) => {
          children.props.onClick?.(evento)
          fijarAbierto((actual) => !actual)
        },
        onFocus: (evento: React.FocusEvent<HTMLElement>) => {
          children.props.onFocus?.(evento)
          fijarAbierto(true)
        },
      })}
      {abierto ? (
        <span
          className="fixed right-4 bottom-4 left-4 z-50 border border-[var(--rule)] bg-[var(--paper)] px-3 py-2 text-xs leading-5 text-[var(--ink)] shadow-[3px_3px_0_var(--rule)] sm:absolute sm:bottom-full sm:left-0 sm:mb-2 sm:w-64"
          role="tooltip"
        >
          {contenido}
        </span>
      ) : null}
    </span>
  )
}
