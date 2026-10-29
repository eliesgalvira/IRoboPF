import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".cache/**",
    // Copias aisladas de ejecución, ajenas a la entrega y al producto.
    "docs/procedencia/revisiones/*/scratch/**",
    "docs/procedencia/revisiones/*/tmp/**",
    "docs/procedencia/revisiones/*/validacion/**",
    "docs/procedencia/revisiones/*/checkout-validacion/**",
    "docs/procedencia/revisiones/*/lint-input/**",
    "docs/procedencia/revisiones/*/mypy-cache/**",
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Runtime de terceros: se verifica por separado, conservando su fuente.
    "tools/oxlint/anti-slop/**",
  ]),
])

export default eslintConfig
