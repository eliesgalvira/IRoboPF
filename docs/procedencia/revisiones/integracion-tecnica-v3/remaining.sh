#!/usr/bin/env bash
set -euo pipefail
cd /tmp/irobopf-review-v3/procedencia
for target in ../results/indice_omitido; do
  if bun scripts/procedencia/inventario-artefacto.mjs check "$target"; then exit 90; else echo 'OMISSION_REJECTED'; fi
done
cp lib/dominio/irpf/comunidades/comunidad-autonoma.ts /tmp/irobopf-review-v3/source-backup.ts
trap 'cp /tmp/irobopf-review-v3/source-backup.ts lib/dominio/irpf/comunidades/comunidad-autonoma.ts' EXIT
printf '\n// adversarial source change\n' >> lib/dominio/irpf/comunidades/comunidad-autonoma.ts
if bun scripts/procedencia/inventario-artefacto.mjs check; then exit 91; else echo 'SOURCE_CHANGE_REJECTED'; fi
