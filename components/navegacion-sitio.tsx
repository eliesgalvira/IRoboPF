"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NavegacionSitio() {
  const rutaActual = usePathname()
  const enAuditoria = rutaActual?.startsWith("/auditoria") ?? false
  const enLiquidacion = rutaActual?.startsWith("/liquidacion-irpf") ?? false
  const [estadoMenuMovil, fijarEstadoMenuMovil] = React.useState<{
    readonly ruta: string | null
    readonly abierto: boolean
  }>({ ruta: null, abierto: false })
  const idMenuMovil = React.useId()
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
          className="border-b border-transparent transition hover:border-current/60"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate border-b border-current text-[var(--ink)]">
            {etiquetaRutaActual}
          </span>
          <Button
            type="button"
            variant="unstyled"
            aria-controls={idMenuMovil}
            aria-expanded={menuMovilAbierto}
            aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={alternarMenuMovil}
            className="inline-flex h-11 items-center gap-3 border-2 border-[var(--rule)] bg-[var(--paper)] px-3 text-[var(--ink)] shadow-[4px_4px_0_var(--rule)] transition-[background-color,color,box-shadow,transform] hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span className="relative size-5" aria-hidden="true">
              <Menu
                className={cn(
                  "absolute inset-0 size-5 transition-[opacity,transform] duration-200",
                  menuMovilAbierto
                    ? "rotate-90 opacity-0"
                    : "rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 size-5 transition-[opacity,transform] duration-200",
                  menuMovilAbierto
                    ? "rotate-0 opacity-100"
                    : "-rotate-90 opacity-0"
                )}
              />
            </span>
            Menú
          </Button>
        </div>

        <div
          id={idMenuMovil}
          aria-hidden={!menuMovilAbierto}
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
                className="px-4 py-4 text-[var(--ink)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
