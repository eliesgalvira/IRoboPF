# Aplicación conjunta parcial valenciana 2025

Candidata privada de implementación, sin subdelegación. No integrada ni publicada. API propuesta `aplicarCuotaConjuntaValenciana2025`, exportada desde el barrel valenciano. Recibe `{ hechos, ordenConsumo, criterioOrden: "eleccion_experta" }`. `hechos` es el contrato de composición vigente con `cuota` obligatoria. Reevalúa los hechos; un ResultadoComposicion externo no sirve como entrada. Conserva resultados, elecciones, motivos, reservas, excesos de base y rechazos. No invoca cuota.ts, el catálogo, F ni liquidación anual.

La única ampliación de composición permite solicitudes vacías cuando existen arrastres: todos sus controles de contexto, identidad, cuota y plazo siguen ejecutándose. Sin solicitudes ni saldo no se acepta expediente vacío. Permite usar saldo DANA2024 sin inventar aportación2025. C01 sigue excluida si se presenta el pago2024 como generación corriente. No cambia evaluadores ni contratos generales.

## Contrato y consumo

Cada histórico tiene id propio y cuenta consolidada por código/origen/titular según composición. Cada generación elegida tiene id `JSON.stringify([codigo,2025,contribuyente])`. Orden exhaustivo de todos esos ids, incluso generación cero; excluye omitidas. Rechaza ids repetidos/desconocidos, colisiones histórico/corriente, titular ajeno, fechas caducadas, código sin arrastre y consignación externa del código histórico. No exige generar hechos actuales para gastar historia. Ambos regímenes DANA admiten historia2024 en la liquidación2025, nunca anterior.

Una sola cuota se consume secuencialmente. Decimal con céntimos enteros, entradas finitas/no negativas y máximo entero seguro de céntimos; salida comprueba ida/vuelta al convertir a number. No hay sumas/restas binarias monetarias. Cada movimiento distingue deducción disponible, aplicado, pendiente futuro, perdidoPorCuota sin régimen y caducadoAlCierre. `ultimoEjercicio` sólo existe para regímenes trasladables. En el último año puede gastarse saldo; el remanente caduca al cierre. Renovables/DANA vivienda: cuatro años siguientes; inversión z/DANA aportaciones: tres. Gasto/base que nunca generó deducción no entra en movimientos.

Rechazo: no_soportado, movimientos vacíos, sin totalAplicado ni cuotaRestante. No filtra aplicaciones anteriores al error ni ceros sustitutorios. Conserva composición diagnóstica, incluido su total **antes** de cuota si ya era válida; no es total aplicado. Aceptación fiscal pendiente. No muta entrada; cuota diagnóstica copiada. Las referencias no autentican identidad real ni acreditaciones.

## Orden: norma y elección

Reutiliza extracciones y fuentes existentes, sin nueva descarga ni auditoría masiva:

- Ley13/1997 art.4.Uno.o/z: cuatro/tres ejercicios de traslado. Primario conservado en g-inversion-dana/textos/ley13-2025.txt. No fija prioridad global ni FIFO en los pasajes consultados. [Texto aplicable](https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202&p=20251229&tn=1).
- DL12/2024 art.4.1/4.4: daños vivienda2024/2025 y cuatro siguientes. Art.5.3 según DF primera DL17/2024: aportación en su ejercicio y tres siguientes por insuficiencia. Extracciones dl12.txt y dl17-original.txt de g-inversion-dana. [DL12 original](https://dogv.gva.es/datos/2024/11/12/pdf/2024_11848_es.pdf), [DL17 original, página9](https://www.boe.es/ccaa/dogv/2024/10011/r00001-00009.pdf). SHA256 originales según fuentes.json: 94b43d49d1a931f48fe9c2457406a424af95d2c66032eec307912587aca9140a y 8f1967fab4afe40b42359b89d14da64f234b17f93c492a2af51370fba0956915.
- [Manual oficial AEAT2025 inversión z](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunitat-valenciana/inversion-adquisicion-acciones-participaciones-entidades.html), extracción aeat-inversion.txt: contribuyente elige orden entre históricos; históricos preceden a generación corriente. El candidato valida esta prioridad **de criterio administrativo**, sin atribuirla a una frase inexistente de la ley. Original sha256 según fuentes.json: 1bb9d5db3b7407e08e7f662adf43ca0991cf91cc1f49f145ab1ce870273dfba3.

Para el resto exige elección experta expresa y exhaustiva; no inventa prioridad entre códigos ni FIFO. No certifica que cualquier orden experto sea universalmente admisible. El profesional revisa caso y acreditaciones antes de consignar. Mantiene alcance individual ordinario y demás exclusiones de composición.

## Ejemplos calculados a mano

Compra300 admisible en k/l compatibles, renta10.000, titular único: 5%×300=15 por código. Cuota20, orden k/l: aplica15+5; pierde10 de l sin arrastre. Invertir orden invierte reparto. Total antes30; aplicado20; cuota restante0.

Renovables habitual: gasto10.000, ayudas/reembolsos0, participación1; base máxima8.800, deducción3.520. Saldo2024 de5, cuota20, orden histórico/corriente: consume5 históricos+15 corrientes, conserva3.505 corrientes hasta2029. Los1.200 de gasto excesivo jamás son saldo.

## Validación y límites

21 grupos permanentes propuestos con assert Node y adaptador Vitest portable; expectativas monetarias independientes. Cubren cuota0, insuficiencia, elección/orden, cuota exacta/excedente, 0,10+0,20, antigüedades/último año/caducidad, origen DANA, sin generación corriente, C01, duplicados/consolidación, titular/código ajeno, orden incompleto, colisiones, consignación doble, exclusión/no_soportado, omisión, reserva/censo y no mutación.

rojo.log conserva salida1 porque falta API pública en raíz. verde.log conserva21 grupos pasando en sondeo Bun privado. El arnés sólo redirige imports: composición candidata usa evaluadores de raíz; barrel de sondeo añade nueva función a exports actuales. No sustituye fórmulas ni expectativas. **No verifica el ciclo completo del barrel integrado**: corresponde al padre comprobarlo con tipos y Vitest.

No ejecutados Vitest, tipos, lint, inventario, workflow ni CI: sin turno pesado. Scripts/sondeos/formateo con timeout -k30s 25s, secuenciales. Sin instalaciones, VCS mutante, push, worktree ni escritura en raíz. rg ausente incluso con env asignado; usados find/grep. effect-solutions bin nativo falló por cargador NixOS; se ejecutó su dist/cli.js existente con Bun (list; show data-modeling basics) y se consultó Schema.is en fuente Effect local antes de añadir comprobación de primitivo.

Reproducción ligera: cargar `/home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh`; ejecutar con `timeout -k 30s 25s` tanto `python /home/elies/Backups/IRoboPF/producto-valenciana-cuota-conjunta-20261104/preparar.py` como `bun /home/elies/Backups/IRoboPF/producto-valenciana-cuota-conjunta-20261104/sondeo/runner.ts`.

candidata.patch contiene seis archivos: dos modificaciones, módulo nuevo, casos, adaptador y este documento. MANIFIESTO.json fija pre/postimágenes y hash del parche; fuentes-antes/despues e integridad comparan fuentes intactas. Las postimágenes privadas sólo incluyen archivos de la entrega, sin copia del repositorio ni dependencias.

Función pura sin ledger persistente: evita doble consumo dentro de una aplicación identificada. El expediente externo debe registrar cada movimiento una sola vez, sin reenviar cuota y saldos originales como nuevos. No promete protección frente a replay entre llamadas. La comprobación de soportes históricos sigue siendo externa.

Padre: revisar e integrar; ejecutar tipos/lint y pruebas focales/regresiones, incluida exportación real. Antes de cualquier push ejecutar mismos30 pasos de .github/workflows, versiones y entorno Nix, inventario:verificar y archivos generados. No cambia workflow ni scripts CI. Publicación, integración en procedencia-documental y CI remoto corresponden al padre.
