import type { Metadata } from "next"

const casosIrpf = [
  {
    origen: "DAT_2012",
    caso: "Salario bruto 21.900 €",
    concepto: "IRPF Final",
    calculo: "3152,715 €",
    python: "3152.71",
    correcto: "3152.72",
  },
  {
    origen: "DAT_2012",
    caso: "Salario bruto 22.100 €",
    concepto: "IRPF Final",
    calculo: "3208,905 €",
    python: "3208.90",
    correcto: "3208.91",
  },
  {
    origen: "DAT_2012",
    caso: "Salario bruto 22.900 €",
    concepto: "IRPF Final",
    calculo: "3433,665 €",
    python: "3433.66",
    correcto: "3433.67",
  },
  {
    origen: "DAT_2012",
    caso: "Salario bruto 24.500 €",
    concepto: "IRPF Final",
    calculo: "3883,185 €",
    python: "3883.18",
    correcto: "3883.19",
  },
]

const casosNeto = [
  {
    origen: "COMPARATIVA_INFLACION",
    caso: "Año 2026 · salario bruto 18.000 €",
    concepto: "Neto Real en 2026",
    calculo: "18000 - 1170 - 623,815 = 16206,185 €",
    python: "16206.18",
    correcto: "16206.19",
  },
  {
    origen: "COMPARATIVA_INFLACION",
    caso: "Año 2026 · salario bruto 18.000 €",
    concepto: "Neto Real en su Año",
    calculo: "16206,185 €",
    python: "16206.18",
    correcto: "16206.19",
  },
]

const fragmentosPython = [
  "round(irpf_final, 2)",
  "round(salario_neto, 2)",
  "round(neto_2026_real, 2)",
  "round(dif_poder_adq / 12, 2)",
]

export const metadata: Metadata = {
  title: "Errata técnica · IRoboPF",
  description:
    "Resumen de discrepancias de redondeo detectadas en el script Python legacy.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaginaErrata() {
  return (
    <main className="min-h-svh">
      <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="grid gap-6 border-b-2 border-[var(--rule)] pb-8">
          <p className="text-xs tracking-[0.3em] text-[var(--danger)] uppercase">
            Errata técnica
          </p>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] lg:items-end">
            <h1 className="font-[family-name:var(--display)] text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-wider">
              Redondeo del script Python
            </h1>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              El Excel legacy contiene importes monetarios que quedan un céntimo
              por debajo del criterio fiscal esperado cuando el tercer decimal
              es 5. El problema aparece en la combinación de números{" "}
              <code className="font-bold text-[var(--ink)]">float</code> y{" "}
              <code className="font-bold text-[var(--ink)]">round()</code>.
            </p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <div className="border-t-2 border-[var(--rule)] pt-4">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase">
              Qué ocurre
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-7">
            <p>
              Python usa <strong>half-even</strong> en{" "}
              <code>round(numero, 2)</code>: si el importe está justo en medio,
              elige el céntimo que deja la última cifra par. Por ejemplo,
              16206,185 puede acabar como 16206,18 porque el 8 es par.
            </p>
            <p>
              El criterio esperado para importes en euros es{" "}
              <strong>half-up</strong>: si el tercer decimal es 5 o superior, se
              sube al céntimo siguiente. Con ese criterio, 16206,185 debe ser
              16206,19.
            </p>
            <p>
              Además, un <strong>float</strong> no guarda muchos decimales de
              forma exacta. Internamente puede representar 3152,715 como un
              número ligeramente menor o mayor. Por eso algunos empates parecen
              redondearse de forma irregular: el programa no está comparando el
              decimal exacto que vemos en pantalla.
            </p>
          </div>
        </section>

        <section className="grid gap-5">
          <EncabezadoSeccion
            titulo="Puntos del código"
            descripcion="Estos son los lugares donde el script convierte importes de cálculo a dos decimales con round()."
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {fragmentosPython.map((fragmento) => (
              <code
                key={fragmento}
                className="border-2 border-[var(--rule)] bg-[var(--paper-2)] px-3 py-3 text-sm font-bold"
              >
                {fragmento}
              </code>
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          <EncabezadoSeccion
            titulo="Casos de IRPF"
            descripcion="En todos estos casos el cálculo exacto queda en medio céntimo y el Excel Python queda un céntimo por debajo del half-up."
          />
          <TablaCasos casos={casosIrpf} />
        </section>

        <section className="grid gap-5">
          <EncabezadoSeccion
            titulo="Caso de neto"
            descripcion="El salario neto de 18.000 € en 2026 es el ejemplo más visible porque se propaga a la comparativa de inflación."
          />
          <TablaCasos casos={casosNeto} />
        </section>

        <section className="border-y-2 border-[var(--rule)] py-5">
          <p className="text-sm leading-7">
            Propuesta de corrección: usar aritmética decimal para importes
            monetarios y redondear explícitamente con half-up en las fronteras
            donde se escriben euros a dos decimales.
          </p>
        </section>
      </div>
    </main>
  )
}

function EncabezadoSeccion({
  titulo,
  descripcion,
}: {
  readonly titulo: string
  readonly descripcion: string
}) {
  return (
    <div className="grid gap-2 border-t-2 border-[var(--rule)] pt-4 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)]">
      <h2 className="text-sm font-bold tracking-[0.2em] uppercase">{titulo}</h2>
      <p className="text-sm leading-6 text-[var(--ink-soft)]">{descripcion}</p>
    </div>
  )
}

function TablaCasos({
  casos,
}: {
  readonly casos: ReadonlyArray<{
    readonly origen: string
    readonly caso: string
    readonly concepto: string
    readonly calculo: string
    readonly python: string
    readonly correcto: string
  }>
}) {
  return (
    <div className="overflow-x-auto border-2 border-[var(--rule)]">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-[var(--rule)] text-[var(--paper)]">
          <tr>
            <th className="px-3 py-3 font-bold">Origen</th>
            <th className="px-3 py-3 font-bold">Caso</th>
            <th className="px-3 py-3 font-bold">Concepto</th>
            <th className="px-3 py-3 font-bold">Cálculo</th>
            <th className="px-3 py-3 font-bold">Python</th>
            <th className="px-3 py-3 font-bold">Half-up</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={`${caso.origen}-${caso.caso}-${caso.concepto}`}>
              <td className="border-t-2 border-[var(--rule)] px-3 py-3 align-top font-bold">
                {caso.origen}
              </td>
              <td className="border-t-2 border-[var(--rule)] px-3 py-3 align-top">
                {caso.caso}
              </td>
              <td className="border-t-2 border-[var(--rule)] px-3 py-3 align-top">
                {caso.concepto}
              </td>
              <td className="border-t-2 border-[var(--rule)] px-3 py-3 align-top">
                {caso.calculo}
              </td>
              <td className="border-t-2 border-[var(--rule)] px-3 py-3 align-top text-[var(--danger)] tabular-nums">
                {caso.python}
              </td>
              <td className="border-t-2 border-[var(--rule)] px-3 py-3 align-top font-bold tabular-nums">
                {caso.correcto}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
