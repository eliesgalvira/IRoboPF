import type { CasoFiscalAnual } from "../caso-fiscal-anual"

// Cinco capturas C300 y el expediente balear N80: empleo individual efectivo, sin derechos familiares.
// No habilita compatibilidad art20/DA61, otros perfiles ni otros ejercicios.
export const esAmbitoCuotasTerritorialesOpen2025 = (
  caso: Pick<
    CasoFiscalAnual,
    "anio" | "comunidadAutonoma" | "derechosMinimos" | "fechaFallecimiento"
  >
): boolean =>
  caso.anio === 2025 &&
  caso.fechaFallecimiento === undefined &&
  caso.derechosMinimos === undefined &&
  ["catalunya", "comunitat-valenciana", "galicia", "canarias", "aragon", "illes-balears"].some(
    (territorio) => territorio === caso.comunidadAutonoma
  )
