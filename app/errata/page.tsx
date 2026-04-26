import type { Metadata } from "next"

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
            titulo="Casos clave"
            descripcion="Tres ejemplos suficientes para separar el problema de criterio de redondeo y el problema de representación float."
          />
          <div className="grid gap-4">
            <Caso
              etiqueta="Deriva de float"
              titulo="DAT_2012 · salario bruto 21.900 € · IRPF Final"
              texto="El cálculo decimal esperado llega exactamente a 3152,715 €. Si round() recibiera ese decimal exacto, half-even redondearía a 3152.72 porque el 2 es la cifra par. Pero el script opera con float y el valor que llega al redondeo es ligeramente menor."
              codigo={[
                "decimal esperado: 3152.715",
                "float recibido: 3152.7149999999997",
                "Excel Python: 3152.71",
                "resultado half-up: 3152.72",
              ]}
            />
            <Caso
              etiqueta="Criterio half-even"
              titulo="COMPARATIVA_INFLACION · 18.000 € en 2026 · Neto Real"
              texto="Aquí el importe visible queda en 16206,185 €. Con half-even se puede redondear hacia 16206.18 porque el 8 es par. Con half-up, cualquier tercer decimal igual a 5 debe subir."
              codigo={[
                "calculo: 18000 - 1170 - 623.815 = 16206.185",
                "Excel Python: 16206.18",
                "resultado half-up: 16206.19",
              ]}
            />
            <Caso
              etiqueta="Propagación"
              titulo="Variación mensual de poder adquisitivo"
              texto="El mismo céntimo se propaga a columnas derivadas: neto anual, diferencia anual y variación mensual. Por eso no conviene corregirlo con tolerancias, sino arreglar la regla de redondeo en el origen."
              codigo={[
                "entrada afectada: Neto Real en 2026",
                "síntoma: diferencias repetidas de 0.01 €",
                "corrección: Decimal + ROUND_HALF_UP",
              ]}
            />
          </div>
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

function Caso({
  etiqueta,
  titulo,
  texto,
  codigo,
}: {
  readonly etiqueta: string
  readonly titulo: string
  readonly texto: string
  readonly codigo: ReadonlyArray<string>
}) {
  return (
    <article className="grid gap-4 border-2 border-[var(--rule)] bg-[var(--paper)] p-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
      <div className="grid content-start gap-3">
        <p className="text-xs font-bold tracking-[0.24em] text-[var(--danger)] uppercase">
          {etiqueta}
        </p>
        <h3 className="text-lg leading-tight font-bold">{titulo}</h3>
        <p className="text-sm leading-7 text-[var(--ink-soft)]">{texto}</p>
      </div>
      <pre className="overflow-x-auto border-2 border-[var(--rule)] bg-[var(--paper-2)] p-4 text-sm leading-7 font-bold">
        {codigo.join("\n")}
      </pre>
    </article>
  )
}
