import * as React from "react"
import { Anton, JetBrains_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--v2-display",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--v2-mono",
})

export default function V2Layout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      className={cn(display.variable, mono.variable, "v2-theme")}
      style={{
        fontFamily: "var(--v2-mono)",
        background: "var(--v2-paper)",
        color: "var(--v2-ink)",
        ["--v2-paper" as string]: "oklch(0.985 0 0)",
        ["--v2-paper-2" as string]: "oklch(0.96 0 0)",
        ["--v2-ink" as string]: "oklch(0.10 0 0)",
        ["--v2-ink-soft" as string]: "oklch(0.30 0 0)",
        ["--v2-rule" as string]: "oklch(0.10 0 0)",
        ["--v2-accent" as string]: "oklch(0.93 0.18 95)",
        ["--v2-accent-ink" as string]: "oklch(0.10 0 0)",
        ["--v2-danger" as string]: "oklch(0.58 0.22 27)",
        ["--v2-gain" as string]: "oklch(0.55 0.16 155)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
