"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Simulador" },
  { href: "/auditoria", label: "Auditoría" },
] as const

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 border border-border bg-card p-1">
      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
              active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
