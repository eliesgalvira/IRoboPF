"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type Tone = "editorial" | "civic" | "notebook"

const variants: ReadonlyArray<{
  readonly slug: "v1" | "v2" | "v3"
  readonly label: string
}> = [
  { slug: "v1", label: "01 · La crónica" },
  { slug: "v2", label: "02 · Boletín" },
  { slug: "v3", label: "03 · Cuaderno" },
]

export function VariantNav({
  variant,
  tone,
}: {
  readonly variant: "v1" | "v2" | "v3"
  readonly tone: Tone
}) {
  const pathname = usePathname()
  const onAudit = pathname?.includes("/auditoria") ?? false

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px]",
        tone === "editorial" && "uppercase tracking-[0.22em] text-current/70",
        tone === "civic" && "uppercase tracking-[0.28em] text-current/80",
        tone === "notebook" && "tracking-wider text-current/70",
      )}
    >
      <Link
        href="/"
        className={cn(
          "border-b border-transparent transition hover:border-current/60",
        )}
      >
        ← Otras lecturas
      </Link>
      <span className="opacity-30">·</span>
      <Link
        href={`/${variant}`}
        className={cn(
          "border-b transition",
          !onAudit ? "border-current" : "border-transparent hover:border-current/60",
        )}
      >
        Simulador
      </Link>
      <span className="opacity-30">·</span>
      <Link
        href={`/${variant}/auditoria`}
        className={cn(
          "border-b transition",
          onAudit ? "border-current" : "border-transparent hover:border-current/60",
        )}
      >
        Auditoría
      </Link>
      <span className="ml-auto hidden items-center gap-2 text-current/50 sm:flex">
        {variants.map((v) => (
          <Link
            key={v.slug}
            href={`/${v.slug}${onAudit ? "/auditoria" : ""}`}
            className={cn(
              "transition hover:text-current",
              v.slug === variant ? "text-current" : "",
            )}
          >
            {v.label}
          </Link>
        ))}
      </span>
    </nav>
  )
}
