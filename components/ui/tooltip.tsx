"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import type { ReactElement } from "react"

export function Tooltip({
  children,
  contenido,
}: {
  readonly children: ReactElement<React.HTMLAttributes<HTMLElement>>
  readonly contenido: string
}) {
  const [abierto, fijarAbierto] = React.useState(false)
  const [posicion, fijarPosicion] = React.useState<{
    readonly izquierda: number
    readonly arriba: number
  } | null>(null)
  const contenedor = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    if (!abierto || !contenedor.current) {
      return
    }

    const rectangulo = contenedor.current.getBoundingClientRect()
    fijarPosicion({
      izquierda: Math.min(rectangulo.left, window.innerWidth - 280),
      arriba: Math.max(16, rectangulo.top - 12),
    })
  }, [abierto])

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
        },
        onFocus: (evento: React.FocusEvent<HTMLElement>) => {
          children.props.onFocus?.(evento)
          fijarAbierto(true)
        },
        onPointerDown: (evento: React.PointerEvent<HTMLElement>) => {
          children.props.onPointerDown?.(evento)
          evento.stopPropagation()
          fijarAbierto((actual) => !actual)
        },
      })}
      {abierto && posicion
        ? createPortal(
        <span
          className="fixed z-[1000] w-[min(16rem,calc(100vw-2rem))] -translate-y-full border-2 border-[var(--rule)] bg-[oklch(0.965_0.014_92)] px-3 py-2 text-xs leading-5 text-[var(--ink)] opacity-100 shadow-[5px_5px_0_var(--rule)]"
          role="tooltip"
          style={{
            left: posicion.izquierda,
            top: posicion.arriba,
          }}
        >
          {contenido}
        </span>,
          document.body
        )
        : null}
    </span>
  )
}
