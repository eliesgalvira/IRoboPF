# Product

## Register

product

## Users

IRoboPF serves people in Spain who need to reason about salary, IRPF, social
contributions, inflation, and historical tax-rule changes without treating the
calculation as a black box. Primary users include citizens comparing their own
salary scenarios, analysts auditing fiscal effects over time, and technical
maintainers validating the fiscal engine against legacy and canonical outputs.

## Product Purpose

IRoboPF is an educational audit tool for cold progressivity, net salary, IRPF,
labor cost, and purchasing-power comparisons from 2012 to 2026. It exists to
make normally buried fiscal mechanics legible: where a result comes from, which
rule moves it, and what changes across years, communities, profiles, and
normative measures. It is not tax advice, a payroll product, or a generic fiscal
simulator.

Success means a user can understand both the numeric result and the trace behind
it: inputs, fiscal concepts, intermediate values, rounded outputs, source-backed
normative data, and the citizen-facing impact of a change.

## Brand Personality

Rigorous, didactic, and auditable. The product should feel like a public-facing
analysis desk: direct about tradeoffs, precise about terminology, and calm under
dense information. The tone is explanatory without becoming paternalistic, and
confident without hiding uncertainty.

## Anti-references

Avoid opaque salary calculators that return a number without a trace. Avoid
payroll-product language, generic tax-advice framing, and dramatic metaphors
that make the result sound more certain or emotional than the model supports.
Avoid decorative dashboard styling that competes with the fiscal explanation:
glossy SaaS cards, purple-blue gradients, fake glass, and chart ornament that
does not clarify a comparison.

## Design Principles

Make the trace visible. A result earns trust when the user can inspect the
calculation path, not just the final amount.

Use domain language consistently. Terms such as annual net salary, worker
contribution, employer contribution, final IRPF, annual liquidation, and audit
variant must stay distinct.

Prefer citizen-facing interpretation. When presenting impact, default to the
citizen perspective: positive improves the citizen position, negative worsens
it.

Keep dense workflows scannable. Forms, charts, tables, and breakdowns should
support repeated comparison, not marketing-style reading.

Separate legacy compatibility from canonical explanation. Legacy parity is a
validation mode, not the visual or conceptual model for the product.

## Accessibility & Inclusion

Target WCAG AA for public-facing screens. Do not rely on color alone in charts,
states, or fiscal impact signs. Preserve keyboard access for forms, tabs,
selectors, exports, and explanatory disclosures. Respect reduced-motion
preferences and keep local execution visible so users understand that salary
data is not being sent to an external calculation backend.
