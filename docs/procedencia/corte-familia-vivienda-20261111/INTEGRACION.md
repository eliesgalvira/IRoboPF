# Familia, vivienda y patrimonio de 2025

Este corte conecta cinco perfiles en las dos API anuales y corrige la base
patrimonial de DT18. Mantiene los contratos y rechazos de las ramas que todavía
no disponen de hechos o de historia suficientes. No declara cerradas todas las
deducciones autonómicas de 2025 ni acredita documentos externos.

| Perfil | Resultado y límites |
|---|---|
| Bases familiares | Un empleo y una pensión pública ordinaria no exenta. Artículos 19 y 20 conjuntos, incremento activo sólo del empleo, precisión interna y transporte de los umbrales 8.000/1.800 conservados. |
| Madrid, nacimiento o adopción | Dos orígenes, 2023 y 2024, del mismo hogar representado en la anual de 2025. Cada origen conserva sus límites y nominal de 721,70 euros, repartido entre convivientes cuando procede. El exceso de una anualidad intermedia sigue pendiente de criterio. |
| Traslado de CLM | Primera aplicación en 2024 y continuidad en 2025, perfil individual salarial ordinario. La deducción fija de 500 euros se limita por cuota salarial producida internamente; una renta mixta compensada no se clasifica como sólo trabajo. Seguimiento de permanencia hasta 2027 pendiente. |
| Vivienda canaria | Préstamo original de adquisición de 2025. Capital propio parcial más intereses y gastos documentados, sin duplicar precio financiado ni depender del orden de pagos. |
| Murcia, DT18 y donativos | Selección expresa de DT18 antes de donativos ordinarios, pagos conciliados y residual separado por cada parte de cuota. Concurrencia limitada a patrimonio suficiente y ausencia de ingresos ISD. |
| Núcleo patrimonial | Capital limitado al incremento no negativo más financiación documentada. Se rechaza la asignación ambigua entre modalidades y la cronología ISD no representada, sin fabricar un cero fiscal. |

La restricción patrimonial propia de las deducciones regionales riojanas permanece
separada del cálculo parcial estatal. El indicador `cumpleCondicionPatrimonial`
expresa cobertura íntegra del capital; su valor falso no significa necesariamente
base estatal cero. El ejemplo AEAT de amortización 8.000, incremento 5.300 e
intereses 1.000 produce base 6.300 euros. Véase
[la explicación patrimonial y su fuente](../patrimonio-parcial-20261111.md).

Los antecedentes de revisión y las preimágenes se conservan fuera del checkout.
Las rectificaciones de expectativas patrimoniales antiguas se justifican con la
fuente primaria y conservan sus originales. Las correcciones de fixtures
laborales concilian cotizaciones con el bruto del perfil uniforme; no acreditan
cotizaciones efectivamente ingresadas por una persona real.

Antes de la comprobación integral pasaron 1.372 pruebas distintas en 29 archivos,
el control global de tipos estricto con Effect y ambos linters. ESLint conservó
27 avisos y ningún error. Las cifras de ejecuciones anteriores se solapan y no se
suman. La ejecución fue en la raíz; los manifiestos posteriores selectivos y la
cadena de cambios no equivalen a una auditoría completa de módulos evaluados.

La publicación exige además los 31 comandos exactos del workflow con las versiones
Node 24.20.0, Bun 1.3.13 y Python 3.13.15, el entorno Nix declarado, PATH limpio,
generados e inventario verificados. El corpus íntegro externo continúa fuera de
CI; se ejecutan sus fixtures y contratos reproducibles. La evidencia local completa
se conserva con el parche y manifiesto del corte; el estado remoto corresponde al
commit publicado en `procedencia-documental`.

Revisiones independientes: [bases familiares](../../revisiones/familia-empleo-pension-20261111.txt),
[Madrid](../../revisiones/madrid-dos-origenes-20261111.md),
[Murcia](../revision-b08-murcia-dt18-donativos-20261111.md),
[contraste CLM/Canarias](../../revisiones/contraste-clm-canarias-20261111.txt) y
[contraste patrimonial](../../revisiones/contraste-patrimonio-parcial-20261111.txt).
La [primera revisión patrimonial](../../revisiones/cierre-primera-revision-patrimonio-base-parcial-20261111.md)
cierra las objeciones sobre atribución y documentación en el perfil admitido.
Las reservas concretas de cada dictamen permanecen vigentes.

La reconstrucción salarial de CLM usa las redacciones LIRPF de 27 de junio y
24 de diciembre de 2024 verificadas en la fuente; una solicitud de fecha de corte
que devolvía el consolidado de 2026 se descartó. Se conservan sus
[localizadores y hashes](../clm-traslado-fuentes-20261111.json).

Las ejecuciones integrales de preparación detectaron 17 huellas anteriores y tres
módulos revisados aún ausentes del catálogo de fuentes. Se actualiza ese catálogo
contra las postimágenes verificadas; los fallos originales quedan conservados.
El nuevo export del calendario mixto también se declara como frontera pendiente
por módulo y export, igual que el calendario anterior. Su prueba exige rechazo
sin contrato. Estas correcciones no cambian fórmulas ni esperados monetarios y no
amplían la aceptación del intérprete documental histórico.
