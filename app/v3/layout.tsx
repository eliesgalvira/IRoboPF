import * as React from "react"
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--v3-display",
})

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--v3-body",
})

const numerals = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--v3-mono",
})

export default function V3Layout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      className={cn(display.variable, body.variable, numerals.variable, "v3-theme")}
      style={{
        fontFamily: "var(--v3-body)",
        background: "var(--v3-paper)",
        color: "var(--v3-ink)",
        ["--v3-paper" as string]: "oklch(0.96 0.025 145)",
        ["--v3-paper-2" as string]: "oklch(0.92 0.04 145)",
        ["--v3-ink" as string]: "oklch(0.22 0.04 150)",
        ["--v3-ink-soft" as string]: "oklch(0.42 0.04 150)",
        ["--v3-rule" as string]: "oklch(0.78 0.04 145)",
        ["--v3-accent" as string]: "oklch(0.58 0.20 35)",
        ["--v3-accent-soft" as string]: "oklch(0.92 0.05 40)",
        ["--v3-secondary" as string]: "oklch(0.50 0.13 220)",
        ["--v3-secondary-soft" as string]: "oklch(0.92 0.04 220)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
