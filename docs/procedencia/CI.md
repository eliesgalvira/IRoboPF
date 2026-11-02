# CI reproducible

`Comprobaciones` ejecuta contratos y verificadores sin historial Git ni CAS privado.
Instalar Bun 1.3.13, Node 24, Python 3.13 y Nix; desde la raíz:

```sh
bun install --frozen-lockfile
bash scripts/ci-comprobaciones.sh
```

Los comandos `contenido-verificar.mjs --fixture` y `rastro-verificar.mjs --fixture`
construyen un snapshot pequeño con bytes sintéticos en el directorio temporal.
Ejecutan los verificadores productivos sin rebajar integridad ni aceptación fiscal.
`verificar-enlaces.mjs --fixture` ejecuta los ataques del auxiliar documental con
el único payload Madrid versionado, sin las demás entradas del registro.
El ensayo de almacenamiento externo genera también sus objetos: comprueba bytes,
respuestas HTTP, restricciones de acceso, ausencia, corrupción y enlaces simbólicos
sin necesitar un almacén previamente instalado.

El corpus CAS completo está **omitido explícitamente en CI**, no aprobado.
El contrato de los siete lotes de deducciones sí se valida con los manifiestos
versionados: exige los 351 códigos, localizadores admitidos y referencias a
documentos declarados. Se ejecuta sin CAS; no certifica los originales ni sus
interpretaciones jurídicas. Una ampliación regional debe normalizarse antes
de incorporarla al registro común. Sus expedientes conservan la evidencia
complementaria mientras esa incorporación está pendiente.

Con el almacén externo configurado, la suite local opcional es:

```sh
bun run test --config scripts/procedencia/corpus-local-vitest.mjs
bun tests/corpus-local/nominal.test.mjs
bun scripts/procedencia/contenido-verificar.mjs
bun scripts/procedencia/rastro-verificar.mjs
bun scripts/procedencia/verificar-enlaces.mjs
```

Estos ensayos históricos pueden señalar desfase entre software actual y snapshots;
no deben actualizarse o retaggearse para aparentar evidencia actual. Las versiones
anteriores siguen conservadas en Git. Los ensayos ordinarios fijan fuentes por
SHA-256 en `scripts/procedencia/fuentes-actuales.json`: cambiar una fuente exige
revisar su contrato explícitamente, sin consultar objetos Git históricos.

`UV_PROJECT_ENVIRONMENT`, `UV_CACHE_DIR` y `TMPDIR` pueden apuntar a rutas privadas
fuera del repositorio. No se necesita `.venv` dentro del checkout.
