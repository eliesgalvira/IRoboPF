"use client"

import * as React from "react"
import { AlertTriangle, FileText } from "lucide-react"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import { Combobox } from "@/components/ui/combobox"
import { NumberField } from "@/components/ui/number-field"
import { Tooltip } from "@/components/ui/tooltip"
import type { ComunidadAutonoma } from "@/lib/dominio/irpf/caso-fiscal-anual"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
  type ResultadoLiquidacionIrpf,
} from "@/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { cn } from "@/lib/utils"

const eurosACentimos = (euros: number) => Math.round(euros * 100)
const centimosAEuros = (centimos: number) => centimos / 100
const FORMATO_ENTERO = {
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions
const OPCIONES_COMUNIDAD_AUTONOMA: ReadonlyArray<{
  readonly valor: ComunidadAutonoma
  readonly etiqueta: string
}> = [
  { valor: "simulada-estatal", etiqueta: "Simulada estatal" },
  { valor: "andalucia", etiqueta: "Andalucía" },
  { valor: "aragon", etiqueta: "Aragón" },
  { valor: "asturias", etiqueta: "Asturias" },
  { valor: "illes-balears", etiqueta: "Illes Balears" },
  { valor: "canarias", etiqueta: "Canarias" },
  { valor: "cantabria", etiqueta: "Cantabria" },
  { valor: "castilla-la-mancha", etiqueta: "Castilla-La Mancha" },
  { valor: "castilla-y-leon", etiqueta: "Castilla y León" },
  { valor: "catalunya", etiqueta: "Catalunya" },
  { valor: "extremadura", etiqueta: "Extremadura" },
  { valor: "galicia", etiqueta: "Galicia" },
  { valor: "madrid", etiqueta: "Madrid" },
  { valor: "murcia", etiqueta: "Murcia" },
  { valor: "la-rioja", etiqueta: "La Rioja" },
  { valor: "comunitat-valenciana", etiqueta: "Comunitat Valenciana" },
  { valor: "ceuta", etiqueta: "Ceuta" },
  { valor: "melilla", etiqueta: "Melilla" },
]
const AYUDAS_RESUMEN = {
  "Base liquidable":
    "Resultado que queda para aplicar los tramos: rendimientos netos menos reducciones de base.",
  "Rendimiento neto trabajo":
    "Salario bruto menos cotizacion del trabajador y gastos deducibles aplicados.",
  "Capital inmobiliario neto":
    "Rendimiento de inmuebles, por ejemplo alquileres, que se suma a la base general.",
  "Gastos y deducciones trabajo":
    "Total que se resta al rendimiento del trabajo: cotizacion del trabajador y gastos deducibles.",
  "Cotización empresa":
    "Aportacion a la Seguridad Social que paga la empresa por el trabajador.",
  "Cotización trabajador":
    "Aportacion a la Seguridad Social descontada al trabajador. Incluye MEI y, si procede, solidaridad.",
  "Coste laboral": "Salario bruto mas la cotizacion de empresa.",
  "MEI empresa":
    "Mecanismo de Equidad Intergeneracional que paga la empresa. Esta parte esta incluida en la cotizacion de empresa.",
  "MEI trabajador":
    "Mecanismo de Equidad Intergeneracional descontado al trabajador. Esta parte esta incluida en la cotizacion del trabajador.",
  "Cuota líquida":
    "Impuesto resultante antes de restar retenciones y pagos a cuenta.",
  "Retenciones/pagos a cuenta":
    "Importes ya pagados durante el año que se restan de la cuota liquida.",
  "Cuota diferencial":
    "Resultado tras restar retenciones y pagos a cuenta. Positivo: a pagar; negativo: a devolver.",
} satisfies Record<string, string>
const AYUDAS_FORMULARIO = {
  "Rendimientos del trabajo":
    "Ingresos brutos anuales por salario o trabajo antes de restar cotizaciones.",
  "Capital inmobiliario":
    "Ingresos anuales por inmuebles alquilados u otros rendimientos inmobiliarios.",
  Descendientes:
    "Hijos, nietos u otros familiares hacia abajo que pueden computar si cumplen requisitos fiscales.",
  Ascendientes:
    "Padres, madres o abuelos que pueden computar solo si cumplen requisitos fiscales.",
  "Retenciones soportadas":
    "IRPF ya retenido durante el año, por ejemplo en la nomina.",
  "Pagos a cuenta": "Otros pagos anticipados del impuesto ya realizados.",
} satisfies Record<string, string>

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
  const [comunidadAutonoma, fijarComunidadAutonoma] =
    React.useState<ComunidadAutonoma>("simulada-estatal")
  const [edad, fijarEdad] = React.useState(40)
  const [descendientes, fijarDescendientes] = React.useState(0)
  const [ascendientes, fijarAscendientes] = React.useState(0)
  const [retencionesSoportadasEuros, fijarRetencionesSoportadasEuros] =
    React.useState(0)
  const [pagosACuentaEuros, fijarPagosACuentaEuros] = React.useState(0)

  const caso = React.useMemo(
    () =>
      ({
        anio: 2025,
        comunidadAutonoma,
        situacionFamiliar: {
          tipo: "individual",
          edad,
          descendientes: Array.from({ length: descendientes }, () => ({
            edad: 10,
            discapacidad: "sin-discapacidad",
          })),
          ascendientes: Array.from({ length: ascendientes }, () => ({
            edad: 78,
            discapacidad: "sin-discapacidad",
          })),
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
        retencionesSoportadasCentimos: eurosACentimos(
          retencionesSoportadasEuros
        ),
        pagosACuentaCentimos: eurosACentimos(pagosACuentaEuros),
      }) satisfies CasoFiscalAnual,
    [
      ascendientes,
      capitalInmobiliarioEuros,
      comunidadAutonoma,
      descendientes,
      edad,
      pagosACuentaEuros,
      rendimientosTrabajoEuros,
      retencionesSoportadasEuros,
    ]
  )
  const resultado = React.useMemo(
    () => liquidarIrpfAnual(caso, { modo: "canonico" }),
    [caso]
  )

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <NavegacionSitio />

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(320px,420px)_1fr]">
          <FormularioCaso
            ascendientes={ascendientes}
            capitalInmobiliarioEuros={capitalInmobiliarioEuros}
            comunidadAutonoma={comunidadAutonoma}
            descendientes={descendientes}
            edad={edad}
            fijarAscendientes={fijarAscendientes}
            fijarCapitalInmobiliarioEuros={fijarCapitalInmobiliarioEuros}
            fijarComunidadAutonoma={fijarComunidadAutonoma}
            fijarDescendientes={fijarDescendientes}
            fijarEdad={fijarEdad}
            fijarPagosACuentaEuros={fijarPagosACuentaEuros}
            fijarRendimientosTrabajoEuros={fijarRendimientosTrabajoEuros}
            fijarRetencionesSoportadasEuros={fijarRetencionesSoportadasEuros}
            pagosACuentaEuros={pagosACuentaEuros}
            rendimientosTrabajoEuros={rendimientosTrabajoEuros}
            retencionesSoportadasEuros={retencionesSoportadasEuros}
          />
          <Resultado resultado={resultado} />
        </section>
      </div>
    </main>
  )
}

function FormularioCaso({
  ascendientes,
  capitalInmobiliarioEuros,
  comunidadAutonoma,
  descendientes,
  edad,
  fijarAscendientes,
  fijarCapitalInmobiliarioEuros,
  fijarComunidadAutonoma,
  fijarDescendientes,
  fijarEdad,
  fijarPagosACuentaEuros,
  fijarRendimientosTrabajoEuros,
  fijarRetencionesSoportadasEuros,
  pagosACuentaEuros,
  rendimientosTrabajoEuros,
  retencionesSoportadasEuros,
}: {
  readonly ascendientes: number
  readonly capitalInmobiliarioEuros: number
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly descendientes: number
  readonly edad: number
  readonly fijarAscendientes: (valor: number) => void
  readonly fijarCapitalInmobiliarioEuros: (valor: number) => void
  readonly fijarComunidadAutonoma: (valor: ComunidadAutonoma) => void
  readonly fijarDescendientes: (valor: number) => void
  readonly fijarEdad: (valor: number) => void
  readonly fijarPagosACuentaEuros: (valor: number) => void
  readonly fijarRendimientosTrabajoEuros: (valor: number) => void
  readonly fijarRetencionesSoportadasEuros: (valor: number) => void
  readonly pagosACuentaEuros: number
  readonly rendimientosTrabajoEuros: number
  readonly retencionesSoportadasEuros: number
}) {
  return (
    <section className="border border-[var(--rule)] bg-[var(--paper)] p-4 shadow-[6px_6px_0_var(--rule)] lg:sticky lg:top-5">
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
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Rendimientos del trabajo"]}
          etiqueta="Rendimientos del trabajo"
          formato={FORMATO_ENTERO}
          onChange={fijarRendimientosTrabajoEuros}
          paso={500}
          valor={rendimientosTrabajoEuros}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Capital inmobiliario"]}
          etiqueta="Capital inmobiliario"
          formato={FORMATO_ENTERO}
          onChange={fijarCapitalInmobiliarioEuros}
          paso={250}
          valor={capitalInmobiliarioEuros}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Retenciones soportadas"]}
          etiqueta="Retenciones soportadas"
          formato={FORMATO_ENTERO}
          onChange={fijarRetencionesSoportadasEuros}
          paso={250}
          valor={retencionesSoportadasEuros}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Pagos a cuenta"]}
          etiqueta="Pagos a cuenta"
          formato={FORMATO_ENTERO}
          onChange={fijarPagosACuentaEuros}
          paso={250}
          valor={pagosACuentaEuros}
        />
      </div>

      <div className="mt-6">
        <Combobox
          etiqueta="Comunidad autónoma"
          onChange={fijarComunidadAutonoma}
          opciones={OPCIONES_COMUNIDAD_AUTONOMA}
          valor={comunidadAutonoma}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <NumberField
          etiqueta="Edad"
          formato={FORMATO_ENTERO}
          max={120}
          min={18}
          onChange={fijarEdad}
          valor={edad}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Descendientes"]}
          etiqueta="Descendientes"
          formato={FORMATO_ENTERO}
          max={8}
          onChange={fijarDescendientes}
          valor={descendientes}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Ascendientes"]}
          etiqueta="Ascendientes"
          formato={FORMATO_ENTERO}
          max={12}
          onChange={fijarAscendientes}
          valor={ascendientes}
        />
      </div>
    </section>
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
          "border bg-[var(--paper)] p-4",
          esNoSoportado ? "border-[var(--danger)]" : "border-[var(--rule)]"
        )}
      >
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
            />
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.12em] text-[var(--ink-soft)] uppercase">
                {esNoSoportado
                  ? "Resultado no soportado"
                  : "Liquidación calculada"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                Este resultado puede contener errores y discrepar de forma
                sustancial del cálculo real de la declaración; contrástalo con
                el rastro antes de usarlo.
              </p>
            </div>
          </div>
          {esNoSoportado ? (
            <div className="pl-8">
              <>
                <h2 className="text-xl font-bold">{resultado.motivo}</h2>
                <p className="mt-2 text-sm break-all text-[var(--ink-soft)]">
                  {resultado.fuenteReconocida}
                </p>
              </>
            </div>
          ) : (
            <div className="grid gap-3 pl-8 sm:grid-cols-2 xl:grid-cols-4">
              <DatoResultado
                etiqueta="Cotización empresa"
                ayuda={AYUDAS_RESUMEN["Cotización empresa"]}
                valor={formatearEuros(resultado.cotizacionEmpresarialCentimos)}
              />
              <DatoResultado
                etiqueta="Coste laboral"
                ayuda={AYUDAS_RESUMEN["Coste laboral"]}
                valor={formatearEuros(resultado.costeLaboralCentimos)}
              />
              <DatoResultado
                etiqueta="Cotización trabajador"
                ayuda={AYUDAS_RESUMEN["Cotización trabajador"]}
                valor={formatearEuros(resultado.cotizacionTrabajadorCentimos)}
              />
              <DatoResultado
                etiqueta="MEI empresa"
                ayuda={AYUDAS_RESUMEN["MEI empresa"]}
                valor={formatearEuros(resultado.meiEmpresarialCentimos)}
              />
              <DatoResultado
                etiqueta="MEI trabajador"
                ayuda={AYUDAS_RESUMEN["MEI trabajador"]}
                valor={formatearEuros(resultado.meiTrabajadorCentimos)}
              />
              <DatoResultado
                etiqueta="Gastos y deducciones trabajo"
                ayuda={AYUDAS_RESUMEN["Gastos y deducciones trabajo"]}
                valor={formatearEuros(
                  resultado.totalGastosYDeduccionesTrabajoCentimos
                )}
              />
              <DatoResultado
                etiqueta="Rendimiento neto trabajo"
                ayuda={AYUDAS_RESUMEN["Rendimiento neto trabajo"]}
                valor={formatearEuros(resultado.rendimientoNetoTrabajoCentimos)}
              />
              <DatoResultado
                etiqueta="Capital inmobiliario neto"
                ayuda={AYUDAS_RESUMEN["Capital inmobiliario neto"]}
                valor={formatearEuros(
                  resultado.rendimientoNetoCapitalInmobiliarioCentimos
                )}
              />
              <DatoResultado
                etiqueta="Base liquidable"
                ayuda={AYUDAS_RESUMEN["Base liquidable"]}
                valor={formatearEuros(resultado.baseLiquidableGeneralCentimos)}
              />
              <DatoResultado
                etiqueta="Cuota líquida"
                ayuda={AYUDAS_RESUMEN["Cuota líquida"]}
                valor={formatearEuros(resultado.cuotaLiquidaCentimos)}
              />
              <DatoResultado
                etiqueta="Retenciones/pagos a cuenta"
                ayuda={AYUDAS_RESUMEN["Retenciones/pagos a cuenta"]}
                valor={formatearEuros(
                  resultado.retencionesYPagosACuentaCentimos
                )}
              />
              <DatoResultado
                etiqueta="Cuota diferencial"
                ayuda={AYUDAS_RESUMEN["Cuota diferencial"]}
                valor={formatearEuros(resultado.cuotaDiferencialCentimos)}
              />
            </div>
          )}
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
                {paso.lineasCalculo?.length ? (
                  <dl className="mt-4 grid gap-2">
                    {paso.lineasCalculo.map((linea) => (
                      <div
                        className="grid gap-2 border border-[var(--rule)] bg-[var(--paper-2)] p-3 md:grid-cols-[minmax(10rem,0.9fr)_minmax(14rem,1.4fr)_minmax(8rem,0.7fr)]"
                        key={`${paso.titulo}-${linea.etiqueta}`}
                      >
                        <dt className="text-xs font-bold">{linea.etiqueta}</dt>
                        <dd className="text-xs break-words text-[var(--ink-soft)]">
                          {linea.formula}
                        </dd>
                        <dd className="text-sm font-bold tabular-nums md:text-right">
                          {linea.resultado}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
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

      <section className="border border-[var(--rule)] bg-[var(--paper)] p-4">
        <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Revisión técnica
        </p>
        <h2 className="mt-1 text-xl font-bold">Reportar una discrepancia</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
          Si detectas un error, referencia esta ruta, el año fiscal, el tipo de
          resultado y los pasos del rastro de cálculo. El caso se puede
          reproducir con los importes visibles en el formulario y las fuentes
          enlazadas en cada paso.
        </p>
        <a
          className="mt-3 inline-block border-b border-current text-sm font-bold"
          href="https://github.com/eliesgalvira/IRoboPF/issues"
          rel="noreferrer"
          target="_blank"
        >
          Abrir incidencia en GitHub
        </a>
      </section>
    </section>
  )
}

function DatoResultado({
  ayuda,
  etiqueta,
  valor,
}: {
  readonly ayuda: string
  readonly etiqueta: string
  readonly valor: string
}) {
  return (
    <div className="border border-[var(--rule)] bg-[var(--paper-2)] p-3">
      <dt className="text-xs text-[var(--ink-soft)]">
        <Tooltip contenido={ayuda}>
          <button
            className="cursor-help border-b border-dotted border-current text-left"
            type="button"
          >
            {etiqueta}
          </button>
        </Tooltip>
      </dt>
      <dd className="mt-1 font-bold">{valor}</dd>
    </div>
  )
}
