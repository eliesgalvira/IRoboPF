import type { MetadataRoute } from "next"

export default function manifiesto(): MetadataRoute.Manifest {
  return {
    name: "Progresividad en frío · IRPF",
    short_name: "IRoboPF",
    description:
      "Calculadora divulgativa de salario neto, IRPF y poder adquisitivo en España (2012 — 2026).",
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F4ECD3",
    theme_color: "#FFCE00",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  }
}
