import type { Metadata, Viewport } from "next"
import { Anton, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const fuenteTitular = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--display",
})

const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--mono",
})

export const metadata: Metadata = {
  title: "Progresividad en frío · IRPF",
  description:
    "Calculadora divulgativa de salario neto, IRPF y poder adquisitivo en España (2012 — 2026).",
  applicationName: "IRoboPF",
  appleWebApp: {
    capable: true,
    title: "IRoboPF",
    statusBarStyle: "default",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4ECD3" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  colorScheme: "light dark",
}

export default function DisposicionRaiz({
  children: hijos,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={cn(
          fuenteTitular.variable,
          fuenteMono.variable,
          "site-theme antialiased"
        )}
        style={
          {
            fontFamily: "var(--mono)",
            background: "var(--paper)",
            color: "var(--ink)",
            ["--paper" as string]: "oklch(0.965 0.014 92)",
            ["--paper-2" as string]: "oklch(0.935 0.02 92)",
            ["--ink" as string]: "oklch(0.10 0 0)",
            ["--ink-soft" as string]: "oklch(0.30 0 0)",
            ["--rule" as string]: "oklch(0.10 0 0)",
            ["--mark" as string]: "oklch(0.93 0.18 95)",
            ["--mark-ink" as string]: "oklch(0.10 0 0)",
            ["--danger" as string]: "oklch(0.58 0.22 27)",
            ["--gain" as string]: "oklch(0.55 0.16 155)",
          } as React.CSSProperties
        }
      >
        {hijos}
      </body>
    </html>
  )
}
