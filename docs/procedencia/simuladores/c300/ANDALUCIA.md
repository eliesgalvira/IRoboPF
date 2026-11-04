# Cuantización de gravámenes: una captura de Andalucía 2025

La extensión `extension-territorio-andalucia` de C300 tenía siete diferencias
exactas. La base 20.446,72 EUR ya coincidía; los gravámenes publicados conservaban
fracciones de céntimo y las propagaban al resultado. La corrección cuantiza cada
gravamen a céntimos half-up antes de restar su mínimo y sumar las cuotas, mediante
la misma composición anual compartida. No cambia escalas, mínimos ni expectativas
oficiales; no aplica tolerancias ni crea otro recorrido de cálculo.

| Casilla | Antes (EUR) | Captura y después (EUR) |
| --- | ---: | ---: |
| 0528 | 2149.758 | 2149.76 |
| 0529 | 2128.6064 | 2128.61 |
| 0532 | 1622.508 | 1622.51 |
| 0533 | 1578.5564 | 1578.56 |
| 0595 | 3201.0644 | 3201.07 |
| 0610 | 101.0344 | 101.04 |
| 0670 | 101.03 | 101.04 |

## Evidencia íntegra y test rojo

`tests/andalucia-open-c300.test.ts` incorpora los originales completos, con datos
ficticios: SES comprimido original y PDF original comprimido adicionalmente para
su transporte. Verifica tamaño y SHA256 de ambos; extrae las expectativas del SES
original, sin recrearlas desde el motor. La comprobación focal del PDF dentro del
test es de integridad, no un nuevo analizador PDF. La extracción íntegra externa
con `pdftotext -layout` y el verificador existente `c300_evidence.pdf_checks`
contrastaron las catorce casillas contra el SES, incluidas las ausencias.

- SES: 2.034 bytes, SHA256 `84891c615682be96042b5bcc3d53f0407ad0219e87add316946941cfa7d8e357`.
- PDF: 142.159 bytes, SHA256 `9e30e0c4f600fb98a7f64e23120fa3929c0efaf03b7fd9dc4b898fd910c722df`.
- Cabecera SES: modelo 100, ejercicio 2025, reglas `N000088955`, modelo `0.12`.

Los originales permanecen también en el CAS externo C300. La entrega privada
`/home/elies/Backups/IRoboPF/producto-c300-andalucia-correccion-20261104`
conserva `captura-verificada.json`, la extracción PDF íntegra, preimágenes y hashes,
parche y manifiesto. El recibo se cotejó con la entrada y las expectativas de
`producto-c300-20261104/variante-andalucia-comparacion.json`, sin nueva captura ni red.

Antes de modificar el núcleo, el test falló en las siete casillas anteriores:
`rojo.log` conserva ese resultado y las otras 44 pruebas verdes. Después coincide
en las doce casillas presentes; 0023 y 0414 siguen ausentes en SES y no se cuentan
como ceros ni coincidencias. Se conserva el testigo PDF según la política C300.

## Alcance y exclusiones

El selector nuevo sólo alcanza empleo laboral o estatutario efectivo de Andalucía
2025, individual, sin derechos familiares declarados, dentro del contrato anual
ya admitido. La muestra oficial adicional acredita **una entrada de empleo laboral**,
40 años, íntegro 25.000,17; cotizaciones 1.630,02; sindicato 123,45; colegio
499,99; defensa 299,99; retenciones 3.100,03 EUR. La aplicación al empleo
estatutario comparte el cálculo, pero esta captura no lo acredita empíricamente.

La nueva política afecta a gravámenes. Mantiene Decimal sin cuantización nueva
en artículo 20 y DA61: ambos están ausentes en esta captura y no discriminan sus
políticas. La compatibilidad binaria del artículo 20 conserva exactamente su
selector previo Madrid 2025 y su cota técnica; **no se extiende a Andalucía**.
Las regresiones sintéticas comprueban reducciones y DA61 fraccionarias conservadas.

Se excluyen de la política nueva pensiones, actividades económicas, derechos
familiares, otros territorios y ejercicios 2018–2024 (también cualquier ejercicio
distinto de 2025). No se amplía la admisión pública. Los controles de pensión,
familia andaluza, Murcia y Cataluña y los históricos existentes son regresiones
de alcance, no capturas oficiales. Una observación no prueba los diecisiete
territorios, todas las familias, todas las rentas ni una aceptación fiscal universal.

El selector y los importes Madrid permanecen como antes. Pasan los once casos
de `art20-oficial.json`, los siete anclajes previos y las comprobaciones de
composición y mínimos familiares: **353 pruebas en seis archivos**. El balance
previo de 300 Madrid (3.550 coincidencias, 650 ausencias y cero diferencias)
pertenece a la entrega anterior; el padre repetirá su cotejo completo tras integrar.

El primer control sintético añadió por error una expectativa art20 4284.9775;
se corrigió a 4284.9825 según `7302 − 1.75 × (16576.01 − 14852)`, sin alterar
el motor ni expectativas oficiales. Otro primer control familiar arrastró las
rentas del ejemplo original; se conciliaron con 20.446,72 EUR de esta entrada.
Ambos intentos fallidos se conservan en la entrega. No son discrepancias oficiales.

No se certifica F ni el CI completo: inventarios, journal, reproducción Nix y
publicación corresponden al padre. Esta entrega no modifica VCS, herramientas de
captura, inventarios generados ni los pins generales de la API.
