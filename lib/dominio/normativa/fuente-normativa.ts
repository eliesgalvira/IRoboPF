export interface FuenteNormativaNormalizada {
  readonly _tag: "FuenteNormativaNormalizada"
  readonly titulo: string
  readonly referencia: string
  readonly nota: string
}

export const fuenteAeatManualRenta2025Parte1: FuenteNormativaNormalizada = {
  _tag: "FuenteNormativaNormalizada",
  titulo: "Manual practico de Renta 2025. Parte 1",
  referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
  nota: "Transcripcion operativa normalizada; no sustituye a la fuente oficial.",
}

export const fuenteAeatDeduccionesAutonomicas2025: FuenteNormativaNormalizada =
  {
    _tag: "FuenteNormativaNormalizada",
    titulo: "Manual practico de Renta 2025. Parte 2. Deducciones autonomicas",
    referencia:
      "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
    nota: "Transcripcion operativa normalizada; no sustituye a la fuente oficial.",
  }

export const fuenteAeatMayores65Renta2025: FuenteNormativaNormalizada = {
  _tag: "FuenteNormativaNormalizada",
  titulo: "Manual especifico de Renta 2025 para personas mayores de 65 anos",
  referencia: "docs/fuentes/aeat/manual-renta-2025-mayores-65.md",
  nota: "Transcripcion operativa normalizada; no sustituye a la fuente oficial.",
}

export const fuenteAeatRetenciones2026: FuenteNormativaNormalizada = {
  _tag: "FuenteNormativaNormalizada",
  titulo: "Algoritmo de retenciones 2026",
  referencia: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
  nota: "Transcripcion operativa normalizada; no sustituye a la fuente oficial.",
}
