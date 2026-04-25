"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function NavegacionSitio() {
  const rutaActual = usePathname()
  const enAuditoria = rutaActual?.startsWith("/auditoria") ?? false

  return (
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.28em] text-[var(--ink)]/80 uppercase">
      <Link
        href="/"
        className={cn(
          "border-b transition",
          !enAuditoria
            ? "border-current"
            : "border-transparent hover:border-current/60"
        )}
      >
        Simulador
      </Link>
      <span className="opacity-30">·</span>
      <Link
        href="/auditoria"
        className={cn(
          "border-b transition",
          enAuditoria
            ? "border-current"
            : "border-transparent hover:border-current/60"
        )}
      >
        Auditoría
      </Link>
      <span className="ml-auto text-[var(--ink)]/55">
        progresividad en frío · 2012 — 2026
      </span>
    </nav>
  )
}
