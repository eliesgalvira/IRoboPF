# Glosario fiscal del motor

Este glosario explica terminos fiscales y laborales que aparecen en el codigo de dominio. No sustituye a las fuentes normalizadas de `docs/fuentes/`; sirve para que una persona que lee el motor entienda por que existe cada parametro o regla.

## MEI

**Mecanismo de Equidad Intergeneracional**. Cotizacion adicional aplicable desde 2023 sobre la base de cotizacion, repartida entre empresa y trabajador. En el perfil legacy se suma a los tipos ordinarios de Seguridad Social antes de calcular la cotizacion sobre la base ordinaria topada.

Fuentes relacionadas:
- `docs/fuentes/legacy/progresividad-ts-antes-refactor.md`
- `docs/fuentes/legacy/calculo-salario-irpf-python.md`

## Base maxima de cotizacion

Tope anual usado por el perfil legacy para calcular la cotizacion ordinaria de Seguridad Social. El salario que excede ese tope no cotiza por tipos ordinarios, pero desde 2025 puede generar cuota de solidaridad.

Fuentes relacionadas:
- `lib/dominio/normativa/datos/seguridad-social-2012-2026.ts`

## Cuota de solidaridad

Cotizacion adicional sobre el salario que supera la base maxima de cotizacion. En el perfil legacy se reparte como el oraculo historico: 5/6 empresa y 1/6 trabajador.

Fuentes relacionadas:
- `docs/fuentes/legacy/progresividad-ts-antes-refactor.md`
- `docs/fuentes/legacy/calculo-salario-irpf-python.md`

## Minimo exento de retencion

Importe usado por la estimacion IRPF legacy para aplicar el limite del 43% sobre el exceso de salario bruto respecto al minimo exento. Es parte del perfil legacy y no debe confundirse con la liquidacion anual completa del IRPF.

Fuentes relacionadas:
- `lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts`
- `docs/fuentes/aeat/algoritmo-retenciones-2026.md`

## Reduccion por rendimientos del trabajo

Reduccion aplicada sobre el rendimiento previo neto en la estimacion IRPF legacy. Sus tramos cambian por periodos y 2018 se trata como transitorio en el oraculo heredado.

Fuentes relacionadas:
- `lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts`
- `docs/fuentes/legacy/progresividad-ts-antes-refactor.md`

## Deduccion SMI legacy

Deduccion aplicada en 2025 y 2026 por el perfil legacy alrededor de los umbrales de SMI usados por el modelo historico. No es una deduccion general de Renta y debe permanecer ligada al perfil `legacy-progresividad-frio` salvo decision normativa explicita.

Fuentes relacionadas:
- `docs/fuentes/legacy/progresividad-ts-antes-refactor.md`

## Half-up monetario

Redondeo usado para liquidar importes monetarios a centimos. Es la regla por defecto del motor canonico y del perfil legacy para dinero liquidado.

Fuentes relacionadas:
- `lib/dominio/dinero/redondeo.ts`

## Half-even tabular legacy

Redondeo usado solo para artefactos tabulares observables del `progresividad.ts` anterior, como porcentajes y rotulos de tramos en la exportacion compatible. No debe usarse para dinero.

Fuentes relacionadas:
- `docs/fuentes/legacy/progresividad-ts-antes-refactor.md`
