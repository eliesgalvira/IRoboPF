/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: { cpus: 1 },
  // Solo el índice permitido. Los objetos pertenecen al almacén externo.
  outputFileTracingIncludes: {
    "/procedencia": [
      "./docs/procedencia/implementaciones/contenidos/datos/snapshots.json",
    ],
    "/procedencia/**": [
      "./docs/procedencia/implementaciones/contenidos/datos/snapshots.json",
    ],
  },
  outputFileTracingExcludes: {
    "/procedencia/**": [
      "./docs/procedencia/implementaciones/contenidos/datos/objetos/**",
    ],
  },
}

export default nextConfig
