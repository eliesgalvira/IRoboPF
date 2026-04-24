import * as React from "react"
import { Fraunces, IBM_Plex_Serif, JetBrains_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--v1-display",
})

const body = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--v1-body",
})

const numerals = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--v1-mono",
})

export default function V1Layout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      className={cn(
        display.variable,
        body.variable,
        numerals.variable,
        "v1-theme",
      )}
      style={{
        fontFamily: "var(--v1-body)",
        background: "var(--v1-paper)",
        color: "var(--v1-ink)",
        ["--v1-paper" as string]: "oklch(0.97 0.018 80)",
        ["--v1-ink" as string]: "oklch(0.18 0.015 50)",
        ["--v1-ink-soft" as string]: "oklch(0.35 0.012 50)",
        ["--v1-rule" as string]: "oklch(0.78 0.014 70)",
        ["--v1-accent" as string]: "oklch(0.52 0.18 35)",
        ["--v1-accent-soft" as string]: "oklch(0.92 0.06 50)",
        ["--v1-gain" as string]: "oklch(0.45 0.10 200)",
        ["--v1-gain-soft" as string]: "oklch(0.93 0.04 195)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
