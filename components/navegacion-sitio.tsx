"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function IconoGitHub() {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="none"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        transform="scale(64)"
        fill="currentColor"
      />
    </svg>
  )
}

function IconoMenuMovil({ abierto }: { readonly abierto: boolean }) {
  return (
    <span className="flex w-6 shrink-0 flex-col gap-1.5" aria-hidden="true">
      <span
        className={cn(
          "block h-0.5 w-6 bg-current transition-all duration-300",
          abierto ? "translate-y-2 rotate-45" : ""
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-6 bg-current transition-all duration-300",
          abierto ? "opacity-0" : ""
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-6 bg-current transition-all duration-300",
          abierto ? "-translate-y-2 -rotate-45" : ""
        )}
      />
    </span>
  )
}

export function NavegacionSitio() {
  const rutaActual = usePathname()
  const enAuditoria = rutaActual?.startsWith("/auditoria") ?? false
  const enLiquidacion = rutaActual?.startsWith("/liquidacion-irpf") ?? false
  const [estadoMenuMovil, fijarEstadoMenuMovil] = React.useState<{
    readonly ruta: string | null
    readonly abierto: boolean
  }>({ ruta: null, abierto: false })
  const idMenuMovil = React.useId()
  const botonMenuMovilRef = React.useRef<HTMLButtonElement>(null)
  const enlaces = [
    {
      href: "/",
      etiqueta: "Simulador",
      activo: !enAuditoria && !enLiquidacion,
    },
    {
      href: "/auditoria",
      etiqueta: "Auditoría",
      activo: enAuditoria,
    },
    {
      href: "/liquidacion-irpf",
      etiqueta: "Liquidación",
      activo: enLiquidacion,
    },
  ] as const
  const etiquetaRutaActual =
    enlaces.find((enlace) => enlace.activo)?.etiqueta ?? "Menú"
  const menuMovilAbierto =
    estadoMenuMovil.abierto && estadoMenuMovil.ruta === rutaActual

  const alternarMenuMovil = () => {
    fijarEstadoMenuMovil((estadoActual) => ({
      ruta: rutaActual,
      abierto: estadoActual.ruta === rutaActual ? !estadoActual.abierto : true,
    }))
  }

  const cerrarMenuMovil = () => {
    botonMenuMovilRef.current?.focus({ preventScroll: true })
    fijarEstadoMenuMovil({ ruta: rutaActual, abierto: false })
  }

  return (
    <nav className="relative text-sm tracking-[0.28em] text-[var(--ink)]/80 uppercase">
      <div className="hidden items-center justify-between gap-x-6 gap-y-2 md:flex">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {enlaces.map((enlace, indice) => (
            <React.Fragment key={enlace.href}>
              {indice > 0 ? <span className="opacity-30">·</span> : null}
              <Link
                href={enlace.href}
                aria-current={enlace.activo ? "page" : undefined}
                className={cn(
                  "border-b transition",
                  enlace.activo
                    ? "border-current"
                    : "border-transparent hover:border-current/60"
                )}
              >
                {enlace.etiqueta}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <a
          href="https://github.com/eliesgalvira/IRoboPF"
          className="inline-flex items-center gap-2 border-b border-transparent transition hover:border-current/60"
          rel="noreferrer"
          target="_blank"
        >
          <IconoGitHub />
          GitHub
        </a>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate border-b border-current text-[var(--ink)]">
            {etiquetaRutaActual}
          </span>
          <Button
            ref={botonMenuMovilRef}
            type="button"
            variant="unstyled"
            aria-controls={idMenuMovil}
            aria-expanded={menuMovilAbierto}
            aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={alternarMenuMovil}
            className="inline-flex h-11 items-center gap-3 border-2 border-[var(--rule)] bg-[var(--paper)] px-3 text-[var(--ink)] shadow-[4px_4px_0_var(--rule)] transition-[background-color,color,box-shadow,transform] hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <IconoMenuMovil abierto={menuMovilAbierto} />
            Menú
          </Button>
        </div>

        <div
          id={idMenuMovil}
          inert={!menuMovilAbierto}
          className={cn(
            "absolute right-0 left-0 z-40 mt-3 grid overflow-hidden border-2 border-[var(--rule)] bg-[var(--paper)] shadow-[6px_6px_0_var(--rule)] transition-[grid-template-rows,opacity,transform] duration-200 ease-out",
            menuMovilAbierto
              ? "translate-y-0 grid-rows-[1fr] opacity-100"
              : "pointer-events-none -translate-y-2 grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="grid divide-y-2 divide-[var(--rule)]">
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  aria-current={enlace.activo ? "page" : undefined}
                  tabIndex={menuMovilAbierto ? 0 : -1}
                  onClick={cerrarMenuMovil}
                  className={cn(
                    "px-4 py-4 transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none",
                    enlace.activo
                      ? "bg-[var(--rule)] text-[var(--paper)]"
                      : "text-[var(--ink)]"
                  )}
                >
                  {enlace.etiqueta}
                </Link>
              ))}
              <a
                href="https://github.com/eliesgalvira/IRoboPF"
                rel="noreferrer"
                target="_blank"
                tabIndex={menuMovilAbierto ? 0 : -1}
                onClick={cerrarMenuMovil}
                className="inline-flex items-center gap-3 px-4 py-4 text-[var(--ink)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none"
              >
                <IconoGitHub />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
