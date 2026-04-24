"use client"

import * as React from "react"
import Link from "next/link"
import { Fraunces, Anton, Instrument_Serif, JetBrains_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "800"] })
const anton = Anton({ subsets: ["latin"], weight: "400" })
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" })
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] })

type Variant = {
  readonly id: "v1" | "v2" | "v3"
  readonly slug: string
  readonly kicker: string
  readonly title: string
  readonly tagline: string
  readonly bodyFont: string
  readonly displayFont: string
  readonly background: string
  readonly ink: string
  readonly accent: string
  readonly secondary: string
  readonly motif: React.ReactNode
}

const variants: ReadonlyArray<Variant> = [
  {
    id: "v1",
    slug: "/v1",
    kicker: "Variante 1",
    title: "La crónica",
    tagline:
      "Un reportaje pedagógico de larga lectura. Tipografía editorial, marginalias y números que respiran.",
    bodyFont: fraunces.className,
    displayFont: fraunces.className,
    background: "oklch(0.97 0.018 80)",
    ink: "oklch(0.18 0.015 50)",
    accent: "oklch(0.55 0.18 35)",
    secondary: "oklch(0.55 0.10 200)",
    motif: (
      <svg viewBox="0 0 200 80" className="h-full w-full">
        <text
          x="100"
          y="55"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="48"
          fontWeight="500"
        >
          €
        </text>
        <line
          x1="20"
          x2="180"
          y1="68"
          y2="68"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>
    ),
  },
  {
    id: "v2",
    slug: "/v2",
    kicker: "Variante 2",
    title: "Boletín oficial",
    tagline:
      "Brutalismo cívico. Una rejilla dura, mayúsculas condensadas y dígitos enormes que ocupan la página.",
    bodyFont: mono.className,
    displayFont: anton.className,
    background: "oklch(0.985 0 0)",
    ink: "oklch(0.10 0 0)",
    accent: "oklch(0.93 0.18 95)",
    secondary: "oklch(0.58 0.22 27)",
    motif: (
      <svg viewBox="0 0 200 80" className="h-full w-full">
        <rect x="14" y="14" width="172" height="52" stroke="currentColor" strokeWidth="2" fill="none" />
        <text
          x="100"
          y="55"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="Anton, sans-serif"
          fontSize="44"
          letterSpacing="0.15em"
        >
          IRPF
        </text>
      </svg>
    ),
  },
  {
    id: "v3",
    slug: "/v3",
    kicker: "Variante 3",
    title: "Cuaderno verde",
    tagline:
      "Un cuaderno orgánico, casi caligráfico. Notas a mano, papel suave y una serif altísima como protagonista.",
    bodyFont: instrument.className,
    displayFont: instrument.className,
    background: "oklch(0.96 0.025 145)",
    ink: "oklch(0.22 0.04 150)",
    accent: "oklch(0.65 0.20 35)",
    secondary: "oklch(0.55 0.13 220)",
    motif: (
      <svg viewBox="0 0 200 80" className="h-full w-full">
        <path
          d="M16 50 C 50 70, 80 14, 110 50 S 170 70, 188 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="32" cy="55" r="3" fill="currentColor" />
        <circle cx="170" cy="40" r="3" fill="currentColor" />
      </svg>
    ),
  },
]

export function DesignPicker() {
  return (
    <main
      className={cn(
        mono.className,
        "min-h-svh bg-[oklch(0.985_0_0)] text-[oklch(0.18_0_0)]",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:py-20">
        <header className="grid gap-5 border-b border-black/15 pb-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end sm:gap-10">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-black/60">
            <span className="size-1.5 animate-pulse rounded-full bg-[oklch(0.58_0.22_27)]" />
            <span>Branch · redesign/three-design-variants</span>
          </div>
          <p className="text-sm leading-6 text-black/70 sm:text-right">
            Tres rediseños del simulador de progresividad en frío.
            <br className="hidden sm:block" />
            Misma calculadora, misma auditoría, tres formas distintas de leerlo.
          </p>
        </header>

        <section className="grid gap-3">
          <h1 className={cn(fraunces.className, "text-balance text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl")}>
            Elige la lectura
            <br />
            <em className="font-normal italic text-black/55">que mejor explique</em>
            <br />
            la progresividad en frío.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-black/70 sm:text-lg">
            Cada variante respeta el dominio (consulta individual, auditoría por rango,
            comparación ajustada por IPC, exportaciones Excel) pero cambia la voz, el
            ritmo y la jerarquía de la página. Pulsa una para entrar a la lectura completa.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant, index) => (
            <Link
              key={variant.id}
              href={variant.slug}
              className="group relative flex flex-col gap-5 overflow-hidden border border-black/15 p-5 transition-all hover:border-black hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_currentColor] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:p-6"
              style={{ background: variant.background, color: variant.ink }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    mono.className,
                    "text-[10px] uppercase tracking-[0.3em] opacity-70",
                  )}
                >
                  {variant.kicker}
                </span>
                <span
                  className={cn(
                    mono.className,
                    "text-[10px] uppercase tracking-[0.3em] opacity-70",
                  )}
                >
                  0{index + 1} / 03
                </span>
              </div>

              <div className="h-20 opacity-80" style={{ color: variant.accent }}>
                {variant.motif}
              </div>

              <div className="flex flex-col gap-2">
                <h2
                  className={cn(
                    variant.displayFont,
                    "text-balance text-3xl leading-[1.05] sm:text-4xl",
                  )}
                >
                  {variant.title}
                </h2>
                <p className={cn(variant.bodyFont, "text-sm leading-6 opacity-80 sm:text-base")}>
                  {variant.tagline}
                </p>
              </div>

              <dl className={cn(mono.className, "mt-auto grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] uppercase tracking-wider")}>
                <dt className="opacity-60">tinta</dt>
                <dd className="text-right">
                  <span
                    className="inline-block size-3 align-middle"
                    style={{ background: variant.ink }}
                  />
                </dd>
                <dt className="opacity-60">acento</dt>
                <dd className="text-right">
                  <span
                    className="inline-block size-3 align-middle"
                    style={{ background: variant.accent }}
                  />
                </dd>
                <dt className="opacity-60">secundario</dt>
                <dd className="text-right">
                  <span
                    className="inline-block size-3 align-middle"
                    style={{ background: variant.secondary }}
                  />
                </dd>
              </dl>

              <div className="flex items-center justify-between border-t border-current/15 pt-4">
                <span className={cn(mono.className, "text-xs uppercase tracking-wider")}>
                  Abrir lectura
                </span>
                <span
                  aria-hidden
                  className="font-mono text-2xl transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </section>

        <footer className="grid gap-2 border-t border-black/15 pt-6 text-xs leading-6 text-black/55 sm:grid-cols-2">
          <p>
            <strong className="text-black">Espíritu común</strong> · democratizar el cálculo del salario neto,
            del IRPF y de la inflación entre 2012 y 2026 sobre el caso fiscal simplificado del
            proyecto.
          </p>
          <p className="sm:text-right">
            Auditoría reescrita en cada variante: <em>menos cards, más lectura</em>.
          </p>
        </footer>
      </div>
    </main>
  )
}
