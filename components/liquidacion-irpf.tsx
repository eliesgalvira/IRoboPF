"use client"

import * as React from "react"
import { AlertTriangle, FileText } from "lucide-react"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
  type ResultadoLiquidacionIrpf,
} from "@/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { cn } from "@/lib/utils"

const eurosACentimos = (euros: number) => Math.round(euros * 100)
const centimosAEuros = (centimos: number) => centimos / 100

function formatearEuros(centimos: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(centimosAEuros(centimos))
}

export function LiquidacionIrpf() {
  const [rendimientosTrabajoEuros, fijarRendimientosTrabajoEuros] =
    React.useState(30_000)
  const [capitalInmobiliarioEuros, fijarCapitalInmobiliarioEuros] =
    React.useState(1_000)

  const caso = React.useMemo(
    () =>
      ({
        anio: 2025,
        comunidadAutonoma: "simulada-estatal",
        situacionFamiliar: {
          tipo: "individual",
          edad: 40,
          descendientes: [],
          ascendientes: [],
          discapacidad: "sin-discapacidad",
        },
        rendimientos: {
          trabajo: [
            {
              importeIntegroCentimos: eurosACentimos(rendimientosTrabajoEuros),
            },
          ],
          capitalInmobiliario:
            capitalInmobiliarioEuros > 0
              ? [
                  {
                    importeIntegroCentimos: eurosACentimos(
                      capitalInmobiliarioEuros
                    ),
                  },
                ]
              : [],
        },
        reducciones: [],
        deducciones: [],
        retencionesSoportadasCentimos: 0,
        pagosACuentaCentimos: 0,
      }) satisfies CasoFiscalAnual,
    [capitalInmobiliarioEuros, rendimientosTrabajoEuros]
  )
  const resultado = React.useMemo(
    () => liquidarIrpfAnual(caso, { modo: "canonico" }),
    [caso]
  )

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <NavegacionSitio />

        <section className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_1fr]">
          <FormularioCaso
            capitalInmobiliarioEuros={capitalInmobiliarioEuros}
            fijarCapitalInmobiliarioEuros={fijarCapitalInmobiliarioEuros}
            fijarRendimientosTrabajoEuros={fijarRendimientosTrabajoEuros}
            rendimientosTrabajoEuros={rendimientosTrabajoEuros}
          />
          <Resultado resultado={resultado} />
        </section>
      </div>
    </main>
  )
}

function FormularioCaso({
  capitalInmobiliarioEuros,
  fijarCapitalInmobiliarioEuros,
  fijarRendimientosTrabajoEuros,
  rendimientosTrabajoEuros,
}: {
  readonly capitalInmobiliarioEuros: number
  readonly fijarCapitalInmobiliarioEuros: (valor: number) => void
  readonly fijarRendimientosTrabajoEuros: (valor: number) => void
  readonly rendimientosTrabajoEuros: number
}) {
  return (
    <section className="border border-[var(--rule)] bg-[var(--paper)] p-4 shadow-[6px_6px_0_var(--rule)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            2025 · individual
          </p>
          <h1 className="mt-2 text-4xl leading-none font-[var(--display)]">
            Liquidación IRPF
          </h1>
        </div>
        <FileText aria-hidden className="mt-1 size-6 shrink-0" />
      </div>

      <div className="grid gap-4">
        <CampoEuros
          etiqueta="Rendimientos del trabajo"
          valor={rendimientosTrabajoEuros}
          onChange={fijarRendimientosTrabajoEuros}
        />
        <CampoEuros
          etiqueta="Capital inmobiliario"
          valor={capitalInmobiliarioEuros}
          onChange={fijarCapitalInmobiliarioEuros}
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <DatoCaso etiqueta="Comunidad" valor="simulada-estatal" />
        <DatoCaso etiqueta="Edad" valor="40" />
        <DatoCaso etiqueta="Descendientes" valor="0" />
        <DatoCaso etiqueta="Ascendientes" valor="0" />
      </dl>
    </section>
  )
}

function CampoEuros({
  etiqueta,
  onChange,
  valor,
}: {
  readonly etiqueta: string
  readonly onChange: (valor: number) => void
  readonly valor: number
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      <span>{etiqueta}</span>
      <input
        className="h-11 border border-[var(--rule)] bg-[var(--paper-2)] px-3 text-base font-[var(--mono)] outline-none focus:ring-2 focus:ring-[var(--mark)]"
        inputMode="decimal"
        min={0}
        onChange={(evento) => onChange(Number(evento.currentTarget.value))}
        type="number"
        value={valor}
      />
    </label>
  )
}

function DatoCaso({
  etiqueta,
  valor,
}: {
  readonly etiqueta: string
  readonly valor: string
}) {
  return (
    <div className="border border-[var(--rule)] bg-[var(--paper-2)] p-3">
      <dt className="text-[var(--ink-soft)]">{etiqueta}</dt>
      <dd className="mt-1 font-bold">{valor}</dd>
    </div>
  )
}

function Resultado({
  resultado,
}: {
  readonly resultado: ResultadoLiquidacionIrpf
}) {
  const esNoSoportado = resultado._tag === "ResultadoNoSoportado"

  return (
    <section className="grid gap-5">
      <div
        className={cn(
          "border p-4",
          esNoSoportado
            ? "border-[var(--danger)] bg-[var(--paper)]"
            : "border-[var(--rule)] bg-[var(--paper)]"
        )}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
          />
          <div>
            <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
              {resultado._tag}
            </p>
            {esNoSoportado ? (
              <>
                <h2 className="mt-1 text-xl font-bold">{resultado.motivo}</h2>
                <p className="mt-2 text-sm break-all text-[var(--ink-soft)]">
                  {resultado.fuenteReconocida}
                </p>
              </>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <DatoResultado
                  etiqueta="Base liquidable"
                  valor={formatearEuros(
                    resultado.baseLiquidableGeneralCentimos
                  )}
                />
                <DatoResultado
                  etiqueta="Cuota líquida"
                  valor={formatearEuros(resultado.cuotaLiquidaCentimos)}
                />
                <DatoResultado
                  etiqueta="Cuota diferencial"
                  valor={formatearEuros(resultado.cuotaDiferencialCentimos)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="border border-[var(--rule)] bg-[var(--paper)]">
        <header className="border-b border-[var(--rule)] p-4">
          <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            Rastro de cálculo
          </p>
          <h2 className="mt-1 text-2xl font-bold">{resultado.rastro.titulo}</h2>
        </header>
        <ol className="divide-y divide-[var(--rule)]">
          {resultado.rastro.pasos.map((paso, indice) => (
            <li className="grid gap-3 p-4 sm:grid-cols-[4rem_1fr]" key={indice}>
              <div className="text-4xl leading-none font-[var(--display)]">
                {(indice + 1).toString().padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-bold">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  {paso.descripcion}
                </p>
                {paso.fuentes.length > 0 ? (
                  <ul className="mt-3 grid gap-2">
                    {paso.fuentes.map((fuente) => (
                      <li
                        className="border-l-4 border-[var(--rule)] pl-3 text-xs"
                        key={fuente.referencia}
                      >
                        <span className="font-bold">{fuente.titulo}</span>
                        <span className="block break-all text-[var(--ink-soft)]">
                          {fuente.referencia}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}

function DatoResultado({
  etiqueta,
  valor,
}: {
  readonly etiqueta: string
  readonly valor: string
}) {
  return (
    <div className="border border-[var(--rule)] bg-[var(--paper-2)] p-3">
      <dt className="text-xs text-[var(--ink-soft)]">{etiqueta}</dt>
      <dd className="mt-1 font-bold">{valor}</dd>
    </div>
  )
}
