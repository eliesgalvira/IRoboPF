const archivosProcedencia = [
  "./docs/procedencia/implementaciones/contenidos/datos/snapshots.json",
  "./docs/procedencia/implementaciones/contenidos/datos/objetos/*",
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // El almacén resuelve hashes en runtime; nft no puede inferir esos archivos.
  outputFileTracingIncludes: {
    "/procedencia": archivosProcedencia,
    "/procedencia/**": archivosProcedencia,
  },
}

export default nextConfig
