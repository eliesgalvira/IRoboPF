/** Hechos de la entrada anual, no cuotas ni bases fiscales. La API canónica no
 * representa cotizaciones efectivas: null expresa ausencia, nunca un cero inferido.
 */
export type TrabajoActualCLM2025 = {
  readonly ejercicio: number; readonly titular: string | undefined;
  readonly origen: "canonica" | "explicita";
  readonly rendimientos: readonly { readonly id: string | null; readonly clase: string;
    readonly integro: string; readonly cotizaciones: string | null }[];
  readonly retenciones: string
}
